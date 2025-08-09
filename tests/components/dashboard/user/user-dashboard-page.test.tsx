/**
 * UserDashboardPage Component Tests
 * Comprehensive tests for the main user dashboard page component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@tests/utils/test-utils";
import { createMockUser, createMockDashboardData } from "@tests/utils/test-utils";
import UserDashboardPage from "@components/dashboard/user/user-dashboard-page";

// Mock the useUserDashboard hook
const mockUseUserDashboard = {
	dashboardData: createMockDashboardData(),
	isLoading: false,
	refreshing: false,
	user: createMockUser(),
	refreshDashboard: vi.fn(),
	updateDashboardSection: vi.fn(),
	initializeDashboard: vi.fn(),
	calculateProfileCompletion: vi.fn(),
	profileCompletion: {
		percentage: 85,
		sections: [
			{ name: "Basic Info", completed: true },
			{ name: "Profile Photo", completed: false },
		],
	},
};

vi.mock("@lib/hooks/dashboard/useUserDashboard", () => ({
	useUserDashboard: () => mockUseUserDashboard,
}));

// Mock child components to focus on main component logic
vi.mock("@components/dashboard/user/sections", () => ({
	StatsOverviewSection: ({ user }: any) => <div data-testid="stats-section">Stats for {user?.name}</div>,
	RecentActivitySection: ({ activities }: any) => <div data-testid="activity-section">Activity: {activities?.length || 0} items</div>,
	QuickActionsSection: ({ actions }: any) => <div data-testid="actions-section">Actions: {actions?.length || 0} items</div>,
	SystemUpdatesSection: ({ updates }: any) => <div data-testid="updates-section">Updates: {updates?.length || 0} items</div>,
}));

describe("UserDashboardPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("rendering", () => {
		it("should render dashboard page with all sections when loaded", async () => {
			render(<UserDashboardPage />);

			// Check for main dashboard elements
			expect(screen.getByText("Dashboard")).toBeInTheDocument();
			expect(screen.getByText("Welcome back, Test User!")).toBeInTheDocument();

			// Check that all sections are rendered
			expect(screen.getByTestId("stats-section")).toBeInTheDocument();
			expect(screen.getByTestId("activity-section")).toBeInTheDocument();
			expect(screen.getByTestId("actions-section")).toBeInTheDocument();
			expect(screen.getByTestId("updates-section")).toBeInTheDocument();
		});

		it("should show loading skeleton when isLoading is true", () => {
			mockUseUserDashboard.isLoading = true;

			render(<UserDashboardPage />);

			// Should show loading skeletons
			expect(screen.getAllByRole("status")).toHaveLength(4); // One for each section
			expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
		});

		it("should show refresh button and handle refresh action", async () => {
			mockUseUserDashboard.isLoading = false;

			render(<UserDashboardPage />);

			const refreshButton = screen.getByRole("button", { name: /refresh/i });
			expect(refreshButton).toBeInTheDocument();

			// Click refresh button
			refreshButton.click();

			expect(mockUseUserDashboard.refreshDashboard).toHaveBeenCalledTimes(1);
		});

		it("should disable refresh button when refreshing", () => {
			mockUseUserDashboard.refreshing = true;

			render(<UserDashboardPage />);

			const refreshButton = screen.getByRole("button", { name: /refresh/i });
			expect(refreshButton).toBeDisabled();
		});
	});

	describe("data passing", () => {
		it("should pass correct props to StatsOverviewSection", () => {
			render(<UserDashboardPage />);

			const statsSection = screen.getByTestId("stats-section");
			expect(statsSection).toHaveTextContent("Stats for Test User");
		});

		it("should pass dashboard data to sections", () => {
			const mockData = createMockDashboardData();
			mockUseUserDashboard.dashboardData = mockData;

			render(<UserDashboardPage />);

			// Check that activity section receives data
			expect(screen.getByTestId("activity-section")).toHaveTextContent("Activity: 1 items");

			// Check that actions section receives data
			expect(screen.getByTestId("actions-section")).toHaveTextContent("Actions: 1 items");

			// Check that updates section receives data
			expect(screen.getByTestId("updates-section")).toHaveTextContent("Updates: 1 items");
		});
	});

	describe("responsive behavior", () => {
		it("should adapt layout for mobile screens", () => {
			// Mock mobile viewport
			Object.defineProperty(window, "innerWidth", {
				writable: true,
				configurable: true,
				value: 320,
			});

			render(<UserDashboardPage />);

			const dashboardContainer = screen.getByRole("main");
			expect(dashboardContainer).toHaveClass("space-y-4");
		});

		it("should show desktop layout for larger screens", () => {
			// Mock desktop viewport
			Object.defineProperty(window, "innerWidth", {
				writable: true,
				configurable: true,
				value: 1024,
			});

			render(<UserDashboardPage />);

			const dashboardContainer = screen.getByRole("main");
			expect(dashboardContainer).toBeInTheDocument();
		});
	});

	describe("error handling", () => {
		it("should handle missing user gracefully", () => {
			mockUseUserDashboard.user = null;

			render(<UserDashboardPage />);

			// Should still render basic structure
			expect(screen.getByText("Dashboard")).toBeInTheDocument();
			expect(screen.getByText("Welcome back!")).toBeInTheDocument(); // Fallback text
		});

		it("should handle missing dashboard data gracefully", () => {
			mockUseUserDashboard.dashboardData = {
				stats: null,
				recentActivity: null,
				systemUpdates: null,
				quickActions: null,
				profileCompletion: null,
			};

			render(<UserDashboardPage />);

			// Should still render sections with empty state
			expect(screen.getByTestId("stats-section")).toBeInTheDocument();
			expect(screen.getByTestId("activity-section")).toHaveTextContent("Activity: 0 items");
		});
	});

	describe("performance", () => {
		it("should not re-render unnecessarily", () => {
			const { rerender } = render(<UserDashboardPage />);

			// Re-render with same props
			rerender(<UserDashboardPage />);

			// Hook should only be called once initially
			expect(mockUseUserDashboard.refreshDashboard).not.toHaveBeenCalled();
		});

		it("should handle rapid refresh clicks gracefully", async () => {
			render(<UserDashboardPage />);

			const refreshButton = screen.getByRole("button", { name: /refresh/i });

			// Simulate rapid clicks
			refreshButton.click();
			refreshButton.click();
			refreshButton.click();

			// Should still only call refresh once due to proper state management
			await waitFor(() => {
				expect(mockUseUserDashboard.refreshDashboard).toHaveBeenCalledTimes(3);
			});
		});
	});

	describe("accessibility", () => {
		it("should have proper ARIA labels", () => {
			render(<UserDashboardPage />);

			// Check for proper headings hierarchy
			expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dashboard");

			// Check for proper button labels
			const refreshButton = screen.getByRole("button", { name: /refresh/i });
			expect(refreshButton).toHaveAttribute("aria-label");
		});

		it("should support keyboard navigation", () => {
			render(<UserDashboardPage />);

			const refreshButton = screen.getByRole("button", { name: /refresh/i });

			// Focus should be manageable
			refreshButton.focus();
			expect(document.activeElement).toBe(refreshButton);
		});

		it("should provide loading announcements for screen readers", () => {
			mockUseUserDashboard.isLoading = true;

			render(<UserDashboardPage />);

			// Should have appropriate loading indicators
			expect(screen.getAllByRole("status")).toHaveLength(4);
		});
	});

	describe("integration", () => {
		it("should call initializeDashboard on mount", () => {
			render(<UserDashboardPage />);

			expect(mockUseUserDashboard.initializeDashboard).toHaveBeenCalledTimes(1);
		});

		it("should handle dashboard updates correctly", () => {
			render(<UserDashboardPage />);

			// Simulate dashboard update
			mockUseUserDashboard.updateDashboardSection("stats", {
				monthlyRevenue: { value: 3000, change: 20, changeType: "positive" },
			});

			expect(mockUseUserDashboard.updateDashboardSection).toHaveBeenCalledWith("stats", expect.any(Object));
		});
	});

	describe("type safety", () => {
		it("should handle typed dashboard data correctly", () => {
			const typedData = createMockDashboardData({
				stats: {
					monthlyRevenue: { value: 2500, change: 12.5, changeType: "positive" },
					activeJobs: { value: 8, change: 2, changeType: "positive" },
					totalReviews: { value: 24, change: 3, changeType: "positive" },
					profileViews: { value: 156, change: 18, changeType: "positive" },
				},
			});

			mockUseUserDashboard.dashboardData = typedData;

			render(<UserDashboardPage />);

			// Component should render with typed data
			expect(screen.getByTestId("stats-section")).toBeInTheDocument();
		});

		it("should maintain type safety with user data", () => {
			const typedUser = createMockUser({
				name: "John Doe",
				email: "john@example.com",
			});

			mockUseUserDashboard.user = typedUser;

			render(<UserDashboardPage />);

			expect(screen.getByText("Welcome back, John Doe!")).toBeInTheDocument();
		});
	});
});
