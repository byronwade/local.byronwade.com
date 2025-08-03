import { NextResponse } from "next/server";
import { BusinessDataFetchers } from "@lib/supabase/server";
import { logger } from "@lib/utils/logger";

export async function GET(req) {
	const startTime = performance.now();
	const url = new URL(req.url);

	// Parse search parameters
	const zoom = parseInt(url.searchParams.get("zoom"), 10);
	const north = parseFloat(url.searchParams.get("north"));
	const south = parseFloat(url.searchParams.get("south"));
	const east = parseFloat(url.searchParams.get("east"));
	const west = parseFloat(url.searchParams.get("west"));
	const query = url.searchParams.get("query") || "";

	logger.debug("Fetching businesses with parameters:", { zoom, north, south, east, west, query });

	// Validate bounds
	if (isNaN(north) || isNaN(south) || isNaN(east) || isNaN(west)) {
		return NextResponse.json({ error: "Invalid bounding box parameters" }, { status: 400 });
	}

	try {
		// Fetch data from Supabase with optimized search
		const searchResults = await BusinessDataFetchers.searchBusinesses({
			query: query || undefined,
			limit: 1000, // Allow larger result sets for map display
		});

		// Check if search results are valid
		if (!searchResults || !searchResults.data || !searchResults.data.businesses) {
			logger.warn("Search results invalid or empty:", searchResults);
			return NextResponse.json(
				{
					businesses: [],
					metadata: {
						total: 0,
						query,
						bounds: { north, south, east, west },
						responseTime: `${(performance.now() - startTime).toFixed(2)}ms`,
						error: "No businesses found or invalid search results",
					},
				},
				{ status: 200 }
			);
		}

		// Transform and filter businesses based on bounding box
		const transformedBusinesses = searchResults.data.businesses.map((business) => ({
			id: business.id,
			name: business.name,
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
			categories: business.categories?.map((cat) => cat.category?.name) || [],
			price_range: business.price_range,
			featured: business.featured,
			verified: business.verified,
			photos: business.photos || [],
		}));

		// Filter by bounding box
		const filteredBusinesses = transformedBusinesses.filter((business) => {
			const { lat, lng } = business.coordinates;
			if (lat === null || lng === null || lat === undefined || lng === undefined) {
				return false;
			}
			return lat >= south && lat <= north && lng >= west && lng <= east;
		});

		const duration = performance.now() - startTime;
		logger.performance(`Business search API completed in ${duration.toFixed(2)}ms`);
		logger.debug(`Returned ${filteredBusinesses.length} businesses within bounds`);

		return NextResponse.json(
			{
				businesses: filteredBusinesses,
				metadata: {
					total: filteredBusinesses.length,
					query,
					bounds: { north, south, east, west },
					responseTime: `${duration.toFixed(2)}ms`,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		logger.error("Error fetching businesses from Supabase:", error);
		return NextResponse.json({ error: "Failed to fetch businesses", message: error.message }, { status: 500 });
	}
}
