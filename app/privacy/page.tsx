import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/Legal';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Blackwellen Ltd (Linewise) uses personal data under UK GDPR and the Data Protection Act 2018: checkout, email, downloads, your rights and how to complain.',
  alternates: { canonical: '/privacy' },
};

const toc: [string, string][] = [
  ['controller', 'Who is responsible'], ['collect', 'What we collect'], ['use', 'How we use it and our lawful bases'], ['share', 'Who we share it with'],
  ['transfers', 'International transfers'], ['retention', 'How long we keep it'], ['security', 'Security'], ['rights', 'Your rights'], ['cookies', 'Cookies'], ['children', 'Children'], ['complain', 'Complaints'], ['changes', 'Changes'],
];

export default function Privacy() {
  const mail = <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>;
  return (
    <LegalPage kicker="Legal" title="Privacy Policy" toc={toc}
      intro={<p>This policy explains how we use your personal data when you visit this website, buy the Linewise e-book, ask for the free sample or contact us. We collect as little as we can and never sell your data.</p>}>
      <h2 id="controller">1. Who is responsible</h2>
      <p>The controller of your personal data is <b>{COMPANY.name}</b> (trading as Linewise), registered in {COMPANY.jurisdiction} under company number {COMPANY.number}, registered office {COMPANY.office}. For any privacy question or request, email {mail} or write to us at our registered office.</p>

      <h2 id="collect">2. What we collect</h2>
      <table>
        <thead><tr><th>When</th><th>What</th></tr></thead>
        <tbody>
          <tr><td>You buy the e-book</td><td>Your name, email address, billing address and country, the order and payment record (amount, VAT, date, order reference), and a record of the consent you gave at checkout (the wording, its version and the time). Stripe collects your card details directly; we never see or store your full card number.</td></tr>
          <tr><td>You download your files</td><td>The number and time of downloads for your order, and which file. Our hosting and storage providers also process your IP address and browser details in security logs.</td></tr>
          <tr><td>You ask for the free sample and tick the box</td><td>Your email address and your consent to occasional Linewise emails. Giving it is optional: you can download the sample without it.</td></tr>
          <tr><td>You email us, including about advertising</td><td>Your name, email address, company and whatever you write to us.</td></tr>
          <tr><td>You browse this website</td><td>Standard server logs (IP address, pages requested, browser type, time). We do not use analytics cookies or advertising trackers.</td></tr>
        </tbody>
      </table>

      <h2 id="use">3. How we use it and our lawful bases</h2>
      <table>
        <thead><tr><th>Purpose</th><th>Lawful basis (UK GDPR Article 6)</th></tr></thead>
        <tbody>
          <tr><td>Taking payment, delivering your files, sending receipts and download links, handling refunds and faulty-file claims</td><td>Contract</td></tr>
          <tr><td>Keeping order, VAT and accounting records; recording your cancellation consent</td><td>Legal obligation</td></tr>
          <tr><td>Preventing fraud and misuse, limiting downloads per order, keeping the site secure</td><td>Legitimate interests (protecting our business and customers)</td></tr>
          <tr><td>Answering your emails and advertising enquiries</td><td>Legitimate interests, or steps before a contract</td></tr>
          <tr><td>Sending occasional Linewise emails after you opt in</td><td>Consent, which you can withdraw at any time via the unsubscribe link or by emailing us</td></tr>
        </tbody>
      </table>
      <p>We do not use your data for automated decisions that have legal or similarly significant effects on you, other than Stripe’s standard fraud screening of payments.</p>

      <h2 id="share">4. Who we share it with</h2>
      <p>We use these service providers, who process data on our instructions under contracts that protect it:</p>
      <ul>
        <li><b>Stripe</b> (payments, tax calculation, receipts and invoices). For some purposes, such as fraud prevention and meeting its own legal duties, Stripe acts as an independent controller; see stripe.com/privacy.</li>
        <li><b>Vercel</b> (website hosting and server logs).</li>
        <li><b>Cloudflare</b> (private storage of the e-book files and download delivery).</li>
        <li><b>Resend</b> (sending download-link emails and, if you opted in, Linewise emails), when enabled.</li>
        <li>Our email provider, for messages you send us.</li>
      </ul>
      <p>We may also share data with our professional advisers, with HMRC and other authorities where the law requires, or with a buyer of our business, who would have to respect this policy. We never sell your personal data.</p>

      <h2 id="transfers">5. International transfers</h2>
      <p>Some providers are based in, or use servers in, the United States and other countries outside the UK. Where data leaves the UK, we rely on UK adequacy regulations (including the UK Extension to the EU-US Data Privacy Framework where a provider is certified) or the UK International Data Transfer Agreement or Addendum, plus the provider’s security measures. Email us for details.</p>

      <h2 id="retention">6. How long we keep it</h2>
      <ul>
        <li><b>Orders, invoices and consent records:</b> 6 years from the end of the financial year of the purchase, to meet tax and accounting rules and to deal with any claims.</li>
        <li><b>Download counts:</b> kept with the order record.</li>
        <li><b>Mailing list:</b> until you unsubscribe or withdraw consent; then we keep a suppression record so we do not email you again.</li>
        <li><b>Emails you send us:</b> up to 2 years after the conversation ends, unless they form part of an order record.</li>
        <li><b>Server and security logs:</b> for the short periods set by our hosting and storage providers.</li>
      </ul>

      <h2 id="security">7. Security</h2>
      <p>The site uses HTTPS. The e-book files sit in a private storage bucket and can only be fetched with short-lived signed links, issued after we check your payment with Stripe. Access to our systems is limited to people who need it.</p>

      <h2 id="rights">8. Your rights</h2>
      <p>Under UK data protection law you have the right to: access your data; have it corrected; have it erased; restrict or object to our use of it (including objecting at any time to direct marketing); receive it in a portable format; and withdraw consent at any time. Some rights have limits, for example we must keep order records for tax purposes. To use a right, email {mail}. We reply within one month and do not charge a fee in most cases. We may ask you to confirm your identity.</p>

      <h2 id="cookies">9. Cookies</h2>
      <p>This website does not set analytics or advertising cookies. Stripe’s checkout page sets cookies it needs for payment security and fraud prevention. See our <Link href="/cookies">Cookie notice</Link>.</p>

      <h2 id="children">10. Children</h2>
      <p>This site is aimed at adults. Under-18s should only buy with the permission of a parent or guardian, and we do not knowingly collect data from children under 13.</p>

      <h2 id="complain">11. Complaints</h2>
      <p>Please contact us first at {mail} so we can try to help. You also have the right to complain to the Information Commissioner’s Office (ICO), the UK data protection regulator: ico.org.uk/make-a-complaint or 0303 123 1113. If you live in the EU, you can contact your local data protection authority.</p>

      <h2 id="changes">12. Changes</h2>
      <p>We will update this policy when our practices change and show the date at the top. If a change materially affects how we use data you have already given us, we will tell you by email where we can.</p>
    </LegalPage>
  );
}
