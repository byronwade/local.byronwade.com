/**
 * Search People API Collector (AllThingsDev)
 *
 * PREMIUM DATA SOURCE - Enhanced business intelligence
 * Collects detailed contact information for business key personnel
 *
 * Features:
 * - Business contact discovery and validation
 * - Key personnel identification (founders, executives, managers)
 * - Professional profile data from LinkedIn and social media
 * - Employment history and company connections
 * - Contact information including emails, phone numbers, addresses
 * - Lead generation and B2B intelligence
 *
 * Use Cases:
 * - Enhance business records with key personnel information
 * - Sales prospecting and lead generation
 * - Business relationship mapping
 * - Company hierarchy and org chart building
 * - Contact validation and enrichment
 *
 * Performance: Ideal for enhancing existing business data with human intelligence
 */

import axios from "axios";
import { RateLimiterManager } from "../utils/rate-limiter.js";
import { CacheManager } from "../utils/cache-manager.js";
import { Logger } from "../utils/error-handler.js";

export class SearchPeopleCollector {
	constructor() {
		this.rateLimiter = RateLimiterManager.getLimiter("search_people");
		this.logger = new Logger("SearchPeopleCollector");
		this.cache = CacheManager;

		// API configuration
		this.apiConfig = {
			baseUrl: "https://Search-People.proxy-production.allthingsdev.co",
			endpoints: {
				searchPerson: "/search/people",
			},
			headers: {
				Authorization: process.env.ALLTHINGSDEV_API_KEY || "",
				"Content-Type": "application/json",
			},
		};

		// Common business titles for targeted searches
		this.businessTitles = ["founder", "ceo", "president", "owner", "managing director", "general manager", "operations manager", "business manager", "director", "vice president", "head of", "chief", "partner", "principal", "executive", "administrator"];

		// Industries to focus on
		this.targetIndustries = ["technology", "healthcare", "finance", "retail", "manufacturing", "real estate", "hospitality", "food service", "automotive", "education", "construction", "professional services"];
	}

	/**
	 * Search for key personnel by business name and location
	 * Finds decision makers and business contacts
	 */
	async searchBusinessPersonnel(businessName, location = null, options = {}) {
		const cacheKey = `search_people_business_${businessName}_${location || "any"}`;

		try {
			// Check cache first
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				this.logger.info(`Search People business personnel cache hit: ${businessName}`);
				return cached;
			}

			await this.rateLimiter.waitForToken();

			const startTime = performance.now();
			this.logger.info(`Searching for key personnel at: ${businessName}`);

			const personnel = [];

			// Search for various business titles at this company
			for (const title of this.businessTitles) {
				try {
					const searchParams = {
						current_company_name: businessName,
						current_job_title: title,
					};

					// Add location if provided
					if (location) {
						searchParams.location = location;
					}

					const response = await this.makeSearchRequest(searchParams);

					if (response && Array.isArray(response)) {
						const processedPersonnel = response.map((person) => this.normalizePersonData(person, businessName, "business_search"));
						personnel.push(...processedPersonnel);
					}

					// Brief delay between title searches
					await this.delay(500);
				} catch (error) {
					this.logger.warn(`Failed to search for ${title} at ${businessName}: ${error.message}`);
					continue;
				}
			}

			// Deduplicate personnel
			const uniquePersonnel = this.deduplicatePersonnel(personnel);

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Search People business personnel completed in ${queryTime.toFixed(2)}ms`);
			this.logger.info(`Found ${uniquePersonnel.length} key personnel for ${businessName}`);

			// Cache the results for 24 hours
			await this.cache.set(cacheKey, uniquePersonnel, 24 * 60 * 60 * 1000);

			return uniquePersonnel;
		} catch (error) {
			this.logger.error(`Search People business personnel failed for ${businessName}: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Search for specific person by name and company
	 * Useful for finding specific business contacts
	 */
	async searchSpecificPerson(firstName, lastName, companyName = null, options = {}) {
		const cacheKey = `search_people_person_${firstName}_${lastName}_${companyName || "any"}`;

		try {
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				return cached;
			}

			await this.rateLimiter.waitForToken();

			const startTime = performance.now();
			this.logger.info(`Searching for person: ${firstName} ${lastName}${companyName ? ` at ${companyName}` : ""}`);

			const searchParams = {
				first_name: firstName,
				last_name: lastName,
			};

			// Add company filter if provided
			if (companyName) {
				searchParams.current_company_name = companyName;
			}

			const response = await this.makeSearchRequest(searchParams);

			let person = null;
			if (response && Array.isArray(response) && response.length > 0) {
				// Take the best match (first result)
				person = this.normalizePersonData(response[0], companyName, "person_search");
			}

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Search People person search completed in ${queryTime.toFixed(2)}ms`);

			// Cache for 12 hours
			await this.cache.set(cacheKey, person, 12 * 60 * 60 * 1000);

			return person;
		} catch (error) {
			this.logger.error(`Search People person search failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Search for industry leaders and entrepreneurs
	 * Useful for finding business owners and decision makers
	 */
	async searchIndustryLeaders(industry, location = null, options = {}) {
		const cacheKey = `search_people_industry_${industry}_${location || "any"}`;

		try {
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				return cached;
			}

			await this.rateLimiter.waitForToken();

			const startTime = performance.now();
			this.logger.info(`Searching for industry leaders in: ${industry}`);

			const leaders = [];

			// Search for various leadership roles in the industry
			const leadershipTitles = ["founder", "ceo", "president", "owner", "managing director"];

			for (const title of leadershipTitles) {
				try {
					const searchParams = {
						current_industry: industry,
						current_job_title: title,
					};

					if (location) {
						searchParams.location = location;
					}

					const response = await this.makeSearchRequest(searchParams);

					if (response && Array.isArray(response)) {
						const processedLeaders = response.map((person) => this.normalizePersonData(person, null, "industry_search"));
						leaders.push(...processedLeaders);
					}

					await this.delay(500);
				} catch (error) {
					this.logger.warn(`Failed to search for ${title} in ${industry}: ${error.message}`);
					continue;
				}
			}

			const uniqueLeaders = this.deduplicatePersonnel(leaders);

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Search People industry leaders completed in ${queryTime.toFixed(2)}ms`);
			this.logger.info(`Found ${uniqueLeaders.length} industry leaders in ${industry}`);

			// Cache for 6 hours
			await this.cache.set(cacheKey, uniqueLeaders, 6 * 60 * 60 * 1000);

			return uniqueLeaders;
		} catch (error) {
			this.logger.error(`Search People industry leaders failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Make API request to Search People endpoint
	 */
	async makeSearchRequest(searchParams) {
		try {
			const response = await axios.post(`${this.apiConfig.baseUrl}${this.apiConfig.endpoints.searchPerson}`, searchParams, {
				headers: this.apiConfig.headers,
				timeout: 30000,
			});

			if (response.status === 200 && response.data) {
				return Array.isArray(response.data) ? response.data : [response.data];
			} else {
				throw new Error(`Unexpected response status: ${response.status}`);
			}
		} catch (error) {
			if (error.response?.status === 401) {
				throw new Error("Invalid AllThingsDev API key for Search People");
			} else if (error.response?.status === 429) {
				throw new Error("Search People API rate limit exceeded");
			} else if (error.response?.status === 400) {
				this.logger.warn("Search People API bad request - invalid parameters");
				return [];
			}

			throw error;
		}
	}

	/**
	 * Normalize person data into our standard business contact format
	 */
	normalizePersonData(personData, associatedBusiness = null, searchType = "unknown") {
		if (!personData) return null;

		try {
			const contact = {
				// Basic Information
				full_name: personData.full_name || `${personData.first_name || ""} ${personData.last_name || ""}`.trim(),
				first_name: this.extractFirstName(personData.full_name),
				last_name: this.extractLastName(personData.full_name),

				// Contact Information
				work_email_available: personData.work_email_available || false,
				personal_email_available: personData.personal_email_available || false,
				mobile_number_available: personData.mobile_number_available || false,
				direct_dial_available: personData.direct_dial_available || false,

				// Location
				location: personData.location,
				location_country: personData.location_country,
				location_region: personData.location_region,

				// Professional Information
				current_job_titles: Array.isArray(personData.job_title) ? personData.job_title : [personData.job_title].filter(Boolean),
				current_jobs: Array.isArray(personData.current_job) ? personData.current_job : [personData.current_job].filter(Boolean),
				industry: personData.industry,
				inferred_salary: personData.inferred_salary,

				// Social Media & Professional Profiles
				linkedin_url: personData.linkedin_url,
				linkedin_id: personData.linkedin_id,
				twitter_id: personData.x_id,
				facebook_id: Array.isArray(personData.facebook_id) ? personData.facebook_id[0] : personData.facebook_id,
				instagram_id: personData.instagram_id,

				// Education
				education: this.normalizeEducation(personData.education),

				// Professional Experience
				experience: this.normalizeExperience(personData.experience),
				technologies: personData.technologies || [],

				// Demographics
				gender: personData.gender,
				age: personData.age || null,
				languages: personData.languages || [],

				// Associated Business
				associated_business: associatedBusiness,
				search_type: searchType,

				// Data Quality and Source
				data_source: "search_people_allthingsdev",
				data_quality: this.calculatePersonDataQuality(personData),
				last_updated: new Date().toISOString(),

				// Internal tracking
				cerebria_id: personData.cerebria_id,
				similar_profiles: personData.similar_profiles || [],
			};

			return contact;
		} catch (error) {
			this.logger.warn(`Failed to normalize person data: ${error.message}`);
			return null;
		}
	}

	/**
	 * Extract first name from full name
	 */
	extractFirstName(fullName) {
		if (!fullName) return null;
		const parts = fullName.split(" ");
		return parts[0] || null;
	}

	/**
	 * Extract last name from full name
	 */
	extractLastName(fullName) {
		if (!fullName) return null;
		const parts = fullName.split(" ");
		return parts.length > 1 ? parts[parts.length - 1] : null;
	}

	/**
	 * Normalize education data
	 */
	normalizeEducation(educationArray) {
		if (!Array.isArray(educationArray)) return [];

		return educationArray.map((edu) => ({
			school_name: edu.school_name,
			school_type: edu.school_type,
			school_location: edu.school_location,
			start_date: edu.start_date,
			end_date: edu.end_date,
			majors: edu.majors || [],
			minors: edu.minors || [],
			gpa: edu.gpa,
		}));
	}

	/**
	 * Normalize professional experience data
	 */
	normalizeExperience(experienceArray) {
		if (!Array.isArray(experienceArray)) return [];

		return experienceArray.map((exp) => ({
			company: exp.company,
			title: exp.title,
			start_date: exp.start_date,
			end_date: exp.end_date,
			description: exp.description,
			location: exp.location,
		}));
	}

	/**
	 * Calculate data quality score for person data
	 */
	calculatePersonDataQuality(personData) {
		let score = 0;
		const maxScore = 100;

		// Basic information (30 points)
		if (personData.full_name) score += 15;
		if (personData.location) score += 10;
		if (personData.industry) score += 5;

		// Contact availability (25 points)
		if (personData.work_email_available) score += 10;
		if (personData.mobile_number_available) score += 8;
		if (personData.direct_dial_available) score += 7;

		// Professional information (25 points)
		if (personData.current_job && personData.current_job.length > 0) score += 10;
		if (personData.linkedin_url) score += 10;
		if (personData.inferred_salary) score += 5;

		// Education and experience (20 points)
		if (personData.education && personData.education.length > 0) score += 10;
		if (personData.experience && personData.experience.length > 0) score += 10;

		return Math.min(score, maxScore);
	}

	/**
	 * Deduplicate personnel based on LinkedIn URL or name+company
	 */
	deduplicatePersonnel(personnel) {
		const seen = new Set();
		const unique = [];

		for (const person of personnel) {
			// Create fingerprint for deduplication
			const fingerprint = person.linkedin_id || person.linkedin_url || `${person.full_name}_${person.industry}_${person.location}`;

			if (!seen.has(fingerprint)) {
				seen.add(fingerprint);
				unique.push(person);
			}
		}

		return unique;
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
			supportedSearchTypes: ["business_personnel", "specific_person", "industry_leaders"],
			businessTitlesSupported: this.businessTitles.length,
			industriesSupported: this.targetIndustries.length,
		};
	}
}

export default SearchPeopleCollector;
