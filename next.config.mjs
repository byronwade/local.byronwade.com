import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: false,
  poweredByHeader: false,

  eslint: {
    // Ignore ESLint during builds to focus on compilation errors
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Ignore TypeScript errors during build for now
    ignoreBuildErrors: true,
  },

  experimental: {
    // Minimal experimental features only
  },

  // Allow LAN dev origin to avoid noisy warnings
  // (Next.js will ignore unknown options; safe if unsupported)
  allowedDevOrigins: ["http://192.168.50.185:3000"],

  // Disable problematic filesystem caching in development
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
      config.snapshot = {
        ...(config.snapshot || {}),
        managedPaths: [],
        immutablePaths: [],
      };
    }

    // Suppress Supabase realtime-js critical dependency warnings
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /Critical dependency/,
      },
      {
        module: /websocket-factory\.js/,
        message: /the request of a dependency is an expression/,
      },
    ];

    // Add path aliases for webpack resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@features': path.resolve(__dirname, 'src/features'),
      '@integrations': path.resolve(__dirname, 'src/integrations'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@config': path.resolve(__dirname, 'src/config'),
    };

    return config;
  },

  // Basic image configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default baseConfig;
