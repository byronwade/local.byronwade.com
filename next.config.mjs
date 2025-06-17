import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		// ppr: "incremental",
		turbo: {
			resolveAlias: {
				"@components": path.resolve(__dirname, "components"),
				"@utils": path.resolve(__dirname, "lib/utils"),
				"@lib": path.resolve(__dirname, "lib"),
				"@styles": path.resolve(__dirname, "styles"),
				"@context": path.resolve(__dirname, "context"),
				"@hooks": path.resolve(__dirname, "hooks"),
				"@emails": path.resolve(__dirname, "emails"),
				"@store": path.resolve(__dirname, "store"),
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
				hostname: "img.cdn4dd.com",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "occ-0-8236-37.1.nflxso.net",
				port: "",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "images.pexels.com",
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
			{
				protocol: "https",
				hostname: "picsum.photos",
				port: "",
				pathname: "**",
			},
		],
	},
	webpack: (config) => {
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
