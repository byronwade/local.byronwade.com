"use client";
import Image from "next/image";
import Header from "@components/user/layout/Header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@hooks/useAuth";

export default function UserRootLayout({ children }) {
	const { user, userRoles, loading } = useAuth("/login");
	const router = useRouter();

	useEffect(() => {
		console.log("User:", user);
		console.log("User Roles:", userRoles);
		if (!loading && user && (!Array.isArray(userRoles) || !userRoles.some((role) => ["admin", "business_owner", "user"].includes(role)))) {
			router.push("/unauthorized");
		}
	}, [user, userRoles, loading, router]);

	if (loading) {
		return (
			<div className="flex justify-center w-full">
				<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={200} height={100} className="w-[60px] h-[60px] animate-breathe" />
			</div>
		);
	}

	if (!user || !Array.isArray(userRoles) || !userRoles.some((role) => ["admin", "business_owner", "user"].includes(role))) {
		return null;
	}

	return (
		<div className="flex flex-col min-h-screen m-auto max-w-screen-2xl">
			<Header />
			<div className="flex flex-1">{children}</div>
		</div>
	);
}
