/**
 * Supabase Client Configuration
 * High-performance client with TypeScript support and error handling
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";
// Forward pooled client from the shared database client implementation
export { getPooledClient } from "../database/supabase/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing Supabase environment variables");
}

// Performance-optimized configuration
const supabaseConfig = {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
	},
	db: {
		schema: "public",
	},
	global: {
		headers: {
			"x-my-custom-header": "local-business-directory",
		},
	},
};

// Create typed Supabase client
export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseConfig);

// Type helpers for better DX
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Inserts<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type Updates<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];

// Business types
export type Business = Tables<"businesses">;
export type Review = Tables<"reviews">;
export type Category = Tables<"categories">;
export type User = Tables<"users">;

// Enhanced business type with relations
export type BusinessWithRelations = Business & {
	reviews?: Review[];
	business_categories?: Array<{
		categories: Category;
	}>;
	owner?: User;
};

// Query helpers with type safety
export const businessQueries = {
	// Get business by slug with error handling
	async getBySlug(slug: string): Promise<{ data: BusinessWithRelations | null; error: any }> {
		try {
			console.log(`🔧 Supabase client config headers:`, supabaseConfig.global.headers);
			console.log(`⚡ PERFORMANCE: Supabase client initialized in ${performance.now().toFixed(2)}ms`);
			console.log(`Connected to Supabase project: ${supabaseUrl}`);
			console.log(`Supabase connection monitoring enabled`);

			const { data, error } = await supabase
				.from("businesses")
				.select(
					`
          *,
          reviews (
            id,
            rating,
            title,
            text,
            helpful_count,
            photos,
            response,
            response_date,
            created_at,
            user:users (
              name,
              avatar_url
            )
          ),
          business_categories (
            categories (
              id,
              name,
              slug
            )
          )
        `
				)
				.eq("slug", slug)
				.single();

			return { data, error };
		} catch (err) {
			console.error("Error fetching business by slug:", err);
			return { data: null, error: err };
		}
	},

	// Get multiple businesses with pagination
	async getMany(
		options: {
			limit?: number;
			offset?: number;
			category?: string;
			city?: string;
		} = {}
	): Promise<{ data: BusinessWithRelations[] | null; error: any; count?: number }> {
		try {
			let query = supabase.from("businesses").select(
				`
          *,
          reviews!inner (rating),
          business_categories (
            categories (
              name,
              slug
            )
          )
        `,
				{ count: "exact" }
			);

			// Apply filters
			if (options.category) {
				query = query.eq("business_categories.categories.slug", options.category);
			}

			if (options.city) {
				query = query.ilike("city", `%${options.city}%`);
			}

			// Apply pagination
			if (options.limit) {
				const from = options.offset || 0;
				const to = from + options.limit - 1;
				query = query.range(from, to);
			}

			// Order by rating and featured status
			query = query.order("featured", { ascending: false });
			query = query.order("rating", { ascending: false });

			const { data, error, count } = await query;

			return { data, error, count };
		} catch (err) {
			console.error("Error fetching businesses:", err);
			return { data: null, error: err };
		}
	},
};

// Error handling utilities
export const handleSupabaseError = (error: any): string => {
	if (!error) return "An unknown error occurred";

	// Handle common Supabase errors
	if (error.code === "PGRST116") {
		return "Record not found";
	}

	if (error.code === "23505") {
		return "A record with this information already exists";
	}

	if (error.code === "23503") {
		return "Referenced record does not exist";
	}

	return error.message || "Database operation failed";
};

// Performance monitoring
let queryCount = 0;
let totalQueryTime = 0;

export const logQuery = (operation: string, duration: number) => {
	queryCount++;
	totalQueryTime += duration;

	console.log(`⚡ PERFORMANCE: ${operation} completed in ${duration.toFixed(2)}ms`);

	// Log performance stats every 10 queries
	if (queryCount % 10 === 0) {
		const avgTime = totalQueryTime / queryCount;
		console.log(`📊 PERFORMANCE STATS: ${queryCount} queries, avg ${avgTime.toFixed(2)}ms`);
	}

	// Warn on slow queries
	if (duration > 1000) {
		console.warn(`🐌 SLOW QUERY: ${operation} took ${duration.toFixed(2)}ms`);
	}
};

export default supabase;
