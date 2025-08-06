import React from "react";
import { ProtectedRoute } from "@components/features/auth";
import DashboardLayout, { DashboardStats, DashboardQuickActions } from "@components/dashboard/DashboardLayout";
import { PERMISSIONS } from "@lib/auth/roles";

/**
 * Main dashboard page with overview stats and quick actions
 * Uses real authentication data and role-based content
 */
export default function DashboardPage() {
	return (
		<ProtectedRoute requiredPermissions={[PERMISSIONS.PROFILE_READ]} requireEmailVerification={true}>
			<DashboardLayout>
				<DashboardContent />
			</DashboardLayout>
		</ProtectedRoute>
	);
}

function DashboardContent() {
	// These would come from API calls in a real implementation
	const stats = [
		{
			title: "Profile Views",
			value: "2,543",
			change: "+12% from last month",
			icon: "Eye",
		},
		{
			title: "Reviews Received",
			value: "47",
			change: "+3 this week",
			icon: "MessageSquare",
		},
		{
			title: "Business Listings",
			value: "3",
			change: "All verified",
			icon: "Building",
		},
		{
			title: "Average Rating",
			value: "4.8",
			change: "Based on 47 reviews",
			icon: "Star",
		},
	];

	const quickActions = [
		{
			title: "Update Profile",
			description: "Keep your information current",
			href: "/dashboard/user/profile",
			icon: "Users",
			permission: PERMISSIONS.PROFILE_UPDATE,
		},
		{
			title: "Add Business",
			description: "List a new business",
			href: "/dashboard/business/add",
			icon: "Plus",
			permission: PERMISSIONS.BUSINESS_CREATE,
		},
		{
			title: "Manage Listings",
			description: "Edit existing businesses",
			href: "/dashboard/business",
			icon: "Edit",
			permission: PERMISSIONS.BUSINESS_MANAGE,
		},
		{
			title: "View Analytics",
			description: "See performance metrics",
			href: "/dashboard/business/analytics",
			icon: "BarChart3",
			permission: PERMISSIONS.BUSINESS_MANAGE,
		},
		{
			title: "LocalHub Directory",
			description: "Manage local directory",
			href: "/dashboard/localhub",
			icon: "MapPin",
			permission: PERMISSIONS.BUSINESS_MODERATE,
		},
		{
			title: "Platform Analytics",
			description: "View system-wide metrics",
			href: "/dashboard/admin/analytics",
			icon: "TrendingUp",
			permission: PERMISSIONS.ANALYTICS_VIEW,
		},
	];

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
				<p className="text-muted-foreground">Here&apos;s what&apos;s happening with your account and businesses.</p>
			</div>

			<DashboardStats stats={stats} />

			<DashboardQuickActions actions={quickActions} />
		</div>
	);
}
