"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Progress } from "@components/ui/progress";
import { Search, Filter, MapPin, Calendar, DollarSign, Clock, Users, Star, MessageCircle, MessageSquare, Phone, Mail, ExternalLink, ArrowRight, ArrowLeft, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Edit, Trash2, Eye, EyeOff, Check, X, AlertCircle, Target, Zap, Wrench, Briefcase, Bookmark, Share2, CheckCircle, Download } from "lucide-react";

export default function Jobs() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [filterCategory, setFilterCategory] = useState("all");
	const [filterMatchScore, setFilterMatchScore] = useState("all");
	const [viewMode, setViewMode] = useState("grid"); // grid or list
	const [currentPage, setCurrentPage] = useState(1);
	const [expiredPage, setExpiredPage] = useState(1);
	const jobsPerPage = 12;

	// Mock jobs data - in real app this would come from API with algorithm matching
	const jobs = useMemo(
		() => [
			{
				id: "job_001",
				title: "Kitchen Remodel - Complete Renovation",
				description: "Looking for a professional contractor to completely remodel our kitchen. Need new cabinets, countertops, flooring, and appliances. Budget is flexible for quality work.",
				customer: {
					id: "cust_001",
					name: "Sarah Johnson",
					email: "sarah.johnson@email.com",
					phone: "(555) 123-4567",
					avatar: "/placeholder.svg",
					rating: 4.8,
					reviewCount: 12,
					verified: true,
					location: "Downtown Area",
					address: "123 Main St, City, State 12345",
				},
				category: "Home Improvement",
				subcategory: "Kitchen Remodel",
				budget: {
					min: 15000,
					max: 25000,
					currency: "USD",
				},
				location: {
					address: "123 Main St, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "2.3 miles",
				},
				status: "active",
				matchScore: 95,
				urgency: "high",
				postedDate: "2024-01-15T10:30:00Z",
				expiresDate: "2024-01-22T10:30:00Z",
				applications: 8,
				views: 24,
				requirements: ["Licensed contractor", "Insurance required", "5+ years experience", "Kitchen remodeling expertise"],
				preferences: ["Local business preferred", "References required", "Detailed quote needed", "Timeline: 4-6 weeks"],
				attachments: [
					{ name: "Kitchen Layout.pdf", type: "pdf", size: "2.3 MB" },
					{ name: "Inspiration Photos.zip", type: "zip", size: "15.7 MB" },
				],
				photos: ["/placeholder.svg", "/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "high",
			},
			{
				id: "job_002",
				title: "Website Design for Local Restaurant",
				description: "Need a modern, responsive website for our new restaurant. Should include online ordering, menu display, and reservation system. Looking for clean, professional design.",
				customer: {
					id: "cust_002",
					name: "Michael Chen",
					email: "michael@tasteofhome.com",
					phone: "(555) 987-6543",
					avatar: "/placeholder.svg",
					rating: 4.6,
					reviewCount: 8,
					verified: true,
					location: "Business District",
					address: "456 Oak Ave, City, State 12345",
				},
				category: "Technology",
				subcategory: "Web Development",
				budget: {
					min: 3000,
					max: 8000,
					currency: "USD",
				},
				location: {
					address: "456 Oak Ave, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "1.8 miles",
				},
				status: "active",
				matchScore: 87,
				urgency: "medium",
				postedDate: "2024-01-14T14:20:00Z",
				expiresDate: "2024-01-21T14:20:00Z",
				applications: 5,
				views: 18,
				requirements: ["Web development experience", "Portfolio required", "E-commerce knowledge", "Mobile responsive design"],
				preferences: ["Restaurant industry experience", "SEO optimization", "Content management system", "Timeline: 3-4 weeks"],
				attachments: [
					{ name: "Brand Guidelines.pdf", type: "pdf", size: "1.8 MB" },
					{ name: "Menu Items.docx", type: "docx", size: "0.5 MB" },
				],
				photos: ["/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "medium",
			},
			{
				id: "job_003",
				title: "Emergency Plumbing Repair",
				description: "Burst pipe in basement causing water damage. Need immediate repair and cleanup. Available for emergency service today.",
				customer: {
					id: "cust_003",
					name: "David Rodriguez",
					email: "david.rodriguez@email.com",
					phone: "(555) 456-7890",
					avatar: "/placeholder.svg",
					rating: 4.9,
					reviewCount: 15,
					verified: true,
					location: "Suburban Area",
					address: "789 Pine Rd, City, State 12345",
				},
				category: "Plumbing",
				subcategory: "Emergency Repair",
				budget: {
					min: 500,
					max: 2000,
					currency: "USD",
				},
				location: {
					address: "789 Pine Rd, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "4.1 miles",
				},
				status: "urgent",
				matchScore: 92,
				urgency: "critical",
				postedDate: "2024-01-15T08:15:00Z",
				expiresDate: "2024-01-16T08:15:00Z",
				applications: 3,
				views: 12,
				requirements: ["Licensed plumber", "Emergency service available", "Insurance required", "Water damage experience"],
				preferences: ["Available today", "24/7 emergency service", "Cleanup included", "Immediate response"],
				attachments: [{ name: "Damage Photos.jpg", type: "jpg", size: "3.2 MB" }],
				photos: ["/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "critical",
			},
			{
				id: "job_004",
				title: "Landscaping Design and Installation",
				description: "Complete landscaping project for new home. Need design consultation, hardscaping, and plant installation. Large backyard with potential for outdoor living space.",
				customer: {
					id: "cust_004",
					name: "Jennifer Williams",
					email: "jennifer@email.com",
					phone: "(555) 321-6547",
					avatar: "/placeholder.svg",
					rating: 4.7,
					reviewCount: 6,
					verified: true,
					location: "Rural Area",
					address: "321 Garden Ln, City, State 12345",
				},
				category: "Landscaping",
				subcategory: "Design & Installation",
				budget: {
					min: 8000,
					max: 15000,
					currency: "USD",
				},
				location: {
					address: "321 Garden Ln, City, State 12345",
					coordinates: { lat: 40.7128, lng: -74.006 },
					distance: "6.7 miles",
				},
				status: "active",
				matchScore: 78,
				urgency: "low",
				postedDate: "2024-01-13T16:45:00Z",
				expiresDate: "2024-01-27T16:45:00Z",
				applications: 12,
				views: 31,
				requirements: ["Landscape design experience", "Hardscaping skills", "Plant knowledge", "Project management"],
				preferences: ["Native plants", "Sustainable design", "Outdoor living features", "Timeline: 6-8 weeks"],
				attachments: [
					{ name: "Property Survey.pdf", type: "pdf", size: "4.1 MB" },
					{ name: "Design Inspiration.pdf", type: "pdf", size: "8.7 MB" },
				],
				photos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
				canApply: true,
				canContact: true,
				priority: "low",
			},
		],
		[]
	);

	// Filter jobs
	const filteredJobs = useMemo(() => {
		return jobs.filter((job) => {
			const matchesSearch = searchTerm === "" || job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.description.toLowerCase().includes(searchTerm.toLowerCase()) || job.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || job.category.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = filterStatus === "all" || job.status === filterStatus;
			const matchesCategory = filterCategory === "all" || job.category === filterCategory;

			let matchesScore = true;
			if (filterMatchScore === "high") matchesScore = job.matchScore >= 90;
			else if (filterMatchScore === "medium") matchesScore = job.matchScore >= 70 && job.matchScore < 90;
			else if (filterMatchScore === "low") matchesScore = job.matchScore < 70;

			return matchesSearch && matchesStatus && matchesCategory && matchesScore;
		});
	}, [jobs, searchTerm, filterStatus, filterCategory, filterMatchScore]);

	// Separate active and expired jobs
	const activeJobs = filteredJobs.filter((job) => new Date(job.expiresDate) > new Date());
	const expiredJobs = filteredJobs.filter((job) => new Date(job.expiresDate) <= new Date());

	// Pagination
	const totalActivePages = Math.ceil(activeJobs.length / jobsPerPage);
	const totalExpiredPages = Math.ceil(expiredJobs.length / jobsPerPage);

	const paginatedActiveJobs = activeJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
	const paginatedExpiredJobs = expiredJobs.slice((expiredPage - 1) * jobsPerPage, expiredPage * jobsPerPage);

	const getStatusColor = (status) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "urgent":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			case "expired":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	const getUrgencyColor = (urgency) => {
		switch (urgency) {
			case "critical":
				return "bg-red-500";
			case "high":
				return "bg-orange-500";
			case "medium":
				return "bg-yellow-500";
			case "low":
				return "bg-green-500";
			default:
				return "bg-gray-500";
		}
	};

	const getCategoryIcon = (category) => {
		switch (category) {
			case "Home Improvement":
				return Wrench;
			case "Technology":
				return Briefcase;
			case "Plumbing":
				return Wrench;
			case "Landscaping":
				return Target;
			default:
				return Briefcase;
		}
	};

	const renderCategoryIcon = (category, className = "w-5 h-5 text-primary") => {
		const IconComponent = getCategoryIcon(category);
		return <IconComponent className={className} />;
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatExpiry = (expiresDate) => {
		const now = new Date();
		const expiry = new Date(expiresDate);
		const diffTime = expiry - now;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays < 0) return "Expired";
		if (diffDays === 0) return "Expires today";
		if (diffDays === 1) return "Expires tomorrow";
		return `Expires in ${diffDays} days`;
	};

	const formatBudget = (budget) => {
		return `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`;
	};

	const JobCard = ({ job, isExpired = false }) => (
		<Card className={`hover:shadow-lg transition-all duration-200 ${isExpired ? "opacity-75" : ""} group`}>
			<CardContent className="p-6">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							{renderCategoryIcon(job.category)}
							<h3 className={`text-lg font-semibold ${isExpired ? "text-muted-foreground" : ""}`}>{job.title}</h3>
							<Badge className={getStatusColor(job.status)}>{job.status}</Badge>
							<div className={`w-2 h-2 rounded-full ${getUrgencyColor(job.urgency)}`} title={`${job.urgency} urgency`}></div>
						</div>

						<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
							<div className="flex items-center gap-1">
								<MapPin className="w-4 h-4" />
								<span>{job.location.distance}</span>
							</div>
							<div className="flex items-center gap-1">
								<Calendar className="w-4 h-4" />
								<span>{formatDate(job.postedDate)}</span>
							</div>
							<div className="flex items-center gap-1">
								<Clock className="w-4 h-4" />
								<span>{formatExpiry(job.expiresDate)}</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<Bookmark className="w-4 h-4" />
						</Button>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<Share2 className="w-4 h-4" />
						</Button>
					</div>
				</div>

				{/* Match Score */}
				<div className="mb-4">
					<div className="flex items-center justify-between mb-1">
						<span className="text-sm font-medium">Match Score</span>
						<span className={`text-sm font-bold ${isExpired ? "text-muted-foreground" : "text-primary"}`}>{job.matchScore}%</span>
					</div>
					<Progress value={job.matchScore} className={`h-2 ${isExpired ? "opacity-50" : ""}`} />
				</div>

				{/* Customer Info */}
				<div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
					<Avatar className="w-10 h-10">
						<AvatarImage src={job.customer.avatar} />
						<AvatarFallback className="text-sm">
							{job.customer.name
								.split(" ")
								.map((word) => word[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<h4 className={`font-medium text-sm truncate ${isExpired ? "text-muted-foreground" : ""}`}>{job.customer.name}</h4>
							{job.customer.verified && (
								<Badge variant="outline" className="text-xs px-1 py-0">
									Verified
								</Badge>
							)}
						</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
							<span>{job.customer.rating}</span>
							<span>({job.customer.reviewCount})</span>
							<span>•</span>
							<span className="truncate">{job.customer.location}</span>
						</div>
					</div>
				</div>

				{/* Budget and Stats */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-1">
						<DollarSign className={`w-4 h-4 ${isExpired ? "text-muted-foreground" : "text-green-600"}`} />
						<span className={`font-semibold text-sm ${isExpired ? "text-muted-foreground" : "text-green-600"}`}>{formatBudget(job.budget)}</span>
					</div>
					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						<span>{job.applications} applications</span>
						<span>{job.views} views</span>
					</div>
				</div>

				{/* Description Preview */}
				<p className={`text-sm mb-4 line-clamp-2 ${isExpired ? "text-muted-foreground" : "text-muted-foreground"}`}>{job.description}</p>

				{/* Requirements Preview */}
				<div className="mb-4">
					<h5 className="text-xs font-medium mb-2">Key Requirements:</h5>
					<div className="flex flex-wrap gap-1">
						{job.requirements.slice(0, 2).map((req, index) => (
							<Badge key={index} variant="secondary" className={`text-xs px-2 py-1 ${isExpired ? "opacity-75" : ""}`}>
								{req}
							</Badge>
						))}
						{job.requirements.length > 2 && (
							<Badge variant="outline" className={`text-xs px-2 py-1 ${isExpired ? "opacity-75" : ""}`}>
								+{job.requirements.length - 2} more
							</Badge>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{job.canContact ? (
							<>
								<Button size="sm" className="h-8 text-xs">
									<MessageSquare className="w-3 h-3 mr-1" />
									Contact
								</Button>
								<Button variant="outline" size="sm" className="h-8 text-xs" asChild>
									<Link href={`/dashboard/business/jobs/${job.id}`}>
										<Eye className="w-3 h-3 mr-1" />
										View Details
									</Link>
								</Button>
							</>
						) : (
							<>
								<Button variant="outline" size="sm" disabled className="h-8 text-xs">
									<Clock className="w-3 h-3 mr-1" />
									Expired
								</Button>
								<Button variant="outline" size="sm" className="h-8 text-xs" asChild>
									<Link href={`/dashboard/business/jobs/${job.id}`}>
										<Eye className="w-3 h-3 mr-1" />
										View Details
									</Link>
								</Button>
							</>
						)}
					</div>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
						<ExternalLink className="w-3 h-3" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="w-full px-4 lg:px-24 py-8 space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold">Matched Jobs</h1>
					<p className="text-muted-foreground mt-2">Algorithmically matched opportunities for your business</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
						{viewMode === "grid" ? "List View" : "Grid View"}
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Matches</CardTitle>
						<Target className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{jobs.length}</div>
						<p className="text-xs text-muted-foreground">Algorithm matched</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">High Match Score</CardTitle>
						<Zap className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{jobs.filter((j) => j.matchScore >= 90).length}</div>
						<p className="text-xs text-muted-foreground">90%+ match rate</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Urgent Jobs</CardTitle>
						<AlertCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{jobs.filter((j) => j.urgency === "critical" || j.urgency === "high").length}</div>
						<p className="text-xs text-muted-foreground">Need immediate attention</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg. Budget</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${Math.round(jobs.reduce((acc, j) => acc + (j.budget.min + j.budget.max) / 2, 0) / jobs.length).toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Per project</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="w-5 h-5" />
						Filter Jobs
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						<div className="lg:col-span-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input placeholder="Search jobs, customers, or descriptions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
							</div>
						</div>
						<Select value={filterStatus} onValueChange={setFilterStatus}>
							<SelectTrigger>
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="urgent">Urgent</SelectItem>
								<SelectItem value="expired">Expired</SelectItem>
							</SelectContent>
						</Select>
						<Select value={filterCategory} onValueChange={setFilterCategory}>
							<SelectTrigger>
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								<SelectItem value="Home Improvement">Home Improvement</SelectItem>
								<SelectItem value="Technology">Technology</SelectItem>
								<SelectItem value="Plumbing">Plumbing</SelectItem>
								<SelectItem value="Landscaping">Landscaping</SelectItem>
							</SelectContent>
						</Select>
						<Select value={filterMatchScore} onValueChange={setFilterMatchScore}>
							<SelectTrigger>
								<SelectValue placeholder="Match Score" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Scores</SelectItem>
								<SelectItem value="high">High (90%+)</SelectItem>
								<SelectItem value="medium">Medium (70-89%)</SelectItem>
								<SelectItem value="low">Low (&lt;70%)</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Active Jobs */}
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-semibold">Available Jobs</h2>
						<p className="text-sm text-muted-foreground">{activeJobs.length} active jobs available</p>
					</div>
				</div>

				{activeJobs.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Search className="w-12 h-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium mb-2">No active jobs found</h3>
							<p className="text-muted-foreground text-center">Try adjusting your search or filters to find what you&apos;re looking for.</p>
						</CardContent>
					</Card>
				) : (
					<div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"}>
						{paginatedActiveJobs.map((job) => (
							<JobCard key={job.id} job={job} />
						))}
					</div>
				)}

				{/* Active Jobs Pagination */}
				{totalActivePages > 1 && (
					<div className="flex items-center justify-center space-x-2 mt-6">
						<Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
							<ChevronLeft className="w-4 h-4" />
							Previous
						</Button>
						<div className="flex items-center space-x-1">
							{Array.from({ length: totalActivePages }, (_, i) => i + 1).map((page) => (
								<Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="w-8 h-8">
									{page}
								</Button>
							))}
						</div>
						<Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalActivePages, currentPage + 1))} disabled={currentPage === totalActivePages}>
							Next
							<ChevronRight className="w-4 h-4" />
						</Button>
					</div>
				)}
			</div>

			{/* Expired Jobs Section */}
			{expiredJobs.length > 0 && (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-semibold text-muted-foreground">Expired Jobs</h2>
							<p className="text-sm text-muted-foreground">{expiredJobs.length} expired jobs - contact information no longer available</p>
						</div>
					</div>

					<div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"}>
						{paginatedExpiredJobs.map((job) => (
							<JobCard key={job.id} job={job} isExpired={true} />
						))}
					</div>

					{/* Expired Jobs Pagination */}
					{totalExpiredPages > 1 && (
						<div className="flex items-center justify-center space-x-2 mt-6">
							<Button variant="outline" size="sm" onClick={() => setExpiredPage(Math.max(1, expiredPage - 1))} disabled={expiredPage === 1}>
								<ChevronLeft className="w-4 h-4" />
								Previous
							</Button>
							<div className="flex items-center space-x-1">
								{Array.from({ length: totalExpiredPages }, (_, i) => i + 1).map((page) => (
									<Button key={page} variant={page === expiredPage ? "default" : "outline"} size="sm" onClick={() => setExpiredPage(page)} className="w-8 h-8">
										{page}
									</Button>
								))}
							</div>
							<Button variant="outline" size="sm" onClick={() => setExpiredPage(Math.min(totalExpiredPages, expiredPage + 1))} disabled={expiredPage === totalExpiredPages}>
								Next
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
