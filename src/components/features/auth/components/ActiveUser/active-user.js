import React from "react";
import Image from "next/image";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { useAuthStore } from "@store/auth";

export default function ActiveUser() {
	const { user, logout } = useAuthStore((state) => state);

	if (!user) {
		return null;
	}

	const { email, identities, user_metadata } = user;

	// Safely extract user data with fallbacks
	let first_name, last_name, username, identityEmail;

	if (identities && identities.length > 0 && identities[0].identity_data) {
		// Use identity data if available
		const identityData = identities[0].identity_data;
		first_name = identityData.first_name;
		last_name = identityData.last_name;
		username = identityData.username;
		identityEmail = identityData.email;
	}

	// Fallback to user_metadata or email if identity data is not available
	first_name = first_name || user_metadata?.first_name || "User";
	last_name = last_name || user_metadata?.last_name || "";
	identityEmail = identityEmail || email || "No email";

	return (
		<div className="mt-10">
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left ">
				Welcome Back, {first_name} {last_name}!
			</h2>
			<p className="text-sm leading-6 text-left text-muted-foreground">Confirm this is your profile, so we can link a company to you.</p>
			<Card className="relative flex flex-row justify-between p-2 mt-4 ">
				<div className="flex flex-row">
					<Image src="/logos/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="inline-block w-12 h-12 rounded-md" />
					<div className="ml-4">
						<h3>
							{first_name} {last_name}
						</h3>
						<p className="text-sm text-muted-foreground">{identityEmail}</p>
					</div>
				</div>
				<Button variant="destructive" className="self-center px-2 mr-2 text-xs h-7" onClick={logout}>
					Logout
				</Button>
			</Card>
		</div>
	);
}
