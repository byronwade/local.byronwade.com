// Google Places API Collector
// Primary business data source with comprehensive data extraction

import axios from "axios";
import { API_CONFIG } from "../config/apis.js";
import { rateLimiterManager } from "../utils/rate-limiter.js";
import { logger, errorHandler } from "../utils/error-handler.js";
import { cacheManager } from "../utils/cache-manager.js";

/**
 * Google Places API Collector with intelligent data extraction
 */
export class GooglePlacesCollector {
	constructor() {
		this.config = API_CONFIG.GOOGLE_PLACES;
		this.rateLimiter = rateLimiterManager.getRateLimiter("google_places", this.config.rateLimit);

		// Performance tracking
		this.stats = {
			searchRequests: 0,
			detailRequests: 0,
			photoRequests: 0,
			businessesFound: 0,
			errors: 0,
			cacheHits: 0,
		};

		this.validateConfig();
		logger.info("Google Places collector initialized");
	}

	/**
	 * Validate API configuration
	 */
	validateConfig() {
		if (!this.config.apiKey) {
			throw new Error("Google Places API key is required. Set GOOGLE_PLACES_API_KEY in environment.");
		}
		logger.debug("Google Places API configuration validated");
	}

	/**
	 * Search for businesses by query
	 */
	async searchBusinesses(query, options = {}) {
		const searchParams = {
			query: query,
			type: options.type || "establishment",
			language: this.config.defaultParams.language,
			region: this.config.defaultParams.region,
			...options,
		};

		const cacheKey = `google_places_search_${JSON.stringify(searchParams)}`;

		try {
			// Check cache first
			const cached = await cacheManager.get(cacheKey);
			if (cached) {
				this.stats.cacheHits++;
				logger.debug(`Google Places search cache hit for: ${query}`);
				return cached;
			}

			// Execute API request with rate limiting
			const results = await this.rateLimiter.executeRequest(async () => await this.makeSearchRequest(searchParams));

			// Cache results for 1 hour
			await cacheManager.set(cacheKey, results, { ttl: 3600000 });

			this.stats.searchRequests++;
			this.stats.businessesFound += results.length;

			logger.info(`Google Places search completed: ${results.length} businesses found for "${query}"`);
			return results;
		} catch (error) {
			this.stats.errors++;
			logger.error("Google Places search failed", {
				query,
				error: error.message,
				status: error.response?.status,
			});
			throw error;
		}
	}

	/**
	 * Make search request to Google Places API
	 */
	async makeSearchRequest(params) {
		const url = `${this.config.baseUrl}${this.config.endpoints.textSearch}`;

		const requestParams = {
			key: this.config.apiKey,
			query: params.query,
			type: params.type,
			language: params.language,
			region: params.region,
			fields: this.config.defaultParams.fields,
		};

		// Add location bias if provided
		if (params.location) {
			requestParams.location = `${params.location.lat},${params.location.lng}`;
			requestParams.radius = params.radius || 50000; // 50km default
		}

		const response = await axios.get(url, {
			params: requestParams,
			timeout: 30000,
			headers: {
				"User-Agent": "BusinessDataCollector/1.0",
			},
		});

		if (response.data.status !== "OK" && response.data.status !== "ZERO_RESULTS") {
			throw new Error(`Google Places API error: ${response.data.status} - ${response.data.error_message}`);
		}

		return this.processSearchResults(response.data.results || []);
	}

	/**
	 * Process and normalize search results
	 */
	processSearchResults(results) {
		return results.map((place) => this.normalizeBasicBusinessData(place));
	}

	/**
	 * Get detailed business information
	 */
	async getBusinessDetails(placeId, options = {}) {
		const cacheKey = `google_places_details_${placeId}`;

		try {
			// Check cache first
			const cached = await cacheManager.get(cacheKey);
			if (cached) {
				this.stats.cacheHits++;
				logger.debug(`Google Places details cache hit for: ${placeId}`);
				return cached;
			}

			// Execute API request with rate limiting
			const details = await this.rateLimiter.executeRequest(async () => await this.makeDetailsRequest(placeId, options));

			// Cache details for 6 hours (longer than search results)
			await cacheManager.set(cacheKey, details, { ttl: 21600000 });

			this.stats.detailRequests++;
			logger.debug(`Google Places details retrieved for: ${placeId}`);

			return details;
		} catch (error) {
			this.stats.errors++;
			logger.error("Google Places details failed", {
				placeId,
				error: error.message,
			});
			throw error;
		}
	}

	/**
	 * Make details request to Google Places API
	 */
	async makeDetailsRequest(placeId, options = {}) {
		const url = `${this.config.baseUrl}${this.config.endpoints.details}`;

		const requestParams = {
			key: this.config.apiKey,
			place_id: placeId,
			language: this.config.defaultParams.language,
			fields: options.fields || ["place_id", "name", "formatted_address", "geometry", "business_status", "types", "rating", "user_ratings_total", "price_level", "opening_hours", "formatted_phone_number", "international_phone_number", "website", "photos", "reviews", "vicinity", "plus_code", "url", "utc_offset"].join(","),
		};

		const response = await axios.get(url, {
			params: requestParams,
			timeout: 30000,
		});

		if (response.data.status !== "OK") {
			throw new Error(`Google Places Details API error: ${response.data.status}`);
		}

		return this.normalizeDetailedBusinessData(response.data.result);
	}

	/**
	 * Search businesses by category and location
	 */
	async searchByCategory(category, location, options = {}) {
		const searchOptions = {
			type: this.mapCategoryToType(category),
			location: location,
			radius: options.radius || 50000,
			...options,
		};

		const query = `${category} in ${location.city}, ${location.state}`;

		logger.info(`Searching Google Places by category: ${category} in ${location.city}, ${location.state}`);

		return await this.searchBusinesses(query, searchOptions);
	}

	/**
	 * Search businesses near coordinates
	 */
	async searchNearby(lat, lng, options = {}) {
		const url = `${this.config.baseUrl}${this.config.endpoints.nearbySearch}`;

		const cacheKey = `google_places_nearby_${lat}_${lng}_${JSON.stringify(options)}`;

		try {
			// Check cache first
			const cached = await cacheManager.get(cacheKey);
			if (cached) {
				this.stats.cacheHits++;
				return cached;
			}

			const requestParams = {
				key: this.config.apiKey,
				location: `${lat},${lng}`,
				radius: options.radius || 5000,
				type: options.type || "establishment",
				language: this.config.defaultParams.language,
			};

			// Add keyword filter if provided
			if (options.keyword) {
				requestParams.keyword = options.keyword;
			}

			const results = await this.rateLimiter.executeRequest(async () => {
				const response = await axios.get(url, {
					params: requestParams,
					timeout: 30000,
				});

				if (response.data.status !== "OK" && response.data.status !== "ZERO_RESULTS") {
					throw new Error(`Google Places Nearby API error: ${response.data.status}`);
				}

				return this.processSearchResults(response.data.results || []);
			});

			// Cache for 30 minutes
			await cacheManager.set(cacheKey, results, { ttl: 1800000 });

			this.stats.searchRequests++;
			this.stats.businessesFound += results.length;

			return results;
		} catch (error) {
			this.stats.errors++;
			logger.error("Google Places nearby search failed", {
				lat,
				lng,
				error: error.message,
			});
			throw error;
		}
	}

	/**
	 * Get business photos
	 */
	async getBusinessPhotos(photoReferences, options = {}) {
		const maxWidth = options.maxWidth || 800;
		const photos = [];

		for (const photoRef of photoReferences.slice(0, 5)) {
			// Limit to 5 photos
			try {
				const photoUrl = await this.getPhotoUrl(photoRef, maxWidth);
				photos.push({
					url: photoUrl,
					reference: photoRef,
					maxWidth: maxWidth,
					source: "google_places",
				});

				this.stats.photoRequests++;
			} catch (error) {
				logger.warn("Failed to get photo URL", {
					reference: photoRef,
					error: error.message,
				});
			}
		}

		return photos;
	}

	/**
	 * Get photo URL from photo reference
	 */
	async getPhotoUrl(photoReference, maxWidth = 800) {
		const url = `${this.config.baseUrl}${this.config.endpoints.photos}`;

		return `${url}?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.config.apiKey}`;
	}

	/**
	 * Normalize basic business data from search results
	 */
	normalizeBasicBusinessData(place) {
		const location = place.geometry?.location;

		return {
			// Core identifiers
			source: "google_places",
			source_id: place.place_id,
			place_id: place.place_id,

			// Basic information
			name: place.name,
			formatted_address: place.formatted_address,
			vicinity: place.vicinity,

			// Location data
			latitude: location?.lat,
			longitude: location?.lng,

			// Business details
			business_status: place.business_status,
			types: place.types || [],
			rating: place.rating,
			user_ratings_total: place.user_ratings_total,
			price_level: place.price_level,

			// Photos
			photos: place.photos?.map((photo) => photo.photo_reference) || [],

			// Metadata
			collected_at: new Date().toISOString(),
			data_completeness: this.calculateDataCompleteness(place),

			// Raw data for debugging
			raw_data: place,
		};
	}

	/**
	 * Normalize detailed business data
	 */
	normalizeDetailedBusinessData(place) {
		const basicData = this.normalizeBasicBusinessData(place);

		// Parse address components
		const addressComponents = this.parseAddressComponents(place.address_components || []);

		// Process opening hours
		const hours = this.processOpeningHours(place.opening_hours);

		// Process reviews
		const reviews = this.processReviews(place.reviews || []);

		return {
			...basicData,

			// Detailed contact information
			phone: place.formatted_phone_number,
			international_phone: place.international_phone_number,
			website: place.website,
			url: place.url,

			// Address components
			...addressComponents,

			// Operating hours
			hours: hours,

			// Reviews and ratings
			reviews: reviews,

			// Additional metadata
			plus_code: place.plus_code,
			utc_offset: place.utc_offset,

			// Enhanced completeness score
			data_completeness: this.calculateDetailedDataCompleteness(place),
		};
	}

	/**
	 * Parse address components into structured format
	 */
	parseAddressComponents(components) {
		const parsed = {};

		for (const component of components) {
			const types = component.types;

			if (types.includes("street_number")) {
				parsed.street_number = component.long_name;
			} else if (types.includes("route")) {
				parsed.street_name = component.long_name;
			} else if (types.includes("locality")) {
				parsed.city = component.long_name;
			} else if (types.includes("administrative_area_level_1")) {
				parsed.state = component.short_name;
			} else if (types.includes("postal_code")) {
				parsed.zip_code = component.long_name;
			} else if (types.includes("country")) {
				parsed.country = component.short_name;
			}
		}

		// Construct full address
		if (parsed.street_number && parsed.street_name) {
			parsed.address = `${parsed.street_number} ${parsed.street_name}`;
		}

		return parsed;
	}

	/**
	 * Process opening hours into standardized format
	 */
	processOpeningHours(openingHours) {
		if (!openingHours) return null;

		const weekdayText = openingHours.weekday_text || [];
		const periods = openingHours.periods || [];

		const standardHours = {};
		const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

		// Process periods
		for (const period of periods) {
			if (period.open) {
				const dayIndex = period.open.day;
				const dayName = daysOfWeek[dayIndex];

				const openTime = this.formatTime(period.open.time);
				const closeTime = period.close ? this.formatTime(period.close.time) : "23:59";

				standardHours[dayName] = {
					open: openTime,
					close: closeTime,
					is_open_24h: !period.close,
				};
			}
		}

		return {
			periods: standardHours,
			weekday_text: weekdayText,
			open_now: openingHours.open_now,
		};
	}

	/**
	 * Format time from HHMM to HH:MM
	 */
	formatTime(timeString) {
		if (!timeString || timeString.length !== 4) return timeString;
		return `${timeString.substring(0, 2)}:${timeString.substring(2, 4)}`;
	}

	/**
	 * Process reviews into standardized format
	 */
	processReviews(reviews) {
		return reviews.map((review) => ({
			author_name: review.author_name,
			author_url: review.author_url,
			language: review.language,
			profile_photo_url: review.profile_photo_url,
			rating: review.rating,
			relative_time_description: review.relative_time_description,
			text: review.text,
			time: review.time,
			source: "google_places",
		}));
	}

	/**
	 * Map business category to Google Places type
	 */
	mapCategoryToType(category) {
		const typeMapping = {
			restaurant: "restaurant",
			food: "food",
			retail: "store",
			grocery: "grocery_or_supermarket",
			pharmacy: "pharmacy",
			healthcare: "health",
			automotive: "car_repair",
			financial: "bank",
			entertainment: "amusement_park",
			lodging: "lodging",
			education: "school",
			government: "local_government_office",
		};

		return typeMapping[category.toLowerCase()] || "establishment";
	}

	/**
	 * Calculate basic data completeness score
	 */
	calculateDataCompleteness(place) {
		const requiredFields = ["name", "formatted_address", "geometry"];
		const optionalFields = ["rating", "types", "formatted_phone_number", "website", "opening_hours"];

		let score = 0;
		let total = requiredFields.length + optionalFields.length;

		// Required fields (higher weight)
		for (const field of requiredFields) {
			if (place[field]) score += 2;
		}
		total += requiredFields.length; // Double weight for required fields

		// Optional fields
		for (const field of optionalFields) {
			if (place[field]) score += 1;
		}

		return Math.round((score / total) * 100);
	}

	/**
	 * Calculate detailed data completeness score
	 */
	calculateDetailedDataCompleteness(place) {
		const allFields = ["name", "formatted_address", "geometry", "formatted_phone_number", "website", "opening_hours", "rating", "reviews", "photos", "types"];

		let score = 0;
		for (const field of allFields) {
			if (place[field] && (Array.isArray(place[field]) ? place[field].length > 0 : true)) {
				score += 1;
			}
		}

		return Math.round((score / allFields.length) * 100);
	}

	/**
	 * Bulk search for multiple businesses
	 */
	async bulkSearch(businessNames, location, options = {}) {
		const results = [];
		const batchSize = options.batchSize || 5;

		logger.info(`Starting bulk search for ${businessNames.length} businesses in ${location.city}, ${location.state}`);

		for (let i = 0; i < businessNames.length; i += batchSize) {
			const batch = businessNames.slice(i, i + batchSize);

			const batchPromises = batch.map(async (businessName) => {
				try {
					const query = `${businessName} ${location.city} ${location.state}`;
					const searchResults = await this.searchBusinesses(query, {
						location: location,
						radius: options.radius || 50000,
					});

					// Get detailed info for the first result if available
					if (searchResults.length > 0) {
						const details = await this.getBusinessDetails(searchResults[0].place_id);
						return { business: businessName, data: details, found: true };
					} else {
						return { business: businessName, data: null, found: false };
					}
				} catch (error) {
					logger.error(`Bulk search failed for business: ${businessName}`, { error: error.message });
					return { business: businessName, data: null, found: false, error: error.message };
				}
			});

			const batchResults = await Promise.all(batchPromises);
			results.push(...batchResults);

			// Add delay between batches to respect rate limits
			if (i + batchSize < businessNames.length) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}

			logger.debug(`Completed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(businessNames.length / batchSize)}`);
		}

		const foundCount = results.filter((r) => r.found).length;
		logger.info(`Bulk search completed: ${foundCount}/${businessNames.length} businesses found`);

		return results;
	}

	/**
	 * Get collector statistics
	 */
	getStats() {
		return {
			...this.stats,
			rateLimiter: this.rateLimiter.getStats(),
			apiConfig: {
				name: this.config.name,
				baseUrl: this.config.baseUrl,
				hasApiKey: !!this.config.apiKey,
			},
		};
	}

	/**
	 * Reset statistics
	 */
	resetStats() {
		this.stats = {
			searchRequests: 0,
			detailRequests: 0,
			photoRequests: 0,
			businessesFound: 0,
			errors: 0,
			cacheHits: 0,
		};

		logger.info("Google Places collector stats reset");
	}
}
