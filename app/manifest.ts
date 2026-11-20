import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Linewise',
    short_name: 'Linewise',
    description: 'How to Make Viral Stickman Shorts: the Linewise e-book.',
    start_url: '/',
    display: 'browser',
    background_color: '#07090d',
    theme_color: '#07090d',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
