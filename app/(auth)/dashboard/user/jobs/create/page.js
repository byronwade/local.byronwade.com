"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import { Switch } from "@components/ui/switch";
import { Progress } from "@components/ui/progress";
import { ArrowLeft, MapPin, Clock, DollarSign, Users, AlertTriangle, TrendingUp, Camera, X, Phone, Zap, Info, Upload, Edit, Trash2, CreditCard, Shield, Mail, MessageSquare } from "lucide-react";
import { Alert, AlertDescription } from "@components/ui/alert";
import { ALL_CATEGORIES } from "@components/site/categories/AllCategoriesPage";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "@components/ui/use-toast";

const jobCategories = ["Home & Garden", "Professional Services", "Automotive", "Health & Wellness", "Technology", "Education & Training", "Event Services", "Business Services", "Creative Services", "Legal Services"];

const subCategories = {
	"Home & Garden": ["Plumbing", "Electrical", "HVAC", "Roofing", "Flooring", "Painting", "Landscaping", "Handyman", "Appliance Repair", "Cleaning Services", "Moving Services", "Pest Control", "Interior Design", "Garage Door Repair", "Fencing", "Concrete Work", "Pool Services", "Tree Services"],
	"Professional Services": ["Accounting", "Legal", "Real Estate", "Insurance", "Financial Planning", "Marketing", "Consulting", "Architecture", "Engineering", "Property Management"],
	Automotive: ["Auto Repair", "Oil Change", "Tire Services", "Auto Detailing", "Towing", "Auto Glass", "Transmission Repair", "Brake Repair"],
	"Health & Wellness": ["Medical", "Dental", "Veterinary", "Physical Therapy", "Massage Therapy", "Mental Health", "Nutrition", "Fitness Training", "Chiropractic"],
	Technology: ["Computer Repair", "IT Support", "Web Development", "App Development", "Cybersecurity", "Data Recovery", "Network Setup", "Software Training"],
	"Education & Training": ["Tutoring", "Music Lessons", "Language Learning", "Test Prep", "Professional Training", "Skill Development", "Academic Support"],
	"Event Services": ["Wedding Planning", "Catering", "Photography", "DJ Services", "Event Planning", "Party Rentals", "Floral Design", "Entertainment"],
	"Business Services": ["Graphic Design", "Content Writing", "Virtual Assistant", "Bookkeeping", "Social Media Management", "SEO Services", "Translation", "Data Entry"],
	"Creative Services": ["Video Production", "Audio Production", "Animation", "Logo Design", "Branding", "Illustration", "3D Modeling", "Voice Over"],
	"Legal Services": ["Personal Injury", "Family Law", "Criminal Defense", "Business Law", "Real Estate Law", "Immigration", "Estate Planning", "Contract Review"],
};

const urgencyLevels = [
	{ value: "low", label: "Low Priority", description: "Within 2-4 weeks", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
	{ value: "medium", label: "Medium Priority", description: "Within 1-2 weeks", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
	{ value: "high", label: "High Priority", description: "Within 2-7 days", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
	{ value: "urgent", label: "Urgent", description: "ASAP - Same day/Next day", color: "bg-red-500/10 text-red-600 dark:text-red-400" },
];

const budgetTypes = [
	{ value: "fixed", label: "Fixed Price", description: "One-time project cost" },
	{ value: "hourly", label: "Hourly Rate", description: "Cost per hour" },
	{ value: "estimate", label: "Request Estimate", description: "Let contractors quote" },
	{ value: "ongoing", label: "Ongoing Contract", description: "Monthly/recurring service" },
];

export default function CreateJobPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showBoostOptions, setShowBoostOptions] = useState(false);
	const [showPayment, setShowPayment] = useState(false);
	const [categorySearch, setCategorySearch] = useState("");
	const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
	const [subCategoryDropdownOpen, setSubCategoryDropdownOpen] = useState(false);
	const categoryDropdownRef = useRef(null);
	const subCategoryDropdownRef = useRef(null);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		subCategory: "",
		budget: "",
		budgetType: "estimate",
		budgetMin: "",
		budgetMax: "",
		location: "",
		address: "",
		urgency: "medium",
		timeline: "",
		preferredContact: "any",
		projectSize: "small", // small, medium, large
		experienceLevel: "any", // any, beginner, intermediate, expert
		licensedRequired: false,
		insuranceRequired: false,
		backgroundCheckRequired: false,
		boosted: false,
		boostLevel: "standard",
		images: [],
		requirements: [],
		tags: [],
		// Payment info
		paymentMethod: "",
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		billingName: "",
		billingAddress: "",
		billingCity: "",
		billingState: "",
		billingZip: "",
	});

	const [uploadingImages, setUploadingImages] = useState({});

	// Group categories by parent
	const groupedCategories = useMemo(() => {
		const groups = {};
		ALL_CATEGORIES.forEach((cat) => {
			if (!groups[cat.parent]) groups[cat.parent] = [];
			groups[cat.parent].push(cat);
		});
		return groups;
	}, []);

	const filteredCategories = useMemo(() => {
		if (!categorySearch) return ALL_CATEGORIES;
		return ALL_CATEGORIES.filter((cat) => cat.name.toLowerCase().includes(categorySearch.toLowerCase()) || cat.description.toLowerCase().includes(categorySearch.toLowerCase()) || cat.parent.toLowerCase().includes(categorySearch.toLowerCase()));
	}, [categorySearch]);

	// Close dropdowns when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
				setCategoryDropdownOpen(false);
			}
			if (subCategoryDropdownRef.current && !subCategoryDropdownRef.current.contains(event.target)) {
				setSubCategoryDropdownOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Get subcategories based on selected category
	const subCategories = useMemo(() => {
		if (!formData.category) return [];
		const category = ALL_CATEGORIES.find((cat) => cat.name === formData.category);
		if (!category) return [];

		// Return subcategories based on the category
		switch (category.name) {
			case "Restaurants":
				return ["Fine Dining", "Casual Dining", "Fast Food", "Cafe", "Food Truck", "Catering"];
			case "Bars & Nightlife":
				return ["Bar", "Pub", "Nightclub", "Sports Bar", "Wine Bar", "Cocktail Lounge"];
			case "Cafes & Coffee Shops":
				return ["Coffee Shop", "Tea House", "Bakery Cafe", "Internet Cafe"];
			case "Fast Food":
				return ["Burger Joint", "Pizza Place", "Sandwich Shop", "Mexican Fast Food", "Asian Fast Food"];
			case "Bakeries":
				return ["Bakery", "Patisserie", "Bread Shop", "Cake Shop", "Donut Shop"];
			case "Food Trucks":
				return ["Food Truck", "Food Cart", "Mobile Catering"];
			case "Dentists":
				return ["General Dentistry", "Orthodontics", "Pediatric Dentistry", "Cosmetic Dentistry", "Oral Surgery"];
			case "Doctors":
				return ["Family Medicine", "Internal Medicine", "Pediatrics", "Cardiology", "Dermatology", "Neurology"];
			case "Urgent Care":
				return ["Urgent Care Center", "Walk-in Clinic", "Emergency Care"];
			case "Pharmacies":
				return ["Retail Pharmacy", "Compounding Pharmacy", "Specialty Pharmacy"];
			case "Physical Therapy":
				return ["Physical Therapy", "Sports Therapy", "Rehabilitation", "Occupational Therapy"];
			case "Mental Health":
				return ["Psychiatry", "Psychology", "Counseling", "Therapy", "Addiction Treatment"];
			case "Plumbing":
				return ["Residential Plumbing", "Commercial Plumbing", "Emergency Plumbing", "Drain Cleaning", "Water Heater"];
			case "Electricians":
				return ["Residential Electrical", "Commercial Electrical", "Industrial Electrical", "Emergency Electrical"];
			case "HVAC":
				return ["Heating", "Ventilation", "Air Conditioning", "Duct Cleaning", "Refrigeration"];
			case "House Cleaning":
				return ["Residential Cleaning", "Commercial Cleaning", "Deep Cleaning", "Move-in/Move-out Cleaning"];
			case "Landscaping":
				return ["Lawn Care", "Garden Design", "Tree Services", "Irrigation", "Hardscaping"];
			case "Handyman Services":
				return ["General Repairs", "Home Maintenance", "Assembly", "Installation", "Painting"];
			case "Hair Salons":
				return ["Hair Cutting", "Hair Coloring", "Styling", "Extensions", "Treatments"];
			case "Nail Salons":
				return ["Manicure", "Pedicure", "Nail Art", "Gel Nails", "Acrylic Nails"];
			case "Spas":
				return ["Day Spa", "Massage", "Facial", "Body Treatment", "Wellness Center"];
			case "Massage Therapy":
				return ["Swedish Massage", "Deep Tissue", "Sports Massage", "Reflexology", "Aromatherapy"];
			case "Tattoo Shops":
				return ["Tattoo Art", "Piercing", "Body Art", "Cover-up", "Custom Design"];
			case "Auto Repair":
				return ["General Repair", "Engine Repair", "Transmission", "Brake Service", "Diagnostics"];
			case "Oil Change":
				return ["Quick Lube", "Oil Change", "Filter Change", "Fluid Check"];
			case "Car Wash":
				return ["Exterior Wash", "Interior Cleaning", "Detailing", "Waxing", "Polishing"];
			case "Tire Shops":
				return ["Tire Sales", "Tire Installation", "Wheel Alignment", "Tire Repair"];
			case "Auto Body Shops":
				return ["Collision Repair", "Paint Work", "Dent Removal", "Frame Straightening"];
			case "Clothing Stores":
				return ["Men's Clothing", "Women's Clothing", "Children's Clothing", "Accessories", "Shoes"];
			case "Electronics":
				return ["Computers", "Phones", "TVs", "Audio Equipment", "Gaming"];
			case "Grocery Stores":
				return ["Supermarket", "Organic Market", "Specialty Foods", "Bulk Foods"];
			case "Jewelry Stores":
				return ["Fine Jewelry", "Fashion Jewelry", "Watches", "Repair", "Custom Design"];
			case "Furniture Stores":
				return ["Home Furniture", "Office Furniture", "Outdoor Furniture", "Mattresses"];
			case "Lawyers":
				return ["Family Law", "Criminal Law", "Business Law", "Real Estate Law", "Personal Injury"];
			case "Accountants":
				return ["Tax Preparation", "Bookkeeping", "Financial Planning", "Auditing"];
			case "Real Estate":
				return ["Residential", "Commercial", "Property Management", "Mortgage"];
			case "Insurance":
				return ["Auto Insurance", "Home Insurance", "Life Insurance", "Health Insurance"];
			case "Marketing":
				return ["Digital Marketing", "Social Media", "Content Creation", "SEO", "PPC"];
			case "Gyms & Fitness":
				return ["Fitness Center", "Yoga Studio", "CrossFit", "Personal Training", "Group Classes"];
			case "Movie Theaters":
				return ["Cinema", "IMAX", "Drive-in", "Art House"];
			case "Bowling Alleys":
				return ["Bowling", "Arcade", "Food Service", "Party Room"];
			case "Golf Courses":
				return ["Golf Course", "Driving Range", "Pro Shop", "Lessons"];
			case "Parks & Recreation":
				return ["Public Parks", "Sports Fields", "Playgrounds", "Trails"];
			case "Tutoring":
				return ["Academic Tutoring", "Test Prep", "Language Learning", "Music Lessons"];
			case "Driving Schools":
				return ["Driver's Education", "Defensive Driving", "Commercial License"];
			case "Music Lessons":
				return ["Piano", "Guitar", "Voice", "Drums", "Violin"];
			case "Dance Studios":
				return ["Ballet", "Jazz", "Hip Hop", "Ballroom", "Contemporary"];
			case "Art Classes":
				return ["Painting", "Drawing", "Sculpture", "Pottery", "Digital Art"];
			default:
				return [];
		}
	}, [formData.category]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Show payment form when boosting is enabled
		if (field === "boosted" && value) {
			setShowPayment(true);
		}
	};

	const handleImageUpload = async (e) => {
		const files = Array.from(e.target.files);
		if (files.length + formData.images.length > 10) {
			toast({
				title: "Too many photos",
				description: "You can upload a maximum of 10 photos.",
				variant: "destructive",
			});
			return;
		}

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!file.type.startsWith("image/")) {
				toast({
					title: "Invalid file type",
					description: "Please upload only image files.",
					variant: "destructive",
				});
				continue;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				const newImages = [...formData.images];
				newImages.push(e.target.result);
				setFormData((prev) => ({ ...prev, images: newImages }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageRemove = (index) => {
		const newImages = [...formData.images];
		newImages.splice(index, 1);
		setFormData((prev) => ({ ...prev, images: newImages }));
	};

	const handleImageEdit = (index) => {
		// Implement image editing if needed
		console.log("Edit image", index);
	};

	const addRequirement = () => {
		setFormData((prev) => ({
			...prev,
			requirements: [...prev.requirements, ""],
		}));
	};

	const updateRequirement = (index, value) => {
		setFormData((prev) => ({
			...prev,
			requirements: prev.requirements.map((req, i) => (i === index ? value : req)),
		}));
	};

	const removeRequirement = (index) => {
		setFormData((prev) => ({
			...prev,
			requirements: prev.requirements.filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Validate payment if boosted
		if (formData.boosted && (!formData.cardNumber || !formData.expiryDate || !formData.cvv)) {
			alert("Please enter payment information for boosted job posting.");
			setIsSubmitting(false);
			return;
		}

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 3000));

		console.log("Job submitted:", formData);
		router.push("/dashboard/user/jobs?new=true");
	};

	const getBoostPrice = (level) => {
		switch (level) {
			case "standard":
				return 15;
			case "premium":
				return 25;
			case "max":
				return 35;
			default:
				return 15;
		}
	};

	const totalCost = formData.boosted ? getBoostPrice(formData.boostLevel) : 0;

	// Photo upload drag-and-drop
	const onDrop = (acceptedFiles) => {
		const event = { target: { files: acceptedFiles } };
		handleImageUpload(event);
	};
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "image/*": [] },
		multiple: true,
		disabled: formData.images.length >= 10,
	});

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
					<h1 className="text-3xl font-bold tracking-tight">Post a Job</h1>
					<p className="text-muted-foreground">Connect with qualified professionals in your area</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Main Form */}
				<div className="space-y-6 lg:col-span-2">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Job Details */}
						<Card>
							<CardHeader>
								<CardTitle>Job Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="title">Job Title *</Label>
									<Input id="title" placeholder="e.g., Kitchen Faucet Replacement, Website Design, Tax Preparation" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required />
								</div>

								<div className="relative" ref={categoryDropdownRef}>
									<Label htmlFor="category">Category *</Label>
									<Input id="category-search" placeholder="Search or select any industry (e.g., Dentist, Plumber, Marketing, etc.)" value={categorySearch || formData.category} onChange={(e) => setCategorySearch(e.target.value)} onFocus={() => setCategoryDropdownOpen(true)} autoComplete="off" required />
									{categoryDropdownOpen && (
										<div className="absolute z-50 w-full mt-2 overflow-y-auto border rounded-lg shadow-lg max-h-72 bg-card border-border">
											{Object.entries(groupedCategories).map(([parent, cats]) => (
												<div key={parent}>
													<div className="sticky top-0 px-3 py-1 text-xs font-semibold text-muted-foreground bg-muted/50">{parent}</div>
													{cats
														.filter((cat) => cat.name.toLowerCase().includes(categorySearch.toLowerCase()) || cat.description.toLowerCase().includes(categorySearch.toLowerCase()))
														.map((cat) => (
															<button
																key={cat.slug}
																type="button"
																className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-primary/5 focus:bg-primary/5 transition-colors ${formData.category === cat.name ? "bg-primary/5 text-primary font-semibold border border-primary/20" : "text-foreground"}`}
																onClick={() => {
																	handleInputChange("category", cat.name);
																	setCategorySearch(cat.name);
																	setCategoryDropdownOpen(false);
																}}
															>
																<span className="text-xl">{cat.emoji}</span>
																<span className="flex-1">
																	{cat.name}
																	<span className="block text-xs text-muted-foreground">{cat.description}</span>
																</span>
																{cat.trending && <Badge className="ml-2 text-green-700 bg-green-100">Trending</Badge>}
															</button>
														))}
												</div>
											))}
											{filteredCategories.length === 0 && <div className="px-3 py-2 text-muted-foreground">No results found.</div>}
										</div>
									)}
								</div>

								{formData.category && (
									<div className="relative" ref={subCategoryDropdownRef}>
										<Label htmlFor="subCategory">Specific Service *</Label>
										<Select value={formData.subCategory} onValueChange={(value) => handleInputChange("subCategory", value)}>
											<SelectTrigger>
												<SelectValue placeholder="Select specific service" />
											</SelectTrigger>
											<SelectContent>
												{subCategories.map((subCat) => (
													<SelectItem key={subCat} value={subCat}>
														{subCat}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}

								<div>
									<Label htmlFor="description">Description *</Label>
									<Textarea id="description" placeholder="Describe your project in detail. Include specific requirements, timeline, location details, and any other important information..." value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={6} required />
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
									<Label htmlFor="location">City, State *</Label>
									<Input id="location" placeholder="e.g., Sacramento, CA" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} required />
								</div>
								<div>
									<Label htmlFor="address">Specific Address (Optional)</Label>
									<Input id="address" placeholder="Street address for on-site services" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
									<p className="mt-1 text-xs text-muted-foreground">Only shared with selected professionals. Required for on-site services.</p>
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
									<Label>Budget Type</Label>
									<div className="grid grid-cols-2 gap-2 mt-2">
										{budgetTypes.map((type) => (
											<div key={type.value} className={`p-3 rounded-lg border cursor-pointer transition-colors ${formData.budgetType === type.value ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`} onClick={() => handleInputChange("budgetType", type.value)}>
												<div className="text-sm font-medium">{type.label}</div>
												<div className="text-xs text-muted-foreground">{type.description}</div>
											</div>
										))}
									</div>
								</div>

								{formData.budgetType !== "estimate" && (
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										{formData.budgetType === "fixed" ? (
											<div className="md:col-span-2">
												<Label htmlFor="budget">Project Budget</Label>
												<Input id="budget" placeholder="e.g., $500" value={formData.budget} onChange={(e) => handleInputChange("budget", e.target.value)} />
											</div>
										) : (
											<>
												<div>
													<Label htmlFor="budgetMin">{formData.budgetType === "hourly" ? "Hourly Rate Min" : "Monthly Budget Min"}</Label>
													<Input id="budgetMin" placeholder="e.g., $25" value={formData.budgetMin} onChange={(e) => handleInputChange("budgetMin", e.target.value)} />
												</div>
												<div>
													<Label htmlFor="budgetMax">{formData.budgetType === "hourly" ? "Hourly Rate Max" : "Monthly Budget Max"}</Label>
													<Input id="budgetMax" placeholder="e.g., $50" value={formData.budgetMax} onChange={(e) => handleInputChange("budgetMax", e.target.value)} />
												</div>
											</>
										)}
									</div>
								)}

								<div>
									<Label htmlFor="timeline">Project Timeline</Label>
									<Input id="timeline" placeholder="e.g., Start within 1 week, complete by end of month" value={formData.timeline} onChange={(e) => handleInputChange("timeline", e.target.value)} />
								</div>

								<div>
									<Label>Urgency Level</Label>
									<div className="grid grid-cols-2 gap-2 mt-2">
										{urgencyLevels.map((level) => (
											<div key={level.value} className={`p-3 rounded-lg border cursor-pointer transition-colors ${formData.urgency === level.value ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`} onClick={() => handleInputChange("urgency", level.value)}>
												<div className="flex items-center gap-2">
													<div className={`w-2 h-2 rounded-full ${level.color.split(" ")[0]}`}></div>
													<div className="text-sm font-medium">{level.label}</div>
												</div>
												<div className="ml-4 text-xs text-muted-foreground">{level.description}</div>
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Project Requirements */}
						<Card>
							<CardHeader>
								<CardTitle>Project Requirements</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
									<div>
										<Label>Project Size</Label>
										<Select value={formData.projectSize} onValueChange={(value) => handleInputChange("projectSize", value)}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="small">Small (1-2 days)</SelectItem>
												<SelectItem value="medium">Medium (1-2 weeks)</SelectItem>
												<SelectItem value="large">Large (1+ months)</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label>Experience Level</Label>
										<Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange("experienceLevel", value)}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="any">Any Level</SelectItem>
												<SelectItem value="beginner">Entry Level</SelectItem>
												<SelectItem value="intermediate">Intermediate</SelectItem>
												<SelectItem value="expert">Expert Only</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-3">
									<Label>Professional Requirements</Label>
									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Checkbox id="licensed" checked={formData.licensedRequired} onCheckedChange={(checked) => handleInputChange("licensedRequired", checked)} />
											<Label htmlFor="licensed" className="text-sm">
												Licensed professional required
											</Label>
										</div>
										<div className="flex items-center space-x-2">
											<Checkbox id="insurance" checked={formData.insuranceRequired} onCheckedChange={(checked) => handleInputChange("insuranceRequired", checked)} />
											<Label htmlFor="insurance" className="text-sm">
												Insurance required
											</Label>
										</div>
										<div className="flex items-center space-x-2">
											<Checkbox id="background" checked={formData.backgroundCheckRequired} onCheckedChange={(checked) => handleInputChange("backgroundCheckRequired", checked)} />
											<Label htmlFor="background" className="text-sm">
												Background check required
											</Label>
										</div>
									</div>
								</div>

								<div>
									<Label>Additional Requirements</Label>
									<div className="mt-2 space-y-2">
										{formData.requirements.map((req, index) => (
											<div key={index} className="flex items-center gap-2">
												<Input placeholder="Enter requirement..." value={req} onChange={(e) => updateRequirement(index, e.target.value)} className="flex-1" />
												<Button type="button" variant="outline" size="sm" onClick={() => removeRequirement(index)}>
													<X className="w-4 h-4" />
												</Button>
											</div>
										))}
										<Button type="button" variant="outline" onClick={addRequirement} className="w-full">
											Add Requirement
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Photo Gallery */}
						<Card>
							<CardHeader>
								<CardTitle>Photo Gallery</CardTitle>
								<CardDescription>Add photos to help professionals understand your project better</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
										{formData.images.map((photo, index) => (
											<div key={index} className="relative group aspect-square">
												<div className="absolute inset-0 flex items-center justify-center transition-opacity rounded-lg opacity-0 bg-black/40 group-hover:opacity-100">
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="text-white hover:text-white hover:bg-white/20"
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															handleImageRemove(index);
														}}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
												<Image src={photo} alt={`Project photo ${index + 1}`} width={400} height={400} className="object-cover w-full h-full rounded-lg" />
											</div>
										))}
										{formData.images.length < 10 && (
											<label className="relative flex items-center justify-center transition-colors border-2 border-dashed rounded-lg cursor-pointer aspect-square border-muted-foreground/25 hover:border-primary/50">
												<input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} multiple />
												<div className="p-4 text-center">
													<Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
													<span className="text-sm text-muted-foreground">Upload Photos</span>
												</div>
											</label>
										)}
									</div>
									{Object.entries(uploadingImages).some(([_, progress]) => progress < 100) && (
										<div className="space-y-2">
											{Object.entries(uploadingImages).map(
												([index, progress]) =>
													progress < 100 && (
														<div key={index} className="space-y-1">
															<div className="flex items-center justify-between text-sm">
																<span className="text-muted-foreground">Uploading photo {parseInt(index) + 1}</span>
																<span className="text-muted-foreground">{progress}%</span>
															</div>
															<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
																<div className="h-full transition-all duration-300 bg-primary" style={{ width: `${progress}%` }} />
															</div>
														</div>
													)
											)}
										</div>
									)}
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
								<div className="grid grid-cols-2 gap-2 mt-2">
									{[
										{ value: "any", label: "Any Way Is Fine", icon: Users },
										{ value: "phone", label: "Phone", icon: Phone },
										{ value: "email", label: "Email", icon: Mail },
										{ value: "text", label: "Text", icon: MessageSquare },
									].map((option) => (
										<div key={option.value} className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center gap-2 ${formData.preferredContact === option.value ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`} onClick={() => handleInputChange("preferredContact", option.value)}>
											<option.icon className="w-4 h-4" />
											<span className="text-sm font-medium">{option.label}</span>
										</div>
									))}
								</div>
								<p className="mt-2 text-xs text-muted-foreground">We never sell your data. Your contact information is only shared with the professional you connect with.</p>
							</CardContent>
						</Card>

						{/* Boost Options */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<TrendingUp className="w-5 h-5" />
									Boost Your Job (Optional)
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-medium">Boost this job post</p>
										<p className="text-sm text-muted-foreground">Reach more professionals faster</p>
									</div>
									<Switch
										checked={formData.boosted}
										onCheckedChange={(checked) => {
											handleInputChange("boosted", checked);
											setShowBoostOptions(checked);
										}}
									/>
								</div>

								{formData.boosted && (
									<div className="space-y-3">
										<Alert className="border-yellow-500/20 bg-yellow-500/5">
											<AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
											<AlertDescription className="text-yellow-800 dark:text-yellow-200">
												<strong>Important:</strong> Boosted jobs reach significantly more professionals, which means you&apos;ll likely receive many more responses. Be prepared for increased contact volume.
											</AlertDescription>
										</Alert>

										<div className="space-y-3">
											{[
												{
													level: "standard",
													name: "Standard Boost",
													price: 15,
													contractors: "10-15",
													description: "Reach 2-3x more professionals",
												},
												{
													level: "premium",
													name: "Premium Boost",
													price: 25,
													contractors: "20-30",
													description: "Reach 4-5x more professionals + priority placement",
												},
												{
													level: "max",
													name: "Maximum Boost",
													price: 35,
													contractors: "50+",
													description: "Reach maximum professionals + top priority + urgent tag",
												},
											].map((boost) => (
												<div key={boost.level} className={`p-4 rounded-lg border cursor-pointer transition-colors ${formData.boostLevel === boost.level ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`} onClick={() => handleInputChange("boostLevel", boost.level)}>
													<div className="flex items-start justify-between">
														<div className="flex-1">
															<div className="flex items-center gap-2">
																<h4 className="font-semibold">{boost.name}</h4>
																<Badge variant="outline">${boost.price}</Badge>
															</div>
															<p className="mt-1 text-sm text-muted-foreground">{boost.description}</p>
															<p className="mt-1 text-sm font-medium text-primary">{boost.contractors} professionals will see your job</p>
														</div>
														{boost.level === "max" && <Badge className="text-white bg-gradient-to-r from-yellow-400 to-orange-500">Most Popular</Badge>}
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Payment Information */}
						{formData.boosted && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<CreditCard className="w-5 h-5" />
										Payment Information
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
											<Label htmlFor="cardNumber">Card Number *</Label>
											<Input id="cardNumber" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={(e) => handleInputChange("cardNumber", e.target.value)} required={formData.boosted} />
										</div>
										<div>
											<Label htmlFor="expiryDate">Expiry Date *</Label>
											<Input id="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={(e) => handleInputChange("expiryDate", e.target.value)} required={formData.boosted} />
										</div>
										<div>
											<Label htmlFor="cvv">CVV *</Label>
											<Input id="cvv" placeholder="123" value={formData.cvv} onChange={(e) => handleInputChange("cvv", e.target.value)} required={formData.boosted} />
										</div>
									</div>

									<div className="space-y-4">
										<Label>Billing Information</Label>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div className="md:col-span-2">
												<Label htmlFor="billingName">Full Name *</Label>
												<Input id="billingName" placeholder="John Doe" value={formData.billingName} onChange={(e) => handleInputChange("billingName", e.target.value)} required={formData.boosted} />
											</div>
											<div className="md:col-span-2">
												<Label htmlFor="billingAddress">Address *</Label>
												<Input id="billingAddress" placeholder="123 Main St" value={formData.billingAddress} onChange={(e) => handleInputChange("billingAddress", e.target.value)} required={formData.boosted} />
											</div>
											<div>
												<Label htmlFor="billingCity">City *</Label>
												<Input id="billingCity" placeholder="Sacramento" value={formData.billingCity} onChange={(e) => handleInputChange("billingCity", e.target.value)} required={formData.boosted} />
											</div>
											<div>
												<Label htmlFor="billingState">State *</Label>
												<Input id="billingState" placeholder="CA" value={formData.billingState} onChange={(e) => handleInputChange("billingState", e.target.value)} required={formData.boosted} />
											</div>
											<div>
												<Label htmlFor="billingZip">ZIP Code *</Label>
												<Input id="billingZip" placeholder="95821" value={formData.billingZip} onChange={(e) => handleInputChange("billingZip", e.target.value)} required={formData.boosted} />
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Submit */}
						<div className="flex gap-4">
							<Button type="submit" size="lg" disabled={isSubmitting || !formData.title || !formData.description || !formData.category || !formData.subCategory} className="flex-1">
								{isSubmitting ? "Posting Job..." : "Post Job"}
								{formData.boosted && ` - $${getBoostPrice(formData.boostLevel)}`}
							</Button>
						</div>
					</form>
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
									<div className="flex items-center justify-center w-6 h-6 text-sm font-semibold rounded-full bg-primary/5 text-primary border border-primary/20">1</div>
									<div>
										<p className="text-sm font-medium">Job Posted</p>
										<p className="text-xs text-muted-foreground">Your job is sent to 3-6 closest professionals</p>
									</div>
								</div>
								<div className="flex gap-3">
									<div className="flex items-center justify-center w-6 h-6 text-sm font-semibold rounded-full bg-primary/5 text-primary border border-primary/20">2</div>
									<div>
										<p className="text-sm font-medium">Professionals Respond</p>
										<p className="text-xs text-muted-foreground">Receive quotes and proposals within 24-48 hours</p>
									</div>
								</div>
								<div className="flex gap-3">
									<div className="flex items-center justify-center w-6 h-6 text-sm font-semibold rounded-full bg-primary/5 text-primary border border-primary/20">3</div>
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
								{formData.boosted && (
									<div className="flex justify-between text-primary">
										<span>{formData.boostLevel.charAt(0).toUpperCase() + formData.boostLevel.slice(1)} Boost</span>
										<span className="font-semibold">+${getBoostPrice(formData.boostLevel)}</span>
									</div>
								)}
								<hr className="my-2" />
								<div className="flex justify-between text-lg font-semibold">
									<span>Total</span>
									<span>${totalCost}</span>
								</div>
								{totalCost > 0 && <p className="text-xs text-muted-foreground">Payment will be processed when you submit the job posting.</p>}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
