"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";

import {
	Building2,
	DollarSign,
	Users,
	TrendingUp,
	Plus,
	Settings,
	BarChart3,
	Globe,
	Zap,
	Target,
	Award,
	ArrowUpRight,
	Eye,
	MousePointerClick,
	CreditCard,
	AlertCircle,
	Bell,
	CheckCircle,
	Clock,
	TrendingDown,
	RefreshCw,
	ChevronRight,
	ChevronDown,
	Sparkles,
	Rocket,
	Lightbulb,
	Megaphone,
	Bug,
	Shield,
	Handshake,
	MessageSquare,
	Star,
	Calendar,
	MapPin,
	Phone,
	Mail,
	Database,
	Lock,
	Unlock,
	Wifi,
	Server,
	Monitor,
	Smartphone,
	Tablet,
	Laptop,
	Desktop,
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
	Bookmark,
	Share2,
	MoreHorizontal,
	ExternalLink,
	Download,
	Upload,
	HelpCircle,
	User,
	FileText,
	Image,
	Wrench,
	Palette,
	WifiOff,
	Keyboard,
	Mouse,
	Headphones,
	Speaker,
	Gamepad2 as Gamepad2Icon,
	Music as MusicIcon,
	Video as VideoIcon,
	Camera as CameraIcon,
	Speaker as SpeakerIcon,
	Headphones as HeadphonesIcon,
	Keyboard as KeyboardIcon,
	Mouse as MouseIcon,
	Desktop as DesktopIcon,
	Laptop as LaptopIcon,
	Tablet as TabletIcon,
	Smartphone as SmartphoneIcon,
	Monitor as MonitorIcon,
	Server as ServerIcon,
	WifiOff as WifiOffIcon,
	Wifi as WifiIcon,
	Unlock as UnlockIcon,
	Lock as LockIcon,
	Database as DatabaseIcon,
	Palette as PaletteIcon,
	Bug as BugIcon,
	Megaphone as MegaphoneIcon,
	Lightbulb as LightbulbIcon,
	Rocket as RocketIcon,
	Sparkles as SparklesIcon,
	ChevronDown as ChevronDownIcon,
	ChevronRight as ChevronRightIcon,
	MoreHorizontal as MoreHorizontalIcon,
	Share2 as Share2Icon,
	Bookmark as BookmarkIcon,
	RefreshCw as RefreshCwIcon,
	Upload as UploadIcon,
	Download as DownloadIcon,
	ExternalLink as ExternalLinkIcon,
	HelpCircle as HelpCircleIcon,
	User as UserIcon,
	Wrench as WrenchIcon,
	Image as ImageIcon,
	FileText as FileTextIcon,
	Handshake as HandshakeIcon,
	MessageSquare as MessageSquareIcon,
	Star as StarIcon,
	Calendar as CalendarIcon,
	MapPin as MapPinIcon,
	Phone as PhoneIcon,
	Mail as MailIcon,
	Globe as GlobeIcon,
	Zap as ZapIcon,
	Shield as ShieldIcon,
	Award as AwardIcon,
	Target as TargetIcon,
	BarChart3 as BarChart3Icon,
	TrendingDown as TrendingDownIcon,
	Clock as ClockIcon,
	CheckCircle as CheckCircleIcon,
	AlertCircle as AlertCircleIcon,
	CreditCard as CreditCardIcon,
	MousePointerClick as MousePointerClickIcon,
	Eye as EyeIcon,
	ArrowUpRight as ArrowUpRightIcon,
	TrendingUp as TrendingUpIcon,
	Users as UsersIcon,
	DollarSign as DollarSignIcon,
	Settings as SettingsIcon,
	Plus as PlusIcon,
	Building2 as Building2Icon,
} from "lucide-react";

export default function LocalHubDashboard() {
	const [showAllUpdates, setShowAllUpdates] = useState(false);

	useEffect(() => {
		document.title = "LocalHub Dashboard - Thorbis";
	}, []);

	// Directory Stats
	const directoryStats = [
		{
			title: "Monthly Revenue",
			value: "$2,715",
			change: "+12.5%",
			changeType: "positive",
			icon: DollarSign,
			description: "from last month",
		},
		{
			title: "Active Businesses",
			value: "45",
			change: "+8",
			changeType: "positive",
			icon: Building2,
			description: "new this month",
		},
		{
			title: "Directory Views",
			value: "8,234",
			change: "+18.2%",
			changeType: "positive",
			icon: Eye,
			description: "from last month",
		},
		{
			title: "Your Share",
			value: "$2,172",
			change: "+$205",
			changeType: "positive",
			icon: TrendingUp,
			description: "this month",
		},
	];

	// Recent Activity
	const recentActivity = [
		{
			id: 1,
			type: "subscription",
			title: "Wade's Plumbing started Pro subscription",
			description: "New $79/month Pro subscription activated",
			time: "2 hours ago",
			icon: CreditCard,
			iconColor: "text-green-500",
			action: "View Business",
			actionLink: "/dashboard/localhub/businesses",
		},
		{
			id: 2,
			type: "payment",
			title: "Payment received from Local Coffee Shop",
			description: "Monthly subscription payment processed",
			time: "5 hours ago",
			icon: DollarSign,
			iconColor: "text-blue-500",
			action: "View Payment",
			actionLink: "/dashboard/localhub/analytics",
		},
		{
			id: 3,
			type: "signup",
			title: "Downtown Dentistry joined directory",
			description: "New business signup - pending setup",
			time: "1 day ago",
			icon: Building2,
			iconColor: "text-purple-500",
			action: "Setup Business",
			actionLink: "/dashboard/localhub/businesses",
		},
		{
			id: 4,
			type: "upgrade",
			title: "Fresh Cuts Salon upgraded to Premium",
			description: "Upgraded from Basic to Premium plan",
			time: "2 days ago",
			icon: Star,
			iconColor: "text-yellow-500",
			action: "View Upgrade",
			actionLink: "/dashboard/localhub/analytics",
		},
		{
			id: 5,
			type: "customization",
			title: "Directory customization updated",
			description: "New branding and layout changes applied",
			time: "3 days ago",
			icon: Palette,
			iconColor: "text-indigo-500",
			action: "View Changes",
			actionLink: "/dashboard/localhub/customization",
		},
	];

	// System Updates & Change Logs
	const systemUpdates = [
		{
			id: 1,
			type: "feature",
			title: "Enhanced Analytics Dashboard",
			description: "New detailed analytics with revenue tracking and business insights",
			date: "2024-01-25",
			version: "v2.1.0",
			icon: BarChart3,
			iconColor: "text-blue-500",
			badge: "New",
		},
		{
			id: 2,
			type: "improvement",
			title: "Improved Business Management",
			description: "Enhanced business onboarding and management tools",
			date: "2024-01-24",
			version: "v2.0.8",
			icon: Building2,
			iconColor: "text-green-500",
			badge: "Improved",
		},
		{
			id: 3,
			type: "fix",
			title: "Payment Processing Fixes",
			description: "Fixed subscription payment issues and improved reliability",
			date: "2024-01-23",
			version: "v2.0.7",
			icon: CreditCard,
			iconColor: "text-red-500",
			badge: "Fixed",
		},
		{
			id: 4,
			type: "security",
			title: "Security Enhancements",
			description: "Enhanced data protection and authentication measures",
			date: "2024-01-22",
			version: "v2.0.6",
			icon: Shield,
			iconColor: "text-purple-500",
			badge: "Security",
		},
		{
			id: 5,
			type: "feature",
			title: "Custom Domain Support",
			description: "New custom domain configuration and SSL certificate management",
			date: "2024-01-21",
			version: "v2.0.5",
			icon: Globe,
			iconColor: "text-indigo-500",
			badge: "New",
		},
	];

	// Quick Actions
	const quickActions = [
		{
			title: "Add New Business",
			description: "Add a new business to your directory",
			icon: Plus,
			link: "/dashboard/localhub/businesses",
			color: "bg-blue-500 hover:bg-blue-600",
		},
		{
			title: "View Analytics",
			description: "Check directory performance and revenue",
			icon: BarChart3,
			link: "/dashboard/localhub/analytics",
			color: "bg-green-500 hover:bg-green-600",
		},
		{
			title: "Customize Directory",
			description: "Update branding and appearance",
			icon: Palette,
			link: "/dashboard/localhub/customization",
			color: "bg-purple-500 hover:bg-purple-600",
		},
		{
			title: "Manage Settings",
			description: "Configure directory settings and domain",
			icon: Settings,
			link: "/dashboard/localhub/settings",
			color: "bg-orange-500 hover:bg-orange-600",
		},
	];

	// Recent Businesses
	const recentBusinesses = [
		{
			id: 1,
			name: "Wade's Plumbing",
			plan: "Pro",
			status: "Active",
			revenue: "$79/month",
			joined: "2 hours ago",
		},
		{
			id: 2,
			name: "Local Coffee Shop",
			plan: "Basic",
			status: "Active",
			revenue: "$49/month",
			joined: "1 day ago",
		},
		{
			id: 3,
			name: "Downtown Dentistry",
			plan: "Basic",
			status: "Pending",
			revenue: "$49/month",
			joined: "2 days ago",
		},
	];

	// Revenue Breakdown
	const revenueBreakdown = [
		{
			plan: "Basic Subscriptions",
			count: 30,
			revenue: "$1,470",
			percentage: 54,
		},
		{
			plan: "Pro Subscriptions",
			count: 12,
			revenue: "$948",
			percentage: 35,
		},
		{
			plan: "Premium Features",
			count: 3,
			revenue: "$297",
			percentage: 11,
		},
	];

	return (
		<div className="w-full px-4 lg:px-24 py-16 space-y-8">
			{/* Welcome Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Welcome back to LocalHub!</h1>
					<p className="text-muted-foreground">Here&apos;s what&apos;s happening with your directory today.</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm">
						<Eye className="w-4 h-4 mr-2" />
						Preview Directory
					</Button>
					<Button variant="outline" size="sm">
						<RefreshCw className="w-4 h-4 mr-2" />
						Refresh
					</Button>
				</div>
			</div>

			{/* Directory Stats */}
			<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				{directoryStats.map((stat, index) => (
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
							<CardDescription>Latest updates and notifications for your directory</CardDescription>
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

					{/* Recent Businesses */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Building2 className="w-5 h-5" />
								<span>Recent Businesses</span>
							</CardTitle>
							<CardDescription>Latest additions to your directory</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{recentBusinesses.map((business) => (
								<div key={business.id} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<span className="text-sm font-medium">{business.name}</span>
											<Badge variant="outline" className="text-xs">
												{business.plan}
											</Badge>
										</div>
										<span className="text-xs text-muted-foreground">{business.joined}</span>
									</div>
									<div className="flex items-center justify-between text-xs">
										<span className={`${business.status === "Active" ? "text-green-600" : "text-yellow-600"}`}>{business.status}</span>
										<span className="font-medium text-green-600">{business.revenue}</span>
									</div>
								</div>
							))}
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href="/dashboard/localhub/businesses">
									View All Businesses
									<ChevronRight className="w-4 h-4 ml-2" />
								</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Revenue Breakdown */}
					<Card>
						<CardHeader>
							<CardTitle>Revenue Breakdown</CardTitle>
							<CardDescription>Monthly subscription distribution</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{revenueBreakdown.map((item, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span>
											{item.plan} ({item.count})
										</span>
										<span className="font-medium">${item.revenue}</span>
									</div>
									<Progress value={item.percentage} className="h-2" />
								</div>
							))}
							<div className="pt-3 border-t">
								<div className="flex items-center justify-between text-sm font-bold">
									<span>Total Monthly Revenue</span>
									<span className="text-green-600">$2,715</span>
								</div>
								<div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
									<span>Your Share (80%)</span>
									<span>$2,172</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Directory Health */}
					<Card>
						<CardHeader>
							<CardTitle>Directory Health</CardTitle>
							<CardDescription>Your directory performance metrics</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>Business Retention</span>
									<span className="font-medium">97.9%</span>
								</div>
								<Progress value={97.9} className="h-2" />
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>Payment Success Rate</span>
									<span className="font-medium">99.2%</span>
								</div>
								<Progress value={99.2} className="h-2" />
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>Directory Uptime</span>
									<span className="font-medium">99.9%</span>
								</div>
								<Progress value={99.9} className="h-2" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

