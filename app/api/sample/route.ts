import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Optional email capture for the free sample. The sample itself is always downloadable.
// With RESEND_API_KEY and RESEND_AUDIENCE_ID set, the address is added to a Resend audience
// (marketing consent was given by ticking the box). Otherwise nothing is stored.
export async function POST(req: Request) {
  let body: { email?: string; consent?: boolean; website?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot
  const email = String(body.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (body.consent !== true) return NextResponse.json({ ok: false, error: 'Please tick the box to join the list.' }, { status: 400 });
  const key = process.env.RESEND_API_KEY; const audience = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audience) return NextResponse.json({ ok: true, stored: false });
  const r = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  return NextResponse.json({ ok: true, stored: r.ok });
}
