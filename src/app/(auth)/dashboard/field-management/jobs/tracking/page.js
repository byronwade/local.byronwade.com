"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Progress } from "@components/ui/progress";
import { Separator } from "@components/ui/separator";
import { MapPin, Navigation, Clock, User, Phone, Car, CheckCircle, AlertCircle, Play, Pause, Square, Route, Wrench, DollarSign, Search, Download, MoreHorizontal, Timer, Target, TrendingUp, Activity, Eye, Plus, Circle } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";

// Mock real-time job tracking data
const mockTrackedJobs = [
	{
		id: "JOB001",
		title: "HVAC Maintenance - TechCorp",
		technician: {
			id: "T001",
			name: "Mike Johnson",
			phone: "(555) 123-4567",
			vehicle: "Van #3",
			currentLocation: {
				lat: 34.0522,
				lng: -118.2437,
				address: "123 Business Ave, Downtown, CA",
			},
		},
		customer: {
			name: "TechCorp Inc.",
			address: "123 Business Ave, Downtown, CA 90210",
			phone: "(555) 111-2222",
		},
		scheduledStart: "2024-01-15T09:00:00Z",
		scheduledEnd: "2024-01-15T12:00:00Z",
		actualStart: "2024-01-15T09:15:00Z",
		actualEnd: null,
		status: "in_progress",
		priority: "high",
		serviceType: "Maintenance",
		estimatedValue: 350,
		timeTracking: {
			travelTime: 25, // minutes
			onSiteTime: 120, // minutes so far
			breakTime: 15,
			totalTime: 160,
		},
		location: {
			lat: 34.0522,
			lng: -118.2437,
			lastUpdated: "2024-01-15T11:30:00Z",
		},
		progress: {
			percentage: 65,
			stage: "Service Execution",
			checklist: {
				total: 8,
				completed: 5,
			},
		},
		expenses: [
			{ type: "parts", amount: 45.5, description: "HVAC Filter" },
			{ type: "mileage", amount: 12.3, description: "Travel to site" },
		],
	},
	{
		id: "JOB002",
		title: "Plumbing Repair - Sarah Miller",
		technician: {
			id: "T002",
			name: "Sarah Wilson",
			phone: "(555) 234-5678",
			vehicle: "Truck #7",
			currentLocation: {
				lat: 34.0689,
				lng: -118.4452,
				address: "En route to 456 Oak Street",
			},
		},
		customer: {
			name: "Sarah Miller",
			address: "456 Oak Street, Residential, CA 90211",
			phone: "(555) 222-3333",
		},
		scheduledStart: "2024-01-15T14:00:00Z",
		scheduledEnd: "2024-01-15T16:00:00Z",
		actualStart: "2024-01-15T13:45:00Z",
		actualEnd: null,
		status: "traveling",
		priority: "medium",
		serviceType: "Repair",
		estimatedValue: 150,
		timeTracking: {
			travelTime: 35,
			onSiteTime: 0,
			breakTime: 0,
			totalTime: 35,
		},
		location: {
			lat: 34.0689,
			lng: -118.4452,
			lastUpdated: "2024-01-15T14:20:00Z",
		},
		progress: {
			percentage: 10,
			stage: "Traveling to Site",
			checklist: {
				total: 6,
				completed: 0,
			},
		},
		expenses: [],
	},
	{
		id: "JOB003",
		title: "Electrical Inspection - Metro Restaurant",
		technician: {
			id: "T003",
			name: "David Chen",
			phone: "(555) 345-6789",
			vehicle: "Van #12",
			currentLocation: {
				lat: 34.0194,
				lng: -118.4912,
				address: "Office - Vehicle Parked",
			},
		},
		customer: {
			name: "Metro Restaurant",
			address: "789 Main Street, Commercial, CA 90212",
			phone: "(555) 333-4444",
		},
		scheduledStart: "2024-01-15T16:00:00Z",
		scheduledEnd: "2024-01-15T18:00:00Z",
		actualStart: null,
		actualEnd: null,
		status: "scheduled",
		priority: "high",
		serviceType: "Inspection",
		estimatedValue: 200,
		timeTracking: {
			travelTime: 0,
			onSiteTime: 0,
			breakTime: 0,
			totalTime: 0,
		},
		location: {
			lat: 34.0194,
			lng: -118.4912,
			lastUpdated: "2024-01-15T13:00:00Z",
		},
		progress: {
			percentage: 0,
			stage: "Not Started",
			checklist: {
				total: 10,
				completed: 0,
			},
		},
		expenses: [],
	},
];

const mockPerformanceMetrics = {
	today: {
		totalJobs: 8,
		completedJobs: 3,
		inProgressJobs: 2,
		averageJobTime: 145, // minutes
		onTimePerformance: 87, // percentage
		revenue: 1250,
		mileage: 127,
	},
	thisWeek: {
		totalJobs: 42,
		completedJobs: 35,
		averageJobTime: 132,
		onTimePerformance: 91,
		revenue: 8750,
		mileage: 652,
	},
};

export default function JobTracking() {
	const [selectedJob, setSelectedJob] = useState(mockTrackedJobs[0]);
	const [activeTab, setActiveTab] = useState("overview");
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [showMap, setShowMap] = useState(false);

	// Filter jobs based on search and status
	const filteredJobs = mockTrackedJobs.filter((job) => {
		const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || job.technician.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === "all" || job.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const getStatusColor = (status) => {
		switch (status) {
			case "completed":
				return "bg-green-500";
			case "in_progress":
				return "bg-blue-500";
			case "traveling":
				return "bg-purple-500";
			case "scheduled":
				return "bg-orange-500";
			case "delayed":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="w-4 h-4" />;
			case "in_progress":
				return <Play className="w-4 h-4" />;
			case "traveling":
				return <Car className="w-4 h-4" />;
			case "scheduled":
				return <Clock className="w-4 h-4" />;
			case "delayed":
				return <AlertCircle className="w-4 h-4" />;
			default:
				return <Circle className="w-4 h-4" />;
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "urgent":
				return "border-red-500";
			case "high":
				return "border-orange-500";
			case "medium":
				return "border-yellow-500";
			case "low":
				return "border-green-500";
			default:
				return "border-gray-300";
		}
	};

	const calculateDelayTime = (job) => {
		if (!job.scheduledStart || !job.actualStart) return 0;
		const scheduled = parseISO(job.scheduledStart);
		const actual = parseISO(job.actualStart);
		return differenceInMinutes(actual, scheduled);
	};

	const calculateJobDuration = (job) => {
		if (!job.actualStart) return 0;
		const start = parseISO(job.actualStart);
		const end = job.actualEnd ? parseISO(job.actualEnd) : new Date();
		return differenceInMinutes(end, start);
	};

	const formatDuration = (minutes) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Job Tracking</h1>
					<p className="text-muted-foreground">Real-time tracking of active jobs and technician locations</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm">
						<Download className="w-4 h-4 mr-2" />
						Export Data
					</Button>
					<Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
						<MapPin className="w-4 h-4 mr-2" />
						{showMap ? "Hide" : "Show"} Map
					</Button>
					<Button>
						<Activity className="w-4 h-4 mr-2" />
						Live View
					</Button>
				</div>
			</div>

			{/* Performance Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Active Jobs</p>
								<p className="text-2xl font-bold">{mockTrackedJobs.filter((job) => ["in_progress", "traveling"].includes(job.status)).length}</p>
							</div>
							<Activity className="w-8 h-8 text-blue-500" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">On-Time Performance</p>
								<p className="text-2xl font-bold">{mockPerformanceMetrics.today.onTimePerformance}%</p>
							</div>
							<Target className="w-8 h-8 text-green-500" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Avg Job Time</p>
								<p className="text-2xl font-bold">{formatDuration(mockPerformanceMetrics.today.averageJobTime)}</p>
							</div>
							<Timer className="w-8 h-8 text-orange-500" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Today's Revenue</p>
								<p className="text-2xl font-bold">${mockPerformanceMetrics.today.revenue.toLocaleString()}</p>
							</div>
							<TrendingUp className="w-8 h-8 text-purple-500" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex gap-4 items-center">
				<div className="flex-1 max-w-md">
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Search jobs, customers, or technicians..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
					</div>
				</div>

				<select className="p-2 border rounded-md" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
					<option value="all">All Status</option>
					<option value="in_progress">In Progress</option>
					<option value="traveling">Traveling</option>
					<option value="scheduled">Scheduled</option>
					<option value="completed">Completed</option>
					<option value="delayed">Delayed</option>
				</select>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Jobs List */}
				<div className="lg:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Active Jobs</CardTitle>
							<CardDescription>{filteredJobs.length} jobs being tracked</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<div className="space-y-2">
								{filteredJobs.map((job) => (
									<div key={job.id} className={`p-4 cursor-pointer border-l-4 hover:bg-accent/50 transition-colors ${selectedJob.id === job.id ? "bg-accent" : ""} ${getPriorityColor(job.priority)}`} onClick={() => setSelectedJob(job)}>
										<div className="flex justify-between items-start mb-2">
											<div className="flex-1">
												<h4 className="font-medium text-sm">{job.title}</h4>
												<p className="text-xs text-muted-foreground mt-1">{job.customer.name}</p>
											</div>
											<div className="flex items-center gap-1">
												{getStatusIcon(job.status)}
												<Badge className={getStatusColor(job.status)} variant="secondary">
													{job.status.replace("_", " ")}
												</Badge>
											</div>
										</div>

										<div className="space-y-1 text-xs text-muted-foreground">
											<div className="flex items-center gap-1">
												<User className="w-3 h-3" />
												{job.technician.name}
											</div>
											<div className="flex items-center gap-1">
												<Clock className="w-3 h-3" />
												{formatDuration(job.timeTracking.totalTime)}
											</div>
											<div className="flex items-center gap-1">
												<Target className="w-3 h-3" />
												{job.progress.percentage}% complete
											</div>
											<Progress value={job.progress.percentage} className="h-1 mt-2" />
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Job Details */}
				<div className="lg:col-span-3">
					{selectedJob && (
						<Card>
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle>{selectedJob.title}</CardTitle>
										<CardDescription>
											<div className="flex items-center gap-4 mt-2 text-sm">
												<div className="flex items-center gap-1">
													<User className="w-4 h-4" />
													{selectedJob.technician.name}
												</div>
												<div className="flex items-center gap-1">
													<Car className="w-4 h-4" />
													{selectedJob.technician.vehicle}
												</div>
												<div className="flex items-center gap-1">
													<MapPin className="w-4 h-4" />
													{selectedJob.customer.address}
												</div>
											</div>
										</CardDescription>
									</div>
									<div className="flex items-center gap-2">
										{getStatusIcon(selectedJob.status)}
										<Badge className={getStatusColor(selectedJob.status)} variant="secondary">
											{selectedJob.status.replace("_", " ")}
										</Badge>
									</div>
								</div>
							</CardHeader>

							<CardContent>
								<Tabs value={activeTab} onValueChange={setActiveTab}>
									<TabsList className="grid w-full grid-cols-4">
										<TabsTrigger value="overview">Overview</TabsTrigger>
										<TabsTrigger value="location">Location</TabsTrigger>
										<TabsTrigger value="time">Time Tracking</TabsTrigger>
										<TabsTrigger value="expenses">Expenses</TabsTrigger>
									</TabsList>

									{/* Overview Tab */}
									<TabsContent value="overview" className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{/* Job Progress */}
											<div className="space-y-4">
												<h3 className="text-lg font-semibold">Job Progress</h3>

												<div className="space-y-3">
													<div className="flex justify-between items-center">
														<span className="text-sm font-medium">Overall Progress</span>
														<span className="text-sm text-muted-foreground">{selectedJob.progress.percentage}%</span>
													</div>
													<Progress value={selectedJob.progress.percentage} className="h-2" />

													<div className="text-sm text-muted-foreground">
														Current Stage: <span className="font-medium">{selectedJob.progress.stage}</span>
													</div>
												</div>

												<div className="space-y-2">
													<div className="flex justify-between items-center">
														<span className="text-sm">Checklist Progress</span>
														<span className="text-sm text-muted-foreground">
															{selectedJob.progress.checklist.completed} / {selectedJob.progress.checklist.total}
														</span>
													</div>
													<Progress value={(selectedJob.progress.checklist.completed / selectedJob.progress.checklist.total) * 100} className="h-2" />
												</div>
											</div>

											{/* Customer Information */}
											<div className="space-y-4">
												<h3 className="text-lg font-semibold">Customer Information</h3>

												<div className="space-y-3">
													<div>
														<label className="text-sm font-medium">Name</label>
														<p className="text-sm text-muted-foreground">{selectedJob.customer.name}</p>
													</div>

													<div>
														<label className="text-sm font-medium">Phone</label>
														<p className="text-sm text-muted-foreground flex items-center gap-2">
															<Phone className="w-4 h-4" />
															{selectedJob.customer.phone}
														</p>
													</div>

													<div>
														<label className="text-sm font-medium">Address</label>
														<p className="text-sm text-muted-foreground flex items-center gap-2">
															<MapPin className="w-4 h-4" />
															{selectedJob.customer.address}
														</p>
													</div>
												</div>
											</div>
										</div>

										<Separator />

										{/* Job Timeline */}
										<div className="space-y-4">
											<h3 className="text-lg font-semibold">Job Timeline</h3>

											<div className="space-y-3">
												<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
													<div className="flex items-center gap-3">
														<Clock className="w-5 h-5 text-blue-500" />
														<div>
															<p className="font-medium">Scheduled Start</p>
															<p className="text-sm text-muted-foreground">{format(parseISO(selectedJob.scheduledStart), "MMM d, yyyy 'at' HH:mm")}</p>
														</div>
													</div>
													{selectedJob.actualStart && (
														<div className="text-right">
															<p className="font-medium">Actual Start</p>
															<p className="text-sm text-muted-foreground">{format(parseISO(selectedJob.actualStart), "HH:mm")}</p>
															{calculateDelayTime(selectedJob) > 0 && <p className="text-xs text-red-600">{formatDuration(calculateDelayTime(selectedJob))} late</p>}
														</div>
													)}
												</div>

												<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
													<div className="flex items-center gap-3">
														<Clock className="w-5 h-5 text-green-500" />
														<div>
															<p className="font-medium">Scheduled End</p>
															<p className="text-sm text-muted-foreground">{format(parseISO(selectedJob.scheduledEnd), "MMM d, yyyy 'at' HH:mm")}</p>
														</div>
													</div>
													{selectedJob.actualEnd ? (
														<div className="text-right">
															<p className="font-medium">Actual End</p>
															<p className="text-sm text-muted-foreground">{format(parseISO(selectedJob.actualEnd), "HH:mm")}</p>
														</div>
													) : (
														<div className="text-right">
															<p className="font-medium text-muted-foreground">In Progress</p>
															<p className="text-sm text-muted-foreground">{formatDuration(calculateJobDuration(selectedJob))} elapsed</p>
														</div>
													)}
												</div>
											</div>
										</div>
									</TabsContent>

									{/* Location Tab */}
									<TabsContent value="location" className="space-y-6">
										<div className="space-y-4">
											<h3 className="text-lg font-semibold">Technician Location</h3>

											{/* Location Status */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<Card>
													<CardContent className="p-4">
														<div className="flex items-center gap-3">
															<MapPin className="w-8 h-8 text-blue-500" />
															<div>
																<p className="font-medium">Current Location</p>
																<p className="text-sm text-muted-foreground">{selectedJob.technician.currentLocation.address}</p>
																<p className="text-xs text-muted-foreground">Last updated: {format(parseISO(selectedJob.location.lastUpdated), "HH:mm")}</p>
															</div>
														</div>
													</CardContent>
												</Card>

												<Card>
													<CardContent className="p-4">
														<div className="flex items-center gap-3">
															<Car className="w-8 h-8 text-green-500" />
															<div>
																<p className="font-medium">Vehicle</p>
																<p className="text-sm text-muted-foreground">{selectedJob.technician.vehicle}</p>
																<p className="text-xs text-muted-foreground">Status: Active</p>
															</div>
														</div>
													</CardContent>
												</Card>
											</div>

											{/* Map Placeholder */}
											<div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
												<div className="text-center">
													<MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
													<p className="text-lg font-medium">Interactive Map</p>
													<p className="text-sm text-muted-foreground">Real-time technician tracking would be displayed here</p>
													<Button className="mt-4" onClick={() => setShowMap(true)}>
														<Eye className="w-4 h-4 mr-2" />
														View Live Map
													</Button>
												</div>
											</div>

											{/* Location History */}
											<div className="space-y-3">
												<h4 className="font-medium">Location History</h4>
												<div className="space-y-2">
													<div className="flex items-center gap-3 p-3 border rounded-lg">
														<Navigation className="w-5 h-5 text-blue-500" />
														<div className="flex-1">
															<p className="font-medium">Arrived at customer location</p>
															<p className="text-sm text-muted-foreground">123 Business Ave, Downtown • 09:15 AM</p>
														</div>
													</div>

													<div className="flex items-center gap-3 p-3 border rounded-lg">
														<Car className="w-5 h-5 text-green-500" />
														<div className="flex-1">
															<p className="font-medium">Started traveling to job site</p>
															<p className="text-sm text-muted-foreground">From office • 08:45 AM</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</TabsContent>

									{/* Time Tracking Tab */}
									<TabsContent value="time" className="space-y-6">
										<div className="space-y-4">
											<h3 className="text-lg font-semibold">Time Breakdown</h3>

											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
												<Card>
													<CardContent className="p-4">
														<div className="flex items-center gap-3">
															<Route className="w-6 h-6 text-blue-500" />
															<div>
																<p className="text-sm text-muted-foreground">Travel Time</p>
																<p className="text-lg font-bold">{formatDuration(selectedJob.timeTracking.travelTime)}</p>
															</div>
														</div>
													</CardContent>
												</Card>

												<Card>
													<CardContent className="p-4">
														<div className="flex items-center gap-3">
															<Wrench className="w-6 h-6 text-green-500" />
															<div>
																<p className="text-sm text-muted-foreground">On-Site Time</p>
																<p className="text-lg font-bold">{formatDuration(selectedJob.timeTracking.onSiteTime)}</p>
															</div>
														</div>
													</CardContent>
												</Card>

												<Card>
													<CardContent className="p-4">
														<div className="flex items-center gap-3">
															<Pause className="w-6 h-6 text-orange-500" />
															<div>
																<p className="text-sm text-muted-foreground">Break Time</p>
																<p className="text-lg font-bold">{formatDuration(selectedJob.timeTracking.breakTime)}</p>
															</div>
														</div>
													</CardContent>
												</Card>

												<Card>
													<CardContent className="p-4">
														<div className="flex items-center gap-3">
															<Timer className="w-6 h-6 text-purple-500" />
															<div>
																<p className="text-sm text-muted-foreground">Total Time</p>
																<p className="text-lg font-bold">{formatDuration(selectedJob.timeTracking.totalTime)}</p>
															</div>
														</div>
													</CardContent>
												</Card>
											</div>

											{/* Time Controls */}
											<div className="flex gap-2">
												<Button size="sm" variant="outline">
													<Play className="w-4 h-4 mr-2" />
													Start Timer
												</Button>
												<Button size="sm" variant="outline">
													<Pause className="w-4 h-4 mr-2" />
													Pause
												</Button>
												<Button size="sm" variant="outline">
													<Square className="w-4 h-4 mr-2" />
													Stop
												</Button>
											</div>

											{/* Efficiency Metrics */}
											<div className="space-y-3">
												<h4 className="font-medium">Efficiency Metrics</h4>

												<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
													<div className="p-3 border rounded-lg">
														<p className="text-sm text-muted-foreground">Estimated vs Actual</p>
														<p className="text-lg font-medium">{selectedJob.timeTracking.totalTime} min / 180 min</p>
														<Progress value={(selectedJob.timeTracking.totalTime / 180) * 100} className="h-2 mt-2" />
													</div>

													<div className="p-3 border rounded-lg">
														<p className="text-sm text-muted-foreground">Schedule Adherence</p>
														<p className="text-lg font-medium text-green-600">On Track</p>
													</div>

													<div className="p-3 border rounded-lg">
														<p className="text-sm text-muted-foreground">Productivity Score</p>
														<p className="text-lg font-medium">92%</p>
													</div>
												</div>
											</div>
										</div>
									</TabsContent>

									{/* Expenses Tab */}
									<TabsContent value="expenses" className="space-y-6">
										<div className="space-y-4">
											<div className="flex justify-between items-center">
												<h3 className="text-lg font-semibold">Job Expenses</h3>
												<Button size="sm">
													<Plus className="w-4 h-4 mr-2" />
													Add Expense
												</Button>
											</div>

											{selectedJob.expenses.length === 0 ? (
												<div className="text-center py-8 border-2 border-dashed rounded-lg">
													<DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
													<h3 className="text-lg font-medium text-gray-900 mb-2">No expenses recorded</h3>
													<p className="text-gray-500 mb-4">Add parts, materials, or other job-related expenses</p>
													<Button>
														<Plus className="w-4 h-4 mr-2" />
														Add First Expense
													</Button>
												</div>
											) : (
												<div className="space-y-3">
													{selectedJob.expenses.map((expense, index) => (
														<div key={index} className="flex items-center justify-between p-3 border rounded-lg">
															<div className="flex items-center gap-3">
																<DollarSign className="w-5 h-5 text-green-500" />
																<div>
																	<p className="font-medium">{expense.description}</p>
																	<p className="text-sm text-muted-foreground capitalize">{expense.type}</p>
																</div>
															</div>
															<div className="text-right">
																<p className="font-medium">${expense.amount.toFixed(2)}</p>
																<Button size="sm" variant="ghost">
																	<MoreHorizontal className="w-4 h-4" />
																</Button>
															</div>
														</div>
													))}

													<Separator />

													<div className="flex justify-between items-center font-medium">
														<span>Total Expenses</span>
														<span>${selectedJob.expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</span>
													</div>
												</div>
											)}
										</div>
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
