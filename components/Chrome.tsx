import Link from 'next/link';
import { COMPANY, PRODUCT } from '@/lib/site';

export function Header({ current, cta = true }: { current?: string; cta?: boolean }) {
  const nav = [
    { href: '/#inside', label: 'Inside the book', id: 'inside', cls: 'hide-m' },
    { href: '/#sample', label: 'Free sample', id: 'sample', cls: 'hide-m' },
    { href: '/#faq', label: 'FAQ', id: 'faq', cls: 'hide-m' },
    { href: '/advertise', label: 'Advertise', id: 'advertise', cls: '' },
  ];
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="hdr">
        <div className="wrap">
          <Link href="/" className="brand" aria-label="Linewise home">
            <img src="/img/linewise-lockup.webp" alt="Linewise" width={115} height={30} />
          </Link>
          <nav className="nav" aria-label="Main">
            {nav.map((n) => (
              <a key={n.id} href={n.href} className={n.cls} aria-current={current === n.id ? 'page' : undefined}>{n.label}</a>
            ))}
            {cta && <Link href="/checkout" className="btn btn-cy">Get the e-book</Link>}
          </nav>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="cols">
          <div>
            <img src="/img/linewise-lockup.webp" alt="Linewise" width={108} height={28} loading="lazy" />
            <p className="small mute">Short, wordless stickman films about discipline, focus and the small choices that shape a life. One step. Every day.</p>
          </div>
          <div>
            <p className="h4">The e-book</p>
            <ul>
              <li><Link href="/#inside">What&apos;s inside</Link></li>
              <li><Link href="/#sample">Free sample</Link></li>
              <li><Link href="/checkout">Buy for {PRODUCT.priceLabel}</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
              <li><Link href="/advertise">Advertise with Linewise</Link></li>
            </ul>
          </div>
          <div>
            <p className="h4">Legal</p>
            <ul>
              <li><Link href="/terms">Terms of Sale</Link></li>
              <li><Link href="/refunds">Refund policy</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/cookies">Cookie notice</Link></li>
              <li><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <p>Linewise is a brand of {COMPANY.name}, a company registered in {COMPANY.jurisdiction} (company number {COMPANY.number}). Registered office: {COMPANY.office}. VAT registration number {COMPANY.vat}.</p>
          <p>© 2026 {COMPANY.name}. Education, not financial advice: we do not promise any level of views, followers or income.</p>
        </div>
      </div>
    </footer>
  );
}

export const Icon = {
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="2.2" /><path d="M8 10.5V8a4 4 0 018 0v2.5" stroke="currentColor" strokeWidth="2.2" /></svg>
  ),
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.4-7.5 9.5-4.3-1.1-7.5-4.9-7.5-9.5V6L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M8.5 12l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  file: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h7l5 5v13H7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M14 3v5h5M12 11v6m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  bolt: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /></svg>
  ),
};
