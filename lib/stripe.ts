import 'server-only';
import Stripe from 'stripe';

let client: Stripe | null = null;

/** Stripe client. Refuses live keys unless STRIPE_ALLOW_LIVE=true is set deliberately at go-live. */
export function stripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  if (key.startsWith('sk_live_') || key.startsWith('rk_live_')) {
    if (process.env.STRIPE_ALLOW_LIVE !== 'true') throw new Error('Live Stripe key refused: set STRIPE_ALLOW_LIVE=true only when the owner approves go-live');
  }
  client = new Stripe(key, { appInfo: { name: 'linewise-website' } });
  return client;
}

export function isTestMode() {
  return !(process.env.STRIPE_SECRET_KEY || '').includes('_live_');
}

/** Retrieve a Checkout Session and confirm it was paid for our product. */
export async function getPaidSession(sessionId: string) {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null;
  try {
    const s = await stripe().checkout.sessions.retrieve(sessionId, { expand: ['payment_intent.latest_charge'] });
    if (s.payment_status !== 'paid') return null;
    if (s.metadata?.product !== 'linewise-ebook') return null;
    const pi = typeof s.payment_intent === 'object' ? s.payment_intent : null;
    if (!pi || pi.status !== 'succeeded') return null;
    const charge = typeof pi.latest_charge === 'object' ? pi.latest_charge : null;
    // A refunded or disputed order loses download access.
    if (charge && (charge.refunded || charge.amount_refunded > 0 || charge.disputed)) return null;
    return { session: s, paymentIntent: pi };
  } catch {
    return null;
  }
}
