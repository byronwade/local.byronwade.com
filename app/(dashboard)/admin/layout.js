"use client";
import Image from "next/image";
import { useEffect } from "react";
import Header from "@components/admin/header";
import { AppSidebar } from "@components/admin/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@components/ui/sidebar";
import { redirect } from "next/navigation";
import useAuthStore from "@store/useAuthStore";

export default function AdminLayout({ children }) {
	const { user, userRoles, loading } = useAuthStore((state) => state);

	// Authorization checks temporarily disabled for development
	// useEffect(() => {
	// 	if (!loading && !user) {
	// 		redirect("/login");
	// 	}
	// 	console.log("User:", user);
	// 	console.log("User Roles:", userRoles);
	// 	if (!loading && user && (!Array.isArray(userRoles) || !userRoles.some((role) => ["admin"].includes(role)))) {
	// 		redirect("/unauthorized");
	// 	}
	// }, [user, userRoles, loading]);

	// if (loading) {
	// 	return (
	// 		<div className="flex items-center justify-center w-full h-screen align-middle">
	// 			<Image src="/ThorbisLogo.webp" alt="Thorbis Logo" width={200} height={100} className="w-[60px] h-[60px] animate-breathe" />
	// 		</div>
	// 	);
	// }

	return (
		<SidebarProvider>
			<div className="flex flex-col min-h-screen">
				<Header />
				<div className="flex flex-1">
					<AppSidebar />
					<SidebarInset>
						<div className="w-full px-6 py-16 relative">
							<SidebarTrigger className="absolute top-4 left-4 z-10" />
							{children}
						</div>
					</SidebarInset>
				</div>
			</div>
		</SidebarProvider>
	);
}
