import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/Legal';
import { COMPANY, CONSENT_TEXT, DOWNLOAD_LIMITS, PRODUCT } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Sale',
  description: 'Terms of Sale for the Linewise e-book: digital content, personal licence, VAT, the 14-day cancellation waiver, faulty-download remedies and governing law.',
  alternates: { canonical: '/terms' },
};

const toc: [string, string][] = [
  ['who', 'Who we are'], ['product', 'What you are buying'], ['order', 'Ordering and the contract'], ['price', 'Price, VAT and payment'],
  ['delivery', 'Delivery and downloads'], ['cancel', 'Your right to cancel'], ['faulty', 'If something is wrong'], ['licence', 'Your licence'],
  ['results', 'No promise of results'], ['liability', 'Our liability'], ['changes', 'Changes and events outside our control'], ['complaints', 'Complaints'], ['law', 'Governing law'],
];

export default function Terms() {
  return (
    <LegalPage kicker="Legal" title="Terms of Sale" toc={toc}
      intro={<p>These terms apply when you buy the Linewise e-book <b>{PRODUCT.name}</b> from this website. Please read them before you buy. They do not affect your legal rights as a consumer.</p>}>
      <h2 id="who">1. Who we are</h2>
      <p>Linewise is a brand of <b>{COMPANY.name}</b>, a company registered in {COMPANY.jurisdiction} under company number {COMPANY.number}. Our registered office is {COMPANY.office}. Our VAT registration number is {COMPANY.vat}. You can contact us at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>

      <h2 id="product">2. What you are buying</h2>
      <p>You are buying digital content: two PDF files that you download.</p>
      <ul>
        <li><b>The e-book:</b> “{PRODUCT.fullName}”, {PRODUCT.edition}, {PRODUCT.pages} pages, 9 chapters plus a bonus pack.</li>
        <li><b>The Bonus Pack:</b> a {PRODUCT.bonusPages}-page printable PDF with storyboard sheets, 50 starter concepts and templates.</li>
      </ul>
      <p>You need a device that can open PDF files. The product is in English. It is educational material, not professional, legal, tax or financial advice. Platform rules, payout rates and app features change; figures in the book are approximate and dated.</p>

      <h2 id="order">3. Ordering and the contract</h2>
      <p>To buy, you accept these terms and give the consent described in section 6, then pay on a secure checkout page run by our payment provider, Stripe. The contract between you and us is formed when your payment is confirmed and we show your download page. You must be 18 or over, or have the permission of a parent or guardian, to buy.</p>
      <p>We may refuse or cancel an order if we suspect fraud, or if there is an obvious pricing error; if we do, we refund you in full.</p>

      <h2 id="price">4. Price, VAT and payment</h2>
      <p>The price is <b>{PRODUCT.priceLabel}</b>, charged in pounds sterling. The price you see is the total you pay: any VAT due is included and is worked out from your billing address (UK, EU or elsewhere) and shown on your receipt or invoice. Your bank may charge a currency conversion fee if your card is not in pounds.</p>
      <p>Payments are processed by Stripe. We do not receive or store your full card details. Discount codes, if offered, are one per order and have no cash value.</p>

      <h2 id="delivery">5. Delivery and downloads</h2>
      <p>Straight after payment you are taken to your personal download page. Stripe also emails you a receipt{' '}and, where available, we email you a link to your download page.</p>
      <ul>
        <li>Your download page works for <b>{DOWNLOAD_LIMITS.days} days</b> from purchase and for up to <b>{DOWNLOAD_LIMITS.max} downloads</b> in total.</li>
        <li>Each download button creates a new secure link that expires after a few minutes. Links are personal; please do not share them.</li>
        <li>Please save the files to your own device. If you need a new link after your page expires, email us with your order reference and we will help.</li>
      </ul>

      <h2 id="cancel">6. Your right to cancel</h2>
      <p>Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 you normally have 14 days to cancel a contract for digital content. Because you get the files straight away, at checkout we ask you to confirm:</p>
      <p className="call"><b>“{CONSENT_TEXT}”</b></p>
      <p>We record that consent with your order and confirm it on your receipt. This means:</p>
      <ul>
        <li><b>Before any download starts:</b> you can cancel within 14 days of purchase for a full refund. Email us with your order reference.</li>
        <li><b>Once a download starts:</b> your right to cancel ends. Your rights if the files are faulty (section 7) still apply.</li>
      </ul>
      <p>We can see from your order whether a download has started. Refunds go back to the card you paid with, within 14 days of us agreeing to the cancellation.</p>

      <h2 id="faulty">7. If something is wrong</h2>
      <p>Under the Consumer Rights Act 2015, digital content must be of satisfactory quality, fit for purpose and as described. If a file is faulty (for example, it will not open or pages are missing) or not as described, tell us at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>:</p>
      <ul>
        <li>we will repair or replace it, usually by sending a working file, free of charge and within a reasonable time; and</li>
        <li>if we cannot fix it, or not within a reasonable time or without significant inconvenience to you, you can have a price reduction or a full refund.</li>
      </ul>
      <p>If faulty digital content we supplied damages your device or other digital content, and this would not have happened had we used reasonable care and skill, we will repair the damage or compensate you. See also our <Link href="/refunds">Refund policy</Link>.</p>

      <h2 id="licence">8. Your licence</h2>
      <p>The book, its text, layouts, diagrams, film stills and templates are © 2026 {COMPANY.name}. When you buy, we give you a personal, non-exclusive, non-transferable licence to download, read and keep the files for your own use, on your own devices. You may print the bonus templates for your own use.</p>
      <p>You may use what you learn, including the techniques, the format rules and the 50 starter concepts, to make and publish your own original films, including on monetised channels.</p>
      <p>You may not:</p>
      <ul>
        <li>share, resell, give away, lend, rent or upload the files, or put them on a shared drive, website or course;</li>
        <li>copy substantial parts of the text, layouts or our film stills into your own products or posts (short quotes with credit to Linewise are fine);</li>
        <li>use the files to train or fine-tune an AI model, or remove copyright notices.</li>
      </ul>
      <p>For a team, school or company licence, email us. If you break this section, we may end your licence and download access.</p>

      <h2 id="results">9. No promise of results</h2>
      <p>The book explains how we work and what the most-watched films in the genre have in common. We do not promise any level of views, followers, income or other results. Results depend on your work, your niche, timing, platform decisions and luck. Figures about other creators’ films are public view counts gathered in November 2026 and will change.</p>

      <h2 id="liability">10. Our liability</h2>
      <p>We are responsible for loss or damage you suffer that is a foreseeable result of us breaking these terms or failing to use reasonable care and skill. We are not responsible for loss that is not foreseeable, for business losses (the book is sold for personal use), or for decisions made by platforms such as YouTube, TikTok or Instagram. Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud, or for anything that cannot be limited by law, including your statutory rights as a consumer.</p>

      <h2 id="changes">11. Changes and events outside our control</h2>
      <p>We may update these terms for future orders; the version that applies to you is the one shown when you bought. We are not responsible for delays caused by events outside our reasonable control, but we will tell you and do what we can to minimise the effect.</p>

      <h2 id="complaints">12. Complaints</h2>
      <p>If you are unhappy, email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> with your order reference. We aim to reply within 5 working days and to resolve complaints within 14 days.</p>

      <h2 id="law">13. Governing law</h2>
      <p>These terms are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction. If you live in Scotland or Northern Ireland you may also bring proceedings in your local courts. If you live in the European Union or elsewhere, you keep any mandatory consumer protections of the country where you live.</p>
    </LegalPage>
  );
}
