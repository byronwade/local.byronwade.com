"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabaseClient";
import { Button } from "@components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

export default function ConfirmEmail() {
	const router = useRouter();
	const { token } = router.query;
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		if (token) {
			verifyEmail(token);
		}
	}, [token]);

	const verifyEmail = async (token) => {
		setLoading(true);
		try {
			const { error } = await supabase.auth.verifyOtp({
				token,
				type: "signup",
			});
			if (error) throw error;
			setSuccess("Email verified successfully! You can now log in.");
		} catch (error) {
			setError("Failed to verify email. The token may be invalid or expired.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-lg mx-auto mt-6 md:mt-10">
			<div>
				{loading ? (
					<p>Verifying email...</p>
				) : error ? (
					<Alert className="mt-4 text-black bg-red-300">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				) : (
					<Alert className="mt-4 text-black bg-green-300">
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>{success}</AlertDescription>
					</Alert>
				)}
				<Button className="mt-4" onClick={() => router.push("/login")}>
					Go to Login
				</Button>
			</div>
		</div>
	);
}
