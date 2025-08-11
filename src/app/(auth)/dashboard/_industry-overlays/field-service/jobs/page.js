"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Wrench, Calendar, MapPin, User, Clock, DollarSign, Search, Filter, Plus, CheckCircle, AlertCircle, Phone, FileText, Camera, Truck } from "lucide-react";
import { cn } from "@lib/utils";

/**
 * Field Service Jobs Module
 * Industry-specific job management for field service businesses
 */
export default function FieldServiceJobsModule({ industryType, pathname, params }) {
	const [activeTab, setActiveTab] = useState("active");
	const [searchTerm, setSearchTerm] = useState("");

	// Sample data - in real app, this would come from API
	const jobsData = {
		overview: {
			activeJobs: 28,
			scheduledToday: 12,
			completedThisWeek: 45,
			totalRevenue: 125000,
			averageJobValue: 2500,
			completionRate: 94,
		},
		jobs: [
			{
				id: "JOB-001",
				title: "HVAC System Maintenance",
				customer: "ABC Corporation",
				address: "123 Business Ave, New York, NY",
				technician: "John Smith",
				scheduledDate: "2024-01-16",
				scheduledTime: "09:00 AM",
				estimatedDuration: 3,
				priority: "high",
				status: "scheduled",
				value: 850,
				description: "Annual HVAC maintenance and filter replacement",
				equipment: ["Unit #1", "Unit #2"],
				tags: ["maintenance", "hvac", "commercial"],
			},
			{
				id: "JOB-002",
				title: "Plumbing Repair - Emergency",
				customer: "Smith Residence",
				address: "456 Oak Street, Los Angeles, CA",
				technician: "Sarah Johnson",
				scheduledDate: "2024-01-16",
				scheduledTime: "02:00 PM",
				estimatedDuration: 2,
				priority: "urgent",
				status: "in_progress",
				value: 450,
				description: "Burst pipe in basement requiring immediate attention",
				equipment: ["Main water line"],
				tags: ["emergency", "plumbing", "residential"],
			},
			{
				id: "JOB-003",
				title: "Electrical Panel Upgrade",
				customer: "Downtown Restaurant",
				address: "789 Main St, Chicago, IL",
				technician: "Mike Wilson",
				scheduledDate: "2024-01-17",
				scheduledTime: "10:00 AM",
				estimatedDuration: 6,
				priority: "medium",
				status: "scheduled",
				value: 3200,
				description: "Upgrade electrical panel to support new kitchen equipment",
				equipment: ["200A Panel", "Circuit breakers"],
				tags: ["electrical", "upgrade", "commercial"],
			},
			{
				id: "JOB-004",
				title: "Roof Inspection",
				customer: "Johnson Property Management",
				address: "321 Pine Ave, Miami, FL",
				technician: "David Brown",
				scheduledDate: "2024-01-15",
				scheduledTime: "08:00 AM",
				estimatedDuration: 2,
				priority: "low",
				status: "completed",
				value: 300,
				description: "Routine roof inspection for property management company",
				equipment: ["Inspection tools"],
				tags: ["inspection", "roofing", "routine"],
			},
		],
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "scheduled":
				return "bg-blue-100 text-blue-800";
			case "in_progress":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-green-100 text-green-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			case "on_hold":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "urgent":
				return "bg-red-100 text-red-800";
			case "high":
				return "bg-orange-100 text-orange-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const filteredJobs = jobsData.jobs.filter((job) => {
		const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.customer.toLowerCase().includes(searchTerm.toLowerCase()) || job.id.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesTab = activeTab === "all" || (activeTab === "active" && ["scheduled", "in_progress"].includes(job.status)) || (activeTab === "completed" && job.status === "completed") || (activeTab === "urgent" && job.priority === "urgent");

		return matchesSearch && matchesTab;
	});

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Management</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">Schedule, track, and manage field service jobs</p>
				</div>
				<div className="flex space-x-2">
					<Button variant="outline" size="sm">
						<Filter className="h-4 w-4 mr-2" />
						Filters
					</Button>
					<Button size="sm">
						<Plus className="h-4 w-4 mr-2" />
						New Job
					</Button>
				</div>
			</div>

			{/* Jobs Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
						<Wrench className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{jobsData.overview.activeJobs}</div>
						<p className="text-xs text-muted-foreground">{jobsData.overview.scheduledToday} scheduled today</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{jobsData.overview.completedThisWeek}</div>
						<p className="text-xs text-muted-foreground">{jobsData.overview.completionRate}% completion rate</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">{formatCurrency(jobsData.overview.totalRevenue)}</div>
						<p className="text-xs text-muted-foreground">Avg: {formatCurrency(jobsData.overview.averageJobValue)}</p>
					</CardContent>
				</Card>
			</div>

			{/* Search and Filter */}
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input placeholder="Search jobs by title, customer, or job ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
						</div>
						<Button variant="outline">
							<Filter className="h-4 w-4 mr-2" />
							Advanced Filters
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Jobs Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="active">Active Jobs</TabsTrigger>
					<TabsTrigger value="urgent">Urgent</TabsTrigger>
					<TabsTrigger value="completed">Completed</TabsTrigger>
					<TabsTrigger value="all">All Jobs</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="space-y-4">
					<div className="grid gap-4">
						{filteredJobs.map((job) => (
							<Card key={job.id} className="hover:shadow-md transition-shadow">
								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div className="flex-1 space-y-3">
											{/* Job Header */}
											<div className="flex items-start justify-between">
												<div>
													<div className="flex items-center space-x-3">
														<h3 className="text-lg font-semibold">{job.title}</h3>
														<Badge className={cn("text-xs", getStatusColor(job.status))}>{job.status.replace("_", " ")}</Badge>
														<Badge className={cn("text-xs", getPriorityColor(job.priority))}>{job.priority}</Badge>
													</div>
													<p className="text-sm text-muted-foreground mt-1">Job ID: {job.id}</p>
												</div>
												<div className="text-right">
													<p className="text-xl font-semibold text-green-600">{formatCurrency(job.value)}</p>
													<p className="text-sm text-muted-foreground">Est. {job.estimatedDuration}h</p>
												</div>
											</div>

											{/* Job Details */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<div className="flex items-center text-sm text-muted-foreground">
														<User className="h-4 w-4 mr-2" />
														Customer: {job.customer}
													</div>
													<div className="flex items-center text-sm text-muted-foreground">
														<MapPin className="h-4 w-4 mr-2" />
														{job.address}
													</div>
													<div className="flex items-center text-sm text-muted-foreground">
														<Truck className="h-4 w-4 mr-2" />
														Technician: {job.technician}
													</div>
												</div>
												<div className="space-y-2">
													<div className="flex items-center text-sm text-muted-foreground">
														<Calendar className="h-4 w-4 mr-2" />
														{job.scheduledDate} at {job.scheduledTime}
													</div>
													<div className="flex items-center text-sm text-muted-foreground">
														<Clock className="h-4 w-4 mr-2" />
														Duration: {job.estimatedDuration} hours
													</div>
												</div>
											</div>

											{/* Job Description */}
											<div>
												<p className="text-sm text-gray-700 dark:text-gray-300">{job.description}</p>
											</div>

											{/* Equipment and Tags */}
											<div className="flex flex-wrap gap-2">
												{job.equipment.map((item, index) => (
													<Badge key={index} variant="outline" className="text-xs">
														{item}
													</Badge>
												))}
												{job.tags.map((tag, index) => (
													<Badge key={index} variant="secondary" className="text-xs">
														#{tag}
													</Badge>
												))}
											</div>

											{/* Action Buttons */}
											<div className="flex space-x-2 pt-2">
												<Button size="sm" variant="outline">
													<Phone className="h-4 w-4 mr-2" />
													Call Customer
												</Button>
												<Button size="sm" variant="outline">
													<MapPin className="h-4 w-4 mr-2" />
													Directions
												</Button>
												<Button size="sm" variant="outline">
													<FileText className="h-4 w-4 mr-2" />
													View Details
												</Button>
												{job.status === "in_progress" && (
													<Button size="sm">
														<CheckCircle className="h-4 w-4 mr-2" />
														Complete Job
													</Button>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{filteredJobs.length === 0 && (
						<Card>
							<CardContent className="p-12 text-center">
								<Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
								<p className="text-gray-500 dark:text-gray-400">{searchTerm ? "Try adjusting your search terms." : "Create your first job to get started."}</p>
								{!searchTerm && (
									<Button className="mt-4">
										<Plus className="h-4 w-4 mr-2" />
										Create New Job
									</Button>
								)}
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Common job management tasks</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Button variant="outline" className="h-20 flex flex-col">
							<Calendar className="h-6 w-6 mb-2" />
							Schedule Job
						</Button>
						<Button variant="outline" className="h-20 flex flex-col">
							<AlertCircle className="h-6 w-6 mb-2" />
							Emergency Call
						</Button>
						<Button variant="outline" className="h-20 flex flex-col">
							<FileText className="h-6 w-6 mb-2" />
							Job Templates
						</Button>
						<Button variant="outline" className="h-20 flex flex-col">
							<Camera className="h-6 w-6 mb-2" />
							Photo Upload
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
