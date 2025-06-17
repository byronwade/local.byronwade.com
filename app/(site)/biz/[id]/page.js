"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

export default function BizProfile({ params }) {
	const [business, setBusiness] = useState(null);
	const [showAllPhotos, setShowAllPhotos] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [activeSection, setActiveSection] = useState("overview");
	const [showScrollSpy, setShowScrollSpy] = useState(false);
	const [showMobileNav, setShowMobileNav] = useState(false);
	const [showReviewModal, setShowReviewModal] = useState(false);

	const [newReview, setNewReview] = useState({
		rating: 5,
		title: "",
		text: "",
		author: "",
	});

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

	// Generate comprehensive business data on client side to avoid hydration issues
	useEffect(() => {
		const generateBusiness = () => {
			const businessNames = ["Wade's Plumbing & Septic", "Joe's Pizza Palace", "Kautzer-Bergstrom Auto Repair", "Mountain View Landscaping", "City Center Dental", "Elite Fitness Gym"];
			const businessTypes = ["Plumbing & Septic Services", "Italian Restaurant", "Auto Repair Shop", "Landscaping Services", "Dental Practice", "Fitness Center"];
			const randomIndex = Math.floor(Math.random() * businessNames.length);

			return {
				id: params.id,
				name: businessNames[randomIndex],
				type: businessTypes[randomIndex],
				rating: (4.2 + Math.random() * 0.8).toFixed(1),
				reviewCount: Math.floor(Math.random() * 500) + 50,
				priceLevel: "$".repeat(Math.floor(Math.random() * 3) + 1),
				status: Math.random() > 0.3 ? "Open" : "Closed",
				phone: "(555) 123-4567",
				website: "www.example.com",
				address: "123 Main St, Anytown, GA 30309",
				hours: {
					monday: "8:00 AM - 6:00 PM",
					tuesday: "8:00 AM - 6:00 PM",
					wednesday: "8:00 AM - 6:00 PM",
					thursday: "8:00 AM - 6:00 PM",
					friday: "8:00 AM - 6:00 PM",
					saturday: "9:00 AM - 4:00 PM",
					sunday: "Closed",
				},
				photos: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1581578949510-fa7315b2b50d?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&h=600&fit=crop"],
				portfolioPhotos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1581578949510-fa7315b2b50d?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"],
				description: "Professional plumbing and septic services with over 20 years of experience. We provide reliable, affordable solutions for all your plumbing needs. Family-owned and operated since 2011.",
				services: ["Emergency Plumbing", "Drain Cleaning", "Septic Tank Services", "Water Heater Installation", "Pipe Repair & Replacement", "Bathroom Remodeling"],
				detailedServices: ["Emergency Plumbing Repair", "Drain Cleaning & Unclogging", "Septic Tank Pumping & Cleaning", "Water Heater Installation & Repair", "Pipe Repair & Replacement", "Bathroom Remodeling", "Kitchen Plumbing", "Sewer Line Repair", "Leak Detection", "Fixture Installation", "Garbage Disposal Repair", "Water Line Installation"],
				highlights: ["Licensed & Insured", "24/7 Emergency Service", "Free Estimates", "Veteran Owned", "BBB Accredited"],
				businessHighlights: ["Locally owned & operated", "Licensed & Insured", "Emergency services available", "Satisfaction guaranteed", "Free estimates", "Same-day service available", "20+ years experience", "Veteran-owned business", "BBB A+ Rating", "Fully bonded & insured"],
				trustScore: 95,
				responseRate: 98,
				responseTime: "within 2 hours",
				paymentMethods: ["Cash", "Credit Cards", "Debit Cards", "Check", "Financing Available", "PayPal", "Venmo"],
				serviceArea: {
					primary: "Atlanta, GA",
					coverage: "25 mile radius",
					cities: ["Atlanta", "Marietta", "Roswell", "Alpharetta", "Sandy Springs", "Dunwoody", "Brookhaven", "Decatur"],
				},
				license: {
					number: "GA Plumbing License #PL-2024-001234",
					state: "Georgia",
					verified: true,
					expires: "12/31/2025",
				},
				established: "2011",
				employees: "5-10",
				amenities: [
					{ name: "Free Wi-Fi", icon: Wifi, available: true },
					{ name: "Credit Cards", icon: CreditCard, available: true },
					{ name: "Free Parking", icon: Car, available: true },
					{ name: "Emergency Service", icon: Phone, available: true },
					{ name: "Free Estimates", icon: DollarSign, available: true },
					{ name: "Licensed & Insured", icon: Shield, available: true },
				],
				// NEW FEATURES DATA
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
						service: "Water Heater Installation",
						startDate: "2024-01-15",
						endDate: "2026-01-15",
						status: "Active",
						coverageDetails: "Full replacement coverage for manufacturer defects",
						claimHistory: [],
					},
					{
						id: "WTY-2024-002",
						service: "Bathroom Remodel",
						startDate: "2024-03-10",
						endDate: "2026-03-10",
						status: "Active",
						coverageDetails: "2-year warranty on all labor and materials",
						claimHistory: [],
					},
				],
				peerRecommendations: [
					{
						recommenderName: "Sarah Johnson",
						recommenderAddress: "124 Main St (Next Door)",
						relationship: "Neighbor",
						serviceUsed: "Emergency Plumbing",
						rating: 5,
						comment: "Wade saved the day when our main line burst! Professional and fast response.",
						verificationStatus: "Verified Neighbor",
						date: "2 weeks ago",
					},
					{
						recommenderName: "Mike Chen",
						recommenderAddress: "456 Oak Ave (2 blocks away)",
						relationship: "Community Member",
						serviceUsed: "Septic Tank Service",
						rating: 5,
						comment: "Honest pricing and excellent work. Highly recommend to anyone in the area.",
						verificationStatus: "Verified Address",
						date: "1 month ago",
					},
				],
				multiLanguage: {
					supportedLanguages: [
						{ code: "en", name: "English", flag: "🇺🇸", native: "English" },
						{ code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
						{ code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
						{ code: "de", name: "German", flag: "🇩🇪", native: "Deutsch" },
					],
					staffLanguages: ["English", "Spanish"],
					translationQuality: "Professional",
					culturalContext: {
						familyOwned: "Family-owned business with traditional values",
						communityFocus: "Strong community ties and local involvement",
						workEthic: "Punctual, respectful, and professional service",
					},
				},
				insuranceBilling: {
					acceptedInsurance: ["State Farm", "Allstate", "Progressive", "GEICO", "Farmers Insurance", "USAA"],
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
						services: ["Annual plumbing inspection", "Drain cleaning", "Emergency priority"],
						savings: "Save 15% on all services",
						popular: false,
					},
					{
						name: "Complete Protection",
						price: "$199/year",
						services: ["Bi-annual inspections", "Preventive maintenance", "Priority emergency service", "Water heater flush", "Leak detection check"],
						savings: "Save 25% on all services",
						popular: true,
					},
					{
						name: "Premium Care Plus",
						price: "$299/year",
						services: ["Quarterly inspections", "All preventive maintenance", "24/7 priority service", "Free minor repairs", "Annual septic check", "Smart home integration"],
						savings: "Save 35% on all services + Free minor repairs",
						popular: false,
					},
				],
				stats: {
					monthlyViews: 1250,
					responseTime: "within 2 hours",
					responseRate: 98,
					bookingRate: 92,
					repeatCustomers: 85,
				},
				reviews: [
					{
						id: 1,
						author: "Sarah M.",
						avatar: "https://i.pravatar.cc/150?img=1",
						rating: 5,
						date: "2 weeks ago",
						text: "Excellent service! They fixed our emergency leak quickly and professionally. Wade was at my location within 30 minutes after reaching out with an emergency issue. Highly recommend!",
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
						text: "Great work on our bathroom remodel. Clean, professional, and on time. Starting from my original interaction with Wade (who is amazing!) things ran as smooth as possible.",
						helpful: 8,
						verified: true,
						photos: 0,
					},
					{
						id: 3,
						author: "Jennifer L.",
						avatar: "https://i.pravatar.cc/150?img=3",
						rating: 5,
						date: "3 weeks ago",
						text: "Professional service and fair pricing. I'll definitely use them again for future projects. Wade explained everything clearly and the work was completed efficiently.",
						helpful: 15,
						verified: true,
						photos: 1,
					},
				],
				reviewHighlights: [
					{
						author: "Sarah",
						quote: "Wade was at my location within 30 minutes after reaching out with an emergency issue.",
						reviewCount: 3,
					},
					{
						author: "Mike",
						quote: "Starting from my original interaction with Wade (who is amazing!) things ran as smooth as possible.",
						reviewCount: 5,
					},
					{
						author: "Jennifer",
						quote: "Professional service and fair pricing. I'll definitely use them again for future projects.",
						reviewCount: 2,
					},
				],
				businessUpdates: [
					{
						id: 1,
						date: "2 days ago",
						title: "Service Excellence Explained",
						content: "Reliable plumbing services and repairs in your area. We pride ourselves on quality workmanship and customer satisfaction.",
						image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
					},
					{
						id: 2,
						date: "1 week ago",
						title: "Latest Project Completion",
						content: "Recently completed a major bathroom remodeling project with excellent results. Customer satisfaction is our top priority.",
						image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=400&h=300&fit=crop",
					},
				],
				portfolio: [
					{
						title: "Emergency Plumbing Repair",
						image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
						description: "24/7 emergency plumbing services",
					},
					{
						title: "Bathroom Remodeling",
						image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=400&h=300&fit=crop",
						description: "Complete bathroom renovation",
					},
					{
						title: "Septic Tank Services",
						image: "https://images.unsplash.com/photo-1581578949510-fa7315b2b50d?w=400&h=300&fit=crop",
						description: "Professional septic maintenance",
					},
					{
						title: "Water Heater Installation",
						image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
						description: "Expert water heater services",
					},
				],
				qna: [
					{
						id: 1,
						question: "Do you offer emergency services?",
						answer: "Yes, we provide 24/7 emergency plumbing services with rapid response times.",
						author: "Wade's Plumbing",
						date: "1 week ago",
						helpful: 8,
					},
					{
						id: 2,
						question: "What payment methods do you accept?",
						answer: "We accept cash, credit cards, checks, and offer financing options for larger projects.",
						author: "Wade's Plumbing",
						date: "2 weeks ago",
						helpful: 12,
					},
					{
						id: 3,
						question: "Do you provide free estimates?",
						answer: "Yes, we provide free estimates for all plumbing projects. Just give us a call!",
						author: "Wade's Plumbing",
						date: "3 weeks ago",
						helpful: 15,
					},
				],
				// Additional comprehensive business data
				pricing: {
					hourlyRate: "$85 - $125/hour",
					emergencyRate: "$150 - $200/hour",
					minimumCharge: "$95",
					discounts: ["10% Senior Discount", "15% Military Discount", "5% Cash Payment"],
					financing: "0% APR for 12 months on jobs over $1,000",
					freeServices: ["Estimates", "Basic Diagnostics", "Second Opinions"],
				},
				team: [
					{
						name: "Wade Thompson",
						title: "Owner & Master Plumber",
						experience: "20+ years",
						certifications: ["Master Plumber License", "Backflow Prevention"],
						photo: "https://i.pravatar.cc/150?img=11",
						specialties: ["Emergency Repairs", "Septic Systems", "Commercial Plumbing"],
					},
					{
						name: "Sarah Mitchell",
						title: "Licensed Plumber",
						experience: "8 years",
						certifications: ["Journeyman Plumber", "Green Plumbing"],
						photo: "https://i.pravatar.cc/150?img=12",
						specialties: ["Residential Plumbing", "Bathroom Remodels", "Water Heaters"],
					},
					{
						name: "Mike Rodriguez",
						title: "Septic Specialist",
						experience: "12 years",
						certifications: ["Septic System Inspector", "Environmental Safety"],
						photo: "https://i.pravatar.cc/150?img=13",
						specialties: ["Septic Installation", "Drain Fields", "System Maintenance"],
					},
				],
				certifications: [
					{
						name: "Georgia Master Plumber License",
						number: "MP-GA-2024-001234",
						issuer: "Georgia State Board of Plumbers",
						issued: "2018-03-15",
						expires: "2025-03-15",
						status: "Active",
						verified: true,
					},
					{
						name: "Backflow Prevention Certification",
						number: "BP-2024-567",
						issuer: "American Water Works Association",
						issued: "2023-06-20",
						expires: "2026-06-20",
						status: "Active",
						verified: true,
					},
					{
						name: "Green Plumbing Certification",
						number: "GPC-2024-890",
						issuer: "Green Plumbers USA",
						issued: "2022-11-10",
						expires: "2025-11-10",
						status: "Active",
						verified: true,
					},
					{
						name: "OSHA Safety Certification",
						number: "OSH-2024-345",
						issuer: "Occupational Safety & Health Administration",
						issued: "2024-01-15",
						expires: "2027-01-15",
						status: "Active",
						verified: true,
					},
				],
				insurance: {
					liability: "$2,000,000 General Liability",
					workersComp: "Workers' Compensation - Full Coverage",
					bonding: "$50,000 Surety Bond",
					provider: "State Farm Business Insurance",
					policyNumber: "SF-2024-BUS-123456",
					verified: true,
					lastUpdated: "2024-01-01",
				},
				warranties: [
					{
						type: "Labor Warranty",
						duration: "2 years",
						coverage: "All labor and workmanship",
						conditions: "Standard installation and repair work",
					},
					{
						type: "Parts Warranty",
						duration: "Manufacturer warranty",
						coverage: "All parts and materials",
						conditions: "Varies by manufacturer (typically 1-10 years)",
					},
					{
						type: "Emergency Service Guarantee",
						duration: "90 days",
						coverage: "Follow-up emergency calls for same issue",
						conditions: "Free return visit if problem recurs",
					},
				],
				guarantees: ["100% Satisfaction Guarantee", "Same-day service available", "Upfront pricing - no hidden fees", "Licensed & insured technicians", "Clean work area guarantee", "Emergency response within 2 hours"],
				specializations: ["Emergency Plumbing Repairs", "Septic Tank Systems", "Water Heater Services", "Bathroom Remodeling", "Kitchen Plumbing", "Sewer Line Repair", "Leak Detection", "Pipe Replacement", "Drain Cleaning", "Fixture Installation"],
				equipment: ["Hydro-jetting equipment", "Digital leak detection tools", "Pipe inspection cameras", "Trenchless repair equipment", "Professional grade tools", "Emergency response vehicles"],
				brands: ["Kohler", "American Standard", "Rheem", "Bradford White", "Delta", "Moen", "Toto", "Rinnai", "AO Smith", "Navien"],
				awards: [
					{
						title: "Best Plumbing Service 2023",
						issuer: "Atlanta Home & Garden",
						year: "2023",
					},
					{
						title: "BBB A+ Rating",
						issuer: "Better Business Bureau",
						year: "2020-2024",
					},
					{
						title: "Angie's List Super Service Award",
						issuer: "Angie's List",
						year: "2022",
					},
					{
						title: "Home Advisor Elite Service",
						issuer: "Home Advisor",
						year: "2023",
					},
				],
				emergencyServices: {
					available247: true,
					responseTime: "30-60 minutes",
					emergencyFee: "$50 service call fee",
					serviceTypes: ["Burst pipes", "Sewer backups", "Water heater failures", "Gas leaks", "Frozen pipes", "Major leaks"],
				},
				businessTransparency: {
					operationalAreas: [
						{ category: "Professional Staff", importance: "High", description: "Licensed plumbers, apprentices, and skilled technicians" },
						{ category: "Professional Training", importance: "High", description: "Ongoing education, certifications, and safety training" },
						{ category: "Insurance & Bonding", importance: "Critical", description: "Liability protection, workers compensation, and bonding" },
						{ category: "Professional Equipment", importance: "High", description: "Diagnostic tools, specialized equipment, and service vehicles" },
						{ category: "Quality Materials", importance: "High", description: "Premium parts, supplies, and manufacturer warranties" },
						{ category: "Business Operations", importance: "Medium", description: "Licensing, permits, marketing, and administrative costs" },
						{ category: "Emergency Readiness", importance: "High", description: "24/7 availability, response vehicles, and on-call staff" },
						{ category: "Customer Protection", importance: "Critical", description: "Warranties, guarantees, and service follow-up" },
					],
					whyQualityMatters: [
						{ factor: "Licensed Professionals", impact: "Ensures work meets safety codes and local regulations" },
						{ factor: "Proper Insurance", impact: "Protects your property and provides liability coverage" },
						{ factor: "Quality Equipment", impact: "Faster diagnosis, better repairs, less disruption to your home" },
						{ factor: "Ongoing Training", impact: "Knowledge of latest techniques and safety practices" },
						{ factor: "Emergency Response", impact: "24/7 availability requires dedicated resources and staffing" },
						{ factor: "Warranty Protection", impact: "Guarantees on work performed for your peace of mind" },
					],
					industryInsights: {
						commonCosts: "Professional service businesses invest significantly in staff, equipment, training, and insurance",
						qualityIndicators: ["Licensed and insured professionals", "Comprehensive warranties on work", "Professional diagnostic equipment", "Ongoing staff education and certification", "Emergency response capabilities", "Established business reputation"],
						investmentAreas: ["Advanced diagnostic equipment and tools", "Professional vehicle fleet and maintenance", "Staff training and certification programs", "Technology systems for scheduling and customer service"],
					},
				},
				beforeAfterGallery: [
					{
						title: "Bathroom Remodel - Modern Upgrade",
						beforeImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop",
						afterImage: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=400&h=300&fit=crop",
						description: "Complete bathroom renovation with modern fixtures and efficient plumbing.",
					},
					{
						title: "Kitchen Plumbing - Professional Installation",
						beforeImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
						afterImage: "https://images.unsplash.com/photo-1556909179-f2692cdccbc6?w=400&h=300&fit=crop",
						description: "New kitchen plumbing installation with garbage disposal and dishwasher connections.",
					},
				],
				testimonials: [
					{
						customer: "Jennifer Adams",
						service: "Emergency Plumbing",
						rating: 5,
						text: "Wade responded to our emergency call at 10 PM on a Sunday and had our water back on within 2 hours. Professional, courteous, and reasonably priced. You can't ask for better service!",
						date: "March 2024",
					},
					{
						customer: "Robert Kim",
						service: "Septic Tank Service",
						rating: 5,
						text: "Outstanding septic tank service. Wade explained everything clearly, completed the work efficiently, and cleaned up perfectly. Will definitely use again and recommend to neighbors.",
						date: "February 2024",
					},
				],
				communityInvolvement: [
					{
						activity: "Local School Sponsorship",
						description: "Sponsors the Anytown Elementary School baseball team",
					},
					{
						activity: "Free Senior Services",
						description: "Provides free plumbing inspections for seniors over 65",
					},
					{
						activity: "Community Clean-up Events",
						description: "Participates in annual community clean-up and repair events",
					},
					{
						activity: "Local Charity Support",
						description: "Donates services to Habitat for Humanity projects",
					},
				],
				faq: [
					{
						question: "How quickly can you respond to emergency calls?",
						answer: "We typically respond to emergency calls within 30-60 minutes, 24/7. Our emergency service fee is $50, which goes toward the cost of repairs.",
					},
					{
						question: "Do you offer financing for larger projects?",
						answer: "Yes, we offer 0% APR financing for 12 months on projects over $1,000. We also accept cash, credit cards, and checks.",
					},
					{
						question: "Are you licensed and insured?",
						answer: "Absolutely. We carry $2 million in general liability insurance, full workers' compensation, and a $50,000 surety bond. All our technicians are licensed professionals.",
					},
					{
						question: "What areas do you serve?",
						answer: "We serve Atlanta and surrounding areas within a 25-mile radius, including Marietta, Roswell, Alpharetta, Sandy Springs, and more.",
					},
					{
						question: "Do you provide warranties on your work?",
						answer: "Yes, we provide a 2-year warranty on all labor and workmanship, plus manufacturer warranties on parts. Emergency repairs come with a 90-day guarantee.",
					},
				],
				accessibility: ["Wheelchair accessible service vehicles", "Clear communication for hearing impaired", "Written estimates available", "Flexible scheduling for special needs", "Senior-friendly service approach"],
				careers: {
					isHiring: true,
					companySize: "5-10 employees",
					culture: "Family-owned business with strong work-life balance",
					benefits: ["Health Insurance", "Paid Time Off", "Tool Allowance", "Training & Certification", "Overtime Pay", "Retirement Plan"],
					openPositions: [
						{
							title: "Licensed Plumber",
							type: "Full-time",
							experience: "3+ years",
							location: "Atlanta, GA",
							salary: "$55,000 - $75,000",
							description: "Seeking experienced plumber for residential and commercial projects. Must have valid GA license.",
							requirements: ["Valid GA Plumbing License", "3+ years experience", "Own tools", "Clean driving record", "Professional appearance"],
							posted: "2 weeks ago",
						},
						{
							title: "Plumbing Apprentice",
							type: "Full-time",
							experience: "Entry Level",
							location: "Atlanta, GA",
							salary: "$35,000 - $45,000",
							description: "Great opportunity for someone starting their plumbing career. Will provide training and mentorship.",
							requirements: ["High school diploma", "Willingness to learn", "Physical fitness", "Reliable transportation", "Team player"],
							posted: "1 week ago",
						},
					],
					perks: ["Company vehicle for qualified technicians", "Professional development opportunities", "Family-friendly environment", "Local community involvement"],
					testimonials: [
						{
							employee: "Mike T., Senior Plumber",
							quote: "Been with Wade's for 5 years. Great team, fair pay, and they actually care about work-life balance.",
							tenure: "5 years",
						},
						{
							employee: "Sarah L., Office Manager",
							quote: "Love the family atmosphere here. Wade treats everyone with respect and values our input.",
							tenure: "3 years",
						},
					],
				},
				partnerships: {
					supplierPartners: [
						{
							name: "Ferguson Enterprises",
							type: "Primary Supplier",
							relationship: "Preferred Partner since 2015",
							benefits: "Priority ordering, competitive pricing, technical support",
							logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop",
						},
						{
							name: "Home Depot Pro",
							type: "Supply Partner",
							relationship: "Commercial Account",
							benefits: "Bulk pricing, quick pickup, wide selection",
							logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=100&fit=crop",
						},
					],
					servicePartners: [
						{
							name: "Atlanta Septic Services",
							type: "Septic Specialist",
							relationship: "Referral Partner",
							description: "For complex septic system installations and repairs",
						},
						{
							name: "Emergency Restoration LLC",
							type: "Water Damage",
							relationship: "Emergency Partner",
							description: "24/7 water damage restoration and cleanup services",
						},
					],
					communityPartners: [
						{
							name: "Habitat for Humanity",
							type: "Charity Organization",
							involvement: "Monthly volunteer projects",
							description: "Providing plumbing services for new home builds",
						},
						{
							name: "Anytown Chamber of Commerce",
							type: "Business Organization",
							involvement: "Active Member since 2012",
							description: "Supporting local business community and networking",
						},
					],
					certifications: [
						{
							name: "Better Business Bureau",
							grade: "A+",
							since: "2013",
							benefits: "Consumer trust, dispute resolution, ethical standards",
						},
						{
							name: "Angie's List Super Service Award",
							year: "2023",
							achievement: "Top 5% of service providers",
							benefits: "Customer recognition and referrals",
						},
					],
				},
			};
		};

		setBusiness(generateBusiness());
	}, [params.id]);

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (showAllPhotos) {
				if (e.key === "ArrowLeft") {
					setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
				} else if (e.key === "ArrowRight") {
					setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
				} else if (e.key === "Escape") {
					setShowAllPhotos(false);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [showAllPhotos, business?.photos, business?.portfolioPhotos]);

	// Handle scroll spy
	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			setShowScrollSpy(scrollY > 300);

			// Update active section based on scroll position
			const sections = Object.keys(sectionRefs);
			for (const section of sections) {
				const ref = sectionRefs[section];
				if (ref.current) {
					const rect = ref.current.getBoundingClientRect();
					if (rect.top <= 150 && rect.bottom > 150) {
						setActiveSection(section);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Navigate to section
	const scrollToSection = (sectionId) => {
		const ref = sectionRefs[sectionId];
		if (ref.current) {
			const headerOffset = 100;
			const elementPosition = ref.current.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
		setShowMobileNav(false);
	};

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

	// Section navigation items
	const navigationItems = [
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
	];

	// Show loading state while business data is being generated
	if (!business) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
			</div>
		);
	}

	const allImages = [...business.photos, ...business.portfolioPhotos];

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className={`sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md border-border transition-all duration-300 ease-out ${showScrollSpy ? "lg:block" : "block"}`}>
				<div className="px-3 mx-auto max-w-7xl sm:px-4 lg:px-8">
					{/* Desktop Header - Always Visible */}
					<div className={`${showScrollSpy ? "hidden lg:flex" : "flex"} items-center justify-between h-14 sm:h-16 transition-all duration-300 ease-out`}>
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
					{showScrollSpy && (
						<div className="flex items-center justify-between py-2 duration-300 ease-out lg:hidden sm:py-3 animate-in slide-in-from-top-2 fade-in-0">
							{/* Business Name & Rating */}
							<div className="flex-1 min-w-0">
								<h1 className="text-sm font-bold truncate duration-300 delay-75 text-foreground sm:text-base animate-in slide-in-from-left-2 fade-in-0">{business?.name}</h1>
								<div className="flex items-center space-x-2 text-xs duration-300 delay-100 text-muted-foreground animate-in slide-in-from-left-2 fade-in-0">
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
							<div className="flex space-x-2 duration-300 delay-150 animate-in slide-in-from-right-2 fade-in-0">
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
					{showScrollSpy && (
						<div className="hidden py-3 duration-300 ease-out lg:block animate-in slide-in-from-top-2 fade-in-0">
							<div className="grid grid-cols-3 gap-6">
								{/* Contact Info */}
								<div className="space-y-3 duration-300 delay-75 animate-in slide-in-from-left-2 fade-in-0">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
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
								<div className="space-y-2 duration-300 delay-100 animate-in slide-in-from-top-2 fade-in-0">
									<h4 className="flex items-center text-sm font-semibold text-foreground">
										<Clock className="w-3 h-3 mr-2" />
										Hours
									</h4>
									<div className="grid grid-cols-2 text-xs gap-x-4 gap-y-1">
										{Object.entries(business?.hours || {})
											.slice(0, 4)
											.map(([day, hours]) => (
												<div key={day} className="flex justify-between">
													<span className="capitalize text-muted-foreground">{day.slice(0, 3)}</span>
													<span className="text-foreground">{hours}</span>
												</div>
											))}
									</div>
								</div>

								{/* Key Amenities */}
								<div className="space-y-2 duration-300 delay-150 animate-in slide-in-from-right-2 fade-in-0">
									<h4 className="text-sm font-semibold text-foreground">What This Place Offers</h4>
									<div className="grid grid-cols-2 gap-1">
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
						<div className="duration-200 ease-out border-t lg:hidden border-border bg-background/95 backdrop-blur-md animate-in slide-in-from-top-2 fade-in-0">
							<div className="grid grid-cols-2 gap-2 p-3 sm:p-4">
								{navigationItems.map((item, index) => {
									const Icon = item.icon;
									const isCertification = item.id === "certification";
									return (
										<button
											key={item.id}
											onClick={() => scrollToSection(item.id)}
											className={`flex items-center space-x-2 p-2.5 rounded-lg text-xs transition-all duration-200 sm:text-sm hover:scale-105 active:scale-95 animate-in slide-in-from-top-1 fade-in-0 ${
												isCertification
													? activeSection === item.id
														? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg"
														: "bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 text-blue-600 hover:from-blue-100 hover:to-green-100 dark:hover:from-blue-900/40 dark:hover:to-green-900/40 border border-blue-200/50 font-semibold"
													: activeSection === item.id
													? "bg-primary/10 text-primary"
													: "text-muted-foreground hover:text-foreground hover:bg-muted"
											}`}
											style={{ animationDelay: `${index * 50}ms`, animationDuration: "300ms" }}
										>
											<Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isCertification ? "animate-pulse" : ""}`} />
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
					{/* Business Header */}
					<div className="p-4 border bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm border-border rounded-xl sm:p-6 lg:p-8 sm:rounded-2xl">
						{/* Business Name & Type */}
						<div className="mb-6 space-y-2 sm:space-y-3">
							<h1 className="text-xl font-bold leading-tight tracking-tight break-words sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-foreground">{business.name}</h1>
							<p className="text-sm font-medium leading-normal break-words sm:text-base md:text-lg lg:text-xl text-muted-foreground">{business.type}</p>
						</div>

						{/* Rating Section */}
						<div className="p-3 mb-4 border bg-card/40 rounded-xl border-border/50 sm:p-4 md:p-6 sm:mb-6">
							<div className="space-y-3 sm:space-y-4">
								{/* Star Rating & Score */}
								<div className="flex flex-col items-start gap-2 sm:gap-3 sm:flex-row sm:items-center">
									<div className="flex items-center space-x-2">
										<div className="flex items-center space-x-0.5 sm:space-x-1">
											{[...Array(5)].map((_, i) => (
												<Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${i < Math.floor(business.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
											))}
										</div>
										<span className="text-xl font-bold sm:text-2xl md:text-3xl text-foreground">{business.rating}</span>
									</div>
									<div className="text-xs font-medium sm:text-sm md:text-base text-muted-foreground">Based on {business.reviewCount.toLocaleString()} reviews</div>
								</div>

								{/* Status Badges */}
								<div className="flex flex-wrap gap-1.5 sm:gap-2">
									<Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 font-medium text-xs px-2 py-1 sm:text-sm sm:px-2.5 sm:py-1">
										{business.priceLevel}
									</Badge>

									{business.license.verified && (
										<Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-medium text-xs px-2 py-1 sm:text-sm sm:px-2.5 sm:py-1">
											<Verified className="w-3 h-3 mr-1 sm:w-3.5 sm:h-3.5 sm:mr-1" />
											<span className="truncate">Verified</span>
										</Badge>
									)}

									<Badge variant="secondary" className={`font-medium text-xs px-2 py-1 sm:text-sm sm:px-2.5 sm:py-1 ${business.status === "Open" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
										<div className={`w-1.5 h-1.5 rounded-full mr-1 sm:w-2 sm:h-2 sm:mr-1.5 ${business.status === "Open" ? "bg-green-400" : "bg-red-400"}`} />
										<span className="truncate">{business.status}</span>
									</Badge>
								</div>
							</div>
						</div>

						{/* Quick Actions */}
						<div className="mb-4 space-y-2 sm:mb-6 sm:space-y-0 sm:flex sm:gap-3">
							<Button size="default" className="w-full font-semibold transition-all duration-200 shadow-lg h-11 sm:w-auto sm:h-10 bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-xl" onClick={() => setShowReviewModal(true)}>
								<Edit className="w-4 h-4 mr-2" />
								<span className="text-sm truncate sm:text-base">Write Review</span>
							</Button>
							<Button variant="outline" size="default" className="w-full font-semibold transition-all duration-200 shadow-sm h-11 sm:w-auto sm:h-10 border-border hover:bg-muted hover:shadow-md" onClick={() => scrollToSection("reviews")}>
								<Star className="w-4 h-4 mr-2" />
								<span className="text-sm truncate sm:text-base">View Reviews</span>
							</Button>
						</div>

						{/* Business Details */}
						<div className="mb-4 space-y-2 text-xs sm:mb-6 sm:space-y-3 sm:text-sm md:text-base text-muted-foreground">
							<div className="flex items-center space-x-2">
								<Users className="flex-shrink-0 w-4 h-4" />
								<span className="font-medium truncate">{business.employees} employees</span>
							</div>
							<div className="flex items-center space-x-2">
								<Calendar className="flex-shrink-0 w-4 h-4" />
								<span className="font-medium truncate">Established {business.established}</span>
							</div>
							<div className="flex items-center space-x-2">
								<MapPin className="flex-shrink-0 w-4 h-4" />
								<span className="font-medium break-words">Serving {business.serviceArea.primary}</span>
							</div>
						</div>

						{/* Trust Score & Key Stats */}
						<div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
							<div className="p-3 text-center transition-colors border rounded-lg bg-card/40 border-border/50 hover:bg-card/60">
								<div className="mb-0.5 text-lg font-bold sm:text-xl md:text-2xl text-primary">{business.trustScore}%</div>
								<div className="text-xs font-medium leading-tight sm:text-sm text-muted-foreground">Trust Score</div>
							</div>
							<div className="p-3 text-center transition-colors border rounded-lg bg-card/40 border-border/50 hover:bg-card/60">
								<div className="mb-0.5 text-lg font-bold text-green-400 sm:text-xl md:text-2xl">{business.responseRate}%</div>
								<div className="text-xs font-medium leading-tight sm:text-sm text-muted-foreground">Response Rate</div>
							</div>
							<div className="p-3 text-center transition-colors border rounded-lg bg-card/40 border-border/50 hover:bg-card/60">
								<div className="mb-0.5 text-lg font-bold text-blue-400 sm:text-xl md:text-2xl">{business.stats.monthlyViews.toLocaleString()}</div>
								<div className="text-xs font-medium leading-tight sm:text-sm text-muted-foreground">Monthly Views</div>
							</div>
							<div className="p-3 text-center transition-colors border rounded-lg bg-card/40 border-border/50 hover:bg-card/60">
								<div className="mb-0.5 text-lg font-bold text-purple-400 sm:text-xl md:text-2xl">{business.stats.repeatCustomers}%</div>
								<div className="text-xs font-medium leading-tight sm:text-sm text-muted-foreground">Repeat Customers</div>
							</div>
						</div>

						{/* Contact & Hours - Visible when not scrolled */}
						<div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
							{/* Contact Card */}
							<div className="p-4 border bg-card/50 border-border rounded-xl">
								<div className="space-y-3">
									<Button className="w-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
										<Phone className="w-4 h-4 mr-2" />
										<span className="truncate">Call {business.phone}</span>
									</Button>

									<div className="grid grid-cols-2 gap-2">
										<Button variant="outline" size="sm" className="border-border hover:bg-muted">
											<MapPin className="w-3 h-3 mr-1" />
											<span className="truncate">Directions</span>
										</Button>
										<Button variant="outline" size="sm" className="border-border hover:bg-muted">
											<Globe className="w-3 h-3 mr-1" />
											<span className="truncate">Website</span>
										</Button>
									</div>

									<div className="pt-3 space-y-2 text-xs border-t border-border">
										<div className="flex items-center space-x-2 text-muted-foreground">
											<Mail className="flex-shrink-0 w-3 h-3" />
											<span className="truncate">Responds {business.responseTime}</span>
										</div>
										<div className="flex items-start space-x-2 text-muted-foreground">
											<MapPin className="flex-shrink-0 w-3 h-3 mt-0.5" />
											<span className="break-words">{business.address}</span>
										</div>
									</div>
								</div>
							</div>

							{/* Hours */}
							<div className="p-4 border bg-card/50 border-border rounded-xl">
								<h3 className="flex items-center mb-3 text-sm font-semibold text-foreground">
									<Clock className="w-4 h-4 mr-2" />
									Hours
								</h3>
								<div className="space-y-2 text-xs">
									{Object.entries(business.hours).map(([day, hours]) => (
										<div key={day} className="flex justify-between">
											<span className="capitalize text-muted-foreground">{day}</span>
											<span className="text-foreground">{hours}</span>
										</div>
									))}
								</div>
							</div>

							{/* Amenities */}
							<div className="p-4 border bg-card/50 border-border rounded-xl">
								<h3 className="mb-3 text-sm font-semibold text-foreground">What This Place Offers</h3>
								<div className="space-y-2">
									{business.amenities.map((amenity, index) => (
										<div key={index} className="flex items-center space-x-2">
											<amenity.icon className="flex-shrink-0 w-4 h-4 text-muted-foreground" />
											<span className={`text-xs break-words ${amenity.available ? "text-foreground" : "text-muted-foreground line-through"}`}>{amenity.name}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Left Column - Main Content */}
					<div className="space-y-6 sm:space-y-8 lg:col-span-2">
						{/* Photo Gallery - Airbnb Style */}
						<div className="space-y-3 sm:space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold sm:text-xl md:text-2xl text-foreground">Photos</h2>
								<div className="flex items-center space-x-1.5 text-xs sm:space-x-2 sm:text-sm text-muted-foreground">
									<Camera className="w-3 h-3 sm:w-4 sm:h-4" />
									<span>{allImages.length} photos</span>
									<span>•</span>
									<span className="text-primary">Professional</span>
								</div>
							</div>

							{/* Airbnb-style Photo Grid */}
							<div className="grid grid-cols-4 gap-2 overflow-hidden h-96 rounded-xl">
								{/* Main large photo - left side */}
								<div
									className="relative col-span-2 row-span-2 overflow-hidden cursor-pointer group"
									onClick={() => {
										setSelectedImageIndex(0);
										setShowAllPhotos(true);
									}}
								>
									<img src={allImages[0]} alt={`${business.name} main photo`} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
									<div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100" />
								</div>

								{/* Top right photos */}
								<div
									className="relative overflow-hidden cursor-pointer group"
									onClick={() => {
										setSelectedImageIndex(1);
										setShowAllPhotos(true);
									}}
								>
									<img src={allImages[1]} alt={`${business.name} photo 2`} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
									<div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100" />
								</div>
								<div
									className="relative overflow-hidden cursor-pointer group"
									onClick={() => {
										setSelectedImageIndex(2);
										setShowAllPhotos(true);
									}}
								>
									<img src={allImages[2]} alt={`${business.name} photo 3`} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
									<div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100" />
								</div>

								{/* Bottom right photos */}
								<div
									className="relative overflow-hidden cursor-pointer group"
									onClick={() => {
										setSelectedImageIndex(3);
										setShowAllPhotos(true);
									}}
								>
									<img src={allImages[3]} alt={`${business.name} photo 4`} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
									<div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/20 group-hover:opacity-100" />
								</div>
								<div
									className="relative overflow-hidden cursor-pointer group"
									onClick={() => {
										setSelectedImageIndex(4);
										setShowAllPhotos(true);
									}}
								>
									<img src={allImages[4]} alt={`${business.name} photo 5`} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
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
							<Button variant="outline" className="w-full border-border hover:bg-muted" onClick={() => setShowAllPhotos(true)}>
								<Camera className="w-4 h-4 mr-2" />
								Show all {allImages.length} photos
							</Button>
						</div>

						{/* Main Content Sections */}
						<div className="space-y-20 sm:space-y-24 md:space-y-32 lg:space-y-40">
							{/* 1. BUSINESS OVERVIEW SECTION - First Impression */}
							<section ref={sectionRefs.overview}>
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

							{/* 2. GET THORBIS CERTIFIED SECTION - Trust Building */}
							<section ref={sectionRefs.certification}>
								<div className="mb-6 sm:mb-8 md:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Award className="w-6 h-6 mr-3 sm:w-8 sm:h-8 sm:mr-4 text-primary" />
										Get Thorbis Certified
									</h2>
									<div className="w-20 h-1 rounded-full sm:w-24 sm:h-1.5 bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-6 sm:space-y-8">
									{/* Certification Hero */}
									<div className="p-6 border bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-xl border-blue-200/50 sm:p-8">
										<div className="flex items-start space-x-4">
											<div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full">
												<Award className="w-6 h-6 text-white" />
											</div>
											<div className="space-y-4">
												<div>
													<h3 className="text-xl font-bold sm:text-2xl text-foreground">Join the Elite Network of Verified Businesses</h3>
													<p className="text-sm leading-relaxed sm:text-base text-muted-foreground">Thorbis Certified businesses are independently rated for Highest Quality and Helpful Expertise. Our rigorous certification process ensures only the best businesses earn this prestigious recognition.</p>
												</div>
												<div className="flex flex-wrap gap-3">
													<Button className="text-white bg-blue-600 hover:bg-blue-700">
														<Award className="w-4 h-4 mr-2" />
														Apply for Certification
													</Button>
													<Button variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100">
														<ExternalLink className="w-4 h-4 mr-2" />
														Learn More
													</Button>
												</div>
											</div>
										</div>
									</div>

									{/* Certification Benefits */}
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<div className="space-y-4">
											<h3 className="text-xl font-semibold sm:text-2xl text-foreground">Certification Benefits</h3>
											<div className="space-y-3">
												{["Premium business listing with verified badge", "Higher search ranking and visibility", "Customer trust score boost up to 40%", "Priority customer support and resources", "Performance guarantee backing", "Ongoing monitoring and quality assurance"].map((benefit, index) => (
													<div key={index} className="flex items-start space-x-3">
														<CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-green-400" />
														<span className="text-sm leading-relaxed sm:text-base text-foreground">{benefit}</span>
													</div>
												))}
											</div>
										</div>

										<div className="space-y-4">
											<h3 className="text-xl font-semibold sm:text-2xl text-foreground">Requirements</h3>
											<div className="space-y-3">
												{["Valid business license and insurance", "Minimum 4.5-star customer rating", "Pass comprehensive background check", "Complete quality and expertise assessment", "Maintain ongoing customer satisfaction", "Commit to performance guarantee standards"].map((requirement, index) => (
													<div key={index} className="flex items-start space-x-3">
														<div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-blue-500/20 flex items-center justify-center">
															<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
														</div>
														<span className="text-sm leading-relaxed sm:text-base text-foreground">{requirement}</span>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Certification Process */}
									<div className="space-y-6">
										<h3 className="text-xl font-semibold sm:text-2xl text-foreground">12-Step Certification Process</h3>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
											{[
												{ step: 1, title: "Application", description: "Submit initial application with business details" },
												{ step: 2, title: "License Verification", description: "Verify all required licenses and permits" },
												{ step: 3, title: "Insurance Check", description: "Confirm adequate insurance coverage" },
												{ step: 4, title: "Background Review", description: "Comprehensive background and history check" },
												{ step: 5, title: "Customer Survey", description: "Independent customer satisfaction survey" },
												{ step: 6, title: "Reference Check", description: "Contact and verify customer references" },
												{ step: 7, title: "Financial Review", description: "Assess business financial stability" },
												{ step: 8, title: "Quality Assessment", description: "Evaluate work quality and standards" },
												{ step: 9, title: "Expertise Test", description: "Test technical knowledge and expertise" },
												{ step: 10, title: "Site Inspection", description: "Physical location and equipment review" },
												{ step: 11, title: "Final Review", description: "Comprehensive evaluation of all criteria" },
												{ step: 12, title: "Certification", description: "Award Thorbis Certified status" },
											].map((item, index) => (
												<div key={index} className="p-4 border rounded-lg bg-card/30 border-border">
													<div className="flex items-center mb-2">
														<div className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-bold text-white rounded-full bg-primary">{item.step}</div>
														<h4 className="ml-2 text-sm font-semibold text-foreground">{item.title}</h4>
													</div>
													<p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
												</div>
											))}
										</div>
									</div>

									{/* Performance Guarantee */}
									<div className="p-6 border bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl border-green-200/50">
										<div className="flex items-start space-x-4">
											<div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-500 rounded-full">
												<Shield className="w-5 h-5 text-white" />
											</div>
											<div className="space-y-2">
												<h3 className="text-lg font-semibold text-foreground">Performance Guarantee</h3>
												<p className="text-sm leading-relaxed text-muted-foreground">All Thorbis Certified businesses are backed by our Performance Guarantee. If you&apos;re not satisfied with the service, we&apos;ll work to make it right through mediation and resolution services.</p>
												<div className="flex flex-wrap gap-2 mt-3">
													<Badge className="text-white bg-green-500">100% Satisfaction</Badge>
													<Badge className="text-white bg-blue-500">Mediation Backed</Badge>
													<Badge className="text-white bg-purple-500">Quality Assured</Badge>
												</div>
											</div>
										</div>
									</div>

									{/* Call to Action */}
									<div className="p-6 text-center border bg-gradient-to-r from-primary/5 to-blue/5 rounded-xl border-primary/20">
										<div className="space-y-4">
											<div>
												<h3 className="mb-2 text-xl font-semibold text-foreground">Ready to Get Certified?</h3>
												<p className="text-sm text-muted-foreground">Join thousands of verified businesses in the Thorbis network</p>
											</div>
											<div className="flex flex-col justify-center gap-3 sm:flex-row">
												<Button className="bg-primary hover:bg-primary/90">
													<Award className="w-4 h-4 mr-2" />
													Start Application
												</Button>
												<Button variant="outline" className="border-border hover:bg-muted">
													<Phone className="w-4 h-4 mr-2" />
													Call (555) 123-CERT
												</Button>
											</div>
										</div>
									</div>
								</div>
							</section>

							{/* 3. REVIEWS & NEIGHBORHOOD INSIGHTS SECTION - Social Proof */}
							<section ref={sectionRefs.reviews}>
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
							<section ref={sectionRefs.credentials}>
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
							<section ref={sectionRefs.availability}>
								<div className="mb-6 sm:mb-8 md:mb-12">
									<h2 className="flex items-center mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-foreground">
										<Zap className="w-6 h-6 mr-3 sm:w-8 sm:h-8 sm:mr-4 text-primary" />⚡ Live Availability & Booking
									</h2>
									<div className="w-20 h-1 rounded-full sm:w-24 sm:h-1.5 bg-gradient-to-r from-primary to-primary/50"></div>
								</div>

								<div className="space-y-8">
									{/* Live Availability */}
									<div className="p-6 border bg-card/30 rounded-xl border-border">
										<div className="flex items-center gap-2 mb-4">
											<Badge className="text-white bg-green-500 animate-pulse">LIVE</Badge>
											<span className="text-sm font-medium text-green-600">{business.realTimeAvailability.currentStatus}</span>
										</div>

										<div className="grid gap-6 md:grid-cols-2">
											{/* Current Status */}
											<div className="p-4 border rounded-lg bg-card/30 border-border">
												<h3 className="mb-2 font-semibold text-foreground">Current Status</h3>
												<div className="flex items-center space-x-3">
													<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
													<div>
														<p className="font-medium text-green-600">{business.realTimeAvailability.currentStatus}</p>
														<p className="text-sm text-muted-foreground">GPS tracking • {business.realTimeAvailability.avgResponseTime} avg response</p>
													</div>
												</div>
											</div>

											{/* Next Available */}
											<div className="p-4 border rounded-lg bg-card/30 border-border">
												<h3 className="mb-2 font-semibold text-foreground">Next Available</h3>
												<p className="text-xl font-bold text-primary">{business.realTimeAvailability.nextAvailable}</p>
												<Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
													Book Now
												</Button>
											</div>
										</div>

										{/* Time Slots */}
										<div className="mt-4">
											<h3 className="mb-3 font-semibold text-foreground">Available Today</h3>
											<div className="grid grid-cols-3 gap-2 md:grid-cols-6">
												{business.realTimeAvailability.todaySlots.map((slot, index) => (
													<button key={index} className={`p-2 text-sm border rounded-lg transition-all ${slot.available ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : "border-gray-200 bg-gray-50 text-gray-400"}`} disabled={!slot.available}>
														{slot.time}
													</button>
												))}
											</div>
										</div>
									</div>

									{/* Video Consultation Option */}
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
												<h3 className="mb-3 font-semibold text-foreground">📹 Video Consultation</h3>
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

							{/* 5. SERVICES & WORK SHOWCASE SECTION - What They Offer & Proof */}
							<section ref={sectionRefs.services}>
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
							<section ref={sectionRefs.expertise}>
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
							<section ref={sectionRefs.pricing}>
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
							<section ref={sectionRefs.videoConsult}>
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
							<section ref={sectionRefs.emergencyServices}>
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
							<section ref={sectionRefs.businessTransparency}>
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
							<section ref={sectionRefs.information}>
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
							<section ref={sectionRefs.recognition}>
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
							<section ref={sectionRefs.warrantyTracker}>
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

													{/* Progress Bar */}
													<div className="mb-3">
														<div className="flex justify-between mb-1 text-sm">
															<span className="text-muted-foreground">Coverage Progress</span>
															<span className="text-foreground">Until {warranty.endDate}</span>
														</div>
														<div className="w-full h-2 bg-gray-200 rounded-full">
															<div className="h-2 transition-all duration-300 bg-purple-500 rounded-full" style={{ width: "75%" }} />
														</div>
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
							<section ref={sectionRefs.faq}>
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
							<section ref={sectionRefs.careers}>
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
							<section ref={sectionRefs.partnerships}>
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

			{/* Floating Scroll Spy Navigation - Desktop Only */}
			{showScrollSpy && (
				<div className="fixed z-30 hidden ease-out -translate-y-1/2 lg:block left-6 top-1/2 animate-in slide-in-from-left-4 fade-in-0 duration-400">
					<div className="p-2 border shadow-lg bg-card/90 backdrop-blur-md border-border rounded-xl">
						<div className="space-y-1">
							{navigationItems.map((item, index) => {
								const Icon = item.icon;
								const isActive = activeSection === item.id;
								const isCertification = item.id === "certification";
								return (
									<button
										key={item.id}
										onClick={() => scrollToSection(item.id)}
										className={`group relative flex items-center p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 animate-in slide-in-from-left-2 fade-in-0 ${
											isCertification
												? isActive
													? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg shadow-blue-500/25"
													: "bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 text-blue-600 hover:from-blue-100 hover:to-green-100 dark:hover:from-blue-900/40 dark:hover:to-green-900/40 border border-blue-200/50 shadow-md"
												: isActive
												? "bg-primary text-primary-foreground shadow-md"
												: "text-muted-foreground hover:text-foreground hover:bg-muted"
										}`}
										style={{ animationDelay: `${index * 50 + 200}ms`, animationDuration: "300ms" }}
										title={item.label}
									>
										<Icon className={`w-5 h-5 transition-transform duration-200 ${isCertification ? "animate-pulse" : ""}`} />

										{/* Enhanced Tooltip for Certification */}
										<div className={`absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 z-50 ${isCertification ? "bg-gradient-to-r from-blue-600 to-green-600 text-white border border-blue-500/50 shadow-xl" : isActive ? "opacity-100" : ""}`}>
											{isCertification ? (
												<div className="flex items-center space-x-2">
													<Award className="w-4 h-4" />
													<span className="font-semibold">{item.label}</span>
													<div className="px-2 py-0.5 bg-white/20 rounded text-xs">NEW</div>
												</div>
											) : (
												item.label
											)}
										</div>
									</button>
								);
							})}
						</div>
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
