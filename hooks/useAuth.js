import { useEffect } from "react";
import { redirect } from "next/navigation";
import useAuthStore from "@store/useAuthStore";

const useAuth = (redirectTo = null) => {
	const { user, userRoles, initializeAuth, loading, isInitialized, onAuthStateChange } = useAuthStore();

	useEffect(() => {
		const init = async () => {
			await initializeAuth();
			onAuthStateChange();
		};
		if (!isInitialized) {
			init();
		}
	}, [initializeAuth, onAuthStateChange, isInitialized]);

	useEffect(() => {
		console.log("useAuth - isInitialized:", isInitialized, "loading:", loading, "user:", user, "userRoles:", userRoles);
		if (isInitialized && !loading && !user && redirectTo) {
			redirect(redirectTo);
		}
	}, [isInitialized, loading, user, redirectTo]);

	return { isInitialized, user, userRoles, loading };
};

export default useAuth;
