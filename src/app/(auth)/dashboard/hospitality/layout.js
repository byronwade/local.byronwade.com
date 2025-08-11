import { isEnabled } from "@lib/flags/server";

/**
 * Hospitality Dashboard Layout
 * Simple layout that lets IndustryDashboardLayout handle the navigation and header
 */
export default async function HospitalityLayout({ children }) {
	const on = await isEnabled("dashboardCore");
	if (!on) {
		return (
			<div className="container mx-auto px-4 py-16">
				<h1 className="text-2xl font-semibold">Dashboard is not available</h1>
				<p className="text-muted-foreground mt-2">Please check back soon.</p>
			</div>
		);
	}

	// Simple wrapper - the IndustryDashboardLayout handles all the navigation and header
	return (
		<div id="hospitality-root" className="min-h-screen">
			{children}
		</div>
	);
}
