// Business Data Processor
// Intelligent merging, validation, and enhancement of business data from multiple sources

import { logger } from "../utils/error-handler.js";
import { cacheManager } from "../utils/cache-manager.js";

/**
 * Business Data Processor with intelligent merging and validation
 */
export class BusinessDataProcessor {
	constructor(options = {}) {
		this.options = {
			enableAiEnhancement: options.enableAiEnhancement !== false,
			dataQualityThreshold: options.dataQualityThreshold || 70,
			...options,
		};

		this.stats = {
			businessesProcessed: 0,
			dataEnhancements: 0,
			validationFailures: 0,
			duplicatesDetected: 0,
			fieldsMerged: 0,
		};

		// Data quality rules
		this.qualityRules = {
			required: ["name", "address", "city", "state"],
			recommended: ["phone", "website", "hours", "latitude", "longitude"],
			optional: ["description", "amenities", "payment_methods", "social_media"],
		};

		logger.debug("Business Data Processor initialized");
	}

	/**
	 * Process business data with validation, enhancement, and normalization
	 */
	async processBusinessData(businessData, options = {}) {
		const startTime = Date.now();

		try {
			logger.debug(`Processing business: ${businessData.name}`);

			// Step 1: Validate input data
			const validationResult = this.validateBusinessData(businessData);
			if (!validationResult.isValid) {
				logger.warn(`Validation failed for business: ${businessData.name}`, {
					errors: validationResult.errors,
				});
				this.stats.validationFailures++;
			}

			// Step 2: Normalize data structure
			let normalizedData = this.normalizeBusinessData(businessData);

			// Step 3: Enhance data quality
			normalizedData = await this.enhanceDataQuality(normalizedData, options);

			// Step 4: Add metadata
			normalizedData = this.addProcessingMetadata(normalizedData, validationResult);

			// Step 5: Calculate final quality score
			normalizedData.data_quality_score = this.calculateQualityScore(normalizedData);

			this.stats.businessesProcessed++;

			const processingTime = Date.now() - startTime;
			logger.debug(`Business processed in ${processingTime}ms: ${normalizedData.name}`);

			return normalizedData;
		} catch (error) {
			logger.error("Business data processing failed", {
				business: businessData.name,
				error: error.message,
			});
			throw error;
		}
	}

	/**
	 * Validate business data against quality rules
	 */
	validateBusinessData(data) {
		const errors = [];
		const warnings = [];

		// Check required fields
		for (const field of this.qualityRules.required) {
			if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
				errors.push(`Missing required field: ${field}`);
			}
		}

		// Check recommended fields
		for (const field of this.qualityRules.recommended) {
			if (!data[field]) {
				warnings.push(`Missing recommended field: ${field}`);
			}
		}

		// Validate specific field formats
		if (data.phone && !this.isValidPhone(data.phone)) {
			warnings.push("Phone number format may be invalid");
		}

		if (data.website && !this.isValidWebsite(data.website)) {
			warnings.push("Website URL format may be invalid");
		}

		if (data.email && !this.isValidEmail(data.email)) {
			errors.push("Email format is invalid");
		}

		// Validate coordinates
		if (data.latitude !== undefined || data.longitude !== undefined) {
			if (!this.isValidCoordinates(data.latitude, data.longitude)) {
				warnings.push("Latitude/longitude coordinates may be invalid");
			}
		}

		const isValid = errors.length === 0;

		return {
			isValid,
			errors,
			warnings,
			score: this.calculateValidationScore(errors, warnings),
		};
	}

	/**
	 * Normalize business data to standard format
	 */
	normalizeBusinessData(data) {
		return {
			// Core identifiers
			source: data.source || "unknown",
			source_id: data.source_id || data.place_id || null,

			// Basic business information
			name: this.normalizeText(data.name),
			slug: this.generateSlug(data.name),
			description: this.normalizeText(data.description),

			// Address information
			address: this.normalizeAddress(data.address || data.formatted_address),
			city: this.normalizeText(data.city),
			state: this.normalizeState(data.state),
			zip_code: this.normalizeZipCode(data.zip_code),
			country: data.country || "US",

			// Location coordinates
			latitude: this.normalizeCoordinate(data.latitude),
			longitude: this.normalizeCoordinate(data.longitude),

			// Contact information
			phone: this.normalizePhone(data.phone || data.formatted_phone_number),
			email: this.normalizeEmail(data.email),
			website: this.normalizeWebsite(data.website),

			// Business details
			hours: this.normalizeHours(data.hours || data.opening_hours),
			rating: this.normalizeRating(data.rating),
			review_count: parseInt(data.review_count || data.user_ratings_total || 0),
			price_range: this.normalizePriceRange(data.price_level || data.price_range),

			// Business status and verification
			status: this.determineBusinessStatus(data),
			verified: false, // Default to unverified
			featured: false, // Default to not featured

			// Rich data
			photos: this.normalizePhotos(data.photos),
			social_media: this.normalizeSocialMedia(data.social_media),
			amenities: this.normalizeAmenities(data.amenities),
			payment_methods: this.normalizePaymentMethods(data.payment_methods),

			// Categories and types
			business_types: this.normalizeBusinessTypes(data.types || data.categories),

			// Ownership and claiming
			owner_id: null, // Unclaimed by default
			claimed_by: null,
			claimed_at: null,

			// Metadata
			raw_data: data, // Keep original data for debugging
			data_sources: [data.source || "unknown"],
			last_updated: new Date().toISOString(),
			collected_at: new Date().toISOString(),
		};
	}

	/**
	 * Enhance data quality using various techniques
	 */
	async enhanceDataQuality(data, options = {}) {
		let enhanced = { ...data };

		// Address enhancement
		if (enhanced.address && enhanced.city && enhanced.state) {
			enhanced = await this.enhanceAddressData(enhanced);
		}

		// Phone number enhancement
		if (enhanced.phone) {
			enhanced.phone = this.enhancePhoneNumber(enhanced.phone);
		}

		// Website enhancement
		if (enhanced.website) {
			enhanced.website = this.enhanceWebsite(enhanced.website);
		}

		// Business hours enhancement
		if (enhanced.hours) {
			enhanced.hours = this.enhanceBusinessHours(enhanced.hours);
		}

		// Category enhancement
		enhanced.primary_category = this.determinePrimaryCategory(enhanced.business_types);

		// Social media enhancement
		enhanced.social_media = await this.enhanceSocialMedia(enhanced);

		// AI-powered description enhancement
		if (this.options.enableAiEnhancement && options.aiEnhancement) {
			enhanced = await this.enhanceWithAI(enhanced);
		}

		this.stats.dataEnhancements++;
		return enhanced;
	}

	/**
	 * Merge business data from multiple sources
	 */
	async mergeBusinessData(existingData, newData) {
		const merged = { ...existingData };
		let mergeCount = 0;

		// Strategy: Take the most complete and recent data for each field
		const fieldsToMerge = ["description", "phone", "email", "website", "hours", "rating", "review_count", "photos", "amenities", "payment_methods", "social_media"];

		for (const field of fieldsToMerge) {
			const existingValue = existingData[field];
			const newValue = newData[field];

			if (this.shouldReplaceField(existingValue, newValue, field)) {
				merged[field] = newValue;
				mergeCount++;
			}
		}

		// Merge data sources
		const existingSources = existingData.data_sources || [];
		const newSource = newData.source || "unknown";

		if (!existingSources.includes(newSource)) {
			merged.data_sources = [...existingSources, newSource];
		}

		// Update timestamps
		merged.last_updated = new Date().toISOString();

		// Recalculate quality score
		merged.data_quality_score = this.calculateQualityScore(merged);

		this.stats.fieldsMerged += mergeCount;

		logger.debug(`Merged ${mergeCount} fields for business: ${merged.name}`);

		return merged;
	}

	/**
	 * Determine if a field should be replaced during merge
	 */
	shouldReplaceField(existingValue, newValue, fieldName) {
		// Don't replace if new value is empty/null
		if (!newValue || (typeof newValue === "string" && newValue.trim() === "")) {
			return false;
		}

		// Replace if existing value is empty/null
		if (!existingValue || (typeof existingValue === "string" && existingValue.trim() === "")) {
			return true;
		}

		// For arrays, merge if new array has more items
		if (Array.isArray(newValue) && Array.isArray(existingValue)) {
			return newValue.length > existingValue.length;
		}

		// For objects, merge if new object has more properties
		if (typeof newValue === "object" && typeof existingValue === "object") {
			return Object.keys(newValue).length > Object.keys(existingValue).length;
		}

		// For strings, replace if new value is longer and more complete
		if (typeof newValue === "string" && typeof existingValue === "string") {
			return newValue.length > existingValue.length;
		}

		// For numbers, take the newer value (assuming it's more accurate)
		if (typeof newValue === "number") {
			return true;
		}

		return false;
	}

	/**
	 * Add processing metadata
	 */
	addProcessingMetadata(data, validationResult) {
		return {
			...data,
			processing_metadata: {
				processed_at: new Date().toISOString(),
				validation_score: validationResult.score,
				validation_errors: validationResult.errors,
				validation_warnings: validationResult.warnings,
				processor_version: "1.0.0",
			},
		};
	}

	/**
	 * Calculate overall data quality score
	 */
	calculateQualityScore(data) {
		let score = 0;
		let maxScore = 0;

		// Required fields (40 points max)
		for (const field of this.qualityRules.required) {
			maxScore += 10;
			if (data[field] && data[field].toString().trim() !== "") {
				score += 10;
			}
		}

		// Recommended fields (40 points max)
		for (const field of this.qualityRules.recommended) {
			maxScore += 5;
			if (data[field] && data[field].toString().trim() !== "") {
				score += 5;
			}
		}

		// Optional fields (20 points max)
		for (const field of this.qualityRules.optional) {
			maxScore += 2;
			if (data[field] && data[field].toString().trim() !== "") {
				score += 2;
			}
		}

		return Math.round((score / maxScore) * 100);
	}

	// Validation helper methods
	isValidPhone(phone) {
		const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
		return phoneRegex.test(phone.replace(/\s/g, ""));
	}

	isValidWebsite(website) {
		try {
			const url = new URL(website);
			return ["http:", "https:"].includes(url.protocol);
		} catch {
			return false;
		}
	}

	isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	isValidCoordinates(lat, lng) {
		return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
	}

	// Normalization helper methods
	normalizeText(text) {
		if (!text) return null;
		return text.toString().trim().replace(/\s+/g, " ");
	}

	normalizeAddress(address) {
		if (!address) return null;
		return this.normalizeText(address)
			.replace(/\b(St|Street)\b/gi, "Street")
			.replace(/\b(Ave|Avenue)\b/gi, "Avenue")
			.replace(/\b(Blvd|Boulevard)\b/gi, "Boulevard")
			.replace(/\b(Dr|Drive)\b/gi, "Drive");
	}

	normalizeState(state) {
		if (!state) return null;
		const stateMap = {
			california: "CA",
			texas: "TX",
			florida: "FL",
			"new york": "NY",
			// Add more state mappings as needed
		};

		const normalized = state.trim().toLowerCase();
		return stateMap[normalized] || state.toUpperCase();
	}

	normalizeZipCode(zipCode) {
		if (!zipCode) return null;
		return zipCode
			.toString()
			.replace(/[^\d-]/g, "")
			.substring(0, 10);
	}

	normalizePhone(phone) {
		if (!phone) return null;
		// Remove all non-digit characters except +
		const cleaned = phone.replace(/[^\d+]/g, "");

		// Format US phone numbers
		if (cleaned.length === 10) {
			return `+1${cleaned}`;
		} else if (cleaned.length === 11 && cleaned.startsWith("1")) {
			return `+${cleaned}`;
		}

		return phone; // Return original if can't normalize
	}

	normalizeEmail(email) {
		if (!email) return null;
		return email.toLowerCase().trim();
	}

	normalizeWebsite(website) {
		if (!website) return null;

		let url = website.trim();
		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			url = "https://" + url;
		}

		try {
			const parsedUrl = new URL(url);
			return parsedUrl.href;
		} catch {
			return website; // Return original if can't parse
		}
	}

	normalizeCoordinate(coord) {
		if (coord === null || coord === undefined) return null;
		const num = parseFloat(coord);
		return isNaN(num) ? null : num;
	}

	normalizeRating(rating) {
		if (!rating) return null;
		const num = parseFloat(rating);
		return isNaN(num) ? null : Math.max(0, Math.min(5, num));
	}

	normalizePriceRange(priceLevel) {
		if (!priceLevel) return null;

		if (typeof priceLevel === "number") {
			const ranges = ["$", "$$", "$$$", "$$$$"];
			return ranges[Math.max(0, Math.min(3, priceLevel - 1))];
		}

		return priceLevel;
	}

	normalizePhotos(photos) {
		if (!photos || !Array.isArray(photos)) return [];

		return photos
			.map((photo) => {
				if (typeof photo === "string") {
					return { url: photo, source: "unknown" };
				}
				return photo;
			})
			.slice(0, 10); // Limit to 10 photos
	}

	normalizeSocialMedia(socialMedia) {
		if (!socialMedia || typeof socialMedia !== "object") return {};

		const normalized = {};
		const platforms = ["facebook", "twitter", "instagram", "linkedin", "youtube"];

		for (const platform of platforms) {
			if (socialMedia[platform]) {
				normalized[platform] = socialMedia[platform];
			}
		}

		return normalized;
	}

	normalizeAmenities(amenities) {
		if (!amenities || !Array.isArray(amenities)) return [];

		return amenities
			.map((amenity) => this.normalizeText(amenity))
			.filter(Boolean)
			.slice(0, 20); // Limit to 20 amenities
	}

	normalizePaymentMethods(paymentMethods) {
		if (!paymentMethods || !Array.isArray(paymentMethods)) return [];

		const standardMethods = ["cash", "credit_cards", "debit_cards", "american_express", "mastercard", "visa", "discover", "paypal", "apple_pay", "google_pay"];

		return paymentMethods.map((method) => method.toLowerCase().replace(/\s+/g, "_")).filter((method) => standardMethods.includes(method));
	}

	normalizeBusinessTypes(types) {
		if (!types || !Array.isArray(types)) return [];

		return types
			.map((type) => this.normalizeText(type))
			.filter(Boolean)
			.slice(0, 10); // Limit to 10 types
	}

	normalizeHours(hours) {
		if (!hours) return null;

		// If it's already in our standard format, return as-is
		if (hours.periods || hours.weekday_text) {
			return hours;
		}

		// Try to normalize other formats
		return hours;
	}

	generateSlug(name) {
		if (!name) return null;

		return name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim("-");
	}

	determineBusinessStatus(data) {
		// Determine business status based on available data
		if (data.business_status === "OPERATIONAL" || data.business_status === "operational") {
			return "published";
		}

		if (data.business_status === "CLOSED_PERMANENTLY" || data.business_status === "closed_permanently") {
			return "inactive";
		}

		return "draft"; // Default status for unclaimed businesses
	}

	determinePrimaryCategory(types) {
		if (!types || !Array.isArray(types) || types.length === 0) {
			return "business";
		}

		// Priority order for categories
		const categoryPriority = ["restaurant", "food", "store", "retail", "health", "medical", "bank", "financial", "hotel", "lodging", "gas_station", "automotive"];

		for (const priority of categoryPriority) {
			if (types.some((type) => type.toLowerCase().includes(priority))) {
				return priority;
			}
		}

		return types[0].toLowerCase().replace(/[^a-z0-9]/g, "_");
	}

	calculateValidationScore(errors, warnings) {
		const errorWeight = 10;
		const warningWeight = 2;
		const maxDeduction = 100;

		const deduction = errors.length * errorWeight + warnings.length * warningWeight;
		return Math.max(0, 100 - Math.min(deduction, maxDeduction));
	}

	// Enhancement methods (placeholders for future implementation)
	async enhanceAddressData(data) {
		// TODO: Implement geocoding and address validation
		return data;
	}

	enhancePhoneNumber(phone) {
		// TODO: Implement phone number validation and formatting
		return phone;
	}

	enhanceWebsite(website) {
		// TODO: Implement website validation and normalization
		return website;
	}

	enhanceBusinessHours(hours) {
		// TODO: Implement business hours normalization
		return hours;
	}

	async enhanceSocialMedia(data) {
		// TODO: Implement social media profile discovery
		return data.social_media || {};
	}

	async enhanceWithAI(data) {
		// TODO: Implement AI-powered data enhancement
		return data;
	}

	/**
	 * Get processor statistics
	 */
	getStats() {
		return {
			...this.stats,
			qualityRules: this.qualityRules,
			options: this.options,
		};
	}

	/**
	 * Reset statistics
	 */
	resetStats() {
		this.stats = {
			businessesProcessed: 0,
			dataEnhancements: 0,
			validationFailures: 0,
			duplicatesDetected: 0,
			fieldsMerged: 0,
		};
	}
}
