import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,

	experimental: {
		optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
	},

	// Transpile shared workspace packages
	transpilePackages: ["@thorbis/shared"],

	serverExternalPackages: ["@supabase/supabase-js", "sharp"],

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

	// Main platform specific configuration
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Platform",
						value: "main",
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

	// Webpack configuration for shared workspace
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// Path aliases for shared workspace
		config.resolve.alias = {
			...config.resolve.alias,
			"@shared": path.resolve(__dirname, "../shared"),
			"@components": path.resolve(__dirname, "../shared/components"),
			"@utils": path.resolve(__dirname, "../shared/lib/utils"),
			"@lib": path.resolve(__dirname, "../shared/lib"),
			"@styles": path.resolve(__dirname, "../shared/styles"),
			"@context": path.resolve(__dirname, "../shared/context"),
			"@hooks": path.resolve(__dirname, "../shared/hooks"),
			"@emails": path.resolve(__dirname, "../shared/emails"),
			"@store": path.resolve(__dirname, "../shared/store"),
			"@queries": path.resolve(__dirname, "../shared/queries"),
			"@actions": path.resolve(__dirname, "../shared/actions"),
			"@config": path.resolve(__dirname, "../../config"),
		};

		return config;
	},
};

export default nextConfig;
