"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { useAuth } from "@context/auth-context";
import { RefreshCw, User, Shield, AlertTriangle, CheckCircle } from "lucide-react";

/**
 * Debug component to check and refresh user roles
 * Supports dark and light mode theming
 * Use this temporarily to debug permission issues
 */
export function RoleDebugger() {
	const { user, userRoles, isAuthenticated, refreshUserRoles } = useAuth();

	const handleRefreshRoles = async () => {
		console.log("Refreshing user roles...");
		await refreshUserRoles();
	};

	if (!isAuthenticated) {
		return (
			<Card className="mb-4 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
						<AlertTriangle className="h-5 w-5" />
						Debug: Not Authenticated
					</CardTitle>
					<CardDescription className="text-yellow-600 dark:text-yellow-400">User is not currently authenticated</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="mb-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
					<Shield className="h-5 w-5" />
					Role Debugger
				</CardTitle>
				<CardDescription className="text-blue-600 dark:text-blue-400">Current user authentication and role status</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h4 className="font-semibold flex items-center gap-2 mb-2 text-foreground">
							<User className="h-4 w-4" />
							User Info
						</h4>
						<div className="space-y-1 text-sm text-muted-foreground">
							<p>
								<strong className="text-foreground">ID:</strong>
								<span className="font-mono text-xs ml-1">{user?.id}</span>
							</p>
							<p>
								<strong className="text-foreground">Email:</strong>
								<span className="ml-1">{user?.email}</span>
							</p>
							<p className="flex items-center gap-2">
								<strong className="text-foreground">Email Verified:</strong>
								{user?.email_confirmed_at ? (
									<span className="flex items-center gap-1 text-green-600 dark:text-green-400">
										<CheckCircle className="h-3 w-3" />
										Yes
									</span>
								) : (
									<span className="flex items-center gap-1 text-red-600 dark:text-red-400">
										<AlertTriangle className="h-3 w-3" />
										No
									</span>
								)}
							</p>
						</div>
					</div>

					<div>
						<h4 className="font-semibold flex items-center gap-2 mb-2 text-foreground">
							<Shield className="h-4 w-4" />
							Current Roles
						</h4>
						<div className="flex flex-wrap gap-1 mb-2">
							{userRoles.map((role) => (
								<Badge key={role} variant={role === "business_owner" ? "default" : "secondary"} className={role === "business_owner" ? "bg-green-600 dark:bg-green-700 text-white dark:text-green-100" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}>
									{role.replace(/_/g, " ")}
								</Badge>
							))}
							{userRoles.length === 0 && (
								<Badge variant="destructive" className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800">
									No roles assigned
								</Badge>
							)}
						</div>
					</div>
				</div>

				<div>
					<h4 className="font-semibold mb-2 text-foreground">Required for Business Dashboard:</h4>
					<div className="space-y-2 text-sm">
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">Role: business_owner</span>
							{userRoles.includes("business_owner") ? (
								<Badge variant="default" className="bg-green-600 dark:bg-green-700 text-white dark:text-green-100 flex items-center gap-1">
									<CheckCircle className="h-3 w-3" />
									Has Role
								</Badge>
							) : (
								<Badge variant="destructive" className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800 flex items-center gap-1">
									<AlertTriangle className="h-3 w-3" />
									Missing
								</Badge>
							)}
						</div>
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground">Permission: business.manage</span>
							{userRoles.includes("business_owner") ? (
								<Badge variant="default" className="bg-green-600 dark:bg-green-700 text-white dark:text-green-100 flex items-center gap-1">
									<CheckCircle className="h-3 w-3" />
									Should Have
								</Badge>
							) : (
								<Badge variant="destructive" className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800 flex items-center gap-1">
									<AlertTriangle className="h-3 w-3" />
									Missing
								</Badge>
							)}
						</div>
					</div>
				</div>

				<Button onClick={handleRefreshRoles} className="w-full" variant="outline">
					<RefreshCw className="h-4 w-4 mr-2" />
					Refresh Roles
				</Button>

				<div className="text-xs text-muted-foreground bg-muted/50 dark:bg-muted/20 p-3 rounded-lg border border-border">
					<p className="font-semibold text-foreground mb-1">Debug Information:</p>
					<ul className="space-y-1 list-disc list-inside">
						<li>If you own businesses but don't have business_owner role, click "Refresh Roles"</li>
						<li>This component should be removed once debugging is complete</li>
						<li>User ID and roles are cached - refresh may be needed after database changes</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}

export default RoleDebugger;
