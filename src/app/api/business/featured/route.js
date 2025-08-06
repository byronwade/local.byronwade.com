/**
 * Featured Business API Route for Main App
 * Provides featured businesses for home page and components
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@utils/logger";

// Mock data fallback for development/testing
const mockBusinesses = [
	{
		id: "mock-1",
		name: "Sample Restaurant",
		slug: "sample-restaurant",
		description: "A great place to eat with amazing food and service.",
		address: "123 Main St",
		city: "San Francisco",
		state: "CA",
		latitude: 37.7749,
		longitude: -122.4194,
		phone: "(555) 123-4567",
		website: "https://example.com",
		rating: 4.5,
		review_count: 127,
		price_range: "$$",
		featured: true,
		verified: true,
		photos: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"],
		business_categories: [
			{
				category: {
					id: "restaurant",
					name: "Restaurant",
					slug: "restaurant",
				},
			},
		],
	},
	{
		id: "mock-2",
		name: "Local Coffee Shop",
		slug: "local-coffee-shop",
		description: "Best coffee in town with a cozy atmosphere.",
		address: "456 Oak Ave",
		city: "San Francisco",
		state: "CA",
		latitude: 37.7849,
		longitude: -122.4094,
		phone: "(555) 987-6543",
		website: "https://example2.com",
		rating: 4.2,
		review_count: 89,
		price_range: "$",
		featured: true,
		verified: true,
		photos: ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400"],
		business_categories: [
			{
				category: {
					id: "cafe",
					name: "Cafe",
					slug: "cafe",
				},
			},
		],
	},
];

// Environment validation - now returns null instead of throwing for missing vars
function validateEnvironment() {
	const requiredEnvVars = {
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
	};

	const missing = Object.entries(requiredEnvVars)
		.filter(([_, value]) => !value)
		.map(([key, _]) => key);

	if (missing.length > 0) {
		logger.warn(`Missing environment variables (will use mock data): ${missing.join(", ")}`);
		return null;
	}

	return requiredEnvVars;
}

// Create Supabase client with error handling
function createSupabaseClient() {
	try {
		const env = validateEnvironment();
		if (!env) {
			logger.debug("Environment variables not available, Supabase client not created");
			return null;
		}

		return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
			auth: {
				persistSession: false,
			},
		});
	} catch (error) {
		logger.error("Failed to create Supabase client:", error);
		return null;
	}
}

export async function GET(request) {
	const startTime = performance.now();

	try {
		logger.debug("Fetching featured businesses for home page");

		// Parse query parameters
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit")) || 20;
		const featured = searchParams.get("featured") !== "false"; // Default to true
		const useMock = searchParams.get("mock") === "true";

		// If explicitly requested or if environment is not set up, use mock data
		if (useMock) {
			logger.debug("Using mock business data");
			const transformedMockData = mockBusinesses.slice(0, limit).map(transformBusiness);

			return NextResponse.json(
				{
					success: true,
					businesses: transformedMockData,
					metadata: {
						total: transformedMockData.length,
						responseTime: `${(performance.now() - startTime).toFixed(2)}ms`,
						featured: featured,
						limit: limit,
						source: "mock",
					},
				},
				{
					status: 200,
					headers: {
						"Cache-Control": "public, max-age=60, stale-while-revalidate=120",
					},
				}
			);
		}

		// Try to create Supabase client
		const supabase = createSupabaseClient();
		if (!supabase) {
			logger.warn("Supabase client not available, falling back to mock data");
			const transformedMockData = mockBusinesses.slice(0, limit).map(transformBusiness);

			return NextResponse.json(
				{
					success: true,
					businesses: transformedMockData,
					metadata: {
						total: transformedMockData.length,
						responseTime: `${(performance.now() - startTime).toFixed(2)}ms`,
						featured: featured,
						limit: limit,
						source: "fallback",
					},
				},
				{
					status: 200,
					headers: {
						"Cache-Control": "public, max-age=60, stale-while-revalidate=120",
					},
				}
			);
		}

		// Try to query the database
		let query = supabase
			.from("businesses")
			.select(
				`
				id,
				name,
				slug,
				description,
				address,
				city,
				state,
				latitude,
				longitude,
				phone,
				website,
				rating,
				review_count,
				price_range,
				featured,
				verified,
				photos,
				business_categories(
					category:categories(
						id,
						name,
						slug
					)
				)
			`
			)
			.eq("status", "published")
			.eq("verified", true);

		// Filter for featured businesses if requested
		if (featured) {
			query = query.eq("featured", true);
		}

		// Order by featured status first, then rating
		query = query.order("featured", { ascending: false }).order("rating", { ascending: false }).order("review_count", { ascending: false }).limit(limit);

		const { data: businesses, error } = await query;

		if (error) {
			logger.error("Supabase query error:", error);
			logger.warn("Database query failed, falling back to mock data");

			const transformedMockData = mockBusinesses.slice(0, limit).map(transformBusiness);

			return NextResponse.json(
				{
					success: true,
					businesses: transformedMockData,
					metadata: {
						total: transformedMockData.length,
						responseTime: `${(performance.now() - startTime).toFixed(2)}ms`,
						featured: featured,
						limit: limit,
						source: "fallback",
						error: error.message,
					},
				},
				{
					status: 200,
					headers: {
						"Cache-Control": "public, max-age=60, stale-while-revalidate=120",
					},
				}
			);
		}

		// Transform data for client consumption
		const transformedBusinesses = (businesses || []).map(transformBusiness);

		// If no businesses found, use mock data as fallback
		if (transformedBusinesses.length === 0) {
			logger.debug("No businesses found in database, using mock data");
			const transformedMockData = mockBusinesses.slice(0, limit).map(transformBusiness);

			return NextResponse.json(
				{
					success: true,
					businesses: transformedMockData,
					metadata: {
						total: transformedMockData.length,
						responseTime: `${(performance.now() - startTime).toFixed(2)}ms`,
						featured: featured,
						limit: limit,
						source: "fallback",
					},
				},
				{
					status: 200,
					headers: {
						"Cache-Control": "public, max-age=60, stale-while-revalidate=120",
					},
				}
			);
		}

		const duration = performance.now() - startTime;
		logger.performance(`Featured businesses API completed in ${duration.toFixed(2)}ms`);
		logger.debug(`Returned ${transformedBusinesses.length} featured businesses`);

		return NextResponse.json(
			{
				success: true,
				businesses: transformedBusinesses,
				metadata: {
					total: transformedBusinesses.length,
					responseTime: `${duration.toFixed(2)}ms`,
					featured: featured,
					limit: limit,
					source: "database",
				},
			},
			{
				status: 200,
				headers: {
					"Cache-Control": "public, max-age=300, stale-while-revalidate=600",
				},
			}
		);
	} catch (error) {
		const duration = performance.now() - startTime;
		logger.error("Error in featured businesses API:", {
			error: error.message,
			stack: error.stack,
			duration: `${duration.toFixed(2)}ms`,
		});

		// Even on error, provide mock data as a last resort
		logger.warn("Critical error occurred, falling back to mock data");
		const transformedMockData = mockBusinesses.slice(0, parseInt(new URL(request.url).searchParams.get("limit")) || 20).map(transformBusiness);

		return NextResponse.json(
			{
				success: true,
				businesses: transformedMockData,
				metadata: {
					total: transformedMockData.length,
					responseTime: `${duration.toFixed(2)}ms`,
					source: "emergency_fallback",
					error: error.message,
				},
			},
			{
				status: 200,
				headers: {
					"Cache-Control": "public, max-age=60, stale-while-revalidate=120",
				},
			}
		);
	}
}

// Helper function to transform business data consistently
function transformBusiness(business) {
	return {
		id: business.id,
		name: business.name,
		slug: business.slug,
		description: business.description,
		coordinates: {
			lat: business.latitude,
			lng: business.longitude,
		},
		address: business.address,
		city: business.city,
		state: business.state,
		phone: business.phone,
		website: business.website,
		rating: business.rating || 0,
		reviewCount: business.review_count || 0,
		categories: business.business_categories?.map((cat) => cat.category?.name).filter(Boolean) || [],
		price_range: business.price_range,
		featured: business.featured || false,
		verified: business.verified || false,
		photos: business.photos || [],
	};
}
