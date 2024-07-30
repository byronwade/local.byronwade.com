import { create } from "zustand";
import { supabase } from "@lib/supabaseClient";
import apolloClient from "@lib/apolloClient";
import { gql } from "@apollo/client";

const FETCH_USER_ROLES_QUERY = gql`
	query GetUserRoles($userId: uuid!) {
		usersCollection(filter: { id: { eq: $userId } }) {
			edges {
				node {
					id
					username
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

const useAuthStore = create((set) => ({
	user: null,
	userRoles: [],
	loading: true,

	setUser: (user) => set({ user }),
	setLoading: (loading) => set({ loading }),
	setUserRoles: (roles) => set({ userRoles: roles }),

	initializeAuth: async () => {
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			console.log("Session data:", session);

			if (session) {
				const { error: setSessionError } = await supabase.auth.setSession({
					access_token: session.access_token,
					refresh_token: session.refresh_token,
				});

				if (setSessionError) {
					console.error("Error setting session:", setSessionError);
					set({ loading: false });
					return;
				}

				set({ user: session.user });
				await useAuthStore.getState().fetchUserRoles(session.user.id);
			} else {
				set({ user: null });
			}

			set({ loading: false });

			supabase.auth.onAuthStateChange(async (event, session) => {
				console.log("Auth state change event:", event);
				if (session) {
					set({ user: session.user });
					await useAuthStore.getState().fetchUserRoles(session.user.id);
				} else {
					set({ user: null, userRoles: [] });
				}
			});
		} catch (error) {
			console.error("Error initializing auth:", error);
			set({ loading: false });
		}
	},

	login: async (email, password) => {
		try {
			console.log("Logging in with:", email);
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			set({ user: data.user });
			await useAuthStore.getState().fetchUserRoles(data.user.id);
		} catch (error) {
			console.error("Error logging in:", error);
			throw error;
		}
	},

	logout: async () => {
		await supabase.auth.signOut();
		set({ user: null, userRoles: [] });
	},

	fetchUserRoles: async (userId) => {
		console.log("Fetching user roles for userId:", userId);
		try {
			const { data } = await apolloClient.query({
				query: FETCH_USER_ROLES_QUERY,
				variables: { userId },
			});
			const user = data?.usersCollection?.edges?.[0]?.node;
			console.log("FetchUserRoles: ", user);
			if (user) {
				const roles = user.user_rolesCollection.edges.map((edge) => edge.node.roles.name);
				set({ userRoles: roles });
			} else {
				console.error("User roles data is missing");
				set({ userRoles: [] });
			}
		} catch (error) {
			console.error("Error fetching user roles:", error);
			set({ userRoles: [] });
		}
	},

	resetPassword: async (email) => {
		console.log("Resetting password for email:", email);
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`,
		});
		if (error) throw error;
	},

	claimBusiness: async (businessId, userId) => {
		console.log("Claiming business with ID:", businessId, "for user ID:", userId);
		// Implement logic to claim a business
	},

	addBusiness: async (businessDetails) => {
		console.log("Adding new business with details:", businessDetails);
		// Implement logic to add a new business
	},

	signup: async (values) => {
		const { email, password, address, ...metadata } = values;

		console.log("Signing up with values:", values);

		const userData = {
			email,
			password,
			options: {
				data: {
					...metadata,
					...address,
					roles: ["7cc96f08-d77a-411f-9946-93c5894a13f5"], // Default to user role
				},
			},
		};

		console.log("Formatted user data for signup:", userData);

		try {
			const { data, error } = await supabase.auth.signUp(userData);

			console.log("Signup response data:", data);

			if (error) {
				if (error.message.includes("User already registered")) {
					throw new Error("User already exists");
				}
				console.error("Signup error:", error);
				throw error;
			}

			console.log("Signup data:", data);
		} catch (error) {
			console.error("Signup error:", error);
			throw error;
		}
	},
}));

export default useAuthStore;
