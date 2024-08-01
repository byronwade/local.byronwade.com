import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import useAuthStore from "@store/useAuthStore";

export default function ActiveUser() {
	const { user, logout } = useAuthStore((state) => state);

	if (!user) {
		return null;
	}

	const { email, identities } = user;
	const { first_name, last_name, username, email: identityEmail } = identities[0].identity_data;

	return (
		<div className="mt-10">
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">
				Welcome Back, {first_name} {last_name}!
			</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Confirm this is your profile, so we can link a company to you.</p>
			<div className="relative flex flex-row justify-between p-2 mt-4 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
				<div className="flex flex-row">
					<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="inline-block w-12 h-12 rounded-md" />
					<div className="ml-4">
						<h3>
							{first_name} {last_name}
						</h3>
						<p className="text-sm text-dark-500 dark:text-gray-300">{identityEmail}</p>
					</div>
				</div>
				<Button variant="destructive" className="self-center px-2 mr-2 text-xs h-7" onClick={logout}>
					Logout
				</Button>
			</div>
		</div>
	);
}
