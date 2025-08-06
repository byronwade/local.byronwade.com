/**
 * Smart SEO Wrapper Component
 * Intelligent SEO component that automatically optimizes pages
 *
 * Features:
 * - Automatic page type detection
 * - Dynamic metadata generation
 * - Comprehensive JSON-LD structured data
 * - Performance-optimized with caching
 * - Real-time SEO scoring and suggestions
 * - Industry-expert best practices
 *
 * Usage:
 * <SmartSEOWrapper type="business" data={businessData}>
 *   <YourPageContent />
 * </SmartSEOWrapper>
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { enterpriseSEO } from "@lib/utils/enterpriseSEO";
import { structuredDataGenerator } from "@lib/utils/structuredDataSchemas";
import { logger } from "@lib/utils/logger";

/**
 * Smart SEO Wrapper Component
 */
export default function SmartSEOWrapper({ children, type = "auto", data = {}, title, description, keywords = [], image, canonical, noIndex = false, breadcrumbs = [], customSchemas = [], enableAnalytics = true, performanceMode = "auto" }) {
	const pathname = usePathname();
	const [seoData, setSeoData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [seoScore, setSeoScore] = useState(null);

	// Auto-detect page type if not provided
	const detectedType = useMemo(() => {
		if (type !== "auto") return type;

		// Auto-detect based on pathname
		if (pathname === "/") return "home";
		if (pathname.startsWith("/business/")) return "business";
		if (pathname.startsWith("/blog/")) return "blog";
		if (pathname.startsWith("/events/")) return "event";
		if (pathname.startsWith("/categories/")) return "category";
		if (pathname.startsWith("/search")) return "search";
		if (pathname.startsWith("/user/")) return "user-profile";
		if (pathname.includes("localhub")) return "local-hub";
		if (pathname.includes("review")) return "review";
		if (pathname.includes("faq")) return "faq";
		if (pathname.includes("how-to") || pathname.includes("help")) return "how-to";

		return "static";
	}, [type, pathname]);

	// Generate page configuration
	const pageConfig = useMemo(
		() => ({
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
		}),
		[detectedType, data, pathname, title, description, keywords, image, canonical, noIndex, breadcrumbs, customSchemas]
	);

	// Generate SEO data
	useEffect(() => {
		async function generateSEO() {
			const startTime = performance.now();
			setIsLoading(true);

			try {
				// Generate metadata
				const metadata = await enterpriseSEO.generatePageMetadata(pageConfig);

				// Generate structured data
				const structuredData = await structuredDataGenerator.generateStructuredData(pageConfig);

				// Combine data
				const seoResult = {
					metadata,
					structuredData,
					generatedAt: Date.now(),
				};

				setSeoData(seoResult);

				// Calculate SEO score if analytics enabled
				if (enableAnalytics) {
					const score = calculateSEOScore(seoResult, pageConfig);
					setSeoScore(score);
				}

				const duration = performance.now() - startTime;
				logger.performance(`Smart SEO generated in ${duration.toFixed(2)}ms for ${detectedType}`);
			} catch (error) {
				logger.error("Smart SEO generation failed:", error);

				// Fallback to basic SEO
				setSeoData({
					metadata: {
						title: title || "Local ByteRover Directory",
						description: description || "Discover local businesses and community resources",
					},
					structuredData: null,
				});
			} finally {
				setIsLoading(false);
			}
		}

		generateSEO();
	}, [pageConfig, enableAnalytics]);

	// Inject structured data into head
	useEffect(() => {
		if (!seoData?.structuredData) return;

		const scriptIds = [];

		try {
			// Handle single schema or multiple schemas
			const schemas = Array.isArray(seoData.structuredData) ? seoData.structuredData : [seoData.structuredData];

			schemas.forEach((schema, index) => {
				const scriptId = `structured-data-${detectedType}-${index}`;

				// Remove existing script if present
				const existingScript = document.getElementById(scriptId);
				if (existingScript) {
					existingScript.remove();
				}

				// Create new script element
				const script = document.createElement("script");
				script.id = scriptId;
				script.type = "application/ld+json";
				script.textContent = JSON.stringify(schema, null, 0); // Minified JSON

				// Add to head
				document.head.appendChild(script);
				scriptIds.push(scriptId);
			});

			logger.debug(`Injected ${schemas.length} structured data schemas for ${detectedType}`);
		} catch (error) {
			logger.error("Failed to inject structured data:", error);
		}

		// Cleanup function
		return () => {
			scriptIds.forEach((id) => {
				const script = document.getElementById(id);
				if (script) {
					script.remove();
				}
			});
		};
	}, [seoData?.structuredData, detectedType]);

	// Update meta tags dynamically
	useEffect(() => {
		if (!seoData?.metadata) return;

		const { metadata } = seoData;

		try {
			// Update document title
			if (metadata.title) {
				document.title = metadata.title;
			}

			// Update meta description
			updateMetaTag("description", metadata.description);

			// Update meta keywords
			if (metadata.keywords) {
				updateMetaTag("keywords", metadata.keywords);
			}

			// Update canonical URL
			if (metadata.alternates?.canonical) {
				updateLinkTag("canonical", metadata.alternates.canonical);
			}

			// Update Open Graph tags
			if (metadata.openGraph) {
				Object.entries(metadata.openGraph).forEach(([key, value]) => {
					if (value && typeof value === "string") {
						updateMetaTag(`og:${key}`, value, "property");
					} else if (key === "images" && Array.isArray(value)) {
						value.forEach((img, index) => {
							if (index === 0) {
								// Only use first image for meta tag
								updateMetaTag("og:image", img.url || img, "property");
								updateMetaTag("og:image:width", img.width || "1200", "property");
								updateMetaTag("og:image:height", img.height || "630", "property");
								updateMetaTag("og:image:alt", img.alt || metadata.title, "property");
							}
						});
					}
				});
			}

			// Update Twitter Card tags
			if (metadata.twitter) {
				Object.entries(metadata.twitter).forEach(([key, value]) => {
					if (value && typeof value === "string") {
						updateMetaTag(`twitter:${key}`, value);
					} else if (key === "images" && Array.isArray(value)) {
						if (value[0]) {
							updateMetaTag("twitter:image", value[0].url || value[0]);
							updateMetaTag("twitter:image:alt", value[0].alt || metadata.title);
						}
					}
				});
			}

			// Update robots meta tag
			if (metadata.robots) {
				const robotsContent =
					typeof metadata.robots === "object"
						? Object.entries(metadata.robots)
								.filter(([key, value]) => key !== "googleBot" && value)
								.map(([key, value]) => (value === true ? key : `${key}:${value}`))
								.join(", ")
						: metadata.robots;

				updateMetaTag("robots", robotsContent);
			}

			// Update additional meta tags
			if (metadata.other) {
				Object.entries(metadata.other).forEach(([key, value]) => {
					if (key.startsWith("article:") || key.startsWith("og:")) {
						updateMetaTag(key, value, "property");
					} else if (!key.includes("json")) {
						// Skip JSON-LD data
						updateMetaTag(key, value);
					}
				});
			}

			logger.debug("Dynamic meta tags updated for", detectedType);
		} catch (error) {
			logger.error("Failed to update meta tags:", error);
		}
	}, [seoData?.metadata, detectedType]);

	// Performance monitoring
	useEffect(() => {
		if (enableAnalytics && !isLoading) {
			// Track page view with SEO data
			const seoAnalytics = {
				pageType: detectedType,
				hasStructuredData: !!seoData?.structuredData,
				seoScore: seoScore?.overall || 0,
				loadTime: performance.now(),
				pathname,
			};

			logger.analytics("seo_page_view", seoAnalytics);
		}
	}, [enableAnalytics, isLoading, seoData, seoScore, detectedType, pathname]);

	// Render loading state or content
	if (performanceMode === "fast" || !isLoading) {
		return (
			<>
				{children}
				{enableAnalytics && seoScore && <SEOScoreIndicator score={seoScore} />}
			</>
		);
	}

	return (
		<>
			{isLoading && (
				<script
					dangerouslySetInnerHTML={{
						__html: `
							// SEO optimization in progress
							console.log('Smart SEO: Optimizing page for ${detectedType}');
						`,
					}}
				/>
			)}
			{children}
			{enableAnalytics && seoScore && <SEOScoreIndicator score={seoScore} />}
		</>
	);
}

/**
 * SEO Score Indicator Component (Development only)
 */
function SEOScoreIndicator({ score }) {
	if (process.env.NODE_ENV !== "development") return null;

	const getScoreColor = (score) => {
		if (score >= 90) return "#10b981"; // green
		if (score >= 70) return "#f59e0b"; // yellow
		return "#ef4444"; // red
	};

	return (
		<div
			style={{
				position: "fixed",
				bottom: "20px",
				right: "20px",
				background: "#000",
				color: "#fff",
				padding: "10px",
				borderRadius: "8px",
				fontSize: "12px",
				zIndex: 9999,
				boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
			}}
		>
			<div>
				SEO Score: <span style={{ color: getScoreColor(score.overall) }}>{score.overall}/100</span>
			</div>
			<div style={{ fontSize: "10px", marginTop: "4px" }}>
				Title: {score.title}/10 | Meta: {score.meta}/10 | Schema: {score.schema}/10
			</div>
		</div>
	);
}

/**
 * Utility Functions
 */
function updateMetaTag(name, content, attributeType = "name") {
	if (!content) return;

	let selector = `meta[${attributeType}="${name}"]`;
	let existingTag = document.querySelector(selector);

	if (existingTag) {
		existingTag.setAttribute("content", content);
	} else {
		const newTag = document.createElement("meta");
		newTag.setAttribute(attributeType, name);
		newTag.setAttribute("content", content);
		document.head.appendChild(newTag);
	}
}

function updateLinkTag(rel, href) {
	if (!href) return;

	let existingTag = document.querySelector(`link[rel="${rel}"]`);

	if (existingTag) {
		existingTag.setAttribute("href", href);
	} else {
		const newTag = document.createElement("link");
		newTag.setAttribute("rel", rel);
		newTag.setAttribute("href", href);
		document.head.appendChild(newTag);
	}
}

function calculateSEOScore(seoData, pageConfig) {
	const scores = {
		title: 0,
		meta: 0,
		schema: 0,
		images: 0,
		performance: 0,
	};

	const { metadata, structuredData } = seoData;

	// Title scoring (0-10)
	if (metadata.title) {
		scores.title = Math.min(10, metadata.title.length >= 30 && metadata.title.length <= 60 ? 10 : 5);
	}

	// Meta description scoring (0-10)
	if (metadata.description) {
		scores.meta = Math.min(10, metadata.description.length >= 120 && metadata.description.length <= 160 ? 10 : 6);
	}

	// Structured data scoring (0-10)
	if (structuredData) {
		scores.schema = Array.isArray(structuredData) ? Math.min(10, structuredData.length * 2) : 8;
	}

	// Images scoring (0-10)
	if (metadata.openGraph?.images || metadata.twitter?.images) {
		scores.images = 8;
	}

	// Performance scoring (0-10)
	scores.performance = 8; // Default good score

	// Calculate overall score
	const overall = Math.round(((scores.title + scores.meta + scores.schema + scores.images + scores.performance) / 5) * 2);

	return {
		overall,
		...scores,
	};
}
