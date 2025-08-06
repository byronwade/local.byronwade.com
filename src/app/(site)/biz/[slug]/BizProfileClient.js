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
// Removed mock data generator imports - now using real Supabase data

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

export default function BizProfileClient({ businessId, initialBusiness, seoData }) {
	const [business, setBusiness] = useState(initialBusiness || null);
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

	// Transform real Supabase business data to match component expectations
	const transformRealBusinessData = (realBusiness) => {
		// Determine industry based on categories
		const primaryCategory = realBusiness.categories?.[0]?.name?.toLowerCase() || "";
		let industry = "general";
		if (primaryCategory.includes("restaurant") || primaryCategory.includes("food")) {
			industry = "restaurant";
		} else if (primaryCategory.includes("automotive") || primaryCategory.includes("auto")) {
			industry = "automotive";
		}

		return {
			...realBusiness,
			// Map real data to component expected format
			ratings: {
				overall: realBusiness.rating || 4.5,
				quality: realBusiness.rating || 4.5,
				communication: realBusiness.rating || 4.5,
				timeliness: realBusiness.rating || 4.5,
				value: realBusiness.rating || 4.5,
			},
			industry,
			trustScore: Math.floor((realBusiness.rating || 4.5) * 20),
			responseRate: 95, // Default high response rate
			responseTime: "within 2 hours",
			detailedServices: realBusiness.categories?.map((c) => c.name) || [],
			businessHighlights: [...(realBusiness.verified ? ["Verified Business"] : []), ...(realBusiness.amenities || []).slice(0, 3), "Licensed & Insured", "Customer Satisfaction Guaranteed"],
			portfolioPhotos: realBusiness.photos?.slice(0, 3) || [],
			// Transform reviews to match component format
			reviews:
				realBusiness.reviews?.map((review) => ({
					id: review.id,
					author: review.user?.name || "Anonymous",
					avatar: review.user?.avatar_url || `https://i.pravatar.cc/150?u=${review.id}`,
					rating: review.rating,
					date: new Date(review.created_at).toLocaleDateString(),
					text: review.text,
					title: review.title,
					helpful: review.helpful_count || 0,
					verified: true,
					photos: review.photos?.length || 0,
					response: review.response,
					responseDate: review.response_date ? new Date(review.response_date).toLocaleDateString() : null,
				})) || [],
			// Add mock data for sections that don't have real data yet
			peerRecommendations: [
				{
					recommenderName: "Local Customer",
					recommenderAddress: "Verified Customer",
					relationship: "Customer",
					serviceUsed: realBusiness.categories?.[0]?.name || "Service",
					rating: realBusiness.rating || 5,
					comment: "Professional and reliable service. Highly recommend!",
					verificationStatus: "Verified Customer",
					date: "2 weeks ago",
				},
			],
			amenities: (realBusiness.amenities || []).map((amenity) => ({
				name: amenity,
				icon: CheckCircle,
				available: true,
			})),
			serviceArea: {
				primary: `${realBusiness.city}, ${realBusiness.state}`,
				coverage: "Local area",
				cities: [realBusiness.city],
			},
			license: {
				number: `LIC-${realBusiness.id.slice(0, 8)}`,
				state: realBusiness.state,
				verified: realBusiness.verified,
				expires: "12/31/2025",
			},
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
				languages: ["English"],
				nextSlot: "Today 3:00 PM",
				specialties: ["Initial Assessment", "Quote Estimation"],
			},
			warranties: [],
			warrantyTracker: {
				warranties: [
					{
						type: "Workmanship",
						duration: "2 Years",
						coverage: "Full coverage for defects",
					},
				],
				activeWarranties: [],
				claims: [],
			},
			multiLanguage: {
				supportedLanguages: [{ code: "en", name: "English", flag: "🇺🇸", native: "English" }],
				staffLanguages: ["English"],
				translationQuality: "Professional",
			},
			insuranceBilling: {
				acceptedInsurance: [],
				directBilling: false,
				paymentPlans: true,
			},
			// Additional required fields for component sections
			workGallery: {
				beforeAfter: [],
				portfolio: [],
			},
			certifications: realBusiness.verified
				? [
						{
							name: "Business Verification",
							issuer: "Thorbis",
							date: "2024",
							verified: true,
						},
					]
				: [],
			// Add any other fields the component expects...
		};
	};

	// Load business data using the centralized business data generator
	useEffect(() => {
		const loadBusinessData = () => {
			try {
				// If we already have initial business data from SSR, use it
				if (initialBusiness) {
					// Transform the real business data to match component expectations
					const transformedBusiness = transformRealBusinessData(initialBusiness);
					setBusiness(transformedBusiness);
					return;
				}

				// No initial business data provided - this indicates an error in the parent component
				console.error("No initial business data provided to BizProfileClient");

				// Create a minimal fallback business structure to prevent crashes
				const fallbackBusiness = {
					id: businessId || "fallback",
					name: "Business Not Found",
					slug: businessId || "not-found",
					description: "This business could not be loaded. Please try again later.",
					address: "Address not available",
					phone: "Phone not available",
					website: null,
					categories: ["Business"],
					industry: "general",
					ratings: { overall: 0 },
					reviewCount: 0,
					hours: "Hours not available",
					coordinates: { lat: 0, lng: 0 },
					isOpenNow: false,
					price: "N/A",
					statusMessage: "Business not found",
					isSponsored: false,
					logo: null,
					photos: [],
					trustScore: 0,
					responseRate: 0,
					responseTime: "N/A",
					detailedServices: [],
					businessHighlights: [],
					portfolioPhotos: [],
					reviews: [],
					peerRecommendations: [],
					amenities: [],
					serviceArea: {
						primary: "Not available",
						coverage: "Unknown",
						cities: ["Not available"],
					},
					license: {
						number: "Not available",
						state: "Not available",
						verified: false,
						expires: "Unknown",
					},
					realTimeAvailability: {
						currentStatus: "Not available",
						nextAvailable: "Unknown",
						emergencyAvailable: false,
						avgResponseTime: "Unknown",
						todaySlots: [],
					},
					videoConsultation: null,
					warranties: [],
					warrantyTracker: { warranties: [], activeWarranties: [], claims: [] },
					menu: null,
					automotive: null,
				};

				setBusiness(fallbackBusiness);
			} catch (error) {
				console.error("Error in BizProfileClient initialization:", error);
				// Final fallback - minimal business object
				setBusiness({
					id: businessId || "error",
					name: "Error Loading Business",
					description: "An error occurred while loading business information.",
					industry: "general",
					ratings: { overall: 0 },
					reviewCount: 0,
				});
			}
		};

		loadBusinessData();
	}, [businessId, initialBusiness]);

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
									<span>{business?.serviceArea?.primary || business?.address || "Location not specified"}</span>
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
									<Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
									<span className="text-lg font-semibold text-foreground">{business.ratings?.overall || 0}</span>
									<span className="text-muted-foreground">({business.reviewCount || 0} reviews)</span>
								</div>
								<div className="text-sm text-green-600">{business.isOpenNow ? "Open Now" : "Closed"}</div>
							</div>
						</div>
					</div>

					{/* Section Navigation */}
					<div className="border-b border-border">
						<div className="flex space-x-8 overflow-x-auto">
							{[
								{ id: "overview", label: "Overview" },
								{ id: "reviews", label: "Reviews" },
								{ id: "services", label: "Services" },
								{ id: "photos", label: "Photos" },
							].map((section) => (
								<button key={section.id} onClick={() => setActiveSection(section.id)} className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${activeSection === section.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
									{section.label}
								</button>
							))}
						</div>
					</div>

					{/* Section Content */}
					<div className="space-y-8">
						{/* Overview Section */}
						{activeSection === "overview" && (
							<SectionWrapper>
								<BusinessOverview business={business} />
							</SectionWrapper>
						)}

						{/* Reviews Section */}
						{activeSection === "reviews" && (
							<SectionWrapper>
								<Reviews business={business} />
							</SectionWrapper>
						)}

						{/* Services Section */}
						{activeSection === "services" && (
							<SectionWrapper>
								<Services business={business} />
							</SectionWrapper>
						)}

						{/* Photos Section */}
						{activeSection === "photos" && (
							<SectionWrapper>
								<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
									{business.photos?.map((photo, index) => (
										<img
											key={index}
											src={photo}
											alt={`${business.name} photo ${index + 1}`}
											className="w-full h-48 object-cover rounded-lg"
											onClick={() => {
												setSelectedImageIndex(index);
												setShowAllPhotos(true);
											}}
										/>
									))}
								</div>
							</SectionWrapper>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
