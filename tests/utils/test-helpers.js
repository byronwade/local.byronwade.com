// Testing Utilities and Helpers
// Enterprise-grade testing utilities for consistent test setup

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

/**
 * Custom render function with providers
 * Wraps components with necessary providers for testing
 */
export function renderWithProviders(ui, options = {}) {
  const {
    initialEntries = ['/'],
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    ...renderOptions
  } = options;

  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter initialEntries={initialEntries}>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

/**
 * Mock user authentication
 */
export function mockAuth(user = null) {
  const mockUser = user || {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  };

  return vi.mocked(mockUser);
}

/**
 * Mock API responses
 */
export function mockApiResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

/**
 * Wait for async operations with timeout
 */
export async function waitForAsync(callback, timeout = 5000) {
  return waitFor(callback, { timeout });
}

/**
 * Mock Supabase client
 */
export function mockSupabase() {
  return {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  };
}

/**
 * Create test data factories
 */
export const testData = {
  user: (overrides = {}) => ({
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  business: (overrides = {}) => ({
    id: 'business-123',
    name: 'Test Business',
    category: 'Restaurant',
    address: '123 Test St',
    phone: '(555) 123-4567',
    rating: 4.5,
    ...overrides,
  }),

  review: (overrides = {}) => ({
    id: 'review-123',
    rating: 5,
    text: 'Great experience!',
    user_id: 'user-123',
    business_id: 'business-123',
    created_at: new Date().toISOString(),
    ...overrides,
  }),
};

/**
 * Mock browser APIs
 */
export function mockBrowserAPIs() {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
  });

  // Mock geolocation
  Object.defineProperty(navigator, 'geolocation', {
    value: {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn(),
    },
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

/**
 * Performance testing helpers
 */
export const performance = {
  measure: (name, fn) => {
    const start = Date.now();
    const result = fn();
    const end = Date.now();
    console.log(`${name}: ${end - start}ms`);
    return result;
  },

  async measureAsync: (name, fn) => {
    const start = Date.now();
    const result = await fn();
    const end = Date.now();
    console.log(`${name}: ${end - start}ms`);
    return result;
  },
};

/**
 * Test cleanup utilities
 */
export function cleanup() {
  vi.clearAllMocks();
  vi.clearAllTimers();
}