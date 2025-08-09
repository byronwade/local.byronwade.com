"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Separator } from "@components/ui/separator";
import { Progress } from "@components/ui/progress";
import { Calendar, Clock, MapPin, Phone, Mail, Car, CheckCircle, AlertCircle, Edit3, Save, X, Plus, Trash2, Share2, Download, MessageSquare, Camera, Eye, ExternalLink } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";

// Mock job data - in real app this would come from API based on job ID
const mockJobData = {
	id: "JOB001",
	title: "HVAC System Maintenance",
	description: "Quarterly HVAC system maintenance including filter replacement, coil cleaning, and system inspection",
	status: "in_progress",
	priority: "high",
	serviceType: "Maintenance",

	// Customer Information
	customer: {
		id: "CUST001",
		name: "TechCorp Inc.",
		email: "facilities@techcorp.com",
		phone: "(555) 111-2222",
		address: "123 Business Ave, Downtown, CA 90210",
		contactPerson: "Jane Smith",
		accountType: "commercial",
		preferredPayment: "net_30",
	},

	// Scheduling
	scheduledStart: "2024-01-15T09:00:00Z",
	scheduledEnd: "2024-01-15T12:00:00Z",
	actualStart: "2024-01-15T09:15:00Z",
	actualEnd: null,
	estimatedDuration: 180, // minutes

	// Assignment
	technician: {
		id: "T001",
		name: "Mike Johnson",
		phone: "(555) 123-4567",
		email: "mike@company.com",
		skills: ["HVAC", "Electrical"],
		vehicle: "Van #3",
		certifications: ["EPA 608", "NATE Certified"],
	},

	// Pricing
	pricing: {
		laborRate: 85,
		estimatedHours: 3,
		estimatedTotal: 350,
		actualTotal: null,
		parts: [
			{ id: "P001", name: "HVAC Filter 20x25x1", quantity: 2, unitPrice: 15.99, total: 31.98 },
			{ id: "P002", name: "Coil Cleaner", quantity: 1, unitPrice: 24.5, total: 24.5 },
		],
		labor: {
			hours: 2.5,
			rate: 85,
			total: 212.5,
		},
		tax: 26.9,
		total: 295.88,
	},

	// Progress Tracking
	progress: {
		percentage: 65,
		stage: "Service Execution",
		checklist: {
			id: "CL001",
			name: "HVAC Maintenance Checklist",
			completed: 5,
			total: 8,
			categories: [
				{
					name: "Pre-Service Inspection",
					items: [
						{ id: "1", text: "Photograph existing equipment condition", completed: true, required: true },
						{ id: "2", text: "Check system operation before service", completed: true, required: true },
						{ id: "3", text: "Verify customer requirements", completed: true, required: false },
					],
				},
				{
					name: "Service Tasks",
					items: [
						{ id: "4", text: "Replace air filters", completed: true, required: true },
						{ id: "5", text: "Clean evaporator coils", completed: true, required: true },
						{ id: "6", text: "Check refrigerant levels", completed: false, required: true },
						{ id: "7", text: "Inspect electrical connections", completed: false, required: true },
						{ id: "8", text: "Lubricate moving parts", completed: false, required: false },
					],
				},
			],
		},
	},

	// Documentation
	photos: [
		{
			id: "P001",
			url: "/api/placeholder/300/200",
			caption: "HVAC unit before maintenance",
			timestamp: "2024-01-15T09:15:00Z",
			category: "before",
			location: "Roof access",
		},
		{
			id: "P002",
			url: "/api/placeholder/300/200",
			caption: "Filter replacement in progress",
			timestamp: "2024-01-15T10:30:00Z",
			category: "during",
			location: "Mechanical room",
		},
	],

	// Communication
	notes: [
		{
			id: "N001",
			author: "Mike Johnson",
			timestamp: "2024-01-15T09:30:00Z",
			content: "Customer requested additional inspection of ductwork. Adding 30 minutes to job.",
			type: "technician",
		},
		{
			id: "N002",
			author: "System",
			timestamp: "2024-01-15T10:00:00Z",
			content: "Filter replacement completed. Old filter was significantly dirty - recommended quarterly changes.",
			type: "system",
		},
	],

	// History
	history: [
		{
			id: "H001",
			timestamp: "2024-01-15T09:15:00Z",
			action: "Job Started",
			user: "Mike Johnson",
			details: "Technician arrived on site and began work",
		},
		{
			id: "H002",
			timestamp: "2024-01-15T09:30:00Z",
			action: "Scope Updated",
			user: "Mike Johnson",
			details: "Added ductwork inspection per customer request",
		},
		{
			id: "H003",
			timestamp: "2024-01-15T10:30:00Z",
			action: "Photos Added",
			user: "Mike Johnson",
			details: "Uploaded 2 progress photos",
		},
	],

	// Equipment
	equipment: [
		{
			id: "E001",
			name: "Trane XR13 Heat Pump",
			model: "XR13-024-230",
			serialNumber: "TR2024-156789",
			lastService: "2023-10-15",
			warrantyExpires: "2025-06-30",
		},
	],

	// Recurring Information
	recurring: {
		isRecurring: true,
		frequency: "quarterly",
		nextScheduled: "2024-04-15T09:00:00Z",
		contractNumber: "MAINT-2024-001",
	},
};

export default function JobDetails() {
	const searchParams = useSearchParams();
	const jobId = searchParams.get("id");

	const [job, setJob] = useState(mockJobData);
	const [activeTab, setActiveTab] = useState("overview");
	const [isEditing, setIsEditing] = useState(false);
	const [editedJob, setEditedJob] = useState(job);
	const [newNote, setNewNote] = useState("");

	useEffect(() => {
		// In real app, fetch job data based on jobId
		if (jobId) {
			// fetchJobData(jobId);
		}
	}, [jobId]);

	const getStatusColor = (status) => {
		switch (status) {
			case "completed":
				return "bg-green-500";
			case "in_progress":
				return "bg-blue-500";
			case "scheduled":
				return "bg-orange-500";
			case "cancelled":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "urgent":
				return "border-red-500 bg-red-50";
			case "high":
				return "border-orange-500 bg-orange-50";
			case "medium":
				return "border-yellow-500 bg-yellow-50";
			case "low":
				return "border-green-500 bg-green-50";
			default:
				return "border-gray-300 bg-white";
		}
	};

	const formatDuration = (minutes) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	};

	const calculateJobDuration = () => {
		if (!job.actualStart) return 0;
		const start = parseISO(job.actualStart);
		const end = job.actualEnd ? parseISO(job.actualEnd) : new Date();
		return differenceInMinutes(end, start);
	};

	const handleSaveEdit = () => {
		setJob(editedJob);
		setIsEditing(false);
		// In real app, save to API
	};

	const handleCancelEdit = () => {
		setEditedJob(job);
		setIsEditing(false);
	};

	const handleAddNote = () => {
		if (!newNote.trim()) return;

		const note = {
			id: `N${Date.now()}`,
			author: "Current User", // Would be from auth context
			timestamp: new Date().toISOString(),
			content: newNote,
			type: "user",
		};

		setJob((prev) => ({
			...prev,
			notes: [note, ...prev.notes],
		}));

		setNewNote("");
	};

	const toggleChecklistItem = (categoryIndex, itemIndex) => {
		setJob((prev) => {
			const updated = { ...prev };
			updated.progress.checklist.categories[categoryIndex].items[itemIndex].completed = !updated.progress.checklist.categories[categoryIndex].items[itemIndex].completed;

			// Recalculate completion
			const allItems = updated.progress.checklist.categories.flatMap((cat) => cat.items);
			const completedItems = allItems.filter((item) => item.completed);
			updated.progress.checklist.completed = completedItems.length;
			updated.progress.percentage = Math.round((completedItems.length / allItems.length) * 100);

			return updated;
		});
	};

	const handleStatusChange = (newStatus) => {
		setJob((prev) => ({ ...prev, status: newStatus }));
		// In real app, update via API
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-start">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<h1 className="text-3xl font-bold">{job.title}</h1>
						<Badge className={getStatusColor(job.status)} variant="secondary">
							{job.status.replace("_", " ")}
						</Badge>
						<Badge variant="outline" className={getPriorityColor(job.priority).replace("bg-", "border-").replace("-50", "-500")}>
							{job.priority} priority
						</Badge>
					</div>
					<p className="text-muted-foreground">
						Job #{job.id} • {job.customer.name} • {format(parseISO(job.scheduledStart), "MMM d, yyyy")}
					</p>
				</div>

				<div className="flex gap-2">
					<Button variant="outline" size="sm">
						<Share2 className="w-4 h-4 mr-2" />
						Share
					</Button>
					<Button variant="outline" size="sm">
						<Download className="w-4 h-4 mr-2" />
						Export
					</Button>
					{isEditing ? (
						<>
							<Button size="sm" onClick={handleSaveEdit}>
								<Save className="w-4 h-4 mr-2" />
								Save
							</Button>
							<Button size="sm" variant="outline" onClick={handleCancelEdit}>
								<X className="w-4 h-4 mr-2" />
								Cancel
							</Button>
						</>
					) : (
						<Button size="sm" onClick={() => setIsEditing(true)}>
							<Edit3 className="w-4 h-4 mr-2" />
							Edit
						</Button>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="flex gap-2">
				{job.status === "scheduled" && (
					<Button size="sm" onClick={() => handleStatusChange("in_progress")}>
						Start Job
					</Button>
				)}
				{job.status === "in_progress" && (
					<Button size="sm" onClick={() => handleStatusChange("completed")}>
						Complete Job
					</Button>
				)}
				<Button size="sm" variant="outline">
					<Phone className="w-4 h-4 mr-2" />
					Call Customer
				</Button>
				<Button size="sm" variant="outline">
					<MessageSquare className="w-4 h-4 mr-2" />
					Send Message
				</Button>
				<Button size="sm" variant="outline">
					<Camera className="w-4 h-4 mr-2" />
					Take Photo
				</Button>
			</div>

			{/* Main Content */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-6">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="checklist">Checklist</TabsTrigger>
					<TabsTrigger value="photos">Photos</TabsTrigger>
					<TabsTrigger value="pricing">Pricing</TabsTrigger>
					<TabsTrigger value="notes">Notes</TabsTrigger>
					<TabsTrigger value="history">History</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Job Information */}
						<div className="lg:col-span-2 space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Job Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{isEditing ? (
										<div className="space-y-4">
											<div>
												<Label htmlFor="title">Job Title</Label>
												<Input id="title" value={editedJob.title} onChange={(e) => setEditedJob((prev) => ({ ...prev, title: e.target.value }))} />
											</div>
											<div>
												<Label htmlFor="description">Description</Label>
												<Textarea id="description" value={editedJob.description} onChange={(e) => setEditedJob((prev) => ({ ...prev, description: e.target.value }))} />
											</div>
										</div>
									) : (
										<div className="space-y-3">
											<div>
												<h4 className="font-medium">Description</h4>
												<p className="text-sm text-muted-foreground">{job.description}</p>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<h4 className="font-medium">Service Type</h4>
													<p className="text-sm text-muted-foreground">{job.serviceType}</p>
												</div>
												<div>
													<h4 className="font-medium">Estimated Duration</h4>
													<p className="text-sm text-muted-foreground">{formatDuration(job.estimatedDuration)}</p>
												</div>
											</div>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Schedule Information */}
							<Card>
								<CardHeader>
									<CardTitle>Schedule & Timing</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-3">
											<div className="flex items-center gap-2">
												<Calendar className="w-5 h-5 text-blue-500" />
												<div>
													<p className="font-medium">Scheduled Start</p>
													<p className="text-sm text-muted-foreground">{format(parseISO(job.scheduledStart), "MMM d, yyyy 'at' HH:mm")}</p>
												</div>
											</div>

											<div className="flex items-center gap-2">
												<Clock className="w-5 h-5 text-green-500" />
												<div>
													<p className="font-medium">Scheduled End</p>
													<p className="text-sm text-muted-foreground">{format(parseISO(job.scheduledEnd), "MMM d, yyyy 'at' HH:mm")}</p>
												</div>
											</div>
										</div>

										<div className="space-y-3">
											{job.actualStart && (
												<div className="flex items-center gap-2">
													<CheckCircle className="w-5 h-5 text-green-500" />
													<div>
														<p className="font-medium">Actual Start</p>
														<p className="text-sm text-muted-foreground">{format(parseISO(job.actualStart), "MMM d, yyyy 'at' HH:mm")}</p>
													</div>
												</div>
											)}

											{job.actualEnd ? (
												<div className="flex items-center gap-2">
													<CheckCircle className="w-5 h-5 text-green-500" />
													<div>
														<p className="font-medium">Actual End</p>
														<p className="text-sm text-muted-foreground">{format(parseISO(job.actualEnd), "MMM d, yyyy 'at' HH:mm")}</p>
													</div>
												</div>
											) : (
												job.actualStart && (
													<div className="flex items-center gap-2">
														<Clock className="w-5 h-5 text-blue-500" />
														<div>
															<p className="font-medium">Duration So Far</p>
															<p className="text-sm text-muted-foreground">{formatDuration(calculateJobDuration())}</p>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Progress Tracking */}
							<Card>
								<CardHeader>
									<CardTitle>Progress Tracking</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<div className="flex justify-between items-center mb-2">
											<span className="font-medium">Overall Progress</span>
											<span className="text-sm text-muted-foreground">{job.progress.percentage}%</span>
										</div>
										<Progress value={job.progress.percentage} className="h-2" />
										<p className="text-sm text-muted-foreground mt-1">Current Stage: {job.progress.stage}</p>
									</div>

									<div>
										<div className="flex justify-between items-center mb-2">
											<span className="font-medium">Checklist</span>
											<span className="text-sm text-muted-foreground">
												{job.progress.checklist.completed} / {job.progress.checklist.total} completed
											</span>
										</div>
										<Progress value={(job.progress.checklist.completed / job.progress.checklist.total) * 100} className="h-2" />
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Customer Information */}
							<Card>
								<CardHeader>
									<CardTitle>Customer Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<h4 className="font-medium">{job.customer.name}</h4>
										<p className="text-sm text-muted-foreground">{job.customer.contactPerson}</p>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Phone className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm">{job.customer.phone}</span>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm">{job.customer.email}</span>
										</div>
										<div className="flex items-center gap-2">
											<MapPin className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm">{job.customer.address}</span>
										</div>
									</div>

									<div className="flex gap-2">
										<Button size="sm" variant="outline" className="flex-1">
											<Phone className="w-4 h-4 mr-2" />
											Call
										</Button>
										<Button size="sm" variant="outline" className="flex-1">
											<ExternalLink className="w-4 h-4 mr-2" />
											View
										</Button>
									</div>
								</CardContent>
							</Card>

							{/* Assigned Technician */}
							<Card>
								<CardHeader>
									<CardTitle>Assigned Technician</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<h4 className="font-medium">{job.technician.name}</h4>
										<p className="text-sm text-muted-foreground">{job.technician.skills.join(", ")}</p>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Phone className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm">{job.technician.phone}</span>
										</div>
										<div className="flex items-center gap-2">
											<Car className="w-4 h-4 text-muted-foreground" />
											<span className="text-sm">{job.technician.vehicle}</span>
										</div>
									</div>

									<div className="space-y-1">
										<h5 className="text-sm font-medium">Certifications</h5>
										{job.technician.certifications.map((cert, index) => (
											<Badge key={index} variant="outline" className="text-xs">
												{cert}
											</Badge>
										))}
									</div>

									<Button size="sm" variant="outline" className="w-full">
										<Phone className="w-4 h-4 mr-2" />
										Contact Technician
									</Button>
								</CardContent>
							</Card>

							{/* Equipment */}
							{job.equipment.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle>Equipment</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{job.equipment.map((equipment) => (
											<div key={equipment.id} className="space-y-2">
												<h4 className="font-medium text-sm">{equipment.name}</h4>
												<div className="text-xs text-muted-foreground space-y-1">
													<p>Model: {equipment.model}</p>
													<p>Serial: {equipment.serialNumber}</p>
													<p>Last Service: {format(parseISO(equipment.lastService), "MMM d, yyyy")}</p>
													<p>Warranty: {format(parseISO(equipment.warrantyExpires), "MMM d, yyyy")}</p>
												</div>
											</div>
										))}
									</CardContent>
								</Card>
							)}

							{/* Recurring Information */}
							{job.recurring.isRecurring && (
								<Card>
									<CardHeader>
										<CardTitle>Recurring Service</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<div>
											<h5 className="text-sm font-medium">Frequency</h5>
											<p className="text-sm text-muted-foreground capitalize">{job.recurring.frequency}</p>
										</div>
										<div>
											<h5 className="text-sm font-medium">Next Scheduled</h5>
											<p className="text-sm text-muted-foreground">{format(parseISO(job.recurring.nextScheduled), "MMM d, yyyy")}</p>
										</div>
										<div>
											<h5 className="text-sm font-medium">Contract</h5>
											<p className="text-sm text-muted-foreground">{job.recurring.contractNumber}</p>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</TabsContent>

				{/* Checklist Tab */}
				<TabsContent value="checklist" className="space-y-6">
					<Card>
						<CardHeader>
							<div className="flex justify-between items-center">
								<div>
									<CardTitle>{job.progress.checklist.name}</CardTitle>
									<CardDescription>
										{job.progress.checklist.completed} of {job.progress.checklist.total} items completed
									</CardDescription>
								</div>
								<Progress value={(job.progress.checklist.completed / job.progress.checklist.total) * 100} className="w-32" />
							</div>
						</CardHeader>

						<CardContent className="space-y-6">
							{job.progress.checklist.categories.map((category, categoryIndex) => (
								<div key={category.name} className="space-y-3">
									<h3 className="font-medium text-lg">{category.name}</h3>

									<div className="space-y-2 pl-4 border-l-2 border-gray-200">
										{category.items.map((item, itemIndex) => (
											<div key={item.id} className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${item.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-gray-300"}`} onClick={() => toggleChecklistItem(categoryIndex, itemIndex)}>
												<div className="flex-shrink-0">{item.completed ? <CheckCircle className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />}</div>

												<div className="flex-1">
													<p className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>{item.text}</p>
													{item.required && (
														<Badge variant="outline" className="text-xs mt-1">
															Required
														</Badge>
													)}
												</div>

												{item.required && !item.completed && <AlertCircle className="w-5 h-5 text-orange-500" />}
											</div>
										))}
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Photos Tab */}
				<TabsContent value="photos" className="space-y-6">
					<Card>
						<CardHeader>
							<div className="flex justify-between items-center">
								<div>
									<CardTitle>Job Photos</CardTitle>
									<CardDescription>{job.photos.length} photos uploaded</CardDescription>
								</div>
								<Button>
									<Camera className="w-4 h-4 mr-2" />
									Add Photo
								</Button>
							</div>
						</CardHeader>

						<CardContent>
							{job.photos.length === 0 ? (
								<div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
									<Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
									<h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
									<p className="text-gray-500 mb-4">Document this job by taking before, during, and after photos</p>
									<Button>
										<Camera className="w-4 h-4 mr-2" />
										Take First Photo
									</Button>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{job.photos.map((photo) => (
										<div key={photo.id} className="group relative bg-white rounded-lg border overflow-hidden">
											<div className="aspect-video relative">
												<img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
												<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
												<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
													<div className="flex gap-1">
														<Button size="sm" variant="secondary">
															<Eye className="w-3 h-3" />
														</Button>
														<Button size="sm" variant="secondary">
															<Download className="w-3 h-3" />
														</Button>
														<Button size="sm" variant="secondary">
															<Trash2 className="w-3 h-3" />
														</Button>
													</div>
												</div>
											</div>

											<div className="p-3">
												<div className="flex items-center justify-between mb-2">
													<Badge variant="outline" className={photo.category === "before" ? "border-orange-500 text-orange-700" : photo.category === "during" ? "border-blue-500 text-blue-700" : photo.category === "after" ? "border-green-500 text-green-700" : "border-gray-500 text-gray-700"}>
														{photo.category}
													</Badge>
													<span className="text-xs text-muted-foreground">{format(parseISO(photo.timestamp), "HH:mm")}</span>
												</div>

												<p className="text-sm font-medium mb-1">{photo.caption}</p>
												<p className="text-xs text-muted-foreground flex items-center gap-1">
													<MapPin className="w-3 h-3" />
													{photo.location}
												</p>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Pricing Tab */}
				<TabsContent value="pricing" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Job Pricing</CardTitle>
							<CardDescription>Estimated total: ${job.pricing.estimatedTotal.toFixed(2)}</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							{/* Labor */}
							<div>
								<h3 className="font-medium mb-3">Labor</h3>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span>Rate per hour</span>
										<span>${job.pricing.laborRate.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span>Hours worked</span>
										<span>{job.pricing.labor.hours}h</span>
									</div>
									<div className="flex justify-between font-medium">
										<span>Labor subtotal</span>
										<span>${job.pricing.labor.total.toFixed(2)}</span>
									</div>
								</div>
							</div>

							<Separator />

							{/* Parts */}
							<div>
								<h3 className="font-medium mb-3">Parts & Materials</h3>
								<div className="space-y-2">
									{job.pricing.parts.map((part) => (
										<div key={part.id} className="flex justify-between items-center">
											<div className="flex-1">
												<p className="font-medium">{part.name}</p>
												<p className="text-sm text-muted-foreground">
													{part.quantity} × ${part.unitPrice.toFixed(2)}
												</p>
											</div>
											<span className="font-medium">${part.total.toFixed(2)}</span>
										</div>
									))}
									<div className="flex justify-between font-medium pt-2 border-t">
										<span>Parts subtotal</span>
										<span>${job.pricing.parts.reduce((sum, part) => sum + part.total, 0).toFixed(2)}</span>
									</div>
								</div>
							</div>

							<Separator />

							{/* Total */}
							<div className="space-y-2">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<span>${(job.pricing.labor.total + job.pricing.parts.reduce((sum, part) => sum + part.total, 0)).toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span>Tax</span>
									<span>${job.pricing.tax.toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-lg font-bold">
									<span>Total</span>
									<span>${job.pricing.total.toFixed(2)}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Notes Tab */}
				<TabsContent value="notes" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Job Notes</CardTitle>
							<CardDescription>Communication and updates for this job</CardDescription>
						</CardHeader>

						<CardContent className="space-y-4">
							{/* Add Note */}
							<div className="space-y-2">
								<Textarea placeholder="Add a note about this job..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
								<Button onClick={handleAddNote} disabled={!newNote.trim()}>
									<Plus className="w-4 h-4 mr-2" />
									Add Note
								</Button>
							</div>

							<Separator />

							{/* Notes List */}
							<div className="space-y-3">
								{job.notes.map((note) => (
									<div key={note.id} className="p-3 border rounded-lg">
										<div className="flex justify-between items-start mb-2">
											<div className="flex items-center gap-2">
												<span className="font-medium">{note.author}</span>
												<Badge variant="outline" className="text-xs">
													{note.type}
												</Badge>
											</div>
											<span className="text-xs text-muted-foreground">{format(parseISO(note.timestamp), "MMM d, HH:mm")}</span>
										</div>
										<p className="text-sm">{note.content}</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* History Tab */}
				<TabsContent value="history" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Job History</CardTitle>
							<CardDescription>Complete timeline of job activities and changes</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="space-y-4">
								{job.history.map((event) => (
									<div key={event.id} className="flex gap-3">
										<div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
										<div className="flex-1">
											<div className="flex justify-between items-start">
												<div>
													<p className="font-medium">{event.action}</p>
													<p className="text-sm text-muted-foreground">{event.details}</p>
												</div>
												<div className="text-right">
													<p className="text-xs text-muted-foreground">{event.user}</p>
													<p className="text-xs text-muted-foreground">{format(parseISO(event.timestamp), "MMM d, HH:mm")}</p>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
