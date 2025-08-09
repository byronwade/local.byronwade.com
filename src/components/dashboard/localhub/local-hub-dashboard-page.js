/**
 * LocalHub Dashboard Page - Modular Implementation
 * Replaces the original 651-line monolithic LocalHub dashboard page
 * Uses extracted section components and custom hooks
 */

"use client";

import React from "react";
import { LocalHubStatsSection, LocalHubActivitySection, LocalHubQuickActionsSection, LocalHubRevenueBreakdownSection, LocalHubDirectoryHealthSection } from "./sections";
import { useLocalHubDashboard } from "@lib/hooks/dashboard/use-local-hub-dashboard";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { RefreshCw, Building2 } from "lucide-react";

const LocalHubDashboardPage = () => {
	const { dashboardData, isLoading, refreshing, user, refreshDashboard, directoryStats, businessMetrics } = useLocalHubDashboard();

	if (isLoading) {
		return <LocalHubDashboardSkeleton />;
	}

	return (
		<div className="container mx-auto p-6 space-y-8">
			{/* Dashboard Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
						<Building2 className="h-8 w-8 text-primary" />
						LocalHub Dashboard
					</h1>
					<p className="text-muted-foreground">Manage your directory and track revenue performance</p>
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
					<LocalHubStatsSection stats={directoryStats} />
					<LocalHubActivitySection activities={dashboardData.recentActivity} />
				</div>

				{/* Right Column - Sidebar */}
				<div className="space-y-8">
					<LocalHubQuickActionsSection />
					<LocalHubRevenueBreakdownSection />
					<LocalHubDirectoryHealthSection />
				</div>
			</div>

			{/* Performance Summary */}
			{businessMetrics && (
				<div className="mt-8 p-6 rounded-lg border bg-card">
					<h3 className="text-lg font-semibold mb-4">This Month's Performance</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">${businessMetrics.averageRevenuePerBusiness || 0}</div>
							<div className="text-sm text-muted-foreground">Avg Revenue/Business</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">+{businessMetrics.newBusinessesThisWeek || 0}</div>
							<div className="text-sm text-muted-foreground">New This Week</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">{businessMetrics.upgradesThisWeek || 0}</div>
							<div className="text-sm text-muted-foreground">Upgrades This Week</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-600">+{businessMetrics.monthlyGrowthRate || 0}%</div>
							<div className="text-sm text-muted-foreground">Monthly Growth</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

/**
 * Loading skeleton for LocalHub dashboard
 */
const LocalHubDashboardSkeleton = () => {
	return (
		<div className="container mx-auto p-6 space-y-8">
			{/* Header Skeleton */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-8 w-80" />
					<Skeleton className="h-4 w-96" />
				</div>
				<Skeleton className="h-10 w-24" />
			</div>

			{/* Content Skeleton */}
			<div className="grid gap-8 lg:grid-cols-3">
				{/* Left Column */}
				<div className="lg:col-span-2 space-y-8">
					{/* Stats Section Skeleton */}
					<div className="space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-4 w-64" />
						</div>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="p-6 border rounded-lg space-y-3">
									<div className="flex items-center justify-between">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-4 w-4" />
									</div>
									<Skeleton className="h-8 w-20" />
									<Skeleton className="h-3 w-24" />
								</div>
							))}
						</div>
					</div>

					{/* Activity Section Skeleton */}
					<div className="p-6 border rounded-lg space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-6 w-36" />
							<Skeleton className="h-4 w-72" />
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
							<Skeleton className="h-4 w-56" />
						</div>
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="p-4 border rounded-lg">
								<div className="flex items-center gap-4">
									<Skeleton className="h-12 w-12 rounded-lg" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-28" />
										<Skeleton className="h-3 w-36" />
									</div>
									<Skeleton className="h-4 w-4" />
								</div>
							</div>
						))}
					</div>

					{/* Revenue Breakdown Skeleton */}
					<div className="p-6 border rounded-lg space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-4 w-52" />
						</div>
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="space-y-2">
								<div className="flex items-center justify-between">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-4 w-12" />
								</div>
								<Skeleton className="h-2 w-full" />
							</div>
						))}
					</div>

					{/* Directory Health Skeleton */}
					<div className="p-6 border rounded-lg space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-6 w-36" />
							<Skeleton className="h-4 w-48" />
						</div>
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="space-y-2">
								<div className="flex items-center justify-between">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-12" />
								</div>
								<Skeleton className="h-2 w-full" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LocalHubDashboardPage;
