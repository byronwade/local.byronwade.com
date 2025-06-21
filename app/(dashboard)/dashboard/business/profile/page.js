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

// Section Components
import OverviewSection from "./sections/OverviewSection";
import ServicesSection from "./sections/ServicesSection";
import VerificationsSection from "./sections/VerificationsSection";
import HoursSection from "./sections/HoursSection";
import MediaSection from "./sections/MediaSection";
import ReviewsSection from "./sections/ReviewsSection";
import TeamSection from "./sections/TeamSection";
import PartnershipsSection from "./sections/PartnershipsSection";
import CareersSection from "./sections/CareersSection";
import FAQSection from "./sections/FAQSection";
import SettingsSection from "./sections/SettingsSection";

export default function BusinessProfile() {
	const [profile, setProfile] = useState({
		// Basic Information
		name: "Wade's Plumbing & Septic",
		tagline: "Professional Plumbing & Septic Services",
		description: "Family-owned plumbing and septic service company serving the local community for over 15 years. We provide reliable, professional service with a focus on customer satisfaction.",
		logo: "/placeholder.svg",
		coverPhoto: "/placeholder.svg",
		category: "Plumbing",
		phone: "(555) 123-4567",
		email: "info@wadesplumbing.com",
		website: "https://wadesplumbing.com",
		address: "123 Main Street, Anytown, ST 12345",
		serviceAreas: ["Anytown", "Somewhere", "Elsewhere", "Downtown"],
		rating: 4.8,
		reviewCount: 127,
		employees: 12,
		yearEstablished: 2008,

		// Services
		services: [
			{
				id: 1,
				name: "Emergency Plumbing",
				description: "24/7 emergency plumbing services",
				price: "From $150",
				duration: "1-3 hours",
				category: "Emergency",
			},
			{
				id: 2,
				name: "Septic Tank Pumping",
				description: "Professional septic tank cleaning and maintenance",
				price: "$250",
				duration: "2-4 hours",
				category: "Maintenance",
			},
			{
				id: 3,
				name: "Pipe Repair",
				description: "Leak detection and pipe repair services",
				price: "From $100",
				duration: "1-2 hours",
				category: "Repair",
			},
			{
				id: 4,
				name: "Drain Cleaning",
				description: "Professional drain cleaning and unclogging",
				price: "$120",
				duration: "1 hour",
				category: "Maintenance",
			},
		],

		// Verifications
		verifications: [
			{
				id: 1,
				type: "License",
				status: "verified",
				title: "Plumbing License",
				number: "PL-12345",
				expiryDate: "2025-12-31",
				verifiedDate: "2024-01-15",
			},
			{
				id: 2,
				type: "Insurance",
				status: "verified",
				title: "General Liability Insurance",
				number: "GLI-67890",
				expiryDate: "2024-12-31",
				verifiedDate: "2024-01-15",
			},
			{
				id: 3,
				type: "Bonding",
				status: "verified",
				title: "Surety Bond",
				number: "SB-11111",
				expiryDate: "2024-12-31",
				verifiedDate: "2024-01-15",
			},
			{
				id: 4,
				type: "Certification",
				status: "pending",
				title: "Green Plumber Certification",
				number: "GP-22222",
				expiryDate: "2025-06-30",
				submittedDate: "2024-01-20",
			},
		],

		// Business Hours
		hours: {
			monday: { open: "8:00 AM", close: "6:00 PM", closed: false },
			tuesday: { open: "8:00 AM", close: "6:00 PM", closed: false },
			wednesday: { open: "8:00 AM", close: "6:00 PM", closed: false },
			thursday: { open: "8:00 AM", close: "6:00 PM", closed: false },
			friday: { open: "8:00 AM", close: "6:00 PM", closed: false },
			saturday: { open: "9:00 AM", close: "4:00 PM", closed: false },
			sunday: { open: "", close: "", closed: true },
			holidays: "Closed on major holidays",
			emergency: "24/7 emergency service available",
		},

		// Media Gallery
		media: [
			{
				id: 1,
				type: "image",
				url: "/placeholder.svg",
				title: "Plumbing Work",
				description: "Professional plumbing installation",
				uploadDate: "2024-01-15",
			},
			{
				id: 2,
				type: "image",
				url: "/placeholder.svg",
				title: "Septic Service",
				description: "Septic tank maintenance",
				uploadDate: "2024-01-10",
			},
			{
				id: 3,
				type: "video",
				url: "/welding.mp4",
				title: "Service Overview",
				description: "Overview of our services",
				uploadDate: "2024-01-05",
			},
		],

		// Reviews
		reviews: [
			{
				id: 1,
				author: "John Smith",
				rating: 5,
				title: "Excellent Service",
				content: "Wade's Plumbing provided excellent service. They were professional, on time, and fixed our issue quickly.",
				date: "2024-01-15",
				verified: true,
			},
			{
				id: 2,
				author: "Sarah Johnson",
				rating: 5,
				title: "Highly Recommend",
				content: "Great experience with their septic service. Fair pricing and professional work.",
				date: "2024-01-10",
				verified: true,
			},
			{
				id: 3,
				author: "Mike Davis",
				rating: 4,
				title: "Good Work",
				content: "They did a good job fixing our plumbing issue. Would use them again.",
				date: "2024-01-05",
				verified: false,
			},
		],

		// Team
		team: [
			{
				id: 1,
				name: "Wade Johnson",
				position: "Owner & Master Plumber",
				photo: "/placeholder.svg",
				bio: "With over 20 years of experience in plumbing, Wade leads our team with expertise and dedication to quality service.",
				email: "wade@wadesplumbing.com",
				phone: "(555) 123-4567",
			},
			{
				id: 2,
				name: "Tom Wilson",
				position: "Senior Plumber",
				photo: "/placeholder.svg",
				bio: "Tom has been with us for 8 years and specializes in emergency repairs and new installations.",
				email: "tom@wadesplumbing.com",
				phone: "(555) 123-4568",
			},
			{
				id: 3,
				name: "Lisa Chen",
				position: "Customer Service Manager",
				photo: "/placeholder.svg",
				bio: "Lisa ensures every customer receives excellent service and manages our scheduling and communications.",
				email: "lisa@wadesplumbing.com",
				phone: "(555) 123-4569",
			},
		],

		// Partnerships
		partnerships: [
			{
				id: 1,
				name: "Local Hardware Store",
				type: "Supplier",
				description: "Preferred supplier for plumbing parts and materials",
				logo: "/placeholder.svg",
				website: "https://localhardware.com",
			},
			{
				id: 2,
				name: "City Building Department",
				type: "Government",
				description: "Licensed contractor for city projects",
				logo: "/placeholder.svg",
				website: "https://city.gov",
			},
			{
				id: 3,
				name: "Emergency Response Team",
				type: "Service",
				description: "Partner for emergency plumbing services",
				logo: "/placeholder.svg",
				website: "https://emergencyresponse.com",
			},
		],

		// Careers
		careers: {
			description: "Join our growing team of professionals. We offer competitive pay, benefits, and opportunities for advancement.",
			positions: [
				{
					id: 1,
					title: "Licensed Plumber",
					type: "Full-time",
					location: "Anytown, ST",
					salary: "$25-35/hour",
					description: "We're looking for an experienced licensed plumber to join our team.",
					requirements: ["Valid plumbing license", "3+ years experience", "Clean driving record", "Excellent customer service skills"],
					benefits: ["Health insurance", "Paid time off", "401(k) matching", "Company vehicle"],
				},
				{
					id: 2,
					title: "Apprentice Plumber",
					type: "Full-time",
					location: "Anytown, ST",
					salary: "$18-25/hour",
					description: "Great opportunity to learn the trade with our experienced team.",
					requirements: ["High school diploma", "Willingness to learn", "Physical fitness", "Reliable transportation"],
					benefits: ["Training provided", "Health insurance", "Paid time off", "Career advancement"],
				},
			],
			contact: {
				email: "careers@wadesplumbing.com",
				phone: "(555) 123-4570",
				address: "123 Main Street, Anytown, ST 12345",
			},
		},

		// FAQ
		faq: [
			{
				id: 1,
				question: "Do you offer emergency services?",
				answer: "Yes, we provide 24/7 emergency plumbing services. Call us anytime for urgent plumbing issues.",
			},
			{
				id: 2,
				question: "What areas do you serve?",
				answer: "We serve Anytown, Somewhere, Elsewhere, and Downtown areas. Contact us to confirm service availability.",
			},
			{
				id: 3,
				question: "Are you licensed and insured?",
				answer: "Yes, we are fully licensed, bonded, and insured. All our work is guaranteed.",
			},
			{
				id: 4,
				question: "How much do your services cost?",
				answer: "Our pricing varies based on the service needed. We provide free estimates and transparent pricing.",
			},
			{
				id: 5,
				question: "Do you offer warranties?",
				answer: "Yes, we offer warranties on all our work and parts. Contact us for specific warranty details.",
			},
		],

		// Settings
		settings: {
			notifications: {
				email: true,
				sms: true,
				push: false,
			},
			privacy: {
				showPhone: true,
				showEmail: true,
				showAddress: true,
				showReviews: true,
			},
			integrations: {
				googleMyBusiness: true,
				facebook: true,
				yelp: false,
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
			General: Settings,
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
