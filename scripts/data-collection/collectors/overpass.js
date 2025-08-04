/**
 * Overpass API (OpenStreetMap) Collector
 *
 * FREE DATA SOURCE - No API key required
 * Collects comprehensive business data from OpenStreetMap
 *
 * Features:
 * - Completely free - no rate limits or API keys
 * - Rich POI (Point of Interest) data
 * - Geographic search capabilities
 * - Detailed business information including:
 *   - Names, addresses, coordinates
 *   - Opening hours, phone numbers, websites
 *   - Business types, amenities
 *   - Payment methods, accessibility info
 *
 * Performance: Can handle large geographic queries efficiently
 */

import axios from "axios";
import { RateLimiterManager } from "../utils/rate-limiter.js";
import { CacheManager } from "../utils/cache-manager.js";
import { Logger } from "../utils/error-handler.js";
import { API_CONFIG } from "../config/apis.js";

export class OverpassCollector {
	constructor() {
		this.rateLimiter = RateLimiterManager.getLimiter("overpass");
		this.logger = new Logger("OverpassCollector");
		this.apiConfig = API_CONFIG.OVERPASS;
		this.cache = CacheManager;

		// OSM business node types for comprehensive data collection
		this.businessNodeTypes = [
			"amenity", // restaurants, cafes, banks, etc.
			"shop", // retail stores, services
			"office", // business offices, companies
			"tourism", // hotels, attractions, museums
			"healthcare", // hospitals, clinics, pharmacies
			"leisure", // gyms, entertainment venues
			"craft", // workshops, studios, services
		];

		// Comprehensive business amenity values
		this.businessAmenities = [
			// Food & Dining
			"restaurant",
			"cafe",
			"fast_food",
			"bar",
			"pub",
			"food_court",
			"ice_cream",
			"biergarten",
			"nightclub",

			// Shopping & Retail
			"marketplace",
			"shopping_centre",
			"department_store",

			// Financial Services
			"bank",
			"atm",
			"bureau_de_change",
			"money_transfer",

			// Healthcare
			"pharmacy",
			"hospital",
			"clinic",
			"dentist",
			"veterinary",
			"doctors",
			"physiotherapy",
			"optician",

			// Business Services
			"post_office",
			"internet_cafe",
			"coworking_space",
			"conference_centre",
			"exhibition_centre",

			// Automotive
			"fuel",
			"car_rental",
			"car_wash",
			"charging_station",

			// Personal Services
			"beauty_salon",
			"hairdresser",
			"spa",
			"massage",
			"dry_cleaning",
			"laundry",
			"tattoo",

			// Accommodation
			"hotel",
			"motel",
			"hostel",
			"guest_house",
			"apartment",

			// Entertainment & Leisure
			"cinema",
			"theatre",
			"casino",
			"bowling_alley",
			"fitness_centre",
			"gym",
			"yoga",
		];

		// Shop types for retail businesses
		this.shopTypes = [
			"supermarket",
			"convenience",
			"mall",
			"department_store",
			"bakery",
			"butcher",
			"cheese",
			"chocolate",
			"coffee",
			"deli",
			"dairy",
			"farm",
			"frozen_food",
			"greengrocer",
			"health_food",
			"ice_cream",
			"organic",
			"pasta",
			"pastry",
			"seafood",
			"spices",
			"tea",
			"wine",
			"water",

			// Non-food retail
			"clothes",
			"shoes",
			"jewelry",
			"watches",
			"bag",
			"beauty",
			"cosmetics",
			"perfumery",
			"hairdresser",
			"optician",
			"hearing_aids",
			"medical_supply",

			// Electronics & Technology
			"electronics",
			"computer",
			"mobile_phone",
			"camera",
			"hifi",
			"video",
			"video_games",

			// Home & Garden
			"furniture",
			"interior_decoration",
			"kitchen",
			"bathroom_furnishing",
			"window_blind",
			"curtain",
			"carpet",
			"flooring",
			"tiles",
			"paint",
			"wallpaper",
			"hardware",
			"doityourself",
			"garden_centre",

			// Sports & Hobbies
			"sports",
			"bicycle",
			"outdoor",
			"hunting",
			"fishing",
			"scuba_diving",
			"swimming_pool",
			"golf",

			// Automotive
			"car",
			"car_parts",
			"car_repair",
			"motorcycle",
			"motorcycle_repair",
			"tyres",

			// Books & Media
			"books",
			"music",
			"musical_instrument",
			"photo",
			"art",
			"frame",
			"games",
			"lottery",
			"newsagent",

			// Services
			"dry_cleaning",
			"laundry",
			"travel_agency",
			"estate_agent",
			"insurance",
			"funeral_directors",
			"employment_agency",
			"tax_advisor",
		];
	}

	/**
	 * Search for businesses in a specific geographic area
	 * Uses comprehensive Overpass QL queries for maximum data collection
	 */
	async searchBusinessesByArea(bounds, options = {}) {
		const cacheKey = `overpass_area_${bounds.south}_${bounds.west}_${bounds.north}_${bounds.east}`;

		try {
			// Check cache first
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				this.logger.info(`Overpass area search cache hit: ${cacheKey}`);
				return cached;
			}

			await this.rateLimiter.waitForToken();

			// Build comprehensive Overpass QL query
			const query = this.buildAreaQuery(bounds, options);

			const startTime = performance.now();
			this.logger.info(`Executing Overpass area query for bounds: ${JSON.stringify(bounds)}`);

			const response = await axios.post(this.apiConfig.endpoints.interpreter, `data=${encodeURIComponent(query)}`, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"User-Agent": "BusinessDirectory/1.0 (for business data collection)",
				},
				timeout: 60000, // 60 seconds for large queries
				maxContentLength: 50 * 1024 * 1024, // 50MB limit
			});

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Overpass area query completed in ${queryTime.toFixed(2)}ms`);

			if (!response.data || !response.data.elements) {
				throw new Error("Invalid response from Overpass API");
			}

			// Process and normalize the results
			const businesses = this.processOverpassResults(response.data.elements);

			this.logger.info(`Found ${businesses.length} businesses in area via Overpass API`);

			// Cache the results
			await this.cache.set(cacheKey, businesses, 24 * 60 * 60 * 1000); // 24 hours

			return businesses;
		} catch (error) {
			this.logger.error(`Overpass area search failed: ${error.message}`, {
				bounds,
				stack: error.stack,
			});

			if (error.response?.status === 429) {
				// Overpass server overload - wait and retry
				this.logger.warn("Overpass server overloaded, waiting 60 seconds...");
				await new Promise((resolve) => setTimeout(resolve, 60000));
				throw new Error("Overpass server overloaded, retry needed");
			}

			throw error;
		}
	}

	/**
	 * Search for businesses by name using Overpass API
	 * Useful for finding specific businesses or chains
	 */
	async searchBusinessesByName(name, bounds = null, options = {}) {
		const cacheKey = `overpass_name_${name}_${bounds ? JSON.stringify(bounds) : "global"}`;

		try {
			// Check cache first
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				this.logger.info(`Overpass name search cache hit: ${cacheKey}`);
				return cached;
			}

			await this.rateLimiter.waitForToken();

			// Build name-based query
			const query = this.buildNameQuery(name, bounds, options);

			const startTime = performance.now();
			this.logger.info(`Searching Overpass for businesses with name: ${name}`);

			const response = await axios.post(this.apiConfig.endpoints.interpreter, `data=${encodeURIComponent(query)}`, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"User-Agent": "BusinessDirectory/1.0 (for business data collection)",
				},
				timeout: 30000,
			});

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Overpass name query completed in ${queryTime.toFixed(2)}ms`);

			if (!response.data || !response.data.elements) {
				throw new Error("Invalid response from Overpass API");
			}

			// Process and normalize the results
			const businesses = this.processOverpassResults(response.data.elements);

			this.logger.info(`Found ${businesses.length} businesses named "${name}" via Overpass API`);

			// Cache the results
			await this.cache.set(cacheKey, businesses, 12 * 60 * 60 * 1000); // 12 hours

			return businesses;
		} catch (error) {
			this.logger.error(`Overpass name search failed: ${error.message}`, {
				name,
				bounds,
				stack: error.stack,
			});
			throw error;
		}
	}

	/**
	 * Search for businesses by category/type
	 * Leverages OSM's detailed tagging system
	 */
	async searchBusinessesByCategory(category, bounds = null, options = {}) {
		const cacheKey = `overpass_category_${category}_${bounds ? JSON.stringify(bounds) : "global"}`;

		try {
			// Check cache first
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				this.logger.info(`Overpass category search cache hit: ${cacheKey}`);
				return cached;
			}

			await this.rateLimiter.waitForToken();

			// Build category-based query
			const query = this.buildCategoryQuery(category, bounds, options);

			const startTime = performance.now();
			this.logger.info(`Searching Overpass for businesses in category: ${category}`);

			const response = await axios.post(this.apiConfig.endpoints.interpreter, `data=${encodeURIComponent(query)}`, {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"User-Agent": "BusinessDirectory/1.0 (for business data collection)",
				},
				timeout: 45000,
			});

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Overpass category query completed in ${queryTime.toFixed(2)}ms`);

			if (!response.data || !response.data.elements) {
				throw new Error("Invalid response from Overpass API");
			}

			// Process and normalize the results
			const businesses = this.processOverpassResults(response.data.elements);

			this.logger.info(`Found ${businesses.length} businesses in category "${category}" via Overpass API`);

			// Cache the results
			await this.cache.set(cacheKey, businesses, 6 * 60 * 60 * 1000); // 6 hours

			return businesses;
		} catch (error) {
			this.logger.error(`Overpass category search failed: ${error.message}`, {
				category,
				bounds,
				stack: error.stack,
			});
			throw error;
		}
	}

	/**
	 * Build comprehensive Overpass QL query for area-based search
	 * Includes all business types for maximum data collection
	 */
	buildAreaQuery(bounds, options = {}) {
		const { south, west, north, east } = bounds;
		const bbox = `${south},${west},${north},${east}`;

		// Build comprehensive query for all business types
		let query = `[out:json][timeout:60][bbox:${bbox}];\n(\n`;

		// Add amenity-based businesses
		this.businessAmenities.forEach((amenity) => {
			query += `  node["amenity"="${amenity}"];\n`;
			query += `  way["amenity"="${amenity}"];\n`;
		});

		// Add shop-based businesses
		this.shopTypes.forEach((shop) => {
			query += `  node["shop"="${shop}"];\n`;
			query += `  way["shop"="${shop}"];\n`;
		});

		// Add office spaces
		query += `  node["office"];\n`;
		query += `  way["office"];\n`;

		// Add tourism-related businesses
		query += `  node["tourism"~"^(hotel|motel|hostel|guest_house|apartment|camp_site|resort|attraction|museum|gallery|zoo|aquarium|theme_park)$"];\n`;
		query += `  way["tourism"~"^(hotel|motel|hostel|guest_house|apartment|camp_site|resort|attraction|museum|gallery|zoo|aquarium|theme_park)$"];\n`;

		// Add healthcare facilities
		query += `  node["healthcare"];\n`;
		query += `  way["healthcare"];\n`;

		// Add leisure facilities
		query += `  node["leisure"~"^(fitness_centre|gym|spa|sports_centre|swimming_pool|golf_course|bowling_alley|escape_game|amusement_arcade)$"];\n`;
		query += `  way["leisure"~"^(fitness_centre|gym|spa|sports_centre|swimming_pool|golf_course|bowling_alley|escape_game|amusement_arcade)$"];\n`;

		// Add craft businesses
		query += `  node["craft"];\n`;
		query += `  way["craft"];\n`;

		query += `);\nout center meta;`;

		return query;
	}

	/**
	 * Build Overpass QL query for name-based search
	 */
	buildNameQuery(name, bounds = null, options = {}) {
		const bboxClause = bounds ? `[bbox:${bounds.south},${bounds.west},${bounds.north},${bounds.east}]` : "";

		let query = `[out:json][timeout:30]${bboxClause};\n(\n`;

		// Search in various name fields
		const nameFields = ["name", "brand", "operator", "official_name", "alt_name"];

		nameFields.forEach((field) => {
			// Case-insensitive search with wildcards
			query += `  node["${field}"~"${name}",i];\n`;
			query += `  way["${field}"~"${name}",i];\n`;
		});

		query += `);\nout center meta;`;

		return query;
	}

	/**
	 * Build Overpass QL query for category-based search
	 */
	buildCategoryQuery(category, bounds = null, options = {}) {
		const bboxClause = bounds ? `[bbox:${bounds.south},${bounds.west},${bounds.north},${bounds.east}]` : "";

		let query = `[out:json][timeout:45]${bboxClause};\n(\n`;

		// Map category to OSM tags
		const categoryMappings = this.getCategoryMappings(category);

		categoryMappings.forEach((mapping) => {
			query += `  node["${mapping.key}"="${mapping.value}"];\n`;
			query += `  way["${mapping.key}"="${mapping.value}"];\n`;
		});

		query += `);\nout center meta;`;

		return query;
	}

	/**
	 * Map business categories to OSM tag combinations
	 */
	getCategoryMappings(category) {
		const mappings = {
			restaurant: [
				{ key: "amenity", value: "restaurant" },
				{ key: "amenity", value: "fast_food" },
				{ key: "amenity", value: "cafe" },
			],
			retail: [
				{ key: "shop", value: "supermarket" },
				{ key: "shop", value: "convenience" },
				{ key: "shop", value: "department_store" },
				{ key: "shop", value: "mall" },
			],
			healthcare: [
				{ key: "amenity", value: "hospital" },
				{ key: "amenity", value: "clinic" },
				{ key: "amenity", value: "pharmacy" },
				{ key: "healthcare", value: "hospital" },
				{ key: "healthcare", value: "clinic" },
			],
			accommodation: [
				{ key: "tourism", value: "hotel" },
				{ key: "tourism", value: "motel" },
				{ key: "tourism", value: "hostel" },
				{ key: "tourism", value: "guest_house" },
			],
			automotive: [
				{ key: "amenity", value: "fuel" },
				{ key: "shop", value: "car" },
				{ key: "shop", value: "car_repair" },
				{ key: "amenity", value: "car_rental" },
			],
			financial: [
				{ key: "amenity", value: "bank" },
				{ key: "amenity", value: "atm" },
				{ key: "office", value: "financial" },
				{ key: "office", value: "insurance" },
			],
		};

		return mappings[category.toLowerCase()] || [{ key: "amenity", value: category }];
	}

	/**
	 * Process raw Overpass API results into normalized business objects
	 * Extracts comprehensive business information from OSM data
	 */
	processOverpassResults(elements) {
		const businesses = [];

		elements.forEach((element) => {
			try {
				const business = this.normalizeOverpassBusiness(element);
				if (business && this.isValidBusiness(business)) {
					businesses.push(business);
				}
			} catch (error) {
				this.logger.warn(`Failed to process Overpass element: ${error.message}`, {
					elementId: element.id,
					elementType: element.type,
				});
			}
		});

		return businesses;
	}

	/**
	 * Normalize Overpass API business data into our standard format
	 */
	normalizeOverpassBusiness(element) {
		const tags = element.tags || {};

		// Skip if no name and no useful identifying information
		if (!tags.name && !tags.brand && !tags.operator) {
			return null;
		}

		// Get coordinates (handle both nodes and ways/relations)
		let latitude, longitude;
		if (element.type === "node") {
			latitude = element.lat;
			longitude = element.lon;
		} else if (element.center) {
			latitude = element.center.lat;
			longitude = element.center.lon;
		} else {
			return null; // Skip if no coordinates
		}

		// Extract business information
		const business = {
			// Basic Information
			name: tags.name || tags.brand || tags.operator || "Unknown Business",
			description: tags.description || this.generateDescription(tags),

			// Contact Information
			phone: this.normalizePhone(tags.phone || tags["contact:phone"]),
			email: tags.email || tags["contact:email"],
			website: this.normalizeWebsite(tags.website || tags["contact:website"] || tags.url),

			// Location
			latitude: parseFloat(latitude),
			longitude: parseFloat(longitude),
			address: this.buildAddress(tags),
			city: tags["addr:city"] || tags.city,
			state: tags["addr:state"] || tags.state,
			country: tags["addr:country"] || tags.country || "US",
			postal_code: tags["addr:postcode"] || tags.postcode,

			// Business Details
			categories: this.extractCategories(tags),
			hours: this.parseOpeningHours(tags.opening_hours),
			payment_methods: this.extractPaymentMethods(tags),
			amenities: this.extractAmenities(tags),

			// Social Media (if available)
			social_media: this.extractSocialMedia(tags),

			// OSM-specific data
			osm_id: element.id,
			osm_type: element.type,
			osm_version: element.version,
			osm_changeset: element.changeset,

			// Additional metadata
			wheelchair_accessible: this.parseWheelchairAccess(tags.wheelchair),
			wifi: this.parseWifiAvailability(tags.wifi || tags.internet_access),
			parking: this.parseParkingInfo(tags),
			delivery: tags.delivery === "yes",
			takeaway: tags.takeaway === "yes",
			outdoor_seating: tags.outdoor_seating === "yes",

			// Brand information
			brand: tags.brand,
			operator: tags.operator,
			chain: tags.chain,

			// Quality indicators
			data_source: "overpass",
			data_quality: this.calculateDataQuality(tags),
			last_updated: new Date().toISOString(),

			// Business status
			status: "pending",
			verified: false,
			claimed_by: null,
			claimed_at: null,
		};

		return business;
	}

	/**
	 * Build a formatted address from OSM address tags
	 */
	buildAddress(tags) {
		const addressParts = [];

		if (tags["addr:housenumber"]) {
			addressParts.push(tags["addr:housenumber"]);
		}

		if (tags["addr:street"]) {
			addressParts.push(tags["addr:street"]);
		} else if (tags["addr:place"]) {
			addressParts.push(tags["addr:place"]);
		}

		return addressParts.join(" ") || null;
	}

	/**
	 * Extract business categories from OSM tags
	 */
	extractCategories(tags) {
		const categories = [];

		// Primary category based on main tags
		if (tags.amenity) {
			categories.push(this.normalizeCategoryName(tags.amenity));
		}
		if (tags.shop) {
			categories.push(this.normalizeCategoryName(tags.shop));
		}
		if (tags.office) {
			categories.push("office");
		}
		if (tags.tourism) {
			categories.push(this.normalizeCategoryName(tags.tourism));
		}
		if (tags.leisure) {
			categories.push(this.normalizeCategoryName(tags.leisure));
		}
		if (tags.craft) {
			categories.push(this.normalizeCategoryName(tags.craft));
		}
		if (tags.healthcare) {
			categories.push("healthcare");
		}

		// Additional categorization based on cuisine
		if (tags.cuisine) {
			const cuisines = tags.cuisine.split(";").map((c) => c.trim());
			categories.push(...cuisines.map((c) => `cuisine_${c}`));
		}

		return [...new Set(categories)]; // Remove duplicates
	}

	/**
	 * Normalize category names for consistency
	 */
	normalizeCategoryName(category) {
		const normalizations = {
			fast_food: "fast food",
			beauty_salon: "beauty salon",
			car_wash: "car wash",
			fitness_centre: "fitness center",
			ice_cream: "ice cream",
			night_club: "nightclub",
			post_office: "post office",
			real_estate: "real estate",
			travel_agency: "travel agency",
		};

		return normalizations[category] || category.replace(/_/g, " ");
	}

	/**
	 * Parse OSM opening hours into our standardized format
	 */
	parseOpeningHours(openingHours) {
		if (!openingHours) return null;

		try {
			// Simple parsing for common formats
			// This is a basic implementation - could be enhanced with a full OSM opening_hours parser
			const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
			const schedule = {};

			// Handle simple formats like "Mo-Fr 09:00-17:00; Sa 10:00-16:00"
			if (openingHours.includes("24/7")) {
				days.forEach((day) => {
					schedule[day] = { open: "00:00", close: "23:59", is_closed: false };
				});
			} else {
				// Basic parsing - this could be much more sophisticated
				schedule.raw = openingHours;
			}

			return schedule;
		} catch (error) {
			this.logger.warn(`Failed to parse opening hours: ${openingHours}`, error);
			return { raw: openingHours };
		}
	}

	/**
	 * Extract payment methods from OSM tags
	 */
	extractPaymentMethods(tags) {
		const methods = [];

		const paymentTags = ["cash", "cards", "credit_cards", "debit_cards", "american_express", "visa", "mastercard", "contactless", "apple_pay", "google_pay", "bitcoin", "cryptocurrency"];

		paymentTags.forEach((method) => {
			const key = `payment:${method}`;
			if (tags[key] === "yes") {
				methods.push(method.replace("_", " "));
			}
		});

		// Check for general payment acceptance
		if (tags.payment && tags.payment !== "no") {
			methods.push("accepts payments");
		}

		return methods;
	}

	/**
	 * Extract amenities and features from OSM tags
	 */
	extractAmenities(tags) {
		const amenities = [];

		// Standard amenity features
		const amenityFeatures = {
			wifi: "wifi",
			internet_access: "internet access",
			wheelchair: "wheelchair accessible",
			smoking: "smoking allowed",
			outdoor_seating: "outdoor seating",
			takeaway: "takeaway available",
			delivery: "delivery available",
			drive_through: "drive through",
			reservation: "accepts reservations",
			toilets: "public toilets",
			parking: "parking available",
			air_conditioning: "air conditioning",
			heating: "heating",
		};

		Object.entries(amenityFeatures).forEach(([tag, description]) => {
			if (tags[tag] === "yes") {
				amenities.push(description);
			}
		});

		return amenities;
	}

	/**
	 * Extract social media information from OSM tags
	 */
	extractSocialMedia(tags) {
		const socialMedia = {};

		const platforms = ["facebook", "twitter", "instagram", "youtube", "linkedin", "pinterest", "yelp", "tripadvisor"];

		platforms.forEach((platform) => {
			const key = `contact:${platform}`;
			if (tags[key]) {
				socialMedia[platform] = tags[key];
			}
		});

		return Object.keys(socialMedia).length > 0 ? socialMedia : null;
	}

	/**
	 * Parse wheelchair accessibility information
	 */
	parseWheelchairAccess(wheelchair) {
		if (!wheelchair) return null;

		const accessLevels = {
			yes: "fully accessible",
			limited: "partially accessible",
			no: "not accessible",
			designated: "designated accessible facility",
		};

		return accessLevels[wheelchair] || wheelchair;
	}

	/**
	 * Parse WiFi availability information
	 */
	parseWifiAvailability(wifi) {
		if (!wifi) return null;

		const wifiTypes = {
			yes: "wifi available",
			free: "free wifi",
			customers: "wifi for customers",
			public: "public wifi",
			no: "no wifi",
		};

		return wifiTypes[wifi] || wifi;
	}

	/**
	 * Parse parking information from various parking-related tags
	 */
	parseParkingInfo(tags) {
		const parking = {};

		if (tags.parking) {
			parking.available = tags.parking === "yes";
			parking.type = tags.parking;
		}

		if (tags["parking:fee"]) {
			parking.fee = tags["parking:fee"];
		}

		if (tags["parking:maxstay"]) {
			parking.max_stay = tags["parking:maxstay"];
		}

		return Object.keys(parking).length > 0 ? parking : null;
	}

	/**
	 * Calculate data quality score based on available information
	 */
	calculateDataQuality(tags) {
		let score = 0;
		let maxScore = 100;

		// Basic information (40 points)
		if (tags.name) score += 15;
		if (tags.phone || tags["contact:phone"]) score += 10;
		if (tags.website || tags["contact:website"]) score += 10;
		if (tags.opening_hours) score += 5;

		// Address information (25 points)
		if (tags["addr:street"] || tags["addr:place"]) score += 10;
		if (tags["addr:housenumber"]) score += 5;
		if (tags["addr:city"]) score += 5;
		if (tags["addr:postcode"]) score += 5;

		// Business details (20 points)
		if (tags.amenity || tags.shop || tags.office) score += 10;
		if (tags.cuisine) score += 5;
		if (tags.brand || tags.operator) score += 5;

		// Additional features (15 points)
		const additionalFeatures = ["wheelchair", "wifi", "internet_access", "parking", "takeaway", "delivery", "outdoor_seating", "payment:cash"];
		const featureCount = additionalFeatures.filter((feature) => tags[feature]).length;
		score += Math.min(featureCount * 2, 15);

		return Math.round((score / maxScore) * 100);
	}

	/**
	 * Validate if the extracted business data is sufficient
	 */
	isValidBusiness(business) {
		// Must have a name
		if (!business.name || business.name === "Unknown Business") {
			return false;
		}

		// Must have valid coordinates
		if (!business.latitude || !business.longitude) {
			return false;
		}

		// Must have at least one category
		if (!business.categories || business.categories.length === 0) {
			return false;
		}

		// Minimum data quality threshold
		if (business.data_quality < 20) {
			return false;
		}

		return true;
	}

	/**
	 * Generate a description based on available tags
	 */
	generateDescription(tags) {
		const parts = [];

		if (tags.amenity) {
			parts.push(`${this.normalizeCategoryName(tags.amenity)} business`);
		} else if (tags.shop) {
			parts.push(`${this.normalizeCategoryName(tags.shop)} store`);
		} else if (tags.office) {
			parts.push("office business");
		}

		if (tags.brand) {
			parts.push(`operated by ${tags.brand}`);
		} else if (tags.operator) {
			parts.push(`operated by ${tags.operator}`);
		}

		if (tags.cuisine) {
			parts.push(`serving ${tags.cuisine} cuisine`);
		}

		return parts.length > 0 ? parts.join(", ") : null;
	}

	/**
	 * Normalize phone numbers
	 */
	normalizePhone(phone) {
		if (!phone) return null;

		// Remove common prefixes and formatting
		return phone.replace(/^\+1\s?/, "").replace(/[^\d]/g, "");
	}

	/**
	 * Normalize website URLs
	 */
	normalizeWebsite(website) {
		if (!website) return null;

		// Ensure protocol is included
		if (!website.startsWith("http://") && !website.startsWith("https://")) {
			return `https://${website}`;
		}

		return website;
	}

	/**
	 * Get collector statistics
	 */
	getStats() {
		return {
			rateLimiter: this.rateLimiter.getStats(),
			cache: this.cache.getStats(),
			supportedBusinessTypes: this.businessAmenities.length + this.shopTypes.length,
			lastQuery: this.lastQuery || null,
		};
	}
}

export default OverpassCollector;
