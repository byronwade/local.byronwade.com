"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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

	// Combine all images for photo navigation
	const allImages = business ? [...(business.photos || []), ...(business.portfolioPhotos || [])] : [];

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
			{ id: "credentials", label: "Credentials", icon: Shield },
			{ id: "availability", label: "Live Availability", icon: Zap },
			{ id: "services", label: "Services & Showcase", icon: Settings },
			{ id: "expertise", label: "Expertise & Team", icon: Target },
			{ id: "pricing", label: "Pricing & Policies", icon: DollarSign },
			{ id: "videoConsult", label: "Video Consult", icon: Video },
			{ id: "emergencyServices", label: "Emergency Services", icon: Phone },
			{ id: "information", label: "Business Info", icon: FileText },
			{ id: "businessTransparency", label: "Business Operations", icon: Eye },
			{ id: "recognition", label: "Recognition", icon: Award },
			{ id: "warrantyTracker", label: "Warranty Tracker", icon: ClipboardCheck },
			{ id: "faq", label: "FAQ & Support", icon: MessageCircle },
			{ id: "careers", label: "Careers", icon: Users },
			{ id: "partnerships", label: "Partnerships", icon: Handshake },
		],
		[]
	);

	// Refs for sections
	const sectionRefs = {
		overview: useRef(null),
		certification: useRef(null),
		reviews: useRef(null),
		credentials: useRef(null),
		availability: useRef(null),
		services: useRef(null),
		expertise: useRef(null),
		pricing: useRef(null),
		videoConsult: useRef(null),
		emergencyServices: useRef(null),
		information: useRef(null),
		businessTransparency: useRef(null),
		recognition: useRef(null),
		warrantyTracker: useRef(null),
		faq: useRef(null),
		careers: useRef(null),
		partnerships: useRef(null),
	};

	// Enhanced scroll spy utility functions
	const getCurrentSectionIndex = () => {
		try {
			return navigationItems.findIndex((item) => item.id === activeSection);
		} catch (error) {
			console.warn("Error finding current section:", error);
			return 0;
		}
	};

	const canNavigateUp = useCallback(() => getCurrentSectionIndex() > 0, [navigationItems, activeSection]);
	const canNavigateDown = useCallback(() => getCurrentSectionIndex() < navigationItems.length - 1, [navigationItems, activeSection]);

	const validateSection = (sectionId) => {
		return navigationItems.some((item) => item.id === sectionId) && sectionRefs[sectionId] && sectionRefs[sectionId].current;
	};

	const getNextSection = (direction) => {
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
	};

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
					portfolio: foundBusiness.photos.slice(0, 4).map((photo, index) => ({
						title: `Project ${index + 1}`,
						image: photo,
						description: "Professional service delivery",
					})),
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
						hourlyRate: `$${Math.floor(Math.random() * 50) + 75} - $${Math.floor(Math.random() * 50) + 125}/hour`,
						emergencyRate: `$${Math.floor(Math.random() * 50) + 150} - $${Math.floor(Math.random() * 50) + 200}/hour`,
						minimumCharge: `$${Math.floor(Math.random() * 30) + 75}`,
						discounts: ["10% Senior Discount", "15% Military Discount"],
						financing: "Financing available for larger projects",
						freeServices: ["Estimates", "Basic Diagnostics"],
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
					insurance: {
						liability: "$1,000,000 General Liability",
						workersComp: "Workers' Compensation Coverage",
						bonding: "$25,000 Surety Bond",
						provider: "Business Insurance Provider",
						verified: foundBusiness.verified,
					},
					guarantees: ["Satisfaction Guarantee", "Licensed & insured professionals", "Quality workmanship"],
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
						isHiring: Math.random() > 0.5,
						companySize: foundBusiness.employees || "1-5 employees",
						culture: "Professional and customer-focused",
						benefits: ["Competitive pay", "Professional development"],
						openPositions: [],
						perks: ["Professional environment", "Growth opportunities"],
						testimonials: [],
					},
					partnerships: {
						supplierPartners: [],
						servicePartners: [],
						communityPartners: [],
						certifications: [],
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
	}, [showScrollSpy, navigationItems.length, scrollSpyContainerHeight, scrollSpyError]);

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
	}, [headerHeight, activeSection, sectionRefs]); // Dependencies for observer recreation

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
						<div className="border-t lg:hidden border-border bg-background/95 backdrop-blur-md">
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
									<div className="flex items-center px-3 py-1.5 space-x-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/50">
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
										<MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
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
							<div className="grid grid-cols-4 gap-2 overflow-hidden h-80 sm:h-96 rounded-xl">
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
							{/* 1. BUSINESS OVERVIEW SECTION - First Impression */}
							<section ref={sectionRefs.overview} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-6 sm:mb-8 md:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Building className="w-6 h-6 mr-3 sm:w-8 sm:h-8 sm:mr-4 text-primary" />
										Business Overview
									</h2>
									<div className="w-20 h-1 rounded-full sm:w-24 sm:h-1.5 bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-6 sm:space-y-8">
									{/* AI Insights */}
									<div className="p-6 border bg-card/50 backdrop-blur-sm border-border rounded-xl sm:p-8">
										<div className="flex items-start space-x-4">
											<div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-primary/10">
												<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
											</div>
											<div className="space-y-2 sm:space-y-3">
												<h3 className="text-lg font-semibold sm:text-xl text-foreground">AI Insights</h3>
												<p className="text-sm leading-relaxed sm:text-base text-muted-foreground">This business has consistently high ratings for quality work and customer service. Customers frequently mention their professionalism, reliability, and quick response times for emergency services.</p>
											</div>
										</div>
									</div>

									{/* Business Highlights */}
									<div className="space-y-4 sm:space-y-6">
										<h3 className="text-xl font-semibold sm:text-2xl text-foreground">Business Highlights</h3>
										<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
											{business.businessHighlights.map((highlight, index) => (
												<div key={index} className="flex items-start p-4 space-x-3 border rounded-lg bg-card/30 border-border sm:p-5">
													<CheckCircle className="flex-shrink-0 w-4 h-4 mt-0.5 sm:w-5 sm:h-5 sm:mt-0 text-green-400" />
													<span className="text-sm leading-relaxed break-words sm:text-base text-foreground">{highlight}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</section>

							{/* 2. THORBIS CERTIFIED ELITE STATUS - Trust Validation */}
							<section ref={sectionRefs.certification} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-6 sm:mb-8 md:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Award className="w-6 h-6 mr-3 sm:w-8 sm:h-8 sm:mr-4 text-primary" />
										Thorbis Certified Elite Business
									</h2>
									<div className="w-20 h-1 rounded-full sm:w-24 sm:h-1.5 bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-6 sm:space-y-8">
									{/* Elite Status Hero - Redesigned */}
									<div className="relative overflow-hidden border shadow-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 isolate rounded-2xl lg:rounded-3xl border-emerald-400/20">
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
													<div className="inline-flex items-center px-4 py-2 text-sm font-bold text-white border rounded-full bg-white/20 border-white/30 backdrop-blur-sm">🏆 Elite Recognition</div>

													<div className="space-y-4">
														<h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">Certified Elite Business</h3>
														<p className="text-lg leading-relaxed text-white/90 sm:text-xl">
															This business has achieved our highest certification level - earned by fewer than <span className="font-bold text-yellow-300">1 in 125,000 businesses</span>. Like a Michelin star for service excellence.
														</p>
													</div>

													<div className="flex items-center gap-3 p-4 border bg-white/10 backdrop-blur-sm rounded-xl border-white/20">
														<div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-emerald-400">
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
													<div className="p-4 text-center border bg-white/10 backdrop-blur-sm rounded-xl border-white/20 lg:p-6">
														<div className="text-2xl font-bold text-white lg:text-3xl">0.0008%</div>
														<div className="text-sm text-white/80">Acceptance Rate</div>
														<div className="mt-1 text-xs text-emerald-200">Rarer than Harvard</div>
													</div>
													<div className="p-4 text-center border bg-white/10 backdrop-blur-sm rounded-xl border-white/20 lg:p-6">
														<div className="text-2xl font-bold text-white lg:text-3xl">6-9</div>
														<div className="text-sm text-white/80">Month Process</div>
														<div className="mt-1 text-xs text-cyan-200">Rigorous vetting</div>
													</div>
													<div className="p-4 text-center border bg-white/10 backdrop-blur-sm rounded-xl border-white/20 lg:p-6">
														<div className="text-2xl font-bold text-white lg:text-3xl">400+</div>
														<div className="text-sm text-white/80">Customer Interviews</div>
														<div className="mt-1 text-xs text-teal-200">Independent verification</div>
													</div>
													<div className="p-4 text-center border bg-white/10 backdrop-blur-sm rounded-xl border-white/20 lg:p-6">
														<div className="text-2xl font-bold text-white lg:text-3xl">100%</div>
														<div className="text-sm text-white/80">Satisfaction</div>
														<div className="mt-1 text-xs text-yellow-200">Performance guarantee</div>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* What This Means for You - Clean Cards */}
									<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
										<div className="p-6 border bg-card border-border rounded-xl sm:p-8">
											<div className="flex items-start space-x-4">
												<div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
													<CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
												</div>
												<div className="space-y-3">
													<h3 className="text-lg font-semibold text-foreground">What This Means for You</h3>
													<div className="space-y-2">
														{["Guaranteed highest quality workmanship", "Verified financial stability and licensing", "Independently confirmed customer satisfaction", "Ongoing performance monitoring", "Comprehensive performance guarantee", "Priority dispute resolution services"].map((benefit, index) => (
															<div key={index} className="flex items-start space-x-2">
																<CheckCircle className="flex-shrink-0 w-4 h-4 mt-0.5 text-emerald-500 dark:text-emerald-400" />
																<span className="text-sm text-muted-foreground">{benefit}</span>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>

										<div className="p-6 border bg-card border-border rounded-xl sm:p-8">
											<div className="flex items-start space-x-4">
												<div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900/30">
													<Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
												</div>
												<div className="space-y-3">
													<h3 className="text-lg font-semibold text-foreground">The Elite Vetting Process</h3>
													<div className="space-y-2">
														{["Comprehensive 400+ customer interviews", "Independent financial stability assessment", "Rigorous background and licensing verification", "Technical expertise evaluation", "On-site inspection and equipment review", "Ongoing annual re-certification requirements"].map((requirement, index) => (
															<div key={index} className="flex items-start space-x-2">
																<div className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full bg-blue-500/20 dark:bg-blue-400/20 flex items-center justify-center">
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

									{/* What This Means for You */}
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<div className="space-y-4">
											<h3 className="text-xl font-semibold sm:text-2xl text-foreground">What This Certification Means for You</h3>
											<div className="space-y-3">
												{["Guaranteed highest quality workmanship and service", "Verified financial stability and proper licensing", "Independently confirmed customer satisfaction scores", "Ongoing performance monitoring and quality assurance", "Protected by comprehensive performance guarantee", "Priority dispute resolution and mediation services"].map((benefit, index) => (
													<div key={index} className="flex items-start space-x-3">
														<CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-green-400" />
														<span className="text-sm leading-relaxed sm:text-base text-foreground">{benefit}</span>
													</div>
												))}
											</div>
										</div>

										<div className="space-y-4">
											<h3 className="text-xl font-semibold sm:text-2xl text-foreground">The Elite Vetting Process</h3>
											<div className="space-y-3">
												{["Comprehensive 400+ customer interview process", "Independent financial stability assessment", "Rigorous background and licensing verification", "Technical expertise and quality evaluation", "On-site inspection and equipment review", "Ongoing annual re-certification requirements"].map((requirement, index) => (
													<div key={index} className="flex items-start space-x-3">
														<div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-amber-500/20 flex items-center justify-center">
															<div className="w-2 h-2 rounded-full bg-amber-500"></div>
														</div>
														<span className="text-sm leading-relaxed sm:text-base text-foreground">{requirement}</span>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Rigorous 12-Stage Evaluation */}
									<div className="space-y-6">
										<div className="space-y-2 text-center">
											<h3 className="text-xl font-semibold sm:text-2xl text-foreground">12-Stage Elite Evaluation Process</h3>
											<p className="text-sm text-muted-foreground">This business survived our industry&apos;s most rigorous certification process</p>
										</div>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
											{[
												{ stage: 1, title: "Initial Screening", description: "Basic qualifications and eligibility review", difficulty: "Standard" },
												{ stage: 2, title: "License Audit", description: "Comprehensive licensing and permit verification", difficulty: "Moderate" },
												{ stage: 3, title: "Insurance Validation", description: "Coverage adequacy and claims history review", difficulty: "Moderate" },
												{ stage: 4, title: "Background Investigation", description: "Complete business and owner background check", difficulty: "Intensive" },
												{ stage: 5, title: "Customer Deep Dive", description: "400+ independent customer interviews", difficulty: "Intensive" },
												{ stage: 6, title: "Reference Verification", description: "Extensive reference checking and validation", difficulty: "Intensive" },
												{ stage: 7, title: "Financial Analysis", description: "Complete financial stability assessment", difficulty: "Expert" },
												{ stage: 8, title: "Quality Evaluation", description: "Work samples and quality standards review", difficulty: "Expert" },
												{ stage: 9, title: "Expertise Assessment", description: "Technical knowledge and skill testing", difficulty: "Expert" },
												{ stage: 10, title: "Facility Inspection", description: "Physical location and equipment audit", difficulty: "Expert" },
												{ stage: 11, title: "Final Review Board", description: "Executive committee comprehensive evaluation", difficulty: "Elite" },
												{ stage: 12, title: "Elite Certification", description: "Award of Thorbis Certified Elite status", difficulty: "Elite" },
											].map((item, index) => (
												<div
													key={index}
													className={`p-4 border rounded-lg ${
														item.difficulty === "Elite"
															? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50"
															: item.difficulty === "Expert"
															? "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200/50"
															: item.difficulty === "Intensive"
															? "bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200/50"
															: "bg-card/30 border-border"
													}`}
												>
													<div className="flex items-center mb-2">
														<div className={`flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-bold text-white rounded-full ${item.difficulty === "Elite" ? "bg-gradient-to-r from-amber-500 to-orange-500" : item.difficulty === "Expert" ? "bg-gradient-to-r from-red-500 to-pink-500" : item.difficulty === "Intensive" ? "bg-gradient-to-r from-orange-500 to-yellow-500" : "bg-primary"}`}>{item.stage}</div>
														<h4 className="ml-2 text-sm font-semibold text-foreground">{item.title}</h4>
													</div>
													<p className="mb-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
													<Badge variant="outline" className={`text-xs ${item.difficulty === "Elite" ? "text-amber-700 border-amber-300" : item.difficulty === "Expert" ? "text-red-700 border-red-300" : item.difficulty === "Intensive" ? "text-orange-700 border-orange-300" : "text-blue-700 border-blue-300"}`}>
														{item.difficulty}
													</Badge>
												</div>
											))}
										</div>
									</div>

									{/* Elite Performance Guarantee */}
									<div className="p-6 border bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 rounded-xl border-emerald-200/50">
										<div className="flex items-start space-x-4">
											<div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500">
												<Shield className="w-6 h-6 text-white" />
											</div>
											<div className="space-y-3">
												<h3 className="text-lg font-semibold text-foreground">Elite Performance Guarantee</h3>
												<p className="text-sm leading-relaxed text-muted-foreground">Every Thorbis Certified business is backed by our industry-leading Elite Performance Guarantee. This isn&apos;t just insurance - it&apos;s a commitment to excellence that includes dedicated mediation services, satisfaction guarantee protocols, and quality assurance monitoring.</p>
												<div className="flex flex-wrap gap-2 mt-3">
													<Badge className="text-emerald-800 bg-emerald-100 border-emerald-300">🛡️ 100% Satisfaction</Badge>
													<Badge className="text-teal-800 bg-teal-100 border-teal-300">⚖️ Expert Mediation</Badge>
													<Badge className="text-cyan-800 bg-cyan-100 border-cyan-300">🔍 Ongoing Monitoring</Badge>
													<Badge className="text-blue-800 bg-blue-100 border-blue-300">📞 24/7 Resolution</Badge>
												</div>
											</div>
										</div>
									</div>

									{/* Trust with Confidence */}
									<div className="p-6 text-center border bg-gradient-to-r from-primary/5 to-purple/5 rounded-xl border-primary/20">
										<div className="space-y-4">
											<div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-br from-primary to-purple-500">
												<Award className="w-8 h-8 text-white" />
											</div>
											<div>
												<h3 className="mb-2 text-xl font-semibold text-foreground">You&apos;re Choosing Excellence</h3>
												<p className="max-w-2xl mx-auto text-sm text-muted-foreground">By selecting this Thorbis Certified business, you&apos;re working with a company that has proven itself among the top 0.0008% of businesses in the industry. This level of certification is rarer than admission to Harvard and represents an unwavering commitment to quality that you can trust.</p>
											</div>
											<div className="flex flex-col justify-center gap-3 sm:flex-row">
												<Button className="text-white shadow-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
													<Shield className="w-4 h-4 mr-2" />
													View Certification Details
												</Button>
												<Button variant="outline" className="border-primary/20 hover:bg-primary/5">
													<ExternalLink className="w-4 h-4 mr-2" />
													Learn About Certification Process
												</Button>
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* 3. REVIEWS & NEIGHBORHOOD INSIGHTS SECTION - Social Proof */}
							<section ref={sectionRefs.reviews} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8 sm:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Star className="w-6 h-6 mr-3 sm:w-8 sm:h-8 sm:mr-4 text-primary" />
										Reviews & Neighborhood Insights
									</h2>
									<div className="w-20 h-1 rounded-full sm:w-24 sm:h-1.5 bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Review Summary with Neighborhood Stats */}
									<div className="p-6 border bg-card/30 rounded-xl border-border">
										<h3 className="mb-4 text-lg font-semibold text-foreground">Review Overview</h3>
										<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
											<div className="text-center">
												<div className="text-3xl font-bold text-foreground">{business.rating}</div>
												<div className="flex items-center justify-center mt-1 space-x-1">
													{[...Array(5)].map((_, i) => (
														<Star key={i} className={`w-4 h-4 ${i < Math.floor(business.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
													))}
												</div>
												<div className="mt-1 text-sm text-muted-foreground">{business.reviewCount} total reviews</div>
											</div>
											<div className="text-center">
												<div className="text-3xl font-bold text-orange-500">{business.peerRecommendations.length}</div>
												<div className="text-sm text-muted-foreground">Neighbor Reviews</div>
											</div>
											<div className="text-center">
												<div className="text-3xl font-bold text-primary">{business.trustScore}%</div>
												<div className="text-sm text-muted-foreground">Trust Score</div>
											</div>
											<div className="text-center">
												<div className="text-3xl font-bold text-green-400">{business.responseRate}%</div>
												<div className="text-sm text-muted-foreground">Response Rate</div>
											</div>
										</div>

										{/* Neighborhood Trust Indicators */}
										<div className="p-4 mt-6 border rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/50">
											<div className="flex items-center gap-2 mb-3">
												<Home className="w-5 h-5 text-orange-500" />
												<h4 className="font-semibold text-foreground">Neighborhood Trust</h4>
											</div>
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div className="flex items-center justify-between">
													<span className="text-muted-foreground">Verified Neighbors</span>
													<Badge className="text-orange-700 bg-orange-100">{business.peerRecommendations.length}</Badge>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-muted-foreground">Within 2 blocks</span>
													<Badge className="text-green-700 bg-green-100">{business.peerRecommendations.filter((p) => p.relationship === "Neighbor").length}</Badge>
												</div>
											</div>
										</div>
									</div>

									{/* Smart Review Filters */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h3 className="text-lg font-semibold text-foreground">Community Reviews</h3>
											<div className="flex gap-2">
												<Button variant="outline" size="sm" className="text-orange-700 border-orange-200 bg-orange-50 hover:bg-orange-100">
													<Home className="w-3 h-3 mr-1" />
													Neighbors Only
												</Button>
												<Button variant="outline" size="sm" className="border-border hover:bg-muted">
													<Star className="w-3 h-3 mr-1" />
													All Reviews
												</Button>
												<Button variant="outline" size="sm" className="border-border hover:bg-muted">
													<Users className="w-3 h-3 mr-1" />
													Recent Service
												</Button>
											</div>
										</div>
									</div>

									{/* Neighborhood Clusters */}
									<div className="space-y-6">
										{/* Immediate Neighbors Section */}
										<div className="space-y-4">
											<div className="flex items-center gap-3">
												<div className="flex items-center gap-2">
													<Home className="w-5 h-5 text-orange-500" />
													<h4 className="text-lg font-semibold text-foreground">Your Neighbors</h4>
													<Badge className="text-orange-700 bg-orange-100 border-orange-200">Verified</Badge>
												</div>
												<div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
											</div>

											{business.peerRecommendations.map((neighbor, index) => (
												<div key={index} className="p-5 border bg-gradient-to-r from-orange-50/30 to-white dark:from-orange-950/20 dark:to-card rounded-xl border-orange-200/50">
													<div className="flex items-start space-x-4">
														<div className="relative">
															<Avatar className="w-12 h-12 border-2 border-orange-200">
																<AvatarImage src={`https://i.pravatar.cc/150?img=${index + 10}`} />
																<AvatarFallback className="text-orange-700 bg-orange-100">{neighbor.recommenderName.charAt(0)}</AvatarFallback>
															</Avatar>
															<div className="absolute flex items-center justify-center w-5 h-5 bg-orange-500 rounded-full -bottom-1 -right-1">
																<Home className="w-3 h-3 text-white" />
															</div>
														</div>

														<div className="flex-1 min-w-0 space-y-3">
															<div className="space-y-2">
																<div className="flex flex-wrap items-center gap-2">
																	<div className="font-semibold text-foreground">{neighbor.recommenderName}</div>
																	<Badge variant="secondary" className="text-xs text-orange-700 bg-orange-100 border-orange-200">
																		<MapPin className="w-3 h-3 mr-1" />
																		{neighbor.recommenderAddress}
																	</Badge>
																	<Badge variant="secondary" className="text-xs text-green-700 bg-green-100 border-green-200">
																		<CheckCircle className="w-3 h-3 mr-1" />
																		{neighbor.verificationStatus}
																	</Badge>
																</div>

																<div className="flex items-center gap-3">
																	<div className="flex items-center space-x-1">
																		{[...Array(5)].map((_, i) => (
																			<Star key={i} className={`w-4 h-4 ${i < neighbor.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
																		))}
																	</div>
																	<span className="text-sm text-muted-foreground">•</span>
																	<span className="text-sm text-muted-foreground">{neighbor.date}</span>
																	<span className="text-sm text-muted-foreground">•</span>
																	<span className="text-sm font-medium text-orange-600">{neighbor.serviceUsed}</span>
																</div>
															</div>

															<p className="leading-relaxed text-foreground">&ldquo;{neighbor.comment}&rdquo;</p>

															<div className="flex items-center justify-between">
																<div className="flex items-center space-x-4 text-sm">
																	<button className="flex items-center space-x-1 transition-colors text-muted-foreground hover:text-foreground">
																		<ThumbsUp className="w-3 h-3" />
																		<span>Helpful</span>
																	</button>
																	<button className="flex items-center space-x-1 transition-colors text-muted-foreground hover:text-foreground">
																		<MessageCircle className="w-3 h-3" />
																		<span>Ask Question</span>
																	</button>
																</div>

																<Button variant="outline" size="sm" className="text-orange-700 border-orange-200 bg-orange-50 hover:bg-orange-100">
																	<MessageCircle className="w-3 h-3 mr-1" />
																	Chat with {neighbor.recommenderName.split(" ")[0]}
																</Button>
															</div>
														</div>
													</div>
												</div>
											))}

											{/* Neighborhood Chat Invitation */}
											<div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20 border-blue-200/50">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<div className="p-2 bg-blue-100 rounded-full">
															<Users className="w-5 h-5 text-blue-600" />
														</div>
														<div>
															<h5 className="font-semibold text-foreground">Join the Neighborhood Discussion</h5>
															<p className="text-sm text-muted-foreground">Connect with neighbors who&apos;ve used this service</p>
														</div>
													</div>
													<Button className="text-white bg-blue-600 hover:bg-blue-700">
														<MessageCircle className="w-4 h-4 mr-2" />
														Join Chat
													</Button>
												</div>
											</div>
										</div>

										{/* Regular Reviews Section */}
										<div className="space-y-4">
											<div className="flex items-center gap-3">
												<div className="flex items-center gap-2">
													<Star className="w-5 h-5 text-primary" />
													<h4 className="text-lg font-semibold text-foreground">All Customer Reviews</h4>
												</div>
												<div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
											</div>

											{/* Review Highlights */}
											<div className="space-y-3">
												{business.reviewHighlights.map((highlight, index) => (
													<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
														<p className="italic leading-relaxed break-words text-foreground">&ldquo;{highlight.quote}&rdquo;</p>
														<div className="flex flex-col gap-1 mt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
															<span className="text-sm text-muted-foreground">- {highlight.author}</span>
															<span className="text-xs text-muted-foreground">{highlight.reviewCount} similar reviews</span>
														</div>
													</div>
												))}
											</div>

											{/* Individual Reviews */}
											{business.reviews.map((review) => (
												<div key={review.id} className="p-4 border bg-card/30 rounded-xl border-border sm:p-6">
													<div className="flex items-start space-x-3 sm:space-x-4">
														<Avatar className="flex-shrink-0 w-10 h-10">
															<AvatarImage src={review.avatar} />
															<AvatarFallback className="bg-primary/10 text-primary">{review.author.charAt(0)}</AvatarFallback>
														</Avatar>
														<div className="flex-1 min-w-0 space-y-2">
															<div className="space-y-2">
																<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
																	<div className="min-w-0">
																		<div className="flex flex-wrap items-center gap-2">
																			<div className="font-medium break-words text-foreground">{review.author}</div>
																			{review.verified && (
																				<Badge variant="secondary" className="text-xs text-green-400 bg-green-500/10 border-green-500/20">
																					<CheckCircle className="w-3 h-3 mr-1" />
																					Verified Customer
																				</Badge>
																			)}
																		</div>
																		<div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
																			<div className="flex items-center space-x-1">
																				{[...Array(5)].map((_, i) => (
																					<Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
																				))}
																			</div>
																			<span>•</span>
																			<span>{review.date}</span>
																			{review.photos > 0 && (
																				<>
																					<span>•</span>
																					<span className="flex items-center space-x-1">
																						<Camera className="w-3 h-3" />
																						<span>{review.photos}</span>
																					</span>
																				</>
																			)}
																		</div>
																	</div>
																</div>
															</div>
															<p className="leading-relaxed break-words text-muted-foreground">{review.text}</p>
															<div className="flex items-center space-x-4 text-sm">
																<button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
																	<ThumbsUp className="w-3 h-3" />
																	<span>Helpful ({review.helpful})</span>
																</button>
																<button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
																	<MessageCircle className="w-3 h-3" />
																	<span>Reply</span>
																</button>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>

										{/* Add Review CTA */}
										<div className="p-6 border bg-gradient-to-r from-primary/5 to-orange/5 rounded-xl border-primary/20">
											<div className="space-y-4 text-center">
												<div>
													<h4 className="mb-2 font-semibold text-foreground">Share Your Experience</h4>
													<p className="text-sm text-muted-foreground">Help your neighbors by sharing your experience with {business.name}</p>
												</div>
												<div className="flex flex-col justify-center gap-3 sm:flex-row">
													<Button onClick={() => setShowReviewModal(true)} className="bg-primary hover:bg-primary/90">
														<Edit className="w-4 h-4 mr-2" />
														Write Review
													</Button>
													<Button variant="outline" className="text-orange-700 border-orange-200 bg-orange-50 hover:bg-orange-100">
														<Home className="w-4 h-4 mr-2" />
														Verify as Neighbor
													</Button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* 4. CREDENTIALS & LICENSING SECTION - Trust Building */}
							<section ref={sectionRefs.credentials} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-6 sm:mb-8 md:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Shield className="w-6 h-6 mr-3 sm:w-8 sm:h-8 sm:mr-4 text-primary" />
										Credentials & Licensing
									</h2>
									<div className="w-20 h-1 rounded-full sm:w-24 sm:h-1.5 bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-6">
									{/* Verified License */}
									{business.license.verified && (
										<div className="p-6 border bg-card/30 rounded-xl border-border">
											<div className="flex items-start space-x-3">
												<div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10">
													<Shield className="w-4 h-4 text-blue-400" />
												</div>
												<div className="space-y-2">
													<h3 className="flex items-center font-semibold text-foreground">
														Verified License Information
														<Badge variant="secondary" className="ml-2 text-blue-400 bg-blue-500/10 border-blue-500/20">
															<Verified className="w-3 h-3 mr-1" />
															Verified
														</Badge>
													</h3>
													<div className="space-y-1 text-sm">
														<p className="text-muted-foreground">
															License: <span className="text-foreground">{business.license.number}</span>
														</p>
														<p className="text-muted-foreground">
															State: <span className="text-foreground">{business.license.state}</span>
														</p>
														<p className="text-muted-foreground">
															Expires: <span className="text-foreground">{business.license.expires}</span>
														</p>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							</section>

							{/* 4. ⚡ LIVE AVAILABILITY & BOOKING SECTION - Immediate Action */}
							<section ref={sectionRefs.availability} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-6 sm:mb-8 md:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Zap className="w-6 h-6 mr-3 sm:w-8 sm:h-8 sm:mr-4 text-primary" />
										Live Availability & Booking
									</h2>
									<div className="w-20 h-1 rounded-full sm:w-24 sm:h-1.5 bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-6 sm:space-y-8">
									{/* Live Status Hero */}
									<div className="relative overflow-hidden border shadow-xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl border-green-400/20">
										<div className="absolute inset-0 opacity-20">
											<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="rgba(255,255,255,0.1)">
												<path d="m0 0 32 32M0 32 32 0"></path>
											</svg>
										</div>

										<div className="relative px-6 py-8 sm:px-8 lg:px-12">
											<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
												{/* Status */}
												<div className="text-center lg:text-left">
													<div className="flex items-center justify-center gap-2 mb-4 lg:justify-start">
														<div className="w-3 h-3 bg-white rounded-full shadow-lg animate-pulse shadow-white/50"></div>
														<Badge className="font-bold text-green-800 bg-white/90 border-white/20">LIVE STATUS</Badge>
													</div>
													<h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">{business.realTimeAvailability.currentStatus}</h3>
													<p className="text-white/90">GPS tracking • {business.realTimeAvailability.avgResponseTime} average response</p>
												</div>

												{/* Next Available */}
												<div className="text-center">
													<div className="p-6 border bg-white/10 backdrop-blur-sm rounded-xl border-white/20">
														<div className="mb-2 text-sm text-white/80">Next Available</div>
														<div className="mb-4 text-xl font-bold text-white">{business.realTimeAvailability.nextAvailable}</div>
														<Button className="w-full font-semibold text-green-600 bg-white hover:bg-white/90">
															<Calendar className="w-4 h-4 mr-2" />
															Book Instantly
														</Button>
													</div>
												</div>

												{/* Emergency */}
												<div className="text-center">
													<div className="p-6 border bg-red-500/20 backdrop-blur-sm rounded-xl border-red-400/20">
														<div className="mb-2 text-sm text-white/80">Emergency Service</div>
														<div className="mb-4 text-xl font-bold text-white">Available 24/7</div>
														<Button variant="outline" className="w-full font-semibold text-white border-white/30 hover:bg-white/10 backdrop-blur-sm">
															<Phone className="w-4 h-4 mr-2" />
															Emergency Call
														</Button>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Available Time Slots */}
									<div className="p-6 border bg-card border-border rounded-xl sm:p-8">
										<h3 className="mb-4 text-lg font-semibold text-foreground">Available Today</h3>
										<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
											{business.realTimeAvailability.todaySlots.map((slot, index) => (
												<button key={index} className={`p-3 text-sm font-medium rounded-lg transition-all ${slot.available ? "border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-700" : "border border-border bg-muted text-muted-foreground cursor-not-allowed"}`} disabled={!slot.available}>
													{slot.time}
													{slot.type === "emergency" && <div className="mt-1 text-xs text-red-600 dark:text-red-400">Emergency</div>}
												</button>
											))}
										</div>

										<div className="p-4 mt-6 rounded-lg bg-muted/50">
											<div className="flex items-center gap-2 mb-2">
												<Clock className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm font-medium text-foreground">Booking Information</span>
											</div>
											<p className="text-sm text-muted-foreground">Click any available time slot to book instantly. Emergency slots are available 24/7 with premium pricing.</p>
										</div>
									</div>

									{/* Video Consultation Option */}
									<div className="p-6 border bg-card border-border rounded-xl sm:p-8">
										<div className="flex items-center gap-3 mb-6">
											<div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900/30">
												<Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
											</div>
											<div>
												<h3 className="text-lg font-semibold text-foreground">Video Consultation</h3>
												<div className="flex items-center gap-2">
													<Badge variant="outline" className="text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800">
														HD Quality
													</Badge>
													<span className="text-sm font-medium text-blue-600 dark:text-blue-400">{business.videoConsultation.pricePerSession}</span>
												</div>
											</div>
										</div>

										<div className="grid gap-6 md:grid-cols-2">
											{/* Service Details */}
											<div className="space-y-4">
												<div className="grid grid-cols-2 gap-4">
													<div className="p-4 border rounded-lg bg-muted/50 border-border">
														<p className="text-sm text-muted-foreground">Price</p>
														<p className="text-xl font-bold text-primary">{business.videoConsultation.pricePerSession}</p>
													</div>
													<div className="p-4 border rounded-lg bg-muted/50 border-border">
														<p className="text-sm text-muted-foreground">Duration</p>
														<p className="text-xl font-bold text-foreground">{business.videoConsultation.duration}</p>
													</div>
												</div>
												<Button className="w-full text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800">
													<Video className="w-4 h-4 mr-2" />
													Schedule Video Call
												</Button>
											</div>

											{/* What's Included */}
											<div className="space-y-4">
												<h4 className="font-semibold text-foreground">What&apos;s Included</h4>
												<div className="space-y-3">
													{business.videoConsultation.specialties.map((specialty, index) => (
														<div key={index} className="flex items-center space-x-3">
															<CheckCircle className="flex-shrink-0 w-4 h-4 text-green-500 dark:text-green-400" />
															<span className="text-sm text-foreground">{specialty}</span>
														</div>
													))}
												</div>
												<div className="pt-3 border-t border-border">
													<p className="mb-2 text-sm text-muted-foreground">Available Languages:</p>
													<div className="flex flex-wrap gap-2">
														{business.videoConsultation.languages.map((lang, index) => (
															<Badge key={index} variant="secondary" className="bg-muted text-foreground">
																{lang}
															</Badge>
														))}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* 5. SERVICES & WORK SHOWCASE SECTION - What They Offer & Proof */}
							<section ref={sectionRefs.services} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Zap className="w-6 h-6 mr-3 text-primary" />
										Services & Work Showcase
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Services Offered */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Services Offered</h3>
										<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
											{business.detailedServices.map((service, index) => (
												<div key={index} className="flex items-start p-3 space-x-3 border rounded-lg bg-card/30 border-border">
													<CheckCircle className="flex-shrink-0 w-4 h-4 mt-0.5 text-primary" />
													<span className="text-sm leading-relaxed break-words text-foreground">{service}</span>
												</div>
											))}
										</div>
									</div>

									{/* Portfolio Section */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Portfolio</h3>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											{business.portfolio.map((item, index) => (
												<div key={index} className="overflow-hidden transition-all duration-300 border bg-card/30 rounded-xl border-border group hover:shadow-lg">
													<div className="relative overflow-hidden aspect-video">
														<img src={item.image} alt={item.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
													</div>
													<div className="p-4">
														<h4 className="font-medium leading-snug break-words text-foreground">{item.title}</h4>
														<p className="mt-1 text-sm leading-relaxed break-words text-muted-foreground">{item.description}</p>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Before & After Gallery */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Before & After Gallery</h3>
										<div className="space-y-4">
											{business.beforeAfterGallery.map((project, index) => (
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
													<h5 className="mb-3 font-medium text-foreground">{project.title}</h5>
													<div className="grid grid-cols-2 gap-4">
														<div>
															<p className="mb-2 text-xs text-muted-foreground">Before</p>
															<img src={project.beforeImage} alt={`${project.title} - Before`} className="object-cover w-full h-32 rounded-lg" />
														</div>
														<div>
															<p className="mb-2 text-xs text-muted-foreground">After</p>
															<img src={project.afterImage} alt={`${project.title} - After`} className="object-cover w-full h-32 rounded-lg" />
														</div>
													</div>
													<p className="mt-3 text-sm text-muted-foreground">{project.description}</p>
												</div>
											))}
										</div>
									</div>

									{/* Customer Testimonials */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Customer Testimonials</h3>
										<div className="space-y-4">
											{business.testimonials.map((testimonial, index) => (
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
													<div className="space-y-3">
														<div className="flex items-center space-x-1">
															{[...Array(5)].map((_, i) => (
																<Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
															))}
														</div>
														<p className="italic text-foreground">&ldquo;{testimonial.text}&rdquo;</p>
														<div className="flex items-center justify-between text-sm">
															<div>
																<span className="font-medium text-foreground">{testimonial.customer}</span>
															</div>
															<div className="text-xs text-muted-foreground">
																{testimonial.service} • {testimonial.date}
															</div>
														</div>
													</div>
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
													<div key={update.id} className="p-4 border bg-card/30 rounded-xl border-border">
														<div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
															<img src={update.image} alt={update.title} className="object-cover w-full h-32 rounded-lg sm:w-16 sm:h-16 sm:flex-shrink-0" />
															<div className="flex-1 min-w-0 space-y-1">
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
							<section ref={sectionRefs.expertise} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Target className="w-6 h-6 mr-3 text-primary" />
										Expertise & Professional Details
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
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
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
													<div className="space-y-3 text-center">
														<Avatar className="w-16 h-16 mx-auto">
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
														<div className="flex flex-wrap justify-center gap-1">
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

									{/* Certifications & Licenses */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Certifications & Licenses</h3>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											{business.certifications.map((cert, index) => (
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
													<div className="flex items-start space-x-3">
														<div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
															<Award className="w-4 h-4 text-primary" />
														</div>
														<div className="flex-1 min-w-0">
															<div className="flex flex-wrap items-center gap-2">
																<h5 className="font-medium leading-snug break-words text-foreground">{cert.name}</h5>
																{cert.verified && (
																	<Badge variant="secondary" className="text-xs text-green-400 bg-green-500/10 border-green-500/20">
																		<Verified className="w-3 h-3 mr-1" />
																		Verified
																	</Badge>
																)}
															</div>
															<p className="text-sm leading-relaxed break-words text-muted-foreground">{cert.issuer}</p>
															<p className="text-xs text-muted-foreground">Certified {cert.year}</p>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</section>

							{/* 7. PRICING & POLICIES SECTION - Practical Considerations */}
							<section ref={sectionRefs.pricing} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<DollarSign className="w-6 h-6 mr-3 text-primary" />
										Pricing & Policies
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Pricing Information */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Pricing & Rates</h3>
										<div className="p-4 border rounded-lg bg-card/30 border-border">
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-3">
													<div className="flex justify-between">
														<span className="text-muted-foreground">Hourly Rate</span>
														<span className="font-medium text-foreground">{business.pricing.hourlyRate}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">Emergency Rate</span>
														<span className="font-medium text-foreground">{business.pricing.emergencyRate}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">Minimum Charge</span>
														<span className="font-medium text-foreground">{business.pricing.minimumCharge}</span>
													</div>
												</div>
												<div className="space-y-3">
													<div className="flex justify-between">
														<span className="text-muted-foreground">Senior Discount</span>
														<span className="font-medium text-green-400">{business.pricing.seniorDiscount}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">Military Discount</span>
														<span className="font-medium text-green-400">{business.pricing.militaryDiscount}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">Free Estimates</span>
														<span className="font-medium text-green-400">✓ Yes</span>
													</div>
												</div>
											</div>
											{business.pricing.financingAvailable && (
												<div className="pt-4 mt-4 border-t border-border">
													<div className="flex items-center space-x-2">
														<CreditCard className="w-4 h-4 text-primary" />
														<span className="text-sm text-foreground">Financing & Payment Plans Available</span>
													</div>
												</div>
											)}
										</div>
									</div>

									{/* Professional Team */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Meet Our Team</h3>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
											{business.team.map((member, index) => (
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
													<div className="space-y-3 text-center">
														<Avatar className="w-16 h-16 mx-auto">
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
														<div className="flex flex-wrap justify-center gap-1">
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

									{/* Certifications & Licenses */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Certifications & Licenses</h3>
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
											{business.certifications.map((cert, index) => (
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
													<div className="flex items-start space-x-3">
														<div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
															<Award className="w-4 h-4 text-primary" />
														</div>
														<div className="flex-1 min-w-0">
															<div className="flex flex-wrap items-center gap-2">
																<h5 className="font-medium leading-snug break-words text-foreground">{cert.name}</h5>
																{cert.verified && (
																	<Badge variant="secondary" className="text-xs text-green-400 bg-green-500/10 border-green-500/20">
																		<Verified className="w-3 h-3 mr-1" />
																		Verified
																	</Badge>
																)}
															</div>
															<p className="text-sm leading-relaxed break-words text-muted-foreground">{cert.issuer}</p>
															<p className="text-xs text-muted-foreground">Certified {cert.year}</p>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Insurance & Bonding */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Insurance & Bonding</h3>
										<div className="p-4 border rounded-lg bg-card/30 border-border">
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-3">
													<div className="flex justify-between">
														<span className="text-muted-foreground">General Liability</span>
														<span className="font-medium text-foreground">{business.insurance.generalLiability}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">Workers Comp</span>
														<span className="font-medium text-foreground">{business.insurance.workersComp}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">Bonded Amount</span>
														<span className="font-medium text-foreground">{business.insurance.bonded}</span>
													</div>
												</div>
												<div className="space-y-3">
													<div className="flex justify-between">
														<span className="text-muted-foreground">Insurance Carrier</span>
														<span className="font-medium text-foreground">{business.insurance.carrier}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">Policy Expires</span>
														<span className="font-medium text-foreground">{business.insurance.expires}</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Warranty Information */}
									<div className="space-y-4">
										<h4 className="font-medium text-foreground">Warranty & Guarantees</h4>
										<div className="p-4 border rounded-lg bg-card/30 border-border">
											<div className="space-y-3">
												{business.warranties.map((warranty, index) => (
													<div key={index} className="flex items-center space-x-2">
														<Shield className="w-4 h-4 text-green-400" />
														<span className="text-sm text-foreground">
															{warranty.type}: {warranty.duration}
														</span>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Service Guarantees */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Service Guarantees</h3>
										<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
											{business.guarantees.map((guarantee, index) => (
												<div key={index} className="flex items-center space-x-2">
													<CheckCircle className="flex-shrink-0 w-4 h-4 text-green-400" />
													<span className="text-sm text-foreground">{guarantee}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</section>

							{/* 8. 📹 VIDEO CONSULT SECTION - Modern Convenience */}
							<section ref={sectionRefs.videoConsult} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Video className="w-6 h-6 mr-3 text-primary" />
										📹 Video Consult
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									<div className="p-6 border bg-card/30 rounded-xl border-border">
										<div className="flex items-center gap-2 mb-4">
											<Badge variant="outline" className="text-blue-600 border-blue-200">
												HD Quality
											</Badge>
											<span className="text-sm font-medium text-blue-600">{business.videoConsultation.pricePerSession}</span>
										</div>

										<div className="grid gap-6 md:grid-cols-2">
											{/* Service Details */}
											<div className="space-y-4">
												<div className="grid grid-cols-2 gap-4">
													<div className="p-4 border rounded-lg bg-card/30 border-border">
														<p className="text-sm text-muted-foreground">Price</p>
														<p className="text-xl font-bold text-primary">{business.videoConsultation.pricePerSession}</p>
													</div>
													<div className="p-4 border rounded-lg bg-card/30 border-border">
														<p className="text-sm text-muted-foreground">Duration</p>
														<p className="text-xl font-bold text-foreground">{business.videoConsultation.duration}</p>
													</div>
												</div>
												<Button className="w-full bg-blue-600 hover:bg-blue-700">
													<Video className="w-4 h-4 mr-2" />
													Schedule Video Call
												</Button>
											</div>

											{/* What's Included */}
											<div>
												<h3 className="mb-3 font-semibold text-foreground">What&apos;s Included</h3>
												<div className="space-y-2">
													{business.videoConsultation.specialties.map((specialty, index) => (
														<div key={index} className="flex items-center space-x-2">
															<CheckCircle className="w-4 h-4 text-green-500" />
															<span className="text-sm text-foreground">{specialty}</span>
														</div>
													))}
												</div>
												<div className="mt-3">
													<p className="mb-2 text-sm text-muted-foreground">Languages:</p>
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
								</div>
							</section>

							{/* 9. 🚨 EMERGENCY SERVICES SECTION - Immediate Help */}
							<section ref={sectionRefs.emergencyServices} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Phone className="w-6 h-6 mr-3 text-primary" />
										🚨 Emergency Services
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-6">
									<div className="p-6 border bg-red-500/5 rounded-xl border-red-500/20">
										<div className="flex items-center gap-2 mb-4">
											<Badge className="text-white bg-red-500 animate-pulse">24/7</Badge>
											<span className="text-sm font-medium text-red-600">Emergency Response Available</span>
										</div>

										<div className="grid gap-6 md:grid-cols-2">
											{/* Response Details */}
											<div className="space-y-4">
												<div className="flex items-center mb-3 space-x-2">
													<Phone className="w-5 h-5 text-red-500" />
													<span className="font-semibold text-foreground">24/7 Emergency Response</span>
												</div>

												<div className="space-y-3">
													<div className="flex justify-between">
														<span className="text-muted-foreground">Response Time:</span>
														<span className="font-medium text-foreground">{business.emergencyServices.responseTime}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">Emergency Fee:</span>
														<span className="font-medium text-foreground">{business.emergencyServices.emergencyFee}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-muted-foreground">Available:</span>
														<span className="font-medium text-green-600">24/7/365</span>
													</div>
												</div>

												<Button className="w-full text-white bg-red-600 hover:bg-red-700">
													<Phone className="w-4 h-4 mr-2" />
													Call Emergency Line
												</Button>
											</div>

											{/* Emergency Types */}
											<div>
												<h3 className="mb-3 font-semibold text-foreground">Emergency Types We Handle:</h3>
												<div className="grid grid-cols-1 gap-2">
													{business.emergencyServices.serviceTypes.map((type, index) => (
														<div key={index} className="flex items-center space-x-2">
															<div className="w-2 h-2 bg-red-500 rounded-full"></div>
															<span className="text-sm text-foreground">{type}</span>
														</div>
													))}
												</div>
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* 10. 👁️ BUSINESS OPERATIONS SECTION - Transparency */}
							<section ref={sectionRefs.businessTransparency} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Eye className="w-6 h-6 mr-3 text-primary" />
										👁️ Business Operations
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Educational Introduction */}
									<div className="p-6 border bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border-blue-200/50">
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
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
													<div className="flex items-start justify-between mb-3">
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
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
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
										<div className="p-6 border rounded-xl bg-green-50/50 dark:bg-green-950/20 border-green-200/50">
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

							{/* 11. BUSINESS INFORMATION SECTION - Basic Details */}
							<section ref={sectionRefs.information} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Building className="w-6 h-6 mr-3 text-primary" />
										Business Information
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* About This Business */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">About This Business</h3>
										<p className="leading-relaxed text-muted-foreground">{business.description}</p>
									</div>

									{/* Business Details */}
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<div className="space-y-4">
											<h4 className="font-medium text-foreground">Company Details</h4>
											<div className="space-y-3 text-sm">
												<div className="flex justify-between">
													<span className="text-muted-foreground">Established</span>
													<span className="text-foreground">{business.established}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Employees</span>
													<span className="text-foreground">{business.employees}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Response Time</span>
													<span className="text-foreground">{business.responseTime}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Response Rate</span>
													<span className="text-foreground">{business.responseRate}%</span>
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<h4 className="font-medium text-foreground">Service Area</h4>
											<div className="space-y-2">
												<p className="text-sm text-muted-foreground">
													Primary: <span className="text-foreground">{business.serviceArea.primary}</span>
												</p>
												<p className="text-sm text-muted-foreground">
													Coverage: <span className="text-foreground">{business.serviceArea.coverage}</span>
												</p>
												<div className="flex flex-wrap gap-2 mt-2">
													{business.serviceArea.cities.map((city, index) => (
														<Badge key={index} variant="secondary" className="bg-muted text-foreground">
															{city}
														</Badge>
													))}
												</div>
											</div>
										</div>
									</div>

									{/* Payment Methods */}
									<div className="space-y-4">
										<h4 className="font-medium text-foreground">Payment Methods</h4>
										<div className="flex flex-wrap gap-2">
											{business.paymentMethods.map((method, index) => (
												<Badge key={index} variant="outline" className="border-border text-foreground">
													{method}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</section>

							{/* 12. RECOGNITION & COMMUNITY SECTION - Awards & Involvement */}
							<section ref={sectionRefs.recognition} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Award className="w-6 h-6 mr-3 text-primary" />
										Recognition & Community
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Awards & Recognition */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Awards & Recognition</h3>
										<div className="space-y-3">
											{business.awards.map((award, index) => (
												<div key={index} className="flex items-center space-x-3">
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
											))}
										</div>
									</div>
								</div>
							</section>

							{/* 13. 🛡️ WARRANTY TRACKER SECTION - Long-term Value */}
							<section ref={sectionRefs.warrantyTracker} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Shield className="w-6 h-6 mr-3 text-primary" />
										🛡️ Warranty Tracker
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									<div className="p-6 border bg-card/30 rounded-xl border-border">
										<div className="flex items-center gap-2 mb-4">
											<Badge className="text-purple-600 bg-purple-100">{business.warranties.length} Active</Badge>
											<span className="text-sm font-medium text-purple-600">Live Monitoring</span>
										</div>

										{/* Active Warranties */}
										<div className="space-y-4">
											{business.warranties.map((warranty, index) => (
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
													<div className="flex items-start justify-between mb-3">
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

										<Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
											<FileText className="w-4 h-4 mr-2" />
											File Warranty Claim
										</Button>
									</div>
								</div>
							</section>

							{/* 14. FAQ & SUPPORT SECTION - Address Concerns */}
							<section ref={sectionRefs.faq} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<MessageCircle className="w-6 h-6 mr-3 text-primary" />
										FAQ & Support
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Frequently Asked Questions */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h3>
										<div className="space-y-4">
											{business.faq.map((faq, index) => (
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
													<div className="space-y-2">
														<h5 className="font-medium text-foreground">{faq.question}</h5>
														<p className="text-sm text-muted-foreground">{faq.answer}</p>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Accessibility */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-foreground">Accessibility</h3>
										<div className="space-y-2">
											{business.accessibility.map((feature, index) => (
												<div key={index} className="flex items-center space-x-2">
													<CheckCircle className="flex-shrink-0 w-4 h-4 text-green-400" />
													<span className="text-sm text-foreground">{feature}</span>
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
													<div key={item.id} className="p-4 border rounded-lg bg-card/30 border-border">
														<div className="space-y-3">
															<div className="flex items-start space-x-2">
																<MessageCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
																<div className="space-y-1">
																	<p className="font-medium text-foreground">{item.question}</p>
																</div>
															</div>
															<div className="ml-6 space-y-2">
																<p className="text-sm text-muted-foreground">{item.answer}</p>
																<div className="flex items-center justify-between text-xs text-muted-foreground">
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

							{/* 15. 💼 CAREERS SECTION - Secondary Interest */}
							<section ref={sectionRefs.careers} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Users className="w-6 h-6 mr-3 text-primary" />
										💼 Careers
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									<div className="p-6 border bg-card/30 rounded-xl border-border">
										<div className="flex items-center gap-2 mb-4">
											<Badge className={business.careers.isHiring ? "text-white bg-green-500" : "text-gray-600 bg-gray-100"}>{business.careers.isHiring ? "Now Hiring" : "Not Hiring"}</Badge>
											<span className="text-sm font-medium text-green-600">{business.careers.companySize}</span>
										</div>

										{/* Company Culture */}
										<div className="mb-6 space-y-4">
											<h3 className="font-semibold text-foreground">Why Work With Us</h3>
											<p className="text-sm text-muted-foreground">{business.careers.culture}</p>

											<div className="grid gap-4 md:grid-cols-2">
												{/* Benefits */}
												<div>
													<h4 className="mb-3 font-medium text-foreground">Benefits & Perks</h4>
													<div className="space-y-2">
														{business.careers.benefits.map((benefit, index) => (
															<div key={index} className="flex items-center space-x-2">
																<CheckCircle className="w-4 h-4 text-green-500" />
																<span className="text-sm text-foreground">{benefit}</span>
															</div>
														))}
													</div>
												</div>

												{/* Additional Perks */}
												<div>
													<h4 className="mb-3 font-medium text-foreground">Additional Perks</h4>
													<div className="space-y-2">
														{business.careers.perks.map((perk, index) => (
															<div key={index} className="flex items-center space-x-2">
																<CheckCircle className="w-4 h-4 text-blue-500" />
																<span className="text-sm text-foreground">{perk}</span>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>

										{/* Open Positions */}
										{business.careers.isHiring && (
											<div className="mb-6 space-y-4">
												<h3 className="font-semibold text-foreground">Open Positions</h3>
												<div className="space-y-4">
													{business.careers.openPositions.map((position, index) => (
														<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
															<div className="flex items-start justify-between mb-3">
																<div>
																	<h4 className="font-medium text-foreground">{position.title}</h4>
																	<div className="flex items-center gap-2 mt-1">
																		<Badge variant="outline" className="text-xs">
																			{position.type}
																		</Badge>
																		<Badge variant="outline" className="text-xs">
																			{position.experience}
																		</Badge>
																		<span className="text-xs text-muted-foreground">Posted {position.posted}</span>
																	</div>
																</div>
																<div className="text-right">
																	<p className="font-semibold text-primary">{position.salary}</p>
																	<p className="text-xs text-muted-foreground">{position.location}</p>
																</div>
															</div>

															<p className="mb-3 text-sm text-muted-foreground">{position.description}</p>

															<div className="mb-3">
																<h5 className="mb-2 text-sm font-medium text-foreground">Requirements:</h5>
																<div className="space-y-1">
																	{position.requirements.map((req, reqIndex) => (
																		<div key={reqIndex} className="flex items-center space-x-2">
																			<div className="w-1.5 h-1.5 rounded-full bg-primary" />
																			<span className="text-sm text-foreground">{req}</span>
																		</div>
																	))}
																</div>
															</div>

															<Button size="sm" className="bg-primary hover:bg-primary/90">
																Apply Now
															</Button>
														</div>
													))}
												</div>
											</div>
										)}

										{/* Employee Testimonials */}
										<div className="space-y-4">
											<h3 className="font-semibold text-foreground">What Our Team Says</h3>
											<div className="grid gap-4 md:grid-cols-2">
												{business.careers.testimonials.map((testimonial, index) => (
													<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
														<p className="mb-3 text-sm italic text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
														<div className="flex justify-between text-xs text-muted-foreground">
															<span className="font-medium">{testimonial.employee}</span>
															<span>{testimonial.tenure} with company</span>
														</div>
													</div>
												))}
											</div>
										</div>

										<Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
											<Users className="w-4 h-4 mr-2" />
											View All Opportunities
										</Button>
									</div>
								</div>
							</section>

							{/* 16. 🤝 PARTNERSHIPS SECTION - Least Immediate Relevance */}
							<section ref={sectionRefs.partnerships} className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
								<div className="mb-8">
									<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
										<Building className="w-6 h-6 mr-3 text-primary" />
										🤝 Partnerships
									</h2>
									<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									<div className="p-6 border bg-card/30 rounded-xl border-border">
										<div className="flex items-center gap-2 mb-6">
											<Badge className="text-blue-600 bg-blue-100">Trusted Network</Badge>
											<span className="text-sm font-medium text-blue-600">Quality Partners</span>
										</div>

										{/* Supplier Partners */}
										<div className="mb-8 space-y-4">
											<h3 className="font-semibold text-foreground">Supplier Partners</h3>
											<div className="grid gap-4 md:grid-cols-2">
												{business.partnerships.supplierPartners.map((partner, index) => (
													<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
														<div className="flex items-start space-x-3">
															<div className="flex-shrink-0 w-12 h-12 overflow-hidden border rounded-lg bg-muted">
																<img src={partner.logo} alt={partner.name} className="object-cover w-full h-full" />
															</div>
															<div className="flex-1 min-w-0">
																<h4 className="font-medium text-foreground">{partner.name}</h4>
																<p className="text-sm text-primary">{partner.type}</p>
																<p className="text-xs text-muted-foreground">{partner.relationship}</p>
																<p className="mt-2 text-sm text-foreground">{partner.benefits}</p>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>

										{/* Service Partners */}
										<div className="mb-8 space-y-4">
											<h3 className="font-semibold text-foreground">Service Partners</h3>
											<div className="space-y-3">
												{business.partnerships.servicePartners.map((partner, index) => (
													<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
														<div className="flex items-start justify-between">
															<div>
																<h4 className="font-medium text-foreground">{partner.name}</h4>
																<p className="text-sm text-primary">{partner.type}</p>
																<Badge variant="outline" className="mt-1 text-xs">
																	{partner.relationship}
																</Badge>
															</div>
														</div>
														<p className="mt-2 text-sm text-muted-foreground">{partner.description}</p>
													</div>
												))}
											</div>
										</div>

										{/* Community Partners */}
										<div className="mb-8 space-y-4">
											<h3 className="font-semibold text-foreground">Community Involvement</h3>
											<div className="space-y-3">
												{business.partnerships.communityPartners.map((partner, index) => (
													<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
														<div className="flex items-start justify-between mb-2">
															<div>
																<h4 className="font-medium text-foreground">{partner.name}</h4>
																<p className="text-sm text-orange-600">{partner.type}</p>
															</div>
															<Badge variant="secondary" className="text-xs">
																{partner.involvement}
															</Badge>
														</div>
														<p className="text-sm text-muted-foreground">{partner.description}</p>
													</div>
												))}
											</div>
										</div>

										{/* Certifications & Awards */}
										<div className="space-y-4">
											<h3 className="font-semibold text-foreground">Certifications & Recognition</h3>
											<div className="grid gap-4 md:grid-cols-2">
												{business.partnerships.certifications.map((cert, index) => (
													<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
														<div className="flex items-start justify-between mb-2">
															<h4 className="font-medium text-foreground">{cert.name}</h4>
															<div className="flex gap-2">
																{cert.grade && <Badge className="text-white bg-green-500">{cert.grade}</Badge>}
																{cert.year && <Badge variant="outline">{cert.year}</Badge>}
															</div>
														</div>
														{cert.since && <p className="text-xs text-muted-foreground">Member since {cert.since}</p>}
														{cert.achievement && <p className="text-sm text-primary">{cert.achievement}</p>}
														<p className="mt-2 text-sm text-muted-foreground">{cert.benefits}</p>
													</div>
												))}
											</div>
										</div>
									</div>

									<Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
										<Building className="w-4 h-4 mr-2" />
										Partner With Us
									</Button>
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>

			{/* Photo Modal */}
			{showAllPhotos && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
					<div className="relative flex flex-col w-full h-full">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md border-border">
							<div className="flex items-center space-x-4">
								<h3 className="font-semibold text-foreground">
									{selectedImageIndex + 1} / {allImages.length}
								</h3>
								<Badge variant="secondary" className="bg-muted text-foreground">
									{selectedImageIndex < business.photos.length ? "Business Photo" : "Portfolio"}
								</Badge>
							</div>
							<div className="flex items-center space-x-2">
								<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
									<Share className="w-4 h-4 mr-2" />
									Share
								</Button>
								<Button variant="ghost" size="sm" onClick={() => setShowAllPhotos(false)} className="text-muted-foreground hover:text-foreground">
									<X className="w-4 h-4" />
								</Button>
							</div>
						</div>

						{/* Modal Content */}
						<div className="flex items-center justify-center flex-1 p-4">
							<div className="relative max-w-4xl max-h-full">
								<img src={allImages[selectedImageIndex]} alt={`${business.name} photo ${selectedImageIndex + 1}`} className="object-contain max-w-full max-h-full rounded-lg" />

								{/* Navigation Arrows */}
								<Button variant="ghost" size="sm" className="absolute -translate-y-1/2 left-4 top-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90" onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}>
									<ChevronLeft className="w-5 h-5" />
								</Button>
								<Button variant="ghost" size="sm" className="absolute -translate-y-1/2 right-4 top-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90" onClick={() => setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}>
									<ChevronRight className="w-5 h-5" />
								</Button>
							</div>
						</div>

						{/* Thumbnail Navigation */}
						<div className="p-4 border-t bg-background/80 backdrop-blur-md border-border">
							<div className="flex pb-2 space-x-2 overflow-x-auto">
								{allImages.map((image, index) => (
									<button key={index} onClick={() => setSelectedImageIndex(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === selectedImageIndex ? "border-primary" : "border-transparent hover:border-muted-foreground"}`}>
										<img src={image} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Enhanced Floating Scroll Spy Navigation - Desktop Only */}
			{showScrollSpy && (
				<div
					className="fixed z-30 hidden lg:block left-6"
					style={{
						top: `${headerHeight + 16}px`,
						bottom: "2em",
					}}
				>
					<div className="flex flex-col border shadow-lg w-fit bg-card/90 backdrop-blur-md border-border rounded-xl" style={{ overflow: "visible" }}>
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
													className={`absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 z-[9999] ${isCertification ? "bg-gradient-to-r from-blue-600 to-green-600 text-white border border-blue-500/50 shadow-xl" : isActive ? "bg-primary text-primary-foreground border border-primary/20" : ""}`}
													style={{
														top: "50%",
														transform: "translateY(-50%)",
													}}
												>
													{isCertification ? (
														<div className="flex items-center space-x-2">
															<Award className="w-4 h-4" />
															<span className="font-semibold">{item.label}</span>
															<div className="px-2 py-0.5 bg-white/20 rounded text-xs">NEW</div>
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
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
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
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
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
			<div className="fixed z-40 lg:hidden bottom-4 right-4 sm:bottom-6 sm:right-6">
				<Button size="default" onClick={() => setShowReviewModal(true)} className="h-12 px-4 transition-all duration-200 transform rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-2xl hover:scale-105 active:scale-95">
					<Plus className="w-4 h-4 mr-2" />
					<span className="text-sm font-semibold">Review</span>
				</Button>
			</div>
		</div>
	);
}
