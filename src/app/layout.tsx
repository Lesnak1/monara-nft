import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

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
      </head>
      <body className="antialiased bg-slate-950">
        <Providers>
          {/* Enhanced Monad-themed Background */}
          <div className="fixed inset-0 z-0">
            {/* Base gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            
            {/* Monad purple overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-purple-900/20" />
            
            {/* Animated gradient orbs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-bounce-slow" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-full blur-3xl animate-spin-slow" />
            
            {/* Neural network pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #836EF9 1px, transparent 1px),
                               radial-gradient(circle at 75% 75%, #00D4AA 1px, transparent 1px)`,
              backgroundSize: '100px 100px'
            }} />
          </div>
          
          {/* Main Content Container */}
          <div className="relative z-10 min-h-screen flex flex-col text-white">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
