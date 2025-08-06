/**
 * Available Integration Features Data
 * Complete feature set extracted from business integrations dashboard
 * Following Next.js best practices from https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji
 */

// Import the complete features object
import { availableFeatures } from "./available-features-complete";

// Re-export the main features object
export { availableFeatures };

// Feature categories for filtering
export const featureCategories = [
	"All",
	"Content",
	"Business",
	"Social",
	"Tools",
	"Marketing",
	"Analytics",
	"Communication",
	"E-commerce",
	"Finance",
	"Productivity",
	"Entertainment",
	"Health",
	"Education",
	"Professional Services",
	"Industry Specific",
	"Trust",
	"Healthcare",
	"Real Estate",
	"Legal",
	"Automotive",
	"Food Service",
	"Fitness",
	"Construction",
	"Beauty",
	"Home Services",
	"Retail",
	"Hospitality",
	"Nonprofit",
	"Technology",
	"Creative",
	"Pet Care",
	"Logistics",
	"Branding",
	"Support",
	"Job Management",
	"Hiring",
	"Payroll",
	"Insurance",
	"Scheduling",
	"Quality",
	"Management",
];

// Industry types for filtering
export const industryTypes = ["All", "All Industries", "Restaurant", "Retail", "Healthcare", "Professional Services", "Entertainment", "Fitness", "Beauty & Wellness", "Automotive", "Real Estate", "Education", "Technology", "Manufacturing", "Construction", "Finance", "Legal", "Media", "Non-Profit", "Food Service", "Beauty", "Home Services", "Hospitality", "Nonprofit", "Creative Agencies", "Pet Care", "Logistics"];

// Helper functions for feature management
export const getFeaturesByCategory = (category) => {
	if (category === "All") return availableFeatures;

	return Object.fromEntries(Object.entries(availableFeatures).filter(([key, feature]) => feature.category === category));
};

export const getFeaturesByIndustry = (industry) => {
	if (industry === "All" || industry === "All Industries") return availableFeatures;

	return Object.fromEntries(Object.entries(availableFeatures).filter(([key, feature]) => feature.industry === industry || feature.industry === "All Industries" || !feature.industry));
};

export const getPopularFeatures = () => {
	return Object.fromEntries(Object.entries(availableFeatures).filter(([key, feature]) => feature.popular === true));
};

export const getPaidFeatures = () => {
	return Object.fromEntries(Object.entries(availableFeatures).filter(([key, feature]) => feature.isPaid === true));
};

export const getFreeFeatures = () => {
	return Object.fromEntries(Object.entries(availableFeatures).filter(([key, feature]) => !feature.isPaid));
};

export const searchFeatures = (searchTerm) => {
	if (!searchTerm) return availableFeatures;

	const term = searchTerm.toLowerCase();
	return Object.fromEntries(Object.entries(availableFeatures).filter(([key, feature]) => feature.title.toLowerCase().includes(term) || feature.description.toLowerCase().includes(term) || feature.category.toLowerCase().includes(term) || (feature.industry && feature.industry.toLowerCase().includes(term))));
};

export const getFeaturesByPriceRange = (minPrice = 0, maxPrice = Infinity) => {
	return Object.fromEntries(
		Object.entries(availableFeatures).filter(([key, feature]) => {
			if (!feature.isPaid) return minPrice === 0;
			const price = feature.monthlyPrice || 0;
			return price >= minPrice && price <= maxPrice;
		})
	);
};

export const calculateTotalCost = (enabledFeatures) => {
	let total = 0;
	let features = [];

	Object.entries(enabledFeatures).forEach(([key, isEnabled]) => {
		if (isEnabled && availableFeatures[key]?.isPaid) {
			const feature = availableFeatures[key];
			total += feature.monthlyPrice || 0;
			features.push({
				key,
				name: feature.title,
				price: feature.monthlyPrice,
				transactionFee: feature.transactionFee,
			});
		}
	});

	return { total, features };
};

export const getRecommendedFeatures = (industry, businessSize = "small") => {
	// Get industry-specific features
	let recommended = getFeaturesByIndustry(industry);

	// Add popular features
	const popular = getPopularFeatures();
	recommended = { ...recommended, ...popular };

	// Filter by business size (small businesses might prefer free/low-cost features)
	if (businessSize === "small") {
		const affordable = getFeaturesByPriceRange(0, 25);
		recommended = Object.fromEntries(Object.entries(recommended).filter(([key]) => affordable[key] !== undefined));
	}

	return recommended;
};

export const getIntegrationsForProvider = (provider) => {
	return Object.fromEntries(Object.entries(availableFeatures).filter(([key, feature]) => feature.apiIntegration === provider));
};

export const getFeatureStatistics = () => {
	const total = Object.keys(availableFeatures).length;
	const paid = Object.values(availableFeatures).filter((f) => f.isPaid).length;
	const popular = Object.values(availableFeatures).filter((f) => f.popular).length;
	const categories = [...new Set(Object.values(availableFeatures).map((f) => f.category))].length;
	const industries = [
		...new Set(
			Object.values(availableFeatures)
				.map((f) => f.industry)
				.filter(Boolean)
		),
	].length;

	return {
		total,
		free: total - paid,
		paid,
		popular,
		categories,
		industries,
	};
};
