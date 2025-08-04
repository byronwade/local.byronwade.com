"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";

// Import all advanced SEO systems
import { aiSearchOptimizer } from "@lib/utils/aiSearchOptimization";
import { seoAvalanche } from "@lib/utils/seoAvalanche";
import { communitySEO } from "@lib/utils/communitySEO";
import { topicalAuthority } from "@lib/utils/topicalAuthority";
import { organicGrowthMaster } from "@lib/utils/organicGrowthStrategy";
import { seoPerformanceOptimizer } from "@lib/utils/seoPerformanceOptimizer";

// Import existing SEO components
import SmartSEOWrapper from "./SmartSEOWrapper";
import { logger } from "@lib/utils/logger";

/**
 * Advanced SEO Wrapper Component
 *
 * Integrates all cutting-edge SEO strategies into a single component:
 * - AI Search Optimization (GEO)
 * - SEO Avalanche Technique
 * - Community-Based SEO
 * - Topical Authority Building
 * - Zero-Budget Organic Growth
 *
 * This component wraps the existing SmartSEOWrapper and adds
 * advanced optimization layers for 2025 SEO strategies.
 */
export default function AdvancedSEOWrapper({ children, type = "auto", data = {}, title, description, keywords = [], image, canonical, noIndex = false, breadcrumbs = [], customSchemas = [], enableAdvancedOptimization = true, enableAIOptimization = true, enableCommunityIntegration = true, enableTopicalAuthority = true, performanceMode = "auto" }) {
	const pathname = usePathname();

	// State for advanced optimizations
	const [advancedSeoData, setAdvancedSeoData] = useState(null);
	const [aiOptimizations, setAiOptimizations] = useState(null);
	const [communityData, setCommunityData] = useState(null);
	const [authorityData, setAuthorityData] = useState(null);
	const [growthStrategy, setGrowthStrategy] = useState(null);
	const [isAdvancedLoading, setIsAdvancedLoading] = useState(false);

	// Detect page type and create enhanced config
	const enhancedPageConfig = useMemo(() => {
		const detectedType = type !== "auto" ? type : _detectPageType(pathname);

		return {
			type: detectedType,
			data,
			path: pathname,
			title,
			description,
			keywords,
			image,
			canonical,
			noIndex,
			breadcrumbs,
			customSchemas,

			// Advanced context
			businessCategory: data.category || _extractCategoryFromPath(pathname),
			localArea: data.location || _extractLocationFromPath(pathname),
			targetAudience: data.audience || _inferAudienceFromType(detectedType),
			contentIntent: _analyzeContentIntent(detectedType, data),
			competitorContext: _analyzeCompetitorContext(detectedType, data),
		};
	}, [type, pathname, data, title, description, keywords, image, canonical, noIndex, breadcrumbs, customSchemas]);

	// Generate advanced SEO optimizations
	useEffect(() => {
		if (!enableAdvancedOptimization) return;

		async function generateAdvancedOptimizations() {
			setIsAdvancedLoading(true);

			try {
				// Use performance optimizer for cached, optimized SEO generation
				const optimizedSEO = await seoPerformanceOptimizer.generateOptimizedSEO(enhancedPageConfig, {
					enableAIOptimization,
					enableCommunityIntegration,
					enableTopicalAuthority,
					forceFresh: performanceMode === "development", // Force fresh in development
				});

				// Set individual optimization data for component state
				if (optimizedSEO.aiOptimization) {
					setAiOptimizations(optimizedSEO.aiOptimization);
				}

				if (optimizedSEO.communityStrategy) {
					setCommunityData(optimizedSEO.communityStrategy);
				}

				if (optimizedSEO.authorityStrategy) {
					setAuthorityData(optimizedSEO.authorityStrategy);
				}

				if (optimizedSEO.growthStrategy) {
					setGrowthStrategy(optimizedSEO.growthStrategy);
				}

				// Set complete advanced SEO data
				setAdvancedSeoData(optimizedSEO);

				// Log performance metrics
				const performanceReport = seoPerformanceOptimizer.getPerformanceReport();
				logger.performance("SEO Performance Report:", performanceReport);
			} catch (error) {
				logger.error("Advanced SEO optimization failed:", error);

				// Fallback to individual optimizations if performance optimizer fails
				try {
					logger.info("Falling back to direct optimization calls...");
					const fallbackOptimizations = {};

					if (enableAIOptimization) {
						fallbackOptimizations.aiOptimization = await aiSearchOptimizer.generateAIOptimizedContent(enhancedPageConfig);
						setAiOptimizations(fallbackOptimizations.aiOptimization);
					}

					if (enableCommunityIntegration) {
						fallbackOptimizations.communityStrategy = communitySEO.generateCommunityStrategy(enhancedPageConfig.data, enhancedPageConfig.targetAudience);
						setCommunityData(fallbackOptimizations.communityStrategy);
					}

					if (enableTopicalAuthority) {
						fallbackOptimizations.authorityStrategy = topicalAuthority.generateTopicalAuthorityStrategy(enhancedPageConfig.data, []);
						setAuthorityData(fallbackOptimizations.authorityStrategy);
					}

					fallbackOptimizations.growthStrategy = organicGrowthMaster.generateMasterGrowthPlan(enhancedPageConfig);
					setGrowthStrategy(fallbackOptimizations.growthStrategy);

					setAdvancedSeoData({ ...fallbackOptimizations, fallback: true });
				} catch (fallbackError) {
					logger.error("Fallback SEO optimization also failed:", fallbackError);
					setAdvancedSeoData({ error: true, message: fallbackError.message });
				}
			} finally {
				setIsAdvancedLoading(false);
			}
		}

		generateAdvancedOptimizations();
	}, [enhancedPageConfig, enableAdvancedOptimization, enableAIOptimization, enableCommunityIntegration, enableTopicalAuthority, performanceMode]);

	// Inject AI-optimized meta tags
	useEffect(() => {
		if (!aiOptimizations?.aiOptimizedMetaDescription) return;

		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription && aiOptimizations.aiOptimizedMetaDescription.aiOptimized) {
			metaDescription.setAttribute("content", aiOptimizations.aiOptimizedMetaDescription.aiOptimized);
		}

		// Add AI-specific meta tags
		_addAIOptimizedMetaTags(aiOptimizations);
	}, [aiOptimizations]);

	// Add advanced structured data
	useEffect(() => {
		if (!advancedSeoData) return;

		// Inject advanced community signals
		if (communityData?.reddit_strategy) {
			_addCommunitySignals(communityData);
		}

		// Inject topical authority signals
		if (authorityData?.entityOptimization) {
			_addTopicalAuthoritySignals(authorityData);
		}

		// Add organic growth tracking
		if (growthStrategy) {
			_addGrowthTrackingSignals(growthStrategy);
		}
	}, [advancedSeoData, communityData, authorityData, growthStrategy]);

	// Enhanced keywords with advanced optimizations
	const enhancedKeywords = useMemo(() => {
		let allKeywords = [...keywords];

		if (aiOptimizations?.semanticKeywords) {
			allKeywords = [...allKeywords, ...aiOptimizations.semanticKeywords];
		}

		if (authorityData?.semanticOptimization?.semanticKeywords) {
			allKeywords = [...allKeywords, ...authorityData.semanticOptimization.semanticKeywords];
		}

		// Remove duplicates and limit to reasonable number
		return [...new Set(allKeywords)].slice(0, 20);
	}, [keywords, aiOptimizations, authorityData]);

	// Enhanced breadcrumbs with topical authority
	const enhancedBreadcrumbs = useMemo(() => {
		let allBreadcrumbs = [...breadcrumbs];

		if (authorityData?.topicClusters && authorityData.topicClusters.size > 0) {
			// Add topic cluster breadcrumbs if relevant
			const relevantCluster = _findRelevantTopicCluster(enhancedPageConfig, authorityData.topicClusters);
			if (relevantCluster) {
				allBreadcrumbs = [...allBreadcrumbs, ...relevantCluster.breadcrumbs];
			}
		}

		return allBreadcrumbs;
	}, [breadcrumbs, authorityData, enhancedPageConfig]);

	// Show loading state if advanced optimizations are still processing
	if (isAdvancedLoading && performanceMode !== "fast") {
		return (
			<div className="advanced-seo-loading">
				<div className="flex items-center justify-center p-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					<span className="ml-2 text-sm text-muted-foreground">Optimizing for advanced SEO strategies...</span>
				</div>
				{children}
			</div>
		);
	}

	return (
		<>
			{/* Enhanced SEO Wrapper with advanced optimizations */}
			<SmartSEOWrapper type={enhancedPageConfig.type} data={enhancedPageConfig.data} title={title} description={description} keywords={enhancedKeywords} image={image} canonical={canonical} noIndex={noIndex} breadcrumbs={enhancedBreadcrumbs} customSchemas={[...customSchemas, ..._generateAdvancedSchemas(advancedSeoData)]} enableAnalytics={true} performanceMode={performanceMode}>
				{children}
			</SmartSEOWrapper>

			{/* Advanced SEO Debug Panel (Development Only) */}
			{process.env.NODE_ENV === "development" && advancedSeoData && <AdvancedSEODebugPanel seoData={advancedSeoData} pageConfig={enhancedPageConfig} aiOptimizations={aiOptimizations} communityData={communityData} authorityData={authorityData} growthStrategy={growthStrategy} />}
		</>
	);
}

/**
 * Development debug panel for advanced SEO
 */
function AdvancedSEODebugPanel({ seoData, pageConfig, aiOptimizations, communityData, authorityData, growthStrategy }) {
	const [isExpanded, setIsExpanded] = useState(false);

	if (!seoData) return null;

	return (
		<div className="fixed bottom-4 right-4 z-50">
			<button onClick={() => setIsExpanded(!isExpanded)} className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors" title="Advanced SEO Debug Panel">
				🚀
			</button>

			{isExpanded && (
				<div className="absolute bottom-12 right-0 bg-white border rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto">
					<h3 className="font-bold text-lg mb-2">Advanced SEO Debug</h3>

					<div className="space-y-2 text-sm">
						<div>
							<strong>Page Type:</strong> {pageConfig.type}
						</div>

						{aiOptimizations && (
							<div>
								<strong>AI Optimizations:</strong>
								<ul className="ml-4 list-disc">
									<li>Conversational Structure: ✅</li>
									<li>Entity Optimization: ✅</li>
									<li>Citation Framework: ✅</li>
									<li>Community Integration: ✅</li>
								</ul>
							</div>
						)}

						{communityData && (
							<div>
								<strong>Community SEO:</strong>
								<ul className="ml-4 list-disc">
									<li>Reddit Strategy: ✅</li>
									<li>Q&A Optimization: ✅</li>
									<li>UGC Amplification: ✅</li>
								</ul>
							</div>
						)}

						{authorityData && (
							<div>
								<strong>Topical Authority:</strong>
								<ul className="ml-4 list-disc">
									<li>Topic Clusters: ✅</li>
									<li>Entity Relationships: ✅</li>
									<li>Semantic Optimization: ✅</li>
								</ul>
							</div>
						)}

						{growthStrategy && (
							<div>
								<strong>Growth Strategy:</strong>
								<ul className="ml-4 list-disc">
									<li>Current Phase: {growthStrategy.currentPhase || "Foundation"}</li>
									<li>Traffic Target: {growthStrategy.trafficTargets?.["6_months"] || 5000}</li>
									<li>Optimization Level: Advanced</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

// Helper functions
function _detectPageType(pathname) {
	if (pathname === "/") return "home";
	if (pathname.startsWith("/business/")) return "business";
	if (pathname.startsWith("/blog/")) return "blog";
	if (pathname.startsWith("/events/")) return "event";
	if (pathname.startsWith("/categories/")) return "category";
	if (pathname.startsWith("/search")) return "search";
	if (pathname.startsWith("/user/")) return "user-profile";
	if (pathname.includes("localhub")) return "local-hub";
	if (pathname.includes("review")) return "review";
	return "static";
}

function _extractCategoryFromPath(pathname) {
	// Extract business category from URL structure
	const segments = pathname.split("/");
	if (segments[1] === "categories" && segments[2]) {
		return segments[2];
	}
	return "general";
}

function _extractLocationFromPath(pathname) {
	// Extract location from URL structure or data
	return "United States"; // Default - would be enhanced with actual location detection
}

function _inferAudienceFromType(type) {
	const audienceMapping = {
		business: "business-owners",
		blog: "general-public",
		event: "event-attendees",
		category: "service-seekers",
		search: "active-searchers",
		home: "general-visitors",
	};

	return audienceMapping[type] || "general-public";
}

function _analyzeContentIntent(type, data) {
	const intentMapping = {
		business: "commercial",
		blog: "informational",
		event: "transactional",
		category: "navigational",
		search: "investigational",
	};

	return intentMapping[type] || "informational";
}

function _analyzeCompetitorContext(type, data) {
	// Analyze competitive landscape for the content
	return {
		competitiveness: "medium",
		opportunities: ["featured-snippets", "ai-optimization", "community-engagement"],
		threats: ["established-competitors", "algorithm-changes"],
	};
}

function _addAIOptimizedMetaTags(aiOptimizations) {
	// Add AI-specific meta tags
	const head = document.head;

	// Add conversational meta tag
	const conversationalMeta = document.createElement("meta");
	conversationalMeta.name = "ai-optimized";
	conversationalMeta.content = "true";
	head.appendChild(conversationalMeta);

	// Add entity optimization signal
	if (aiOptimizations.entityOptimization) {
		const entityMeta = document.createElement("meta");
		entityMeta.name = "entity-optimized";
		entityMeta.content = "true";
		head.appendChild(entityMeta);
	}
}

function _addCommunitySignals(communityData) {
	// Add community engagement signals
	const head = document.head;

	const communitySEOMeta = document.createElement("meta");
	communitySEOMeta.name = "community-optimized";
	communitySEOMeta.content = "reddit,quora,forums";
	head.appendChild(communitySEOMeta);
}

function _addTopicalAuthoritySignals(authorityData) {
	// Add topical authority signals
	const head = document.head;

	const authorityMeta = document.createElement("meta");
	authorityMeta.name = "topical-authority";
	authorityMeta.content = "optimized";
	head.appendChild(authorityMeta);
}

function _addGrowthTrackingSignals(growthStrategy) {
	// Add organic growth tracking signals
	const head = document.head;

	const growthMeta = document.createElement("meta");
	growthMeta.name = "organic-growth-optimized";
	growthMeta.content = "true";
	head.appendChild(growthMeta);
}

function _generateAdvancedSchemas(advancedSeoData) {
	if (!advancedSeoData) return [];

	const schemas = [];

	// Add community-based schemas
	if (advancedSeoData.communityStrategy) {
		schemas.push({
			"@type": "CommunityOptimization",
			platforms: ["Reddit", "Quora", "Forums"],
			strategy: "authentic-engagement",
		});
	}

	// Add topical authority schemas
	if (advancedSeoData.authorityStrategy) {
		schemas.push({
			"@type": "TopicalAuthority",
			topics: advancedSeoData.authorityStrategy.topicClusters || [],
			expertise: "demonstrated",
		});
	}

	return schemas;
}

function _findRelevantTopicCluster(pageConfig, topicClusters) {
	// Find the most relevant topic cluster for breadcrumb enhancement
	for (const [clusterName, cluster] of topicClusters) {
		if (cluster.keywords?.some((keyword) => pageConfig.title?.toLowerCase().includes(keyword.toLowerCase()) || pageConfig.description?.toLowerCase().includes(keyword.toLowerCase()))) {
			return {
				name: clusterName,
				breadcrumbs: [
					{
						name: cluster.pillar || clusterName,
						url: `/topics/${clusterName}`,
					},
				],
			};
		}
	}
	return null;
}
