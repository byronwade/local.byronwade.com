"use client";

import React from "react";
import IndustryDashboardLayout from "../_shared/components/IndustryDashboardLayout";
import { INDUSTRY_TYPES } from "../_shared/services/industryConfig";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { ShoppingCart, Users, DollarSign, TrendingUp, Calendar, Coffee, Utensils, Star, Bell, BedDouble, Percent, Plus } from "lucide-react";

/**
 * Hospitality Dashboard Home
 * Uses modular architecture with industry-specific features
 */
function HospitalityDashboardHome() {
	// Sample data - in real app, this would come from API
	const dashboardData = {
		overview: {
			occupancyRate: 82,
			averageDailyRate: 156,
			revPAR: 128,
			dailyRevenue: 12450,
			guestSatisfaction: 4.7,
			roomsOccupied: 45,
			totalRooms: 55,
		},
		recentActivity: [
			{ type: "booking", message: "New reservation - Room 205", time: "5 min ago" },
			{ type: "review", message: "5-star review received", time: "15 min ago" },
			{ type: "checkin", message: "Guest checked in - Room 301", time: "32 min ago" },
			{ type: "alert", message: "Housekeeping needed - Room 112", time: "1 hour ago" },
		],
		quickActions: [
			{
				title: "Point of Sale",
				description: "Restaurant & bar POS system",
				icon: Utensils,
				href: "/dashboard/hospitality/pos",
				color: "bg-green-50 text-green-600 border-green-200",
			},
			{
				title: "Reservations",
				description: "Manage room bookings",
				icon: Calendar,
				href: "/dashboard/hospitality/reservations",
				color: "bg-blue-50 text-blue-600 border-blue-200",
			},
			{
				title: "Guest Services",
				description: "Guest profiles & preferences",
				icon: Users,
				href: "/dashboard/hospitality/guest-services",
				color: "bg-purple-50 text-purple-600 border-purple-200",
			},
			{
				title: "Menu Management",
				description: "Update menus & pricing",
				icon: Coffee,
				href: "/dashboard/hospitality/menu-management",
				color: "bg-orange-50 text-orange-600 border-orange-200",
			},
		],
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	return (
		<div className="space-y-6">
			{/* Welcome Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hospitality Dashboard</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">Manage your hotel, restaurant, and guest services</p>
				</div>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					New Reservation
				</Button>
			</div>

			{/* Key Performance Metrics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
						<BedDouble className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{dashboardData.overview.occupancyRate}%</div>
						<p className="text-xs text-muted-foreground">
							{dashboardData.overview.roomsOccupied}/{dashboardData.overview.totalRooms} rooms occupied
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Average Daily Rate</CardTitle>
						<DollarSign className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData.overview.averageDailyRate)}</div>
						<p className="text-xs text-muted-foreground">+12% from last month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">RevPAR</CardTitle>
						<Percent className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">{formatCurrency(dashboardData.overview.revPAR)}</div>
						<p className="text-xs text-muted-foreground">Revenue per available room</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Guest Satisfaction</CardTitle>
						<Star className="h-4 w-4 text-yellow-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">{dashboardData.overview.guestSatisfaction}/5</div>
						<p className="text-xs text-muted-foreground">Based on reviews</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Access your most-used hospitality tools</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{dashboardData.quickActions.map((action, index) => {
							const IconComponent = action.icon;
							return (
								<Link key={index} href={action.href}>
									<Card className={`cursor-pointer hover:shadow-md transition-all ${action.color} border-2`}>
										<CardContent className="p-6 text-center">
											<IconComponent className="h-8 w-8 mx-auto mb-3" />
											<h3 className="font-semibold mb-1">{action.title}</h3>
											<p className="text-sm opacity-80">{action.description}</p>
										</CardContent>
									</Card>
								</Link>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Recent Activity & Rate Recommendations */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Bell className="h-5 w-5 mr-2" />
							Recent Activity
						</CardTitle>
						<CardDescription>Latest updates from your property</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{dashboardData.recentActivity.map((activity, index) => (
								<div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
									<div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
									<div className="flex-1">
										<p className="text-sm font-medium">{activity.message}</p>
										<p className="text-xs text-muted-foreground">{activity.time}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Rate Recommendations */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<TrendingUp className="h-5 w-5 mr-2" />
							Rate Recommendations
						</CardTitle>
						<CardDescription>AI-powered pricing suggestions</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
								<div className="flex justify-between items-center">
									<div>
										<p className="font-medium text-green-900 dark:text-green-100">Weekend Premium</p>
										<p className="text-sm text-green-700 dark:text-green-300">Increase rates by 15% for Fri-Sun</p>
									</div>
									<Button size="sm" variant="outline">
										Apply
									</Button>
								</div>
							</div>

							<div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
								<div className="flex justify-between items-center">
									<div>
										<p className="font-medium text-blue-900 dark:text-blue-100">Early Bird Special</p>
										<p className="text-sm text-blue-700 dark:text-blue-300">Offer 10% discount for 30+ day bookings</p>
									</div>
									<Button size="sm" variant="outline">
										Apply
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Revenue Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Today's Revenue Summary</CardTitle>
					<CardDescription>Real-time revenue tracking across all services</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-4">
						<div className="text-center p-4 border rounded-lg">
							<p className="text-sm text-muted-foreground">Room Revenue</p>
							<p className="text-2xl font-bold text-blue-600">{formatCurrency(8750)}</p>
						</div>
						<div className="text-center p-4 border rounded-lg">
							<p className="text-sm text-muted-foreground">Restaurant Revenue</p>
							<p className="text-2xl font-bold text-green-600">{formatCurrency(2100)}</p>
						</div>
						<div className="text-center p-4 border rounded-lg">
							<p className="text-sm text-muted-foreground">Bar Revenue</p>
							<p className="text-2xl font-bold text-purple-600">{formatCurrency(850)}</p>
						</div>
						<div className="text-center p-4 border rounded-lg">
							<p className="text-sm text-muted-foreground">Other Services</p>
							<p className="text-2xl font-bold text-orange-600">{formatCurrency(750)}</p>
						</div>
					</div>
					<div className="mt-4 pt-4 border-t">
						<div className="flex justify-between items-center">
							<span className="text-lg font-medium">Total Daily Revenue</span>
							<span className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData.overview.dailyRevenue)}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

/**
 * Main Hospitality Dashboard Component
 * Wraps the dashboard content with the industry layout
 */
export default function HospitalityDashboard() {
	return (
		<IndustryDashboardLayout industryType={INDUSTRY_TYPES.HOSPITALITY} pageTitle="Hospitality Dashboard" pageDescription="Manage your hotel, restaurant, and guest services">
			<HospitalityDashboardHome />
		</IndustryDashboardLayout>
	);
}
