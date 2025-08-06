import React from "react";
import Script from "next/script";
import SearchContainer from "@components/site/map/SearchContainer";
import { BusinessDataFetchers } from "@lib/supabase/server";
import "mapbox-gl/dist/mapbox-gl.css";

export const metadata = {
	metadataBase: new URL("https://www.thorbis.com/"),
	title: {
		default: "Search Local Businesses - Interactive Map | Thorbis",
		template: "%s | Thorbis",
	},
	description: "Search and discover local businesses on our interactive map. Find restaurants, services, and businesses near you with real-time results and verified reviews.",
	generator: "Next.js",
	applicationName: "Thorbis",
	keywords: ["Business Directory", "Local Business Search", "Interactive Map", "Find Businesses", "Business Reviews", "Business Listings", "Map Search"],
	authors: [{ name: "Byron Wade" }, { name: "Byron Wade", url: "https://www.thorbis.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	robots: "index, follow",
	alternates: {
		canonical: "https://www.thorbis.com/search",
		languages: {
			"en-US": "https://www.thorbis.com/en-US/search",
			"es-ES": "https://www.thorbis.com/es-ES/search",
		},
	},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "directory",
	bookmarks: ["https://www.thorbis.com/search"],
	twitter: {
		card: "summary_large_image",
		title: "Search Local Businesses - Interactive Map | Thorbis",
		description: "Search and discover local businesses on our interactive map. Find restaurants, services, and businesses near you with real-time results.",
		creator: "@thorbis",
		images: {
			url: "https://www.thorbis.com/_next/image?url=%2Flogos%2FThorbisLogo.webp&w=96&q=75",
			alt: "Thorbis Social Logo",
		},
	},
	openGraph: {
		title: "Search Local Businesses - Interactive Map | Thorbis",
		description: "Search and discover local businesses on our interactive map. Find restaurants, services, and businesses near you with real-time results and verified reviews.",
		url: "https://www.thorbis.com/search",
		siteName: "Thorbis",
		images: [
			{
				url: "https://www.thorbis.com/api/og?title=Search%20Local%20Businesses%20-%20Interactive%20Map&description=Find%20and%20discover%20businesses%20near%20you",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.thorbis.com/api/og?title=Search%20Local%20Businesses%20-%20Interactive%20Map&description=Find%20and%20discover%20businesses%20near%20you",
				width: 1800,
				height: 1600,
				alt: "Thorbis Interactive Map",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "SearchResultsPage",
	name: "Thorbis Business Search",
	description: "Search and discover local businesses on our interactive map. Find restaurants, services, and businesses near you with real-time results and verified reviews.",
	url: "https://www.thorbis.com/search",
	logo: "https://www.thorbis.com/_next/image?url=%2Flogos%2FThorbisLogo.webp&w=96&q=75",
	image: "https://www.thorbis.com/api/og?title=Search%20Local%20Businesses%20-%20Interactive%20Map&description=Find%20and%20discover%20businesses%20near%20you",
	sameAs: ["https://www.facebook.com/thorbis", "https://www.instagram.com/thorbis/?hl=en"],
	potentialAction: {
		"@type": "SearchAction",
		target: "https://www.thorbis.com/search?q={search_term_string}",
		"query-input": "required name=search_term_string",
	},
	mainEntity: {
		"@type": "Map",
		name: "Interactive Business Search Map",
		description: "Interactive map for searching and discovering local businesses",
	},
};

// Server-side search data fetching
async function getSearchData(searchParams) {
	const params = {
		query: searchParams.q || "",
		location: searchParams.location || "",
		category: searchParams.category || "",
		rating: searchParams.rating ? parseFloat(searchParams.rating) : undefined,
		priceRange: searchParams.price || "",
		limit: parseInt(searchParams.limit || "50"),
		offset: parseInt(searchParams.offset || "0"),
	};

	// If no search parameters, get general business listing
	if (!params.query && !params.location && !params.category) {
		// Get a general set of featured/top businesses
		const { data: businesses, error } = await BusinessDataFetchers.searchBusinesses({
			limit: 50,
			offset: 0,
		});

		if (error) {
			console.error("Failed to fetch general business listing:", error);
			return { businesses: [], total: 0, hasMore: false };
		}

		return {
			businesses: businesses?.businesses || [],
			total: businesses?.total || 0,
			hasMore: businesses?.hasMore || false,
		};
	}

	// Perform search with filters
	const { data: searchResults, error } = await BusinessDataFetchers.searchBusinesses(params);

	if (error) {
		console.error("Failed to search businesses:", error);
		return { businesses: [], total: 0, hasMore: false };
	}

	return {
		businesses: searchResults?.businesses || [],
		total: searchResults?.total || 0,
		hasMore: searchResults?.hasMore || false,
	};
}

// Transform business data for the map component
function transformBusinessForMap(business) {
	return {
		id: business.id,
		name: business.name,
		slug: business.slug,
		description: business.description,
		address: business.address,
		city: business.city,
		state: business.state,
		latitude: business.latitude,
		longitude: business.longitude,
		phone: business.phone,
		website: business.website,
		rating: business.rating || 0,
		reviewCount: business.review_count || 0,
		priceRange: business.price_range || "$$",
		verified: business.verified,
		photos: business.photos || [],
		categories:
			business.business_categories?.map((bc) => ({
				name: bc.category.name,
				slug: bc.category.slug,
				icon: bc.category.icon,
			})) || [],
		// Add fields expected by the map component
		isOpenNow: true, // TODO: Calculate based on hours
		distance: null, // TODO: Calculate if user location available
		businessType: business.business_categories?.[0]?.category?.name || "Business",
	};
}

export default async function Search({ searchParams }) {
	const awaitedSearchParams = await searchParams;

	// Fetch search data on the server
	const searchData = await getSearchData(awaitedSearchParams);

	// Transform businesses for the map component
	const transformedBusinesses = searchData.businesses.map(transformBusinessForMap);

	// Enhanced JSON-LD with actual search results
	const enhancedJsonLd = {
		...jsonLd,
		...(searchData.total > 0 && {
			numberOfItems: searchData.total,
			mainEntity: {
				...jsonLd.mainEntity,
				"@type": "ItemList",
				numberOfItems: searchData.total,
				itemListElement: transformedBusinesses.slice(0, 5).map((business, index) => ({
					"@type": "LocalBusiness",
					"@id": `https://www.thorbis.com/biz/${business.slug}`,
					position: index + 1,
					name: business.name,
					description: business.description,
					address: {
						"@type": "PostalAddress",
						streetAddress: business.address,
						addressLocality: business.city,
						addressRegion: business.state,
						addressCountry: "US",
					},
					telephone: business.phone,
					url: business.website,
					aggregateRating: business.rating
						? {
								"@type": "AggregateRating",
								ratingValue: business.rating,
								reviewCount: business.reviewCount,
								bestRating: 5,
								worstRating: 1,
							}
						: undefined,
					geo:
						business.latitude && business.longitude
							? {
									"@type": "GeoCoordinates",
									latitude: business.latitude,
									longitude: business.longitude,
								}
							: undefined,
				})),
			},
		}),
	};

	return (
		<>
			{/* Pass initial search data to the SearchContainer */}
			<SearchContainer
				searchParams={awaitedSearchParams}
				initialBusinesses={transformedBusinesses}
				searchMetadata={{
					total: searchData.total,
					hasMore: searchData.hasMore,
					query: awaitedSearchParams.q || "",
					location: awaitedSearchParams.location || "",
					category: awaitedSearchParams.category || "",
				}}
			/>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(enhancedJsonLd, null, "\t") }} />
		</>
	);
}
