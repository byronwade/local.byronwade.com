/**
 * Business Queries - Modular Export
 * Consolidated business domain queries with focused modules
 * Enterprise-level organization for maintainability and performance
 */

// Import and export focused query modules
import { BusinessSearchQueries } from "./search";
import { BusinessProfileQueries } from "./profiles";

export { BusinessSearchQueries } from "./search";
export { BusinessProfileQueries } from "./profiles";

// Legacy exports for backward compatibility
export { BusinessSearchQueries as BusinessQueries } from "./search";

// Re-export commonly used types
export type { Tables } from "../../client";

/**
 * Unified Business API
 * Provides a single interface for all business-related operations
 */
export class BusinessAPI {
	// Search operations
	static search = BusinessSearchQueries;
	static profiles = BusinessProfileQueries;

	/**
	 * Quick access methods for common operations
	 */
	static async getById(businessId: string) {
		return await BusinessProfileQueries.getBusinessProfile(businessId);
	}

	static async getBySlug(slug: string) {
		return await BusinessProfileQueries.getBusinessBySlug(slug);
	}

	static async searchNearby(lat: number, lng: number, radius: number = 10) {
		return await BusinessSearchQueries.getNearbyBusinesses(lat, lng, radius);
	}

	static async searchByQuery(query: string, location?: string) {
		return await BusinessSearchQueries.searchBusinesses({ query, location });
	}

	static async getTrending(timeframe: "24h" | "7d" | "30d" = "7d") {
		return await BusinessSearchQueries.getTrendingBusinesses(timeframe);
	}

	static async getByCategory(categorySlug: string, location?: string) {
		return await BusinessSearchQueries.searchByCategory(categorySlug, location);
	}

	static async getUserBusinesses(userId: string) {
		return await BusinessProfileQueries.getUserBusinesses(userId);
	}

	static async getStats(businessId: string) {
		return await BusinessProfileQueries.getBusinessStats(businessId);
	}

	static async getSimilar(businessId: string, limit: number = 5) {
		return await BusinessProfileQueries.getSimilarBusinesses(businessId, limit);
	}

	/**
	 * Cache management
	 */
	static clearCache(businessId?: string) {
		if (businessId) {
			BusinessProfileQueries.invalidateBusinessCache(businessId);
		} else {
			// Clear all business-related cache
			// Implementation would depend on your cache system
			console.log("Clearing all business cache");
		}
	}
}
