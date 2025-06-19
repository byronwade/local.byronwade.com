"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";

import { Building2, DollarSign, Users, TrendingUp, Plus, Settings, BarChart3, Globe, Zap, Target, Award, ArrowUpRight, Eye, MousePointerClick, CreditCard, AlertCircle } from "lucide-react";

const dashboardItems = [
	{
		href: "/dashboard/localhub/businesses",
		icon: <Users className="w-6 h-6" />,
		title: "Manage Businesses",
		description: "Add, edit, and manage all business listings in your directory.",
		badge: "45 Businesses",
		category: "core",
	},
	{
		href: "/dashboard/localhub/analytics",
		icon: <BarChart3 className="w-6 h-6" />,
		title: "Analytics & Reports",
		description: "View detailed performance metrics and growth insights.",
		badge: "24% Growth",
		category: "core",
	},
	{
		href: "/dashboard/localhub/subscriptions",
		icon: <CreditCard className="w-6 h-6" />,
		title: "Revenue & Billing",
		description: "Track subscriptions, payments, and revenue streams.",
		badge: "$2,340/mo",
		category: "core",
	},
	{
		href: "/dashboard/localhub/customization",
		icon: <Settings className="w-6 h-6" />,
		title: "Customize Directory",
		description: "Personalize your directory's appearance and branding.",
		badge: "Premium",
		category: "settings",
	},
	{
		href: "/dashboard/localhub/domains",
		icon: <Globe className="w-6 h-6" />,
		title: "Domain & URL",
		description: "Set up your custom domain and directory URL.",
		badge: "Custom Domain",
		category: "settings",
	},
];

const revenueStats = [
	{
		title: "Monthly Revenue",
		value: "$2,340",
		change: "+12.5% from last month",
		icon: DollarSign,
		trend: "up",
	},
	{
		title: "Your Share (80%)",
		value: "$1,872",
		change: "+$205 this month",
		icon: TrendingUp,
		trend: "up",
	},
	{
		title: "Active Subscriptions",
		value: "45",
		change: "+3 new this month",
		icon: Users,
		trend: "up",
	},
	{
		title: "Directory Views",
		value: "8,234",
		change: "+18.2% from last month",
		icon: Eye,
		trend: "up",
	},
];

const recentActivities = [
	{
		type: "subscription",
		business: "Wade's Plumbing",
		action: "Started Pro subscription",
		amount: "$79/month",
		time: "2 hours ago",
	},
	{
		type: "payment",
		business: "Local Coffee Shop",
		action: "Payment received",
		amount: "$49/month",
		time: "5 hours ago",
	},
	{
		type: "signup",
		business: "Downtown Dentistry",
		action: "New business signup",
		amount: "Pending setup",
		time: "1 day ago",
	},
	{
		type: "upgrade",
		business: "Fresh Cuts Salon",
		action: "Upgraded to Premium",
		amount: "$99/month",
		time: "2 days ago",
	},
];

export default function LocalHubDashboard() {
	const coreItems = dashboardItems.filter((item) => item.category === "core");
	const settingsItems = dashboardItems.filter((item) => item.category === "settings");

	return (
		<div className="w-full px-4 py-16 space-y-8 lg:px-24">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold">LocalHub Dashboard</h1>
					<p className="mt-2 text-muted-foreground">Manage your local business directory and track your revenue.</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm">
						<Eye className="w-4 h-4 mr-2" />
						Preview Directory
					</Button>
					<Button size="sm">
						<Plus className="w-4 h-4 mr-2" />
						Add Business
					</Button>
				</div>
			</div>
			{/* Revenue Overview Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{revenueStats.map((stat, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
							<stat.icon className="w-4 h-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"} flex items-center`}>
								<ArrowUpRight className="w-3 h-3 mr-1" />
								{stat.change}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
			{/* Main Navigation */}
			<div>
				<h2 className="mb-6 text-2xl font-bold">Directory Management</h2>
				<div className="grid gap-6 md:grid-cols-3">
					{coreItems.map((item, index) => (
						<Link href={item.href} key={index}>
							<Card className="h-full transition-all duration-300 cursor-pointer hover:shadow-md hover:border-primary">
								<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
									<div className="flex items-center space-x-3">
										{item.icon}
										<CardTitle className="text-base font-medium">{item.title}</CardTitle>
									</div>
									<Badge variant="secondary" className="text-xs">
										{item.badge}
									</Badge>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">{item.description}</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
			{/* Revenue & Activity */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Revenue Breakdown */}
				<Card>
					<CardHeader>
						<CardTitle>Revenue Breakdown</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
								<span className="text-sm font-medium">Basic Subscriptions (30)</span>
								<span className="font-bold">$1,470/mo</span>
							</div>
							<div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
								<span className="text-sm font-medium">Pro Subscriptions (12)</span>
								<span className="font-bold">$948/mo</span>
							</div>
							<div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
								<span className="text-sm font-medium">Premium Features (3)</span>
								<span className="font-bold">$297/mo</span>
							</div>
							<div className="pt-3 border-t">
								<div className="flex items-center justify-between text-sm font-bold">
									<span>Total Monthly Revenue</span>
									<span className="text-green-600">$2,715/mo</span>
								</div>
								<div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
									<span>Your Share (80%)</span>
									<span>$2,172/mo</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{recentActivities.slice(0, 3).map((activity, index) => (
								<div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
									<div className="flex-1">
										<p className="text-sm font-medium">{activity.business}</p>
										<p className="text-xs text-muted-foreground">{activity.action}</p>
									</div>
									<div className="text-right">
										<p className="text-xs font-medium text-green-600">{activity.amount}</p>
										<p className="text-xs text-muted-foreground">{activity.time}</p>
									</div>
								</div>
							))}
						</div>
						<div className="mt-4">
							<Button variant="outline" size="sm" className="w-full">
								View All Activity
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Growth Metrics */}
				<Card>
					<CardHeader>
						<CardTitle>Growth Metrics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm">Monthly Growth</span>
								<span className="font-bold text-green-600">+12.5%</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">New Businesses</span>
								<span className="font-bold">8 this month</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">Churn Rate</span>
								<span className="font-bold text-red-500">2.1%</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">Avg Revenue/Business</span>
								<span className="font-bold">$52/mo</span>
							</div>
						</div>
						<div className="mt-4">
							<Button variant="outline" size="sm" className="w-full">
								<Target className="w-4 h-4 mr-2" />
								Growth Tools
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
			{/* Revenue Sharing Model */}
			<Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
				<CardHeader>
					<CardTitle className="flex items-center">
						<Award className="w-5 h-5 mr-2 text-blue-600" />
						Revenue Sharing Model
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">80%</div>
							<p className="text-sm text-muted-foreground">Your Revenue Share</p>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">20%</div>
							<p className="text-sm text-muted-foreground">Platform Fee</p>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">$1,872</div>
							<p className="text-sm text-muted-foreground">Your Monthly Earnings</p>
						</div>
					</div>
					<div className="p-3 mt-4 rounded-lg bg-white/50 dark:bg-card/50">
						<p className="text-sm text-muted-foreground">
							<AlertCircle className="inline w-4 h-4 mr-2" />
							You keep 80% of all subscription revenue. We handle payments, hosting, and platform maintenance.
						</p>
					</div>
				</CardContent>
			</Card>
			{/* Settings & Customization */}
			<div>
				<h2 className="mb-6 text-2xl font-bold">Directory Settings</h2>
				<div className="grid gap-6 md:grid-cols-2">
					{settingsItems.map((item, index) => (
						<Link href={item.href} key={index}>
							<Card className="h-full transition-all duration-300 cursor-pointer hover:shadow-md hover:border-primary">
								<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
									<div className="flex items-center space-x-3">
										{item.icon}
										<CardTitle className="text-base font-medium">{item.title}</CardTitle>
									</div>
									<Badge variant="secondary" className="text-xs">
										{item.badge}
									</Badge>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">{item.description}</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

