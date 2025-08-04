// Supabase Business Data Populator
// Performance-optimized database operations for business data collection

import { createClient } from "@supabase/supabase-js";
import { logger, errorHandler } from "../utils/error-handler.js";
import { cacheManager } from "../utils/cache-manager.js";

/**
 * Supabase Business Populator with performance optimization and error handling
 */
export class SupabaseBusinessPopulator {
	constructor(options = {}) {
		this.options = {
			batchSize: options.batchSize || 50,
			enableCache: options.enableCache !== false,
			enableDuplicateCheck: options.enableDuplicateCheck !== false,
			...options,
		};

		// Initialize Supabase client
		this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
			db: {
				schema: "public",
			},
		});

		// Performance tracking
		this.stats = {
			insertsAttempted: 0,
			insertsSuccessful: 0,
			insertsFailed: 0,
			updatesAttempted: 0,
			updatesSuccessful: 0,
			duplicatesSkipped: 0,
			categoriesCreated: 0,
			photosInserted: 0,
			totalProcessingTime: 0,
		};

		// Cache for categories to avoid duplicate creation
		this.categoryCache = new Map();

		logger.info("Supabase Business Populator initialized");
	}

	/**
	 * Test database connection
	 */
	async testConnection() {
		try {
			const { data, error } = await this.supabase.from("businesses").select("count(*)", { count: "exact", head: true });

			if (error) {
				throw error;
			}

			logger.info("Database connection test successful");
			return true;
		} catch (error) {
			logger.error("Database connection test failed", { error: error.message });
			throw new Error(`Database connection failed: ${error.message}`);
		}
	}

	/**
	 * Insert a single business into the database
	 */
	async insertBusiness(businessData) {
		const startTime = Date.now();
		this.stats.insertsAttempted++;

		try {
			// Check for duplicates if enabled
			if (this.options.enableDuplicateCheck) {
				const existingBusiness = await this.findDuplicateBusiness(businessData);
				if (existingBusiness) {
					logger.debug(`Duplicate business found, updating: ${businessData.name}`);
					return await this.updateBusiness(existingBusiness.id, businessData);
				}
			}

			// Prepare business data for insertion
			const preparedData = await this.prepareBusinessData(businessData);

			// Insert main business record
			const { data: insertedBusiness, error: businessError } = await this.supabase.from("businesses").insert(preparedData.business).select("id").single();

			if (businessError) {
				throw businessError;
			}

			const businessId = insertedBusiness.id;
			logger.debug(`Business inserted with ID: ${businessId}`);

			// Insert related data
			await this.insertRelatedData(businessId, preparedData);

			this.stats.insertsSuccessful++;
			const processingTime = Date.now() - startTime;
			this.stats.totalProcessingTime += processingTime;

			logger.debug(`Business insertion completed in ${processingTime}ms: ${businessData.name}`);
			return businessId;
		} catch (error) {
			this.stats.insertsFailed++;

			await errorHandler.handleError(error, {
				operation: "insertBusiness",
				business: businessData.name,
				api: "supabase",
			});

			logger.error("Business insertion failed", {
				business: businessData.name,
				error: error.message,
			});

			return null;
		}
	}

	/**
	 * Update an existing business
	 */
	async updateBusiness(businessId, businessData) {
		const startTime = Date.now();
		this.stats.updatesAttempted++;

		try {
			// Prepare update data
			const preparedData = await this.prepareBusinessData(businessData);

			// Update main business record
			const { error: updateError } = await this.supabase
				.from("businesses")
				.update({
					...preparedData.business,
					updated_at: new Date().toISOString(),
				})
				.eq("id", businessId);

			if (updateError) {
				throw updateError;
			}

			// Update related data
			await this.updateRelatedData(businessId, preparedData);

			this.stats.updatesSuccessful++;
			const processingTime = Date.now() - startTime;
			this.stats.totalProcessingTime += processingTime;

			logger.debug(`Business update completed in ${processingTime}ms: ${businessData.name}`);
			return businessId;
		} catch (error) {
			await errorHandler.handleError(error, {
				operation: "updateBusiness",
				businessId,
				api: "supabase",
			});

			logger.error("Business update failed", {
				businessId,
				business: businessData.name,
				error: error.message,
			});

			return null;
		}
	}

	/**
	 * Find duplicate business based on name and location
	 */
	async findDuplicateBusiness(businessData) {
		const cacheKey = `duplicate_check_${businessData.name}_${businessData.city}_${businessData.state}`;

		try {
			// Check cache first
			if (this.options.enableCache) {
				const cached = await cacheManager.get(cacheKey);
				if (cached) {
					return cached;
				}
			}

			// Search for duplicates
			const { data: duplicates, error } = await this.supabase.from("businesses").select("id, name, address, city, state").ilike("name", businessData.name).eq("city", businessData.city).eq("state", businessData.state).limit(5);

			if (error) {
				throw error;
			}

			// Find best match
			const bestMatch = this.findBestDuplicateMatch(businessData, duplicates);

			// Cache result
			if (this.options.enableCache) {
				await cacheManager.set(cacheKey, bestMatch, { ttl: 3600000 }); // 1 hour
			}

			if (bestMatch) {
				this.stats.duplicatesSkipped++;
			}

			return bestMatch;
		} catch (error) {
			logger.warn("Duplicate check failed", { error: error.message });
			return null;
		}
	}

	/**
	 * Find the best duplicate match using similarity scoring
	 */
	findBestDuplicateMatch(businessData, candidates) {
		if (!candidates || candidates.length === 0) {
			return null;
		}

		let bestMatch = null;
		let bestScore = 0;

		for (const candidate of candidates) {
			const score = this.calculateSimilarityScore(businessData, candidate);

			if (score > bestScore && score > 0.8) {
				// 80% similarity threshold
				bestScore = score;
				bestMatch = candidate;
			}
		}

		return bestMatch;
	}

	/**
	 * Calculate similarity score between two businesses
	 */
	calculateSimilarityScore(business1, business2) {
		let score = 0;
		let factors = 0;

		// Name similarity (40% weight)
		const nameSimilarity = this.calculateStringSimilarity(business1.name.toLowerCase(), business2.name.toLowerCase());
		score += nameSimilarity * 0.4;
		factors += 0.4;

		// Address similarity (30% weight)
		if (business1.address && business2.address) {
			const addressSimilarity = this.calculateStringSimilarity(business1.address.toLowerCase(), business2.address.toLowerCase());
			score += addressSimilarity * 0.3;
			factors += 0.3;
		}

		// Location similarity (30% weight)
		if (business1.city === business2.city && business1.state === business2.state) {
			score += 0.3;
		}
		factors += 0.3;

		return factors > 0 ? score / factors : 0;
	}

	/**
	 * Calculate string similarity using Levenshtein distance
	 */
	calculateStringSimilarity(str1, str2) {
		const maxLength = Math.max(str1.length, str2.length);
		if (maxLength === 0) return 1;

		const distance = this.levenshteinDistance(str1, str2);
		return (maxLength - distance) / maxLength;
	}

	/**
	 * Calculate Levenshtein distance between two strings
	 */
	levenshteinDistance(str1, str2) {
		const matrix = Array(str2.length + 1)
			.fill(null)
			.map(() => Array(str1.length + 1).fill(null));

		for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
		for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

		for (let j = 1; j <= str2.length; j++) {
			for (let i = 1; i <= str1.length; i++) {
				const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
				matrix[j][i] = Math.min(
					matrix[j][i - 1] + 1, // deletion
					matrix[j - 1][i] + 1, // insertion
					matrix[j - 1][i - 1] + indicator // substitution
				);
			}
		}

		return matrix[str2.length][str1.length];
	}

	/**
	 * Prepare business data for database insertion
	 */
	async prepareBusinessData(businessData) {
		// Prepare main business record
		const business = {
			name: businessData.name,
			slug: businessData.slug,
			description: businessData.description,
			address: businessData.address,
			city: businessData.city,
			state: businessData.state,
			zip_code: businessData.zip_code,
			country: businessData.country || "US",
			latitude: businessData.latitude,
			longitude: businessData.longitude,
			phone: businessData.phone,
			email: businessData.email,
			website: businessData.website,
			hours: businessData.hours,
			rating: businessData.rating,
			review_count: businessData.review_count || 0,
			price_range: businessData.price_range,
			status: businessData.status || "draft",
			verified: businessData.verified || false,
			featured: businessData.featured || false,
			owner_id: businessData.owner_id,
			claimed_by: businessData.claimed_by,
			claimed_at: businessData.claimed_at,
			photos: businessData.photos || [],
			social_media: businessData.social_media || {},
			amenities: businessData.amenities || [],
			payment_methods: businessData.payment_methods || [],
		};

		// Prepare categories
		const categories = await this.prepareCategoriesData(businessData.business_types || []);

		// Prepare photos
		const photos = this.preparePhotosData(businessData.photos || []);

		return {
			business,
			categories,
			photos,
			metadata: {
				source: businessData.source,
				source_id: businessData.source_id,
				data_quality_score: businessData.data_quality_score,
				collected_at: businessData.collected_at,
				processing_metadata: businessData.processing_metadata,
			},
		};
	}

	/**
	 * Prepare categories data and ensure categories exist
	 */
	async prepareCategoriesData(businessTypes) {
		const categories = [];

		for (const type of businessTypes) {
			if (!type) continue;

			const categorySlug = this.generateCategorySlug(type);

			// Check cache first
			let categoryId = this.categoryCache.get(categorySlug);

			if (!categoryId) {
				// Find or create category
				categoryId = await this.findOrCreateCategory(type, categorySlug);
				this.categoryCache.set(categorySlug, categoryId);
			}

			if (categoryId) {
				categories.push({
					category_id: categoryId,
					is_primary: categories.length === 0, // First category is primary
				});
			}
		}

		return categories;
	}

	/**
	 * Find or create a business category
	 */
	async findOrCreateCategory(categoryName, categorySlug) {
		try {
			// Try to find existing category
			const { data: existingCategory, error: findError } = await this.supabase.from("categories").select("id").eq("slug", categorySlug).single();

			if (findError && findError.code !== "PGRST116") {
				throw findError;
			}

			if (existingCategory) {
				return existingCategory.id;
			}

			// Create new category
			const { data: newCategory, error: createError } = await this.supabase
				.from("categories")
				.insert({
					name: categoryName,
					slug: categorySlug,
					description: `Businesses in the ${categoryName} category`,
					is_active: true,
				})
				.select("id")
				.single();

			if (createError) {
				throw createError;
			}

			this.stats.categoriesCreated++;
			logger.debug(`Created new category: ${categoryName}`);

			return newCategory.id;
		} catch (error) {
			logger.warn(`Failed to find/create category: ${categoryName}`, { error: error.message });
			return null;
		}
	}

	/**
	 * Generate category slug
	 */
	generateCategorySlug(categoryName) {
		return categoryName
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim("-");
	}

	/**
	 * Prepare photos data
	 */
	preparePhotosData(photos) {
		return photos.map((photo, index) => ({
			url: typeof photo === "string" ? photo : photo.url,
			alt_text: photo.alt_text || null,
			caption: photo.caption || null,
			is_primary: index === 0,
			order: index,
		}));
	}

	/**
	 * Insert related data (categories, photos)
	 */
	async insertRelatedData(businessId, preparedData) {
		try {
			// Insert business categories
			if (preparedData.categories.length > 0) {
				const categoryData = preparedData.categories.map((cat) => ({
					business_id: businessId,
					category_id: cat.category_id,
					is_primary: cat.is_primary,
				}));

				const { error: categoryError } = await this.supabase.from("business_categories").insert(categoryData);

				if (categoryError) {
					logger.warn("Failed to insert business categories", { error: categoryError.message });
				}
			}

			// Insert business photos
			if (preparedData.photos.length > 0) {
				const photoData = preparedData.photos.map((photo) => ({
					business_id: businessId,
					url: photo.url,
					alt_text: photo.alt_text,
					caption: photo.caption,
					is_primary: photo.is_primary,
					order: photo.order,
				}));

				const { error: photoError } = await this.supabase.from("business_photos").insert(photoData);

				if (photoError) {
					logger.warn("Failed to insert business photos", { error: photoError.message });
				} else {
					this.stats.photosInserted += photoData.length;
				}
			}
		} catch (error) {
			logger.warn("Failed to insert related data", { error: error.message });
		}
	}

	/**
	 * Update related data (categories, photos)
	 */
	async updateRelatedData(businessId, preparedData) {
		try {
			// Update business categories (delete and re-insert)
			await this.supabase.from("business_categories").delete().eq("business_id", businessId);

			if (preparedData.categories.length > 0) {
				const categoryData = preparedData.categories.map((cat) => ({
					business_id: businessId,
					category_id: cat.category_id,
					is_primary: cat.is_primary,
				}));

				await this.supabase.from("business_categories").insert(categoryData);
			}

			// Update photos (delete and re-insert)
			await this.supabase.from("business_photos").delete().eq("business_id", businessId);

			if (preparedData.photos.length > 0) {
				const photoData = preparedData.photos.map((photo) => ({
					business_id: businessId,
					url: photo.url,
					alt_text: photo.alt_text,
					caption: photo.caption,
					is_primary: photo.is_primary,
					order: photo.order,
				}));

				await this.supabase.from("business_photos").insert(photoData);
			}
		} catch (error) {
			logger.warn("Failed to update related data", { error: error.message });
		}
	}

	/**
	 * Get businesses that need updating
	 */
	async getBusinessesForUpdate(daysSinceUpdate = 30) {
		try {
			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() - daysSinceUpdate);

			const { data: businesses, error } = await this.supabase.from("businesses").select("id, name, city, state, latitude, longitude, updated_at").lt("updated_at", cutoffDate.toISOString()).eq("status", "published").order("updated_at", { ascending: true }).limit(1000);

			if (error) {
				throw error;
			}

			return businesses || [];
		} catch (error) {
			logger.error("Failed to get businesses for update", { error: error.message });
			return [];
		}
	}

	/**
	 * Bulk insert businesses (for large datasets)
	 */
	async bulkInsertBusinesses(businessDataArray) {
		const results = {
			successful: 0,
			failed: 0,
			duplicates: 0,
		};

		const batchSize = this.options.batchSize;

		for (let i = 0; i < businessDataArray.length; i += batchSize) {
			const batch = businessDataArray.slice(i, i + batchSize);

			for (const businessData of batch) {
				try {
					const result = await this.insertBusiness(businessData);
					if (result) {
						results.successful++;
					} else {
						results.failed++;
					}
				} catch (error) {
					results.failed++;
					logger.error("Bulk insert failed for business", {
						business: businessData.name,
						error: error.message,
					});
				}
			}

			// Add delay between batches to avoid overwhelming the database
			if (i + batchSize < businessDataArray.length) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}

			logger.info(`Bulk insert progress: ${Math.min(i + batchSize, businessDataArray.length)}/${businessDataArray.length}`);
		}

		return results;
	}

	/**
	 * Get populator statistics
	 */
	getStats() {
		const averageProcessingTime = this.stats.insertsAttempted > 0 ? this.stats.totalProcessingTime / this.stats.insertsAttempted : 0;

		const successRate = this.stats.insertsAttempted > 0 ? (this.stats.insertsSuccessful / this.stats.insertsAttempted) * 100 : 0;

		return {
			...this.stats,
			averageProcessingTime: Math.round(averageProcessingTime),
			successRate: Math.round(successRate),
			categoryCache: {
				size: this.categoryCache.size,
				categories: Array.from(this.categoryCache.keys()),
			},
		};
	}

	/**
	 * Cleanup resources
	 */
	async cleanup() {
		// Clear category cache
		this.categoryCache.clear();

		logger.info("Business populator cleanup completed");
	}

	/**
	 * Reset statistics
	 */
	resetStats() {
		this.stats = {
			insertsAttempted: 0,
			insertsSuccessful: 0,
			insertsFailed: 0,
			updatesAttempted: 0,
			updatesSuccessful: 0,
			duplicatesSkipped: 0,
			categoriesCreated: 0,
			photosInserted: 0,
			totalProcessingTime: 0,
		};
	}
}
