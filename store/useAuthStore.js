import { create } from "zustand";
import { supabase } from "@lib/supabaseClient";
import { login, logout } from "@actions/auth";
import client from "@lib/apolloClient";
import { gql } from "@apollo/client";

const FETCH_USER_ROLES_QUERY = gql`
	query GetUserRoles($userId: uuid!) {
		usersCollection(filter: { id: { eq: $userId } }) {
			edges {
				node {
					user_rolesCollection {
						edges {
							node {
								roles {
									name
								}
							}
						}
					}
				}
			}
		}
	}
`;

const fetchUserRolesClient = async (userId) => {
	try {
		const { data, errors } = await client.query({
			query: FETCH_USER_ROLES_QUERY,
			variables: { userId },
		});

		if (errors) {
			console.error("GraphQL errors:", errors);
			throw new Error("Failed to fetch user roles");
		}

		const roles = data.usersCollection.edges[0].node.user_rolesCollection.edges.map((edge) => edge.node.roles.name);
		return roles;
	} catch (error) {
		console.error("Fetch user roles error:", error);
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
			console.log("initializeAuth - Session:", session);
			if (session) {
				const user = session.user;
				console.log("User is authenticated", user);
				const roles = await fetchUserRolesClient(user.id);
				console.log("Fetched roles", roles);
				set({ user, isAuthenticated: true, userRoles: roles });
			} else {
				set({ user: null, isAuthenticated: false, userRoles: [] });
			}
		} catch (error) {
			console.error("Error initializing auth:", error);
		} finally {
			set({ loading: false, isInitialized: true });
		}
	},

	login: async (email, password) => {
		set({ loading: true });
		try {
			const { user } = await login(email, password);
			console.log("Login successful", user);
			const roles = await fetchUserRolesClient(user.id);
			set({ user, isAuthenticated: true, userRoles: roles, loading: false });
		} catch (error) {
			console.error("Login error:", error);
			set({ loading: false });
		}
	},

	logout: async () => {
		set({ loading: true });
		try {
			await logout();
			set({ user: null, isAuthenticated: false, userRoles: [], loading: false });
			console.log("Logout successful");
		} catch (error) {
			console.error("Logout error:", error);
			set({ loading: false });
		}
	},

	onAuthStateChange: () => {
		supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Auth state change - Event:", event, "Session:", session);
			if (session) {
				const user = session.user;
				console.log("Auth state change - User signed in or token refreshed", user);
				const roles = await fetchUserRolesClient(user.id);
				console.log("Auth state change - Fetched roles", roles);
				set({ user, isAuthenticated: true, userRoles: roles, loading: false });
			} else {
				console.log("Auth state change - User signed out or session is null");
				set({ user: null, isAuthenticated: false, userRoles: [], loading: false });
			}
		});
	},
}));

export default useAuthStore;
