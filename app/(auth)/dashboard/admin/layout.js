"use client";
import Image from "next/image";
import { useEffect } from "react";
import Header from "@components/admin/header";
import { AppSidebar } from "@components/admin/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@components/ui/sidebar";
import { redirect } from "next/navigation";
import { useAuth } from "@context/AuthContext";

export default function AdminLayout({ children }) {
	const { user, userRoles, loading, isAuthenticated } = useAuth();

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
	// 			<Image src="/logos/ThorbisLogo.webp" alt="Thorbis Logo" width={200} height={100} className="w-[60px] h-[60px] animate-breathe" />
	// 		</div>
	// 	);
	// }

	return (
		<SidebarProvider>
			<div className="flex flex-col w-full min-h-screen bg-white dark:bg-neutral-900">
				{/* Header spans full width */}
				<Header />

				{/* Content area with sidebar */}
				<div className="relative flex flex-1 w-full">
					<AppSidebar className="h-[calc(100vh-73px)] top-[73px] fixed left-0 z-30" />
					<SidebarInset className="flex-1 w-full min-w-0">
						{/* Minimalistic Toolbar */}
						<div className="flex items-center w-full h-12 px-4 border-b backdrop-blur-sm border-neutral-800/20 dark:border-neutral-700/20">
							<SidebarTrigger className="w-8 h-8" />
						</div>

						{/* Main Content Area */}
						<div className="w-full h-[calc(100vh-133px)] p-6 overflow-auto">{children}</div>
					</SidebarInset>
				</div>
			</div>
		</SidebarProvider>
	);
}
