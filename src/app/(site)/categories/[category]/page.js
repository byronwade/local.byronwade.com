import React from "react";
import { notFound } from "next/navigation";
import { BusinessDataFetchers } from "@lib/supabase/server";
import CategoryPage from "@components/site/categories/CategoryPage";

// Force dynamic rendering to prevent build hanging
export const dynamic = "force-dynamic";

// Define valid categories and locations
const BUSINESS_CATEGORIES = {
	restaurants: "Restaurants",
	"health-medical": "Health & Medical",
	"home-services": "Home Services",
	"beauty-spas": "Beauty & Spas",
	automotive: "Automotive",
	shopping: "Shopping",
	"professional-services": "Professional Services",
	entertainment: "Entertainment",
	"fitness-recreation": "Fitness & Recreation",
	education: "Education",
	plumbing: "Home Services",
	electrician: "Home Services",
	dentist: "Health & Medical",
	"hair-salon": "Beauty & Spas",
	"auto-repair": "Automotive",
};

const LOCATION_SLUGS = {
	"new-york": { name: "New York", state: "NY", lat: 40.7128, lng: -74.006 },
	"los-angeles": { name: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
	chicago: { name: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298 },
	houston: { name: "Houston", state: "TX", lat: 29.7604, lng: -95.3698 },
	phoenix: { name: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.074 },
	philadelphia: { name: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652 },
	"san-antonio": { name: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936 },
	"san-diego": { name: "San Diego", state: "CA", lat: 32.7157, lng: -117.1611 },
	dallas: { name: "Dallas", state: "TX", lat: 32.7767, lng: -96.797 },
	"san-jose": { name: "San Jose", state: "CA", lat: 37.3382, lng: -121.8863 },
	austin: { name: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
	seattle: { name: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
	denver: { name: "Denver", state: "CO", lat: 39.7392, lng: -104.9903 },
	boston: { name: "Boston", state: "MA", lat: 42.3601, lng: -71.0589 },
	"san-francisco": { name: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194 },
	"santa-cruz": { name: "Santa Cruz", state: "CA", lat: 36.9741, lng: -122.0308 },
	monterey: { name: "Monterey", state: "CA", lat: 36.6002, lng: -121.8947 },
};

// Home service categories that require location
const HOME_SERVICE_CATEGORIES = ["plumbing", "electrician", "hvac", "landscaping", "house-cleaning", "handyman", "roofing", "painter", "carpet-cleaning", "pest-control", "locksmith", "moving", "home-services"];

// Category-specific image mappings for better visual consistency
const CATEGORY_IMAGE_MAPPINGS = {
	Restaurants: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400&h=300&fit=crop"],
	"Health & Medical": ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop"],
	"Home Services": ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop"],
	"Beauty & Spas": ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&h=300&fit=crop"],
	Automotive: ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop"],
	Shopping: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1555529902-84c2034b8e9c?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop"],
	"Professional Services": ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop"],
	Entertainment: ["https://images.unsplash.com/photo-1489599187715-31f2e8cec64c?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"],
};

// Enhanced business data mapper for real Supabase data
const enhanceBusinessData = (business, category, index) => {
	const categoryName = BUSINESS_CATEGORIES[category] || business.business_categories?.[0]?.category?.name || "Professional Services";
	const imageOptions = CATEGORY_IMAGE_MAPPINGS[categoryName] || CATEGORY_IMAGE_MAPPINGS["Professional Services"];
	const imageIndex = index % imageOptions.length;

	return {
		...business,
		// Ensure consistent image (use business photos if available, otherwise fallback)
		image: business.business_photos?.[0]?.url || business.photos?.[0] || imageOptions[imageIndex],
		// Ensure proper category mapping
		category: categoryName,
		categories: business.business_categories?.map((bc) => bc.category.name) || [categoryName],
		// Ensure location is properly formatted
		location: `${business.city}, ${business.state}`,
		// Ensure price is formatted
		price: business.price_range || "$$",
		// Ensure rating is formatted
		rating: business.rating?.toFixed(1) || "4.5",
		reviewCount: business.review_count || 0,
		// Ensure status (TODO: calculate based on hours)
		status: "Open", // Default for now
		// Add fields expected by CategoryPage component
		slug: business.slug,
		name: business.name,
		description: business.description,
		address: business.address,
		phone: business.phone,
		website: business.website,
		verified: business.verified,
	};
};

// Server-side data fetching functions
async function getCategoryBusinesses(category) {
	// Map category slug to search parameters
	let searchParams = {};

	if (BUSINESS_CATEGORIES[category]) {
		// It's a category search
		const categoryName = BUSINESS_CATEGORIES[category];

		// Handle specific category mappings
		if (category === "plumbing") {
			searchParams.query = "plumber";
		} else if (category === "electrician") {
			searchParams.query = "electrician";
		} else if (category === "dentist") {
			searchParams.query = "dentist";
		} else if (category === "hair-salon") {
			searchParams.query = "hair salon";
		} else if (category === "auto-repair") {
			searchParams.query = "auto repair";
		} else {
			// Use the category slug directly for search
			searchParams.category = category;
		}
	}

	const { data: searchResults, error } = await BusinessDataFetchers.searchBusinesses({
		...searchParams,
		limit: 100,
	});

	if (error) {
		console.error(`Failed to fetch businesses for category ${category}:`, error);
		return [];
	}

	return searchResults?.businesses || [];
}

async function getLocationBusinesses(locationSlug) {
	const location = LOCATION_SLUGS[locationSlug];
	if (!location) return [];

	const { data: searchResults, error } = await BusinessDataFetchers.searchBusinesses({
		location: location.name,
		limit: 100,
	});

	if (error) {
		console.error(`Failed to fetch businesses for location ${locationSlug}:`, error);
		return [];
	}

	return searchResults?.businesses || [];
}

export async function generateStaticParams() {
	// Generate params for categories
	const categoryParams = Object.keys(BUSINESS_CATEGORIES).map((category) => ({
		category,
	}));

	// Generate params for locations
	const locationParams = Object.keys(LOCATION_SLUGS).map((location) => ({
		category: location,
	}));

	return [...categoryParams, ...locationParams];
}

export async function generateMetadata({ params }) {
	const { category } = await params;

	// Check if it's a location
	if (LOCATION_SLUGS[category]) {
		const location = LOCATION_SLUGS[category];
		return {
			title: `Local Businesses in ${location.name}, ${location.state} | Thorbis`,
			description: `Discover top-rated local businesses in ${location.name}, ${location.state}. Find restaurants, services, and more with verified reviews.`,
			keywords: [`businesses in ${location.name}`, `local services ${location.state}`, "business directory", "reviews"],
			openGraph: {
				title: `Local Businesses in ${location.name}, ${location.state}`,
				description: `Discover top-rated local businesses in ${location.name}, ${location.state}. Find restaurants, services, and more with verified reviews.`,
				url: `https://www.thorbis.com/categories/${category}`,
			},
		};
	}

	// Check if it's a category
	if (BUSINESS_CATEGORIES[category]) {
		const categoryName = BUSINESS_CATEGORIES[category];
		const isHomeService = HOME_SERVICE_CATEGORIES.includes(category);

		return {
			title: `${categoryName} Near You | Thorbis`,
			description: `Find the best ${categoryName.toLowerCase()} ${isHomeService ? "in your area" : "near you"}. Read reviews, compare prices, and book services instantly.`,
			keywords: [categoryName, `${categoryName} services`, "local businesses", "reviews"],
			openGraph: {
				title: `${categoryName} Near You`,
				description: `Find the best ${categoryName.toLowerCase()} ${isHomeService ? "in your area" : "near you"}. Read reviews, compare prices, and book services instantly.`,
				url: `https://www.thorbis.com/categories/${category}`,
			},
		};
	}

	return {
		title: "Category Not Found | Thorbis",
		description: "The requested category or location could not be found.",
	};
}

export default async function CategoryRoute({ params }) {
	const { category } = await params;
	let jsonLd = {};

	// Check if it's a location
	if (LOCATION_SLUGS[category]) {
		const location = LOCATION_SLUGS[category];
		const businesses = await getLocationBusinesses(category);
		const locationBusinesses = businesses.map((business, index) => enhanceBusinessData(business, null, index));

		jsonLd = {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: `Local Businesses in ${location.name}, ${location.state}`,
			description: `Discover top-rated local businesses in ${location.name}, ${location.state}. Find restaurants, services, and more with verified reviews.`,
			mainEntity: {
				"@type": "ItemList",
				name: `Businesses in ${location.name}`,
				numberOfItems: locationBusinesses.length,
				itemListElement: locationBusinesses.slice(0, 20).map((business, index) => ({
					"@type": "ListItem",
					position: index + 1,
					item: {
						"@type": "LocalBusiness",
						"@id": `https://www.thorbis.com/biz/${business.slug}`,
						name: business.name,
						description: business.description,
						image: business.image,
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
					},
				})),
			},
		};

		return (
			<>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
				<CategoryPage type="location" title={`Local Businesses in ${location.name}, ${location.state}`} subtitle={`Discover top-rated businesses and services in ${location.name}`} businesses={locationBusinesses} category={null} location={location} requiresLocation={false} />
			</>
		);
	}

	// Check if it's a category
	if (BUSINESS_CATEGORIES[category]) {
		const categoryName = BUSINESS_CATEGORIES[category];
		const isHomeService = HOME_SERVICE_CATEGORIES.includes(category);

		const businesses = await getCategoryBusinesses(category);
		const categoryBusinesses = businesses.map((business, index) => enhanceBusinessData(business, category, index));

		jsonLd = {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: `${categoryName} Near You`,
			description: `Find the best ${categoryName.toLowerCase()} ${isHomeService ? "in your area" : "near you"}. Read reviews, compare prices, and book services instantly.`,
			mainEntity: {
				"@type": "ItemList",
				name: `Top ${categoryName}`,
				numberOfItems: categoryBusinesses.length,
				itemListElement: categoryBusinesses.slice(0, 20).map((business, index) => ({
					"@type": "ListItem",
					position: index + 1,
					item: {
						"@type": "LocalBusiness",
						"@id": `https://www.thorbis.com/biz/${business.slug}`,
						name: business.name,
						description: business.description,
						image: business.image,
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
					},
				})),
			},
		};

		return (
			<>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
				<CategoryPage type="category" title={`${categoryName} Near You`} subtitle={`Find trusted ${categoryName.toLowerCase()} with verified reviews and instant booking`} businesses={categoryBusinesses} category={categoryName} location={null} requiresLocation={isHomeService} />
			</>
		);
	}

	// Category/location not found
	console.log("Category or location not found:", category);
	notFound();
}
