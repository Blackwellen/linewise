import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CONSENT_TEXT, CONSENT_VERSION, PRODUCT, SITE_URL, TERMS_VERSION } from '@/lib/site';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  // Same-origin form posts only.
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== req.headers.get('host')) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }
  let body: { consent?: unknown; terms?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }); }
  if (body.consent !== true || body.terms !== true) {
    return NextResponse.json({ error: 'Please tick both boxes to continue.' }, { status: 400 });
  }

  const consentAt = new Date().toISOString();
  const meta = {
    product: 'linewise-ebook',
    consent_digital_waiver: 'true',
    consent_at: consentAt,
    consent_version: CONSENT_VERSION,
    terms_version: TERMS_VERSION,
  };
  const priceId = process.env.STRIPE_PRICE_ID;
  const automaticTax = process.env.STRIPE_AUTOMATIC_TAX === 'true';

  try {
    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: 'gbp',
                unit_amount: Math.round(Number(PRODUCT.price) * 100),
                tax_behavior: 'inclusive',
                product_data: { name: PRODUCT.fullName, tax_code: 'txcd_10302000' },
              },
            },
      ],
      automatic_tax: { enabled: automaticTax },
      billing_address_collection: 'required',
      customer_creation: 'always',
      invoice_creation: { enabled: true, invoice_data: { description: PRODUCT.fullName, metadata: meta, footer: 'Digital content supplied immediately at the customer\'s request; the 14-day cancellation right ends when the download starts.' } },
      allow_promotion_codes: true,
      locale: 'en-GB',
      // Brand the Stripe-hosted page to match Linewise (near-black, cyan button).
      branding_settings: { display_name: 'Linewise', background_color: '#07090d', button_color: '#3dd6ff', border_style: 'rounded', font_family: 'inter' },
      metadata: meta,
      payment_intent_data: { metadata: meta, description: PRODUCT.fullName },
      custom_text: {
        submit: { message: `You agreed: "${CONSENT_TEXT}" Your download opens straight after payment.` },
      },
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout?cancelled=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] session create failed:', (err as Error).message);
    return NextResponse.json({ error: 'Checkout is unavailable right now. Please try again in a minute.' }, { status: 502 });
  }
}
