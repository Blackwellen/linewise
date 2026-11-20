import { Header, Footer } from './Chrome';
import { LEGAL_UPDATED } from '@/lib/site';

export function LegalPage({ kicker, title, intro, toc, children }: { kicker: string; title: string; intro: React.ReactNode; toc: [string, string][]; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-hero">
          <div className="wrap">
            <p className="kicker">{kicker}</p>
            <h1 className="h1">{title}</h1>
            <p className="mute small">Last updated {LEGAL_UPDATED}</p>
          </div>
        </section>
        <div className="wrap">
          <article className="prose">
            <div className="lead" style={{ marginBottom: 20 }}>{intro}</div>
            <nav className="toc" aria-label="On this page"><h2 className="h4" style={{ margin: '0 0 8px' }}>On this page</h2><ol>{toc.map(([id, t]) => <li key={id}><a href={`#${id}`}>{t}</a></li>)}</ol></nav>
            {children}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
