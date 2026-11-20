import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/Legal';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cookie notice',
  description: 'Linewise uses no analytics or advertising cookies. This notice explains the strictly necessary storage used for payment and how to control cookies.',
  alternates: { canonical: '/cookies' },
};

const toc: [string, string][] = [['short', 'The short version'], ['ours', 'This website'], ['stripe', 'Stripe checkout'], ['banner', 'Why there is no cookie banner'], ['control', 'Controlling cookies']];

export default function Cookies() {
  return (
    <LegalPage kicker="Legal" title="Cookie notice" toc={toc}
      intro={<p>We keep this simple: no tracking, no analytics cookies, no advertising pixels.</p>}>
      <h2 id="short">The short version</h2>
      <p>This website does not place any cookies on your device. The only cookies involved in buying the e-book are set by Stripe on its own secure checkout page, and they are strictly necessary for taking payment safely.</p>

      <h2 id="ours">This website</h2>
      <p>Our pages are served without cookies, local storage or tracking scripts. Our hosting provider keeps standard server logs for security, as described in our <Link href="/privacy">Privacy Policy</Link>. Your download page works from a private link, not from a cookie.</p>

      <h2 id="stripe">Stripe checkout</h2>
      <p>When you continue to payment you go to a checkout page hosted by Stripe (checkout.stripe.com). Stripe uses cookies and similar technologies there to process the payment, remember your session and prevent fraud. These are strictly necessary for the service you asked for, so they do not need consent under the Privacy and Electronic Communications Regulations. Stripe explains them at stripe.com/cookie-settings.</p>
      <table>
        <thead><tr><th>Where</th><th>Set by</th><th>Purpose</th><th>Type</th></tr></thead>
        <tbody>
          <tr><td>This website</td><td>—</td><td>None</td><td>—</td></tr>
          <tr><td>checkout.stripe.com</td><td>Stripe</td><td>Payment session, security and fraud prevention</td><td>Strictly necessary</td></tr>
        </tbody>
      </table>

      <h2 id="banner">Why there is no cookie banner</h2>
      <p>A consent banner is only needed for non-essential cookies such as analytics or advertising. We do not use any. If we ever add them, we will ask for your consent first with a clear choice to accept or reject, and update this notice.</p>

      <h2 id="control">Controlling cookies</h2>
      <p>You can block or delete cookies in your browser settings. If you block Stripe’s cookies, the checkout may not work. Questions? Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>
    </LegalPage>
  );
}
