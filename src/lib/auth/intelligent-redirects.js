// REQUIRED: Intelligent Login Redirect Helpers
// Provides easy-to-use functions for contextual login redirects


/**
 * Intelligent redirect helpers for common authentication scenarios
 */
export class IntelligentAuthRedirects {
	/**
	 * Redirect to login with business-related context
	 */
	static redirectToLoginForBusiness(action = "add-business", businessId = null) {
		const params = new URLSearchParams();
		params.set("context", action);

		if (businessId) {
			params.set("business", businessId);
			params.set("business_action", action.replace("-business", ""));
		}

		const loginUrl = `/login?${params.toString()}`;

		if (typeof window !== "undefined") {
			window.location.href = loginUrl;
		}

		return loginUrl;
	}

	/**
	 * Redirect for adding a business
	 */
	static redirectToAddBusiness() {
		return this.redirectToLoginForBusiness("add-business");
	}

	/**
	 * Redirect for claiming a business
	 */
	static redirectToClaimBusiness(businessId = null) {
		return this.redirectToLoginForBusiness("claim-business", businessId);
	}

	/**
	 * Redirect for writing a review
	 */
	static redirectToWriteReview(businessId) {
		const params = new URLSearchParams();
		params.set("context", "write-review");
		params.set("business", businessId);
		params.set("business_action", "review");

		const loginUrl = `/login?${params.toString()}`;

		if (typeof window !== "undefined") {
			window.location.href = loginUrl;
		}

		return loginUrl;
	}

	/**
	 * Redirect for saving/favoriting a business
	 */
	static redirectToSaveBusiness(businessId) {
		const params = new URLSearchParams();
		params.set("context", "save-business");
		params.set("business", businessId);
		params.set("business_action", "save");

		const loginUrl = `/login?${params.toString()}`;

		if (typeof window !== "undefined") {
			window.location.href = loginUrl;
		}

		return loginUrl;
	}

	/**
	 * Redirect for booking a service
	 */
	static redirectToBookService(businessId) {
		const params = new URLSearchParams();
		params.set("context", "book-service");
		params.set("business", businessId);
		params.set("business_action", "book");

		const loginUrl = `/login?${params.toString()}`;

		if (typeof window !== "undefined") {
			window.location.href = loginUrl;
		}

		return loginUrl;
	}

	/**
	 * Redirect for accessing dashboard with role context
	 */
	static redirectToDashboard(role = "user") {
		const contextMap = {
			admin: "admin-access",
			business: "business-dashboard",
			user: "view-profile",
		};

		const params = new URLSearchParams();
		params.set("context", contextMap[role] || "view-profile");
		params.set("redirect", `/dashboard/${role}`);

		const loginUrl = `/login?${params.toString()}`;

		if (typeof window !== "undefined") {
			window.location.href = loginUrl;
		}

		return loginUrl;
	}

	/**
	 * Redirect for premium features
	 */
	static redirectToPremium() {
		const params = new URLSearchParams();
		params.set("context", "premium-features");
		params.set("redirect", "/premium");

		const loginUrl = `/login?${params.toString()}`;

		if (typeof window !== "undefined") {
			window.location.href = loginUrl;
		}

		return loginUrl;
	}

	/**
	 * Redirect for community access
	 */
	static redirectToCommunity() {
		const params = new URLSearchParams();
		params.set("context", "join-community");
		params.set("redirect", "/community");

		const loginUrl = `/login?${params.toString()}`;

		if (typeof window !== "undefined") {
			window.location.href = loginUrl;
		}

		return loginUrl;
	}

	/**
	 * Redirect for support access
	 */
	static redirectToSupport() {
		const params = new URLSearchParams();
		params.set("context", "get-support");
		params.set("redirect", "/support");

		const loginUrl = `/login?${params.toString()}`;

		if (typeof window !== "undefined") {
			window.location.href = loginUrl;
		}

		return loginUrl;
	}

	/**
	 * Generic context redirect with custom parameters
	 */
	static redirectWithContext(context, additionalParams = {}) {
		const params = new URLSearchParams();
		params.set("context", context);

		Object.entries(additionalParams).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				params.set(key, value.toString());
			}
		});

		const loginUrl = `/login?${params.toString()}`;

		if (typeof window !== "undefined") {
			window.location.href = loginUrl;
		}

		return loginUrl;
	}

	/**
	 * Create a context-aware redirect URL without navigating
	 */
	static createContextUrl(context, additionalParams = {}) {
		const params = new URLSearchParams();
		params.set("context", context);

		Object.entries(additionalParams).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				params.set(key, value.toString());
			}
		});

		return `/login?${params.toString()}`;
	}

	/**
	 * Create intelligent login button handler
	 */
	static createLoginHandler(context, additionalParams = {}) {
		return (event) => {
			event.preventDefault();
			return this.redirectWithContext(context, additionalParams);
		};
	}

	/**
	 * Create intelligent login link with context
	 */
	static createLoginLink(context, additionalParams = {}) {
		return this.createContextUrl(context, additionalParams);
	}
}

/**
 * React hook for intelligent authentication redirects
 */
export function useIntelligentAuth() {
	const createContextRedirect = (context, params = {}) => {
		return () => IntelligentAuthRedirects.redirectWithContext(context, params);
	};

	const createContextLink = (context, params = {}) => {
		return IntelligentAuthRedirects.createContextUrl(context, params);
	};

	return {
		redirectToAddBusiness: () => IntelligentAuthRedirects.redirectToAddBusiness(),
		redirectToClaimBusiness: (businessId) => IntelligentAuthRedirects.redirectToClaimBusiness(businessId),
		redirectToWriteReview: (businessId) => IntelligentAuthRedirects.redirectToWriteReview(businessId),
		redirectToSaveBusiness: (businessId) => IntelligentAuthRedirects.redirectToSaveBusiness(businessId),
		redirectToBookService: (businessId) => IntelligentAuthRedirects.redirectToBookService(businessId),
		redirectToDashboard: (role) => IntelligentAuthRedirects.redirectToDashboard(role),
		redirectToPremium: () => IntelligentAuthRedirects.redirectToPremium(),
		redirectToCommunity: () => IntelligentAuthRedirects.redirectToCommunity(),
		redirectToSupport: () => IntelligentAuthRedirects.redirectToSupport(),
		createContextRedirect,
		createContextLink,
		redirectWithContext: IntelligentAuthRedirects.redirectWithContext,
		createLoginHandler: IntelligentAuthRedirects.createLoginHandler,
	};
}

/**
 * Simple helper functions for common use cases
 */
export const redirectToLogin = {
	forAddingBusiness: () => IntelligentAuthRedirects.redirectToAddBusiness(),
	forClaimingBusiness: (businessId) => IntelligentAuthRedirects.redirectToClaimBusiness(businessId),
	forReview: (businessId) => IntelligentAuthRedirects.redirectToWriteReview(businessId),
	forSaving: (businessId) => IntelligentAuthRedirects.redirectToSaveBusiness(businessId),
	forBooking: (businessId) => IntelligentAuthRedirects.redirectToBookService(businessId),
	forDashboard: (role) => IntelligentAuthRedirects.redirectToDashboard(role),
	forPremium: () => IntelligentAuthRedirects.redirectToPremium(),
	forCommunity: () => IntelligentAuthRedirects.redirectToCommunity(),
	forSupport: () => IntelligentAuthRedirects.redirectToSupport(),
	withContext: (context, params) => IntelligentAuthRedirects.redirectWithContext(context, params),
};

export default IntelligentAuthRedirects;
