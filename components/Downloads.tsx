import { Icon } from './Chrome';
import { DOWNLOAD_LIMITS, FILES, COMPANY } from '@/lib/site';

export function DownloadList({ token, used, expiresAt }: { token: string; used: number; expiresAt: number }) {
  const left = Math.max(0, DOWNLOAD_LIMITS.max - used);
  const until = new Date(expiresAt * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <div className="dl">
        {(Object.keys(FILES) as (keyof typeof FILES)[]).map((f) => (
          <a key={f} className="file" href={`/api/download?t=${encodeURIComponent(token)}&f=${f}`} rel="nofollow noreferrer">
            <span className="ic">{Icon.file}</span>
            <span className="nm">{FILES[f].label}<small>{FILES[f].filename}</small></span>
            <span className="btn btn-cy" style={{ minHeight: 40, padding: '0 16px', fontSize: 15 }}>Download</span>
          </a>
        ))}
      </div>
      <p className="small mute">{left} of {DOWNLOAD_LIMITS.max} downloads left · this page works until {until}. Each button creates a fresh secure link that expires after {Math.round(DOWNLOAD_LIMITS.presignSeconds / 60)} minutes. Problems? Email <a className="cy" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>
    </>
  );
}

export const ERRORS: Record<string, { t: string; d: string }> = {
  invalid: { t: 'This download link is not valid', d: 'The link may be incomplete. Open the full link from your email or your success page.' },
  expired: { t: 'This download link has expired', d: `Download pages work for ${DOWNLOAD_LIMITS.days} days. Email us with your order reference and we will send a new one.` },
  unpaid: { t: 'We could not confirm a paid order for this link', d: 'If you have just paid, wait a minute and refresh. Refunded orders no longer have download access.' },
  limit: { t: 'Download limit reached', d: `This order has used all ${DOWNLOAD_LIMITS.max} downloads. Email us and we will help.` },
  storage: { t: 'Downloads are temporarily unavailable', d: 'Our file store is not reachable right now. Please try again shortly, or email us.' },
  file: { t: 'Unknown file', d: 'Please use the buttons on your download page.' },
};
