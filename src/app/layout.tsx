import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { ClientWrapper } from '@/components/ClientWrapper';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: false,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#836EF9' },
    { media: '(prefers-color-scheme: dark)', color: '#200052' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'MONARA - Evolving Digital Beings on Monad',
    template: '%s | MONARA'
  },
  description: 'Experience the future of NFTs with Neural Networks that evolve, adapt, and transcend through computational stages on Monad Network.',
  keywords: ['NFT', 'Monad', 'Blockchain', 'Neural Networks', 'Digital Art', 'Evolution', 'Web3'],
  authors: [{ name: 'MONARA Team' }],
  creator: 'MONARA',
  publisher: 'MONARA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'MONARA',
    title: 'MONARA - Evolving Digital Beings on Monad',
    description: 'Experience the future of NFTs with Neural Networks that evolve, adapt, and transcend through computational stages on Monad Network.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'MONARA - Evolving Digital Beings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MONARA - Evolving Digital Beings on Monad',
    description: 'Experience the future of NFTs with Neural Networks that evolve, adapt, and transcend through computational stages on Monad Network.',
    images: ['/api/og'],
    creator: '@MONARA',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { 
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23836EF9'/><stop offset='50%' style='stop-color:%23A0055D'/><stop offset='100%' style='stop-color:%23200052'/></linearGradient></defs><circle cx='50' cy='50' r='45' fill='url(%23g)'/><text x='50' y='65' text-anchor='middle' fill='white' font-family='Inter' font-size='32' font-weight='700'>M</text></svg>",
        type: 'image/svg+xml' 
      },
      { url: '/favicon.ico' },
    ],
    apple: [
      { 
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23836EF9'/><stop offset='50%' style='stop-color:%23A0055D'/><stop offset='100%' style='stop-color:%23200052'/></linearGradient></defs><circle cx='50' cy='50' r='45' fill='url(%23g)'/><text x='50' y='65' text-anchor='middle' fill='white' font-family='Inter' font-size='32' font-weight='700'>M</text></svg>",
        sizes: '180x180', 
        type: 'image/svg+xml' 
      },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${jetbrainsMono.variable}`} 
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external services */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//testnet-rpc.monad.xyz" />
        <link rel="dns-prefetch" href="//testnet.monadexplorer.com" />
        
        {/* Prevent browser extension interference */}
        <meta name="darkreader-lock" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="antialiased bg-slate-950 flex flex-col min-h-screen" suppressHydrationWarning>
        <Providers>
          <ClientWrapper>
            <Header />
            <main className="flex-1">
            {children}
            </main>
            <Footer />
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
