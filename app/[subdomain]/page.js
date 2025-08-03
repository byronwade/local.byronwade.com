/**
 * Dynamic Subdomain Home Page
 * Main page for each subdomain (e.g., santacruz.localhub.com, raleigh.localhub.com)
 * Following Next.js dynamic routing patterns
 */

import { notFound } from "next/navigation";
import SubdomainHomePage from "@components/subdomain/SubdomainHomePage";
import { generateSubdomainMetadata, generateSubdomainStructuredData } from "@lib/utils/subdomainSeo";

// Force dynamic rendering to prevent build hanging
export const dynamic = "force-dynamic";

/**
 * Generate static params for known subdomains
 * This enables static generation for active subdomains
 */
export async function generateStaticParams() {
	// DISABLE static generation during build to prevent hanging
	// Pages will be generated dynamically at runtime
	console.warn("Static generation disabled for subdomain pages to prevent build hanging");
	return [];
}

/**
 * Generate metadata for subdomain home page
 */
export async function generateMetadata({ params }) {
	const { subdomain } = await params;

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v2/subdomains/${subdomain}`, {
			next: { revalidate: 300 },
		});

		if (!response.ok) {
			return {
				title: "Local Business Directory",
				description: "Discover local businesses in your area.",
			};
		}

		const result = await response.json();
		if (!result.success) {
			return {
				title: "Local Business Directory",
				description: "Discover local businesses in your area.",
			};
		}

		// Generate comprehensive SEO metadata for home page
		const metadata = generateSubdomainMetadata(result.data.localHub, "home");

		// Add structured data
		const structuredData = generateSubdomainStructuredData(result.data.localHub, "home");

		return {
			...metadata,
			other: {
				...metadata.other,
				// Add JSON-LD structured data
				"script:ld+json": JSON.stringify(structuredData),
			},
		};
	} catch (error) {
		console.error("Error generating subdomain home metadata:", error);
		return {
			title: "Local Business Directory",
			description: "Discover local businesses in your area.",
		};
	}
}

/**
 * Subdomain Home Page
 */
export default async function SubdomainPage({ params }) {
	const { subdomain } = await params;

	try {
		// Get base URL with fallback for build time
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
		const apiUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

		// Fetch subdomain data with businesses and analytics
		const [subdomainResponse, businessesResponse] = await Promise.all([
			fetch(`${apiUrl}/api/v2/subdomains/${subdomain}`, {
				next: { revalidate: 300 },
			}),
			fetch(`${apiUrl}/api/v2/subdomains/${subdomain}/businesses?featured=true&limit=12`, {
				next: { revalidate: 600 }, // Cache businesses for 10 minutes
			}),
		]);

		if (!subdomainResponse.ok) {
			notFound();
		}

		const subdomainResult = await subdomainResponse.json();
		if (!subdomainResult.success) {
			notFound();
		}

		const localHub = subdomainResult.data.localHub;

		// Get businesses data
		let featuredBusinesses = [];
		if (businessesResponse.ok) {
			const businessesResult = await businessesResponse.json();
			if (businessesResult.success) {
				featuredBusinesses = businessesResult.data.businesses || [];
			}
		}

		// Pass data to client component
		return <SubdomainHomePage localHub={localHub} featuredBusinesses={featuredBusinesses} />;
	} catch (error) {
		console.error("Error loading subdomain page:", error);
		notFound();
	}
}
