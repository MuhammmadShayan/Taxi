/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side rendering optimizations for Next.js

  // Image optimization configuration
  images: {
    remotePatterns: [
      {

        protocol: 'https',
        hostname: 'holikey.com',
      },
      {
        protocol: 'https',
        hostname: 'www.holikey.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' ? 'https://holikey.com' : '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Accept, Authorization'
          }
        ]
      }
    ];
  },

  // Redirects for legacy URLs and SEO
  async redirects() {
    return [
      {
        source: '/kirastay/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/car-booking',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/become-local-expert',
        destination: '/agency/register',
        permanent: true,
      },
      {
        source: '/cars/:id',
        destination: '/vehicles/:id',
        permanent: true,
      }
    ];
  },

  // Rewrites for cleaner URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      }
    ];
  },

  // Environment variables available to the browser
  env: {
    APP_NAME: process.env.APP_NAME || 'HOLIKEY',
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  },

  // Webpack configuration for better performance
  webpack: (config, { dev, isServer }) => {
    const webpackLib = require('webpack');
    // Optimize bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
      '@/components': './src/components',
      '@/lib': './src/lib',
      '@/models': './src/models',
      '@/styles': './src/styles'
    };

    // Provide minimal polyfills to avoid runtime crashes on older Node versions
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpackLib.ProvidePlugin({
        File: require('path').resolve(__dirname, 'src/lib/polyfills/file.js'),
      })
    );

    // Handle MySQL2 for server-side only
    if (isServer) {
      config.externals.push('mysql2');
    }

    // Performance optimizations for development
    if (dev) {
      // Reduce bundle analysis overhead
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            chunks: 'all',
            test: /node_modules/,
            name: 'vendor',
            priority: 20,
            enforce: true,
          },
        },
      };

      // DON'T override devtool in development mode - causes performance issues
      // Let Next.js use its default devtool setting

      // Exclude heavy assets from watch
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/public/html-folder/video/**',
          '**/public/html-folder/fonts/**',
          '**/public/html-folder/flags/**',
          '**/.next/**',
          '**/dist/**'
        ],
      };
    } else {
      // Only set custom devtool for production builds
      config.devtool = false;
    }

    return config;
  },

  // Compiler optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output configuration for deployment
  output: 'standalone',

  // Enable static optimization
  trailingSlash: false,

  // Configure build behavior
  generateEtags: false,
  compress: true,

  // Performance monitoring
  poweredByHeader: false,

  // Development configuration
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development', // Skip ESLint in dev for faster builds
  },

  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development', // Skip TypeScript errors in dev
  },

  // Performance optimizations for development
  experimental: {
    // Optimize CSS handling
    optimizeCss: false,
    // Skip unused CSS in development
    optimizePackageImports: ['lodash', 'react-icons'],
  }
};

module.exports = nextConfig;
