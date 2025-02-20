import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import { Providers } from './providers';
import { Header } from '@/components/Header';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Demo NFT Marketplace',
  description: 'Telegram Mini App built with Next.js that allows authorized users to view a list of NFT items',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>
          <Header />
          {children}
        </body>
      </html>
    </Providers>
  );
}
