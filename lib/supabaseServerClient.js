// Mock server-side Supabase client for development

export function createClient() {
	// Mock user data
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
				return {
					data: { user: mockUser, session: mockSession },
					error: null,
				};
			},
			signOut: async () => {
				return {
					error: null,
				};
			},
		},
	};
}
