import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		// ppr: "incremental",
		turbo: {
			resolveAlias: {
				"@components": path.resolve(__dirname, "src/components"),
				"@utils": path.resolve(__dirname, "src/lib/utils"),
				"@lib": path.resolve(__dirname, "src/lib"),
				"@styles": path.resolve(__dirname, "src/styles"),
				"@context": path.resolve(__dirname, "src/context"),
				"@hooks": path.resolve(__dirname, "src/hooks"),
				"@emails": path.resolve(__dirname, "src/emails"),
				"@stores": path.resolve(__dirname, "src/stores"),
			},
			resolveExtensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
		},
	},
	reactStrictMode: true,
	env: {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "rebuzzle.vercel.app",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "wdiuscbddaxckemvrvva.supabase.co",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "flowbite.s3.amazonaws.com",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "via.placeholder.com",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
				pathname: "**",
			},
		],
	},
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"@components": path.resolve(__dirname, "src/components"),
			"@utils": path.resolve(__dirname, "src/lib/utils"),
			"@lib": path.resolve(__dirname, "src/lib"),
			"@styles": path.resolve(__dirname, "src/styles"),
			"@context": path.resolve(__dirname, "src/context"),
			"@hooks": path.resolve(__dirname, "src/hooks"),
			"@emails": path.resolve(__dirname, "src/emails"),
			"@stores": path.resolve(__dirname, "src/stores"),
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
						value: "*", // Set your origin
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
