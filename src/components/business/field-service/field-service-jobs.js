"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Calendar, MapPin, Plus, Filter, Download, Search, Eye, Edit, Trash2, CheckCircle, AlertTriangle, Activity, FileText, DollarSign, Star, MessageSquare, Navigation, Wrench, User, Tag, MoreHorizontal, ChevronDown, Settings, RefreshCw, Mail, Phone as PhoneIcon, Camera, Paperclip, CheckSquare, X, Timer } from "lucide-react";
import { format, isToday, isPast, isFuture } from "date-fns";
import Header from "@components/business/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@components/ui/dropdown-menu";
import { Checkbox } from "@components/ui/checkbox";

/**
 * Comprehensive Field Service Jobs Management System
 * Advanced job tracking, filtering, and management for owners and office staff
 */
export default function FieldServiceJobs({ user, userRole, initialJobs = [], jobStats = null, technicians = [], jobTypes = [] }) {
	const [jobs, setJobs] = useState(initialJobs);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedPriority, setSelectedPriority] = useState("all");
	const [selectedTechnician, setSelectedTechnician] = useState("all");
	const [selectedJobType, setSelectedJobType] = useState("all");
	const [dateFilter, setDateFilter] = useState("all");
	const [sortBy, setSortBy] = useState("created_at");
	const [sortOrder, setSortOrder] = useState("desc");
	const [selectedJobs, setSelectedJobs] = useState([]);
	const [viewMode, setViewMode] = useState("list"); // list, grid, kanban
	const [showFilters, setShowFilters] = useState(false);

	// Enhanced mock data for comprehensive demonstration
	const mockJobs = [
		{
			id: "FSM001",
			job_number: "JOB-2024-001",
			customer_name: "John Smith",
			customer_phone: "(555) 123-4567",
			customer_email: "john.smith@email.com",
			service_type: "Emergency Plumbing Repair",
			description: "Water heater leaking badly, urgent repair needed",
			status: "scheduled",
			priority: "urgent",
			created_at: "2024-01-14T08:30:00Z",
			scheduled_time: "2024-01-15T10:00:00Z",
			estimated_duration: 120,
			actual_duration: null,
			estimated_price: 150,
			final_price: null,
			address: "123 Main St, Anytown, CA 12345",
			technician_id: "tech_001",
			technician_name: "Mike Wilson",
			job_type: "Emergency Repair",
			skills_required: ["plumbing", "emergency"],
			customer_rating: null,
			completion_notes: null,
			internal_notes: "Customer has small children, prioritize safety",
			attachments: 2,
			parts_used: 0,
			checklist_completed: false,
			invoice_generated: false,
			payment_status: "pending",
			tags: ["urgent", "water damage"],
			last_updated: "2024-01-14T15:30:00Z",
			coordinates: { lat: 40.7128, lng: -74.006 },
		},
		{
			id: "FSM002",
			job_number: "JOB-2024-002",
			customer_name: "Sarah Johnson",
			customer_phone: "(555) 987-6543",
			customer_email: "sarah.j@company.com",
			service_type: "HVAC Installation",
			description: "Replace entire HVAC unit - residential home",
			status: "in_progress",
			priority: "high",
			created_at: "2024-01-13T14:20:00Z",
			scheduled_time: "2024-01-15T14:00:00Z",
			estimated_duration: 240,
			actual_duration: 180,
			estimated_price: 800,
			final_price: null,
			address: "456 Oak Ave, Anytown, CA 12345",
			technician_id: "tech_002",
			technician_name: "David Brown",
			job_type: "Installation",
			skills_required: ["hvac", "installation"],
			customer_rating: null,
			completion_notes: null,
			internal_notes: "Large job, may need helper. Customer available all day.",
			attachments: 5,
			parts_used: 3,
			checklist_completed: true,
			invoice_generated: false,
			payment_status: "pending",
			tags: ["installation", "residential"],
			last_updated: "2024-01-15T16:30:00Z",
			coordinates: { lat: 40.7589, lng: -73.9851 },
		},
		{
			id: "FSM003",
			job_number: "JOB-2024-003",
			customer_name: "Mike Davis",
			customer_phone: "(555) 456-7890",
			customer_email: "mdavis@home.com",
			service_type: "Electrical Safety Inspection",
			description: "Annual electrical safety inspection - residential",
			status: "completed",
			priority: "normal",
			created_at: "2024-01-12T09:15:00Z",
			scheduled_time: "2024-01-14T09:00:00Z",
			estimated_duration: 60,
			actual_duration: 75,
			estimated_price: 120,
			final_price: 120,
			address: "789 Pine St, Anytown, CA 12345",
			technician_id: "tech_003",
			technician_name: "Lisa Chen",
			job_type: "Inspection",
			skills_required: ["electrical", "inspection"],
			customer_rating: 5.0,
			completion_notes: "All electrical systems passed inspection. Minor recommendations provided.",
			internal_notes: "Regular customer, very satisfied with service",
			attachments: 3,
			parts_used: 0,
			checklist_completed: true,
			invoice_generated: true,
			payment_status: "paid",
			tags: ["inspection", "annual"],
			last_updated: "2024-01-14T11:15:00Z",
			coordinates: { lat: 40.7505, lng: -73.9934 },
		},
		{
			id: "FSM004",
			job_number: "JOB-2024-004",
			customer_name: "Emma Wilson",
			customer_phone: "(555) 234-5678",
			customer_email: "emma.w@business.com",
			service_type: "Commercial Drain Cleaning",
			description: "Kitchen sink and floor drains backing up",
			status: "scheduled",
			priority: "normal",
			created_at: "2024-01-14T11:45:00Z",
			scheduled_time: "2024-01-15T16:00:00Z",
			estimated_duration: 90,
			actual_duration: null,
			estimated_price: 95,
			final_price: null,
			address: "321 Elm St, Business District, CA 12345",
			technician_id: "tech_001",
			technician_name: "Mike Wilson",
			job_type: "Maintenance",
			skills_required: ["plumbing"],
			customer_rating: null,
			completion_notes: null,
			internal_notes: "Commercial kitchen - work during off hours preferred",
			attachments: 1,
			parts_used: 0,
			checklist_completed: false,
			invoice_generated: false,
			payment_status: "pending",
			tags: ["commercial", "maintenance"],
			last_updated: "2024-01-14T11:45:00Z",
			coordinates: { lat: 40.7282, lng: -74.0776 },
		},
		{
			id: "FSM005",
			job_number: "JOB-2024-005",
			customer_name: "Robert Chen",
			customer_phone: "(555) 345-6789",
			customer_email: "rchen@residence.net",
			service_type: "AC Maintenance",
			description: "Routine HVAC maintenance and filter replacement",
			status: "cancelled",
			priority: "low",
			created_at: "2024-01-13T16:20:00Z",
			scheduled_time: "2024-01-16T11:00:00Z",
			estimated_duration: 90,
			actual_duration: null,
			estimated_price: 150,
			final_price: null,
			address: "654 Maple Dr, Suburb Area, CA 12345",
			technician_id: null,
			technician_name: null,
			job_type: "Maintenance",
			skills_required: ["hvac", "maintenance"],
			customer_rating: null,
			completion_notes: null,
			internal_notes: "Customer rescheduled due to emergency",
			attachments: 0,
			parts_used: 0,
			checklist_completed: false,
			invoice_generated: false,
			payment_status: "cancelled",
			tags: ["maintenance", "rescheduled"],
			last_updated: "2024-01-14T14:20:00Z",
			coordinates: { lat: 40.7831, lng: -73.9712 },
		},
		{
			id: "FSM006",
			job_number: "JOB-2024-006",
			customer_name: "Linda Rodriguez",
			customer_phone: "(555) 567-8901",
			customer_email: "l.rodriguez@email.com",
			service_type: "Bathroom Fixture Installation",
			description: "Install new toilet and vanity in master bathroom",
			status: "pending_approval",
			priority: "normal",
			created_at: "2024-01-15T09:30:00Z",
			scheduled_time: "2024-01-17T13:00:00Z",
			estimated_duration: 180,
			actual_duration: null,
			estimated_price: 350,
			final_price: null,
			address: "987 Cedar Ln, Residential Area, CA 12345",
			technician_id: "tech_004",
			technician_name: "Tom Garcia",
			job_type: "Installation",
			skills_required: ["plumbing", "installation"],
			customer_rating: null,
			completion_notes: null,
			internal_notes: "Estimate sent, awaiting customer approval",
			attachments: 2,
			parts_used: 0,
			checklist_completed: false,
			invoice_generated: false,
			payment_status: "pending",
			tags: ["installation", "bathroom"],
			last_updated: "2024-01-15T09:30:00Z",
			coordinates: { lat: 40.7694, lng: -73.9442 },
		},
	];

	const mockStats = {
		total_jobs: mockJobs.length,
		scheduled_jobs: mockJobs.filter((j) => j.status === "scheduled").length,
		in_progress_jobs: mockJobs.filter((j) => j.status === "in_progress").length,
		completed_jobs: mockJobs.filter((j) => j.status === "completed").length,
		cancelled_jobs: mockJobs.filter((j) => j.status === "cancelled").length,
		pending_approval: mockJobs.filter((j) => j.status === "pending_approval").length,
		overdue_jobs: mockJobs.filter((j) => isPast(new Date(j.scheduled_time)) && j.status === "scheduled").length,
		avg_completion_time: 95, // minutes
		customer_satisfaction: 4.6,
		first_time_fix_rate: 89,
		total_revenue: mockJobs.reduce((sum, job) => sum + (job.final_price || job.estimated_price || 0), 0),
	};

	useEffect(() => {
		// Initialize with mock data for demonstration
		setJobs(mockJobs);
	}, []);

	// Filtering and sorting logic
	const filteredAndSortedJobs = useMemo(() => {
		let filtered = jobs.filter((job) => {
			// Search filter
			if (searchTerm) {
				const searchLower = searchTerm.toLowerCase();
				const matchesSearch = job.customer_name.toLowerCase().includes(searchLower) || job.service_type.toLowerCase().includes(searchLower) || job.job_number.toLowerCase().includes(searchLower) || job.address.toLowerCase().includes(searchLower) || job.description.toLowerCase().includes(searchLower);
				if (!matchesSearch) return false;
			}

			// Status filter
			if (selectedStatus !== "all" && job.status !== selectedStatus) return false;

			// Priority filter
			if (selectedPriority !== "all" && job.priority !== selectedPriority) return false;

			// Technician filter
			if (selectedTechnician !== "all" && job.technician_id !== selectedTechnician) return false;

			// Job type filter
			if (selectedJobType !== "all" && job.job_type !== selectedJobType) return false;

			// Date filter
			if (dateFilter !== "all") {
				const jobDate = new Date(job.scheduled_time);
				const today = new Date();

				switch (dateFilter) {
					case "today":
						if (!isToday(jobDate)) return false;
						break;
					case "this_week":
						const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
						if (jobDate < weekStart) return false;
						break;
					case "overdue":
						if (!isPast(jobDate) || job.status === "completed") return false;
						break;
					case "upcoming":
						if (!isFuture(jobDate)) return false;
						break;
				}
			}

			return true;
		});

		// Sorting
		filtered.sort((a, b) => {
			let aValue, bValue;

			switch (sortBy) {
				case "customer_name":
					aValue = a.customer_name;
					bValue = b.customer_name;
					break;
				case "scheduled_time":
					aValue = new Date(a.scheduled_time);
					bValue = new Date(b.scheduled_time);
					break;
				case "priority":
					const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
					aValue = priorityOrder[a.priority] || 0;
					bValue = priorityOrder[b.priority] || 0;
					break;
				case "status":
					aValue = a.status;
					bValue = b.status;
					break;
				case "estimated_price":
					aValue = a.estimated_price || 0;
					bValue = b.estimated_price || 0;
					break;
				default:
					aValue = new Date(a.created_at);
					bValue = new Date(b.created_at);
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return filtered;
	}, [jobs, searchTerm, selectedStatus, selectedPriority, selectedTechnician, selectedJobType, dateFilter, sortBy, sortOrder]);

	// Helper functions
	const getStatusColor = (status) => {
		switch (status) {
			case "scheduled":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
			case "in_progress":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
			case "cancelled":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
			case "pending_approval":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
			case "on_hold":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "urgent":
				return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20";
			case "high":
				return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20";
			case "normal":
				return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20";
			case "low":
				return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20";
			default:
				return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20";
		}
	};

	const getJobTypeIcon = (jobType) => {
		switch (jobType?.toLowerCase()) {
			case "emergency repair":
				return <AlertTriangle className="w-4 h-4" />;
			case "installation":
				return <Wrench className="w-4 h-4" />;
			case "maintenance":
				return <Settings className="w-4 h-4" />;
			case "inspection":
				return <CheckSquare className="w-4 h-4" />;
			default:
				return <FileText className="w-4 h-4" />;
		}
	};

	const isOverdue = (scheduledTime, status) => {
		return isPast(new Date(scheduledTime)) && status === "scheduled";
	};

	const formatDuration = (minutes) => {
		if (!minutes) return "N/A";
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	};

	// Bulk actions
	const handleSelectAll = (checked) => {
		if (checked) {
			setSelectedJobs(filteredAndSortedJobs.map((job) => job.id));
		} else {
			setSelectedJobs([]);
		}
	};

	const handleSelectJob = (jobId, checked) => {
		if (checked) {
			setSelectedJobs((prev) => [...prev, jobId]);
		} else {
			setSelectedJobs((prev) => prev.filter((id) => id !== jobId));
		}
	};

	const handleBulkStatusUpdate = (newStatus) => {
		// Implementation for bulk status updates
		console.log(`Updating ${selectedJobs.length} jobs to status: ${newStatus}`);
		setSelectedJobs([]);
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Business Header Component */}
			<Header />

			<div className="p-6">
				<div className="max-w-7xl mx-auto space-y-6">
					{/* Jobs Header */}
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="space-y-1">
							<h1 className="text-3xl font-bold tracking-tight">Jobs & Work Orders</h1>
							<p className="text-muted-foreground">Manage all field service jobs and track progress across your operations</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
								<Filter className="w-4 h-4 mr-2" />
								{showFilters ? "Hide Filters" : "Show Filters"}
							</Button>
							<Button variant="outline" size="sm">
								<Download className="w-4 h-4 mr-2" />
								Export
							</Button>
							<Button variant="outline" size="sm">
								<RefreshCw className="w-4 h-4 mr-2" />
								Refresh
							</Button>
							<Button size="sm">
								<Plus className="w-4 h-4 mr-2" />
								Create Job
							</Button>
						</div>
					</div>

					{/* Job Statistics */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
										<p className="text-2xl font-bold">{mockStats.total_jobs}</p>
									</div>
									<FileText className="w-8 h-8 text-blue-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Scheduled</p>
										<p className="text-2xl font-bold text-blue-600">{mockStats.scheduled_jobs}</p>
									</div>
									<Calendar className="w-8 h-8 text-blue-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">In Progress</p>
										<p className="text-2xl font-bold text-yellow-600">{mockStats.in_progress_jobs}</p>
									</div>
									<Activity className="w-8 h-8 text-yellow-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Completed</p>
										<p className="text-2xl font-bold text-green-600">{mockStats.completed_jobs}</p>
									</div>
									<CheckCircle className="w-8 h-8 text-green-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Overdue</p>
										<p className="text-2xl font-bold text-red-600">{mockStats.overdue_jobs}</p>
									</div>
									<AlertTriangle className="w-8 h-8 text-red-600" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Revenue</p>
										<p className="text-2xl font-bold text-green-600">${mockStats.total_revenue?.toLocaleString()}</p>
									</div>
									<DollarSign className="w-8 h-8 text-green-600" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Search and Filters */}
					<Card>
						<CardContent className="p-4">
							<div className="flex flex-col gap-4">
								{/* Search Bar */}
								<div className="flex gap-4">
									<div className="relative flex-1">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
										<Input placeholder="Search jobs by customer, service type, job number, or address..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
									</div>
									<Button
										variant="outline"
										onClick={() => {
											setSearchTerm("");
											setSelectedStatus("all");
											setSelectedPriority("all");
											setSelectedTechnician("all");
											setSelectedJobType("all");
											setDateFilter("all");
										}}
									>
										Clear All
									</Button>
								</div>

								{/* Filters */}
								{showFilters && (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
										<Select value={selectedStatus} onValueChange={setSelectedStatus}>
											<SelectTrigger>
												<SelectValue placeholder="Status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Status</SelectItem>
												<SelectItem value="scheduled">Scheduled</SelectItem>
												<SelectItem value="in_progress">In Progress</SelectItem>
												<SelectItem value="completed">Completed</SelectItem>
												<SelectItem value="cancelled">Cancelled</SelectItem>
												<SelectItem value="pending_approval">Pending Approval</SelectItem>
											</SelectContent>
										</Select>

										<Select value={selectedPriority} onValueChange={setSelectedPriority}>
											<SelectTrigger>
												<SelectValue placeholder="Priority" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Priority</SelectItem>
												<SelectItem value="urgent">Urgent</SelectItem>
												<SelectItem value="high">High</SelectItem>
												<SelectItem value="normal">Normal</SelectItem>
												<SelectItem value="low">Low</SelectItem>
											</SelectContent>
										</Select>

										<Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
											<SelectTrigger>
												<SelectValue placeholder="Technician" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Technicians</SelectItem>
												<SelectItem value="tech_001">Mike Wilson</SelectItem>
												<SelectItem value="tech_002">David Brown</SelectItem>
												<SelectItem value="tech_003">Lisa Chen</SelectItem>
												<SelectItem value="tech_004">Tom Garcia</SelectItem>
												<SelectItem value={null}>Unassigned</SelectItem>
											</SelectContent>
										</Select>

										<Select value={selectedJobType} onValueChange={setSelectedJobType}>
											<SelectTrigger>
												<SelectValue placeholder="Job Type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Types</SelectItem>
												<SelectItem value="Emergency Repair">Emergency Repair</SelectItem>
												<SelectItem value="Installation">Installation</SelectItem>
												<SelectItem value="Maintenance">Maintenance</SelectItem>
												<SelectItem value="Inspection">Inspection</SelectItem>
											</SelectContent>
										</Select>

										<Select value={dateFilter} onValueChange={setDateFilter}>
											<SelectTrigger>
												<SelectValue placeholder="Date Range" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Dates</SelectItem>
												<SelectItem value="today">Today</SelectItem>
												<SelectItem value="this_week">This Week</SelectItem>
												<SelectItem value="overdue">Overdue</SelectItem>
												<SelectItem value="upcoming">Upcoming</SelectItem>
											</SelectContent>
										</Select>

										<Select
											value={`${sortBy}-${sortOrder}`}
											onValueChange={(value) => {
												const [field, order] = value.split("-");
												setSortBy(field);
												setSortOrder(order);
											}}
										>
											<SelectTrigger>
												<SelectValue placeholder="Sort By" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="created_at-desc">Newest First</SelectItem>
												<SelectItem value="created_at-asc">Oldest First</SelectItem>
												<SelectItem value="scheduled_time-asc">Schedule: Earliest</SelectItem>
												<SelectItem value="scheduled_time-desc">Schedule: Latest</SelectItem>
												<SelectItem value="priority-desc">Priority: High to Low</SelectItem>
												<SelectItem value="customer_name-asc">Customer: A-Z</SelectItem>
												<SelectItem value="estimated_price-desc">Price: High to Low</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Bulk Actions */}
					{selectedJobs.length > 0 && (
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<span className="font-medium">{selectedJobs.length} job(s) selected</span>
										<Button variant="outline" size="sm" onClick={() => setSelectedJobs([])}>
											Clear Selection
										</Button>
									</div>
									<div className="flex gap-2">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="outline" size="sm">
													Bulk Actions
													<ChevronDown className="w-4 h-4 ml-2" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuLabel>Update Status</DropdownMenuLabel>
												<DropdownMenuItem onClick={() => handleBulkStatusUpdate("scheduled")}>Mark as Scheduled</DropdownMenuItem>
												<DropdownMenuItem onClick={() => handleBulkStatusUpdate("in_progress")}>Mark as In Progress</DropdownMenuItem>
												<DropdownMenuItem onClick={() => handleBulkStatusUpdate("completed")}>Mark as Completed</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuLabel>Other Actions</DropdownMenuLabel>
												<DropdownMenuItem>
													<Mail className="w-4 h-4 mr-2" />
													Send Email Updates
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Download className="w-4 h-4 mr-2" />
													Export Selected
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className="text-red-600">
													<Trash2 className="w-4 h-4 mr-2" />
													Delete Selected
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Jobs List */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<FileText className="w-5 h-5" />
									Jobs List ({filteredAndSortedJobs.length} of {jobs.length})
								</CardTitle>
								<div className="flex items-center gap-2">
									<Checkbox checked={selectedJobs.length === filteredAndSortedJobs.length && filteredAndSortedJobs.length > 0} onCheckedChange={handleSelectAll} />
									<span className="text-sm text-muted-foreground">Select All</span>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y">
								{filteredAndSortedJobs.map((job) => (
									<div key={job.id} className={`p-6 hover:bg-muted/50 transition-colors ${isOverdue(job.scheduled_time, job.status) ? "bg-red-50 dark:bg-red-950/10" : ""}`}>
										<div className="flex items-start gap-4">
											{/* Selection Checkbox */}
											<Checkbox checked={selectedJobs.includes(job.id)} onCheckedChange={(checked) => handleSelectJob(job.id, checked)} className="mt-1" />

											{/* Job Content */}
											<div className="flex-1">
												<div className="flex items-start justify-between">
													<div className="flex-1 space-y-3">
														{/* Job Header */}
														<div className="flex items-center gap-3 flex-wrap">
															<h3 className="font-semibold text-lg">{job.customer_name}</h3>
															<Badge className={getStatusColor(job.status)}>{job.status.replace("_", " ")}</Badge>
															<Badge variant="outline" className={getPriorityColor(job.priority)}>
																{job.priority} priority
															</Badge>
															{isOverdue(job.scheduled_time, job.status) && (
																<Badge variant="destructive" className="animate-pulse">
																	<AlertTriangle className="w-3 h-3 mr-1" />
																	OVERDUE
																</Badge>
															)}
															<span className="text-xs text-muted-foreground">#{job.job_number}</span>
														</div>

														{/* Service Details */}
														<div className="flex items-center gap-2">
															{getJobTypeIcon(job.job_type)}
															<p className="text-muted-foreground">{job.service_type}</p>
															{job.tags && job.tags.length > 0 && (
																<div className="flex gap-1">
																	{job.tags.slice(0, 2).map((tag) => (
																		<Badge key={tag} variant="secondary" className="text-xs">
																			<Tag className="w-3 h-3 mr-1" />
																			{tag}
																		</Badge>
																	))}
																</div>
															)}
														</div>

														{/* Job Description */}
														<p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

														{/* Job Information Grid */}
														<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
															<div className="flex items-center gap-2 text-muted-foreground">
																<Calendar className="w-4 h-4" />
																<div>
																	<p className="font-medium">Scheduled</p>
																	<p>{format(new Date(job.scheduled_time), "MMM d, h:mm a")}</p>
																</div>
															</div>

															<div className="flex items-center gap-2 text-muted-foreground">
																<MapPin className="w-4 h-4" />
																<div>
																	<p className="font-medium">Location</p>
																	<p className="truncate">{job.address}</p>
																</div>
															</div>

															<div className="flex items-center gap-2 text-muted-foreground">
																<User className="w-4 h-4" />
																<div>
																	<p className="font-medium">Technician</p>
																	<p>{job.technician_name || "Unassigned"}</p>
																</div>
															</div>

															<div className="flex items-center gap-2 text-muted-foreground">
																<PhoneIcon className="w-4 h-4" />
																<div>
																	<p className="font-medium">Contact</p>
																	<p>{job.customer_phone}</p>
																</div>
															</div>
														</div>

														{/* Job Progress Indicators */}
														<div className="flex items-center gap-6 text-xs text-muted-foreground">
															<div className="flex items-center gap-1">
																<Timer className="w-3 h-3" />
																<span>Duration: {formatDuration(job.estimated_duration)}</span>
															</div>
															{job.attachments > 0 && (
																<div className="flex items-center gap-1">
																	<Paperclip className="w-3 h-3" />
																	<span>{job.attachments} files</span>
																</div>
															)}
															{job.parts_used > 0 && (
																<div className="flex items-center gap-1">
																	<Wrench className="w-3 h-3" />
																	<span>{job.parts_used} parts used</span>
																</div>
															)}
															{job.checklist_completed && (
																<div className="flex items-center gap-1 text-green-600">
																	<CheckSquare className="w-3 h-3" />
																	<span>Checklist complete</span>
																</div>
															)}
															{job.customer_rating && (
																<div className="flex items-center gap-1 text-yellow-600">
																	<Star className="w-3 h-3 fill-current" />
																	<span>{job.customer_rating}/5</span>
																</div>
															)}
														</div>
													</div>

													{/* Job Actions & Pricing */}
													<div className="text-right ml-6 space-y-2">
														<div>
															<p className="font-bold text-2xl text-green-600">${(job.final_price || job.estimated_price)?.toLocaleString()}</p>
															<p className="text-xs text-muted-foreground">{job.final_price ? "Final" : "Estimated"}</p>
															{job.payment_status && (
																<Badge variant={job.payment_status === "paid" ? "default" : "secondary"} className="text-xs">
																	{job.payment_status}
																</Badge>
															)}
														</div>

														<div className="flex gap-2">
															<Button size="sm" variant="outline">
																<Eye className="w-4 h-4 mr-1" />
																View
															</Button>
															<Button size="sm" variant="outline">
																<Edit className="w-4 h-4 mr-1" />
																Edit
															</Button>
															<DropdownMenu>
																<DropdownMenuTrigger asChild>
																	<Button size="sm" variant="outline">
																		<MoreHorizontal className="w-4 h-4" />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end">
																	<DropdownMenuItem>
																		<Navigation className="w-4 h-4 mr-2" />
																		Get Directions
																	</DropdownMenuItem>
																	<DropdownMenuItem>
																		<PhoneIcon className="w-4 h-4 mr-2" />
																		Call Customer
																	</DropdownMenuItem>
																	<DropdownMenuItem>
																		<Mail className="w-4 h-4 mr-2" />
																		Send Email
																	</DropdownMenuItem>
																	<DropdownMenuItem>
																		<MessageSquare className="w-4 h-4 mr-2" />
																		Add Note
																	</DropdownMenuItem>
																	<DropdownMenuSeparator />
																	<DropdownMenuItem>
																		<FileText className="w-4 h-4 mr-2" />
																		Generate Invoice
																	</DropdownMenuItem>
																	<DropdownMenuItem>
																		<Camera className="w-4 h-4 mr-2" />
																		Add Photos
																	</DropdownMenuItem>
																	<DropdownMenuSeparator />
																	<DropdownMenuItem className="text-red-600">
																		<X className="w-4 h-4 mr-2" />
																		Cancel Job
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}

								{filteredAndSortedJobs.length === 0 && (
									<div className="text-center py-12">
										<FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
										<h3 className="text-lg font-semibold mb-2">No jobs found</h3>
										<p className="text-muted-foreground mb-4">{searchTerm || selectedStatus !== "all" || selectedPriority !== "all" ? "Try adjusting your filters or search terms" : "Create your first job to get started"}</p>
										<Button>
											<Plus className="w-4 h-4 mr-2" />
											Create Job
										</Button>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
