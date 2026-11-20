'use client';
import { useEffect, useRef, useState } from 'react';
import { CONSENT_TEXT } from '@/lib/site';

/** Sticky buy bar on phones: shows once the hero CTA has scrolled away, hides near the pricing card. */
export function StickyCta({ price }: { price: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('hero-cta');
    const pricing = document.getElementById('pricing');
    if (!hero) return;
    let heroGone = false; let pricingIn = false;
    const update = () => setOn(heroGone && !pricingIn);
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.target === hero) heroGone = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === pricing) pricingIn = e.isIntersecting;
      }
      update();
    });
    io.observe(hero); if (pricing) io.observe(pricing);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`sticky${on ? ' on' : ''}`} aria-hidden={!on}>
      <div className="t"><b>How to Make Viral Stickman Shorts</b>82-page PDF + bonus pack</div>
      <a href="/checkout" className="btn btn-cy" tabIndex={on ? 0 : -1}>Get it · {price}</a>
    </div>
  );
}

/** Muted, looping film that only loads when it is about to enter the viewport. */
export function FilmLoop() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.dataset.loaded) {
          v.querySelectorAll('source').forEach((s) => { s.src = s.dataset.src!; });
          v.load(); v.dataset.loaded = '1';
        }
        if (!reduce) v.play().catch(() => {});
      } else v.pause();
    }, { rootMargin: '200px' });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} muted loop playsInline preload="none" poster="/media/linewise-film-001-poster.webp" width={432} height={768}
      aria-label="Linewise film 001, Light on: four lighthouse keepers called Motivation, Ego, Obsession and Discipline; only Discipline keeps the light on for 100 nights.">
      <source data-src="/media/linewise-film-001.webm" type="video/webm" />
      <source data-src="/media/linewise-film-001.mp4" type="video/mp4" />
    </video>
  );
}

export function SampleForm() {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'err'>('idle');
  const [msg, setMsg] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState('busy'); setMsg('');
    const r = await fetch('/api/sample', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fd.get('email'), consent: fd.get('consent') === 'on', website: fd.get('website') }) }).catch(() => null);
    const d = r ? await r.json().catch(() => ({})) : {};
    if (r?.ok && d.ok) { setState('done'); setMsg('Thanks. Your sample is downloading now.'); window.location.href = '/sample/linewise-free-sample-8-rules.pdf'; }
    else { setState('err'); setMsg(d.error || 'Something went wrong. You can still download the sample below.'); }
  }
  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="sample-email" className="sr">Email address (optional)</label>
      <div className="row">
        <input id="sample-email" name="email" type="email" className="inp" placeholder="you@example.com" autoComplete="email" required />
        <button className="btn btn-cy" disabled={state === 'busy'}>Join and download</button>
      </div>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="chk"><input type="checkbox" name="consent" required /><span>Send me occasional Linewise emails about new films and guides. Unsubscribe any time. See our <a href="/privacy">Privacy Policy</a>.</span></label>
      <p className={`msg ${state === 'done' ? 'ok' : state === 'err' ? 'err' : ''}`} role="status" aria-live="polite">{msg}</p>
    </form>
  );
}

export function CheckoutForm({ price, cancelled }: { price: string; cancelled: boolean }) {
  const [consent, setConsent] = useState(false);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(cancelled ? 'Payment was cancelled. Nothing was charged. You can try again below.' : '');
  async function go(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || !terms) { setErr('Please tick both boxes to continue.'); return; }
    setBusy(true); setErr('');
    const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ consent, terms }) }).catch(() => null);
    const d = r ? await r.json().catch(() => ({})) : {};
    if (r?.ok && d.url) { window.location.href = d.url; return; }
    setBusy(false); setErr(d.error || 'Checkout is unavailable right now. Please try again in a minute.');
  }
  return (
    <form onSubmit={go} noValidate>
      <label className="chk"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} required />
        <span>I have read and accept the <a href="/terms" target="_blank" className="cy">Terms of Sale</a> and the <a href="/refunds" target="_blank" className="cy">Refund policy</a>.</span></label>
      <label className="chk"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span><b>{CONSENT_TEXT}</b></span></label>
      <p className="tiny mute" style={{ margin: '0 0 18px 36px' }}>Required by the Consumer Contracts Regulations 2013 for instant digital downloads. Until you start a download you can still cancel within 14 days for a full refund.</p>
      <button className="btn btn-cy btn-lg btn-block" disabled={busy} aria-disabled={!consent || !terms}>
        {busy ? 'Opening secure checkout…' : <>Continue to secure payment <span className="price">{price}</span></>}
      </button>
      <p className={`msg ${err ? 'err' : ''}`} role="alert">{err}</p>
    </form>
  );
}

export function ContactForm({ email }: { email: string }) {
  function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = `Linewise partnership: ${fd.get('brand') || 'enquiry'}`;
    const body = `Name: ${fd.get('name')}\nBrand / company: ${fd.get('brand')}\nWebsite: ${fd.get('site')}\nBudget range: ${fd.get('budget')}\nPackage: ${fd.get('pkg')}\n\n${fd.get('msg')}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return (
    <form onSubmit={send} className="panel" style={{ display: 'grid', gap: 12 }}>
      <div className="row"><label className="sr" htmlFor="c-name">Your name</label><input id="c-name" name="name" className="inp" placeholder="Your name" required autoComplete="name" />
        <label className="sr" htmlFor="c-brand">Brand or company</label><input id="c-brand" name="brand" className="inp" placeholder="Brand or company" required autoComplete="organization" /></div>
      <div className="row"><label className="sr" htmlFor="c-site">Website</label><input id="c-site" name="site" className="inp" placeholder="Website" autoComplete="url" />
        <label className="sr" htmlFor="c-budget">Budget range</label><input id="c-budget" name="budget" className="inp" placeholder="Budget range (optional)" /></div>
      <label className="sr" htmlFor="c-pkg">Package</label>
      <select id="c-pkg" name="pkg" className="inp" defaultValue="Not sure yet">
        <option>Not sure yet</option><option>Integrated Short</option><option>Dedicated Short</option><option>Bio link + pin</option><option>Usage rights / paid ads</option>
      </select>
      <label className="sr" htmlFor="c-msg">Your brief</label>
      <textarea id="c-msg" name="msg" className="inp" placeholder="What are you promoting, to whom, and when?" required />
      <button className="btn btn-cy">Write the email</button>
      <p className="tiny mute">This opens your email app with the details filled in, addressed to {email}. Nothing is stored on this site.</p>
    </form>
  );
}
