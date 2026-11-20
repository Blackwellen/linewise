import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { DownloadList, ERRORS } from '@/components/Downloads';
import { readToken } from '@/lib/token';
import { getPaidSession } from '@/lib/stripe';
import { downloadsUsed, orderRef } from '@/lib/orders';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = { title: 'Your downloads', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Download({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const t = typeof sp.t === 'string' ? sp.t : '';
  let error = typeof sp.error === 'string' && ERRORS[sp.error] ? sp.error : '';
  const tok = !error ? readToken(t) : null;
  if (!error && !tok) error = 'invalid';
  if (!error && tok?.expired) error = 'expired';
  const paid = !error && tok ? await getPaidSession(tok.sessionId) : null;
  if (!error && !paid) error = 'unpaid';
  return (
    <>
      <Header />
      <main id="main" className="sec-tight">
        <div className="wrap" style={{ maxWidth: 820 }}>
          {paid && tok ? (
            <>
              <p className="kicker">Order {orderRef(paid.session)}</p>
              <h1 className="h1" style={{ marginBottom: 12 }}>Your downloads</h1>
              <p className="lead">The Linewise e-book and Bonus Pack. Please keep this link to yourself.</p>
              <DownloadList token={t} used={downloadsUsed(paid.paymentIntent!)} expiresAt={tok.expiresAt} />
            </>
          ) : (
            <>
              <p className="kicker">Downloads</p>
              <h1 className="h1" style={{ marginBottom: 12 }}>{ERRORS[error].t}</h1>
              <p className="lead">{ERRORS[error].d}</p>
              <p>Contact <a className="cy" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> with your order reference (it starts with LW-).</p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
