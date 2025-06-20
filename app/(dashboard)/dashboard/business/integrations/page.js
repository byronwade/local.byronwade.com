"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import { ChevronDown, ChevronUp, Zap, Search } from "lucide-react";

export default function IntegrationsMarketplace() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedIndustry, setSelectedIndustry] = useState("All");
	const [expandedFeatures, setExpandedFeatures] = useState(new Set());
	const [profile, setProfile] = useState({
		features: {
			menu: { enabled: true, priority: 1 },
			gallery: { enabled: true, priority: 2 },
			reviews: { enabled: true, priority: 3 },
			services: { enabled: true, priority: 4 },
			hours: { enabled: true, priority: 5 },
			contact: { enabled: true, priority: 6 },
		},
	});

	const toggleFeatureExpansion = (featureKey) => {
		const newExpanded = new Set(expandedFeatures);
		if (newExpanded.has(featureKey)) {
			newExpanded.delete(featureKey);
		} else {
			newExpanded.add(featureKey);
		}
		setExpandedFeatures(newExpanded);
	};

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
	};

	const updateFeatureSetting = (featureKey, settingKey, value) => {
		setProfile((prev) => ({
			...prev,
			features: {
				...prev.features,
				[featureKey]: {
					...prev.features[featureKey],
					settings: {
						...prev.features[featureKey]?.settings,
						[settingKey]: value,
					},
				},
			},
		}));
	};

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
			popular: false,
			settings: {
				title: "Certifications & Awards",
				showBadges: true,
				showExpiry: false,
				showDescription: true,
			},
		},
		blog: {
			icon: "📝",
			title: "Blog",
			description: "Share industry insights and company updates",
			category: "Content",
			popular: false,
			settings: {
				title: "Blog",
				showAuthor: true,
				showDate: true,
				showCategories: true,
			},
		},
		events: {
			icon: "🎪",
			title: "Events",
			description: "Promote upcoming events and workshops",
			category: "Marketing",
			popular: false,
			settings: {
				title: "Events",
				showCalendar: true,
				showRegistration: true,
				showLocation: true,
			},
		},
		team: {
			icon: "👥",
			title: "Team",
			description: "Introduce your team members and their expertise",
			category: "Content",
			popular: false,
			settings: {
				title: "Our Team",
				showPhotos: true,
				showRoles: true,
				showBio: true,
			},
		},
		portfolio: {
			icon: "🎨",
			title: "Portfolio",
			description: "Showcase your best work and projects",
			category: "Content",
			popular: false,
			settings: {
				title: "Portfolio",
				showCategories: true,
				showDetails: true,
				showClient: false,
			},
		},

		// Healthcare Industry Features
		medical_licenses: {
			icon: "🏥",
			title: "Medical Licenses",
			description: "Display medical licenses, board certifications, and credentials",
			category: "Healthcare",
			popular: true,
			settings: {
				title: "Medical Credentials",
				showLicenseNumbers: false,
				showExpiryDates: true,
				showSpecialties: true,
				showBoardCertifications: true,
			},
		},
		insurance_accepted: {
			icon: "💳",
			title: "Insurance Accepted",
			description: "List accepted insurance providers and payment options",
			category: "Healthcare",
			popular: true,
			settings: {
				title: "Insurance & Payment",
				showInsuranceList: true,
				showSelfPay: true,
				showPaymentPlans: true,
				showSlidingScale: false,
			},
		},
		patient_forms: {
			icon: "📋",
			title: "Patient Forms",
			description: "Provide downloadable patient forms and paperwork",
			category: "Healthcare",
			popular: false,
			settings: {
				title: "Patient Forms",
				showNewPatient: true,
				showMedicalHistory: true,
				showConsentForms: true,
				showInsuranceForms: true,
			},
		},
		treatments: {
			icon: "💊",
			title: "Treatments & Procedures",
			description: "List medical treatments, procedures, and specialties",
			category: "Healthcare",
			popular: true,
			settings: {
				title: "Treatments & Procedures",
				showSpecialties: true,
				showProcedures: true,
				showConditions: true,
				showRecoveryInfo: false,
			},
		},
		appointment_types: {
			icon: "🩺",
			title: "Appointment Types",
			description: "Different types of appointments and consultations",
			category: "Healthcare",
			popular: false,
			settings: {
				title: "Appointment Types",
				showConsultations: true,
				showFollowUps: true,
				showEmergency: true,
				showTelemedicine: true,
			},
		},
		healthcare_team: {
			icon: "👨‍⚕️",
			title: "Healthcare Team",
			description: "Introduce doctors, nurses, and medical staff",
			category: "Healthcare",
			popular: true,
			settings: {
				title: "Our Medical Team",
				showCredentials: true,
				showSpecialties: true,
				showLanguages: true,
				showAvailability: false,
			},
		},
		medical_equipment: {
			icon: "🔬",
			title: "Medical Equipment",
			description: "Showcase advanced medical technology and equipment",
			category: "Healthcare",
			popular: false,
			settings: {
				title: "Medical Technology",
				showEquipment: true,
				showTechnology: true,
				showFacilities: true,
				showCertifications: true,
			},
		},
		healthcare_services: {
			icon: "🩹",
			title: "Healthcare Services",
			description: "Comprehensive list of medical services offered",
			category: "Healthcare",
			popular: true,
			settings: {
				title: "Healthcare Services",
				showPrimaryCare: true,
				showSpecialtyCare: true,
				showPreventive: true,
				showDiagnostic: true,
			},
		},
		patient_testimonials: {
			icon: "💝",
			title: "Patient Testimonials",
			description: "Share patient success stories and experiences",
			category: "Healthcare",
			popular: false,
			settings: {
				title: "Patient Stories",
				showAnonymous: true,
				showPhotos: false,
				showConditions: false,
				showOutcomes: true,
			},
		},
		healthcare_education: {
			icon: "📚",
			title: "Health Education",
			description: "Educational content about health and wellness",
			category: "Healthcare",
			popular: false,
			settings: {
				title: "Health Education",
				showArticles: true,
				showVideos: true,
				showResources: true,
				showPrevention: true,
			},
		},

		// Real Estate Industry Features
		property_listings: {
			icon: "🏠",
			title: "Property Listings",
			description: "Showcase available properties for sale or rent",
			category: "Real Estate",
			popular: true,
			settings: {
				title: "Property Listings",
				showPhotos: true,
				showVirtualTours: true,
				showPrice: true,
				showDetails: true,
			},
		},
		agent_credentials: {
			icon: "👔",
			title: "Agent Credentials",
			description: "Display real estate licenses, certifications, and achievements",
			category: "Real Estate",
			popular: true,
			settings: {
				title: "Agent Credentials",
				showLicense: true,
				showCertifications: true,
				showAwards: true,
				showExperience: true,
			},
		},
		market_analysis: {
			icon: "📊",
			title: "Market Analysis",
			description: "Local real estate market insights and trends",
			category: "Real Estate",
			popular: false,
			settings: {
				title: "Market Analysis",
				showTrends: true,
				showComparables: true,
				showForecasts: true,
				showNeighborhood: true,
			},
		},
		mortgage_calculator: {
			icon: "🧮",
			title: "Mortgage Calculator",
			description: "Interactive mortgage payment calculator",
			category: "Real Estate",
			popular: true,
			settings: {
				title: "Mortgage Calculator",
				showPaymentCalc: true,
				showAffordability: true,
				showRefinance: true,
				showDownPayment: true,
			},
		},
		home_valuation: {
			icon: "💰",
			title: "Home Valuation",
			description: "Free home value estimates and assessments",
			category: "Real Estate",
			popular: true,
			settings: {
				title: "Home Valuation",
				showInstantEstimate: true,
				showDetailedReport: true,
				showComparables: true,
				showMarketTrends: true,
			},
		},
		neighborhood_info: {
			icon: "🏘️",
			title: "Neighborhood Info",
			description: "Local area information and community details",
			category: "Real Estate",
			popular: false,
			settings: {
				title: "Neighborhood Info",
				showSchools: true,
				showAmenities: true,
				showCrimeStats: false,
				showTransportation: true,
			},
		},
		closing_costs: {
			icon: "📋",
			title: "Closing Costs",
			description: "Estimate closing costs and fees for home purchases",
			category: "Real Estate",
			popular: false,
			settings: {
				title: "Closing Costs",
				showCalculator: true,
				showBreakdown: true,
				showTimeline: true,
				showRequirements: true,
			},
		},
		real_estate_services: {
			icon: "🔑",
			title: "Real Estate Services",
			description: "Comprehensive real estate services offered",
			category: "Real Estate",
			popular: true,
			settings: {
				title: "Our Services",
				showBuying: true,
				showSelling: true,
				showRenting: true,
				showInvestment: true,
			},
		},
		property_photos: {
			icon: "📷",
			title: "Property Photos",
			description: "Professional property photography and virtual tours",
			category: "Real Estate",
			popular: true,
			settings: {
				title: "Property Photos",
				showVirtualTours: true,
				showDronePhotos: true,
				showInterior: true,
				showExterior: true,
			},
		},
		client_reviews: {
			icon: "⭐",
			title: "Client Reviews",
			description: "Reviews from satisfied home buyers and sellers",
			category: "Real Estate",
			popular: true,
			settings: {
				title: "Client Reviews",
				showTestimonials: true,
				showRatings: true,
				showPhotos: false,
				showTransactions: true,
			},
		},

		// Legal Industry Features
		legal_services: {
			icon: "⚖️",
			title: "Legal Services",
			description: "Practice areas and legal services offered",
			category: "Legal",
			popular: true,
			settings: {
				title: "Legal Services",
				showPracticeAreas: true,
				showSpecializations: true,
				showConsultations: true,
				showRepresentation: true,
			},
		},
		attorney_credentials: {
			icon: "👨‍💼",
			title: "Attorney Credentials",
			description: "Law licenses, bar admissions, and legal credentials",
			category: "Legal",
			popular: true,
			settings: {
				title: "Attorney Credentials",
				showBarAdmissions: true,
				showEducation: true,
				showExperience: true,
				showSpecializations: true,
			},
		},
		case_results: {
			icon: "🏆",
			title: "Case Results",
			description: "Successful case outcomes and settlements",
			category: "Legal",
			popular: false,
			settings: {
				title: "Case Results",
				showSettlements: true,
				showVerdicts: true,
				showAmounts: false,
				showCaseTypes: true,
			},
		},
		legal_resources: {
			icon: "📚",
			title: "Legal Resources",
			description: "Educational legal content and resources",
			category: "Legal",
			popular: false,
			settings: {
				title: "Legal Resources",
				showArticles: true,
				showFAQs: true,
				showForms: true,
				showLaws: true,
			},
		},
		consultation_booking: {
			icon: "📅",
			title: "Legal Consultation",
			description: "Book free legal consultations and case reviews",
			category: "Legal",
			popular: true,
			settings: {
				title: "Free Consultation",
				showAvailability: true,
				showCaseReview: true,
				showVideoConsult: true,
				showInPerson: true,
			},
		},
		client_testimonials: {
			icon: "💬",
			title: "Client Testimonials",
			description: "Reviews from satisfied legal clients",
			category: "Legal",
			popular: true,
			settings: {
				title: "Client Testimonials",
				showAnonymous: true,
				showCaseTypes: true,
				showOutcomes: true,
				showRatings: true,
			},
		},
		legal_team: {
			icon: "👥",
			title: "Legal Team",
			description: "Meet the attorneys and legal professionals",
			category: "Legal",
			popular: true,
			settings: {
				title: "Our Legal Team",
				showAttorneys: true,
				showParalegals: true,
				showSupport: true,
				showSpecializations: true,
			},
		},
		legal_forms: {
			icon: "📄",
			title: "Legal Forms",
			description: "Downloadable legal forms and documents",
			category: "Legal",
			popular: false,
			settings: {
				title: "Legal Forms",
				showContracts: true,
				showAgreements: true,
				showPetitions: true,
				showDisclaimers: true,
			},
		},

		// Automotive Industry Features
		vehicle_services: {
			icon: "🚗",
			title: "Vehicle Services",
			description: "Automotive repair and maintenance services",
			category: "Automotive",
			popular: true,
			settings: {
				title: "Vehicle Services",
				showRepairs: true,
				showMaintenance: true,
				showDiagnostics: true,
				showWarranty: true,
			},
		},
		service_scheduling: {
			icon: "🔧",
			title: "Service Scheduling",
			description: "Book vehicle maintenance and repair appointments",
			category: "Automotive",
			popular: true,
			settings: {
				title: "Service Scheduling",
				showOnlineBooking: true,
				showServiceTypes: true,
				showEstimates: true,
				showReminders: true,
			},
		},
		parts_catalog: {
			icon: "🔩",
			title: "Parts Catalog",
			description: "Browse and order automotive parts",
			category: "Automotive",
			popular: false,
			settings: {
				title: "Parts Catalog",
				showOEM: true,
				showAftermarket: true,
				showPricing: true,
				showAvailability: true,
			},
		},
		warranty_info: {
			icon: "🛡️",
			title: "Warranty Information",
			description: "Vehicle warranty coverage and terms",
			category: "Automotive",
			popular: false,
			settings: {
				title: "Warranty Information",
				showCoverage: true,
				showTerms: true,
				showExpiry: true,
				showClaims: true,
			},
		},
		vehicle_diagnostics: {
			icon: "📊",
			title: "Vehicle Diagnostics",
			description: "Online vehicle diagnostic tools and check engine light help",
			category: "Automotive",
			popular: false,
			settings: {
				title: "Vehicle Diagnostics",
				showCodeReader: true,
				showTroubleshooting: true,
				showEstimates: true,
				showHistory: true,
			},
		},
		technician_credentials: {
			icon: "👨‍🔧",
			title: "Technician Credentials",
			description: "ASE certifications and technician qualifications",
			category: "Automotive",
			popular: true,
			settings: {
				title: "Technician Credentials",
				showASECert: true,
				showSpecializations: true,
				showExperience: true,
				showTraining: true,
			},
		},
		service_history: {
			icon: "📋",
			title: "Service History",
			description: "Track vehicle maintenance and service records",
			category: "Automotive",
			popular: false,
			settings: {
				title: "Service History",
				showRecords: true,
				showMaintenance: true,
				showWarranty: true,
				showRecommendations: true,
			},
		},
		roadside_assistance: {
			icon: "🆘",
			title: "Roadside Assistance",
			description: "24/7 roadside assistance and emergency services",
			category: "Automotive",
			popular: true,
			settings: {
				title: "Roadside Assistance",
				showEmergency: true,
				showTowing: true,
				showJumpStart: true,
				showLockout: true,
			},
		},

		// Food Service Industry Features
		menu_items: {
			icon: "🍕",
			title: "Menu Items",
			description: "Detailed menu with prices, descriptions, and photos",
			category: "Food Service",
			popular: true,
			settings: {
				title: "Our Menu",
				showPrices: true,
				showDescriptions: true,
				showPhotos: true,
				showAllergens: true,
			},
		},
		online_ordering: {
			icon: "🛒",
			title: "Online Ordering",
			description: "Order food online for pickup or delivery",
			category: "Food Service",
			popular: true,
			settings: {
				title: "Order Online",
				showPickup: true,
				showDelivery: true,
				showPayment: true,
				showTracking: true,
			},
		},
		daily_specials: {
			icon: "🎯",
			title: "Daily Specials",
			description: "Daily deals, happy hour, and special offers",
			category: "Food Service",
			popular: true,
			settings: {
				title: "Daily Specials",
				showHappyHour: true,
				showDailyDeals: true,
				showSeasonal: true,
				showExpiry: true,
			},
		},
		reservations: {
			icon: "📞",
			title: "Reservations",
			description: "Book tables and make restaurant reservations",
			category: "Food Service",
			popular: true,
			settings: {
				title: "Make a Reservation",
				showOnlineBooking: true,
				showPartySize: true,
				showSpecialRequests: true,
				showConfirmation: true,
			},
		},
		catering_services: {
			icon: "🎉",
			title: "Catering Services",
			description: "Catering for events, parties, and corporate functions",
			category: "Food Service",
			popular: false,
			settings: {
				title: "Catering Services",
				showPackages: true,
				showCustomMenus: true,
				showDelivery: true,
				showSetup: true,
			},
		},
		ingredients: {
			icon: "🥬",
			title: "Ingredients",
			description: "Fresh, local, and organic ingredient information",
			category: "Food Service",
			popular: false,
			settings: {
				title: "Our Ingredients",
				showLocal: true,
				showOrganic: true,
				showSeasonal: true,
				showSourcing: true,
			},
		},
		chef_profiles: {
			icon: "👨‍🍳",
			title: "Chef Profiles",
			description: "Meet the chefs and culinary team",
			category: "Food Service",
			popular: false,
			settings: {
				title: "Our Chefs",
				showBios: true,
				showExperience: true,
				showSpecialties: true,
				showAwards: true,
			},
		},
		food_allergies: {
			icon: "⚠️",
			title: "Food Allergies",
			description: "Allergen information and dietary accommodations",
			category: "Food Service",
			popular: true,
			settings: {
				title: "Allergen Information",
				showAllergens: true,
				showGlutenFree: true,
				showVegan: true,
				showAccommodations: true,
			},
		},

		// Fitness & Wellness
		fitness_classes: {
			icon: "🏋️",
			title: "Fitness Classes",
			description: "Class schedules, types, and instructor bios",
			category: "Fitness",
			industry: "Fitness & Wellness",
			popular: true,
			settings: {
				title: "Class Schedule",
				showTypes: true,
				showInstructors: true,
				showCapacity: true,
			},
		},
		trainer_profiles: {
			icon: "🤸",
			title: "Trainer Profiles",
			description: "Meet the trainers and their certifications",
			category: "Fitness",
			industry: "Fitness & Wellness",
			popular: false,
			settings: {
				title: "Trainer Bios",
				showCertifications: true,
				showSpecialties: true,
				showExperience: true,
			},
		},
		membership_plans: {
			icon: "💳",
			title: "Membership Plans",
			description: "List of available membership options and pricing",
			category: "Fitness",
			industry: "Fitness & Wellness",
			popular: true,
			settings: {
				title: "Membership Options",
				showPricing: true,
				showBenefits: true,
				showDuration: true,
			},
		},
		// Education
		course_catalog: {
			icon: "📚",
			title: "Course Catalog",
			description: "List of courses, schedules, and instructors",
			category: "Education",
			industry: "Education",
			popular: true,
			settings: {
				title: "Courses",
				showSchedule: true,
				showInstructors: true,
				showCredits: true,
			},
		},
		teacher_certifications: {
			icon: "👩‍🏫",
			title: "Teacher Certifications",
			description: "Display teacher credentials and certifications",
			category: "Education",
			industry: "Education",
			popular: false,
			settings: {
				title: "Certifications",
				showDegrees: true,
				showCertifications: true,
				showExperience: true,
			},
		},
		accreditation: {
			icon: "🎓",
			title: "Accreditation",
			description: "School or program accreditation details",
			category: "Education",
			industry: "Education",
			popular: true,
			settings: {
				title: "Accreditation",
				showAgencies: true,
				showYears: true,
				showStatus: true,
			},
		},
		// Construction
		project_portfolio: {
			icon: "🏗️",
			title: "Project Portfolio",
			description: "Showcase completed construction projects",
			category: "Construction",
			industry: "Construction",
			popular: true,
			settings: {
				title: "Projects",
				showPhotos: true,
				showDetails: true,
				showClient: true,
			},
		},
		safety_certifications: {
			icon: "🦺",
			title: "Safety Certifications",
			description: "Display OSHA and other safety credentials",
			category: "Construction",
			industry: "Construction",
			popular: false,
			settings: {
				title: "Safety Credentials",
				showOSHA: true,
				showCertifications: true,
				showExpiry: true,
			},
		},
		equipment_list: {
			icon: "🚜",
			title: "Equipment List",
			description: "List of construction equipment and capabilities",
			category: "Construction",
			industry: "Construction",
			popular: false,
			settings: {
				title: "Equipment",
				showType: true,
				showCapacity: true,
				showAvailability: true,
			},
		},
		// Beauty & Personal Care
		stylist_portfolio: {
			icon: "💇",
			title: "Stylist Portfolio",
			description: "Showcase stylist work and specialties",
			category: "Beauty",
			industry: "Beauty & Personal Care",
			popular: true,
			settings: {
				title: "Portfolio",
				showPhotos: true,
				showSpecialties: true,
				showCertifications: true,
			},
		},
		treatment_menu: {
			icon: "💅",
			title: "Treatment Menu",
			description: "List of beauty treatments and pricing",
			category: "Beauty",
			industry: "Beauty & Personal Care",
			popular: true,
			settings: {
				title: "Treatments",
				showPricing: true,
				showDuration: true,
				showDescription: true,
			},
		},
		beauty_booking: {
			icon: "📅",
			title: "Beauty Booking",
			description: "Book beauty and personal care appointments",
			category: "Beauty",
			industry: "Beauty & Personal Care",
			popular: true,
			settings: {
				title: "Book Appointment",
				showOnline: true,
				showWalkIn: true,
				showSpecialRequests: true,
			},
		},
		// Home Services
		license_display: {
			icon: "📜",
			title: "License Display",
			description: "Show home service licenses and credentials",
			category: "Home Services",
			industry: "Home Services",
			popular: true,
			settings: {
				title: "Licenses",
				showNumbers: true,
				showExpiry: true,
				showStates: true,
			},
		},
		service_area_map: {
			icon: "🗺️",
			title: "Service Area Map",
			description: "Map of service coverage areas",
			category: "Home Services",
			industry: "Home Services",
			popular: true,
			settings: {
				title: "Service Area",
				showMap: true,
				showZipCodes: true,
				showCities: true,
			},
		},
		before_after_gallery: {
			icon: "🔄",
			title: "Before & After Gallery",
			description: "Showcase before and after project photos",
			category: "Home Services",
			industry: "Home Services",
			popular: false,
			settings: {
				title: "Gallery",
				showBefore: true,
				showAfter: true,
				showDescription: true,
			},
		},
		// Retail
		product_catalog: {
			icon: "🛍️",
			title: "Product Catalog",
			description: "Showcase products for sale with details",
			category: "Retail",
			industry: "Retail",
			popular: true,
			settings: {
				title: "Products",
				showPricing: true,
				showInventory: true,
				showCategories: true,
			},
		},
		loyalty_program: {
			icon: "🎁",
			title: "Loyalty Program",
			description: "Customer rewards and loyalty program info",
			category: "Retail",
			industry: "Retail",
			popular: true,
			settings: {
				title: "Loyalty Program",
				showPoints: true,
				showRewards: true,
				showTiers: true,
			},
		},
		store_locations: {
			icon: "📍",
			title: "Store Locations",
			description: "List of store locations and hours",
			category: "Retail",
			industry: "Retail",
			popular: true,
			settings: {
				title: "Locations",
				showMap: true,
				showHours: true,
				showContact: true,
			},
		},
		// Hospitality
		room_types: {
			icon: "🛏️",
			title: "Room Types",
			description: "Hotel room types, amenities, and rates",
			category: "Hospitality",
			industry: "Hospitality",
			popular: true,
			settings: {
				title: "Rooms",
				showAmenities: true,
				showRates: true,
				showPhotos: true,
			},
		},
		amenities: {
			icon: "🏊",
			title: "Amenities",
			description: "Hotel amenities and guest services",
			category: "Hospitality",
			industry: "Hospitality",
			popular: true,
			settings: {
				title: "Amenities",
				showPool: true,
				showGym: true,
				showBreakfast: true,
			},
		},
		guest_reviews: {
			icon: "📝",
			title: "Guest Reviews",
			description: "Hotel guest reviews and ratings",
			category: "Hospitality",
			industry: "Hospitality",
			popular: true,
			settings: {
				title: "Reviews",
				showRatings: true,
				showComments: true,
				showPhotos: false,
			},
		},
		booking_engine: {
			icon: "🔗",
			title: "Booking Engine",
			description: "Direct hotel booking integration",
			category: "Hospitality",
			industry: "Hospitality",
			popular: true,
			settings: {
				title: "Booking",
				showDirect: true,
				showThirdParty: true,
				showConfirmation: true,
			},
		},
		// Nonprofits
		donation_links: {
			icon: "💸",
			title: "Donation Links",
			description: "Accept donations online",
			category: "Nonprofit",
			industry: "Nonprofit",
			popular: true,
			settings: {
				title: "Donations",
				showOneTime: true,
				showRecurring: true,
				showGoal: true,
			},
		},
		volunteer_opportunities: {
			icon: "🙋",
			title: "Volunteer Opportunities",
			description: "List of volunteer roles and sign-up info",
			category: "Nonprofit",
			industry: "Nonprofit",
			popular: true,
			settings: {
				title: "Volunteering",
				showRoles: true,
				showRequirements: true,
				showSchedule: true,
			},
		},
		impact_stats: {
			icon: "📈",
			title: "Impact Stats",
			description: "Showcase nonprofit impact and results",
			category: "Nonprofit",
			industry: "Nonprofit",
			popular: false,
			settings: {
				title: "Impact",
				showBeneficiaries: true,
				showProjects: true,
				showStats: true,
			},
		},
		// Technology
		tech_certifications: {
			icon: "💻",
			title: "Tech Certifications",
			description: "Display technology certifications and skills",
			category: "Technology",
			industry: "Technology",
			popular: true,
			settings: {
				title: "Certifications",
				showVendors: true,
				showSkills: true,
				showProjects: true,
			},
		},
		case_studies: {
			icon: "📄",
			title: "Case Studies",
			description: "Technology project case studies and results",
			category: "Technology",
			industry: "Technology",
			popular: false,
			settings: {
				title: "Case Studies",
				showClient: true,
				showResults: true,
				showTechStack: true,
			},
		},
		integrations: {
			icon: "🔌",
			title: "Integrations",
			description: "List of supported software integrations",
			category: "Technology",
			industry: "Technology",
			popular: true,
			settings: {
				title: "Integrations",
				showAPIs: true,
				showPartners: true,
				showDocs: true,
			},
		},
		// Creative Agencies
		agency_portfolio: {
			icon: "🎨",
			title: "Agency Portfolio",
			description: "Showcase creative work and campaigns",
			category: "Creative",
			industry: "Creative",
			popular: true,
			settings: {
				title: "Portfolio",
				showProjects: true,
				showAwards: true,
				showClients: true,
			},
		},
		agency_awards: {
			icon: "🏆",
			title: "Agency Awards",
			description: "Display creative awards and recognitions",
			category: "Creative",
			industry: "Creative",
			popular: false,
			settings: {
				title: "Awards",
				showYear: true,
				showProject: true,
				showType: true,
			},
		},
		client_testimonials_creative: {
			icon: "💬",
			title: "Client Testimonials",
			description: "Testimonials from creative clients",
			category: "Creative",
			industry: "Creative",
			popular: true,
			settings: {
				title: "Testimonials",
				showClient: true,
				showProject: true,
				showResults: true,
			},
		},
		// Pet Care
		pet_services: {
			icon: "🐾",
			title: "Pet Services",
			description: "Pet grooming, boarding, and veterinary services",
			category: "Pet Care",
			industry: "Pet Care",
			popular: true,
			settings: {
				title: "Services",
				showGrooming: true,
				showBoarding: true,
				showVet: true,
			},
		},
		pet_certifications: {
			icon: "📜",
			title: "Pet Certifications",
			description: "Display pet care certifications and credentials",
			category: "Pet Care",
			industry: "Pet Care",
			popular: false,
			settings: {
				title: "Certifications",
				showTrainer: true,
				showVet: true,
				showGroomer: true,
			},
		},
		adoption_profiles: {
			icon: "🐶",
			title: "Adoption Profiles",
			description: "Pet adoption listings and profiles",
			category: "Pet Care",
			industry: "Pet Care",
			popular: true,
			settings: {
				title: "Adoption",
				showPhotos: true,
				showBio: true,
				showRequirements: true,
			},
		},
		// Logistics
		fleet_info: {
			icon: "🚚",
			title: "Fleet Info",
			description: "Fleet size, vehicle types, and service areas",
			category: "Logistics",
			industry: "Logistics",
			popular: true,
			settings: {
				title: "Fleet",
				showVehicles: true,
				showCapacity: true,
				showCoverage: true,
			},
		},
		tracking_tools: {
			icon: "📦",
			title: "Tracking Tools",
			description: "Shipment tracking and delivery status",
			category: "Logistics",
			industry: "Logistics",
			popular: true,
			settings: {
				title: "Tracking",
				showStatus: true,
				showETA: true,
				showNotifications: true,
			},
		},
		logistics_certifications: {
			icon: "📜",
			title: "Logistics Certifications",
			description: "Display logistics and transportation credentials",
			category: "Logistics",
			industry: "Logistics",
			popular: false,
			settings: {
				title: "Certifications",
				showDOT: true,
				showFMCSA: true,
				showHazmat: true,
			},
		},
		// Entertainment
		event_calendar: {
			icon: "📅",
			title: "Event Calendar",
			description: "Upcoming events, shows, and ticketing",
			category: "Entertainment",
			industry: "Entertainment",
			popular: true,
			settings: {
				title: "Events",
				showDates: true,
				showTickets: true,
				showLocation: true,
			},
		},
		artist_profiles: {
			icon: "🎤",
			title: "Artist Profiles",
			description: "Musician, actor, or performer bios and media",
			category: "Entertainment",
			industry: "Entertainment",
			popular: true,
			settings: {
				title: "Artists",
				showBio: true,
				showMedia: true,
				showAwards: true,
			},
		},
		showreels: {
			icon: "🎬",
			title: "Showreels",
			description: "Video showreels and performance highlights",
			category: "Entertainment",
			industry: "Entertainment",
			popular: false,
			settings: {
				title: "Showreels",
				showVideos: true,
				showProjects: true,
				showAwards: true,
			},
		},
	};

	const categories = ["All", "Content", "Business", "Social", "Tools", "Marketing", "Trust"];
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
							</div>
							<p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
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
			</div>
		</div>
	);

	return (
		<div className="w-full px-4 py-16 space-y-8 lg:px-24">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold">Integrations Marketplace</h1>
					<p className="mt-2 text-muted-foreground">Browse and add features to your business profile</p>
				</div>
			</div>

			{/* Search and Filter */}
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
						<Input placeholder="Search integrations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
					</div>
					<div className="flex gap-2">
						{categories.map((category) => (
							<Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)}>
								{category}
							</Button>
						))}
						<select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)} className="ml-2 border rounded px-2 py-1 text-sm bg-card text-foreground">
							{industries.map((industry) => (
								<option key={industry} value={industry}>
									{industry}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Active Integrations Section */}
			{Object.keys(profile.features).length > 0 && (
				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">Active Integrations</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
				<p className="text-xs text-muted-foreground">For example, a plumber could add a &quot;Blog&quot; to share plumbing tips, or a &quot;Portfolio&quot; to showcase their best work.</p>
			</div>
		</div>
	);
}
