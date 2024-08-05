"use client";
import Image from "next/image";
import Header from "@components/admin/header";
import Main from "@components/admin/main";
import Sidebar from "@components/admin/sidebar";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import useAuthStore from "@store/useAuthStore";

export default function AdminLayout({ children }) {
	const { user, userRoles, loading } = useAuthStore((state) => state);

	useEffect(() => {
		if (!loading && !user) {
			redirect("/login");
		}
		console.log("User:", user);
		console.log("User Roles:", userRoles);
		if (!loading && user && (!Array.isArray(userRoles) || !userRoles.some((role) => ["admin"].includes(role)))) {
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
		<div className="flex flex-col min-h-screen text-black bg-gray-100">
			<Header />
			<div className="flex flex-1">
				<Sidebar />
				<Main>{children}</Main>
			</div>
		</div>
	);
}
