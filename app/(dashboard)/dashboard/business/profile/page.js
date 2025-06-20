"use client";

import React, { useState, useRef } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Progress } from "@components/ui/progress";
import { Separator } from "@components/ui/separator";
import {
	Building,
	Upload,
	Edit,
	Save,
	Settings,
	CheckCircle,
	XCircle,
	AlertCircle,
	Star,
	MapPin,
	Phone,
	Mail,
	Globe,
	Clock,
	Users,
	Award,
	Shield,
	FileText,
	Image,
	GripVertical,
	Plus,
	Trash2,
	Copy,
	ExternalLink,
	Camera,
	Calendar,
	DollarSign,
	Target,
	Zap,
	Heart,
	MessageCircle,
	Share2,
	Bookmark,
	ArrowUp,
	ArrowDown,
	RefreshCw,
	Download,
	Check,
	X,
	Tag,
	Map,
	CreditCard,
	Car,
	Coffee,
	Home,
	Wrench,
	Utensils,
	BookOpen,
	Cpu,
	Music,
	Scissors,
	Palette,
	Brush,
	Hammer,
	Leaf,
	Tree,
	Thermometer,
	Tool,
	Sparkles,
	Eye,
	EyeOff,
	ChevronRight,
	ChevronLeft,
	ChevronUp,
	ChevronDown,
	MoreHorizontal,
	Minus,
	Maximize2,
	Minimize2,
	Wifi,
	ChefHat,
	Pizza,
	Beer,
	Fish,
	Apple,
	PawPrint,
	Cookie,
	Drill,
	Flower,
	Seedling,
	Sun,
	Cloud,
	CloudRain,
	Wind,
	Droplets,
	Snowflake,
	Umbrella,
	Mountain,
	Video,
	Headphones,
	Languages,
	FileText as FileTextIcon,
	PlayCircle,
	Handshake,
	TrendingUp,
	Calculator,
	Quote,
	Carrot,
	Wine,
	IceCream,
	Briefcase,
} from "lucide-react";

export default function BusinessProfile() {
	const [profile, setProfile] = useState({
		// Basic Info
		name: "Wade's Plumbing & Septic",
		tagline: "Your trusted partner for all plumbing and septic needs",
		description: "Professional plumbing and septic services with over 15 years of experience. We specialize in residential and commercial plumbing, septic system installation and maintenance, emergency repairs, and preventative maintenance.",
		logo: "/ThorbisLogo.webp",
		coverPhoto: "/placeholder.svg",
		photos: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],

		// Contact & Location
		phone: "(555) 123-4567",
		email: "info@wadesplumbing.com",
		website: "https://wadesplumbing.com",
		address: "123 Main Street, City, State 12345",
		coordinates: { lat: 40.7128, lng: -74.006 },
		serviceAreas: ["Downtown", "Suburban Area", "Rural Communities"],

		// Business Details
		category: "Plumbing",
		subcategories: ["Residential Plumbing", "Commercial Plumbing", "Septic Systems", "Emergency Services"],
		yearEstablished: 2008,
		employees: "5-10",
		licenses: ["Plumbing License #PL12345", "Septic License #SE67890"],
		certifications: ["Certified Master Plumber", "EPA Certified", "BBB Accredited"],
		insurance: "Fully Insured - $2M Coverage",

		// Features & Services
		features: {
			menu: {
				enabled: true,
				priority: 1,
				description: "Display your menu, services, or product catalog",
				settings: {
					title: "Service Menu",
					description: "Professional plumbing and septic services",
					showPrices: true,
					showCategories: true,
					showImages: false,
				},
			},
			gallery: {
				enabled: true,
				priority: 2,
				description: "Showcase your work, products, or business photos",
				settings: {
					title: "Our Work",
					description: "Recent plumbing and septic projects",
					layout: "Grid",
					showCaptions: true,
					maxPhotos: 12,
				},
			},
			reviews: {
				enabled: true,
				priority: 3,
				description: "Display customer testimonials and ratings",
				settings: {
					title: "Customer Reviews",
					showRating: true,
					showDate: true,
					showResponse: true,
					maxReviews: 10,
				},
			},
			services: {
				enabled: true,
				priority: 4,
				description: "List your services with descriptions and pricing",
				settings: {
					title: "Our Services",
					showPricing: true,
					showDuration: false,
					showCategories: true,
				},
			},
			hours: {
				enabled: true,
				priority: 5,
				description: "Show when you're open and available",
				settings: {
					title: "Hours of Operation",
					showToday: true,
					showHolidays: false,
					showSpecialHours: true,
				},
			},
			contact: {
				enabled: true,
				priority: 6,
				description: "Display phone, email, and contact methods",
				settings: {
					title: "Get in Touch",
					showPhone: true,
					showEmail: true,
					showAddress: true,
					showSocial: false,
				},
			},
			about: {
				enabled: true,
				priority: 7,
				description: "Tell your story and share your background",
				settings: {
					title: "About Us",
					showTeam: false,
					showHistory: true,
					showMission: true,
				},
			},
			faq: {
				enabled: false,
				priority: 8,
				description: "Answer common customer questions",
				settings: {
					title: "Frequently Asked Questions",
					showCategories: false,
					expandable: true,
				},
			},
			booking: {
				enabled: true,
				priority: 9,
				description: "Let customers book appointments online",
				settings: {
					title: "Book Appointment",
					showCalendar: true,
					showServices: true,
					requireDeposit: false,
				},
			},
			location: {
				enabled: true,
				priority: 10,
				description: "Show your location and service areas",
				settings: {
					title: "Find Us",
					showMap: true,
					showDirections: true,
					showServiceAreas: true,
				},
			},
			specials: {
				enabled: false,
				priority: 11,
				description: "Highlight deals, discounts, and promotions",
				settings: {
					title: "Special Offers",
					showExpiry: true,
					showTerms: true,
					highlightNew: true,
				},
			},
			certifications: {
				enabled: true,
				priority: 12,
				description: "Display licenses, awards, and credentials",
				settings: {
					title: "Certifications & Awards",
					showBadges: true,
					showExpiry: false,
					showDescription: true,
				},
			},
		},

		// Hours & Availability
		hours: {
			monday: { open: "8:00 AM", close: "6:00 PM", closed: false },
			tuesday: { open: "8:00 AM", close: "6:00 PM", closed: false },
			wednesday: { open: "8:00 AM", close: "6:00 PM", closed: false },
			thursday: { open: "8:00 AM", close: "6:00 PM", closed: false },
			friday: { open: "8:00 AM", close: "6:00 PM", closed: false },
			saturday: { open: "9:00 AM", close: "4:00 PM", closed: false },
			sunday: { open: "", close: "", closed: true },
		},

		// Services & Pricing
		services: [
			{ name: "Emergency Plumbing", price: "$150-300", description: "24/7 emergency plumbing services", category: "Emergency" },
			{ name: "Septic System Installation", price: "$5,000-15,000", description: "Complete septic system design and installation", category: "Installation" },
			{ name: "Drain Cleaning", price: "$80-200", description: "Professional drain cleaning and unclogging", category: "Maintenance" },
			{ name: "Water Heater Repair", price: "$200-800", description: "Water heater repair and replacement", category: "Repair" },
		],

		// Reviews & Ratings
		rating: 4.8,
		reviewCount: 127,
		recentReviews: [
			{ author: "Sarah J.", rating: 5, text: "Excellent service! Fixed our plumbing issue quickly and professionally.", date: "2024-01-15" },
			{ author: "Mike R.", rating: 5, text: "Very reliable and honest pricing. Highly recommend!", date: "2024-01-12" },
		],

		// Verification Status
		verifications: {
			businessLicense: { verified: true, date: "2024-01-10", document: "license.pdf", status: "active" },
			insurance: { verified: true, date: "2024-01-08", document: "insurance.pdf", status: "active" },
			backgroundCheck: { verified: true, date: "2024-01-05", document: "background.pdf", status: "active" },
			skillTest: { verified: false, date: null, document: null, status: "pending" },
			identity: { verified: true, date: "2024-01-03", document: "id.pdf", status: "active" },
			taxId: { verified: true, date: "2024-01-01", document: "tax.pdf", status: "active" },
			bonding: { verified: false, date: null, document: null, status: "not_submitted" },
		},

		// Profile Completion
		completion: {
			basicInfo: 95,
			contactInfo: 100,
			services: 80,
			photos: 60,
			verifications: 80,
			reviews: 90,
			hours: 85,
			features: 75,
		},

		// AI Insights
		aiInsights: {
			summary: "This business has consistently high ratings for quality work and customer service. Customers frequently mention their professionalism, reliability, and quick response times for emergency services.",
			strengths: ["Professionalism", "Reliability", "Quick Response", "Quality Work"],
			trends: ["Growing customer base", "Increasing emergency service requests", "High repeat customer rate"],
			sentiment: "Positive",
			confidence: 94,
		},

		// Elite Certification
		eliteCertification: {
			status: "Certified Elite Business",
			description: "This business has achieved our highest certification level - earned by fewer than 1 in 125,000 businesses. Like a Michelin star for service excellence.",
			acceptanceRate: "0.0008%",
			processDuration: "6-9 months",
			customerInterviews: 400,
			satisfactionRate: "100%",
			benefits: ["Guaranteed highest quality workmanship", "Verified financial stability and licensing", "Independently confirmed customer satisfaction", "Ongoing performance monitoring", "Comprehensive performance guarantee", "Priority dispute resolution services"],
			vettingProcess: ["Comprehensive 400+ customer interviews", "Independent financial stability assessment", "Rigorous background and licensing verification", "Technical expertise evaluation", "On-site inspection and equipment review", "Ongoing annual re-certification requirements"],
		},

		// Warranty Tracker
		warrantyTracker: {
			coverage: {
				workmanship: { duration: "2 Years", description: "Full coverage for defects" },
				materials: { duration: "1 Year", description: "Manufacturer warranty" },
				labor: { duration: "90 Days", description: "Free repairs" },
			},
			activeWarranties: [
				{
					id: "WR001",
					service: "Plumbing Repair",
					description: "Kitchen sink installation and repair",
					startDate: "2024-01-15",
					endDate: "2026-01-15",
					status: "Active",
				},
				{
					id: "WR002",
					service: "Electrical Work",
					description: "Outlet installation and wiring",
					startDate: "2024-02-20",
					endDate: "2025-02-20",
					status: "Active",
				},
			],
			claimsHistory: [
				{
					id: "WC001",
					service: "Leak Repair",
					description: "Fixed bathroom sink leak under warranty",
					filedDate: "2024-03-10",
					resolvedDate: "2024-03-12",
					status: "Resolved",
				},
				{
					id: "WC002",
					service: "Electrical Issue",
					description: "Replaced faulty outlet connection",
					filedDate: "2024-04-05",
					resolvedDate: "2024-04-07",
					status: "Resolved",
				},
			],
		},

		// Business Operations
		businessOperations: {
			responseTime: "within 2 hours",
			responseRate: "90%",
			serviceArea: {
				primary: "Jasper, GA 30143",
				coverage: "Local area",
			},
			whyChooseUs: ["Locally owned & operated", "Licensed & Insured", "Emergency services available", "Satisfaction guaranteed", "Free estimates", "Same-day service available"],
			pricing: {
				standardRate: "$117 - $125/hour",
				emergencyRate: "$154 - $201/hour",
				minimumCharge: "$84",
				complementaryServices: ["Initial Consultation - No-obligation assessment", "Written Estimates - Detailed project quotes", "Basic Diagnostics - Problem identification", "Follow-up Inspection - 30-day post-service check"],
				discounts: [
					{ name: "Senior Discount", amount: "10%", description: "For customers 65+ years old" },
					{ name: "Military Discount", amount: "15%", description: "Active duty and veterans" },
					{ name: "First-Time Customer", amount: "5%", description: "New customers only" },
					{ name: "Repeat Customer", amount: "10%", description: "Return customers" },
				],
				paymentTerms: ["25% down payment required", "Balance due upon completion", "Payment plans available for projects over $1,000"],
				financing: {
					provider: "Financing Partner",
					minimumAmount: "$500",
					terms: "6-60 months",
					note: "Subject to credit approval",
				},
				acceptedMethods: ["Cash", "Check", "Credit Cards", "Digital Payments"],
			},
			costBreakdown: {
				labor: 40,
				materials: 25,
				insurance: 15,
				overhead: 20,
			},
			qualityAssurance: ["Pre-Service Inspection - Thorough assessment before work begins", "Quality Control Checks - Multiple checkpoints during service", "Post-Service Verification - Final inspection and customer approval", "Follow-up Support - Ongoing support after service completion"],
		},

		// Team Information
		team: [
			{
				name: "Wade",
				position: "Owner & Operator",
				experience: "17+ years",
				specializations: ["Home Services", "Plumber"],
				photo: "/placeholder.svg",
			},
		],

		// Partnerships
		partnerships: {
			supplierPartners: [
				{
					name: "Professional Supply Co",
					description: "Authorized dealer providing professional-grade materials and equipment at competitive prices.",
					website: "https://prosupply.com",
				},
				{
					name: "Builder's Choice Materials",
					description: "Preferred partner for specialized equipment and tools to handle complex projects.",
					website: "https://builderschoice.com",
				},
			],
			servicePartners: [
				{
					name: "Emergency Response Network",
					description: "Strategic alliance providing extended service capabilities and emergency support.",
					benefits: ["Enhanced customer experience through coordinated service delivery and shared best practices"],
				},
			],
			communityPartners: [
				{
					name: "Jasper Chamber of Commerce",
					description: "Active member supporting local economic development and community business initiatives.",
				},
				{
					name: "Habitat for Humanity",
					description: "Contributing professional services and expertise to support community development and charitable initiatives.",
				},
			],
			benefits: ["Quality Assurance - Partner with industry leaders to ensure the highest quality materials and service standards", "Extended Capabilities - Access to specialized resources and expertise through our network of trusted partners", "Cost Efficiency - Competitive pricing and bulk purchasing benefits passed on to our customers", "Community Support - Active involvement in local community initiatives and charitable organizations"],
		},

		// Careers
		careers: {
			openings: [
				{
					title: "Licensed Plumber",
					description: "Join our growing team and help us deliver excellent service to our customers. We're looking for a motivated professional to contribute to our success.",
					type: "Full-time",
					location: "Jasper",
					experience: "2+ years",
					salary: "$45,000 - $65,000",
					status: "Open",
				},
				{
					title: "Customer Service Representative",
					description: "Support our team by providing excellent customer service and administrative assistance.",
					type: "Part-time",
					location: "Jasper",
					experience: "Entry level",
					salary: "$15 - $20/hour",
					status: "Open",
				},
			],
			culture: {
				description: "We foster a collaborative and supportive work environment where team members can grow their careers while delivering exceptional service to our community.",
				highlights: [
					"Collaborative Environment - We foster a collaborative and supportive work environment where team members can grow their careers while delivering exceptional service to our community",
					"Professional Growth - Continuous learning and development opportunities to help you advance in your career",
					"Work-Life Balance - Flexible scheduling and understanding management that values your personal time",
					"Team Recognition - Regular recognition programs and team building activities to celebrate our successes together",
				],
			},
			benefits: ["Health Insurance", "Paid Time Off", "401(k) Retirement Plan", "Professional Development", "Performance Bonuses", "Continuing Education Support", "Flexible Work Schedule", "Employee Discounts", "Modern Work Environment"],
		},

		// FAQ
		faq: [
			{
				question: "What areas do you serve?",
				answer: "We serve Jasper, GA 30143 and surrounding areas.",
			},
			{
				question: "Are you licensed and insured?",
				answer: "Yes, we are fully licensed and insured for your protection.",
			},
			{
				question: "Do you offer emergency services?",
				answer: "Yes, we provide 24/7 emergency services with rapid response times.",
			},
			{
				question: "What is your typical response time?",
				answer: "We typically respond within 2 hours for standard requests and within 30-60 minutes for emergencies.",
			},
			{
				question: "Do you provide free estimates?",
				answer: "Yes, we provide free, no-obligation estimates for all our services.",
			},
			{
				question: "What payment methods do you accept?",
				answer: "We accept cash, checks, credit cards, and digital payments including Apple Pay and Google Pay.",
			},
		],

		// Support & Contact
		support: {
			customerService: {
				description: "Our dedicated customer service team is available to assist you with any questions or concerns.",
				contact: "(706) 555-0123",
			},
			technicalSupport: {
				description: "For technical questions about our services or equipment, our experts are here to help.",
				contact: "support@wadesplumbing.com",
			},
			emergencySupport: {
				description: "24/7 emergency support for urgent situations requiring immediate attention.",
				contact: "(706) 555-0123",
			},
			warrantyClaims: {
				description: "For warranty claims and service guarantees, contact our warranty department.",
				contact: "warranty@wadesplumbing.com",
			},
		},
	});

	const [activeSection, setActiveSection] = useState("overview");
	const [isEditing, setIsEditing] = useState(false);
	const [dragIndex, setDragIndex] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);
	const [showVerificationDialog, setShowVerificationDialog] = useState(false);
	const [selectedVerification, setSelectedVerification] = useState(null);
	const fileInputRef = useRef(null);
	const logoInputRef = useRef(null);

	const navigationItems = [
		{ id: "overview", label: "Overview", icon: Building },
		{ id: "services", label: "Services", icon: DollarSign },
		{ id: "verifications", label: "Verifications", icon: Shield },
		{ id: "hours", label: "Business Hours", icon: Clock },
		{ id: "media", label: "Media Gallery", icon: Image },
		{ id: "reviews", label: "Reviews", icon: Star },
		{ id: "ai-insights", label: "AI Insights", icon: Sparkles },
		{ id: "elite-certification", label: "Elite Certification", icon: Award },
		{ id: "warranty-tracker", label: "Warranty Tracker", icon: Shield },
		{ id: "business-operations", label: "Business Operations", icon: Settings },
		{ id: "team", label: "Team", icon: Users },
		{ id: "partnerships", label: "Partnerships", icon: Handshake },
		{ id: "careers", label: "Careers", icon: Briefcase },
		{ id: "faq", label: "FAQ", icon: FileText },
		{ id: "settings", label: "Settings", icon: Settings },
	];

	const handleFeatureToggle = (featureKey) => {
		setProfile((prev) => ({
			...prev,
			features: {
				...prev.features,
				[featureKey]: {
					...prev.features[featureKey],
					enabled: !prev.features[featureKey].enabled,
				},
			},
		}));
	};

	const handleDragStart = (e, index) => {
		setDragIndex(index);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e, index) => {
		e.preventDefault();
		setDragOverIndex(index);
	};

	const handleDrop = (e, dropIndex) => {
		e.preventDefault();
		if (dragIndex === null || dragIndex === dropIndex) return;

		const featureKeys = Object.keys(profile.features);
		const draggedFeature = featureKeys[dragIndex];
		const newFeatures = { ...profile.features };

		// Reorder features
		const reorderedKeys = [...featureKeys];
		reorderedKeys.splice(dragIndex, 1);
		reorderedKeys.splice(dropIndex, 0, draggedFeature);

		// Update priorities
		reorderedKeys.forEach((key, index) => {
			newFeatures[key].priority = index + 1;
		});

		setProfile((prev) => ({
			...prev,
			features: newFeatures,
		}));

		setDragIndex(null);
		setDragOverIndex(null);
	};

	const handleLogoUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfile((prev) => ({
					...prev,
					logo: e.target.result,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handlePhotoUpload = (e) => {
		const files = Array.from(e.target.files);
		files.forEach((file) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfile((prev) => ({
					...prev,
					photos: [...prev.photos, e.target.result],
				}));
			};
			reader.readAsDataURL(file);
		});
	};

	const getVerificationIcon = (verified) => {
		return verified ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />;
	};

	const getVerificationStatus = (verification) => {
		if (verification.verified) return "Verified";
		if (verification.status === "pending") return "Pending Review";
		if (verification.status === "not_submitted") return "Not Submitted";
		return "Not Verified";
	};

	const getVerificationColor = (verification) => {
		if (verification.verified) return "text-green-600";
		if (verification.status === "pending") return "text-yellow-600";
		return "text-red-600";
	};

	const getVerificationBadgeVariant = (verification) => {
		if (verification.verified) return "default";
		if (verification.status === "pending") return "secondary";
		return "outline";
	};

	const getCategoryIcon = (category) => {
		const icons = {
			Plumbing: Wrench,
			Electrical: Zap,
			HVAC: Thermometer,
			Landscaping: Leaf,
			Cleaning: Sparkles,
			Restaurant: Utensils,
			Automotive: Car,
			Technology: Cpu,
			Health: Heart,
			Education: BookOpen,
			Entertainment: Music,
			Beauty: Scissors,
			Art: Palette,
			Construction: Hammer,
			General: Tool,
		};
		return icons[category] || Building;
	};

	const CategoryIcon = getCategoryIcon(profile.category);

	const renderSection = () => {
		switch (activeSection) {
			case "overview":
				return <OverviewSection profile={profile} setProfile={setProfile} isEditing={isEditing} CategoryIcon={CategoryIcon} logoInputRef={logoInputRef} handleLogoUpload={handleLogoUpload} />;
			case "services":
				return <ServicesSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "verifications":
				return <VerificationsSection profile={profile} setProfile={setProfile} isEditing={isEditing} getVerificationIcon={getVerificationIcon} getVerificationStatus={getVerificationStatus} getVerificationColor={getVerificationColor} getVerificationBadgeVariant={getVerificationBadgeVariant} setShowVerificationDialog={setShowVerificationDialog} setSelectedVerification={setSelectedVerification} />;
			case "hours":
				return <HoursSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "media":
				return <MediaSection profile={profile} setProfile={setProfile} isEditing={isEditing} fileInputRef={fileInputRef} handlePhotoUpload={handlePhotoUpload} />;
			case "reviews":
				return <ReviewsSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "ai-insights":
				return <AIInsightsSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "elite-certification":
				return <EliteCertificationSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "warranty-tracker":
				return <WarrantyTrackerSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "business-operations":
				return <BusinessOperationsSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "team":
				return <TeamSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "partnerships":
				return <PartnershipsSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "careers":
				return <CareersSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "faq":
				return <FAQSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "settings":
				return <SettingsSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			default:
				return <OverviewSection profile={profile} setProfile={setProfile} isEditing={isEditing} CategoryIcon={CategoryIcon} logoInputRef={logoInputRef} handleLogoUpload={handleLogoUpload} />;
		}
	};

	return (
		<div className="flex h-screen bg-background">
			{/* Sidebar */}
			<div className="w-64 bg-card border-r border-border flex flex-col">
				{/* Navigation */}
				<nav className="flex-1 p-4 space-y-1">
					{navigationItems.map((item) => {
						const Icon = item.icon;
						return (
							<button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
								<Icon className="w-4 h-4" />
								<span>{item.label}</span>
							</button>
						);
					})}
				</nav>

				{/* Profile Completion */}
				<div className="p-4 border-t border-border">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Profile Completion</span>
							<span className="font-medium">85%</span>
						</div>
						<Progress value={85} className="h-2" />
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Top Header */}
				<header className="bg-card border-b border-border px-6 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-foreground">{navigationItems.find((item) => item.id === activeSection)?.label}</h1>
							<p className="text-sm text-muted-foreground">Manage your business profile and showcase your services</p>
						</div>
						<div className="flex items-center space-x-2">
							<Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
								<Edit className="w-4 h-4 mr-2" />
								{isEditing ? "Cancel" : "Edit Profile"}
							</Button>
							{isEditing && (
								<Button>
									<Save className="w-4 h-4 mr-2" />
									Save Changes
								</Button>
							)}
						</div>
					</div>
				</header>

				{/* Content Area */}
				<main className="flex-1 overflow-y-auto p-6 bg-background">{renderSection()}</main>
			</div>
		</div>
	);
}

// Section Components
function OverviewSection({ profile, setProfile, isEditing, CategoryIcon, logoInputRef, handleLogoUpload }) {
	return (
		<div className="space-y-6">
			{/* Basic Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<CategoryIcon className="w-5 h-5" />
						<span>Basic Information</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Logo and Cover Photo */}
					<div className="flex items-start space-x-6">
						<div className="flex flex-col items-center space-y-2">
							<Avatar className="w-24 h-24">
								<AvatarImage src={profile.logo} />
								<AvatarFallback className="text-lg">
									{profile.name
										.split(" ")
										.map((word) => word[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							{isEditing && (
								<Button size="sm" variant="outline" onClick={() => logoInputRef.current?.click()}>
									<Upload className="w-4 h-4 mr-1" />
									Upload Logo
								</Button>
							)}
							<input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
						</div>
						<div className="flex-1 space-y-4">
							{isEditing ? (
								<>
									<Input value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} placeholder="Business Name" className="text-xl font-bold" />
									<Input value={profile.tagline} onChange={(e) => setProfile((prev) => ({ ...prev, tagline: e.target.value }))} placeholder="Tagline" className="text-muted-foreground" />
									<Textarea value={profile.description} onChange={(e) => setProfile((prev) => ({ ...prev, description: e.target.value }))} placeholder="Business Description" rows={4} />
								</>
							) : (
								<>
									<h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
									<p className="text-muted-foreground">{profile.tagline}</p>
									<p className="text-sm text-muted-foreground">{profile.description}</p>
								</>
							)}
						</div>
					</div>

					{/* Contact Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium">Phone</Label>
							{isEditing ? (
								<Input value={profile.phone} onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone Number" />
							) : (
								<div className="flex items-center space-x-2">
									<Phone className="w-4 h-4 text-muted-foreground" />
									<span className="text-foreground">{profile.phone}</span>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-medium">Email</Label>
							{isEditing ? (
								<Input value={profile.email} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email Address" />
							) : (
								<div className="flex items-center space-x-2">
									<Mail className="w-4 h-4 text-muted-foreground" />
									<span className="text-foreground">{profile.email}</span>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-medium">Website</Label>
							{isEditing ? (
								<Input value={profile.website} onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))} placeholder="Website URL" />
							) : (
								<div className="flex items-center space-x-2">
									<Globe className="w-4 h-4 text-muted-foreground" />
									<a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
										{profile.website}
									</a>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-medium">Address</Label>
							{isEditing ? (
								<Input value={profile.address} onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))} placeholder="Business Address" />
							) : (
								<div className="flex items-center space-x-2">
									<MapPin className="w-4 h-4 text-muted-foreground" />
									<span className="text-foreground">{profile.address}</span>
								</div>
							)}
						</div>
					</div>

					{/* Service Areas */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Service Areas</Label>
						{isEditing ? (
							<div className="flex flex-wrap gap-2">
								{profile.serviceAreas.map((area, index) => (
									<Badge key={index} variant="outline" className="flex items-center space-x-1">
										<span>{area}</span>
										<X
											className="w-3 h-3 cursor-pointer"
											onClick={() => {
												const newAreas = profile.serviceAreas.filter((_, i) => i !== index);
												setProfile((prev) => ({ ...prev, serviceAreas: newAreas }));
											}}
										/>
									</Badge>
								))}
								<Button size="sm" variant="outline">
									<Plus className="w-3 h-3 mr-1" />
									Add Area
								</Button>
							</div>
						) : (
							<div className="flex flex-wrap gap-2">
								{profile.serviceAreas.map((area, index) => (
									<Badge key={index} variant="outline">
										{area}
									</Badge>
								))}
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Business Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Star className="w-5 h-5 text-yellow-500" />
							<div>
								<div className="text-2xl font-bold text-foreground">{profile.rating}</div>
								<div className="text-sm text-muted-foreground">{profile.reviewCount} reviews</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Users className="w-5 h-5 text-blue-500" />
							<div>
								<div className="text-2xl font-bold text-foreground">{profile.employees}</div>
								<div className="text-sm text-muted-foreground">Employees</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Calendar className="w-5 h-5 text-green-500" />
							<div>
								<div className="text-2xl font-bold text-foreground">{profile.yearEstablished}</div>
								<div className="text-sm text-muted-foreground">Established</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Award className="w-5 h-5 text-purple-500" />
							<div>
								<div className="text-2xl font-bold text-foreground">{profile.certifications.length}</div>
								<div className="text-sm text-muted-foreground">Certifications</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

// Features Section
function FeaturesSection({ profile, setProfile, isEditing, handleFeatureToggle, handleDragStart, handleDragOver, handleDrop, dragIndex, dragOverIndex }) {
	const [expandedFeatures, setExpandedFeatures] = useState(new Set());
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");

	const toggleFeatureExpansion = (featureKey) => {
		const newExpanded = new Set(expandedFeatures);
		if (newExpanded.has(featureKey)) {
			newExpanded.delete(featureKey);
		} else {
			newExpanded.add(featureKey);
		}
		setExpandedFeatures(newExpanded);
	};

	const updateFeatureSetting = (featureKey, settingKey, value) => {
		setProfile((prev) => ({
			...prev,
			features: {
				...prev.features,
				[featureKey]: {
					...prev.features[featureKey],
					settings: {
						...prev.features[featureKey].settings,
						[settingKey]: value,
					},
				},
			},
		}));
	};

	// Available profile features that customers can see
	const availableFeatures = {
		menu: {
			icon: "🍽️",
			title: "Menu",
			description: "Display your menu, services, or product catalog",
			settings: {
				title: "Menu Title",
				description: "Brief description of your offerings",
				showPrices: true,
				showCategories: true,
				showImages: false,
			},
		},
		gallery: {
			icon: "📸",
			title: "Photo Gallery",
			description: "Showcase your work, products, or business photos",
			settings: {
				title: "Gallery Title",
				description: "What this gallery showcases",
				layout: "Grid",
				showCaptions: true,
				maxPhotos: 12,
			},
		},
		reviews: {
			icon: "⭐",
			title: "Customer Reviews",
			description: "Display customer testimonials and ratings",
			settings: {
				title: "Reviews",
				showRating: true,
				showDate: true,
				showResponse: true,
				maxReviews: 10,
			},
		},
		services: {
			icon: "🔧",
			title: "Services",
			description: "List your services with descriptions and pricing",
			settings: {
				title: "Our Services",
				showPricing: true,
				showDuration: false,
				showCategories: true,
			},
		},
		hours: {
			icon: "🕒",
			title: "Business Hours",
			description: "Show when you're open and available",
			settings: {
				title: "Hours of Operation",
				showToday: true,
				showHolidays: false,
				showSpecialHours: true,
			},
		},
		contact: {
			icon: "📞",
			title: "Contact Info",
			description: "Display phone, email, and contact methods",
			settings: {
				title: "Get in Touch",
				showPhone: true,
				showEmail: true,
				showAddress: true,
				showSocial: false,
			},
		},
		about: {
			icon: "ℹ️",
			title: "About Us",
			description: "Tell your story and share your background",
			settings: {
				title: "About Us",
				showTeam: false,
				showHistory: true,
				showMission: true,
			},
		},
		faq: {
			icon: "❓",
			title: "FAQ",
			description: "Answer common customer questions",
			settings: {
				title: "Frequently Asked Questions",
				showCategories: false,
				expandable: true,
			},
		},
		booking: {
			icon: "📅",
			title: "Online Booking",
			description: "Let customers book appointments online",
			settings: {
				title: "Book Appointment",
				showCalendar: true,
				showServices: true,
				requireDeposit: false,
			},
		},
		location: {
			icon: "📍",
			title: "Location & Map",
			description: "Show your location and service areas",
			settings: {
				title: "Find Us",
				showMap: true,
				showDirections: true,
				showServiceAreas: true,
			},
		},
		specials: {
			icon: "🎉",
			title: "Special Offers",
			description: "Highlight deals, discounts, and promotions",
			settings: {
				title: "Special Offers",
				showExpiry: true,
				showTerms: true,
				highlightNew: true,
			},
		},
		certifications: {
			icon: "🏆",
			title: "Certifications",
			description: "Display licenses, awards, and credentials",
			settings: {
				title: "Certifications & Awards",
				showBadges: true,
				showExpiry: false,
				showDescription: true,
			},
		},
	};

	const FeatureCard = ({ feature, isEnabled, onToggle, onExpand, isExpanded, isEditing, index }) => (
		<div className={`border rounded-lg transition-all ${dragIndex === index ? "opacity-50" : ""} ${dragOverIndex === index ? "border-primary bg-primary/5" : "border-border"}`} draggable={isEditing} onDragStart={(e) => handleDragStart(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDrop={(e) => handleDrop(e, index)}>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						{isEditing && <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />}
						<div className="text-2xl">{feature.icon}</div>
						<div className="flex-1">
							<div className="flex items-center space-x-2">
								<h4 className="font-medium text-foreground">{feature.title}</h4>
								<Badge variant={isEnabled ? "default" : "secondary"}>{isEnabled ? "Visible" : "Hidden"}</Badge>
							</div>
							<p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Switch checked={isEnabled} onCheckedChange={onToggle} disabled={!isEditing} />
						{isEnabled && (
							<Button variant="ghost" size="sm" onClick={onExpand} className="p-1">
								{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
							</Button>
						)}
					</div>
				</div>

				{isExpanded && isEnabled && (
					<div className="mt-4 p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border">
						<div className="flex items-center space-x-2 mb-4">
							<div className="w-2 h-2 bg-primary rounded-full" />
							<h5 className="font-semibold text-foreground">Display Settings</h5>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{Object.entries(feature.settings).map(([key, setting]) => (
								<div key={key} className="space-y-2">
									<Label className="text-sm font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
									{typeof setting === "boolean" ? (
										<Switch checked={setting} onCheckedChange={(value) => updateFeatureSetting(feature.key, key, value)} disabled={!isEditing} />
									) : typeof setting === "string" ? (
										<Input value={setting} onChange={(e) => updateFeatureSetting(feature.key, key, e.target.value)} disabled={!isEditing} className="w-full" />
									) : typeof setting === "number" ? (
										<Input type="number" value={setting} onChange={(e) => updateFeatureSetting(feature.key, key, parseInt(e.target.value))} disabled={!isEditing} className="w-full" />
									) : null}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Zap className="w-5 h-5" />
					<span>Profile Features</span>
				</CardTitle>
				<CardDescription>Choose what customers see on your business profile. Drag to reorder, toggle features on/off, and customize how they appear.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{Object.entries(availableFeatures).map(([key, feature], index) => {
						const isEnabled = profile.features[key]?.enabled || false;
						const isExpanded = expandedFeatures.has(key);

						return <FeatureCard key={key} feature={{ ...feature, key }} isEnabled={isEnabled} onToggle={() => handleFeatureToggle(key)} onExpand={() => toggleFeatureExpansion(key)} isExpanded={isExpanded} isEditing={isEditing} index={index} />;
					})}
				</div>

				{isEditing && (
					<div className="mt-6 p-4 border border-dashed border-border rounded-lg text-center">
						<p className="text-sm text-muted-foreground mb-2">💡 Tip: You can add any feature to your profile, even if it's not typical for your business type.</p>
						<p className="text-xs text-muted-foreground">For example, a plumber could add a "Menu" to showcase their service packages!</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// Services Section
function ServicesSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<DollarSign className="w-5 h-5" />
					<span>Services & Pricing</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{profile.services.map((service, index) => (
						<div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
							<div className="flex-1">
								<h4 className="font-medium text-foreground">{service.name}</h4>
								<p className="text-sm text-muted-foreground">{service.description}</p>
								<Badge variant="outline" className="mt-1">
									{service.category}
								</Badge>
							</div>
							<div className="text-right">
								<div className="font-bold text-green-600">{service.price}</div>
								{isEditing && (
									<Button size="sm" variant="outline" className="mt-2">
										<Edit className="w-3 h-3 mr-1" />
										Edit
									</Button>
								)}
							</div>
						</div>
					))}
					{isEditing && (
						<Button variant="outline" className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							Add Service
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

// Verifications Section
function VerificationsSection({ profile, setProfile, isEditing, getVerificationIcon, getVerificationStatus, getVerificationColor, getVerificationBadgeVariant, setShowVerificationDialog, setSelectedVerification }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Shield className="w-5 h-5" />
					<span>Verifications & Certifications</span>
				</CardTitle>
				<CardDescription>Verified credentials help build trust with customers</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{Object.entries(profile.verifications).map(([key, verification]) => (
						<div key={key} className="flex items-center justify-between p-4 border border-border rounded-lg">
							<div className="flex items-center space-x-3">
								{getVerificationIcon(verification.verified)}
								<div>
									<h4 className="font-medium capitalize text-foreground">{key.replace(/([A-Z])/g, " $1").trim()}</h4>
									<p className={`text-sm ${getVerificationColor(verification)}`}>
										{getVerificationStatus(verification)}
										{verification.date && ` • ${verification.date}`}
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								{verification.verified ? (
									<>
										{verification.document && (
											<Button size="sm" variant="outline">
												<Download className="w-4 h-4 mr-1" />
												View
											</Button>
										)}
										<Badge variant={getVerificationBadgeVariant(verification)} className="text-green-600">
											<CheckCircle className="w-3 h-3 mr-1" />
											Verified
										</Badge>
									</>
								) : (
									<Button
										size="sm"
										onClick={() => {
											setSelectedVerification({ key, verification });
											setShowVerificationDialog(true);
										}}
									>
										<Upload className="w-4 h-4 mr-1" />
										Upload Document
									</Button>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

// Hours Section
function HoursSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Clock className="w-5 h-5" />
					<span>Business Hours</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{Object.entries(profile.hours).map(([day, hours]) => (
						<div key={day} className="flex items-center justify-between p-3 border border-border rounded-lg">
							<div className="flex items-center space-x-3">
								<Switch
									checked={!hours.closed}
									onCheckedChange={(checked) => {
										setProfile((prev) => ({
											...prev,
											hours: {
												...prev.hours,
												[day]: { ...hours, closed: !checked },
											},
										}));
									}}
									disabled={!isEditing}
								/>
								<span className="font-medium capitalize w-20 text-foreground">{day}</span>
							</div>
							{hours.closed ? (
								<span className="text-muted-foreground">Closed</span>
							) : (
								<div className="flex items-center space-x-2">
									{isEditing ? (
										<>
											<Input
												value={hours.open}
												onChange={(e) => {
													setProfile((prev) => ({
														...prev,
														hours: {
															...prev.hours,
															[day]: { ...hours, open: e.target.value },
														},
													}));
												}}
												className="w-24"
											/>
											<span className="text-muted-foreground">to</span>
											<Input
												value={hours.close}
												onChange={(e) => {
													setProfile((prev) => ({
														...prev,
														hours: {
															...prev.hours,
															[day]: { ...hours, close: e.target.value },
														},
													}));
												}}
												className="w-24"
											/>
										</>
									) : (
										<span className="text-foreground">
											{hours.open} - {hours.close}
										</span>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

// Media Section
function MediaSection({ profile, setProfile, isEditing, fileInputRef, handlePhotoUpload }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Image className="w-5 h-5" />
					<span>Media Gallery</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Business Photos */}
					<div>
						<h4 className="font-medium mb-3 text-foreground">Business Photos</h4>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{profile.photos.map((photo, index) => (
								<div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted relative group">
									<img src={photo} alt={`Business photo ${index + 1}`} className="w-full h-full object-cover" />
									{isEditing && (
										<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
											<Button size="sm" variant="destructive">
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									)}
								</div>
							))}
							{isEditing && (
								<Button variant="outline" className="aspect-square flex flex-col items-center justify-center" onClick={() => fileInputRef.current?.click()}>
									<Upload className="w-8 h-8 mb-2" />
									<span className="text-sm">Add Photo</span>
								</Button>
							)}
							<input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Reviews Section
function ReviewsSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Star className="w-5 h-5" />
					<span>Customer Reviews</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{profile.recentReviews.map((review, index) => (
						<div key={index} className="p-4 border border-border rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center space-x-2">
									<span className="font-medium text-foreground">{review.author}</span>
									<div className="flex items-center space-x-1">
										{Array.from({ length: review.rating }).map((_, i) => (
											<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
										))}
									</div>
								</div>
								<span className="text-sm text-muted-foreground">{review.date}</span>
							</div>
							<p className="text-sm text-muted-foreground">{review.text}</p>
						</div>
					))}
					{isEditing && (
						<Button variant="outline" className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							Add Review
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

// AI Insights Section
function AIInsightsSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Sparkles className="w-5 h-5" />
					<span>AI Insights</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Summary</h4>
						<p className="text-sm text-muted-foreground">{profile.aiInsights.summary}</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Strengths</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							{profile.aiInsights.strengths.map((strength, index) => (
								<li key={index}>{strength}</li>
							))}
						</ul>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Trends</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							{profile.aiInsights.trends.map((trend, index) => (
								<li key={index}>{trend}</li>
							))}
						</ul>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Sentiment</h4>
						<p className="text-sm text-muted-foreground">{profile.aiInsights.sentiment}</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Confidence</h4>
						<p className="text-sm text-muted-foreground">{profile.aiInsights.confidence}%</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Elite Certification Section
function EliteCertificationSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Award className="w-5 h-5" />
					<span>Elite Certification</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">{profile.eliteCertification.status}</h4>
						<p className="text-sm text-muted-foreground">{profile.eliteCertification.description}</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Acceptance Rate</h4>
						<p className="text-sm text-muted-foreground">{profile.eliteCertification.acceptanceRate}</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Process Duration</h4>
						<p className="text-sm text-muted-foreground">{profile.eliteCertification.processDuration}</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Customer Interviews</h4>
						<p className="text-sm text-muted-foreground">{profile.eliteCertification.customerInterviews}</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Satisfaction Rate</h4>
						<p className="text-sm text-muted-foreground">{profile.eliteCertification.satisfactionRate}</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Benefits</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							{profile.eliteCertification.benefits.map((benefit, index) => (
								<li key={index}>{benefit}</li>
							))}
						</ul>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Vetting Process</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							{profile.eliteCertification.vettingProcess.map((step, index) => (
								<li key={index}>{step}</li>
							))}
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Warranty Tracker Section
function WarrantyTrackerSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Shield className="w-5 h-5" />
					<span>Warranty Tracker</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Coverage</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							<li>
								{profile.warrantyTracker.coverage.workmanship.duration} - {profile.warrantyTracker.coverage.workmanship.description}
							</li>
							<li>
								{profile.warrantyTracker.coverage.materials.duration} - {profile.warrantyTracker.coverage.materials.description}
							</li>
							<li>
								{profile.warrantyTracker.coverage.labor.duration} - {profile.warrantyTracker.coverage.labor.description}
							</li>
						</ul>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Active Warranties</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							{profile.warrantyTracker.activeWarranties.map((warranty, index) => (
								<li key={index}>
									{warranty.service} - {warranty.description} ({warranty.status})
								</li>
							))}
						</ul>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Claims History</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							{profile.warrantyTracker.claimsHistory.map((claim, index) => (
								<li key={index}>
									{claim.service} - {claim.description} ({claim.status})
								</li>
							))}
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Business Operations Section
function BusinessOperationsSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Settings className="w-5 h-5" />
					<span>Business Operations</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Response Time</h4>
						<p className="text-sm text-muted-foreground">{profile.businessOperations.responseTime}</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Response Rate</h4>
						<p className="text-sm text-muted-foreground">{profile.businessOperations.responseRate}</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Service Area</h4>
						<p className="text-sm text-muted-foreground">
							{profile.businessOperations.serviceArea.primary} ({profile.businessOperations.serviceArea.coverage})
						</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Why Choose Us</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							{profile.businessOperations.whyChooseUs.map((reason, index) => (
								<li key={index}>{reason}</li>
							))}
						</ul>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Pricing</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							<li>
								{profile.businessOperations.pricing.standardRate} - {profile.businessOperations.pricing.emergencyRate} (Minimum Charge: {profile.businessOperations.pricing.minimumCharge})
							</li>
							<li>{profile.businessOperations.pricing.complementaryServices.join(", ")}</li>
							<li>{profile.businessOperations.pricing.discounts.map((discount) => `${discount.name} - ${discount.amount} (${discount.description})`).join(", ")}</li>
							<li>{profile.businessOperations.pricing.paymentTerms.join(", ")}</li>
							<li>
								{profile.businessOperations.pricing.financing.provider} - {profile.businessOperations.pricing.financing.minimumAmount} ({profile.businessOperations.pricing.financing.terms})
							</li>
							<li>{profile.businessOperations.pricing.acceptedMethods.join(", ")}</li>
						</ul>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Cost Breakdown</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							<li>{profile.businessOperations.costBreakdown.labor}% Labor</li>
							<li>{profile.businessOperations.costBreakdown.materials}% Materials</li>
							<li>{profile.businessOperations.costBreakdown.insurance}% Insurance</li>
							<li>{profile.businessOperations.costBreakdown.overhead}% Overhead</li>
						</ul>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Quality Assurance</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							{profile.businessOperations.qualityAssurance.map((check) => (
								<li key={check}>{check}</li>
							))}
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Team Section
function TeamSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Users className="w-5 h-5" />
					<span>Team</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{profile.team.map((member, index) => (
						<div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
							<div className="flex-1">
								<h4 className="font-medium text-foreground">{member.name}</h4>
								<p className="text-sm text-muted-foreground">{member.position}</p>
								<p className="text-sm text-muted-foreground">{member.experience}</p>
								<p className="text-sm text-muted-foreground">{member.specializations.join(", ")}</p>
							</div>
							{isEditing && (
								<div className="flex items-center space-x-2">
									<Button size="sm" variant="outline">
										<Edit className="w-3 h-3 mr-1" />
										Edit
									</Button>
									<Button size="sm" variant="outline">
										<Trash2 className="w-3 h-3 mr-1" />
										Delete
									</Button>
								</div>
							)}
						</div>
					))}
					{isEditing && (
						<Button variant="outline" className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							Add Team Member
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

// Partnerships Section
function PartnershipsSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Handshake className="w-5 h-5" />
					<span>Partnerships</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Supplier Partnerships</h4>
						<p className="text-sm text-muted-foreground">We partner with leading suppliers to provide quality materials and equipment.</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Contractor Partnerships</h4>
						<p className="text-sm text-muted-foreground">Collaborating with other contractors for large-scale projects.</p>
					</div>
					<div className="p-4 border border-border rounded-lg">
						<h4 className="font-medium mb-2 text-foreground">Benefits</h4>
						<ul className="list-disc pl-6 text-sm text-muted-foreground">
							{profile.partnerships.benefits.map((benefit, index) => (
								<li key={index}>{benefit}</li>
							))}
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Careers Section
function CareersSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Briefcase className="w-5 h-5" />
					<span>Careers</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{profile.careers.openings.map((opening, index) => (
						<div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
							<div className="flex-1">
								<h4 className="font-medium text-foreground">{opening.title}</h4>
								<p className="text-sm text-muted-foreground mb-2">{opening.description}</p>
								<p className="text-sm text-muted-foreground">
									{opening.type} - {opening.location}
								</p>
								<p className="text-sm text-muted-foreground">{opening.experience} experience</p>
								<p className="text-sm text-muted-foreground">{opening.salary}</p>
							</div>
							{isEditing && (
								<div className="flex items-center space-x-2">
									<Button size="sm" variant="outline">
										<Edit className="w-3 h-3 mr-1" />
										Edit
									</Button>
									<Button size="sm" variant="outline">
										<Trash2 className="w-3 h-3 mr-1" />
										Delete
									</Button>
								</div>
							)}
						</div>
					))}
					{isEditing && (
						<Button variant="outline" className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							Add Job Opening
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

// FAQ Section
function FAQSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<FileText className="w-5 h-5" />
					<span>FAQ</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{profile.faq.map((question, index) => (
						<div key={index} className="p-4 border border-border rounded-lg">
							<h4 className="font-medium mb-2 text-foreground">{question.question}</h4>
							<p className="text-sm text-muted-foreground">{question.answer}</p>
						</div>
					))}
					{isEditing && (
						<Button variant="outline" className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							Add Question
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

// Settings Section
function SettingsSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Settings className="w-5 h-5" />
					<span>Profile Settings</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="font-medium text-foreground">Profile Visibility</h4>
							<p className="text-sm text-muted-foreground">Make your profile visible to customers</p>
						</div>
						<Switch defaultChecked />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
