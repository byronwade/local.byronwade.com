/**
 * Dashboard Data Layer - Barrel Export
 * Unified exports for all dashboard data functionality
 */

// User Dashboard
export * from "./user";

// LocalHub Dashboard
export * from "./localhub";

// Shared Dashboard Utilities
export const DASHBOARD_TYPES = {
	USER: "user",
	LOCALHUB: "localhub",
	ADMIN: "admin",
};

export const DASHBOARD_REFRESH_INTERVALS = {
	STATS: 5 * 60 * 1000, // 5 minutes
	ACTIVITY: 2 * 60 * 1000, // 2 minutes
	HEALTH: 10 * 60 * 1000, // 10 minutes
};

/**
 * Generic dashboard data fetcher
 */
export const fetchDashboardData = async (dashboardType, userId, options = {}) => {
	switch (dashboardType) {
		case DASHBOARD_TYPES.USER:
			const { fetchUserDashboardStats } = await import("./user");
			return fetchUserDashboardStats(userId);

		case DASHBOARD_TYPES.LOCALHUB:
			const { fetchLocalHubDirectoryStats } = await import("./localhub");
			return fetchLocalHubDirectoryStats(options.directoryId);

		default:
			throw new Error(`Unknown dashboard type: ${dashboardType}`);
	}
};
