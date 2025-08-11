import path from "path";
import { fileURLToPath } from "url";
import bundleAnalyzer from "@next/bundle-analyzer";
import enhancedConfigModule from "./src/lib/performance/enhanced-next-config.js";
const { createEnhancedNextConfig } = enhancedConfigModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const isCacheDisabled = process.env.DISABLE_CACHE === "true";
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

/** @type {import('next').NextConfig} */
const baseConfig = {
	reactStrictMode: false,
	poweredByHeader: false,
	compress: true,
	httpAgentOptions: { keepAlive: true },
	generateEtags: !isCacheDisabled,

	// Increase timeout for static page generation to prevent hanging builds
	staticPageGenerationTimeout: 180, // Increased to 3 minutes

	// Disable source maps in production to speed up build
	productionBrowserSourceMaps: false,

	// Output standalone only on Vercel to avoid local copyfile errors
	...(isVercel ? { output: "standalone" } : {}),

	// Moved from experimental per Next.js 15 updates
	skipMiddlewareUrlNormalize: true,
	skipTrailingSlashRedirect: true,

	// Turbopack config (replaces experimental.turbo)
	turbopack: {},

	experimental: {
		// Enable Partial Pre-Rendering
		ppr: true,
		// React Compiler (canary-only)
		reactCompiler: true,
		// Optimize package imports for smaller bundles
		optimizePackageImports: ["@radix-ui/react-icons", "lucide-react", "@react-three/drei", "@react-three/fiber"],
		// Flight + streaming enhancements stay default in canary
		// Larger page data budget for heavy pages
		largePageDataBytes: 128 * 1024,
		// CSS optimization flags (canary)
		optimizeCss: true,
	},

	// SWC modularize imports (moved out of webpack config)
	modularizeImports: {
		lodash: { transform: "lodash/{{member}}" },
		"date-fns": { transform: "date-fns/{{member}}" },
		"react-icons": { transform: "react-icons/{{member}}" },
		"lucide-react": { transform: "lucide-react/dist/esm/icons/{{member}}" },
	},

	eslint: {
		// Temporarily ignore ESLint errors during build to identify core hanging issues
		ignoreDuringBuilds: true,
	},

	typescript: {
		// Temporarily ignore TypeScript errors during build to test core functionality
		ignoreBuildErrors: true,
	},

	// Compiler-level optimizations
	compiler: {
		// Strip console logs in production except warn/error
		removeConsole: {
			exclude: ["warn", "error"],
		},
		// Optimize Emotion SSR/runtime (we use @emotion/styled)
		emotion: true,
	},

	serverExternalPackages: ["@supabase/supabase-js", "sharp", "three"],

	// Image optimization configuration
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "localhost",
			},
		],
		formats: ["image/webp", "image/avif"],
		minimumCacheTTL: isCacheDisabled ? 0 : 31536000,
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},

	// Note: i18n configuration removed as it's not supported in App Router
	// Use next-intl or similar package for internationalization in App Router

	env: {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	},

	// Security + Caching headers
	async headers() {
		const securityHeaders = [
			{ key: "X-Platform", value: "local" },
			{ key: "X-Frame-Options", value: "DENY" },
			{ key: "X-Content-Type-Options", value: "nosniff" },
		];

		if (isCacheDisabled) {
			return [
				{
					source: "/(.*)",
					headers: [...securityHeaders, { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" }, { key: "Pragma", value: "no-cache" }, { key: "Expires", value: "0" }],
				},
			];
		}

		return [
			{
				source: "/(.*)",
				headers: securityHeaders,
			},
			// Save crawl budget on API routes
			{
				source: "/api/:path*",
				headers: [{ key: "X-Robots-Tag", value: "noindex" }],
			},
			// Long-term caching for static assets in public
			{
				source: "/assets/:path*",
				headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
			},
			{
				source: "/logos/:path*",
				headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
			},
			{
				source: "/_next/static/:path*",
				headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
			},
		];
	},

	// SEO redirects for synonym slugs
	async redirects() {
		return [
			{
				source: "/field-service-management",
				destination: "/field-management-software",
				permanent: true,
			},
		];
	},

	// Webpack configuration for standard structure and build optimization
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// Path aliases for standard Next.js structure
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "."),
			"@components": path.resolve(__dirname, "src/components"),
			"@lib": path.resolve(__dirname, "src/lib"),
			"@utils": path.resolve(__dirname, "src/utils"),
			"@types": path.resolve(__dirname, "src/types"),
			"@hooks": path.resolve(__dirname, "src/hooks"),
			"@context": path.resolve(__dirname, "src/context"),
			"@store": path.resolve(__dirname, "src/store"),
			"@data": path.resolve(__dirname, "src/data"),
			"@config": path.resolve(__dirname, "src/config"),
		};

		// Production optimization
		if (!dev) {
			// Prefer filesystem cache with deterministic build id
			config.cache = {
				type: "filesystem",
				buildDependencies: {
					config: [__filename],
				},
			};
			config.snapshot = {
				...config.snapshot,
				managedPaths: [],
				immutablePaths: [],
			};

			// Simplified optimization to prevent hanging
			config.optimization = {
				...config.optimization,
				minimize: true,
				sideEffects: false,
				splitChunks: {
					chunks: "all",
					cacheGroups: {
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name: "vendors",
							chunks: "all",
						},
					},
				},
			};

			// Enforce budgets
			config.performance = {
				maxAssetSize: 250000,
				maxEntrypointSize: 500000,
				hints: isVercel ? "error" : "warning",
			};
		}

		return config;
	},
};

// Create enhanced configuration with NextFaster optimizations
const enhancedConfig = createEnhancedNextConfig(baseConfig);

export default withBundleAnalyzer(enhancedConfig);
