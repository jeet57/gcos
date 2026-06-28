import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * M01 scope: minimal HTML shell only.
 *
 * Font loading (Inter Variable, JetBrains Mono), the ThemeProvider,
 * and the (app)/(auth) route groups with Sidebar + TopBar are added
 * in M06 (Design System) and M17 (Next.js Bootstrap — App Shell).
 */
export const metadata: Metadata = {
  title: 'GCOS — Germany Career Operating System',
  description: 'Personal career command centre for the Germany relocation plan.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
