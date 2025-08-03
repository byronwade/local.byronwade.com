import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true, // Re-enabled after fixing import issues

	// Configure webpack to handle SVG files properly
	webpack(config, { isServer }) {
		// Handle SVG files as React components
		config.module.rules.push({
			test: /\.svg$/,
			use: [
				{
					loader: "@svgr/webpack",
					options: {
						// Convert SVG to React components
						typescript: true,
						dimensions: false,
					},
				},
			],
		});

		return config;
	},

	// Next.js 15 Performance Optimizations
	experimental: {
		// Partial Prerendering (PPR) - Next.js 15 killer feature
		// Note: PPR is only available in canary versions, commented out for stable release
		// ppr: "incremental",

		// Package import optimizations (tree shaking)
		optimizePackageImports: ["lucide-react", "@radix-ui/react-icons", "react-icons", "framer-motion"],

		// Memory optimizations
		memoryBasedWorkersCount: true,

		// CSS optimizations
		optimizeCss: true,
	},

	// Turbopack configuration (moved from experimental.turbo)
	turbopack: {
		rules: {
			// Custom loader optimizations (updated syntax)
			"*.svg": ["@svgr/webpack"],
		},
		resolveAlias: {
			// Faster alias resolution
			"@": path.join(__dirname, "."),
			"@lib": path.join(__dirname, "lib"),
			"@components": path.join(__dirname, "components"),
		},
	},

	// React Server Components optimizations (moved from experimental)
	serverExternalPackages: ["@supabase/supabase-js", "sharp"],

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
		// Skip optimization for problematic external domains to prevent errors
		unoptimized: false,
		remotePatterns: [
			// Specific reliable image sources (more secure than **)
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "via.placeholder.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "source.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "loremflickr.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "images.pexels.com",
				port: "",
				pathname: "/**",
			},
			// Local development and production domains
			{
				protocol: "https",
				hostname: "local.byronwade.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "www.thorbis.com",
				port: "",
				pathname: "/**",
			},
			// Vercel avatar API for user profile fallbacks
			{
				protocol: "https",
				hostname: "vercel.com",
				port: "",
				pathname: "/api/www/avatar*",
			},
		],
		// Handle image loading errors gracefully
		loader: "default",
		path: "/_next/image",
	},

	// Maximum compression and optimization
	compress: true,
	poweredByHeader: false,
	generateEtags: true,
	trailingSlash: false,

	// Webpack optimizations for production performance
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// Performance budgets (enforce build-time limits)
		config.performance = {
			maxAssetSize: 250000, // 250KB max asset size
			maxEntrypointSize: 500000, // 500KB max entry point
			hints: dev ? false : "error", // Fail build if exceeded in production
		};

		// Aggressive optimization for production
		if (!dev) {
			config.optimization = {
				...config.optimization,

				// Better chunk splitting
				splitChunks: {
					chunks: "all",
					cacheGroups: {
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name: "vendors",
							chunks: "all",
							maxSize: 100000, // 100KB vendor chunks
						},
						common: {
							name: "common",
							minChunks: 2,
							chunks: "all",
							enforce: true,
							maxSize: 50000, // 50KB common chunks
						},
					},
				},

				// Module concatenation for better tree shaking
				concatenateModules: true,

				// Remove duplicate modules
				mergeDuplicateChunks: true,

				// Minimize module IDs
				moduleIds: "deterministic",
				chunkIds: "deterministic",
			};

			// Compression plugins
			config.plugins.push(
				// Bundle analyzer in CI/CD (optional)
				...(process.env.ANALYZE === "true"
					? [
							new (require("webpack-bundle-analyzer").BundleAnalyzerPlugin)({
								analyzerMode: "static",
								openAnalyzer: false,
								reportFilename: "bundle-analyzer.html",
							}),
						]
					: [])
			);
		}

		// SVG optimization
		config.module.rules.push({
			test: /\.svg$/,
			use: [
				{
					loader: "@svgr/webpack",
					options: {
						memo: true,
						dimensions: false,
						svgoConfig: {
							plugins: [
								{
									name: "preset-default",
									params: {
										overrides: {
											removeViewBox: false,
										},
									},
								},
							],
						},
					},
				},
			],
		});

		// Module federation for micro-frontends (temporarily disabled to fix React hooks issues)
		// TODO: Re-enable when React singleton conflicts are resolved
		// if (!isServer) {
		// 	config.plugins.push(
		// 		new webpack.container.ModuleFederationPlugin({
		// 			name: "local_byronwade",
		// 			filename: "remoteEntry.js",
		// 			exposes: {
		// 				"./BusinessCard": "./components/business/BusinessCard",
		// 				"./SearchBox": "./components/shared/searchBox",
		// 			},
		// 			shared: {
		// 				react: { singleton: true },
		// 				"react-dom": { singleton: true },
		// 			},
		// 		})
		// 	);
		// }

		return config;
	},

	// Output configuration for optimal serving
	output: "standalone",

	// Compiler optimizations
	compiler: {
		// Remove console.logs in production
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
					}
				: false,

		// React optimizations
		reactRemoveProperties:
			process.env.NODE_ENV === "production"
				? {
						properties: ["^data-test"],
					}
				: false,

		// Styled-jsx optimizations
		styledJsx: true,
	},

	// Caching configuration for optimal performance
	onDemandEntries: {
		// Cache entries for 60 seconds in development
		maxInactiveAge: 60 * 1000,
		pagesBufferLength: 2,
	},

	// Temporarily ignore TypeScript errors during build until we fix them
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},

	// Enhanced security and performance headers
	async headers() {
		return [
			// Performance-focused headers for static assets
			{
				source: "/_next/static/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable", // 1 year cache
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
				],
			},
			// Image optimization headers
			{
				source: "/(.+)\\.(jpg|jpeg|png|webp|avif|gif|ico|svg)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
					{
						key: "Vary",
						value: "Accept",
					},
				],
			},
			// CORS for API routes with performance headers
			{
				source: "/api/:path*",
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
						value: "Content-Type, Authorization, X-Preload, Cache-Control",
					},
					{
						key: "Cache-Control",
						value: "public, max-age=300, stale-while-revalidate=600", // 5min cache, 10min stale
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
				],
			},
			// Performance and security headers for all pages
			{
				source: "/(.*)",
				headers: [
					// Security headers
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					// Performance headers
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains",
					},
					// Font preloading removed to prevent 404 errors
					// Use next/font for optimal font loading instead
					// Performance hints
					{
						key: "X-Powered-By",
						value: "Next.js 15 + Turbopack",
					},
				],
			},
			// Instant navigation headers for business pages
			{
				source: "/biz/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=600, stale-while-revalidate=1800", // 10min cache, 30min stale
					},
					{
						key: "X-Instant-Load",
						value: "true",
					},
				],
			},
			// Search results with aggressive caching
			{
				source: "/search",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=300, stale-while-revalidate=900", // 5min cache, 15min stale
					},
					{
						key: "X-Instant-Search",
						value: "true",
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