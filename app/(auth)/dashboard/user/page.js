"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import useAuthStore from "@store/useAuthStore";

import {
	Activity,
	Briefcase,
	ChevronDown,
	DollarSign,
	Gift,
	Settings,
	Star,
	TrendingUp,
	HelpCircle,
	Bell,
	CheckCircle,
	Clock,
	TrendingDown,
	RefreshCw,
	ChevronRight,
	ChevronDown as ChevronDownIcon,
	Sparkles,
	Rocket,
	Lightbulb,
	Megaphone,
	Bug,
	Shield,
	Handshake,
	MessageSquare,
	Calendar,
	MapPin,
	Phone,
	Mail,
	Globe,
	Zap,
	Award,
	Target,
	BarChart3,
	FileText,
	Image as ImageIcon,
	User,
	Eye,
	Heart,
	ThumbsUp,
	Plus,
	Bookmark,
	Share2,
	MoreHorizontal,
	ExternalLink,
	Download,
	Upload,
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
	ImageIcon as ImageIconIcon,
	FileText as FileTextIcon,
	Handshake as HandshakeIcon,
	MessageSquare as MessageSquareIcon,
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
	Eye as EyeIcon,
	Heart as HeartIcon,
	ThumbsUp as ThumbsUpIcon,
	Plus as PlusIcon,
	TrendingUp as TrendingUpIcon,
	Star as StarIcon,
	Gift as GiftIcon,
	Settings as SettingsIcon,
	DollarSign as DollarSignIcon,
	Briefcase as BriefcaseIcon,
	Activity as ActivityIcon,
	Building2,
} from "lucide-react";

export default function Dashboard() {
	const { user } = useAuthStore();
	const [showAllUpdates, setShowAllUpdates] = useState(false);

	useEffect(() => {
		document.title = "User Dashboard - Thorbis";
	}, []);

	// User Stats
	const userStats = [
		{
			title: "Jobs Applied",
			value: "12",
			change: "+3",
			changeType: "positive",
			icon: Briefcase,
			description: "this month",
		},
		{
			title: "Reviews Written",
			value: "8",
			change: "+2",
			changeType: "positive",
			icon: Star,
			description: "this month",
		},
		{
			title: "Profile Views",
			value: "156",
			change: "+23",
			changeType: "positive",
			icon: Eye,
			description: "this week",
		},
		{
			title: "Referral Earnings",
			value: "$45",
			change: "+$12",
			changeType: "positive",
			icon: Gift,
			description: "this month",
		},
	];

	// Recent Activity
	const recentActivity = [
		{
			id: 1,
			type: "job",
			title: "Applied to Plumber position at Wade's Plumbing",
			description: "Your application has been submitted and is under review",
			time: "2 hours ago",
			icon: Briefcase,
			iconColor: "text-blue-500",
			action: "View Application",
			actionLink: "/dashboard/user/jobs",
		},
		{
			id: 2,
			type: "review",
			title: "Wrote a 5-star review for Local Coffee Shop",
			description: "Your review has been published and is visible to others",
			time: "1 day ago",
			icon: Star,
			iconColor: "text-yellow-500",
			action: "View Review",
			actionLink: "/dashboard/user/reviews",
		},
		{
			id: 3,
			type: "referral",
			title: "Earned $12 from referral bonus",
			description: "Your friend signed up using your referral link",
			time: "2 days ago",
			icon: Gift,
			iconColor: "text-green-500",
			action: "View Earnings",
			actionLink: "/dashboard/user/referral",
		},
		{
			id: 4,
			type: "profile",
			title: "Profile viewed by Downtown Dentistry",
			description: "A business viewed your profile and contact information",
			time: "3 days ago",
			icon: Eye,
			iconColor: "text-purple-500",
			action: "View Profile",
			actionLink: "/dashboard/user/settings",
		},
		{
			id: 5,
			type: "boost",
			title: "Job application boosted",
			description: "Your application was boosted and is now more visible",
			time: "4 days ago",
			icon: TrendingUp,
			iconColor: "text-orange-500",
			action: "Manage Boosts",
			actionLink: "/dashboard/user/boosts",
		},
	];

	// System Updates & Change Logs
	const systemUpdates = [
		{
			id: 1,
			type: "feature",
			title: "Enhanced Job Application Tracking",
			description: "New detailed tracking for job applications with status updates",
			date: "2024-01-25",
			version: "v2.1.0",
			icon: Briefcase,
			iconColor: "text-blue-500",
			badge: "New",
		},
		{
			id: 2,
			type: "improvement",
			title: "Improved Review System",
			description: "Enhanced review writing experience with better formatting options",
			date: "2024-01-24",
			version: "v2.0.8",
			icon: Star,
			iconColor: "text-green-500",
			badge: "Improved",
		},
		{
			id: 3,
			type: "fix",
			title: "Profile Visibility Fixes",
			description: "Fixed issues with profile visibility and contact information",
			date: "2024-01-23",
			version: "v2.0.7",
			icon: User,
			iconColor: "text-red-500",
			badge: "Fixed",
		},
		{
			id: 4,
			type: "security",
			title: "Enhanced Account Security",
			description: "Improved authentication and data protection measures",
			date: "2024-01-22",
			version: "v2.0.6",
			icon: Shield,
			iconColor: "text-purple-500",
			badge: "Security",
		},
		{
			id: 5,
			type: "feature",
			title: "Referral Program Enhancements",
			description: "New referral tracking and reward system improvements",
			date: "2024-01-21",
			version: "v2.0.5",
			icon: Gift,
			iconColor: "text-indigo-500",
			badge: "New",
		},
	];

	// Quick Actions
	const quickActions = [
		{
			title: "Apply for Jobs",
			description: "Browse and apply for available positions",
			icon: Briefcase,
			link: "/dashboard/user/jobs",
			color: "bg-blue-500 hover:bg-blue-600",
		},
		{
			title: "Write a Review",
			description: "Share your experience with local businesses",
			icon: Star,
			link: "/dashboard/user/reviews",
			color: "bg-yellow-500 hover:bg-yellow-600",
		},
		{
			title: "Claim a Business",
			description: "Claim ownership of your business listing",
			icon: Building2,
			link: "/claim-a-business",
			color: "bg-green-500 hover:bg-green-600",
		},
		{
			title: "Refer Friends",
			description: "Invite friends and earn rewards",
			icon: Gift,
			link: "/dashboard/user/referral",
			color: "bg-purple-500 hover:bg-purple-600",
		},
	];

	// Recent Jobs
	const recentJobs = [
		{
			id: 1,
			title: "Plumber",
			company: "Wade's Plumbing",
			status: "Under Review",
			applied: "2 hours ago",
			location: "Downtown",
		},
		{
			id: 2,
			title: "Barista",
			company: "Local Coffee Shop",
			status: "Interview Scheduled",
			applied: "1 day ago",
			location: "Westside",
		},
		{
			id: 3,
			title: "Dental Assistant",
			company: "Downtown Dentistry",
			status: "Application Received",
			applied: "3 days ago",
			location: "Downtown",
		},
	];

	// Profile Completion
	const profileCompletion = [
		{
			section: "Basic Information",
			progress: 100,
			status: "Complete",
		},
		{
			section: "Work Experience",
			progress: 85,
			status: "Almost Complete",
		},
		{
			section: "Skills & Certifications",
			progress: 60,
			status: "Needs Work",
		},
		{
			section: "References",
			progress: 40,
			status: "Incomplete",
		},
	];

	return (
		<div className="px-4 py-16 space-y-8 w-full lg:px-24">
			{/* Welcome Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.first_name || "there"}!</h1>
					<p className="text-muted-foreground">Here&apos;s what&apos;s happening with your account today.</p>
				</div>
				<div className="flex gap-3 items-center">
					<Button asChild variant="outline" size="sm">
						<Link href="/claim-a-business">Claim a Business</Link>
					</Button>
					<Button variant="outline" size="sm">
						<RefreshCw className="mr-2 w-4 h-4" />
						Refresh
					</Button>
				</div>
			</div>

			{/* User Stats */}
			<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				{userStats.map((stat, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row justify-between items-center pb-2 space-y-0">
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
				<div className="space-y-6 lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Bell className="w-5 h-5" />
								<span>Recent Activity</span>
							</CardTitle>
							<CardDescription>Latest updates and notifications for your account</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{recentActivity.map((activity) => (
								<div key={activity.id} className="flex items-start p-3 space-x-4 rounded-lg transition-colors hover:bg-muted/50">
									<div className={`p-2 rounded-lg bg-muted ${activity.iconColor}`}>
										<activity.icon className="w-4 h-4" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex justify-between items-center">
											<h4 className="text-sm font-medium">{activity.title}</h4>
											<span className="text-xs text-muted-foreground">{activity.time}</span>
										</div>
										<p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
										<Button variant="link" size="sm" className="p-0 mt-2 h-auto text-xs">
											{activity.action}
											<ChevronRight className="ml-1 w-3 h-3" />
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
									<div key={update.id} className="flex items-start p-3 space-x-4 rounded-lg border">
										<div className={`p-2 rounded-lg bg-muted ${update.iconColor}`}>
											<update.icon className="w-4 h-4" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center mb-1 space-x-2">
												<h4 className="text-sm font-medium">{update.title}</h4>
												<Badge variant="outline" className="text-xs">
													{update.badge}
												</Badge>
											</div>
											<p className="mb-2 text-sm text-muted-foreground">{update.description}</p>
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
									<Button variant="outline" className="justify-start p-4 w-full h-auto transition-all duration-200 hover:shadow-md">
										<div className={`p-2 rounded-lg mr-4 ${action.color} text-white shadow-sm`}>
											<action.icon className="w-5 h-5" />
										</div>
										<div className="flex-1 text-left">
											<div className="text-sm font-semibold">{action.title}</div>
											<div className="mt-1 text-xs text-muted-foreground">{action.description}</div>
										</div>
										<ChevronRight className="ml-2 w-4 h-4 text-muted-foreground" />
									</Button>
								</Link>
							))}
						</CardContent>
					</Card>

					{/* Recent Jobs */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Briefcase className="w-5 h-5" />
								<span>Recent Jobs</span>
							</CardTitle>
							<CardDescription>Your latest job applications</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{recentJobs.map((job) => (
								<div key={job.id} className="space-y-2">
									<div className="flex justify-between items-center">
										<div className="flex items-center space-x-2">
											<span className="text-sm font-medium">{job.title}</span>
											<Badge variant="outline" className="text-xs">
												{job.status}
											</Badge>
										</div>
										<span className="text-xs text-muted-foreground">{job.applied}</span>
									</div>
									<div className="flex justify-between items-center text-xs">
										<span className="text-muted-foreground">{job.company}</span>
										<span className="text-muted-foreground">{job.location}</span>
									</div>
								</div>
							))}
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href="/dashboard/user/jobs">
									View All Jobs
									<ChevronRight className="ml-2 w-4 h-4" />
								</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Profile Completion */}
					<Card>
						<CardHeader>
							<CardTitle>Profile Completion</CardTitle>
							<CardDescription>Complete your profile to stand out</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{profileCompletion.map((item, index) => (
								<div key={index} className="space-y-2">
									<div className="flex justify-between items-center text-sm">
										<span>{item.section}</span>
										<span className="font-medium">{item.progress}%</span>
									</div>
									<Progress value={item.progress} className="h-2" />
									<span className="text-xs text-muted-foreground">{item.status}</span>
								</div>
							))}
							<Button variant="outline" size="sm" className="w-full" asChild>
								<Link href="/dashboard/user/settings">
									Complete Profile
									<ChevronRight className="ml-2 w-4 h-4" />
								</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Account Health */}
					<Card>
						<CardHeader>
							<CardTitle>Account Health</CardTitle>
							<CardDescription>Your account performance metrics</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between items-center text-sm">
									<span>Profile Visibility</span>
									<span className="font-medium">85%</span>
								</div>
								<Progress value={85} className="h-2" />
							</div>
							<div className="space-y-2">
								<div className="flex justify-between items-center text-sm">
									<span>Response Rate</span>
									<span className="font-medium">92%</span>
								</div>
								<Progress value={92} className="h-2" />
							</div>
							<div className="space-y-2">
								<div className="flex justify-between items-center text-sm">
									<span>Account Security</span>
									<span className="font-medium">100%</span>
								</div>
								<Progress value={100} className="h-2" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
