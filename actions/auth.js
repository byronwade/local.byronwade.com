// Ensure this is in your server actions file
"use server";

import { createClient } from "@lib/supabaseServerClient";

export async function login(email, password) {
	const supabase = createClient();
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			console.error("Supabase signInWithPassword error:", error);
			throw new Error("Login failed");
		}

		const { user } = data;
		return { user };
	} catch (error) {
		console.error("Login error:", error);
		throw error;
	}
}

export async function logout() {
	const supabase = createClient();
	try {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Supabase signOut error:", error);
			throw new Error("Logout failed");
		}
	} catch (error) {
		console.error("Logout error:", error);
		throw error;
	}
}
