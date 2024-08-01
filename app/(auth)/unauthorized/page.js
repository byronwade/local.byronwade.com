"use client";

import React from "react";
import useAuth from "@hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { redirect } from "next/navigation";
import VerifyAccount from "@components/auth/shared/verify-account";

const UnauthorizedNotification = () => {
	const { isInitialized, user, loading } = useAuth();

	if (loading || !isInitialized) {
		return (
			<div className="flex justify-center w-full">
				<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={100} height={100} className="w-[60px] h-[60px] animate-breathe" />
			</div>
		);
	}

	if (!user) {
		redirect("/login");
	}

	if (user.email_confirmed_at === "") {
		return <VerifyAccount />;
	}

	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-red-700 dark:text-red-500">Unauthorized</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-300"> You are not authorized to view this page. If you believe this is an error, please submit a request to our support page.</p>
			<div className="flex flex-col mt-6">
				<div className="flex flex-col w-full space-y-4">
					<Link href="/support" passHref legacyBehavior>
						<Button variant="brand" className="w-full">
							Contact Support
						</Button>
					</Link>
					<Link href="/" passHref legacyBehavior>
						<Button variant="outline" className="w-full">
							Go to Homepage
						</Button>
					</Link>
				</div>
			</div>
		</>
	);
};

export default UnauthorizedNotification;
