// End-to-end test in Stripe TEST mode: checkout -> Stripe hosted page (test card) -> webhook -> success page -> download.
// Usage: node scripts/e2e-checkout.mjs [baseUrl]. Needs the site running with test keys and `stripe listen` forwarding.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import Stripe from 'stripe';
import { createHmac } from 'node:crypto';
import { loadEnv, requireTestKey } from './env.mjs';

loadEnv();
const stripe = new Stripe(requireTestKey());
const base = process.argv[2] || 'http://localhost:3000';
const log = []; const ok = (name, pass, extra = '') => { log.push({ name, pass, extra }); console.log(pass ? 'PASS' : 'FAIL', name, extra); };
mkdirSync('screenshots/e2e', { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

await page.goto(`${base}/checkout`);
await page.getByRole('checkbox', { name: /Terms of Sale/ }).check();
await page.getByRole('checkbox', { name: /immediate access/ }).check();
await page.screenshot({ path: 'screenshots/e2e/01-checkout-consent.jpg', type: 'jpeg', quality: 80 });
await page.getByRole('button', { name: /Continue to secure payment/ }).click();
await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 });
await page.waitForTimeout(4000);

async function fill(sel, value) {
  for (const f of page.frames()) {
    const el = await f.$(sel);
    if (el && (await el.isVisible())) { await el.fill(value); return true; }
  }
  return false;
}
async function select(sel, value) {
  for (const f of page.frames()) { const el = await f.$(sel); if (el && (await el.isVisible())) { await el.selectOption(value); return true; } }
  return false;
}
async function click(sel) {
  for (const f of page.frames()) { const el = await f.$(sel); if (el && (await el.isVisible())) { await el.click(); return true; } }
  return false;
}
await fill('#linkAuthentication-emailInput, #email', 'e2e-buyer@example.com');
for (const f of page.frames()) { const l = f.getByText('Card', { exact: true }); if (await l.count().catch(() => 0)) { await l.first().click(); break; } }
await page.waitForTimeout(1200);
await fill('#payment-numberInput, #cardNumber', '4242424242424242');
await fill('#payment-expiryInput, #cardExpiry', '12 / 34');
await fill('#payment-cvcInput, #cardCvc', '123');
for (const f of page.frames()) { const el = await f.$('#payment-linkOptInInput'); if (el && (await el.isChecked().catch(() => false))) await el.uncheck().catch(() => {}); }
await fill('#billingAddress-nameInput, #billingName', 'Test Buyer');
await select('#billingAddress-countryInput, #billingCountry', 'GB');
await page.waitForTimeout(600);
await fill('#billingAddress-addressLine1Input, #billingAddressLine1', '1 Test Street');
await fill('#billingAddress-localityInput, #billingLocality', 'London');
await fill('#billingAddress-postalCodeInput, #billingPostalCode', 'SW1A 1AA');
await page.keyboard.press('Tab');
await page.waitForTimeout(1500);
await page.screenshot({ path: 'screenshots/e2e/02-stripe-hosted-checkout.jpg', type: 'jpeg', quality: 80 });
await click('[data-testid="payment-form-submit-button"], [data-testid="hosted-payment-submit-button"], button.SubmitButton');
await page.waitForURL(/\/success\?session_id=/, { timeout: 60000 });
await page.waitForSelector('text=Your e-book is ready', { timeout: 30000 });
await page.screenshot({ path: 'screenshots/e2e/03-success-download.jpg', type: 'jpeg', quality: 80, fullPage: true });
const sessionId = new URL(page.url()).searchParams.get('session_id');
ok('payment succeeded and success page verified the paid session', true, sessionId);

const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent', 'total_details.breakdown'] });
ok('consent recorded on the session', session.metadata.consent_digital_waiver === 'true' && !!session.metadata.consent_at, session.metadata.consent_version);
ok('Stripe Tax applied (tax-inclusive)', session.automatic_tax?.enabled === true, `amount_total=${session.amount_total} tax=${session.total_details?.amount_tax}`);
// webhook (stripe listen) records the order on the PaymentIntent
let pi; for (let i = 0; i < 20; i++) { pi = await stripe.paymentIntents.retrieve(session.payment_intent.id); if (pi.metadata.order_recorded_at) break; await new Promise((r) => setTimeout(r, 1000)); }
ok('webhook recorded the order', !!pi.metadata.order_recorded_at, pi.metadata.order_ref || '');

const hrefs = await page.$$eval('a.file', (as) => as.map((a) => a.href));
ok('success page shows two download buttons', hrefs.length === 2);
const res = await ctx.request.get(hrefs[0], { maxRedirects: 0 });
const loc = res.headers()['location'] || '';
const presigned = /r2\.cloudflarestorage\.com/.test(loc) && /X-Amz-Signature/.test(loc);
ok('download endpoint redirects to a presigned R2 URL', presigned, presigned ? `expires=${new URL(loc).searchParams.get('X-Amz-Expires')}s` : `got ${res.status()} ${loc}`);
if (presigned) {
  const pdf = await fetch(loc);
  const buf = Buffer.from(await pdf.arrayBuffer());
  ok('presigned URL downloads the PDF', pdf.ok && buf.subarray(0, 4).toString() === '%PDF', `${buf.length} bytes`);
  const u = new URL(loc); const unsigned = `${u.origin}${u.pathname}`;
  const r2 = await fetch(unsigned);
  ok('direct object URL without a signature is denied', r2.status === 400 || r2.status === 401 || r2.status === 403, `HTTP ${r2.status}`);
  const tampered = new URL(loc); tampered.searchParams.set('X-Amz-Expires', '999999');
  const r3 = await fetch(tampered);
  ok('tampered presigned URL is denied', r3.status === 403 || r3.status === 400, `HTTP ${r3.status}`);
  const pi2 = await stripe.paymentIntents.retrieve(pi.id);
  ok('download counted on the order', Number(pi2.metadata.downloads_used) >= 1, `downloads_used=${pi2.metadata.downloads_used}`);
}
const bad = await ctx.request.get(hrefs[0].replace(/t=[^&]+/, 't=' + 'x'.repeat(40)), { maxRedirects: 0 });
ok('forged token is rejected', /error=invalid/.test(bad.headers()['location'] || ''), bad.headers()['location']);
// An expired order link (same signing scheme as lib/token.ts, expiry in the past) is refused.
const body = `${sessionId}.${Math.floor(Date.now() / 1000) - 60}`;
const expired = Buffer.from(`${body}.${createHmac('sha256', process.env.DOWNLOAD_TOKEN_SECRET).update(body).digest('base64url')}`).toString('base64url');
const ex = await ctx.request.get(`${base}/api/download?t=${expired}&f=book`, { maxRedirects: 0 });
ok('expired order link is refused', /error=expired/.test(ex.headers()['location'] || ''), ex.headers()['location']);
await page.goto(`${base}/download?t=${expired}`);
ok('download page explains the expiry', await page.isVisible('text=This download link has expired'));
await page.goto(`${base}/success?session_id=cs_test_doesnotexist`);
ok('unknown session shows "could not confirm"', await page.isVisible('text=We could not confirm this payment'));
writeFileSync('screenshots/e2e/results.json', JSON.stringify({ at: new Date().toISOString(), sessionId, results: log }, null, 2));
await browser.close();
