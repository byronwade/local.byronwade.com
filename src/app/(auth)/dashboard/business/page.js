import React from "react";
import { ProtectedRoute } from "@components/features/auth";
import DashboardLayout, { DashboardStats, DashboardQuickActions } from "@components/dashboard/DashboardLayout";
import { PERMISSIONS } from "@lib/auth/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Star, Eye, Plus, Edit, BarChart3, MapPin } from "lucide-react";

/**
 * Business dashboard page for business owners
 * Shows business-specific analytics and management tools
 */
export default function BusinessDashboardPage() {
	return (
		<ProtectedRoute requiredPermissions={[PERMISSIONS.BUSINESS_MANAGE]} minRoleLevel={2} requireEmailVerification={true}>
			<DashboardLayout>
				<BusinessDashboardContent />
			</DashboardLayout>
		</ProtectedRoute>
	);
}

function BusinessDashboardContent() {
	// Mock data - would come from real API calls
	const businessStats = [
		{
			title: "Total Views",
			value: "8,432",
			change: "+15% from last month",
			icon: "Eye",
		},
		{
			title: "New Reviews",
			value: "12",
			change: "+3 this week",
			icon: "MessageSquare",
		},
		{
			title: "Average Rating",
			value: "4.6",
			change: "Based on 87 reviews",
			icon: "Star",
		},
		{
			title: "Click-through Rate",
			value: "3.2%",
			change: "+0.4% from last month",
			icon: "TrendingUp",
		},
	];

	const quickActions = [
		{
			title: "Add New Business",
			description: "List another business",
			href: "/dashboard/business/add",
			icon: "Plus",
			permission: PERMISSIONS.BUSINESS_CREATE,
		},
		{
			title: "Update Information",
			description: "Keep details current",
			href: "/dashboard/business/edit",
			icon: "Edit",
			permission: PERMISSIONS.BUSINESS_UPDATE,
		},
		{
			title: "View Analytics",
			description: "See detailed metrics",
			href: "/dashboard/business/analytics",
			icon: "BarChart3",
			permission: PERMISSIONS.BUSINESS_MANAGE,
		},
		{
			title: "Manage Reviews",
			description: "Respond to customer feedback",
			href: "/dashboard/business/reviews",
			icon: "MessageSquare",
			permission: PERMISSIONS.BUSINESS_MANAGE,
		},
	];

	// Mock business listings
	const businesses = [
		{
			id: 1,
			name: "Mario's Italian Restaurant",
			status: "active",
			rating: 4.8,
			reviewCount: 234,
			views: 2543,
			address: "123 Main St, Anytown USA",
			verified: true,
		},
		{
			id: 2,
			name: "Downtown Coffee Shop",
			status: "pending_verification",
			rating: 4.2,
			reviewCount: 45,
			views: 892,
			address: "456 Oak Ave, Anytown USA",
			verified: false,
		},
		{
			id: 3,
			name: "Tech Repair Pro",
			status: "active",
			rating: 4.9,
			reviewCount: 156,
			views: 1876,
			address: "789 Tech Blvd, Anytown USA",
			verified: true,
		},
	];

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Business Dashboard</h2>
				<p className="text-muted-foreground">Manage your business listings and track performance.</p>
			</div>

			<DashboardStats stats={businessStats} />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Business listings */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span>Your Businesses</span>
								<Button size="sm" asChild>
									<a href="/dashboard/business/add">
										<Plus className="h-4 w-4 mr-2" />
										Add Business
									</a>
								</Button>
							</CardTitle>
							<CardDescription>Manage and monitor your business listings</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{businesses.map((business) => (
								<div key={business.id} className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">{business.name.charAt(0)}</div>
										<div>
											<div className="flex items-center space-x-2">
												<h3 className="font-semibold">{business.name}</h3>
												{business.verified && (
													<Badge variant="default" className="text-xs">
														Verified
													</Badge>
												)}
												<Badge variant={business.status === "active" ? "default" : "secondary"} className="text-xs">
													{business.status.replace("_", " ")}
												</Badge>
											</div>
											<div className="flex items-center space-x-4 text-sm text-muted-foreground">
												<span className="flex items-center">
													<MapPin className="h-3 w-3 mr-1" />
													{business.address}
												</span>
											</div>
											<div className="flex items-center space-x-4 mt-1">
												<span className="flex items-center text-sm">
													<Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
													{business.rating} ({business.reviewCount} reviews)
												</span>
												<span className="flex items-center text-sm text-muted-foreground">
													<Eye className="h-3 w-3 mr-1" />
													{business.views.toLocaleString()} views
												</span>
											</div>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<Button variant="outline" size="sm" asChild>
											<a href={`/dashboard/business/${business.id}/edit`}>
												<Edit className="h-3 w-3 mr-1" />
												Edit
											</a>
										</Button>
										<Button variant="outline" size="sm" asChild>
											<a href={`/dashboard/business/${business.id}/analytics`}>
												<BarChart3 className="h-3 w-3 mr-1" />
												Analytics
											</a>
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Quick actions */}
				<div>
					<DashboardQuickActions actions={quickActions} />

					{/* Recent activity */}
					<Card className="mt-6">
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<div className="flex-1">
										<p className="text-sm">New review received</p>
										<p className="text-xs text-muted-foreground">Mario&apos;s Italian Restaurant • 2 hours ago</p>
									</div>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
									<div className="flex-1">
										<p className="text-sm">Business info updated</p>
										<p className="text-xs text-muted-foreground">Tech Repair Pro • 1 day ago</p>
									</div>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
									<div className="flex-1">
										<p className="text-sm">Verification pending</p>
										<p className="text-xs text-muted-foreground">Downtown Coffee Shop • 3 days ago</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
