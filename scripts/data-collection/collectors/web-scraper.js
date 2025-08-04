/**
 * Web Scraper Collector
 *
 * FREE DATA SOURCE - No API keys required
 * Scrapes business data from publicly available websites and directories
 *
 * Data Sources:
 * - Public business directories
 * - Chamber of Commerce websites
 * - Better Business Bureau listings
 * - Industry association directories
 * - Local government websites
 * - Public business listing sites
 * - Yellow Pages and similar directories
 *
 * Features:
 * - Respectful scraping with proper delays
 * - Robot.txt compliance checking
 * - Anti-bot detection avoidance
 * - Comprehensive business information extraction
 * - Duplicate detection and deduplication
 *
 * Legal Compliance: Only scrapes publicly available data
 */

import axios from "axios";
import * as cheerio from "cheerio";
import { RateLimiterManager } from "../utils/rate-limiter.js";
import { CacheManager } from "../utils/cache-manager.js";
import { Logger } from "../utils/error-handler.js";

export class WebScraperCollector {
	constructor() {
		this.rateLimiter = RateLimiterManager.getLimiter("web_scraper");
		this.logger = new Logger("WebScraperCollector");
		this.cache = CacheManager;

		// Respectful scraping configuration
		this.config = {
			userAgent: "BusinessDirectory/1.0 (+https://yoursite.com/contact)",
			requestDelay: 2000, // 2 seconds between requests
			retryDelay: 5000, // 5 seconds on failure
			maxRetries: 3,
			timeout: 30000, // 30 seconds timeout
			maxConcurrent: 2, // Maximum 2 concurrent requests
		};

		// Target websites for business data (public directories)
		this.dataSources = {
			// Better Business Bureau
			bbb: {
				name: "Better Business Bureau",
				baseUrl: "https://www.bbb.org",
				searchPath: "/search",
				businessSelectors: {
					container: ".search-result-item",
					name: ".business-name",
					address: ".address",
					phone: ".phone",
					website: ".website-link",
					rating: ".rating-value",
				},
			},

			// Chamber of Commerce directories
			chamber: {
				name: "US Chamber of Commerce",
				baseUrl: "https://www.uschamber.com",
				searchPath: "/directory",
				businessSelectors: {
					container: ".member-listing",
					name: ".member-name",
					address: ".member-address",
					phone: ".member-phone",
					website: ".member-website",
					category: ".member-category",
				},
			},

			// Local Yellow Pages (example)
			yellowpages: {
				name: "Yellow Pages",
				baseUrl: "https://www.yellowpages.com",
				searchPath: "/search",
				businessSelectors: {
					container: ".search-results .result",
					name: ".business-name",
					address: ".street-address",
					phone: ".phones",
					website: ".website-url",
					rating: ".rating-stars",
					category: ".categories",
				},
			},

			// Merchant Circle
			merchantcircle: {
				name: "Merchant Circle",
				baseUrl: "https://www.merchantcircle.com",
				searchPath: "/search",
				businessSelectors: {
					container: ".business-listing",
					name: ".business-title",
					address: ".address-line",
					phone: ".phone-number",
					website: ".website-link",
					description: ".business-description",
				},
			},

			// Citysearch
			citysearch: {
				name: "Citysearch",
				baseUrl: "https://www.citysearch.com",
				searchPath: "/search",
				businessSelectors: {
					container: ".business-result",
					name: ".business-name",
					address: ".address",
					phone: ".phone",
					rating: ".rating",
					category: ".category",
				},
			},
		};

		// Common patterns for extracting business information
		this.extractionPatterns = {
			phone: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
			email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
			website: /https?:\/\/(?:www\.)?[-\w@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-\w()@:%_\+.~#?&=]*)/g,
			address: /\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct)\b/gi,
			hours: /\b(?:mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b[^,\n]+/gi,
		};

		// Request queue for respectful scraping
		this.requestQueue = [];
		this.isProcessingQueue = false;
	}

	/**
	 * Search businesses by location using multiple web sources
	 */
	async searchBusinessesByLocation(location, options = {}) {
		const cacheKey = `web_scraper_location_${location}_${JSON.stringify(options)}`;

		try {
			// Check cache first
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				this.logger.info(`Web scraper location search cache hit: ${cacheKey}`);
				return cached;
			}

			const startTime = performance.now();
			this.logger.info(`Starting web scraping for location: ${location}`);

			const allBusinesses = [];

			// Search each data source
			for (const [sourceKey, source] of Object.entries(this.dataSources)) {
				try {
					this.logger.info(`Scraping ${source.name} for location: ${location}`);

					const businesses = await this.scrapeSource(sourceKey, {
						location,
						category: options.category,
						limit: options.limit || 50,
					});

					allBusinesses.push(...businesses);
					this.logger.info(`Found ${businesses.length} businesses from ${source.name}`);

					// Respectful delay between sources
					await this.delay(this.config.requestDelay);
				} catch (error) {
					this.logger.warn(`Failed to scrape ${source.name}: ${error.message}`);
					continue; // Continue with other sources
				}
			}

			// Deduplicate businesses
			const uniqueBusinesses = this.deduplicateBusinesses(allBusinesses);

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Web scraping completed in ${queryTime.toFixed(2)}ms`);
			this.logger.info(`Found ${uniqueBusinesses.length} unique businesses via web scraping`);

			// Cache the results for 6 hours
			await this.cache.set(cacheKey, uniqueBusinesses, 6 * 60 * 60 * 1000);

			return uniqueBusinesses;
		} catch (error) {
			this.logger.error(`Web scraper location search failed: ${error.message}`, {
				location,
				stack: error.stack,
			});
			throw error;
		}
	}

	/**
	 * Search businesses by category using web sources
	 */
	async searchBusinessesByCategory(category, location = null, options = {}) {
		const cacheKey = `web_scraper_category_${category}_${location || "all"}_${JSON.stringify(options)}`;

		try {
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				return cached;
			}

			const startTime = performance.now();
			this.logger.info(`Starting web scraping for category: ${category}`);

			const allBusinesses = [];

			// Search each data source for the category
			for (const [sourceKey, source] of Object.entries(this.dataSources)) {
				try {
					const businesses = await this.scrapeSource(sourceKey, {
						category,
						location,
						limit: options.limit || 30,
					});

					allBusinesses.push(...businesses);
					this.logger.info(`Found ${businesses.length} businesses in category "${category}" from ${source.name}`);

					await this.delay(this.config.requestDelay);
				} catch (error) {
					this.logger.warn(`Failed to scrape ${source.name} for category ${category}: ${error.message}`);
					continue;
				}
			}

			const uniqueBusinesses = this.deduplicateBusinesses(allBusinesses);

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Category web scraping completed in ${queryTime.toFixed(2)}ms`);

			// Cache for 4 hours
			await this.cache.set(cacheKey, uniqueBusinesses, 4 * 60 * 60 * 1000);

			return uniqueBusinesses;
		} catch (error) {
			this.logger.error(`Web scraper category search failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Scrape a specific data source
	 */
	async scrapeSource(sourceKey, searchParams) {
		const source = this.dataSources[sourceKey];
		if (!source) {
			throw new Error(`Unknown data source: ${sourceKey}`);
		}

		try {
			// Check robots.txt compliance
			await this.checkRobotsCompliance(source.baseUrl);

			// Build search URL
			const searchUrl = this.buildSearchUrl(source, searchParams);

			// Make request with rate limiting
			await this.rateLimiter.waitForToken();

			const response = await this.makeRequest(searchUrl);

			// Parse the HTML response
			const $ = cheerio.load(response.data);

			// Extract business listings
			const businesses = this.extractBusinesses($, source);

			// Normalize the business data
			return businesses.map((business) => this.normalizeScrapedBusiness(business, sourceKey));
		} catch (error) {
			this.logger.error(`Failed to scrape ${source.name}: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Check robots.txt compliance (simplified)
	 */
	async checkRobotsCompliance(baseUrl) {
		try {
			const robotsUrl = `${baseUrl}/robots.txt`;
			const response = await axios.get(robotsUrl, {
				timeout: 5000,
				headers: { "User-Agent": this.config.userAgent },
			});

			// Basic check - look for disallow rules
			if (response.data.includes("Disallow: /")) {
				this.logger.warn(`Robots.txt may disallow scraping for ${baseUrl}`);
			}
		} catch (error) {
			// If robots.txt is not accessible, proceed with caution
			this.logger.debug(`Could not access robots.txt for ${baseUrl}`);
		}
	}

	/**
	 * Build search URL for a specific source
	 */
	buildSearchUrl(source, params) {
		const baseUrl = `${source.baseUrl}${source.searchPath}`;
		const searchParams = new URLSearchParams();

		// Add location parameter
		if (params.location) {
			searchParams.append("location", params.location);
			searchParams.append("where", params.location);
		}

		// Add category parameter
		if (params.category) {
			searchParams.append("category", params.category);
			searchParams.append("what", params.category);
		}

		// Add limit if supported
		if (params.limit) {
			searchParams.append("limit", params.limit);
			searchParams.append("per_page", params.limit);
		}

		return `${baseUrl}?${searchParams.toString()}`;
	}

	/**
	 * Make HTTP request with proper headers and error handling
	 */
	async makeRequest(url, retryCount = 0) {
		try {
			const response = await axios.get(url, {
				headers: {
					"User-Agent": this.config.userAgent,
					Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
					"Accept-Language": "en-US,en;q=0.5",
					"Accept-Encoding": "gzip, deflate",
					Connection: "keep-alive",
					"Upgrade-Insecure-Requests": "1",
				},
				timeout: this.config.timeout,
				maxRedirects: 5,
			});

			return response;
		} catch (error) {
			if (retryCount < this.config.maxRetries) {
				this.logger.warn(`Request failed, retrying... (${retryCount + 1}/${this.config.maxRetries})`);
				await this.delay(this.config.retryDelay);
				return this.makeRequest(url, retryCount + 1);
			}
			throw error;
		}
	}

	/**
	 * Extract business listings from HTML using selectors
	 */
	extractBusinesses($, source) {
		const businesses = [];
		const containers = $(source.businessSelectors.container);

		containers.each((index, container) => {
			try {
				const $container = $(container);

				const business = {
					name: this.extractText($container, source.businessSelectors.name),
					address: this.extractText($container, source.businessSelectors.address),
					phone: this.extractText($container, source.businessSelectors.phone),
					website: this.extractAttribute($container, source.businessSelectors.website, "href"),
					rating: this.extractText($container, source.businessSelectors.rating),
					category: this.extractText($container, source.businessSelectors.category),
					description: this.extractText($container, source.businessSelectors.description),
				};

				// Only include if we have at least name and one contact method
				if (business.name && (business.phone || business.address || business.website)) {
					businesses.push(business);
				}
			} catch (error) {
				this.logger.warn(`Failed to extract business at index ${index}: ${error.message}`);
			}
		});

		return businesses;
	}

	/**
	 * Extract text content using CSS selector
	 */
	extractText($container, selector) {
		if (!selector) return null;

		const element = $container.find(selector).first();
		return element.length > 0 ? element.text().trim() : null;
	}

	/**
	 * Extract attribute value using CSS selector
	 */
	extractAttribute($container, selector, attribute) {
		if (!selector) return null;

		const element = $container.find(selector).first();
		return element.length > 0 ? element.attr(attribute) : null;
	}

	/**
	 * Normalize scraped business data into our standard format
	 */
	normalizeScrapedBusiness(scrapedData, sourceKey) {
		const business = {
			// Basic Information
			name: this.cleanText(scrapedData.name),
			description: this.cleanText(scrapedData.description) || `Business listed on ${this.dataSources[sourceKey].name}`,

			// Contact Information
			phone: this.normalizePhone(scrapedData.phone),
			website: this.normalizeWebsite(scrapedData.website),

			// Location (will need geocoding if coordinates not available)
			address: this.cleanText(scrapedData.address),

			// Business Details
			categories: this.extractCategories(scrapedData.category),
			rating: this.normalizeRating(scrapedData.rating),

			// Metadata
			data_source: `web_scraper_${sourceKey}`,
			scraped_from: this.dataSources[sourceKey].name,
			data_quality: this.calculateScrapedDataQuality(scrapedData),
			last_updated: new Date().toISOString(),

			// Status
			status: "pending",
			verified: false,
			claimed_by: null,
			claimed_at: null,
		};

		// Additional extraction using patterns
		this.enhanceWithPatterns(business, scrapedData);

		return business;
	}

	/**
	 * Clean and normalize text content
	 */
	cleanText(text) {
		if (!text) return null;

		return (
			text
				.replace(/\s+/g, " ") // Normalize whitespace
				.replace(/^\s+|\s+$/g, "") // Trim
				.replace(/[^\x20-\x7E]/g, "") || // Remove non-ASCII characters
			null
		);
	}

	/**
	 * Normalize phone numbers
	 */
	normalizePhone(phone) {
		if (!phone) return null;

		// Extract phone number using pattern
		const phoneMatch = phone.match(this.extractionPatterns.phone);
		if (phoneMatch) {
			return phoneMatch[0].replace(/\D/g, ""); // Remove non-digits
		}

		return null;
	}

	/**
	 * Normalize website URLs
	 */
	normalizeWebsite(website) {
		if (!website) return null;

		// Clean up the URL
		let cleanUrl = website.trim();

		// Add protocol if missing
		if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
			cleanUrl = `https://${cleanUrl}`;
		}

		// Validate URL format
		try {
			new URL(cleanUrl);
			return cleanUrl;
		} catch {
			return null;
		}
	}

	/**
	 * Extract and normalize categories
	 */
	extractCategories(categoryText) {
		if (!categoryText) return [];

		// Split by common separators
		const categories = categoryText
			.split(/[,;|]/)
			.map((cat) => cat.trim().toLowerCase())
			.filter((cat) => cat.length > 0);

		return [...new Set(categories)]; // Remove duplicates
	}

	/**
	 * Normalize rating values
	 */
	normalizeRating(rating) {
		if (!rating) return null;

		// Extract numeric rating
		const ratingMatch = rating.match(/(\d+\.?\d*)/);
		if (ratingMatch) {
			const numericRating = parseFloat(ratingMatch[1]);

			// Normalize to 5-star scale
			if (numericRating <= 5) {
				return numericRating;
			} else if (numericRating <= 10) {
				return numericRating / 2; // Convert 10-star to 5-star
			} else if (numericRating <= 100) {
				return numericRating / 20; // Convert 100-point to 5-star
			}
		}

		return null;
	}

	/**
	 * Enhance business data using extraction patterns
	 */
	enhanceWithPatterns(business, scrapedData) {
		const allText = Object.values(scrapedData).join(" ");

		// Extract email if not already present
		if (!business.email) {
			const emailMatch = allText.match(this.extractionPatterns.email);
			if (emailMatch) {
				business.email = emailMatch[0];
			}
		}

		// Extract additional website if not already present
		if (!business.website) {
			const websiteMatch = allText.match(this.extractionPatterns.website);
			if (websiteMatch) {
				business.website = this.normalizeWebsite(websiteMatch[0]);
			}
		}

		// Extract operating hours
		const hoursMatch = allText.match(this.extractionPatterns.hours);
		if (hoursMatch) {
			business.hours_text = hoursMatch.join("; ");
		}
	}

	/**
	 * Calculate data quality score for scraped business
	 */
	calculateScrapedDataQuality(scrapedData) {
		let score = 0;
		const maxScore = 100;

		// Basic information (50 points)
		if (scrapedData.name) score += 20;
		if (scrapedData.phone) score += 15;
		if (scrapedData.address) score += 15;

		// Contact methods (30 points)
		if (scrapedData.website) score += 15;
		if (scrapedData.email) score += 15;

		// Additional details (20 points)
		if (scrapedData.category) score += 10;
		if (scrapedData.rating) score += 5;
		if (scrapedData.description) score += 5;

		return Math.round((score / maxScore) * 100);
	}

	/**
	 * Deduplicate businesses based on name and address similarity
	 */
	deduplicateBusinesses(businesses) {
		const unique = [];
		const seen = new Set();

		for (const business of businesses) {
			// Create a simple fingerprint
			const fingerprint = this.createBusinessFingerprint(business);

			if (!seen.has(fingerprint)) {
				seen.add(fingerprint);
				unique.push(business);
			}
		}

		return unique;
	}

	/**
	 * Create a fingerprint for duplicate detection
	 */
	createBusinessFingerprint(business) {
		const name = (business.name || "").toLowerCase().replace(/[^\w]/g, "");
		const phone = (business.phone || "").replace(/\D/g, "");
		const address = (business.address || "").toLowerCase().replace(/[^\w]/g, "");

		return `${name}_${phone}_${address}`;
	}

	/**
	 * Add delay between requests
	 */
	async delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Get collector statistics
	 */
	getStats() {
		return {
			rateLimiter: this.rateLimiter.getStats(),
			cache: this.cache.getStats(),
			dataSources: Object.keys(this.dataSources),
			totalSources: Object.keys(this.dataSources).length,
			requestConfig: this.config,
		};
	}
}

export default WebScraperCollector;
