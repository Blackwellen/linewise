import Link from 'next/link';
import { Header, Footer } from '@/components/Chrome';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="nf">
        <div className="wrap">
          <div className="n" aria-hidden="true">404</div>
          <h1 className="h1" style={{ marginBottom: 12 }}>This step is missing</h1>
          <p className="lead" style={{ maxWidth: 520, margin: '0 auto 26px' }}>The page you were looking for is not here. One step back, then keep going.</p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link href="/" className="btn btn-cy">Back to the home page</Link>
            <Link href="/#inside" className="btn btn-ghost">See what is inside the book</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
