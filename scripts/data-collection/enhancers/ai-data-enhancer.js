/**
 * AI Data Enhancer
 *
 * Uses OpenAI GPT to enhance and elaborate business data
 * Makes raw business data "extremely elaborate" through AI analysis
 *
 * Features:
 * - Business description generation and enhancement
 * - Category classification and refinement
 * - Data validation and correction
 * - Missing information inference
 * - Sentiment analysis of business information
 * - SEO-optimized content generation
 * - Business hour parsing and normalization
 * - Address standardization
 * - Phone number formatting
 * - Website analysis and metadata extraction
 *
 * AI Capabilities:
 * - Natural language understanding of business descriptions
 * - Industry expertise for accurate categorization
 * - Geographic knowledge for location validation
 * - Business intelligence for data enrichment
 */

import OpenAI from "openai";
import { RateLimiterManager } from "../utils/rate-limiter.js";
import { CacheManager } from "../utils/cache-manager.js";
import { Logger } from "../utils/error-handler.js";
import { API_CONFIG } from "../config/apis.js";

export class AIDataEnhancer {
	constructor() {
		this.rateLimiter = RateLimiterManager.getLimiter("openai");
		this.logger = new Logger("AIDataEnhancer");
		this.cache = CacheManager;

		// Initialize OpenAI client
		this.openai = new OpenAI({
			apiKey: API_CONFIG.OPENAI.apiKey || process.env.OPENAI_API_KEY,
		});

		// AI enhancement templates and prompts
		this.prompts = {
			enhanceDescription: {
				system: `You are an expert business data analyst and content creator. Your job is to enhance business descriptions to be comprehensive, accurate, and SEO-optimized while maintaining factual accuracy.`,

				user: `Please enhance this business information to create a comprehensive, engaging description:

Business Name: {name}
Category: {category}
Location: {address}, {city}, {state}
Phone: {phone}
Website: {website}
Current Description: {description}
Additional Info: {additionalInfo}

Requirements:
1. Create a detailed, engaging business description (2-3 paragraphs)
2. Highlight unique selling points and services
3. Include relevant keywords for SEO
4. Maintain factual accuracy - don't invent specifics
5. Use professional, welcoming tone
6. Include location context when relevant

Return ONLY a JSON object with this structure:
{
  "enhanced_description": "Enhanced description here",
  "key_services": ["service1", "service2", "service3"],
  "target_keywords": ["keyword1", "keyword2", "keyword3"],
  "unique_selling_points": ["point1", "point2"],
  "tone_analysis": "professional/casual/luxury/etc"
}`,
			},

			categorizeAndClassify: {
				system: `You are an expert business taxonomist with deep knowledge of industry classifications, NAICS codes, and business categories.`,

				user: `Analyze this business and provide comprehensive categorization:

Business Name: {name}
Description: {description}
Current Categories: {categories}
Address: {address}
Phone: {phone}
Website: {website}
Additional Data: {additionalData}

Provide detailed classification including:
1. Primary business category
2. Secondary categories
3. Industry classification
4. Target customer segments
5. Business type (B2B, B2C, B2B2C)
6. Service delivery model

Return ONLY a JSON object:
{
  "primary_category": "Main category",
  "secondary_categories": ["cat1", "cat2", "cat3"],
  "industry_classification": "Industry name",
  "naics_code": "NAICS code if identifiable",
  "sic_code": "SIC code if identifiable", 
  "business_type": "B2B/B2C/B2B2C",
  "target_segments": ["segment1", "segment2"],
  "service_delivery": "physical/digital/hybrid",
  "business_model": "retail/service/manufacturing/etc",
  "specializations": ["spec1", "spec2"]
}`,
			},

			validateAndCorrect: {
				system: `You are a data validation expert specializing in business information accuracy and standardization.`,

				user: `Please validate and correct this business information:

Name: {name}
Address: {address}
City: {city}
State: {state}
Postal Code: {postalCode}
Phone: {phone}
Email: {email}
Website: {website}
Hours: {hours}

Tasks:
1. Standardize address format
2. Validate phone number format
3. Check email format
4. Validate website URL
5. Parse and standardize business hours
6. Identify potential data issues
7. Suggest corrections

Return ONLY a JSON object:
{
  "validated_address": "Standardized address",
  "validated_phone": "Formatted phone number",
  "validated_email": "Corrected email or null",
  "validated_website": "Corrected website URL or null",
  "standardized_hours": {"monday": {"open": "09:00", "close": "17:00"}, ...},
  "data_quality_score": 85,
  "issues_found": ["issue1", "issue2"],
  "corrections_made": ["correction1", "correction2"],
  "confidence_level": "high/medium/low"
}`,
			},

			inferMissingData: {
				system: `You are an expert at inferring missing business information based on available data and industry knowledge.`,

				user: `Based on the available information, please infer likely missing data for this business:

Available Data:
Name: {name}
Category: {category}
Address: {address}
Phone: {phone}
Website: {website}
Description: {description}

Please infer:
1. Likely business hours based on category and location
2. Probable services offered
3. Typical amenities for this business type
4. Likely payment methods accepted
5. Estimated employee range
6. Target customer demographics
7. Seasonal variations (if applicable)

Return ONLY a JSON object:
{
  "inferred_hours": {"monday": {"open": "09:00", "close": "17:00"}, ...},
  "likely_services": ["service1", "service2"],
  "typical_amenities": ["amenity1", "amenity2"],
  "payment_methods": ["cash", "credit", "digital"],
  "employee_range": "1-10/11-50/51-200/200+",
  "target_demographics": ["demographic1", "demographic2"],
  "seasonal_notes": "Seasonal variations if any",
  "confidence_scores": {"hours": 0.8, "services": 0.6, ...}
}`,
			},

			generateSEOContent: {
				system: `You are an SEO content specialist creating search-optimized business content.`,

				user: `Create SEO-optimized content for this business:

Business: {name}
Category: {category}
Location: {city}, {state}
Services: {services}
Description: {description}

Generate:
1. SEO-optimized meta title (55-60 chars)
2. Meta description (150-160 chars)
3. H1 heading
4. H2 subheadings (3-4)
5. Target keywords
6. Local SEO terms
7. Schema.org structured data suggestions

Return ONLY a JSON object:
{
  "meta_title": "SEO title",
  "meta_description": "SEO description",
  "h1_heading": "Main heading",
  "h2_headings": ["heading1", "heading2", "heading3"],
  "primary_keywords": ["keyword1", "keyword2"],
  "long_tail_keywords": ["long tail keyword 1"],
  "local_seo_terms": ["city + service", "near me terms"],
  "schema_suggestions": ["LocalBusiness", "Service", "etc"],
  "content_suggestions": ["topic1", "topic2"]
}`,
			},
		};

		// Enhancement pipeline configuration
		this.enhancementPipeline = ["validateAndCorrect", "categorizeAndClassify", "enhanceDescription", "inferMissingData", "generateSEOContent"];
	}

	/**
	 * Enhance a single business with AI-powered analysis
	 * Makes the business data "extremely elaborate"
	 */
	async enhanceBusiness(business, options = {}) {
		const cacheKey = `ai_enhanced_${this.createBusinessFingerprint(business)}`;

		try {
			// Check cache first
			if (!options.force) {
				const cached = await this.cache.get(cacheKey);
				if (cached) {
					this.logger.info(`AI enhancement cache hit for business: ${business.name}`);
					return cached;
				}
			}

			const startTime = performance.now();
			this.logger.info(`Starting AI enhancement for business: ${business.name}`);

			// Initialize enhanced business with original data
			let enhancedBusiness = { ...business };

			// Run enhancement pipeline
			for (const enhancementType of this.enhancementPipeline) {
				try {
					await this.rateLimiter.waitForToken();

					const enhancement = await this.runEnhancement(enhancedBusiness, enhancementType);
					enhancedBusiness = this.mergeEnhancement(enhancedBusiness, enhancement, enhancementType);

					this.logger.debug(`Completed ${enhancementType} for ${business.name}`);
				} catch (error) {
					this.logger.warn(`Enhancement ${enhancementType} failed for ${business.name}: ${error.message}`);
					continue; // Continue with other enhancements
				}
			}

			// Add AI enhancement metadata
			enhancedBusiness.ai_enhanced = true;
			enhancedBusiness.ai_enhancement_date = new Date().toISOString();
			enhancedBusiness.ai_enhancement_version = "1.0";
			enhancedBusiness.data_quality = this.calculateEnhancedDataQuality(enhancedBusiness);

			const enhancementTime = performance.now() - startTime;
			this.logger.performance(`AI enhancement completed in ${enhancementTime.toFixed(2)}ms for ${business.name}`);

			// Cache the enhanced business
			await this.cache.set(cacheKey, enhancedBusiness, 7 * 24 * 60 * 60 * 1000); // 7 days

			return enhancedBusiness;
		} catch (error) {
			this.logger.error(`AI enhancement failed for business ${business.name}: ${error.message}`, {
				businessId: business.id,
				stack: error.stack,
			});

			// Return original business with error flag
			return {
				...business,
				ai_enhancement_error: error.message,
				ai_enhanced: false,
			};
		}
	}

	/**
	 * Enhance multiple businesses in batch
	 */
	async enhanceBusinessesBatch(businesses, options = {}) {
		const startTime = performance.now();
		this.logger.info(`Starting batch AI enhancement for ${businesses.length} businesses`);

		const enhancedBusinesses = [];
		const batchSize = options.batchSize || 5; // Process in smaller batches

		// Process in batches to manage API rate limits
		for (let i = 0; i < businesses.length; i += batchSize) {
			const batch = businesses.slice(i, i + batchSize);

			this.logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(businesses.length / batchSize)}`);

			// Process batch in parallel
			const batchPromises = batch.map((business) =>
				this.enhanceBusiness(business, options).catch((error) => {
					this.logger.error(`Batch enhancement failed for ${business.name}: ${error.message}`);
					return { ...business, ai_enhancement_error: error.message };
				})
			);

			const batchResults = await Promise.all(batchPromises);
			enhancedBusinesses.push(...batchResults);

			// Brief pause between batches
			if (i + batchSize < businesses.length) {
				await this.delay(1000);
			}
		}

		const totalTime = performance.now() - startTime;
		this.logger.performance(`Batch AI enhancement completed in ${(totalTime / 1000).toFixed(2)}s for ${businesses.length} businesses`);

		return enhancedBusinesses;
	}

	/**
	 * Run a specific AI enhancement
	 */
	async runEnhancement(business, enhancementType) {
		const prompt = this.prompts[enhancementType];
		if (!prompt) {
			throw new Error(`Unknown enhancement type: ${enhancementType}`);
		}

		try {
			// Prepare the prompt with business data
			const userPrompt = this.preparePrompt(prompt.user, business);

			const startTime = performance.now();

			const response = await this.openai.chat.completions.create({
				model: "gpt-4-turbo-preview",
				messages: [
					{ role: "system", content: prompt.system },
					{ role: "user", content: userPrompt },
				],
				temperature: 0.3, // Lower temperature for more consistent results
				max_tokens: 1500,
				response_format: { type: "json_object" },
			});

			const apiTime = performance.now() - startTime;
			this.logger.performance(`OpenAI ${enhancementType} completed in ${apiTime.toFixed(2)}ms`);

			if (!response.choices?.[0]?.message?.content) {
				throw new Error("No response content from OpenAI");
			}

			// Parse the JSON response
			const enhancement = JSON.parse(response.choices[0].message.content);

			this.logger.debug(`Enhancement ${enhancementType} successful`, {
				businessName: business.name,
				tokensUsed: response.usage?.total_tokens,
			});

			return enhancement;
		} catch (error) {
			this.logger.error(`OpenAI enhancement ${enhancementType} failed: ${error.message}`, {
				businessName: business.name,
			});
			throw error;
		}
	}

	/**
	 * Prepare prompt template with business data
	 */
	preparePrompt(template, business) {
		const replacements = {
			name: business.name || "Unknown Business",
			category: Array.isArray(business.categories) ? business.categories.join(", ") : business.categories || "General Business",
			description: business.description || "No description available",
			address: business.address || "Address not available",
			city: business.city || "City unknown",
			state: business.state || "State unknown",
			postalCode: business.postal_code || "Postal code unknown",
			phone: business.phone || "Phone not available",
			email: business.email || "Email not available",
			website: business.website || "Website not available",
			hours: this.formatHours(business.hours) || "Hours not available",
			services: Array.isArray(business.services) ? business.services.join(", ") : "Services unknown",
			categories: Array.isArray(business.categories) ? business.categories.join(", ") : business.categories || "General",
			additionalInfo: this.gatherAdditionalInfo(business),
			additionalData: this.gatherAdditionalData(business),
		};

		let prompt = template;
		for (const [key, value] of Object.entries(replacements)) {
			prompt = prompt.replace(new RegExp(`{${key}}`, "g"), value);
		}

		return prompt;
	}

	/**
	 * Gather additional business information for AI analysis
	 */
	gatherAdditionalInfo(business) {
		const additionalFields = ["amenities", "payment_methods", "social_media", "rating", "review_count", "price_range", "specializations", "certifications"];

		const info = [];

		additionalFields.forEach((field) => {
			if (business[field]) {
				const value = Array.isArray(business[field]) ? business[field].join(", ") : business[field];
				info.push(`${field}: ${value}`);
			}
		});

		return info.join(" | ") || "No additional information available";
	}

	/**
	 * Gather additional data for categorization
	 */
	gatherAdditionalData(business) {
		const data = {
			rating: business.rating || null,
			reviewCount: business.review_count || null,
			priceRange: business.price_range || null,
			amenities: business.amenities || [],
			paymentMethods: business.payment_methods || [],
			dataSource: business.data_source || "unknown",
		};

		return JSON.stringify(data);
	}

	/**
	 * Format business hours for AI processing
	 */
	formatHours(hours) {
		if (!hours) return null;

		if (typeof hours === "string") {
			return hours;
		}

		if (typeof hours === "object") {
			const formattedHours = [];
			const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

			days.forEach((day) => {
				if (hours[day]) {
					const dayHours = hours[day];
					if (dayHours.is_closed) {
						formattedHours.push(`${day}: Closed`);
					} else {
						formattedHours.push(`${day}: ${dayHours.open || "Open"} - ${dayHours.close || "Close"}`);
					}
				}
			});

			return formattedHours.join(", ") || null;
		}

		return null;
	}

	/**
	 * Merge AI enhancement results with business data
	 */
	mergeEnhancement(business, enhancement, enhancementType) {
		const enhancedBusiness = { ...business };

		try {
			switch (enhancementType) {
				case "enhanceDescription":
					enhancedBusiness.description = enhancement.enhanced_description || business.description;
					enhancedBusiness.key_services = enhancement.key_services || [];
					enhancedBusiness.target_keywords = enhancement.target_keywords || [];
					enhancedBusiness.unique_selling_points = enhancement.unique_selling_points || [];
					enhancedBusiness.tone_analysis = enhancement.tone_analysis;
					break;

				case "categorizeAndClassify":
					enhancedBusiness.primary_category = enhancement.primary_category;
					enhancedBusiness.categories = [enhancement.primary_category, ...(enhancement.secondary_categories || [])].filter(Boolean);
					enhancedBusiness.industry_classification = enhancement.industry_classification;
					enhancedBusiness.naics_code = enhancement.naics_code;
					enhancedBusiness.sic_code = enhancement.sic_code;
					enhancedBusiness.business_type = enhancement.business_type;
					enhancedBusiness.target_segments = enhancement.target_segments || [];
					enhancedBusiness.service_delivery = enhancement.service_delivery;
					enhancedBusiness.business_model = enhancement.business_model;
					enhancedBusiness.specializations = enhancement.specializations || [];
					break;

				case "validateAndCorrect":
					if (enhancement.validated_address) enhancedBusiness.address = enhancement.validated_address;
					if (enhancement.validated_phone) enhancedBusiness.phone = enhancement.validated_phone;
					if (enhancement.validated_email) enhancedBusiness.email = enhancement.validated_email;
					if (enhancement.validated_website) enhancedBusiness.website = enhancement.validated_website;
					if (enhancement.standardized_hours) enhancedBusiness.hours = enhancement.standardized_hours;
					enhancedBusiness.data_validation = {
						quality_score: enhancement.data_quality_score,
						issues_found: enhancement.issues_found || [],
						corrections_made: enhancement.corrections_made || [],
						confidence_level: enhancement.confidence_level,
					};
					break;

				case "inferMissingData":
					if (!enhancedBusiness.hours && enhancement.inferred_hours) {
						enhancedBusiness.hours = enhancement.inferred_hours;
						enhancedBusiness.hours_inferred = true;
					}
					enhancedBusiness.likely_services = enhancement.likely_services || [];
					enhancedBusiness.typical_amenities = enhancement.typical_amenities || [];
					enhancedBusiness.inferred_payment_methods = enhancement.payment_methods || [];
					enhancedBusiness.employee_range = enhancement.employee_range;
					enhancedBusiness.target_demographics = enhancement.target_demographics || [];
					enhancedBusiness.seasonal_notes = enhancement.seasonal_notes;
					enhancedBusiness.inference_confidence = enhancement.confidence_scores || {};
					break;

				case "generateSEOContent":
					enhancedBusiness.seo = {
						meta_title: enhancement.meta_title,
						meta_description: enhancement.meta_description,
						h1_heading: enhancement.h1_heading,
						h2_headings: enhancement.h2_headings || [],
						primary_keywords: enhancement.primary_keywords || [],
						long_tail_keywords: enhancement.long_tail_keywords || [],
						local_seo_terms: enhancement.local_seo_terms || [],
						schema_suggestions: enhancement.schema_suggestions || [],
						content_suggestions: enhancement.content_suggestions || [],
					};
					break;
			}

			// Record the enhancement
			if (!enhancedBusiness.ai_enhancements) {
				enhancedBusiness.ai_enhancements = {};
			}
			enhancedBusiness.ai_enhancements[enhancementType] = {
				completed: true,
				timestamp: new Date().toISOString(),
				data: enhancement,
			};
		} catch (error) {
			this.logger.warn(`Failed to merge enhancement ${enhancementType}: ${error.message}`);
		}

		return enhancedBusiness;
	}

	/**
	 * Calculate enhanced data quality score
	 */
	calculateEnhancedDataQuality(business) {
		let score = 0;
		const maxScore = 100;

		// Basic information (30 points)
		if (business.name) score += 10;
		if (business.description && business.description.length > 50) score += 10;
		if (business.phone) score += 5;
		if (business.website) score += 5;

		// Enhanced information (40 points)
		if (business.categories && business.categories.length > 0) score += 10;
		if (business.address) score += 10;
		if (business.hours) score += 10;
		if (business.key_services && business.key_services.length > 0) score += 10;

		// AI enhancements (30 points)
		if (business.primary_category) score += 5;
		if (business.industry_classification) score += 5;
		if (business.seo) score += 10;
		if (business.target_segments && business.target_segments.length > 0) score += 5;
		if (business.data_validation && business.data_validation.confidence_level === "high") score += 5;

		return Math.min(score, maxScore);
	}

	/**
	 * Create business fingerprint for caching
	 */
	createBusinessFingerprint(business) {
		const key = `${business.name || "unknown"}_${business.address || "no_address"}_${business.phone || "no_phone"}`;
		return key.replace(/[^\w]/g, "_").toLowerCase();
	}

	/**
	 * Add delay between API calls
	 */
	async delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Get enhancer statistics
	 */
	getStats() {
		return {
			rateLimiter: this.rateLimiter.getStats(),
			cache: this.cache.getStats(),
			enhancementPipeline: this.enhancementPipeline,
			availableEnhancements: Object.keys(this.prompts),
		};
	}
}

export default AIDataEnhancer;
