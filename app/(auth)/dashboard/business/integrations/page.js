"use client";
import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { ChevronDown, ChevronUp, Zap, Search, CreditCard, CheckCircle2, Mail, Phone, Plus, Minus, Info, AlertCircle, MessageSquare } from "lucide-react";
import { Separator } from "@components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { toast } from "@components/ui/use-toast";

export default function IntegrationsAndBilling() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedIndustry, setSelectedIndustry] = useState("All");

	React.useEffect(() => {
		document.title = "Integrations & Features - Business Dashboard - Thorbis";
	}, []);
	const [expandedFeatures, setExpandedFeatures] = useState(new Set());
	const [showCheckout, setShowCheckout] = useState(false);
	const [showPaymentMethods, setShowPaymentMethods] = useState(false);
	const [showRequestIntegration, setShowRequestIntegration] = useState(false);
	const [showLearnMore, setShowLearnMore] = useState(false);
	const [showReportError, setShowReportError] = useState(false);
	const [selectedFeature, setSelectedFeature] = useState(null);
	const [pendingChanges, setPendingChanges] = useState({});
	const [requestForm, setRequestForm] = useState({
		integrationName: "",
		description: "",
		category: "",
		useCase: "",
		contactEmail: "",
	});
	const [reportForm, setReportForm] = useState({
		integrationName: "",
		issue: "",
		description: "",
		contactEmail: "",
	});
	const isMobile = useMediaQuery("(max-width: 1024px)");

	// Profile state with features
	const [profile, setProfile] = useState({
		features: {
			menu: { enabled: true, settings: { title: "Menu Title", description: "Brief description", showPrices: true, showCategories: true, showImages: false } },
			gallery: { enabled: true, settings: { title: "Gallery Title", description: "What this showcases", layout: "Grid", showCaptions: true, maxPhotos: 12 } },
			reviews: { enabled: true, settings: { title: "Reviews", showRating: true, showDate: true, showResponse: true, maxReviews: 10 } },
			services: { enabled: true, settings: { title: "Our Services", showPricing: true, showDuration: false, showCategories: true } },
			hours: { enabled: true, settings: { title: "Hours of Operation", showToday: true, showHolidays: false, showSpecialHours: true } },
			contact: { enabled: true, settings: { title: "Get in Touch", showPhone: true, showEmail: true, showAddress: true, showSocial: false } },
			about: { enabled: true, settings: { title: "About Us", showTeam: false, showHistory: true, showMission: true } },
			faq: { enabled: false, settings: { title: "FAQ", showCategories: false, expandable: true } },
			booking: { enabled: false, settings: { title: "Book Appointment", showCalendar: true, showServices: true, requireDeposit: false } },
			location: { enabled: true, settings: { title: "Find Us", showMap: true, showDirections: true, showServiceAreas: true } },
			specials: { enabled: false, settings: { title: "Special Offers", showExpiry: true, showTerms: true, highlightNew: true } },
			certifications: { enabled: true, settings: { title: "Certifications", showBadges: true, showExpiry: false, showDescription: true } },
		},
	});

	// Available profile features that customers can see
	const availableFeatures = {
		// Core Business Features
		menu: {
			icon: "🍽️",
			title: "Menu",
			description: "Display your menu, services, or product catalog",
			category: "Content",
			popular: true,
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
			category: "Content",
			popular: false,
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
			category: "Social",
			popular: true,
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
			category: "Business",
			popular: true,
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
			category: "Business",
			popular: false,
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
			category: "Business",
			popular: true,
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
			category: "Content",
			popular: false,
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
			category: "Content",
			popular: false,
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
			category: "Tools",
			popular: true,
			isPaid: true,
			apiIntegration: "Calendly",
			monthlyPrice: 19,
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
			category: "Business",
			popular: false,
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
			category: "Marketing",
			popular: false,
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
			category: "Trust",
			popular: true,
			settings: {
				title: "Certifications & Awards",
				showBadges: true,
				showExpiry: false,
				showDescription: true,
			},
		},

		// Healthcare Industry Features
		doctor_credentials: {
			icon: "👨‍⚕️",
			title: "Doctor Credentials",
			description: "Display medical licenses, certifications, and specialties",
			category: "Healthcare",
			industry: "Healthcare",
			popular: true,
			settings: {
				title: "Medical Credentials",
				showSpecialties: true,
				showBoardCertifications: true,
				showEducation: true,
				showLanguages: true,
			},
		},
		appointment_scheduling: {
			icon: "📅",
			title: "Appointment Scheduling",
			description: "Advanced appointment booking system",
			category: "Tools",
			industry: "Healthcare",
			popular: true,
			isPaid: true,
			apiIntegration: "Calendly",
			monthlyPrice: 19,
			settings: {
				title: "Book Appointment",
				showCalendar: true,
				showServices: true,
				showReminders: true,
			},
		},
		insurance_accepted: {
			icon: "🏥",
			title: "Insurance Accepted",
			description: "List accepted insurance providers and coverage",
			category: "Healthcare",
			industry: "Healthcare",
			popular: true,
			settings: {
				title: "Insurance & Payment",
				showProviders: true,
				showCoverage: true,
				showSelfPay: true,
			},
		},
		patient_portal: {
			icon: "🔐",
			title: "Patient Portal",
			description: "Secure patient access to medical records",
			category: "Tools",
			industry: "Healthcare",
			popular: true,
			isPaid: true,
			apiIntegration: "Epic",
			monthlyPrice: 49,
			settings: {
				title: "Patient Portal",
				showRecords: true,
				showPrescriptions: true,
				showLabResults: true,
			},
		},
		telemedicine: {
			icon: "💻",
			title: "Telemedicine",
			description: "Virtual consultation capabilities",
			category: "Tools",
			industry: "Healthcare",
			popular: true,
			isPaid: true,
			apiIntegration: "Doxy.me",
			monthlyPrice: 29,
			settings: {
				title: "Virtual Consultations",
				showAvailability: true,
				showInstructions: true,
				showRequirements: true,
			},
		},

		// Real Estate Features
		property_listings: {
			icon: "🏠",
			title: "Property Listings",
			description: "Showcase available properties with details",
			category: "Real Estate",
			industry: "Real Estate",
			popular: true,
			settings: {
				title: "Available Properties",
				showPrice: true,
				showDetails: true,
				showPhotos: true,
				showMap: true,
			},
		},
		mls_integration: {
			icon: "📊",
			title: "MLS Integration",
			description: "Real-time MLS property data",
			category: "Tools",
			industry: "Real Estate",
			popular: true,
			isPaid: true,
			apiIntegration: "MLS",
			monthlyPrice: 39,
			settings: {
				title: "MLS Data",
				showListings: true,
				showMarketData: true,
				showComparables: true,
			},
		},
		mortgage_calculator: {
			icon: "🧮",
			title: "Mortgage Calculator",
			description: "Interactive mortgage payment calculator",
			category: "Tools",
			industry: "Real Estate",
			popular: true,
			settings: {
				title: "Mortgage Calculator",
				showPaymentBreakdown: true,
				showAmortization: true,
				showRates: true,
			},
		},
		open_houses: {
			icon: "🏡",
			title: "Open Houses",
			description: "Schedule and promote open house events",
			category: "Real Estate",
			industry: "Real Estate",
			popular: false,
			settings: {
				title: "Open Houses",
				showSchedule: true,
				showDirections: true,
				showRSVP: true,
			},
		},

		// Legal Features
		attorney_credentials: {
			icon: "⚖️",
			title: "Attorney Credentials",
			description: "Display legal licenses, certifications, and experience",
			category: "Legal",
			industry: "Legal",
			popular: true,
			settings: {
				title: "Legal Credentials",
				showBarAdmissions: true,
				showSpecializations: true,
				showExperience: true,
				showAwards: true,
			},
		},
		case_results: {
			icon: "📋",
			title: "Case Results",
			description: "Showcase successful case outcomes",
			category: "Legal",
			industry: "Legal",
			popular: true,
			settings: {
				title: "Case Results",
				showOutcomes: true,
				showSettlements: true,
				showTestimonials: true,
			},
		},
		legal_consultation: {
			icon: "💼",
			title: "Legal Consultation",
			description: "Schedule legal consultation appointments",
			category: "Tools",
			industry: "Legal",
			popular: true,
			isPaid: true,
			apiIntegration: "Calendly",
			monthlyPrice: 19,
			settings: {
				title: "Legal Consultation",
				showPracticeAreas: true,
				showFees: true,
				showAvailability: true,
			},
		},

		// Automotive Features
		service_scheduler: {
			icon: "🔧",
			title: "Service Scheduler",
			description: "Schedule vehicle maintenance and repairs",
			category: "Tools",
			industry: "Automotive",
			popular: true,
			isPaid: true,
			apiIntegration: "Shopware",
			monthlyPrice: 29,
			settings: {
				title: "Service Scheduler",
				showServices: true,
				showPricing: true,
				showWarranty: true,
			},
		},
		parts_catalog: {
			icon: "🔩",
			title: "Parts Catalog",
			description: "Browse and order automotive parts",
			category: "Automotive",
			industry: "Automotive",
			popular: true,
			settings: {
				title: "Parts Catalog",
				showCategories: true,
				showPricing: true,
				showAvailability: true,
			},
		},
		warranty_tracker: {
			icon: "📋",
			title: "Warranty Tracker",
			description: "Track vehicle warranties and service history",
			category: "Tools",
			industry: "Automotive",
			popular: true,
			settings: {
				title: "Warranty Tracker",
				showExpiry: true,
				showCoverage: true,
				showHistory: true,
			},
		},

		// Food Service Features
		online_ordering: {
			icon: "🍕",
			title: "Online Ordering",
			description: "Accept online food orders and delivery",
			category: "Tools",
			industry: "Food Service",
			popular: true,
			isPaid: true,
			apiIntegration: "Toast",
			monthlyPrice: 39,
			settings: {
				title: "Order Online",
				showMenu: true,
				showDelivery: true,
				showPickup: true,
			},
		},
		reservation_system: {
			icon: "🍽️",
			title: "Reservation System",
			description: "Table reservations and waitlist management",
			category: "Tools",
			industry: "Food Service",
			popular: true,
			isPaid: true,
			apiIntegration: "OpenTable",
			monthlyPrice: 25,
			settings: {
				title: "Make Reservation",
				showAvailability: true,
				showPartySize: true,
				showSpecialRequests: true,
			},
		},
		loyalty_program: {
			icon: "🎁",
			title: "Loyalty Program",
			description: "Customer rewards and points system",
			category: "Marketing",
			industry: "Food Service",
			popular: true,
			isPaid: true,
			apiIntegration: "LoyaltyLion",
			monthlyPrice: 19,
			settings: {
				title: "Loyalty Rewards",
				showPoints: true,
				showRewards: true,
				showTiers: true,
			},
		},

		// Fitness Features
		class_schedule: {
			icon: "💪",
			title: "Class Schedule",
			description: "Fitness class schedules and registration",
			category: "Fitness",
			industry: "Fitness",
			popular: true,
			settings: {
				title: "Class Schedule",
				showInstructors: true,
				showDifficulty: true,
				showCapacity: true,
			},
		},
		membership_management: {
			icon: "🏋️",
			title: "Membership Management",
			description: "Gym membership signup and management",
			category: "Tools",
			industry: "Fitness",
			popular: true,
			isPaid: true,
			apiIntegration: "Mindbody",
			monthlyPrice: 49,
			settings: {
				title: "Memberships",
				showPlans: true,
				showPricing: true,
				showBenefits: true,
			},
		},
		personal_training: {
			icon: "👨‍🏫",
			title: "Personal Training",
			description: "Book personal training sessions",
			category: "Fitness",
			industry: "Fitness",
			popular: true,
			settings: {
				title: "Personal Training",
				showTrainers: true,
				showSpecialties: true,
				showPricing: true,
			},
		},

		// Education Features
		course_catalog: {
			icon: "📚",
			title: "Course Catalog",
			description: "Educational courses and programs",
			category: "Education",
			industry: "Education",
			popular: true,
			settings: {
				title: "Courses & Programs",
				showCurriculum: true,
				showPrerequisites: true,
				showCertification: true,
			},
		},
		student_portal: {
			icon: "🎓",
			title: "Student Portal",
			description: "Student access to grades and resources",
			category: "Tools",
			industry: "Education",
			popular: true,
			isPaid: true,
			apiIntegration: "Canvas",
			monthlyPrice: 39,
			settings: {
				title: "Student Portal",
				showGrades: true,
				showAssignments: true,
				showResources: true,
			},
		},
		enrollment_system: {
			icon: "📝",
			title: "Enrollment System",
			description: "Student registration and enrollment",
			category: "Tools",
			industry: "Education",
			popular: true,
			isPaid: true,
			apiIntegration: "PowerSchool",
			monthlyPrice: 29,
			settings: {
				title: "Enrollment",
				showPrograms: true,
				showRequirements: true,
				showDeadlines: true,
			},
		},

		// Construction Features
		project_portfolio: {
			icon: "🏗️",
			title: "Project Portfolio",
			description: "Showcase completed construction projects",
			category: "Construction",
			industry: "Construction",
			popular: true,
			settings: {
				title: "Our Projects",
				showBeforeAfter: true,
				showDetails: true,
				showTestimonials: true,
			},
		},
		estimate_calculator: {
			icon: "🧮",
			title: "Estimate Calculator",
			description: "Online project estimation tool",
			category: "Tools",
			industry: "Construction",
			popular: true,
			settings: {
				title: "Get Estimate",
				showServices: true,
				showMaterials: true,
				showTimeline: true,
			},
		},
		permit_tracker: {
			icon: "📋",
			title: "Permit Tracker",
			description: "Track building permits and inspections",
			category: "Tools",
			industry: "Construction",
			popular: true,
			settings: {
				title: "Permits & Inspections",
				showStatus: true,
				showRequirements: true,
				showTimeline: true,
			},
		},

		// Beauty Features
		service_menu: {
			icon: "💅",
			title: "Service Menu",
			description: "Beauty and spa service offerings",
			category: "Beauty",
			industry: "Beauty",
			popular: true,
			settings: {
				title: "Services & Pricing",
				showDuration: true,
				showSpecialists: true,
				showPackages: true,
			},
		},
		appointment_booking: {
			icon: "📅",
			title: "Appointment Booking",
			description: "Book beauty and spa appointments",
			category: "Tools",
			industry: "Beauty",
			popular: true,
			isPaid: true,
			apiIntegration: "Booksy",
			monthlyPrice: 19,
			settings: {
				title: "Book Appointment",
				showServices: true,
				showStylists: true,
				showAvailability: true,
			},
		},
		product_catalog: {
			icon: "🛍️",
			title: "Product Catalog",
			description: "Beauty products and retail items",
			category: "Beauty",
			industry: "Beauty",
			popular: true,
			settings: {
				title: "Products",
				showCategories: true,
				showPricing: true,
				showReviews: true,
			},
		},

		// Home Services Features
		service_areas: {
			icon: "🗺️",
			title: "Service Areas",
			description: "Map of service coverage areas",
			category: "Home Services",
			industry: "Home Services",
			popular: true,
			settings: {
				title: "Service Areas",
				showMap: true,
				showZones: true,
				showPricing: true,
			},
		},
		emergency_service: {
			icon: "🚨",
			title: "Emergency Service",
			description: "24/7 emergency service availability",
			category: "Home Services",
			industry: "Home Services",
			popular: true,
			settings: {
				title: "Emergency Service",
				showAvailability: true,
				showResponseTime: true,
				showContact: true,
			},
		},
		maintenance_schedule: {
			icon: "📅",
			title: "Maintenance Schedule",
			description: "Scheduled maintenance services",
			category: "Home Services",
			industry: "Home Services",
			popular: true,
			settings: {
				title: "Maintenance Schedule",
				showServices: true,
				showFrequency: true,
				showReminders: true,
			},
		},

		// Retail Features
		inventory_tracker: {
			icon: "📦",
			title: "Inventory Tracker",
			description: "Real-time inventory management",
			category: "Tools",
			industry: "Retail",
			popular: true,
			isPaid: true,
			apiIntegration: "Shopify",
			monthlyPrice: 29,
			settings: {
				title: "Inventory",
				showStock: true,
				showCategories: true,
				showAlerts: true,
			},
		},
		online_store: {
			icon: "🛒",
			title: "Online Store",
			description: "E-commerce store integration",
			category: "Tools",
			industry: "Retail",
			popular: true,
			isPaid: true,
			apiIntegration: "Shopify",
			monthlyPrice: 39,
			settings: {
				title: "Shop Online",
				showProducts: true,
				showShipping: true,
				showReturns: true,
			},
		},
		loyalty_rewards: {
			icon: "🎁",
			title: "Loyalty Rewards",
			description: "Customer loyalty and rewards program",
			category: "Marketing",
			industry: "Retail",
			popular: true,
			isPaid: true,
			apiIntegration: "Smile.io",
			monthlyPrice: 19,
			settings: {
				title: "Loyalty Program",
				showPoints: true,
				showRewards: true,
				showTiers: true,
			},
		},

		// Hospitality Features
		room_booking: {
			icon: "🛏️",
			title: "Room Booking",
			description: "Hotel room reservations and availability",
			category: "Tools",
			industry: "Hospitality",
			popular: true,
			isPaid: true,
			apiIntegration: "Booking.com",
			monthlyPrice: 49,
			settings: {
				title: "Book a Room",
				showAmenities: true,
				showPricing: true,
				showAvailability: true,
			},
		},
		amenities_list: {
			icon: "🏊",
			title: "Amenities",
			description: "Hotel amenities and facilities",
			category: "Hospitality",
			industry: "Hospitality",
			popular: true,
			settings: {
				title: "Amenities",
				showFacilities: true,
				showHours: true,
				showPricing: true,
			},
		},
		concierge_service: {
			icon: "🎩",
			title: "Concierge Service",
			description: "Concierge and guest services",
			category: "Hospitality",
			industry: "Hospitality",
			popular: true,
			settings: {
				title: "Concierge Services",
				showServices: true,
				showHours: true,
				showContact: true,
			},
		},

		// Nonprofit Features
		donation_system: {
			icon: "💝",
			title: "Donation System",
			description: "Accept online donations and fundraising",
			category: "Tools",
			industry: "Nonprofit",
			popular: true,
			isPaid: true,
			apiIntegration: "Donorbox",
			monthlyPrice: 19,
			settings: {
				title: "Donate Now",
				showCampaigns: true,
				showImpact: true,
				showRecurring: true,
			},
		},
		volunteer_signup: {
			icon: "🤝",
			title: "Volunteer Signup",
			description: "Volunteer opportunity registration",
			category: "Nonprofit",
			industry: "Nonprofit",
			popular: true,
			settings: {
				title: "Volunteer",
				showOpportunities: true,
				showRequirements: true,
				showSchedule: true,
			},
		},
		impact_tracker: {
			icon: "📊",
			title: "Impact Tracker",
			description: "Track and display organizational impact",
			category: "Nonprofit",
			industry: "Nonprofit",
			popular: true,
			settings: {
				title: "Our Impact",
				showMetrics: true,
				showStories: true,
				showProgress: true,
			},
		},

		// Technology Features
		api_documentation: {
			icon: "🔧",
			title: "API Documentation",
			description: "Technical API documentation and guides",
			category: "Technology",
			industry: "Technology",
			popular: true,
			settings: {
				title: "API Docs",
				showEndpoints: true,
				showExamples: true,
				showSDKs: true,
			},
		},
		status_page: {
			icon: "📊",
			title: "Status Page",
			description: "Service status and uptime monitoring",
			category: "Technology",
			industry: "Technology",
			popular: true,
			isPaid: true,
			apiIntegration: "Statuspage",
			monthlyPrice: 29,
			settings: {
				title: "Service Status",
				showUptime: true,
				showIncidents: true,
				showMaintenance: true,
			},
		},
		support_tickets: {
			icon: "🎫",
			title: "Support Tickets",
			description: "Customer support ticket system",
			category: "Tools",
			industry: "Technology",
			popular: true,
			isPaid: true,
			apiIntegration: "Zendesk",
			monthlyPrice: 25,
			settings: {
				title: "Support",
				showTickets: true,
				showKnowledge: true,
				showChat: true,
			},
		},

		// Creative Agency Features
		portfolio_showcase: {
			icon: "🎨",
			title: "Portfolio Showcase",
			description: "Creative work portfolio and case studies",
			category: "Creative",
			industry: "Creative Agencies",
			popular: true,
			settings: {
				title: "Our Work",
				showCategories: true,
				showProcess: true,
				showTestimonials: true,
			},
		},
		project_timeline: {
			icon: "📅",
			title: "Project Timeline",
			description: "Project milestones and delivery tracking",
			category: "Creative",
			industry: "Creative Agencies",
			popular: true,
			settings: {
				title: "Project Timeline",
				showMilestones: true,
				showProgress: true,
				showDeliverables: true,
			},
		},
		client_portal: {
			icon: "🔐",
			title: "Client Portal",
			description: "Secure client access to project files",
			category: "Tools",
			industry: "Creative Agencies",
			popular: true,
			isPaid: true,
			apiIntegration: "Basecamp",
			monthlyPrice: 39,
			settings: {
				title: "Client Portal",
				showFiles: true,
				showFeedback: true,
				showCommunication: true,
			},
		},

		// Pet Care Features
		pet_profiles: {
			icon: "🐕",
			title: "Pet Profiles",
			description: "Pet information and care history",
			category: "Pet Care",
			industry: "Pet Care",
			popular: true,
			settings: {
				title: "Pet Profiles",
				showSpecies: true,
				showMedical: true,
				showPreferences: true,
			},
		},
		grooming_schedule: {
			icon: "✂️",
			title: "Grooming Schedule",
			description: "Pet grooming appointments and services",
			category: "Pet Care",
			industry: "Pet Care",
			popular: true,
			settings: {
				title: "Grooming Services",
				showServices: true,
				showPricing: true,
				showAvailability: true,
			},
		},
		vaccination_tracker: {
			icon: "💉",
			title: "Vaccination Tracker",
			description: "Pet vaccination and health records",
			category: "Pet Care",
			industry: "Pet Care",
			popular: true,
			settings: {
				title: "Health Records",
				showVaccinations: true,
				showDueDates: true,
				showHistory: true,
			},
		},

		// Logistics Features
		tracking_system: {
			icon: "📦",
			title: "Tracking System",
			description: "Package and shipment tracking",
			category: "Logistics",
			industry: "Logistics",
			popular: true,
			isPaid: true,
			apiIntegration: "ShipStation",
			monthlyPrice: 29,
			settings: {
				title: "Track Shipment",
				showStatus: true,
				showLocation: true,
				showHistory: true,
			},
		},
		shipping_calculator: {
			icon: "🚚",
			title: "Shipping Calculator",
			description: "Calculate shipping costs and delivery times",
			category: "Tools",
			industry: "Logistics",
			popular: true,
			settings: {
				title: "Shipping Calculator",
				showRates: true,
				showOptions: true,
				showDelivery: true,
			},
		},
		warehouse_inventory: {
			icon: "🏭",
			title: "Warehouse Inventory",
			description: "Warehouse stock and inventory management",
			category: "Logistics",
			industry: "Logistics",
			popular: true,
			isPaid: true,
			apiIntegration: "ShipBob",
			monthlyPrice: 49,
			settings: {
				title: "Inventory",
				showStock: true,
				showLocations: true,
				showAlerts: true,
			},
		},

		// Entertainment Features
		event_calendar: {
			icon: "🎭",
			title: "Event Calendar",
			description: "Upcoming events and performances",
			category: "Entertainment",
			industry: "Entertainment",
			popular: true,
			settings: {
				title: "Events",
				showSchedule: true,
				showTickets: true,
				showVenues: true,
			},
		},
		ticket_sales: {
			icon: "🎫",
			title: "Ticket Sales",
			description: "Event ticket purchasing system",
			category: "Tools",
			industry: "Entertainment",
			popular: true,
			isPaid: true,
			apiIntegration: "Eventbrite",
			monthlyPrice: 25,
			settings: {
				title: "Buy Tickets",
				showEvents: true,
				showPricing: true,
				showSeating: true,
			},
		},
		artist_profiles: {
			icon: "🎤",
			title: "Artist Profiles",
			description: "Performer and artist information",
			category: "Entertainment",
			industry: "Entertainment",
			popular: true,
			settings: {
				title: "Artists",
				showBios: true,
				showSchedules: true,
				showMedia: true,
			},
		},

		// Paid Integrations
		live_chat: {
			icon: "💬",
			title: "Live Chat",
			description: "Real-time customer chat support",
			category: "Tools",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Intercom",
			monthlyPrice: 29,
			settings: {
				title: "Live Chat",
				showAvailability: true,
				showAutoReply: true,
				showFileSharing: true,
			},
		},
		online_payments: {
			icon: "💳",
			title: "Online Payments",
			description: "Accept payments directly on your profile",
			category: "Tools",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Stripe",
			monthlyPrice: 0,
			transactionFee: "2.9% + 30¢",
			settings: {
				title: "Pay Online",
				showCards: true,
				showDigitalWallets: true,
				showInvoicing: true,
			},
		},
		profile_analytics: {
			icon: "📊",
			title: "Profile Analytics",
			description: "Track profile views and engagement",
			category: "Tools",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Google Analytics",
			monthlyPrice: 0,
			settings: {
				title: "Analytics",
				showViews: true,
				showEngagement: true,
				showSources: true,
			},
		},
		social_media_feed: {
			icon: "📱",
			title: "Social Media Feed",
			description: "Display social media posts and updates",
			category: "Marketing",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Hootsuite",
			monthlyPrice: 19,
			settings: {
				title: "Social Feed",
				showPlatforms: true,
				showHashtags: true,
				showEngagement: true,
			},
		},
		email_marketing: {
			icon: "📧",
			title: "Email Marketing",
			description: "Email newsletter and marketing campaigns",
			category: "Marketing",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Mailchimp",
			monthlyPrice: 15,
			settings: {
				title: "Email Marketing",
				showTemplates: true,
				showSegments: true,
				showAnalytics: true,
			},
		},
		video_gallery: {
			icon: "🎥",
			title: "Video Gallery",
			description: "Showcase video content and testimonials",
			category: "Content",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Vimeo",
			monthlyPrice: 12,
			settings: {
				title: "Video Gallery",
				showCategories: true,
				showPlaylists: true,
				showEmbedding: true,
			},
		},
		blog_system: {
			icon: "📝",
			title: "Blog System",
			description: "Content management and blogging platform",
			category: "Content",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Ghost",
			monthlyPrice: 9,
			settings: {
				title: "Blog",
				showCategories: true,
				showComments: true,
				showNewsletter: true,
			},
		},
		seo_tools: {
			icon: "🔍",
			title: "SEO Tools",
			description: "Search engine optimization tools and analytics",
			category: "Marketing",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "SEMrush",
			monthlyPrice: 99,
			settings: {
				title: "SEO Tools",
				showKeywords: true,
				showRankings: true,
				showCompetitors: true,
			},
		},
		backup_system: {
			icon: "💾",
			title: "Backup System",
			description: "Automated data backup and recovery",
			category: "Tools",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Backblaze",
			monthlyPrice: 7,
			settings: {
				title: "Backup System",
				showSchedule: true,
				showRetention: true,
				showRecovery: true,
			},
		},
		security_monitoring: {
			icon: "🔒",
			title: "Security Monitoring",
			description: "Website security and threat monitoring",
			category: "Tools",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Sucuri",
			monthlyPrice: 20,
			settings: {
				title: "Security",
				showThreats: true,
				showFirewall: true,
				showSSL: true,
			},
		},

		// Business Enhancement Features
		business_logo: {
			icon: "🏢",
			title: "Business Logo",
			description: "Display your business logo on your profile and job posts",
			category: "Branding",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 1,
			settings: {
				title: "Business Logo",
				showOnProfile: true,
				showOnJobPosts: true,
				showBrandRecognition: true,
			},
		},
		verified_badge: {
			icon: "✅",
			title: "Verified Badge",
			description: "Show customers you're a verified, trusted business",
			category: "Trust",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 5,
			settings: {
				title: "Verified Badge",
				showTrustIndicators: true,
				showHigherConversion: true,
			},
		},
		priority_support: {
			icon: "🎯",
			title: "Priority Support",
			description: "Get faster response times and dedicated support",
			category: "Support",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 10,
			settings: {
				title: "Priority Support",
				showResponseTime: "4-hour",
				showDedicatedAgent: true,
				showPriorityTickets: true,
			},
		},
		advanced_analytics: {
			icon: "📊",
			title: "Advanced Analytics",
			description: "Deep insights into your job performance and audience",
			category: "Analytics",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 12,
			settings: {
				title: "Advanced Analytics",
				showDetailedAnalytics: true,
				showCustomReports: true,
				showExportCapabilities: true,
				showROITracking: true,
			},
		},
		boost_package: {
			icon: "🚀",
			title: "Boost Package",
			description: "Get 5 boost credits per month to promote your job posts",
			category: "Marketing",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 15,
			settings: {
				title: "Boost Package",
				showBoostCredits: 5,
				showPriorityPlacement: true,
				showAdvancedTargeting: true,
				showPerformanceAnalytics: true,
			},
		},
		unlimited_job_posts: {
			icon: "📝",
			title: "Unlimited Job Posts",
			description: "Post as many jobs as you need without limits",
			category: "Job Management",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 20,
			settings: {
				title: "Unlimited Job Posts",
				showUnlimitedPosts: true,
				showNoMonthlyLimits: true,
				showPostAnytime: true,
			},
		},
		background_check_credits: {
			icon: "🔍",
			title: "Background Check Credits",
			description: "Verify candidate backgrounds and credentials",
			category: "Hiring",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 8,
			settings: {
				title: "Background Checks",
				showCriminalChecks: true,
				showEmploymentVerification: true,
				showEducationVerification: true,
				showLicenseChecks: true,
			},
		},
		skill_assessment_tools: {
			icon: "🧪",
			title: "Skill Assessment Tools",
			description: "Test candidate skills before hiring",
			category: "Hiring",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 12,
			settings: {
				title: "Skill Assessments",
				showCustomTests: true,
				showIndustryAssessments: true,
				showAutomatedScoring: true,
				showDetailedReports: true,
			},
		},
		legal_contract_templates: {
			icon: "📄",
			title: "Legal Contract Templates",
			description: "Professional contract templates for hiring",
			category: "Legal",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 15,
			settings: {
				title: "Contract Templates",
				showEmploymentContracts: true,
				showNDATemplates: true,
				showServiceAgreements: true,
				showLegalCompliance: true,
			},
		},
		payroll_integration: {
			icon: "💰",
			title: "Payroll Integration",
			description: "Seamless payroll processing for hired workers",
			category: "Payroll",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 18,
			settings: {
				title: "Payroll Integration",
				showDirectDeposit: true,
				showTaxCalculations: true,
				showPayrollReports: true,
				show1099Generation: true,
			},
		},
		workers_insurance: {
			icon: "🛡️",
			title: "Workers Insurance",
			description: "Insurance coverage for hired workers",
			category: "Insurance",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 25,
			settings: {
				title: "Workers Insurance",
				showGeneralLiability: true,
				showWorkersCompensation: true,
				showProfessionalLiability: true,
				showQuickClaims: true,
			},
		},
		advanced_scheduling: {
			icon: "📅",
			title: "Advanced Scheduling",
			description: "Professional scheduling and time tracking",
			category: "Scheduling",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 10,
			settings: {
				title: "Advanced Scheduling",
				showShiftScheduling: true,
				showTimeTracking: true,
				showOvertimeCalculations: true,
				showMobileApp: true,
			},
		},
		quality_guarantee: {
			icon: "⭐",
			title: "Quality Guarantee",
			description: "Money-back guarantee if worker doesn't meet standards",
			category: "Quality",
			industry: "All Industries",
			popular: true,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 20,
			settings: {
				title: "Quality Guarantee",
				show30DayGuarantee: true,
				showFreeReplacement: true,
				showQualityStandards: true,
				showRiskFreeHiring: true,
			},
		},
		emergency_replacement: {
			icon: "🚨",
			title: "Emergency Replacement",
			description: "Quick replacement if worker can't complete job",
			category: "Support",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 15,
			settings: {
				title: "Emergency Replacement",
				show24HourReplacement: true,
				showSameDayCoverage: true,
				showNoAdditionalFees: true,
				showPriorityMatching: true,
			},
		},
		team_management: {
			icon: "👥",
			title: "Team Management",
			description: "Manage multiple workers and projects",
			category: "Management",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 30,
			settings: {
				title: "Team Management",
				showTeamDashboard: true,
				showProjectTracking: true,
				showPerformanceReviews: true,
				showCommunicationTools: true,
			},
		},
		early_access_features: {
			icon: "🔮",
			title: "Early Access Features",
			description: "Get access to new features before anyone else",
			category: "Premium",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 25,
			settings: {
				title: "Early Access",
				showBetaFeatures: true,
				showEarlyAccess: true,
				showFeatureRequests: true,
				showExclusiveUpdates: true,
			},
		},
		custom_branding: {
			icon: "🎨",
			title: "Custom Branding",
			description: "Customize your profile with your brand colors and styling",
			category: "Branding",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 30,
			settings: {
				title: "Custom Branding",
				showCustomColors: true,
				showBrandStyling: true,
				showWhiteLabel: true,
				showCustomDomain: true,
			},
		},
		api_access: {
			icon: "🔌",
			title: "API Access",
			description: "Integrate Thorbis with your existing systems",
			category: "Development",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 50,
			settings: {
				title: "API Access",
				showFullAPIAccess: true,
				showWebhookSupport: true,
				showCustomIntegrations: true,
				showDeveloperTools: true,
			},
		},
		dedicated_account_manager: {
			icon: "👨‍💼",
			title: "Dedicated Account Manager",
			description: "Personal account manager to help grow your business",
			category: "Premium",
			industry: "All Industries",
			popular: false,
			isPaid: true,
			apiIntegration: "Thorbis",
			monthlyPrice: 100,
			settings: {
				title: "Account Manager",
				showPersonalManager: true,
				showStrategicGuidance: true,
				showAccountOptimization: true,
				showPrioritySupport: true,
			},
		},

		// Free Profile Enhancement Features
		social_media_links: {
			icon: "📱",
			title: "Social Media Links",
			description: "Connect your social media profiles to your business",
			category: "Social",
			industry: "All Industries",
			popular: true,
			settings: {
				title: "Follow Us",
				showFacebook: true,
				showInstagram: true,
				showTwitter: true,
				showLinkedIn: true,
				showYouTube: true,
				showTikTok: true,
			},
		},
		testimonials_section: {
			icon: "💬",
			title: "Testimonials",
			description: "Showcase customer testimonials and success stories",
			category: "Social",
			industry: "All Industries",
			popular: true,
			settings: {
				title: "What Our Customers Say",
				showCustomerPhotos: true,
				showRatings: true,
				showDates: true,
				showCategories: true,
			},
		},
		awards_recognition: {
			icon: "🏆",
			title: "Awards & Recognition",
			description: "Display awards, certifications, and industry recognition",
			category: "Trust",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Awards & Recognition",
				showAwardDates: true,
				showIssuingOrganizations: true,
				showDescriptions: true,
				showBadges: true,
			},
		},
		partnerships_network: {
			icon: "🤝",
			title: "Partnerships",
			description: "Showcase your business partnerships and collaborations",
			category: "Business",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Our Partners",
				showPartnerLogos: true,
				showPartnershipTypes: true,
				showCollaborationDetails: true,
			},
		},
		events_calendar: {
			icon: "📅",
			title: "Events Calendar",
			description: "Share upcoming events, workshops, and community activities",
			category: "Content",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Upcoming Events",
				showEventDetails: true,
				showRegistration: true,
				showLocation: true,
				showCategories: true,
			},
		},
		resource_library: {
			icon: "📚",
			title: "Resource Library",
			description: "Share helpful resources, guides, and educational content",
			category: "Content",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Resources",
				showCategories: true,
				showDownloads: true,
				showDescriptions: true,
				showFileTypes: true,
			},
		},
		contact_form: {
			icon: "📝",
			title: "Contact Form",
			description: "Let customers reach out directly through your profile",
			category: "Business",
			industry: "All Industries",
			popular: true,
			settings: {
				title: "Get in Touch",
				showNameField: true,
				showEmailField: true,
				showPhoneField: true,
				showMessageField: true,
				showSubjectOptions: true,
			},
		},
		interactive_map: {
			icon: "🗺️",
			title: "Interactive Map",
			description: "Show your location with an interactive map",
			category: "Business",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Find Us",
				showDirections: true,
				showStreetView: true,
				showNearbyLandmarks: true,
				showParkingInfo: true,
			},
		},
		weather_widget: {
			icon: "🌤️",
			title: "Weather Widget",
			description: "Show local weather for your business location",
			category: "Tools",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Local Weather",
				showTemperature: true,
				showForecast: true,
				showConditions: true,
				showHumidity: true,
			},
		},
		accessibility_features: {
			icon: "♿",
			title: "Accessibility Info",
			description: "Share accessibility features and accommodations",
			category: "Business",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Accessibility",
				showWheelchairAccess: true,
				showHearingAssistance: true,
				showVisualAssistance: true,
				showServiceAnimals: true,
			},
		},
		language_support: {
			icon: "🌍",
			title: "Language Support",
			description: "Show which languages your business supports",
			category: "Business",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Languages We Speak",
				showPrimaryLanguage: true,
				showSecondaryLanguages: true,
				showTranslationServices: true,
			},
		},
		payment_methods: {
			icon: "💳",
			title: "Payment Methods",
			description: "Display accepted payment methods and options",
			category: "Business",
			industry: "All Industries",
			popular: true,
			settings: {
				title: "Payment Options",
				showCash: true,
				showCreditCards: true,
				showDigitalWallets: true,
				showInsurance: true,
			},
		},
		emergency_contact: {
			icon: "🚨",
			title: "Emergency Contact",
			description: "Provide emergency contact information",
			category: "Business",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Emergency Contact",
				showEmergencyPhone: true,
				showAfterHours: true,
				showResponseTime: true,
			},
		},
		environmental_commitment: {
			icon: "🌱",
			title: "Environmental Commitment",
			description: "Share your environmental initiatives and sustainability",
			category: "Trust",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Environmental Commitment",
				showGreenPractices: true,
				showCertifications: true,
				showInitiatives: true,
			},
		},
		community_involvement: {
			icon: "🏘️",
			title: "Community Involvement",
			description: "Showcase your community involvement and local support",
			category: "Social",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Community Involvement",
				showLocalSupport: true,
				showCharitableWork: true,
				showEvents: true,
			},
		},
		staff_profiles: {
			icon: "👥",
			title: "Staff Profiles",
			description: "Introduce your team members and their expertise",
			category: "Content",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Meet Our Team",
				showPhotos: true,
				showRoles: true,
				showExperience: true,
				showSpecialties: true,
			},
		},
		before_after_gallery: {
			icon: "📸",
			title: "Before & After Gallery",
			description: "Showcase your work with before and after comparisons",
			category: "Content",
			industry: "All Industries",
			popular: true,
			settings: {
				title: "Before & After",
				showComparisons: true,
				showDescriptions: true,
				showCategories: true,
			},
		},
		video_testimonials: {
			icon: "🎥",
			title: "Video Testimonials",
			description: "Share video testimonials from satisfied customers",
			category: "Content",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Video Testimonials",
				showThumbnails: true,
				showDurations: true,
				showTranscripts: true,
			},
		},
		blog_section: {
			icon: "📝",
			title: "Blog Section",
			description: "Share industry insights, tips, and company updates",
			category: "Content",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Latest News",
				showCategories: true,
				showDates: true,
				showReadTime: true,
				showFeatured: true,
			},
		},
		newsletter_signup: {
			icon: "📧",
			title: "Newsletter Signup",
			description: "Collect email subscribers for your newsletter",
			category: "Marketing",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Stay Updated",
				showFrequency: true,
				showBenefits: true,
				showPrivacyNotice: true,
			},
		},
		appointment_reminders: {
			icon: "⏰",
			title: "Appointment Reminders",
			description: "Send automated appointment reminders to customers",
			category: "Tools",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Appointment Reminders",
				showSMSReminders: true,
				showEmailReminders: true,
				showTiming: true,
			},
		},
		customer_feedback: {
			icon: "📊",
			title: "Customer Feedback",
			description: "Collect and display customer feedback and suggestions",
			category: "Social",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Customer Feedback",
				showRatings: true,
				showComments: true,
				showCategories: true,
			},
		},
		seasonal_hours: {
			icon: "🌷",
			title: "Seasonal Hours",
			description: "Display seasonal business hours and special schedules",
			category: "Business",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Seasonal Hours",
				showHolidayHours: true,
				showSeasonalChanges: true,
				showSpecialEvents: true,
			},
		},
		service_area_map: {
			icon: "🗺️",
			title: "Service Area Map",
			description: "Show your service coverage areas on an interactive map",
			category: "Business",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Service Areas",
				showCoverageZones: true,
				showTravelFees: true,
				showResponseTimes: true,
			},
		},
		equipment_showcase: {
			icon: "🔧",
			title: "Equipment Showcase",
			description: "Showcase your professional equipment and tools",
			category: "Content",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Our Equipment",
				showEquipmentPhotos: true,
				showSpecifications: true,
				showMaintenance: true,
			},
		},
		safety_certifications: {
			icon: "🛡️",
			title: "Safety Certifications",
			description: "Display safety certifications and compliance information",
			category: "Trust",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Safety & Compliance",
				showCertifications: true,
				showExpiryDates: true,
				showComplianceInfo: true,
			},
		},
		project_timeline: {
			icon: "📅",
			title: "Project Timeline",
			description: "Show project timelines and milestone tracking",
			category: "Content",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Project Timeline",
				showMilestones: true,
				showProgress: true,
				showDeliverables: true,
			},
		},
		client_portal_access: {
			icon: "🔐",
			title: "Client Portal Access",
			description: "Provide secure access to client portals and dashboards",
			category: "Tools",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Client Portal",
				showLoginLink: true,
				showFeatures: true,
				showSupport: true,
			},
		},
		industry_insights: {
			icon: "📈",
			title: "Industry Insights",
			description: "Share industry trends, statistics, and market insights",
			category: "Content",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Industry Insights",
				showTrends: true,
				showStatistics: true,
				showAnalysis: true,
			},
		},
		referral_program: {
			icon: "🎁",
			title: "Referral Program",
			description: "Promote your customer referral program and rewards",
			category: "Marketing",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Referral Program",
				showRewards: true,
				showHowItWorks: true,
				showTerms: true,
			},
		},
		maintenance_tips: {
			icon: "💡",
			title: "Maintenance Tips",
			description: "Share helpful maintenance tips and advice",
			category: "Content",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Maintenance Tips",
				showCategories: true,
				showSeasonalTips: true,
				showDIYAdvice: true,
			},
		},
		emergency_procedures: {
			icon: "🚨",
			title: "Emergency Procedures",
			description: "Share emergency procedures and safety information",
			category: "Business",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Emergency Procedures",
				showSafetyInfo: true,
				showEmergencyContacts: true,
				showProcedures: true,
			},
		},
		quality_assurance: {
			icon: "✅",
			title: "Quality Assurance",
			description: "Showcase your quality assurance processes and standards",
			category: "Trust",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Quality Assurance",
				showStandards: true,
				showProcesses: true,
				showInspections: true,
			},
		},
		training_programs: {
			icon: "🎓",
			title: "Training Programs",
			description: "Offer training programs and educational opportunities",
			category: "Content",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Training Programs",
				showPrograms: true,
				showSchedules: true,
				showCertification: true,
			},
		},
		warranty_information: {
			icon: "📋",
			title: "Warranty Information",
			description: "Display warranty terms and coverage information",
			category: "Trust",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Warranty Information",
				showCoverage: true,
				showTerms: true,
				showClaims: true,
			},
		},
		financing_options: {
			icon: "💰",
			title: "Financing Options",
			description: "Show available financing and payment plan options",
			category: "Business",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Financing Options",
				showPaymentPlans: true,
				showInterestRates: true,
				showRequirements: true,
			},
		},
		installation_services: {
			icon: "🔧",
			title: "Installation Services",
			description: "Offer professional installation and setup services",
			category: "Services",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Installation Services",
				showServices: true,
				showPricing: true,
				showTimeline: true,
			},
		},
		maintenance_contracts: {
			icon: "📋",
			title: "Maintenance Contracts",
			description: "Offer ongoing maintenance and service contracts",
			category: "Services",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Maintenance Contracts",
				showPlans: true,
				showCoverage: true,
				showPricing: true,
			},
		},
		consultation_services: {
			icon: "💼",
			title: "Consultation Services",
			description: "Offer professional consultation and advisory services",
			category: "Services",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Consultation Services",
				showServices: true,
				showExpertise: true,
				showScheduling: true,
			},
		},
		emergency_services: {
			icon: "🚨",
			title: "Emergency Services",
			description: "Provide 24/7 emergency service availability",
			category: "Services",
			industry: "All Industries",
			popular: false,
			settings: {
				title: "Emergency Services",
				showAvailability: true,
				showResponseTime: true,
				showContact: true,
			},
		},
	};

	// Calculate billing for enabled paid features
	const calculateBilling = () => {
		let totalMonthly = 0;
		let paidFeatures = [];

		Object.entries(profile.features).forEach(([key, feature]) => {
			if (feature.enabled && availableFeatures[key]?.isPaid) {
				const featureData = availableFeatures[key];
				totalMonthly += featureData.monthlyPrice || 0;
				paidFeatures.push({
					name: featureData.title,
					price: featureData.monthlyPrice || 0,
					apiIntegration: featureData.apiIntegration,
					transactionFee: featureData.transactionFee,
					commission: featureData.commission,
				});
			}
		});

		return { totalMonthly, paidFeatures };
	};

	const { totalMonthly, paidFeatures } = calculateBilling();

	const categories = [
		"All",
		"Content",
		"Business",
		"Social",
		"Tools",
		"Marketing",
		"Trust",
		"Healthcare",
		"Real Estate",
		"Legal",
		"Automotive",
		"Food Service",
		"Fitness",
		"Education",
		"Construction",
		"Beauty",
		"Home Services",
		"Retail",
		"Hospitality",
		"Nonprofit",
		"Technology",
		"Creative",
		"Pet Care",
		"Logistics",
		"Entertainment",
		"Branding",
		"Support",
		"Analytics",
		"Job Management",
		"Hiring",
		"Payroll",
		"Insurance",
		"Scheduling",
		"Quality",
		"Management",
		"Premium",
		"Development",
		"Services",
	];
	const industries = [
		"All",
		...Array.from(
			new Set(
				Object.values(availableFeatures)
					.map((f) => f.industry)
					.filter(Boolean)
			)
		),
	];

	const filteredFeatures = Object.entries(availableFeatures).filter(([key, feature]) => {
		const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) || feature.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === "All" || feature.category === selectedCategory;
		const matchesIndustry = selectedIndustry === "All" || feature.industry === selectedIndustry;
		return matchesSearch && matchesCategory && matchesIndustry;
	});

	const handleFeatureToggle = (featureKey) => {
		setProfile((prev) => ({
			...prev,
			features: {
				...prev.features,
				[featureKey]: {
					...prev.features[featureKey],
					enabled: !prev.features[featureKey]?.enabled,
				},
			},
		}));

		// Track pending changes
		setPendingChanges((prev) => ({
			...prev,
			[featureKey]: !profile.features[featureKey]?.enabled,
		}));
	};

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

	// Handler functions for new features
	const handleLearnMore = (feature) => {
		setSelectedFeature(feature);
		setShowLearnMore(true);
	};

	const handleReportError = (feature) => {
		setSelectedFeature(feature);
		setReportForm({
			integrationName: feature.title,
			issue: "",
			description: "",
			contactEmail: "",
		});
		setShowReportError(true);
	};

	const handleRequestIntegration = () => {
		setRequestForm({
			integrationName: "",
			description: "",
			category: "",
			useCase: "",
			contactEmail: "",
		});
		setShowRequestIntegration(true);
	};

	const submitRequestIntegration = () => {
		// Here you would typically send this to your backend
		toast({
			title: "Request Submitted",
			description: "Thank you for your integration request! We'll review it and get back to you soon.",
		});
		setShowRequestIntegration(false);
	};

	const submitReportError = () => {
		// Here you would typically send this to your backend
		toast({
			title: "Report Submitted",
			description: "Thank you for reporting this issue. We'll investigate and fix it as soon as possible.",
		});
		setShowReportError(false);
	};

	const MarketplaceCard = ({ feature, isEnabled, onToggle, onExpand, isExpanded, index }) => (
		<div className="border rounded-xl transition-all hover:shadow-md border-border bg-card">
			<div className="p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3">
						<div className="text-3xl">{feature.icon}</div>
						<div className="flex-1">
							<div className="flex items-center space-x-2">
								<h4 className="font-semibold text-foreground">{feature.title}</h4>
								{feature.popular && (
									<Badge variant="secondary" className="text-xs">
										Popular
									</Badge>
								)}
								<Badge variant="outline" className="text-xs">
									{feature.category}
								</Badge>
								{feature.isPaid && (
									<Badge variant="destructive" className="text-xs">
										Paid
									</Badge>
								)}
							</div>
							<p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
							{feature.isPaid && (
								<div className="mt-2 text-sm">
									<span className="font-medium text-foreground">{feature.monthlyPrice === 0 ? "Free" : `$${feature.monthlyPrice}/month`}</span>
									{feature.transactionFee && <span className="text-muted-foreground ml-2">+ {feature.transactionFee}</span>}
									{feature.commission && <span className="text-muted-foreground ml-2">+ {feature.commission}</span>}
									{feature.apiIntegration && <span className="text-muted-foreground ml-2">via {feature.apiIntegration}</span>}
								</div>
							)}
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Switch checked={isEnabled} onCheckedChange={onToggle} />
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
										<Switch checked={setting} onCheckedChange={(value) => updateFeatureSetting(feature.key, key, value)} />
									) : typeof setting === "string" ? (
										<Input value={setting} onChange={(e) => updateFeatureSetting(feature.key, key, e.target.value)} className="w-full" />
									) : typeof setting === "number" ? (
										<Input type="number" value={setting} onChange={(e) => updateFeatureSetting(feature.key, key, parseInt(e.target.value))} className="w-full" />
									) : null}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Subtle action buttons */}
				<div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
					<div className="flex items-center space-x-3">
						<Button variant="ghost" size="sm" onClick={() => handleLearnMore(feature)} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
							<Info className="w-3 h-3 mr-1" />
							Learn More
						</Button>
						<Button variant="ghost" size="sm" onClick={() => handleReportError(feature)} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
							<AlertCircle className="w-3 h-3 mr-1" />
							Report Issue
						</Button>
					</div>
				</div>
			</div>
		</div>
	);

	const hasPendingChanges = Object.keys(pendingChanges).length > 0;

	return (
		<div className="w-full px-4 py-8 space-y-8 lg:px-24">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
							<Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<h1 className="text-4xl font-bold tracking-tight">Integrations & Billing</h1>
							<p className="text-lg text-muted-foreground mt-1">Browse and manage integrations for your business profile</p>
						</div>
					</div>
					<Button onClick={handleRequestIntegration} variant="outline" className="flex">
						<MessageSquare className="w-4 h-4 mr-2" />
						Request Integration
					</Button>
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Main Content - Integrations Marketplace */}
				<div className="lg:col-span-2 space-y-6">
					{/* Search and Filters */}
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input placeholder="Search integrations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
						</div>
						<Select value={selectedCategory} onValueChange={setSelectedCategory}>
							<SelectTrigger className="w-full sm:w-48">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
							<SelectTrigger className="w-full sm:w-48">
								<SelectValue placeholder="Industry" />
							</SelectTrigger>
							<SelectContent>
								{industries.map((industry) => (
									<SelectItem key={industry} value={industry}>
										{industry}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Active Integrations */}
					{Object.keys(profile.features).length > 0 && (
						<div className="mb-8">
							<h3 className="text-lg font-semibold mb-4 text-foreground">Active Integrations</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{Object.entries(profile.features)
									.filter(([, feature]) => feature.enabled)
									.map(([key, feature], index) => {
										const featureData = availableFeatures[key];
										if (!featureData) return null;

										return <MarketplaceCard key={key} feature={{ ...featureData, key }} isEnabled={feature.enabled} onToggle={() => handleFeatureToggle(key)} onExpand={() => toggleFeatureExpansion(key)} isExpanded={expandedFeatures.has(key)} index={index} />;
									})}
							</div>
						</div>
					)}

					{/* Available Integrations Section */}
					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">Available Integrations</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{filteredFeatures
								.filter(([key]) => !profile.features[key]?.enabled)
								.map(([key, feature], index) => (
									<MarketplaceCard key={key} feature={{ ...feature, key }} isEnabled={false} onToggle={() => handleFeatureToggle(key)} onExpand={() => toggleFeatureExpansion(key)} isExpanded={expandedFeatures.has(key)} index={index} />
								))}
						</div>
					</div>

					{/* Tip Section */}
					<div className="p-4 border border-dashed border-border rounded-lg text-center">
						<p className="text-sm text-muted-foreground mb-2">💡 Tip: Add any integration to your profile, regardless of your business type!</p>
						<p className="text-xs text-muted-foreground">For example, a plumber could add a &ldquo;Blog&rdquo; to share plumbing tips, or a &ldquo;Portfolio&rdquo; to showcase their best work.</p>
					</div>
				</div>

				{/* Sidebar - Order Summary & Billing */}
				<div className="lg:col-span-1">
					{isMobile ? (
						<Dialog>
							<DialogTrigger asChild>
								<Button className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-lg">
									<CreditCard className="w-6 h-6" />
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle className="flex items-center gap-2">
										<CreditCard className="w-5 h-5" />
										Billing Summary
									</DialogTitle>
									<DialogDescription>All active paid integrations</DialogDescription>
								</DialogHeader>
								<div className="space-y-6">
									{/* Thorbis Elite Section */}
									<div className="p-4 border-2 border-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5">
										<div className="flex items-center gap-2 mb-3">
											<div className="text-2xl">👑</div>
											<div>
												<h4 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Thorbis Elite</h4>
												<p className="text-xs text-muted-foreground">Exclusive application program</p>
											</div>
										</div>
										<div className="space-y-2 text-sm">
											<div className="flex items-center gap-2">
												<span className="text-purple-600 font-semibold">0.00008%</span>
												<span className="text-muted-foreground">acceptance rate</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-purple-600 font-semibold">All features</span>
												<span className="text-muted-foreground">included</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-purple-600 font-semibold">VIP support</span>
												<span className="text-muted-foreground">& custom solutions</span>
											</div>
										</div>
										<Button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" variant="default">
											Apply for Elite
										</Button>
										<p className="text-xs text-center text-muted-foreground mt-2">By invitation only</p>
									</div>

									{/* Active Paid Integrations List */}
									<div className="space-y-3">
										{paidFeatures.length === 0 ? (
											<p className="text-sm text-muted-foreground text-center py-4">No paid integrations active</p>
										) : (
											paidFeatures.map((feature, idx) => (
												<div key={idx} className="flex items-center justify-between text-sm">
													<span className="truncate">{feature.name}</span>
													<span className="font-medium">{feature.price === 0 ? "Free" : `$${feature.price}/month`}</span>
												</div>
											))
										)}
									</div>
									{paidFeatures.length > 0 && <Separator />}
									{/* Total */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-lg font-semibold">Total</span>
											<span className="text-2xl font-bold">${totalMonthly}</span>
										</div>
										<p className="text-sm text-muted-foreground">per month</p>
									</div>
									<Button onClick={() => setShowCheckout(true)} className="w-full" disabled={!hasPendingChanges}>
										{hasPendingChanges ? "Checkout Changes" : "No Changes"}
										{hasPendingChanges && <CheckCircle2 className="w-4 h-4 ml-2" />}
									</Button>
									<Button onClick={() => setShowPaymentMethods(true)} variant="outline" className="w-full mt-2">
										Manage Payment Methods
									</Button>
									<Button variant="link" className="w-full mt-2" asChild>
										<a href="/dashboard/business/billing">View Invoices & Billing History</a>
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					) : (
						<div className="sticky top-6">
							{/* Thorbis Elite Section */}
							<Card className="mb-6 border-2 border-gradient-to-br from-purple-500/20 to-blue-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
								<CardContent className="p-6">
									<div className="flex items-center gap-3 mb-4">
										<div className="text-3xl">👑</div>
										<div>
											<h4 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Thorbis Elite</h4>
											<p className="text-sm text-muted-foreground">Exclusive application program</p>
										</div>
									</div>
									<div className="space-y-3 text-sm mb-4">
										<div className="flex items-center gap-2">
											<span className="text-purple-600 font-semibold">0.00008%</span>
											<span className="text-muted-foreground">acceptance rate</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-purple-600 font-semibold">All features</span>
											<span className="text-muted-foreground">included</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-purple-600 font-semibold">Exclusive benefits</span>
											<span className="text-muted-foreground">& VIP support</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-purple-600 font-semibold">Custom solutions</span>
											<span className="text-muted-foreground">& dedicated team</span>
										</div>
									</div>
									<Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" variant="default">
										Apply for Elite
									</Button>
									<p className="text-xs text-center text-muted-foreground mt-2">By invitation only</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<CreditCard className="w-5 h-5" />
										Billing Summary
									</CardTitle>
									<CardDescription>All active paid integrations</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Active Paid Integrations List */}
									<div className="space-y-3">
										{paidFeatures.length === 0 ? (
											<p className="text-sm text-muted-foreground text-center py-4">No paid integrations active</p>
										) : (
											paidFeatures.map((feature, idx) => (
												<div key={idx} className="flex items-center justify-between text-sm">
													<span className="truncate">{feature.name}</span>
													<span className="font-medium">{feature.price === 0 ? "Free" : `$${feature.price}/month`}</span>
												</div>
											))
										)}
									</div>
									{paidFeatures.length > 0 && <Separator />}
									{/* Total */}
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-lg font-semibold">Total</span>
											<span className="text-2xl font-bold">${totalMonthly}</span>
										</div>
										<p className="text-sm text-muted-foreground">per month</p>
									</div>
									<Button onClick={() => setShowCheckout(true)} className="w-full" disabled={!hasPendingChanges}>
										{hasPendingChanges ? "Checkout Changes" : "No Changes"}
										{hasPendingChanges && <CheckCircle2 className="w-4 h-4 ml-2" />}
									</Button>
									<Button onClick={() => setShowPaymentMethods(true)} variant="outline" className="w-full mt-2">
										Manage Payment Methods
									</Button>
									<Button variant="link" className="w-full mt-2" asChild>
										<a href="/dashboard/business/billing">View Invoices & Billing History</a>
									</Button>
								</CardContent>
							</Card>
						</div>
					)}
				</div>
			</div>

			{/* FAQ/Help Section */}
			<div className="space-y-6 mt-12">
				<h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">How does billing work?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">You are only charged for the paid integrations you have active. Billing is monthly, and you can manage your payment methods at any time.</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Can I change integrations anytime?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Yes! You can enable or disable any integration at any time. Changes take effect immediately and your billing will update in real time.</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Do you offer refunds?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">We offer a 30-day money-back guarantee. If you are not satisfied, contact our support team.</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Need help?</CardTitle>
						</CardHeader>
						<CardContent>
							<Button variant="outline" size="sm" className="w-full justify-start" asChild>
								<a href="mailto:support@thorbis.com">
									<Mail className="w-4 h-4 mr-2" />
									Email Support
								</a>
							</Button>
							<Button variant="outline" size="sm" className="w-full justify-start mt-2" asChild>
								<a href="tel:+1-800-THORBIS">
									<Phone className="w-4 h-4 mr-2" />
									Call Us
								</a>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Checkout Modal */}
			<Dialog open={showCheckout} onOpenChange={setShowCheckout}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Confirm Changes</DialogTitle>
						<DialogDescription>Review your active paid integrations and confirm your subscription changes.</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						{paidFeatures.map((feature, idx) => (
							<div key={idx} className="flex items-center justify-between">
								<span>{feature.name}</span>
								<span className="font-medium">{feature.price === 0 ? "Free" : `$${feature.price}/month`}</span>
							</div>
						))}
						<Separator />
						<div className="flex items-center justify-between">
							<span className="font-semibold">Total</span>
							<span className="text-xl font-bold">${totalMonthly}</span>
						</div>
						<Button
							className="w-full mt-4"
							onClick={() => {
								setShowCheckout(false);
								setPendingChanges({});
							}}
						>
							Confirm & Pay
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Payment Methods Modal */}
			<Dialog open={showPaymentMethods} onOpenChange={setShowPaymentMethods}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Manage Payment Methods</DialogTitle>
						<DialogDescription>Update your cards and billing information.</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="p-4 border border-border rounded-lg">
							<div className="flex items-center justify-between mb-2">
								<span className="font-medium">Visa ending in 4242</span>
								<Badge variant="outline">Default</Badge>
							</div>
							<p className="text-sm text-muted-foreground">Expires 12/25</p>
						</div>
						<Button variant="outline" className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							Add New Card
						</Button>
						<Button className="w-full" onClick={() => setShowPaymentMethods(false)}>
							Done
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Request Integration Modal */}
			{showRequestIntegration && (
				<Dialog open={true} onOpenChange={() => setShowRequestIntegration(false)}>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<MessageSquare className="w-5 h-5" />
								Request New Integration
							</DialogTitle>
							<DialogDescription>Tell us about an integration you&apos;d like to see added to our marketplace. We review all requests and prioritize based on user demand.</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="integrationName">Integration Name *</Label>
									<Input id="integrationName" placeholder="e.g., QuickBooks Integration" value={requestForm.integrationName} onChange={(e) => setRequestForm({ ...requestForm, integrationName: e.target.value })} />
								</div>
								<div>
									<Label htmlFor="category">Category</Label>
									<Select value={requestForm.category} onValueChange={(value) => setRequestForm({ ...requestForm, category: value })}>
										<SelectTrigger>
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											{categories.slice(1).map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div>
								<Label htmlFor="description">Description *</Label>
								<Textarea id="description" placeholder="Describe what this integration would do and how it would help businesses..." value={requestForm.description} onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })} rows={3} />
							</div>
							<div>
								<Label htmlFor="useCase">Use Case</Label>
								<Textarea id="useCase" placeholder="How would you use this integration? What specific problem would it solve?" value={requestForm.useCase} onChange={(e) => setRequestForm({ ...requestForm, useCase: e.target.value })} rows={2} />
							</div>
							<div>
								<Label htmlFor="contactEmail">Contact Email</Label>
								<Input id="contactEmail" type="email" placeholder="your@email.com" value={requestForm.contactEmail} onChange={(e) => setRequestForm({ ...requestForm, contactEmail: e.target.value })} />
								<p className="text-xs text-muted-foreground mt-1">Optional: We&apos;ll notify you when this integration is available</p>
							</div>
							<div className="flex gap-3 pt-4">
								<Button onClick={submitRequestIntegration} className="flex-1" disabled={!requestForm.integrationName || !requestForm.description}>
									Submit Request
								</Button>
								<Button variant="outline" onClick={() => setShowRequestIntegration(false)}>
									Cancel
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}

			{/* Learn More Modal */}
			<Dialog open={showLearnMore} onOpenChange={setShowLearnMore}>
				<DialogContent className="max-w-2xl">
					{selectedFeature && (
						<>
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									<div className="text-2xl">{selectedFeature.icon}</div>
									{selectedFeature.title}
								</DialogTitle>
								<DialogDescription>{selectedFeature.description}</DialogDescription>
							</DialogHeader>
							<div className="space-y-6">
								<div>
									<h4 className="font-semibold text-lg mb-3">What this integration does:</h4>
									<p className="text-muted-foreground leading-relaxed">
										{selectedFeature.description} This integration helps businesses showcase their {selectedFeature.title.toLowerCase()} in a professional and engaging way on their business profile.
									</p>
								</div>

								<div>
									<h4 className="font-semibold text-lg mb-3">Key Features:</h4>
									<div className="grid gap-2">
										{Object.entries(selectedFeature.settings || {}).map(([key, setting]) => (
											<div key={key} className="flex items-center gap-2">
												<CheckCircle2 className="w-4 h-4 text-green-600" />
												<span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
											</div>
										))}
									</div>
								</div>

								{selectedFeature.isPaid && (
									<div className="p-4 bg-muted rounded-lg">
										<h4 className="font-semibold mb-2">Pricing Information:</h4>
										<div className="space-y-1 text-sm">
											<div className="flex items-center justify-between">
												<span>Monthly Cost:</span>
												<span className="font-medium">{selectedFeature.monthlyPrice === 0 ? "Free" : `$${selectedFeature.monthlyPrice}/month`}</span>
											</div>
											{selectedFeature.apiIntegration && (
												<div className="flex items-center justify-between">
													<span>Integration:</span>
													<span className="font-medium">via {selectedFeature.apiIntegration}</span>
												</div>
											)}
										</div>
									</div>
								)}

								<div className="flex gap-3 pt-4">
									<Button
										onClick={() => {
											handleFeatureToggle(selectedFeature.key);
											setShowLearnMore(false);
										}}
										className="flex-1"
									>
										{profile.features[selectedFeature.key]?.enabled ? "Disable Integration" : "Enable Integration"}
									</Button>
									<Button variant="outline" onClick={() => setShowLearnMore(false)}>
										Close
									</Button>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>

			{/* Report Error Modal */}
			<Dialog open={showReportError} onOpenChange={setShowReportError}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<AlertCircle className="w-5 h-5" />
							Report Issue
						</DialogTitle>
						<DialogDescription>Help us improve by reporting any issues you encounter with this integration.</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="reportIntegrationName">Integration</Label>
							<Input id="reportIntegrationName" value={reportForm.integrationName} disabled className="bg-muted" />
						</div>
						<div>
							<Label htmlFor="issue">Issue Type *</Label>
							<Select value={reportForm.issue} onValueChange={(value) => setReportForm({ ...reportForm, issue: value })}>
								<SelectTrigger>
									<SelectValue placeholder="Select issue type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="not-working">Integration not working</SelectItem>
									<SelectItem value="display-issue">Display/visual issue</SelectItem>
									<SelectItem value="settings-problem">Settings not saving</SelectItem>
									<SelectItem value="performance">Performance issue</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor="reportDescription">Description *</Label>
							<Textarea id="reportDescription" placeholder="Please describe the issue you're experiencing..." value={reportForm.description} onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })} rows={3} />
						</div>
						<div>
							<Label htmlFor="reportContactEmail">Contact Email</Label>
							<Input id="reportContactEmail" type="email" placeholder="your@email.com" value={reportForm.contactEmail} onChange={(e) => setReportForm({ ...reportForm, contactEmail: e.target.value })} />
							<p className="text-xs text-muted-foreground mt-1">Optional: We&apos;ll notify you when this issue is resolved</p>
						</div>
						<div className="flex gap-3 pt-4">
							<Button onClick={submitReportError} className="flex-1" disabled={!reportForm.issue || !reportForm.description}>
								Submit Report
							</Button>
							<Button variant="outline" onClick={() => setShowReportError(false)}>
								Cancel
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
 