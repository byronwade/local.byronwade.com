import React from "react";
import { notFound } from "next/navigation";
import { generateBusinesses, generateBusinessesInBounds } from "@lib/businessDataGenerator";
import CategoryPage from "@components/site/categories/CategoryPage";

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

// Enhanced business data mapper
const enhanceBusinessData = (business, category, index) => {
	const categoryName = BUSINESS_CATEGORIES[category] || business.categories?.[0] || "Professional Services";
	const imageOptions = CATEGORY_IMAGE_MAPPINGS[categoryName] || CATEGORY_IMAGE_MAPPINGS["Professional Services"];
	const imageIndex = index % imageOptions.length;

	return {
		...business,
		// Ensure consistent image
		image: business.photos?.[0] || business.logo || imageOptions[imageIndex],
		// Ensure proper category mapping
		category: categoryName,
		categories: business.categories || [categoryName],
		// Ensure location is properly formatted
		location: business.address?.split(",").slice(-2).join(",").trim() || "Local Area",
		// Ensure price is formatted
		price: business.priceLevel || business.price || "$$",
		// Ensure rating is formatted
		rating: business.ratings?.overall?.toFixed(1) || "4.5",
		reviewCount: business.reviewCount || Math.floor(Math.random() * 200) + 10,
		// Ensure status
		status: business.isOpenNow ? "Open" : "Closed",
	};
};

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
	const { category } = params;

	// Check if it's a location
	if (LOCATION_SLUGS[category]) {
		const location = LOCATION_SLUGS[category];
		return {
			title: `Local Businesses in ${location.name}, ${location.state} | Thorbis`,
			description: `Discover top-rated local businesses in ${location.name}, ${location.state}. Find restaurants, services, and more with verified reviews.`,
			keywords: [`businesses in ${location.name}`, `local services ${location.state}`, "business directory", "reviews"],
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
		};
	}

	return {
		title: "Category Not Found | Thorbis",
		description: "The requested category or location could not be found.",
	};
}

export default function CategoryRoute({ params }) {
	const { category } = params;

	// Check if it's a location
	if (LOCATION_SLUGS[category]) {
		const location = LOCATION_SLUGS[category];
		const allBusinesses = generateBusinesses(200);
		const locationBusinesses = allBusinesses
			.filter((business) => {
				const businessCity = business.address?.split(",")[1]?.trim().toLowerCase();
				return businessCity === location.name.toLowerCase();
			})
			.map((business, index) => enhanceBusinessData(business, null, index));

		return <CategoryPage type="location" title={`Local Businesses in ${location.name}, ${location.state}`} subtitle={`Discover top-rated businesses and services in ${location.name}`} businesses={locationBusinesses} category={null} location={location} requiresLocation={false} />;
	}

	// Check if it's a category
	if (BUSINESS_CATEGORIES[category]) {
		const categoryName = BUSINESS_CATEGORIES[category];
		const isHomeService = HOME_SERVICE_CATEGORIES.includes(category);

		const allBusinesses = generateBusinesses(200);
		const categoryBusinesses = allBusinesses
			.filter((business) => {
				if (category === "plumbing") {
					return business.categories.some((cat) => cat.toLowerCase().includes("plumber"));
				}
				if (category === "electrician") {
					return business.categories.some((cat) => cat.toLowerCase().includes("electrician"));
				}
				if (category === "dentist") {
					return business.categories.some((cat) => cat.toLowerCase().includes("dentist"));
				}
				if (category === "hair-salon") {
					return business.categories.some((cat) => cat.toLowerCase().includes("salon") || cat.toLowerCase().includes("hair"));
				}
				if (category === "auto-repair") {
					return business.categories.some((cat) => cat.toLowerCase().includes("auto") || cat.toLowerCase().includes("repair"));
				}
				return business.categories.includes(categoryName) || business.categories.some((cat) => cat.toLowerCase().includes(category));
			})
			.map((business, index) => enhanceBusinessData(business, category, index));

		return <CategoryPage type="category" title={`${categoryName} Near You`} subtitle={`Find trusted ${categoryName.toLowerCase()} with verified reviews and instant booking`} businesses={categoryBusinesses} category={categoryName} location={null} requiresLocation={isHomeService} />;
	}

	// Category/location not found
	notFound();
}
