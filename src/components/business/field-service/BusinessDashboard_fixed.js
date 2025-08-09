"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Progress } from "@components/ui/progress";
import { Calendar, Clock, DollarSign, Users, MapPin, Phone, CheckCircle, AlertCircle, TrendingUp, BarChart3, Wrench, Star, MessageSquare, Settings, Plus, Filter, Download, Bell, Activity, Timer, Target, Zap, Calendar as CalendarIcon, Users2, FileText, Receipt, TrendingDown, AlertTriangle, Eye, Briefcase, Shield, Building2 } from "lucide-react";
import { format } from "date-fns";
import Header from "@components/business/header";

/**
 * Enhanced Field Service Management Dashboard for Owners
 * Comprehensive FSM system with role-based features and real-time operations
 */
export default function BusinessDashboard({ businessId, user }) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("overview");
	const [jobs, setJobs] = useState([]);
	const [analytics, setAnalytics] = useState({});
	const [notifications, setNotifications] = useState([]);

	// Enhanced mock data for comprehensive FSM system
	const mockJobs = [
		{
			id: "FSM001",
			customerName: "John Smith",
			service: "Emergency Plumbing Repair",
			status: "scheduled",
			scheduledTime: new Date("2024-01-15T10:00:00"),
			address: "123 Main St, Anytown, CA",
			phone: "(555) 123-4567",
			estimatedDuration: "2 hours",
			estimatedPrice: "$150",
			priority: "urgent",
			technician: "Mike Wilson",
			customerRating: 4.9,
			jobType: "emergency",
		},
		{
			id: "FSM002",
			customerName: "Sarah Johnson",
			service: "HVAC Installation",
			status: "in_progress",
			scheduledTime: new Date("2024-01-15T14:00:00"),
			address: "456 Oak Ave, Anytown, CA",
			phone: "(555) 987-6543",
			estimatedDuration: "4 hours",
			estimatedPrice: "$800",
			priority: "high",
			technician: "David Brown",
			customerRating: 4.7,
			jobType: "installation",
		},
		{
			id: "FSM003",
			customerName: "Mike Davis",
			service: "Electrical Safety Inspection",
			status: "completed",
			scheduledTime: new Date("2024-01-14T09:00:00"),
			address: "789 Pine St, Anytown, CA",
			phone: "(555) 456-7890",
			estimatedDuration: "1 hour",
			estimatedPrice: "$120",
			priority: "normal",
			technician: "Lisa Chen",
			customerRating: 5.0,
			jobType: "maintenance",
		},
		{
			id: "FSM004",
			customerName: "Emma Wilson",
			service: "Drain Cleaning",
			status: "scheduled",
			scheduledTime: new Date("2024-01-15T16:00:00"),
			address: "321 Elm St, Anytown, CA",
			phone: "(555) 234-5678",
			estimatedDuration: "1.5 hours",
			estimatedPrice: "$95",
			priority: "normal",
			technician: "Mike Wilson",
			customerRating: null,
			jobType: "maintenance",
		},
	];

	const mockAnalytics = {
		// Financial Metrics
		totalRevenue: 45750,
		monthlyRevenue: 12500,
		weeklyRevenue: 3200,
		dailyRevenue: 680,
		avgJobValue: 185,
		monthlyGrowth: 15.2,
		
		// Operational Metrics
		completedJobs: 147,
		weeklyCompleted: 32,
		dailyCompleted: 8,
		scheduledJobs: 23,
		unscheduledJobs: 5,
		inProgressJobs: 12,
		avgJobDuration: 2.4,
		
		// Quality Metrics
		firstTimeFixRate: 87,
		avgRating: 4.6,
		completionRate: 94,
		onTimeRate: 91,
		customerRetention: 89,
		
		// Team Metrics
		activeTeamMembers: 8,
		weekOverWeekGrowth: 5.8,
		pendingEstimates: 15,
		revenueGoal: 15000,
		progressToGoal: 83,
	};

	const mockNotifications = [
		{
			id: "1",
			type: "urgent",
			title: "Urgent Job Alert",
			message: "Emergency plumbing job scheduled for 2:30 PM today",
			time: "5 minutes ago",
		},
		{
			id: "2",
			type: "warning",
			title: "Technician Running Late",
			message: "Mike Wilson is 15 minutes behind schedule",
			time: "12 minutes ago",
		},
		{
			id: "3",
			type: "success",
			title: "Job Completed",
			message: "HVAC installation job completed successfully",
			time: "1 hour ago",
		},
		{
			id: "4",
			type: "info",
			title: "New Customer Review",
			message: "5-star review received from Sarah Johnson",
			time: "2 hours ago",
		},
	];

	// Initialize mock data
	useEffect(() => {
		setJobs(mockJobs);
		setAnalytics(mockAnalytics);
		setNotifications(mockNotifications);
	}, []);

	// Helper functions
	const getStatusColor = (status) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
			case "in_progress":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
			case "scheduled":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
			case "overdue":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "urgent":
				return "text-red-600";
			case "high":
				return "text-orange-600";
			case "normal":
				return "text-blue-600";
			case "low":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	};

	const getNotificationIcon = (type) => {
		switch (type) {
			case "urgent":
				return <AlertCircle className="w-4 h-4 text-red-500" />;
			case "warning":
				return <AlertCircle className="w-4 h-4 text-yellow-500" />;
			case "success":
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case "info":
			default:
				return <Bell className="w-4 h-4 text-blue-500" />;
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Business Header Component */}
			<Header />
			
			<div className="p-6">
				<div className="mx-auto space-y-6 max-w-7xl">
					{/* FSM Dashboard Header */}
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="space-y-1">
							<h1 className="text-3xl font-bold tracking-tight">Field Service Dashboard</h1>
							<p className="text-muted-foreground">Comprehensive field service management and operations overview</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button variant="outline" size="sm">
								<Download className="mr-2 w-4 h-4" />
								Export Data
							</Button>
							<Button variant="outline" size="sm">
								<Filter className="mr-2 w-4 h-4" />
								Filter
							</Button>
							<Button size="sm">
								<Plus className="mr-2 w-4 h-4" />
								Schedule Job
							</Button>
						</div>
					</div>

					{/* Real-time Status Bar */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card className="border-l-4 border-l-red-500">
							<CardContent className="p-4">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Urgent Jobs</p>
										<p className="text-2xl font-bold text-red-600">3</p>
									</div>
									<AlertTriangle className="w-8 h-8 text-red-600" />
								</div>
							</CardContent>
						</Card>

						<Card className="border-l-4 border-l-yellow-500">
							<CardContent className="p-4">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-sm font-medium text-muted-foreground">In Progress</p>
										<p className="text-2xl font-bold text-yellow-600">{analytics.inProgressJobs}</p>
									</div>
									<Clock className="w-8 h-8 text-yellow-600" />
								</div>
							</CardContent>
						</Card>

						<Card className="border-l-4 border-l-blue-500">
							<CardContent className="p-4">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Scheduled Today</p>
										<p className="text-2xl font-bold text-blue-600">{analytics.scheduledJobs}</p>
									</div>
									<Calendar className="w-8 h-8 text-blue-600" />
								</div>
							</CardContent>
						</Card>

						<Card className="border-l-4 border-l-green-500">
							<CardContent className="p-4">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Daily Revenue</p>
										<p className="text-2xl font-bold text-green-600">${analytics.dailyRevenue}</p>
									</div>
									<DollarSign className="w-8 h-8 text-green-600" />
								</div>
							</CardContent>
						</Card>
					</div>

				{/* Comprehensive FSM Metrics */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{/* Financial Performance */}
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
									<p className="text-2xl font-bold">${analytics.monthlyRevenue?.toLocaleString()}</p>
									<div className="flex gap-2 items-center mt-2">
										<TrendingUp className="w-4 h-4 text-green-500" />
										<span className="text-sm text-green-600">+{analytics.monthlyGrowth}% from last month</span>
									</div>
								</div>
								<div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
									<DollarSign className="w-6 h-6 text-blue-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Service Quality */}
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-muted-foreground">First-Time Fix Rate</p>
									<p className="text-2xl font-bold">{analytics.firstTimeFixRate}%</p>
									<div className="mt-2">
										<Progress value={analytics.firstTimeFixRate} className="h-2" />
									</div>
								</div>
								<div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
									<CheckCircle className="w-6 h-6 text-green-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Customer Satisfaction */}
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Customer Rating</p>
									<p className="text-2xl font-bold">{analytics.avgRating}</p>
									<div className="flex gap-1 mt-2">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`w-4 h-4 ${
													i < Math.floor(analytics.avgRating)
														? "text-yellow-400 fill-current"
														: "text-gray-300"
												}`}
											/>
										))}
									</div>
								</div>
								<div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
									<Star className="w-6 h-6 text-yellow-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Operational Efficiency */}
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-muted-foreground">On-Time Rate</p>
									<p className="text-2xl font-bold">{analytics.onTimeRate}%</p>
									<div className="mt-2">
										<Progress value={analytics.onTimeRate} className="h-2" />
									</div>
								</div>
								<div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
									<Clock className="w-6 h-6 text-purple-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Business Growth */}
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Weekly Growth</p>
									<p className="text-2xl font-bold">{analytics.weekOverWeekGrowth}%</p>
								</div>
								<div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
									<TrendingUp className="w-6 h-6 text-indigo-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Team Performance */}
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Team Performance</p>
									<p className="text-2xl font-bold">{analytics.completedJobs}</p>
									<p className="text-sm text-muted-foreground">Jobs completed this month</p>
								</div>
								<div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/20">
									<Users className="w-6 h-6 text-pink-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Sales Pipeline */}
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Pending Estimates</p>
									<p className="text-2xl font-bold">{analytics.pendingEstimates}</p>
									<p className="text-sm text-green-600">Ready for follow-up</p>
								</div>
								<div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/20">
									<FileText className="w-6 h-6 text-teal-600" />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Customer Retention */}
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Customer Retention</p>
									<p className="text-2xl font-bold">{analytics.customerRetention}%</p>
									<p className="text-sm text-muted-foreground">12-month retention rate</p>
								</div>
								<div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
									<Users className="w-6 h-6 text-orange-600" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Dashboard Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList className="grid grid-cols-5 w-full">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="jobs">Jobs</TabsTrigger>
						<TabsTrigger value="customers">Customers</TabsTrigger>
						<TabsTrigger value="analytics">Analytics</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							{/* Today's Schedule */}
							<Card>
								<CardHeader>
									<CardTitle className="flex justify-between items-center">
										<div className="flex gap-2 items-center">
											<Calendar className="w-5 h-5" />
											Today's Schedule
										</div>
										<Badge variant="secondary" className="text-xs">
											{jobs.filter((job) => format(job.scheduledTime, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")).length} jobs
										</Badge>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									{jobs
										.filter((job) => format(job.scheduledTime, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"))
										.map((job) => (
											<div key={job.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
												<div>
													<p className="font-medium text-sm">{job.service}</p>
													<p className="text-xs text-muted-foreground">{job.customerName}</p>
													<p className="text-xs text-muted-foreground">{format(job.scheduledTime, "h:mm a")}</p>
												</div>
												<div className="text-right">
													<Badge className={getStatusColor(job.status)} variant="secondary">
														{job.status.replace("_", " ")}
													</Badge>
													<p className={`text-xs font-medium mt-1 ${getPriorityColor(job.priority)}`}>
														{job.priority}
													</p>
												</div>
											</div>
										))}
								</CardContent>
							</Card>

							{/* Real-time Notifications */}
							<Card>
								<CardHeader>
									<CardTitle className="flex justify-between items-center">
										<div className="flex gap-2 items-center">
											<Bell className="w-5 h-5" />
											Live Alerts
										</div>
										<Badge variant="destructive" className="text-xs">
											{notifications.filter(n => n.type === "urgent").length} urgent
										</Badge>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									{notifications.map((notification) => (
										<div key={notification.id} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50">
											{getNotificationIcon(notification.type)}
											<div className="flex-1">
												<p className="font-medium text-sm">{notification.title}</p>
												<p className="text-xs text-muted-foreground">{notification.message}</p>
												<p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
											</div>
										</div>
									))}
								</CardContent>
							</Card>

							{/* Team Status */}
							<Card>
								<CardHeader>
									<CardTitle className="flex gap-2 items-center">
										<Users2 className="w-5 h-5" />
										Team Status
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<div className="flex gap-3 items-center">
												<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
													<span className="text-sm font-medium text-green-700">MW</span>
												</div>
												<div>
													<p className="font-medium text-sm">Mike Wilson</p>
													<p className="text-xs text-muted-foreground">Plumber</p>
												</div>
											</div>
											<Badge className="bg-green-100 text-green-800" variant="secondary">
												Available
											</Badge>
										</div>
										<div className="flex justify-between items-center">
											<div className="flex gap-3 items-center">
												<div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
													<span className="text-sm font-medium text-yellow-700">DB</span>
												</div>
												<div>
													<p className="font-medium text-sm">David Brown</p>
													<p className="text-xs text-muted-foreground">HVAC Tech</p>
												</div>
											</div>
											<Badge className="bg-yellow-100 text-yellow-800" variant="secondary">
												On Job
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Enhanced Quick Actions */}
						<Card>
							<CardHeader>
								<CardTitle className="flex gap-2 items-center">
									<Zap className="w-5 h-5" />
									Quick Actions
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4 md:grid-cols-6">
									<Button 
										variant="outline" 
										className="flex flex-col gap-2 h-20 hover:bg-blue-50 hover:border-blue-300"
										onClick={() => router.push('/dashboard/field-service/schedule')}
									>
										<CalendarIcon className="w-6 h-6 text-blue-600" />
										<span className="text-sm">Scheduling</span>
									</Button>
									<Button 
										variant="outline" 
										className="flex flex-col gap-2 h-20 hover:bg-green-50 hover:border-green-300"
										onClick={() => router.push('/dashboard/field-service/estimates')}
									>
										<FileText className="w-6 h-6 text-green-600" />
										<span className="text-sm">Estimates</span>
									</Button>
									<Button 
										variant="outline" 
										className="flex flex-col gap-2 h-20 hover:bg-purple-50 hover:border-purple-300"
										onClick={() => router.push('/dashboard/field-service/invoices')}
									>
										<Receipt className="w-6 h-6 text-purple-600" />
										<span className="text-sm">Invoices</span>
									</Button>
									<Button 
										variant="outline" 
										className="flex flex-col gap-2 h-20 hover:bg-orange-50 hover:border-orange-300"
										onClick={() => router.push('/dashboard/field-service/customers')}
									>
										<Users className="w-6 h-6 text-orange-600" />
										<span className="text-sm">Customers</span>
									</Button>
									<Button 
										variant="outline" 
										className="flex flex-col gap-2 h-20 hover:bg-indigo-50 hover:border-indigo-300"
										onClick={() => router.push('/dashboard/field-service/jobs')}
									>
										<Wrench className="w-6 h-6 text-indigo-600" />
										<span className="text-sm">Jobs</span>
									</Button>
									<Button 
										variant="outline" 
										className="flex flex-col gap-2 h-20 hover:bg-teal-50 hover:border-teal-300"
										onClick={() => router.push('/dashboard/field-service/analytics')}
									>
										<BarChart3 className="w-6 h-6 text-teal-600" />
										<span className="text-sm">Analytics</span>
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Enhanced Jobs & Schedule Tab */}
					<TabsContent value="jobs" className="space-y-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<h2 className="text-2xl font-bold">Jobs & Work Orders</h2>
								<p className="text-muted-foreground">Manage all field service jobs and track progress</p>
							</div>
							<div className="flex flex-wrap gap-2">
								<Button 
									variant="outline" 
									size="sm"
									onClick={() => router.push('/dashboard/field-service/jobs')}
								>
									<Eye className="mr-2 w-4 h-4" />
									View All Jobs
								</Button>
								<Button 
									variant="outline" 
									size="sm"
									onClick={() => router.push('/dashboard/field-service/schedule')}
								>
									<CalendarIcon className="mr-2 w-4 h-4" />
									Scheduling
								</Button>
								<Button 
									size="sm"
									onClick={() => router.push('/dashboard/field-service/schedule')}
								>
									<Plus className="mr-2 w-4 h-4" />
									Schedule Job
								</Button>
							</div>
						</div>

						{/* Job Summary Cards */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
							<Card>
								<CardContent className="p-4">
									<div className="flex justify-between items-center">
										<div>
											<p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
											<p className="text-2xl font-bold">{jobs.length}</p>
										</div>
										<Wrench className="w-8 h-8 text-blue-600" />
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="flex justify-between items-center">
										<div>
											<p className="text-sm font-medium text-muted-foreground">In Progress</p>
											<p className="text-2xl font-bold text-yellow-600">
												{jobs.filter((job) => job.status === "in_progress").length}
											</p>
										</div>
										<Clock className="w-8 h-8 text-yellow-600" />
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="flex justify-between items-center">
										<div>
											<p className="text-sm font-medium text-muted-foreground">Completed</p>
											<p className="text-2xl font-bold text-green-600">
												{jobs.filter((job) => job.status === "completed").length}
											</p>
										</div>
										<CheckCircle className="w-8 h-8 text-green-600" />
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="flex justify-between items-center">
										<div>
											<p className="text-sm font-medium text-muted-foreground">Scheduled</p>
											<p className="text-2xl font-bold text-blue-600">
												{jobs.filter((job) => job.status === "scheduled").length}
											</p>
										</div>
										<Calendar className="w-8 h-8 text-blue-600" />
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Enhanced Jobs List */}
						<Card>
							<CardContent className="p-0">
								<div className="divide-y">
									{jobs.map((job) => (
										<div key={job.id} className="p-6 transition-colors hover:bg-muted/50">
											<div className="flex justify-between items-start">
												<div className="space-y-3 flex-1">
													{/* Job Header */}
													<div className="flex justify-between items-center">
														<div>
															<h4 className="font-semibold">{job.service}</h4>
															<p className="text-sm text-muted-foreground">{job.customerName}</p>
														</div>
														<div className="flex gap-2 items-center">
															<Badge className={getStatusColor(job.status)} variant="secondary">
																{job.status.replace("_", " ")}
															</Badge>
															<span className={`text-xs font-medium px-2 py-1 rounded ${getPriorityColor(job.priority)}`}>
																{job.priority}
															</span>
														</div>
													</div>
													
													{/* Job Information Grid */}
													<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-4 text-muted-foreground">
														<div className="flex gap-2 items-center">
															<Calendar className="w-4 h-4" />
															<div>
																<p className="font-medium">Scheduled</p>
																<p>{format(job.scheduledTime, "MMM d, h:mm a")}</p>
															</div>
														</div>
														<div className="flex gap-2 items-center">
															<MapPin className="w-4 h-4" />
															<div>
																<p className="font-medium">Location</p>
																<p>{job.address}</p>
															</div>
														</div>
														<div className="flex gap-2 items-center">
															<Clock className="w-4 h-4" />
															<div>
																<p className="font-medium">Duration</p>
																<p>{job.estimatedDuration}</p>
															</div>
														</div>
														<div className="flex gap-2 items-center">
															<DollarSign className="w-4 h-4" />
															<div>
																<p className="font-medium">Value</p>
																<p>{job.estimatedPrice}</p>
															</div>
														</div>
													</div>

													{/* Customer Info */}
													<div className="flex gap-6 items-center text-sm">
														<div className="flex gap-2 items-center text-muted-foreground">
															<Phone className="w-4 h-4" />
															<span>{job.phone}</span>
														</div>
														<div className="flex gap-2 items-center text-muted-foreground">
															<Users className="w-4 h-4" />
															<span>Assigned to {job.technician}</span>
														</div>
														{job.customerRating && (
															<div className="flex gap-1 items-center">
																<Star className="w-4 h-4 text-yellow-400 fill-current" />
																<span>{job.customerRating}</span>
															</div>
														)}
													</div>

													{/* Action Buttons */}
													{job.status !== "completed" && (
														<div className="flex gap-2">
															<Button size="sm" variant="outline">
																<Settings className="mr-1 w-4 h-4" />
																Edit
															</Button>
															<Button size="sm">
																<Eye className="mr-1 w-4 h-4" />
																View
															</Button>
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Customer Management Tab */}
					<TabsContent value="customers" className="space-y-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<h2 className="text-2xl font-bold">Customer Management</h2>
								<p className="text-muted-foreground">Manage customer relationships and service history</p>
							</div>
							<div className="flex gap-2">
								<Button 
									variant="outline" 
									size="sm"
									onClick={() => router.push('/dashboard/field-service/customers')}
								>
									<Eye className="mr-2 w-4 h-4" />
									View All Customers
								</Button>
								<Button 
									size="sm"
									onClick={() => router.push('/dashboard/field-service/customers')}
								>
									<Plus className="mr-2 w-4 h-4" />
									Add Customer
								</Button>
							</div>
						</div>

						{/* Customer Stats */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
							<Card>
								<CardContent className="p-4">
									<div className="flex justify-between items-center">
										<div>
											<p className="text-sm font-medium text-muted-foreground">Total Customers</p>
											<p className="text-2xl font-bold">247</p>
										</div>
										<Users className="w-8 h-8 text-blue-600" />
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="flex justify-between items-center">
										<div>
											<p className="text-sm font-medium text-muted-foreground">Active This Month</p>
											<p className="text-2xl font-bold text-green-600">89</p>
										</div>
										<Activity className="w-8 h-8 text-green-600" />
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="flex justify-between items-center">
										<div>
											<p className="text-sm font-medium text-muted-foreground">New This Month</p>
											<p className="text-2xl font-bold text-orange-600">12</p>
										</div>
										<Plus className="w-8 h-8 text-orange-600" />
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="flex justify-between items-center">
										<div>
											<p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
											<p className="text-2xl font-bold text-purple-600">94%</p>
										</div>
										<TrendingUp className="w-8 h-8 text-purple-600" />
									</div>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardContent className="p-6">
								<div className="flex flex-col gap-4 items-center text-center">
									<Users className="w-12 h-12 text-muted-foreground" />
									<div>
										<h3 className="font-semibold text-lg">Customer Management System</h3>
										<p className="mb-4 text-muted-foreground">
											Full customer relationship management features are in development
										</p>
										<Button>
											<Plus className="mr-2 w-4 h-4" />
											Add Your First Customer
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Analytics Tab */}
					<TabsContent value="analytics" className="space-y-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<h2 className="text-2xl font-bold">Business Analytics</h2>
								<p className="text-muted-foreground">Performance insights and business intelligence</p>
							</div>
							<div className="flex gap-2">
								<Button 
									variant="outline" 
									size="sm"
									onClick={() => router.push('/dashboard/field-service/analytics')}
								>
									<BarChart3 className="mr-2 w-4 h-4" />
									View Analytics
								</Button>
								<Button 
									variant="outline" 
									size="sm"
									onClick={() => router.push('/dashboard/field-service/analytics')}
								>
									<Download className="mr-2 w-4 h-4" />
									Export Report
								</Button>
							</div>
						</div>

						{/* Analytics Overview */}
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle className="flex gap-2 items-center">
										<BarChart3 className="w-5 h-5" />
										Revenue Analytics
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Monthly Target</span>
											<span className="font-medium">${analytics.revenueGoal?.toLocaleString()}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Current Progress</span>
											<span className="font-medium text-green-600">${analytics.monthlyRevenue?.toLocaleString()}</span>
										</div>
										<Progress value={analytics.progressToGoal} className="h-3" />
										<div className="flex justify-between items-center text-sm">
											<span className="text-muted-foreground">Progress</span>
											<span className="font-medium">{analytics.progressToGoal}%</span>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex gap-2 items-center">
										<Target className="w-5 h-5" />
										Performance Metrics
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Completion Rate</span>
											<span className="font-medium">{analytics.completionRate}%</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">On-Time Rate</span>
											<span className="font-medium">{analytics.onTimeRate}%</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Customer Rating</span>
											<span className="font-medium">{analytics.avgRating}/5</span>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex gap-2 items-center">
										<TrendingUp className="w-5 h-5" />
										Growth Metrics
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Weekly Growth</span>
											<span className="font-medium text-green-600">+{analytics.weekOverWeekGrowth}%</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Monthly Growth</span>
											<span className="font-medium text-green-600">+{analytics.monthlyGrowth}%</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Customer Retention</span>
											<span className="font-medium">{analytics.customerRetention}%</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardContent className="p-6">
								<div className="flex flex-col gap-4 items-center text-center">
									<BarChart3 className="w-12 h-12 text-muted-foreground" />
									<div>
										<h3 className="font-semibold text-lg">Advanced Analytics Dashboard</h3>
										<p className="mb-4 text-muted-foreground">
											Detailed charts, custom reports, and predictive analytics are in development
										</p>
										<Button>
											<Eye className="mr-2 w-4 h-4" />
											View Current Metrics
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Settings Tab */}
					<TabsContent value="settings" className="space-y-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<h2 className="text-2xl font-bold">Field Service Settings</h2>
								<p className="text-muted-foreground">Configure your business operations and preferences</p>
							</div>
						</div>

						{/* FSM Navigation Menu */}
						<Card>
							<CardHeader>
								<CardTitle className="flex gap-2 items-center">
									<Wrench className="w-5 h-5" />
									Field Service Management Modules
								</CardTitle>
								<p className="text-sm text-muted-foreground">Access all FSM modules and features</p>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
									<Button 
										variant="outline" 
										className="justify-start h-12"
										onClick={() => router.push('/dashboard/field-service/schedule')}
									>
										<CalendarIcon className="mr-3 w-5 h-5 text-blue-600" />
										<div className="text-left">
											<p className="font-medium">Scheduling & Dispatch</p>
											<p className="text-xs text-muted-foreground">Manage appointments & routes</p>
										</div>
									</Button>
									<Button 
										variant="outline" 
										className="justify-start h-12"
										onClick={() => router.push('/dashboard/field-service/jobs')}
									>
										<Wrench className="mr-3 w-5 h-5 text-indigo-600" />
										<div className="text-left">
											<p className="font-medium">Jobs & Work Orders</p>
											<p className="text-xs text-muted-foreground">Track job progress & status</p>
										</div>
									</Button>
									<Button 
										variant="outline" 
										className="justify-start h-12"
										onClick={() => router.push('/dashboard/field-service/customers')}
									>
										<Users className="mr-3 w-5 h-5 text-orange-600" />
										<div className="text-left">
											<p className="font-medium">Customers & Contacts</p>
											<p className="text-xs text-muted-foreground">Manage customer relationships</p>
										</div>
									</Button>
									<Button 
										variant="outline" 
										className="justify-start h-12"
										onClick={() => router.push('/dashboard/field-service/estimates')}
									>
										<FileText className="mr-3 w-5 h-5 text-green-600" />
										<div className="text-left">
											<p className="font-medium">Estimates & Quotes</p>
											<p className="text-xs text-muted-foreground">Create & track estimates</p>
										</div>
									</Button>
									<Button 
										variant="outline" 
										className="justify-start h-12"
										onClick={() => router.push('/dashboard/field-service/invoices')}
									>
										<Receipt className="mr-3 w-5 h-5 text-purple-600" />
										<div className="text-left">
											<p className="font-medium">Invoices & Payments</p>
											<p className="text-xs text-muted-foreground">Billing & payment tracking</p>
										</div>
									</Button>
									<Button 
										variant="outline" 
										className="justify-start h-12"
										onClick={() => router.push('/dashboard/field-service/analytics')}
									>
										<BarChart3 className="mr-3 w-5 h-5 text-teal-600" />
										<div className="text-left">
											<p className="font-medium">Analytics & Reports</p>
											<p className="text-xs text-muted-foreground">Business intelligence & insights</p>
										</div>
									</Button>
								</div>
							</CardContent>
						</Card>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle className="flex gap-2 items-center">
										<Settings className="w-5 h-5" />
										Business Configuration
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<Button variant="outline" className="justify-start w-full">
										<Building2 className="mr-2 w-4 h-4" />
										Company Profile
									</Button>
									<Button variant="outline" className="justify-start w-full">
										<CalendarIcon className="mr-2 w-4 h-4" />
										Working Hours
									</Button>
									<Button variant="outline" className="justify-start w-full">
										<MapPin className="mr-2 w-4 h-4" />
										Service Areas
									</Button>
									<Button variant="outline" className="justify-start w-full">
										<Receipt className="mr-2 w-4 h-4" />
										Pricing & Billing
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex gap-2 items-center">
										<Users className="w-5 h-5" />
										Team Management
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<Button variant="outline" className="justify-start w-full">
										<Users2 className="mr-2 w-4 h-4" />
										Manage Technicians
									</Button>
									<Button variant="outline" className="justify-start w-full">
										<Shield className="mr-2 w-4 h-4" />
										Roles & Permissions
									</Button>
									<Button variant="outline" className="justify-start w-full">
										<Bell className="mr-2 w-4 h-4" />
										Notifications
									</Button>
									<Button variant="outline" className="justify-start w-full">
										<MessageSquare className="mr-2 w-4 h-4" />
										Communication
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex gap-2 items-center">
										<Zap className="w-5 h-5" />
										Automation
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<Button variant="outline" className="justify-start w-full">
										<Activity className="mr-2 w-4 h-4" />
										Workflow Rules
									</Button>
									<Button variant="outline" className="justify-start w-full">
										<Timer className="mr-2 w-4 h-4" />
										Scheduling Auto-pilot
									</Button>
									<Button variant="outline" className="justify-start w-full">
										<Target className="mr-2 w-4 h-4" />
										Smart Dispatching
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex gap-2 items-center">
										<Briefcase className="w-5 h-5" />
										Integrations
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<Button variant="outline" className="justify-start w-full">
										<DollarSign className="mr-2 w-4 h-4" />
										Accounting Software
									</Button>
									<Button variant="outline" className="justify-start w-full">
										<MessageSquare className="mr-2 w-4 h-4" />
										Communication Tools
									</Button>
									<Button variant="outline" className="justify-start w-full">
										<MapPin className="mr-2 w-4 h-4" />
										Maps & GPS
									</Button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
