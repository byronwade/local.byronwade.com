import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,

	// Increase timeout for static page generation to prevent hanging builds
	staticPageGenerationTimeout: 180, // Increased to 3 minutes

	// Disable source maps in production to speed up build
	productionBrowserSourceMaps: false,

	// Output standalone only on Vercel to avoid local copyfile errors
	...(isVercel ? { output: "standalone" } : {}),

	experimental: {
		// Temporarily disable optimizePackageImports to prevent build hangs
		// optimizePackageImports: ["@radix-ui/react-icons", "lucide-react", "@react-three/drei", "@react-three/fiber"],

		// Optimize large page data
		largePageDataBytes: 128 * 1024, // 128KB limit
	},

	eslint: {
		// Temporarily ignore ESLint errors during build to identify core hanging issues
		ignoreDuringBuilds: true,
	},

	typescript: {
		// Temporarily ignore TypeScript errors during build to test core functionality
		ignoreBuildErrors: true,
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
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},

	env: {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	},

	// Security headers
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Platform",
						value: "local",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
				],
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

		// Disable problematic caching during build
		if (!dev) {
			config.cache = false;
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

			// Conservative performance settings
			config.performance = {
				hints: false, // Disable hints to prevent hanging
			};
		}

		return config;
	},
};

export default nextConfig;
