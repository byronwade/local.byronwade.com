/**
 * Advanced Server-Side SEO Integration
 *
 * Integrates all advanced SEO strategies with the existing server-side SEO system
 * for optimal performance and comprehensive optimization.
 */

import { generateServerSEO } from "./server-seo";
import { aiSearchOptimizer } from "./ai-search-optimization";
import { communitySEO } from "./community-seo";
import { topicalAuthority } from "./topical-authority";
import { seoAvalanche } from "./seo-avalanche";
import { organicGrowthMaster } from "./organic-growth-strategy";
import { seoPerformanceOptimizer, generateCachedBusinessSEO, generateCachedCategorySEO, generateCachedLocationSEO } from "./seo-performance-optimizer";
import { cache } from "react";
import { logger } from "./logger";

/**
 * Generate advanced server-side SEO with all optimization strategies
 */
export const generateAdvancedServerSEO = cache(async (pageConfig, options = {}) => {
	const startTime = performance.now();

	try {
		// Use performance optimizer for cached, optimized SEO generation
		if (options.enableAdvancedOptimization !== false) {
			const optimizedSEO = await seoPerformanceOptimizer.generateOptimizedSEO(pageConfig, {
				...options,
				cacheStrategy: "server", // Server-side caching strategy
			});

			// Enhance with base SEO metadata if needed
			const baseSEO = await generateServerSEO(pageConfig);
			const enhancedSEO = {
				...baseSEO,
				...optimizedSEO.metadata,
				structuredData: [...(baseSEO.structuredData || []), ...(optimizedSEO.structuredData ? [optimizedSEO.structuredData] : [])],
				performance: {
					...optimizedSEO.performance,
					serverGeneration: true,
					totalTime: performance.now() - startTime,
				},
			};

			logger.performance(`Advanced server SEO (optimized) generated in ${(performance.now() - startTime).toFixed(2)}ms`);
			return enhancedSEO;
		}

		// Fallback to base SEO if advanced optimization is disabled
		const baseSEO = await generateServerSEO(pageConfig);
		logger.performance(`Base server SEO generated in ${(performance.now() - startTime).toFixed(2)}ms`);
		return baseSEO;
	} catch (error) {
		logger.error("Advanced server SEO generation failed:", error);

		// Fallback to base SEO if performance optimizer fails
		try {
			const baseSEO = await generateServerSEO(pageConfig);
			return {
				...baseSEO,
				performance: {
					fallback: true,
					error: error.message,
					totalTime: performance.now() - startTime,
				},
			};
		} catch (fallbackError) {
			logger.error("Fallback server SEO also failed:", fallbackError);
			throw fallbackError;
		}
	}
});

/**
 * Generate advanced business metadata with all optimizations
 */
export async function generateAdvancedBusinessMetadata(business, options = {}) {
	const pageConfig = {
		type: "business",
		data: business,
		path: `/business/${business.slug}`,
		businessCategory: business.category,
		targetAudience: "customers",
		localArea: business.location || business.address,
	};

	return await generateAdvancedServerSEO(pageConfig, {
		enableAdvancedOptimization: true,
		enableAIOptimization: true,
		enableCommunityStrategy: true,
		enableTopicalAuthority: true,
		...options,
	});
}

/**
 * Generate advanced blog metadata with avalanche strategy
 */
export async function generateAdvancedBlogMetadata(article, options = {}) {
	const pageConfig = {
		type: "blog",
		data: article,
		path: `/blog/${article.slug}`,
		businessCategory: article.category || "general",
		targetAudience: "readers",
		contentIntent: "informational",
	};

	return await generateAdvancedServerSEO(pageConfig, {
		enableAdvancedOptimization: true,
		enableAIOptimization: true,
		enableAvalancheStrategy: true,
		enableTopicalAuthority: true,
		...options,
	});
}

/**
 * Generate advanced category metadata with topical authority
 */
export async function generateAdvancedCategoryMetadata(category, options = {}) {
	const pageConfig = {
		type: "category",
		data: category,
		path: `/categories/${category.slug}`,
		businessCategory: category.name,
		targetAudience: "service-seekers",
	};

	return await generateAdvancedServerSEO(pageConfig, {
		enableAdvancedOptimization: true,
		enableAIOptimization: true,
		enableTopicalAuthority: true,
		enableCommunityStrategy: true,
		...options,
	});
}

/**
 * Generate advanced event metadata
 */
export async function generateAdvancedEventMetadata(event, options = {}) {
	const pageConfig = {
		type: "event",
		data: event,
		path: `/events/${event.slug}`,
		businessCategory: event.category || "events",
		targetAudience: "event-attendees",
		localArea: event.location,
	};

	return await generateAdvancedServerSEO(pageConfig, {
		enableAdvancedOptimization: true,
		enableAIOptimization: true,
		enableCommunityStrategy: true,
		...options,
	});
}

/**
 * Generate advanced home page metadata
 */
export async function generateAdvancedHomeMetadata(options = {}) {
	const pageConfig = {
		type: "home",
		data: {},
		path: "/",
		businessCategory: "local-business-directory",
		targetAudience: "general-visitors",
	};

	return await generateAdvancedServerSEO(pageConfig, {
		enableAdvancedOptimization: true,
		enableAIOptimization: true,
		enableCommunityStrategy: true,
		enableTopicalAuthority: true,
		enableGrowthStrategy: true,
		...options,
	});
}

/**
 * Enhance base SEO with advanced optimizations
 */
function enhanceBaseSeOWithAdvanced(baseSEO, advancedOptimizations, pageConfig) {
	const enhanced = { ...baseSEO };

	// Enhance title with AI optimization
	if (advancedOptimizations.aiOptimization?.conversationalStructure) {
		enhanced.title = enhanceTitle(baseSEO.title, advancedOptimizations.aiOptimization);
	}

	// Enhance description with AI optimization
	if (advancedOptimizations.aiOptimization?.aiOptimizedMetaDescription) {
		enhanced.description = advancedOptimizations.aiOptimization.aiOptimizedMetaDescription.aiOptimized;
	}

	// Add advanced keywords
	const advancedKeywords = extractAdvancedKeywords(advancedOptimizations, pageConfig);
	if (advancedKeywords.length > 0) {
		enhanced.keywords = `${enhanced.keywords || ""}, ${advancedKeywords.join(", ")}`.trim().replace(/^,\s*/, "");
	}

	// Add advanced structured data
	const advancedSchemas = generateAdvancedStructuredData(advancedOptimizations, pageConfig);
	if (advancedSchemas.length > 0) {
		const existingSchemas = enhanced.other?.["application/ld+json"] ? JSON.parse(enhanced.other["application/ld+json"]) : [];

		const allSchemas = Array.isArray(existingSchemas) ? [...existingSchemas, ...advancedSchemas] : [existingSchemas, ...advancedSchemas];

		enhanced.other = {
			...enhanced.other,
			"application/ld+json": JSON.stringify(allSchemas, null, 0),
		};
	}

	// Add advanced meta tags
	enhanced.other = {
		...enhanced.other,
		...generateAdvancedMetaTags(advancedOptimizations, pageConfig),
	};

	return enhanced;
}

/**
 * Enhance title with AI optimization
 */
function enhanceTitle(baseTitle, aiOptimization) {
	if (!aiOptimization?.conversationalStructure?.questionHeadings?.length) {
		return baseTitle;
	}

	// Make title more conversational and AI-friendly while keeping it under 60 characters
	const conversationalTitle = baseTitle.replace(/\b(Best|Top|Guide)\b/g, (match) => {
		return match === "Best" ? "Best" : match === "Top" ? "Top" : "Complete Guide to";
	});

	return conversationalTitle.length <= 60 ? conversationalTitle : baseTitle;
}

/**
 * Extract advanced keywords from all optimizations
 */
function extractAdvancedKeywords(optimizations, pageConfig) {
	const keywords = new Set();

	// Add AI optimization keywords
	if (optimizations.aiOptimization?.semanticKeywords) {
		optimizations.aiOptimization.semanticKeywords.forEach((kw) => keywords.add(kw));
	}

	// Add topical authority keywords
	if (optimizations.authorityData?.semanticOptimization?.semanticKeywords) {
		optimizations.authorityData.semanticOptimization.semanticKeywords.forEach((kw) => keywords.add(kw));
	}

	// Add community-based keywords
	if (optimizations.communityStrategy?.reddit_strategy?.content_types) {
		const communityKeywords = ["community discussion", "expert advice", "user experience", "authentic reviews"];
		communityKeywords.forEach((kw) => keywords.add(kw));
	}

	// Add avalanche keywords
	if (optimizations.avalancheData?.keywordSuggestions) {
		Object.values(optimizations.avalancheData.keywordSuggestions)
			.flat()
			.forEach((kw) => keywords.add(kw));
	}

	return Array.from(keywords).slice(0, 10); // Limit to 10 additional keywords
}

/**
 * Generate advanced structured data
 */
function generateAdvancedStructuredData(optimizations, pageConfig) {
	const schemas = [];

	// Add AI optimization schema
	if (optimizations.aiOptimization) {
		schemas.push({
			"@type": "AIOptimizedContent",
			optimizedFor: ["ChatGPT", "Perplexity", "Claude", "Bard"],
			contentStructure: "conversational",
			entityOptimized: true,
		});
	}

	// Add community optimization schema
	if (optimizations.communityStrategy) {
		schemas.push({
			"@type": "CommunityEngagement",
			platforms: ["Reddit", "Quora", "Forums"],
			strategy: "authentic-value-first",
			authorityBuilding: true,
		});
	}

	// Add topical authority schema
	if (optimizations.authorityData) {
		schemas.push({
			"@type": "TopicalAuthority",
			domain: pageConfig.businessCategory || "general",
			authorityLevel: "building",
			topicClusters: optimizations.authorityData.topicClusters?.size || 0,
		});
	}

	return schemas;
}

/**
 * Generate advanced meta tags
 */
function generateAdvancedMetaTags(optimizations, pageConfig) {
	const metaTags = {};

	// AI optimization meta tags
	if (optimizations.aiOptimization) {
		metaTags["ai-optimized"] = "true";
		metaTags["optimization-level"] = "advanced";
	}

	// Community strategy meta tags
	if (optimizations.communityStrategy) {
		metaTags["community-strategy"] = "active";
		metaTags["reddit-optimized"] = "true";
	}

	// Topical authority meta tags
	if (optimizations.authorityData) {
		metaTags["topical-authority"] = "building";
		metaTags["entity-optimized"] = "true";
	}

	// Growth strategy meta tags
	if (optimizations.growthData) {
		metaTags["organic-growth"] = "optimized";
		metaTags["zero-budget-strategy"] = "active";
	}

	return metaTags;
}
