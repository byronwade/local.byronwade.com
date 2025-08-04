/**
 * Dynamic Subdomain Layout
 * Handles all subdomain routing (e.g., santacruz.localhub.com, raleigh.localhub.com)
 * Following Next.js dynamic routing patterns from internationalization docs
 */

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import SubdomainLayout from "../../../shared/components/subdomain/SubdomainLayout";
import { generateSubdomainMetadata } from "@lib/utils/subdomainSeo";

// Force dynamic rendering to prevent build hanging
export const dynamic = "force-dynamic";

/**
 * Generate metadata for subdomain pages
 */
export async function generateMetadata({ params }) {
	const { subdomain } = await params;

	try {
		// Get base URL with fallback for build time
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
		const apiUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

		// Fetch subdomain data from API
		const response = await fetch(`${apiUrl}/api/v2/subdomains/${subdomain}`, {
			next: { revalidate: 300 }, // Cache for 5 minutes
		});

		if (!response.ok) {
			return {
				title: "Subdomain Not Found",
				description: "The requested local hub could not be found.",
			};
		}

		const result = await response.json();
		if (!result.success) {
			return {
				title: "Subdomain Not Found",
				description: "The requested local hub could not be found.",
			};
		}

		// Generate comprehensive SEO metadata
		return generateSubdomainMetadata(result.data.localHub, "home");
	} catch (error) {
		console.error("Error generating subdomain metadata:", error);
		return {
			title: "Local Business Directory",
			description: "Discover local businesses in your area.",
		};
	}
}

/**
 * Subdomain Layout Component
 * Provides layout and context for all subdomain pages
 */
export default async function Layout({ children, params }) {
	const { subdomain } = await params;

	// Validate subdomain format
	if (!subdomain || typeof subdomain !== "string" || subdomain.length < 3) {
		notFound();
	}

	try {
		// Fetch subdomain data
		const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v2/subdomains/${subdomain}`, {
			next: { revalidate: 300 }, // Cache for 5 minutes
		});

		if (!response.ok) {
			console.error(`Subdomain API error: ${response.status}`);
			notFound();
		}

		const result = await response.json();
		if (!result.success || !result.data.localHub) {
			console.error("Invalid subdomain response:", result);
			notFound();
		}

		const localHub = result.data.localHub;

		// Check if subdomain is active
		if (localHub.status !== "active") {
			notFound();
		}

		return <SubdomainLayout localHub={localHub}>{children}</SubdomainLayout>;
	} catch (error) {
		console.error("Error fetching subdomain data:", error);
		notFound();
	}
}
