// Single source of truth for brand, product and company facts.
// Company details are copied exactly from the existing Blackwellen Ltd legal pages (Gigvora content/sh00/legal).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const COMPANY = {
  name: 'Blackwellen Ltd',
  number: '16482166',
  jurisdiction: 'England and Wales',
  office: '61 Bridge Street, Kington HR5 3DJ, United Kingdom',
  vat: 'GB 508480488',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@blackwellen.com',
} as const;

export const PRODUCT = {
  name: 'How to Make Viral Stickman Shorts',
  brand: 'Linewise',
  fullName: 'Linewise: How to Make Viral Stickman Shorts',
  price: '19.99',
  priceLabel: '£19.99',
  currency: 'GBP',
  pages: 82,
  chapters: 9,
  concepts: 50,
  templates: 6,
  bonusPages: 12,
  edition: 'First edition, November 2026',
  published: '2026-11',
} as const;

export const LEGAL_UPDATED = '21 November 2026';

/** Wording shown next to the checkbox and stored with every order (Consumer Contracts Regulations 2013, reg. 36/37). */
export const CONSENT_TEXT =
  'I agree to immediate access to the digital content and acknowledge that I lose my 14-day right to cancel once the download starts.';
export const CONSENT_VERSION = 'cc-2026-11-18';
export const TERMS_VERSION = 'terms-2026-11-18';

export const DOWNLOAD_LIMITS = {
  /** How long the re-download link in the receipt email works. */
  days: Number(process.env.DOWNLOAD_LINK_DAYS || 30),
  /** Total file downloads per order (book + bonus pack together). */
  max: Number(process.env.DOWNLOAD_MAX || 15),
  /** Lifetime of each presigned R2 URL, in seconds. */
  presignSeconds: Number(process.env.DOWNLOAD_URL_TTL_SECONDS || 600),
};

export const FILES = {
  book: { key: 'v1/linewise-how-to-make-viral-stickman-shorts.pdf', filename: 'Linewise - How to Make Viral Stickman Shorts.pdf', label: 'The e-book (PDF, 82 pages)' },
  bonus: { key: 'v1/linewise-bonus-pack-templates.pdf', filename: 'Linewise - Bonus Pack Templates.pdf', label: 'The bonus pack (PDF, 12 pages)' },
} as const;
export type FileId = keyof typeof FILES;
