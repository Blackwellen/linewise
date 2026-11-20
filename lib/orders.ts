import 'server-only';
import type Stripe from 'stripe';
import { stripe } from './stripe';
import { DOWNLOAD_LIMITS } from './site';
import { makeToken } from './token';

// Orders are recorded on the Stripe PaymentIntent (metadata) so the site needs no database:
// order_recorded_at, receipt_email_sent_at, downloads_used, first_download_at.

export function orderExpiry(session: Stripe.Checkout.Session) {
  return session.created + DOWNLOAD_LIMITS.days * 86400;
}

export function orderToken(session: Stripe.Checkout.Session) {
  return makeToken(session.id, orderExpiry(session));
}

export function downloadsUsed(pi: Stripe.PaymentIntent) {
  return Number(pi.metadata?.downloads_used || 0);
}

export async function recordDownload(pi: Stripe.PaymentIntent, file: string) {
  const used = downloadsUsed(pi) + 1;
  const now = new Date().toISOString();
  await stripe().paymentIntents.update(pi.id, {
    metadata: {
      downloads_used: String(used),
      last_download_at: now,
      last_download_file: file,
      ...(pi.metadata?.first_download_at ? {} : { first_download_at: now }),
    },
  });
  return used;
}

export function orderRef(session: Stripe.Checkout.Session) {
  return 'LW-' + session.id.slice(-8).toUpperCase();
}
