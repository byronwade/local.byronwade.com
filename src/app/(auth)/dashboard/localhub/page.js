/**
 * LocalHub Dashboard Page
 * Now using the new modular LocalHubDashboardPage component
 * Reduced from 651 lines to clean implementation
 * Following Next.js best practices for component organization
 */

import LocalHubDashboardPage from "@components/dashboard/localhub/local-hub-dashboard-page";
import Script from "next/script";

export const metadata = {
	title: "LocalHub Dashboard • Thorbis",
	description: "Manage your LocalHub directory, businesses, revenue, analytics, and settings in one place.",
	robots: { index: false, follow: false },
	alternates: { canonical: "/dashboard/localhub" },
};

export default function Page() {
    const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: "LocalHub Dashboard",
		applicationCategory: "BusinessApplication",
		operatingSystem: "Web",
		url: "/dashboard/localhub",
		offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
	};

	return (
		<>
			<Script id="ld-json-localhub" type="application/ld+json">
				{JSON.stringify(jsonLd)}
			</Script>
			<LocalHubDashboardPage />
		</>
	);
}
