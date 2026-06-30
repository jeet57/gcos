import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';

import './globals.css';

/**
 * M06 scope: Tailwind + design tokens + font loading.
 *
 * The (app)/(auth) route groups with Sidebar + TopBar are added in
 * M17 (Next.js Bootstrap — App Shell).
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GCOS — Germany Career Operating System',
  description: 'Personal career command centre for the Germany relocation plan.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
