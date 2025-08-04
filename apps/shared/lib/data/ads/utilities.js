/**
 * Ads Data Layer Utilities
 * Data management and helper functions for advertising functionality
 * Enterprise-level utilities with performance optimization
 */

// Ad types configuration
export const AD_TYPES = {
	search: {
		name: "Search Ads",
		description: "Text ads that appear in search results",
		icon: "Search",
		features: ["Keyword targeting", "Text-based", "High intent"],
		minBudget: 10,
		recommendedBudget: 50,
		avgCPC: 2.5,
	},
	display: {
		name: "Display Ads",
		description: "Visual ads on websites and apps",
		icon: "Monitor",
		features: ["Visual creative", "Brand awareness", "Wide reach"],
		minBudget: 20,
		recommendedBudget: 75,
		avgCPC: 1.8,
	},
	social: {
		name: "Social Media",
		description: "Ads on social media platforms",
		icon: "Users",
		features: ["Social engagement", "Detailed targeting", "Visual content"],
		minBudget: 15,
		recommendedBudget: 60,
		avgCPC: 2.1,
	},
};

// Business type targeting suggestions
export const BUSINESS_TARGETING = {
	plumbing: {
		keywords: ["plumber", "emergency plumbing", "drain cleaning", "pipe repair", "water heater", "leak repair", "bathroom plumbing", "kitchen plumbing", "sewer line", "garbage disposal", "toilet repair", "faucet repair"],
		demographics: ["25-34", "35-44", "45-54"],
		interests: ["home-improvement", "real-estate"],
		budget: { min: 30, recommended: 75, max: 200 },
		seasonality: {
			high: [11, 12, 1, 2], // Winter months
			medium: [3, 4, 9, 10],
			low: [5, 6, 7, 8],
		},
	},
	electrical: {
		keywords: ["electrician", "electrical repair", "wiring", "circuit breaker", "electrical installation", "outlet repair", "ceiling fan installation", "electrical upgrade", "panel upgrade", "lighting installation"],
		demographics: ["25-34", "35-44", "45-54", "55-64"],
		interests: ["home-improvement", "technology"],
		budget: { min: 25, recommended: 60, max: 150 },
		seasonality: {
			high: [6, 7, 8, 12], // Summer heat + winter holidays
			medium: [3, 4, 5, 9, 10],
			low: [1, 2, 11],
		},
	},
	cleaning: {
		keywords: ["house cleaning", "office cleaning", "deep cleaning", "move out cleaning", "recurring cleaning", "carpet cleaning", "window cleaning", "post construction cleaning", "disinfection service", "green cleaning", "commercial cleaning"],
		demographics: ["25-34", "35-44", "45-54"],
		interests: ["home-improvement", "health-fitness"],
		budget: { min: 20, recommended: 45, max: 120 },
		seasonality: {
			high: [3, 4, 11, 12], // Spring cleaning + holidays
			medium: [1, 2, 5, 9, 10],
			low: [6, 7, 8],
		},
	},
	dental: {
		keywords: ["dentist", "dental cleaning", "teeth whitening", "dental implants", "emergency dental", "cosmetic dentistry", "orthodontist", "root canal", "dental crown", "dental bridge", "wisdom teeth", "periodontal"],
		demographics: ["18-24", "25-34", "35-44", "45-54", "55-64"],
		interests: ["health-fitness"],
		budget: { min: 50, recommended: 150, max: 500 },
		seasonality: {
			high: [1, 2, 3], // New year resolutions + insurance renewal
			medium: [4, 5, 9, 10, 11, 12],
			low: [6, 7, 8],
		},
	},
	automotive: {
		keywords: ["auto repair", "car service", "oil change", "brake repair", "tire service", "transmission repair", "engine repair", "battery replacement", "alignment", "inspection", "mechanic", "car maintenance"],
		demographics: ["25-34", "35-44", "45-54"],
		interests: ["automotive"],
		budget: { min: 35, recommended: 80, max: 250 },
		seasonality: {
			high: [10, 11, 3, 4], // Pre-winter and spring preparation
			medium: [1, 2, 5, 9, 12],
			low: [6, 7, 8],
		},
	},
	hvac: {
		keywords: ["hvac repair", "air conditioning", "heating", "furnace repair", "duct cleaning", "ac installation", "heating installation", "hvac maintenance", "thermostat", "heat pump", "boiler repair", "ventilation"],
		demographics: ["35-44", "45-54", "55-64"],
		interests: ["home-improvement"],
		budget: { min: 40, recommended: 100, max: 300 },
		seasonality: {
			high: [5, 6, 7, 8, 11, 12, 1], // Summer AC + winter heating
			medium: [3, 4, 9, 10],
			low: [2],
		},
	},
	roofing: {
		keywords: ["roofing contractor", "roof repair", "roof replacement", "roof inspection", "gutter cleaning", "roof installation", "storm damage", "leak repair", "shingle repair", "metal roofing", "flat roof", "roof maintenance"],
		demographics: ["35-44", "45-54", "55-64"],
		interests: ["home-improvement", "real-estate"],
		budget: { min: 45, recommended: 120, max: 400 },
		seasonality: {
			high: [3, 4, 5, 9, 10], // Spring and fall
			medium: [6, 7, 8, 11],
			low: [12, 1, 2],
		},
	},
	lawn: {
		keywords: ["lawn care", "landscaping", "tree trimming", "lawn mowing", "garden maintenance", "irrigation", "fertilization", "weed control", "leaf removal", "snow removal", "hardscaping", "lawn installation"],
		demographics: ["25-34", "35-44", "45-54"],
		interests: ["home-improvement"],
		budget: { min: 15, recommended: 35, max: 100 },
		seasonality: {
			high: [3, 4, 5, 6, 9, 10], // Spring through fall
			medium: [7, 8, 11],
			low: [12, 1, 2],
		},
	},
};

// Performance benchmarks by industry
export const PERFORMANCE_BENCHMARKS = {
	search: {
		avgCTR: 3.17,
		avgCPC: 2.69,
		avgConversionRate: 3.75,
		avgCostPerLead: 75,
	},
	display: {
		avgCTR: 0.46,
		avgCPC: 0.63,
		avgConversionRate: 0.77,
		avgCostPerLead: 45,
	},
	social: {
		avgCTR: 0.9,
		avgCPC: 1.72,
		avgConversionRate: 1.85,
		avgCostPerLead: 58,
	},
};

/**
 * Get targeting suggestions for a business type
 */
export const getTargetingSuggestions = (businessType) => {
	return BUSINESS_TARGETING[businessType] || BUSINESS_TARGETING.plumbing;
};

/**
 * Calculate budget recommendations based on business type and competition
 */
export const calculateBudgetRecommendation = (businessType, competition = "medium") => {
	const targeting = getTargetingSuggestions(businessType);
	const competitionMultiplier = { low: 0.8, medium: 1.0, high: 1.3 };
	const multiplier = competitionMultiplier[competition];

	return {
		min: Math.round(targeting.budget.min * multiplier),
		recommended: Math.round(targeting.budget.recommended * multiplier),
		max: Math.round(targeting.budget.max * multiplier),
	};
};

/**
 * Estimate campaign performance
 */
export const estimateCampaignPerformance = (campaignData) => {
	const { type = "search", budget, duration, keywords = "", location } = campaignData;

	// Get benchmark data
	const benchmark = PERFORMANCE_BENCHMARKS[type];
	if (!benchmark) return null;

	// Calculate basic metrics
	const totalBudget = budget * duration;
	const keywordCount = keywords.split(",").filter((k) => k.trim()).length;

	// Apply modifiers based on campaign specifics
	let cpcModifier = 1.0;
	let ctrModifier = 1.0;

	// Keyword count affects competition
	if (keywordCount > 20) cpcModifier *= 1.1;
	if (keywordCount < 5) ctrModifier *= 0.9;

	// Location affects costs (mock logic)
	if (location.toLowerCase().includes("new york") || location.toLowerCase().includes("san francisco")) {
		cpcModifier *= 1.3;
	}

	const adjustedCPC = benchmark.avgCPC * cpcModifier;
	const adjustedCTR = benchmark.avgCTR * ctrModifier;

	const estimatedClicks = Math.round(totalBudget / adjustedCPC);
	const estimatedImpressions = Math.round(estimatedClicks / (adjustedCTR / 100));
	const estimatedLeads = Math.round(estimatedClicks * (benchmark.avgConversionRate / 100));

	return {
		impressions: estimatedImpressions,
		clicks: estimatedClicks,
		leads: estimatedLeads,
		ctr: adjustedCTR.toFixed(2),
		cpc: adjustedCPC.toFixed(2),
		costPerLead: estimatedLeads > 0 ? (totalBudget / estimatedLeads).toFixed(2) : 0,
		totalBudget,
	};
};

/**
 * Get seasonal recommendations
 */
export const getSeasonalRecommendations = (businessType, month = new Date().getMonth() + 1) => {
	const targeting = getTargetingSuggestions(businessType);
	const { seasonality } = targeting;

	let season = "medium";
	if (seasonality.high.includes(month)) season = "high";
	if (seasonality.low.includes(month)) season = "low";

	const recommendations = {
		high: {
			budgetMultiplier: 1.3,
			message: "Peak season - consider increasing budget for maximum reach",
			urgency: "high",
		},
		medium: {
			budgetMultiplier: 1.0,
			message: "Standard season - maintain consistent budget",
			urgency: "medium",
		},
		low: {
			budgetMultiplier: 0.7,
			message: "Off-season - focus on brand awareness with lower budget",
			urgency: "low",
		},
	};

	return {
		season,
		...recommendations[season],
	};
};

/**
 * Validate campaign data
 */
export const validateCampaignData = (campaignData) => {
	const errors = {};

	// Required fields
	if (!campaignData.name?.trim()) {
		errors.name = "Campaign name is required";
	}

	if (!campaignData.location?.trim()) {
		errors.location = "Target location is required";
	}

	if (!campaignData.headline?.trim()) {
		errors.headline = "Ad headline is required";
	}

	if (!campaignData.description?.trim()) {
		errors.description = "Ad description is required";
	}

	if (!campaignData.keywords?.trim()) {
		errors.keywords = "At least one keyword is required";
	}

	// Budget validation
	if (!campaignData.budget || campaignData.budget < 10) {
		errors.budget = "Minimum budget is $10 per day";
	}

	if (campaignData.budget > 1000) {
		errors.budget = "Maximum budget is $1000 per day";
	}

	// Schedule validation
	if (campaignData.schedule?.startDate && campaignData.schedule?.endDate) {
		const startDate = new Date(campaignData.schedule.startDate);
		const endDate = new Date(campaignData.schedule.endDate);

		if (startDate >= endDate) {
			errors.endDate = "End date must be after start date";
		}

		if (startDate < new Date().setHours(0, 0, 0, 0)) {
			errors.startDate = "Start date cannot be in the past";
		}
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount, currency = "USD") => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount);
};

/**
 * Format large numbers with abbreviations
 */
export const formatNumber = (num) => {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + "M";
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + "K";
	}
	return num.toLocaleString();
};

/**
 * Generate campaign suggestions based on business data
 */
export const generateCampaignSuggestions = (businessData) => {
	const { businessType, location, services = [] } = businessData;
	const targeting = getTargetingSuggestions(businessType);

	return {
		name: `${businessData.name} - ${location} Campaign`,
		keywords: targeting.keywords.slice(0, 10).join(", "),
		headline: `Professional ${businessType} Services`,
		description: `Trusted local ${businessType} experts. Fast, reliable service with satisfaction guarantee.`,
		demographics: targeting.demographics,
		interests: targeting.interests,
		budget: targeting.budget.recommended,
	};
};

/**
 * Campaign optimization suggestions
 */
export const getOptimizationSuggestions = (campaignData, performanceData = {}) => {
	const suggestions = [];

	// Budget optimization
	if (campaignData.budget < 30) {
		suggestions.push({
			type: "budget",
			priority: "high",
			message: "Consider increasing budget to $30+ for better reach",
			action: "increase_budget",
		});
	}

	// Keywords optimization
	const keywordCount = campaignData.keywords?.split(",").length || 0;
	if (keywordCount < 5) {
		suggestions.push({
			type: "keywords",
			priority: "medium",
			message: "Add more keywords to increase targeting opportunities",
			action: "add_keywords",
		});
	}

	if (keywordCount > 30) {
		suggestions.push({
			type: "keywords",
			priority: "medium",
			message: "Consider reducing keywords for better focus",
			action: "reduce_keywords",
		});
	}

	// Demographic optimization
	if (campaignData.demographics?.length === 0) {
		suggestions.push({
			type: "demographics",
			priority: "low",
			message: "Add age targeting for better audience focus",
			action: "add_demographics",
		});
	}

	return suggestions;
};
