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

	env: {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	},

	// Admin platform specific configuration
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Platform",
						value: "admin",
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
		// Alias for shared workspace
		config.resolve.alias["@shared"] = path.resolve(__dirname, "../shared");

		return config;
	},
};

export default nextConfig;
