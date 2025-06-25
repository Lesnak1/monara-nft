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
  },

  // PWA ve cache headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
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
  
  // PoweredBy header'ını kaldır
  poweredByHeader: false,
};

export default nextConfig;
