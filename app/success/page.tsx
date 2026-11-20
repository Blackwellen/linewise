import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '@/components/Chrome';
import { DownloadList } from '@/components/Downloads';
import { getPaidSession } from '@/lib/stripe';
import { downloadsUsed, orderExpiry, orderRef, orderToken } from '@/lib/orders';
import { emailConfigured } from '@/lib/email';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = { title: 'Thank you', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Success({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const id = typeof sp.session_id === 'string' ? sp.session_id : '';
  const paid = id ? await getPaidSession(id) : null;
  return (
    <>
      <Header />
      <main id="main" className="sec-tight">
        <div className="wrap" style={{ maxWidth: 820 }}>
          {paid ? (
            <>
              <p className="status">Payment confirmed</p>
              <h1 className="h1" style={{ margin: '14px 0 12px' }}>Your e-book is ready</h1>
              <p className="lead">Thank you{paid.session.customer_details?.name ? `, ${paid.session.customer_details.name.split(' ')[0]}` : ''}. Order <b>{orderRef(paid.session)}</b>. Download both files below.</p>
              <DownloadList token={orderToken(paid.session)} used={downloadsUsed(paid.paymentIntent!)} expiresAt={orderExpiry(paid.session)} />
              <div className="call" style={{ marginTop: 26 }}>
                <p className="h4">Keep this page</p>
                <p>{emailConfigured()
                  ? <>We have emailed a link to this download page to <b>{paid.session.customer_details?.email}</b>. Stripe also sends your receipt.</>
                  : <>Bookmark this page to download again later. Stripe emails your receipt to <b>{paid.session.customer_details?.email}</b>; reply to us with your order reference if you need a new link.</>}
                </p>
              </div>
              <h2 className="h3" style={{ marginTop: 36 }}>Where to start</h2>
              <ol className="steps">
                <li>Read “Your first 30 days” on page 4 and the one-page summary on page 5.</li>
                <li>Print storyboard sheet 1 from the Bonus Pack and pick one of the 50 concepts.</li>
                <li>Follow Chapter 5 to animate it in one app, then post using the checklist.</li>
              </ol>
            </>
          ) : (
            <>
              <p className="kicker">Order status</p>
              <h1 className="h1" style={{ marginBottom: 12 }}>We could not confirm this payment</h1>
              <p className="lead">If you have just paid, your bank may still be confirming it. Wait a minute and refresh this page.</p>
              <p>If you were charged and still see this message, email <a className="cy" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> and we will send your files.</p>
              <p><Link href="/checkout" className="btn btn-ghost">Back to checkout</Link></p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
