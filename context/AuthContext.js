// stores/authContext.js
"use client";
import { createContext, useContext, useEffect } from "react";
import useAuthStore from "@store/useAuthStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const { initializeAuth, user, loading } = useAuthStore();

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
