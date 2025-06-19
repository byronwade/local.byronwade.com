"use client";

import { useState, useEffect, useRef, useMemo, useCallback, Suspense, use, lazy } from "react";
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
	Bread,
	Apple,
	BookOpen,
	Cpu,
	Music,
	PawPrint,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { generateBusinesses, searchBusinessesByQuery } from "@lib/businessDataGenerator";

// Lazy load section components for better performance
const BusinessOverview = lazy(() => import("./sections/BusinessOverview"));
const CertifiedElite = lazy(() => import("./sections/CertifiedElite"));
const Reviews = lazy(() => import("./sections/Reviews"));
const Credentials = lazy(() => import("./sections/Credentials"));
const Availability = lazy(() => import("./sections/Availability"));
const Services = lazy(() => import("./sections/Services"));
const Expertise = lazy(() => import("./sections/Expertise"));
const Pricing = lazy(() => import("./sections/Pricing"));
const BusinessOperations = lazy(() => import("./sections/BusinessOperations"));
const WarrantyTracker = lazy(() => import("./sections/WarrantyTracker"));
const FAQ = lazy(() => import("./sections/FAQ"));
const Careers = lazy(() => import("./sections/Careers"));
const Partnerships = lazy(() => import("./sections/Partnerships"));

// New industry-specific sections
const MenuSection = lazy(() => import("./sections/MenuSection"));
const AutomotiveServices = lazy(() => import("./sections/AutomotiveServices"));
// TODO: Create these sections when needed
// const HealthWellness = lazy(() => import("./sections/HealthWellness"));
// const BeautySalon = lazy(() => import("./sections/BeautySalon"));
// const RealEstate = lazy(() => import("./sections/RealEstate"));
// const LegalServices = lazy(() => import("./sections/LegalServices"));
// const EducationTraining = lazy(() => import("./sections/EducationTraining"));
// const TechnologyIT = lazy(() => import("./sections/TechnologyIT"));
// const FinancialServices = lazy(() => import("./sections/FinancialServices"));
// const EntertainmentEvents = lazy(() => import("./sections/EntertainmentEvents"));
// const PetServices = lazy(() => import("./sections/PetServices"));

// Performance optimization: Memoized loading component
const LoadingSpinner = () => (
	<div className="flex items-center justify-center p-8">
		<div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
	</div>
);

// Performance optimization: Memoized section wrapper
const SectionWrapper = React.memo(({ children, ref }) => (
	<div ref={ref} className="performance-container">
		<Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
	</div>
));

SectionWrapper.displayName = "SectionWrapper";

export default function BizProfile({ params }) {
	// Unwrap params Promise using React.use()
	const resolvedParams = use(params);

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
			// TODO: Add these when sections are created
			// { id: "healthWellness", label: "Health & Wellness", icon: Heart, industry: "health" },
			// { id: "beautySalon", label: "Beauty Services", icon: Sparkles, industry: "beauty" },
			// { id: "realEstate", label: "Real Estate", icon: Home, industry: "realestate" },
			// { id: "legalServices", label: "Legal Services", icon: Shield, industry: "legal" },
			// { id: "educationTraining", label: "Education", icon: BookOpen, industry: "education" },
			// { id: "technologyIT", label: "Technology", icon: Cpu, industry: "technology" },
			// { id: "financialServices", label: "Financial", icon: DollarSign, industry: "financial" },
			// { id: "entertainmentEvents", label: "Entertainment", icon: Music, industry: "entertainment" },
			// { id: "petServices", label: "Pet Services", icon: PawPrint, industry: "pets" },
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
	// TODO: Add these when sections are created
	// const healthWellnessRef = useRef(null);
	// const beautySalonRef = useRef(null);
	// const realEstateRef = useRef(null);
	// const legalServicesRef = useRef(null);
	// const educationTrainingRef = useRef(null);
	// const technologyITRef = useRef(null);
	// const financialServicesRef = useRef(null);
	// const entertainmentEventsRef = useRef(null);
	// const petServicesRef = useRef(null);

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
			// TODO: Add these when sections are created
			// healthWellness: healthWellnessRef,
			// beautySalon: beautySalonRef,
			// realEstate: realEstateRef,
			// legalServices: legalServicesRef,
			// educationTraining: educationTrainingRef,
			// technologyIT: technologyITRef,
			// financialServices: financialServicesRef,
			// entertainmentEvents: entertainmentEventsRef,
			// petServices: petServicesRef,
		}),
		[]
	);

	// Enhanced scroll spy utility functions
	const getCurrentSectionIndex = useCallback(() => {
		try {
			return navigationItems.findIndex((item) => item.id === activeSection);
		} catch (error) {
			console.warn("Error finding current section:", error);
			return 0;
		}
	}, [navigationItems, activeSection]);

	const canNavigateUp = useCallback(() => getCurrentSectionIndex() > 0, [getCurrentSectionIndex]);
	const canNavigateDown = useCallback(() => getCurrentSectionIndex() < navigationItems.length - 1, [getCurrentSectionIndex, navigationItems.length]);

	const validateSection = useCallback(
		(sectionId) => {
			return navigationItems.some((item) => item.id === sectionId) && sectionRefs[sectionId] && sectionRefs[sectionId].current;
		},
		[navigationItems, sectionRefs]
	);

	const getNextSection = useCallback(
		(direction) => {
			try {
				const currentIndex = getCurrentSectionIndex();
				let nextIndex;

				if (direction === "up") {
					nextIndex = Math.max(0, currentIndex - 1);
				} else {
					nextIndex = Math.min(navigationItems.length - 1, currentIndex + 1);
				}

				return navigationItems[nextIndex];
			} catch (error) {
				console.warn("Error getting next section:", error);
				return null;
			}
		},
		[getCurrentSectionIndex, navigationItems]
	);

	// Enhanced section navigation with validation and error handling
	const scrollToSection = useCallback(
		(sectionId, options = {}) => {
			try {
				// Validate section exists
				if (!validateSection(sectionId)) {
					console.warn(`Invalid section: ${sectionId}`);
					setScrollSpyError(`Section "${sectionId}" not found`);
					return false;
				}

				const ref = sectionRefs[sectionId];
				const element = ref.current;

				// Enhanced scroll behavior
				const scrollOptions = {
					behavior: options.smooth !== false ? "smooth" : "auto",
					block: options.block || "start",
					inline: "nearest",
					...options,
				};

				console.log(`📍 Scrolling to section: ${sectionId}`, scrollOptions);

				// Perform scroll
				element.scrollIntoView(scrollOptions);

				// Update active section immediately for responsive UI
				if (sectionId !== activeSection) {
					setActiveSection(sectionId);
				}

				// Close mobile nav
				setShowMobileNav(false);

				// Clear any existing error
				setScrollSpyError(null);

				return true;
			} catch (error) {
				console.error(`Failed to scroll to section ${sectionId}:`, error);
				setScrollSpyError(`Failed to navigate to ${sectionId}`);
				return false;
			}
		},
		[validateSection, sectionRefs, activeSection, setActiveSection, setShowMobileNav, setScrollSpyError]
	);

	// Enhanced scroll spy navigation with error handling and features
	const handleScrollSpyScroll = useCallback(
		(direction) => {
			try {
				const nextSection = getNextSection(direction);
				if (!nextSection) {
					return;
				}

				if (nextSection.id === activeSection) {
					return;
				}

				// Add haptic feedback if available
				if (navigator.vibrate) {
					navigator.vibrate(50);
				}

				scrollToSection(nextSection.id);
			} catch (error) {
				console.error("Navigation error:", error);
				setScrollSpyError("Navigation failed");
			}
		},
		[getNextSection, activeSection, scrollToSection, setScrollSpyError]
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
				if (isNaN(resolvedParams.id)) {
					foundBusiness = businesses.find((b) => b.slug === resolvedParams.id);
				} else {
					// Find by ID (ensure string comparison)
					foundBusiness = businesses.find((b) => b.id === resolvedParams.id.toString());
				}

				// If not found, use the first business as fallback
				if (!foundBusiness) {
					foundBusiness = businesses[0];
				}

				// Transform the business data to match our component expectations
				const transformedBusiness = {
					...foundBusiness,
					// Add industry field for conditional section rendering
					industry: foundBusiness.categories[0]?.toLowerCase().includes("restaurant")
						? "restaurant"
						: foundBusiness.categories[0]?.toLowerCase().includes("automotive")
						? "automotive"
						: foundBusiness.categories[0]?.toLowerCase().includes("health")
						? "health"
						: foundBusiness.categories[0]?.toLowerCase().includes("beauty")
						? "beauty"
						: foundBusiness.categories[0]?.toLowerCase().includes("real estate")
						? "realestate"
						: foundBusiness.categories[0]?.toLowerCase().includes("legal")
						? "legal"
						: foundBusiness.categories[0]?.toLowerCase().includes("education")
						? "education"
						: foundBusiness.categories[0]?.toLowerCase().includes("technology")
						? "technology"
						: foundBusiness.categories[0]?.toLowerCase().includes("financial")
						? "financial"
						: foundBusiness.categories[0]?.toLowerCase().includes("entertainment")
						? "entertainment"
						: foundBusiness.categories[0]?.toLowerCase().includes("pet")
						? "pets"
						: "general",
					// Add missing fields that our component expects
					trustScore: Math.floor(foundBusiness.ratings.overall * 20), // Convert 5-star to 100-point scale
					responseRate: Math.floor(Math.random() * 10) + 90, // 90-100%
					responseTime: "within 2 hours",
					detailedServices: foundBusiness.categories.concat(["Emergency Services", "Free Estimates", "Licensed & Insured Work", "Quality Workmanship", "Customer Satisfaction"]),
					businessHighlights: ["Locally owned & operated", "Licensed & Insured", "Emergency services available", "Satisfaction guaranteed", "Free estimates", "Same-day service available"],
					portfolioPhotos: foundBusiness.photos.slice(0, 3),
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
					// Portfolio is now integrated into the photo gallery - no separate portfolio section needed
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
					// Transform amenities to match expected format
					amenities: foundBusiness.amenities.map((amenity) => ({
						name: amenity,
						icon: CheckCircle,
						available: true,
					})),
					// Add missing required fields
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
					// Add other required fields...
				});
			}
		};

		loadBusinessData();
	}, [resolvedParams.id]);

	// Enhanced keyboard navigation with scroll spy support
	useEffect(() => {
		const handleKeyDown = (e) => {
			try {
				// Photo modal navigation
				if (showAllPhotos) {
					if (e.key === "ArrowLeft") {
						e.preventDefault();
						setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
					} else if (e.key === "ArrowRight") {
						e.preventDefault();
						setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
					} else if (e.key === "Escape") {
						e.preventDefault();
						setShowAllPhotos(false);
					}
					return;
				}

				// Scroll spy navigation (only when scroll spy is visible)
				if (showScrollSpy && !showReviewModal && !showMobileNav) {
					console.log(`⌨️ Key pressed: ${e.key}`, {
						showScrollSpy,
						showReviewModal,
						showMobileNav,
						canNavigateUp: canNavigateUp(),
						canNavigateDown: canNavigateDown(),
					});

					if (e.key === "ArrowUp" && canNavigateUp()) {
						e.preventDefault();
						console.log("⌨️ Keyboard navigation: Up");
						handleScrollSpyScroll("up");
					} else if (e.key === "ArrowDown" && canNavigateDown()) {
						e.preventDefault();
						console.log("⌨️ Keyboard navigation: Down");
						handleScrollSpyScroll("down");
					} else if (e.key === "Home") {
						e.preventDefault();
						console.log("⌨️ Keyboard navigation: Home");
						scrollToSection(navigationItems[0]?.id);
					} else if (e.key === "End") {
						e.preventDefault();
						console.log("⌨️ Keyboard navigation: End");
						scrollToSection(navigationItems[navigationItems.length - 1]?.id);
					}
				}

				// Global navigation shortcuts
				if (e.key === "Escape") {
					e.preventDefault();
					if (showReviewModal) {
						setShowReviewModal(false);
					} else if (showMobileNav) {
						setShowMobileNav(false);
					}
				}
			} catch (error) {
				console.error("Keyboard navigation error:", error);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [showAllPhotos, showScrollSpy, showReviewModal, showMobileNav, activeSection, business?.photos, business?.portfolioPhotos, allImages.length, canNavigateUp, canNavigateDown, handleScrollSpyScroll, navigationItems, scrollToSection]);

	// Enhanced header height calculation with error handling
	useEffect(() => {
		const calculateHeaderHeight = () => {
			try {
				const header = document.querySelector("header");
				if (header) {
					// Get the actual measured height of the sticky header
					const baseHeaderHeight = header.offsetHeight;
					// Add extra height when header section is active to account for the desktop scroll header section
					const scrollHeaderHeight = showHeaderSection ? 80 : 0; // Approximate height of the scroll header section
					const totalHeight = baseHeaderHeight + scrollHeaderHeight;
					const scrollSpyOffset = totalHeight + 16; // 16px gap

					// Calculate available viewport height for scroll spy
					const viewportHeight = window.innerHeight;
					const topGap = 16; // Gap above scroll spy
					const bottomGap = 32; // Gap below scroll spy (2em)
					const arrowHeight = 32; // Height of each arrow button (h-8)
					const errorStateHeight = scrollSpyError ? 32 : 0; // Error message height if present

					// Calculate container height accounting for arrows and gaps
					let availableHeight = viewportHeight - totalHeight - topGap - bottomGap - errorStateHeight;

					// Calculate scroll spy content height (precise)
					const itemHeight = 40; // Height per navigation item: h-9 (36px) + space-y-1 (4px between items)
					const contentPadding = 16; // Padding inside content container (p-2 = 8px top + 8px bottom)
					const scrollSpyContentHeight = navigationItems.length * 36 + (navigationItems.length - 1) * 4 + contentPadding; // 36px per button + 4px spacing between + padding

					// Show arrows only if content overflows available space
					const needsArrows = scrollSpyContentHeight > availableHeight;

					// If arrows are needed, subtract their height from available space
					if (needsArrows) {
						availableHeight -= arrowHeight * 2; // Top and bottom arrows
					}

					// Ensure minimum and maximum heights with responsive breakpoints
					const minHeight = Math.min(200, viewportHeight * 0.3); // Minimum 200px or 30% of viewport

					// More generous max height for larger screens
					const getMaxHeight = () => {
						if (viewportHeight >= 1080) {
							// Large screens (1080p+)
							return Math.min(scrollSpyContentHeight + 40, viewportHeight * 0.8); // Allow 80% of viewport or content height
						} else if (viewportHeight >= 768) {
							// Medium screens
							return Math.min(800, viewportHeight * 0.75); // 800px max or 75% of viewport
						} else {
							// Small screens
							return Math.min(600, viewportHeight * 0.7); // 600px max or 70% of viewport
						}
					};

					const maxHeight = getMaxHeight();

					// Calculate final container height - prefer showing all content on large screens
					let containerHeight;
					if (scrollSpyContentHeight <= availableHeight) {
						// If content fits, use the exact content height (no minimum constraint when content fits)
						containerHeight = scrollSpyContentHeight;
					} else {
						// Otherwise, use constrained height with minimum
						containerHeight = Math.max(minHeight, Math.min(maxHeight, availableHeight));
					}

					console.log("📏 Responsive scroll spy calculated:", {
						viewportHeight,
						baseHeaderHeight,
						scrollHeaderHeight,
						totalHeaderHeight: totalHeight,
						availableHeight,
						scrollSpyContentHeight,
						needsArrows: scrollSpyContentHeight > containerHeight,
						containerHeight,
						minHeight,
						maxHeight,
						showHeaderSection,
						timestamp: new Date().toISOString(),
					});

					setHeaderHeight(totalHeight);
					setShouldShowArrows(scrollSpyContentHeight > containerHeight);
					setScrollSpyContainerHeight(containerHeight);
					setScrollSpyError(null);
				} else {
					console.warn("Header element not found");
					setScrollSpyError("Header not found");
				}
			} catch (error) {
				console.error("Error calculating header height:", error);
				setScrollSpyError("Failed to calculate header height");
			}
		};

		// Debounced calculation with error handling
		const debouncedCalculation = () => {
			if (navigationTimeoutRef.current) {
				clearTimeout(navigationTimeoutRef.current);
			}
			navigationTimeoutRef.current = setTimeout(calculateHeaderHeight, 100);
		};

		// Initial calculation
		calculateHeaderHeight();

		// Listen for resize events
		window.addEventListener("resize", debouncedCalculation);

		// Multiple checks to ensure proper positioning
		const timers = [
			setTimeout(calculateHeaderHeight, 100),
			setTimeout(calculateHeaderHeight, 300),
			setTimeout(calculateHeaderHeight, 500),
			setTimeout(calculateHeaderHeight, 1000), // Extra check
		];

		return () => {
			window.removeEventListener("resize", debouncedCalculation);
			timers.forEach((timer) => clearTimeout(timer));
			if (navigationTimeoutRef.current) {
				clearTimeout(navigationTimeoutRef.current);
			}
		};
	}, [showHeaderSection]);

	// Measure actual content height for precise sizing
	useEffect(() => {
		if (scrollSpyContentRef.current && showScrollSpy) {
			const measureContent = () => {
				const contentElement = scrollSpyContentRef.current;
				if (contentElement) {
					const actualHeight = contentElement.scrollHeight;
					setActualContentHeight(actualHeight);

					console.log("📐 Actual content measured:", {
						scrollHeight: actualHeight,
						calculatedHeight: scrollSpyContainerHeight,
						shouldShowArrows: actualHeight > scrollSpyContainerHeight,
					});
				}
			};

			// Measure after render
			const timer = setTimeout(measureContent, 100);
			return () => clearTimeout(timer);
		}
	}, [showScrollSpy, scrollSpyContainerHeight]);

	// No longer needed since we're not scrolling the container

	// Auto-scroll scroll spy to keep active section visible
	useEffect(() => {
		if (!scrollSpyContentRef.current || !scrollSpyContainerRef.current) return;

		const activeIndex = navigationItems.findIndex((item) => item.id === activeSection);
		if (activeIndex === -1) return;

		const itemHeight = 40; // Height per item: h-9 (36px) + space-y-1 (4px)
		const activeItemPosition = activeIndex * itemHeight;
		const containerHeight = scrollSpyContainerRef.current.clientHeight;
		const buffer = 20; // Buffer space around active item

		// Calculate if we need to scroll to keep active item visible
		const currentScroll = scrollSpyScrollPosition;
		const isAboveView = activeItemPosition < currentScroll + buffer;
		const isBelowView = activeItemPosition + itemHeight > currentScroll + containerHeight - buffer;

		if (isAboveView || isBelowView) {
			// Center the active item in the container
			const targetScroll = Math.max(0, activeItemPosition - containerHeight / 2 + itemHeight / 2);
			const maxScroll = Math.max(0, scrollSpyContentRef.current.scrollHeight - containerHeight);
			const newPosition = Math.min(targetScroll, maxScroll);

			setScrollSpyScrollPosition(newPosition);
			if (scrollSpyContentRef.current) {
				scrollSpyContentRef.current.style.transform = `translateY(-${newPosition}px)`;
			}
		}
	}, [activeSection, navigationItems, scrollSpyScrollPosition]);

	// Enhanced scroll spy with Intersection Observer
	useEffect(() => {
		let scrollTimeout;

		const handleScroll = () => {
			const scrollY = window.scrollY;
			// Show header section after scrolling past threshold
			setShowHeaderSection(scrollY > 200);
		};

		// Throttled scroll handler for performance
		const throttledScroll = () => {
			if (scrollTimeout) return;
			scrollTimeout = setTimeout(() => {
				handleScroll();
				scrollTimeout = null;
			}, 16); // ~60fps
		};

		// Enhanced section detection with Intersection Observer
		const createIntersectionObserver = () => {
			try {
				if (intersectionObserverRef.current) {
					intersectionObserverRef.current.disconnect();
				}

				const options = {
					root: null,
					rootMargin: `${-headerHeight}px 0px -50% 0px`, // Account for header height
					threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
				};

				intersectionObserverRef.current = new IntersectionObserver((entries) => {
					try {
						// Find the section with highest intersection ratio
						let mostVisible = null;
						let highestRatio = 0;

						entries.forEach((entry) => {
							const sectionId = entry.target.id;
							if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
								highestRatio = entry.intersectionRatio;
								mostVisible = sectionId;
							}
						});

						if (mostVisible && mostVisible !== activeSection) {
							console.log(`🎯 Section changed: ${activeSection} -> ${mostVisible}`);
							setActiveSection(mostVisible);
						}
					} catch (error) {
						console.error("Intersection Observer error:", error);
						setScrollSpyError("Section detection failed");
					}
				}, options);

				// Observe all sections
				Object.entries(sectionRefs).forEach(([sectionId, ref]) => {
					if (ref.current) {
						ref.current.id = sectionId; // Ensure ID is set
						intersectionObserverRef.current.observe(ref.current);
					}
				});

				setScrollSpyReady(true);
			} catch (error) {
				console.error("Failed to create Intersection Observer:", error);
				setScrollSpyError("Failed to initialize scroll spy");
				// Fallback to scroll detection
				fallbackScrollDetection();
			}
		};

		// Fallback scroll detection for older browsers
		const fallbackScrollDetection = () => {
			const detectionPoint = window.innerHeight * 0.25;
			const sections = Object.keys(sectionRefs);

			for (const section of sections) {
				const ref = sectionRefs[section];
				if (ref.current) {
					const rect = ref.current.getBoundingClientRect();
					if (rect.top <= detectionPoint && rect.bottom > detectionPoint) {
						if (section !== activeSection) {
							setActiveSection(section);
						}
						break;
					}
				}
			}
		};

		// Initialize scroll spy visibility immediately
		handleScroll();

		// Initialize
		window.addEventListener("scroll", throttledScroll, { passive: true });
		window.addEventListener("resize", handleScroll, { passive: true });

		// Delay observer creation to ensure sections are rendered
		const initTimer = setTimeout(createIntersectionObserver, 1000);

		return () => {
			window.removeEventListener("scroll", throttledScroll);
			window.removeEventListener("resize", handleScroll);
			if (scrollTimeout) clearTimeout(scrollTimeout);
			if (initTimer) clearTimeout(initTimer);
			if (intersectionObserverRef.current) {
				intersectionObserverRef.current.disconnect();
			}
		};
	}, [headerHeight, activeSection, sectionRefs, navigationItems.length, scrollSpyError]); // Added missing dependencies

	// Submit review
	const handleSubmitReview = () => {
		// In a real app, this would submit to an API
		console.log("Submitting review:", newReview);
		setShowReviewModal(false);
		setNewReview({
			rating: 5,
			title: "",
			text: "",
			author: "",
		});
		// Show success message or update reviews list
	};

	// Show loading state while business data is being generated
	if (!business) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className={`sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md border-border transition-all duration-300 ease-out ${showHeaderSection ? "lg:block" : "block"}`}>
				<div className="px-3 mx-auto max-w-7xl sm:px-4 lg:px-8">
					{/* Desktop Header - Always Visible */}
					<div className={`${showHeaderSection ? "hidden lg:flex" : "flex"} items-center justify-between h-14 sm:h-16 transition-all duration-300 ease-out`}>
						<div className="flex items-center space-x-2 sm:space-x-4">
							<Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground sm:h-9 sm:px-3">
								<ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
								<span className="text-sm">Back</span>
							</Button>

							{/* Mobile Navigation Toggle */}
							<Button variant="ghost" size="sm" className="h-8 px-2 lg:hidden text-muted-foreground hover:text-foreground sm:h-9 sm:px-3" onClick={() => setShowMobileNav(!showMobileNav)}>
								<Menu className="w-4 h-4 mr-1 sm:mr-2" />
								<span className="text-sm">Sections</span>
							</Button>
						</div>

						{/* Header Actions */}
						<div className="flex items-center space-x-1 sm:space-x-2">
							<Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground sm:h-9 sm:px-3">
								<Share className="w-4 h-4 mr-1 sm:mr-2" />
								<span className="hidden text-sm sm:inline">Share</span>
							</Button>
							<Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground sm:h-9 sm:px-3">
								<Heart className="w-4 h-4 mr-1 sm:mr-2" />
								<span className="hidden text-sm sm:inline">Save</span>
							</Button>
						</div>
					</div>

					{/* Mobile Scroll Header - Replaces main header on scroll */}
					{showHeaderSection && (
						<div className="flex items-center justify-between py-2 lg:hidden sm:py-3">
							{/* Business Name & Rating */}
							<div className="flex-1 min-w-0">
								<h1 className="text-sm font-bold truncate text-foreground sm:text-base">{business?.name}</h1>
								<div className="flex items-center space-x-2 text-xs text-muted-foreground">
									<div className="flex items-center space-x-1">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className={`w-3 h-3 ${i < Math.floor(business?.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
										))}
									</div>
									<span>{business?.rating}</span>
									<span>•</span>
									<span>{business?.trustScore}% Trust</span>
								</div>
							</div>

							{/* Primary Action Buttons */}
							<div className="flex space-x-2">
								<Button size="sm" className="h-8 text-xs font-semibold transition-all duration-200 bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95">
									<Phone className="w-3 h-3 mr-1" />
									Call
								</Button>
								<Button variant="outline" size="sm" className="h-8 px-2 transition-all duration-200 border-border hover:bg-muted hover:scale-105 active:scale-95">
									<MapPin className="w-3 h-3" />
								</Button>
								<Button variant="ghost" size="sm" className="h-8 px-2 transition-all duration-200 hover:scale-105 active:scale-95" onClick={() => setShowMobileNav(!showMobileNav)}>
									<Menu className="w-3 h-3" />
								</Button>
							</div>
						</div>
					)}

					{/* Desktop Scroll Header - Only for desktop */}
					{showHeaderSection && (
						<div className="hidden px-4 py-4 lg:block">
							<div className="grid grid-cols-3 gap-6">
								{/* Contact Info */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="text-center">
												<div className="text-lg font-bold text-primary">{business?.trustScore}%</div>
												<div className="text-xs text-muted-foreground">Trust Score</div>
											</div>
											<div className="w-px h-8 bg-border"></div>
											<div className="text-center">
												<div className="text-lg font-bold text-green-400">{business?.responseRate}%</div>
												<div className="text-xs text-muted-foreground">Response Rate</div>
											</div>
										</div>
									</div>
									<div className="flex space-x-2">
										<Button size="sm" className="flex-1 transition-all duration-200 bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95">
											<Phone className="w-4 h-4 mr-2" />
											<span className="truncate">{business?.phone}</span>
										</Button>
										<Button variant="outline" size="sm" className="transition-all duration-200 border-border hover:bg-muted hover:scale-105 active:scale-95">
											<MapPin className="w-4 h-4" />
										</Button>
										<Button variant="outline" size="sm" className="transition-all duration-200 border-border hover:bg-muted hover:scale-105 active:scale-95">
											<Globe className="w-4 h-4" />
										</Button>
									</div>
								</div>

								{/* Hours */}
								<div className="space-y-3">
									<h4 className="flex items-center text-sm font-semibold text-foreground">
										<Clock className="w-3 h-3 mr-2" />
										Hours
									</h4>
									<div className="text-xs text-foreground">
										{business.isOpenNow && (
											<div className="flex items-center mb-1 space-x-1">
												<div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
												<span className="font-medium text-green-600">Open</span>
											</div>
										)}
										<div className="text-muted-foreground">{business?.hours || "Hours not available"}</div>
									</div>
								</div>

								{/* Key Amenities */}
								<div className="space-y-3">
									<h4 className="text-sm font-semibold text-foreground">What This Place Offers</h4>
									<div className="grid grid-cols-2 gap-2">
										{business?.amenities?.slice(0, 4).map((amenity, index) => (
											<div key={index} className="flex items-center space-x-2">
												<amenity.icon className="flex-shrink-0 w-3 h-3 text-muted-foreground" />
												<span className={`text-xs truncate ${amenity.available ? "text-foreground" : "text-muted-foreground line-through"}`}>{amenity.name}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Mobile Navigation Menu */}
					{showMobileNav && (
						<div className="border-t backdrop-blur-md lg:hidden border-border bg-background/95">
							<div className="grid grid-cols-2 gap-2 p-3 sm:p-4">
								{navigationItems.map((item, index) => {
									const Icon = item.icon;
									const isCertification = item.id === "certification";
									return (
										<button
											key={item.id}
											onClick={() => scrollToSection(item.id)}
											className={`flex items-center space-x-2 p-2.5 rounded-lg text-xs transition-all duration-200 sm:text-sm hover:scale-105 active:scale-95 ${
												isCertification ? (activeSection === item.id ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg" : "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md hover:from-blue-600 hover:to-green-600 hover:shadow-lg font-semibold") : activeSection === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
											}`}
										>
											<Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4`} />
											<span className="truncate">
												{item.label}
												{isCertification && <span className="ml-1 text-xs opacity-75">NEW</span>}
											</span>
										</button>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</header>

			{/* Main Content */}
			<div className="px-3 py-4 mx-auto max-w-7xl sm:px-4 sm:py-6 lg:px-8 lg:py-8">
				{/* Main Content - Full Width */}
				<div className="space-y-6 sm:space-y-8">
					{/* Minimalistic Business Header */}
					<div className="space-y-6">
						{/* Business Name & Basic Info */}
						<div className="space-y-4">
							<div className="flex items-start justify-between">
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
							<div className="flex items-center justify-between">
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
									<div className={`flex items-center px-2 py-1 space-x-1.5 text-sm rounded-lg ${business.status === "Open" ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"}`}>
										<div className={`w-2 h-2 rounded-full ${business.status === "Open" ? "bg-green-500" : "bg-red-500"}`} />
										<span className="font-medium">{business.status}</span>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Button variant="ghost" size="sm">
										<Share className="w-4 h-4" />
									</Button>
									<Button variant="ghost" size="sm">
										<Heart className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</div>

						{/* Essential Info Grid */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							{/* Contact */}
							<div className="space-y-4">
								<div className="space-y-3">
									<Button className="w-full h-12 text-base font-semibold">
										<Phone className="w-5 h-5 mr-2" />
										{business.phone}
									</Button>
									<div className="grid grid-cols-2 gap-2">
										<Button variant="outline" className="h-10">
											<MapPin className="w-4 h-4 mr-2" />
											Directions
										</Button>
										<Button variant="outline" className="h-10">
											<Globe className="w-4 h-4 mr-2" />
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
									{business.isOpenNow && (
										<div className="flex items-center mb-2 space-x-2">
											<div className="w-2 h-2 bg-green-500 rounded-full"></div>
											<span className="text-sm font-medium text-green-600">Open Now</span>
										</div>
									)}
									<div className="text-foreground">{business.hours || "Hours not available"}</div>
								</div>
							</div>

							{/* Quick Actions */}
							<div className="space-y-4">
								<h3 className="font-semibold">Quick Actions</h3>
								<div className="space-y-2">
									<Button variant="outline" className="justify-start w-full h-10" onClick={() => setShowReviewModal(true)}>
										<Edit className="w-4 h-4 mr-2" />
										Write Review
									</Button>
									<Button variant="outline" className="justify-start w-full h-10" onClick={() => scrollToSection("reviews")}>
										<Star className="w-4 h-4 mr-2" />
										View Reviews
									</Button>
									<Button variant="outline" className="justify-start w-full h-10" onClick={() => scrollToSection("services")}>
										<Settings className="w-4 h-4 mr-2" />
										Services
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Left Column - Main Content */}
					<div className="space-y-6 sm:space-y-8 lg:col-span-2">
						{/* Photo Gallery - Modern Style */}
						<div className="space-y-4 sm:space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold sm:text-xl md:text-2xl text-foreground">Photos</h2>
								<div className="flex items-center space-x-2 text-sm text-muted-foreground">
									<Camera className="w-4 h-4" />
									<span>{allImages.length} photos</span>
									<span>•</span>
									<Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
										Professional
									</Badge>
								</div>
							</div>

							{/* Modern Photo Grid */}
							<div className="grid grid-cols-4 gap-2 overflow-hidden h-80 rounded-xl sm:h-96">
								{/* Main large photo - left side */}
								<div
									className="relative col-span-2 row-span-2 overflow-hidden cursor-pointer group bg-muted"
									onClick={() => {
										setSelectedImageIndex(0);
										setShowAllPhotos(true);
									}}
								>
									<img
										src={allImages[0]}
										alt={`${business.name} main photo`}
										className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
										onError={(e) => {
											e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop";
										}}
									/>
									<div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100" />
								</div>

								{/* Top right photos */}
								<div
									className="relative overflow-hidden cursor-pointer group bg-muted"
									onClick={() => {
										setSelectedImageIndex(1);
										setShowAllPhotos(true);
									}}
								>
									<img
										src={allImages[1]}
										alt={`${business.name} photo 2`}
										className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
										onError={(e) => {
											e.target.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop";
										}}
									/>
									<div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100" />
								</div>
								<div
									className="relative overflow-hidden cursor-pointer group bg-muted"
									onClick={() => {
										setSelectedImageIndex(2);
										setShowAllPhotos(true);
									}}
								>
									<img
										src={allImages[2]}
										alt={`${business.name} photo 3`}
										className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
										onError={(e) => {
											e.target.src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop";
										}}
									/>
									<div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100" />
								</div>

								{/* Bottom right photos */}
								<div
									className="relative overflow-hidden cursor-pointer group bg-muted"
									onClick={() => {
										setSelectedImageIndex(3);
										setShowAllPhotos(true);
									}}
								>
									<img
										src={allImages[3]}
										alt={`${business.name} photo 4`}
										className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
										onError={(e) => {
											e.target.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop";
										}}
									/>
									<div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100" />
								</div>
								<div
									className="relative overflow-hidden cursor-pointer group bg-muted"
									onClick={() => {
										setSelectedImageIndex(4);
										setShowAllPhotos(true);
									}}
								>
									<img
										src={allImages[4]}
										alt={`${business.name} photo 5`}
										className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
										onError={(e) => {
											e.target.src = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop";
										}}
									/>
									<div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100" />
									{/* Show all photos overlay on last visible image */}
									{allImages.length > 5 && (
										<div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/60 group-hover:bg-black/80">
											<div className="text-center text-white">
												<div className="text-lg font-semibold">+{allImages.length - 5}</div>
												<div className="text-sm">more photos</div>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Show all photos button */}
							<Button variant="outline" className="w-full border-border hover:bg-muted/50 text-foreground" onClick={() => setShowAllPhotos(true)}>
								<Camera className="w-4 h-4 mr-2" />
								Show all {allImages.length} photos
							</Button>
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

			{/* Photo Modal */}
			{showAllPhotos && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-background/95"
					onClick={(e) => {
						// Close modal when clicking outside the content
						if (e.target === e.currentTarget) {
							setShowAllPhotos(false);
						}
					}}
					onKeyDown={(e) => {
						// Close modal on ESC key
						if (e.key === "Escape") {
							setShowAllPhotos(false);
						}
					}}
					tabIndex={0}
				>
					<div className="relative flex flex-col w-full h-full">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-4 border-b backdrop-blur-md bg-background/80 border-border">
							<div className="flex items-center space-x-4">
								<h3 className="font-semibold text-foreground">
									{selectedImageIndex + 1} / {allImages.length}
								</h3>
								<Badge variant="secondary" className="bg-muted text-foreground">
									{allImages[selectedImageIndex]?.category || "Gallery"}
								</Badge>
							</div>
							<div className="flex items-center space-x-2">
								<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
									<Share className="w-4 h-4 mr-2" />
									Share
								</Button>
								<Button variant="ghost" size="sm" onClick={() => setShowAllPhotos(false)} className="text-muted-foreground hover:text-foreground hover:bg-red-500/10 hover:text-red-500" title="Close (ESC)">
									<X className="w-5 h-5" />
								</Button>
							</div>
						</div>

						{/* Modal Content */}
						<div className="flex items-center justify-center flex-1 p-4">
							<div className="relative max-w-4xl max-h-full">
								{allImages[selectedImageIndex] && (
									<div className="relative">
										<img src={allImages[selectedImageIndex].src || allImages[selectedImageIndex]} alt={allImages[selectedImageIndex].title || `${business.name} photo ${selectedImageIndex + 1}`} className="object-contain max-w-full max-h-full rounded-lg" />
										{/* Image Info Overlay */}
										{allImages[selectedImageIndex].title && (
											<div className="absolute p-3 border rounded-lg right-4 bottom-4 left-4 backdrop-blur-md bg-background/80 border-border">
												<h4 className="font-medium text-foreground">{allImages[selectedImageIndex].title}</h4>
												{allImages[selectedImageIndex].description && <p className="mt-1 text-sm text-muted-foreground">{allImages[selectedImageIndex].description}</p>}
												<div className="mt-2">
													<Badge variant="secondary" className="text-xs bg-muted text-foreground">
														{allImages[selectedImageIndex].category}
													</Badge>
												</div>
											</div>
										)}
									</div>
								)}

								{/* Navigation Arrows */}
								{allImages.length > 1 && (
									<>
										<Button variant="ghost" size="sm" className="absolute -translate-y-1/2 left-4 top-1/2 backdrop-blur-sm bg-background/80 hover:bg-background/90" onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}>
											<ChevronLeft className="w-5 h-5" />
										</Button>
										<Button variant="ghost" size="sm" className="absolute -translate-y-1/2 right-4 top-1/2 backdrop-blur-sm bg-background/80 hover:bg-background/90" onClick={() => setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}>
											<ChevronRight className="w-5 h-5" />
										</Button>
									</>
								)}
							</div>
						</div>

						{/* Thumbnail Navigation */}
						{allImages.length > 1 && (
							<div className="p-4 border-t backdrop-blur-md bg-background/80 border-border">
								<div className="flex pb-2 space-x-2 overflow-x-auto">
									{allImages.map((image, index) => (
										<button key={index} onClick={() => setSelectedImageIndex(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === selectedImageIndex ? "border-primary" : "border-transparent hover:border-muted-foreground"}`}>
											<img src={image.src || image} alt={image.title || `Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Enhanced Floating Scroll Spy Navigation - Desktop Only */}
			{showScrollSpy && (
				<div
					className="fixed z-30 hidden left-6 lg:block"
					style={{
						top: `${headerHeight + 16}px`,
						bottom: "2em",
					}}
				>
					<div className="flex flex-col border shadow-lg rounded-xl backdrop-blur-md w-fit bg-card/90 border-border" style={{ overflow: "visible" }}>
						{/* Error State */}
						{scrollSpyError && <div className="p-2 text-xs text-red-500 border-b border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800">⚠️ {scrollSpyError}</div>}

						{/* Previous Section Arrow */}
						{shouldShowArrows && navigationItems.length > 1 && (
							<Button variant="ghost" size="sm" onClick={() => handleScrollSpyScroll("up")} className={`group relative flex-shrink-0 h-8 px-2 border-b border-border rounded-none transition-all duration-200 flex items-center justify-center ${!canNavigateUp() ? "opacity-40 cursor-not-allowed bg-muted/20" : "opacity-100 hover:bg-primary/10 hover:text-primary active:bg-primary/20"}`} disabled={!canNavigateUp()} title="Previous section">
								<ChevronUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
							</Button>
						)}

						{/* Navigation Items Container */}
						<div
							ref={scrollSpyContainerRef}
							className={`relative ${shouldShowArrows ? "overflow-hidden" : ""}`}
							style={
								shouldShowArrows
									? {
											height: `${scrollSpyContainerHeight}px`,
											maxHeight: `${scrollSpyContainerHeight}px`,
											overflow: "hidden",
									  }
									: { overflow: "visible" }
							}
						>
							<div ref={scrollSpyContentRef} className="p-2 space-y-1 transition-transform duration-200 ease-out" style={shouldShowArrows ? { transform: `translateY(-${scrollSpyScrollPosition}px)` } : {}}>
								{navigationItems.map((item, index) => {
									const Icon = item.icon;
									const isActive = activeSection === item.id;
									const isCertification = item.id === "certification";

									return (
										<div key={item.id} className="relative" style={{ overflow: "visible", zIndex: 10 }}>
											<button
												onClick={() => scrollToSection(item.id)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														scrollToSection(item.id);
													}
												}}
												className={`group relative flex items-center justify-center p-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 w-9 h-9 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
													isCertification ? (isActive ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg shadow-blue-500/25" : "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md hover:from-blue-600 hover:to-green-600 hover:shadow-lg") : isActive ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"
												}`}
												title={item.label}
												aria-label={`Navigate to ${item.label} section`}
												aria-current={isActive ? "page" : undefined}
											>
												<Icon className={`w-4.5 h-4.5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />

												{/* Enhanced Tooltip */}
												<div
													className={`absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 z-[9999] ${isCertification ? "text-white bg-gradient-to-r from-blue-600 to-green-600 border shadow-xl border-blue-500/50" : isActive ? "border bg-primary text-primary-foreground border-primary/20" : ""}`}
													style={{
														top: "50%",
														transform: "translateY(-50%)",
													}}
												>
													{isCertification ? (
														<div className="flex items-center space-x-2">
															<Award className="w-4 h-4" />
															<span className="font-semibold">{item.label}</span>
															<div className="px-2 py-0.5 text-xs rounded bg-white/20">NEW</div>
														</div>
													) : (
														<div className="flex items-center space-x-2">
															<span>{item.label}</span>
															{isActive && <span className="text-xs opacity-75">(Current)</span>}
														</div>
													)}
												</div>
											</button>
										</div>
									);
								})}
							</div>
						</div>

						{/* Next Section Arrow */}
						{shouldShowArrows && navigationItems.length > 1 && (
							<Button variant="ghost" size="sm" onClick={() => handleScrollSpyScroll("down")} className={`group relative flex-shrink-0 h-8 px-2 border-t border-border rounded-none transition-all duration-200 flex items-center justify-center ${!canNavigateDown() ? "opacity-40 cursor-not-allowed bg-muted/20" : "opacity-100 hover:bg-primary/10 hover:text-primary active:bg-primary/20"}`} disabled={!canNavigateDown()} title="Next section">
								<ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
							</Button>
						)}
					</div>
				</div>
			)}

			{/* Review Modal */}
			{showReviewModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-background/80">
					<div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						{/* Modal Header */}
						<div className="p-6 border-b border-border">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-semibold text-foreground">Write a Review</h3>
								<Button variant="ghost" size="sm" onClick={() => setShowReviewModal(false)} className="hover:bg-muted">
									<X className="w-4 h-4" />
								</Button>
							</div>
						</div>

						{/* Modal Content */}
						<div className="p-6 space-y-6">
							{/* Rating Selection */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">Overall Rating</label>
								<div className="flex items-center space-x-1">
									{[1, 2, 3, 4, 5].map((rating) => (
										<button key={rating} onClick={() => setNewReview((prev) => ({ ...prev, rating }))} className="p-1 transition-transform hover:scale-110">
											<Star className={`w-8 h-8 ${rating <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`} />
										</button>
									))}
									<span className="ml-2 text-sm text-muted-foreground">
										{newReview.rating} star{newReview.rating !== 1 ? "s" : ""}
									</span>
								</div>
							</div>

							{/* Review Title */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">Review Title</label>
								<input type="text" placeholder="Summarize your experience" value={newReview.title} onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
							</div>

							{/* Review Text */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">Your Review</label>
								<textarea placeholder="Tell others about your experience..." value={newReview.text} onChange={(e) => setNewReview((prev) => ({ ...prev, text: e.target.value }))} rows={5} className="w-full px-3 py-2 border rounded-lg resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
							</div>

							{/* Author Name */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">Your Name</label>
								<input type="text" placeholder="Enter your name" value={newReview.author} onChange={(e) => setNewReview((prev) => ({ ...prev, author: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-background border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
							</div>
						</div>

						{/* Modal Footer */}
						<div className="p-6 border-t border-border">
							<div className="flex justify-end space-x-3">
								<Button variant="outline" onClick={() => setShowReviewModal(false)} className="border-border hover:bg-muted">
									Cancel
								</Button>
								<Button onClick={handleSubmitReview} disabled={!newReview.text.trim() || !newReview.author.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
									<Send className="w-4 h-4 mr-2" />
									Submit Review
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Video Consultation Modal - REMOVED */}
			{false && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-background/80">
					<div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 border-b border-border">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<div className="p-2 rounded-lg bg-blue-500/10">
										<Video className="w-6 h-6 text-blue-500" />
									</div>
									<div>
										<h3 className="text-xl font-semibold text-foreground">Video Consultation</h3>
										<p className="text-sm text-muted-foreground">Get expert advice via video call</p>
									</div>
								</div>
								<Button variant="ghost" size="sm">
									<X className="w-4 h-4" />
								</Button>
							</div>
						</div>

						<div className="p-6 space-y-6">
							{/* Service Details */}
							<div className="grid grid-cols-2 gap-4">
								<div className="p-4 border rounded-lg bg-card/30">
									<p className="text-sm text-muted-foreground">Price</p>
									<p className="text-xl font-bold text-primary">{business.videoConsultation.pricePerSession}</p>
								</div>
								<div className="p-4 border rounded-lg bg-card/30">
									<p className="text-sm text-muted-foreground">Duration</p>
									<p className="text-xl font-bold text-foreground">{business.videoConsultation.duration}</p>
								</div>
							</div>

							{/* What's Included */}
							<div className="space-y-3">
								<h4 className="font-semibold text-foreground">What&apos;s Included</h4>
								<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
									{business.videoConsultation.specialties.map((specialty, index) => (
										<div key={index} className="flex items-center space-x-2">
											<CheckCircle className="w-4 h-4 text-green-500" />
											<span className="text-sm text-foreground">{specialty}</span>
										</div>
									))}
								</div>
							</div>

							{/* Next Available */}
							<div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-semibold text-foreground">Next Available</p>
										<p className="text-sm text-muted-foreground">{business.videoConsultation.nextSlot}</p>
									</div>
									<Button className="text-white bg-blue-500 hover:bg-blue-600">
										<Video className="w-4 h-4 mr-2" />
										Book Session
									</Button>
								</div>
							</div>

							{/* Languages */}
							<div className="space-y-2">
								<p className="text-sm text-muted-foreground">Available in:</p>
								<div className="flex gap-2">
									{business.videoConsultation.languages.map((lang, index) => (
										<Badge key={index} variant="secondary">
											{lang}
										</Badge>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Mobile Review FAB - Hidden when main FAB is shown */}
			<div className="fixed z-40 right-4 bottom-4 lg:hidden sm:bottom-6 sm:right-6">
				<Button size="default" onClick={() => setShowReviewModal(true)} className="h-12 px-4 transition-all duration-200 transform rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-2xl hover:scale-105 active:scale-95">
					<Plus className="w-4 h-4 mr-2" />
					<span className="text-sm font-semibold">Review</span>
				</Button>
			</div>
		</div>
	);
}
