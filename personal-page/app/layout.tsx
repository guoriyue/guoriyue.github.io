import type { Metadata } from 'next';
import './globals.css';

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mingfei Guo',
  url: 'https://guoriyue.github.io/',
  image: 'https://guoriyue.github.io/portrait.jpg',
  jobTitle: 'Software Engineer',
  worksFor: { '@type': 'Organization', name: 'NVIDIA' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Stanford University' },
    { '@type': 'CollegeOrUniversity', name: 'Peking University' },
  ],
  sameAs: [
    'https://github.com/guoriyue',
    'https://www.linkedin.com/in/mingfeiguo',
    'https://x.com/MingfeiGuo',
    'https://scholar.google.com/citations?user=I6LEm6YAAAAJ',
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://guoriyue.github.io'),
  alternates: { canonical: '/' },
  icons: {
    icon: [
      {
        url: '/favicon-border-collie-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-border-collie.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon-border-collie.svg',
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
  title: 'Mingfei Guo — Software Engineer at NVIDIA',
  description:
    'Mingfei Guo is a software engineer at NVIDIA working on generative video models, 3D reconstruction, systems ML, and GPU performance. Stanford MS, Peking University BS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      </body>
    </html>
  );
}
