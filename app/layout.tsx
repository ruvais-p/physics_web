import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '@/app/globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Department of Physics | CUSAT',
    template: '%s | Department of Physics - CUSAT',
  },
  description:
    'Official Portal of the Department of Physics, Cochin University of Science and Technology (CUSAT). Excellence in fundamental physics, photonics, materials science, and cosmology.',
  keywords: [
    'Department of Physics',
    'CUSAT Physics',
    'MSc Physics CUSAT',
    'PhD Physics Kochi',
    'Nanomaterials',
    'Photonics',
    'Theoretical Cosmology',
    'Cochin University',
  ],
  authors: [{ name: 'Department of Physics, CUSAT' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans`} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-surface-canvas text-on-surface font-sans antialiased"
        suppressHydrationWarning
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
