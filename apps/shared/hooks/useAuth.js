import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuthStore } from "@store/auth";

const useAuth = (redirectTo = null) => {
	const { user, profile, initializeAuth, loading } = useAuthStore();
	const isInitialized = !loading;
	const userRole = profile?.role;

	useEffect(() => {
		if (loading) {
			initializeAuth();
		}
	}, [initializeAuth, loading]);

	useEffect(() => {
		console.log("useAuth - isInitialized:", isInitialized, "loading:", loading, "user:", user, "userRole:", userRole);
		if (isInitialized && !loading && !user && redirectTo) {
			redirect(redirectTo);
		}
	}, [isInitialized, loading, user, redirectTo]);

	return { isInitialized, user, userRole, loading };
};

export default useAuth;
