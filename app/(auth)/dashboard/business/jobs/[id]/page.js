"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Progress } from "@components/ui/progress";
import { Separator } from "@components/ui/separator";
import { Alert, AlertDescription } from "@components/ui/alert";
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, Users, Star, MessageCircle, MessageSquare, Phone, Mail, ExternalLink, CheckCircle, Download, Bookmark, Share2, AlertCircle, Target, Zap, Wrench, Briefcase, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "@components/ui/use-toast";

export default function JobDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [job, setJob] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Mock jobs data - in real app this would come from API
	const mockJobs = [
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
	];

	// Load job data
	useEffect(() => {
		const loadJobData = () => {
			const jobId = params.id;
			const foundJob = mockJobs.find((j) => j.id === jobId);

			if (!foundJob) {
				toast({
					title: "Job Not Found",
					description: "The job you're looking for doesn't exist.",
					variant: "destructive",
				});
				router.push("/dashboard/business/jobs");
				return;
			}

			setJob(foundJob);
			setIsLoading(false);
		};

		loadJobData();
	}, [params.id, router]);

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

	const handleContact = () => {
		toast({
			title: "Contact Initiated",
			description: "You can now contact the customer directly.",
		});
	};

	const handleCall = () => {
		window.open(`tel:${job.customer.phone}`, "_self");
	};

	const handleEmail = () => {
		window.open(`mailto:${job.customer.email}`, "_self");
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading job details...</p>
				</div>
			</div>
		);
	}

	if (!job) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b border-border bg-card/80 dark:bg-card/70 sticky top-0 z-30">
				<div className="flex items-center justify-between p-6">
					<div className="flex items-center gap-4">
						<Link href="/dashboard/business/jobs">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Jobs
							</Button>
						</Link>
						<div>
							<h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
							<p className="text-muted-foreground">Job Details</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm">
							<Bookmark className="w-4 h-4 mr-2" />
							Save Job
						</Button>
						<Button variant="outline" size="sm">
							<Share2 className="w-4 h-4 mr-2" />
							Share
						</Button>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto py-8 px-4">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Job Header */}
						<Card>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											{renderCategoryIcon(job.category, "w-6 h-6 text-primary")}
											<h2 className="text-xl font-semibold">{job.title}</h2>
											<Badge className={getStatusColor(job.status)}>{job.status}</Badge>
											<div className={`w-3 h-3 rounded-full ${getUrgencyColor(job.urgency)}`} title={`${job.urgency} urgency`}></div>
										</div>
										<div className="flex items-center gap-4 text-sm text-muted-foreground">
											<div className="flex items-center gap-1">
												<MapPin className="w-4 h-4" />
												<span>{job.location.distance}</span>
											</div>
											<div className="flex items-center gap-1">
												<Calendar className="w-4 h-4" />
												<span>Posted {formatDate(job.postedDate)}</span>
											</div>
											<div className="flex items-center gap-1">
												<Clock className="w-4 h-4" />
												<span>{formatExpiry(job.expiresDate)}</span>
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="text-2xl font-bold text-green-600">{formatBudget(job.budget)}</div>
										<div className="text-sm text-muted-foreground">Budget Range</div>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{/* Match Score */}
								<div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
									<div className="flex items-center gap-4">
										<div>
											<div className="flex items-center gap-2 mb-1">
												<Target className="w-4 h-4 text-primary" />
												<span className="text-sm font-medium">Match Score</span>
												<span className="text-lg font-bold text-primary">{job.matchScore}%</span>
											</div>
											<Progress value={job.matchScore} className="h-2 w-32" />
										</div>
									</div>
									<div className="flex items-center gap-3 text-sm text-muted-foreground">
										<span>{job.applications} applications</span>
										<span>{job.views} views</span>
									</div>
								</div>

								{/* Description */}
								<div>
									<h3 className="text-lg font-semibold mb-3">Project Description</h3>
									<p className="text-muted-foreground leading-relaxed">{job.description}</p>
								</div>
							</CardContent>
						</Card>

						{/* Photos Gallery */}
						{job.photos && job.photos.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>Project Photos ({job.photos.length})</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
										{job.photos.map((photo, index) => (
											<div key={index} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
												<img
													src={photo}
													alt={`Project photo ${index + 1}`}
													className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
													onError={(e) => {
														e.target.src = "/placeholder.svg";
													}}
												/>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Requirements and Preferences */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Card>
								<CardHeader>
									<CardTitle>Requirements</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{job.requirements.map((req, index) => (
											<li key={index} className="flex items-start gap-2 text-sm">
												<CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
												<span>{req}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Preferences</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{job.preferences.map((pref, index) => (
											<li key={index} className="flex items-start gap-2 text-sm">
												<Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
												<span>{pref}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</div>

						{/* Attachments */}
						{job.attachments.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>Attachments</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{job.attachments.map((file, index) => (
											<div key={index} className="flex items-center justify-between p-3 border rounded-lg">
												<div className="flex items-center gap-3">
													<Download className="w-5 h-5 text-muted-foreground" />
													<div>
														<div className="font-medium">{file.name}</div>
														<div className="text-sm text-muted-foreground">{file.size}</div>
													</div>
												</div>
												<Button variant="outline" size="sm">
													<Download className="w-4 h-4 mr-2" />
													Download
												</Button>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Customer Information */}
						<Card>
							<CardHeader>
								<CardTitle>Customer Information</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-start gap-4">
									<Avatar className="w-16 h-16">
										<AvatarImage src={job.customer.avatar} />
										<AvatarFallback className="text-lg">
											{job.customer.name
												.split(" ")
												.map((word) => word[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<h4 className="text-lg font-medium">{job.customer.name}</h4>
											{job.customer.verified && <Badge variant="outline">Verified</Badge>}
										</div>
										<div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
											<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
											<span>
												{job.customer.rating} ({job.customer.reviewCount} reviews)
											</span>
										</div>
										<div className="text-sm text-muted-foreground mb-3">
											<MapPin className="w-4 h-4 inline mr-1" />
											{job.customer.location}
										</div>

										{job.canContact ? (
											<div className="space-y-2">
												<div className="flex items-center gap-2 text-sm">
													<Mail className="w-4 h-4 text-muted-foreground" />
													<span className="truncate">{job.customer.email}</span>
												</div>
												<div className="flex items-center gap-2 text-sm">
													<Phone className="w-4 h-4 text-muted-foreground" />
													<span>{job.customer.phone}</span>
												</div>
												<div className="flex items-start gap-2 text-sm">
													<MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
													<span className="text-xs">{job.customer.address}</span>
												</div>
											</div>
										) : (
											<Alert>
												<AlertCircle className="h-4 w-4" />
												<AlertDescription>This job has expired and contact information is no longer available.</AlertDescription>
											</Alert>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Quick Actions */}
						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{job.canContact ? (
									<>
										<Button className="w-full" onClick={handleContact}>
											<MessageSquare className="w-4 h-4 mr-2" />
											Contact Customer
										</Button>
										<Button variant="outline" className="w-full" onClick={handleCall}>
											<Phone className="w-4 h-4 mr-2" />
											Call Now
										</Button>
										<Button variant="outline" className="w-full" onClick={handleEmail}>
											<Mail className="w-4 h-4 mr-2" />
											Send Email
										</Button>
									</>
								) : (
									<>
										<Button variant="outline" disabled className="w-full">
											<Clock className="w-4 h-4 mr-2" />
											Job Expired
										</Button>
										<Button variant="outline" disabled className="w-full">
											<AlertCircle className="w-4 h-4 mr-2" />
											Contact Unavailable
										</Button>
									</>
								)}
							</CardContent>
						</Card>

						{/* Job Stats */}
						<Card>
							<CardHeader>
								<CardTitle>Job Statistics</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">Applications</span>
									<span className="font-medium">{job.applications}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">Views</span>
									<span className="font-medium">{job.views}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">Match Score</span>
									<span className="font-medium text-primary">{job.matchScore}%</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">Urgency</span>
									<span className="font-medium capitalize">{job.urgency}</span>
								</div>
								<Separator />
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">Budget Range</span>
									<span className="font-medium text-green-600">{formatBudget(job.budget)}</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
