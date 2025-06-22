import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Keep only essential experimental features
	experimental: {
		optimizePackageImports: ["lucide-react"],
	},
	env: {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
	},
	images: {
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 31536000, // 1 year
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	// Minimal performance optimizations
	compress: true,
	poweredByHeader: false,
	generateEtags: true,
	// Minimal webpack configuration with disabled caching
	webpack: (config) => {
		// Disable caching to fix build issues
		config.cache = false;

		// Essential alias setup only
		config.resolve.alias = {
			...config.resolve.alias,
			"@components": path.resolve(__dirname, "components"),
			"@utils": path.resolve(__dirname, "lib/utils"),
			"@lib": path.resolve(__dirname, "lib"),
			"@context": path.resolve(__dirname, "context"),
			"@hooks": path.resolve(__dirname, "hooks"),
			"@store": path.resolve(__dirname, "store"),
		};

		return config;
	},
	async headers() {
		return [
			{
				source: "/api/:slug",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, POST, PUT, DELETE, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization",
					},
				],
			},
			// Essential security headers only
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
				],
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/about",
				destination: "/about-us",
				permanent: true,
			},
		];
	},
};

export default nextConfig;