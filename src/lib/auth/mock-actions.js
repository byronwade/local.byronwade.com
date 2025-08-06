// Mock auth actions for development
"use server";

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

export async function login(email, password) {
	try {
		// Mock login - always succeed for development
		console.log(`Mock login attempt for email: ${email}`);

		// Simulate a small delay like a real API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		return { user: mockUser };
	} catch (error) {
		console.error("Mock login error:", error);
		throw error;
	}
}

export async function logout() {
	try {
		// Mock logout
		console.log("Mock logout");

		// Simulate a small delay like a real API call
		await new Promise((resolve) => setTimeout(resolve, 200));

		return { success: true };
	} catch (error) {
		console.error("Mock logout error:", error);
		throw error;
	}
}
