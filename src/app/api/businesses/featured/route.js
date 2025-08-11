/**
 * Featured Businesses API Route (Plural Alias)
 * Alias for /api/business/featured to handle both singular and plural endpoints
 */

import { NextResponse } from "next/server";

// Import the existing featured business handler
import { GET as getFeaturedBusinesses } from "../../business/featured/route.js";

/**
 * GET /api/businesses/featured
 * Alias endpoint that forwards to the existing /api/business/featured route
 */
export async function GET(request) {
	try {
		// Forward the request to the existing handler
		return await getFeaturedBusinesses(request);
	} catch (error) {
		console.error("Error in businesses/featured alias:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch featured businesses",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
