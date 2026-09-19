import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://guoriyue.github.io'),
  icons: {
    icon: [
      { url: '/collie-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/collie-icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    title: 'Mingfei Guo',
    description:
      'Research, open-source projects, and notes. Exploring 3D reconstruction, visual generation, and efficient machine learning.',
    url: 'https://guoriyue.github.io',
    images: [
      {
        url: 'https://guoriyue.github.io/og.png',
        width: 1730,
        height: 909,
        alt: 'Mingfei Guo — Software Engineer at NVIDIA.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@MingfeiGuo',
    title: 'Mingfei Guo',
    description:
      'Research, open-source projects, and notes. Exploring 3D reconstruction, visual generation, and efficient machine learning.',
    images: ['https://guoriyue.github.io/og.png'],
  },
  title: 'Mingfei Guo',
  description:
    'Research, open-source projects, and notes by Mingfei Guo. Exploring 3D reconstruction, visual generation, and efficient machine learning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
