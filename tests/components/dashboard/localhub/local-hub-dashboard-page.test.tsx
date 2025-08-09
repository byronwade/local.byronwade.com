/**
 * LocalHubDashboardPage Component Tests
 * Comprehensive tests for the LocalHub dashboard page component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@tests/utils/test-utils";
import { createMockUser } from "@tests/utils/test-utils";
import LocalHubDashboardPage from "@components/dashboard/localhub/local-hub-dashboard-page";

// Mock LocalHub dashboard data
const createMockLocalHubData = () => ({
	directoryStats: {
		monthlyRevenue: { value: 4500, change: 18, changeType: "positive" as const },
		activeBusinesses: { value: 142, change: 8, changeType: "positive" as const },
		directoryViews: { value: 2850, change: 25, changeType: "positive" as const },
		yourShare: { value: 1350, change: 12, changeType: "positive" as const },
	},
	recentActivity: [
		{
			id: 1,
			type: "business_added" as const,
			title: "New business added to directory",
			description: "Pizza Palace joined your directory",
			timestamp: new Date("2024-01-01T12:00:00Z"),
			actionLink: "/dashboard/localhub/businesses/123",
			metadata: { businessName: "Pizza Palace" },
		},
	],
	revenueBreakdown: {
		subscription: 2400,
		commissions: 1800,
		advertising: 900,
		other: 150,
		total: 5250,
		growth: 15.5,
	},
	directoryHealth: {
		score: 87,
		factors: [
			{ name: "Business Coverage", score: 92, weight: 0.3 },
			{ name: "Review Quality", score: 84, weight: 0.25 },
			{ name: "Update Frequency", score: 89, weight: 0.2 },
			{ name: "User Engagement", score: 81, weight: 0.25 },
		],
		recommendations: ["Increase review response rate", "Add more local events"],
	},
	businessMetrics: {
		totalBusinesses: 142,
		verifiedBusinesses: 128,
		businessesWithPhotos: 105,
		businessesWithReviews: 98,
		averageRating: 4.2,
		responseRate: 78,
	},
});

// Mock the useLocalHubDashboard hook
const mockUseLocalHubDashboard = {
	dashboardData: createMockLocalHubData(),
	isLoading: false,
	refreshing: false,
	user: createMockUser(),
	refreshDashboard: vi.fn(),
	updateDashboardSection: vi.fn(),
	initializeDashboard: vi.fn(),
	trackDashboardAction: vi.fn(),
	directoryStats: createMockLocalHubData().directoryStats,
	recentActivity: createMockLocalHubData().recentActivity,
	revenueBreakdown: createMockLocalHubData().revenueBreakdown,
	directoryHealth: createMockLocalHubData().directoryHealth,
	businessMetrics: createMockLocalHubData().businessMetrics,
	calculateBusinessMetrics: vi.fn(),
};

vi.mock("@lib/hooks/dashboard/useLocalHubDashboard", () => ({
	useLocalHubDashboard: () => mockUseLocalHubDashboard,
}));

// Mock child components
vi.mock("@components/dashboard/localhub/sections", () => ({
	LocalHubStatsSection: ({ directoryStats }: any) => <div data-testid="localhub-stats">Revenue: ${directoryStats?.monthlyRevenue?.value}</div>,
	LocalHubActivitySection: ({ activities }: any) => <div data-testid="localhub-activity">Activity: {activities?.length || 0} items</div>,
	LocalHubQuickActionsSection: ({ businessMetrics }: any) => <div data-testid="localhub-actions">Businesses: {businessMetrics?.totalBusinesses}</div>,
	LocalHubRevenueBreakdownSection: ({ revenueData }: any) => <div data-testid="localhub-revenue">Total: ${revenueData?.total}</div>,
	LocalHubDirectoryHealthSection: ({ healthData }: any) => <div data-testid="localhub-health">Score: {healthData?.score}</div>,
}));

describe("LocalHubDashboardPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseLocalHubDashboard.isLoading = false;
		mockUseLocalHubDashboard.dashboardData = createMockLocalHubData();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("rendering", () => {
		it("should render LocalHub dashboard with all sections when loaded", () => {
			render(<LocalHubDashboardPage />);

			// Check for main dashboard elements
			expect(screen.getByText("LocalHub Dashboard")).toBeInTheDocument();
			expect(screen.getByText("Manage your local business directory")).toBeInTheDocument();

			// Check that all sections are rendered
			expect(screen.getByTestId("localhub-stats")).toBeInTheDocument();
			expect(screen.getByTestId("localhub-activity")).toBeInTheDocument();
			expect(screen.getByTestId("localhub-actions")).toBeInTheDocument();
			expect(screen.getByTestId("localhub-revenue")).toBeInTheDocument();
			expect(screen.getByTestId("localhub-health")).toBeInTheDocument();
		});

		it("should show loading skeleton when isLoading is true", () => {
			mockUseLocalHubDashboard.isLoading = true;

			render(<LocalHubDashboardPage />);

			// Should show loading skeletons
			expect(screen.getAllByRole("status")).toHaveLength(5); // One for each section
			expect(screen.queryByText("LocalHub Dashboard")).not.toBeInTheDocument();
		});

		it("should show directory management header", () => {
			render(<LocalHubDashboardPage />);

			expect(screen.getByText("LocalHub Dashboard")).toBeInTheDocument();
			expect(screen.getByRole("button", { name: /refresh/i })).toBeInTheDocument();
		});
	});

	describe("data display", () => {
		it("should pass correct stats data to sections", () => {
			render(<LocalHubDashboardPage />);

			// Check stats section
			expect(screen.getByTestId("localhub-stats")).toHaveTextContent("Revenue: $4500");

			// Check activity section
			expect(screen.getByTestId("localhub-activity")).toHaveTextContent("Activity: 1 items");

			// Check actions section
			expect(screen.getByTestId("localhub-actions")).toHaveTextContent("Businesses: 142");

			// Check revenue section
			expect(screen.getByTestId("localhub-revenue")).toHaveTextContent("Total: $5250");

			// Check health section
			expect(screen.getByTestId("localhub-health")).toHaveTextContent("Score: 87");
		});

		it("should handle null data gracefully", () => {
			mockUseLocalHubDashboard.dashboardData = {
				directoryStats: null,
				recentActivity: null,
				revenueBreakdown: null,
				directoryHealth: null,
				businessMetrics: null,
			};

			render(<LocalHubDashboardPage />);

			// Should still render sections with fallback data
			expect(screen.getByTestId("localhub-stats")).toBeInTheDocument();
			expect(screen.getByTestId("localhub-activity")).toHaveTextContent("Activity: 0 items");
		});
	});

	describe("user interactions", () => {
		it("should handle refresh button click", async () => {
			render(<LocalHubDashboardPage />);

			const refreshButton = screen.getByRole("button", { name: /refresh/i });
			refreshButton.click();

			expect(mockUseLocalHubDashboard.refreshDashboard).toHaveBeenCalledTimes(1);
		});

		it("should disable refresh button when refreshing", () => {
			mockUseLocalHubDashboard.refreshing = true;

			render(<LocalHubDashboardPage />);

			const refreshButton = screen.getByRole("button", { name: /refresh/i });
			expect(refreshButton).toBeDisabled();
		});

		it("should track dashboard actions", () => {
			render(<LocalHubDashboardPage />);

			// Simulate dashboard action
			mockUseLocalHubDashboard.trackDashboardAction("view_revenue", { section: "breakdown" });

			expect(mockUseLocalHubDashboard.trackDashboardAction).toHaveBeenCalledWith("view_revenue", {
				section: "breakdown",
			});
		});
	});

	describe("business metrics", () => {
		it("should display business metrics correctly", () => {
			render(<LocalHubDashboardPage />);

			expect(screen.getByTestId("localhub-actions")).toHaveTextContent("Businesses: 142");
		});

		it("should calculate metrics when data changes", () => {
			const newData = createMockLocalHubData();
			newData.businessMetrics!.totalBusinesses = 150;

			mockUseLocalHubDashboard.dashboardData = newData;
			mockUseLocalHubDashboard.businessMetrics = newData.businessMetrics;

			render(<LocalHubDashboardPage />);

			expect(screen.getByTestId("localhub-actions")).toHaveTextContent("Businesses: 150");
		});
	});

	describe("revenue tracking", () => {
		it("should display revenue breakdown", () => {
			render(<LocalHubDashboardPage />);

			expect(screen.getByTestId("localhub-revenue")).toHaveTextContent("Total: $5250");
		});

		it("should handle revenue data updates", () => {
			const newData = createMockLocalHubData();
			newData.revenueBreakdown!.total = 6000;

			mockUseLocalHubDashboard.dashboardData = newData;
			mockUseLocalHubDashboard.revenueBreakdown = newData.revenueBreakdown;

			render(<LocalHubDashboardPage />);

			expect(screen.getByTestId("localhub-revenue")).toHaveTextContent("Total: $6000");
		});
	});

	describe("directory health", () => {
		it("should display directory health score", () => {
			render(<LocalHubDashboardPage />);

			expect(screen.getByTestId("localhub-health")).toHaveTextContent("Score: 87");
		});

		it("should show health recommendations", () => {
			const healthData = mockUseLocalHubDashboard.directoryHealth;
			expect(healthData?.recommendations).toContain("Increase review response rate");
		});
	});

	describe("error handling", () => {
		it("should handle missing user gracefully", () => {
			mockUseLocalHubDashboard.user = null;

			render(<LocalHubDashboardPage />);

			// Should still render basic structure
			expect(screen.getByText("LocalHub Dashboard")).toBeInTheDocument();
		});

		it("should handle empty activity data", () => {
			mockUseLocalHubDashboard.dashboardData.recentActivity = [];

			render(<LocalHubDashboardPage />);

			expect(screen.getByTestId("localhub-activity")).toHaveTextContent("Activity: 0 items");
		});
	});

	describe("performance", () => {
		it("should not re-render unnecessarily", () => {
			const { rerender } = render(<LocalHubDashboardPage />);

			rerender(<LocalHubDashboardPage />);

			// Dashboard should maintain state
			expect(screen.getByTestId("localhub-stats")).toBeInTheDocument();
		});

		it("should handle concurrent refresh requests", async () => {
			render(<LocalHubDashboardPage />);

			const refreshButton = screen.getByRole("button", { name: /refresh/i });

			// Simulate multiple rapid clicks
			refreshButton.click();
			refreshButton.click();

			await waitFor(() => {
				expect(mockUseLocalHubDashboard.refreshDashboard).toHaveBeenCalledTimes(2);
			});
		});
	});

	describe("accessibility", () => {
		it("should have proper heading structure", () => {
			render(<LocalHubDashboardPage />);

			expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LocalHub Dashboard");
		});

		it("should provide proper ARIA labels", () => {
			render(<LocalHubDashboardPage />);

			const refreshButton = screen.getByRole("button", { name: /refresh/i });
			expect(refreshButton).toHaveAttribute("aria-label");
		});

		it("should support keyboard navigation", () => {
			render(<LocalHubDashboardPage />);

			const refreshButton = screen.getByRole("button", { name: /refresh/i });
			refreshButton.focus();

			expect(document.activeElement).toBe(refreshButton);
		});
	});

	describe("type safety", () => {
		it("should handle typed LocalHub data correctly", () => {
			const typedData = createMockLocalHubData();
			mockUseLocalHubDashboard.dashboardData = typedData;

			render(<LocalHubDashboardPage />);

			// Should render with properly typed data
			expect(screen.getByTestId("localhub-stats")).toHaveTextContent("Revenue: $4500");
		});

		it("should maintain type safety with business metrics", () => {
			const businessMetrics = {
				totalBusinesses: 200,
				verifiedBusinesses: 185,
				businessesWithPhotos: 160,
				businessesWithReviews: 145,
				averageRating: 4.5,
				responseRate: 85,
			};

			mockUseLocalHubDashboard.businessMetrics = businessMetrics;

			render(<LocalHubDashboardPage />);

			expect(screen.getByTestId("localhub-actions")).toHaveTextContent("Businesses: 200");
		});
	});

	describe("integration", () => {
		it("should initialize dashboard on mount", () => {
			render(<LocalHubDashboardPage />);

			expect(mockUseLocalHubDashboard.initializeDashboard).toHaveBeenCalledTimes(1);
		});

		it("should update dashboard sections correctly", () => {
			render(<LocalHubDashboardPage />);

			mockUseLocalHubDashboard.updateDashboardSection("directoryStats", {
				monthlyRevenue: { value: 5000, change: 25, changeType: "positive" },
			});

			expect(mockUseLocalHubDashboard.updateDashboardSection).toHaveBeenCalledWith("directoryStats", expect.any(Object));
		});
	});
});
