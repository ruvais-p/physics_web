import type { Metadata } from 'next';
import { Source_Serif_4, Hanken_Grotesk } from 'next/font/google';
import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
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
    <html lang="en" className={`${sourceSerif.variable} ${hankenGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col bg-surface-canvas text-on-surface font-sans antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
