"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
// Removed Tabs import - using buttons instead per user preference
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Eye, Phone, MessageSquare, TrendingUp, Star, Calendar, Edit, Share2, MoreHorizontal, CheckCircle, AlertCircle, ThumbsUp, Award, X, AlertTriangle, Camera, Zap, Info, Upload, Trash2, CreditCard, Shield, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label, Checkbox, Switch, Progress } from "@components/ui";
import { ALL_CATEGORIES } from "@components/site/categories/AllCategoriesPage";

// Mock job data - in real app this would come from API based on job ID
const mockJob = {
	id: 1,
	title: "Kitchen Faucet Replacement",
	description: "Need to replace a leaky kitchen faucet. The current one is old and beyond repair. Kitchen is easily accessible and I have all necessary shut-off valves. Looking for someone who can complete this within the week.",
	category: "Plumbing",
	budget: "$150-250",
	location: "Downtown Sacramento, CA",
	posted: "2 hours ago",
	status: "active",
	urgency: "medium",
	contractorsNotified: 4,
	responses: 2,
	views: 12,
	boosted: false,
	images: ["/placeholder.svg", "/placeholder.svg"],
	timeline: "This week",
	preferredContact: "phone",
	user: {
		name: "John Smith",
		avatar: "/placeholder.svg",
		rating: 4.8,
		reviewsCount: 12,
	},
};

// Mock contractor responses
const mockResponses = [
	{
		id: 1,
		contractor: {
			name: "Mike's Plumbing Services",
			avatar: "/placeholder.svg",
			rating: 4.9,
			reviewsCount: 127,
			verified: true,
			responseTime: "Usually responds within 2 hours",
			location: "Sacramento, CA",
		},
		quote: "$180",
		message: "Hi John! I can definitely help with your kitchen faucet replacement. I have over 15 years of experience and can complete this job today if needed. I'll bring all necessary tools and parts. The quote includes labor and a quality faucet. Let me know if you'd like to discuss!",
		availability: "Available today",
		submittedAt: "1 hour ago",
		photos: ["/placeholder.svg"],
		guarantees: ["2 year warranty", "Licensed & Insured", "Same day service"],
	},
	{
		id: 2,
		contractor: {
			name: "Sacramento Pro Plumbers",
			avatar: "/placeholder.svg",
			rating: 4.7,
			reviewsCount: 89,
			verified: true,
			responseTime: "Usually responds within 4 hours",
			location: "Sacramento, CA",
		},
		quote: "$210",
		message: "Hello! I'd be happy to replace your kitchen faucet. I'm available this week and can provide a high-quality Delta or Moen faucet. Quote includes removal of old faucet, installation of new one, and cleanup. All work guaranteed.",
		availability: "Available Wednesday-Friday",
		submittedAt: "45 minutes ago",
		photos: [],
		guarantees: ["1 year warranty", "Licensed & Bonded", "Clean up included"],
	},
];

export default function JobDetailPage({ params }) {
	const [showBoostDialog, setShowBoostDialog] = useState(false);
	const [editing, setEditing] = useState({});
	const job = mockJob;
	const totalCost = job.boosted ? 15 : 0; // Replace with real boost price logic if needed

	// Inline edit handlers
	const handleEdit = (field, value) => {
		setJob((prev) => ({ ...prev, [field]: value }));
	};
	const startEdit = (field) => setEditing({ ...editing, [field]: true });
	const stopEdit = (field) => setEditing({ ...editing, [field]: false });

	const getStatusColor = (status) => {
		switch (status) {
			case "active":
				return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
			case "in-progress":
				return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
			case "completed":
				return "bg-muted text-muted-foreground border-border";
			default:
				return "bg-muted text-muted-foreground border-border";
		}
	};

	const getUrgencyColor = (urgency) => {
		switch (urgency) {
			case "high":
				return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
			case "medium":
				return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
			case "low":
				return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
			default:
				return "bg-muted text-muted-foreground border-border";
		}
	};

	return (
		<div className="w-full px-4 py-16 space-y-8 lg:px-24">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Link href="/dashboard/user/jobs">
					<Button variant="outline" size="sm">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Jobs
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
					<p className="text-muted-foreground">View your posted job details</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Main Info */}
				<div className="space-y-6 lg:col-span-2">
					{/* Job Details */}
					<Card>
						<CardHeader>
							<CardTitle>Job Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Job Title</Label>
								<div className="mt-1 text-base font-medium text-foreground">{job.title}</div>
							</div>
							<div>
								<Label>Category</Label>
								<div className="mt-1 text-base font-medium text-foreground">{job.category}</div>
							</div>
							<div>
								<Label>Specific Service</Label>
								<div className="mt-1 text-base font-medium text-foreground">{job.subCategory || "-"}</div>
							</div>
							<div>
								<Label>Description</Label>
								<div className="mt-1 text-base text-muted-foreground whitespace-pre-line">{job.description}</div>
							</div>
						</CardContent>
					</Card>

					{/* Location */}
					<Card>
						<CardHeader>
							<CardTitle>Location</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>City, State</Label>
								<div className="mt-1 text-base font-medium text-foreground">{job.location}</div>
							</div>
							<div>
								<Label>Specific Address</Label>
								<div className="mt-1 text-base text-muted-foreground">{job.address || "-"}</div>
							</div>
						</CardContent>
					</Card>

					{/* Budget & Timeline */}
					<Card>
						<CardHeader>
							<CardTitle>Budget & Timeline</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Budget</Label>
								<div className="mt-1 text-base font-medium text-foreground">{job.budget}</div>
							</div>
							<div>
								<Label>Timeline</Label>
								<div className="mt-1 text-base font-medium text-foreground">{job.timeline}</div>
							</div>
							<div>
								<Label>Urgency Level</Label>
								<div className="mt-1 text-base font-medium text-foreground capitalize">{job.urgency}</div>
							</div>
						</CardContent>
					</Card>

					{/* Project Requirements */}
					<Card>
						<CardHeader>
							<CardTitle>Project Requirements</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Project Size</Label>
								<div className="mt-1 text-base font-medium text-foreground capitalize">{job.projectSize}</div>
							</div>
							<div>
								<Label>Experience Level</Label>
								<div className="mt-1 text-base font-medium text-foreground capitalize">{job.experienceLevel}</div>
							</div>
							<div className="space-y-2">
								<Label>Professional Requirements</Label>
								<div className="flex flex-col gap-1">
									<span>{job.licensedRequired ? "Licensed required" : null}</span>
									<span>{job.insuranceRequired ? "Insurance required" : null}</span>
									<span>{job.backgroundCheckRequired ? "Background check required" : null}</span>
								</div>
							</div>
							<div>
								<Label>Additional Requirements</Label>
								<ul className="mt-1 text-base text-muted-foreground list-disc list-inside">{job.requirements && job.requirements.length > 0 ? job.requirements.map((req, i) => <li key={i}>{req}</li>) : <li>-</li>}</ul>
							</div>
						</CardContent>
					</Card>

					{/* Photo Gallery */}
					<Card>
						<CardHeader>
							<CardTitle>Photo Gallery</CardTitle>
							<CardDescription>Photos you uploaded for this job</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
									{job.images && job.images.length > 0 ? (
										job.images.map((photo, index) => (
											<div key={index} className="relative group aspect-square">
												<img src={photo} alt={`Project photo ${index + 1}`} className="object-cover w-full h-full rounded-lg" />
											</div>
										))
									) : (
										<span className="text-muted-foreground">No photos uploaded.</span>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Contact Preferences */}
					<Card>
						<CardHeader>
							<CardTitle>Contact Preferences</CardTitle>
						</CardHeader>
						<CardContent>
							<Label>How should professionals contact you?</Label>
							<div className="mt-2 text-base font-medium text-foreground capitalize">{job.preferredContact}</div>
							<p className="mt-2 text-xs text-muted-foreground">We never sell your data. Your contact information is only shared with the professional you connect with.</p>
						</CardContent>
					</Card>

					{/* Boost Options */}
					{job.boosted && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
									Boosted Job
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-2 p-3 border rounded-lg bg-green-500/5 border-green-500/20">
									<Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
									<div>
										<p className="text-sm font-medium">Secure Payment</p>
										<p className="text-xs text-muted-foreground">Your payment information is encrypted and secure</p>
									</div>
								</div>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="md:col-span-2">
										<Label>Card Number</Label>
										<div className="mt-1 text-base text-muted-foreground">•••• •••• •••• {job.cardNumber ? job.cardNumber.slice(-4) : ""}</div>
									</div>
									<div>
										<Label>Expiry Date</Label>
										<div className="mt-1 text-base text-muted-foreground">{job.expiryDate}</div>
									</div>
									<div>
										<Label>CVV</Label>
										<div className="mt-1 text-base text-muted-foreground">•••</div>
									</div>
								</div>
								<div className="space-y-4">
									<Label>Billing Information</Label>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="md:col-span-2">
											<Label>Full Name</Label>
											<div className="mt-1 text-base text-muted-foreground">{job.billingName}</div>
										</div>
										<div className="md:col-span-2">
											<Label>Address</Label>
											<div className="mt-1 text-base text-muted-foreground">{job.billingAddress}</div>
										</div>
										<div>
											<Label>City</Label>
											<div className="mt-1 text-base text-muted-foreground">{job.billingCity}</div>
										</div>
										<div>
											<Label>State</Label>
											<div className="mt-1 text-base text-muted-foreground">{job.billingState}</div>
										</div>
										<div>
											<Label>ZIP Code</Label>
											<div className="mt-1 text-base text-muted-foreground">{job.billingZip}</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sidebar Info */}
				<div className="space-y-6">
					{/* How It Works */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Info className="w-5 h-5" />
								How It Works
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								<div className="flex gap-3">
									<div className="flex items-center justify-center w-6 h-6 text-sm font-semibold rounded-full bg-primary/10 text-primary">1</div>
									<div>
										<p className="text-sm font-medium">Job Posted</p>
										<p className="text-xs text-muted-foreground">Your job is sent to 3-6 closest professionals</p>
									</div>
								</div>
								<div className="flex gap-3">
									<div className="flex items-center justify-center w-6 h-6 text-sm font-semibold rounded-full bg-primary/10 text-primary">2</div>
									<div>
										<p className="text-sm font-medium">Professionals Respond</p>
										<p className="text-xs text-muted-foreground">Receive quotes and proposals within 24-48 hours</p>
									</div>
								</div>
								<div className="flex gap-3">
									<div className="flex items-center justify-center w-6 h-6 text-sm font-semibold rounded-full bg-primary/10 text-primary">3</div>
									<div>
										<p className="text-sm font-medium">Choose & Connect</p>
										<p className="text-xs text-muted-foreground">Compare options and hire the best professional</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Targeting Info */}
					<Card className="border-primary/20 bg-primary/5">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-foreground">
								<Users className="w-5 h-5" />
								Professional Targeting
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3 text-sm text-muted-foreground">
								<p>
									• <strong>Standard posts</strong> reach the 3-6 closest, highest-rated professionals in your category
								</p>
								<p>• All professionals are pre-screened and verified</p>
								<p>• Location-based matching ensures local service</p>
								<p>• Category expertise matching for quality results</p>
							</div>
						</CardContent>
					</Card>

					{/* Boost Warning */}
					<Alert className="border-orange-500/20 bg-orange-500/5">
						<Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
						<AlertDescription className="text-orange-800 dark:text-orange-200">
							<strong>Boost Warning:</strong> Boosted jobs can generate 5-10x more responses. Be prepared for many contacts and have your availability ready to discuss your project.
						</AlertDescription>
					</Alert>

					{/* Pricing Summary */}
					<Card>
						<CardHeader>
							<CardTitle>Order Summary</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>Standard Job Post</span>
									<span className="font-semibold">FREE</span>
								</div>
								{job.boosted && (
									<div className="flex justify-between text-primary">
										<span>Boost</span>
										<span className="font-semibold">+${totalCost}</span>
									</div>
								)}
								<hr className="my-2" />
								<div className="flex justify-between text-lg font-semibold">
									<span>Total</span>
									<span>${totalCost}</span>
								</div>
								{totalCost > 0 && <p className="text-xs text-muted-foreground">Payment was processed when you posted the job.</p>}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
