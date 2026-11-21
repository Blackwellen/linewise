import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { orderRef, orderToken } from '@/lib/orders';
import { alertsConfigured, emailConfigured, sendDownloadEmail, sendOwnerAlert } from '@/lib/email';

const money = (amount: number | null | undefined, currency: string | null | undefined) =>
  `${((amount ?? 0) / 100).toFixed(2)} ${(currency ?? '').toUpperCase()}`;

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
      const r = await sendDownloadEmail(email, orderToken(session), ref, {
        name: session.customer_details?.name,
        amount: `£${((session.amount_total ?? 0) / 100).toFixed(2)}`,
        tax: `£${((session.total_details?.amount_tax ?? 0) / 100).toFixed(2)}`,
        date: new Date((event.created ?? Date.now() / 1000) * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' }),
      });
      if (r.sent) update.receipt_email_sent_at = new Date().toISOString();
      else console.error('[webhook] download email failed', ref, r.reason);
    }
    if (!pi.metadata?.sale_alert_sent_at && alertsConfigured()) {
      const a = await sendOwnerAlert(`${event.livemode ? '' : '[TEST] '}New Linewise sale: ${money(session.amount_total, session.currency)} (${ref})`, [
        ['Product', 'Linewise e-book + Bonus Pack'],
        ['Order', ref],
        ['Amount', money(session.amount_total, session.currency)],
        ['Tax', money(session.total_details?.amount_tax, session.currency)],
        ['Buyer', email ?? 'unknown'],
        ['Country', session.customer_details?.address?.country ?? 'unknown'],
        ['Mode', event.livemode ? 'LIVE' : 'test'],
        ['Time', new Date((event.created ?? Date.now() / 1000) * 1000).toLocaleString('en-GB', { timeZone: 'Europe/London' }) + ' UK'],
      ], { heading: `You made a sale: ${money(session.amount_total, session.currency)}`, tone: 'sale' });
      if (a.sent) update.sale_alert_sent_at = new Date().toISOString();
      else console.error('[webhook] sale alert failed', ref, a.reason);
    }
    if (Object.keys(update).length) await stripe().paymentIntents.update(piId, { metadata: update });
    console.log('[webhook] order recorded', ref, session.id, event.livemode ? 'live' : 'test');
  }
  if (event.type === 'charge.refunded' || event.type === 'charge.dispute.created') {
    // Access checks read the charge state live from Stripe, so nothing to store here.
    const obj = event.data.object as { id: string; amount?: number; amount_refunded?: number; currency?: string; reason?: string | null };
    console.log('[webhook]', event.type, obj.id);
    if (alertsConfigured()) {
      const isDispute = event.type === 'charge.dispute.created';
      await sendOwnerAlert(`${event.livemode ? '' : '[TEST] '}Linewise ${isDispute ? 'DISPUTE opened' : 'refund'}: ${money(isDispute ? obj.amount : obj.amount_refunded, obj.currency)}`, [
        ['Type', isDispute ? 'Dispute (respond in Stripe before the deadline)' : 'Refund'],
        ['Amount', money(isDispute ? obj.amount : obj.amount_refunded, obj.currency)],
        ...(isDispute && obj.reason ? ([['Reason', obj.reason]] as [string, string][]) : []),
        ['Stripe ID', obj.id],
        ['Mode', event.livemode ? 'LIVE' : 'test'],
      ], { heading: isDispute ? 'A customer opened a dispute' : 'A refund was issued', tone: 'warn' }).catch(() => undefined);
    }
  }
  return NextResponse.json({ received: true });
}
