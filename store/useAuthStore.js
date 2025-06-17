import { create } from "zustand";
import { supabase } from "@lib/supabaseClient";
import { login, logout } from "@actions/auth";
import { redirect } from "next/navigation";

// Mock user roles for development
const mockUserRoles = ["user", "customer"];

const fetchUserRolesClient = async (userId) => {
	try {
		// Mock role fetching - return default roles for development
		console.log(`Mock fetching roles for user: ${userId}`);

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		return mockUserRoles;
	} catch (error) {
		console.error("Mock fetch user roles error:", error);
		throw error;
	}
};

const useAuthStore = create((set, get) => ({
	user: null,
	isAuthenticated: false,
	userRoles: [],
	loading: true,
	isInitialized: false,
	setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),
	setUserRoles: (roles) => set({ userRoles: roles }),
	setLoading: (loading) => set({ loading }),
	setIsInitialized: (isInitialized) => set({ isInitialized }),

	initializeAuth: async () => {
		if (get().isInitialized) return;

		set({ loading: true });
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			console.log("initializeAuth - Mock Session:", session);
			if (session) {
				const user = session.user;
				console.log("Mock user is authenticated", user);
				const roles = await fetchUserRolesClient(user.id);
				console.log("Mock fetched roles", roles);
				set({ user, isAuthenticated: true, userRoles: roles });
			} else {
				set({ user: null, isAuthenticated: false, userRoles: [] });
			}
		} catch (error) {
			console.error("Error initializing mock auth:", error);
		} finally {
			set({ loading: false, isInitialized: true });
		}
	},

	login: async (email, password) => {
		set({ loading: true });
		try {
			const { user } = await login(email, password);
			console.log("Mock login successful", user);
			const roles = await fetchUserRolesClient(user.id);
			set({ user, isAuthenticated: true, userRoles: roles, loading: false });
		} catch (error) {
			console.error("Mock login error:", error);
			set({ loading: false });
		}
	},

	logout: async () => {
		set({ loading: true });
		try {
			await logout();
			set({ user: null, isAuthenticated: false, userRoles: [], loading: false });
			redirect("/");
			console.log("Mock logout successful");
		} catch (error) {
			console.error("Mock logout error:", error);
			set({ loading: false });
		}
	},

	onAuthStateChange: () => {
		supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Mock auth state change - Event:", event, "Session:", session);
			if (session) {
				const user = session.user;
				console.log("Mock auth state change - User signed in or token refreshed", user);
				const roles = await fetchUserRolesClient(user.id);
				console.log("Mock auth state change - Fetched roles", roles);
				set({ user, isAuthenticated: true, userRoles: roles, loading: false });
			} else {
				console.log("Mock auth state change - User signed out or session is null");
				set({ user: null, isAuthenticated: false, userRoles: [], loading: false });
			}
		});
	},
}));

export default useAuthStore;
