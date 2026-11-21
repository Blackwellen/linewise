import type { Metadata } from 'next';
import { Header, Footer, Icon } from '@/components/Chrome';
import { CheckoutForm } from '@/components/Client';
import { COMPANY, PRODUCT } from '@/lib/site';
import { isTestMode } from '@/lib/stripe';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Buy How to Make Viral Stickman Shorts (PDF e-book and bonus pack) for £19.99. Secure payment by Stripe, instant download.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: true },
};

export default async function Checkout({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const test = isTestMode();
  return (
    <>
      <Header cta={false} />
      <main id="main" className="sec-tight">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 32 }}>
            <p className="kicker">Checkout{test ? ' · Test mode' : ''}</p>
            <h1 className="h1">Get your copy</h1>
          </div>
          {test && (
            <div className="call warn" style={{ marginBottom: 28 }}>
              <p className="h4">Stripe test mode</p>
              <p>This checkout uses Stripe test keys. No real payment is taken. Use card 4242 4242 4242 4242, any future expiry date and any CVC.</p>
            </div>
          )}
          <div className="co">
            <section className="panel" aria-labelledby="co-steps">
              <h2 id="co-steps" className="h3" style={{ marginBottom: 18 }}>Before you pay</h2>
              <ol className="steps">
                <li><b>Tick the two boxes below.</b> One accepts our terms; the other is the consent the law requires for instant digital downloads.</li>
                <li><b>Pay securely on Stripe.</b> Card, Apple Pay or Google Pay where available. Your billing address sets the right VAT.</li>
                <li><b>Download straight away.</b> You return here to your personal download page. Stripe also emails you a receipt.</li>
              </ol>
              <CheckoutForm price={PRODUCT.priceLabel} cancelled={sp.cancelled === '1'} />
              <p className="secure">{Icon.lock} Payments are processed by Stripe. We never see or store your card details.</p>
            </section>
            <aside className="panel summary" aria-labelledby="co-sum">
              <h2 id="co-sum" className="h4">Order summary</h2>
              <div className="line-item">
                <img src="/img/cover-480.webp" alt="" width={76} height={106} />
                <div>
                  <b>{PRODUCT.name}</b>
                  <p className="small mute" style={{ margin: 0 }}>Linewise e-book (PDF, 90 pages) + Bonus Pack (PDF, 13 pages)</p>
                </div>
              </div>
              <div className="totals"><span>E-book + Bonus Pack</span><span>{PRODUCT.priceLabel}</span></div>
              <div className="totals"><span>VAT</span><span>Included, shown on receipt</span></div>
              <div className="totals grand"><span>Total</span><span>{PRODUCT.priceLabel}</span></div>
              <ul className="b small" style={{ marginTop: 18 }}>
                <li>Instant download after payment</li>
                <li>Download page for 30 days, up to 15 downloads</li>
                <li>Personal licence: please do not share the files</li>
              </ul>
              <p className="tiny mute" style={{ marginTop: 14 }}>Sold by {COMPANY.name}, {COMPANY.office}. VAT {COMPANY.vat}. Prices in pounds sterling.</p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
