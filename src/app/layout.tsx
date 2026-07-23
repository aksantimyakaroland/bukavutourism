/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://visitbukavu.netlify.app'),
  title: {
    default: 'Visiter Bukavu — Voyage au Sud-Kivu, Congo',
    template: '%s — Visiter Bukavu',
  },
  description:
    'Découvrez Bukavu et le Sud-Kivu : lacs, gorilles, montagnes, culture. Circuits guidés, événements et voyages authentiques en Afrique.',
  openGraph: {
    title: 'Visiter Bukavu',
    description: 'Voyagez au Sud-Kivu, Congo. Lacs, gorilles, montagnes, culture.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..600,50..100,0..1&family=Schibsted+Grotesk:wght@400..700&family=JetBrains+Mono:wght@400..500&display=swap" rel="stylesheet" />
      </head>
      <body className="grain-overlay">{children}</body>
    </html>
  );
}
