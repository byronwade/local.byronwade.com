/**
 * Server-Side SEO Utilities for Next.js App Router
 * Generate metadata for Next.js generateMetadata function
 *
 * Features:
 * - Server-side metadata generation
 * - Performance-optimized with caching
 * - Type-safe metadata generation
 * - Comprehensive structured data injection
 * - Industry-expert SEO best practices
 */

import { EnterpriseSEOManager } from "./enterprise-seo";
import { StructuredDataGenerator } from "./structured-data-schemas";
import { cache } from "react";

// Initialize SEO managers
const seoManager = new EnterpriseSEOManager({
	siteName: "Thorbis",
	baseUrl: "https://thorbis.com",
	organization: "ByteRover LLC",
});

const schemaGenerator = new StructuredDataGenerator({
	name: "Thorbis",
	url: "https://thorbis.com",
	organization: "ByteRover LLC",
});

/**
 * Cached metadata generation for performance
 */
export const generateCachedMetadata = cache(async (pageConfig) => {
	return await seoManager.generatePageMetadata(pageConfig);
});

/**
 * Cached structured data generation
 */
export const generateCachedStructuredData = cache(async (pageConfig) => {
	return await schemaGenerator.generateStructuredData(pageConfig);
});

/**
 * Main server-side SEO generation function
 * Use this in your page's generateMetadata function
 */
export async function generateServerSEO(pageConfig) {
	try {
		// Validate pageConfig before processing
		if (!pageConfig || typeof pageConfig !== "object") {
			throw new Error("Invalid pageConfig provided to generateServerSEO");
		}

		// Generate base metadata with error handling
		let metadata;
		try {
			metadata = await generateCachedMetadata(pageConfig);
		} catch (metadataError) {
			console.warn("Failed to generate cached metadata, using fallback:", metadataError.message);
			metadata = {
				title: pageConfig?.data?.name ? `${pageConfig.data.name} | Local Business` : "Local Business Directory",
				description: pageConfig?.data?.description || "Discover local businesses and community resources in your area",
			};
		}

		// Generate structured data with error handling
		let structuredData;
		try {
			structuredData = await generateCachedStructuredData(pageConfig);
		} catch (structuredDataError) {
			console.warn("Failed to generate structured data:", structuredDataError.message);
			structuredData = null; // Continue without structured data
		}

		// Safely inject structured data into metadata
		if (structuredData) {
			try {
				const structuredDataJson = Array.isArray(structuredData) ? structuredData.map((schema) => JSON.stringify(schema, null, 0)).join("\n") : JSON.stringify(structuredData, null, 0);

				metadata.other = {
					...metadata.other,
					"application/ld+json": structuredDataJson,
				};
			} catch (jsonError) {
				console.warn("Failed to serialize structured data:", jsonError.message);
				// Continue without structured data
			}
		}

		return metadata;
	} catch (error) {
		console.error("Server SEO generation failed:", error);

		// Return comprehensive fallback metadata
		return {
			title: pageConfig?.data?.name ? `${pageConfig.data.name} | Local Business` : pageConfig?.title || "Local Business Directory",
			description: pageConfig?.data?.description || pageConfig?.description || "Discover local businesses and community resources in your area",
			keywords: ["local business", "directory", "services"],
			openGraph: {
				title: pageConfig?.data?.name || "Local Business Directory",
				description: pageConfig?.data?.description || "Discover local businesses and community resources",
				type: "website",
			},
		};
	}
}

/**
 * Generate metadata for Home page
 */
export async function generateHomeMetadata() {
	return generateServerSEO({
		type: "home",
		path: "/",
	});
}

/**
 * Generate metadata for Business page
 */
export async function generateBusinessMetadata(business, slug) {
	return generateServerSEO({
		type: "business",
		data: business,
		path: `/business/${slug}`,
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: "Businesses", url: "https://thorbis.com/business" },
			{ name: business.name, url: `https://thorbis.com/business/${slug}` },
		],
	});
}

/**
 * Generate metadata for Blog post
 */
export async function generateBlogMetadata(article, slug) {
	return generateServerSEO({
		type: "blog",
		data: article,
		path: `/blog/${slug}`,
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: "Blog", url: "https://thorbis.com/blog" },
			{ name: article.title, url: `https://thorbis.com/blog/${slug}` },
		],
	});
}

/**
 * Generate metadata for Event page
 */
export async function generateEventMetadata(event, slug) {
	return generateServerSEO({
		type: "event",
		data: event,
		path: `/events/${slug}`,
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: "Events", url: "https://thorbis.com/events" },
			{ name: event.title, url: `https://thorbis.com/events/${slug}` },
		],
	});
}

/**
 * Generate metadata for Category page
 */
export async function generateCategoryMetadata(category, slug) {
	return generateServerSEO({
		type: "category",
		data: category,
		path: `/categories/${slug}`,
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: "Categories", url: "https://thorbis.com/categories" },
			{ name: category.name, url: `https://thorbis.com/categories/${slug}` },
		],
	});
}

/**
 * Generate metadata for Search page
 */
export async function generateSearchMetadata(searchParams) {
	const { q: query, location, category } = searchParams;

	return generateServerSEO({
		type: "search",
		data: { query, location, category },
		path: `/search?q=${encodeURIComponent(query || "")}${location ? `&location=${encodeURIComponent(location)}` : ""}`,
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: "Search", url: "https://thorbis.com/search" },
		],
	});
}

/**
 * Generate metadata for User Profile page
 */
export async function generateUserProfileMetadata(user, slug) {
	return generateServerSEO({
		type: "user-profile",
		data: user,
		path: `/user/${slug}`,
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: "Users", url: "https://thorbis.com/user" },
			{ name: user.name, url: `https://thorbis.com/user/${slug}` },
		],
	});
}

/**
 * Generate metadata for Local Hub page
 */
export async function generateLocalHubMetadata(localHub, slug) {
	return generateServerSEO({
		type: "local-hub",
		data: localHub,
		path: `/localhub/${slug}`,
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: "Local Hubs", url: "https://thorbis.com/localhub" },
			{ name: localHub.name, url: `https://thorbis.com/localhub/${slug}` },
		],
	});
}

/**
 * Generate metadata for FAQ page
 */
export async function generateFAQMetadata(faqData) {
	return generateServerSEO({
		type: "faq",
		data: faqData,
		path: "/faq",
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: "FAQ", url: "https://thorbis.com/faq" },
		],
	});
}

/**
 * Generate metadata for static pages
 */
export async function generateStaticPageMetadata({ title, description, path, keywords = [] }) {
	return generateServerSEO({
		type: "static",
		data: { keywords },
		title,
		description,
		path,
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: title, url: `https://thorbis.com${path}` },
		],
	});
}

/**
 * Generate metadata for product pages
 */
export async function generateProductMetadata(product, slug) {
	return generateServerSEO({
		type: "product",
		data: product,
		path: `/products/${slug}`,
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: "Products", url: "https://thorbis.com/products" },
			{ name: product.name, url: `https://thorbis.com/products/${slug}` },
		],
	});
}

/**
 * Generate metadata for service pages
 */
export async function generateServiceMetadata(service, slug) {
	return generateServerSEO({
		type: "service",
		data: service,
		path: `/services/${slug}`,
		breadcrumbs: [
			{ name: "Home", url: "https://thorbis.com" },
			{ name: "Services", url: "https://thorbis.com/services" },
			{ name: service.name, url: `https://thorbis.com/services/${slug}` },
		],
	});
}

/**
 * Enhanced metadata generation with performance optimization
 */
export async function generateEnhancedMetadata(pageConfig, options = {}) {
	const { includeAlternates = true, includeIcons = true, includeManifest = true, customViewport = null } = options;

	const baseMetadata = await generateServerSEO(pageConfig);

	// Add enhanced metadata
	if (includeAlternates) {
		baseMetadata.alternates = {
			...baseMetadata.alternates,
			types: {
				"application/rss+xml": "https://thorbis.com/rss.xml",
			},
		};
	}

	if (includeIcons) {
		baseMetadata.icons = {
			icon: "/favicon.ico",
			shortcut: "/favicon.ico",
			apple: "/apple-touch-icon.png",
			other: [
				{
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					url: "/favicon-32x32.png",
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "16x16",
					url: "/favicon-16x16.png",
				},
			],
		};
	}

	if (includeManifest) {
		baseMetadata.manifest = "/manifest.json";
	}

	if (customViewport) {
		baseMetadata.viewport = customViewport;
	}

	// Add performance optimizations
	baseMetadata.other = {
		...baseMetadata.other,
		"msapplication-TileColor": "#000000",
		"theme-color": "#000000",
		"format-detection": "telephone=no",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "default",
	};

	return baseMetadata;
}

/**
 * Batch metadata generation for multiple pages
 */
export async function generateBatchMetadata(pageConfigs) {
	const metadataPromises = pageConfigs.map((config) => generateServerSEO(config));
	return Promise.all(metadataPromises);
}

/**
 * Validate metadata for SEO compliance
 */
export function validateMetadata(metadata) {
	const issues = [];

	// Check title
	if (!metadata.title) {
		issues.push("Missing title");
	} else if (metadata.title.length > 60) {
		issues.push("Title too long (>60 characters)");
	} else if (metadata.title.length < 30) {
		issues.push("Title too short (<30 characters)");
	}

	// Check description
	if (!metadata.description) {
		issues.push("Missing description");
	} else if (metadata.description.length > 160) {
		issues.push("Description too long (>160 characters)");
	} else if (metadata.description.length < 120) {
		issues.push("Description too short (<120 characters)");
	}

	// Check images
	if (!metadata.openGraph?.images && !metadata.twitter?.images) {
		issues.push("Missing Open Graph/Twitter images");
	}

	// Check canonical URL
	if (!metadata.alternates?.canonical) {
		issues.push("Missing canonical URL");
	}

	return {
		isValid: issues.length === 0,
		issues,
		score: Math.max(0, 100 - issues.length * 10),
	};
}

/**
 * Sitemap generation helper
 */
export function generateSitemapUrls(pages) {
	const baseUrl = "https://thorbis.com";

	return pages.map((page) => ({
		url: `${baseUrl}${page.path}`,
		lastModified: page.updatedAt || page.createdAt || new Date(),
		changeFrequency: page.changeFrequency || "monthly",
		priority: page.priority || 0.8,
	}));
}

/**
 * Robots.txt generation helper
 */
export function generateRobotsRules() {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/dashboard/", "/admin/"],
			},
			{
				userAgent: "GPTBot",
				disallow: "/",
			},
		],
		sitemap: "https://thorbis.com/sitemap.xml",
	};
}
