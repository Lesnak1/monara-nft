/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
  },
  // Enable webpack 5 
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Add security headers to fix MetaMask issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' chrome-extension: moz-extension:",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https:",
              "connect-src 'self' https://*.alchemy.com https://*.infura.io wss://*.alchemy.com chrome-extension: moz-extension: https://testnet-rpc.monad.xyz wss://testnet-rpc.monad.xyz",
              "frame-src 'self' chrome-extension: moz-extension:",
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'self' chrome-extension: moz-extension:",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 