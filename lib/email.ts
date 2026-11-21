import 'server-only';
import { COMPANY, DOWNLOAD_LIMITS, FILES, PRODUCT, SITE_URL } from './site';

// Transactional email via Resend (https://resend.com). Needs RESEND_API_KEY and a verified
// sending domain in RESEND_FROM (for example "Linewise <books@linewise.shop>"). Without them,
// buyers still get Stripe's receipt and the success page; nothing breaks.
//
// Templates are table-based with inline styles so they render in Gmail, Apple Mail and Outlook.
// Images are PNG (not WebP) and every image has alt text, so the email reads fine with images off.

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const C = { ink: '#0b1220', body: '#334155', mute: '#64748b', line: '#e2e8f0', bg: '#f1f5f9', card: '#ffffff', dark: '#07090d', cyan: '#3dd6ff', cyanInk: '#03141c' };
const FONT = "font-family:'Segoe UI',Helvetica,Arial,sans-serif;";
const IMG = `${SITE_URL}/email`;

/** Shared branded shell: dark header with the logo, white card, legal footer. */
function shell({ preheader, title, body, internal = false }: { preheader: string; title: string; body: string; internal?: boolean }) {
  const footer = internal
    ? `Internal alert from the Linewise shop (${SITE_URL.replace(/^https?:\/\//, '')}). Sent only to the owner addresses in SALE_ALERT_EMAILS.<br>${COMPANY.name} · company no. ${COMPANY.number}`
    : `Questions or a problem with your files? Reply to this email or write to <a href="mailto:${COMPANY.email}" style="color:${C.mute}">${COMPANY.email}</a>.<br>
    Linewise is a brand of ${COMPANY.name}, registered in ${COMPANY.jurisdiction} (company no. ${COMPANY.number}).<br>
    Registered office: ${COMPANY.office}. VAT ${COMPANY.vat}.<br>
    <a href="${SITE_URL}/terms" style="color:${C.mute}">Terms of Sale</a> · <a href="${SITE_URL}/refunds" style="color:${C.mute}">Refunds</a> · <a href="${SITE_URL}/privacy" style="color:${C.mute}">Privacy</a>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};${FONT}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
  <tr><td style="background:${C.dark};border-radius:14px 14px 0 0;padding:26px 32px">
    <a href="${SITE_URL}" style="text-decoration:none"><img src="${IMG}/linewise-lockup.png" width="161" height="42" alt="LINEWISE" style="display:block;border:0;width:161px;height:42px;color:#ffffff;font:800 22px Arial,sans-serif;letter-spacing:2px"></a>
  </td></tr>
  <tr><td style="background:${C.card};padding:36px 32px 30px;border-radius:0 0 14px 14px">${body}</td></tr>
  <tr><td style="padding:22px 20px 0;${FONT}font-size:12px;line-height:1.6;color:${C.mute};text-align:center">
    ${footer}
  </td></tr>
</table></td></tr></table></body></html>`;
}

const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:10px;background:${C.cyan}"><a href="${esc(href)}" style="display:inline-block;padding:15px 26px;${FONT}font-size:16px;font-weight:700;color:${C.cyanInk};text-decoration:none;border-radius:10px;white-space:nowrap">${esc(label)}</a></td></tr></table>`;

const h1 = (t: string) => `<h1 style="margin:0 0 12px;${FONT}font-size:26px;line-height:1.25;font-weight:800;color:${C.ink}">${esc(t)}</h1>`;
const p = (html: string, extra = '') => `<p style="margin:0 0 16px;${FONT}font-size:15px;line-height:1.6;color:${C.body};${extra}">${html}</p>`;
const label = (t: string) => `<p style="margin:0 0 8px;${FONT}font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${C.mute}">${esc(t)}</p>`;

function rows(lines: [string, string][], boldLast = false) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${lines
    .map(([k, v], i) => {
      const strong = boldLast && i === lines.length - 1;
      return `<tr><td style="padding:9px 0;border-top:1px solid ${C.line};${FONT}font-size:14px;color:${strong ? C.ink : C.body};${strong ? 'font-weight:700;' : ''}">${esc(k)}</td><td align="right" style="padding:9px 0;border-top:1px solid ${C.line};${FONT}font-size:14px;color:${C.ink};font-weight:${strong ? 800 : 600}">${esc(v)}</td></tr>`;
    })
    .join('')}</table>`;
}

export type DownloadEmailDetails = { name?: string | null; amount?: string; tax?: string; date?: string };

export async function sendDownloadEmail(to: string, token: string, ref: string, d: DownloadEmailDetails = {}) {
  if (!emailConfigured()) return { sent: false, reason: 'not-configured' as const };
  const link = `${SITE_URL}/download?t=${encodeURIComponent(token)}`;
  const first = (d.name || '').trim().split(/\s+/)[0];
  const hello = first ? `Thanks, ${esc(first)}.` : 'Thank you for your order.';
  const summary: [string, string][] = [
    ['Order', ref],
    ...(d.date ? ([['Date', d.date]] as [string, string][]) : []),
    [PRODUCT.fullName, d.amount || PRODUCT.priceLabel],
    ...(d.tax ? ([['VAT included', d.tax]] as [string, string][]) : []),
    ['Total paid', d.amount || PRODUCT.priceLabel],
  ];
  const body = `
${label(`Order ${ref}`)}
${h1('Your e-book is ready')}
${p(`${hello} Your copy of <b style="color:${C.ink}">${esc(PRODUCT.fullName)}</b> (${esc(PRODUCT.edition)}) and the Bonus Pack are waiting on your personal download page.`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 26px"><tr>
  <td width="120" valign="top" style="padding-right:20px"><img src="${IMG}/book-cover.png" width="120" height="168" alt="${esc(PRODUCT.fullName)} cover" style="display:block;border:0;width:120px;height:168px;border-radius:4px"></td>
  <td valign="middle">
    ${label("What's included")}
    <p style="margin:0 0 6px;${FONT}font-size:15px;line-height:1.5;color:${C.ink};font-weight:600">${esc(FILES.book.label)}</p>
    <p style="margin:0 0 18px;${FONT}font-size:15px;line-height:1.5;color:${C.ink};font-weight:600">${esc(FILES.bonus.label)}</p>
    ${button(link, 'Download my files')}
  </td>
</tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};border-radius:10px;margin:0 0 26px"><tr><td style="padding:16px 18px;${FONT}font-size:13px;line-height:1.6;color:${C.body}">
  <b style="color:${C.ink}">Keep this email.</b> Your download link works for ${DOWNLOAD_LIMITS.days} days and up to ${DOWNLOAD_LIMITS.max} downloads, so you can come back to it on any device. Please don't share it. As agreed at checkout, your 14-day right to cancel ends once a download starts.
</td></tr></table>
${label('Order summary')}
${rows(summary, true)}
<div style="height:26px;line-height:26px">&nbsp;</div>
${label('Where to start')}
${p(`1. Read <b style="color:${C.ink}">"Your first 30 days"</b> on page 4 and the one-page summary on page 5.<br>2. Print storyboard sheet 1 from the Bonus Pack and pick a concept.<br>3. Make your first short this week. One step. Every day.`, 'margin-bottom:6px')}
${p(`Button not working? Copy this link into your browser:<br><a href="${esc(link)}" style="color:#0284c7;word-break:break-all;font-size:13px">${esc(link)}</a>`, `font-size:13px;color:${C.mute};margin:18px 0 0`)}`;
  const text = [
    `Your e-book is ready (order ${ref})`,
    '',
    `${first ? `Thanks, ${first}. ` : ''}Your copy of ${PRODUCT.fullName} (${PRODUCT.edition}) and the Bonus Pack are ready.`,
    '',
    `Download your files: ${link}`,
    `The link works for ${DOWNLOAD_LIMITS.days} days and up to ${DOWNLOAD_LIMITS.max} downloads. Please don't share it.`,
    '',
    ...summary.map(([k, v]) => `${k}: ${v}`),
    '',
    `Questions? Reply to this email or write to ${COMPANY.email}.`,
    `${COMPANY.name}, ${COMPANY.office}. Company no. ${COMPANY.number}. VAT ${COMPANY.vat}.`,
  ].join('\n');
  return send({
    to: [to],
    reply_to: COMPANY.email,
    subject: `Your Linewise e-book is ready (order ${ref})`,
    html: shell({ preheader: `Download ${PRODUCT.name} and the Bonus Pack. Your link works for ${DOWNLOAD_LIMITS.days} days.`, title: 'Your e-book is ready', body }),
    text,
  });
}

// Owner alerts (new sale, refund, dispute). Recipients come from SALE_ALERT_EMAILS
// (comma-separated). Without it, no alert is sent and nothing else changes.
function alertRecipients() {
  return (process.env.SALE_ALERT_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean);
}

export function alertsConfigured() {
  return emailConfigured() && alertRecipients().length > 0;
}

export async function sendOwnerAlert(subject: string, lines: [string, string][], opts: { heading?: string; tone?: 'sale' | 'warn' } = {}) {
  if (!alertsConfigured()) return { sent: false, reason: 'not-configured' as const };
  const tone = opts.tone === 'warn' ? { bg: '#fef2f2', fg: '#b91c1c', tag: 'Attention' } : { bg: '#ecfdf5', fg: '#047857', tag: 'New sale' };
  const body = `
<p style="margin:0 0 14px"><span style="display:inline-block;padding:5px 10px;border-radius:999px;background:${tone.bg};color:${tone.fg};${FONT}font-size:12px;font-weight:700;letter-spacing:.4px">${esc(tone.tag)}</span></p>
${h1(opts.heading || subject)}
<div style="height:8px;line-height:8px">&nbsp;</div>
${rows(lines)}
<div style="height:24px;line-height:24px">&nbsp;</div>
${button('https://dashboard.stripe.com/payments', 'Open Stripe dashboard')}`;
  return send({
    to: alertRecipients(),
    subject,
    html: shell({ preheader: lines.map(([k, v]) => `${k}: ${v}`).join(' · ').slice(0, 140), title: subject, body, internal: true }),
    text: [opts.heading || subject, '', ...lines.map(([k, v]) => `${k}: ${v}`), '', 'Stripe: https://dashboard.stripe.com/payments'].join('\n'),
  });
}

async function send(payload: { to: string[]; subject: string; html: string; text: string; reply_to?: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.RESEND_FROM, ...payload }),
  });
  return { sent: res.ok, reason: res.ok ? undefined : (`resend-${res.status}` as const) };
}
