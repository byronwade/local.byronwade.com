/**
 * Available Integration Features Data
 * Extracted from business integrations dashboard for better organization
 * Following Next.js best practices from https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji
 */

// Available profile features that customers can see
export const availableFeatures = {
	// Core Business Features
	menu: {
		icon: "🍽️",
		title: "Menu",
		description: "Display your menu, services, or product catalog",
		category: "Content",
		popular: true,
		settings: {
			title: "Menu Title",
			description: "Brief description of your offerings",
			showPrices: true,
			showCategories: true,
			showImages: false,
		},
	},
	gallery: {
		icon: "📸",
		title: "Photo Gallery",
		description: "Showcase your work, products, or business photos",
		category: "Content",
		popular: false,
		settings: {
			title: "Gallery Title",
			description: "What this gallery showcases",
			layout: "Grid",
			showCaptions: true,
			maxPhotos: 12,
		},
	},
	reviews: {
		icon: "⭐",
		title: "Customer Reviews",
		description: "Display customer testimonials and ratings",
		category: "Social",
		popular: true,
		settings: {
			title: "Reviews",
			showRating: true,
			showDate: true,
			showResponse: true,
			maxReviews: 10,
		},
	},
	services: {
		icon: "🔧",
		title: "Services",
		description: "List your services with descriptions and pricing",
		category: "Business",
		popular: true,
		settings: {
			title: "Our Services",
			showPricing: true,
			showDuration: false,
			showCategories: true,
		},
	},
	hours: {
		icon: "🕒",
		title: "Business Hours",
		description: "Show when you're open and available",
		category: "Business",
		popular: false,
		settings: {
			title: "Hours of Operation",
			showToday: true,
			showHolidays: false,
			showSpecialHours: true,
		},
	},
	contact: {
		icon: "📞",
		title: "Contact Info",
		description: "Display phone, email, and contact methods",
		category: "Business",
		popular: true,
		settings: {
			title: "Get in Touch",
			showPhone: true,
			showEmail: true,
			showAddress: true,
			showSocial: false,
		},
	},
	about: {
		icon: "ℹ️",
		title: "About Us",
		description: "Tell your story and share your background",
		category: "Content",
		popular: false,
		settings: {
			title: "About Us",
			showTeam: false,
			showHistory: true,
			showMission: true,
		},
	},
	faq: {
		icon: "❓",
		title: "FAQ",
		description: "Answer common customer questions",
		category: "Content",
		popular: false,
		settings: {
			title: "Frequently Asked Questions",
			showCategories: false,
			expandable: true,
		},
	},
	booking: {
		icon: "📅",
		title: "Online Booking",
		description: "Let customers book appointments online",
		category: "Tools",
		popular: true,
		isPaid: true,
		apiIntegration: "Calendly",
		monthlyPrice: 19,
		settings: {
			title: "Book Appointment",
			showCalendar: true,
			showServices: true,
			requireDeposit: false,
		},
	},
	location: {
		icon: "📍",
		title: "Location & Map",
		description: "Show your location and service areas",
		category: "Business",
		popular: false,
		settings: {
			title: "Find Us",
			showMap: true,
			showDirections: true,
			showServiceArea: false,
		},
	},
	// All features have been moved to the complete file
};

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
	"Industry Specific"
];

// Industry types for filtering
export const industryTypes = [
	"All",
	"Restaurant",
	"Retail",
	"Healthcare",
	"Professional Services", 
	"Entertainment",
	"Fitness",
	"Beauty & Wellness",
	"Automotive",
	"Real Estate",
	"Education",
	"Technology",
	"Manufacturing",
	"Construction",
	"Finance",
	"Legal",
	"Media",
	"Non-Profit"
];

// Helper functions for feature management
export const getFeaturesByCategory = (category) => {
	if (category === "All") return availableFeatures;
	
	return Object.fromEntries(
		Object.entries(availableFeatures).filter(([key, feature]) => 
			feature.category === category
		)
	);
};

export const getPopularFeatures = () => {
	return Object.fromEntries(
		Object.entries(availableFeatures).filter(([key, feature]) => 
			feature.popular === true
		)
	);
};

export const getPaidFeatures = () => {
	return Object.fromEntries(
		Object.entries(availableFeatures).filter(([key, feature]) => 
			feature.isPaid === true
		)
	);
};

export const searchFeatures = (searchTerm) => {
	const term = searchTerm.toLowerCase();
	return Object.fromEntries(
		Object.entries(availableFeatures).filter(([key, feature]) => 
			feature.title.toLowerCase().includes(term) ||
			feature.description.toLowerCase().includes(term) ||
			feature.category.toLowerCase().includes(term)
		)
	);
};