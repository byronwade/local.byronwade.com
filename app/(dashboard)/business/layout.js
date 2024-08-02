"use client";
import Image from "next/image";
import Header from "@components/business/layout/Header";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import useAuthStore from "@store/useAuthStore";

export default function BusinessRootLayout({ children }) {
	const { user, userRoles, loading } = useAuthStore((state) => state);

	useEffect(() => {
		if (!loading && !user) {
			redirect("/login");
		}
		console.log("User:", user);
		console.log("User Roles:", userRoles);
		if (!loading && user && (!Array.isArray(userRoles) || !userRoles.some((role) => ["business_user"].includes(role)))) {
			redirect("/unauthorized");
		}
	}, [user, userRoles, loading]);

	if (loading) {
		return (
			<div className="flex items-center justify-center w-full h-screen align-middle">
				<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={200} height={100} className="w-[60px] h-[60px] animate-breathe" />
			</div>
		);
	}

	return (
		<div>
			<Header />
			<div className="bg-gray-100 dark:md:border-gray-950 dark:bg-dark-950">{children}</div>
		</div>
	);
}
