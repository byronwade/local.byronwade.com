// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const session = supabase.auth.session();
		setUser(session?.user ?? null);
		setLoading(false);

		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => {
			authListener?.unsubscribe();
		};
	}, []);

	const login = async (email, password) => {
		setLoading(true);
		const { error, user } = await supabase.auth.signIn({ email, password });
		setUser(user);
		setError(error);
		setLoading(false);
		if (!error) {
			router.push("/user/dashboard");
		}
	};

	const logout = async () => {
		await supabase.auth.signOut();
		setUser(null);
		router.push("/");
	};

	const register = async (email, password) => {
		setLoading(true);
		const { error, user } = await supabase.auth.signUp({ email, password });
		setUser(user);
		setError(error);
		setLoading(false);
		if (!error) {
			router.push("/user/dashboard");
		}
	};

	const resetPassword = async (email) => {
		setLoading(true);
		const { error } = await supabase.auth.api.resetPasswordForEmail(email);
		setError(error);
		setLoading(false);
	};

	return <AuthContext.Provider value={{ user, loading, error, login, logout, register, resetPassword }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
