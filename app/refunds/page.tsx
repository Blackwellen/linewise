import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/Legal';
import { COMPANY, PRODUCT } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refund policy',
  description: 'When you can get a refund for the Linewise e-book: before download, faulty files, and how to ask.',
  alternates: { canonical: '/refunds' },
};

const toc: [string, string][] = [['summary', 'Summary'], ['before', 'Before you download'], ['after', 'After a download starts'], ['faulty', 'Faulty or not as described'], ['how', 'How to ask for a refund'], ['other', 'Duplicate or unauthorised payments']];

export default function Refunds() {
  return (
    <LegalPage kicker="Legal" title="Refund policy" toc={toc}
      intro={<p>This policy explains when you can get your money back for <b>{PRODUCT.name}</b>. It is part of our <Link href="/terms">Terms of Sale</Link> and does not affect your statutory rights.</p>}>
      <h2 id="summary">Summary</h2>
      <div className="table-scroll"><table>
        <thead><tr><th>Situation</th><th>What happens</th></tr></thead>
        <tbody>
          <tr><td>You have not started a download, and it is within 14 days of purchase</td><td>Full refund</td></tr>
          <tr><td>A file is faulty or not as described</td><td>We fix or replace it; if we cannot, a price reduction or full refund</td></tr>
          <tr><td>You paid twice by mistake, or did not authorise the payment</td><td>Full refund of the extra or unauthorised payment</td></tr>
          <tr><td>You started a download and simply changed your mind</td><td>No refund: you agreed at checkout that the 14-day right to cancel ends once a download starts</td></tr>
        </tbody>
      </table></div>

      <h2 id="before">Before you download</h2>
      <p>If no download has started, you can cancel within 14 days of purchase for a full refund of {PRODUCT.priceLabel}. You do not need to give a reason. Our system records whether a download has started, so we can check this quickly.</p>

      <h2 id="after">After a download starts</h2>
      <p>The book is delivered instantly. Before paying, you tick a box confirming that you want immediate access and that you lose your 14-day right to cancel once the download starts, as allowed by the Consumer Contracts Regulations 2013. After that point we do not offer change-of-mind refunds. Your rights for faulty content still apply.</p>

      <h2 id="faulty">Faulty or not as described</h2>
      <p>If a file will not open, pages are missing or damaged, or the product is materially different from its description on this website, email us. We will send a working file or fix the problem. If we cannot, or not within a reasonable time, we will reduce the price or refund you in full, as the Consumer Rights Act 2015 requires.</p>

      <h2 id="how">How to ask for a refund</h2>
      <p>Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> with your order reference (it starts with LW- and appears on your download page) or the email address you used at checkout. Tell us what went wrong. We reply within 5 working days. Agreed refunds go back to your original payment method within 14 days; your bank may take a few more days to show it. A refunded order loses download access.</p>

      <h2 id="other">Duplicate or unauthorised payments</h2>
      <p>If you were charged twice or see a payment you did not make, contact us first and we will put it right. You can also contact your card issuer.</p>
      <p className="small mute">{COMPANY.name}, company number {COMPANY.number}, {COMPANY.office}. VAT {COMPANY.vat}.</p>
    </LegalPage>
  );
}
