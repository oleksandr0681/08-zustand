import type { Metadata } from 'next';
import { Roboto } from "next/font/google";
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'], 
  weight: ['400', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
});

export const metadata: Metadata = {
  title: 'NoteHub',
  description:
    'A simple and efficient application designed for managing personal notes.',
  openGraph: {
    title: 'NoteHub',
    description:
      'A simple and efficient application designed for managing personal notes.',
    url: `${process.env.SITE_URL}`,
    siteName: 'NoteHub',
    images: [
      {
        url: `${process.env.IMAGES_URL}/fullstack/react/og-meta.jpg`,
        width: 1200,
        height: 630,
        alt: 'NoteHub',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoteHub',
    description:
      'A simple and efficient application designed for managing personal notes.',
    images: [`${process.env.IMAGES_URL}/fullstack/react/og-meta.jpg`],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
