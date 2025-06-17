"use client";

// Mock Supabase client for development
const createMockClient = () => {
	let currentUser = null;
	let currentSession = null;
	let authListeners = [];

	// Mock session and user data
	const mockUser = {
		id: "mock-user-id-123",
		email: "test@example.com",
		name: "Test User",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		user_metadata: {
			first_name: "John",
			last_name: "Doe",
			full_name: "John Doe",
		},
		app_metadata: {},
		aud: "authenticated",
		role: "authenticated",
	};

	const mockSession = {
		access_token: "mock-access-token",
		refresh_token: "mock-refresh-token",
		expires_in: 3600,
		token_type: "bearer",
		user: mockUser,
	};

	return {
		auth: {
			getSession: async () => {
				// Return mock session for development
				return {
					data: { session: mockSession },
					error: null,
				};
			},
			getUser: async () => {
				return {
					data: { user: mockUser },
					error: null,
				};
			},
			signInWithPassword: async ({ email, password }) => {
				// Mock login - always succeed for development
				currentUser = mockUser;
				currentSession = mockSession;

				// Notify listeners
				authListeners.forEach((callback) => {
					callback("SIGNED_IN", mockSession);
				});

				return {
					data: { user: mockUser, session: mockSession },
					error: null,
				};
			},
			signOut: async () => {
				// Mock logout
				currentUser = null;
				currentSession = null;

				// Notify listeners
				authListeners.forEach((callback) => {
					callback("SIGNED_OUT", null);
				});

				return {
					error: null,
				};
			},
			onAuthStateChange: (callback) => {
				authListeners.push(callback);
				// Return unsubscribe function
				return {
					data: {
						subscription: {
							unsubscribe: () => {
								const index = authListeners.indexOf(callback);
								if (index > -1) {
									authListeners.splice(index, 1);
								}
							},
						},
					},
				};
			},
		},
	};
};

const supabase = createMockClient();

export { supabase };
