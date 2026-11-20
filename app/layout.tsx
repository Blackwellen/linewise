import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_URL, PRODUCT } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'How to Make Viral Stickman Shorts: the Linewise e-book (£19.99)', template: '%s | Linewise' },
  description:
    'The complete system for wordless stickman Shorts, from first idea to a channel that grows. 82 pages, 9 chapters, 50 starter concepts and 6 printable templates. No drawing needed. £19.99 PDF.',
  applicationName: 'Linewise',
  authors: [{ name: 'Linewise' }],
  publisher: 'Blackwellen Ltd',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Linewise',
    locale: 'en_GB',
    url: '/',
    title: 'How to Make Viral Stickman Shorts: the Linewise e-book',
    description: `The complete system, from first idea to a channel that grows. No drawing needed. ${PRODUCT.pages} pages, ${PRODUCT.priceLabel}.`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Make Viral Stickman Shorts: the Linewise e-book',
    description: 'The complete system, from first idea to a channel that grows. No drawing needed.',
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: '#07090d',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preload" href="/fonts/Anton.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/Barlow-Regular.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/Barlow-Medium.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/Barlow-ExtraBold.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
