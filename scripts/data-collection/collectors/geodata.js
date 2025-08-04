/**
 * GeoData API Collector (AllThingsDev - Hong Kong Example)
 *
 * FREE DATA SOURCE - Geographic business and amenity data
 * Template for integrating geographic-specific business APIs
 *
 * Features:
 * - Cultural centers and business amenities
 * - Geographic coordinates and location data
 * - Bilingual data (English and Chinese)
 * - District and regional information
 * - Comprehensive location-based business data
 *
 * Use Cases:
 * - Geographic business discovery
 * - Location-based business verification
 * - Cultural and amenity mapping
 * - Regional business analysis
 * - Template for other geographic APIs
 *
 * Performance: Excellent for location-specific business intelligence
 * Template: Can be adapted for other geographic regions and APIs
 */

import axios from "axios";
import { RateLimiterManager } from "../utils/rate-limiter.js";
import { CacheManager } from "../utils/cache-manager.js";
import { Logger } from "../utils/error-handler.js";

export class GeoDataCollector {
	constructor() {
		this.rateLimiter = RateLimiterManager.getLimiter("geodata");
		this.logger = new Logger("GeoDataCollector");
		this.cache = CacheManager;

		// API configuration - Hong Kong GeoData as example
		this.apiConfig = {
			baseUrl: "https://Hong-Kong-GeoData-API.proxy-production.allthingsdev.co",
			endpoints: {
				locationSearch: "/gs/api/v1.0.0/locationSearch",
				culturalCenters: "/cultural_centers",
			},
			headers: {
				Authorization: process.env.ALLTHINGSDEV_API_KEY || "",
				"Content-Type": "application/json",
			},
		};

		// Supported amenity types (can be expanded for other regions)
		this.amenityTypes = ["cultural_centers", "libraries", "hospitals", "schools", "colleges", "museums", "galleries", "theaters", "parks", "shopping_centers", "markets", "restaurants", "hotels"];

		// Geographic regions (Hong Kong specific - template for other areas)
		this.regions = {
			"Hong Kong Island": ["Central", "Wan Chai", "Causeway Bay", "Admiralty"],
			Kowloon: ["Tsim Sha Tsui", "Mong Kok", "Yau Ma Tei", "Jordan"],
			"New Territories": ["Sha Tin", "Tai Po", "Tsuen Wan", "Tuen Mun"],
		};

		// Business categories mapping for geographic data
		this.businessCategories = {
			cultural_centers: ["arts", "culture", "community"],
			libraries: ["education", "public_service"],
			hospitals: ["healthcare", "medical"],
			schools: ["education", "public_service"],
			shopping_centers: ["retail", "commercial"],
			restaurants: ["food_service", "hospitality"],
			hotels: ["accommodation", "hospitality"],
		};
	}

	/**
	 * Search for businesses and amenities by query
	 * Uses geographic data to find location-based businesses
	 */
	async searchBusinessesByQuery(query, options = {}) {
		const cacheKey = `geodata_search_${query}_${JSON.stringify(options)}`;

		try {
			// Check cache first
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				this.logger.info(`GeoData search cache hit: ${query}`);
				return cached;
			}

			await this.rateLimiter.waitForToken();

			const startTime = performance.now();
			this.logger.info(`Searching GeoData for: ${query}`);

			// Make request to location search endpoint
			const response = await axios.get(`${this.apiConfig.baseUrl}${this.apiConfig.endpoints.culturalCenters}`, {
				params: {
					q: query,
				},
				headers: this.apiConfig.headers,
				timeout: 20000,
			});

			if (response.status !== 200 || !response.data) {
				throw new Error(`Unexpected response: ${response.status}`);
			}

			// Process and normalize the results
			const businesses = this.processGeoDataResults(response.data, query);

			const queryTime = performance.now() - startTime;
			this.logger.performance(`GeoData search completed in ${queryTime.toFixed(2)}ms`);
			this.logger.info(`Found ${businesses.length} businesses/amenities for: ${query}`);

			// Cache for 6 hours (geographic data doesn't change frequently)
			await this.cache.set(cacheKey, businesses, 6 * 60 * 60 * 1000);

			return businesses;
		} catch (error) {
			this.logger.error(`GeoData search failed for ${query}: ${error.message}`);

			if (error.response?.status === 401) {
				throw new Error("Invalid AllThingsDev API key for GeoData");
			} else if (error.response?.status === 429) {
				throw new Error("GeoData API rate limit exceeded");
			}

			throw error;
		}
	}

	/**
	 * Search for specific amenity types in a region
	 * Useful for finding all businesses of a certain type
	 */
	async searchAmenitiesByType(amenityType, region = null, options = {}) {
		const cacheKey = `geodata_amenity_${amenityType}_${region || "all"}_${JSON.stringify(options)}`;

		try {
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				return cached;
			}

			const startTime = performance.now();
			this.logger.info(`Searching for ${amenityType} amenities${region ? ` in ${region}` : ""}`);

			const amenities = [];

			// Search for different variations of the amenity type
			const searchTerms = this.buildAmenitySearchTerms(amenityType);

			for (const term of searchTerms) {
				try {
					await this.rateLimiter.waitForToken();

					const results = await this.searchBusinessesByQuery(term, { force: true });

					// Filter results by region if specified
					const filteredResults = region ? this.filterByRegion(results, region) : results;

					amenities.push(...filteredResults);
				} catch (error) {
					this.logger.warn(`Failed to search for ${term}: ${error.message}`);
					continue;
				}
			}

			// Deduplicate amenities
			const uniqueAmenities = this.deduplicateAmenities(amenities);

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Amenity search completed in ${queryTime.toFixed(2)}ms`);

			// Cache for 8 hours
			await this.cache.set(cacheKey, uniqueAmenities, 8 * 60 * 60 * 1000);

			return uniqueAmenities;
		} catch (error) {
			this.logger.error(`Amenity search failed for ${amenityType}: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Get comprehensive geographic business data for a region
	 * Returns all types of businesses and amenities in the area
	 */
	async getRegionBusinessData(region, options = {}) {
		const cacheKey = `geodata_region_${region}_${JSON.stringify(options)}`;

		try {
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				return cached;
			}

			const startTime = performance.now();
			this.logger.info(`Getting comprehensive business data for region: ${region}`);

			const regionData = {
				region: region,
				amenities_by_type: {},
				total_businesses: 0,
				districts: [],
				last_updated: new Date().toISOString(),
			};

			// Search for each amenity type in the region
			for (const amenityType of this.amenityTypes) {
				try {
					const amenities = await this.searchAmenitiesByType(amenityType, region, { force: true });

					if (amenities.length > 0) {
						regionData.amenities_by_type[amenityType] = amenities;
						regionData.total_businesses += amenities.length;
					}
				} catch (error) {
					this.logger.warn(`Failed to get ${amenityType} for region ${region}: ${error.message}`);
					continue;
				}
			}

			// Extract unique districts
			regionData.districts = this.extractDistricts(regionData.amenities_by_type);

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Region business data completed in ${queryTime.toFixed(2)}ms`);
			this.logger.info(`Found ${regionData.total_businesses} businesses in ${region}`);

			// Cache for 12 hours (comprehensive data)
			await this.cache.set(cacheKey, regionData, 12 * 60 * 60 * 1000);

			return regionData;
		} catch (error) {
			this.logger.error(`Region business data failed for ${region}: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Process GeoData API results into normalized business format
	 */
	processGeoDataResults(data, searchQuery = "") {
		if (!Array.isArray(data)) {
			data = [data];
		}

		const businesses = [];

		data.forEach((item) => {
			try {
				const business = this.normalizeGeoDataBusiness(item, searchQuery);
				if (business && this.isValidGeoBusiness(business)) {
					businesses.push(business);
				}
			} catch (error) {
				this.logger.warn(`Failed to process GeoData item: ${error.message}`);
			}
		});

		return businesses;
	}

	/**
	 * Normalize GeoData business/amenity into our standard format
	 */
	normalizeGeoDataBusiness(item, searchQuery = "") {
		try {
			const business = {
				// Basic Information (bilingual support)
				name: item.nameEN || item.nameZH || "Unknown Business",
				name_english: item.nameEN,
				name_local: item.nameZH, // Chinese name
				description: `${searchQuery} facility in ${item.districtEN || item.districtZH || "Hong Kong"}`,

				// Location Information
				address: item.addressEN || item.addressZH,
				address_english: item.addressEN,
				address_local: item.addressZH,
				district: item.districtEN || item.districtZH,
				district_english: item.districtEN,
				district_local: item.districtZH,

				// Coordinates
				latitude: this.convertCoordinate(item.y, "latitude"),
				longitude: this.convertCoordinate(item.x, "longitude"),
				x_coordinate: item.x,
				y_coordinate: item.y,

				// Business Classification
				categories: this.determineBusinessCategories(searchQuery, item),
				amenity_type: this.normalizeAmenityType(searchQuery),
				facility_type: searchQuery,

				// Regional Information
				region: this.determineRegion(item.districtEN || item.districtZH),
				country: "Hong Kong",
				country_code: "HK",

				// Data Quality and Source
				data_source: "geodata_hongkong_allthingsdev",
				data_quality: this.calculateGeoDataQuality(item),
				last_updated: new Date().toISOString(),

				// Business Status
				status: "pending",
				verified: true, // Geographic data is generally verified
				claimed_by: null,
				claimed_at: null,

				// Geographic Metadata
				is_bilingual: !!(item.nameEN && item.nameZH),
				coordinate_system: "HK1980", // Hong Kong coordinate system

				// Original data
				raw_data: item,
			};

			return business;
		} catch (error) {
			this.logger.warn(`Failed to normalize GeoData business: ${error.message}`);
			return null;
		}
	}

	/**
	 * Build search terms for different amenity types
	 */
	buildAmenitySearchTerms(amenityType) {
		const termMappings = {
			cultural_centers: ["cultural", "culture", "centre", "center", "community"],
			libraries: ["library", "libraries", "book", "reading"],
			hospitals: ["hospital", "medical", "clinic", "health"],
			schools: ["school", "education", "learning", "academy"],
			museums: ["museum", "gallery", "exhibition", "heritage"],
			shopping_centers: ["shopping", "mall", "market", "retail"],
			restaurants: ["restaurant", "dining", "food", "cafe"],
			hotels: ["hotel", "accommodation", "lodge", "resort"],
		};

		return termMappings[amenityType] || [amenityType];
	}

	/**
	 * Filter results by geographic region
	 */
	filterByRegion(results, targetRegion) {
		return results.filter((result) => {
			const resultRegion = result.region || result.district;
			return resultRegion && resultRegion.toLowerCase().includes(targetRegion.toLowerCase());
		});
	}

	/**
	 * Determine business categories based on amenity type
	 */
	determineBusinessCategories(searchQuery, item) {
		const categories = [];

		// Add category based on search query
		const mappedCategories = this.businessCategories[searchQuery.toLowerCase()];
		if (mappedCategories) {
			categories.push(...mappedCategories);
		}

		// Add geographic category
		categories.push("hong_kong_business");

		// Add bilingual category if applicable
		if (item.nameEN && item.nameZH) {
			categories.push("bilingual_service");
		}

		return [...new Set(categories)]; // Remove duplicates
	}

	/**
	 * Normalize amenity type for consistency
	 */
	normalizeAmenityType(searchQuery) {
		const normalizations = {
			cultural: "cultural_center",
			culture: "cultural_center",
			centre: "center",
			library: "library",
			hospital: "healthcare_facility",
			medical: "healthcare_facility",
			school: "educational_institution",
			museum: "cultural_attraction",
			shopping: "retail_center",
			restaurant: "food_service",
			hotel: "accommodation",
		};

		const query = searchQuery.toLowerCase();

		for (const [key, value] of Object.entries(normalizations)) {
			if (query.includes(key)) {
				return value;
			}
		}

		return searchQuery.toLowerCase().replace(/\s+/g, "_");
	}

	/**
	 * Convert coordinates (placeholder - actual conversion depends on coordinate system)
	 */
	convertCoordinate(value, type) {
		if (!value || typeof value !== "number") {
			return null;
		}

		// Hong Kong coordinate system conversion (simplified)
		// In a real implementation, you'd use proper coordinate transformation
		if (type === "latitude") {
			// Rough conversion for Hong Kong latitude range
			return 22.15 + value / 100000; // Simplified conversion
		} else if (type === "longitude") {
			// Rough conversion for Hong Kong longitude range
			return 113.8 + value / 100000; // Simplified conversion
		}

		return value;
	}

	/**
	 * Determine region from district
	 */
	determineRegion(district) {
		if (!district) return "Hong Kong";

		const districtLower = district.toLowerCase();

		for (const [region, districts] of Object.entries(this.regions)) {
			if (districts.some((d) => districtLower.includes(d.toLowerCase()))) {
				return region;
			}
		}

		return "Hong Kong";
	}

	/**
	 * Calculate data quality score for geographic data
	 */
	calculateGeoDataQuality(item) {
		let score = 0;
		const maxScore = 100;

		// Basic information (40 points)
		if (item.nameEN || item.nameZH) score += 20;
		if (item.addressEN || item.addressZH) score += 20;

		// Location data (30 points)
		if (item.x && item.y) score += 20;
		if (item.districtEN || item.districtZH) score += 10;

		// Bilingual support (20 points)
		if (item.nameEN && item.nameZH) score += 10;
		if (item.addressEN && item.addressZH) score += 10;

		// Data completeness (10 points)
		const fields = [item.nameEN, item.nameZH, item.addressEN, item.addressZH, item.districtEN, item.districtZH];
		const completedFields = fields.filter((field) => field && field.trim()).length;
		score += Math.round((completedFields / fields.length) * 10);

		return Math.min(score, maxScore);
	}

	/**
	 * Validate geographic business data
	 */
	isValidGeoBusiness(business) {
		// Must have a name
		if (!business.name || business.name === "Unknown Business") {
			return false;
		}

		// Must have location information
		if (!business.district && !business.address) {
			return false;
		}

		// Must have coordinates or address
		if (!business.latitude && !business.longitude && !business.address) {
			return false;
		}

		return true;
	}

	/**
	 * Deduplicate amenities based on name and location
	 */
	deduplicateAmenities(amenities) {
		const seen = new Set();
		const unique = [];

		for (const amenity of amenities) {
			// Create fingerprint for deduplication
			const fingerprint = `${amenity.name}_${amenity.district}_${amenity.address}`.toLowerCase();

			if (!seen.has(fingerprint)) {
				seen.add(fingerprint);
				unique.push(amenity);
			}
		}

		return unique;
	}

	/**
	 * Extract unique districts from amenities data
	 */
	extractDistricts(amenitiesByType) {
		const districts = new Set();

		Object.values(amenitiesByType).forEach((amenities) => {
			amenities.forEach((amenity) => {
				if (amenity.district) {
					districts.add(amenity.district);
				}
			});
		});

		return Array.from(districts).sort();
	}

	/**
	 * Get collector statistics
	 */
	getStats() {
		return {
			rateLimiter: this.rateLimiter.getStats(),
			cache: this.cache.getStats(),
			apiEndpoint: this.apiConfig.baseUrl,
			supportedAmenityTypes: this.amenityTypes,
			supportedRegions: Object.keys(this.regions),
			businessCategories: Object.keys(this.businessCategories),
			features: ["bilingual_support", "geographic_coordinates", "regional_filtering", "amenity_categorization"],
		};
	}
}

export default GeoDataCollector;
