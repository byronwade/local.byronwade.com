"use client";
import Image from "next/image";
import Header from "@components/user/layout/Header";
import Footer from "@components/user/layout/Footer";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import useAuthStore from "@store/useAuthStore";

export default function UserRootLayout({ children }) {
	const { user, userRoles, loading } = useAuthStore((state) => state);

	useEffect(() => {
		if (!loading && !user) {
			redirect("/login");
		}
		console.log("User:", user);
		console.log("User Roles:", userRoles);
		if (!loading && user && (!Array.isArray(userRoles) || !userRoles.some((role) => ["user"].includes(role)))) {
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
			<main className="flex flex-col min-h-screen p-4 m-auto mb-16 overflow-hidden max-w-screen-2xl md:p-8">{children}</main>
			<Footer />
		</div>
	);
}
