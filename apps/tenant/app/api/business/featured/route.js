import { NextResponse } from "next/server";
import { BusinessDataFetchers } from '@shared/lib/supabase/server";
import { logger } from '@shared/lib/utils/logger";

export async function GET(req) {
	const startTime = performance.now();

	logger.debug("Fetching featured businesses for home page");

	try {
		// Fetch data from Supabase using server-side data fetcher
		const homePageData = await BusinessDataFetchers.getHomePageBusinesses();

		if (!homePageData.data) {
			throw new Error("No data returned from BusinessDataFetchers");
		}

		// Transform results for client consumption
		const transformedBusinesses = homePageData.data.map((business) => ({
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
		logger.performance(`Featured businesses API completed in ${duration.toFixed(2)}ms`);
		logger.debug(`Returned ${transformedBusinesses.length} featured businesses`);

		return NextResponse.json(
			{
				businesses: transformedBusinesses,
				metadata: {
					total: transformedBusinesses.length,
					responseTime: `${duration.toFixed(2)}ms`,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		logger.error("Error in featured businesses API:", error);
		return NextResponse.json({ error: "Failed to fetch featured businesses", message: error.message }, { status: 500 });
	}
}
