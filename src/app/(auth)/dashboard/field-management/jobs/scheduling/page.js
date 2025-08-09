"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Calendar } from "@components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Progress } from "@components/ui/progress";
import { Calendar as CalendarIcon, Clock, MapPin, User, Plus, Filter, Search, MoreHorizontal, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";

// Mock data for jobs and technicians
const mockTechnicians = [
	{
		id: "T001",
		name: "Mike Johnson",
		skills: ["HVAC", "Electrical"],
		phone: "(555) 123-4567",
		email: "mike@company.com",
		status: "available",
		currentLocation: "Downtown Area",
		vehicle: "Van #3",
		todayJobs: 3,
		capacity: 6,
	},
	{
		id: "T002",
		name: "Sarah Wilson",
		skills: ["Plumbing", "General Repair"],
		phone: "(555) 234-5678",
		email: "sarah@company.com",
		status: "on_job",
		currentLocation: "Residential District",
		vehicle: "Truck #7",
		todayJobs: 4,
		capacity: 5,
	},
	{
		id: "T003",
		name: "David Chen",
		skills: ["Electrical", "Security Systems"],
		phone: "(555) 345-6789",
		email: "david@company.com",
		status: "available",
		currentLocation: "Industrial Zone",
		vehicle: "Van #12",
		todayJobs: 2,
		capacity: 6,
	},
];

const mockJobs = [
	{
		id: "JOB001",
		title: "HVAC System Maintenance",
		customer: {
			name: "TechCorp Inc.",
			phone: "(555) 111-2222",
			email: "facilities@techcorp.com",
			address: "123 Business Ave, Downtown, CA 90210",
		},
		scheduledStart: "2024-01-15T09:00:00Z",
		scheduledEnd: "2024-01-15T12:00:00Z",
		estimatedDuration: 180, // minutes
		priority: "high",
		status: "scheduled",
		technician: mockTechnicians[0],
		serviceType: "Maintenance",
		description: "Quarterly HVAC system maintenance and filter replacement",
		requiredSkills: ["HVAC"],
		estimatedValue: 350,
		recurring: true,
		recurringType: "quarterly",
	},
	{
		id: "JOB002",
		title: "Kitchen Sink Repair",
		customer: {
			name: "Sarah Miller",
			phone: "(555) 222-3333",
			email: "sarah.miller@email.com",
			address: "456 Oak Street, Residential, CA 90211",
		},
		scheduledStart: "2024-01-15T14:00:00Z",
		scheduledEnd: "2024-01-15T16:00:00Z",
		estimatedDuration: 120,
		priority: "medium",
		status: "scheduled",
		technician: mockTechnicians[1],
		serviceType: "Repair",
		description: "Fix leaking kitchen sink faucet and check under-sink plumbing",
		requiredSkills: ["Plumbing"],
		estimatedValue: 150,
		recurring: false,
	},
	{
		id: "JOB003",
		title: "Emergency Electrical Repair",
		customer: {
			name: "Metro Restaurant",
			phone: "(555) 333-4444",
			email: "manager@metrorestaurant.com",
			address: "789 Main Street, Commercial, CA 90212",
		},
		scheduledStart: null,
		scheduledEnd: null,
		estimatedDuration: 90,
		priority: "urgent",
		status: "unscheduled",
		technician: null,
		serviceType: "Emergency",
		description: "Power outage in kitchen area - needs immediate attention",
		requiredSkills: ["Electrical"],
		estimatedValue: 400,
		recurring: false,
	},
];

export default function JobScheduling() {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedView, setSelectedView] = useState("week");
	const [jobs, setJobs] = useState(mockJobs);
	const [selectedJob, setSelectedJob] = useState(null);
	const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
	const [newJobDialogOpen, setNewJobDialogOpen] = useState(false);
	const [filterStatus, setFilterStatus] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	// Get week dates for calendar view
	const weekStart = startOfWeek(selectedDate);
	const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

	// Filter jobs based on search and status
	const filteredJobs = jobs.filter((job) => {
		const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = filterStatus === "all" || job.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	// Get jobs for selected date
	const getJobsForDate = (date) => {
		return filteredJobs.filter((job) => job.scheduledStart && isSameDay(parseISO(job.scheduledStart), date));
	};

	// Get unscheduled jobs
	const unscheduledJobs = filteredJobs.filter((job) => !job.scheduledStart);

	const getStatusColor = (status) => {
		switch (status) {
			case "completed":
				return "bg-green-500";
			case "in_progress":
				return "bg-blue-500";
			case "scheduled":
				return "bg-orange-500";
			case "unscheduled":
				return "bg-gray-500";
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

	const getTechnicianStatus = (technician) => {
		if (!technician) return null;
		const utilization = (technician.todayJobs / technician.capacity) * 100;
		return {
			utilization,
			status: utilization >= 100 ? "overbooked" : utilization >= 80 ? "busy" : "available",
		};
	};

	const handleScheduleJob = (job, newDateTime, technicianId) => {
		const technician = mockTechnicians.find((t) => t.id === technicianId);
		const updatedJob = {
			...job,
			scheduledStart: newDateTime,
			scheduledEnd: new Date(new Date(newDateTime).getTime() + job.estimatedDuration * 60000).toISOString(),
			technician: technician,
			status: "scheduled",
		};

		setJobs((prev) => prev.map((j) => (j.id === job.id ? updatedJob : j)));
		setScheduleDialogOpen(false);
		setSelectedJob(null);
	};

	const handleRescheduleJob = (job) => {
		setSelectedJob(job);
		setScheduleDialogOpen(true);
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Job Scheduling</h1>
					<p className="text-muted-foreground">Manage and schedule jobs for your technicians</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm">
						<Filter className="w-4 h-4 mr-2" />
						Filters
					</Button>
					<Dialog open={newJobDialogOpen} onOpenChange={setNewJobDialogOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="w-4 h-4 mr-2" />
								New Job
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle>Create New Job</DialogTitle>
								<DialogDescription>Add a new job to the scheduling system</DialogDescription>
							</DialogHeader>
							{/* New job form would go here */}
							<div className="text-center py-8 text-muted-foreground">New job creation form would be implemented here</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Filters and Search */}
			<div className="flex gap-4 items-center">
				<div className="flex-1 max-w-md">
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input placeholder="Search jobs or customers..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
					</div>
				</div>

				<Select value={filterStatus} onValueChange={setFilterStatus}>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="scheduled">Scheduled</SelectItem>
						<SelectItem value="unscheduled">Unscheduled</SelectItem>
						<SelectItem value="in_progress">In Progress</SelectItem>
						<SelectItem value="completed">Completed</SelectItem>
						<SelectItem value="cancelled">Cancelled</SelectItem>
					</SelectContent>
				</Select>

				<Tabs value={selectedView} onValueChange={setSelectedView}>
					<TabsList>
						<TabsTrigger value="week">Week</TabsTrigger>
						<TabsTrigger value="day">Day</TabsTrigger>
						<TabsTrigger value="list">List</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Main Calendar/Schedule View */}
				<div className="lg:col-span-3">
					<Card>
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle>
									{selectedView === "week" && `Week of ${format(weekStart, "MMM d, yyyy")}`}
									{selectedView === "day" && format(selectedDate, "MMMM d, yyyy")}
									{selectedView === "list" && "All Jobs"}
								</CardTitle>

								{(selectedView === "week" || selectedView === "day") && (
									<div className="flex items-center gap-2">
										<Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, selectedView === "week" ? -7 : -1))}>
											<ChevronLeft className="w-4 h-4" />
										</Button>
										<Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
											Today
										</Button>
										<Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, selectedView === "week" ? 7 : 1))}>
											<ChevronRight className="w-4 h-4" />
										</Button>
									</div>
								)}
							</div>
						</CardHeader>

						<CardContent>
							{selectedView === "week" && (
								<div className="space-y-4">
									{/* Week header */}
									<div className="grid grid-cols-7 gap-2">
										{weekDates.map((date, index) => (
											<div key={index} className={`p-3 text-center border rounded-lg cursor-pointer transition-colors ${isSameDay(date, new Date()) ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`} onClick={() => setSelectedDate(date)}>
												<div className="text-sm font-medium">{format(date, "EEE")}</div>
												<div className="text-lg">{format(date, "d")}</div>
												<div className="text-xs mt-1">{getJobsForDate(date).length} jobs</div>
											</div>
										))}
									</div>

									{/* Jobs for selected day */}
									<div className="space-y-2">
										<h4 className="font-medium">Jobs for {format(selectedDate, "MMMM d, yyyy")}</h4>
										{getJobsForDate(selectedDate).length === 0 ? <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">No jobs scheduled for this day</div> : getJobsForDate(selectedDate).map((job) => <JobCard key={job.id} job={job} onReschedule={handleRescheduleJob} />)}
									</div>
								</div>
							)}

							{selectedView === "day" && (
								<div className="space-y-4">
									{/* Time slots */}
									<div className="space-y-2">
										{Array.from({ length: 12 }, (_, i) => {
											const hour = i + 7; // Start at 7 AM
											const timeSlot = `${hour}:00`;
											const jobsInSlot = getJobsForDate(selectedDate).filter((job) => {
												const jobHour = new Date(job.scheduledStart).getHours();
												return jobHour === hour;
											});

											return (
												<div key={hour} className="flex gap-4">
													<div className="w-16 text-sm text-muted-foreground font-medium pt-2">{timeSlot}</div>
													<div className="flex-1 min-h-[60px] border rounded-lg p-2">
														{jobsInSlot.map((job) => (
															<JobCard key={job.id} job={job} compact onReschedule={handleRescheduleJob} />
														))}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							)}

							{selectedView === "list" && (
								<div className="space-y-4">
									<div className="space-y-2">
										{filteredJobs.map((job) => (
											<JobCard key={job.id} job={job} showDate onReschedule={handleRescheduleJob} />
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Unscheduled Jobs */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Unscheduled Jobs</CardTitle>
							<CardDescription>{unscheduledJobs.length} jobs need scheduling</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{unscheduledJobs.length === 0 ? (
								<div className="text-center py-4 text-muted-foreground">All jobs are scheduled</div>
							) : (
								unscheduledJobs.map((job) => (
									<div
										key={job.id}
										className={`p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors ${getPriorityColor(job.priority)}`}
										onClick={() => {
											setSelectedJob(job);
											setScheduleDialogOpen(true);
										}}
									>
										<div className="flex justify-between items-start mb-2">
											<h4 className="font-medium text-sm">{job.title}</h4>
											<Badge variant="outline" className="text-xs">
												{job.priority}
											</Badge>
										</div>
										<p className="text-xs text-muted-foreground mb-2">{job.customer.name}</p>
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											<Clock className="w-3 h-3" />
											{job.estimatedDuration} min
											<DollarSign className="w-3 h-3 ml-2" />${job.estimatedValue}
										</div>
									</div>
								))
							)}
						</CardContent>
					</Card>

					{/* Technician Status */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Technician Status</CardTitle>
							<CardDescription>Today's utilization</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{mockTechnicians.map((tech) => {
								const status = getTechnicianStatus(tech);
								return (
									<div key={tech.id} className="flex items-center justify-between p-3 border rounded-lg">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<h4 className="font-medium text-sm">{tech.name}</h4>
												<Badge variant="outline" className={status.status === "overbooked" ? "border-red-500 text-red-700" : status.status === "busy" ? "border-orange-500 text-orange-700" : "border-green-500 text-green-700"}>
													{status.status}
												</Badge>
											</div>
											<div className="text-xs text-muted-foreground mb-2">{tech.skills.join(", ")}</div>
											<div className="flex items-center gap-2">
												<Progress value={status.utilization} className="flex-1 h-2" />
												<span className="text-xs font-medium">
													{tech.todayJobs}/{tech.capacity}
												</span>
											</div>
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Schedule Job Dialog */}
			<Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{selectedJob?.scheduledStart ? "Reschedule Job" : "Schedule Job"}</DialogTitle>
						<DialogDescription>
							{selectedJob?.title} for {selectedJob?.customer.name}
						</DialogDescription>
					</DialogHeader>

					{selectedJob && <ScheduleJobForm job={selectedJob} technicians={mockTechnicians} onSchedule={handleScheduleJob} onCancel={() => setScheduleDialogOpen(false)} />}
				</DialogContent>
			</Dialog>
		</div>
	);
}

// Job Card Component
function JobCard({ job, compact = false, showDate = false, onReschedule }) {
	return (
		<div className={`p-3 rounded-lg border transition-colors hover:bg-accent/50 ${getPriorityColor(job.priority)}`}>
			<div className="flex justify-between items-start mb-2">
				<div className="flex-1">
					<h4 className="font-medium text-sm">{job.title}</h4>
					{!compact && <p className="text-xs text-muted-foreground mt-1">{job.customer.name}</p>}
				</div>
				<div className="flex items-center gap-1">
					<Badge className={getStatusColor(job.status)} variant="secondary">
						{job.status.replace("_", " ")}
					</Badge>
					<Button size="sm" variant="ghost" onClick={() => onReschedule(job)}>
						<MoreHorizontal className="w-3 h-3" />
					</Button>
				</div>
			</div>

			<div className="space-y-1 text-xs text-muted-foreground">
				{showDate && job.scheduledStart && (
					<div className="flex items-center gap-1">
						<CalendarIcon className="w-3 h-3" />
						{format(parseISO(job.scheduledStart), "MMM d, yyyy")}
					</div>
				)}

				{job.scheduledStart && (
					<div className="flex items-center gap-1">
						<Clock className="w-3 h-3" />
						{format(parseISO(job.scheduledStart), "HH:mm")} - {format(parseISO(job.scheduledEnd), "HH:mm")}
					</div>
				)}

				{job.technician && (
					<div className="flex items-center gap-1">
						<User className="w-3 h-3" />
						{job.technician.name}
					</div>
				)}

				{!compact && (
					<>
						<div className="flex items-center gap-1">
							<MapPin className="w-3 h-3" />
							{job.customer.address.split(",")[0]}
						</div>
						<div className="flex items-center gap-1">
							<DollarSign className="w-3 h-3" />${job.estimatedValue}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

// Schedule Job Form Component
function ScheduleJobForm({ job, technicians, onSchedule, onCancel }) {
	const [selectedDate, setSelectedDate] = useState(job.scheduledStart ? parseISO(job.scheduledStart) : new Date());
	const [selectedTime, setSelectedTime] = useState(job.scheduledStart ? format(parseISO(job.scheduledStart), "HH:mm") : "09:00");
	const [selectedTechnician, setSelectedTechnician] = useState(job.technician?.id || "");

	const handleSubmit = () => {
		const [hours, minutes] = selectedTime.split(":");
		const scheduledDateTime = new Date(selectedDate);
		scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

		onSchedule(job, scheduledDateTime.toISOString(), selectedTechnician);
	};

	// Filter technicians by required skills
	const availableTechnicians = technicians.filter((tech) => job.requiredSkills.some((skill) => tech.skills.includes(skill)));

	return (
		<div className="space-y-4">
			<div>
				<Label>Date</Label>
				<Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={(date) => date < new Date()} className="rounded-md border" />
			</div>

			<div>
				<Label htmlFor="time">Time</Label>
				<Input id="time" type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
			</div>

			<div>
				<Label htmlFor="technician">Assign Technician</Label>
				<Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
					<SelectTrigger>
						<SelectValue placeholder="Select technician" />
					</SelectTrigger>
					<SelectContent>
						{availableTechnicians.map((tech) => {
							const status = getTechnicianStatus(tech);
							return (
								<SelectItem key={tech.id} value={tech.id}>
									<div className="flex justify-between items-center w-full">
										<span>{tech.name}</span>
										<Badge variant="outline" className={status.status === "overbooked" ? "border-red-500 text-red-700" : status.status === "busy" ? "border-orange-500 text-orange-700" : "border-green-500 text-green-700"}>
											{tech.todayJobs}/{tech.capacity}
										</Badge>
									</div>
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</div>

			<DialogFooter>
				<Button variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} disabled={!selectedTechnician}>
					{job.scheduledStart ? "Reschedule" : "Schedule"} Job
				</Button>
			</DialogFooter>
		</div>
	);
}

function getPriorityColor(priority) {
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
}

function getStatusColor(status) {
	switch (status) {
		case "completed":
			return "bg-green-500";
		case "in_progress":
			return "bg-blue-500";
		case "scheduled":
			return "bg-orange-500";
		case "unscheduled":
			return "bg-gray-500";
		case "cancelled":
			return "bg-red-500";
		default:
			return "bg-gray-500";
	}
}

function getTechnicianStatus(technician) {
	if (!technician) return null;
	const utilization = (technician.todayJobs / technician.capacity) * 100;
	return {
		utilization,
		status: utilization >= 100 ? "overbooked" : utilization >= 80 ? "busy" : "available",
	};
}
