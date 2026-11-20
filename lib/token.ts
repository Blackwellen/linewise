import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

// Order download token: base64url("<sessionId>.<expiryUnixSeconds>.<hmac>").
// It proves which order a link belongs to; every use is re-checked against Stripe.

function secret() {
  const s = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!s || s.length < 32) throw new Error('DOWNLOAD_TOKEN_SECRET must be set (32+ random characters)');
  return s;
}

const sign = (body: string) => createHmac('sha256', secret()).update(body).digest('base64url');

export function makeToken(sessionId: string, expiresAt: number) {
  const body = `${sessionId}.${expiresAt}`;
  return Buffer.from(`${body}.${sign(body)}`).toString('base64url');
}

export function readToken(token: string | undefined | null): { sessionId: string; expiresAt: number; expired: boolean } | null {
  if (!token || token.length > 400) return null;
  let raw: string;
  try { raw = Buffer.from(token, 'base64url').toString('utf8'); } catch { return null; }
  const parts = raw.split('.');
  if (parts.length !== 3) return null;
  const [sessionId, exp, sig] = parts;
  const expected = sign(`${sessionId}.${exp}`);
  const a = Buffer.from(sig); const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const expiresAt = Number(exp);
  if (!Number.isFinite(expiresAt)) return null;
  return { sessionId, expiresAt, expired: Date.now() / 1000 > expiresAt };
}
