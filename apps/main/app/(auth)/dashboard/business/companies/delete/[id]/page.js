"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { Separator } from "@components/ui/separator";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Building2, ArrowLeft, AlertTriangle, Trash2, Clock, CheckCircle, XCircle, FileText, Users, Target, Briefcase, CreditCard, Star, Calendar, Shield, Lock, Eye, EyeOff, Copy, ExternalLink, Wrench, Car, Coffee, Phone, Mail, MapPin, Globe, Info, MessageCircle, X } from "lucide-react";

// Mock data for companies
const mockCompanies = [
	{
		id: "1",
		name: "Wade's Plumbing & Septic",
		industry: "Plumbing Services",
		status: "active",
		subscription: "Pro",
		location: "Raleigh, NC",
		address: "123 Main Street, Raleigh, NC 27601",
		phone: "(555) 123-4567",
		email: "info@wadesplumbing.com",
		website: "https://wadesplumbing.com",
		rating: 4.8,
		reviewCount: 127,
		employees: 12,
		yearEstablished: 2008,
		monthlyRevenue: 45000,
		activeJobs: 8,
		activeAds: 3,
		lastActivity: "2 hours ago",
		logo: "/placeholder.svg",
		description: "Family-owned plumbing and septic service company serving the local community for over 15 years.",
		deletionRequested: null,
		deletionDate: null,
	},
	{
		id: "2",
		name: "Downtown Coffee Co.",
		industry: "Food & Beverage",
		status: "active",
		subscription: "Basic",
		location: "Raleigh, NC",
		address: "456 Oak Avenue, Raleigh, NC 27602",
		phone: "(555) 987-6543",
		email: "hello@downtowncoffee.com",
		website: "https://downtowncoffee.com",
		rating: 4.6,
		reviewCount: 89,
		employees: 8,
		yearEstablished: 2015,
		monthlyRevenue: 28000,
		activeJobs: 2,
		activeAds: 1,
		lastActivity: "1 day ago",
		logo: "/placeholder.svg",
		description: "Artisanal coffee shop serving locally roasted beans and fresh pastries.",
		deletionRequested: null,
		deletionDate: null,
	},
	{
		id: "3",
		name: "Elite Auto Repair",
		industry: "Automotive",
		status: "active",
		subscription: "Pro",
		location: "Durham, NC",
		address: "789 Pine Street, Durham, NC 27701",
		phone: "(555) 456-7890",
		email: "service@eliteauto.com",
		website: "https://eliteauto.com",
		rating: 4.9,
		reviewCount: 203,
		employees: 15,
		yearEstablished: 2010,
		monthlyRevenue: 65000,
		activeJobs: 12,
		activeAds: 5,
		lastActivity: "30 minutes ago",
		logo: "/placeholder.svg",
		description: "Premium automotive repair and maintenance services with certified technicians.",
		deletionRequested: null,
		deletionDate: null,
	},
];

const deletionSteps = [
	{
		id: 1,
		title: "Review Business Information",
		description: "Confirm the business details before deletion",
		status: "pending",
	},
	{
		id: 2,
		title: "Understand Data Deletion",
		description: "Review what will be permanently deleted",
		status: "pending",
	},
	{
		id: 3,
		title: "Confirm Deletion Request",
		description: "Submit your deletion request",
		status: "pending",
	},
	{
		id: 4,
		title: "30-Day Waiting Period",
		description: "Business will be deleted after 30 days",
		status: "pending",
	},
];

const dataToBeDeleted = [
	{
		category: "Business Profile",
		items: ["Business name, description, and contact information", "Business logo, photos, and media files", "Operating hours and service areas", "Business verifications and certifications", "Team member information and roles"],
	},
	{
		category: "Customer Data",
		items: ["Customer reviews and ratings", "Customer contact information", "Appointment and booking history", "Customer feedback and messages"],
	},
	{
		category: "Business Operations",
		items: ["Active job postings and applications", "Advertising campaigns and performance data", "Billing and payment history", "Integration settings and API connections", "Analytics and performance metrics"],
	},
	{
		category: "Content & Media",
		items: ["Business photos and videos", "Service descriptions and pricing", "Blog posts and announcements", "FAQ sections and business policies"],
	},
];

export default function DeleteBusiness({ params }) {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [showConfirmText, setShowConfirmText] = useState(false);
	const [confirmText, setConfirmText] = useState("");
	const [deletionRequested, setDeletionRequested] = useState(false);
	const [deletionDate, setDeletionDate] = useState(null);
	const [timeRemaining, setTimeRemaining] = useState(null);

	// Additional safety checks
	const [understandDataLoss, setUnderstandDataLoss] = useState(false);
	const [understandCustomerImpact, setUnderstandCustomerImpact] = useState(false);
	const [understandLegalImplications, setUnderstandLegalImplications] = useState(false);
	const [hasBackedUpData, setHasBackedUpData] = useState(false);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [adminPassword, setAdminPassword] = useState("");
	const [showPasswordField, setShowPasswordField] = useState(false);

	const company = mockCompanies.find((c) => c.id === params.id);

	useEffect(() => {
		if (deletionDate) {
			const timer = setInterval(() => {
				const now = new Date().getTime();
				const deletionTime = new Date(deletionDate).getTime();
				const remaining = deletionTime - now;

				if (remaining <= 0) {
					setTimeRemaining(null);
					clearInterval(timer);
				} else {
					const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
					const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
					setTimeRemaining({ days, hours, minutes });
				}
			}, 1000);

			return () => clearInterval(timer);
		}
	}, [deletionDate]);

	if (!company) {
		return (
			<div className="min-h-screen bg-background">
				<div className="max-w-4xl mx-auto px-4 py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-destructive">Business Not Found</h1>
						<p className="text-muted-foreground mt-2">The business you&apos;re looking for doesn&apos;t exist.</p>
						<Link href="/dashboard/business/companies" className="inline-flex items-center mt-4 text-primary hover:underline">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Companies
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const getIndustryIcon = (industry) => {
		switch (industry.toLowerCase()) {
			case "plumbing services":
				return <Wrench className="w-4 h-4" />;
			case "food & beverage":
				return <Coffee className="w-4 h-4" />;
			case "automotive":
				return <Car className="w-4 h-4" />;
			default:
				return <Building2 className="w-4 h-4" />;
		}
	};

	const handleRequestDeletion = () => {
		// Final validation
		if (!understandDataLoss || !understandCustomerImpact || !understandLegalImplications || !hasBackedUpData || !isAuthorized) {
			alert("Please complete all required confirmations before proceeding.");
			return;
		}

		if (confirmText !== company.name) {
			alert("Please type the exact business name to confirm deletion.");
			return;
		}

		if (adminPassword !== "DELETE2024") {
			// In real app, this would be actual admin verification
			alert("Administrator password is required to proceed with deletion.");
			return;
		}

		const deletionDate = new Date();
		deletionDate.setDate(deletionDate.getDate() + 30);
		setDeletionDate(deletionDate.toISOString());
		setDeletionRequested(true);
		setCurrentStep(4);
	};

	const handleCancelDeletion = () => {
		setDeletionDate(null);
		setDeletionRequested(false);
		setCurrentStep(1);
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Building2 className="w-5 h-5" />
								<span>Review Business Information</span>
							</CardTitle>
							<CardDescription>Please review the business details below. This is the business that will be permanently deleted.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex items-center space-x-4 p-4 border rounded-lg">
								<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">{getIndustryIcon(company.industry)}</div>
								<div className="flex-1">
									<h3 className="text-lg font-semibold">{company.name}</h3>
									<p className="text-muted-foreground">{company.industry}</p>
									<p className="text-sm text-muted-foreground">{company.location}</p>
								</div>
								<Badge variant={company.subscription === "Pro" ? "default" : "secondary"}>{company.subscription}</Badge>
							</div>

							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<strong>Established:</strong> {company.yearEstablished}
								</div>
								<div>
									<strong>Employees:</strong> {company.employees}
								</div>
								<div>
									<strong>Rating:</strong> {company.rating} ⭐ ({company.reviewCount} reviews)
								</div>
								<div>
									<strong>Monthly Revenue:</strong> ${company.monthlyRevenue.toLocaleString()}
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center space-x-2">
									<Phone className="w-4 h-4 text-muted-foreground" />
									<span>{company.phone}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Mail className="w-4 h-4 text-muted-foreground" />
									<span>{company.email}</span>
								</div>
								<div className="flex items-center space-x-2">
									<MapPin className="w-4 h-4 text-muted-foreground" />
									<span>{company.address}</span>
								</div>
							</div>

							<Alert>
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>
									<strong>Warning:</strong> This action will permanently delete this business and all associated data. This process cannot be undone once the 30-day waiting period expires.
								</AlertDescription>
							</Alert>

							<div className="flex justify-end space-x-2">
								<Button variant="outline" asChild>
									<Link href="/dashboard/business/companies">Cancel</Link>
								</Button>
								<Button onClick={() => setCurrentStep(2)}>Continue to Next Step</Button>
							</div>
						</CardContent>
					</Card>
				);

			case 2:
				return (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Trash2 className="w-5 h-5" />
								<span>Data That Will Be Deleted</span>
							</CardTitle>
							<CardDescription>The following data will be permanently deleted and cannot be recovered.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{dataToBeDeleted.map((category, index) => (
								<div key={index} className="space-y-3">
									<h4 className="font-semibold text-foreground">{category.category}</h4>
									<ul className="space-y-2 ml-4">
										{category.items.map((item, itemIndex) => (
											<li key={itemIndex} className="flex items-start space-x-2">
												<XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
												<span className="text-sm text-muted-foreground">{item}</span>
											</li>
										))}
									</ul>
									{index < dataToBeDeleted.length - 1 && <Separator />}
								</div>
							))}

							<Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
								<AlertTriangle className="h-4 w-4 text-red-600" />
								<AlertDescription className="text-red-800 dark:text-red-200">
									<strong>Important:</strong> Once deleted, this business will no longer appear in search results, customer reviews will be removed, and all business data will be permanently erased from our systems.
								</AlertDescription>
							</Alert>

							<div className="flex justify-end space-x-2">
								<Button variant="outline" onClick={() => setCurrentStep(1)}>
									Back
								</Button>
								<Button onClick={() => setCurrentStep(3)}>Continue to Confirmation</Button>
							</div>
						</CardContent>
					</Card>
				);

			case 3:
				return (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Shield className="w-5 h-5" />
								<span>Safety Confirmations</span>
							</CardTitle>
							<CardDescription>This is your final chance to cancel the deletion request.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
								<AlertTriangle className="h-4 w-4 text-red-600" />
								<AlertDescription className="text-red-800 dark:text-red-200">
									<strong>Final Warning:</strong> You are about to request the permanent deletion of &quot;{company.name}&quot;. This action will initiate a 30-day waiting period, after which the business and all its data will be permanently deleted.
								</AlertDescription>
							</Alert>

							<div className="space-y-4">
								<div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
									<div className="flex items-start space-x-3">
										<AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
										<div className="flex-1">
											<div className="flex items-center space-x-2 mb-2">
												<input type="checkbox" id="dataLoss" checked={understandDataLoss} onChange={(e) => setUnderstandDataLoss(e.target.checked)} className="rounded border-neutral-700" />
												<label htmlFor="dataLoss" className="font-medium text-red-900 dark:text-red-100">
													I understand that ALL data will be permanently lost
												</label>
											</div>
											<p className="text-sm text-red-700 dark:text-red-300">
												This includes {company.reviewCount} customer reviews, {company.activeAds} active ads, {company.activeJobs} job postings, and all business information.
											</p>
										</div>
									</div>
								</div>

								<div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
									<div className="flex items-start space-x-3">
										<Users className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
										<div className="flex-1">
											<div className="flex items-center space-x-2 mb-2">
												<input type="checkbox" id="customerImpact" checked={understandCustomerImpact} onChange={(e) => setUnderstandCustomerImpact(e.target.checked)} className="rounded border-neutral-700" />
												<label htmlFor="customerImpact" className="font-medium text-orange-900 dark:text-orange-100">
													I understand the impact on customers
												</label>
											</div>
											<p className="text-sm text-orange-700 dark:text-orange-300">Customers who have left reviews or used your services will lose access to this information. This may affect their trust and future business decisions.</p>
										</div>
									</div>
								</div>

								<div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
									<div className="flex items-start space-x-3">
										<Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
										<div className="flex-1">
											<div className="flex items-center space-x-2 mb-2">
												<input type="checkbox" id="legalImplications" checked={understandLegalImplications} onChange={(e) => setUnderstandLegalImplications(e.target.checked)} className="rounded border-neutral-700" />
												<label htmlFor="legalImplications" className="font-medium text-yellow-900 dark:text-yellow-100">
													I understand legal and compliance implications
												</label>
											</div>
											<p className="text-sm text-yellow-700 dark:text-yellow-300">Deleting business data may have legal implications. Ensure you have proper authorization and have consulted with legal counsel if necessary.</p>
										</div>
									</div>
								</div>

								<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
									<div className="flex items-start space-x-3">
										<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
										<div className="flex-1">
											<div className="flex items-center space-x-2 mb-2">
												<input type="checkbox" id="backupData" checked={hasBackedUpData} onChange={(e) => setHasBackedUpData(e.target.checked)} className="rounded border-neutral-700" />
												<label htmlFor="backupData" className="font-medium text-blue-900 dark:text-blue-100">
													I have backed up all important data
												</label>
											</div>
											<p className="text-sm text-blue-700 dark:text-blue-300">I have exported and saved all customer data, reviews, business information, and any other data I may need in the future.</p>
										</div>
									</div>
								</div>

								<div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
									<div className="flex items-start space-x-3">
										<Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
										<div className="flex-1">
											<div className="flex items-center space-x-2 mb-2">
												<input type="checkbox" id="authorized" checked={isAuthorized} onChange={(e) => setIsAuthorized(e.target.checked)} className="rounded border-neutral-700" />
												<label htmlFor="authorized" className="font-medium text-purple-900 dark:text-purple-100">
													I have proper authorization to delete this business
												</label>
											</div>
											<p className="text-sm text-purple-700 dark:text-purple-300">I am the business owner or have explicit permission from the business owner to perform this action.</p>
										</div>
									</div>
								</div>
							</div>

							<div className="flex justify-end space-x-2">
								<Button variant="outline" onClick={() => setCurrentStep(2)}>
									Back
								</Button>
								<Button variant="destructive" disabled={!understandDataLoss || !understandCustomerImpact || !understandLegalImplications || !hasBackedUpData || !isAuthorized || confirmText !== company.name || adminPassword !== "DELETE2024"} onClick={handleRequestDeletion}>
									<Trash2 className="w-4 h-4 mr-2" />
									Request Business Deletion
								</Button>
							</div>
						</CardContent>
					</Card>
				);

			case 4:
				return (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Clock className="w-5 h-5" />
								<span>Deletion Request Submitted</span>
							</CardTitle>
							<CardDescription>Your deletion request has been submitted. The business will be permanently deleted after 30 days.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="text-center py-8">
								<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
								<h3 className="text-xl font-semibold mb-2">Deletion Request Confirmed</h3>
								<p className="text-muted-foreground mb-4">Your request to delete &quot;{company.name}&quot; has been submitted successfully.</p>
							</div>

							{timeRemaining && (
								<div className="text-center p-6 border rounded-lg bg-muted/50">
									<h4 className="font-semibold mb-2">Time Remaining Until Deletion</h4>
									<div className="text-2xl font-bold text-red-600">
										{timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
									</div>
									<p className="text-sm text-muted-foreground mt-2">Business will be deleted on {new Date(deletionDate).toLocaleDateString()}</p>
								</div>
							)}

							<Alert>
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>
									<strong>What happens next:</strong>
									<ul className="mt-2 space-y-1">
										<li>• The business will remain active for 30 days</li>
										<li>• You can cancel the deletion request at any time during this period</li>
										<li>• After 30 days, the business and all data will be permanently deleted</li>
										<li>• You will receive email notifications at 7 days, 3 days, and 1 day before deletion</li>
									</ul>
								</AlertDescription>
							</Alert>

							<div className="flex justify-center space-x-2">
								<Button variant="outline" onClick={handleCancelDeletion}>
									Cancel Deletion Request
								</Button>
								<Button asChild>
									<Link href="/dashboard/business/companies">Back to Companies</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link href="/dashboard/business/companies" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Companies
					</Link>
					<div className="flex items-center space-x-3">
						<div className="p-2 bg-destructive/10 rounded-lg">
							<Trash2 className="w-6 h-6 text-destructive" />
						</div>
						<div>
							<h1 className="text-3xl font-bold">Delete Business</h1>
							<p className="text-muted-foreground">Permanently remove this business from your account</p>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Steps */}
					<div className="lg:col-span-2">
						<div className="bg-card border rounded-lg p-6">
							<div className="space-y-6">
								{/* Step 1 */}
								<div className="border-l-4 border-primary pl-6">
									<div className="flex items-center space-x-3 mb-4">
										<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
										<h3 className="text-lg font-semibold">What happens when you delete</h3>
									</div>
									<div className="space-y-3 text-muted-foreground">
										<div className="flex items-start space-x-2">
											<AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
											<span>All business data will be permanently deleted after 30 days</span>
										</div>
										<div className="flex items-start space-x-2">
											<X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
											<span>Active ads and campaigns will be paused immediately</span>
										</div>
										<div className="flex items-start space-x-2">
											<X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
											<span>Business profile will be removed from search results</span>
										</div>
										<div className="flex items-start space-x-2">
											<X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
											<span>All reviews and ratings will be deleted</span>
										</div>
										<div className="flex items-start space-x-2">
											<X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
											<span>Job postings and applications will be removed</span>
										</div>
									</div>
								</div>

								{/* Step 2 */}
								<div className="border-l-4 border-primary pl-6">
									<div className="flex items-center space-x-3 mb-4">
										<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
										<h3 className="text-lg font-semibold">Confirm business details</h3>
									</div>
									<div className="bg-muted/50 rounded-lg p-4 space-y-3">
										<div className="flex items-center space-x-2">
											<Building2 className="w-4 h-4 text-muted-foreground" />
											<span className="font-medium">{company.name}</span>
										</div>
										<div className="flex items-center space-x-2">
											<MapPin className="w-4 h-4 text-muted-foreground" />
											<span>{company.address}</span>
										</div>
										<div className="flex items-center space-x-2">
											<Phone className="w-4 h-4 text-muted-foreground" />
											<span>{company.phone}</span>
										</div>
										<div className="flex items-center space-x-2">
											<Globe className="w-4 h-4 text-muted-foreground" />
											<span>{company.website}</span>
										</div>
									</div>
								</div>

								{/* Step 3 - Enhanced Safety Checks */}
								<div className="border-l-4 border-primary pl-6">
									<div className="flex items-center space-x-3 mb-4">
										<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
										<h3 className="text-lg font-semibold">Safety Confirmations</h3>
									</div>
									<div className="space-y-4">
										{/* Data Loss Understanding */}
										<div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
											<div className="flex items-start space-x-3">
												<AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-2">
														<input type="checkbox" id="dataLoss" checked={understandDataLoss} onChange={(e) => setUnderstandDataLoss(e.target.checked)} className="rounded border-neutral-700" />
														<label htmlFor="dataLoss" className="font-medium text-red-900 dark:text-red-100">
															I understand that ALL data will be permanently lost
														</label>
													</div>
													<p className="text-sm text-red-700 dark:text-red-300">
														This includes {company.reviewCount} customer reviews, {company.activeAds} active ads, {company.activeJobs} job postings, and all business information.
													</p>
												</div>
											</div>
										</div>

										{/* Customer Impact */}
										<div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
											<div className="flex items-start space-x-3">
												<Users className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-2">
														<input type="checkbox" id="customerImpact" checked={understandCustomerImpact} onChange={(e) => setUnderstandCustomerImpact(e.target.checked)} className="rounded border-neutral-700" />
														<label htmlFor="customerImpact" className="font-medium text-orange-900 dark:text-orange-100">
															I understand the impact on customers
														</label>
													</div>
													<p className="text-sm text-orange-700 dark:text-orange-300">Customers who have left reviews or used your services will lose access to this information. This may affect their trust and future business decisions.</p>
												</div>
											</div>
										</div>

										{/* Legal Implications */}
										<div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
											<div className="flex items-start space-x-3">
												<Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-2">
														<input type="checkbox" id="legalImplications" checked={understandLegalImplications} onChange={(e) => setUnderstandLegalImplications(e.target.checked)} className="rounded border-neutral-700" />
														<label htmlFor="legalImplications" className="font-medium text-yellow-900 dark:text-yellow-100">
															I understand legal and compliance implications
														</label>
													</div>
													<p className="text-sm text-yellow-700 dark:text-yellow-300">Deleting business data may have legal implications. Ensure you have proper authorization and have consulted with legal counsel if necessary.</p>
												</div>
											</div>
										</div>

										{/* Data Backup */}
										<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
											<div className="flex items-start space-x-3">
												<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-2">
														<input type="checkbox" id="backupData" checked={hasBackedUpData} onChange={(e) => setHasBackedUpData(e.target.checked)} className="rounded border-neutral-700" />
														<label htmlFor="backupData" className="font-medium text-blue-900 dark:text-blue-100">
															I have backed up all important data
														</label>
													</div>
													<p className="text-sm text-blue-700 dark:text-blue-300">I have exported and saved all customer data, reviews, business information, and any other data I may need in the future.</p>
												</div>
											</div>
										</div>

										{/* Authorization */}
										<div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
											<div className="flex items-start space-x-3">
												<Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-2">
														<input type="checkbox" id="authorized" checked={isAuthorized} onChange={(e) => setIsAuthorized(e.target.checked)} className="rounded border-neutral-700" />
														<label htmlFor="authorized" className="font-medium text-purple-900 dark:text-purple-100">
															I have proper authorization to delete this business
														</label>
													</div>
													<p className="text-sm text-purple-700 dark:text-purple-300">I am the business owner or have explicit permission from the business owner to perform this action.</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Step 4 - Final Confirmation */}
								<div className="border-l-4 border-primary pl-6">
									<div className="flex items-center space-x-3 mb-4">
										<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</div>
										<h3 className="text-lg font-semibold">Final confirmation</h3>
									</div>
									<div className="space-y-4">
										<div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
											<div className="flex items-start space-x-3">
												<AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
												<div>
													<p className="font-medium text-destructive">This action cannot be undone</p>
													<p className="text-sm text-muted-foreground mt-1">Once confirmed, your business will be scheduled for deletion. You have 30 days to cancel this request.</p>
												</div>
											</div>
										</div>

										{/* Business Name Confirmation */}
										<div className="space-y-2">
											<label className="text-sm font-medium">Type &quot;{company.name}&quot; to confirm deletion:</label>
											<input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="w-full px-3 py-2 border border-input rounded-md bg-background" placeholder="Enter business name to confirm" />
										</div>

										{/* Admin Password */}
										<div className="space-y-2">
											<label className="text-sm font-medium">Administrator Password (required):</label>
											<input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-3 py-2 border border-input rounded-md bg-background" placeholder="Enter administrator password" />
											<p className="text-xs text-muted-foreground">This action requires administrator-level authorization.</p>
										</div>

										<div className="flex flex-col sm:flex-row gap-3">
											<Button variant="destructive" size="lg" className="flex-1" disabled={!understandDataLoss || !understandCustomerImpact || !understandLegalImplications || !hasBackedUpData || !isAuthorized || confirmText !== company.name || adminPassword !== "DELETE2024"} onClick={handleRequestDeletion}>
												<Trash2 className="w-4 h-4 mr-2" />
												Delete Business
											</Button>
											<Button variant="outline" size="lg" className="flex-1" asChild>
												<Link href="/dashboard/business/companies">Cancel</Link>
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Info Panel */}
					<div className="lg:col-span-1">
						<div className="space-y-6">
							{/* Business Summary */}
							<div className="bg-card border rounded-lg p-6">
								<h3 className="font-semibold mb-4">Business Summary</h3>
								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Active Ads</span>
										<span className="font-medium">{company.activeAds}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Job Postings</span>
										<span className="font-medium">{company.activeJobs}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Reviews</span>
										<span className="font-medium">{company.reviewCount}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Profile Views</span>
										<span className="font-medium">1,247</span>
									</div>
								</div>
							</div>

							{/* Recovery Info */}
							<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
								<div className="flex items-start space-x-3">
									<Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
									<div>
										<h4 className="font-medium text-blue-900 dark:text-blue-100">Recovery Period</h4>
										<p className="text-sm text-blue-700 dark:text-blue-300 mt-1">You can cancel this deletion request within 30 days by visiting your account settings.</p>
									</div>
								</div>
							</div>

							{/* Support */}
							<div className="bg-card border rounded-lg p-6">
								<h3 className="font-semibold mb-4">Need Help?</h3>
								<p className="text-sm text-muted-foreground mb-4">If you&apos;re having issues or need assistance, our support team is here to help.</p>
								<Button variant="outline" size="sm" className="w-full">
									<MessageCircle className="w-4 h-4 mr-2" />
									Contact Support
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
