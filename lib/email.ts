import 'server-only';
import { COMPANY, DOWNLOAD_LIMITS, PRODUCT, SITE_URL } from './site';

// Optional receipt email via Resend (https://resend.com). Needs RESEND_API_KEY and a verified
// sending domain in RESEND_FROM (for example "Linewise <books@your-domain>"). Without them,
// buyers still get Stripe's receipt and the success page; nothing breaks.

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function sendDownloadEmail(to: string, token: string, ref: string) {
  if (!emailConfigured()) return { sent: false, reason: 'not-configured' as const };
  const link = `${SITE_URL}/download?t=${encodeURIComponent(token)}`;
  const html = `<!doctype html><html><body style="margin:0;background:#07090d;font-family:Barlow,Arial,sans-serif;color:#e8edf4">
<div style="max-width:560px;margin:0 auto;padding:40px 28px">
<p style="font:800 12px/1 Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#3dd6ff;margin:0 0 18px">Linewise · Order ${esc(ref)}</p>
<h1 style="font:800 30px/1.1 Arial,sans-serif;margin:0 0 16px;color:#fff">Your e-book is ready</h1>
<p style="font-size:16px;line-height:1.55;color:#c9d3df;margin:0 0 24px">Thank you for buying <b style="color:#fff">${esc(PRODUCT.name)}</b>. Your download page has the e-book and the bonus pack.</p>
<p style="margin:0 0 28px"><a href="${esc(link)}" style="display:inline-block;background:#3dd6ff;color:#03141c;font:800 16px/1 Arial,sans-serif;padding:16px 26px;border-radius:10px;text-decoration:none">Open my downloads</a></p>
<p style="font-size:14px;line-height:1.55;color:#9aa7b8;margin:0 0 10px">The link works for ${DOWNLOAD_LIMITS.days} days and up to ${DOWNLOAD_LIMITS.max} downloads. Please do not share it. As agreed at checkout, your 14-day right to cancel ends once a download starts. If a file is faulty, reply to ${esc(COMPANY.email)} and we will put it right.</p>
<p style="font-size:12px;line-height:1.5;color:#7d8a9c;margin:28px 0 0;border-top:1px solid #222b37;padding-top:16px">Linewise is a brand of ${COMPANY.name}, company number ${COMPANY.number} (${COMPANY.jurisdiction}). Registered office: ${COMPANY.office}. VAT ${COMPANY.vat}.</p>
</div></body></html>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM,
      to: [to],
      reply_to: COMPANY.email,
      subject: `Your Linewise e-book download (order ${ref})`,
      html,
      text: `Your e-book is ready. Open your downloads: ${link}\nThe link works for ${DOWNLOAD_LIMITS.days} days and up to ${DOWNLOAD_LIMITS.max} downloads.\n${COMPANY.name}, ${COMPANY.office}. VAT ${COMPANY.vat}.`,
    }),
  });
  return { sent: res.ok, reason: res.ok ? undefined : (`resend-${res.status}` as const) };
}
