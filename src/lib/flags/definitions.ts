import { flag } from "@vercel/flags/next";

/**
 * Enterprise feature flag definitions
 * SSR-first decisions with Edge Config fast-path and safe fallbacks.
 */
async function decideBoolean(edgeConfigKey: string, envVar: string | undefined, defaultValue: boolean): Promise<boolean> {
	// 1) Environment fast-path (avoids any remote calls and prevents throws)
	if (envVar === "true") return true;
	if (envVar === "false") return false;

	// 2) Edge Config (attempt only when EDGE_CONFIG connection string is present)
	if (process.env.EDGE_CONFIG) {
		try {
			const { get } = await import("@vercel/edge-config");
			const edgeConfigValue = await get<boolean>(edgeConfigKey);
			if (typeof edgeConfigValue === "boolean") return edgeConfigValue;
		} catch (_err) {
			// Swallow errors from Edge Config in non-configured environments
		}
	}

	// 3) Safe default
	return defaultValue;
}

export const newNavigationFlag = flag<boolean>({
	key: "new-navigation",
	decide: async (): Promise<boolean> => decideBoolean("feature:new-navigation", process.env.NEXT_PUBLIC_FLAG_NEW_NAV, false),
});

export const linkedinCloneFlag = flag<boolean>({
	key: "linkedin-clone",
	decide: async (): Promise<boolean> => decideBoolean("feature:linkedin-clone", process.env.NEXT_PUBLIC_FLAG_LINKEDIN_CLONE, true),
});

export const jobsAppFlag = flag<boolean>({
	key: "jobs-app",
	decide: async (): Promise<boolean> => decideBoolean("feature:jobs-app", process.env.NEXT_PUBLIC_FLAG_JOBS_APP, true),
});

export const affiliatesFlag = flag<boolean>({
	key: "affiliates",
	decide: async (): Promise<boolean> => decideBoolean("feature:affiliates", process.env.NEXT_PUBLIC_FLAG_AFFILIATES, true),
});

export const landingPagesFlag = flag<boolean>({
	key: "landing-pages",
	decide: async (): Promise<boolean> => decideBoolean("feature:landing-pages", process.env.NEXT_PUBLIC_FLAG_LANDING_PAGES, true),
});

export const businessCertificationFlag = flag<boolean>({
	key: "business-certification",
	decide: async (): Promise<boolean> => decideBoolean("feature:business-certification", process.env.NEXT_PUBLIC_FLAG_BUSINESS_CERTIFICATION, true),
});

export const investorRelationsFlag = flag<boolean>({
	key: "investor-relations",
	decide: async (): Promise<boolean> => decideBoolean("feature:investor-relations", process.env.NEXT_PUBLIC_FLAG_INVESTOR_RELATIONS, true),
});

export const aboutUsFlag = flag<boolean>({
	key: "about-us",
	decide: async (): Promise<boolean> => decideBoolean("feature:about-us", process.env.NEXT_PUBLIC_FLAG_ABOUT_US, true),
});

// Dashboard module flags
export const dashboardCoreFlag = flag<boolean>({ key: "dashboard-core", decide: async () => decideBoolean("feature:dashboard-core", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_CORE, true) });
export const dashboardAnalyticsFlag = flag<boolean>({ key: "dashboard-analytics", decide: async () => decideBoolean("feature:dashboard-analytics", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_ANALYTICS, true) });
export const dashboardBillingFlag = flag<boolean>({ key: "dashboard-billing", decide: async () => decideBoolean("feature:dashboard-billing", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_BILLING, true) });
export const dashboardMessagingFlag = flag<boolean>({ key: "dashboard-messaging", decide: async () => decideBoolean("feature:dashboard-messaging", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_MESSAGING, true) });
export const dashboardIntegrationsFlag = flag<boolean>({ key: "dashboard-integrations", decide: async () => decideBoolean("feature:dashboard-integrations", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_INTEGRATIONS, true) });
export const dashboardDomainsFlag = flag<boolean>({ key: "dashboard-domains", decide: async () => decideBoolean("feature:dashboard-domains", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_DOMAINS, true) });
export const dashboardJobsFlag = flag<boolean>({ key: "dashboard-jobs", decide: async () => decideBoolean("feature:dashboard-jobs", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_JOBS, true) });
export const dashboardReviewsFlag = flag<boolean>({ key: "dashboard-reviews", decide: async () => decideBoolean("feature:dashboard-reviews", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_REVIEWS, true) });
export const dashboardSupportFlag = flag<boolean>({ key: "dashboard-support", decide: async () => decideBoolean("feature:dashboard-support", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_SUPPORT, true) });

// Business profile section flags
export const profileCoreFlag = flag<boolean>({ key: "profile-core", decide: async () => decideBoolean("feature:profile-core", process.env.NEXT_PUBLIC_FLAG_PROFILE_CORE, true) });
export const profilePhotosFlag = flag<boolean>({ key: "profile-photos", decide: async () => decideBoolean("feature:profile-photos", process.env.NEXT_PUBLIC_FLAG_PROFILE_PHOTOS, true) });
export const profileReviewsFlag = flag<boolean>({ key: "profile-reviews", decide: async () => decideBoolean("feature:profile-reviews", process.env.NEXT_PUBLIC_FLAG_PROFILE_REVIEWS, true) });
export const profilePromotionsFlag = flag<boolean>({ key: "profile-promotions", decide: async () => decideBoolean("feature:profile-promotions", process.env.NEXT_PUBLIC_FLAG_PROFILE_PROMOTIONS, true) });
export const profileMenusFlag = flag<boolean>({ key: "profile-menus", decide: async () => decideBoolean("feature:profile-menus", process.env.NEXT_PUBLIC_FLAG_PROFILE_MENUS, true) });
export const profileHoursFlag = flag<boolean>({ key: "profile-hours", decide: async () => decideBoolean("feature:profile-hours", process.env.NEXT_PUBLIC_FLAG_PROFILE_HOURS, true) });
export const profileBookingFlag = flag<boolean>({ key: "profile-booking", decide: async () => decideBoolean("feature:profile-booking", process.env.NEXT_PUBLIC_FLAG_PROFILE_BOOKING, true) });
export const profileMessagingFlag = flag<boolean>({ key: "profile-messaging", decide: async () => decideBoolean("feature:profile-messaging", process.env.NEXT_PUBLIC_FLAG_PROFILE_MESSAGING, true) });
export const profileMapFlag = flag<boolean>({ key: "profile-map", decide: async () => decideBoolean("feature:profile-map", process.env.NEXT_PUBLIC_FLAG_PROFILE_MAP, true) });
export const profileCertificationBadgeFlag = flag<boolean>({ key: "profile-certification-badge", decide: async () => decideBoolean("feature:profile-certification-badge", process.env.NEXT_PUBLIC_FLAG_PROFILE_CERTIFICATION_BADGE, true) });

// Demo mode flags for dashboards (fake data short-circuit)
export const dashboardDemoBusinessFlag = flag<boolean>({
	key: "dashboard-demo-business",
	decide: async (): Promise<boolean> => decideBoolean("feature:dashboard-demo-business", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_DEMO_BUSINESS, false),
});

export const dashboardDemoLocalhubFlag = flag<boolean>({
	key: "dashboard-demo-localhub",
	decide: async (): Promise<boolean> => decideBoolean("feature:dashboard-demo-localhub", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_DEMO_LOCALHUB, false),
});

export const dashboardDemoAdminFlag = flag<boolean>({
	key: "dashboard-demo-admin",
	decide: async (): Promise<boolean> => decideBoolean("feature:dashboard-demo-admin", process.env.NEXT_PUBLIC_FLAG_DASHBOARD_DEMO_ADMIN, false),
});

export const flags = {
	newNavigation: newNavigationFlag,
	linkedinClone: linkedinCloneFlag,
	jobsApp: jobsAppFlag,
	affiliates: affiliatesFlag,
	landingPages: landingPagesFlag,
	businessCertification: businessCertificationFlag,
	investorRelations: investorRelationsFlag,
	aboutUs: aboutUsFlag,
	// Dashboard
	dashboardCore: dashboardCoreFlag,
	dashboardAnalytics: dashboardAnalyticsFlag,
	dashboardBilling: dashboardBillingFlag,
	dashboardMessaging: dashboardMessagingFlag,
	dashboardIntegrations: dashboardIntegrationsFlag,
	dashboardDomains: dashboardDomainsFlag,
	dashboardJobs: dashboardJobsFlag,
	dashboardReviews: dashboardReviewsFlag,
	dashboardSupport: dashboardSupportFlag,
	// Business profile
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
	// Demo
	dashboardDemoBusiness: dashboardDemoBusinessFlag,
	dashboardDemoLocalhub: dashboardDemoLocalhubFlag,
	dashboardDemoAdmin: dashboardDemoAdminFlag,
};

export type FlagKey = keyof typeof flags;

/**
 * Human-readable documentation for feature flags
 */
export const flagDocs: Array<{
	key: FlagKey;
	edgeKey: string;
	envVar: string;
	defaultValue: boolean;
	description: string;
}> = [
	{
		key: "newNavigation",
		edgeKey: "feature:new-navigation",
		envVar: "NEXT_PUBLIC_FLAG_NEW_NAV",
		defaultValue: false,
		description: "Enable new global navigation experiments",
	},
	{
		key: "linkedinClone",
		edgeKey: "feature:linkedin-clone",
		envVar: "NEXT_PUBLIC_FLAG_LINKEDIN_CLONE",
		defaultValue: true,
		description: "Expose the network (LinkedIn-style) area",
	},
	{
		key: "jobsApp",
		edgeKey: "feature:jobs-app",
		envVar: "NEXT_PUBLIC_FLAG_JOBS_APP",
		defaultValue: true,
		description: "Expose the jobs application and routes",
	},
	{
		key: "affiliates",
		edgeKey: "feature:affiliates",
		envVar: "NEXT_PUBLIC_FLAG_AFFILIATES",
		defaultValue: true,
		description: "Expose the affiliates marketing page",
	},
	{
		key: "landingPages",
		edgeKey: "feature:landing-pages",
		envVar: "NEXT_PUBLIC_FLAG_LANDING_PAGES",
		defaultValue: true,
		description: "Enable all marketing landing pages",
	},
	{
		key: "businessCertification",
		edgeKey: "feature:business-certification",
		envVar: "NEXT_PUBLIC_FLAG_BUSINESS_CERTIFICATION",
		defaultValue: true,
		description: "Expose Business Certification pages",
	},
	{
		key: "investorRelations",
		edgeKey: "feature:investor-relations",
		envVar: "NEXT_PUBLIC_FLAG_INVESTOR_RELATIONS",
		defaultValue: true,
		description: "Expose Investor Relations content",
	},
	{
		key: "aboutUs",
		edgeKey: "feature:about-us",
		envVar: "NEXT_PUBLIC_FLAG_ABOUT_US",
		defaultValue: true,
		description: "Expose About Us page",
	},
	{ key: "dashboardDemoBusiness", edgeKey: "feature:dashboard-demo-business", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_DEMO_BUSINESS", defaultValue: false, description: "Serve fake data for Business dashboard APIs (no auth required)" },
	{ key: "dashboardDemoLocalhub", edgeKey: "feature:dashboard-demo-localhub", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_DEMO_LOCALHUB", defaultValue: false, description: "Serve fake data for LocalHub dashboard APIs (no auth required)" },
	{ key: "dashboardDemoAdmin", edgeKey: "feature:dashboard-demo-admin", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_DEMO_ADMIN", defaultValue: false, description: "Serve fake data for Admin dashboard APIs (no auth required)" },
	{ key: "dashboardCore", edgeKey: "feature:dashboard-core", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_CORE", defaultValue: true, description: "Enable dashboard shell & core routes" },
	{ key: "dashboardAnalytics", edgeKey: "feature:dashboard-analytics", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_ANALYTICS", defaultValue: true, description: "Analytics modules (overview, insights, reports)" },
	{ key: "dashboardBilling", edgeKey: "feature:dashboard-billing", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_BILLING", defaultValue: true, description: "Billing settings and invoices" },
	{ key: "dashboardMessaging", edgeKey: "feature:dashboard-messaging", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_MESSAGING", defaultValue: true, description: "Inbox, calls, IVR, team chat" },
	{ key: "dashboardIntegrations", edgeKey: "feature:dashboard-integrations", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_INTEGRATIONS", defaultValue: true, description: "Third‑party integrations pages" },
	{ key: "dashboardDomains", edgeKey: "feature:dashboard-domains", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_DOMAINS", defaultValue: true, description: "Domain management" },
	{ key: "dashboardJobs", edgeKey: "feature:dashboard-jobs", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_JOBS", defaultValue: true, description: "Jobs modules inside dashboard" },
	{ key: "dashboardReviews", edgeKey: "feature:dashboard-reviews", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_REVIEWS", defaultValue: true, description: "Reviews management inside dashboard" },
	{ key: "dashboardSupport", edgeKey: "feature:dashboard-support", envVar: "NEXT_PUBLIC_FLAG_DASHBOARD_SUPPORT", defaultValue: true, description: "Support center inside dashboard" },
	{ key: "profileCore", edgeKey: "feature:profile-core", envVar: "NEXT_PUBLIC_FLAG_PROFILE_CORE", defaultValue: true, description: "Business profile main overview" },
	{ key: "profilePhotos", edgeKey: "feature:profile-photos", envVar: "NEXT_PUBLIC_FLAG_PROFILE_PHOTOS", defaultValue: true, description: "Media/photos section" },
	{ key: "profileReviews", edgeKey: "feature:profile-reviews", envVar: "NEXT_PUBLIC_FLAG_PROFILE_REVIEWS", defaultValue: true, description: "Reviews section" },
	{ key: "profilePromotions", edgeKey: "feature:profile-promotions", envVar: "NEXT_PUBLIC_FLAG_PROFILE_PROMOTIONS", defaultValue: true, description: "Referrals/promotions section" },
	{ key: "profileMenus", edgeKey: "feature:profile-menus", envVar: "NEXT_PUBLIC_FLAG_PROFILE_MENUS", defaultValue: true, description: "Menus/services section" },
	{ key: "profileHours", edgeKey: "feature:profile-hours", envVar: "NEXT_PUBLIC_FLAG_PROFILE_HOURS", defaultValue: true, description: "Hours section" },
	{ key: "profileBooking", edgeKey: "feature:profile-booking", envVar: "NEXT_PUBLIC_FLAG_PROFILE_BOOKING", defaultValue: true, description: "Online booking" },
	{ key: "profileMessaging", edgeKey: "feature:profile-messaging", envVar: "NEXT_PUBLIC_FLAG_PROFILE_MESSAGING", defaultValue: true, description: "Messaging on profile" },
	{ key: "profileMap", edgeKey: "feature:profile-map", envVar: "NEXT_PUBLIC_FLAG_PROFILE_MAP", defaultValue: true, description: "Map/location section" },
	{ key: "profileCertificationBadge", edgeKey: "feature:profile-certification-badge", envVar: "NEXT_PUBLIC_FLAG_PROFILE_CERTIFICATION_BADGE", defaultValue: true, description: "Certified badge on profile" },
];
