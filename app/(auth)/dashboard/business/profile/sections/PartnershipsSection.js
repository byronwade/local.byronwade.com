import React from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Separator } from "@components/ui/separator";
import { Progress } from "@components/ui/progress";
import { Alert, AlertDescription } from "@components/ui/alert";
import { ScrollArea } from "@components/ui/scroll-area";
import { Handshake, Plus, Edit, Trash2, ExternalLink, Building, Truck, Shield, Users, Globe, Star, Calendar, MapPin, Phone, Mail, Link, X, CheckCircle, AlertCircle, Heart, DollarSign, GraduationCap, Award, Store, Upload, Download, FileText, Clock, Eye, XCircle, MessageSquare, Send, Verified, Circle, Loader2, Search, Building2, AlertTriangle, Save, ArrowLeft } from "lucide-react";
import { toast } from "@components/ui/use-toast";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import useBusinessStore from "@store/useBusinessStore";

export default function PartnershipsSection({ profile, setProfile }) {
	const [selectedPartnership, setSelectedPartnership] = useState(null);
	const [isAddingPartnership, setIsAddingPartnership] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [hasSearched, setHasSearched] = useState(false);
	const [showNoResults, setShowNoResults] = useState(false);
	const [editingPartnership, setEditingPartnership] = useState(null);
	const [hoveredPartnership, setHoveredPartnership] = useState(null);
	const [showVerificationSteps, setShowVerificationSteps] = useState(null);
	const fileInputRef = useRef(null);
	const searchTimeoutRef = useRef(null);

	const { filteredBusinesses, initializeWithMockData } = useBusinessStore();

	// Initialize mock data
	useEffect(() => {
		initializeWithMockData();
	}, [initializeWithMockData]);

	const partnershipTypes = ["Supplier", "Distributor", "Service Provider", "Government", "Non-Profit", "Technology Partner", "Marketing Partner", "Financial Partner", "Insurance Partner", "Training Partner", "Certification Partner", "Strategic Alliance", "Joint Venture", "Franchise", "Referral Partner", "Other"];

	// Debounced search function
	const debouncedSearch = useCallback(
		async (query) => {
			if (!query.trim()) {
				setSearchResults([]);
				setShowNoResults(false);
				setHasSearched(false);
				return;
			}

			setIsSearching(true);
			setHasSearched(true);

			try {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Search through mock businesses
				const results = filteredBusinesses.filter((business) => business.name.toLowerCase().includes(query.toLowerCase()) || business.description?.toLowerCase().includes(query.toLowerCase()) || business.categories?.some((cat) => cat.toLowerCase().includes(query.toLowerCase()))).slice(0, 10); // Limit to 10 results

				setSearchResults(results);
				setShowNoResults(results.length === 0);
			} catch (error) {
				console.error("Search error:", error);
				setSearchResults([]);
				setShowNoResults(true);
			} finally {
				setIsSearching(false);
			}
		},
		[filteredBusinesses]
	);

	// Debounce search input
	useEffect(() => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		searchTimeoutRef.current = setTimeout(() => {
			debouncedSearch(searchQuery);
		}, 300);

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [searchQuery, debouncedSearch]);

	const handleBusinessSelect = (business) => {
		// Create a new partnership from the selected business
		const newPartnership = {
			id: Date.now(),
			name: business.name,
			type: "Supplier", // Default type, can be changed
			description: business.description || `Partnership with ${business.name}`,
			logo: business.logo || "/placeholder.svg",
			website: business.website || "",
			email: business.email || "",
			phone: business.phone || "",
			address: business.address || "",
			startDate: new Date().toISOString().split("T")[0],
			status: "pending",
			benefits: "",
			notes: "",
			verification: {
				status: "not_started",
				submittedDate: null,
				verifiedDate: null,
				verificationId: null,
				steps: [
					{
						id: "contact_verification",
						title: "Contact Verification",
						description: "Verify partner contact information",
						status: "not_started",
						required: true,
					},
					{
						id: "document_verification",
						title: "Document Verification",
						description: "Upload partnership agreement or contract",
						status: "not_started",
						required: true,
					},
					{
						id: "reference_check",
						title: "Reference Check",
						description: "Verify partnership references",
						status: "not_started",
						required: false,
					},
				],
				documents: [],
				communications: [],
			},
		};

		setProfile((prev) => ({
			...prev,
			partnerships: [...prev.partnerships, newPartnership],
		}));

		setIsAddingPartnership(false);
		setSearchQuery("");
		setSearchResults([]);

		toast({
			title: "Partnership Added",
			description: `${business.name} has been added as a partnership. Complete verification to activate it.`,
		});
	};

	const getPartnershipTypeIcon = (type) => {
		const icons = {
			Supplier: Truck,
			Distributor: Building,
			"Service Provider": Users,
			Government: Shield,
			"Non-Profit": Heart,
			"Technology Partner": Globe,
			"Marketing Partner": Star,
			"Financial Partner": DollarSign,
			"Insurance Partner": Shield,
			"Training Partner": GraduationCap,
			"Certification Partner": Award,
			"Strategic Alliance": Handshake,
			"Joint Venture": Building,
			Franchise: Store,
			"Referral Partner": Users,
			Other: Handshake,
		};
		return icons[type] || Handshake;
	};

	const getPartnershipTypeColor = (type) => {
		const colors = {
			Supplier: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
			Distributor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
			"Service Provider": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
			Government: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
			"Non-Profit": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
			"Technology Partner": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
			"Marketing Partner": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
			"Financial Partner": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
			"Insurance Partner": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
			"Training Partner": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
			"Certification Partner": "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
			"Strategic Alliance": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
			"Joint Venture": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
			Franchise: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
			"Referral Partner": "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
			Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
		};
		return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
	};

	const addPartnership = () => {
		setIsAddingPartnership(true);
		setSearchQuery("");
		setSearchResults([]);
		setHasSearched(false);
		setShowNoResults(false);
	};

	const removePartnership = (partnershipId) => {
		setProfile((prev) => ({
			...prev,
			partnerships: prev.partnerships.filter((partner) => partner.id !== partnershipId),
		}));
		toast({
			title: "Partnership Removed",
			description: "The partnership has been removed from your profile.",
		});
	};

	const updatePartnership = (partnershipId, field, value) => {
		setProfile((prev) => ({
			...prev,
			partnerships: prev.partnerships.map((partner) => (partner.id === partnershipId ? { ...partner, [field]: value } : partner)),
		}));
	};

	const getStatusBadge = (status) => {
		const statusConfig = {
			verified: { variant: "default", text: "Verified", icon: CheckCircle },
			pending: { variant: "secondary", text: "Pending", icon: Clock },
			rejected: { variant: "destructive", text: "Rejected", icon: XCircle },
			not_started: { variant: "outline", text: "Not Started", icon: Circle },
		};
		const config = statusConfig[status] || statusConfig.not_started;
		const IconComponent = config.icon;
		return (
			<Badge variant={config.variant} className="flex items-center space-x-1">
				<IconComponent className="w-3 h-3" />
				<span>{config.text}</span>
			</Badge>
		);
	};

	const getVerificationStatus = (verification) => {
		return verification?.status || "not_started";
	};

	const getVerificationIcon = (status) => {
		const icons = {
			verified: CheckCircle,
			pending: Clock,
			rejected: XCircle,
			not_started: Circle,
		};
		return icons[status] || Circle;
	};

	const startVerification = (partnership) => {
		setSelectedPartnership(partnership);
		// In a real app, this would start the verification process
		toast({
			title: "Verification Started",
			description: `Verification process started for ${partnership.name}`,
		});
	};

	const handleDocumentUpload = (e) => {
		const files = Array.from(e.target.files);
		if (selectedPartnership) {
			const newDocuments = files.map((file, index) => ({
				id: Date.now() + index,
				name: file.name,
				size: file.size,
				type: file.type,
				uploadDate: new Date().toISOString(),
				status: "pending",
			}));

			setProfile((prev) => ({
				...prev,
				partnerships: prev.partnerships.map((partner) =>
					partner.id === selectedPartnership.id
						? {
								...partner,
								verification: {
									...partner.verification,
									documents: [...(partner.verification?.documents || []), ...newDocuments],
								},
						  }
						: partner
				),
			}));

			toast({
				title: "Documents Uploaded",
				description: `${files.length} document(s) uploaded successfully.`,
			});
		}
	};

	const completeVerification = () => {
		if (selectedPartnership) {
			setProfile((prev) => ({
				...prev,
				partnerships: prev.partnerships.map((partner) =>
					partner.id === selectedPartnership.id
						? {
								...partner,
								status: "verified",
								verification: {
									...partner.verification,
									status: "verified",
									verifiedDate: new Date().toISOString(),
									verificationId: `PV-${Date.now()}`,
								},
						  }
						: partner
				),
			}));

			setSelectedPartnership(null);
			toast({
				title: "Verification Complete",
				description: `${selectedPartnership.name} partnership has been verified successfully.`,
			});
		}
	};

	const updateVerificationStep = (partnershipId, stepId, status) => {
		setProfile((prev) => ({
			...prev,
			partnerships: prev.partnerships.map((partner) =>
				partner.id === partnershipId
					? {
							...partner,
							verification: {
								...partner.verification,
								steps: partner.verification.steps.map((step) => (step.id === stepId ? { ...step, status } : step)),
							},
					  }
					: partner
			),
		}));
	};

	const getStepStatusIcon = (status) => {
		const icons = {
			completed: CheckCircle,
			in_progress: Clock,
			not_started: Circle,
			rejected: XCircle,
		};
		return icons[status] || Circle;
	};

	const getStepStatusColor = (status) => {
		const colors = {
			completed: "text-green-600",
			in_progress: "text-blue-600",
			not_started: "text-gray-400",
			rejected: "text-red-600",
		};
		return colors[status] || "text-gray-400";
	};

	const BusinessCard = ({ business, onSelect }) => (
		<div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => onSelect(business)}>
			<div className="flex items-center space-x-3">
				<Avatar className="w-12 h-12">
					<AvatarImage src={business.logo} alt={business.name} />
					<AvatarFallback>
						<Building2 className="w-6 h-6" />
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 min-w-0">
					<h4 className="font-medium text-sm truncate">{business.name}</h4>
					<p className="text-xs text-muted-foreground truncate">{business.description}</p>
					{business.categories && business.categories.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-1">
							{business.categories.slice(0, 2).map((category) => (
								<Badge key={category} variant="outline" className="text-xs">
									{category}
								</Badge>
							))}
						</div>
					)}
				</div>
				<Button size="sm" variant="outline">
					<Plus className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);

	return (
		<div className="space-y-6">
			{/* Partnerships Overview */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Handshake className="w-5 h-5" />
							<span>Partnerships ({profile.partnerships.length})</span>
						</div>
						{!isAddingPartnership && (
							<Button onClick={addPartnership}>
								<Plus className="mr-2 w-4 h-4" />
								Add Partnership
							</Button>
						)}
					</CardTitle>
					<CardDescription>Manage your business partnerships and strategic alliances</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Add Partnership Section */}
					{isAddingPartnership && (
						<Card className="border-dashed">
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<Search className="w-5 h-5" />
										<span>Search for Business Partners</span>
									</div>
									<Button variant="outline" size="sm" onClick={() => setIsAddingPartnership(false)}>
										<X className="w-4 h-4" />
									</Button>
								</CardTitle>
								<CardDescription>Search for businesses to add as partnerships</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="search">Search Businesses</Label>
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
										<Input id="search" placeholder="Search by business name, category, or description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" suppressHydrationWarning />
									</div>
								</div>

								{/* Search Results */}
								{hasSearched && (
									<div className="space-y-4">
										{isSearching ? (
											<div className="flex items-center justify-center py-8">
												<Loader2 className="w-6 h-6 animate-spin" />
												<span className="ml-2">Searching...</span>
											</div>
										) : showNoResults ? (
											<div className="text-center py-8">
												<AlertTriangle className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
												<p className="text-muted-foreground">No businesses found matching your search.</p>
											</div>
										) : (
											<div className="space-y-2">
												<h4 className="font-medium">Search Results ({searchResults.length})</h4>
												<ScrollArea className="h-64">
													<div className="space-y-2">
														{searchResults.map((business) => (
															<BusinessCard key={business.id} business={business} onSelect={handleBusinessSelect} />
														))}
													</div>
												</ScrollArea>
											</div>
										)}
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{/* Partnerships List */}
					{profile.partnerships.length > 0 ? (
						<div className="space-y-4">
							{profile.partnerships.map((partner) => (
								<Card key={partner.id} className="transition-all duration-200 hover:shadow-md" onMouseEnter={() => setHoveredPartnership(partner.id)} onMouseLeave={() => setHoveredPartnership(null)}>
									<CardContent className="p-6">
										<div className="flex items-start justify-between">
											<div className="flex items-start space-x-4 flex-1">
												<Avatar className="w-16 h-16">
													<AvatarImage src={partner.logo} alt={partner.name} />
													<AvatarFallback>{getPartnershipTypeIcon(partner.type) && React.createElement(getPartnershipTypeIcon(partner.type), { className: "w-8 h-8" })}</AvatarFallback>
												</Avatar>
												<div className="flex-1 min-w-0">
													<div className="flex items-center space-x-2 mb-2">
														<h3 className="font-semibold text-lg">{partner.name}</h3>
														<Badge className={getPartnershipTypeColor(partner.type)}>{partner.type}</Badge>
														{getStatusBadge(partner.status)}
													</div>
													<p className="text-muted-foreground mb-3">{partner.description}</p>

													{/* Contact Information */}
													<div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
														{partner.email && (
															<div className="flex items-center space-x-2">
																<Mail className="w-4 h-4 text-muted-foreground" />
																<span>{partner.email}</span>
															</div>
														)}
														{partner.phone && (
															<div className="flex items-center space-x-2">
																<Phone className="w-4 h-4 text-muted-foreground" />
																<span>{partner.phone}</span>
															</div>
														)}
														{partner.website && (
															<div className="flex items-center space-x-2">
																<Globe className="w-4 h-4 text-muted-foreground" />
																<a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
																	{partner.website}
																</a>
															</div>
														)}
														{partner.address && (
															<div className="flex items-center space-x-2">
																<MapPin className="w-4 h-4 text-muted-foreground" />
																<span>{partner.address}</span>
															</div>
														)}
													</div>

													{/* Verification Status */}
													{partner.verification && (
														<div className="mt-4 p-3 rounded-lg bg-muted/30">
															<div className="flex items-center justify-between mb-2">
																<span className="text-sm font-medium">Verification Status</span>
																{getVerificationIcon(getVerificationStatus(partner.verification)) && React.createElement(getVerificationIcon(getVerificationStatus(partner.verification)), { className: "w-4 h-4" })}
															</div>
															<Progress value={(partner.verification.steps?.filter((step) => step.status === "completed").length / (partner.verification.steps?.length || 1)) * 100} className="h-2" />
															<p className="text-xs text-muted-foreground mt-1">
																{partner.verification.steps?.filter((step) => step.status === "completed").length || 0} of {partner.verification.steps?.length || 0} steps completed
															</p>
															<Button size="sm" variant="outline" className="mt-2" onClick={() => setShowVerificationSteps(showVerificationSteps === partner.id ? null : partner.id)}>
																<Shield className="w-4 h-4 mr-2" />
																{showVerificationSteps === partner.id ? "Hide" : "View"} Verification Steps
															</Button>
														</div>
													)}

													{/* Verification Steps */}
													{showVerificationSteps === partner.id && partner.verification && (
														<div className="mt-4 space-y-3">
															<h4 className="font-medium text-sm">Verification Steps</h4>
															{partner.verification.steps?.map((step) => {
																const StepIcon = getStepStatusIcon(step.status);
																return (
																	<div key={step.id} className="flex items-center space-x-3 p-3 rounded-lg border">
																		<StepIcon className={`w-5 h-5 ${getStepStatusColor(step.status)}`} />
																		<div className="flex-1">
																			<div className="flex items-center justify-between">
																				<h5 className="text-sm font-medium">{step.title}</h5>
																				<Badge variant={step.status === "completed" ? "default" : step.status === "in_progress" ? "secondary" : "outline"} className="text-xs">
																					{step.status.replace("_", " ")}
																				</Badge>
																			</div>
																			<p className="text-xs text-muted-foreground">{step.description}</p>
																		</div>
																		{step.status === "not_started" && (
																			<Button size="sm" variant="outline" onClick={() => updateVerificationStep(partner.id, step.id, "in_progress")}>
																				Start
																			</Button>
																		)}
																		{step.status === "in_progress" && (
																			<Button size="sm" onClick={() => updateVerificationStep(partner.id, step.id, "completed")}>
																				Complete
																			</Button>
																		)}
																	</div>
																);
															})}
														</div>
													)}

													{/* Partnership Details */}
													{editingPartnership?.id === partner.id ? (
														<div className="mt-4 space-y-4">
															<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
																<div className="space-y-2">
																	<Label className="text-xs text-muted-foreground">Type</Label>
																	<Select value={partner.type || "Supplier"} onValueChange={(value) => updatePartnership(partner.id, "type", value)}>
																		<SelectTrigger className="h-8 text-sm">
																			<SelectValue />
																		</SelectTrigger>
																		<SelectContent>
																			{partnershipTypes.map((type) => (
																				<SelectItem key={type} value={type}>
																					{type}
																				</SelectItem>
																			))}
																		</SelectContent>
																	</Select>
																</div>
																<div className="space-y-2">
																	<Label className="text-xs text-muted-foreground">Start Date</Label>
																	<Input value={partner.startDate || ""} onChange={(e) => updatePartnership(partner.id, "startDate", e.target.value)} placeholder="2024-01-01" className="h-8 text-sm" suppressHydrationWarning />
																</div>
															</div>
															<div className="space-y-2">
																<Label className="text-xs text-muted-foreground">Benefits</Label>
																<Textarea value={partner.benefits || ""} onChange={(e) => updatePartnership(partner.id, "benefits", e.target.value)} placeholder="Describe the benefits of this partnership..." className="text-sm" rows={2} suppressHydrationWarning />
															</div>
															<div className="space-y-2">
																<Label className="text-xs text-muted-foreground">Notes</Label>
																<Textarea value={partner.notes || ""} onChange={(e) => updatePartnership(partner.id, "notes", e.target.value)} placeholder="Additional notes about this partnership..." className="text-sm" rows={2} suppressHydrationWarning />
															</div>
															<div className="flex space-x-2">
																<Button size="sm" onClick={() => setEditingPartnership(null)}>
																	<Save className="mr-2 w-4 h-4" />
																	Save
																</Button>
																<Button size="sm" variant="outline" onClick={() => setEditingPartnership(null)}>
																	Cancel
																</Button>
															</div>
														</div>
													) : (
														<div className="mt-4 space-y-2">
															{partner.benefits && (
																<div>
																	<Label className="text-xs text-muted-foreground">Benefits:</Label>
																	<p className="text-sm">{partner.benefits}</p>
																</div>
															)}
															{partner.notes && (
																<div>
																	<Label className="text-xs text-muted-foreground">Notes:</Label>
																	<p className="text-sm">{partner.notes}</p>
																</div>
															)}
														</div>
													)}
												</div>
											</div>

											{/* Action Buttons - Show on hover */}
											<div className={`flex flex-col space-y-2 transition-opacity duration-200 ${hoveredPartnership === partner.id ? "opacity-100" : "opacity-0"}`}>
												{editingPartnership?.id !== partner.id && (
													<Button size="sm" variant="outline" onClick={() => setEditingPartnership(partner)}>
														<Edit className="w-4 h-4" />
													</Button>
												)}
												<Button size="sm" variant="outline" onClick={() => removePartnership(partner.id)}>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						/* Empty State */
						<div className="text-center py-12">
							<div className="flex justify-center items-center mx-auto w-16 h-16 rounded-full bg-primary/10 mb-4">
								<Handshake className="w-8 h-8 text-primary" />
							</div>
							<h3 className="text-lg font-semibold mb-2">No partnerships yet</h3>
							<p className="text-muted-foreground mb-4 max-w-sm mx-auto">Start building your network by adding partnerships with suppliers, service providers, and strategic allies.</p>
							<Button onClick={addPartnership}>
								<Plus className="mr-2 w-4 h-4" />
								Add Your First Partnership
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Partnership Benefits Section */}
			{profile.partnerships.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Star className="w-5 h-5" />
							<span>Partnership Benefits</span>
						</CardTitle>
						<CardDescription>Showcase the benefits and value your partnerships bring to customers</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							<div className="p-4 rounded-lg border bg-muted/20">
								<div className="flex items-center space-x-2 mb-2">
									<Truck className="w-4 h-4 text-blue-600" />
									<span className="font-medium">Reliable Supply Chain</span>
								</div>
								<p className="text-sm text-muted-foreground">Direct partnerships with suppliers ensure quality materials and timely delivery</p>
							</div>
							<div className="p-4 rounded-lg border bg-muted/20">
								<div className="flex items-center space-x-2 mb-2">
									<Shield className="w-4 h-4 text-green-600" />
									<span className="font-medium">Licensed & Certified</span>
								</div>
								<p className="text-sm text-muted-foreground">Government partnerships and certifications demonstrate our credibility</p>
							</div>
							<div className="p-4 rounded-lg border bg-muted/20">
								<div className="flex items-center space-x-2 mb-2">
									<Users className="w-4 h-4 text-purple-600" />
									<span className="font-medium">Expert Network</span>
								</div>
								<p className="text-sm text-muted-foreground">Access to specialized expertise through our service provider partnerships</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
