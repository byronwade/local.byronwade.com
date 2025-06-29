"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Progress } from "@components/ui/progress";
import { Separator } from "@components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
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
	MessageSquare,
	UserCheck,
} from "lucide-react";
import { toast } from "@components/ui/use-toast";

// Section Components
import OverviewSection from "./sections/OverviewSection";
import ServicesSection from "./sections/ServicesSection";
// Removed old VerificationsSection import - now inline
import HoursSection from "./sections/HoursSection";
import MediaSection from "./sections/MediaSection";
import TeamSection from "./sections/TeamSection";
import PartnershipsSection from "./sections/PartnershipsSection";
import CareersSection from "./sections/CareersSection";
import FAQSection from "./sections/FAQSection";
import SettingsSection from "./sections/SettingsSection";

export default function BusinessProfile() {
	const [quickAddForm, setQuickAddForm] = useState({
		name: "",
		price: "",
		category: "General",
	});

	useEffect(() => {
		document.title = "Business Profile - Dashboard - Thorbis";
	}, []);

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

		// Thorbis Business Verification System
		thorbisVerification: {
			overallStatus: "in_progress", // not_started, in_progress, under_review, verified, rejected
			submittedDate: "2024-01-20",
			lastUpdated: "2024-01-22",
			verificationId: "THB-2024-001234",
			assignedReviewer: "Sarah Mitchell",
			estimatedCompletion: "2024-02-05",

			// Verification Steps
			steps: [
				{
					id: "business_documents",
					title: "Business Documentation",
					description: "Business license, registration, and legal documents",
					status: "completed", // not_started, in_progress, completed, rejected
					required: true,
					completedDate: "2024-01-20",
					documents: [
						{ name: "Business License", status: "verified", uploadDate: "2024-01-20" },
						{ name: "State Registration", status: "verified", uploadDate: "2024-01-20" },
						{ name: "Tax ID Documentation", status: "verified", uploadDate: "2024-01-20" },
					],
				},
				{
					id: "insurance_bonding",
					title: "Insurance & Bonding",
					description: "Liability insurance, bonding, and coverage verification",
					status: "completed",
					required: true,
					completedDate: "2024-01-21",
					documents: [
						{ name: "General Liability Insurance", status: "verified", uploadDate: "2024-01-21" },
						{ name: "Workers Compensation", status: "verified", uploadDate: "2024-01-21" },
						{ name: "Surety Bond", status: "verified", uploadDate: "2024-01-21" },
					],
				},
				{
					id: "professional_licenses",
					title: "Professional Licenses",
					description: "Trade licenses, certifications, and professional credentials",
					status: "in_progress",
					required: true,
					documents: [
						{ name: "Master Plumber License", status: "under_review", uploadDate: "2024-01-22" },
						{ name: "Septic System License", status: "pending_upload" },
						{ name: "Backflow Prevention Certification", status: "pending_upload" },
					],
				},
				{
					id: "business_verification",
					title: "Business Address & Contact",
					description: "Physical address verification and contact information validation",
					status: "pending",
					required: true,
					notes: "Address verification scheduled for 2024-01-25",
				},
				{
					id: "background_check",
					title: "Background Verification",
					description: "Owner background check and business history review",
					status: "pending",
					required: true,
					notes: "Pending completion of previous steps",
				},
				{
					id: "reference_check",
					title: "References & Reviews",
					description: "Customer references and work history verification",
					status: "not_started",
					required: false,
					notes: "Optional but recommended for enhanced verification",
				},
			],

			// Communication Log
			communications: [
				{
					id: 1,
					date: "2024-01-22",
					type: "update",
					from: "Sarah Mitchell",
					subject: "Professional License Review",
					message: "Your Master Plumber License is currently under review. We may need additional documentation for the expiration date verification.",
					read: false,
				},
				{
					id: 2,
					date: "2024-01-21",
					type: "approval",
					from: "System",
					subject: "Insurance Documents Approved",
					message: "All insurance and bonding documents have been verified and approved.",
					read: true,
				},
				{
					id: 3,
					date: "2024-01-20",
					type: "welcome",
					from: "Thorbis Verification Team",
					subject: "Verification Process Started",
					message: "Welcome to Thorbis! Your business verification process has begun. We'll keep you updated on each step.",
					read: true,
				},
			],
		},

		// Business Hours
		hours: {
			monday: { open: "08:00", close: "17:00", isOpen: true },
			tuesday: { open: "08:00", close: "17:00", isOpen: true },
			wednesday: { open: "08:00", close: "17:00", isOpen: true },
			thursday: { open: "08:00", close: "17:00", isOpen: true },
			friday: { open: "08:00", close: "17:00", isOpen: true },
			saturday: { open: "09:00", close: "15:00", isOpen: true },
			sunday: { open: "", close: "", isOpen: false },
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
				role: "Owner & Master Plumber",
				photo: "/placeholder.svg",
				bio: "20+ years of plumbing experience",
				certifications: ["Master Plumber License", "Septic System Installer"],
			},
			{
				id: 2,
				name: "Sarah Johnson",
				role: "Office Manager",
				photo: "/placeholder.svg",
				bio: "Handles scheduling and customer service",
				certifications: [],
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
				email: "orders@localhardware.com",
				phone: "(555) 987-6543",
				address: "456 Hardware Ave, Anytown, ST 12345",
				startDate: "2023-01-15",
				status: "verified",
				benefits: "Priority pricing and same-day delivery",
				notes: "Primary supplier for all plumbing materials",
				verification: {
					status: "verified",
					submittedDate: "2023-01-15",
					verifiedDate: "2023-01-20",
					verificationId: "PV-2023-001",
					steps: [
						{
							id: "contact_verification",
							title: "Contact Verification",
							description: "Verify partner contact information",
							status: "completed",
							required: true,
						},
						{
							id: "document_verification",
							title: "Document Verification",
							description: "Upload partnership agreement or contract",
							status: "completed",
							required: true,
						},
						{
							id: "reference_check",
							title: "Reference Check",
							description: "Verify partnership references",
							status: "completed",
							required: false,
						},
					],
					documents: [
						{
							id: 1,
							name: "Supply Agreement.pdf",
							size: 245760,
							type: "application/pdf",
							uploadDate: "2023-01-15",
							status: "verified",
						},
					],
					communications: [],
				},
			},
			{
				id: 2,
				name: "City Building Department",
				type: "Government",
				description: "Licensed contractor for city projects",
				logo: "/placeholder.svg",
				website: "https://city.gov",
				email: "permits@city.gov",
				phone: "(555) 123-4567",
				address: "789 City Hall, Anytown, ST 12345",
				startDate: "2022-06-01",
				status: "verified",
				benefits: "Expedited permit processing and project approvals",
				notes: "Preferred contractor for municipal plumbing projects",
				verification: {
					status: "verified",
					submittedDate: "2022-06-01",
					verifiedDate: "2022-06-10",
					verificationId: "PV-2022-001",
					steps: [
						{
							id: "contact_verification",
							title: "Contact Verification",
							description: "Verify partner contact information",
							status: "completed",
							required: true,
						},
						{
							id: "document_verification",
							title: "Document Verification",
							description: "Upload partnership agreement or contract",
							status: "completed",
							required: true,
						},
						{
							id: "reference_check",
							title: "Reference Check",
							description: "Verify partnership references",
							status: "completed",
							required: false,
						},
					],
					documents: [
						{
							id: 1,
							name: "City Contractor License.pdf",
							size: 189440,
							type: "application/pdf",
							uploadDate: "2022-06-01",
							status: "verified",
						},
					],
					communications: [],
				},
			},
			{
				id: 3,
				name: "Emergency Response Team",
				type: "Service Provider",
				description: "Partner for emergency plumbing services",
				logo: "/placeholder.svg",
				website: "https://emergencyresponse.com",
				email: "dispatch@emergencyresponse.com",
				phone: "(555) 911-0000",
				address: "321 Emergency Lane, Anytown, ST 12345",
				startDate: "2023-03-20",
				status: "pending",
				benefits: "24/7 emergency coordination and backup support",
				notes: "Critical partner for after-hours emergency calls",
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
	const [isClient, setIsClient] = useState(false);
	const [dragIndex, setDragIndex] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);
	// Removed unused service filtering/sorting state variables
	const [showVerificationDialog, setShowVerificationDialog] = useState(false);
	const [selectedVerification, setSelectedVerification] = useState(null);
	const fileInputRef = useRef(null);
	const logoInputRef = useRef(null);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const navigationItems = [
		{ id: "overview", label: "Overview", icon: Building },
		{ id: "services", label: "Services", icon: DollarSign },
		{ id: "verifications", label: "Verifications", icon: Shield },
		{ id: "elite", label: "Thorbis Elite", icon: Award },
		{ id: "hours", label: "Business Hours", icon: Clock },
		{ id: "media", label: "Media Gallery", icon: Image },
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

	const handleSaveProfile = () => {
		toast({
			title: "Profile Updated",
			description: "Your business profile has been updated successfully.",
		});
		setIsEditing(false);
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

	const serviceCategories = ["Emergency", "Maintenance", "Repair", "Installation", "Inspection", "Consultation", "Training", "Design", "Delivery", "Event", "Wellness", "Creative", "General"];

	const addService = () => {
		if (profile.services.length >= 30) {
			toast({
				title: "Maximum Services Reached",
				description: "You can only add up to 30 services.",
				variant: "destructive",
			});
			return;
		}

		// Get values from form inputs
		const nameInput = document.getElementById("quick-service-name");
		const priceInput = document.getElementById("quick-service-price");
		const categorySelect = document.querySelector("[data-radix-collection-item]"); // This is a simplification for demo

		const serviceName = nameInput?.value?.trim() || "";
		const servicePrice = priceInput?.value?.trim() || "";

		if (!serviceName) {
			toast({
				title: "Service Name Required",
				description: "Please enter a service name.",
				variant: "destructive",
			});
			return;
		}

		const newService = {
			id: Date.now(),
			name: serviceName,
			description: "",
			price: servicePrice,
			duration: "",
			category: categorySelect?.value || "General",
			featured: false,
			active: true,
			order: profile.services.length + 1,
		};
		setProfile((prev) => ({
			...prev,
			services: [...prev.services, newService],
		}));

		// Clear form
		setQuickAddForm({
			name: "",
			price: "",
			category: "General",
		});

		toast({
			title: "Service Added",
			description: `${newService.name} has been added to your services.`,
		});
	};

	const removeService = (serviceId) => {
		setProfile((prev) => ({
			...prev,
			services: prev.services.filter((service) => service.id !== serviceId),
		}));
	};

	const updateService = (serviceId, field, value) => {
		setProfile((prev) => ({
			...prev,
			services: prev.services.map((service) => (service.id === serviceId ? { ...service, [field]: value } : service)),
		}));
	};

	const addTeamMember = () => {
		const newMember = {
			id: Date.now(),
			name: "",
			role: "",
			photo: "/placeholder.svg",
			bio: "",
			certifications: [],
		};
		setProfile((prev) => ({
			...prev,
			team: [...prev.team, newMember],
		}));
	};

	const removeTeamMember = (memberId) => {
		setProfile((prev) => ({
			...prev,
			team: prev.team.filter((member) => member.id !== memberId),
		}));
	};

	const updateTeamMember = (memberId, field, value) => {
		setProfile((prev) => ({
			...prev,
			team: prev.team.map((member) => (member.id === memberId ? { ...member, [field]: value } : member)),
		}));
	};

	// Removed unused service management functions (duplicateService, toggleServiceStatus, reorderServices, getFilteredAndSortedServices)

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
				return null; // Will be replaced with inline verification section
			case "elite":
				return null; // Elite content is handled inline below
			case "hours":
				return <HoursSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "media":
				return <MediaSection profile={profile} setProfile={setProfile} isEditing={isEditing} fileInputRef={fileInputRef} handlePhotoUpload={handlePhotoUpload} />;
			case "team":
				return <TeamSection profile={profile} setProfile={setProfile} isEditing={isEditing} />;
			case "partnerships":
				return <PartnershipsSection profile={profile} setProfile={setProfile} />;
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
		<div className="px-4 py-16 space-y-8 w-full lg:px-24">
			<div className="grid gap-2 w-full">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-4xl">Business Profile</h1>
						<p className="text-muted-foreground">Manage your business profile and showcase your services.</p>
					</div>
				</div>
			</div>

			<div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
				{/* Sidebar Navigation */}
				<nav className="grid gap-4 text-sm text-muted-foreground">
					{navigationItems.map((item) => {
						const IconComponent = item.icon;
						return (
							<button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${activeSection === item.id ? "font-semibold text-primary bg-primary/5 border border-primary/20" : "hover:text-foreground hover:bg-muted"}`}>
								<IconComponent className="w-4 h-4" />
								<span>{item.label}</span>
							</button>
						);
					})}
				</nav>

				{/* Main Content */}
				<div className="grid gap-6">
					{/* Overview Section */}
					{activeSection === "overview" && (
						<>
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Basic Information</CardTitle>
									<CardDescription>Update your business basic information and contact details.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center space-x-4">
										<Avatar className="w-20 h-20">
											<AvatarImage src={profile.logo} alt={profile.name} />
											<AvatarFallback>
												<Building className="w-8 h-8" />
											</AvatarFallback>
										</Avatar>
										<div className="space-y-2">
											<Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>
												<Upload className="mr-2 w-4 h-4" />
												Upload Logo
											</Button>
											<input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
											<p className="text-xs text-muted-foreground">JPG, PNG up to 2MB</p>
										</div>
									</div>
									<div>
										<Label htmlFor="businessName">Business Name</Label>
										<Input id="businessName" value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} suppressHydrationWarning />
									</div>
									<div>
										<Label htmlFor="tagline">Tagline</Label>
										<Input id="tagline" value={profile.tagline} onChange={(e) => setProfile((prev) => ({ ...prev, tagline: e.target.value }))} placeholder="Brief description of your business" suppressHydrationWarning />
									</div>
									<div>
										<Label htmlFor="description">Description</Label>
										<Textarea id="description" value={profile.description} onChange={(e) => setProfile((prev) => ({ ...prev, description: e.target.value }))} placeholder="Detailed description of your business..." rows={3} suppressHydrationWarning />
									</div>
									<div>
										<Label htmlFor="category">Category</Label>
										<Input id="category" value={profile.category} onChange={(e) => setProfile((prev) => ({ ...prev, category: e.target.value }))} suppressHydrationWarning />
									</div>
								</CardContent>
								<CardFooter className="px-6 py-4 border-t">
									<Button onClick={handleSaveProfile}>Save Changes</Button>
								</CardFooter>
							</Card>

							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Contact Information</CardTitle>
									<CardDescription>Your business contact details and location.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Label htmlFor="phone">Phone Number</Label>
										<Input id="phone" type="tel" value={profile.phone} onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))} suppressHydrationWarning />
									</div>
									<div>
										<Label htmlFor="email">Email Address</Label>
										<Input id="email" type="email" value={profile.email} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} suppressHydrationWarning />
									</div>
									<div>
										<Label htmlFor="website">Website</Label>
										<Input id="website" type="url" value={profile.website} onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))} suppressHydrationWarning />
									</div>
									<div>
										<Label htmlFor="address">Business Address</Label>
										<Input id="address" value={profile.address} onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))} suppressHydrationWarning />
									</div>
								</CardContent>
								<CardFooter className="px-6 py-4 border-t">
									<Button onClick={handleSaveProfile}>Save Changes</Button>
								</CardFooter>
							</Card>

							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Business Statistics</CardTitle>
									<CardDescription>Key information about your business.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="yearEstablished">Year Established</Label>
											<Input id="yearEstablished" type="number" value={profile.yearEstablished} onChange={(e) => setProfile((prev) => ({ ...prev, yearEstablished: parseInt(e.target.value) }))} suppressHydrationWarning />
										</div>
										<div>
											<Label htmlFor="employees">Number of Employees</Label>
											<Input id="employees" type="number" value={profile.employees} onChange={(e) => setProfile((prev) => ({ ...prev, employees: parseInt(e.target.value) }))} suppressHydrationWarning />
										</div>
									</div>
									<div className="flex justify-between items-center p-4 rounded-lg border border-border">
										<div className="flex items-center space-x-2">
											<Star className="w-5 h-5 text-yellow-500" />
											<span className="font-medium">{profile.rating} Star Rating</span>
										</div>
										<Badge variant="secondary">{profile.reviewCount} Reviews</Badge>
									</div>
								</CardContent>
								<CardFooter className="px-6 py-4 border-t">
									<Button onClick={handleSaveProfile}>Save Changes</Button>
								</CardFooter>
							</Card>
						</>
					)}

					{/* Services Section */}
					{activeSection === "services" && isClient && (
						<>
							{/* Services Overview & Quick Add */}
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle className="flex items-center space-x-2">
										<Wrench className="w-5 h-5" />
										<span>Services ({profile.services.length}/30)</span>
									</CardTitle>
									<CardDescription>Add and manage your business services</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Quick Add Service Form */}
									<div className="p-4 rounded-lg border bg-muted/20">
										<div className="grid grid-cols-1 gap-3 mb-4 md:grid-cols-3">
											<div className="space-y-1">
												<Label className="text-sm">Service Name</Label>
												<Input placeholder="e.g., Emergency Plumbing" value={quickAddForm.name} onChange={(e) => setQuickAddForm((prev) => ({ ...prev, name: e.target.value }))} />
											</div>
											<div className="space-y-1">
												<Label className="text-sm">Price (Optional)</Label>
												<Input placeholder="e.g., $150" value={quickAddForm.price} onChange={(e) => setQuickAddForm((prev) => ({ ...prev, price: e.target.value }))} />
											</div>
											<div className="space-y-1">
												<Label className="text-sm">Category</Label>
												<Select value={quickAddForm.category} onValueChange={(value) => setQuickAddForm((prev) => ({ ...prev, category: value }))}>
													<SelectTrigger>
														<SelectValue placeholder="Select category" />
													</SelectTrigger>
													<SelectContent>
														{serviceCategories.map((category) => (
															<SelectItem key={category} value={category}>
																{category}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</div>

										<div className="flex gap-2">
											<Button onClick={addService} disabled={profile.services.length >= 30}>
												<Plus className="mr-2 w-4 h-4" />
												Add Service
											</Button>
										</div>

										{/* Simple suggestions */}
										{profile.category && (
											<div className="pt-3 mt-3 border-t">
												<p className="mb-2 text-sm text-muted-foreground">Quick add for {profile.category}:</p>
												<div className="flex flex-wrap gap-1">
													{(() => {
														const suggestions = {
															Plumbing: ["Emergency Plumbing", "Drain Cleaning", "Pipe Repair", "Water Heater Installation"],
															Electrical: ["Electrical Repair", "Panel Upgrade", "Outlet Installation", "Lighting Installation"],
															HVAC: ["AC Repair", "Heating Repair", "Duct Cleaning", "System Installation"],
															Landscaping: ["Lawn Care", "Tree Trimming", "Garden Design", "Irrigation Installation"],
															Cleaning: ["House Cleaning", "Deep Cleaning", "Carpet Cleaning", "Window Cleaning"],
															Restaurant: ["Catering", "Private Events", "Delivery", "Takeout"],
															Automotive: ["Oil Change", "Brake Repair", "Engine Repair", "Tire Service"],
															Technology: ["Computer Repair", "Network Setup", "Software Installation", "Data Recovery"],
															Health: ["Consultation", "Wellness Check", "Treatment", "Therapy"],
															Education: ["Tutoring", "Training", "Workshops", "Certification"],
															Entertainment: ["Event Planning", "DJ Services", "Photography", "Live Music"],
															Beauty: ["Haircut", "Coloring", "Styling", "Treatments"],
															Art: ["Custom Art", "Portraits", "Design Services", "Art Classes"],
															Construction: ["Remodeling", "Roofing", "Flooring", "Painting"],
															Legal: ["Consultation", "Document Review", "Representation", "Legal Advice"],
															Finance: ["Tax Preparation", "Financial Planning", "Bookkeeping", "Consulting"],
															"Real Estate": ["Property Sales", "Property Management", "Appraisal", "Consultation"],
															"Pet Services": ["Pet Grooming", "Pet Sitting", "Training", "Veterinary Care"],
															Fitness: ["Personal Training", "Group Classes", "Nutrition Consulting", "Fitness Assessment"],
															Photography: ["Portrait Photography", "Event Photography", "Commercial Photography", "Photo Editing"],
															Consulting: ["Business Consulting", "Strategy Planning", "Process Improvement", "Market Analysis"],
															Marketing: ["Social Media Management", "Content Creation", "SEO Services", "Advertising"],
															"Web Development": ["Website Design", "E-commerce Development", "App Development", "Maintenance"],
															Catering: ["Wedding Catering", "Corporate Events", "Private Parties", "Meal Delivery"],
															Insurance: ["Auto Insurance", "Home Insurance", "Life Insurance", "Business Insurance"],
															Moving: ["Local Moving", "Long Distance Moving", "Packing Services", "Storage"],
															Security: ["Home Security", "Business Security", "Surveillance", "Alarm Systems"],
															Handyman: ["Home Repairs", "Furniture Assembly", "Painting", "Minor Installations"],
															Transportation: ["Rideshare", "Delivery Service", "Moving Service", "Airport Shuttle"],
															"Event Planning": ["Wedding Planning", "Corporate Events", "Birthday Parties", "Event Coordination"],
														};

														return suggestions[profile.category] || ["Consultation", "Installation", "Repair", "Maintenance"];
													})().map((suggestion, index) => (
														<Button
															key={index}
															variant="outline"
															size="sm"
															className="h-7 text-xs"
															onClick={() => {
																const newService = {
																	id: Date.now() + index,
																	name: suggestion,
																	description: "",
																	price: "",
																	duration: "",
																	category: "General",
																};
																setProfile((prev) => ({
																	...prev,
																	services: [...prev.services, newService],
																}));
															}}
														>
															+ {suggestion}
														</Button>
													))}
												</div>
											</div>
										)}
									</div>
								</CardContent>
							</Card>

							{/* Services List - 2 Column Layout */}
							{profile.services.length > 0 && (
								<Card suppressHydrationWarning>
									<CardHeader>
										<CardTitle className="flex items-center space-x-2">
											<FileText className="w-5 h-5" />
											<span>Your Services</span>
										</CardTitle>
										<CardDescription>Edit your services below. Click and type to update any field.</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
											{profile.services.map((service, index) => (
												<div key={service.id} className="p-4 rounded-lg border transition-all duration-200 group hover:border-primary/50 bg-muted/20">
													{/* Service Header */}
													<div className="flex justify-between items-start mb-3">
														<div className="flex flex-1 items-center space-x-2">
															<div className="flex justify-center items-center w-6 h-6 text-xs font-medium rounded-full bg-primary/5 text-primary border border-primary/20">{index + 1}</div>
															<Input value={service.name} onChange={(e) => updateService(service.id, "name", e.target.value)} placeholder="Service name..." className="p-0 h-auto font-medium bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60" />
														</div>
														<Button variant="ghost" size="sm" onClick={() => removeService(service.id)} className="p-0 w-6 h-6 opacity-0 transition-opacity group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10">
															<X className="w-3 h-3" />
														</Button>
													</div>

													{/* Service Details - Compact Grid */}
													<div className="space-y-3">
														<div className="grid grid-cols-2 gap-3">
															<div>
																<Label className="block mb-1 text-xs text-muted-foreground">Price (Optional)</Label>
																<Input value={service.price} onChange={(e) => updateService(service.id, "price", e.target.value)} placeholder="$150" className="h-8 text-sm" />
															</div>
															<div>
																<Label className="block mb-1 text-xs text-muted-foreground">Duration</Label>
																<Input value={service.duration} onChange={(e) => updateService(service.id, "duration", e.target.value)} placeholder="2 hours" className="h-8 text-sm" />
															</div>
														</div>

														<div>
															<Label className="block mb-1 text-xs text-muted-foreground">Category</Label>
															<Select value={service.category} onValueChange={(value) => updateService(service.id, "category", value)}>
																<SelectTrigger className="h-8 text-sm">
																	<SelectValue placeholder="Select..." />
																</SelectTrigger>
																<SelectContent>
																	{serviceCategories.map((category) => (
																		<SelectItem key={category} value={category}>
																			{category}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														</div>

														<div>
															<Label className="block mb-1 text-xs text-muted-foreground">Description (Optional)</Label>
															<Textarea value={service.description} onChange={(e) => updateService(service.id, "description", e.target.value)} placeholder="Brief description of this service..." rows={2} className="text-sm resize-none" />
														</div>
													</div>

													{/* Status Indicator */}
													<div className="flex justify-between items-center pt-2 mt-3 border-t border-border/30">
														<div className="flex items-center space-x-2">
															{service.name && service.category ? (
																<Badge variant="secondary" className="text-xs text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300">
																	<CheckCircle className="mr-1 w-3 h-3" />
																	Complete
																</Badge>
															) : (
																<Badge variant="secondary" className="text-xs text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300">
																	<AlertCircle className="mr-1 w-3 h-3" />
																	Incomplete
																</Badge>
															)}
														</div>
														<span className="text-xs text-muted-foreground">#{index + 1}</span>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Empty State */}
							{profile.services.length === 0 && (
								<Card suppressHydrationWarning>
									<CardContent className="py-12">
										<div className="space-y-4 text-center">
											<div className="flex justify-center items-center mx-auto w-16 h-16 rounded-full bg-primary/10">
												<Wrench className="w-8 h-8 text-primary" />
											</div>
											<div className="space-y-2">
												<h3 className="text-lg font-semibold">No services added yet</h3>
												<p className="mx-auto max-w-sm text-muted-foreground">Start showcasing your expertise by adding the services you offer. This helps customers understand what you do and how you can help them.</p>
											</div>
											<div className="flex flex-col gap-3 justify-center items-center sm:flex-row">
												<Button onClick={addService} size="lg" className="min-w-[200px]">
													<Plus className="mr-2 w-5 h-5" />
													Add Your First Service
												</Button>
											</div>
											<div className="space-y-1 text-xs text-muted-foreground">
												<p>
													💡 <strong>Pro tip:</strong> Add 3-5 core services to start
												</p>
												<p>🎯 Include pricing to attract serious inquiries</p>
												<p>📝 Clear descriptions help customers choose the right service</p>
											</div>
										</div>
									</CardContent>
								</Card>
							)}

							{/* Add More Services */}
							{profile.services.length > 0 && profile.services.length < 30 && (
								<Card suppressHydrationWarning className="border-2 border-dashed transition-colors border-primary/20 hover:border-primary/40">
									<CardContent className="py-8">
										<div className="space-y-3 text-center">
											<Button onClick={addService} variant="outline" size="lg" className="min-w-[200px]">
												<Plus className="mr-2 w-5 h-5" />
												Add Another Service
											</Button>
											<p className="text-sm text-muted-foreground">You can add up to {30 - profile.services.length} more services</p>
										</div>
									</CardContent>
								</Card>
							)}

							{/* Service Limit Reached */}
							{profile.services.length >= 30 && (
								<Card suppressHydrationWarning className="bg-amber-50 border-amber-200 dark:border-amber-800 dark:bg-amber-950/30">
									<CardContent className="py-6">
										<div className="space-y-2 text-center">
											<div className="flex justify-center items-center space-x-2 text-amber-600 dark:text-amber-400">
												<AlertCircle className="w-5 h-5" />
												<span className="font-medium">Service limit reached</span>
											</div>
											<p className="text-sm text-amber-700 dark:text-amber-300">You&apos;ve reached the maximum of 30 services. Remove a service to add a new one.</p>
										</div>
									</CardContent>
								</Card>
							)}

							{/* Save Changes */}
							{profile.services.length > 0 && (
								<Card suppressHydrationWarning className="bg-primary/5 border-primary/20">
									<CardContent className="py-4">
										<div className="flex justify-between items-center">
											<div className="flex items-center space-x-3">
												<div className="flex justify-center items-center w-8 h-8 rounded-full bg-primary/20">
													<Save className="w-4 h-4 text-primary" />
												</div>
												<div>
													<p className="font-medium">Ready to save your services?</p>
													<p className="text-sm text-muted-foreground">Your changes will be visible to customers immediately</p>
												</div>
											</div>
											<Button onClick={handleSaveProfile} size="lg">
												<Save className="mr-2 w-4 h-4" />
												Save All Changes
											</Button>
										</div>
									</CardContent>
								</Card>
							)}
						</>
					)}

					{/* Thorbis Business Verification Section */}
					{activeSection === "verifications" && (
						<>
							{/* Verification Overview Card */}
							<Card suppressHydrationWarning>
								<CardHeader>
									<div className="flex justify-between items-center">
										<div className="flex items-center space-x-3">
											<Shield className="w-6 h-6 text-primary" />
											<div>
												<CardTitle>Thorbis Business Verification</CardTitle>
												<CardDescription>Complete verification to build trust with customers</CardDescription>
											</div>
										</div>
										<div className="text-right">
											<Badge variant={profile.thorbisVerification.overallStatus === "verified" ? "default" : profile.thorbisVerification.overallStatus === "in_progress" ? "secondary" : profile.thorbisVerification.overallStatus === "under_review" ? "outline" : "destructive"} className="mb-1">
												{profile.thorbisVerification.overallStatus === "verified" ? "✓ Verified Business" : profile.thorbisVerification.overallStatus === "in_progress" ? "⏳ In Progress" : profile.thorbisVerification.overallStatus === "under_review" ? "🔍 Under Review" : profile.thorbisVerification.overallStatus === "rejected" ? "❌ Rejected" : "Not Started"}
											</Badge>
											<div className="text-xs text-muted-foreground">ID: {profile.thorbisVerification.verificationId}</div>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Progress Overview */}
									<div className="space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">Overall Progress</span>
											<span className="text-sm text-muted-foreground">
												{profile.thorbisVerification.steps.filter((step) => step.status === "completed").length} of {profile.thorbisVerification.steps.length} steps completed
											</span>
										</div>
										<Progress value={(profile.thorbisVerification.steps.filter((step) => step.status === "completed").length / profile.thorbisVerification.steps.length) * 100} className="h-2" />
									</div>

									{/* Key Information */}
									<div className="grid grid-cols-1 gap-4 p-4 rounded-lg md:grid-cols-3 bg-muted/50">
										<div className="text-center">
											<div className="text-sm text-muted-foreground">Assigned Reviewer</div>
											<div className="font-medium">{profile.thorbisVerification.assignedReviewer}</div>
										</div>
										<div className="text-center">
											<div className="text-sm text-muted-foreground">Submitted</div>
											<div className="font-medium">{profile.thorbisVerification.submittedDate}</div>
										</div>
										<div className="text-center">
											<div className="text-sm text-muted-foreground">Est. Completion</div>
											<div className="font-medium">{profile.thorbisVerification.estimatedCompletion}</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Verification Steps */}
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Verification Steps</CardTitle>
									<CardDescription>Complete each step to achieve full business verification</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{profile.thorbisVerification.steps.map((step, index) => (
										<div key={step.id} className="p-4 space-y-3 rounded-lg border border-border">
											<div className="flex justify-between items-start">
												<div className="flex items-start space-x-3">
													<div className="flex-shrink-0 mt-1">
														{step.status === "completed" ? (
															<CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
														) : step.status === "in_progress" ? (
															<Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
														) : step.status === "under_review" ? (
															<Eye className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
														) : step.status === "rejected" ? (
															<XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
														) : (
															<AlertCircle className="w-5 h-5 text-muted-foreground" />
														)}
													</div>
													<div className="flex-1">
														<div className="flex items-center space-x-2">
															<h4 className="font-medium">{step.title}</h4>
															{step.required && (
																<Badge variant="outline" className="text-xs">
																	Required
																</Badge>
															)}
														</div>
														<p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
														{step.completedDate && <p className="mt-1 text-xs text-green-600 dark:text-green-400">✓ Completed on {step.completedDate}</p>}
														{step.notes && <p className="mt-1 text-xs text-muted-foreground">{step.notes}</p>}
													</div>
												</div>
												<Badge variant={step.status === "completed" ? "default" : step.status === "in_progress" ? "secondary" : step.status === "under_review" ? "outline" : step.status === "rejected" ? "destructive" : "secondary"}>
													{step.status === "completed" ? "Completed" : step.status === "in_progress" ? "In Progress" : step.status === "under_review" ? "Under Review" : step.status === "rejected" ? "Rejected" : step.status === "pending" ? "Pending" : "Not Started"}
												</Badge>
											</div>

											{/* Documents for this step */}
											{step.documents && step.documents.length > 0 && (
												<div className="ml-8 space-y-2">
													<h5 className="text-sm font-medium text-muted-foreground">Documents:</h5>
													{step.documents.map((doc, docIndex) => (
														<div key={docIndex} className="flex justify-between items-center p-2 text-sm rounded bg-muted/30 dark:bg-muted/20">
															<div className="flex items-center space-x-2">
																<FileText className="w-4 h-4" />
																<span>{doc.name}</span>
																{doc.uploadDate && <span className="text-xs text-muted-foreground">• {doc.uploadDate}</span>}
															</div>
															<div className="flex items-center space-x-2">
																{doc.status === "verified" ? (
																	<Badge variant="default" className="text-xs">
																		✓ Verified
																	</Badge>
																) : doc.status === "under_review" ? (
																	<Badge variant="outline" className="text-xs">
																		🔍 Reviewing
																	</Badge>
																) : doc.status === "pending_upload" ? (
																	<Badge variant="secondary" className="text-xs">
																		📤 Upload Needed
																	</Badge>
																) : (
																	<Badge variant="destructive" className="text-xs">
																		❌ Rejected
																	</Badge>
																)}
																{doc.status === "verified" && (
																	<Button size="sm" variant="ghost">
																		<Download className="w-3 h-3" />
																	</Button>
																)}
																{doc.status === "pending_upload" && (
																	<Button size="sm" variant="outline">
																		<Upload className="mr-1 w-3 h-3" />
																		Upload
																	</Button>
																)}
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									))}
								</CardContent>
							</Card>

							{/* Communications Log */}
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle className="flex items-center space-x-2">
										<MessageSquare className="w-5 h-5" />
										<span>Communication Log</span>
									</CardTitle>
									<CardDescription>Updates and messages from your verification team</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{profile.thorbisVerification.communications.map((comm) => (
										<div key={comm.id} className={`p-4 rounded-lg border ${!comm.read ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" : "bg-muted/30 border-border"}`}>
											<div className="flex justify-between items-start mb-2">
												<div className="flex items-center space-x-2">
													<div className={`w-2 h-2 rounded-full ${!comm.read ? "bg-blue-500" : "bg-muted-foreground"}`}></div>
													<span className="text-sm font-medium">{comm.subject}</span>
													{comm.type === "approval" && <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />}
													{comm.type === "update" && <AlertCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />}
													{comm.type === "welcome" && <UserCheck className="w-4 h-4 text-primary" />}
												</div>
												<div className="text-xs text-muted-foreground">{comm.date}</div>
											</div>
											<p className="mb-2 text-sm text-muted-foreground">From: {comm.from}</p>
											<p className="text-sm">{comm.message}</p>
										</div>
									))}
								</CardContent>
							</Card>

							{/* Help & Support */}
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Need Help?</CardTitle>
									<CardDescription>Get assistance with your verification process</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<Button variant="outline" className="flex flex-col items-start p-4 space-y-2 h-auto">
											<div className="flex items-center space-x-2">
												<MessageSquare className="w-4 h-4" />
												<span className="font-medium">Contact Verification Team</span>
											</div>
											<span className="text-xs text-left text-muted-foreground">Get direct help from your assigned reviewer</span>
										</Button>
										<Button variant="outline" className="flex flex-col items-start p-4 space-y-2 h-auto">
											<div className="flex items-center space-x-2">
												<FileText className="w-4 h-4" />
												<span className="font-medium">Verification Guide</span>
											</div>
											<span className="text-xs text-left text-muted-foreground">Step-by-step verification instructions</span>
										</Button>
									</div>
									<div className="p-4 bg-green-50 rounded-lg border border-green-200 dark:bg-green-950/30 dark:border-green-800">
										<div className="flex items-start space-x-2">
											<Award className="mt-0.5 w-4 h-4 text-green-600 dark:text-green-400" />
											<div className="text-sm">
												<p className="font-medium text-green-900 dark:text-green-100">Free Community-Sponsored Verification</p>
												<p className="mt-1 text-green-700 dark:text-green-300">All Thorbis verification services are completely free, funded by city governments and local business sponsors. Verified businesses receive a trust badge, appear higher in search results, and can access premium features.</p>
												<div className="flex items-center mt-2 space-x-4 text-xs text-green-600 dark:text-green-400">
													<span>✓ No verification fees</span>
													<span>✓ Community-funded program</span>
													<span>✓ All features included</span>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</>
					)}

					{/* Thorbis Elite Process Guide Section */}
					{activeSection === "elite" && (
						<>
							{/* Elite Verification Overview */}
							<Card suppressHydrationWarning>
								<CardHeader>
									<div className="flex justify-between items-center">
										<div className="flex items-center space-x-3">
											<div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
												<Award className="w-6 h-6 text-white" />
											</div>
											<div>
												<CardTitle className="flex items-center space-x-2">
													<span>Thorbis Elite Verification</span>
													<Badge variant="outline" className="text-white bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-500">
														Premium Tier
													</Badge>
												</CardTitle>
												<CardDescription>Premium verification for industry-leading businesses with enhanced trust features</CardDescription>
											</div>
										</div>
										<div className="text-right">
											<Badge variant="secondary" className="mb-1">
												Available After Basic Verification
											</Badge>
											<div className="text-xs text-muted-foreground">Elite Benefits Included</div>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Elite Benefits Grid */}
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
										<div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 dark:from-yellow-950/30 dark:to-yellow-900/30 dark:border-yellow-800">
											<div className="flex items-center mb-2 space-x-2">
												<Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
												<span className="text-sm font-medium">Elite Badge</span>
											</div>
											<p className="text-xs text-muted-foreground">Premium trust badge with gold verification seal</p>
										</div>
										<div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 dark:from-blue-950/30 dark:to-blue-900/30 dark:border-blue-800">
											<div className="flex items-center mb-2 space-x-2">
												<TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
												<span className="text-sm font-medium">Priority Ranking</span>
											</div>
											<p className="text-xs text-muted-foreground">Appear first in search results and recommendations</p>
										</div>
										<div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 dark:from-green-950/30 dark:to-green-900/30 dark:border-green-800">
											<div className="flex items-center mb-2 space-x-2">
												<Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
												<span className="text-sm font-medium">Warranty Protection</span>
											</div>
											<p className="text-xs text-muted-foreground">Enhanced warranty and customer protection coverage</p>
										</div>
										<div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 dark:from-purple-950/30 dark:to-purple-900/30 dark:border-purple-800">
											<div className="flex items-center mb-2 space-x-2">
												<Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
												<span className="text-sm font-medium">Premium Features</span>
											</div>
											<p className="text-xs text-muted-foreground">Access to advanced analytics and marketing tools</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Elite Documentation Requirements */}
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Elite Documentation Requirements</CardTitle>
									<CardDescription>Additional documentation needed for Elite verification status</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Documentation Categories */}
									{[
										{
											category: "Financial Verification",
											icon: DollarSign,
											color: "green",
											status: "completed",
											completedDate: "2024-01-25",
											documents: [
												{ name: "Business Tax Returns (Last 3 Years)", status: "verified", required: true },
												{ name: "Bank Statements (Last 6 Months)", status: "verified", required: true },
												{ name: "Financial Audit Report", status: "verified", required: false },
												{ name: "Credit Report", status: "verified", required: true },
											],
										},
										{
											category: "Industry Certifications",
											icon: Award,
											color: "blue",
											status: "completed",
											completedDate: "2024-01-23",
											documents: [
												{ name: "Trade Association Membership", status: "verified", required: true },
												{ name: "Industry Certifications", status: "verified", required: true },
												{ name: "Professional Development Records", status: "verified", required: false },
												{ name: "Awards and Recognition", status: "verified", required: false },
											],
										},
										{
											category: "Customer Verification",
											icon: Users,
											color: "purple",
											status: "in_progress",
											documents: [
												{ name: "Customer Reference Letters (Min 10)", status: "verified", required: true },
												{ name: "Work Portfolio with Photos", status: "under_review", required: true },
												{ name: "Customer Satisfaction Surveys", status: "pending_upload", required: false },
												{ name: "Third-Party Review Verification", status: "verified", required: true },
											],
										},
										{
											category: "Legal Compliance",
											icon: Shield,
											color: "red",
											status: "pending",
											documents: [
												{ name: "Environmental Compliance Certificate", status: "pending_upload", required: true },
												{ name: "Safety Training Records", status: "pending_upload", required: true },
												{ name: "Workers Rights Compliance", status: "pending_upload", required: true },
												{ name: "Local Permit Verification", status: "pending_upload", required: false },
											],
										},
										{
											category: "Quality Assurance",
											icon: CheckCircle,
											color: "yellow",
											status: "not_started",
											documents: [
												{ name: "Quality Management System", status: "pending_upload", required: false },
												{ name: "Customer Complaint Resolution Process", status: "pending_upload", required: true },
												{ name: "Service Guarantee Documentation", status: "pending_upload", required: false },
												{ name: "Continuous Improvement Plan", status: "pending_upload", required: false },
											],
										},
									].map((section, index) => (
										<div key={index} className="p-4 space-y-4 rounded-lg border border-border">
											<div className="flex justify-between items-center">
												<div className="flex items-center space-x-3">
													<div className={`p-2 rounded-lg ${section.color === "green" ? "bg-green-100 dark:bg-green-950/30" : section.color === "blue" ? "bg-blue-100 dark:bg-blue-950/30" : section.color === "purple" ? "bg-purple-100 dark:bg-purple-950/30" : section.color === "red" ? "bg-red-100 dark:bg-red-950/30" : "bg-yellow-100 dark:bg-yellow-950/30"}`}>
														<section.icon className={`w-5 h-5 ${section.color === "green" ? "text-green-600 dark:text-green-400" : section.color === "blue" ? "text-blue-600 dark:text-blue-400" : section.color === "purple" ? "text-purple-600 dark:text-purple-400" : section.color === "red" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`} />
													</div>
													<div>
														<h4 className="font-medium">{section.category}</h4>
														{section.completedDate && <p className="text-xs text-green-600 dark:text-green-400">✓ Completed on {section.completedDate}</p>}
													</div>
												</div>
												<Badge variant={section.status === "completed" ? "default" : section.status === "in_progress" ? "secondary" : section.status === "pending" ? "outline" : "secondary"}>{section.status === "completed" ? "✓ Completed" : section.status === "in_progress" ? "⏳ In Progress" : section.status === "pending" ? "📋 Pending" : "⏸️ Not Started"}</Badge>
											</div>

											{/* Documents List */}
											<div className="ml-10 space-y-2">
												{section.documents.map((doc, docIndex) => (
													<div key={docIndex} className="flex justify-between items-center p-3 rounded-lg bg-muted/20 dark:bg-muted/10">
														<div className="flex items-center space-x-3">
															<FileText className="w-4 h-4 text-muted-foreground" />
															<div>
																<span className="text-sm font-medium">{doc.name}</span>
																{!doc.required && (
																	<Badge variant="outline" className="ml-2 text-xs">
																		Optional
																	</Badge>
																)}
															</div>
														</div>
														<div className="flex items-center space-x-2">
															{doc.status === "verified" ? (
																<Badge variant="default" className="text-xs">
																	<CheckCircle className="mr-1 w-3 h-3" />
																	Verified
																</Badge>
															) : doc.status === "under_review" ? (
																<Badge variant="outline" className="text-xs">
																	<Eye className="mr-1 w-3 h-3" />
																	Reviewing
																</Badge>
															) : (
																<Badge variant="secondary" className="text-xs">
																	<Upload className="mr-1 w-3 h-3" />
																	Upload Needed
																</Badge>
															)}
															{doc.status === "verified" && (
																<Button size="sm" variant="ghost">
																	<Download className="w-3 h-3" />
																</Button>
															)}
															{doc.status === "pending_upload" && (
																<Button size="sm" variant="outline">
																	<Upload className="mr-1 w-3 h-3" />
																	Upload
																</Button>
															)}
														</div>
													</div>
												))}
											</div>
										</div>
									))}
								</CardContent>
							</Card>

							{/* Elite Process Timeline */}
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Elite Verification Process</CardTitle>
									<CardDescription>Step-by-step process to achieve Elite status</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="space-y-6">
										{[
											{
												step: 1,
												title: "Complete Basic Verification",
												description: "Must have completed standard Thorbis verification first",
												status: "completed",
												timeline: "Completed",
												details: "All basic verification steps have been successfully completed and approved.",
											},
											{
												step: 2,
												title: "Submit Elite Application",
												description: "Apply for Elite status through our sponsored program",
												status: "completed",
												timeline: "Completed Jan 25, 2024",
												details: "Elite application submitted successfully. All verification services provided free through community sponsorship.",
											},
											{
												step: 3,
												title: "Document Collection Phase",
												description: "Upload all required Elite documentation",
												status: "in_progress",
												timeline: "In Progress (60% Complete)",
												details: "Financial and industry certifications completed. Customer and legal compliance pending.",
											},
											{
												step: 4,
												title: "Enhanced Background Check",
												description: "Comprehensive background verification process",
												status: "pending",
												timeline: "Estimated: Feb 10, 2024",
												details: "Detailed background check including business history, legal records, and industry standing.",
											},
											{
												step: 5,
												title: "On-Site Verification",
												description: "Physical business location and operations verification",
												status: "pending",
												timeline: "Estimated: Feb 15, 2024",
												details: "Thorbis representative will visit business location to verify operations and facilities.",
											},
											{
												step: 6,
												title: "Customer Reference Calls",
												description: "Direct verification with provided customer references",
												status: "pending",
												timeline: "Estimated: Feb 18, 2024",
												details: "Thorbis team will contact customer references to verify service quality and satisfaction.",
											},
											{
												step: 7,
												title: "Final Review & Approval",
												description: "Comprehensive review by Elite verification committee",
												status: "pending",
												timeline: "Estimated: Feb 25, 2024",
												details: "Final review of all documentation and verification results by senior verification team.",
											},
										].map((processStep, index) => (
											<div key={index} className="flex items-start space-x-4">
												<div className="flex-shrink-0">
													<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${processStep.status === "completed" ? "bg-green-500 text-white" : processStep.status === "in_progress" ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}>{processStep.status === "completed" ? <CheckCircle className="w-4 h-4" /> : processStep.status === "in_progress" ? <Clock className="w-4 h-4" /> : processStep.step}</div>
												</div>
												<div className="flex-1 space-y-2">
													<div className="flex justify-between items-center">
														<h4 className="font-medium">{processStep.title}</h4>
														<Badge variant={processStep.status === "completed" ? "default" : processStep.status === "in_progress" ? "secondary" : "outline"} className="text-xs">
															{processStep.timeline}
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground">{processStep.description}</p>
													<p className="p-2 text-xs rounded text-muted-foreground bg-muted/30 dark:bg-muted/20">{processStep.details}</p>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Elite Support & Contact */}
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Elite Verification Support</CardTitle>
									<CardDescription>Dedicated support for Elite verification process</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<Button variant="outline" className="flex flex-col items-start p-4 space-y-2 h-auto">
											<div className="flex items-center space-x-2">
												<Phone className="w-4 h-4" />
												<span className="font-medium">Elite Hotline</span>
											</div>
											<span className="text-xs text-left text-muted-foreground">1-800-THORBIS-ELITE</span>
											<span className="text-xs text-left text-muted-foreground">Priority support line</span>
										</Button>
										<Button variant="outline" className="flex flex-col items-start p-4 space-y-2 h-auto">
											<div className="flex items-center space-x-2">
												<Mail className="w-4 h-4" />
												<span className="font-medium">Elite Team</span>
											</div>
											<span className="text-xs text-left text-muted-foreground">elite@thorbis.com</span>
											<span className="text-xs text-left text-muted-foreground">24-hour response guarantee</span>
										</Button>
										<Button variant="outline" className="flex flex-col items-start p-4 space-y-2 h-auto">
											<div className="flex items-center space-x-2">
												<Calendar className="w-4 h-4" />
												<span className="font-medium">Schedule Consultation</span>
											</div>
											<span className="text-xs text-left text-muted-foreground">One-on-one guidance</span>
											<span className="text-xs text-left text-muted-foreground">Free consultation available</span>
										</Button>
									</div>
									<div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 dark:from-green-950/30 dark:to-green-900/30 dark:border-green-800">
										<div className="flex items-start space-x-3">
											<Award className="mt-0.5 w-5 h-5 text-green-600 dark:text-green-400" />
											<div className="space-y-2">
												<p className="font-medium text-green-900 dark:text-green-100">Free Thorbis Verification</p>
												<p className="text-sm text-green-800 dark:text-green-200">All Thorbis verification services are completely free • Sponsored by city governments and local business sponsors</p>
												<div className="flex items-center space-x-4 text-xs text-green-700 dark:text-green-300">
													<span>✓ No fees required</span>
													<span>✓ Community-funded program</span>
													<span>✓ Full verification support</span>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</>
					)}

					{/* Business Hours Section */}
					{activeSection === "hours" && (
						<>
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Business Hours</CardTitle>
									<CardDescription>Set your operating hours for each day of the week.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{Object.entries(profile.hours).map(([day, hours]) => (
										<div key={day} className="flex items-center p-3 space-x-4 rounded-lg border border-border">
											<div className="w-24">
												<Label className="font-medium capitalize">{day}</Label>
											</div>
											<Switch
												checked={hours.isOpen}
												onCheckedChange={(checked) =>
													setProfile((prev) => ({
														...prev,
														hours: {
															...prev.hours,
															[day]: { ...hours, isOpen: checked },
														},
													}))
												}
											/>
											{hours.isOpen ? (
												<div className="flex items-center space-x-2">
													<Input
														type="time"
														value={hours.open}
														onChange={(e) =>
															setProfile((prev) => ({
																...prev,
																hours: {
																	...prev.hours,
																	[day]: { ...hours, open: e.target.value },
																},
															}))
														}
														className="w-32"
													/>
													<span className="text-muted-foreground">to</span>
													<Input
														type="time"
														value={hours.close}
														onChange={(e) =>
															setProfile((prev) => ({
																...prev,
																hours: {
																	...prev.hours,
																	[day]: { ...hours, close: e.target.value },
																},
															}))
														}
														className="w-32"
													/>
												</div>
											) : (
												<span className="text-muted-foreground">Closed</span>
											)}
										</div>
									))}
								</CardContent>
								<CardFooter className="px-6 py-4 border-t">
									<Button onClick={handleSaveProfile}>Save Changes</Button>
								</CardFooter>
							</Card>
						</>
					)}

					{/* Team Section */}
					{activeSection === "team" && (
						<>
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Team Members</CardTitle>
									<CardDescription>Showcase your team members and their expertise.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{profile.team.map((member) => (
										<div key={member.id} className="p-4 space-y-3 rounded-lg border border-border">
											<div className="flex justify-between items-center">
												<h4 className="font-medium">Team Member</h4>
												<Button variant="ghost" size="sm" onClick={() => removeTeamMember(member.id)}>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<Label>Name</Label>
													<Input value={member.name} onChange={(e) => updateTeamMember(member.id, "name", e.target.value)} placeholder="Team member name" />
												</div>
												<div>
													<Label>Role</Label>
													<Input value={member.role} onChange={(e) => updateTeamMember(member.id, "role", e.target.value)} placeholder="Job title/role" />
												</div>
											</div>
											<div>
												<Label>Bio</Label>
												<Textarea value={member.bio} onChange={(e) => updateTeamMember(member.id, "bio", e.target.value)} placeholder="Brief bio about this team member" rows={2} />
											</div>
										</div>
									))}
									<Button variant="outline" onClick={addTeamMember} className="w-full">
										<Plus className="mr-2 w-4 h-4" />
										Add Team Member
									</Button>
								</CardContent>
								<CardFooter className="px-6 py-4 border-t">
									<Button onClick={handleSaveProfile}>Save Changes</Button>
								</CardFooter>
							</Card>
						</>
					)}

					{/* Media Gallery Section */}
					{activeSection === "media" && (
						<>
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Media Gallery</CardTitle>
									<CardDescription>Upload photos to showcase your work and business.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="p-8 text-center rounded-lg border-2 border-dashed border-border">
										<Image className="mx-auto mb-4 w-12 h-12 text-muted-foreground" alt="Upload icon" />
										<h3 className="mb-2 text-lg font-medium">Upload Photos</h3>
										<p className="mb-4 text-muted-foreground">Drag and drop your images here, or click to browse</p>
										<Button variant="outline" onClick={() => fileInputRef.current?.click()}>
											<Upload className="mr-2 w-4 h-4" />
											Choose Files
										</Button>
										<input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" />
									</div>
									<p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WebP. Maximum file size: 5MB each.</p>
								</CardContent>
								<CardFooter className="px-6 py-4 border-t">
									<Button onClick={handleSaveProfile}>Save Changes</Button>
								</CardFooter>
							</Card>
						</>
					)}

					{/* Settings Section */}
					{activeSection === "settings" && (
						<>
							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Notification Settings</CardTitle>
									<CardDescription>Configure how you receive notifications.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="flex justify-between items-center">
										<div>
											<Label className="text-base font-medium">Email Notifications</Label>
											<p className="text-sm text-muted-foreground">Receive notifications via email</p>
										</div>
										<Switch
											checked={profile.settings.notifications.email}
											onCheckedChange={(checked) =>
												setProfile((prev) => ({
													...prev,
													settings: {
														...prev.settings,
														notifications: {
															...prev.settings.notifications,
															email: checked,
														},
													},
												}))
											}
										/>
									</div>
									<div className="flex justify-between items-center">
										<div>
											<Label className="text-base font-medium">SMS Notifications</Label>
											<p className="text-sm text-muted-foreground">Receive notifications via text message</p>
										</div>
										<Switch
											checked={profile.settings.notifications.sms}
											onCheckedChange={(checked) =>
												setProfile((prev) => ({
													...prev,
													settings: {
														...prev.settings,
														notifications: {
															...prev.settings.notifications,
															sms: checked,
														},
													},
												}))
											}
										/>
									</div>
									<div className="flex justify-between items-center">
										<div>
											<Label className="text-base font-medium">Push Notifications</Label>
											<p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
										</div>
										<Switch
											checked={profile.settings.notifications.push}
											onCheckedChange={(checked) =>
												setProfile((prev) => ({
													...prev,
													settings: {
														...prev.settings,
														notifications: {
															...prev.settings.notifications,
															push: checked,
														},
													},
												}))
											}
										/>
									</div>
								</CardContent>
								<CardFooter className="px-6 py-4 border-t">
									<Button onClick={handleSaveProfile}>Save Changes</Button>
								</CardFooter>
							</Card>

							<Card suppressHydrationWarning>
								<CardHeader>
									<CardTitle>Privacy Settings</CardTitle>
									<CardDescription>Control what information is visible to customers.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="flex justify-between items-center">
										<div>
											<Label className="text-base font-medium">Show Phone Number</Label>
											<p className="text-sm text-muted-foreground">Display your phone number publicly</p>
										</div>
										<Switch
											checked={profile.settings.privacy.showPhone}
											onCheckedChange={(checked) =>
												setProfile((prev) => ({
													...prev,
													settings: {
														...prev.settings,
														privacy: {
															...prev.settings.privacy,
															showPhone: checked,
														},
													},
												}))
											}
										/>
									</div>
									<div className="flex justify-between items-center">
										<div>
											<Label className="text-base font-medium">Show Email Address</Label>
											<p className="text-sm text-muted-foreground">Display your email address publicly</p>
										</div>
										<Switch
											checked={profile.settings.privacy.showEmail}
											onCheckedChange={(checked) =>
												setProfile((prev) => ({
													...prev,
													settings: {
														...prev.settings,
														privacy: {
															...prev.settings.privacy,
															showEmail: checked,
														},
													},
												}))
											}
										/>
									</div>
									<div className="flex justify-between items-center">
										<div>
											<Label className="text-base font-medium">Show Business Address</Label>
											<p className="text-sm text-muted-foreground">Display your business address publicly</p>
										</div>
										<Switch
											checked={profile.settings.privacy.showAddress}
											onCheckedChange={(checked) =>
												setProfile((prev) => ({
													...prev,
													settings: {
														...prev.settings,
														privacy: {
															...prev.settings.privacy,
															showAddress: checked,
														},
													},
												}))
											}
										/>
									</div>
								</CardContent>
								<CardFooter className="px-6 py-4 border-t">
									<Button onClick={handleSaveProfile}>Save Changes</Button>
								</CardFooter>
							</Card>
						</>
					)}

					{/* Careers Section */}
					{activeSection === "careers" && <CareersSection profile={profile} setProfile={setProfile} isEditing={isEditing} />}

					{/* FAQ Section */}
					{activeSection === "faq" && <FAQSection profile={profile} setProfile={setProfile} isEditing={isEditing} />}

					{/* Partnerships Section */}
					{activeSection === "partnerships" && <PartnershipsSection profile={profile} setProfile={setProfile} />}
				</div>
			</div>
		</div>
	);
}
