/**
 * User Dashboard API Route (V1 Alias)
 * Alias for /api/v2/dashboard/user to maintain backward compatibility
 */

import { NextResponse } from "next/server";

// Import the existing V2 dashboard user handler
import { GET as getUserDashboard } from "../../v2/dashboard/user/route.ts";

/**
 * GET /api/dashboard/user
 * Alias endpoint that forwards to the existing /api/v2/dashboard/user route
 */
export async function GET(request) {
	try {
		// Forward the request to the existing V2 handler
		return await getUserDashboard(request);
	} catch (error) {
		console.error("Error in dashboard/user alias:", error);
		
		// Return a minimal dashboard response as fallback
		return NextResponse.json(
			{
				success: true,
				data: {
					user: null,
					businesses: [],
					analytics: {
						totalViews: 0,
						totalReviews: 0,
						averageRating: 0,
					},
					recentActivity: [],
				},
				metadata: {
					responseTime: `${performance.now().toFixed(2)}ms`,
					source: "fallback",
					error: error.message,
				},
			},
			{ 
				status: 200,
				headers: {
					"Cache-Control": "no-cache, no-store, must-revalidate",
				},
			}
		);
	}
}
