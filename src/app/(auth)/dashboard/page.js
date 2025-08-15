"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@features/auth";
import useAuth from "@hooks/use-auth";
import { Skeleton } from "@components/ui/skeleton";
import { Loader2 } from "lucide-react";

/**
 * Unified Dashboard Router
 * Redirects all users to the consolidated business dashboard
 */
export default function DashboardPage() {
	return (
		<ProtectedRoute requireEmailVerification={true}>
			<DashboardRouter />
		</ProtectedRoute>
	);
}

function DashboardRouter() {
	const router = useRouter();
	const { user, loading } = useAuth();

	useEffect(() => {
		if (loading) return; // Wait for auth to load

		if (!user) {
			// No user, redirect to login
			router.replace("/login");
			return;
		}

		// Determine the appropriate dashboard based on user type/role
		const redirectPath = getDashboardPath(user);

		// Replace the current route to prevent back button issues
		router.replace(redirectPath);
	}, [user, loading, router]);

	// Show loading while redirecting
	return (
		<div className="container mx-auto p-6">
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<div className="text-center space-y-2">
					<h2 className="text-xl font-semibold">Setting up your dashboard...</h2>
					<p className="text-muted-foreground">Redirecting you to the right place</p>
				</div>
			</div>

			{/* Loading skeleton */}
			<div className="mt-8 space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-96" />
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="p-6 border rounded-lg space-y-3">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-8 w-16" />
							<Skeleton className="h-3 w-24" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * Determine the correct dashboard path based on user data
 * Simplified to use unified business dashboard for all business users
 */
function getDashboardPath(user) {
	const userRole = user?.user_metadata?.role || user?.role || "user";
	const accountType = user?.user_metadata?.account_type || user?.account_type;

	// Admin users go to admin dashboard
	if (userRole === "admin" || userRole === "super_admin") {
		return "/dashboard/admin";
	}

	// LocalHub operators go to LocalHub dashboard
	if (userRole === "localhub_operator" || accountType === "localhub") {
		return "/dashboard/localhub";
	}

	// All business users (including field service) now use the unified business dashboard
	// The business dashboard includes all functionality programmatically
	return "/dashboard/business";
}
