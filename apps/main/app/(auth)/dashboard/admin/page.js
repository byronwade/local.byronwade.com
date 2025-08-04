import React from "react";
import { ProtectedRoute } from "@components/auth/ProtectedRoute";
import DashboardLayout, { DashboardStats } from "@components/dashboard/DashboardLayout";
import PermissionManager from "@components/admin/PermissionManager";
import { PERMISSIONS } from "@lib/auth/roles";

/**
 * Admin dashboard page with system management features
 * Requires admin-level permissions
 */
export default function AdminDashboardPage() {
	return (
		<ProtectedRoute requiredPermissions={[PERMISSIONS.USER_MANAGE]} minRoleLevel={4} requireEmailVerification={true}>
			<DashboardLayout>
				<AdminDashboardContent />
			</DashboardLayout>
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
