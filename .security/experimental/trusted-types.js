/**
 * 🔬 EXPERIMENTAL: Trusted Types API Implementation
 * Industry-Leading XSS Prevention (2024-2025)
 *
 * Based on latest browser security research and W3C specifications.
 * Provides type-safe DOM manipulation to prevent XSS attacks.
 *
 * Compatibility: Chrome 83+, Edge 83+, Firefox (in development)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
 * @see https://w3c.github.io/trusted-types/dist/spec/
 */

import DOMPurify from "dompurify";
import { logger } from "@/lib/utils/logger";

// ============================================================================
// TRUSTED TYPES POLICY CONFIGURATION
// ============================================================================

/**
 * Global trusted types policies for the application
 * Each policy defines how to safely create trusted types
 */
const TRUSTED_TYPES_POLICIES = {
	// Default policy for legacy code migration
	default: {
		createHTML: (input) => {
			logger.security({
				type: "trusted_types_default_usage",
				input: input.substring(0, 100), // Log first 100 chars only
				stack: new Error().stack?.split("\n").slice(0, 3).join("\n"),
				timestamp: Date.now(),
			});

			// Strict sanitization for default policy
			return DOMPurify.sanitize(input, {
				ALLOWED_TAGS: ["p", "br", "strong", "em", "span"],
				ALLOWED_ATTR: ["class"],
				KEEP_CONTENT: false,
			});
		},
		createScript: () => {
			// Block all script creation in default policy
			logger.critical("Attempted script creation via default trusted types policy");
			throw new Error("Script creation not allowed via default policy");
		},
		createScriptURL: () => {
			// Block all script URL creation in default policy
			logger.critical("Attempted script URL creation via default trusted types policy");
			throw new Error("Script URL creation not allowed via default policy");
		},
	},

	// Business content policy for user-generated content
	businessContent: {
		createHTML: (input) => {
			logger.performance("Processing business content HTML");

			// Allow more tags for business descriptions
			return DOMPurify.sanitize(input, {
				ALLOWED_TAGS: ["p", "br", "strong", "em", "span", "div", "h1", "h2", "h3", "ul", "ol", "li", "a", "img"],
				ALLOWED_ATTR: {
					a: ["href", "title"],
					img: ["src", "alt", "width", "height"],
					"*": ["class"],
				},
				ALLOWED_URI_REGEXP: /^https?:\/\//,
				KEEP_CONTENT: false,
			});
		},
	},

	// Analytics policy for tracking scripts
	analytics: {
		createScript: (input) => {
			// Only allow specific analytics scripts
			const allowedAnalytics = ["https://www.googletagmanager.com", "https://www.google-analytics.com", "https://analytics.google.com", "https://cdn.vercel-insights.com"];

			const isAllowed = allowedAnalytics.some((domain) => input.includes(domain) || input.startsWith("/"));

			if (!isAllowed) {
				logger.security({
					type: "blocked_analytics_script",
					input,
					timestamp: Date.now(),
				});
				throw new Error("Analytics script not from allowed domain");
			}

			return input;
		},
		createScriptURL: (input) => {
			// Validate script URLs for analytics
			try {
				const url = new URL(input, window.location.origin);
				const allowedHosts = ["www.googletagmanager.com", "www.google-analytics.com", "analytics.google.com", "cdn.vercel-insights.com", window.location.hostname];

				if (!allowedHosts.includes(url.hostname)) {
					throw new Error("Script URL not from allowed host");
				}

				return input;
			} catch (error) {
				logger.security({
					type: "blocked_script_url",
					input,
					error: error.message,
					timestamp: Date.now(),
				});
				throw error;
			}
		},
	},
};

// ============================================================================
// TRUSTED TYPES MANAGER
// ============================================================================

class TrustedTypesManager {
	constructor() {
		this.policies = new Map();
		this.isSupported = typeof window !== "undefined" && "trustedTypes" in window;
		this.initialized = false;
	}

	/**
	 * Initialize trusted types policies
	 * Must be called early in application lifecycle
	 */
	async initialize() {
		if (this.initialized || typeof window === "undefined") {
			return;
		}

		try {
			if (this.isSupported) {
				// Create policies
				for (const [name, config] of Object.entries(TRUSTED_TYPES_POLICIES)) {
					try {
						const policy = window.trustedTypes.createPolicy(name, config);
						this.policies.set(name, policy);
						logger.info(`Created trusted types policy: ${name}`);
					} catch (error) {
						logger.error(`Failed to create trusted types policy ${name}:`, error);
					}
				}
			} else {
				// Polyfill for unsupported browsers
				this.setupPolyfill();
				logger.warn("Trusted Types not supported, using polyfill");
			}

			this.initialized = true;
			logger.security({
				type: "trusted_types_initialized",
				supported: this.isSupported,
				policies: Array.from(this.policies.keys()),
				timestamp: Date.now(),
			});
		} catch (error) {
			logger.error("Failed to initialize Trusted Types:", error);
			throw error;
		}
	}

	/**
	 * Setup polyfill for browsers without Trusted Types support
	 */
	setupPolyfill() {
		if (typeof window === "undefined") return;

		// Simple polyfill that applies sanitization
		window.trustedTypes = {
			createPolicy: (name, rules) => {
				const policy = {
					name,
					createHTML: rules.createHTML || ((input) => input),
					createScript: rules.createScript || ((input) => input),
					createScriptURL: rules.createScriptURL || ((input) => input),
				};

				this.policies.set(name, policy);
				return policy;
			},
		};
	}

	/**
	 * Get a trusted types policy by name
	 */
	getPolicy(name) {
		if (!this.initialized) {
			throw new Error("TrustedTypesManager not initialized");
		}

		const policy = this.policies.get(name);
		if (!policy) {
			throw new Error(`Trusted types policy '${name}' not found`);
		}

		return policy;
	}

	/**
	 * Create trusted HTML using specified policy
	 */
	createHTML(policyName, input) {
		const policy = this.getPolicy(policyName);
		return policy.createHTML(input);
	}

	/**
	 * Create trusted script using specified policy
	 */
	createScript(policyName, input) {
		const policy = this.getPolicy(policyName);
		return policy.createScript(input);
	}

	/**
	 * Create trusted script URL using specified policy
	 */
	createScriptURL(policyName, input) {
		const policy = this.getPolicy(policyName);
		return policy.createScriptURL(input);
	}

	/**
	 * Safely set innerHTML using trusted types
	 */
	setInnerHTML(element, policyName, html) {
		try {
			const trustedHTML = this.createHTML(policyName, html);
			element.innerHTML = trustedHTML;
		} catch (error) {
			logger.error("Failed to set innerHTML with trusted types:", error);
			// Fallback: clear content for security
			element.innerHTML = "";
			throw error;
		}
	}

	/**
	 * Report violations for monitoring
	 */
	reportViolation(violation) {
		logger.security({
			type: "trusted_types_violation",
			violation: {
				type: violation.violationType,
				policy: violation.policyId,
				sample: violation.sample,
				url: violation.sourceFile,
				line: violation.lineNumber,
			},
			timestamp: Date.now(),
		});

		// Send to external monitoring service
		if (window.fetch) {
			fetch("/api/security/violations", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "trusted_types_violation",
					violation,
					userAgent: navigator.userAgent,
					timestamp: Date.now(),
				}),
			}).catch((error) => {
				logger.error("Failed to report trusted types violation:", error);
			});
		}
	}
}

// ============================================================================
// REACT INTEGRATION HELPERS
// ============================================================================

/**
 * React hook for trusted types
 */
export function useTrustedTypes() {
	const manager = getTrustedTypesManager();

	return {
		createHTML: (policy, html) => manager.createHTML(policy, html),
		createScript: (policy, script) => manager.createScript(policy, script),
		createScriptURL: (policy, url) => manager.createScriptURL(policy, url),
		setInnerHTML: (element, policy, html) => manager.setInnerHTML(element, policy, html),
	};
}

/**
 * Safe HTML component that uses trusted types
 */
export function SafeHTML({ policy = "businessContent", html, className, ...props }) {
	const ref = useRef(null);
	const { setInnerHTML } = useTrustedTypes();

	useEffect(() => {
		if (ref.current && html) {
			setInnerHTML(ref.current, policy, html);
		}
	}, [html, policy, setInnerHTML]);

	return React.createElement("div", {
		ref,
		className,
		...props,
	});
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

let trustedTypesManagerInstance = null;

export function getTrustedTypesManager() {
	if (!trustedTypesManagerInstance) {
		trustedTypesManagerInstance = new TrustedTypesManager();
	}
	return trustedTypesManagerInstance;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize trusted types on application start
 */
export async function initializeTrustedTypes() {
	const manager = getTrustedTypesManager();
	await manager.initialize();

	// Set up violation reporting
	if (typeof window !== "undefined" && manager.isSupported) {
		document.addEventListener("securitypolicyviolation", (event) => {
			if (event.violatedDirective === "require-trusted-types-for") {
				manager.reportViolation(event);
			}
		});
	}
}

// Auto-initialize in browser environment
if (typeof window !== "undefined") {
	// Initialize when DOM is ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializeTrustedTypes);
	} else {
		initializeTrustedTypes();
	}
}

// ============================================================================
// CSP INTEGRATION
// ============================================================================

/**
 * Generate CSP directives for Trusted Types
 */
export function getTrustedTypesCSP() {
	return {
		"require-trusted-types-for": ["'script'"],
		"trusted-types": ["default", "businessContent", "analytics", "'allow-duplicates'"],
	};
}

/**
 * Middleware helper for Trusted Types headers
 */
export function addTrustedTypesHeaders(response) {
	const csp = getTrustedTypesCSP();
	const cspString = Object.entries(csp)
		.map(([directive, values]) => `${directive} ${values.join(" ")}`)
		.join("; ");

	response.headers.set("Content-Security-Policy", cspString);
	return response;
}

export default getTrustedTypesManager;
