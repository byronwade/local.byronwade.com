/**
 * Vitest Test Setup
 * Global test configuration and mocks for the test environment
 */

import "@testing-library/jest-dom";
import { vi, beforeAll, afterAll, afterEach } from "vitest";
import React from "react";

// Mock Next.js router
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		refresh: vi.fn(),
	}),
	useSearchParams: () => new URLSearchParams(),
	usePathname: () => "/",
}));

// Mock Next.js link
vi.mock("next/link", () => {
	return {
		__esModule: true,
		default: ({ children, href, ...props }: any) => {
			return React.createElement("a", { href, ...props }, children);
		},
	};
});

// Mock Next.js image
vi.mock("next/image", () => ({
	__esModule: true,
	default: (props: any) => {
		return React.createElement("img", { ...props, alt: props.alt });
	},
}));

// Mock Supabase client
vi.mock("@lib/database/supabase/client", () => ({
	supabase: {
		auth: {
			getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
			getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
			signIn: vi.fn(),
			signOut: vi.fn(),
			signUp: vi.fn(),
			resetPasswordForEmail: vi.fn(),
		},
		from: vi.fn(() => ({
			select: vi.fn().mockReturnThis(),
			insert: vi.fn().mockReturnThis(),
			update: vi.fn().mockReturnThis(),
			delete: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			neq: vi.fn().mockReturnThis(),
			gt: vi.fn().mockReturnThis(),
			lt: vi.fn().mockReturnThis(),
			gte: vi.fn().mockReturnThis(),
			lte: vi.fn().mockReturnThis(),
			like: vi.fn().mockReturnThis(),
			ilike: vi.fn().mockReturnThis(),
			is: vi.fn().mockReturnThis(),
			in: vi.fn().mockReturnThis(),
			contains: vi.fn().mockReturnThis(),
			containedBy: vi.fn().mockReturnThis(),
			rangeGt: vi.fn().mockReturnThis(),
			rangeLt: vi.fn().mockReturnThis(),
			rangeGte: vi.fn().mockReturnThis(),
			rangeLte: vi.fn().mockReturnThis(),
			rangeAdjacent: vi.fn().mockReturnThis(),
			overlaps: vi.fn().mockReturnThis(),
			textSearch: vi.fn().mockReturnThis(),
			match: vi.fn().mockReturnThis(),
			not: vi.fn().mockReturnThis(),
			or: vi.fn().mockReturnThis(),
			filter: vi.fn().mockReturnThis(),
			order: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			range: vi.fn().mockReturnThis(),
			single: vi.fn().mockResolvedValue({ data: null, error: null }),
			maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
			then: vi.fn().mockResolvedValue({ data: [], error: null }),
		})),
		rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
		storage: {
			from: vi.fn(() => ({
				upload: vi.fn().mockResolvedValue({ data: null, error: null }),
				download: vi.fn().mockResolvedValue({ data: null, error: null }),
				remove: vi.fn().mockResolvedValue({ data: null, error: null }),
				list: vi.fn().mockResolvedValue({ data: [], error: null }),
				getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://example.com/file.jpg" } })),
			})),
		},
	},
}));

// Mock environment variables
vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

// Mock toast notifications
vi.mock("@components/ui/use-toast", () => ({
	toast: vi.fn(),
	useToast: () => ({
		toast: vi.fn(),
		dismiss: vi.fn(),
	}),
}));

// Mock local storage
const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value.toString();
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

// Mock session storage
const sessionStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value.toString();
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

Object.defineProperty(window, "sessionStorage", {
	value: sessionStorageMock,
});

// Mock window.location
Object.defineProperty(window, "location", {
	value: {
		href: "http://localhost:3000",
		origin: "http://localhost:3000",
		protocol: "http:",
		hostname: "localhost",
		port: "3000",
		pathname: "/",
		search: "",
		hash: "",
		assign: vi.fn(),
		replace: vi.fn(),
		reload: vi.fn(),
	},
	writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock URL.createObjectURL for file upload tests
Object.defineProperty(global.URL, "createObjectURL", {
	writable: true,
	value: vi.fn(() => "mocked-object-url"),
});

Object.defineProperty(global.URL, "revokeObjectURL", {
	writable: true,
	value: vi.fn(),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock console.error for cleaner test output
const originalError = console.error;
beforeAll(() => {
	console.error = (...args: any[]) => {
		if (typeof args[0] === "string" && args[0].includes("Warning: ReactDOM.render is deprecated")) {
			return;
		}
		originalError.call(console, ...args);
	};
});

afterAll(() => {
	console.error = originalError;
});

// Clean up after each test
afterEach(() => {
	vi.clearAllMocks();
	localStorageMock.clear();
	sessionStorageMock.clear();
});
