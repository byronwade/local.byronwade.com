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
	loading: true,
	verificationStatus: null,
	resendLoading: false,
	resendSuccess: false,
	resendError: null,

	setUser: (user) => set({ user }),
	setLoading: (loading) => set({ loading }),
	setVerificationStatus: (status) => set({ verificationStatus: status }),
	setResendLoading: (loading) => set({ resendLoading: loading }),
	setResendSuccess: (success) => set({ resendSuccess: success }),
	setResendError: (error) => set({ resendError: error }),

	initializeAuth: async () => {
		try {
			const session = await useAuthStore.getState().getSession();
			if (session) {
				await useAuthStore.getState().fetchUserRolesAndSetUser(session.user.id);
			} else {
				set({ user: null });
			}
			set({ loading: false });

			supabase.auth.onAuthStateChange(async (event, session) => {
				if (session) {
					await useAuthStore.getState().fetchUserRolesAndSetUser(session.user.id);
				} else {
					set({ user: null });
				}
			});
		} catch (error) {
			console.error("Error initializing auth:", error);
			set({ loading: false });
		}
	},

	getSession: async () => {
		try {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error) throw error;
			return session;
		} catch (error) {
			console.error("Error getting session:", error);
			return null;
		}
	},

	getUser: async () => {
		try {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();
			if (error) throw error;
			return user;
		} catch (error) {
			console.error("Error getting user:", error);
			return null;
		}
	},

	login: async (email, password) => {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			await useAuthStore.getState().fetchUserRolesAndSetUser(data.user.id);
		} catch (error) {
			console.error("Error logging in:", error);
			throw error;
		}
	},

	logout: async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			set({ user: null });
		} catch (error) {
			console.error("Error logging out:", error);
		}
	},

	fetchUserRolesAndSetUser: async (userId) => {
		try {
			const { data } = await apolloClient.query({
				query: FETCH_USER_ROLES_QUERY,
				variables: { userId },
			});
			const user = await useAuthStore.getState().getUser();
			if (data?.usersCollection?.edges?.length > 0) {
				const roles = data.usersCollection.edges[0].node.user_rolesCollection.edges.map((edge) => edge.node.roles.name);
				set({
					user: {
						...user,
						userRoles: roles,
					},
				});
			} else {
				set({
					user: {
						...user,
						userRoles: [],
					},
				});
			}
		} catch (error) {
			console.error("Error fetching user roles:", error);
			set({
				user: {
					...(await useAuthStore.getState().getUser()),
					userRoles: [],
				},
			});
		}
	},

	resetPassword: async (email) => {
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`,
			});
			if (error) throw error;
		} catch (error) {
			console.error("Error resetting password:", error);
			throw error;
		}
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

		try {
			const { data, error } = await supabase.auth.signUp(userData);
			if (error) {
				if (error.message.includes("User already registered")) {
					throw new Error("User already exists");
				}
				throw error;
			}
		} catch (error) {
			throw error;
		}
	},

	isEmailVerified: () => {
		const user = useAuthStore.getState().user;
		return user?.email_confirmed_at ? true : false;
	},

	handleResendVerificationEmail: async (email) => {
		set({ resendLoading: true, resendSuccess: false, resendError: null });

		try {
			const { data: user, error: userError } = await supabase.auth.getUser();
			if (userError) {
				set({ resendError: "Error fetching user data.", resendLoading: false });
				return;
			}

			if (user?.email_confirmed_at) {
				set({ resendError: "Your email is already verified.", resendLoading: false });
				return;
			}

			const { error } = await supabase.auth.resend({
				type: "signup",
				email: email,
				options: {
					emailRedirectTo: `${window.location.origin}/email-verified`,
				},
			});

			if (error) {
				set({ resendError: "Error resending verification email.", resendLoading: false });
			} else {
				set({ resendSuccess: true, resendLoading: false });
			}
		} catch (error) {
			console.error("Error resending verification email:", error);
			set({ resendError: "Error resending verification email.", resendLoading: false });
		}
	},
}));

export default useAuthStore;
