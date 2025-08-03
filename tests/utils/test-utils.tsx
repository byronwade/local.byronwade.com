/**
 * Test Utilities
 * Common utilities and helpers for component testing
 */

import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi, expect } from "vitest";
import type { User, DashboardData, AdFormData, JobFormData } from "@types/index";

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	return <div data-testid="test-wrapper">{children}</div>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Custom matchers
expect.extend({
	toBeInTheDocument: (received) => {
		const pass = received !== null && received !== undefined;
		return {
			message: () => `expected element ${pass ? "not " : ""}to be in the document`,
			pass,
		};
	},
});

// Mock data factories
export const createMockUser = (overrides: Partial<User> = {}): User => ({
	id: "user-123",
	email: "test@example.com",
	name: "Test User",
	avatar_url: "https://example.com/avatar.jpg",
	phone: "+1234567890",
	created_at: "2024-01-01T00:00:00Z",
	updated_at: "2024-01-01T00:00:00Z",
	last_sign_in_at: "2024-01-01T00:00:00Z",
	email_verified: true,
	phone_verified: false,
	status: "active",
	role: "user",
	preferences: {
		notifications: true,
		newsletter: false,
		language: "en",
		timezone: "UTC",
		theme: "light",
	},
	profile: {
		bio: "Test user bio",
		location: "Test City",
		website: "https://example.com",
		social_links: {},
		verification_status: "pending",
		public_visibility: true,
	},
	...overrides,
});

export const createMockDashboardData = (overrides: Partial<DashboardData> = {}): DashboardData => ({
	stats: {
		monthlyRevenue: { value: 2500, change: 12.5, changeType: "positive" },
		activeJobs: { value: 8, change: 2, changeType: "positive" },
		totalReviews: { value: 24, change: 3, changeType: "positive" },
		profileViews: { value: 156, change: 18, changeType: "positive" },
	},
	recentActivity: [
		{
			id: 1,
			type: "job_application",
			title: "New job application received",
			description: "John Doe applied for your plumbing job",
			timestamp: new Date("2024-01-01T12:00:00Z"),
			actionLink: "/dashboard/user/jobs/1",
			metadata: { applicantName: "John Doe" },
		},
	],
	systemUpdates: [
		{
			id: 1,
			type: "feature",
			title: "New dashboard feature",
			description: "Enhanced analytics now available",
			version: "v2.1.0",
			date: "2024-01-01",
			isImportant: true,
			actionUrl: "/features/analytics",
		},
	],
	quickActions: [
		{
			id: "post-job",
			title: "Post a Job",
			description: "Find skilled professionals",
			icon: "Briefcase",
			href: "/dashboard/user/jobs/create",
			category: "jobs",
		},
	],
	profileCompletion: {
		percentage: 85,
		sections: [
			{ name: "Basic Info", completed: true },
			{ name: "Profile Photo", completed: false },
		],
	},
	...overrides,
});

export const createMockAdFormData = (overrides: Partial<AdFormData> = {}): AdFormData => ({
	name: "Test Campaign",
	type: "search",
	location: "Test City",
	radius: "10",
	headline: "Professional Plumbing Services",
	description: "Expert plumbing services for your home and business needs.",
	cta: "Get Quote",
	keywords: "plumbing, repair, installation",
	demographics: ["Age 25-34", "Homeowners"],
	interests: ["Home Improvement"],
	excludedKeywords: "cheap, discount",
	budget: 100,
	duration: 30,
	schedule: {
		startDate: "2024-01-01",
		endDate: "2024-01-31",
		timeOfDay: "all",
		daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
	},
	termsAccepted: true,
	billingAccepted: true,
	...overrides,
});

export const createMockJobFormData = (overrides: Partial<JobFormData> = {}): JobFormData => ({
	title: "Need Plumbing Repair",
	category: "plumbing",
	subCategory: "repair",
	description: "Need help fixing a leaky faucet in the kitchen.",
	location: "Test City",
	urgency: "medium",
	budgetType: "estimate",
	budgetAmount: "150",
	hourlyRate: "",
	budgetRange: { min: "", max: "" },
	timeline: "Within 1 week",
	requirements: [
		{
			id: "req-1",
			title: "Licensed plumber",
			description: "Must be licensed and insured",
			priority: "required",
		},
	],
	skills: ["Plumbing", "Pipe Repair"],
	photos: [],
	contactPreferences: {
		email: true,
		phone: false,
		inApp: true,
	},
	boostOptions: {
		enabled: false,
		duration: 7,
		targetRadius: 25,
	},
	paymentMethod: null,
	...overrides,
});

// Common test helpers
export const waitForLoadingToFinish = () => {
	return new Promise((resolve) => setTimeout(resolve, 0));
};

export const mockConsoleError = () => {
	const originalError = console.error;
	console.error = vi.fn();
	return () => {
		console.error = originalError;
	};
};

export const mockConsoleWarn = () => {
	const originalWarn = console.warn;
	console.warn = vi.fn();
	return () => {
		console.warn = originalWarn;
	};
};

// Form testing helpers
export const fillFormField = async (user: any, element: HTMLElement, value: string) => {
	await user.clear(element);
	await user.type(element, value);
};

export const selectOption = async (user: any, element: HTMLElement, option: string) => {
	await user.selectOptions(element, option);
};

// Async testing helpers
export const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

export const waitFor = (condition: () => boolean, timeout = 5000): Promise<void> => {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();
		const check = () => {
			if (condition()) {
				resolve();
			} else if (Date.now() - startTime > timeout) {
				reject(new Error(`Timeout waiting for condition after ${timeout}ms`));
			} else {
				setTimeout(check, 10);
			}
		};
		check();
	});
};

// Component testing helpers
export const getByTestId = (container: HTMLElement, testId: string) => {
	const element = container.querySelector(`[data-testid="${testId}"]`);
	if (!element) {
		throw new Error(`Unable to find element with data-testid: ${testId}`);
	}
	return element;
};

export const queryByTestId = (container: HTMLElement, testId: string) => {
	return container.querySelector(`[data-testid="${testId}"]`);
};

// Snapshot testing helpers
export const createComponentSnapshot = (component: ReactElement) => {
	const { container } = render(component);
	return container.firstChild;
};

// Performance testing helpers
export const measureRenderTime = async (renderFn: () => void) => {
	const start = performance.now();
	renderFn();
	await flushPromises();
	const end = performance.now();
	return end - start;
};

// Error boundary testing
export const ThrowError = ({ shouldThrow = false, children }: { shouldThrow?: boolean; children: React.ReactNode }) => {
	if (shouldThrow) {
		throw new Error("Test error");
	}
	return <>{children}</>;
};
