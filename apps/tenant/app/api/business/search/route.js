import { NextResponse } from "next/server";
import { BusinessDataFetchers } from "@lib/supabase/server";
import { logger } from "@lib/utils/logger";

export async function GET(req) {
	const startTime = performance.now();
	const url = new URL(req.url);

	// Parse search parameters
	const query = url.searchParams.get("query") || "";
	const location = url.searchParams.get("location") || "";
	const category = url.searchParams.get("category") || "";
	const rating = url.searchParams.get("rating") ? parseInt(url.searchParams.get("rating"), 10) : undefined;
	const priceRange = url.searchParams.get("priceRange") || "";
	const limit = parseInt(url.searchParams.get("limit"), 10) || 20;
	const offset = parseInt(url.searchParams.get("offset"), 10) || 0;

	logger.debug("Business search with parameters:", { query, location, category, rating, priceRange, limit, offset });

	try {
		// Fetch data from Supabase using server-side data fetcher
		const searchResults = await BusinessDataFetchers.searchBusinesses({
			query: query || undefined,
			location: location || undefined,
			category: category || undefined,
			rating: rating || undefined,
			priceRange: priceRange || undefined,
			limit,
			offset,
		});

		// Check if search results are valid
		if (!searchResults || !searchResults.data || !searchResults.data.businesses) {
			logger.warn("Search results invalid or empty:", searchResults);
			return NextResponse.json(
				{
					businesses: [],
					metadata: {
						total: 0,
						hasMore: false,
						query,
						location,
						category,
						rating,
						priceRange,
						limit,
						offset,
						responseTime: `${(performance.now() - startTime).toFixed(2)}ms`,
						error: "No businesses found or invalid search results",
					},
				},
				{ status: 200 }
			);
		}

		// Transform results for client consumption
		const transformedBusinesses = searchResults.data.businesses.map((business) => ({
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
			rating: business.rating,
			reviewCount: business.review_count,
			categories: business.business_categories?.map((cat) => cat.category?.name) || [],
			price_range: business.price_range,
			featured: business.featured,
			verified: business.verified,
			photos: business.photos || [],
		}));

		const duration = performance.now() - startTime;
		logger.performance(`Business search API completed in ${duration.toFixed(2)}ms`);
		logger.debug(`Returned ${transformedBusinesses.length} businesses`);

		return NextResponse.json(
			{
				businesses: transformedBusinesses,
				metadata: {
					total: searchResults.data.total,
					hasMore: searchResults.data.hasMore,
					query,
					location,
					category,
					rating,
					priceRange,
					limit,
					offset,
					responseTime: `${duration.toFixed(2)}ms`,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		logger.error("Error in business search API:", error);
		return NextResponse.json({ error: "Failed to search businesses", message: error.message }, { status: 500 });
	}
}
