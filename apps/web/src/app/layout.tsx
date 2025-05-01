import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import ToasterWrapper from '@/components/Layout/ToasterWrapper';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const experimental_ppr = true;
export const metadata: Metadata = {
  metadataBase: new URL('https://app.flowmo.io'),
  applicationName: 'Flowmo',
  title: 'Flowmo',
  description: 'Flowmo Web App',
  openGraph: {
    type: 'website',
    url: 'https://app.flowmo.io',
    title: 'Flowmo',
    description: 'Flowmo Web App',
    images: [{ url: 'https://flowmo.io/og.png' }],
  },
  other: {
    'apple-itunes-app': 'app-id=6670529689',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-screen justify-center bg-background text-white scrollbar-hide dark`}
      >
        <Providers>{children}</Providers>
        <Suspense>
          <ToasterWrapper />
        </Suspense>
      </body>
    </html>
  );
}
