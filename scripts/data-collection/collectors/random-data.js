/**
 * All-in-One Random Data API Collector (AllThingsDev)
 *
 * FREE/PREMIUM DATA SOURCE - Comprehensive mock and company data
 * Provides random business data for testing and real company information
 *
 * Features:
 * - Random company data generation for testing
 * - Business address and contact information
 * - Restaurant and commerce data
 * - User profiles and demographics
 * - Vehicle and device information
 * - Financial and subscription data
 * - Perfect for testing and data simulation
 *
 * Use Cases:
 * - Testing business data collection systems
 * - Generating mock data for development
 * - Data quality validation and testing
 * - Business information enrichment
 * - Address and contact data validation
 * - Performance testing with realistic data
 *
 * Performance: Excellent for testing and development environments
 */

import axios from "axios";
import { RateLimiterManager } from "../utils/rate-limiter.js";
import { CacheManager } from "../utils/cache-manager.js";
import { Logger } from "../utils/error-handler.js";

export class RandomDataCollector {
	constructor() {
		this.rateLimiter = RateLimiterManager.getLimiter("random_data");
		this.logger = new Logger("RandomDataCollector");
		this.cache = CacheManager;

		// API configuration
		this.apiConfig = {
			baseUrl: "https://All-in-One-Random-Data-API.proxy-production.allthingsdev.co",
			headers: {
				Authorization: process.env.ALLTHINGSDEV_API_KEY || "",
				"Content-Type": "application/json",
			},
		};

		// Available data endpoints for business information
		this.businessEndpoints = {
			company: "/api/company/random_company",
			address: "/api/address/random_address",
			restaurant: "/api/restaurant/random_restaurant",
			commerce: "/api/commerce/random_commerce",
			user: "/api/user/random_user",
			phone: "/api/phone_number/random_phone_number",
			food: "/api/food/random_food",
			name: "/api/name/random_name",
		};

		// Data type categories
		this.dataCategories = {
			business: ["company", "address", "restaurant", "commerce"],
			personal: ["user", "name", "phone"],
			products: ["food", "commerce"],
			testing: ["all"], // All endpoints for comprehensive testing
		};
	}

	/**
	 * Generate random company data for testing or mock scenarios
	 * Returns realistic business information
	 */
	async generateRandomCompanies(count = 10, options = {}) {
		const cacheKey = `random_companies_${count}_${JSON.stringify(options)}`;

		try {
			// Check cache first (longer cache for testing data)
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				this.logger.info(`Random companies cache hit for ${count} companies`);
				return cached;
			}

			const startTime = performance.now();
			this.logger.info(`Generating ${count} random companies`);

			const companies = [];

			for (let i = 0; i < count; i++) {
				try {
					await this.rateLimiter.waitForToken();

					// Get company data
					const companyData = await this.fetchRandomData("company");

					if (companyData) {
						// Enhance with additional data
						const enhancedCompany = await this.enhanceCompanyData(companyData);
						companies.push(enhancedCompany);
					}

					// Brief delay between requests
					if (i < count - 1) {
						await this.delay(200);
					}
				} catch (error) {
					this.logger.warn(`Failed to generate company ${i + 1}: ${error.message}`);
					continue;
				}
			}

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Random companies generation completed in ${queryTime.toFixed(2)}ms`);
			this.logger.info(`Generated ${companies.length} random companies`);

			// Cache for 1 hour (testing data doesn't change frequently)
			await this.cache.set(cacheKey, companies, 60 * 60 * 1000);

			return companies;
		} catch (error) {
			this.logger.error(`Random companies generation failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Generate random restaurant data for testing hospitality businesses
	 */
	async generateRandomRestaurants(count = 10, options = {}) {
		const cacheKey = `random_restaurants_${count}_${JSON.stringify(options)}`;

		try {
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				return cached;
			}

			const startTime = performance.now();
			this.logger.info(`Generating ${count} random restaurants`);

			const restaurants = [];

			for (let i = 0; i < count; i++) {
				try {
					await this.rateLimiter.waitForToken();

					const restaurantData = await this.fetchRandomData("restaurant");

					if (restaurantData) {
						const enhancedRestaurant = await this.enhanceRestaurantData(restaurantData);
						restaurants.push(enhancedRestaurant);
					}

					if (i < count - 1) {
						await this.delay(200);
					}
				} catch (error) {
					this.logger.warn(`Failed to generate restaurant ${i + 1}: ${error.message}`);
					continue;
				}
			}

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Random restaurants generation completed in ${queryTime.toFixed(2)}ms`);

			// Cache for 1 hour
			await this.cache.set(cacheKey, restaurants, 60 * 60 * 1000);

			return restaurants;
		} catch (error) {
			this.logger.error(`Random restaurants generation failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Generate comprehensive business dataset for testing
	 * Includes companies, restaurants, and commerce data
	 */
	async generateTestBusinessDataset(options = {}) {
		const count = options.count || 20;
		const cacheKey = `test_business_dataset_${count}`;

		try {
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				return cached;
			}

			const startTime = performance.now();
			this.logger.info(`Generating comprehensive test business dataset (${count} businesses)`);

			const dataset = {
				companies: [],
				restaurants: [],
				commerce: [],
				addresses: [],
				total_businesses: 0,
				generated_at: new Date().toISOString(),
			};

			// Generate different types of businesses
			const companiesCount = Math.floor(count * 0.4); // 40% companies
			const restaurantsCount = Math.floor(count * 0.3); // 30% restaurants
			const commerceCount = count - companiesCount - restaurantsCount; // remaining commerce

			// Generate companies
			if (companiesCount > 0) {
				dataset.companies = await this.generateRandomCompanies(companiesCount, options);
			}

			// Generate restaurants
			if (restaurantsCount > 0) {
				dataset.restaurants = await this.generateRandomRestaurants(restaurantsCount, options);
			}

			// Generate commerce businesses
			if (commerceCount > 0) {
				dataset.commerce = await this.generateRandomCommerce(commerceCount, options);
			}

			// Generate additional addresses for location testing
			dataset.addresses = await this.generateRandomAddresses(count, options);

			dataset.total_businesses = dataset.companies.length + dataset.restaurants.length + dataset.commerce.length;

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Test business dataset generation completed in ${queryTime.toFixed(2)}ms`);
			this.logger.info(`Generated ${dataset.total_businesses} test businesses`);

			// Cache for 2 hours
			await this.cache.set(cacheKey, dataset, 2 * 60 * 60 * 1000);

			return dataset;
		} catch (error) {
			this.logger.error(`Test business dataset generation failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Generate random commerce/retail businesses
	 */
	async generateRandomCommerce(count = 10, options = {}) {
		try {
			const commerce = [];

			for (let i = 0; i < count; i++) {
				await this.rateLimiter.waitForToken();

				const commerceData = await this.fetchRandomData("commerce");

				if (commerceData) {
					const enhancedCommerce = await this.enhanceCommerceData(commerceData);
					commerce.push(enhancedCommerce);
				}

				if (i < count - 1) {
					await this.delay(200);
				}
			}

			return commerce;
		} catch (error) {
			this.logger.error(`Random commerce generation failed: ${error.message}`);
			return [];
		}
	}

	/**
	 * Generate random addresses for location testing
	 */
	async generateRandomAddresses(count = 10, options = {}) {
		try {
			const addresses = [];

			for (let i = 0; i < count; i++) {
				await this.rateLimiter.waitForToken();

				const addressData = await this.fetchRandomData("address");

				if (addressData) {
					addresses.push(this.normalizeAddressData(addressData));
				}

				if (i < count - 1) {
					await this.delay(200);
				}
			}

			return addresses;
		} catch (error) {
			this.logger.error(`Random addresses generation failed: ${error.message}`);
			return [];
		}
	}

	/**
	 * Fetch random data from specific endpoint
	 */
	async fetchRandomData(dataType) {
		const endpoint = this.businessEndpoints[dataType];

		if (!endpoint) {
			throw new Error(`Unknown data type: ${dataType}`);
		}

		try {
			const response = await axios.get(`${this.apiConfig.baseUrl}${endpoint}`, {
				headers: this.apiConfig.headers,
				timeout: 15000,
			});

			if (response.status === 200 && response.data) {
				return response.data;
			} else {
				throw new Error(`Unexpected response status: ${response.status}`);
			}
		} catch (error) {
			if (error.response?.status === 401) {
				throw new Error("Invalid AllThingsDev API key for Random Data");
			} else if (error.response?.status === 429) {
				throw new Error("Random Data API rate limit exceeded");
			}

			throw error;
		}
	}

	/**
	 * Enhance company data with additional business information
	 */
	async enhanceCompanyData(companyData) {
		try {
			// Get additional address data for the company
			const addressData = await this.fetchRandomData("address");
			const phoneData = await this.fetchRandomData("phone");

			const enhancedCompany = {
				// Basic Information
				name: companyData.business_name,
				description: companyData.catch_phrase || companyData.bs_company_statement,
				industry: companyData.industry,
				business_type: companyData.type,

				// Contact Information
				phone: phoneData?.phone_number || companyData.phone_number,
				email: this.generateBusinessEmail(companyData.business_name),
				website: this.generateWebsite(companyData.business_name),

				// Location
				address: companyData.full_address || addressData?.full_address,
				latitude: companyData.latitude || addressData?.latitude,
				longitude: companyData.longitude || addressData?.longitude,
				city: addressData?.city,
				state: addressData?.state,
				country: addressData?.country || "US",
				postal_code: addressData?.zip_code,

				// Business Details
				categories: [companyData.industry?.toLowerCase().replace(/\s+/g, "_") || "general_business"],
				employee_count: this.estimateEmployeeCount(companyData.type),
				founded_year: this.generateFoundedYear(),

				// Company Identifiers
				duns_number: companyData.duns_number,
				employee_id: companyData.employee_identification_number,
				logo_url: companyData.logo,

				// Business Attributes
				company_suffix: companyData.suffix,
				buzzwords: [companyData.buzzword].filter(Boolean),

				// Metadata
				data_source: "random_data_allthingsdev",
				data_quality: 75, // Mock data has good structure but may not be real
				last_updated: new Date().toISOString(),

				// Business status (for testing)
				status: "pending",
				verified: false,
				claimed_by: null,
				claimed_at: null,
				is_test_data: true,

				// Original data
				raw_data: companyData,
			};

			return enhancedCompany;
		} catch (error) {
			this.logger.warn(`Failed to enhance company data: ${error.message}`);
			return null;
		}
	}

	/**
	 * Enhance restaurant data with additional information
	 */
	async enhanceRestaurantData(restaurantData) {
		try {
			const addressData = await this.fetchRandomData("address");
			const foodData = await this.fetchRandomData("food");

			const enhancedRestaurant = {
				// Basic Information
				name: restaurantData.name,
				description: restaurantData.description || `${restaurantData.type} restaurant`,
				cuisine_type: restaurantData.type,

				// Contact Information
				phone: restaurantData.phone_number,
				email: this.generateBusinessEmail(restaurantData.name),
				website: this.generateWebsite(restaurantData.name),

				// Location
				address: restaurantData.address || addressData?.full_address,
				latitude: addressData?.latitude,
				longitude: addressData?.longitude,
				city: addressData?.city,
				state: addressData?.state,
				country: addressData?.country || "US",
				postal_code: addressData?.zip_code,

				// Restaurant Specific
				categories: ["restaurant", "food_service", restaurantData.type?.toLowerCase().replace(/\s+/g, "_")].filter(Boolean),
				cuisine: [restaurantData.type],
				sample_dish: foodData?.dish,
				price_range: this.estimatePriceRange(restaurantData.type),

				// Operating Hours
				hours: this.normalizeRestaurantHours(restaurantData.hours),

				// Business Details
				logo_url: restaurantData.logo,
				review_summary: restaurantData.review,

				// Metadata
				data_source: "random_data_allthingsdev",
				data_quality: 80,
				last_updated: new Date().toISOString(),

				// Status
				status: "pending",
				verified: false,
				claimed_by: null,
				claimed_at: null,
				is_test_data: true,

				// Original data
				raw_data: restaurantData,
			};

			return enhancedRestaurant;
		} catch (error) {
			this.logger.warn(`Failed to enhance restaurant data: ${error.message}`);
			return null;
		}
	}

	/**
	 * Enhance commerce data for retail businesses
	 */
	async enhanceCommerceData(commerceData) {
		try {
			const addressData = await this.fetchRandomData("address");
			const companyData = await this.fetchRandomData("company");

			const enhancedCommerce = {
				// Basic Information
				name: `${commerceData.product_name} Store`,
				description: `${commerceData.department} retail store specializing in ${commerceData.material} products`,

				// Product Information
				primary_product: commerceData.product_name,
				department: commerceData.department,
				material_focus: commerceData.material,
				product_color: commerceData.color,
				price_range: commerceData.price,

				// Business Information
				business_type: "retail",
				categories: ["retail", "commerce", commerceData.department?.toLowerCase().replace(/\s+/g, "_")].filter(Boolean),

				// Contact Information
				phone: companyData?.phone_number,
				email: this.generateBusinessEmail(`${commerceData.product_name} Store`),
				website: this.generateWebsite(`${commerceData.product_name} Store`),

				// Location
				address: addressData?.full_address,
				latitude: addressData?.latitude,
				longitude: addressData?.longitude,
				city: addressData?.city,
				state: addressData?.state,
				country: addressData?.country || "US",
				postal_code: addressData?.zip_code,

				// Promotions
				promo_code: commerceData.promo_code,
				price_string: commerceData.price_string,

				// Metadata
				data_source: "random_data_allthingsdev",
				data_quality: 70,
				last_updated: new Date().toISOString(),

				// Status
				status: "pending",
				verified: false,
				claimed_by: null,
				claimed_at: null,
				is_test_data: true,

				// Original data
				raw_data: commerceData,
			};

			return enhancedCommerce;
		} catch (error) {
			this.logger.warn(`Failed to enhance commerce data: ${error.message}`);
			return null;
		}
	}

	/**
	 * Normalize address data
	 */
	normalizeAddressData(addressData) {
		return {
			full_address: addressData.full_address,
			street_address: addressData.street_address,
			street_name: addressData.street_name,
			building_number: addressData.building_number,
			city: addressData.city,
			state: addressData.state,
			country: addressData.country,
			postal_code: addressData.zip_code || addressData.postcode,
			latitude: addressData.latitude,
			longitude: addressData.longitude,
			time_zone: addressData.time_zone,
			data_source: "random_data_allthingsdev",
			is_test_data: true,
		};
	}

	/**
	 * Normalize restaurant operating hours
	 */
	normalizeRestaurantHours(hoursData) {
		if (!hoursData || typeof hoursData !== "object") {
			return null;
		}

		const normalizedHours = {};
		const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

		days.forEach((day) => {
			if (hoursData[day]) {
				normalizedHours[day] = {
					open: hoursData[day].opens_at || "09:00",
					close: hoursData[day].closes_at || "21:00",
					is_closed: hoursData[day].is_closed || false,
				};
			}
		});

		return Object.keys(normalizedHours).length > 0 ? normalizedHours : null;
	}

	/**
	 * Generate business email from business name
	 */
	generateBusinessEmail(businessName) {
		if (!businessName) return null;

		const cleanName = businessName
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, "")
			.replace(/\s+/g, "")
			.substring(0, 15);

		const domains = ["gmail.com", "business.com", "company.com", "info.com"];
		const randomDomain = domains[Math.floor(Math.random() * domains.length)];

		return `info@${cleanName}.${randomDomain}`;
	}

	/**
	 * Generate website URL from business name
	 */
	generateWebsite(businessName) {
		if (!businessName) return null;

		const cleanName = businessName
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, "")
			.replace(/\s+/g, "")
			.substring(0, 20);

		return `https://www.${cleanName}.com`;
	}

	/**
	 * Estimate employee count based on business type
	 */
	estimateEmployeeCount(businessType) {
		const ranges = {
			startup: "1-10",
			"small business": "1-50",
			corporation: "50-500",
			enterprise: "500+",
			llc: "1-25",
			partnership: "1-20",
		};

		return ranges[businessType?.toLowerCase()] || "1-50";
	}

	/**
	 * Generate realistic founded year
	 */
	generateFoundedYear() {
		const currentYear = new Date().getFullYear();
		const minYear = currentYear - 50; // Up to 50 years ago
		const maxYear = currentYear - 1; // At least 1 year old

		return Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
	}

	/**
	 * Estimate price range for restaurants
	 */
	estimatePriceRange(cuisineType) {
		const priceRanges = {
			"fast food": "$",
			"casual dining": "$$",
			"fine dining": "$$$",
			american: "$$",
			international: "$$$",
			coffee: "$",
			bar: "$$",
		};

		return priceRanges[cuisineType?.toLowerCase()] || "$$";
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
			apiEndpoint: this.apiConfig.baseUrl,
			availableDataTypes: Object.keys(this.businessEndpoints),
			dataCategories: this.dataCategories,
			supportedBusinessTypes: ["companies", "restaurants", "commerce", "addresses", "comprehensive_datasets"],
		};
	}
}

export default RandomDataCollector;
