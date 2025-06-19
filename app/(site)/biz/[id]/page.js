"use client";

import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
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
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { generateBusinesses, searchBusinessesByQuery } from "@lib/businessDataGenerator";

export default function BizProfile({ params }) {
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
				if (isNaN(params.id)) {
					foundBusiness = businesses.find((b) => b.slug === params.id);
				} else {
					// Find by ID (ensure string comparison)
					foundBusiness = businesses.find((b) => b.id === params.id.toString());
				}

				// If not found, use the first business as fallback
				if (!foundBusiness) {
					foundBusiness = businesses[0];
				}

				// Transform the business data to match our component expectations
				const transformedBusiness = {
					...foundBusiness,
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
							{ factor: "Licensed Professionals", impact: "Ensures work meets safety standards" },
							{ factor: "Proper Insurance", impact: "Protects your property" },
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
					faq: [
						{
							question: "What areas do you serve?",
							answer: `We serve ${foundBusiness.address.split(",").slice(-2).join(",").trim()} and surrounding areas.`,
						},
						{
							question: "Are you licensed and insured?",
							answer: "Yes, we are fully licensed and insured for your protection.",
						},
					],
					accessibility: ["Professional service approach", "Clear communication", "Flexible scheduling"],
					careers: {
						isHiring: Math.random() > 0.7, // More likely to be hiring
						companySize: foundBusiness.employees || "1-5 employees",
						culture: "We foster a collaborative and supportive work environment where team members can grow their careers while delivering exceptional service to our community.",
						benefits: ["Health Insurance", "Paid Time Off", "401(k) Retirement Plan", "Professional Development", "Performance Bonuses", "Continuing Education Support"],
						openPositions:
							Math.random() > 0.7
								? [
										{
											title: foundBusiness.categories[1] === "Plumber" ? "Licensed Plumber" : foundBusiness.categories[1] === "Electrician" ? "Licensed Electrician" : foundBusiness.categories[1] === "Auto Repair" ? "Automotive Technician" : foundBusiness.categories[0] === "Restaurants" ? "Kitchen Staff" : foundBusiness.categories[0] === "Beauty & Spas" ? "Licensed Stylist" : "Service Technician",
											type: "Full-time",
											experience: "2+ years",
											salary: foundBusiness.categories[0] === "Professional Services" ? "$65,000 - $85,000" : foundBusiness.categories[0] === "Health & Medical" ? "$55,000 - $75,000" : foundBusiness.categories[0] === "Home Services" ? "$45,000 - $65,000" : "$35,000 - $50,000",
											location: foundBusiness.address.split(",")[1]?.trim() || "Local",
											posted: "1 week ago",
											description: "Join our growing team and help us deliver excellent service to our customers. We're looking for a motivated professional to contribute to our success.",
											requirements: ["Valid professional license (if applicable)", "2+ years relevant experience", "Strong communication skills", "Reliable transportation", "Clean background check", "Customer service oriented"],
										},
										...(Math.random() > 0.8
											? [
													{
														title: "Customer Service Representative",
														type: "Part-time",
														experience: "Entry level",
														salary: "$15 - $20/hour",
														location: foundBusiness.address.split(",")[1]?.trim() || "Local",
														posted: "3 days ago",
														description: "Support our team by providing excellent customer service and administrative assistance.",
														requirements: ["High school diploma or equivalent", "Strong communication skills", "Basic computer skills", "Customer service experience preferred", "Flexible schedule availability"],
													},
											  ]
											: []),
								  ]
								: [],
						perks: ["Flexible Work Schedule", "Professional Development", "Team Building Activities", "Recognition Programs", "Employee Discounts", "Modern Work Environment"],
						testimonials: [
							{
								employee: "Maria Rodriguez",
								tenure: "2 years",
								quote: "Great place to work with supportive management and opportunities for growth. The team really cares about each other and our customers.",
							},
							{
								employee: "David Chen",
								tenure: "3 years",
								quote: "I've learned so much here and feel valued as an employee. The work-life balance is excellent and the benefits are competitive.",
							},
						],
					},
					partnerships: {
						supplierPartners: [
							{
								name: foundBusiness.categories[0] === "Home Services" ? "Professional Supply Co" : foundBusiness.categories[0] === "Automotive" ? "Quality Auto Parts" : foundBusiness.categories[0] === "Restaurants" ? "Fresh Food Distributors" : "Industry Supply Group",
								type: "Primary Supplier",
								relationship: "Authorized Dealer",
								logo: "https://via.placeholder.com/64x64?text=PS",
								benefits: "Access to professional-grade materials and equipment at competitive prices, ensuring quality service delivery.",
							},
							{
								name: foundBusiness.categories[0] === "Home Services" ? "Builder's Choice Materials" : foundBusiness.categories[0] === "Automotive" ? "Premium Parts Direct" : foundBusiness.categories[0] === "Restaurants" ? "Restaurant Equipment Co" : "Professional Tools & Equipment",
								type: "Equipment Partner",
								relationship: "Preferred Partner",
								logo: "https://via.placeholder.com/64x64?text=BC",
								benefits: "Specialized equipment and tools to handle complex projects with professional results.",
							},
						],
						servicePartners: [
							{
								name: foundBusiness.categories[0] === "Home Services" ? "Emergency Response Network" : foundBusiness.categories[0] === "Health & Medical" ? "Medical Billing Services" : foundBusiness.categories[0] === "Automotive" ? "Towing & Recovery Services" : "Professional Support Services",
								type: "Service Partner",
								relationship: "Strategic Alliance",
								description: "Collaborative partnership providing extended service capabilities and emergency support when needed.",
							},
							{
								name: foundBusiness.categories[0] === "Restaurants" ? "Delivery Network Partners" : foundBusiness.categories[0] === "Beauty & Spas" ? "Wellness Services Network" : "Customer Service Enhancement",
								type: "Customer Experience",
								relationship: "Preferred Partner",
								description: "Enhanced customer experience through coordinated service delivery and shared best practices.",
							},
						],
						communityPartners: [
							{
								name: `${foundBusiness.address.split(",")[1]?.trim() || "Local"} Chamber of Commerce`,
								type: "Business Organization",
								involvement: "Active Member",
								description: "Supporting local economic development and community business initiatives.",
							},
							{
								name: foundBusiness.categories[0] === "Home Services" ? "Habitat for Humanity" : foundBusiness.categories[0] === "Health & Medical" ? "Community Health Coalition" : foundBusiness.categories[0] === "Education" ? "Local School District" : "Community Development Fund",
								type: "Non-Profit Partnership",
								involvement: "Volunteer Support",
								description: "Contributing professional services and expertise to support community development and charitable initiatives.",
							},
						],
						certifications: [
							{
								name: foundBusiness.categories[0] === "Home Services" ? "Better Business Bureau" : foundBusiness.categories[0] === "Automotive" ? "ASE Certified Shop" : foundBusiness.categories[0] === "Restaurants" ? "Food Safety Certified" : foundBusiness.categories[0] === "Health & Medical" ? "Healthcare Quality Alliance" : "Professional Association Member",
								grade: foundBusiness.ratings.overall >= 4.5 ? "A+" : foundBusiness.ratings.overall >= 4.0 ? "A" : "B+",
								year: "2024",
								since: "2020",
								achievement: foundBusiness.ratings.overall >= 4.5 ? "Excellence Award" : "Quality Recognition",
								benefits: "Demonstrates commitment to industry standards, customer satisfaction, and professional excellence in service delivery.",
							},
							{
								name: `${foundBusiness.address.split(",").slice(-1)[0]?.trim() || "State"} Licensed Professional`,
								grade: "Certified",
								year: "2023",
								since: "2018",
								achievement: "Licensed & Insured",
								benefits: "Full professional licensing and insurance coverage providing customer protection and service quality assurance.",
							},
							{
								name: "Customer Service Excellence",
								grade: foundBusiness.reviewCount > 100 ? "Gold" : foundBusiness.reviewCount > 50 ? "Silver" : "Bronze",
								year: "2024",
								since: "2021",
								achievement: `${foundBusiness.reviewCount}+ Customer Reviews`,
								benefits: "Proven track record of customer satisfaction with consistently high ratings and positive feedback from our community.",
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
				};

				setBusiness(transformedBusiness);
			} catch (error) {
				console.error("Error loading business data:", error);
				// Fallback to a default business
				setBusiness({
					id: params.id,
					name: "Local Business",
					type: "Professional Services",
					rating: 4.5,
					reviewCount: 50,
					// Add other required fields...
				});
			}
		};

		loadBusinessData();
	}, [params.id]);

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
			<div className="flex justify-center items-center min-h-screen bg-background">
				<div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
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
							<Button variant="ghost" size="sm" className="px-2 h-8 text-muted-foreground hover:text-foreground sm:h-9 sm:px-3">
								<ArrowLeft className="mr-1 w-4 h-4 sm:mr-2" />
								<span className="text-sm">Back</span>
							</Button>

							{/* Mobile Navigation Toggle */}
							<Button variant="ghost" size="sm" className="px-2 h-8 lg:hidden text-muted-foreground hover:text-foreground sm:h-9 sm:px-3" onClick={() => setShowMobileNav(!showMobileNav)}>
								<Menu className="mr-1 w-4 h-4 sm:mr-2" />
								<span className="text-sm">Sections</span>
							</Button>
						</div>

						{/* Header Actions */}
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

					{/* Mobile Scroll Header - Replaces main header on scroll */}
					{showHeaderSection && (
						<div className="flex justify-between items-center py-2 lg:hidden sm:py-3">
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
									<Phone className="mr-1 w-3 h-3" />
									Call
								</Button>
								<Button variant="outline" size="sm" className="px-2 h-8 transition-all duration-200 border-border hover:bg-muted hover:scale-105 active:scale-95">
									<MapPin className="w-3 h-3" />
								</Button>
								<Button variant="ghost" size="sm" className="px-2 h-8 transition-all duration-200 hover:scale-105 active:scale-95" onClick={() => setShowMobileNav(!showMobileNav)}>
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
									<div className="flex justify-between items-center">
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
											<Phone className="mr-2 w-4 h-4" />
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
										<Clock className="mr-2 w-3 h-3" />
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
										<Edit className="mr-2 w-4 h-4" />
										Write Review
									</Button>
									<Button variant="outline" className="justify-start w-full h-10" onClick={() => scrollToSection("reviews")}>
										<Star className="mr-2 w-4 h-4" />
										View Reviews
									</Button>
									<Button variant="outline" className="justify-start w-full h-10" onClick={() => scrollToSection("services")}>
										<Settings className="mr-2 w-4 h-4" />
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
							<div className="flex justify-between items-center">
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
							<div className="grid overflow-hidden grid-cols-4 gap-2 h-80 rounded-xl sm:h-96">
								{/* Main large photo - left side */}
								<div
									className="overflow-hidden relative col-span-2 row-span-2 cursor-pointer group bg-muted"
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
									<div className="absolute inset-0 opacity-0 transition-opacity duration-300 bg-black/20 group-hover:opacity-100" />
								</div>

								{/* Top right photos */}
								<div
									className="overflow-hidden relative cursor-pointer group bg-muted"
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
									<div className="absolute inset-0 opacity-0 transition-opacity duration-300 bg-black/20 group-hover:opacity-100" />
								</div>
								<div
									className="overflow-hidden relative cursor-pointer group bg-muted"
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
									<div className="absolute inset-0 opacity-0 transition-opacity duration-300 bg-black/20 group-hover:opacity-100" />
								</div>

								{/* Bottom right photos */}
								<div
									className="overflow-hidden relative cursor-pointer group bg-muted"
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
									<div className="absolute inset-0 opacity-0 transition-opacity duration-300 bg-black/20 group-hover:opacity-100" />
								</div>
								<div
									className="overflow-hidden relative cursor-pointer group bg-muted"
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
									<div className="absolute inset-0 opacity-0 transition-opacity duration-300 bg-black/20 group-hover:opacity-100" />
									{/* Show all photos overlay on last visible image */}
									{allImages.length > 5 && (
										<div className="flex absolute inset-0 justify-center items-center transition-opacity duration-300 bg-black/60 group-hover:bg-black/80">
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
								<Camera className="mr-2 w-4 h-4" />
								Show all {allImages.length} photos
							</Button>
						</div>

						{/* Main Content Sections */}
						<div className="space-y-20 sm:space-y-24 md:space-y-32 lg:space-y-40">
							{/* 1. BUSINESS OVERVIEW SECTION - First Impression */}
							<section ref={overviewRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-6 sm:mb-8 md:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Building className="mr-3 w-6 h-6 sm:w-8 sm:h-8 sm:mr-4 text-primary" />
										Business Overview
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full sm:w-24 sm:h-1.5 from-primary to-primary/50"></div>
								</div>

								<div className="space-y-6 sm:space-y-8">
									{/* AI Insights */}
									<div className="p-6 rounded-xl border backdrop-blur-sm bg-card/50 border-border sm:p-8">
										<div className="flex items-start space-x-4">
											<div className="flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-primary/10">
												<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
											</div>
											<div className="space-y-2 sm:space-y-3">
												<h3 className="text-lg font-semibold sm:text-xl text-foreground">AI Insights</h3>
												<p className="text-sm leading-relaxed sm:text-base text-muted-foreground">This business has consistently high ratings for quality work and customer service. Customers frequently mention their professionalism, reliability, and quick response times for emergency services.</p>
											</div>
										</div>
									</div>

									{/* Business Details & Service Area */}
									<div className="space-y-6">
										<h3 className="text-xl font-semibold sm:text-2xl text-foreground">About This Business</h3>
										<p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{business.description}</p>

										{/* Quick Business Facts */}
										<div className="grid grid-cols-2 gap-4 p-6 rounded-xl border lg:grid-cols-4 bg-card/30 border-border">
											<div className="text-center">
												<div className="text-2xl font-bold text-foreground">{business.established}</div>
												<div className="text-sm text-muted-foreground">Established</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold text-foreground">{business.employees}</div>
												<div className="text-sm text-muted-foreground">Team Size</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold text-foreground">{business.responseTime}</div>
												<div className="text-sm text-muted-foreground">Response Time</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold text-foreground">{business.responseRate}%</div>
												<div className="text-sm text-muted-foreground">Response Rate</div>
											</div>
										</div>

										{/* Service Area */}
										<div className="p-4 rounded-lg border bg-card/30 border-border">
											<h4 className="mb-3 font-medium text-foreground">Service Area</h4>
											<div className="space-y-2">
												<p className="text-sm text-muted-foreground">
													Primary: <span className="font-medium text-foreground">{business.serviceArea.primary}</span>
												</p>
												<p className="text-sm text-muted-foreground">
													Coverage: <span className="font-medium text-foreground">{business.serviceArea.coverage}</span>
												</p>
												<div className="flex flex-wrap gap-2 mt-3">
													{business.serviceArea.cities.map((city, index) => (
														<Badge key={index} variant="secondary" className="bg-muted text-foreground">
															{city}
														</Badge>
													))}
												</div>
											</div>
										</div>
									</div>

									{/* Business Highlights */}
									<div className="space-y-4 sm:space-y-6">
										<h3 className="text-xl font-semibold sm:text-2xl text-foreground">Why Choose Us</h3>
										<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
											{business.businessHighlights.map((highlight, index) => (
												<div key={index} className="flex items-start p-4 space-x-3 rounded-lg border bg-card/30 border-border sm:p-5">
													<CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4 text-green-400 sm:w-5 sm:h-5 sm:mt-0" />
													<span className="text-sm leading-relaxed break-words sm:text-base text-foreground">{highlight}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</section>

							{/* 2. THORBIS CERTIFIED ELITE STATUS - Trust Validation */}
							<section ref={certificationRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-6 sm:mb-8 md:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Award className="mr-3 w-6 h-6 sm:w-8 sm:h-8 sm:mr-4 text-primary" />
										Thorbis Certified Elite Business
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full sm:w-24 sm:h-1.5 from-primary to-primary/50"></div>
								</div>

								<div className="space-y-6 sm:space-y-8">
									{/* Elite Status Hero - Redesigned */}
									<div className="isolate overflow-hidden relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl border shadow-2xl lg:rounded-3xl border-emerald-400/20">
										<svg viewBox="0 0 1024 1024" aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]">
											<circle r={512} cx={512} cy={512} fill="url(#cert-gradient)" fillOpacity="0.3" />
											<defs>
												<radialGradient id="cert-gradient">
													<stop stopColor="#10B981" />
													<stop offset={1} stopColor="#06B6D4" />
												</radialGradient>
											</defs>
										</svg>

										<div className="relative px-6 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
											<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
												{/* Left Content */}
												<div className="space-y-6">
													<div className="inline-flex items-center px-4 py-2 text-sm font-bold text-white rounded-full border backdrop-blur-sm bg-white/20 border-white/30">🏆 Elite Recognition</div>

													<div className="space-y-4">
														<h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">Certified Elite Business</h3>
														<p className="text-lg leading-relaxed text-white/90 sm:text-xl">
															This business has achieved our highest certification level - earned by fewer than <span className="font-bold text-yellow-300">1 in 125,000 businesses</span>. Like a Michelin star for service excellence.
														</p>
													</div>

													<div className="flex gap-3 items-center p-4 rounded-xl border backdrop-blur-sm bg-white/10 border-white/20">
														<div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-emerald-400 rounded-full">
															<Shield className="w-5 h-5 text-emerald-900" />
														</div>
														<div>
															<div className="font-semibold text-white">Protected by Performance Guarantee</div>
															<div className="text-sm text-white/80">100% satisfaction backed by our elite standards</div>
														</div>
													</div>
												</div>

												{/* Right Stats */}
												<div className="grid grid-cols-2 gap-4 lg:gap-6">
													<div className="p-4 text-center rounded-xl border backdrop-blur-sm bg-white/10 border-white/20 lg:p-6">
														<div className="text-2xl font-bold text-white lg:text-3xl">0.0008%</div>
														<div className="text-sm text-white/80">Acceptance Rate</div>
														<div className="mt-1 text-xs text-emerald-200">Rarer than Harvard</div>
													</div>
													<div className="p-4 text-center rounded-xl border backdrop-blur-sm bg-white/10 border-white/20 lg:p-6">
														<div className="text-2xl font-bold text-white lg:text-3xl">6-9</div>
														<div className="text-sm text-white/80">Month Process</div>
														<div className="mt-1 text-xs text-cyan-200">Rigorous vetting</div>
													</div>
													<div className="p-4 text-center rounded-xl border backdrop-blur-sm bg-white/10 border-white/20 lg:p-6">
														<div className="text-2xl font-bold text-white lg:text-3xl">400+</div>
														<div className="text-sm text-white/80">Customer Interviews</div>
														<div className="mt-1 text-xs text-teal-200">Independent verification</div>
													</div>
													<div className="p-4 text-center rounded-xl border backdrop-blur-sm bg-white/10 border-white/20 lg:p-6">
														<div className="text-2xl font-bold text-white lg:text-3xl">100%</div>
														<div className="text-sm text-white/80">Satisfaction</div>
														<div className="mt-1 text-xs text-yellow-200">Performance guarantee</div>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Key Benefits Grid */}
									<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
										<div className="p-6 rounded-xl border bg-card border-border sm:p-8">
											<div className="flex items-start space-x-4">
												<div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-emerald-100 rounded-full dark:bg-emerald-900/30">
													<CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
												</div>
												<div className="space-y-3">
													<h3 className="text-lg font-semibold text-foreground">What This Means for You</h3>
													<div className="space-y-2">
														{["Guaranteed highest quality workmanship", "Verified financial stability and licensing", "Independently confirmed customer satisfaction", "Ongoing performance monitoring", "Comprehensive performance guarantee", "Priority dispute resolution services"].map((benefit, index) => (
															<div key={index} className="flex items-start space-x-2">
																<CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4 text-emerald-500 dark:text-emerald-400" />
																<span className="text-sm text-muted-foreground">{benefit}</span>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>

										<div className="p-6 rounded-xl border bg-card border-border sm:p-8">
											<div className="flex items-start space-x-4">
												<div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900/30">
													<Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
												</div>
												<div className="space-y-3">
													<h3 className="text-lg font-semibold text-foreground">The Elite Vetting Process</h3>
													<div className="space-y-2">
														{["Comprehensive 400+ customer interviews", "Independent financial stability assessment", "Rigorous background and licensing verification", "Technical expertise evaluation", "On-site inspection and equipment review", "Ongoing annual re-certification requirements"].map((requirement, index) => (
															<div key={index} className="flex items-start space-x-2">
																<div className="flex flex-shrink-0 justify-center items-center mt-0.5 w-4 h-4 rounded-full bg-blue-500/20 dark:bg-blue-400/20">
																	<div className="w-2 h-2 bg-blue-500 rounded-full dark:bg-blue-400"></div>
																</div>
																<span className="text-sm text-muted-foreground">{requirement}</span>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* 3. REVIEWS & NEIGHBORHOOD INSIGHTS SECTION - Social Proof */}
							<section ref={reviewsRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8 sm:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Star className="mr-3 w-6 h-6 sm:w-8 sm:h-8 sm:mr-4 text-primary" />
										Reviews & Neighborhood Insights
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full sm:w-24 sm:h-1.5 from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Modern Review Overview */}
									<div className="overflow-hidden relative bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl border dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-red-950/20 border-yellow-200/50 dark:border-yellow-800/50">
										<div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-400/5"></div>
										<div className="relative p-6 sm:p-8">
											<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
												{/* Left: Main Rating */}
												<div className="text-center lg:text-left">
													<div className="flex gap-4 justify-center items-center lg:justify-start">
														<div className="text-4xl font-bold text-foreground sm:text-5xl">{business.rating}</div>
														<div className="space-y-2">
															<div className="flex items-center space-x-1">
																{[...Array(5)].map((_, i) => (
																	<Star key={i} className={`w-5 h-5 ${i < Math.floor(business.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
																))}
															</div>
															<div className="text-sm text-muted-foreground">{business.reviewCount} reviews</div>
														</div>
													</div>
													<div className="mt-4 lg:mt-6">
														<h3 className="mb-2 text-lg font-semibold text-foreground">Community Trust</h3>
														<div className="flex gap-3 justify-center items-center lg:justify-start">
															<div className="flex gap-2 items-center px-3 py-1 bg-orange-100 rounded-full dark:bg-orange-900/30">
																<Home className="w-4 h-4 text-orange-600 dark:text-orange-400" />
																<span className="text-sm font-medium text-orange-800 dark:text-orange-200">{business.peerRecommendations.length} Neighbors</span>
															</div>
															<div className="flex gap-2 items-center px-3 py-1 bg-green-100 rounded-full dark:bg-green-900/30">
																<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
																<span className="text-sm font-medium text-green-800 dark:text-green-200">{business.responseRate}% Response</span>
															</div>
														</div>
													</div>
												</div>

												{/* Right: Quick Stats */}
												<div className="grid grid-cols-2 gap-4">
													<div className="p-4 rounded-xl border backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-white/20">
														<div className="text-2xl font-bold text-primary">{business.trustScore}%</div>
														<div className="text-sm text-muted-foreground">Trust Score</div>
													</div>
													<div className="p-4 rounded-xl border backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-white/20">
														<div className="text-2xl font-bold text-emerald-600">{business.peerRecommendations.length}</div>
														<div className="text-sm text-muted-foreground">Local Reviews</div>
													</div>
													<div className="p-4 rounded-xl border backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-white/20">
														<div className="text-2xl font-bold text-blue-600">24h</div>
														<div className="text-sm text-muted-foreground">Avg Response</div>
													</div>
													<div className="p-4 rounded-xl border backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-white/20">
														<div className="text-2xl font-bold text-purple-600">98%</div>
														<div className="text-sm text-muted-foreground">Satisfaction</div>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Community Reviews - Better Spacing */}
									<div className="space-y-6">
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-semibold text-foreground">Community Reviews</h3>
											<div className="flex gap-2">
												<Button variant="outline" size="sm">
													Neighbors
												</Button>
												<Button variant="outline" size="sm">
													All
												</Button>
												<Button variant="outline" size="sm">
													Recent
												</Button>
											</div>
										</div>

										{/* Neighbor Reviews */}
										<div className="space-y-4">
											<div className="flex gap-2 items-center">
												<Home className="w-5 h-5 text-orange-500" />
												<span className="font-medium text-foreground">Your Neighbors</span>
												<Badge variant="secondary">Verified</Badge>
											</div>

											{business.peerRecommendations.map((neighbor, index) => (
												<div key={index} className="p-4 rounded-lg border bg-card border-border">
													<div className="flex gap-4 items-start">
														<Avatar className="w-10 h-10">
															<AvatarImage src={`https://i.pravatar.cc/150?img=${index + 10}`} />
															<AvatarFallback>{neighbor.recommenderName.charAt(0)}</AvatarFallback>
														</Avatar>
														<div className="flex-1 space-y-2 min-w-0">
															<div className="flex gap-2 items-center">
																<span className="font-medium text-foreground">{neighbor.recommenderName}</span>
																<span className="text-muted-foreground">•</span>
																<span className="text-sm text-muted-foreground">{neighbor.date}</span>
																<div className="flex items-center ml-2">
																	{[...Array(5)].map((_, i) => (
																		<Star key={i} className={`w-4 h-4 ${i < neighbor.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
																	))}
																</div>
															</div>
															<p className="text-foreground">&ldquo;{neighbor.comment}&rdquo;</p>
															<div className="text-sm text-muted-foreground">{neighbor.serviceUsed}</div>
														</div>
													</div>
												</div>
											))}
										</div>

										{/* All Reviews */}
										<div className="space-y-4">
											<div className="flex gap-2 items-center">
												<Star className="w-5 h-5 text-primary" />
												<span className="font-medium text-foreground">All Customer Reviews</span>
											</div>

											{business.reviews.map((review) => (
												<div key={review.id} className="p-4 rounded-lg border bg-card border-border">
													<div className="flex gap-4 items-start">
														<Avatar className="w-10 h-10">
															<AvatarImage src={review.avatar} />
															<AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
														</Avatar>
														<div className="flex-1 space-y-2 min-w-0">
															<div className="flex gap-2 items-center">
																<span className="font-medium text-foreground">{review.author}</span>
																{review.verified && <Badge variant="secondary">Verified</Badge>}
																<span className="text-muted-foreground">•</span>
																<span className="text-sm text-muted-foreground">{review.date}</span>
																<div className="flex items-center ml-2">
																	{[...Array(5)].map((_, i) => (
																		<Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
																	))}
																</div>
															</div>
															<p className="text-foreground">{review.text}</p>
															<div className="flex gap-4 items-center text-sm text-muted-foreground">
																<button className="hover:text-foreground">Helpful ({review.helpful})</button>
																<button className="hover:text-foreground">Reply</button>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>

										{/* Write Review */}
										<div className="flex gap-3">
											<Button onClick={() => setShowReviewModal(true)} className="flex-1">
												Write Review
											</Button>
											<Button variant="outline" className="flex-1">
												Verify as Neighbor
											</Button>
										</div>
									</div>
								</div>
							</section>

							{/* 4. CREDENTIALS, LICENSING & RECOGNITION SECTION - Trust Building */}
							<section ref={credentialsRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-6 sm:mb-8 md:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Shield className="mr-3 w-6 h-6 sm:w-8 sm:h-8 sm:mr-4 text-primary" />
										Credentials, Licensing & Recognition
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full sm:w-24 sm:h-1.5 from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Verified License */}
									{business.license.verified && (
										<div className="space-y-4">
											<h3 className="text-lg font-semibold text-foreground">Certifications & Licenses</h3>
											<div className="p-6 rounded-xl border bg-card/30 border-border">
												<div className="flex items-start space-x-3">
													<div className="flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-full bg-blue-500/10">
														<Shield className="w-4 h-4 text-blue-400" />
													</div>
													<div className="space-y-2">
														<h4 className="flex items-center font-semibold text-foreground">
															Professional License
															<Badge variant="secondary" className="ml-2 text-blue-400 bg-blue-500/10 border-blue-500/20">
																<Verified className="mr-1 w-3 h-3" />
																Verified
															</Badge>
														</h4>
														<div className="space-y-1 text-sm">
															<p className="text-muted-foreground">
																License: <span className="text-foreground">{business.license.number}</span>
															</p>
															<p className="text-muted-foreground">
																Issuer: <span className="text-foreground">State Licensing Board</span>
															</p>
															<p className="text-muted-foreground">
																Expires: <span className="text-foreground">{business.license.expires}</span>
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									)}

									{/* Awards & Recognition */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Awards & Recognition</h3>
										<div className="space-y-3">
											{business.awards && business.awards.length > 0 ? (
												business.awards.map((award, index) => (
													<div key={index} className="flex items-center p-4 space-x-3 rounded-xl border bg-card/30 border-border">
														<div className="p-2 rounded-full bg-yellow-500/10">
															<Award className="w-4 h-4 text-yellow-500" />
														</div>
														<div>
															<h5 className="font-medium text-foreground">{award.title}</h5>
															<p className="text-sm text-muted-foreground">
																{award.issuer} • {award.year}
															</p>
														</div>
													</div>
												))
											) : (
												<div className="flex items-center p-4 space-x-3 rounded-xl border bg-card/30 border-border">
													<div className="p-2 rounded-full bg-yellow-500/10">
														<Award className="w-4 h-4 text-yellow-500" />
													</div>
													<div>
														<h5 className="font-medium text-foreground">Verified Business</h5>
														<p className="text-sm text-muted-foreground">Thorbis • 2024</p>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							</section>

							{/* 4. ⚡ LIVE AVAILABILITY & BOOKING SECTION - Immediate Action */}
							<section ref={availabilityRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Zap className="mr-3 w-6 h-6 text-primary" />
										Live Availability & Booking
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full from-primary to-primary/50"></div>
								</div>

								<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
									{/* Left Panel - Business Info & Status */}
									<div className="lg:col-span-1">
										<div className="p-6 space-y-6 rounded-xl border bg-card border-border">
											{/* Business Avatar & Info */}
											<div className="flex gap-4 items-center">
												<div className="overflow-hidden w-16 h-16 bg-blue-600 rounded-lg">
													<div className="flex justify-center items-center w-full h-full text-xl font-bold text-white">
														{business?.name
															? business.name
																	.split(" ")
																	.map((word) => word[0])
																	.join("")
																	.slice(0, 2)
															: "AC"}
													</div>
												</div>
												<div>
													<h3 className="font-semibold text-foreground">{business.name}</h3>
													<p className="text-sm text-muted-foreground">Client Check-in</p>
												</div>
											</div>

											{/* Service Details */}
											<div className="space-y-3">
												<div className="flex gap-2 items-center">
													<Clock className="w-4 h-4 text-muted-foreground" />
													<span className="text-sm text-muted-foreground">30 min</span>
												</div>
												<div className="flex gap-2 items-center">
													<Video className="w-4 h-4 text-muted-foreground" />
													<span className="text-sm text-muted-foreground">Zoom</span>
												</div>
											</div>

											{/* Live Status */}
											<div className="p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
												<div className="flex gap-2 items-center">
													<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
													<span className="text-sm font-medium text-green-700 dark:text-green-400">LIVE - Available Now</span>
												</div>
												<p className="mt-1 text-xs text-green-600 dark:text-green-500">45 minutes response time</p>
											</div>

											{/* Emergency Service */}
											<div className="p-4 bg-red-50 rounded-lg dark:bg-red-900/20">
												<h4 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">Emergency Service</h4>
												<p className="mb-3 text-xs text-red-600 dark:text-red-500">24/7 immediate response</p>
												<Button size="sm" className="w-full text-white bg-red-600 hover:bg-red-700">
													<Phone className="mr-2 w-3 h-3" />
													Call Emergency: {business?.phone?.replace(/[()]/g, "") || "(706) 555-0123"}
												</Button>
											</div>
										</div>
									</div>

									{/* Center Panel - Calendar & Time Selection */}
									<div className="lg:col-span-2">
										<div className="p-6 rounded-xl border bg-card border-border">
											{/* Calendar Header */}
											<div className="flex justify-between items-center mb-6">
												<h3 className="text-lg font-semibold text-foreground">Select a Date & Time</h3>
												<div className="flex gap-2 items-center">
													<button className="p-2 rounded-lg hover:bg-muted">
														<ChevronLeft className="w-4 h-4 text-muted-foreground" />
													</button>
													<span className="px-3 py-1 text-sm font-medium text-foreground">July 2024</span>
													<button className="p-2 rounded-lg hover:bg-muted">
														<ChevronRight className="w-4 h-4 text-muted-foreground" />
													</button>
												</div>
											</div>

											<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
												{/* Calendar */}
												<div>
													<div className="grid grid-cols-7 gap-1 mb-4">
														{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
															<div key={day} className="p-2 text-xs font-medium text-center text-muted-foreground">
																{day}
															</div>
														))}
													</div>
													<div className="grid grid-cols-7 gap-1">
														{[30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3].map((date, index) => (
															<button
																key={index}
																className={`
																	p-2 text-sm font-medium rounded-lg transition-all text-center
																	${date === 22 ? "bg-blue-600 text-white" : date > 30 ? "text-muted-foreground/50 hover:bg-muted/50" : "text-foreground hover:bg-muted"}
																	${[16, 17, 19, 23, 24, 25].includes(date) && date <= 30 ? "text-blue-600 font-semibold" : ""}
																`}
															>
																{date}
															</button>
														))}
													</div>

													{/* Time Zone */}
													<div className="pt-4 mt-4 border-t border-border">
														<div className="flex gap-2 items-center">
															<Globe className="w-4 h-4 text-muted-foreground" />
															<span className="text-sm text-muted-foreground">Eastern time - US & Canada</span>
														</div>
													</div>
												</div>

												{/* Time Slots */}
												<div>
													<div className="mb-4">
														<h4 className="text-sm font-semibold text-foreground">Monday, July 22</h4>
													</div>
													<div className="space-y-3">
														{["10:00am", "1:00pm", "2:30pm", "4:00pm"].map((time, index) => (
															<button
																key={time}
																className={`
																	w-full p-3 text-left rounded-lg border-2 transition-all
																	${index === 0 ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : "border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"}
																`}
															>
																<div className="text-sm font-medium text-foreground">{time}</div>
															</button>
														))}

														{/* Available Slot with Special Styling */}
														<div className="relative">
															<button className="p-3 w-full text-left bg-blue-50 rounded-lg border-2 border-blue-600 transition-all dark:bg-blue-900/20">
																<div className="text-sm font-medium text-blue-700 dark:text-blue-300">11:00am</div>
															</button>
															<Button size="sm" className="absolute top-2 right-2 h-7 text-xs text-white bg-blue-600 hover:bg-blue-700">
																Confirm
															</Button>
														</div>
													</div>

													{/* Video Consultation */}
													<div className="p-4 mt-6 rounded-lg bg-muted/50">
														<div className="flex justify-between items-center mb-2">
															<h4 className="text-sm font-semibold text-foreground">Video Consultation</h4>
															<Badge variant="outline" className="text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800">
																HD Quality
															</Badge>
														</div>
														<div className="grid grid-cols-2 gap-3 mb-3">
															<div>
																<p className="text-xs text-muted-foreground">Price</p>
																<p className="font-semibold text-foreground">{business?.videoConsultation?.pricePerSession || "$25"}</p>
															</div>
															<div>
																<p className="text-xs text-muted-foreground">Duration</p>
																<p className="font-semibold text-foreground">{business?.videoConsultation?.duration || "30 minutes"}</p>
															</div>
														</div>
														<Button size="sm" className="w-full text-white bg-blue-600 hover:bg-blue-700">
															<Video className="mr-2 w-3 h-3" />
															Schedule Video Call
														</Button>

														{/* What's Included */}
														<div className="pt-3 mt-3 border-t border-border">
															<p className="mb-2 text-xs font-medium text-foreground">What&apos;s Included</p>
															<div className="space-y-1">
																{(business?.videoConsultation?.specialties || ["Initial Assessment", "Quote Estimation", "Problem Diagnosis", "Maintenance Tips"]).slice(0, 4).map((specialty, index) => (
																	<div key={index} className="flex gap-2 items-center">
																		<CheckCircle className="w-3 h-3 text-green-500" />
																		<span className="text-xs text-muted-foreground">{specialty}</span>
																	</div>
																))}
															</div>
															<div className="mt-2">
																<p className="mb-1 text-xs text-muted-foreground">Available Languages:</p>
																<div className="flex gap-1">
																	{(business?.videoConsultation?.languages || ["English", "Spanish"]).map((lang, index) => (
																		<Badge key={index} variant="secondary" className="text-xs">
																			{lang}
																		</Badge>
																	))}
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* 5. SERVICES & WORK SHOWCASE SECTION - What They Offer & Proof */}
							<section ref={servicesRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Zap className="mr-3 w-6 h-6 text-primary" />
										Services & Work Showcase
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Services Overview */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Our Services</h3>
										<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
											{business.detailedServices.map((service, index) => (
												<div key={index} className="flex items-start p-3 space-x-3 rounded-lg border bg-card/30 border-border">
													<CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
													<span className="text-sm leading-relaxed break-words text-foreground">{service}</span>
												</div>
											))}
										</div>
									</div>

									{/* Business Updates */}
									{business.businessUpdates.length > 0 && (
										<div className="space-y-4">
											<h3 className="text-lg font-semibold text-foreground">Recent Updates</h3>
											<div className="space-y-4">
												{business.businessUpdates.map((update) => (
													<div key={update.id} className="p-4 rounded-xl border bg-card/30 border-border">
														<div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
															<img src={update.image} alt={update.title} className="object-cover w-full h-32 rounded-lg sm:w-16 sm:h-16 sm:flex-shrink-0" />
															<div className="flex-1 space-y-1 min-w-0">
																<h4 className="font-medium leading-snug break-words text-foreground">{update.title}</h4>
																<p className="text-sm leading-relaxed break-words text-muted-foreground">{update.content}</p>
																<p className="text-xs text-muted-foreground">{update.date}</p>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Community Involvement */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Community Involvement</h3>
										<div className="space-y-2">
											{business.communityInvolvement.map((involvement, index) => (
												<div key={index} className="flex items-center space-x-2">
													<Heart className="flex-shrink-0 w-4 h-4 text-red-400" />
													<span className="text-sm text-foreground">{involvement.activity}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</section>

							{/* 6. EXPERTISE & PROFESSIONAL DETAILS SECTION - Deep Dive Capabilities */}
							<section ref={expertiseRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Target className="mr-3 w-6 h-6 text-primary" />
										Expertise & Professional Details
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Specializations */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Our Specializations</h3>
										<div className="flex flex-wrap gap-2">
											{business.specializations.map((spec, index) => (
												<Badge key={index} variant="outline" className="border-primary/20 text-primary bg-primary/5">
													{spec}
												</Badge>
											))}
										</div>
									</div>

									{/* Professional Equipment */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Professional Equipment</h3>
										<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
											{business.equipment.map((item, index) => (
												<div key={index} className="flex items-center space-x-2">
													<div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
													<span className="text-sm text-foreground">{item}</span>
												</div>
											))}
										</div>
									</div>

									{/* Trusted Brands */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Trusted Brands We Work With</h3>
										<div className="flex flex-wrap gap-2">
											{business.brands.map((brand, index) => (
												<Badge key={index} variant="secondary" className="bg-muted text-foreground">
													{brand}
												</Badge>
											))}
										</div>
									</div>

									{/* Professional Team */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Meet Our Team</h3>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
											{business.team.map((member, index) => (
												<div key={index} className="p-4 rounded-lg border bg-card/30 border-border">
													<div className="space-y-3 text-center">
														<Avatar className="mx-auto w-16 h-16">
															<AvatarImage src={member.photo} />
															<AvatarFallback className="text-lg bg-primary/10 text-primary">
																{member.name
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</AvatarFallback>
														</Avatar>
														<div className="space-y-1">
															<h5 className="font-medium leading-snug break-words text-foreground">{member.name}</h5>
															<p className="text-sm leading-relaxed break-words text-muted-foreground">{member.title}</p>
															<p className="text-xs text-muted-foreground">{member.experience}</p>
														</div>
														<div className="flex flex-wrap gap-1 justify-center">
															{member.specialties.map((specialty, idx) => (
																<Badge key={idx} variant="secondary" className="text-xs bg-primary/10 text-primary">
																	<span className="break-words">{specialty}</span>
																</Badge>
															))}
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</section>

							{/* 7. PRICING & SERVICE INFORMATION SECTION - Flexible for Different Industries */}
							<section ref={pricingRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<DollarSign className="mr-3 w-6 h-6 text-primary" />
										Service Information & Policies
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Service Approach & Pricing Philosophy */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Service Approach & Pricing</h3>
										<div className="p-6 rounded-lg border bg-card/30 border-border">
											<div className="space-y-6">
												{/* Pricing Philosophy */}
												<div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
													<div className="flex items-start space-x-3">
														<Calculator className="flex-shrink-0 mt-1 w-5 h-5 text-primary" />
														<div>
															<h4 className="font-medium text-foreground">{business.pricing?.approach || "Custom Service Pricing"}</h4>
															<p className="mt-1 text-sm text-muted-foreground">{business.pricing?.description || "Each project is unique. Contact us for a personalized quote based on your specific needs and requirements."}</p>
														</div>
													</div>
												</div>

												{/* Service Rates */}
												{business.pricing?.hourlyRate && (
													<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
														<div className="p-4 rounded-lg border bg-card/20 border-border">
															<div className="text-center">
																<p className="text-sm text-muted-foreground">Standard Rate</p>
																<p className="text-lg font-bold text-foreground">{business.pricing.hourlyRate}</p>
															</div>
														</div>
														{business.pricing?.emergencyRate && (
															<div className="p-4 rounded-lg border bg-red-50/50 border-red-200/50 dark:bg-red-950/20 dark:border-red-900/30">
																<div className="text-center">
																	<p className="text-sm text-red-600 dark:text-red-400">Emergency Rate</p>
																	<p className="text-lg font-bold text-red-700 dark:text-red-300">{business.pricing.emergencyRate}</p>
																</div>
															</div>
														)}
														{business.pricing?.minimumCharge && (
															<div className="p-4 rounded-lg border bg-card/20 border-border">
																<div className="text-center">
																	<p className="text-sm text-muted-foreground">Minimum Charge</p>
																	<p className="text-lg font-bold text-foreground">{business.pricing.minimumCharge}</p>
																</div>
															</div>
														)}
													</div>
												)}

												{/* Free Services */}
												{business.pricing?.freeServices && business.pricing.freeServices.length > 0 ? (
													<div>
														<h5 className="mb-3 font-medium text-foreground">Complimentary Services</h5>
														<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
															{business.pricing.freeServices.map((service, index) => (
																<div key={index} className="flex items-start p-3 space-x-3 rounded-lg border bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-900/30">
																	<CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4 text-green-500" />
																	<div>
																		<p className="text-sm font-medium text-foreground">{service.service}</p>
																		<p className="text-xs text-muted-foreground">{service.description}</p>
																	</div>
																</div>
															))}
														</div>
													</div>
												) : (
													<div>
														<h5 className="mb-3 font-medium text-foreground">Complimentary Services</h5>
														<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
															<div className="flex items-start p-3 space-x-3 rounded-lg border bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-900/30">
																<CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4 text-green-500" />
																<div>
																	<p className="text-sm font-medium text-foreground">Initial Consultation</p>
																	<p className="text-xs text-muted-foreground">No-obligation assessment</p>
																</div>
															</div>
															<div className="flex items-start p-3 space-x-3 rounded-lg border bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-900/30">
																<CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4 text-green-500" />
																<div>
																	<p className="text-sm font-medium text-foreground">Written Estimates</p>
																	<p className="text-xs text-muted-foreground">Detailed project quotes</p>
																</div>
															</div>
															<div className="flex items-start p-3 space-x-3 rounded-lg border bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-900/30">
																<CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4 text-green-500" />
																<div>
																	<p className="text-sm font-medium text-foreground">Basic Diagnostics</p>
																	<p className="text-xs text-muted-foreground">Problem identification</p>
																</div>
															</div>
															<div className="flex items-start p-3 space-x-3 rounded-lg border bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-900/30">
																<CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4 text-green-500" />
																<div>
																	<p className="text-sm font-medium text-foreground">Follow-up Inspection</p>
																	<p className="text-xs text-muted-foreground">30-day post-service check</p>
																</div>
															</div>
														</div>
													</div>
												)}

												{/* Available Discounts */}
												{business.pricing?.discounts && business.pricing.discounts.length > 0 ? (
													<div>
														<h5 className="mb-3 font-medium text-foreground">Available Discounts</h5>
														<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
															{business.pricing.discounts.map((discount, index) => (
																<div key={index} className="flex items-center p-3 space-x-3 rounded-lg border bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-900/30">
																	<Badge variant="secondary" className="text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50">
																		{discount.amount}
																	</Badge>
																	<div className="flex-1">
																		<p className="text-sm font-medium text-foreground">{discount.type}</p>
																		<p className="text-xs text-muted-foreground">{discount.description}</p>
																	</div>
																</div>
															))}
														</div>
													</div>
												) : (
													<div>
														<h5 className="mb-3 font-medium text-foreground">Available Discounts</h5>
														<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
															<div className="flex items-center p-3 space-x-3 rounded-lg border bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-900/30">
																<Badge variant="secondary" className="text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50">
																	10%
																</Badge>
																<div className="flex-1">
																	<p className="text-sm font-medium text-foreground">Senior Discount</p>
																	<p className="text-xs text-muted-foreground">For customers 65+ years old</p>
																</div>
															</div>
															<div className="flex items-center p-3 space-x-3 rounded-lg border bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-900/30">
																<Badge variant="secondary" className="text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50">
																	15%
																</Badge>
																<div className="flex-1">
																	<p className="text-sm font-medium text-foreground">Military Discount</p>
																	<p className="text-xs text-muted-foreground">Active duty and veterans</p>
																</div>
															</div>
															<div className="flex items-center p-3 space-x-3 rounded-lg border bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-900/30">
																<Badge variant="secondary" className="text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50">
																	5%
																</Badge>
																<div className="flex-1">
																	<p className="text-sm font-medium text-foreground">First-Time Customer</p>
																	<p className="text-xs text-muted-foreground">New customers only</p>
																</div>
															</div>
															<div className="flex items-center p-3 space-x-3 rounded-lg border bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-900/30">
																<Badge variant="secondary" className="text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50">
																	10%
																</Badge>
																<div className="flex-1">
																	<p className="text-sm font-medium text-foreground">Repeat Customer</p>
																	<p className="text-xs text-muted-foreground">Return customers</p>
																</div>
															</div>
														</div>
													</div>
												)}

												{/* Payment Terms */}
												{business.pricing?.paymentTerms && (
													<div className="p-4 rounded-lg border bg-yellow-50/50 border-yellow-200/50 dark:bg-yellow-950/20 dark:border-yellow-900/30">
														<h5 className="mb-2 font-medium text-foreground">Payment Terms</h5>
														<div className="space-y-1 text-sm text-muted-foreground">
															<p>• {business.pricing.paymentTerms.deposit}</p>
															<p>• {business.pricing.paymentTerms.completion}</p>
															<p>• {business.pricing.paymentTerms.largejobs}</p>
														</div>
													</div>
												)}

												{/* Financing Options */}
												{business.pricing?.financing?.available && (
													<div className="p-4 rounded-lg border bg-purple-50/50 border-purple-200/50 dark:bg-purple-950/20 dark:border-purple-900/30">
														<div className="flex items-start space-x-3">
															<CreditCard className="flex-shrink-0 mt-1 w-5 h-5 text-purple-600" />
															<div>
																<h5 className="font-medium text-foreground">Financing Available</h5>
																<div className="mt-2 space-y-1 text-sm text-muted-foreground">
																	<p>• Provider: {business.pricing.financing.provider}</p>
																	<p>• Minimum Amount: {business.pricing.financing.minAmount}</p>
																	<p>• Terms: {business.pricing.financing.terms}</p>
																	<p className="text-xs italic">• {business.pricing.financing.approval}</p>
																</div>
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>

									{/* Payment Methods */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Accepted Payment Methods</h3>
										<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
											{business.paymentMethods && business.paymentMethods.length > 0
												? business.paymentMethods.map((method, index) => (
														<div key={index} className="flex items-start p-4 space-x-3 rounded-lg border bg-card/30 border-border">
															<CreditCard className="flex-shrink-0 mt-1 w-5 h-5 text-primary" />
															<div className="flex-1">
																<p className="font-medium text-foreground">{method.name}</p>
																<p className="text-xs text-muted-foreground">{method.details}</p>
															</div>
															{method.accepted && <CheckCircle className="flex-shrink-0 w-4 h-4 text-green-500" />}
														</div>
												  ))
												: [
														{ name: "Cash", details: "Exact change appreciated" },
														{ name: "Check", details: "Personal and business checks" },
														{ name: "Credit Cards", details: "Visa, MasterCard, American Express" },
														{ name: "Debit Cards", details: "PIN or signature" },
														{ name: "Digital Payments", details: "Apple Pay, Google Pay, Zelle" },
														{ name: "Financing", details: "Through approved financing partners" },
												  ].map((method, index) => (
														<div key={index} className="flex items-start p-4 space-x-3 rounded-lg border bg-card/30 border-border">
															<CreditCard className="flex-shrink-0 mt-1 w-5 h-5 text-primary" />
															<div className="flex-1">
																<p className="font-medium text-foreground">{method.name}</p>
																<p className="text-xs text-muted-foreground">{method.details}</p>
															</div>
															<CheckCircle className="flex-shrink-0 w-4 h-4 text-green-500" />
														</div>
												  ))}
										</div>
									</div>

									{/* Service Guarantees */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Service Guarantees & Warranties</h3>
										<div className="space-y-3">
											{business.guarantees && business.guarantees.length > 0
												? business.guarantees.map((guarantee, index) => (
														<div key={index} className="p-4 rounded-lg border bg-card/30 border-border">
															<div className="flex items-start space-x-3">
																<Award className="flex-shrink-0 mt-1 w-5 h-5 text-green-500" />
																<div className="flex-1">
																	<div className="flex justify-between items-center">
																		<h5 className="font-medium text-foreground">{guarantee.title}</h5>
																		<Badge variant="outline" className="text-xs text-green-700 bg-green-50 border-green-200 dark:border-green-800 dark:text-green-300 dark:bg-green-950/50">
																			{guarantee.period}
																		</Badge>
																	</div>
																	<p className="mt-1 text-sm text-muted-foreground">{guarantee.description}</p>
																</div>
															</div>
														</div>
												  ))
												: [
														{ title: "100% Satisfaction Guarantee", description: "We stand behind our work with a complete satisfaction guarantee", period: "Service completion" },
														{ title: "Workmanship Warranty", description: "All work guaranteed against defects for specified period", period: "1-2 years" },
														{ title: "Licensed Professionals", description: "All staff properly licensed and background checked", period: "Ongoing" },
														{ title: "Quality Materials", description: "We use only high-grade, manufacturer-approved materials", period: "Manufacturer warranty" },
														{ title: "Timely Completion", description: "Projects completed within agreed timeframe or compensation provided", period: "Project duration" },
														{ title: "Clean Work Areas", description: "We maintain clean and safe work environments", period: "During service" },
												  ].map((guarantee, index) => (
														<div key={index} className="p-4 rounded-lg border bg-card/30 border-border">
															<div className="flex items-start space-x-3">
																<Award className="flex-shrink-0 mt-1 w-5 h-5 text-green-500" />
																<div className="flex-1">
																	<div className="flex justify-between items-center">
																		<h5 className="font-medium text-foreground">{guarantee.title}</h5>
																		<Badge variant="outline" className="text-xs text-green-700 bg-green-50 border-green-200 dark:border-green-800 dark:text-green-300 dark:bg-green-950/50">
																			{guarantee.period}
																		</Badge>
																	</div>
																	<p className="mt-1 text-sm text-muted-foreground">{guarantee.description}</p>
																</div>
															</div>
														</div>
												  ))}
										</div>
									</div>

									{/* Insurance & Coverage Details */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Insurance & Coverage</h3>
										<div className="p-6 rounded-lg border bg-card/30 border-border">
											{/* Primary Coverage */}
											<div className="space-y-4">
												<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
													<div className="space-y-3">
														<div className="flex justify-between items-center">
															<span className="text-muted-foreground">General Liability</span>
															<span className="font-bold text-foreground">{business.insurance?.generalLiability || business.insurance?.liability || "$2,000,000"}</span>
														</div>
														<div className="flex justify-between items-center">
															<span className="text-muted-foreground">Workers&apos; Compensation</span>
															<span className="font-medium text-foreground">{business.insurance?.workersComp || "Full Coverage"}</span>
														</div>
														<div className="flex justify-between items-center">
															<span className="text-muted-foreground">Bonded Amount</span>
															<span className="font-medium text-foreground">{business.insurance?.bonded || business.insurance?.bonding || "$50,000"}</span>
														</div>
													</div>
													<div className="space-y-3">
														<div className="flex justify-between items-center">
															<span className="text-muted-foreground">Insurance Carrier</span>
															<span className="font-medium text-foreground">{business.insurance?.carrier || business.insurance?.provider || "Commercial Insurance Group"}</span>
														</div>
														<div className="flex justify-between items-center">
															<span className="text-muted-foreground">Policy Expires</span>
															<span className="font-medium text-foreground">{business.insurance?.expires || "December 31, 2025"}</span>
														</div>
														{(business.insurance?.policyNumber || "POL-12345") && (
															<div className="flex justify-between items-center">
																<span className="text-muted-foreground">Policy Number</span>
																<span className="font-mono text-xs text-foreground">{business.insurance?.policyNumber || "POL-12345"}</span>
															</div>
														)}
													</div>
												</div>

												{/* Additional Coverage */}
												{business.insurance?.additionalCoverage && business.insurance.additionalCoverage.length > 0 && (
													<div className="pt-4 border-t border-border">
														<h5 className="mb-3 font-medium text-foreground">Additional Coverage</h5>
														<div className="grid grid-cols-1 gap-2 md:grid-cols-3">
															{business.insurance.additionalCoverage.map((coverage, index) => (
																<div key={index} className="flex justify-between items-center p-3 rounded-lg border bg-card/50 border-border">
																	<span className="text-sm text-muted-foreground">{coverage.type}</span>
																	<span className="text-sm font-medium text-foreground">{coverage.amount}</span>
																</div>
															))}
														</div>
													</div>
												)}

												{/* Insurance Verification */}
												<div className="pt-4 border-t border-border">
													<div className="flex items-center space-x-2">
														{business.insurance?.verified ? (
															<>
																<Verified className="w-5 h-5 text-green-500" />
																<span className="text-sm font-medium text-green-600">Insurance Verified</span>
															</>
														) : (
															<>
																<Clock className="w-5 h-5 text-yellow-500" />
																<span className="text-sm font-medium text-yellow-600">Verification Pending</span>
															</>
														)}
														{business.insurance?.certificationAvailable && (
															<Badge variant="outline" className="ml-auto text-xs">
																Certificate Available Upon Request
															</Badge>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* 8. 👁️ BUSINESS OPERATIONS SECTION - Transparency */}
							<section ref={businessTransparencyRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Eye className="mr-3 w-6 h-6 text-primary" />
										👁️ Business Operations
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Educational Introduction */}
									<div className="p-6 bg-gradient-to-r rounded-xl border from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50">
										<div className="space-y-4">
											<h3 className="text-lg font-semibold text-foreground">Understanding Professional Service Costs</h3>
											<p className="text-sm leading-relaxed text-muted-foreground">We believe in transparency. Quality service businesses invest in many areas that customers don&apos;t always see. Here&apos;s an educational look at what goes into delivering professional, reliable service.</p>
										</div>
									</div>

									{/* Operational Areas */}
									<div className="space-y-6">
										<h3 className="text-lg font-semibold text-foreground">Key Investment Areas</h3>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											{business.businessTransparency.operationalAreas.map((area, index) => (
												<div key={index} className="p-4 rounded-lg border bg-card/30 border-border">
													<div className="flex justify-between items-start mb-3">
														<h4 className="font-medium text-foreground">{area.category}</h4>
														<Badge variant="outline" className={`text-xs ${area.importance === "Critical" ? "border-red-200 text-red-600 bg-red-50" : area.importance === "High" ? "border-orange-200 text-orange-600 bg-orange-50" : "border-blue-200 text-blue-600 bg-blue-50"}`}>
															{area.importance}
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground">{area.description}</p>
												</div>
											))}
										</div>
									</div>

									{/* Why Quality Matters */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Why Quality Service Matters</h3>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											{business.businessTransparency.whyQualityMatters.map((factor, index) => (
												<div key={index} className="p-4 rounded-lg border bg-card/30 border-border">
													<div className="space-y-2">
														<h4 className="font-medium text-foreground">{factor.factor}</h4>
														<p className="text-sm text-muted-foreground">{factor.impact}</p>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Industry Insights */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Industry Insights</h3>
										<div className="p-6 rounded-xl border bg-green-50/50 dark:bg-green-950/20 border-green-200/50">
											<div className="space-y-6">
												<div>
													<h4 className="mb-3 font-medium text-foreground">Professional Service Standards</h4>
													<p className="text-sm leading-relaxed text-muted-foreground">{business.businessTransparency.industryInsights.commonCosts}</p>
												</div>

												<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
													<div className="space-y-3">
														<h4 className="font-medium text-foreground">Quality Indicators</h4>
														<div className="space-y-2">
															{business.businessTransparency.industryInsights.qualityIndicators.map((indicator, index) => (
																<div key={index} className="flex items-center space-x-2">
																	<CheckCircle className="flex-shrink-0 w-4 h-4 text-green-500" />
																	<span className="text-sm text-foreground">{indicator}</span>
																</div>
															))}
														</div>
													</div>

													<div className="space-y-3">
														<h4 className="font-medium text-foreground">Professional Investments</h4>
														<div className="space-y-2">
															{business.businessTransparency.industryInsights.investmentAreas.map((investment, index) => (
																<div key={index} className="flex items-center space-x-2">
																	<div className="w-2 h-2 rounded-full bg-primary"></div>
																	<span className="text-sm text-foreground">{investment}</span>
																</div>
															))}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* 9. 🛡️ WARRANTY TRACKER SECTION - Long-term Value */}
							<section ref={warrantyTrackerRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Shield className="mr-3 w-6 h-6 text-primary" />
										🛡️ Warranty Tracker
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									<div className="p-6 rounded-xl border bg-card/30 border-border">
										<div className="flex gap-2 items-center mb-4">
											<Badge className="text-purple-600 bg-purple-100">{business.warranties.length} Active</Badge>
											<span className="text-sm font-medium text-purple-600">Live Monitoring</span>
										</div>

										{/* Active Warranties */}
										<div className="space-y-4">
											{business.warranties.map((warranty, index) => (
												<div key={index} className="p-4 rounded-lg border bg-card/30 border-border">
													<div className="flex justify-between items-start mb-3">
														<div>
															<h4 className="font-medium text-foreground">{warranty.service}</h4>
															<p className="text-sm text-muted-foreground">Started: {warranty.startDate}</p>
														</div>
														<Badge variant={warranty.status === "Active" ? "default" : "secondary"} className={warranty.status === "Active" ? "bg-green-500 text-white" : ""}>
															{warranty.status}
														</Badge>
													</div>

													<div className="text-sm">
														<p className="text-muted-foreground">{warranty.coverageDetails}</p>
													</div>
												</div>
											))}
										</div>

										<Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700">
											<FileText className="mr-2 w-4 h-4" />
											File Warranty Claim
										</Button>
									</div>
								</div>
							</section>

							{/* 10. FAQ & SUPPORT SECTION - Address Concerns */}
							<section ref={faqRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<MessageCircle className="mr-3 w-6 h-6 text-primary" />
										FAQ & Support
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Frequently Asked Questions */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h3>
										<div className="space-y-4">
											{business.faq.map((faq, index) => (
												<div key={index} className="p-4 rounded-lg border bg-card/30 border-border">
													<div className="space-y-2">
														<h5 className="font-medium text-foreground">{faq.question}</h5>
														<p className="text-sm text-muted-foreground">{faq.answer}</p>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Q&A Section */}
									{business.qna.length > 0 && (
										<div className="space-y-4">
											<h3 className="text-lg font-semibold text-foreground">Ask the Community</h3>
											<div className="space-y-4">
												{business.qna.map((item) => (
													<div key={item.id} className="p-4 rounded-lg border bg-card/30 border-border">
														<div className="space-y-3">
															<div className="flex items-start space-x-2">
																<MessageCircle className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
																<div className="space-y-1">
																	<p className="font-medium text-foreground">{item.question}</p>
																</div>
															</div>
															<div className="ml-6 space-y-2">
																<p className="text-sm text-muted-foreground">{item.answer}</p>
																<div className="flex justify-between items-center text-xs text-muted-foreground">
																	<span>
																		Answered by {item.author} • {item.date}
																	</span>
																	<button className="flex items-center space-x-1 hover:text-foreground">
																		<ThumbsUp className="w-3 h-3" />
																		<span>Helpful ({item.helpful})</span>
																	</button>
																</div>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</section>

							{/* 11. 💼 CAREERS SECTION - Secondary Interest */}
							<section ref={careersRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Users className="mr-3 w-6 h-6 text-primary" />
										💼 Join Our Team
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Hero Section with Status */}
									<div className="overflow-hidden relative p-8 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl border-2 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-green-200/50 dark:border-green-800/50">
										<div className="absolute top-4 right-4">
											<Badge className={business.careers.isHiring ? "text-white bg-green-500 animate-pulse shadow-lg" : "text-gray-600 bg-gray-100"}>{business.careers.isHiring ? "🔥 Now Hiring" : "Not Currently Hiring"}</Badge>
										</div>

										<div className="relative z-10">
											<div className="flex items-center mb-4 space-x-3">
												<div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
													<Users className="w-6 h-6 text-white" />
												</div>
												<div>
													<h3 className="text-xl font-bold text-foreground">Join {business.name}</h3>
													<p className="text-sm text-muted-foreground">{business.careers.companySize} • Growing Team</p>
												</div>
											</div>
											<p className="mb-6 text-foreground">{business.careers.culture}</p>

											{business.careers.isHiring && (
												<div className="flex gap-3">
													<Button className="text-white bg-gradient-to-r from-green-500 to-blue-500 shadow-lg hover:from-green-600 hover:to-blue-600">
														<Users className="mr-2 w-4 h-4" />
														View Open Positions
													</Button>
													<Button variant="outline" className="border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20">
														<FileText className="mr-2 w-4 h-4" />
														Submit Resume
													</Button>
												</div>
											)}
										</div>
									</div>

									{/* Benefits & Perks Cards */}
									<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
										{/* Benefits */}
										<div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50">
											<div className="flex items-center mb-4 space-x-3">
												<div className="p-2 rounded-lg bg-green-500/10">
													<Heart className="w-5 h-5 text-green-600" />
												</div>
												<h4 className="text-lg font-semibold text-foreground">Benefits & Wellness</h4>
											</div>
											<div className="space-y-3">
												{business.careers.benefits.map((benefit, index) => (
													<div key={index} className="flex items-start p-3 space-x-3 rounded-lg border bg-white/50 dark:bg-white/5 border-green-200/30 dark:border-green-800/30">
														<CheckCircle className="flex-shrink-0 mt-0.5 w-4 h-4 text-green-500" />
														<span className="text-sm font-medium text-foreground">{benefit}</span>
													</div>
												))}
											</div>
										</div>

										{/* Additional Perks */}
										<div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/50">
											<div className="flex items-center mb-4 space-x-3">
												<div className="p-2 rounded-lg bg-blue-500/10">
													<Star className="w-5 h-5 text-blue-600" />
												</div>
												<h4 className="text-lg font-semibold text-foreground">Additional Perks</h4>
											</div>
											<div className="space-y-3">
												{business.careers.perks.map((perk, index) => (
													<div key={index} className="flex items-start p-3 space-x-3 rounded-lg border bg-white/50 dark:bg-white/5 border-blue-200/30 dark:border-blue-800/30">
														<Star className="flex-shrink-0 mt-0.5 w-4 h-4 text-blue-500" />
														<span className="text-sm font-medium text-foreground">{perk}</span>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Open Positions */}
									{business.careers.isHiring && business.careers.openPositions.length > 0 && (
										<div className="space-y-6">
											<div className="flex justify-between items-center">
												<h3 className="text-xl font-bold text-foreground">Current Openings</h3>
												<Badge className="text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30">
													{business.careers.openPositions.length} Position{business.careers.openPositions.length !== 1 ? "s" : ""} Available
												</Badge>
											</div>

											<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
												{business.careers.openPositions.map((position, index) => (
													<div key={index} className="overflow-hidden relative p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 transition-all duration-300 group dark:from-gray-900 dark:to-gray-800 border-border hover:border-primary/50 hover:shadow-lg">
														<div className="relative z-10">
															<div className="flex justify-between items-start mb-4">
																<div>
																	<h4 className="text-lg font-bold transition-colors text-foreground group-hover:text-primary">{position.title}</h4>
																	<div className="flex flex-wrap gap-2 mt-2">
																		<Badge variant="secondary" className="text-xs">
																			{position.type}
																		</Badge>
																		<Badge variant="outline" className="text-xs">
																			{position.experience}
																		</Badge>
																		<Badge variant="outline" className="text-xs text-muted-foreground">
																			{position.posted}
																		</Badge>
																	</div>
																</div>
																<div className="text-right">
																	<p className="text-lg font-bold text-green-600">{position.salary}</p>
																	<p className="text-xs text-muted-foreground">{position.location}</p>
																</div>
															</div>

															<p className="mb-4 text-sm leading-relaxed text-muted-foreground">{position.description}</p>

															<div className="mb-4">
																<h5 className="mb-3 text-sm font-semibold text-foreground">Key Requirements</h5>
																<div className="space-y-2">
																	{position.requirements.slice(0, 3).map((req, reqIndex) => (
																		<div key={reqIndex} className="flex items-start space-x-2">
																			<div className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
																			<span className="text-xs text-foreground">{req}</span>
																		</div>
																	))}
																	{position.requirements.length > 3 && <p className="text-xs text-muted-foreground">+{position.requirements.length - 3} more requirements</p>}
																</div>
															</div>

															<div className="flex gap-2">
																<Button size="sm" className="flex-1 text-white bg-gradient-to-r to-blue-600 from-primary hover:from-primary/90 hover:to-blue-600/90">
																	Apply Now
																</Button>
																<Button variant="outline" size="sm" className="px-3">
																	<Share className="w-4 h-4" />
																</Button>
															</div>
														</div>

														{/* Hover gradient overlay */}
														<div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 from-primary/5 to-blue-500/5 group-hover:opacity-100" />
													</div>
												))}
											</div>
										</div>
									)}

									{/* Employee Testimonials */}
									<div className="space-y-6">
										<h3 className="text-xl font-bold text-foreground">What Our Team Says</h3>
										<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
											{business.careers.testimonials.map((testimonial, index) => (
												<div key={index} className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-800/50">
													<div className="relative z-10">
														<div className="mb-4">
															<Quote className="w-8 h-8 text-purple-400 opacity-20" />
														</div>
														<p className="mb-4 italic font-medium leading-relaxed text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
														<div className="flex justify-between items-center">
															<div>
																<p className="font-semibold text-foreground">{testimonial.employee}</p>
																<p className="text-xs text-purple-600 dark:text-purple-400">{testimonial.tenure} with company</p>
															</div>
															<div className="flex text-yellow-400">
																{[...Array(5)].map((_, i) => (
																	<Star key={i} className="w-4 h-4 fill-current" />
																))}
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* CTA Section */}
									<div className="p-8 text-center bg-gradient-to-r rounded-2xl border from-primary/10 via-blue-500/10 to-purple-500/10 border-primary/20">
										<h3 className="mb-4 text-xl font-bold text-foreground">Ready to Join Our Team?</h3>
										<p className="mb-6 text-muted-foreground">We&apos;re always looking for talented individuals who share our passion for excellence.</p>
										<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
											<Button className="text-white bg-gradient-to-r from-green-500 to-blue-500 shadow-lg hover:from-green-600 hover:to-blue-600">
												<Users className="mr-2 w-4 h-4" />
												View All Opportunities
											</Button>
											<Button variant="outline">
												<FileText className="mr-2 w-4 h-4" />
												Send Resume
											</Button>
											<Button variant="outline">
												<MessageCircle className="mr-2 w-4 h-4" />
												Contact HR
											</Button>
										</div>
									</div>
								</div>
							</section>

							{/* 12. 🤝 STRATEGIC PARTNERSHIPS SECTION */}
							<section ref={partnershipsRef} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Handshake className="mr-3 w-6 h-6 text-primary" />
										🤝 Strategic Partnerships
									</h2>
									<div className="w-20 h-1 bg-gradient-to-r rounded-full from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Partnership Overview */}
									<div className="overflow-hidden relative p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-800/50">
										<div className="absolute top-4 right-4">
											<Badge className="text-blue-700 bg-blue-100 shadow-lg dark:text-blue-300 dark:bg-blue-900/50">Trusted Network</Badge>
										</div>

										<div className="relative z-10">
											<div className="flex items-center mb-4 space-x-3">
												<div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
													<Building className="w-6 h-6 text-white" />
												</div>
												<div>
													<h3 className="text-xl font-bold text-foreground">Quality Partner Network</h3>
													<p className="text-sm text-muted-foreground">Trusted relationships across the industry</p>
												</div>
											</div>
											<p className="mb-6 text-foreground">Our strategic partnerships ensure we deliver exceptional quality and comprehensive solutions through trusted industry collaborations.</p>

											<div className="flex gap-3">
												<Button className="text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg hover:from-blue-600 hover:to-indigo-600">
													<Building className="mr-2 w-4 h-4" />
													View Partners
												</Button>
												<Button variant="outline" className="border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20">
													<Handshake className="mr-2 w-4 h-4" />
													Partner With Us
												</Button>
											</div>
										</div>
									</div>

									{/* Partnership Categories */}
									<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
										{/* Supplier Partners */}
										<div className="space-y-6">
											<div className="flex items-center space-x-3">
												<div className="p-2 rounded-lg bg-green-500/10">
													<TrendingUp className="w-5 h-5 text-green-600" />
												</div>
												<h3 className="text-lg font-bold text-foreground">Supplier Partners</h3>
											</div>

											<div className="space-y-4">
												{business.partnerships.supplierPartners.map((partner, index) => (
													<div key={index} className="overflow-hidden relative p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 transition-all duration-300 group dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50 hover:border-green-300 hover:shadow-lg">
														<div className="relative z-10">
															<div className="flex items-start space-x-4">
																<div className="overflow-hidden flex-shrink-0 w-16 h-16 bg-white rounded-xl border-2 border-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
																	<img src={partner.logo} alt={partner.name} className="object-cover w-full h-full" />
																</div>
																<div className="flex-1 min-w-0">
																	<h4 className="text-lg font-bold transition-colors text-foreground group-hover:text-green-700">{partner.name}</h4>
																	<div className="flex items-center mt-1 space-x-2">
																		<Badge className="text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50">{partner.type}</Badge>
																		<span className="text-xs text-muted-foreground">{partner.relationship}</span>
																	</div>
																	<p className="mt-3 text-sm leading-relaxed text-foreground">{partner.benefits}</p>
																</div>
															</div>
														</div>
														<div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 from-green-500/5 to-emerald-500/5 group-hover:opacity-100" />
													</div>
												))}
											</div>
										</div>

										{/* Service Partners */}
										<div className="space-y-6">
											<div className="flex items-center space-x-3">
												<div className="p-2 rounded-lg bg-blue-500/10">
													<Users className="w-5 h-5 text-blue-600" />
												</div>
												<h3 className="text-lg font-bold text-foreground">Service Partners</h3>
											</div>

											<div className="space-y-4">
												{business.partnerships.servicePartners.map((partner, index) => (
													<div key={index} className="overflow-hidden relative p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 transition-all duration-300 group dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 hover:shadow-lg">
														<div className="relative z-10">
															<div className="flex justify-between items-start mb-3">
																<div>
																	<h4 className="text-lg font-bold transition-colors text-foreground group-hover:text-blue-700">{partner.name}</h4>
																	<div className="flex items-center mt-1 space-x-2">
																		<Badge className="text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50">{partner.type}</Badge>
																		<Badge variant="outline" className="text-xs border-blue-200 dark:border-blue-800">
																			{partner.relationship}
																		</Badge>
																	</div>
																</div>
																<div className="flex text-blue-500">
																	<Star className="w-4 h-4 fill-current" />
																	<Star className="w-4 h-4 fill-current" />
																	<Star className="w-4 h-4 fill-current" />
																	<Star className="w-4 h-4 fill-current" />
																	<Star className="w-4 h-4 fill-current" />
																</div>
															</div>
															<p className="text-sm leading-relaxed text-foreground">{partner.description}</p>
														</div>
														<div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 from-blue-500/5 to-indigo-500/5 group-hover:opacity-100" />
													</div>
												))}
											</div>
										</div>

										{/* Community Partners */}
										<div className="space-y-6">
											<div className="flex items-center space-x-3">
												<div className="p-2 rounded-lg bg-orange-500/10">
													<Heart className="w-5 h-5 text-orange-600" />
												</div>
												<h3 className="text-lg font-bold text-foreground">Community Partners</h3>
											</div>

											<div className="space-y-4">
												{business.partnerships.communityPartners.map((partner, index) => (
													<div key={index} className="overflow-hidden relative p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 transition-all duration-300 group dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-800/50 hover:border-orange-300 hover:shadow-lg">
														<div className="relative z-10">
															<div className="flex justify-between items-start mb-3">
																<div>
																	<h4 className="text-lg font-bold transition-colors text-foreground group-hover:text-orange-700">{partner.name}</h4>
																	<div className="flex items-center mt-1 space-x-2">
																		<Badge className="text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/50">{partner.type}</Badge>
																		<Badge variant="secondary" className="text-xs">
																			{partner.involvement}
																		</Badge>
																	</div>
																</div>
																<div className="p-2 rounded-full bg-orange-500/10">
																	<Heart className="w-4 h-4 text-orange-500" />
																</div>
															</div>
															<p className="text-sm leading-relaxed text-foreground">{partner.description}</p>
														</div>
														<div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 from-orange-500/5 to-amber-500/5 group-hover:opacity-100" />
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Partnership Benefits & Recognition */}
									<div className="space-y-6">
										<h3 className="text-xl font-bold text-foreground">Partnership Recognition & Certifications</h3>
										<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
											{business.partnerships.certifications.map((cert, index) => (
												<div key={index} className="overflow-hidden relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 transition-all duration-300 group dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300 hover:shadow-lg">
													<div className="relative z-10">
														<div className="flex justify-between items-start mb-4">
															<div className="p-3 rounded-full bg-purple-500/10">
																<Award className="w-6 h-6 text-purple-600" />
															</div>
															<div className="flex gap-2">
																{cert.grade && <Badge className="text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">{cert.grade}</Badge>}
																{cert.year && (
																	<Badge variant="outline" className="border-purple-200 dark:border-purple-800">
																		{cert.year}
																	</Badge>
																)}
															</div>
														</div>

														<h4 className="mb-2 text-lg font-bold transition-colors text-foreground group-hover:text-purple-700">{cert.name}</h4>

														{cert.since && <p className="mb-2 text-xs text-purple-600 dark:text-purple-400">Member since {cert.since}</p>}

														{cert.achievement && <p className="mb-3 text-sm font-medium text-purple-700 dark:text-purple-300">{cert.achievement}</p>}

														<p className="text-sm leading-relaxed text-foreground">{cert.benefits}</p>
													</div>
													<div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 from-purple-500/5 to-pink-500/5 group-hover:opacity-100" />
												</div>
											))}
										</div>
									</div>

									{/* CTA Section */}
									<div className="p-8 text-center bg-gradient-to-r rounded-2xl border from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-blue-200/50 dark:border-blue-800/50">
										<div className="mx-auto max-w-2xl">
											<h3 className="mb-4 text-xl font-bold text-foreground">Interested in Partnership?</h3>
											<p className="mb-6 text-muted-foreground">Join our network of trusted partners and grow your business with quality collaborations.</p>
											<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
												<Button className="text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg hover:from-blue-600 hover:to-indigo-600">
													<Handshake className="mr-2 w-4 h-4" />
													Become a Partner
												</Button>
												<Button variant="outline">
													<Building className="mr-2 w-4 h-4" />
													View Partnership Benefits
												</Button>
												<Button variant="outline">
													<MessageCircle className="mr-2 w-4 h-4" />
													Contact Partnership Team
												</Button>
											</div>
										</div>
									</div>
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>

			{/* Photo Modal */}
			{showAllPhotos && (
				<div
					className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-background/95"
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
					<div className="flex relative flex-col w-full h-full">
						{/* Modal Header */}
						<div className="flex justify-between items-center p-4 border-b backdrop-blur-md bg-background/80 border-border">
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
									<Share className="mr-2 w-4 h-4" />
									Share
								</Button>
								<Button variant="ghost" size="sm" onClick={() => setShowAllPhotos(false)} className="text-muted-foreground hover:text-foreground hover:bg-red-500/10 hover:text-red-500" title="Close (ESC)">
									<X className="w-5 h-5" />
								</Button>
							</div>
						</div>

						{/* Modal Content */}
						<div className="flex flex-1 justify-center items-center p-4">
							<div className="relative max-w-4xl max-h-full">
								{allImages[selectedImageIndex] && (
									<div className="relative">
										<img src={allImages[selectedImageIndex].src || allImages[selectedImageIndex]} alt={allImages[selectedImageIndex].title || `${business.name} photo ${selectedImageIndex + 1}`} className="object-contain max-w-full max-h-full rounded-lg" />
										{/* Image Info Overlay */}
										{allImages[selectedImageIndex].title && (
											<div className="absolute right-4 bottom-4 left-4 p-3 rounded-lg border backdrop-blur-md bg-background/80 border-border">
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
										<Button variant="ghost" size="sm" className="absolute left-4 top-1/2 backdrop-blur-sm -translate-y-1/2 bg-background/80 hover:bg-background/90" onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}>
											<ChevronLeft className="w-5 h-5" />
										</Button>
										<Button variant="ghost" size="sm" className="absolute right-4 top-1/2 backdrop-blur-sm -translate-y-1/2 bg-background/80 hover:bg-background/90" onClick={() => setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}>
											<ChevronRight className="w-5 h-5" />
										</Button>
									</>
								)}
							</div>
						</div>

						{/* Thumbnail Navigation */}
						{allImages.length > 1 && (
							<div className="p-4 border-t backdrop-blur-md bg-background/80 border-border">
								<div className="flex overflow-x-auto pb-2 space-x-2">
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
					className="hidden fixed left-6 z-30 lg:block"
					style={{
						top: `${headerHeight + 16}px`,
						bottom: "2em",
					}}
				>
					<div className="flex flex-col rounded-xl border shadow-lg backdrop-blur-md w-fit bg-card/90 border-border" style={{ overflow: "visible" }}>
						{/* Error State */}
						{scrollSpyError && <div className="p-2 text-xs text-red-500 bg-red-50 border-b border-red-200 dark:bg-red-950/30 dark:border-red-800">⚠️ {scrollSpyError}</div>}

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
				<div className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-background/80">
					<div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						{/* Modal Header */}
						<div className="p-6 border-b border-border">
							<div className="flex justify-between items-center">
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
								<input type="text" placeholder="Summarize your experience" value={newReview.title} onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))} className="px-3 py-2 w-full rounded-lg border bg-background border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
							</div>

							{/* Review Text */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">Your Review</label>
								<textarea placeholder="Tell others about your experience..." value={newReview.text} onChange={(e) => setNewReview((prev) => ({ ...prev, text: e.target.value }))} rows={5} className="px-3 py-2 w-full rounded-lg border resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
							</div>

							{/* Author Name */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-foreground">Your Name</label>
								<input type="text" placeholder="Enter your name" value={newReview.author} onChange={(e) => setNewReview((prev) => ({ ...prev, author: e.target.value }))} className="px-3 py-2 w-full rounded-lg border bg-background border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
							</div>
						</div>

						{/* Modal Footer */}
						<div className="p-6 border-t border-border">
							<div className="flex justify-end space-x-3">
								<Button variant="outline" onClick={() => setShowReviewModal(false)} className="border-border hover:bg-muted">
									Cancel
								</Button>
								<Button onClick={handleSubmitReview} disabled={!newReview.text.trim() || !newReview.author.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
									<Send className="mr-2 w-4 h-4" />
									Submit Review
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Video Consultation Modal - REMOVED */}
			{false && (
				<div className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-background/80">
					<div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6 border-b border-border">
							<div className="flex justify-between items-center">
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
								<div className="p-4 rounded-lg border bg-card/30">
									<p className="text-sm text-muted-foreground">Price</p>
									<p className="text-xl font-bold text-primary">{business.videoConsultation.pricePerSession}</p>
								</div>
								<div className="p-4 rounded-lg border bg-card/30">
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
							<div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
								<div className="flex justify-between items-center">
									<div>
										<p className="font-semibold text-foreground">Next Available</p>
										<p className="text-sm text-muted-foreground">{business.videoConsultation.nextSlot}</p>
									</div>
									<Button className="text-white bg-blue-500 hover:bg-blue-600">
										<Video className="mr-2 w-4 h-4" />
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
			<div className="fixed right-4 bottom-4 z-40 lg:hidden sm:bottom-6 sm:right-6">
				<Button size="default" onClick={() => setShowReviewModal(true)} className="px-4 h-12 rounded-full shadow-xl transition-all duration-200 transform bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-2xl hover:scale-105 active:scale-95">
					<Plus className="mr-2 w-4 h-4" />
					<span className="text-sm font-semibold">Review</span>
				</Button>
			</div>
		</div>
	);
}
