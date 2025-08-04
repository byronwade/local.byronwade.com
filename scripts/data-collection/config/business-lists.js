// Business Lists Configuration
// Curated lists of top businesses to prioritize for data collection

/**
 * Fortune 500 Companies - Top priority businesses for detailed data collection
 * These companies will receive the most comprehensive data gathering
 */
export const FORTUNE_500_SAMPLE = [
	// Technology & Software
	{ name: "Apple", industry: "Technology", hq_city: "Cupertino", hq_state: "CA", revenue_billions: 394.3 },
	{ name: "Microsoft", industry: "Technology", hq_city: "Redmond", hq_state: "WA", revenue_billions: 211.9 },
	{ name: "Amazon", industry: "Technology", hq_city: "Seattle", hq_state: "WA", revenue_billions: 513.9 },
	{ name: "Google (Alphabet)", industry: "Technology", hq_city: "Mountain View", hq_state: "CA", revenue_billions: 307.4 },
	{ name: "Meta (Facebook)", industry: "Technology", hq_city: "Menlo Park", hq_state: "CA", revenue_billions: 134.9 },
	{ name: "Tesla", industry: "Automotive", hq_city: "Austin", hq_state: "TX", revenue_billions: 96.8 },
	{ name: "Netflix", industry: "Technology", hq_city: "Los Gatos", hq_state: "CA", revenue_billions: 31.6 },
	{ name: "NVIDIA", industry: "Technology", hq_city: "Santa Clara", hq_state: "CA", revenue_billions: 79.8 },
	{ name: "Intel", industry: "Technology", hq_city: "Santa Clara", hq_state: "CA", revenue_billions: 76.0 },
	{ name: "IBM", industry: "Technology", hq_city: "Armonk", hq_state: "NY", revenue_billions: 60.5 },

	// Retail & E-commerce
	{ name: "Walmart", industry: "Retail", hq_city: "Bentonville", hq_state: "AR", revenue_billions: 611.3 },
	{ name: "Costco", industry: "Retail", hq_city: "Issaquah", hq_state: "WA", revenue_billions: 242.3 },
	{ name: "Home Depot", industry: "Retail", hq_city: "Atlanta", hq_state: "GA", revenue_billions: 157.4 },
	{ name: "Target", industry: "Retail", hq_city: "Minneapolis", hq_state: "MN", revenue_billions: 109.1 },
	{ name: "Lowe's", industry: "Retail", hq_city: "Mooresville", hq_state: "NC", revenue_billions: 97.1 },
	{ name: "Best Buy", industry: "Retail", hq_city: "Richfield", hq_state: "MN", revenue_billions: 46.3 },
	{ name: "Macy's", industry: "Retail", hq_city: "New York", hq_state: "NY", revenue_billions: 23.1 },

	// Healthcare & Pharmaceuticals
	{ name: "UnitedHealth Group", industry: "Healthcare", hq_city: "Minnetonka", hq_state: "MN", revenue_billions: 324.2 },
	{ name: "Johnson & Johnson", industry: "Healthcare", hq_city: "New Brunswick", hq_state: "NJ", revenue_billions: 94.9 },
	{ name: "Pfizer", industry: "Healthcare", hq_city: "New York", hq_state: "NY", revenue_billions: 58.5 },
	{ name: "CVS Health", industry: "Healthcare", hq_city: "Woonsocket", hq_state: "RI", revenue_billions: 322.5 },
	{ name: "Anthem", industry: "Healthcare", hq_city: "Indianapolis", hq_state: "IN", revenue_billions: 138.6 },
	{ name: "Walgreens", industry: "Healthcare", hq_city: "Deerfield", hq_state: "IL", revenue_billions: 132.5 },

	// Financial Services
	{ name: "Berkshire Hathaway", industry: "Financial", hq_city: "Omaha", hq_state: "NE", revenue_billions: 302.1 },
	{ name: "JPMorgan Chase", industry: "Financial", hq_city: "New York", hq_state: "NY", revenue_billions: 158.1 },
	{ name: "Bank of America", industry: "Financial", hq_city: "Charlotte", hq_state: "NC", revenue_billions: 119.5 },
	{ name: "Wells Fargo", industry: "Financial", hq_city: "San Francisco", hq_state: "CA", revenue_billions: 78.5 },
	{ name: "Goldman Sachs", industry: "Financial", hq_city: "New York", hq_state: "NY", revenue_billions: 47.4 },
	{ name: "American Express", industry: "Financial", hq_city: "New York", hq_state: "NY", revenue_billions: 52.9 },

	// Energy & Utilities
	{ name: "ExxonMobil", industry: "Energy", hq_city: "Irving", hq_state: "TX", revenue_billions: 413.7 },
	{ name: "Chevron", industry: "Energy", hq_city: "San Ramon", hq_state: "CA", revenue_billions: 200.5 },
	{ name: "ConocoPhillips", industry: "Energy", hq_city: "Houston", hq_state: "TX", revenue_billions: 75.9 },

	// Aerospace & Defense
	{ name: "Boeing", industry: "Aerospace", hq_city: "Chicago", hq_state: "IL", revenue_billions: 66.6 },
	{ name: "Lockheed Martin", industry: "Aerospace", hq_city: "Bethesda", hq_state: "MD", revenue_billions: 67.0 },
	{ name: "General Dynamics", industry: "Aerospace", hq_city: "Reston", hq_state: "VA", revenue_billions: 39.4 },

	// Automotive
	{ name: "General Motors", industry: "Automotive", hq_city: "Detroit", hq_state: "MI", revenue_billions: 156.7 },
	{ name: "Ford", industry: "Automotive", hq_city: "Dearborn", hq_state: "MI", revenue_billions: 158.1 },
];

/**
 * Major Restaurant Chains - High-volume location businesses
 */
export const RESTAURANT_CHAINS = [
	// Fast Food
	{ name: "McDonald's", category: "Fast Food", locations: 40000, founded: 1940 },
	{ name: "Subway", category: "Fast Food", locations: 37000, founded: 1965 },
	{ name: "Starbucks", category: "Coffee", locations: 35000, founded: 1971 },
	{ name: "KFC", category: "Fast Food", locations: 27000, founded: 1930 },
	{ name: "Burger King", category: "Fast Food", locations: 18000, founded: 1954 },
	{ name: "Pizza Hut", category: "Pizza", locations: 18700, founded: 1958 },
	{ name: "Domino's", category: "Pizza", locations: 20000, founded: 1960 },
	{ name: "Taco Bell", category: "Fast Food", locations: 8000, founded: 1962 },
	{ name: "Wendy's", category: "Fast Food", locations: 7000, founded: 1969 },
	{ name: "Tim Hortons", category: "Coffee", locations: 5000, founded: 1964 },
	{ name: "Dunkin'", category: "Coffee", locations: 12000, founded: 1950 },
	{ name: "Papa John's", category: "Pizza", locations: 5500, founded: 1984 },

	// Casual Dining
	{ name: "Applebee's", category: "Casual Dining", locations: 1700, founded: 1980 },
	{ name: "Chili's", category: "Casual Dining", locations: 1600, founded: 1975 },
	{ name: "Olive Garden", category: "Casual Dining", locations: 900, founded: 1982 },
	{ name: "TGI Friday's", category: "Casual Dining", locations: 400, founded: 1965 },
	{ name: "Red Lobster", category: "Casual Dining", locations: 700, founded: 1968 },
	{ name: "Outback Steakhouse", category: "Casual Dining", locations: 1000, founded: 1988 },
	{ name: "Buffalo Wild Wings", category: "Casual Dining", locations: 1200, founded: 1982 },
	{ name: "Cheesecake Factory", category: "Casual Dining", locations: 300, founded: 1978 },

	// Fast Casual
	{ name: "Chipotle", category: "Fast Casual", locations: 3200, founded: 1993 },
	{ name: "Panera Bread", category: "Fast Casual", locations: 2100, founded: 1987 },
	{ name: "Chick-fil-A", category: "Fast Casual", locations: 2800, founded: 1946 },
	{ name: "Five Guys", category: "Fast Casual", locations: 1700, founded: 1986 },
	{ name: "Shake Shack", category: "Fast Casual", locations: 400, founded: 2004 },
	{ name: "In-N-Out Burger", category: "Fast Casual", locations: 400, founded: 1948 },
];

/**
 * Major Retail Chains - Physical locations with high foot traffic
 */
export const RETAIL_CHAINS = [
	// Department Stores
	{ name: "Macy's", category: "Department Store", locations: 500, founded: 1858 },
	{ name: "Nordstrom", category: "Department Store", locations: 350, founded: 1901 },
	{ name: "Kohl's", category: "Department Store", locations: 1100, founded: 1962 },
	{ name: "JCPenney", category: "Department Store", locations: 650, founded: 1902 },
	{ name: "Bloomingdale's", category: "Department Store", locations: 54, founded: 1861 },

	// Grocery Stores
	{ name: "Kroger", category: "Grocery", locations: 2700, founded: 1883 },
	{ name: "Safeway", category: "Grocery", locations: 900, founded: 1915 },
	{ name: "Publix", category: "Grocery", locations: 1300, founded: 1930 },
	{ name: "Albertsons", category: "Grocery", locations: 2200, founded: 1939 },
	{ name: "Whole Foods", category: "Grocery", locations: 500, founded: 1980 },
	{ name: "Trader Joe's", category: "Grocery", locations: 530, founded: 1967 },

	// Pharmacies
	{ name: "CVS Pharmacy", category: "Pharmacy", locations: 9900, founded: 1963 },
	{ name: "Walgreens", category: "Pharmacy", locations: 8900, founded: 1901 },
	{ name: "Rite Aid", category: "Pharmacy", locations: 2400, founded: 1962 },

	// Electronics & Technology
	{ name: "Best Buy", category: "Electronics", locations: 1000, founded: 1966 },
	{ name: "Apple Store", category: "Electronics", locations: 270, founded: 2001 },
	{ name: "GameStop", category: "Electronics", locations: 3000, founded: 1984 },

	// Home Improvement
	{ name: "Home Depot", category: "Home Improvement", locations: 2300, founded: 1978 },
	{ name: "Lowe's", category: "Home Improvement", locations: 1700, founded: 1946 },
	{ name: "Menards", category: "Home Improvement", locations: 350, founded: 1958 },

	// Automotive
	{ name: "AutoZone", category: "Automotive", locations: 6000, founded: 1979 },
	{ name: "O'Reilly Auto Parts", category: "Automotive", locations: 5800, founded: 1957 },
	{ name: "Advance Auto Parts", category: "Automotive", locations: 4900, founded: 1932 },
	{ name: "Jiffy Lube", category: "Automotive", locations: 2000, founded: 1979 },
];

/**
 * Major Healthcare Systems - Important for comprehensive coverage
 */
export const HEALTHCARE_SYSTEMS = [
	{ name: "Kaiser Permanente", type: "Health System", locations: 700, states: ["CA", "WA", "OR", "CO", "GA", "HI", "MD", "VA"] },
	{ name: "HCA Healthcare", type: "Health System", locations: 180, states: ["Multiple"] },
	{ name: "CommonSpirit Health", type: "Health System", locations: 140, states: ["Multiple"] },
	{ name: "Ascension", type: "Health System", locations: 150, states: ["Multiple"] },
	{ name: "Providence", type: "Health System", locations: 120, states: ["AK", "CA", "MT", "NM", "OR", "TX", "WA"] },
	{ name: "Trinity Health", type: "Health System", locations: 90, states: ["Multiple"] },
	{ name: "Bon Secours Mercy Health", type: "Health System", locations: 43, states: ["FL", "KY", "MD", "NY", "OH", "SC", "VA", "WV"] },
	{ name: "Advocate Aurora Health", type: "Health System", locations: 27, states: ["IL", "WI"] },
	{ name: "Cleveland Clinic", type: "Health System", locations: 20, states: ["OH", "FL", "NV", "Canada"] },
	{ name: "Mayo Clinic", type: "Health System", locations: 65, states: ["MN", "AZ", "FL", "WI", "IA"] },
];

/**
 * Geographic Priorities - Cities/regions to focus on first
 */
export const GEOGRAPHIC_PRIORITIES = [
	// Tier 1 - Major Metropolitan Areas
	{ city: "New York", state: "NY", priority: 1, population: 8500000, metro_population: 20100000 },
	{ city: "Los Angeles", state: "CA", priority: 1, population: 3900000, metro_population: 13200000 },
	{ city: "Chicago", state: "IL", priority: 1, population: 2700000, metro_population: 9500000 },
	{ city: "Houston", state: "TX", priority: 1, population: 2300000, metro_population: 7000000 },
	{ city: "Phoenix", state: "AZ", priority: 1, population: 1600000, metro_population: 5000000 },
	{ city: "Philadelphia", state: "PA", priority: 1, population: 1600000, metro_population: 6100000 },
	{ city: "San Antonio", state: "TX", priority: 1, population: 1500000, metro_population: 2600000 },
	{ city: "San Diego", state: "CA", priority: 1, population: 1400000, metro_population: 3300000 },
	{ city: "Dallas", state: "TX", priority: 1, population: 1300000, metro_population: 7600000 },
	{ city: "San Jose", state: "CA", priority: 1, population: 1000000, metro_population: 2000000 },

	// Tier 2 - Major Cities
	{ city: "Austin", state: "TX", priority: 2, population: 970000, metro_population: 2300000 },
	{ city: "Jacksonville", state: "FL", priority: 2, population: 950000, metro_population: 1600000 },
	{ city: "Fort Worth", state: "TX", priority: 2, population: 920000, metro_population: 7600000 },
	{ city: "Columbus", state: "OH", priority: 2, population: 900000, metro_population: 2100000 },
	{ city: "San Francisco", state: "CA", priority: 2, population: 870000, metro_population: 4700000 },
	{ city: "Charlotte", state: "NC", priority: 2, population: 870000, metro_population: 2600000 },
	{ city: "Indianapolis", state: "IN", priority: 2, population: 880000, metro_population: 2100000 },
	{ city: "Seattle", state: "WA", priority: 2, population: 750000, metro_population: 4000000 },
	{ city: "Denver", state: "CO", priority: 2, population: 710000, metro_population: 2900000 },
	{ city: "Boston", state: "MA", priority: 2, population: 690000, metro_population: 4900000 },

	// Tier 3 - Important Regional Centers
	{ city: "Detroit", state: "MI", priority: 3, population: 670000, metro_population: 4300000 },
	{ city: "Nashville", state: "TN", priority: 3, population: 690000, metro_population: 1900000 },
	{ city: "Portland", state: "OR", priority: 3, population: 650000, metro_population: 2500000 },
	{ city: "Las Vegas", state: "NV", priority: 3, population: 640000, metro_population: 2300000 },
	{ city: "Louisville", state: "KY", priority: 3, population: 630000, metro_population: 1300000 },
	{ city: "Baltimore", state: "MD", priority: 3, population: 590000, metro_population: 2800000 },
	{ city: "Milwaukee", state: "WI", priority: 3, population: 590000, metro_population: 1600000 },
	{ city: "Albuquerque", state: "NM", priority: 3, population: 560000, metro_population: 920000 },
	{ city: "Tucson", state: "AZ", priority: 3, population: 550000, metro_population: 1000000 },
	{ city: "Fresno", state: "CA", priority: 3, population: 540000, metro_population: 1000000 },
];

/**
 * Business Category Mappings - For intelligent categorization
 */
export const BUSINESS_CATEGORIES = {
	// Food & Dining
	restaurants: ["restaurant", "food", "dining", "cafe", "bar", "bakery", "fast_food"],
	coffee: ["coffee", "cafe", "espresso", "tea"],
	bars: ["bar", "pub", "brewery", "wine_bar", "sports_bar"],

	// Retail & Shopping
	retail: ["store", "shop", "retail", "boutique", "outlet"],
	grocery: ["grocery", "supermarket", "market", "food_store"],
	pharmacy: ["pharmacy", "drugstore", "cvs", "walgreens"],
	electronics: ["electronics", "computer", "phone", "technology"],

	// Health & Medical
	healthcare: ["hospital", "clinic", "medical", "doctor", "dentist", "pharmacy"],
	fitness: ["gym", "fitness", "yoga", "spa", "salon"],

	// Services
	automotive: ["auto", "car", "mechanic", "gas_station", "tire"],
	financial: ["bank", "atm", "credit_union", "financial"],
	professional: ["lawyer", "accountant", "consultant", "office"],

	// Entertainment & Recreation
	entertainment: ["movie", "theater", "museum", "park", "recreation"],
	lodging: ["hotel", "motel", "inn", "resort"],

	// Education & Government
	education: ["school", "university", "college", "library"],
	government: ["city_hall", "courthouse", "post_office", "dmv"],
};

/**
 * Data Quality Priorities - Which businesses need the most complete data
 */
export const DATA_QUALITY_TIERS = {
	TIER_1: {
		description: "Fortune 500 companies and major chains",
		completeness_target: 95,
		required_fields: ["name", "address", "phone", "website", "hours", "description", "photos", "social_media", "amenities", "payment_methods"],
		ai_enhancement: true,
		manual_review: true,
	},

	TIER_2: {
		description: "Regional chains and important local businesses",
		completeness_target: 85,
		required_fields: ["name", "address", "phone", "website", "hours", "description"],
		ai_enhancement: true,
		manual_review: false,
	},

	TIER_3: {
		description: "Local businesses and smaller establishments",
		completeness_target: 70,
		required_fields: ["name", "address", "phone", "hours"],
		ai_enhancement: false,
		manual_review: false,
	},
};

/**
 * Get businesses by priority tier
 */
export function getBusinessesByTier(tier = 1) {
	switch (tier) {
		case 1:
			return [...FORTUNE_500_SAMPLE, ...RESTAURANT_CHAINS.slice(0, 20), ...RETAIL_CHAINS.slice(0, 20)];
		case 2:
			return [...RESTAURANT_CHAINS, ...RETAIL_CHAINS, ...HEALTHCARE_SYSTEMS];
		case 3:
			return GEOGRAPHIC_PRIORITIES;
		default:
			return FORTUNE_500_SAMPLE;
	}
}

/**
 * Get businesses by category
 */
export function getBusinessesByCategory(category) {
	switch (category.toLowerCase()) {
		case "fortune500":
			return FORTUNE_500_SAMPLE;
		case "restaurants":
			return RESTAURANT_CHAINS;
		case "retail":
			return RETAIL_CHAINS;
		case "healthcare":
			return HEALTHCARE_SYSTEMS;
		default:
			return [];
	}
}

/**
 * Get geographic targets by priority
 */
export function getGeographicTargets(priority = 1) {
	return GEOGRAPHIC_PRIORITIES.filter((location) => location.priority === priority);
}
