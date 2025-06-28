import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack optimizasyonu (experimental)
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },

  // Webpack optimizasyonları
  webpack: (config, { dev, isServer }) => {
    // WalletConnect externals
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Node.js polyfill'leri
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };

    // Production optimizasyonları
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            wagmi: {
              test: /[\\/]node_modules[\\/](wagmi|@wagmi|viem)[\\/]/,
              name: 'wagmi',
              chunks: 'all',
            },
            ui: {
              test: /[\\/]node_modules[\\/](@heroicons|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    // Security-related webpack configurations
    if (!dev) {
      config.optimization.minimize = true;
      
      // Remove console logs in production
      config.optimization.minimizer.forEach((plugin: any) => {
        if (plugin.constructor.name === 'TerserPlugin') {
          plugin.options.terserOptions.compress.drop_console = true;
        }
      });
    }

    return config;
  },

  // Transpile packages
  transpilePackages: [
    '@walletconnect/ethereum-provider',
    '@rainbow-me/rainbowkit',
    '@wagmi/core',
    'wagmi',
    'viem'
  ],

  // Performance optimizasyonları
  swcMinify: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['localhost'],
  },

  // PWA ve cache headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' blob: data: https:",
              "connect-src 'self' https://*.monad.xyz https://*.alchemy.com https://*.infura.io wss://*.alchemy.com wss://*.infura.io",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=(self)',
              'usb=()',
            ].join(', '),
          },
          // HSTS (if using HTTPS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Compression
  compress: true,
  
  // Disable powered by header
  poweredByHeader: false,

  // Disable x-powered-by header
  generateEtags: true,

  // Environment variables validation
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
  },

  // Security-related redirects and rewrites
  async redirects() {
    return [
      // Redirect HTTP to HTTPS in production
      ...(process.env.NODE_ENV === 'production' ? [
        {
          source: '/(.*)',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: 'https://localhost:3000/:path*',
          permanent: true,
        },
      ] : []),
    ];
  },
};

export default nextConfig;
