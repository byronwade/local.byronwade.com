#!/usr/bin/env node

// Business Data Collection Main Script
// Intelligent orchestration of business data gathering from multiple sources

import { Command } from "commander";
import { logger, errorHandler } from "./utils/error-handler.js";
import { validateApiConfig, getAvailableApis } from "./config/apis.js";
import { FORTUNE_500_SAMPLE, RESTAURANT_CHAINS, RETAIL_CHAINS, GEOGRAPHIC_PRIORITIES, getBusinessesByTier } from "./config/business-lists.js";
import { GooglePlacesCollector } from "./collectors/google-places.js";
import { OverpassCollector } from "./collectors/overpass.js";
import { GovernmentDataCollector } from "./collectors/government-data.js";
import { WebScraperCollector } from "./collectors/web-scraper.js";
import { SearchPeopleCollector } from "./collectors/search-people.js";
import { BusinessNewsCollector } from "./collectors/business-news.js";
import { RandomDataCollector } from "./collectors/random-data.js";
import { GeoDataCollector } from "./collectors/geodata.js";
import { AIDataEnhancer } from "./enhancers/ai-data-enhancer.js";
import { cacheManager } from "./utils/cache-manager.js";
import { BusinessDataProcessor } from "./processors/data-merger.js";
import { SupabaseBusinessPopulator } from "./database/business-populator.js";

/**
 * Main Business Data Collection Orchestrator
 */
class BusinessDataCollector {
	constructor(options = {}) {
		this.options = {
			mode: options.mode || "test",
			limit: options.limit || null,
			verbose: options.verbose || false,
			dryRun: options.dryRun || false,
			skipAi: options.skipAi || false,
			categories: options.categories || [],
			location: options.location || null,
			radius: options.radius || 50,
			...options,
		};

		// Set log level based on verbose flag
		if (this.options.verbose) {
			logger.config.level = "debug";
		}

		// Initialize components
		this.collectors = new Map();
		this.processor = new BusinessDataProcessor();
		this.populator = new SupabaseBusinessPopulator();
		this.aiEnhancer = new AIDataEnhancer();

		// Performance tracking
		this.stats = {
			startTime: Date.now(),
			businessesProcessed: 0,
			businessesInserted: 0,
			errors: 0,
			apiCalls: 0,
			cacheHits: 0,
		};

		logger.info("Business Data Collector initialized", this.options);
	}

	/**
	 * Initialize all data collectors
	 */
	async initialize() {
		logger.info("Initializing business data collection system...");

		try {
			// Validate API configurations
			validateApiConfig();

			// Initialize available collectors
			await this.initializeCollectors();

			// Test database connection
			await this.populator.testConnection();

			logger.info("System initialization completed successfully");
		} catch (error) {
			logger.critical("System initialization failed", { error: error.message });
			throw error;
		}
	}

	/**
	 * Initialize data collectors based on available APIs
	 */
	async initializeCollectors() {
		const availableApis = getAvailableApis();

		logger.info(`Available APIs: ${availableApis.join(", ")}`);

		// Initialize Google Places (primary paid source) - skip if free-only mode
		if (availableApis.includes("GOOGLE_PLACES") && !this.options.freeOnly) {
			this.collectors.set("google_places", new GooglePlacesCollector());
			logger.info("Google Places collector initialized");
		} else if (this.options.freeOnly) {
			logger.info("Skipping Google Places (paid) - free-only mode enabled");
		}

		// Initialize FREE data sources (no API keys required)

		// Overpass API (OpenStreetMap) - Completely free
		this.collectors.set("overpass", new OverpassCollector());
		logger.info("Overpass (OpenStreetMap) collector initialized - FREE");

		// Government Data (SEC, Data.gov, etc.) - Free
		this.collectors.set("government", new GovernmentDataCollector());
		logger.info("Government Data collector initialized - FREE");

		// Web Scraper (Public directories) - Free
		this.collectors.set("web_scraper", new WebScraperCollector());
		logger.info("Web Scraper collector initialized - FREE");

		// Initialize AllThingsDev API collectors (Premium business intelligence)
		if (availableApis.includes("SEARCH_PEOPLE")) {
			this.collectors.set("search_people", new SearchPeopleCollector());
			logger.info("Search People (AllThingsDev) collector initialized - PREMIUM INTELLIGENCE");
		}

		if (availableApis.includes("BUSINESS_NEWS")) {
			this.collectors.set("business_news", new BusinessNewsCollector());
			logger.info("Business News Daily (AllThingsDev) collector initialized - REAL-TIME INTELLIGENCE");
		}

		if (availableApis.includes("RANDOM_DATA")) {
			this.collectors.set("random_data", new RandomDataCollector());
			logger.info("Random Data (AllThingsDev) collector initialized - TESTING & MOCK DATA");
		}

		if (availableApis.includes("GEODATA")) {
			this.collectors.set("geodata", new GeoDataCollector());
			logger.info("GeoData (AllThingsDev) collector initialized - GEOGRAPHIC INTELLIGENCE");
		}

		// TODO: Initialize other paid collectors when implemented
		// if (availableApis.includes('YELP')) {
		//   this.collectors.set('yelp', new YelpCollector());
		// }
		// if (availableApis.includes('FOURSQUARE')) {
		//   this.collectors.set('foursquare', new FoursquareCollector());
		// }

		// Always have at least the free collectors
		if (this.collectors.size === 0) {
			throw new Error("No data collectors could be initialized.");
		}

		logger.info(`Initialized ${this.collectors.size} data collectors (${this.collectors.size >= 3 ? this.collectors.size - (availableApis.includes("GOOGLE_PLACES") ? 1 : 0) : this.collectors.size} FREE sources)`);
	}

	/**
	 * Run data collection based on mode
	 */
	async run() {
		try {
			await this.initialize();

			logger.info(`Starting data collection in ${this.options.mode} mode`);

			switch (this.options.mode) {
				case "top500":
					await this.collectTop500Businesses();
					break;
				case "geographic":
					await this.collectGeographicBusinesses();
					break;
				case "category":
					await this.collectCategoryBusinesses();
					break;
				case "test":
					await this.collectTestData();
					break;
				case "update":
					await this.updateExistingBusinesses();
					break;
				case "free-bulk":
					await this.collectFreeBulkData();
					break;
				case "allthingsdev-test":
					await this.collectAllThingsDevTestData();
					break;
				default:
					throw new Error(`Unknown mode: ${this.options.mode}`);
			}

			await this.generateReport();
		} catch (error) {
			this.stats.errors++;
			logger.critical("Data collection failed", { error: error.message });
			throw error;
		} finally {
			await this.cleanup();
		}
	}

	/**
	 * Collect Fortune 500 and major business data
	 */
	async collectTop500Businesses() {
		logger.info("Starting Fortune 500 business data collection");

		const businesses = getBusinessesByTier(1);
		const limitedBusinesses = this.options.limit ? businesses.slice(0, this.options.limit) : businesses;

		logger.info(`Collecting data for ${limitedBusinesses.length} top-tier businesses`);

		// Process in batches to manage memory and API limits
		const batchSize = 10;

		for (let i = 0; i < limitedBusinesses.length; i += batchSize) {
			const batch = limitedBusinesses.slice(i, i + batchSize);

			logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(limitedBusinesses.length / batchSize)}`);

			await this.processBatch(batch, {
				priority: "high",
				includeDetails: true,
				includePhotos: true,
				aiEnhancement: !this.options.skipAi,
			});

			// Progress update
			const processed = Math.min(i + batchSize, limitedBusinesses.length);
			logger.info(`Progress: ${processed}/${limitedBusinesses.length} businesses processed`);
		}
	}

	/**
	 * Collect businesses by geographic location
	 */
	async collectGeographicBusinesses() {
		logger.info(`Starting geographic business collection for: ${this.options.location}`);

		const location = await this.parseLocation(this.options.location);
		const collector = this.collectors.get("google_places");

		if (!collector) {
			throw new Error("Google Places collector required for geographic search");
		}

		// Search by location and radius
		const businesses = await collector.searchNearby(location.lat, location.lng, {
			radius: this.options.radius * 1000, // Convert km to meters
			type: "establishment",
		});

		logger.info(`Found ${businesses.length} businesses in ${this.options.location}`);

		// Process all found businesses
		await this.processBatch(businesses, {
			priority: "medium",
			includeDetails: true,
			location: location,
		});
	}

	/**
	 * Collect businesses by category
	 */
	async collectCategoryBusinesses() {
		logger.info(`Starting category-based collection for: ${this.options.categories.join(", ")}`);

		const collector = this.collectors.get("google_places");
		if (!collector) {
			throw new Error("Google Places collector required for category search");
		}

		// Use geographic priorities for location-based searches
		const locations = GEOGRAPHIC_PRIORITIES.filter((loc) => loc.priority <= 2);

		for (const category of this.options.categories) {
			logger.info(`Collecting ${category} businesses across ${locations.length} cities`);

			for (const location of locations) {
				try {
					const businesses = await collector.searchByCategory(category, location, {
						radius: 25000, // 25km radius
					});

					logger.info(`Found ${businesses.length} ${category} businesses in ${location.city}, ${location.state}`);

					if (businesses.length > 0) {
						await this.processBatch(businesses, {
							priority: "medium",
							category: category,
							location: location,
						});
					}

					// Rate limiting between cities
					await this.sleep(2000);
				} catch (error) {
					logger.error(`Failed to collect ${category} businesses in ${location.city}`, {
						error: error.message,
					});
				}
			}
		}
	}

	/**
	 * Collect limited test data
	 */
	async collectTestData() {
		logger.info("Starting test data collection (limited scope)");

		const testBusinesses = [
			{ name: "Starbucks", category: "coffee" },
			{ name: "McDonald's", category: "restaurant" },
			{ name: "Target", category: "retail" },
			{ name: "CVS Pharmacy", category: "pharmacy" },
			{ name: "Bank of America", category: "bank" },
		];

		const limitedTests = this.options.limit ? testBusinesses.slice(0, this.options.limit) : testBusinesses.slice(0, 5);

		// Use San Francisco as test location
		const testLocation = { city: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194 };

		logger.info(`Testing with ${limitedTests.length} businesses in ${testLocation.city}`);

		for (const business of limitedTests) {
			try {
				await this.collectSingleBusiness(business.name, testLocation, {
					category: business.category,
					priority: "test",
				});
			} catch (error) {
				logger.warn(`Test collection failed for ${business.name}`, { error: error.message });
			}
		}
	}

	/**
	 * Test AllThingsDev API collection capabilities
	 * Showcases all premium business intelligence features
	 */
	async collectAllThingsDevTestData() {
		logger.info("Starting AllThingsDev API test data collection");

		// Test businesses for AllThingsDev APIs
		const testBusinesses = [
			{ name: "Apple Inc", category: "technology", description: "Test with major public company" },
			{ name: "McDonald's Corporation", category: "restaurant", description: "Test with global franchise" },
			{ name: "Goldman Sachs", category: "finance", description: "Test with financial services" },
			{ name: "Tesla Inc", category: "automotive", description: "Test with innovative company" },
			{ name: "Microsoft Corporation", category: "technology", description: "Test with enterprise business" },
		];

		const limitedTests = this.options.limit ? testBusinesses.slice(0, this.options.limit) : testBusinesses.slice(0, 3);

		// Use New York as test location (financial center with lots of business activity)
		const testLocation = { city: "New York", state: "NY", lat: 40.7128, lng: -74.006 };

		logger.info(`Testing AllThingsDev APIs with ${limitedTests.length} major businesses in ${testLocation.city}`);

		// Test each AllThingsDev collector individually first
		await this.testIndividualAllThingsDevAPIs(testLocation);

		// Then test integrated business collection
		for (const business of limitedTests) {
			try {
				logger.info(`🚀 Testing comprehensive AllThingsDev collection for: ${business.name}`);

				await this.collectSingleBusiness(business.name, testLocation, {
					category: business.category,
					priority: "test",
					includeTestData: true, // Enable Random Data API
					forceAiEnhancement: true, // Force AI enhancement
				});

				logger.info(`✅ AllThingsDev collection completed for: ${business.name}`);
			} catch (error) {
				logger.warn(`❌ AllThingsDev test failed for ${business.name}: ${error.message}`);
			}
		}

		// Generate AllThingsDev-specific summary
		await this.generateAllThingsDevSummary();
	}

	/**
	 * Test individual AllThingsDev APIs
	 */
	async testIndividualAllThingsDevAPIs(location) {
		logger.info("🧪 Testing individual AllThingsDev APIs...");

		// Test Search People API
		if (this.collectors.has("search_people")) {
			try {
				logger.info("Testing Search People API...");
				const peopleCollector = this.collectors.get("search_people");
				const personnel = await peopleCollector.searchBusinessPersonnel("Apple Inc", `${location.city}, ${location.state}`);
				logger.info(`✅ Search People API: Found ${personnel.length} personnel records`);
			} catch (error) {
				logger.warn(`❌ Search People API test failed: ${error.message}`);
			}
		}

		// Test Business News API
		if (this.collectors.has("business_news")) {
			try {
				logger.info("Testing Business News Daily API...");
				const newsCollector = this.collectors.get("business_news");
				const news = await newsCollector.getCompanyNews("Apple Inc");
				logger.info(`✅ Business News API: Found ${news.articles.length} news articles`);
			} catch (error) {
				logger.warn(`❌ Business News API test failed: ${error.message}`);
			}
		}

		// Test Random Data API
		if (this.collectors.has("random_data")) {
			try {
				logger.info("Testing Random Data API...");
				const randomCollector = this.collectors.get("random_data");
				const companies = await randomCollector.generateRandomCompanies(3);
				logger.info(`✅ Random Data API: Generated ${companies.length} mock companies`);
			} catch (error) {
				logger.warn(`❌ Random Data API test failed: ${error.message}`);
			}
		}

		// Test GeoData API
		if (this.collectors.has("geodata")) {
			try {
				logger.info("Testing GeoData API...");
				const geoCollector = this.collectors.get("geodata");
				const geoData = await geoCollector.searchBusinessesByQuery("cultural center");
				logger.info(`✅ GeoData API: Found ${geoData.length} geographic businesses`);
			} catch (error) {
				logger.warn(`❌ GeoData API test failed: ${error.message}`);
			}
		}

		logger.info("🎯 Individual API testing completed");
	}

	/**
	 * Generate AllThingsDev-specific summary report
	 */
	async generateAllThingsDevSummary() {
		logger.info("📊 Generating AllThingsDev API Summary...");

		const allThingsDevCollectors = ["search_people", "business_news", "random_data", "geodata"];
		const enabledAPIs = allThingsDevCollectors.filter((api) => this.collectors.has(api));
		const availableAPIs = allThingsDevCollectors.length;

		logger.info(`
🌟 AllThingsDev API Integration Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 API Status:
   • Enabled APIs: ${enabledAPIs.length}/${availableAPIs}
   • Active APIs: ${enabledAPIs.join(", ")}
   
🚀 Capabilities Added:
   • Business Personnel Intelligence: ${this.collectors.has("search_people") ? "✅ ACTIVE" : "❌ Disabled"}
   • Real-time Business News: ${this.collectors.has("business_news") ? "✅ ACTIVE" : "❌ Disabled"}  
   • Mock Data Generation: ${this.collectors.has("random_data") ? "✅ ACTIVE" : "❌ Disabled"}
   • Geographic Intelligence: ${this.collectors.has("geodata") ? "✅ ACTIVE" : "❌ Disabled"}

💡 Business Intelligence Features:
   • Key Personnel Discovery
   • Contact Information Enrichment
   • Real-time News & Market Intelligence
   • Sentiment Analysis & Trending Topics
   • Geographic Business Mapping
   • Comprehensive Testing Data
   
🎯 Data Sources Now Available: ${this.collectors.size} total collectors
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		`);

		if (enabledAPIs.length < availableAPIs) {
			logger.warn(`
⚠️  Setup Reminder:
   To enable all AllThingsDev APIs, add to your .env.local:
   ALLTHINGSDEV_API_KEY=your_api_key_here
   
   Get your key at: https://www.allthingsdev.co/
			`);
		}
	}

	/**
	 * Update existing businesses with fresh data
	 */
	async updateExistingBusinesses() {
		logger.info("Starting update of existing business data");

		// Get businesses that need updating (older than 30 days)
		const existingBusinesses = await this.populator.getBusinessesForUpdate(30);

		logger.info(`Found ${existingBusinesses.length} businesses to update`);

		const limitedBusinesses = this.options.limit ? existingBusinesses.slice(0, this.options.limit) : existingBusinesses;

		for (const business of limitedBusinesses) {
			try {
				await this.updateSingleBusiness(business);
			} catch (error) {
				logger.error(`Failed to update business: ${business.name}`, { error: error.message });
			}
		}
	}

	/**
	 * Collect bulk business data using ONLY FREE sources
	 * Perfect for getting "extremely elaborate, all data and accurate data" at no cost
	 */
	async collectFreeBulkData() {
		logger.info("🚀 Starting FREE bulk data collection - No API costs!");
		logger.info("📊 Using OpenStreetMap, Government Data, and Web Scraping");

		// Force free-only mode
		this.options.freeOnly = true;

		const collectedBusinesses = new Map(); // Use Map to deduplicate by fingerprint

		try {
			// 1. Collect from OpenStreetMap (Overpass API) - Completely FREE
			logger.info("🗺️  Phase 1: Collecting from OpenStreetMap (Overpass API)");
			await this.collectFromOverpass(collectedBusinesses);

			// 2. Collect from Government sources - FREE
			logger.info("🏛️  Phase 2: Collecting from Government sources (SEC, Data.gov)");
			await this.collectFromGovernment(collectedBusinesses);

			// 3. Collect from Web scraping - FREE
			logger.info("🌐 Phase 3: Collecting from public directories (Web scraping)");
			await this.collectFromWebSources(collectedBusinesses);

			// 4. Process and enhance with AI
			logger.info("🤖 Phase 4: AI enhancement for extremely elaborate data");
			await this.processFreeBulkData(Array.from(collectedBusinesses.values()));
		} catch (error) {
			logger.error(`Free bulk data collection failed: ${error.message}`);
			throw error;
		}

		logger.info(`🎉 FREE bulk data collection completed! Processed ${collectedBusinesses.size} unique businesses`);
	}

	/**
	 * Collect businesses from OpenStreetMap using Overpass API
	 */
	async collectFromOverpass(collectedBusinesses) {
		const overpassCollector = this.collectors.get("overpass");
		if (!overpassCollector) {
			logger.warn("Overpass collector not available");
			return;
		}

		// Define major geographic areas for comprehensive coverage
		const majorAreas = [
			// Major US cities
			{ name: "New York City", bounds: { south: 40.4774, north: 40.9176, west: -74.2591, east: -73.7004 } },
			{ name: "Los Angeles", bounds: { south: 33.7037, north: 34.3373, west: -118.6681, east: -118.1553 } },
			{ name: "Chicago", bounds: { south: 41.6445, north: 42.023, west: -87.9401, east: -87.524 } },
			{ name: "Houston", bounds: { south: 29.5274, north: 30.1103, west: -95.8236, east: -95.0657 } },
			{ name: "Phoenix", bounds: { south: 33.2829, north: 33.7806, west: -112.3542, east: -111.9309 } },
			{ name: "Philadelphia", bounds: { south: 39.867, north: 40.1379, west: -75.2803, east: -74.9557 } },
			{ name: "San Antonio", bounds: { south: 29.214, north: 29.6245, west: -98.7806, east: -98.2941 } },
			{ name: "San Diego", bounds: { south: 32.5121, north: 33.1143, west: -117.3273, east: -116.9082 } },
			{ name: "Dallas", bounds: { south: 32.6167, north: 33.0237, west: -96.9991, east: -96.5886 } },
			{ name: "San Jose", bounds: { south: 37.1357, north: 37.4849, west: -122.0881, east: -121.788 } },
		];

		// Apply limit if specified
		const areasToProcess = this.options.limit ? majorAreas.slice(0, Math.min(this.options.limit, majorAreas.length)) : majorAreas;

		for (const area of areasToProcess) {
			try {
				logger.info(`📍 Collecting OpenStreetMap data for ${area.name}`);

				const businesses = await overpassCollector.searchBusinessesByArea(area.bounds, {
					limit: 500,
				});

				businesses.forEach((business) => {
					const fingerprint = this.createBusinessFingerprint(business);
					if (!collectedBusinesses.has(fingerprint)) {
						business.collection_area = area.name;
						collectedBusinesses.set(fingerprint, business);
					}
				});

				logger.info(`✅ Found ${businesses.length} businesses in ${area.name} (${collectedBusinesses.size} total unique)`);

				// Respectful delay between areas
				await this.sleep(2000);
			} catch (error) {
				logger.warn(`Failed to collect from ${area.name}: ${error.message}`);
				continue;
			}
		}

		logger.info(`🗺️  OpenStreetMap collection completed: ${collectedBusinesses.size} unique businesses`);
	}

	/**
	 * Collect businesses from government sources
	 */
	async collectFromGovernment(collectedBusinesses) {
		const govCollector = this.collectors.get("government");
		if (!govCollector) {
			logger.warn("Government data collector not available");
			return;
		}

		try {
			// 1. Collect SEC public companies data
			logger.info("🏢 Collecting SEC public companies data");
			const secCompanies = await govCollector.searchSECCompanies({
				limit: this.options.limit || 1000,
			});

			secCompanies.forEach((company) => {
				const fingerprint = this.createBusinessFingerprint(company);
				if (!collectedBusinesses.has(fingerprint)) {
					company.data_tier = "government_verified";
					collectedBusinesses.set(fingerprint, company);
				}
			});

			logger.info(`✅ SEC data: ${secCompanies.length} public companies`);

			// 2. Search Data.gov for business datasets
			const businessSearchTerms = ["business license", "business registration", "business directory", "business establishments", "commercial licenses"];

			for (const searchTerm of businessSearchTerms) {
				try {
					logger.info(`🔍 Searching Data.gov for: ${searchTerm}`);

					const dataGovResults = await govCollector.searchDataGovBusinesses(searchTerm, {
						limit: 50,
					});

					dataGovResults.forEach((business) => {
						const fingerprint = this.createBusinessFingerprint(business);
						if (!collectedBusinesses.has(fingerprint)) {
							business.data_tier = "government_dataset";
							collectedBusinesses.set(fingerprint, business);
						}
					});

					logger.info(`✅ Data.gov "${searchTerm}": ${dataGovResults.length} records`);

					// Respectful delay
					await this.sleep(1000);
				} catch (error) {
					logger.warn(`Data.gov search failed for "${searchTerm}": ${error.message}`);
					continue;
				}
			}
		} catch (error) {
			logger.error(`Government data collection failed: ${error.message}`);
		}

		logger.info(`🏛️  Government data collection completed: ${collectedBusinesses.size} total unique businesses`);
	}

	/**
	 * Collect businesses from web sources
	 */
	async collectFromWebSources(collectedBusinesses) {
		const webScraper = this.collectors.get("web_scraper");
		if (!webScraper) {
			logger.warn("Web scraper collector not available");
			return;
		}

		// Major cities for web scraping
		const targetCities = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA"];

		// Business categories for comprehensive coverage
		const targetCategories = ["restaurant", "retail", "healthcare", "automotive", "financial", "accommodation"];

		const citiesToProcess = this.options.limit ? targetCities.slice(0, Math.min(this.options.limit, targetCities.length)) : targetCities.slice(0, 5); // Limit to avoid overwhelming

		for (const city of citiesToProcess) {
			try {
				logger.info(`🌐 Web scraping businesses in ${city}`);

				// Scrape by location
				const locationBusinesses = await webScraper.searchBusinessesByLocation(city, {
					limit: 100,
				});

				locationBusinesses.forEach((business) => {
					const fingerprint = this.createBusinessFingerprint(business);
					if (!collectedBusinesses.has(fingerprint)) {
						business.collection_city = city;
						business.data_tier = "web_scraped";
						collectedBusinesses.set(fingerprint, business);
					}
				});

				logger.info(`✅ Web scraping ${city}: ${locationBusinesses.length} businesses`);

				// Respectful delay between cities
				await this.sleep(5000);
			} catch (error) {
				logger.warn(`Web scraping failed for ${city}: ${error.message}`);
				continue;
			}
		}

		logger.info(`🌐 Web scraping completed: ${collectedBusinesses.size} total unique businesses`);
	}

	/**
	 * Process and enhance the collected free bulk data
	 */
	async processFreeBulkData(businesses) {
		logger.info(`🤖 Starting AI enhancement for ${businesses.length} businesses`);

		const batchSize = 10;
		let processed = 0;

		for (let i = 0; i < businesses.length; i += batchSize) {
			const batch = businesses.slice(i, i + batchSize);

			logger.info(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(businesses.length / batchSize)}`);

			for (const business of batch) {
				try {
					// Apply AI enhancement for extremely elaborate data
					let enhancedBusiness = business;

					if (!this.options.skipAi) {
						enhancedBusiness = await this.aiEnhancer.enhanceBusiness(business, {
							force: false, // Use cache when available
						});
					}

					// Process the enhanced business data
					const processedData = await this.processor.processBusinessData(enhancedBusiness, {
						priority: "bulk_free",
						source: "free_collection",
					});

					// Insert into database
					if (!this.options.dryRun) {
						const inserted = await this.populator.insertBusiness(processedData);
						if (inserted) {
							this.stats.businessesInserted++;
							processed++;
						}
					} else {
						logger.debug(`Dry run: would insert business: ${processedData.name}`);
						processed++;
					}
				} catch (error) {
					this.stats.errors++;
					logger.warn(`Failed to process business: ${business.name || "Unknown"} - ${error.message}`);
				}
			}

			// Progress update
			logger.info(`📈 Progress: ${processed}/${businesses.length} businesses processed successfully`);

			// Brief pause between batches
			await this.sleep(1000);
		}

		logger.info(`✅ Bulk processing completed: ${processed} businesses processed`);
	}

	/**
	 * Create a simple fingerprint for deduplication
	 */
	createBusinessFingerprint(business) {
		const name = (business.name || "").toLowerCase().replace(/[^\w]/g, "");
		const phone = (business.phone || "").replace(/\D/g, "");
		const address = (business.address || "").toLowerCase().replace(/[^\w]/g, "");

		return `${name}_${phone}_${address}`;
	}

	/**
	 * Process a batch of businesses
	 */
	async processBatch(businesses, options = {}) {
		const batchStartTime = Date.now();

		for (const business of businesses) {
			try {
				await this.processSingleBusiness(business, options);
				this.stats.businessesProcessed++;
			} catch (error) {
				this.stats.errors++;
				await errorHandler.handleError(error, {
					operation: "processBusiness",
					business: business.name || business.toString(),
				});
			}
		}

		const batchDuration = Date.now() - batchStartTime;
		logger.debug(`Batch processing completed in ${batchDuration}ms`);
	}

	/**
	 * Process a single business
	 */
	async processSingleBusiness(business, options = {}) {
		logger.debug(`Processing business: ${business.name || business.toString()}`);

		let businessData = business;

		// If this is just a business name/info, collect full data
		if (!business.source && typeof business === "object" && business.name) {
			businessData = await this.collectSingleBusiness(business.name, options.location, options);
		}

		if (!businessData) {
			logger.warn(`No data collected for business: ${business.name || business.toString()}`);
			return;
		}

		// Process and enhance the data
		const processedData = await this.processor.processBusinessData(businessData, options);

		// Insert into database if not dry run
		if (!this.options.dryRun) {
			const inserted = await this.populator.insertBusiness(processedData);
			if (inserted) {
				this.stats.businessesInserted++;
				logger.debug(`Business inserted: ${processedData.name}`);
			}
		} else {
			logger.debug(`Dry run: would insert business: ${processedData.name}`);
		}
	}

	/**
	 * Collect data for a single business from ALL available sources
	 * Uses free and paid APIs, merges data, and applies AI enhancement
	 */
	async collectSingleBusiness(businessName, location, options = {}) {
		logger.info(`Collecting extremely elaborate data for: ${businessName}`);

		const businessSources = [];
		let totalApiCalls = 0;

		// Collect from ALL available sources
		for (const [collectorName, collector] of this.collectors) {
			try {
				logger.debug(`Collecting from ${collectorName} for: ${businessName}`);

				let collectorResults = [];

				if (collectorName === "google_places") {
					// Google Places API
					const query = location ? `${businessName} ${location.city} ${location.state}` : businessName;
					const searchResults = await collector.searchBusinesses(query, {
						location: location,
						radius: options.radius || 50000,
					});

					if (searchResults.length > 0) {
						const detailedData = await collector.getBusinessDetails(searchResults[0].place_id);
						if (detailedData) collectorResults.push(detailedData);
						totalApiCalls += 2; // Search + details
					}
				} else if (collectorName === "overpass") {
					// OpenStreetMap (Overpass API) - FREE
					if (location && location.lat && location.lng) {
						// Search by location bounds
						const bounds = {
							south: location.lat - 0.1,
							north: location.lat + 0.1,
							west: location.lng - 0.1,
							east: location.lng + 0.1,
						};
						collectorResults = await collector.searchBusinessesByArea(bounds);
						totalApiCalls += 1;
					}

					// Also search by name
					if (businessName) {
						const nameResults = await collector.searchBusinessesByName(businessName);
						collectorResults.push(...nameResults);
						totalApiCalls += 1;
					}
				} else if (collectorName === "government") {
					// Government data sources - FREE
					if (businessName) {
						// Search SEC data for public companies
						const secResults = await collector.searchSECCompanies({ name: businessName });
						collectorResults.push(...secResults);
						totalApiCalls += 1;

						// Search Data.gov
						const dataGovResults = await collector.searchDataGovBusinesses(businessName);
						collectorResults.push(...dataGovResults);
						totalApiCalls += 1;
					}
				} else if (collectorName === "web_scraper") {
					// Web scraping public directories - FREE
					if (location) {
						const locationString = `${location.city}, ${location.state}`;
						const scrapedResults = await collector.searchBusinessesByLocation(locationString, {
							category: options.category,
							limit: 10,
						});

						// Filter for businesses matching the name
						const matchingResults = scrapedResults.filter((business) => business.name && business.name.toLowerCase().includes(businessName.toLowerCase()));
						collectorResults.push(...matchingResults);
						totalApiCalls += 1;
					}
				} else if (collectorName === "search_people") {
					// Search People API (AllThingsDev) - Business personnel and contacts
					const personnelResults = await collector.searchBusinessPersonnel(businessName, location ? `${location.city}, ${location.state}` : null);

					// Transform personnel data into business context
					if (personnelResults.length > 0) {
						collectorResults.push({
							name: businessName,
							key_personnel: personnelResults,
							business_contacts: personnelResults.filter((p) => p.work_email_available || p.mobile_number_available),
							management_team: personnelResults.filter((p) => p.current_job_titles.some((title) => ["ceo", "president", "founder", "owner", "director"].some((role) => title.toLowerCase().includes(role)))),
							data_source: "search_people_personnel",
						});
					}
					totalApiCalls += 1;
				} else if (collectorName === "business_news") {
					// Business News Daily API (AllThingsDev) - Real-time business intelligence
					const newsResults = await collector.getCompanyNews(businessName);

					if (newsResults.articles.length > 0) {
						collectorResults.push({
							name: businessName,
							recent_news: newsResults.articles.slice(0, 5), // Latest 5 articles
							news_sentiment: newsResults.sentiment,
							news_categories: newsResults.categories,
							business_intelligence: {
								market_presence: newsResults.articles.length > 0,
								media_attention: newsResults.articles.length,
								sentiment_score: newsResults.sentiment.overall,
								trending_topics: newsResults.categories.slice(0, 3),
							},
							data_source: "business_news_intelligence",
						});
					}
					totalApiCalls += 1;
				} else if (collectorName === "random_data") {
					// Random Data API (AllThingsDev) - For testing and mock data enhancement
					if (options.includeTestData || options.priority === "test") {
						const mockBusinessData = await collector.generateRandomCompanies(1);

						if (mockBusinessData.length > 0) {
							// Use mock data as template but preserve the search business name
							const mockBusiness = { ...mockBusinessData[0] };
							mockBusiness.name = businessName;
							mockBusiness.is_mock_data = true;
							mockBusiness.mock_data_purpose = "testing_enhancement";

							collectorResults.push(mockBusiness);
						}
					}
					totalApiCalls += 1;
				} else if (collectorName === "geodata") {
					// GeoData API (AllThingsDev) - Geographic business and amenity data
					if (businessName && (businessName.toLowerCase().includes("center") || businessName.toLowerCase().includes("cultural") || businessName.toLowerCase().includes("museum") || businessName.toLowerCase().includes("library"))) {
						const geoResults = await collector.searchBusinessesByQuery(businessName);
						collectorResults.push(...geoResults);
						totalApiCalls += 1;
					}
				}

				// Filter and add source attribution
				collectorResults.forEach((business) => {
					business.data_source = collectorName;
					business.collection_timestamp = new Date().toISOString();
				});

				businessSources.push(...collectorResults);

				logger.debug(`Found ${collectorResults.length} results from ${collectorName}`);
			} catch (error) {
				logger.warn(`Collector ${collectorName} failed for ${businessName}: ${error.message}`);
				continue; // Continue with other collectors
			}
		}

		this.stats.apiCalls += totalApiCalls;

		if (businessSources.length === 0) {
			logger.warn(`No results found from any source for business: ${businessName}`);
			return null;
		}

		logger.info(`Found ${businessSources.length} business records from ${this.collectors.size} sources`);

		// Merge data from multiple sources using intelligent data processor
		const mergedBusiness = await this.processor.mergeBusinessData(...businessSources);

		if (!mergedBusiness) {
			logger.warn(`Data merging failed for business: ${businessName}`);
			return null;
		}

		// Apply AI enhancement to make data "extremely elaborate"
		if (!this.options.skipAi) {
			try {
				logger.info(`Applying AI enhancement for extremely elaborate data: ${businessName}`);
				const enhancedBusiness = await this.aiEnhancer.enhanceBusiness(mergedBusiness, {
					force: options.forceAiEnhancement || false,
				});

				logger.info(`AI enhancement completed for: ${businessName}`);
				return enhancedBusiness;
			} catch (error) {
				logger.warn(`AI enhancement failed for ${businessName}: ${error.message}`);
				// Return merged data without AI enhancement
				return mergedBusiness;
			}
		}

		return mergedBusiness;
	}

	/**
	 * Update a single existing business
	 */
	async updateSingleBusiness(existingBusiness) {
		logger.debug(`Updating business: ${existingBusiness.name}`);

		// Collect fresh data
		const freshData = await this.collectSingleBusiness(existingBusiness.name, {
			city: existingBusiness.city,
			state: existingBusiness.state,
			lat: existingBusiness.latitude,
			lng: existingBusiness.longitude,
		});

		if (freshData) {
			// Merge with existing data
			const mergedData = await this.processor.mergeBusinessData(existingBusiness, freshData);

			// Update in database
			if (!this.options.dryRun) {
				await this.populator.updateBusiness(existingBusiness.id, mergedData);
				this.stats.businessesInserted++; // Counting updates as insertions for stats
			}
		}
	}

	/**
	 * Parse location string into coordinates
	 */
	async parseLocation(locationString) {
		// Simple parsing for "City, State" format
		const parts = locationString.split(",").map((p) => p.trim());

		if (parts.length !== 2) {
			throw new Error('Location must be in format: "City, State"');
		}

		const [city, state] = parts;

		// Try to find in geographic priorities first
		const knownLocation = GEOGRAPHIC_PRIORITIES.find((loc) => loc.city.toLowerCase() === city.toLowerCase() && loc.state.toLowerCase() === state.toLowerCase());

		if (knownLocation) {
			return {
				city: knownLocation.city,
				state: knownLocation.state,
				lat: knownLocation.lat || 0,
				lng: knownLocation.lng || 0,
			};
		}

		// TODO: Use geocoding API to get coordinates for unknown locations
		logger.warn(`Location not found in known locations: ${locationString}`);
		return { city, state, lat: 0, lng: 0 };
	}

	/**
	 * Generate final report
	 */
	async generateReport() {
		const duration = Date.now() - this.stats.startTime;
		const durationMinutes = Math.round(duration / 60000);

		// Collect stats from all components
		const collectorStats = {};
		for (const [name, collector] of this.collectors) {
			if (collector.getStats) {
				collectorStats[name] = collector.getStats();
			}
		}

		const cacheStats = cacheManager.getStats();
		const processorStats = this.processor.getStats();
		const populatorStats = this.populator.getStats();

		const report = {
			summary: {
				mode: this.options.mode,
				duration: `${durationMinutes} minutes`,
				businessesProcessed: this.stats.businessesProcessed,
				businessesInserted: this.stats.businessesInserted,
				errors: this.stats.errors,
				successRate: `${Math.round((this.stats.businessesInserted / Math.max(this.stats.businessesProcessed, 1)) * 100)}%`,
			},
			performance: {
				totalApiCalls: this.stats.apiCalls,
				averageProcessingTime: this.stats.businessesProcessed > 0 ? `${Math.round(duration / this.stats.businessesProcessed)}ms per business` : "N/A",
				cacheHitRate: `${Math.round(cacheStats.overall.hitRate * 100)}%`,
			},
			collectors: collectorStats,
			cache: cacheStats,
			processor: processorStats,
			database: populatorStats,
		};

		logger.info("DATA COLLECTION COMPLETED", report);

		// Save report to file
		if (!this.options.dryRun) {
			const reportPath = `logs/data-collection/report-${new Date().toISOString().split("T")[0]}.json`;
			try {
				await import("fs/promises").then((fs) => fs.writeFile(reportPath, JSON.stringify(report, null, 2)));
				logger.info(`Report saved to: ${reportPath}`);
			} catch (error) {
				logger.warn("Failed to save report", { error: error.message });
			}
		}

		return report;
	}

	/**
	 * Cleanup resources
	 */
	async cleanup() {
		logger.info("Cleaning up resources...");

		try {
			// Cleanup cache
			await cacheManager.cleanup();

			// Close database connections
			await this.populator.cleanup();

			logger.info("Cleanup completed");
		} catch (error) {
			logger.error("Cleanup failed", { error: error.message });
		}
	}

	/**
	 * Sleep utility
	 */
	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

/**
 * Command Line Interface
 */
async function main() {
	const program = new Command();

	program.name("business-data-collector").description("Intelligent business data collection system").version("1.0.0");

	program
		.option("-m, --mode <mode>", "Collection mode: top500, geographic, category, test, update, free-bulk, allthingsdev-test", "test")
		.option("-l, --limit <number>", "Limit number of businesses to process", parseInt)
		.option("-v, --verbose", "Enable verbose logging")
		.option("-d, --dry-run", "Perform dry run without database changes")
		.option("--skip-ai", "Skip AI enhancement for faster processing")
		.option("--free-only", "Use only FREE data sources (OpenStreetMap, Government Data, Web Scraping)")
		.option("--location <location>", "Geographic location (City, State) for geographic mode")
		.option("--radius <radius>", "Search radius in kilometers for geographic mode", parseFloat, 50)
		.option("--categories <categories>", "Comma-separated list of categories", (value) => value.split(","));

	program.action(async (options) => {
		const collector = new BusinessDataCollector(options);

		try {
			await collector.run();
			process.exit(0);
		} catch (error) {
			logger.critical("Application failed", { error: error.message });
			process.exit(1);
		}
	});

	program.parse();
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch((error) => {
		console.error("Fatal error:", error);
		process.exit(1);
	});
}

export { BusinessDataCollector };
