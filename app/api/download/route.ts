import { NextResponse } from 'next/server';
import { readToken } from '@/lib/token';
import { getPaidSession } from '@/lib/stripe';
import { downloadsUsed, recordDownload } from '@/lib/orders';
import { presignDownload, r2Configured } from '@/lib/r2';
import { DOWNLOAD_LIMITS, FILES, type FileId } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const fail = (req: Request, reason: string) =>
  NextResponse.redirect(new URL(`/download?error=${reason}`, req.url), { status: 303 });

// GET /api/download?t=<order token>&f=book|bonus
// Verifies the token, re-checks the order with Stripe, counts the download, then redirects
// to a fresh presigned R2 URL that expires after DOWNLOAD_URL_TTL_SECONDS.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const f = url.searchParams.get('f') as FileId | null;
  if (!f || !(f in FILES)) return fail(req, 'file');
  const tok = readToken(url.searchParams.get('t'));
  if (!tok) return fail(req, 'invalid');
  if (tok.expired) return fail(req, 'expired');
  const paid = await getPaidSession(tok.sessionId);
  if (!paid) return fail(req, 'unpaid');
  const pi = paid.paymentIntent!;
  if (downloadsUsed(pi) >= DOWNLOAD_LIMITS.max) return fail(req, 'limit');
  if (!r2Configured()) return fail(req, 'storage');
  const signed = await presignDownload(f);
  await recordDownload(pi, f);
  return NextResponse.redirect(signed, { status: 303, headers: { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' } });
}
