"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
import {
	ArrowLeft,
	Share,
	Heart,
	Star,
	MapPin,
	Clock,
	Phone,
	Globe,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	ChevronDown,
	X,
	Camera,
	CheckCircle,
	Shield,
	Award,
	Users,
	MessageCircle,
	ThumbsUp,
	ExternalLink,
	Mail,
	Verified,
	CreditCard,
	Wifi,
	Car,
	Coffee,
	DollarSign,
	Calendar,
	Building,
	Eye,
	Target,
	Sparkles,
	Home,
	Zap,
	Navigation,
	Flag,
	Upload,
	Grid3X3,
	Copy,
	Menu,
	Edit,
	Plus,
	Send,
	Video,
	ClipboardCheck,
	UserPlus,
	Languages,
	FileText,
	RefreshCw,
	PlayCircle,
	Headphones,
	Settings,
	MoreHorizontal,
	Handshake,
	TrendingUp,
	Calculator,
	Quote,
	Utensils,
	Carrot,
	Wine,
	ChefHat,
	Pizza,
	IceCream,
	Beer,
	Fish,
	Apple,
	BookOpen,
	Cpu,
	Music,
	PawPrint,
	Cookie,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { generateBusinesses, searchBusinessesByQuery } from "@lib/businessDataGenerator";

// Direct imports instead of lazy loading
import BusinessOverview from "./sections/BusinessOverview";
import CertifiedElite from "./sections/CertifiedElite";
import Reviews from "./sections/Reviews";
import Credentials from "./sections/Credentials";
import Availability from "./sections/Availability";
import Services from "./sections/Services";
import Expertise from "./sections/Expertise";
import Pricing from "./sections/Pricing";
import BusinessOperations from "./sections/BusinessOperations";
import WarrantyTracker from "./sections/WarrantyTracker";
import FAQ from "./sections/FAQ";
import Careers from "./sections/Careers";
import Partnerships from "./sections/Partnerships";
import MenuSection from "./sections/MenuSection";
import AutomotiveServices from "./sections/AutomotiveServices";

// Performance optimization: Memoized loading component
const LoadingSpinner = () => (
	<div className="flex items-center justify-center p-8">
		<div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
	</div>
);

// Section wrapper with Suspense
const SectionWrapper = React.memo(({ children, ref }) => (
	<div ref={ref} className="performance-container">
		{children}
	</div>
));

SectionWrapper.displayName = "SectionWrapper";

export default function BizProfileClient({ resolvedParams }) {
	const [business, setBusiness] = useState(null);
	const [showAllPhotos, setShowAllPhotos] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [activeSection, setActiveSection] = useState("overview");
	const [showScrollSpy, setShowScrollSpy] = useState(true); // Always show scroll spy
	const [showHeaderSection, setShowHeaderSection] = useState(false); // Controls sticky header section
	const [showMobileNav, setShowMobileNav] = useState(false);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [scrollSpyScrollPosition, setScrollSpyScrollPosition] = useState(0);
	const [headerHeight, setHeaderHeight] = useState(64);
	const [shouldShowArrows, setShouldShowArrows] = useState(false);
	const [scrollSpyContainerHeight, setScrollSpyContainerHeight] = useState(400);
	const [actualContentHeight, setActualContentHeight] = useState(null);

	// Enhanced scroll spy state
	const [scrollSpyReady, setScrollSpyReady] = useState(false);
	const [scrollSpyError, setScrollSpyError] = useState(null);

	const [newReview, setNewReview] = useState({
		rating: 5,
		title: "",
		text: "",
		author: "",
	});

	// Intelligently combine all images for photo navigation with rich portfolio data
	const allImages = business
		? [
				...(business.photos || []).map((photo) => ({
					src: photo,
					title: "Business Photo",
					type: "business",
					category: "Business Photos",
				})),
				...(business.portfolio || []).map((project) => ({
					src: project.image,
					title: project.title,
					description: project.description,
					type: "portfolio",
					category: "Project Gallery",
				})),
				...(business.beforeAfterGallery || []).flatMap((project) => [
					{
						src: project.beforeImage,
						title: `${project.title} - Before`,
						description: project.description,
						type: "before",
						category: "Before & After",
					},
					{
						src: project.afterImage,
						title: `${project.title} - After`,
						description: project.description,
						type: "after",
						category: "Before & After",
					},
				]),
		  ]
		: [];

	// Ensure we have at least one image
	const safeImages =
		allImages.length > 0
			? allImages
			: [
					{
						src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
						title: "Business Photo",
						type: "business",
						category: "Business Photos",
					},
			  ];

	// Refs for scroll spy
	const scrollSpyContainerRef = useRef(null);
	const scrollSpyContentRef = useRef(null);
	const scrollSpyRef = useRef(null);
	const navigationTimeoutRef = useRef(null);
	const intersectionObserverRef = useRef(null);

	// Section navigation items - memoized to avoid re-creation
	const navigationItems = useMemo(
		() => [
			{ id: "overview", label: "Overview", icon: Building },
			{ id: "certification", label: "Get Certified", icon: Award },
			{ id: "reviews", label: "Reviews", icon: Star },
			{ id: "credentials", label: "Credentials & Recognition", icon: Shield },
			{ id: "availability", label: "Live Availability", icon: Zap },
			{ id: "services", label: "Services & Gallery", icon: Settings },
			{ id: "expertise", label: "Expertise & Team", icon: Target },
			{ id: "pricing", label: "Service Info", icon: DollarSign },
			{ id: "businessTransparency", label: "Business Operations", icon: Eye },
			{ id: "warrantyTracker", label: "Warranty Tracker", icon: ClipboardCheck },
			{ id: "faq", label: "FAQ & Support", icon: MessageCircle },
			{ id: "careers", label: "Careers", icon: Users },
			{ id: "partnerships", label: "Partnerships", icon: Handshake },
			// Industry-specific sections (only include created ones)
			{ id: "menu", label: "Menu", icon: Utensils, industry: "restaurant" },
			{ id: "automotive", label: "Auto Services", icon: Car, industry: "automotive" },
		],
		[]
	);

	// Refs for sections - create refs directly (they're stable by nature)
	const overviewRef = useRef(null);
	const certificationRef = useRef(null);
	const reviewsRef = useRef(null);
	const credentialsRef = useRef(null);
	const availabilityRef = useRef(null);
	const servicesRef = useRef(null);
	const expertiseRef = useRef(null);
	const pricingRef = useRef(null);
	const informationRef = useRef(null);
	const businessTransparencyRef = useRef(null);
	const warrantyTrackerRef = useRef(null);
	const faqRef = useRef(null);
	const careersRef = useRef(null);
	const partnershipsRef = useRef(null);
	// New industry-specific refs (only include created ones)
	const menuRef = useRef(null);
	const automotiveRef = useRef(null);

	// Create refs object with useMemo to prevent recreation
	const sectionRefs = useMemo(
		() => ({
			overview: overviewRef,
			certification: certificationRef,
			reviews: reviewsRef,
			credentials: credentialsRef,
			availability: availabilityRef,
			services: servicesRef,
			expertise: expertiseRef,
			pricing: pricingRef,
			information: informationRef,
			businessTransparency: businessTransparencyRef,
			warrantyTracker: warrantyTrackerRef,
			faq: faqRef,
			careers: careersRef,
			partnerships: partnershipsRef,
			// New industry-specific refs (only include created ones)
			menu: menuRef,
			automotive: automotiveRef,
		}),
		[]
	);

	// Load business data using the centralized business data generator
	useEffect(() => {
		const loadBusinessData = () => {
			try {
				// Generate a pool of businesses (smaller for performance)
				const businesses = generateBusinesses(100);

				// Find business by slug or ID
				let foundBusiness = null;

				// Try to find by slug first
				if (resolvedParams.id && isNaN(resolvedParams.id)) {
					foundBusiness = businesses.find((b) => b.slug === resolvedParams.id);
				} else if (resolvedParams.id) {
					// Find by ID (ensure string comparison)
					foundBusiness = businesses.find((b) => b.id === resolvedParams.id.toString());
				}

				// If not found, use the first business as fallback
				if (!foundBusiness) {
					foundBusiness = businesses[0];
				}

				// Ensure we have a valid business
				if (!foundBusiness) {
					console.error("No business found");
					return;
				}

				// Transform the business data to match our component expectations
				const transformedBusiness = {
					...foundBusiness,
					// Add industry field for conditional section rendering
					industry: foundBusiness.categories[0]?.toLowerCase().includes("restaurant") ? "restaurant" : foundBusiness.categories[0]?.toLowerCase().includes("automotive") ? "automotive" : "general",
					// Add missing fields that our component expects
					trustScore: Math.floor(foundBusiness.ratings.overall * 20),
					responseRate: Math.floor(Math.random() * 10) + 90,
					responseTime: "within 2 hours",
					detailedServices: foundBusiness.categories.concat(["Emergency Services", "Free Estimates", "Licensed & Insured Work", "Quality Workmanship", "Customer Satisfaction"]),
					businessHighlights: ["Locally owned & operated", "Licensed & Insured", "Emergency services available", "Satisfaction guaranteed", "Free estimates", "Same-day service available"],
					portfolioPhotos: foundBusiness.photos.slice(0, 3),
					// Add reviews and peer recommendations
					reviews: [
						{
							id: 1,
							author: "Sarah M.",
							avatar: "https://i.pravatar.cc/150?img=1",
							rating: 5,
							date: "2 weeks ago",
							text: "Excellent service! Professional and reliable. Highly recommend!",
							helpful: 12,
							verified: true,
							photos: 2,
						},
						{
							id: 2,
							author: "Mike R.",
							avatar: "https://i.pravatar.cc/150?img=2",
							rating: 5,
							date: "1 month ago",
							text: "Great work and fair pricing. Will use again.",
							helpful: 8,
							verified: true,
							photos: 0,
						},
					],
					peerRecommendations: [
						{
							recommenderName: "Sarah Johnson",
							recommenderAddress: "124 Main St (Next Door)",
							relationship: "Neighbor",
							serviceUsed: "Emergency Service",
							rating: 5,
							comment: "Professional and fast response. Highly recommend!",
							verificationStatus: "Verified Neighbor",
							date: "2 weeks ago",
						},
					],
					// Add other required fields...
					amenities: foundBusiness.amenities.map((amenity) => ({
						name: amenity,
						icon: CheckCircle,
						available: true,
					})),
					serviceArea: {
						primary: foundBusiness.address.split(",").slice(-2).join(",").trim(),
						coverage: "Local area",
						cities: [foundBusiness.address.split(",")[1]?.trim() || "Local"],
					},
					license: {
						number: `LIC-${foundBusiness.id}`,
						state: foundBusiness.address.split(",").slice(-1)[0]?.trim() || "State",
						verified: foundBusiness.verified,
						expires: "12/31/2025",
					},
					// Add missing required fields for other sections
					realTimeAvailability: {
						currentStatus: "Available Now",
						nextAvailable: "Today 2:00 PM",
						emergencyAvailable: true,
						avgResponseTime: "45 minutes",
						todaySlots: [
							{ time: "2:00 PM", available: true, type: "standard" },
							{ time: "3:30 PM", available: true, type: "standard" },
							{ time: "5:00 PM", available: false, type: "standard" },
							{ time: "Emergency", available: true, type: "emergency" },
						],
					},
					videoConsultation: {
						available: true,
						pricePerSession: "$25",
						duration: "30 minutes",
						languages: ["English", "Spanish"],
						nextSlot: "Today 3:00 PM",
						specialties: ["Initial Assessment", "Quote Estimation", "Problem Diagnosis", "Maintenance Tips"],
					},
					warranties: [
						{
							id: "WTY-2024-001",
							service: "Service Work",
							startDate: "2024-01-15",
							endDate: "2026-01-15",
							status: "Active",
							coverageDetails: "Full replacement coverage for manufacturer defects",
							claimHistory: [],
						},
					],
					warrantyTracker: {
						warranties: [
							{
								type: "Workmanship",
								duration: "2 Years",
								coverage: "Full coverage for defects",
							},
							{
								type: "Materials",
								duration: "1 Year",
								coverage: "Manufacturer warranty",
							},
							{
								type: "Labor",
								duration: "90 Days",
								coverage: "Free repairs",
							},
						],
						activeWarranties: [
							{
								service: "Plumbing Repair",
								description: "Kitchen sink installation and repair",
								startDate: "2024-01-15",
								expiryDate: "2026-01-15",
								status: "Active",
							},
							{
								service: "Electrical Work",
								description: "Outlet installation and wiring",
								startDate: "2024-02-20",
								expiryDate: "2025-02-20",
								status: "Active",
							},
						],
						claims: [
							{
								title: "Leak Repair",
								description: "Fixed bathroom sink leak under warranty",
								filedDate: "2024-03-10",
								resolvedDate: "2024-03-12",
								status: "Resolved",
							},
							{
								title: "Electrical Issue",
								description: "Replaced faulty outlet connection",
								filedDate: "2024-04-05",
								resolvedDate: "2024-04-07",
								status: "Resolved",
							},
						],
					},
					multiLanguage: {
						supportedLanguages: [
							{ code: "en", name: "English", flag: "🇺🇸", native: "English" },
							{ code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
						],
						staffLanguages: ["English", "Spanish"],
						translationQuality: "Professional",
					},
					insuranceBilling: {
						acceptedInsurance: ["State Farm", "Allstate", "Progressive", "GEICO"],
						directBilling: true,
						claimAssistance: true,
						approvalProcess: "We handle all insurance paperwork and pre-approvals",
						averageClaimTime: "5-7 business days",
						claimSuccessRate: "96%",
					},
					maintenancePlans: [
						{
							name: "Basic Care Plan",
							price: "$99/year",
							services: ["Annual inspection", "Priority service"],
							savings: "Save 15% on all services",
							popular: false,
						},
					],
					stats: {
						monthlyViews: Math.floor(Math.random() * 2000) + 500,
						responseTime: "within 2 hours",
						responseRate: Math.floor(Math.random() * 10) + 90,
						bookingRate: Math.floor(Math.random() * 10) + 85,
						repeatCustomers: Math.floor(Math.random() * 15) + 80,
					},
					reviewHighlights: [
						{
							author: "Sarah",
							quote: "Professional and reliable service.",
							reviewCount: 3,
						},
					],
					businessUpdates: [
						{
							id: 1,
							date: "2 days ago",
							title: "Service Excellence",
							content: "We pride ourselves on quality workmanship and customer satisfaction.",
							image: foundBusiness.photos[0],
						},
					],
					portfolio: [],
					qna: [
						{
							id: 1,
							question: "Do you offer emergency services?",
							answer: "Yes, we provide emergency services with rapid response times.",
							author: foundBusiness.name,
							date: "1 week ago",
							helpful: 8,
						},
					],
					faq: [
						{
							question: "What areas do you serve?",
							answer: `We serve ${foundBusiness.address.split(",").slice(-2).join(",").trim()} and surrounding areas.`,
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
					supportInfo: [
						{
							title: "Customer Service",
							description: "Our dedicated customer service team is available to assist you with any questions or concerns.",
							contact: "Call us at " + (foundBusiness.phone || "(555) 123-4567"),
						},
						{
							title: "Technical Support",
							description: "For technical questions about our services or equipment, our experts are here to help.",
							contact: "Email: support@" + foundBusiness.name.toLowerCase().replace(/\s+/g, "") + ".com",
						},
						{
							title: "Emergency Support",
							description: "24/7 emergency support for urgent situations requiring immediate attention.",
							contact: "Emergency: " + (foundBusiness.phone || "(555) 123-4567"),
						},
						{
							title: "Warranty Claims",
							description: "For warranty claims and service guarantees, contact our warranty department.",
							contact: "Warranty: warranty@" + foundBusiness.name.toLowerCase().replace(/\s+/g, "") + ".com",
						},
					],
					pricing: {
						approach: "Custom Pricing",
						description: "We provide personalized quotes based on project scope, materials needed, and timeline requirements.",
						hourlyRate: `$${Math.floor(Math.random() * 50) + 75} - $${Math.floor(Math.random() * 50) + 125}/hour`,
						emergencyRate: `$${Math.floor(Math.random() * 50) + 150} - $${Math.floor(Math.random() * 50) + 200}/hour`,
						minimumCharge: `$${Math.floor(Math.random() * 30) + 75}`,
						discounts: [
							{ type: "Senior Discount", amount: "10%", description: "For customers 65+ years old" },
							{ type: "Military Discount", amount: "15%", description: "Active duty and veterans" },
							{ type: "First-Time Customer", amount: "5%", description: "New customers only" },
							{ type: "Repeat Customer", amount: "10%", description: "Return customers" },
						],
						financing: {
							available: true,
							provider: "Financing Partner",
							minAmount: "$500",
							terms: "6-60 months",
							approval: "Subject to credit approval",
						},
						freeServices: [
							{ service: "Initial Consultation", description: "No-obligation assessment" },
							{ service: "Written Estimates", description: "Detailed project quotes" },
							{ service: "Basic Diagnostics", description: "Problem identification" },
							{ service: "Follow-up Inspection", description: "30-day post-service check" },
						],
						priceRange: {
							min: Math.floor(Math.random() * 100) + 50,
							max: Math.floor(Math.random() * 500) + 200,
							typical: Math.floor(Math.random() * 300) + 100,
						},
						paymentTerms: {
							deposit: "25% down payment required",
							completion: "Balance due upon completion",
							largejobs: "Payment plans available for projects over $1,000",
						},
					},
					paymentMethods: [
						{ name: "Cash", accepted: true, details: "Exact change appreciated" },
						{ name: "Check", accepted: true, details: "Personal and business checks" },
						{ name: "Credit Cards", accepted: true, details: "Visa, MasterCard, American Express" },
						{ name: "Debit Cards", accepted: true, details: "PIN or signature" },
						{ name: "Digital Payments", accepted: true, details: "Apple Pay, Google Pay, Zelle" },
						{ name: "Bank Transfer", accepted: true, details: "Wire transfers for large projects" },
						{ name: "Financing", accepted: true, details: "Through approved financing partners" },
					],
					guarantees: [
						{
							title: "100% Satisfaction Guarantee",
							description: "We stand behind our work with a complete satisfaction guarantee",
							period: "Service completion",
						},
						{
							title: "Workmanship Warranty",
							description: "All work guaranteed against defects for specified period",
							period: "1-2 years",
						},
						{
							title: "Licensed Professionals",
							description: "All staff properly licensed and background checked",
							period: "Ongoing",
						},
						{
							title: "Quality Materials",
							description: "We use only high-grade, manufacturer-approved materials",
							period: "Manufacturer warranty",
						},
						{
							title: "Timely Completion",
							description: "Projects completed within agreed timeframe or compensation provided",
							period: "Project duration",
						},
						{
							title: "Clean Work Areas",
							description: "We maintain clean and safe work environments",
							period: "During service",
						},
					],
					insurance: {
						generalLiability: "$2,000,000",
						workersComp: "Full Coverage",
						bonded: "$50,000",
						carrier: "Commercial Insurance Group",
						expires: "December 31, 2025",
						policyNumber: `POL-${Math.floor(Math.random() * 100000)}`,
						additionalCoverage: [
							{ type: "Professional Liability", amount: "$1,000,000" },
							{ type: "Tool & Equipment", amount: "$25,000" },
							{ type: "Commercial Auto", amount: "$1,000,000" },
						],
						certificationAvailable: true,
						verified: foundBusiness.verified,
					},
					team: [
						{
							name: foundBusiness.name.split("'")[0] || "Owner",
							title: "Owner & Operator",
							experience: `${Math.floor(Math.random() * 15) + 5}+ years`,
							certifications: ["Licensed Professional"],
							photo: "https://i.pravatar.cc/150?img=11",
							specialties: foundBusiness.categories,
						},
					],
					certifications: [
						{
							name: "Professional License",
							number: `LIC-${Math.floor(Math.random() * 10000)}`,
							issuer: "State Licensing Board",
							issued: "2020-01-15",
							expires: "2025-01-15",
							status: "Active",
							verified: foundBusiness.verified,
						},
					],
					specializations: foundBusiness.categories,
					equipment: ["Professional tools", "Modern equipment", "Service vehicles"],
					brands: ["Industry leading brands", "Quality suppliers"],
					awards: foundBusiness.verified
						? [
								{
									title: "Verified Business",
									issuer: "Thorbis",
									year: "2024",
								},
						  ]
						: [],
					emergencyServices: {
						available247: true,
						responseTime: "30-60 minutes",
						emergencyFee: "$50 service call fee",
						serviceTypes: ["Emergency calls", "Urgent repairs"],
					},
					businessTransparency: {
						operationalAreas: [
							{ category: "Professional Staff", importance: "High", description: "Licensed and skilled professionals" },
							{ category: "Quality Equipment", importance: "High", description: "Professional tools and equipment" },
							{ category: "Insurance & Bonding", importance: "Critical", description: "Full liability protection" },
						],
						whyQualityMatters: [
							{ title: "Licensed Professionals", description: "Ensures work meets safety standards" },
							{ title: "Proper Insurance", description: "Protects your property" },
							{ title: "Quality Equipment", description: "Delivers better results" },
							{ title: "Professional Training", description: "Keeps up with industry standards" },
						],
						costBreakdown: [
							{ category: "Labor & Expertise", percentage: "40%" },
							{ category: "Materials & Equipment", percentage: "25%" },
							{ category: "Insurance & Licensing", percentage: "15%" },
							{ category: "Overhead & Administration", percentage: "20%" },
						],
						qualityAssurance: [
							{ title: "Pre-Service Inspection", description: "Thorough assessment before work begins" },
							{ title: "Quality Control Checks", description: "Multiple checkpoints during service" },
							{ title: "Post-Service Verification", description: "Final inspection and customer approval" },
							{ title: "Follow-up Support", description: "Ongoing support after service completion" },
						],
						industryInsights: {
							commonCosts: "Professional businesses invest in staff, equipment, and training",
							qualityIndicators: ["Licensed professionals", "Insurance coverage", "Professional equipment"],
							investmentAreas: ["Professional equipment", "Staff training", "Insurance coverage"],
						},
					},
					beforeAfterGallery: [
						{
							title: "Professional Work",
							beforeImage: foundBusiness.photos[0],
							afterImage: foundBusiness.photos[1] || foundBusiness.photos[0],
							description: "Quality service delivery",
						},
					],
					testimonials: [
						{
							customer: "Jennifer Adams",
							service: "Professional Service",
							rating: 5,
							text: "Outstanding service. Professional and reliable.",
							date: "March 2024",
						},
					],
					communityInvolvement: [
						{
							activity: "Local Community Support",
							description: "Active in local community initiatives",
						},
					],
					accessibility: ["Professional service approach", "Clear communication", "Flexible scheduling"],
					careers: {
						jobOpenings:
							Math.random() > 0.7
								? [
										{
											title: foundBusiness.categories[1] === "Plumber" ? "Licensed Plumber" : foundBusiness.categories[1] === "Electrician" ? "Licensed Electrician" : foundBusiness.categories[1] === "Auto Repair" ? "Automotive Technician" : foundBusiness.categories[0] === "Restaurants" ? "Kitchen Staff" : foundBusiness.categories[0] === "Beauty & Spas" ? "Licensed Stylist" : "Service Technician",
											type: "Full-time",
											experience: "2+ years",
											salary: foundBusiness.categories[0] === "Professional Services" ? "$65,000 - $85,000" : foundBusiness.categories[0] === "Health & Medical" ? "$55,000 - $75,000" : foundBusiness.categories[0] === "Home Services" ? "$45,000 - $65,000" : "$35,000 - $50,000",
											location: foundBusiness.address.split(",")[1]?.trim() || "Local",
											status: "Open",
											description: "Join our growing team and help us deliver excellent service to our customers. We're looking for a motivated professional to contribute to our success.",
										},
										...(Math.random() > 0.8
											? [
													{
														title: "Customer Service Representative",
														type: "Part-time",
														experience: "Entry level",
														salary: "$15 - $20/hour",
														location: foundBusiness.address.split(",")[1]?.trim() || "Local",
														status: "Open",
														description: "Support our team by providing excellent customer service and administrative assistance.",
													},
											  ]
											: []),
								  ]
								: [],
						culture: [
							{
								title: "Collaborative Environment",
								description: "We foster a collaborative and supportive work environment where team members can grow their careers while delivering exceptional service to our community.",
							},
							{
								title: "Professional Growth",
								description: "Continuous learning and development opportunities to help you advance in your career.",
							},
							{
								title: "Work-Life Balance",
								description: "Flexible scheduling and understanding management that values your personal time.",
							},
							{
								title: "Team Recognition",
								description: "Regular recognition programs and team building activities to celebrate our successes together.",
							},
						],
						benefits: ["Health Insurance", "Paid Time Off", "401(k) Retirement Plan", "Professional Development", "Performance Bonuses", "Continuing Education Support", "Flexible Work Schedule", "Employee Discounts", "Modern Work Environment"],
					},
					partnerships: {
						description: "We collaborate with trusted partners to deliver exceptional service and value to our customers.",
						categories: [
							{
								name: "Supplier Partners",
								partners: [
									{
										name: foundBusiness.categories[0] === "Home Services" ? "Professional Supply Co" : foundBusiness.categories[0] === "Automotive" ? "Quality Auto Parts" : foundBusiness.categories[0] === "Restaurants" ? "Fresh Food Distributors" : "Industry Supply Group",
										description: "Authorized dealer providing professional-grade materials and equipment at competitive prices.",
										website: "https://example.com",
									},
									{
										name: foundBusiness.categories[0] === "Home Services" ? "Builder's Choice Materials" : foundBusiness.categories[0] === "Automotive" ? "Premium Parts Direct" : foundBusiness.categories[0] === "Restaurants" ? "Restaurant Equipment Co" : "Professional Tools & Equipment",
										description: "Preferred partner for specialized equipment and tools to handle complex projects.",
										website: "https://example.com",
									},
								],
							},
							{
								name: "Service Partners",
								partners: [
									{
										name: foundBusiness.categories[0] === "Home Services" ? "Emergency Response Network" : foundBusiness.categories[0] === "Health & Medical" ? "Medical Billing Services" : foundBusiness.categories[0] === "Automotive" ? "Towing & Recovery Services" : "Professional Support Services",
										description: "Strategic alliance providing extended service capabilities and emergency support.",
									},
									{
										name: foundBusiness.categories[0] === "Restaurants" ? "Delivery Network Partners" : foundBusiness.categories[0] === "Beauty & Spas" ? "Wellness Services Network" : "Customer Service Enhancement",
										description: "Enhanced customer experience through coordinated service delivery and shared best practices.",
									},
								],
							},
							{
								name: "Community Partners",
								partners: [
									{
										name: `${foundBusiness.address.split(",")[1]?.trim() || "Local"} Chamber of Commerce`,
										description: "Active member supporting local economic development and community business initiatives.",
									},
									{
										name: foundBusiness.categories[0] === "Home Services" ? "Habitat for Humanity" : foundBusiness.categories[0] === "Health & Medical" ? "Community Health Coalition" : foundBusiness.categories[0] === "Education" ? "Local School District" : "Community Development Fund",
										description: "Contributing professional services and expertise to support community development and charitable initiatives.",
									},
								],
							},
						],
						benefits: [
							{
								title: "Quality Assurance",
								description: "Partner with industry leaders to ensure the highest quality materials and service standards.",
							},
							{
								title: "Extended Capabilities",
								description: "Access to specialized resources and expertise through our network of trusted partners.",
							},
							{
								title: "Cost Efficiency",
								description: "Competitive pricing and bulk purchasing benefits passed on to our customers.",
							},
							{
								title: "Community Support",
								description: "Active involvement in local community initiatives and charitable organizations.",
							},
						],
					},
					// Add menu data for restaurants
					menu: foundBusiness.categories[0]?.toLowerCase().includes("restaurant")
						? {
								categories: [
									{
										name: "Appetizers",
										items: [
											{ name: "Bruschetta", description: "Fresh tomatoes, basil, and garlic on toasted bread", price: "$8.99", popular: true },
											{ name: "Spinach Artichoke Dip", description: "Creamy dip served with tortilla chips", price: "$10.99" },
											{ name: "Calamari", description: "Crispy fried squid with marinara sauce", price: "$12.99" },
										],
									},
									{
										name: "Main Courses",
										items: [
											{ name: "Grilled Salmon", description: "Fresh Atlantic salmon with seasonal vegetables", price: "$24.99", popular: true },
											{ name: "Beef Tenderloin", description: "8oz tenderloin with garlic mashed potatoes", price: "$28.99" },
											{ name: "Pasta Primavera", description: "Fresh vegetables in light cream sauce", price: "$18.99" },
										],
									},
									{
										name: "Desserts",
										items: [
											{ name: "Tiramisu", description: "Classic Italian dessert with coffee and mascarpone", price: "$8.99", popular: true },
											{ name: "Chocolate Lava Cake", description: "Warm chocolate cake with vanilla ice cream", price: "$9.99" },
										],
									},
								],
								specials: [
									{ name: "Chef's Special", description: "Daily creation featuring fresh local ingredients", price: "$22.99", available: "Today Only" },
									{ name: "Happy Hour", description: "50% off appetizers and drinks", price: "4-6 PM Daily" },
								],
								dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"],
								seasonalItems: [{ name: "Fall Harvest Salad", description: "Seasonal vegetables with maple vinaigrette", price: "$14.99", available: "Fall Only" }],
						  }
						: null,
				};

				setBusiness(transformedBusiness);
			} catch (error) {
				console.error("Error loading business data:", error);
				// Fallback to a default business
				setBusiness({
					id: resolvedParams.id,
					name: "Local Business",
					type: "Professional Services",
					rating: 4.5,
					reviewCount: 50,
				});
			}
		};

		loadBusinessData();
	}, [resolvedParams.id]); // Now this is safe to use

	// Show loading state while business data is being generated
	if (!business) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-background">
				<div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md border-border">
				<div className="px-3 mx-auto max-w-7xl sm:px-4 lg:px-8">
					<div className="flex items-center justify-between h-14 sm:h-16">
						<div className="flex items-center space-x-2 sm:space-x-4">
							<Button variant="ghost" size="sm" className="px-2 h-8 text-muted-foreground hover:text-foreground sm:h-9 sm:px-3">
								<ArrowLeft className="mr-1 w-4 h-4 sm:mr-2" />
								<span className="text-sm">Back</span>
							</Button>
						</div>
						<div className="flex items-center space-x-1 sm:space-x-2">
							<Button variant="ghost" size="sm" className="px-2 h-8 text-muted-foreground hover:text-foreground sm:h-9 sm:px-3">
								<Share className="mr-1 w-4 h-4 sm:mr-2" />
								<span className="hidden text-sm sm:inline">Share</span>
							</Button>
							<Button variant="ghost" size="sm" className="px-2 h-8 text-muted-foreground hover:text-foreground sm:h-9 sm:px-3">
								<Heart className="mr-1 w-4 h-4 sm:mr-2" />
								<span className="hidden text-sm sm:inline">Save</span>
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="px-3 py-4 mx-auto max-w-7xl sm:px-4 sm:py-6 lg:px-8 lg:py-8">
				<div className="space-y-6 sm:space-y-8">
					{/* Business Header */}
					<div className="space-y-4">
						<div className="flex justify-between items-start">
							<div className="flex-1 space-y-3">
								<h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">{business.name}</h1>
								<div className="flex items-center space-x-2 text-muted-foreground">
									<span className="text-lg">{business.type}</span>
									<span>•</span>
									<MapPin className="w-4 h-4" />
									<span>{business.serviceArea.primary}</span>
								</div>
							</div>
							{business.verified && (
								<div className="flex items-center px-3 py-1.5 space-x-2 text-blue-700 bg-blue-50 rounded-full border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/50">
									<Shield className="w-4 h-4" />
									<span className="text-sm font-medium">Verified</span>
								</div>
							)}
						</div>

						{/* Rating & Status Row */}
						<div className="flex justify-between items-center">
							<div className="flex items-center space-x-6">
								<div className="flex items-center space-x-2">
									<div className="flex items-center space-x-1">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className={`w-5 h-5 ${i < Math.floor(business.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
										))}
									</div>
									<span className="text-lg font-semibold">{business.rating}</span>
									<span className="text-muted-foreground">({business.reviewCount})</span>
								</div>
								<div className="flex items-center px-2 py-1 space-x-1.5 text-sm rounded-lg bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400">
									<div className="w-2 h-2 bg-green-500 rounded-full" />
									<span className="font-medium">Open</span>
								</div>
							</div>
						</div>
					</div>

					{/* Essential Info Grid */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						{/* Contact */}
						<div className="space-y-4">
							<div className="space-y-3">
								<Button className="w-full h-12 text-base font-semibold">
									<Phone className="mr-2 w-5 h-5" />
									{business.phone}
								</Button>
								<div className="grid grid-cols-2 gap-2">
									<Button variant="outline" className="h-10">
										<MapPin className="mr-2 w-4 h-4" />
										Directions
									</Button>
									<Button variant="outline" className="h-10">
										<Globe className="mr-2 w-4 h-4" />
										Website
									</Button>
								</div>
							</div>
							<div className="text-sm text-muted-foreground">
								<div className="flex items-start space-x-2">
									<MapPin className="flex-shrink-0 mt-0.5 w-4 h-4" />
									<span>{business.address}</span>
								</div>
							</div>
						</div>

						{/* Hours */}
						<div className="space-y-4">
							<h3 className="font-semibold">Hours</h3>
							<div className="space-y-2 text-sm">
								<div className="flex items-center mb-2 space-x-2">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-sm font-medium text-green-600">Open Now</span>
								</div>
								<div className="text-foreground">{business.hours || "Hours not available"}</div>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="space-y-4">
							<h3 className="font-semibold">Quick Actions</h3>
							<div className="space-y-2">
								<Button variant="outline" className="justify-start w-full h-10" onClick={() => setShowReviewModal(true)}>
									<Edit className="mr-2 w-4 h-4" />
									Write Review
								</Button>
								<Button variant="outline" className="justify-start w-full h-10">
									<Star className="mr-2 w-4 h-4" />
									View Reviews
								</Button>
								<Button variant="outline" className="justify-start w-full h-10">
									<Settings className="mr-2 w-4 h-4" />
									Services
								</Button>
							</div>
						</div>
					</div>

					{/* Main Content Sections */}
					<div className="space-y-20 sm:space-y-24 md:space-y-32 lg:space-y-40">
						{/* 1. BUSINESS OVERVIEW SECTION */}
						<SectionWrapper ref={overviewRef}>
							<BusinessOverview business={business} />
						</SectionWrapper>

						{/* 2. THORBIS CERTIFIED ELITE STATUS */}
						<SectionWrapper ref={certificationRef}>
							<CertifiedElite business={business} />
						</SectionWrapper>

						{/* 3. REVIEWS & NEIGHBORHOOD INSIGHTS */}
						<SectionWrapper ref={reviewsRef}>
							<Reviews business={business} setShowReviewModal={setShowReviewModal} />
						</SectionWrapper>

						{/* 4. CREDENTIALS, LICENSING & RECOGNITION */}
						<SectionWrapper ref={credentialsRef}>
							<Credentials business={business} />
						</SectionWrapper>

						{/* 5. LIVE AVAILABILITY & BOOKING */}
						<SectionWrapper ref={availabilityRef}>
							<Availability business={business} />
						</SectionWrapper>

						{/* 6. SERVICES & WORK SHOWCASE */}
						<SectionWrapper ref={servicesRef}>
							<Services business={business} />
						</SectionWrapper>

						{/* 7. EXPERTISE & PROFESSIONAL DETAILS */}
						<SectionWrapper ref={expertiseRef}>
							<Expertise business={business} />
						</SectionWrapper>

						{/* 8. PRICING & SERVICE INFORMATION */}
						<SectionWrapper ref={pricingRef}>
							<Pricing business={business} />
						</SectionWrapper>

						{/* 9. BUSINESS OPERATIONS */}
						<SectionWrapper ref={businessTransparencyRef}>
							<BusinessOperations business={business} />
						</SectionWrapper>

						{/* 10. WARRANTY TRACKER */}
						<SectionWrapper ref={warrantyTrackerRef}>
							<WarrantyTracker business={business} />
						</SectionWrapper>

						{/* 11. FAQ & SUPPORT */}
						<SectionWrapper ref={faqRef}>
							<FAQ business={business} />
						</SectionWrapper>

						{/* 12. CAREERS */}
						<SectionWrapper ref={careersRef}>
							<Careers business={business} />
						</SectionWrapper>

						{/* 13. STRATEGIC PARTNERSHIPS */}
						<SectionWrapper ref={partnershipsRef}>
							<Partnerships business={business} />
						</SectionWrapper>

						{/* 14. MENU SECTION - Restaurant Industry */}
						{business.industry === "restaurant" && (
							<SectionWrapper ref={menuRef}>
								<MenuSection business={business} />
							</SectionWrapper>
						)}

						{/* 15. AUTOMOTIVE SERVICES - Automotive Industry */}
						{business.industry === "automotive" && (
							<SectionWrapper ref={automotiveRef}>
								<AutomotiveServices business={business} />
							</SectionWrapper>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
