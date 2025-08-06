/**
 * Advanced SEO Optimization Utility
 * Enterprise-level SEO implementation inspired by NextFaster and grep.app
 *
 * Features:
 * - Dynamic meta tag generation
 * - Advanced structured data (JSON-LD)
 * - Open Graph and Twitter optimization
 * - Core Web Vitals SEO integration
 * - International SEO support
 * - Performance-optimized meta injection
 */

import { logger } from "@lib/utils/logger";

/**
 * Advanced SEO Manager
 */
export class AdvancedSEOManager {
	constructor(options = {}) {
		this.baseUrl = options.baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://local.byronwade.com";
		this.siteName = options.siteName || "Thorbis";
		this.defaultLanguage = options.defaultLanguage || "en";
		this.twitterHandle = options.twitterHandle || "@thorbis";
		this.facebookAppId = options.facebookAppId || "";
	}

	/**
	 * Generate comprehensive metadata for Next.js
	 */
	generateMetadata({ title, description, keywords = [], path = "/", image, imageAlt, type = "website", publishedTime, modifiedTime, author, section, tags = [], noIndex = false, canonical, alternates = {}, structuredData, breadcrumbs = [] }) {
		const url = `${this.baseUrl}${path}`;
		const canonicalUrl = canonical || url;

		// Core metadata
		const metadata = {
			title: this.formatTitle(title),
			description: this.formatDescription(description),
			keywords: keywords.length > 0 ? keywords.join(", ") : undefined,

			// Canonical and robots
			alternates: {
				canonical: canonicalUrl,
				...alternates,
			},
			robots: this.generateRobotsConfig(noIndex),

			// Open Graph
			openGraph: this.generateOpenGraph({
				title,
				description,
				url,
				image,
				imageAlt,
				type,
				publishedTime,
				modifiedTime,
				author,
				section,
				tags,
			}),

			// Twitter
			twitter: this.generateTwitterCard({
				title,
				description,
				image,
				imageAlt,
			}),

			// Additional meta
			formatDetection: {
				email: false,
				address: false,
				telephone: false,
			},

			// Generator and application info
			generator: "Next.js",
			applicationName: this.siteName,
			referrer: "origin-when-cross-origin",

			// Authors
			authors: author ? [{ name: author, url: this.baseUrl }] : undefined,

			// Category
			category: section || "directory",
		};

		// Add structured data if provided
		if (structuredData) {
			metadata.other = {
				"application/ld+json": JSON.stringify(structuredData),
			};
		}

		// Add breadcrumbs structured data
		if (breadcrumbs.length > 0) {
			const breadcrumbsLD = this.generateBreadcrumbsLD(breadcrumbs);
			metadata.other = {
				...metadata.other,
				"breadcrumbs-ld+json": JSON.stringify(breadcrumbsLD),
			};
		}

		return metadata;
	}

	/**
	 * Generate business-specific structured data
	 */
	generateBusinessStructuredData({ name, description, address, phone, email, website, image, rating, reviewCount, priceRange, openingHours, categories, coordinates, socialProfiles = [] }) {
		const business = {
			"@context": "https://schema.org",
			"@type": "LocalBusiness",
			name,
			description,
			url: website || this.baseUrl,

			// Contact info
			telephone: phone,
			email,

			// Address
			address: address
				? {
						"@type": "PostalAddress",
						streetAddress: address.street,
						addressLocality: address.city,
						addressRegion: address.state,
						postalCode: address.postalCode,
						addressCountry: address.country || "US",
					}
				: undefined,

			// Geographic coordinates
			geo: coordinates
				? {
						"@type": "GeoCoordinates",
						latitude: coordinates.lat,
						longitude: coordinates.lng,
					}
				: undefined,

			// Images
			image: image ? [image] : undefined,

			// Ratings and reviews
			aggregateRating: rating
				? {
						"@type": "AggregateRating",
						ratingValue: rating,
						reviewCount,
						bestRating: 5,
						worstRating: 1,
					}
				: undefined,

			// Price range
			priceRange,

			// Opening hours
			openingHoursSpecification: openingHours ? this.formatOpeningHours(openingHours) : undefined,

			// Categories
			serviceType: categories,

			// Social media
			sameAs: socialProfiles,
		};

		return this.cleanStructuredData(business);
	}

	/**
	 * Generate article structured data
	 */
	generateArticleStructuredData({ headline, description, image, author, publishedTime, modifiedTime, section, tags = [], url }) {
		const article = {
			"@context": "https://schema.org",
			"@type": "Article",
			headline,
			description,
			image: image ? [image] : undefined,

			author: author
				? {
						"@type": "Person",
						name: author,
					}
				: undefined,

			publisher: {
				"@type": "Organization",
				name: this.siteName,
				logo: {
					"@type": "ImageObject",
					url: `${this.baseUrl}/logo.png`,
				},
			},

			datePublished: publishedTime,
			dateModified: modifiedTime || publishedTime,

			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": url,
			},

			articleSection: section,
			keywords: tags.join(", "),
		};

		return this.cleanStructuredData(article);
	}

	/**
	 * Generate breadcrumbs structured data
	 */
	generateBreadcrumbsLD(breadcrumbs) {
		return {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: breadcrumbs.map((crumb, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: crumb.name,
				item: `${this.baseUrl}${crumb.path}`,
			})),
		};
	}

	/**
	 * Generate FAQ structured data
	 */
	generateFAQStructuredData(faqs) {
		return {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: faqs.map((faq) => ({
				"@type": "Question",
				name: faq.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: faq.answer,
				},
			})),
		};
	}

	/**
	 * Generate website structured data
	 */
	generateWebsiteStructuredData(searchUrl) {
		return {
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: this.siteName,
			url: this.baseUrl,
			potentialAction: searchUrl
				? {
						"@type": "SearchAction",
						target: {
							"@type": "EntryPoint",
							urlTemplate: `${this.baseUrl}${searchUrl}?q={search_term_string}`,
						},
						"query-input": "required name=search_term_string",
					}
				: undefined,
		};
	}

	/**
	 * Generate Open Graph metadata
	 */
	generateOpenGraph({ title, description, url, image, imageAlt, type, publishedTime, modifiedTime, author, section, tags }) {
		const og = {
			title: this.formatTitle(title),
			description: this.formatDescription(description),
			url,
			siteName: this.siteName,
			locale: this.defaultLanguage === "en" ? "en_US" : this.defaultLanguage,
			type,
		};

		// Add image if provided
		if (image) {
			og.images = [
				{
					url: image,
					alt: imageAlt || title,
					width: 1200,
					height: 630,
				},
			];
		}

		// Add article-specific fields
		if (type === "article") {
			og.publishedTime = publishedTime;
			og.modifiedTime = modifiedTime;
			og.authors = author ? [author] : undefined;
			og.section = section;
			og.tags = tags;
		}

		// Add business-specific fields
		if (type === "business.business") {
			og.businessContactData = {
				streetAddress: "", // Would be filled from business data
				locality: "",
				region: "",
				postalCode: "",
				countryName: "",
			};
		}

		return og;
	}

	/**
	 * Generate Twitter Card metadata
	 */
	generateTwitterCard({ title, description, image, imageAlt }) {
		const twitter = {
			card: image ? "summary_large_image" : "summary",
			title: this.formatTitle(title),
			description: this.formatDescription(description),
			creator: this.twitterHandle,
			site: this.twitterHandle,
		};

		if (image) {
			twitter.images = [image];
			if (imageAlt) {
				twitter.images = [{ url: image, alt: imageAlt }];
			}
		}

		return twitter;
	}

	/**
	 * Generate robots configuration
	 */
	generateRobotsConfig(noIndex) {
		const robots = {
			index: !noIndex,
			follow: !noIndex,
			googleBot: {
				index: !noIndex,
				follow: !noIndex,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		};

		return robots;
	}

	/**
	 * Format title with site name
	 */
	formatTitle(title) {
		if (!title) return this.siteName;
		if (title.includes(this.siteName)) return title;
		return `${title} | ${this.siteName}`;
	}

	/**
	 * Format and truncate description
	 */
	formatDescription(description) {
		if (!description) return "";
		if (description.length <= 160) return description;
		return `${description.substring(0, 157)}...`;
	}

	/**
	 * Format opening hours for structured data
	 */
	formatOpeningHours(hours) {
		const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

		return Object.entries(hours).map(([day, time]) => ({
			"@type": "OpeningHoursSpecification",
			dayOfWeek: days.find((d) => d.toLowerCase().startsWith(day.toLowerCase())),
			opens: time.open,
			closes: time.close,
		}));
	}

	/**
	 * Clean structured data by removing undefined values
	 */
	cleanStructuredData(data) {
		return JSON.parse(
			JSON.stringify(data, (key, value) => {
				return value === undefined ? undefined : value;
			})
		);
	}

	/**
	 * Inject structured data into page
	 */
	injectStructuredData(data, id = "structured-data") {
		if (typeof window === "undefined") return;

		try {
			// Remove existing structured data
			const existing = document.getElementById(id);
			if (existing) {
				existing.remove();
			}

			// Create new script tag
			const script = document.createElement("script");
			script.id = id;
			script.type = "application/ld+json";
			script.textContent = JSON.stringify(data);

			document.head.appendChild(script);

			logger.debug("Structured data injected:", data);
		} catch (error) {
			logger.error("Failed to inject structured data:", error);
		}
	}

	/**
	 * Update meta tags dynamically
	 */
	updateMetaTags(metadata) {
		if (typeof window === "undefined") return;

		try {
			// Update title
			if (metadata.title) {
				document.title = metadata.title;
			}

			// Update meta description
			this.updateMetaTag("description", metadata.description);

			// Update canonical URL
			this.updateLinkTag("canonical", metadata.alternates?.canonical);

			// Update Open Graph tags
			if (metadata.openGraph) {
				Object.entries(metadata.openGraph).forEach(([key, value]) => {
					this.updateMetaTag(`og:${key}`, value);
				});
			}

			// Update Twitter tags
			if (metadata.twitter) {
				Object.entries(metadata.twitter).forEach(([key, value]) => {
					this.updateMetaTag(`twitter:${key}`, value);
				});
			}

			logger.debug("Meta tags updated:", metadata);
		} catch (error) {
			logger.error("Failed to update meta tags:", error);
		}
	}

	/**
	 * Update individual meta tag
	 */
	updateMetaTag(name, content) {
		if (!content) return;

		let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);

		if (!meta) {
			meta = document.createElement("meta");
			meta.setAttribute(name.startsWith("og:") || name.startsWith("twitter:") ? "property" : "name", name);
			document.head.appendChild(meta);
		}

		meta.setAttribute("content", content);
	}

	/**
	 * Update link tag
	 */
	updateLinkTag(rel, href) {
		if (!href) return;

		let link = document.querySelector(`link[rel="${rel}"]`);

		if (!link) {
			link = document.createElement("link");
			link.setAttribute("rel", rel);
			document.head.appendChild(link);
		}

		link.setAttribute("href", href);
	}
}

// Export configured instance
export const seoManager = new AdvancedSEOManager({
	baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://local.byronwade.com",
	siteName: "Thorbis",
	twitterHandle: "@thorbis",
});

// Convenience functions
export const generateBusinessMetadata = (business) => {
	return seoManager.generateMetadata({
		title: `${business.name} - ${business.city}, ${business.state}`,
		description: business.description,
		path: `/biz/${business.slug}`,
		image: business.image,
		type: "business.business",
		structuredData: seoManager.generateBusinessStructuredData(business),
	});
};

export const generateArticleMetadata = (article) => {
	return seoManager.generateMetadata({
		title: article.title,
		description: article.excerpt,
		path: `/blog/${article.slug}`,
		image: article.featuredImage,
		type: "article",
		publishedTime: article.publishedAt,
		modifiedTime: article.updatedAt,
		author: article.author?.name,
		section: article.category,
		tags: article.tags,
		structuredData: seoManager.generateArticleStructuredData(article),
	});
};

export const generatePageMetadata = ({ title, description, path, structuredData }) => {
	return seoManager.generateMetadata({
		title,
		description,
		path,
		structuredData,
	});
};

export default seoManager;
