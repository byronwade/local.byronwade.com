import React from "react";
import { ProtectedRoute } from "@features/auth";
import { DashboardStats } from "@components/dashboard/dashboard-layout";
import PermissionManager from "@components/admin/permission-manager";
import { PERMISSIONS } from "@lib/auth/roles";

export const metadata = {
	title: "Admin Dashboard - Thorbis",
	description: "Administrative overview for managing users, content, billing, and platform settings.",
};

/**
 * Admin dashboard page with system management features
 * Requires admin-level permissions
 */
export default function AdminDashboardPage() {
	return (
		<ProtectedRoute requiredPermissions={[PERMISSIONS.USER_MANAGE]} minRoleLevel={4} requireEmailVerification={true}>
			<AdminDashboardContent />
		</ProtectedRoute>
	);
}

function AdminDashboardContent() {
	// These would come from real API calls
	const adminStats = [
		{
			title: "Total Users",
			value: "12,489",
			change: "+234 this month",
			icon: "Users",
		},
		{
			title: "Active Businesses",
			value: "3,847",
			change: "+56 this week",
			icon: "Building",
		},
		{
			title: "Pending Reviews",
			value: "23",
			change: "Requires moderation",
			icon: "MessageSquare",
		},
		{
			title: "System Issues",
			value: "2",
			change: "Down from 5 yesterday",
			icon: "AlertTriangle",
		},
	];

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
				<p className="text-muted-foreground">Manage users, content, and platform settings.</p>
			</div>

			<DashboardStats stats={adminStats} />

			<PermissionManager />
		</div>
	);
}
