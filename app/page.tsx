import Link from 'next/link';
import { Header, Footer, Icon } from '@/components/Chrome';
import { FilmLoop, SampleForm, StickyCta } from '@/components/Client';
import { CHAPTERS, FAQ, PAGE_PREVIEWS } from '@/lib/content';
import { COMPANY, PRODUCT, SITE_URL } from '@/lib/site';

function JsonLd() {
  const org = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#org`,
    name: COMPANY.name,
    brand: { '@type': 'Brand', name: 'Linewise', slogan: 'One step. Every day.' },
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    email: COMPANY.email,
    vatID: COMPANY.vat.replace(' ', ''),
    identifier: { '@type': 'PropertyValue', propertyID: 'Companies House number', value: COMPANY.number },
    address: { '@type': 'PostalAddress', streetAddress: '61 Bridge Street', addressLocality: 'Kington', postalCode: 'HR5 3DJ', addressCountry: 'GB' },
  };
  const offer = {
    '@type': 'Offer',
    url: `${SITE_URL}/checkout`,
    price: PRODUCT.price,
    priceCurrency: PRODUCT.currency,
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': `${SITE_URL}/#org` },
  };
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      org,
      {
        '@type': ['Product', 'Book'],
        '@id': `${SITE_URL}/#book`,
        name: PRODUCT.fullName,
        description: 'The complete system for wordless stickman Shorts, from idea to upload. 90 pages, 9 chapters, 50 starter concepts, 7 printable templates. No drawing needed.',
        image: [`${SITE_URL}/img/cover-800.webp`, `${SITE_URL}/opengraph-image.jpg`],
        brand: { '@type': 'Brand', name: 'Linewise' },
        author: { '@type': 'Organization', name: 'Linewise' },
        publisher: { '@id': `${SITE_URL}/#org` },
        bookFormat: 'https://schema.org/EBook',
        numberOfPages: PRODUCT.pages,
        inLanguage: 'en-GB',
        datePublished: PRODUCT.published,
        bookEdition: PRODUCT.edition,
        offers: offer,
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <Header />
      <main id="main">
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true">
            <svg className="grid-lines" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
              <path d="M-40 250 L1480 520 M-40 690 L1480 360 M930 -20 L800 940 M1290 -20 L1180 940" />
            </svg>
          </div>
          <div className="wrap">
            <ul className="proofbar" aria-label="Highlights">
              <li>From the makers of <b>Linewise</b> films</li>
              <li>Built on a frame-by-frame study of <b>16 films with 3–29M views</b></li>
              <li><b>No drawing</b> needed</li>
            </ul>
          </div>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="kicker">The Linewise creator guide</p>
              <h1 id="hero-title" className="display">How to make <span className="cy">viral stickman</span> Shorts</h1>
              <p className="lead">From idea to upload: the complete system. Wordless 30-second films you can make in one phone app.</p>
              <ul className="facts" aria-label="What you get">
                <li><b>90</b> pages</li><li><b>9</b> chapters</li><li><b>50</b> starter concepts</li><li><b>7</b> printable templates</li>
              </ul>
              <div className="cta-row" id="hero-cta">
                <Link href="/checkout" className="btn btn-cy btn-xl">Get the e-book <span className="price">{PRODUCT.priceLabel}</span></Link>
                <a href="#sample" className="btn btn-ghost btn-xl">Read 3 pages free</a>
              </div>
              <ul className="trust">
                <li>{Icon.bolt} Instant PDF download</li>
                <li>{Icon.lock} Secure payment by Stripe</li>
                <li>{Icon.check} Price includes any VAT</li>
              </ul>
            </div>
            <div className="hero-visual">
              <div className="glow" aria-hidden="true" />
              <img className="pg pg-l" src="/img/pages/ch4-260.webp" alt="" width={260} height={325} aria-hidden="true" />
              <img className="pg pg-r" src="/img/pages/ch6-260.webp" alt="" width={260} height={325} aria-hidden="true" />
              <div className="floor" aria-hidden="true" />
              <div className="contact" aria-hidden="true" />
              <img className="book" src="/img/book-880.webp" srcSet="/img/book-400.webp 400w, /img/book-520.webp 520w, /img/book-880.webp 880w" sizes="(max-width: 900px) 240px, 400px"
                width={880} height={1289} alt="The Linewise e-book cover, 2nd edition: How to Make Viral Stickman Shorts. From idea to upload: the complete system" fetchPriority="high" />
            </div>
          </div>
        </section>

        {/* FILM */}
        <section className="sec sec-alt" aria-labelledby="film-title">
          <div className="wrap film">
            <figure>
              <div className="phone"><span className="tag cy">Our film · 30 s</span><FilmLoop /></div>
              <figcaption className="cap"><b>Film 001, “Light on”.</b> Made by Linewise with the system in this book.</figcaption>
            </figure>
            <div className="txt">
              <p className="kicker">The format</p>
              <h2 id="film-title">One idea. Thirty seconds. No words.</h2>
              <p className="lead">Four lighthouse keepers called Motivation, Ego, Obsession and Discipline. A storm. One light still on after 100 nights.</p>
              <p>That is the whole film: a single lesson told with figures, light, on-screen text and music. No voice to record, no lip-sync, no backgrounds to paint and no continuity between episodes. You are not competing on drawing ability. You are competing on ideas and timing, and that is what this book teaches.</p>
              <ul className="b">
                <li>Two winning shapes: <b>trait lanes</b> and the <b>contrast montage</b></li>
                <li>Premise visible on frame 0, a payoff, then a seamless loop</li>
                <li>Flat 2D on near-black, one accent colour, restrained glow</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PROBLEM / PROMISE */}
        <section className="sec" aria-labelledby="pp-title">
          <div className="wrap">
            <div className="sec-head">
              <p className="kicker">Why this book</p>
              <h2 id="pp-title">You have seen these films everywhere. Now make your own.</h2>
              <p className="lead">Most people who want a faceless channel never post the first film. They get stuck on drawing, voiceovers, or what to make next. This format removes all three.</p>
            </div>
            <div className="pp">
              <div className="panel">
                <p className="h4" style={{ color: 'var(--red)' }}>Without a system</p>
                <h3>Blank screen, every day</h3>
                <ul className="b x">
                  <li>No idea what to make, so nothing gets made</li>
                  <li>Animation tutorials that assume you can draw</li>
                  <li>Films that look busy but do not get watched to the end</li>
                  <li>Music that gets the video muted or claimed</li>
                </ul>
              </div>
              <div className="panel" style={{ borderColor: 'rgba(61,214,255,.45)' }}>
                <p className="h4">With the Linewise system</p>
                <h3>A repeatable film, start to finish</h3>
                <ul className="b">
                  <li>50 starter concepts and the 8 idea pillars behind them</li>
                  <li>A 14-scene storyboard template and hooks that hold</li>
                  <li>One phone app, one rig, step by step to export</li>
                  <li>Sound, licensing, posting cadence and the numbers to watch</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROOF: RESEARCH */}
        <section className="sec sec-alt" aria-labelledby="proof-title">
          <div className="wrap">
            <div className="sec-head">
              <p className="kicker">Chapter 1 · The research</p>
              <h2 id="proof-title">We studied the films that hit 3–29 million views</h2>
              <p className="lead">Before making a single film, we went through sixteen of the most-viewed stickman Shorts in the genre one frame per second, and logged everything.</p>
            </div>
            <div className="stats">
              <div className="stat"><div className="n">16</div><div className="l">top genre films studied frame by frame</div></div>
              <div className="stat"><div className="n">3–29M</div><div className="l">views each, public counts</div></div>
              <div className="stat"><div className="n">160+</div><div className="l">genre Shorts measured for music credits</div></div>
              <div className="stat"><div className="n">8</div><div className="l">rules the viral films share</div></div>
            </div>
            <div className="findings">
              <div className="panel"><span className="num">01</span><h3>Nobody is talking</h3><p>Six of the biggest films (29M, 17M, 11M, 10M, 6.6M and 3.5M views) have no caption track at all: the platform detected no speech. Music, on-screen text and light sound effects do everything.</p></div>
              <div className="panel"><span className="num">02</span><h3>Every film stands alone</h3><p>None is “part 2” of anything. A character is only a labelled trait, such as Discipline or Ego, or simply “YOU”, so each film works for a total stranger.</p></div>
              <div className="panel"><span className="num">03</span><h3>Small accounts win</h3><p>Several channels reached 2–17 million views with fewer than ten uploads. In this genre, the format carries the reach, not the follower count.</p></div>
            </div>
            <div className="call data">
              <p className="h4">How to read these numbers</p>
              <p>These are public view counts for <b>other creators’</b> films, gathered in November 2026 from YouTube copies of genre films. They describe the genre, not our channel and not what you will get. Counts keep moving; treat them as a snapshot. We do not promise any level of views, followers or income.</p>
            </div>
          </div>
        </section>

        {/* WHAT'S INSIDE */}
        <section className="sec" id="inside" aria-labelledby="inside-title">
          <div className="wrap">
            <div className="sec-head">
              <p className="kicker">What’s inside</p>
              <h2 id="inside-title">Nine chapters and a bonus pack</h2>
              <p className="lead">Everything comes from our own production work. Every still is a frame from a Linewise film; we never use other creators’ work as illustrations.</p>
            </div>
            <div className="chapters">
              {CHAPTERS.map((c) => (
                <article className="chap" key={c.n}>
                  <img src={`/img/pages/${c.img}.webp`} alt={`Chapter ${c.n} opening page`} width={480} height={600} loading="lazy" decoding="async" />
                  <div><span className="n" aria-hidden="true">{c.n}</span><h3>{c.t}</h3><p>{c.d}</p></div>
                </article>
              ))}
              <article className="chap bonus">
                <img src="/img/pages/bonus.webp" alt="Bonus pack opening page" width={480} height={600} loading="lazy" decoding="async" />
                <div><span className="n" aria-hidden="true">+</span><h3>The Bonus Pack</h3><p>Storyboard sheets, 50 concepts, SFX cue sheet, text guide, 30-day calendar, checklist and media kit. Also as a separate printable PDF.</p></div>
              </article>
            </div>
            <ul className="pages" aria-label="Page previews" tabIndex={0}>
              {PAGE_PREVIEWS.map((p) => (
                <li key={p.img}><figure>
                  <img src={`/img/pages/${p.img}.webp`} alt={`Page preview. ${p.c}`} width={480} height={600} loading="lazy" decoding="async" />
                  <figcaption>{p.c}</figcaption>
                </figure></li>
              ))}
            </ul>
          </div>
        </section>

        {/* FIT */}
        <section className="sec sec-alt" aria-labelledby="fit-title">
          <div className="wrap">
            <div className="sec-head">
              <p className="kicker">Is it for you?</p>
              <h2 id="fit-title">Who this book is for, and who it is not for</h2>
            </div>
            <div className="fit">
              <div className="panel">
                <p className="h4">It is for you if</p>
                <ul className="b">
                  <li>You want a faceless channel and do not want to talk on camera</li>
                  <li>You cannot draw, and do not want to learn to</li>
                  <li>You like self-improvement, motivation, study or fitness themes</li>
                  <li>You have a phone and a spare hour a day</li>
                  <li>You want a clear, repeatable process rather than more inspiration</li>
                </ul>
              </div>
              <div className="panel no">
                <p className="h4">It is not for you if</p>
                <ul className="b x">
                  <li>You want guaranteed views or income (nobody can honestly promise that)</li>
                  <li>You want to make long, narrated or talking-head videos</li>
                  <li>You plan to repost other people’s films</li>
                  <li>You want 3D or hand-drawn character animation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SAMPLE */}
        <section className="sec" id="sample" aria-labelledby="sample-title">
          <div className="wrap sample">
            <div className="prev">
              <span className="tag cy">Free sample</span>
              <img src="/img/pages/rules.webp" alt="Sample page: Eight rules the viral films share" width={480} height={601} loading="lazy" decoding="async" />
            </div>
            <div>
              <p className="kicker">Read before you buy</p>
              <h2 id="sample-title">Get the “8 rules” pages free</h2>
              <p className="lead">The cover, our research page and the eight rules every viral stickman film we studied has in common. Three pages, straight from the book.</p>
              <SampleForm />
              <p className="small"><a className="cy" href="/sample/linewise-free-sample-8-rules.pdf" download>No thanks, just download the sample (PDF, 0.5 MB)</a></p>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="sec sec-alt" id="pricing" aria-labelledby="pricing-title">
          <div className="wrap">
            <div className="sec-head center">
              <p className="kicker">One price, everything included</p>
              <h2 id="pricing-title">Start your first film tonight</h2>
            </div>
            <div className="price-card">
              <div className="top">
                <img src="/img/cover-480.webp" alt="" width={92} height={129} loading="lazy" />
                <div>
                  <div className="amount">{PRODUCT.priceLabel}<small>One-off payment. Price includes any VAT. Instant download.</small></div>
                </div>
              </div>
              <ul className="b">
                <li><b>The e-book:</b> 90 pages, 9 chapters, PDF (2nd edition, November 2026)</li>
                <li><b>The Bonus Pack:</b> 13-page printable PDF with 7 templates</li>
                <li><b>50 starter concepts</b> you can storyboard today</li>
                <li><b>Chapter 9:</b> our code and AI pipeline, explained</li>
                <li>Personal download page for 30 days, up to 15 downloads</li>
              </ul>
              <Link href="/checkout" className="btn btn-cy btn-lg btn-block">Get the e-book <span className="price">{PRODUCT.priceLabel}</span></Link>
              <div className="guarantee">
                {Icon.shield}
                <p><b>Fair and simple.</b> Not downloaded yet? Cancel within 14 days for a full refund. File faulty or not as described? We fix it or refund you. Once a download starts, the 14-day cancellation right ends, as you agree at checkout. <Link href="/refunds" className="cy">Refund policy</Link></p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sec" id="faq" aria-labelledby="faq-title">
          <div className="wrap">
            <div className="sec-head center">
              <p className="kicker">Questions</p>
              <h2 id="faq-title">Frequently asked questions</h2>
            </div>
            <div className="faq">
              {FAQ.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}</summary>
                  <div className="a"><p>{f.a}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final sec-alt" aria-labelledby="final-title">
          <div className="wrap">
            <h2 id="final-title" className="display">One idea. Thirty seconds.<br /><span className="cy">Every day.</span></h2>
            <p className="lead">The whole system is in the book. The only part we can’t give you is the next hundred films.</p>
            <Link href="/checkout" className="btn btn-cy btn-lg">Get the e-book <span className="price">{PRODUCT.priceLabel}</span></Link>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCta price={PRODUCT.priceLabel} />
    </>
  );
}
