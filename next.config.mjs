import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	env: {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
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
				hostname: "example.com",
				port: "",
				pathname: "**",
			},
		],
	},
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "./"),
		};
		return config;
	},
};

export default nextConfig;
