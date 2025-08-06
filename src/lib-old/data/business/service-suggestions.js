/**
 * Business Service Suggestions Data
 * Category-based service suggestions for quick adding
 * Extracted from business profile for better organization
 */

export const serviceSuggestions = {
	Plumbing: ["Emergency Plumbing", "Drain Cleaning", "Pipe Repair", "Water Heater Installation"],
	Electrical: ["Electrical Repair", "Panel Upgrade", "Outlet Installation", "Lighting Installation"],
	HVAC: ["AC Repair", "Heating Repair", "Duct Cleaning", "System Installation"],
	Landscaping: ["Lawn Care", "Tree Trimming", "Garden Design", "Irrigation Installation"],
	Cleaning: ["House Cleaning", "Deep Cleaning", "Carpet Cleaning", "Window Cleaning"],
	Restaurant: ["Catering", "Private Events", "Delivery", "Takeout"],
	Automotive: ["Oil Change", "Brake Repair", "Engine Repair", "Tire Service"],
	Technology: ["Computer Repair", "Network Setup", "Software Installation", "Data Recovery"],
	Health: ["Consultation", "Wellness Check", "Treatment", "Therapy"],
	Education: ["Tutoring", "Training", "Workshops", "Certification"],
	Entertainment: ["Event Planning", "DJ Services", "Photography", "Live Music"],
	Beauty: ["Haircut", "Coloring", "Styling", "Treatments"],
	Art: ["Custom Art", "Portraits", "Design Services", "Art Classes"],
	Construction: ["Remodeling", "Roofing", "Flooring", "Painting"],
	Legal: ["Consultation", "Document Review", "Representation", "Legal Advice"],
	Finance: ["Tax Preparation", "Financial Planning", "Bookkeeping", "Consulting"],
	"Real Estate": ["Property Sales", "Property Management", "Appraisal", "Consultation"],
	"Pet Services": ["Pet Grooming", "Pet Sitting", "Training", "Veterinary Care"],
	Fitness: ["Personal Training", "Group Classes", "Nutrition Consulting", "Fitness Assessment"],
	Photography: ["Portrait Photography", "Event Photography", "Commercial Photography", "Photo Editing"],
	Consulting: ["Business Consulting", "Strategy Planning", "Process Improvement", "Market Analysis"],
	Marketing: ["Social Media Management", "Content Creation", "SEO Services", "Advertising"],
	"Web Development": ["Website Design", "E-commerce Development", "App Development", "Maintenance"],
	Catering: ["Wedding Catering", "Corporate Events", "Private Parties", "Meal Delivery"],
	Insurance: ["Auto Insurance", "Home Insurance", "Life Insurance", "Business Insurance"],
	Moving: ["Local Moving", "Long Distance Moving", "Packing Services", "Storage"],
	Security: ["Home Security", "Business Security", "Surveillance", "Alarm Systems"],
	Handyman: ["Home Repairs", "Furniture Assembly", "Painting", "Minor Installations"],
	Transportation: ["Rideshare", "Delivery Service", "Moving Service", "Airport Shuttle"],
	"Event Planning": ["Wedding Planning", "Corporate Events", "Birthday Parties", "Event Coordination"],
};

export const serviceCategories = ["General", "Emergency", "Installation", "Repair", "Maintenance", "Consultation", "Training", "Design", "Delivery", "Custom", "Premium", "Basic", "Advanced", "Seasonal", "Commercial", "Residential", "Industrial", "Specialized"];

/**
 * Get service suggestions for a specific business category
 * @param {string} category - Business category
 * @returns {string[]} Array of suggested service names
 */
export const getSuggestionsForCategory = (category) => {
	return serviceSuggestions[category] || ["Consultation", "Installation", "Repair", "Maintenance"];
};

/**
 * Create a new service object with default values
 * @param {string} name - Service name
 * @param {string} category - Service category
 * @returns {object} New service object
 */
export const createServiceTemplate = (name, category = "General") => ({
	id: Date.now() + Math.random(),
	name,
	description: "",
	price: "",
	duration: "",
	category,
	isActive: true,
	createdAt: new Date().toISOString(),
});

/**
 * Validate service data
 * @param {object} service - Service object to validate
 * @returns {object} Validation result with isValid boolean and errors array
 */
export const validateService = (service) => {
	const errors = [];

	if (!service.name || service.name.trim().length < 2) {
		errors.push("Service name must be at least 2 characters long");
	}

	if (!service.category) {
		errors.push("Service category is required");
	}

	if (service.price && !isValidPrice(service.price)) {
		errors.push("Price must be a valid currency format (e.g., $150, 150, $150.00)");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

/**
 * Check if a price string is valid
 * @param {string} price - Price string to validate
 * @returns {boolean} Whether the price is valid
 */
const isValidPrice = (price) => {
	// Allow formats like: $150, 150, $150.00, 150.00
	const priceRegex = /^\$?\d+(\.\d{1,2})?$/;
	return priceRegex.test(price.trim());
};

/**
 * Format price for display
 * @param {string} price - Raw price string
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
	if (!price) return "";

	const cleanPrice = price.replace(/[^\d.]/g, "");
	const numPrice = parseFloat(cleanPrice);

	if (isNaN(numPrice)) return price;

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(numPrice);
};

/**
 * Get service completion status
 * @param {object} service - Service object
 * @returns {object} Status with isComplete boolean and missing fields
 */
export const getServiceStatus = (service) => {
	const requiredFields = ["name", "category"];
	const missingFields = requiredFields.filter((field) => !service[field] || service[field].trim() === "");

	return {
		isComplete: missingFields.length === 0,
		missingFields,
		completionPercentage: Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100),
	};
};
