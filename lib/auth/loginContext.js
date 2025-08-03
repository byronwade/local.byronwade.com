// REQUIRED: Intelligent Login Context System
// Captures user intent and provides contextual messaging

/**
 * Login Context Mapping
 * Maps different user intents to contextual messaging and post-login actions
 */
export const LOGIN_CONTEXTS = {
	// Business-related actions
	"add-business": {
		title: "Add Your Business to Thorbis",
		subtitle: "Join thousands of local businesses growing their reach",
		icon: "🏢",
		message: "To add your business, you need to sign in first. This helps us verify ownership and keep our platform secure.",
		benefits: ["Get found by local customers", "Manage your business profile", "Respond to reviews", "Track analytics"],
		redirectPath: "/add-a-business",
		priority: "high",
		actionText: "Continue Adding Business",
		category: "business",
	},

	"claim-business": {
		title: "Claim Your Business",
		subtitle: "Take control of your business listing",
		icon: "✋",
		message: "Sign in to claim and verify your business listing. This gives you full control over your business information.",
		benefits: ["Update business information", "Respond to customer reviews", "Add photos and descriptions", "Access customer insights"],
		redirectPath: "/claim-business",
		priority: "high",
		actionText: "Continue Claiming Business",
		category: "business",
	},

	"business-dashboard": {
		title: "Access Business Dashboard",
		subtitle: "Manage your business presence",
		icon: "📊",
		message: "Sign in to access your business dashboard and manage your listings.",
		benefits: ["View performance metrics", "Manage multiple locations", "Update business hours", "Handle customer inquiries"],
		redirectPath: "/dashboard/business",
		priority: "medium",
		actionText: "Go to Dashboard",
		category: "business",
	},

	// Review and interaction actions
	"write-review": {
		title: "Share Your Experience",
		subtitle: "Help others make informed decisions",
		icon: "⭐",
		message: "Sign in to write reviews and share your experiences with local businesses.",
		benefits: ["Help other customers", "Build your reviewer reputation", "Get exclusive offers", "Connect with businesses"],
		redirectPath: null, // Will use stored business URL
		priority: "medium",
		actionText: "Continue Writing Review",
		category: "social",
	},

	"save-business": {
		title: "Save Your Favorites",
		subtitle: "Never lose track of great businesses",
		icon: "❤️",
		message: "Sign in to save businesses to your favorites and create custom lists.",
		benefits: ["Create custom business lists", "Get updates from saved businesses", "Share recommendations", "Quick access to favorites"],
		redirectPath: null,
		priority: "low",
		actionText: "Continue Saving",
		category: "social",
	},

	// User actions
	"view-profile": {
		title: "Access Your Profile",
		subtitle: "Manage your account and preferences",
		icon: "👤",
		message: "Sign in to view and update your profile information.",
		benefits: ["Update personal information", "Manage privacy settings", "View your activity history", "Control notifications"],
		redirectPath: "/dashboard/user",
		priority: "medium",
		actionText: "Go to Profile",
		category: "account",
	},

	"book-service": {
		title: "Book Your Service",
		subtitle: "Schedule with trusted professionals",
		icon: "📅",
		message: "Sign in to book appointments and services with local businesses.",
		benefits: ["Secure booking system", "Automatic reminders", "Easy rescheduling", "Service history tracking"],
		redirectPath: null,
		priority: "high",
		actionText: "Continue Booking",
		category: "booking",
	},

	// Administrative actions
	"admin-access": {
		title: "Administrator Access",
		subtitle: "Platform management and oversight",
		icon: "🔧",
		message: "Administrator credentials required to access management tools.",
		benefits: ["Platform analytics", "User management", "Content moderation", "System monitoring"],
		redirectPath: "/dashboard/admin",
		priority: "high",
		actionText: "Access Admin Panel",
		category: "admin",
	},

	// Premium features
	"premium-features": {
		title: "Unlock Premium Features",
		subtitle: "Get the most out of Thorbis",
		icon: "⭐",
		message: "Sign in to access premium features and enhanced business tools.",
		benefits: ["Advanced analytics", "Priority customer support", "Enhanced business profiles", "Marketing tools"],
		redirectPath: "/premium",
		priority: "medium",
		actionText: "Explore Premium",
		category: "premium",
	},

	// Community features
	"join-community": {
		title: "Join the Community",
		subtitle: "Connect with local business owners",
		icon: "🤝",
		message: "Sign in to join discussions, share insights, and connect with other business owners.",
		benefits: ["Network with peers", "Share business tips", "Local business events", "Community support"],
		redirectPath: "/community",
		priority: "low",
		actionText: "Join Community",
		category: "social",
	},

	// Support and help
	"get-support": {
		title: "Get Help & Support",
		subtitle: "We're here to assist you",
		icon: "💬",
		message: "Sign in to access personalized support and track your support requests.",
		benefits: ["Priority support", "Request history", "Live chat access", "Personalized assistance"],
		redirectPath: "/support",
		priority: "medium",
		actionText: "Get Support",
		category: "support",
	},

	// Default fallback
	default: {
		title: "Welcome Back",
		subtitle: "Sign in to your account",
		icon: "🔐",
		message: "Sign in to access your account and continue where you left off.",
		benefits: ["Access your dashboard", "Manage your businesses", "View saved content", "Update preferences"],
		redirectPath: "/dashboard",
		priority: "medium",
		actionText: "Continue",
		category: "general",
	},
};

/**
 * Context Detection System
 * Analyzes URLs and paths to determine user intent
 */
export class LoginContextDetector {
	/**
	 * Detect context from URL path and parameters
	 */
	static detectContext(url, searchParams) {
		// Check explicit context parameter
		const explicitContext = searchParams.get("context");
		if (explicitContext && LOGIN_CONTEXTS[explicitContext]) {
			return {
				key: explicitContext,
				...LOGIN_CONTEXTS[explicitContext],
				detected: "explicit",
			};
		}

		// Extract redirect path for analysis
		const redirectPath = searchParams.get("redirect") || "";

		// Path-based detection patterns
		const pathPatterns = [
			{ pattern: /\/add-a-business/, context: "add-business" },
			{ pattern: /\/claim-business/, context: "claim-business" },
			{ pattern: /\/dashboard\/business/, context: "business-dashboard" },
			{ pattern: /\/dashboard\/admin/, context: "admin-access" },
			{ pattern: /\/dashboard\/user/, context: "view-profile" },
			{ pattern: /\/business\/[^/]+\/review/, context: "write-review" },
			{ pattern: /\/business\/[^/]+\/book/, context: "book-service" },
			{ pattern: /\/premium/, context: "premium-features" },
			{ pattern: /\/community/, context: "join-community" },
			{ pattern: /\/support/, context: "get-support" },
		];

		// Check redirect path patterns
		for (const { pattern, context } of pathPatterns) {
			if (pattern.test(redirectPath)) {
				return {
					key: context,
					...LOGIN_CONTEXTS[context],
					detected: "path",
					originalPath: redirectPath,
				};
			}
		}

		// Check for action parameters
		const action = searchParams.get("action");
		const actionMappings = {
			save: "save-business",
			review: "write-review",
			book: "book-service",
			claim: "claim-business",
		};

		if (action && actionMappings[action]) {
			const contextKey = actionMappings[action];
			return {
				key: contextKey,
				...LOGIN_CONTEXTS[contextKey],
				detected: "action",
				action,
			};
		}

		// Check for business-specific actions
		const businessId = searchParams.get("business");
		const businessAction = searchParams.get("business_action");

		if (businessId && businessAction) {
			const businessActionMappings = {
				review: "write-review",
				save: "save-business",
				book: "book-service",
				claim: "claim-business",
			};

			if (businessActionMappings[businessAction]) {
				const contextKey = businessActionMappings[businessAction];
				return {
					key: contextKey,
					...LOGIN_CONTEXTS[contextKey],
					detected: "business_action",
					businessId,
					businessAction,
				};
			}
		}

		// Referrer-based detection
		const referrer = searchParams.get("referrer");
		if (referrer) {
			if (referrer.includes("business-listing")) {
				return {
					key: "save-business",
					...LOGIN_CONTEXTS["save-business"],
					detected: "referrer",
				};
			}
		}

		// Default context
		return {
			key: "default",
			...LOGIN_CONTEXTS["default"],
			detected: "default",
		};
	}

	/**
	 * Create context-aware redirect URL
	 */
	static createContextUrl(basePath, context, additionalParams = {}) {
		const url = new URL(basePath, window.location.origin);

		// Add context parameter
		url.searchParams.set("context", context);

		// Add additional parameters
		Object.entries(additionalParams).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				url.searchParams.set(key, value.toString());
			}
		});

		return url.pathname + url.search;
	}

	/**
	 * Generate smart post-login redirect
	 */
	static getPostLoginRedirect(context, searchParams) {
		// Use explicit redirect if provided
		const explicitRedirect = searchParams.get("redirect");
		if (explicitRedirect) {
			return explicitRedirect;
		}

		// Use context-specific redirect
		if (context.redirectPath) {
			return context.redirectPath;
		}

		// Business-specific redirects
		if (context.businessId) {
			const businessAction = context.businessAction;
			switch (businessAction) {
				case "review":
					return `/business/${context.businessId}/review`;
				case "book":
					return `/business/${context.businessId}/book`;
				case "save":
					return `/business/${context.businessId}`;
				default:
					return `/business/${context.businessId}`;
			}
		}

		// Default dashboard redirect
		return "/dashboard";
	}
}

/**
 * Context Message Generator
 * Creates dynamic messaging based on context and user state
 */
export class ContextMessageGenerator {
	/**
	 * Generate urgency indicator
	 */
	static getUrgencyLevel(context) {
		const urgencyMap = {
			high: { color: "red", pulse: true },
			medium: { color: "blue", pulse: false },
			low: { color: "gray", pulse: false },
		};

		return urgencyMap[context.priority] || urgencyMap["medium"];
	}

	/**
	 * Generate time-sensitive messaging
	 */
	static getTimeSensitiveMessage(context) {
		const timeMessages = {
			"add-business": "Join thousands of businesses already on Thorbis",
			"book-service": "Secure your preferred time slot",
			"write-review": "Share your experience while it's fresh",
			"claim-business": "Take control of your business listing today",
		};

		return timeMessages[context.key] || null;
	}

	/**
	 * Generate social proof messaging
	 */
	static getSocialProof(context) {
		const socialProofs = {
			"add-business": "🚀 Over 10,000 businesses trust Thorbis",
			"write-review": "⭐ Join 50,000+ helpful reviewers",
			"book-service": "📅 1M+ successful bookings made",
			"claim-business": "✅ 95% of claimed businesses see increased engagement",
		};

		return socialProofs[context.key] || null;
	}

	/**
	 * Generate personalized CTA text
	 */
	static getPersonalizedCTA(context, hasAccount = false) {
		if (hasAccount) {
			return `Sign In & ${context.actionText}`;
		}

		const newUserCTAs = {
			"add-business": "Create Account & Add Business",
			"write-review": "Join & Write Review",
			"book-service": "Sign Up & Book Service",
			"claim-business": "Create Account & Claim Business",
		};

		return newUserCTAs[context.key] || "Create Account & Continue";
	}
}

export default {
	LOGIN_CONTEXTS,
	LoginContextDetector,
	ContextMessageGenerator,
};
