"use client";
import Image from "next/image";
import Header from "@components/admin/layout/Header";
import Main from "@components/admin/layout/Main";
import Sidebar from "@components/admin/layout/Sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@store/useAuthStore";

export default function AdminLayout({ children }) {
	const { user, userRoles, loading, initializeAuth } = useAuthStore((state) => state);
	const router = useRouter();

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	useEffect(() => {
		console.log("User:", user);
		console.log("User Roles:", userRoles);
		if (!loading && user && (!Array.isArray(userRoles) || !userRoles.includes("admin"))) {
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

	if (!user || !Array.isArray(userRoles) || !userRoles.includes("admin")) {
		return null;
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
