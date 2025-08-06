/**
 * User Dashboard Page - Modular Implementation
 * Replaces the original 647-line monolithic dashboard page
 * Uses extracted section components and custom hooks
 */

"use client";

import React from "react";
import { StatsOverviewSection, RecentActivitySection, QuickActionsSection, SystemUpdatesSection } from "./sections";
import { useUserDashboard } from "@lib/hooks/dashboard/useUserDashboard";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { RefreshCw } from "lucide-react";

const UserDashboardPage = () => {
	const { dashboardData, isLoading, refreshing, user, refreshDashboard } = useUserDashboard();

	if (isLoading) {
		return <UserDashboardSkeleton />;
	}

	return (
		<div className="container mx-auto p-6 space-y-8">
			{/* Dashboard Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName || "User"}!</h1>
					<p className="text-muted-foreground">Here's what's happening with your account today.</p>
				</div>
				<Button variant="outline" onClick={refreshDashboard} disabled={refreshing}>
					<RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
					Refresh
				</Button>
			</div>

			{/* Dashboard Content */}
			<div className="grid gap-8 lg:grid-cols-3">
				{/* Left Column - Main Content */}
				<div className="lg:col-span-2 space-y-8">
					<StatsOverviewSection user={user} stats={dashboardData.stats} />
					<RecentActivitySection activities={dashboardData.recentActivity} />
				</div>

				{/* Right Column - Sidebar */}
				<div className="space-y-8">
					<QuickActionsSection />
					<SystemUpdatesSection />
				</div>
			</div>
		</div>
	);
};

/**
 * Loading skeleton for dashboard
 */
const UserDashboardSkeleton = () => {
	return (
		<div className="container mx-auto p-6 space-y-8">
			{/* Header Skeleton */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-96" />
				</div>
				<Skeleton className="h-10 w-24" />
			</div>

			{/* Content Skeleton */}
			<div className="grid gap-8 lg:grid-cols-3">
				{/* Left Column */}
				<div className="lg:col-span-2 space-y-8">
					{/* Stats Grid Skeleton */}
					<div className="space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-64" />
						</div>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="p-6 border rounded-lg space-y-3">
									<div className="flex items-center justify-between">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-4" />
									</div>
									<Skeleton className="h-8 w-16" />
									<Skeleton className="h-3 w-24" />
								</div>
							))}
						</div>
					</div>

					{/* Recent Activity Skeleton */}
					<div className="p-6 border rounded-lg space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-64" />
						</div>
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-64" />
									<Skeleton className="h-3 w-48" />
									<Skeleton className="h-3 w-20" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right Column */}
				<div className="space-y-8">
					{/* Quick Actions Skeleton */}
					<div className="p-6 border rounded-lg space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-48" />
						</div>
						<div className="grid gap-4 md:grid-cols-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="p-6 border rounded-lg space-y-3">
									<div className="flex items-start gap-4">
										<Skeleton className="h-12 w-12 rounded-lg" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-3 w-32" />
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* System Updates Skeleton */}
					<div className="p-6 border rounded-lg space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-48" />
						</div>
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<div className="flex items-center gap-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-5 w-12 rounded-full" />
									</div>
									<Skeleton className="h-3 w-48" />
									<Skeleton className="h-3 w-16" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserDashboardPage;
