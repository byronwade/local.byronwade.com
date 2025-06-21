import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	webpack: (config, { isServer }) => {
		// Disable webpack caching to fix build issues
		config.cache = false;

		// Minimal alias setup only
		config.resolve.alias = {
			...config.resolve.alias,
			"@components": path.resolve(__dirname, "components"),
			"@utils": path.resolve(__dirname, "lib/utils"),
			"@lib": path.resolve(__dirname, "lib"),
			"@styles": path.resolve(__dirname, "styles"),
			"@context": path.resolve(__dirname, "context"),
			"@hooks": path.resolve(__dirname, "hooks"),
			"@emails": path.resolve(__dirname, "emails"),
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
		];
	},
};

export default nextConfig;