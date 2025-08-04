// Business Data Collection API Configuration
// Centralized configuration for all external APIs used in business data collection

import { logger } from "../utils/error-handler.js";

/**
 * API Configuration with rate limiting, authentication, and endpoints
 * All APIs are configured with intelligent fallbacks and error handling
 */
export const API_CONFIG = {
	// Google Places API - Primary source for comprehensive business data
	GOOGLE_PLACES: {
		name: "Google Places API",
		baseUrl: "https://maps.googleapis.com/maps/api/place",
		apiKey: process.env.GOOGLE_PLACES_API_KEY,
		rateLimit: {
			requestsPerSecond: 50, // Google allows 1000 requests per minute
			requestsPerMinute: 1000,
			requestsPerDay: 100000,
			burstLimit: 100, // Allow burst requests
		},
		endpoints: {
			textSearch: "/textsearch/json",
			nearbySearch: "/nearbysearch/json",
			details: "/details/json",
			photos: "/photo",
			autocomplete: "/autocomplete/json",
		},
		defaultParams: {
			language: "en",
			region: "us",
			fields: "place_id,name,formatted_address,geometry,business_status,types,rating,user_ratings_total,price_level,opening_hours,formatted_phone_number,website,photos,reviews",
		},
		priority: 1, // Highest priority data source
		required: true, // Critical for operation
	},

	// Yelp Fusion API - Reviews, ratings, and business details
	YELP: {
		name: "Yelp Fusion API",
		baseUrl: "https://api.yelp.com/v3",
		apiKey: process.env.YELP_API_KEY,
		rateLimit: {
			requestsPerSecond: 5, // Yelp allows 5000 requests per day
			requestsPerMinute: 100,
			requestsPerDay: 5000,
			burstLimit: 20,
		},
		endpoints: {
			search: "/businesses/search",
			details: "/businesses/{id}",
			reviews: "/businesses/{id}/reviews",
			autocomplete: "/autocomplete",
			categories: "/categories",
		},
		defaultParams: {
			locale: "en_US",
			limit: 50, // Maximum results per request
		},
		priority: 2,
		required: false,
	},

	// Foursquare Places API - Location data and tips
	FOURSQUARE: {
		name: "Foursquare Places API",
		baseUrl: "https://api.foursquare.com/v3/places",
		apiKey: process.env.FOURSQUARE_API_KEY,
		rateLimit: {
			requestsPerSecond: 10, // Foursquare allows generous limits
			requestsPerMinute: 500,
			requestsPerDay: 100000,
			burstLimit: 50,
		},
		endpoints: {
			search: "/search",
			details: "/{fsq_id}",
			photos: "/{fsq_id}/photos",
			tips: "/{fsq_id}/tips",
			categories: "/categories",
		},
		defaultParams: {
			limit: 50,
			sort: "RELEVANCE",
		},
		priority: 3,
		required: false,
	},

	// Overpass API (OpenStreetMap) - Free geographic business data
	OVERPASS: {
		name: "Overpass API (OpenStreetMap)",
		baseUrl: "https://overpass-api.de/api/interpreter",
		apiKey: null, // No API key required
		rateLimit: {
			requestsPerSecond: 2, // Be respectful to free service
			requestsPerMinute: 100,
			requestsPerDay: 10000,
			burstLimit: 5,
		},
		endpoints: {
			query: "", // Single endpoint with query parameter
		},
		defaultParams: {
			format: "json",
			timeout: 30,
		},
		priority: 4,
		required: false,
	},

	// OpenAI API - AI-powered data enhancement and validation
	OPENAI: {
		name: "OpenAI API",
		baseUrl: "https://api.openai.com/v1",
		apiKey: process.env.OPENAI_API_KEY,
		rateLimit: {
			requestsPerSecond: 3, // Conservative rate limiting
			requestsPerMinute: 150,
			requestsPerDay: 10000,
			burstLimit: 10,
		},
		endpoints: {
			chat: "/chat/completions",
			vision: "/chat/completions",
		},
		defaultParams: {
			model: "gpt-4o-mini", // Use latest efficient model
			temperature: 0.1, // Low temperature for consistent results
			max_tokens: 1000,
		},
		priority: 5,
		required: false,
	},

	// Geocoding API - Address validation and coordinate lookup
	GEOCODING: {
		name: "Google Geocoding API",
		baseUrl: "https://maps.googleapis.com/maps/api/geocode",
		apiKey: process.env.GOOGLE_GEOCODING_API_KEY || process.env.GOOGLE_PLACES_API_KEY,
		rateLimit: {
			requestsPerSecond: 50,
			requestsPerMinute: 1000,
			requestsPerDay: 40000,
			burstLimit: 100,
		},
		endpoints: {
			geocode: "/json",
		},
		defaultParams: {
			language: "en",
			region: "us",
		},
		priority: 6,
		required: false,
	},

	// ========== AllThingsDev API Collection ==========
	// Premium and free business intelligence APIs from AllThingsDev marketplace

	// Search People API - Business contact and personnel intelligence
	SEARCH_PEOPLE: {
		name: "Search People API (AllThingsDev)",
		baseUrl: "https://Search-People.proxy-production.allthingsdev.co",
		apiKey: process.env.ALLTHINGSDEV_API_KEY,
		rateLimit: {
			requestsPerSecond: 1, // Conservative rate limiting
			requestsPerMinute: 17, // 1000 requests per hour
			requestsPerDay: 24000,
			burstLimit: 5,
		},
		endpoints: {
			searchPerson: "/search/people",
		},
		headers: {
			Authorization: process.env.ALLTHINGSDEV_API_KEY,
			"Content-Type": "application/json",
		},
		features: ["business_personnel_search", "contact_information", "professional_profiles", "linkedin_integration", "lead_generation"],
		priority: 7,
		required: false,
		category: "business_intelligence",
	},

	// Business News Daily API - Real-time business news and intelligence
	BUSINESS_NEWS: {
		name: "Business News Daily API (AllThingsDev)",
		baseUrl: "https://Business-News-Daily.proxy-production.allthingsdev.co",
		apiKey: process.env.ALLTHINGSDEV_API_KEY,
		rateLimit: {
			requestsPerSecond: 1,
			requestsPerMinute: 17, // 1000 requests per hour
			requestsPerDay: 24000,
			burstLimit: 3,
		},
		endpoints: {
			getAllNews: "/api/news",
		},
		headers: {
			Authorization: process.env.ALLTHINGSDEV_API_KEY,
			"Content-Type": "application/json",
		},
		features: ["real_time_business_news", "company_specific_news", "market_intelligence", "sentiment_analysis", "financial_updates"],
		priority: 8,
		required: false,
		category: "business_intelligence",
	},

	// All-in-One Random Data API - Testing and mock data generation
	RANDOM_DATA: {
		name: "All-in-One Random Data API (AllThingsDev)",
		baseUrl: "https://All-in-One-Random-Data-API.proxy-production.allthingsdev.co",
		apiKey: process.env.ALLTHINGSDEV_API_KEY,
		rateLimit: {
			requestsPerSecond: 2, // More generous for testing data
			requestsPerMinute: 100, // 1000 requests per minute in pro plan
			requestsPerDay: 50000,
			burstLimit: 10,
		},
		endpoints: {
			company: "/api/company/random_company",
			address: "/api/address/random_address",
			restaurant: "/api/restaurant/random_restaurant",
			commerce: "/api/commerce/random_commerce",
			user: "/api/user/random_user",
			phone: "/api/phone_number/random_phone_number",
			food: "/api/food/random_food",
		},
		headers: {
			Authorization: process.env.ALLTHINGSDEV_API_KEY,
			"Content-Type": "application/json",
		},
		features: ["mock_business_data", "testing_datasets", "company_generation", "address_generation", "restaurant_data"],
		priority: 9,
		required: false,
		category: "testing",
	},

	// Hong Kong GeoData API - Geographic business and amenity data
	GEODATA: {
		name: "Hong Kong GeoData API (AllThingsDev)",
		baseUrl: "https://Hong-Kong-GeoData-API.proxy-production.allthingsdev.co",
		apiKey: process.env.ALLTHINGSDEV_API_KEY,
		rateLimit: {
			requestsPerSecond: 1,
			requestsPerMinute: 10, // 10 requests per minute in basic plan
			requestsPerDay: 14400,
			burstLimit: 3,
		},
		endpoints: {
			locationSearch: "/gs/api/v1.0.0/locationSearch",
			culturalCenters: "/cultural_centers",
		},
		headers: {
			Authorization: process.env.ALLTHINGSDEV_API_KEY,
			"Content-Type": "application/json",
		},
		features: ["geographic_business_data", "amenity_mapping", "bilingual_support", "cultural_centers", "location_intelligence"],
		priority: 10,
		required: false,
		category: "geographic",
	},
};

/**
 * Business List Data Sources - For Top 500 and targeted business collection
 */
export const BUSINESS_LISTS = {
	FORTUNE_500: {
		name: "Fortune 500 Companies",
		source: "https://fortune.com/ranking/fortune500/",
		dataFile: "fortune500.json",
		updateFrequency: "yearly",
		priority: 1,
	},

	INC_5000: {
		name: "Inc 5000 Fastest Growing Companies",
		source: "https://www.inc.com/inc5000/",
		dataFile: "inc5000.json",
		updateFrequency: "yearly",
		priority: 2,
	},

	RESTAURANT_CHAINS: {
		name: "Top Restaurant Chains",
		source: "custom",
		dataFile: "restaurant_chains.json",
		updateFrequency: "quarterly",
		priority: 3,
	},

	RETAIL_CHAINS: {
		name: "Major Retail Chains",
		source: "custom",
		dataFile: "retail_chains.json",
		updateFrequency: "quarterly",
		priority: 4,
	},

	HEALTHCARE_SYSTEMS: {
		name: "Healthcare Systems",
		source: "custom",
		dataFile: "healthcare_systems.json",
		updateFrequency: "yearly",
		priority: 5,
	},
};

/**
 * Validate API configuration and check for required environment variables
 */
export function validateApiConfig() {
	const missingKeys = [];
	const warnings = [];

	// Check required API keys
	for (const [apiName, config] of Object.entries(API_CONFIG)) {
		if (config.required && config.apiKey && !config.apiKey) {
			missingKeys.push(`${config.name}: ${apiName}_API_KEY`);
		} else if (!config.apiKey && config.apiKey !== null) {
			warnings.push(`${config.name}: ${apiName}_API_KEY (optional but recommended)`);
		}
	}

	// Log validation results
	if (missingKeys.length > 0) {
		logger.error("Missing required API keys:", missingKeys);
		throw new Error(`Missing required API keys: ${missingKeys.join(", ")}`);
	}

	if (warnings.length > 0) {
		logger.warn("Missing optional API keys:", warnings);
	}

	logger.info("API configuration validated successfully");
	return true;
}

/**
 * Get API configuration for specific service
 */
export function getApiConfig(serviceName) {
	const config = API_CONFIG[serviceName.toUpperCase()];
	if (!config) {
		throw new Error(`Unknown API service: ${serviceName}`);
	}
	return config;
}

/**
 * Check if API service is available (has valid configuration)
 */
export function isApiAvailable(serviceName) {
	try {
		const config = getApiConfig(serviceName);
		return config.apiKey !== undefined && config.apiKey !== null;
	} catch {
		return false;
	}
}

/**
 * Get available APIs sorted by priority
 */
export function getAvailableApis() {
	return Object.entries(API_CONFIG)
		.filter(([, config]) => config.apiKey !== undefined && config.apiKey !== null)
		.sort(([, a], [, b]) => a.priority - b.priority)
		.map(([name]) => name);
}

/**
 * Default configuration for new API integrations
 */
export const DEFAULT_API_CONFIG = {
	timeout: 30000, // 30 second timeout
	retries: 3, // Retry failed requests 3 times
	retryDelay: 1000, // Initial retry delay (exponential backoff)
	headers: {
		"User-Agent": "ThorbisBusinessCollector/1.0",
		Accept: "application/json",
		"Content-Type": "application/json",
	},
	validateStatus: (status) => status < 500, // Retry on server errors only
};

// Environment variable validation messages
export const ENV_SETUP_INSTRUCTIONS = {
	GOOGLE_PLACES_API_KEY: `
Get your Google Places API key:
1. Go to https://console.cloud.google.com/
2. Enable Places API
3. Create credentials (API Key)
4. Add to .env.local: GOOGLE_PLACES_API_KEY=your_key_here
  `,

	YELP_API_KEY: `
Get your Yelp API key:
1. Go to https://www.yelp.com/developers/v3/manage_app
2. Create a new app
3. Add to .env.local: YELP_API_KEY=your_key_here
  `,

	FOURSQUARE_API_KEY: `
Get your Foursquare API key:
1. Go to https://developer.foursquare.com/
2. Create a new app
3. Add to .env.local: FOURSQUARE_API_KEY=your_key_here
  `,

	OPENAI_API_KEY: `
Get your OpenAI API key:
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to .env.local: OPENAI_API_KEY=your_key_here
  `,

	ALLTHINGSDEV_API_KEY: `
Get your AllThingsDev API key:
1. Go to https://www.allthingsdev.co/
2. Sign up for an account
3. Navigate to API Marketplace
4. Subscribe to desired APIs (Search People, Business News, Random Data, GeoData)
5. Get your API key from the dashboard
6. Add to .env.local: ALLTHINGSDEV_API_KEY=your_key_here

Available AllThingsDev APIs:
- Search People API: Business contact and personnel intelligence
- Business News Daily: Real-time business news and market updates  
- All-in-One Random Data: Testing and mock business data generation
- Hong Kong GeoData: Geographic business and amenity data
  `,
};
