/**
 * Enhanced Next.js Configuration for Maximum Performance
 *
 * Integrates all experimental performance optimizations:
 * - Advanced bundling strategies
 * - Experimental React features
 * - Server-side optimizations
 * - Edge runtime optimizations
 * - Progressive enhancement
 */

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Performance-first Next.js configuration
 */
export function createEnhancedNextConfig(baseConfig = {}) {
        const isProduction = process.env.NODE_ENV === "production";
        const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
        // Parallel server optimizations require build workers which aren't
        // available in all environments (e.g. local `vercel build`). Only
        // enable the feature when explicitly requested via environment flag.
        const hasBuildWorkers = Boolean(process.env.NEXT_BUILD_WORKERS);

	return {
		...baseConfig,

		// React 19 and Next.js 15 optimizations
		reactStrictMode: false, // Disabled for performance in production
		poweredByHeader: false,
		compress: true,
		httpAgentOptions: { keepAlive: true },

		// Experimental features for maximum performance
		experimental: {
			// React 19 features
			reactCompiler: true,

			// Partial Pre-rendering for instant loading
			ppr: true,

                        // Parallel route optimizations - only enable when build workers are available
                        ...(hasBuildWorkers
                                ? { parallelServerBuildTraces: true, parallelServerCompiles: true }
                                : {}),

			// Advanced bundling
			optimizePackageImports: ["@radix-ui/react-icons", "lucide-react", "@react-three/drei", "@react-three/fiber", "framer-motion", "date-fns", "lodash"],

			// Advanced CSS optimizations
			optimizeCss: true,

			// Memory optimizations
			workerThreads: false,

			// Advanced page data budget
			largePageDataBytes: 256 * 1024, // 256KB
		},

		// Turbopack configuration (moved from experimental)
		turbopack: {
			rules: {
				// Optimize common file types
				"*.svg": {
					loaders: ["@svgr/webpack"],
					as: "*.js",
				},
			},
			resolveAlias: {
				"@": path.resolve(__dirname, "../../../"),
				"@components": path.resolve(__dirname, "../../../src/components"),
				"@lib": path.resolve(__dirname, "../../../src/lib"),
				"@performance": path.resolve(__dirname, "../../../src/lib/performance"),
			},
		},

		// Advanced bundling configuration
		webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
			// Performance-first optimizations
			if (isProduction) {
				// Advanced code splitting
				config.optimization = {
					...config.optimization,
					splitChunks: {
						chunks: "all",
						minSize: 20000,
						maxSize: 200000,
						cacheGroups: {
							// Vendor chunks
							vendor: {
								test: /[\\/]node_modules[\\/]/,
								name: "vendors",
								chunks: "all",
								priority: 10,
								maxSize: 150000,
							},

							// React chunks
							react: {
								test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
								name: "react",
								chunks: "all",
								priority: 20,
								maxSize: 100000,
							},

							// UI library chunks
							ui: {
								test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
								name: "ui",
								chunks: "all",
								priority: 15,
								maxSize: 80000,
							},

							// Performance library chunks
							performance: {
								test: /[\\/]src[\\/]lib[\\/]performance[\\/]/,
								name: "performance",
								chunks: "all",
								priority: 25,
							},

							// Common chunks
							common: {
								name: "common",
								minChunks: 2,
								chunks: "all",
								priority: 5,
								maxSize: 120000,
								reuseExistingChunk: true,
							},
						},
					},

					// Module concatenation
					concatenateModules: true,

					// Side effects optimization
					sideEffects: false,

					// Advanced minimization
					minimize: true,
					// minimizer: [
					// 	new (require("terser-webpack-plugin"))({
					// 		terserOptions: {
					// 			compress: {
					// 				drop_console: true,
					// 				drop_debugger: true,
					// 				passes: 2,
					// 			},
					// 			mangle: {
					// 				safari10: true,
					// 			},
					// 			format: {
					// 				comments: false,
					// 			},
					// 		},
					// 		extractComments: false,
					// 		parallel: true,
					// 	}),
					// ],
				};

				// Advanced caching
				config.cache = {
					type: "filesystem",
					version: buildId,
					cacheDirectory: path.resolve(__dirname, "../../../.next/cache/webpack"),
					buildDependencies: {
						config: [__filename],
					},
				};

				// Performance budgets
				config.performance = {
					maxAssetSize: 200000, // 200KB
					maxEntrypointSize: 400000, // 400KB
					hints: isVercel ? "error" : "warning",
				};
			}

			// Tree shaking optimizations
			config.resolve.alias = {
				...config.resolve.alias,

				// Lodash tree shaking
				lodash: "lodash-es",

				// Performance library aliases
				"@performance": path.resolve(__dirname, "../../../src/lib/performance"),
			};

			// Module rules optimizations
			config.module.rules.push(
				// SVG optimization
				{
					test: /\.svg$/,
					use: [
						{
							loader: "@svgr/webpack",
							options: {
								svgo: true,
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
				},

				// Worker optimization
				{
					test: /\.worker\.(js|ts)$/,
					use: {
						loader: "worker-loader",
						options: {
							filename: "static/[hash].worker.js",
							publicPath: "/_next/",
						},
					},
				}
			);

			// Plugins for performance
			config.plugins.push(
				// Bundle analyzer (development) - disabled for ES module compatibility
				// ...(dev && process.env.ANALYZE === "true"
				// 	? [
				// 			new (require("webpack-bundle-analyzer").BundleAnalyzerPlugin)({
				// 				analyzerMode: "server",
				// 				openAnalyzer: false,
				// 			}),
				// 		]
				// 	: []),

				// Duplicate package checker - disabled for ES module compatibility
				// new (require("duplicate-package-checker-webpack-plugin"))({
				// 	verbose: true,
				// 	emitError: isProduction,
				// }),

				// Progress plugin for build monitoring
				new webpack.ProgressPlugin({
					activeModules: true,
					entries: true,
					modules: true,
					modulesCount: 5000,
					profile: false,
					dependencies: true,
					dependenciesCount: 10000,
					percentBy: null,
				})
			);

			return config;
		},

		// Advanced image optimization
		images: {
			...baseConfig.images,
			formats: ["image/avif", "image/webp"],
			minimumCacheTTL: isProduction ? 31536000 : 0, // 1 year in production
			deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
			imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
			dangerouslyAllowSVG: true,
			contentDispositionType: "attachment",
			contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

			// Loader configuration for performance
			loader: "default",
			loaderFile: "",

			// Domain optimization
			domains: [],
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

			// Optimization parameters
			unoptimized: false,
		},

		// Compiler optimizations
		compiler: {
			// Remove console.log in production
			removeConsole: isProduction
				? {
						exclude: ["error", "warn"],
					}
				: false,

			// React optimizations
			reactRemoveProperties: isProduction,

			// Emotion optimization
			emotion: true,

			// Styled-jsx optimization
			styledJsx: true,
		},

		// Output configuration
		output: isVercel ? "standalone" : undefined,

		// Advanced headers for performance
		async headers() {
			const headers = [
				// Security headers
				{
					key: "X-DNS-Prefetch-Control",
					value: "on",
				},
				{
					key: "X-XSS-Protection",
					value: "1; mode=block",
				},
				{
					key: "X-Frame-Options",
					value: "SAMEORIGIN",
				},
				{
					key: "X-Content-Type-Options",
					value: "nosniff",
				},
				{
					key: "Referrer-Policy",
					value: "origin-when-cross-origin",
				},

				// Performance headers
				{
					key: "X-Platform",
					value: "nextfaster",
				},
			];

			return [
				// Static assets
				{
					source: "/_next/static/(.*)",
					headers: [
						...headers,
						{
							key: "Cache-Control",
							value: "public, max-age=31536000, immutable",
						},
					],
				},

				// Images
				{
					source: "/images/(.*)",
					headers: [
						...headers,
						{
							key: "Cache-Control",
							value: "public, max-age=31536000, immutable",
						},
					],
				},

				// Service Worker
				{
					source: "/sw.js",
					headers: [
						...headers,
						{
							key: "Cache-Control",
							value: "public, max-age=0, must-revalidate",
						},
						{
							key: "Service-Worker-Allowed",
							value: "/",
						},
					],
				},

				// Manifest
				{
					source: "/manifest.json",
					headers: [
						...headers,
						{
							key: "Cache-Control",
							value: "public, max-age=86400", // 1 day
						},
						{
							key: "Content-Type",
							value: "application/manifest+json",
						},
					],
				},

				// API routes
				{
					source: "/api/(.*)",
					headers: [
						...headers,
						{
							key: "Cache-Control",
							value: "public, max-age=300, stale-while-revalidate=600",
						},
					],
				},
			];
		},

		// Rewrites for performance
		async rewrites() {
			return [
				// Service Worker registration
				{
					source: "/sw.js",
					destination: "/_next/static/sw.js",
				},
			];
		},

		// Redirects for SEO and performance
		async redirects() {
			return [
				// Redirect trailing slashes for consistency
				{
					source: "/((?!.*\\..*|_next).*?)/",
					destination: "/$1",
					permanent: true,
				},
			];
		},

		// TypeScript and ESLint configuration
		typescript: {
			ignoreBuildErrors: isProduction ? false : true,
		},

		eslint: {
			ignoreDuringBuilds: isProduction ? false : true,
		},

		// Advanced modular imports
		modularizeImports: {
			lodash: {
				transform: "lodash/{{member}}",
			},
			"date-fns": {
				transform: "date-fns/{{member}}",
			},
			"react-icons": {
				transform: "react-icons/{{member}}",
			},
			"lucide-react": {
				transform: "lucide-react/dist/esm/icons/{{member}}",
			},
			"@radix-ui/react-icons": {
				transform: "@radix-ui/react-icons/dist/{{member}}",
			},
		},

		// Server external packages for edge runtime
		serverExternalPackages: ["@supabase/supabase-js", "sharp", "three", "canvas"],

		// Environment variables for performance
		env: {
			NEXT_TELEMETRY_DISABLED: "1",
			PERFORMANCE_MONITORING: "true",
			EXPERIMENTAL_APIS: "true",
		},
	};
}

/**
 * Cache handler for advanced caching
 */
export class AdvancedCacheHandler {
	constructor(options) {
		this.options = options;
		this.cache = new Map();
		this.maxAge = options?.maxAge || 3600000; // 1 hour
	}

	async get(key) {
		const entry = this.cache.get(key);
		if (!entry) return null;

		if (Date.now() - entry.timestamp > this.maxAge) {
			this.cache.delete(key);
			return null;
		}

		return entry.data;
	}

	async set(key, data) {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	async revalidateTag(tag) {
		// Remove entries with matching tag
		for (const [key, entry] of this.cache) {
			if (entry.tags?.includes(tag)) {
				this.cache.delete(key);
			}
		}
	}
}

// Default export for better compatibility
export default { createEnhancedNextConfig, AdvancedCacheHandler };
