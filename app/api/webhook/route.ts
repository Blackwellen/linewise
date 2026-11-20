import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { orderRef, orderToken } from '@/lib/orders';
import { emailConfigured, sendDownloadEmail } from '@/lib/email';

export const runtime = 'nodejs';

// Records orders on the PaymentIntent and sends the download email (if Resend is configured).
// Idempotent: Stripe retries are safe because we check metadata before acting.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get('stripe-signature');
  if (!secret || !sig) return NextResponse.json({ error: 'Not configured' }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret);
  } catch {
    return NextResponse.json({ error: 'Bad signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.product !== 'linewise-ebook' || session.payment_status !== 'paid') {
      return NextResponse.json({ received: true, skipped: 'not-paid-or-not-ours' });
    }
    const piId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
    if (!piId) return NextResponse.json({ received: true, skipped: 'no-payment-intent' });
    const pi = await stripe().paymentIntents.retrieve(piId);
    const ref = orderRef(session);
    const update: Record<string, string> = {};
    if (!pi.metadata?.order_recorded_at) {
      update.order_recorded_at = new Date().toISOString();
      update.order_ref = ref;
      update.checkout_session = session.id;
    }
    const email = session.customer_details?.email;
    if (email && !pi.metadata?.receipt_email_sent_at && emailConfigured()) {
      const r = await sendDownloadEmail(email, orderToken(session), ref);
      if (r.sent) update.receipt_email_sent_at = new Date().toISOString();
      else console.error('[webhook] download email failed', ref, r.reason);
    }
    if (Object.keys(update).length) await stripe().paymentIntents.update(piId, { metadata: update });
    console.log('[webhook] order recorded', ref, session.id, event.livemode ? 'live' : 'test');
  }
  if (event.type === 'charge.refunded' || event.type === 'charge.dispute.created') {
    // Access checks read the charge state live from Stripe, so nothing to store here.
    console.log('[webhook]', event.type, (event.data.object as { id: string }).id);
  }
  return NextResponse.json({ received: true });
}
