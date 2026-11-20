// Creates (idempotently) the Linewise product and £19.99 tax-inclusive price in Stripe TEST mode,
// and switches on Stripe Tax if the test account allows it. Writes STRIPE_PRICE_ID and
// STRIPE_AUTOMATIC_TAX to .env.local. Never prints secret values.
import Stripe from 'stripe';
import { readFileSync, writeFileSync } from 'node:fs';
import { loadEnv, requireTestKey } from './env.mjs';

loadEnv();
const stripe = new Stripe(requireTestKey());
const LOOKUP = 'linewise_ebook_gbp_1999';

const found = await stripe.prices.list({ lookup_keys: [LOOKUP], expand: ['data.product'] });
let price = found.data[0];
if (!price) {
  const product = await stripe.products.create({
    name: 'Linewise: How to Make Viral Stickman Shorts',
    description: 'E-book (PDF, 82 pages, 9 chapters) plus the Bonus Pack (PDF, 12 pages). Instant download.',
    tax_code: 'txcd_10302000', // Digital books, downloaded, permanent rights
    metadata: { product: 'linewise-ebook' },
    url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  });
  price = await stripe.prices.create({ product: product.id, currency: 'gbp', unit_amount: 1999, tax_behavior: 'inclusive', lookup_key: LOOKUP, metadata: { product: 'linewise-ebook' } });
  console.log('created product', product.id, 'price', price.id);
} else console.log('price exists', price.id);

let automaticTax = false;
try {
  let settings = await stripe.tax.settings.retrieve();
  console.log('tax settings status:', settings.status, settings.status_details?.pending?.missing_fields || '');
  if (settings.status !== 'active') {
    settings = await stripe.tax.settings.update({
      defaults: { tax_behavior: 'inclusive', tax_code: 'txcd_10302000' },
      head_office: { address: { line1: '61 Bridge Street', city: 'Kington', postal_code: 'HR5 3DJ', country: 'GB' } },
    });
    console.log('tax settings now:', settings.status);
  }
  const regs = await stripe.tax.registrations.list({ status: 'active' });
  if (!regs.data.some((r) => r.country === 'GB')) {
    await stripe.tax.registrations.create({ country: 'GB', country_options: { gb: { type: 'standard' } }, active_from: 'now' });
    console.log('added GB tax registration (test mode)');
  } else console.log('GB registration present');
  automaticTax = (await stripe.tax.settings.retrieve()).status === 'active';
} catch (e) {
  console.log('Stripe Tax not enabled in this account:', e.message);
}

let env = readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((l) => l && !/^(STRIPE_PRICE_ID|STRIPE_AUTOMATIC_TAX)=/.test(l));
env.push(`STRIPE_PRICE_ID=${price.id}`, `STRIPE_AUTOMATIC_TAX=${automaticTax}`);
writeFileSync('.env.local', env.join('\n') + '\n');
console.log('wrote STRIPE_PRICE_ID and STRIPE_AUTOMATIC_TAX=' + automaticTax + ' to .env.local');
