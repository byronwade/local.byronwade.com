"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import ErrorBoundary from "@components/shared/error-boundary";
import { ArrowLeft, Share, Heart, Star, MapPin, CheckCircle, Shield, Award, Users, MessageCircle, Car, DollarSign, Building, Eye, Target, Zap, ClipboardCheck, Settings, Handshake, Utensils } from "lucide-react";
import { Button } from "@components/ui/button";
// Removed mock data generator imports - now using real Supabase data

// Direct imports instead of lazy loading
import BusinessOverview from "./sections/business-overview";
import CertifiedElite from "./sections/certified-elite";
import Reviews from "./sections/reviews";
import Credentials from "./sections/credentials";
import Availability from "./sections/availability";
import Services from "./sections/services";
import Expertise from "./sections/expertise";
import Pricing from "./sections/pricing";
import BusinessOperations from "./sections/business-operations";
import WarrantyTracker from "./sections/warranty-tracker";
import FAQ from "./sections/faq";
import Careers from "./sections/careers";
import Partnerships from "./sections/partnerships";
import MenuSection from "./sections/menu-section";
import AutomotiveServices from "./sections/automotive-services";

// Performance optimization: Memoized loading component
const LoadingSpinner = () => (
	<div className="flex items-center justify-center p-8">
		<div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
	</div>
);

// Section wrapper with Suspense and Error Boundary
const SectionWrapper = React.memo(({ children, ref }) => (
	<div ref={ref} className="performance-container">
		<ErrorBoundary>{children}</ErrorBoundary>
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
			businessHighlights: [...(realBusiness.verified ? ["✓ Verified Business"] : []), ...(realBusiness.amenities || []).slice(0, 2), "✓ Licensed & Insured", "✓ Customer Satisfaction Guaranteed", "✓ Free Estimates", "✓ Emergency Services Available", "✓ 5+ Years Experience", "✓ Professional Team", "✓ Quality Materials", "✓ Timely Service"],
			portfolioPhotos: [...(realBusiness.photos || []), "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1554774853-719586f82d77?w=600&h=400&fit=crop"].slice(0, 6),
			// Enhanced photo gallery
			photos: [
				...(realBusiness.photos || []),
				"https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1554774853-719586f82d77?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
				"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
			],
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
			// Enhanced demo content for investor showcase
			peerRecommendations: [
				{
					recommenderName: "Sarah Johnson",
					recommenderAddress: "Downtown District",
					relationship: "Repeat Customer",
					serviceUsed: realBusiness.categories?.[0]?.name || "Service",
					rating: realBusiness.rating || 5,
					comment: "Outstanding service quality and professionalism. They exceeded my expectations and delivered exactly what they promised.",
					verificationStatus: "Verified Customer",
					date: "2 weeks ago",
				},
				{
					recommenderName: "Michael Chen",
					recommenderAddress: "Business District",
					relationship: "Business Client",
					serviceUsed: "Commercial Services",
					rating: 5,
					comment: "Reliable partner for our business needs. Quick response times and excellent communication throughout the project.",
					verificationStatus: "Verified Business",
					date: "1 month ago",
				},
			],
			// Enhanced services data
			detailedServices: [...(realBusiness.categories?.map((c) => c.name) || []), "Emergency Services", "Consultation", "Maintenance", "Installation", "Repairs"],
			// Rich expertise data
			expertise: [
				{
					area: realBusiness.categories?.[0]?.name || "Primary Service",
					yearsExperience: "5+",
					certifications: ["Licensed", "Insured"],
					specializations: ["Commercial", "Residential", "Emergency"],
				},
				{
					area: "Customer Service",
					yearsExperience: "5+",
					certifications: ["Customer Excellence"],
					specializations: ["24/7 Support", "Multilingual"],
				},
			],
			// Enhanced pricing structure
			pricing: {
				consultationFee: "$0",
				hourlyRate: "$85-125",
				emergencyRate: "$150",
				minimumCharge: "$95",
				paymentMethods: ["Cash", "Credit/Debit", "Digital Payments", "Financing Available"],
				estimates: "Free estimates available",
			},
			// FAQ data
			faq: [
				{
					question: "What areas do you serve?",
					answer: `We serve ${realBusiness.city} and surrounding areas within a 25-mile radius.`,
					category: "Service Area",
				},
				{
					question: "Do you offer emergency services?",
					answer: "Yes, we provide 24/7 emergency services with rapid response times.",
					category: "Availability",
				},
				{
					question: "Are you licensed and insured?",
					answer: "Yes, we are fully licensed and insured for your protection and peace of mind.",
					category: "Credentials",
				},
				{
					question: "What payment methods do you accept?",
					answer: "We accept cash, all major credit cards, and offer financing options for larger projects.",
					category: "Payment",
				},
			],
			// Career opportunities
			careers: [
				{
					title: "Service Technician",
					type: "Full-time",
					location: realBusiness.city,
					description: "Join our growing team of professional service technicians.",
					requirements: ["Experience in field", "Valid driver's license", "Professional demeanor"],
					benefits: ["Health insurance", "Paid time off", "Training provided"],
				},
			],
			// Business partnerships
			partnerships: [
				{
					name: "Local Supply Partners",
					type: "Supplier",
					description: "We work with trusted local suppliers to ensure quality materials and quick service.",
					logo: null,
				},
				{
					name: "Professional Networks",
					type: "Professional",
					description: "Member of local business associations and professional networks.",
					logo: null,
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
			// Enhanced work gallery for investor showcase
			workGallery: {
				beforeAfter: [
					{
						before: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
						after: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
						title: "Complete Service Transform",
						description: "Professional results that exceed expectations",
					},
					{
						before: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
						after: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=400&h=300&fit=crop",
						title: "Quality Workmanship",
						description: "Attention to detail in every project",
					},
				],
				portfolio: [
					{
						image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
						title: "Professional Installation",
						description: "High-quality work with attention to detail",
						category: "Commercial",
					},
					{
						image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
						title: "Residential Service",
						description: "Reliable service for homeowners",
						category: "Residential",
					},
					{
						image: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=600&h=400&fit=crop",
						title: "Emergency Repair",
						description: "Quick response for urgent needs",
						category: "Emergency",
					},
				],
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

					{/* No tab navigation as per user preference - show all content */}

					{/* All Rich Content Sections - Showcase full platform capabilities */}
					<div className="space-y-8">
						{/* Core Business Information */}
						<SectionWrapper>
							<BusinessOverview business={business} />
						</SectionWrapper>

						{/* Certified Elite Status */}
						<SectionWrapper>
							<CertifiedElite business={business} />
						</SectionWrapper>

						{/* Professional Credentials */}
						<SectionWrapper>
							<Credentials business={business} />
						</SectionWrapper>

						{/* Real-time Availability */}
						<SectionWrapper>
							<Availability business={business} />
						</SectionWrapper>

						{/* Services Offered */}
						<SectionWrapper>
							<Services business={business} />
						</SectionWrapper>

						{/* Expertise & Specializations */}
						<SectionWrapper>
							<Expertise business={business} />
						</SectionWrapper>

						{/* Pricing Information */}
						<SectionWrapper>
							<Pricing business={business} />
						</SectionWrapper>

						{/* Business Operations */}
						<SectionWrapper>
							<BusinessOperations business={business} />
						</SectionWrapper>

						{/* Reviews & Testimonials */}
						<SectionWrapper>
							<ErrorBoundary
								fallback={(error) => (
									<div className="p-6 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
										<div className="flex items-center gap-2 mb-3">
											<Star className="w-5 h-5 text-orange-600" />
											<h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">Reviews & Testimonials</h3>
										</div>
										<p className="text-sm text-orange-700 dark:text-orange-300 mb-4">Reviews are temporarily unavailable. Please check back later.</p>
										<Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
											Try Again
										</Button>
									</div>
								)}
							>
								<Reviews business={business} setShowReviewModal={setShowReviewModal} />
							</ErrorBoundary>
						</SectionWrapper>

						{/* Warranty & Guarantees */}
						<SectionWrapper>
							<WarrantyTracker business={business} />
						</SectionWrapper>

						{/* Frequently Asked Questions */}
						<SectionWrapper>
							<FAQ business={business} />
						</SectionWrapper>

						{/* Career Opportunities */}
						<SectionWrapper>
							<Careers business={business} />
						</SectionWrapper>

						{/* Business Partnerships */}
						<SectionWrapper>
							<Partnerships business={business} />
						</SectionWrapper>

						{/* Menu Section (for restaurants/food businesses) */}
						{(business.industry === "restaurant" || business.categories?.some((cat) => ["restaurant", "food", "dining", "cafe", "bar"].includes(cat.toLowerCase()))) && (
							<SectionWrapper>
								<MenuSection business={business} />
							</SectionWrapper>
						)}

						{/* Automotive Services (for automotive businesses) */}
						{(business.industry === "automotive" || business.categories?.some((cat) => ["automotive", "auto", "car", "vehicle", "mechanic"].includes(cat.toLowerCase()))) && (
							<SectionWrapper>
								<AutomotiveServices business={business} />
							</SectionWrapper>
						)}

						{/* Photos Gallery */}
						{business.photos && business.photos.length > 0 && (
							<SectionWrapper>
								<div className="mb-6">
									<h3 className="text-xl font-semibold mb-4">Photos</h3>
									<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
										{business.photos?.map((photo, index) => (
											<img
												key={index}
												src={photo}
												alt={`${business.name} photo ${index + 1}`}
												className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
												onClick={() => {
													setSelectedImageIndex(index);
													setShowAllPhotos(true);
												}}
											/>
										))}
									</div>
								</div>
							</SectionWrapper>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
