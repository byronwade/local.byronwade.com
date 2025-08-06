import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,

	experimental: {
		optimizePackageImports: ["@radix-ui/react-icons", "lucide-react", "@react-three/drei", "@react-three/fiber"],
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

	// Webpack configuration for standard structure
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// Path aliases for standard Next.js structure
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "."),
			"@components": path.resolve(__dirname, "components"),
			"@lib": path.resolve(__dirname, "lib"),
			"@utils": path.resolve(__dirname, "lib/utils"),
			"@types": path.resolve(__dirname, "types"),
			"@hooks": path.resolve(__dirname, "hooks"),
			"@context": path.resolve(__dirname, "context"),
			"@store": path.resolve(__dirname, "store"),
			"@data": path.resolve(__dirname, "data"),
			"@config": path.resolve(__dirname, "config"),
		};

		return config;
	},
};

export default nextConfig;
