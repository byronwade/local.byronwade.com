/**
 * Enterprise Feature Flags for Search Experience
 * Progressive rollout of advanced search features
 */

import { flag } from "@vercel/flags/next";
import { get } from "@vercel/edge-config";

// Helper function to safely get from Edge Config
async function safeEdgeConfigGet<T>(key: string): Promise<T | null> {
	try {
		// Only attempt Edge Config if connection string is available
		if (!process.env.EDGE_CONFIG) {
			return null;
		}
		const result = await get<T>(key);
		return result ?? null;
	} catch (error: unknown) {
		// Silently fail and fall back to environment variables
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		console.warn(`Edge Config unavailable for key ${key}:`, errorMessage);
		return null;
	}
}

export const smartSearchFlag = flag<boolean>({
	key: "smart-search",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:smart-search");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_SMART_SEARCH;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default for better UX
	},
});

export const aiRecommendationsFlag = flag<boolean>({
	key: "ai-recommendations",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:ai-recommendations");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_AI_RECOMMENDATIONS;
		if (env === "true") return true;
		if (env === "false") return false;

		return false; // Gradual rollout
	},
});

export const visualSearchFlag = flag<boolean>({
	key: "visual-search",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:visual-search");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_VISUAL_SEARCH;
		if (env === "true") return true;
		if (env === "false") return false;

		return false; // Experimental feature
	},
});

export const voiceSearchFlag = flag<boolean>({
	key: "voice-search",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:voice-search");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_VOICE_SEARCH;
		if (env === "true") return true;
		if (env === "false") return false;

		return false; // Progressive enhancement
	},
});

export const contextualFiltersFlag = flag<boolean>({
	key: "contextual-filters",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:contextual-filters");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_CONTEXTUAL_FILTERS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enhance filtering experience
	},
});

export const realTimeUpdatesFlag = flag<boolean>({
	key: "realtime-updates",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:realtime-updates");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_REALTIME_UPDATES;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Live business status
	},
});

// Site feature flags
export const newNavigationFlag = flag<boolean>({
	key: "new-navigation",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:new-navigation");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_NEW_NAV;
		if (env === "true") return true;
		if (env === "false") return false;

		return false; // Keep current navigation by default
	},
});

export const linkedinCloneFlag = flag<boolean>({
	key: "linkedin-clone",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:linkedin-clone");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_LINKEDIN_CLONE;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const jobsAppFlag = flag<boolean>({
	key: "jobs-app",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:jobs-app");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_JOBS_APP;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const affiliatesFlag = flag<boolean>({
	key: "affiliates",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:affiliates");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_AFFILIATES;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const landingPagesFlag = flag<boolean>({
	key: "landing-pages",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:landing-pages");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_LANDING_PAGES;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const businessCertificationFlag = flag<boolean>({
	key: "business-certification",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:business-certification");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_BUSINESS_CERTIFICATION;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const investorRelationsFlag = flag<boolean>({
	key: "investor-relations",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:investor-relations");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_INVESTOR_RELATIONS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const aboutUsFlag = flag<boolean>({
	key: "about-us",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:about-us");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_ABOUT_US;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

// Dashboard core flags
export const dashboardCoreFlag = flag<boolean>({
	key: "dashboard-core",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-core");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_CORE;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

// Dashboard module flags
export const dashboardAnalyticsFlag = flag<boolean>({
	key: "dashboard-analytics",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-analytics");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_ANALYTICS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const dashboardBillingFlag = flag<boolean>({
	key: "dashboard-billing",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-billing");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_BILLING;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const dashboardMessagingFlag = flag<boolean>({
	key: "dashboard-messaging",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-messaging");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_MESSAGING;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const dashboardIntegrationsFlag = flag<boolean>({
	key: "dashboard-integrations",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-integrations");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_INTEGRATIONS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const dashboardDomainsFlag = flag<boolean>({
	key: "dashboard-domains",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-domains");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_DOMAINS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const dashboardJobsFlag = flag<boolean>({
	key: "dashboard-jobs",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-jobs");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_JOBS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const dashboardReviewsFlag = flag<boolean>({
	key: "dashboard-reviews",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-reviews");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_REVIEWS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const dashboardSupportFlag = flag<boolean>({
	key: "dashboard-support",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-support");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_SUPPORT;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

// Profile flags
export const profileCoreFlag = flag<boolean>({
	key: "profile-core",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:profile-core");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_PROFILE_CORE;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const profilePhotosFlag = flag<boolean>({
	key: "profile-photos",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:profile-photos");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_PROFILE_PHOTOS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const profileReviewsFlag = flag<boolean>({
	key: "profile-reviews",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:profile-reviews");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_PROFILE_REVIEWS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const profilePromotionsFlag = flag<boolean>({
	key: "profile-promotions",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:profile-promotions");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_PROFILE_PROMOTIONS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const profileMenusFlag = flag<boolean>({
	key: "profile-menus",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:profile-menus");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_PROFILE_MENUS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const profileHoursFlag = flag<boolean>({
	key: "profile-hours",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:profile-hours");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_PROFILE_HOURS;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const profileBookingFlag = flag<boolean>({
	key: "profile-booking",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:profile-booking");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_PROFILE_BOOKING;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const profileMessagingFlag = flag<boolean>({
	key: "profile-messaging",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:profile-messaging");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_PROFILE_MESSAGING;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const profileMapFlag = flag<boolean>({
	key: "profile-map",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:profile-map");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_PROFILE_MAP;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

export const profileCertificationBadgeFlag = flag<boolean>({
	key: "profile-certification-badge",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:profile-certification-badge");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_PROFILE_CERTIFICATION_BADGE;
		if (env === "true") return true;
		if (env === "false") return false;

		return true; // Enable by default
	},
});

// Demo flags
export const dashboardDemoBusinessFlag = flag<boolean>({
	key: "dashboard-demo-business",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-demo-business");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_DEMO_BUSINESS;
		if (env === "true") return true;
		if (env === "false") return false;

		return false; // Demo features off by default
	},
});

export const dashboardDemoLocalhubFlag = flag<boolean>({
	key: "dashboard-demo-localhub",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-demo-localhub");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_DEMO_LOCALHUB;
		if (env === "true") return true;
		if (env === "false") return false;

		return false; // Demo features off by default
	},
});

export const dashboardDemoAdminFlag = flag<boolean>({
	key: "dashboard-demo-admin",
	decide: async () => {
		const ec = await safeEdgeConfigGet<boolean>("feature:dashboard-demo-admin");
		if (typeof ec === "boolean") return ec;

		const env = process.env.NEXT_PUBLIC_FLAG_DASHBOARD_DEMO_ADMIN;
		if (env === "true") return true;
		if (env === "false") return false;

		return false; // Demo features off by default
	},
});

export const flags = {
	// Search flags
	smartSearch: smartSearchFlag,
	aiRecommendations: aiRecommendationsFlag,
	visualSearch: visualSearchFlag,
	voiceSearch: voiceSearchFlag,
	contextualFilters: contextualFiltersFlag,
	realTimeUpdates: realTimeUpdatesFlag,

	// Site feature flags
	newNavigation: newNavigationFlag,
	linkedinClone: linkedinCloneFlag,
	jobsApp: jobsAppFlag,
	affiliates: affiliatesFlag,
	landingPages: landingPagesFlag,
	businessCertification: businessCertificationFlag,
	investorRelations: investorRelationsFlag,
	aboutUs: aboutUsFlag,

	// Dashboard flags
	dashboardCore: dashboardCoreFlag,
	dashboardAnalytics: dashboardAnalyticsFlag,
	dashboardBilling: dashboardBillingFlag,
	dashboardMessaging: dashboardMessagingFlag,
	dashboardIntegrations: dashboardIntegrationsFlag,
	dashboardDomains: dashboardDomainsFlag,
	dashboardJobs: dashboardJobsFlag,
	dashboardReviews: dashboardReviewsFlag,
	dashboardSupport: dashboardSupportFlag,

	// Profile flags
	profileCore: profileCoreFlag,
	profilePhotos: profilePhotosFlag,
	profileReviews: profileReviewsFlag,
	profilePromotions: profilePromotionsFlag,
	profileMenus: profileMenusFlag,
	profileHours: profileHoursFlag,
	profileBooking: profileBookingFlag,
	profileMessaging: profileMessagingFlag,
	profileMap: profileMapFlag,
	profileCertificationBadge: profileCertificationBadgeFlag,

	// Demo flags
	dashboardDemoBusiness: dashboardDemoBusinessFlag,
	dashboardDemoLocalhub: dashboardDemoLocalhubFlag,
	dashboardDemoAdmin: dashboardDemoAdminFlag,
};
