// Desktop + phone screenshots of every page, plus one overview image.
// Usage: node scripts/screenshots.mjs [baseUrl]   (uses the system Chrome)
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:3000';
const out = 'screenshots';
mkdirSync(out, { recursive: true });
const pages = [
  ['home', '/'], ['checkout', '/checkout'], ['advertise', '/advertise'], ['terms', '/terms'], ['refunds', '/refunds'],
  ['privacy', '/privacy'], ['cookies', '/cookies'], ['download-invalid', '/download?t=bad'], ['success-unconfirmed', '/success'], ['404', '/does-not-exist'],
  ...(process.env.SHOT_EXTRA ? JSON.parse(process.env.SHOT_EXTRA) : []),
];
const devices = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
};
const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const [dev, opts] of Object.entries(devices)) {
  const ctx = await browser.newContext({ ...opts, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const [name, path] of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
      await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/${name}-${dev}.jpg`, fullPage: true, type: 'jpeg', quality: 82 });
    await page.screenshot({ path: `${out}/_fold/${name}-${dev}-fold.jpg`, type: 'jpeg', quality: 82 }).catch(async () => { mkdirSync(`${out}/_fold`, { recursive: true }); await page.screenshot({ path: `${out}/_fold/${name}-${dev}-fold.jpg`, type: 'jpeg', quality: 82 }); });
    console.log('shot', name, dev);
  }
  await ctx.close();
}
await browser.close();
