import type { Metadata } from 'next';
import { Header, Footer } from '@/components/Chrome';
import { ContactForm } from '@/components/Client';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Advertise with Linewise: media kit for brands',
  description: 'Sponsored stickman films, product integrations and link-in-bio placements on Linewise. Formats, packages, brand-safety standards and how to get in touch.',
  alternates: { canonical: '/advertise' },
};

const PH = <span className="tag ph">Placeholder</span>;

export default function Advertise() {
  const stats = [
    { l: 'Followers, all platforms' },
    { l: 'Average views per film (30 days)' },
    { l: 'Monthly views' },
    { l: 'Average % viewed' },
  ];
  const pkgs = [
    { t: 'Integrated Short', d: 'Your product appears inside the story as a natural part of the lesson. Posted to YouTube Shorts, TikTok and Instagram Reels.' },
    { t: 'Dedicated Short', d: 'A whole wordless film built around your message, written and storyboarded with you, approved before it goes live.' },
    { t: 'Bio link + pin', d: 'Your link in our bio and a pinned comment on a recent film for 7 days.' },
    { t: 'Usage rights', d: 'Run the film as a paid ad on your own accounts for 30 or 90 days.' },
  ];
  return (
    <>
      <Header current="advertise" />
      <main id="main">
        <section className="page-hero">
          <div className="wrap">
            <p className="kicker">Media kit · For brands</p>
            <h1 className="h1">Advertise with Linewise</h1>
            <p className="lead" style={{ maxWidth: 720 }}>Short, wordless stickman films about discipline, focus and the small choices that shape a life. No narration, so a film works in any language and with the sound off.</p>
          </div>
        </section>

        <section className="sec-tight">
          <div className="wrap">
            <div className="sec-head">
              <h2>Channel reach</h2>
              <div className="call warn">
                <p className="h4">Placeholder figures</p>
                <p>Real channel statistics will be published here once they exist. Until then, the boxes below are placeholders, not results. We send screenshots of our analytics on request, dated, before any booking.</p>
              </div>
            </div>
            <div className="kit-grid">
              {stats.map((s) => (
                <div className="stat" key={s.l}><div className="n" aria-label="Placeholder">[ — ]</div><div className="l">{s.l}</div><div style={{ marginTop: 10 }}>{PH}</div></div>
              ))}
            </div>
            <div className="grid3" style={{ marginTop: 16 }}>
              <div className="panel"><p className="h4">Audience</p><p>Top countries, age and gender split will be added from platform analytics. {PH}</p></div>
              <div className="panel"><p className="h4">Interests</p><p>Self-improvement, fitness, study and productivity: the themes our films are about.</p></div>
              <div className="panel"><p className="h4">Platforms</p><p>YouTube Shorts, TikTok and Instagram Reels, 1080 × 1920 vertical video, around 30 seconds.</p></div>
            </div>
          </div>
        </section>

        <section className="sec-tight sec-alt">
          <div className="wrap">
            <div className="sec-head"><p className="kicker">The look</p><h2>What a Linewise film looks like</h2><p>Frames from our own films. Flat 2D figures on near-black, one accent colour, a single lesson and a payoff.</p></div>
            <div className="stills">
              {['001-c', '102-b', '186-a', '001-f'].map((s) => (
                <img key={s} src={`/img/stills/${s}.webp`} alt="Frame from a Linewise stickman film" width={360} height={640} loading="lazy" decoding="async" />
              ))}
            </div>
          </div>
        </section>

        <section className="sec-tight">
          <div className="wrap">
            <div className="sec-head"><p className="kicker">Formats and packages</p><h2>Ways to work together</h2><p>Prices depend on reach and are quoted per brief. {PH}</p></div>
            <div className="kit-grid">
              {pkgs.map((p) => (
                <div className="panel pkg" key={p.t}><h3 className="h3">{p.t}</h3><p>{p.d}</p><span className="from">Price on request</span></div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec-tight sec-alt">
          <div className="wrap grid2" style={{ alignItems: 'start' }}>
            <div>
              <p className="kicker">Brand safety</p>
              <h2>Our standards</h2>
              <ul className="b">
                <li><b>Always labelled.</b> Every paid placement is clearly marked as advertising (for example “Ad”), in line with the CAP Code and each platform’s paid-promotion tools.</li>
                <li><b>No narration, no profanity.</b> Films carry on-screen text, music and sound effects only.</li>
                <li><b>Honest claims.</b> We do not make health, financial or earnings claims for a sponsor, and we do not promise view counts.</li>
                <li><b>Products we would use.</b> We decline gambling, crypto trading, adult content, tobacco and vaping, weight-loss products and anything aimed at children.</li>
                <li><b>Licensed sound.</b> Music and sound effects are licensed for the platforms we post to; for usage-rights deals we clear tracks for paid advertising first.</li>
                <li><b>Your approval.</b> You see the storyboard and the final cut before anything is posted.</li>
              </ul>
            </div>
            <div>
              <p className="kicker">Get in touch</p>
              <h2>Tell us about your brand</h2>
              <ContactForm email={COMPANY.email} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
