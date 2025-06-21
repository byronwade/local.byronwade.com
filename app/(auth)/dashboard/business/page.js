"use client";
// pages/business-account.js
import React, { useState } from "react";
import Link from "next/link";
import {
	ArrowUpRight,
	CreditCard,
	DollarSign,
	Users,
	Star,
	MessageSquare,
	Briefcase,
	Building,
	LifeBuoy,
	Settings,
	Bell,
	CheckCircle,
	AlertCircle,
	Clock,
	TrendingUp,
	TrendingDown,
	Plus,
	Eye,
	Heart,
	ThumbsUp,
	Calendar,
	MapPin,
	Phone,
	Mail,
	Globe,
	Zap,
	Shield,
	Award,
	Target,
	BarChart3,
	FileText,
	Image,
	Handshake,
	Wrench,
	User,
	HelpCircle,
	ExternalLink,
	Download,
	Upload,
	RefreshCw,
	Bookmark,
	Share2,
	MoreHorizontal,
	ChevronRight,
	ChevronDown,
	Sparkles,
	Rocket,
	Lightbulb,
	Megaphone,
	Bug,
	Palette,
	Database,
	Lock,
	Unlock,
	Wifi,
	WifiOff,
	Server,
	Monitor,
	Smartphone,
	Tablet,
	Laptop,
	Desktop,
	Mouse,
	Keyboard,
	Headphones,
	Speaker,
	Camera,
	Video,
	Music,
	Gamepad2,
	Printer,
	Scan,
	QrCode,
	Barcode,
	Tag,
	Hash,
	AtSign,
	Percent,
	Infinity,
	Minus,
	Divide,
	X,
	Equal,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Progress } from "@components/ui/progress";
import { Separator } from "@components/ui/separator";
import { toast } from "@components/ui/use-toast";

const businessNavItems = [
	{ name: "Profile", href: "/dashboard/business/profile", icon: Building },
	{ name: "Jobs", href: "/dashboard/business/jobs", icon: Briefcase },
	{ name: "Billing", href: "/dashboard/business/billing", icon: CreditCard },
	{ name: "Settings", href: "/dashboard/business/settings", icon: Settings },
	{ name: "Support", href: "/dashboard/business/support", icon: LifeBuoy },
];

const stats = [
	{ title: "Total Revenue", value: "$45,231.89", change: "+20.1% from last month", icon: DollarSign },
	{ title: "Subscriptions", value: "+2350", change: "+180.1% from last month", icon: Users },
	{ title: "Sales", value: "+12,234", change: "+19% from last month", icon: CreditCard },
	{ title: "Active Now", value: "+573", change: "+201 since last hour", icon: ArrowUpRight },
];

const transactions = [
	{ name: "Liam Johnson", email: "liam@example.com", type: "Sale", status: "Approved", date: "2023-06-23", amount: "$250.00" },
	{ name: "Olivia Smith", email: "olivia@example.com", type: "Refund", status: "Declined", date: "2023-06-24", amount: "$150.00" },
	{ name: "Noah Williams", email: "noah@example.com", type: "Subscription", status: "Approved", date: "2023-06-25", amount: "$350.00" },
	{ name: "Emma Brown", email: "emma@example.com", type: "Sale", status: "Approved", date: "2023-06-26", amount: "$450.00" },
	{ name: "Liam Johnson", email: "liam@example.com", type: "Sale", status: "Approved", date: "2023-06-27", amount: "$550.00" },
];

const recentSales = [
	{ name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", avatar: "/avatars/01.png", fallback: "OM" },
	{ name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", avatar: "/avatars/02.png", fallback: "JL" },
	{ name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", avatar: "/avatars/03.png", fallback: "IN" },
	{ name: "William Kim", email: "will@email.com", amount: "+$99.00", avatar: "/avatars/04.png", fallback: "WK" },
	{ name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", avatar: "/avatars/05.png", fallback: "SD" },
];

export default function BusinessDashboard() {
	const [showAllUpdates, setShowAllUpdates] = useState(false);

	// Business Stats
	const businessStats = [
		{
			title: "Total Revenue",
			value: "$45,231.89",
			change: "+20.1%",
			changeType: "positive",
			icon: DollarSign,
			description: "from last month",
		},
		{
			title: "Active Jobs",
			value: "12",
			change: "+3",
			changeType: "positive",
			icon: Briefcase,
			description: "new this week",
		},
		{
			title: "Customer Reviews",
			value: "127",
			change: "+15",
			changeType: "positive",
			icon: Star,
			description: "this month",
		},
		{
			title: "Profile Views",
			value: "2,847",
			change: "-5.2%",
			changeType: "negative",
			icon: Eye,
			description: "from last week",
		},
	];

	// Recent Activity
	const recentActivity = [
		{
			id: 1,
			type: "review",
			title: "New 5-star review from Sarah Johnson",
			description: "Excellent emergency service - they came at 2 AM and fixed our flooding basement!",
			time: "2 hours ago",
			icon: Star,
			iconColor: "text-yellow-500",
			action: "View Review",
			actionLink: "/dashboard/business/reviews",
		},
		{
			id: 2,
			type: "job",
			title: "New job application received",
			description: "Mike Chen applied for the Plumber position",
			time: "4 hours ago",
			icon: Briefcase,
			iconColor: "text-blue-500",
			action: "Review Application",
			actionLink: "/dashboard/business/jobs",
		},
		{
			id: 3,
			type: "partnership",
			title: "Partnership request from Elite Auto Repair",
			description: "They want to establish a referral partnership",
			time: "1 day ago",
			icon: Handshake,
			iconColor: "text-green-500",
			action: "Review Request",
			actionLink: "/dashboard/business/profile",
		},
		{
			id: 4,
			type: "verification",
			title: "Verification status updated",
			description: "Your business verification is now under review",
			time: "2 days ago",
			icon: Shield,
			iconColor: "text-purple-500",
			action: "View Status",
			actionLink: "/dashboard/business/profile",
		},
		{
			id: 5,
			type: "service",
			title: "New service added",
			description: "Emergency Plumbing service has been added to your profile",
			time: "3 days ago",
			icon: Wrench,
			iconColor: "text-orange-500",
			action: "Manage Services",
			actionLink: "/dashboard/business/profile",
		},
	];

	// System Updates & Change Logs
	const systemUpdates = [
		{
			id: 1,
			type: "feature",
			title: "Enhanced Review Management",
			description: "New dedicated reviews page with advanced filtering and response tools",
			date: "2024-01-25",
			version: "v2.1.0",
			icon: MessageSquare,
			iconColor: "text-blue-500",
			badge: "New",
		},
		{
			id: 2,
			type: "improvement",
			title: "Improved Business Profile",
			description: "Enhanced profile sections with better organization and editing capabilities",
			date: "2024-01-24",
			version: "v2.0.8",
			icon: Building,
			iconColor: "text-green-500",
			badge: "Improved",
		},
		{
			id: 3,
			type: "fix",
			title: "Bug Fixes & Performance",
			description: "Fixed navigation issues and improved page loading speeds",
			date: "2024-01-23",
			version: "v2.0.7",
			icon: Bug,
			iconColor: "text-red-500",
			badge: "Fixed",
		},
		{
			id: 4,
			type: "security",
			title: "Security Updates",
			description: "Enhanced authentication and data protection measures",
			date: "2024-01-22",
			version: "v2.0.6",
			icon: Shield,
			iconColor: "text-purple-500",
			badge: "Security",
		},
		{
			id: 5,
			type: "feature",
			title: "Partnership Management",
			description: "New partnership verification system with step-by-step process",
			date: "2024-01-21",
			version: "v2.0.5",
			icon: Handshake,
			iconColor: "text-indigo-500",
			badge: "New",
		},
	];

	// Quick Actions
	const quickActions = [
		{
			title: "Add New Service",
			description: "Add a new service to your business profile",
			icon: Plus,
			link: "/dashboard/business/profile",
			color: "bg-blue-500 hover:bg-blue-600",
		},
		{
			title: "Post a Job",
			description: "Create a new job posting",
			icon: Briefcase,
			link: "/dashboard/business/jobs",
			color: "bg-green-500 hover:bg-green-600",
		},
		{
			title: "View Reviews",
			description: "Check and respond to customer reviews",
			icon: Star,
			link: "/dashboard/business/reviews",
			color: "bg-yellow-500 hover:bg-yellow-600",
		},
		{
			title: "Update Profile",
			description: "Edit your business information",
			icon: Building,
			link: "/dashboard/business/profile",
			color: "bg-purple-500 hover:bg-purple-600",
		},
	];

	// Recent Reviews Summary
	const recentReviews = [
		{
			id: 1,
			customer: "Sarah Johnson",
			rating: 5,
			title: "Excellent Emergency Service",
			date: "2 hours ago",
			verified: true,
		},
		{
			id: 2,
			customer: "Mike Chen",
			rating: 4,
			title: "Good Service, Fair Price",
			date: "1 day ago",
			verified: true,
		},
		{
			id: 3,
			customer: "Lisa Rodriguez",
			rating: 5,
			title: "Professional and Reliable",
			date: "2 days ago",
			verified: true,
		},
	];

	const renderStars = (rating) => {
		return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-3 h-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />);
	};

	const getUpdateIcon = (type) => {
		const icons = {
			feature: Sparkles,
			improvement: TrendingUp,
			fix: Bug,
			security: Shield,
			announcement: Megaphone,
		};
		return icons[type] || Sparkles;
	};

	return (
		<div className="w-full px-4 lg:px-24 py-16 space-y-8">
			{/* Welcome Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Welcome back, Wade&apos;s Plumbing!</h1>
					<p className="text-muted-foreground">Here&apos;s what&apos;s happening with your business today.</p>
				</div>
				<Button variant="outline" size="sm">
					<RefreshCw className="w-4 h-4 mr-2" />
					Refresh
				</Button>
			</div>

			{/* Business Stats */}
			<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				{businessStats.map((stat, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
							<stat.icon className="w-4 h-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<div className="flex items-center space-x-2">
								<span className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>{stat.change}</span>
								<span className="text-xs text-muted-foreground">{stat.description}</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Recent Activity */}
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Bell className="w-5 h-5" />
								<span>Recent Activity</span>
							</CardTitle>
							<CardDescription>Latest updates and notifications for your business</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{recentActivity.map((activity) => (
								<div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
									<div className={`p-2 rounded-lg bg-muted ${activity.iconColor}`}>
										<activity.icon className="w-4 h-4" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between">
											<h4 className="text-sm font-medium">{activity.title}</h4>
											<span className="text-xs text-muted-foreground">{activity.time}</span>
										</div>
										<p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
										<Button variant="link" size="sm" className="p-0 h-auto text-xs mt-2">
											{activity.action}
											<ChevronRight className="w-3 h-3 ml-1" />
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					{/* System Updates */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Sparkles className="w-5 h-5" />
								<span>System Updates</span>
								<Badge variant="secondary" className="text-xs">
									Latest
								</Badge>
							</CardTitle>
							<CardDescription>Recent platform updates and new features</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{(showAllUpdates ? systemUpdates : systemUpdates.slice(0, 3)).map((update) => (
									<div key={update.id} className="flex items-start space-x-4 p-3 rounded-lg border">
										<div className={`p-2 rounded-lg bg-muted ${update.iconColor}`}>
											<update.icon className="w-4 h-4" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center space-x-2 mb-1">
												<h4 className="text-sm font-medium">{update.title}</h4>
												<Badge variant="outline" className="text-xs">
													{update.badge}
												</Badge>
											</div>
											<p className="text-sm text-muted-foreground mb-2">{update.description}</p>
											<div className="flex items-center space-x-4 text-xs text-muted-foreground">
												<span>{update.date}</span>
												<span>•</span>
												<span>{update.version}</span>
											</div>
										</div>
									</div>
								))}
								{systemUpdates.length > 3 && (
									<Button variant="outline" size="sm" onClick={() => setShowAllUpdates(!showAllUpdates)} className="w-full">
										{showAllUpdates ? "Show Less" : `Show ${systemUpdates.length - 3} More Updates`}
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Zap className="w-5 h-5" />
								<span>Quick Actions</span>
							</CardTitle>
							<CardDescription>Common tasks and shortcuts</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-3">
							{quickActions.map((action, index) => (
								<Link key={index} href={action.link}>
									<Button variant="outline" className="w-full justify-start h-auto p-4 hover:shadow-md transition-all duration-200">
										<div className={`p-2 rounded-lg mr-4 ${action.color} text-white shadow-sm`}>
											<action.icon className="w-5 h-5" />
										</div>
										<div className="text-left flex-1">
											<div className="font-semibold text-sm">{action.title}</div>
											<div className="text-xs text-muted-foreground mt-1">{action.description}</div>
										</div>
										<ChevronRight className="w-4 h-4 text-muted-foreground ml-2" />
									</Button>
								</Link>
							))}
						</CardContent>
					</Card>

					{/* Recent Reviews */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Star className="w-5 h-5" />
								<span>Recent Reviews</span>
							</CardTitle>
							<CardDescription>Latest customer feedback</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{recentReviews.map((review) => (
								<div key={review.id} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<span className="text-sm font-medium">{review.customer}</span>
											{review.verified && (
												<Badge variant="outline" className="text-xs">
													<CheckCircle className="w-3 h-3 mr-1" />
													Verified
												</Badge>
											)}
										</div>
										<span className="text-xs text-muted-foreground">{review.date}</span>
									</div>
									<div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
									<p className="text-sm text-muted-foreground">{review.title}</p>
								</div>
							))}
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href="/dashboard/business/reviews">
									View All Reviews
									<ChevronRight className="w-4 h-4 ml-2" />
								</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Business Health */}
					<Card>
						<CardHeader>
							<CardTitle>Business Health</CardTitle>
							<CardDescription>Your business performance metrics</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>Profile Completion</span>
									<span className="font-medium">85%</span>
								</div>
								<Progress value={85} className="h-2" />
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>Response Rate</span>
									<span className="font-medium">92%</span>
								</div>
								<Progress value={92} className="h-2" />
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>Customer Satisfaction</span>
									<span className="font-medium">4.8/5</span>
								</div>
								<Progress value={96} className="h-2" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

