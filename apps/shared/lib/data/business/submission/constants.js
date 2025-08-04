/**
 * Business Submission Constants
 * Shared constants, categories, and enums for business submission
 * Extracted from BusinessSubmissionForm for better organization
 */

// Business categories
export const BUSINESS_CATEGORIES = ["Restaurants", "Retail", "Healthcare", "Automotive", "Home Services", "Beauty & Spas", "Professional Services", "Entertainment", "Education", "Real Estate", "Technology", "Fitness", "Travel", "Financial Services", "Legal Services", "Construction", "Agriculture", "Manufacturing", "Other"];

// Days of the week for hours
export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Common amenities
export const COMMON_AMENITIES = ["Wi-Fi", "Parking", "Wheelchair Accessible", "Air Conditioning", "Outdoor Seating", "Pet Friendly", "Delivery", "Takeout", "Reservations", "Credit Cards Accepted", "Cash Only", "Gift Cards", "Happy Hour", "Live Music", "Catering", "Private Events", "Valet Parking", "Drive-Thru", "24/7 Service", "Family Friendly"];

// Payment methods
export const PAYMENT_METHODS = ["Cash", "Credit Cards", "Debit Cards", "PayPal", "Apple Pay", "Google Pay", "Venmo", "Zelle", "Check", "Bitcoin", "Buy Now Pay Later", "Gift Cards"];

// Price ranges
export const PRICE_RANGES = [
	{ value: "$", label: "$ - Budget Friendly" },
	{ value: "$$", label: "$$ - Moderate" },
	{ value: "$$$", label: "$$$ - Expensive" },
	{ value: "$$$$", label: "$$$$ - Very Expensive" },
];

// Employee count ranges
export const EMPLOYEE_COUNT_RANGES = ["1-5", "6-20", "21-50", "51-100", "101-500", "500+"];

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
	MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
	MAX_FILES: 10,
	ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
	ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
};

// Form validation constants
export const VALIDATION_CONSTANTS = {
	MIN_BUSINESS_NAME_LENGTH: 2,
	MIN_DESCRIPTION_LENGTH: 20,
	MIN_ADDRESS_LENGTH: 5,
	MIN_CITY_LENGTH: 2,
	MIN_STATE_LENGTH: 2,
	MIN_ZIP_LENGTH: 5,
	MIN_PHONE_LENGTH: 10,
};

// Auto-save settings
export const AUTO_SAVE_CONFIG = {
	DELAY_MS: 2000,
	STORAGE_KEY: "business_submission_draft",
	EXPIRY_DAYS: 7,
};
