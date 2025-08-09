"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { Briefcase, Clock, MapPin, Phone, Plus, Search, Filter, MoreVertical, Edit, Eye, Trash2, FileText, DollarSign, CheckCircle, AlertTriangle, Timer, Wrench, Zap, Settings, Download, SortAsc, SortDesc } from "lucide-react";
import { format, parseISO, isToday, isTomorrow, isYesterday, differenceInDays } from "date-fns";

/**
 * Jobs List Page - Comprehensive job management dashboard
 * Features: Advanced filtering, sorting, bulk actions, status tracking, and performance analytics
 */
export default function JobsList() {
	const router = useRouter();
	const [jobs, setJobs] = useState([]);
	const [filteredJobs, setFilteredJobs] = useState([]);
	const [selectedJobs, setSelectedJobs] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [priorityFilter, setPriorityFilter] = useState("all");
	const [technicianFilter, setTechnicianFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState("all");
	const [sortBy, setSortBy] = useState("scheduledStart");
	const [sortOrder, setSortOrder] = useState("asc");
	const [showFilters, setShowFilters] = useState(false);
	const [currentTab, setCurrentTab] = useState("all");

	// Mock data
	const mockTechnicians = [
		{ id: "TECH001", name: "Mike Wilson", role: "Senior Technician" },
		{ id: "TECH002", name: "Lisa Chen", role: "Electrical Specialist" },
		{ id: "TECH003", name: "David Brown", role: "Plumbing Expert" },
		{ id: "TECH004", name: "Emma Davis", role: "HVAC Technician" },
	];

	const mockJobs = [
		{
			id: "JOB001",
			title: "HVAC System Maintenance",
			customer: "Sarah Johnson",
			customerPhone: "(555) 123-4567",
			address: "123 Main St, Downtown",
			scheduledStart: "2024-01-22T09:00:00",
			scheduledEnd: "2024-01-22T11:00:00",
			assignedTo: "TECH001",
			status: "scheduled",
			priority: "normal",
			serviceType: "HVAC",
			estimatedValue: 320,
			actualValue: null,
			description: "Annual maintenance and filter replacement",
			tags: ["Maintenance", "Annual"],
			completionPercentage: 0,
			createdAt: "2024-01-20T10:00:00",
		},
		{
			id: "JOB002",
			title: "Emergency Electrical Repair",
			customer: "Bob&apos;s Restaurant",
			customerPhone: "(555) 456-7890",
			address: "456 Business Ave, Business District",
			scheduledStart: "2024-01-21T08:30:00",
			scheduledEnd: "2024-01-21T11:00:00",
			assignedTo: "TECH002",
			status: "in_progress",
			priority: "urgent",
			serviceType: "Electrical",
			estimatedValue: 450,
			actualValue: null,
			description: "Circuit breaker replacement and wiring repair",
			tags: ["Emergency", "Electrical"],
			completionPercentage: 65,
			createdAt: "2024-01-21T07:00:00",
		},
		{
			id: "JOB003",
			title: "Drain Cleaning Service",
			customer: "Mountain View Apartments",
			customerPhone: "(555) 789-0123",
			address: "789 Residential Rd, Residential Zone",
			scheduledStart: "2024-01-20T14:00:00",
			scheduledEnd: "2024-01-20T15:30:00",
			assignedTo: "TECH003",
			status: "completed",
			priority: "normal",
			serviceType: "Plumbing",
			estimatedValue: 180,
			actualValue: 175,
			description: "Kitchen and bathroom drain cleaning",
			tags: ["Plumbing", "Cleaning"],
			completionPercentage: 100,
			createdAt: "2024-01-19T15:30:00",
		},
		{
			id: "JOB004",
			title: "Air Conditioning Installation",
			customer: "Tech Solutions Inc",
			customerPhone: "(555) 321-6543",
			address: "321 Corporate Blvd, Business Park",
			scheduledStart: "2024-01-23T08:00:00",
			scheduledEnd: "2024-01-23T12:00:00",
			assignedTo: "TECH004",
			status: "scheduled",
			priority: "high",
			serviceType: "HVAC",
			estimatedValue: 1200,
			actualValue: null,
			description: "New AC unit installation for conference room",
			tags: ["Installation", "Commercial"],
			completionPercentage: 0,
			createdAt: "2024-01-22T09:15:00",
		},
		{
			id: "JOB005",
			title: "Plumbing System Upgrade",
			customer: "Green Building Corp",
			customerPhone: "(555) 654-3210",
			address: "654 Eco Way, Bronx",
			scheduledStart: "2024-01-19T10:00:00",
			scheduledEnd: "2024-01-19T14:00:00",
			assignedTo: "TECH003",
			status: "overdue",
			priority: "high",
			serviceType: "Plumbing",
			estimatedValue: 850,
			actualValue: null,
			description: "Full plumbing system upgrade and modernization",
			tags: ["Upgrade", "Commercial"],
			completionPercentage: 0,
			createdAt: "2024-01-18T11:00:00",
		},
	];

	useEffect(() => {
		setJobs(mockJobs);
	}, []);

	// Filter and sort jobs
	const processedJobs = useMemo(() => {
		let filtered = [...jobs];

		// Apply search filter
		if (searchTerm) {
			filtered = filtered.filter((job) => job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.customer.toLowerCase().includes(searchTerm.toLowerCase()) || job.description.toLowerCase().includes(searchTerm.toLowerCase()) || job.address.toLowerCase().includes(searchTerm.toLowerCase()));
		}

		// Apply status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((job) => job.status === statusFilter);
		}

		// Apply priority filter
		if (priorityFilter !== "all") {
			filtered = filtered.filter((job) => job.priority === priorityFilter);
		}

		// Apply technician filter
		if (technicianFilter !== "all") {
			filtered = filtered.filter((job) => job.assignedTo === technicianFilter);
		}

		// Apply date filter
		if (dateFilter !== "all") {
			const today = new Date();
			const jobDate = (job) => parseISO(job.scheduledStart);

			switch (dateFilter) {
				case "today":
					filtered = filtered.filter((job) => isToday(jobDate(job)));
					break;
				case "tomorrow":
					filtered = filtered.filter((job) => isTomorrow(jobDate(job)));
					break;
				case "this_week":
					filtered = filtered.filter((job) => {
						const diff = differenceInDays(jobDate(job), today);
						return diff >= 0 && diff <= 7;
					});
					break;
				case "overdue":
					filtered = filtered.filter((job) => job.status === "overdue" || (jobDate(job) < today && job.status !== "completed"));
					break;
			}
		}

		// Apply tab filter
		switch (currentTab) {
			case "active":
				filtered = filtered.filter((job) => ["scheduled", "in_progress"].includes(job.status));
				break;
			case "completed":
				filtered = filtered.filter((job) => job.status === "completed");
				break;
			case "overdue":
				filtered = filtered.filter((job) => job.status === "overdue" || (parseISO(job.scheduledStart) < new Date() && job.status !== "completed"));
				break;
		}

		// Apply sorting
		filtered.sort((a, b) => {
			let aValue = a[sortBy];
			let bValue = b[sortBy];

			if (sortBy === "scheduledStart" || sortBy === "createdAt") {
				aValue = new Date(aValue);
				bValue = new Date(bValue);
			}

			if (sortBy === "estimatedValue" || sortBy === "actualValue") {
				aValue = aValue || 0;
				bValue = bValue || 0;
			}

			if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
			if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});

		return filtered;
	}, [jobs, searchTerm, statusFilter, priorityFilter, technicianFilter, dateFilter, sortBy, sortOrder, currentTab]);

	useEffect(() => {
		setFilteredJobs(processedJobs);
	}, [processedJobs]);

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
				return "border-l-red-500 bg-red-50 dark:bg-red-900/10";
			case "high":
				return "border-l-orange-500 bg-orange-50 dark:bg-orange-900/10";
			case "normal":
				return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10";
			case "low":
				return "border-l-green-500 bg-green-50 dark:bg-green-900/10";
			default:
				return "border-l-gray-500 bg-gray-50 dark:bg-gray-900/10";
		}
	};

	const getServiceIcon = (serviceType) => {
		switch (serviceType) {
			case "HVAC":
				return <Timer className="w-4 h-4" />;
			case "Electrical":
				return <Zap className="w-4 h-4" />;
			case "Plumbing":
				return <Wrench className="w-4 h-4" />;
			default:
				return <Settings className="w-4 h-4" />;
		}
	};

	const getTechnicianName = (techId) => {
		const tech = mockTechnicians.find((t) => t.id === techId);
		return tech ? tech.name : "Unassigned";
	};

	const getDateInfo = (date) => {
		const jobDate = parseISO(date);
		if (isToday(jobDate)) return { label: "Today", color: "text-blue-600" };
		if (isTomorrow(jobDate)) return { label: "Tomorrow", color: "text-green-600" };
		if (isYesterday(jobDate)) return { label: "Yesterday", color: "text-gray-600" };
		if (jobDate < new Date()) return { label: format(jobDate, "MMM d"), color: "text-red-600" };
		return { label: format(jobDate, "MMM d"), color: "text-gray-600" };
	};

	// Actions
	const handleSelectJob = (jobId) => {
		setSelectedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]));
	};

	const handleSelectAll = () => {
		setSelectedJobs(selectedJobs.length === filteredJobs.length ? [] : filteredJobs.map((job) => job.id));
	};

	const handleBulkAction = (action) => {
		console.log(`Bulk action: ${action} on jobs:`, selectedJobs);
		// Implement bulk actions here
		setSelectedJobs([]);
	};

	const handleSort = (field) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setSortOrder("asc");
		}
	};

	// Stats for tabs
	const jobStats = useMemo(() => {
		return {
			all: jobs.length,
			active: jobs.filter((job) => ["scheduled", "in_progress"].includes(job.status)).length,
			completed: jobs.filter((job) => job.status === "completed").length,
			overdue: jobs.filter((job) => job.status === "overdue" || (parseISO(job.scheduledStart) < new Date() && job.status !== "completed")).length,
		};
	}, [jobs]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
					<p className="text-muted-foreground">Manage and track all service jobs and work orders</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
						<Filter className="mr-2 w-4 h-4" />
						Filters
					</Button>
					<Button variant="outline" size="sm">
						<Download className="mr-2 w-4 h-4" />
						Export
					</Button>
					<Button size="sm" onClick={() => router.push("/dashboard/business/schedule/new-job")}>
						<Plus className="mr-2 w-4 h-4" />
						New Job
					</Button>
				</div>
			</div>

			{/* Filters */}
			{showFilters && (
				<Card>
					<CardContent className="p-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
								<Input placeholder="Search jobs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
							</div>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="scheduled">Scheduled</SelectItem>
									<SelectItem value="in_progress">In Progress</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="overdue">Overdue</SelectItem>
								</SelectContent>
							</Select>
							<Select value={priorityFilter} onValueChange={setPriorityFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Priorities</SelectItem>
									<SelectItem value="urgent">Urgent</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="normal">Normal</SelectItem>
									<SelectItem value="low">Low</SelectItem>
								</SelectContent>
							</Select>
							<Select value={technicianFilter} onValueChange={setTechnicianFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Technician" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Technicians</SelectItem>
									{mockTechnicians.map((tech) => (
										<SelectItem key={tech.id} value={tech.id}>
											{tech.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select value={dateFilter} onValueChange={setDateFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Date Range" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Dates</SelectItem>
									<SelectItem value="today">Today</SelectItem>
									<SelectItem value="tomorrow">Tomorrow</SelectItem>
									<SelectItem value="this_week">This Week</SelectItem>
									<SelectItem value="overdue">Overdue</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Tabs and bulk actions */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full sm:w-auto">
					<TabsList>
						<TabsTrigger value="all">All ({jobStats.all})</TabsTrigger>
						<TabsTrigger value="active">Active ({jobStats.active})</TabsTrigger>
						<TabsTrigger value="completed">Completed ({jobStats.completed})</TabsTrigger>
						<TabsTrigger value="overdue">Overdue ({jobStats.overdue})</TabsTrigger>
					</TabsList>
				</Tabs>

				{selectedJobs.length > 0 && (
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">{selectedJobs.length} selected</span>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									Bulk Actions
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={() => handleBulkAction("update_status")}>Update Status</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleBulkAction("assign_technician")}>Assign Technician</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleBulkAction("export")}>Export Selected</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => handleBulkAction("delete")} className="text-red-600">
									Delete Selected
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}
			</div>

			{/* Jobs List */}
			<Card>
				<CardContent className="p-0">
					{/* Table Header */}
					<div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
						<div className="flex items-center">
							<Checkbox checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0} onCheckedChange={handleSelectAll} />
						</div>
						<div className="col-span-3">
							<Button variant="ghost" size="sm" className="h-auto p-0 font-medium" onClick={() => handleSort("title")}>
								Job Details
								{sortBy === "title" && (sortOrder === "asc" ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />)}
							</Button>
						</div>
						<div className="col-span-2">
							<Button variant="ghost" size="sm" className="h-auto p-0 font-medium" onClick={() => handleSort("customer")}>
								Customer
								{sortBy === "customer" && (sortOrder === "asc" ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />)}
							</Button>
						</div>
						<div className="col-span-2">
							<Button variant="ghost" size="sm" className="h-auto p-0 font-medium" onClick={() => handleSort("scheduledStart")}>
								Scheduled
								{sortBy === "scheduledStart" && (sortOrder === "asc" ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />)}
							</Button>
						</div>
						<div>Status</div>
						<div>
							<Button variant="ghost" size="sm" className="h-auto p-0 font-medium" onClick={() => handleSort("estimatedValue")}>
								Value
								{sortBy === "estimatedValue" && (sortOrder === "asc" ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />)}
							</Button>
						</div>
						<div>Technician</div>
						<div>Actions</div>
					</div>

					{/* Jobs */}
					{filteredJobs.length > 0 ? (
						<div className="divide-y">
							{filteredJobs.map((job) => {
								const dateInfo = getDateInfo(job.scheduledStart);
								return (
									<div key={job.id} className={`grid grid-cols-12 gap-4 p-4 hover:bg-accent/50 transition-colors border-l-4 ${getPriorityColor(job.priority)}`}>
										<div className="flex items-center">
											<Checkbox checked={selectedJobs.includes(job.id)} onCheckedChange={() => handleSelectJob(job.id)} />
										</div>
										<div className="col-span-3">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													{getServiceIcon(job.serviceType)}
													<h4 className="font-medium text-sm">{job.title}</h4>
												</div>
												<p className="text-xs text-muted-foreground line-clamp-1">{job.description}</p>
												<div className="flex flex-wrap gap-1">
													{job.tags.map((tag) => (
														<Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">
															{tag}
														</Badge>
													))}
												</div>
											</div>
										</div>
										<div className="col-span-2">
											<div className="space-y-1">
												<p className="font-medium text-sm">{job.customer}</p>
												<div className="flex items-center gap-1 text-xs text-muted-foreground">
													<Phone className="w-3 h-3" />
													{job.customerPhone}
												</div>
												<div className="flex items-center gap-1 text-xs text-muted-foreground">
													<MapPin className="w-3 h-3" />
													{job.address.split(",")[0]}
												</div>
											</div>
										</div>
										<div className="col-span-2">
											<div className="space-y-1">
												<p className={`text-sm font-medium ${dateInfo.color}`}>{dateInfo.label}</p>
												<div className="flex items-center gap-1 text-xs text-muted-foreground">
													<Clock className="w-3 h-3" />
													{format(parseISO(job.scheduledStart), "HH:mm")} - {format(parseISO(job.scheduledEnd), "HH:mm")}
												</div>
												{job.status === "in_progress" && (
													<div className="text-xs">
														<div className="flex items-center justify-between mb-1">
															<span>Progress</span>
															<span>{job.completionPercentage}%</span>
														</div>
														<div className="w-full bg-gray-200 rounded-full h-1.5">
															<div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${job.completionPercentage}%` }}></div>
														</div>
													</div>
												)}
											</div>
										</div>
										<div>
											<Badge className={getStatusColor(job.status)} variant="secondary">
												{job.status.replace("_", " ")}
											</Badge>
										</div>
										<div>
											<div className="space-y-1">
												<div className="flex items-center gap-1 text-sm">
													<DollarSign className="w-3 h-3" />
													<span className="font-medium">${job.estimatedValue}</span>
												</div>
												{job.actualValue && <div className="text-xs text-muted-foreground">Actual: ${job.actualValue}</div>}
											</div>
										</div>
										<div>
											<p className="text-sm font-medium">{getTechnicianName(job.assignedTo)}</p>
										</div>
										<div>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														<MoreVertical className="w-4 h-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													<DropdownMenuItem onClick={() => router.push(`/dashboard/business/jobs/details?id=${job.id}`)}>
														<Eye className="mr-2 w-4 h-4" />
														View Details
													</DropdownMenuItem>
													<DropdownMenuItem>
														<Edit className="mr-2 w-4 h-4" />
														Edit Job
													</DropdownMenuItem>
													<DropdownMenuItem>
														<FileText className="mr-2 w-4 h-4" />
														Create Invoice
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="text-red-600">
														<Trash2 className="mr-2 w-4 h-4" />
														Delete Job
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="text-center py-12">
							<Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
							<h3 className="text-lg font-medium mb-2">No jobs found</h3>
							<p className="text-muted-foreground mb-4">No jobs match your current filters. Try adjusting your search criteria.</p>
							<Button onClick={() => router.push("/dashboard/business/schedule/new-job")}>
								<Plus className="mr-2 w-4 h-4" />
								Create New Job
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total Jobs</p>
								<p className="text-2xl font-bold">{jobStats.all}</p>
							</div>
							<Briefcase className="w-8 h-8 text-blue-500" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Active Jobs</p>
								<p className="text-2xl font-bold">{jobStats.active}</p>
							</div>
							<Timer className="w-8 h-8 text-yellow-500" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Completed</p>
								<p className="text-2xl font-bold">{jobStats.completed}</p>
							</div>
							<CheckCircle className="w-8 h-8 text-green-500" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Overdue</p>
								<p className="text-2xl font-bold">{jobStats.overdue}</p>
							</div>
							<AlertTriangle className="w-8 h-8 text-red-500" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
