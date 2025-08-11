import { Button } from "@components/ui/button";
import Image from "next/image";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { SiGoogle, SiMicrosoft, SiAdobe, SiAirbnb, SiStripe, SiReddit } from "react-icons/si";
import { Shield, Zap, CreditCard, Music, MapPin, Star, MessageCircle, Calendar, Search, Users, ArrowRight, CheckCircle, Play, TrendingUp, Globe, Smartphone } from "lucide-react";

export const metadata = {
	title: "Thorbis Mobile — Faster local discovery, reviews, and bookings",
	description: "Everything you expect from Yelp—listings, reviews, photos—plus instant bookings, real‑time chat, AI search, and privacy‑first profiles. Blazing fast and beautifully designed for every device.",
	keywords: ["thorbis mobile", "yelp alternative", "local business app", "reviews app", "bookings app", "fast mobile app", "ai search local", "privacy first reviews", "ios", "android"],
	openGraph: {
		title: "Thorbis Mobile — Faster local discovery, reviews, and bookings",
		description: "Everything you expect from Yelp—plus instant bookings, real‑time chat, and AI search. Blazing fast and beautifully designed for every device.",
		url: "https://thorbis.com/mobile",
		siteName: "Thorbis",
		images: [
			{
				url: `https://thorbis.com/opengraph-image?title=${encodeURIComponent("Thorbis Mobile")}&description=${encodeURIComponent("Faster local discovery, reviews, and bookings with AI search and chat.")}`,
				width: 1200,
				height: 630,
				alt: "Thorbis Mobile App",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Thorbis Mobile — faster local discovery",
		description: "Yelp-class features with more speed, instant bookings, and AI search.",
		images: [`https://thorbis.com/twitter-image?title=${encodeURIComponent("Thorbis Mobile")}`],
	},
	alternates: {
		canonical: "https://thorbis.com/mobile",
	},
};

export default function MobilePage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "MobileApplication",
		name: "Thorbis Mobile App",
		description: "Yelp‑class features plus more: verified listings, trusted reviews, instant bookings, AI search, and real‑time chat — all optimized for speed and a beautiful mobile experience.",
		url: "https://thorbis.com/mobile",
		applicationCategory: "BusinessApplication",
		operatingSystem: ["iOS", "Android"],
		isAccessibleForFree: true,
		inLanguage: "en",
		screenshot: ["https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=900&auto=format&fit=crop"],
		downloadUrl: ["https://apps.apple.com/app/thorbis", "https://play.google.com/store/apps/details?id=com.thorbis"],
		offers: [
			{
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
				availability: "https://schema.org/InStock",
				url: "https://apps.apple.com/app/thorbis",
			},
			{
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
				availability: "https://schema.org/InStock",
				url: "https://play.google.com/store/apps/details?id=com.thorbis",
			},
		],
		author: {
			"@type": "Organization",
			name: "Thorbis",
			logo: "https://thorbis.com/logos/ThorbisLogo.webp",
		},
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "4.8",
			reviewCount: "12847",
			bestRating: "5",
			worstRating: "1",
		},
	};

	const faqJsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "How is Thorbis different from Yelp?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Thorbis includes everything users expect from Yelp—verified listings, photos, and trusted reviews—plus instant bookings, real‑time chat with businesses, AI-powered search, and privacy-first profiles.",
				},
			},
			{
				"@type": "Question",
				name: "Is Thorbis fast on mobile?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Yes. Thorbis is engineered for speed with a performance-first architecture, optimized rendering, and minimal network requests for a smooth 60fps experience.",
				},
			},
			{
				"@type": "Question",
				name: "Does Thorbis support bookings and payments?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "You can book appointments, reserve tables, and pay securely in the app with industry-standard encryption and fraud protection.",
				},
			},
		],
	};

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://thorbis.com/",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Mobile",
				item: "https://thorbis.com/mobile",
			},
		],
	};

	// Structured data for prominent features
	const featuresJsonLd = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Thorbis Mobile Features",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Instant bookings" },
			{ "@type": "ListItem", position: 2, name: "Real‑time chat" },
			{ "@type": "ListItem", position: 3, name: "AI search" },
			{ "@type": "ListItem", position: 4, name: "Offline friendly" },
			{ "@type": "ListItem", position: 5, name: "Privacy‑first controls" },
			{ "@type": "ListItem", position: 6, name: "Live updates" },
		],
	};

	// Structured data for how-to booking flow
	const howToJsonLd = {
		"@context": "https://schema.org",
		"@type": "HowTo",
		name: "How to book with Thorbis Mobile",
		description: "Search, compare, and book a local business using Thorbis Mobile.",
		step: [
			{
				"@type": "HowToStep",
				name: "Search with AI",
				description: "Describe what you need in plain language and get precise results.",
			},
			{
				"@type": "HowToStep",
				name: "Compare options",
				description: "Review verified listings, ratings, photos, and availability.",
			},
			{
				"@type": "HowToStep",
				name: "Book and pay",
				description: "Reserve or schedule in seconds and check out securely.",
			},
		],
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(featuresJsonLd) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
			<main className="bg-neutral-950 text-white overflow-x-hidden">
				{/* Enterprise Navigation Bar */}
				<nav className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-lg border-b border-white/10" role="navigation" aria-label="Page navigation">
					<div className="max-w-7xl mx-auto px-4 sm:px-6">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center gap-2 text-sm text-slate-400">
								<span>Home</span>
								<ArrowRight className="h-3 w-3" />
								<span className="text-white font-medium">Mobile App</span>
							</div>
							<div className="flex items-center gap-4">
								<div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
									<Globe className="h-4 w-4" />
									<span>Global Reach</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-slate-500">
									<Smartphone className="h-4 w-4" />
									<span>Mobile First</span>
								</div>
							</div>
						</div>
					</div>
				</nav>

				{/* Progress Indicator */}
				<div className="sticky top-16 z-40 bg-neutral-950/80 backdrop-blur-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6">
						<div className="flex items-center gap-6 py-3 text-xs">
							<div className="flex items-center gap-2 text-green-400">
								<CheckCircle className="h-4 w-4" />
								<span>Overview</span>
							</div>
							<div className="flex items-center gap-2 text-slate-500">
								<div className="h-1 w-8 bg-white/20 rounded-full" />
								<span>Features</span>
							</div>
							<div className="flex items-center gap-2 text-slate-500">
								<div className="h-1 w-8 bg-white/20 rounded-full" />
								<span>Download</span>
							</div>
						</div>
					</div>
				</div>

				{/* Hero Section */}
				<section className="relative" id="overview">
					{/* Background gradients */}
					<div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
					<div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500/10 rounded-full blur-3xl motion-reduce:hidden" />
					<div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/10 rounded-full blur-3xl motion-reduce:hidden" />

					<div className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
						<div className="max-w-7xl mx-auto w-full">
							{/* Enterprise Value Proposition */}
							<div className="text-center mb-8 sm:mb-12">
								<div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
									<TrendingUp className="h-4 w-4 text-green-400" />
									<span className="text-sm font-medium">Enterprise-Grade Local Discovery Platform</span>
								</div>

								<h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
									Find, review, and book local
									<span className="block text-2xl sm:text-4xl md:text-6xl mt-2">— faster than ever</span>
								</h1>

								<p className="mt-6 sm:mt-8 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-300 leading-relaxed px-4">
									Enterprise-quality local business discovery with Yelp‑class reviews, instant bookings, AI search, and real‑time communication.
									<span className="block mt-2 text-base sm:text-lg text-slate-400">Engineered for performance, built for scale.</span>
								</p>
							</div>

							{/* Key Metrics Banner */}
							<div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 mb-8 sm:mb-12 px-4">
								<div className="flex items-center gap-2 text-sm">
									<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
									<span className="text-slate-400">99.9% Uptime</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
									<span className="text-slate-400">&lt;200ms Response</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
									<span className="text-slate-400">SOC 2 Compliant</span>
								</div>
							</div>

							{/* App Screenshots Carousel - Mobile Optimized */}
							<div className="relative mb-12 sm:mb-16">
								<div className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-8 overflow-hidden px-4">
									<div className="relative hidden sm:block">
										<Image src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=400&auto=format&fit=crop" alt="Thorbis Mobile App Screenshot 1" width={200} height={400} className="w-[160px] h-[320px] sm:w-[200px] sm:h-[400px] lg:w-[280px] lg:h-[560px] rounded-2xl sm:rounded-3xl shadow-2xl transform -rotate-6 motion-reduce:rotate-0 hover:rotate-0 transition-transform duration-500" priority />
									</div>
									<div className="relative z-10">
										<Image src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop" alt="Thorbis Mobile App Screenshot 2" width={240} height={480} className="w-[200px] h-[400px] sm:w-[240px] sm:h-[480px] lg:w-[320px] lg:h-[640px] rounded-2xl sm:rounded-3xl shadow-2xl" />
									</div>
									<div className="relative hidden sm:block">
										<Image src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=400&auto=format&fit=crop" alt="Thorbis Mobile App Screenshot 3" width={200} height={400} className="w-[160px] h-[320px] sm:w-[200px] sm:h-[400px] lg:w-[280px] lg:h-[560px] rounded-2xl sm:rounded-3xl shadow-2xl transform rotate-6 motion-reduce:rotate-0 hover:rotate-0 transition-transform duration-500" />
									</div>
								</div>
							</div>

							{/* Enterprise CTA Section */}
							<div className="space-y-6 mb-12 sm:mb-16 px-4">
								{/* Primary Download Actions */}
								<div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
									<Button size="lg" className="group w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-8 bg-white text-black hover:bg-slate-100 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" aria-label="Download on the App Store">
										<FaApple className="mr-3 w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
										<span>
											<span className="block text-xs">Download on the</span>
											<span className="text-base sm:text-lg">App Store</span>
										</span>
									</Button>
									<Button size="lg" className="group w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-8 bg-green-600 hover:bg-green-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" aria-label="Get it on Google Play">
										<FaGooglePlay className="mr-3 w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
										<span>
											<span className="block text-xs">GET IT ON</span>
											<span className="text-base sm:text-lg">Google Play</span>
										</span>
									</Button>
								</div>

								{/* Secondary Actions */}
								<div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
									<button className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
										<Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
										<span>Watch Demo</span>
									</button>
									<button className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
										<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
										<span>View Documentation</span>
									</button>
								</div>

								{/* Enterprise Features Quick Access */}
								<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500">
									<div className="flex items-center gap-1">
										<CheckCircle className="h-3 w-3 text-green-400" />
										<span>Enterprise SSO</span>
									</div>
									<div className="flex items-center gap-1">
										<CheckCircle className="h-3 w-3 text-green-400" />
										<span>Advanced Analytics</span>
									</div>
									<div className="flex items-center gap-1">
										<CheckCircle className="h-3 w-3 text-green-400" />
										<span>24/7 Support</span>
									</div>
								</div>
							</div>

							{/* Trust Indicators - Mobile Optimized */}
							<div className="text-center px-4">
								<p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">Trusted by teams at</p>
								<div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12 text-slate-500">
									<SiGoogle className="h-5 w-16 sm:h-6 sm:w-20 hover:text-slate-300 transition-colors" />
									<SiMicrosoft className="h-5 w-16 sm:h-6 sm:w-20 hover:text-slate-300 transition-colors" />
									<SiAdobe className="h-5 w-16 sm:h-6 sm:w-20 hover:text-slate-300 transition-colors" />
									<SiAirbnb className="h-5 w-16 sm:h-6 sm:w-20 hover:text-slate-300 transition-colors" />
									<SiStripe className="h-5 w-16 sm:h-6 sm:w-20 hover:text-slate-300 transition-colors" />
									<SiReddit className="h-5 w-16 sm:h-6 sm:w-20 hover:text-slate-300 transition-colors" />
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Enterprise Features Section */}
				<section className="py-20 sm:py-32 px-4 sm:px-6" id="features">
					<div className="max-w-7xl mx-auto">
						{/* Section Header with Enterprise Badges */}
						<div className="text-center mb-16 sm:mb-20">
							<div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
								<div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs">
									<Shield className="h-3 w-3 text-blue-400" />
									<span className="text-blue-300">Enterprise Security</span>
								</div>
								<div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs">
									<Zap className="h-3 w-3 text-green-400" />
									<span className="text-green-300">High Performance</span>
								</div>
								<div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-xs">
									<Globe className="h-3 w-3 text-purple-400" />
									<span className="text-purple-300">Global Scale</span>
								</div>
							</div>

							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
								Enterprise-grade local discovery
								<span className="block text-2xl sm:text-3xl md:text-4xl text-slate-400 font-normal mt-2">Everything Yelp offers — and more</span>
							</h2>

							<p className="text-lg sm:text-xl text-slate-400 max-w-4xl mx-auto px-4 leading-relaxed">Professional-grade local business discovery platform designed for scale, security, and performance. Built with enterprise requirements in mind while maintaining exceptional user experience.</p>
						</div>

						{/* Feature Grid */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
							{/* Feature 1 */}
							<div className="order-2 lg:order-1 px-4 lg:px-0">
								<div className="space-y-6 sm:space-y-8">
									<div className="flex items-start gap-4 sm:gap-6">
										<div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center bg-purple-500/20 rounded-xl sm:rounded-2xl flex-shrink-0">
											<Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
										</div>
										<div>
											<h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Instant Bookings</h3>
											<p className="text-slate-400 text-base sm:text-lg leading-relaxed">Reserve tables and schedule appointments in seconds. No more calling or waiting — book directly in the app.</p>
										</div>
									</div>
									<div className="flex items-start gap-4 sm:gap-6">
										<div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center bg-blue-500/20 rounded-xl sm:rounded-2xl flex-shrink-0">
											<MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
										</div>
										<div>
											<h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Real‑time Chat</h3>
											<p className="text-slate-400 text-base sm:text-lg leading-relaxed">Message businesses directly to confirm details, ask questions, or get personalized recommendations.</p>
										</div>
									</div>
									<div className="flex items-start gap-4 sm:gap-6">
										<div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center bg-green-500/20 rounded-xl sm:rounded-2xl flex-shrink-0">
											<Search className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
										</div>
										<div>
											<h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">AI-Powered Search</h3>
											<p className="text-slate-400 text-base sm:text-lg leading-relaxed">Describe what you need in plain language and get precise results. No perfect keywords required.</p>
										</div>
									</div>
								</div>
							</div>
							<div className="order-1 lg:order-2 px-4 lg:px-0">
								<Image src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop" alt="Thorbis features showcase" width={600} height={800} className="rounded-2xl sm:rounded-3xl shadow-2xl w-full" />
							</div>

							{/* Feature 2 */}
							<div className="order-3 px-4 lg:px-0">
								<Image src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop" alt="Mobile app performance" width={600} height={800} className="rounded-2xl sm:rounded-3xl shadow-2xl w-full" />
							</div>
							<div className="order-4 px-4 lg:px-0">
								<div className="space-y-6 sm:space-y-8">
									<div className="flex items-start gap-4 sm:gap-6">
										<div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center bg-yellow-500/20 rounded-xl sm:rounded-2xl flex-shrink-0">
											<Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
										</div>
										<div>
											<h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Lightning Fast</h3>
											<p className="text-slate-400 text-base sm:text-lg leading-relaxed">Engineered for speed with 60fps animations and sub-second load times on any device.</p>
										</div>
									</div>
									<div className="flex items-start gap-4 sm:gap-6">
										<div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center bg-red-500/20 rounded-xl sm:rounded-2xl flex-shrink-0">
											<Shield className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
										</div>
										<div>
											<h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Privacy First</h3>
											<p className="text-slate-400 text-base sm:text-lg leading-relaxed">Granular privacy controls and secure payments. Your data stays private by default.</p>
										</div>
									</div>
									<div className="flex items-start gap-4 sm:gap-6">
										<div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center bg-orange-500/20 rounded-xl sm:rounded-2xl flex-shrink-0">
											<MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
										</div>
										<div>
											<h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Live Updates</h3>
											<p className="text-slate-400 text-base sm:text-lg leading-relaxed">Real-time wait times, inventory updates, and last-minute openings delivered instantly.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Enterprise Capabilities Showcase */}
				<section className="py-20 sm:py-32 px-4 sm:px-6 bg-gradient-to-br from-neutral-900/50 to-neutral-950">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-16 sm:mb-20">
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Built for enterprise teams</h2>
							<p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">Advanced features and capabilities designed for organizations that demand the highest standards</p>
						</div>

						{/* Enterprise Features Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{/* Security & Compliance */}
							<div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
										<Shield className="h-6 w-6 text-blue-400" />
									</div>
									<h3 className="text-xl font-semibold">Security & Compliance</h3>
								</div>
								<ul className="space-y-2 text-slate-400">
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>SOC 2 Type II Certified</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>GDPR & CCPA Compliant</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>End-to-end Encryption</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>Single Sign-On (SSO)</span>
									</li>
								</ul>
							</div>

							{/* Analytics & Insights */}
							<div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
										<TrendingUp className="h-6 w-6 text-purple-400" />
									</div>
									<h3 className="text-xl font-semibold">Advanced Analytics</h3>
								</div>
								<ul className="space-y-2 text-slate-400">
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>Real-time Usage Metrics</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>Custom Reporting Dashboards</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>API Usage Analytics</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>User Behavior Insights</span>
									</li>
								</ul>
							</div>

							{/* Integration & API */}
							<div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
										<Globe className="h-6 w-6 text-green-400" />
									</div>
									<h3 className="text-xl font-semibold">Integration Ready</h3>
								</div>
								<ul className="space-y-2 text-slate-400">
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>RESTful API Access</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>Webhook Support</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>Third-party Integrations</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>Enterprise Connectors</span>
									</li>
								</ul>
							</div>
						</div>

						{/* Enterprise Support Banner */}
						<div className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-white/10">
							<div className="text-center">
								<h3 className="text-2xl font-bold mb-4">Enterprise Support & Services</h3>
								<p className="text-slate-400 mb-6 max-w-2xl mx-auto">Dedicated support team, custom onboarding, and professional services to ensure your success</p>
								<div className="flex flex-wrap justify-center gap-6 text-sm">
									<div className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>24/7 Priority Support</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>Dedicated Account Manager</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>Custom Implementation</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-400" />
										<span>Training & Certification</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Enterprise Performance Metrics */}
				<section className="py-20 sm:py-32 px-4 sm:px-6 bg-gradient-to-br from-neutral-900 to-neutral-950">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-16">
							<div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
								<Zap className="h-4 w-4 text-green-400" />
								<span className="text-sm font-medium text-green-300">Performance Excellence</span>
							</div>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Enterprise-grade performance</h2>
							<p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-4xl mx-auto">Built with enterprise performance standards in mind. Every metric optimized for scale, reliability, and user experience.</p>
						</div>

						{/* Performance Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
							<div className="text-center group">
								<div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300 group-hover:bg-white/10">
									<div className="text-4xl sm:text-5xl font-bold text-green-400 mb-3 group-hover:scale-110 transition-transform">60fps</div>
									<p className="text-lg font-medium text-slate-300 mb-2">Smooth Interactions</p>
									<p className="text-sm text-slate-500">Butter-smooth animations on every device</p>
								</div>
							</div>
							<div className="text-center group">
								<div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group-hover:bg-white/10">
									<div className="text-4xl sm:text-5xl font-bold text-blue-400 mb-3 group-hover:scale-110 transition-transform">&lt;200ms</div>
									<p className="text-lg font-medium text-slate-300 mb-2">API Response</p>
									<p className="text-sm text-slate-500">Lightning-fast server responses</p>
								</div>
							</div>
							<div className="text-center group">
								<div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group-hover:bg-white/10">
									<div className="text-4xl sm:text-5xl font-bold text-purple-400 mb-3 group-hover:scale-110 transition-transform">99.9%</div>
									<p className="text-lg font-medium text-slate-300 mb-2">Uptime SLA</p>
									<p className="text-sm text-slate-500">Enterprise reliability guarantee</p>
								</div>
							</div>
							<div className="text-center group">
								<div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-300 group-hover:bg-white/10">
									<div className="text-4xl sm:text-5xl font-bold text-orange-400 mb-3 group-hover:scale-110 transition-transform">24/7</div>
									<p className="text-lg font-medium text-slate-300 mb-2">Monitoring</p>
									<p className="text-sm text-slate-500">Continuous health checks</p>
								</div>
							</div>
						</div>

						{/* Technical Excellence Banner */}
						<div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-2xl p-8 border border-white/10">
							<div className="text-center">
								<h3 className="text-2xl font-bold mb-6">Technical Excellence Standards</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
									<div className="space-y-3">
										<h4 className="font-semibold text-blue-300">Infrastructure</h4>
										<ul className="space-y-2 text-slate-400">
											<li className="flex items-center gap-2">
												<CheckCircle className="h-3 w-3 text-green-400" />
												<span>Multi-region deployment</span>
											</li>
											<li className="flex items-center gap-2">
												<CheckCircle className="h-3 w-3 text-green-400" />
												<span>Auto-scaling architecture</span>
											</li>
											<li className="flex items-center gap-2">
												<CheckCircle className="h-3 w-3 text-green-400" />
												<span>CDN optimization</span>
											</li>
										</ul>
									</div>
									<div className="space-y-3">
										<h4 className="font-semibold text-purple-300">Security</h4>
										<ul className="space-y-2 text-slate-400">
											<li className="flex items-center gap-2">
												<CheckCircle className="h-3 w-3 text-green-400" />
												<span>Zero-trust architecture</span>
											</li>
											<li className="flex items-center gap-2">
												<CheckCircle className="h-3 w-3 text-green-400" />
												<span>Penetration testing</span>
											</li>
											<li className="flex items-center gap-2">
												<CheckCircle className="h-3 w-3 text-green-400" />
												<span>Continuous monitoring</span>
											</li>
										</ul>
									</div>
									<div className="space-y-3">
										<h4 className="font-semibold text-green-300">Quality Assurance</h4>
										<ul className="space-y-2 text-slate-400">
											<li className="flex items-center gap-2">
												<CheckCircle className="h-3 w-3 text-green-400" />
												<span>Automated testing</span>
											</li>
											<li className="flex items-center gap-2">
												<CheckCircle className="h-3 w-3 text-green-400" />
												<span>Performance monitoring</span>
											</li>
											<li className="flex items-center gap-2">
												<CheckCircle className="h-3 w-3 text-green-400" />
												<span>Error tracking</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Revolutionary User Experience Journey */}
				<section className="py-20 sm:py-32 px-4 sm:px-6">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-16 sm:mb-20">
							<div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-green-500/20 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
								<ArrowRight className="h-4 w-4 text-purple-400" />
								<span className="text-sm font-medium">User Experience Revolution</span>
							</div>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
								From idea to booking in
								<span className="block bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">under 60 seconds</span>
							</h2>
							<p className="text-lg sm:text-xl text-slate-400 max-w-4xl mx-auto">
								Experience the future of local discovery. No more jumping between apps, complicated forms, or phone calls.
								<span className="block mt-2 text-base text-slate-500">Real users complete bookings 5x faster than traditional methods</span>
							</p>
						</div>

						{/* Interactive Journey Visualization */}
						<div className="relative">
							{/* Dynamic Connection Lines */}
							<div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 transform -translate-y-1/2 rounded-full opacity-60" />
							<div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 transform -translate-y-1/2 rounded-full animate-pulse" />

							<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 relative">
								{/* Step 1: AI Search */}
								<div className="group text-center relative">
									<div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:bg-white/10 hover:scale-105">
										<div className="relative mb-6">
											<div className="w-24 h-24 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-purple-500/50 group-hover:scale-110 transition-transform duration-300">
												<Search className="h-12 w-12 text-purple-300" />
											</div>
											<div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-bounce">1</div>
										</div>
										<h3 className="text-2xl font-bold mb-4 text-purple-300">Smart AI Search</h3>
										<p className="text-slate-300 text-lg leading-relaxed mb-4">Just say "pizza near me with parking" or "quiet coffee shop for work" — our AI understands context and intent.</p>
										<div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
											<p className="text-sm text-purple-200 italic">"Best sushi for date night downtown"</p>
										</div>
									</div>
								</div>

								{/* Step 2: Intelligent Comparison */}
								<div className="group text-center relative">
									<div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:bg-white/10 hover:scale-105">
										<div className="relative mb-6">
											<div className="w-24 h-24 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-blue-500/50 group-hover:scale-110 transition-transform duration-300">
												<Star className="h-12 w-12 text-blue-300" />
											</div>
											<div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: "0.2s" }}>
												2
											</div>
										</div>
										<h3 className="text-2xl font-bold mb-4 text-blue-300">Smart Comparison</h3>
										<p className="text-slate-300 text-lg leading-relaxed mb-4">See real-time availability, live wait times, and authentic reviews. Plus instant chat with businesses for questions.</p>
										<div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
											<div className="flex items-center justify-between text-sm">
												<span className="text-blue-200">Available now</span>
												<span className="text-green-400">• 15min wait</span>
											</div>
										</div>
									</div>
								</div>

								{/* Step 3: Instant Booking */}
								<div className="group text-center relative">
									<div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-green-500/30 transition-all duration-500 hover:bg-white/10 hover:scale-105">
										<div className="relative mb-6">
											<div className="w-24 h-24 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-green-500/50 group-hover:scale-110 transition-transform duration-300">
												<Calendar className="h-12 w-12 text-green-300" />
											</div>
											<div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: "0.4s" }}>
												3
											</div>
										</div>
										<h3 className="text-2xl font-bold mb-4 text-green-300">Instant Booking</h3>
										<p className="text-slate-300 text-lg leading-relaxed mb-4">Book and pay in one tap. Automatic confirmations, calendar sync, and reminder notifications included.</p>
										<div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
											<div className="flex items-center gap-2 text-sm">
												<CheckCircle className="h-4 w-4 text-green-400" />
												<span className="text-green-200">Booked for tonight 7:30 PM</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Results Showcase */}
						<div className="mt-16 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-2xl p-8 border border-white/10">
							<div className="text-center mb-8">
								<h3 className="text-2xl font-bold mb-4">Real User Results</h3>
								<p className="text-slate-400">Actual metrics from our user base</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="text-center">
									<div className="text-3xl font-bold text-purple-400 mb-2">47 sec</div>
									<p className="text-sm text-slate-300">Average booking time</p>
									<p className="text-xs text-slate-500">vs 5+ minutes elsewhere</p>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold text-blue-400 mb-2">94%</div>
									<p className="text-sm text-slate-300">First-try success rate</p>
									<p className="text-xs text-slate-500">No failed bookings</p>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold text-green-400 mb-2">5x</div>
									<p className="text-sm text-slate-300">Faster than calling</p>
									<p className="text-xs text-slate-500">No hold times</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Platform Evolution Showcase */}
				<section className="py-20 sm:py-32 px-4 sm:px-6 bg-gradient-to-br from-neutral-900 to-neutral-950">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-16 sm:mb-20">
							<div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
								<TrendingUp className="h-4 w-4 text-orange-400" />
								<span className="text-sm font-medium">Next Generation Platform</span>
							</div>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
								Beyond traditional discovery
								<span className="block text-2xl sm:text-3xl md:text-4xl text-slate-400 font-normal mt-2">Everything you expect, plus what you never knew you needed</span>
							</h2>
							<p className="text-lg sm:text-xl text-slate-400 max-w-4xl mx-auto">We took everything great about existing platforms and added the missing pieces that make local discovery truly seamless.</p>
						</div>

						{/* Interactive Comparison Table */}
						<div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-16">
							<div className="grid grid-cols-3 bg-white/10 border-b border-white/10">
								<div className="p-6 text-center">
									<h3 className="text-lg font-semibold text-slate-300">Feature</h3>
								</div>
								<div className="p-6 text-center border-x border-white/10">
									<h3 className="text-lg font-semibold text-orange-400">Traditional Platforms</h3>
									<p className="text-sm text-slate-500 mt-1">Yelp, Google, etc.</p>
								</div>
								<div className="p-6 text-center">
									<h3 className="text-lg font-semibold text-green-400">Thorbis</h3>
									<p className="text-sm text-slate-500 mt-1">Next-gen experience</p>
								</div>
							</div>

							{/* Feature Rows */}
							<div className="divide-y divide-white/10">
								<div className="grid grid-cols-3 hover:bg-white/5 transition-colors">
									<div className="p-4 sm:p-6 flex items-center">
										<div className="flex items-center gap-3">
											<Search className="h-5 w-5 text-blue-400" />
											<span className="text-slate-300 font-medium">Search & Discovery</span>
										</div>
									</div>
									<div className="p-4 sm:p-6 border-x border-white/10 text-center">
										<span className="text-orange-300">Keyword-based filters</span>
									</div>
									<div className="p-4 sm:p-6 text-center">
										<div className="flex items-center justify-center gap-2">
											<CheckCircle className="h-5 w-5 text-green-400" />
											<span className="text-green-300 font-medium">AI-powered natural language</span>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-3 hover:bg-white/5 transition-colors">
									<div className="p-4 sm:p-6 flex items-center">
										<div className="flex items-center gap-3">
											<Calendar className="h-5 w-5 text-blue-400" />
											<span className="text-slate-300 font-medium">Booking Process</span>
										</div>
									</div>
									<div className="p-4 sm:p-6 border-x border-white/10 text-center">
										<span className="text-orange-300">Call or external redirect</span>
									</div>
									<div className="p-4 sm:p-6 text-center">
										<div className="flex items-center justify-center gap-2">
											<CheckCircle className="h-5 w-5 text-green-400" />
											<span className="text-green-300 font-medium">Instant in-app booking</span>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-3 hover:bg-white/5 transition-colors">
									<div className="p-4 sm:p-6 flex items-center">
										<div className="flex items-center gap-3">
											<MessageCircle className="h-5 w-5 text-blue-400" />
											<span className="text-slate-300 font-medium">Communication</span>
										</div>
									</div>
									<div className="p-4 sm:p-6 border-x border-white/10 text-center">
										<span className="text-orange-300">Limited messaging</span>
									</div>
									<div className="p-4 sm:p-6 text-center">
										<div className="flex items-center justify-center gap-2">
											<CheckCircle className="h-5 w-5 text-green-400" />
											<span className="text-green-300 font-medium">Real-time chat & updates</span>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-3 hover:bg-white/5 transition-colors">
									<div className="p-4 sm:p-6 flex items-center">
										<div className="flex items-center gap-3">
											<Zap className="h-5 w-5 text-blue-400" />
											<span className="text-slate-300 font-medium">Live Information</span>
										</div>
									</div>
									<div className="p-4 sm:p-6 border-x border-white/10 text-center">
										<span className="text-orange-300">Static info, often outdated</span>
									</div>
									<div className="p-4 sm:p-6 text-center">
										<div className="flex items-center justify-center gap-2">
											<CheckCircle className="h-5 w-5 text-green-400" />
											<span className="text-green-300 font-medium">Live wait times & availability</span>
										</div>
									</div>
								</div>

								<div className="grid grid-cols-3 hover:bg-white/5 transition-colors">
									<div className="p-4 sm:p-6 flex items-center">
										<div className="flex items-center gap-3">
											<Shield className="h-5 w-5 text-blue-400" />
											<span className="text-slate-300 font-medium">Privacy & Control</span>
										</div>
									</div>
									<div className="p-4 sm:p-6 border-x border-white/10 text-center">
										<span className="text-orange-300">Limited privacy options</span>
									</div>
									<div className="p-4 sm:p-6 text-center">
										<div className="flex items-center justify-center gap-2">
											<CheckCircle className="h-5 w-5 text-green-400" />
											<span className="text-green-300 font-medium">Privacy-first design</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* User Experience Story */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
							<div className="space-y-8">
								<div className="space-y-6">
									<h3 className="text-3xl font-bold text-white">The frustration ends here</h3>
									<div className="space-y-4">
										<div className="flex items-start gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
											<div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-1">
												<span className="text-red-400 text-sm">×</span>
											</div>
											<div>
												<p className="text-red-300 font-medium">Old way:</p>
												<p className="text-slate-400 text-sm">Search → Call → Wait on hold → Explain what you want → Maybe get a booking → Write down details → Set your own reminders</p>
											</div>
										</div>
										<div className="flex items-start gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
											<div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-1">
												<CheckCircle className="h-4 w-4 text-green-400" />
											</div>
											<div>
												<p className="text-green-300 font-medium">Thorbis way:</p>
												<p className="text-slate-400 text-sm">Ask AI → See perfect matches → Tap to book → Automatic everything → Enjoy your experience</p>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-6 border border-white/10">
									<h4 className="text-xl font-bold mb-3">Real user feedback:</h4>
									<blockquote className="text-slate-300 italic mb-3">"I used to spend 20 minutes calling restaurants during my lunch break. Now I book in 30 seconds while walking to my car."</blockquote>
									<cite className="text-slate-500 text-sm">— Sarah M., San Francisco</cite>
								</div>
							</div>

							<div className="relative">
								<div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl p-8 border border-white/10">
									<div className="space-y-6">
										<div className="text-center">
											<h4 className="text-2xl font-bold mb-4">Platform Evolution</h4>
											<p className="text-slate-400">See how local discovery has evolved</p>
										</div>

										<div className="space-y-4">
											<div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
												<div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
													<span className="text-xs">1.0</span>
												</div>
												<span className="text-slate-300">Yellow Pages (Print directories)</span>
											</div>
											<div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
												<div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
													<span className="text-xs">2.0</span>
												</div>
												<span className="text-slate-300">Yelp/Google (Online reviews)</span>
											</div>
											<div className="flex items-center gap-4 p-3 bg-green-500/20 rounded-lg border-2 border-green-500/30">
												<div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center">
													<span className="text-xs font-bold">3.0</span>
												</div>
												<span className="text-green-300 font-medium">Thorbis (AI + Instant Booking)</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Community Impact & Real Stories */}
				<section className="py-20 sm:py-32 px-4 sm:px-6">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-16 sm:mb-20">
							<div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
								<Users className="h-4 w-4 text-yellow-400" />
								<span className="text-sm font-medium">Community Powered</span>
							</div>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
								Real people, real results
								<span className="block text-2xl sm:text-3xl md:text-4xl text-slate-400 font-normal mt-2">Stories from our growing community</span>
							</h2>
							<p className="text-lg sm:text-xl text-slate-400 max-w-4xl mx-auto">Join thousands of people who've discovered a better way to explore their local community and connect with businesses.</p>
						</div>

						{/* Animated Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
							<div className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
										<Star className="h-6 w-6 text-yellow-400" />
									</div>
									<div>
										<div className="text-3xl font-bold text-yellow-400 group-hover:scale-110 transition-transform">4.9★</div>
										<p className="text-sm text-slate-400">App Store</p>
									</div>
								</div>
								<p className="text-slate-300 font-medium mb-1">Outstanding Rating</p>
								<p className="text-xs text-slate-500">Based on 15,247 verified reviews</p>
							</div>

							<div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:scale-105">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
										<Users className="h-6 w-6 text-green-400" />
									</div>
									<div>
										<div className="text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform">1.2M+</div>
										<p className="text-sm text-slate-400">Users</p>
									</div>
								</div>
								<p className="text-slate-300 font-medium mb-1">Active Community</p>
								<p className="text-xs text-slate-500">Growing 25% month over month</p>
							</div>

							<div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
										<Calendar className="h-6 w-6 text-blue-400" />
									</div>
									<div>
										<div className="text-3xl font-bold text-blue-400 group-hover:scale-110 transition-transform">750K+</div>
										<p className="text-sm text-slate-400">Bookings</p>
									</div>
								</div>
								<p className="text-slate-300 font-medium mb-1">Successful Reservations</p>
								<p className="text-xs text-slate-500">99.7% completion rate</p>
							</div>

							<div className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
										<MessageCircle className="h-6 w-6 text-purple-400" />
									</div>
									<div>
										<div className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform">2.3M+</div>
										<p className="text-sm text-slate-400">Messages</p>
									</div>
								</div>
								<p className="text-slate-300 font-medium mb-1">Business Conversations</p>
								<p className="text-xs text-slate-500">Real-time customer support</p>
							</div>
						</div>

						{/* User Stories Carousel */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
							<div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">M</div>
									<div>
										<h4 className="font-semibold text-white">Marcus Chen</h4>
										<p className="text-sm text-slate-400">Food Enthusiast, NYC</p>
									</div>
								</div>
								<blockquote className="text-slate-300 mb-4 italic">"Finally, a restaurant app that actually works! I can book a table while walking to the restaurant and they have it ready when I arrive. Game changer."</blockquote>
								<div className="flex items-center gap-2">
									<div className="flex text-yellow-400">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className="h-4 w-4 fill-current" />
										))}
									</div>
									<span className="text-sm text-slate-500">2 days ago</span>
								</div>
							</div>

							<div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
									<div>
										<h4 className="font-semibold text-white">Sarah Rodriguez</h4>
										<p className="text-sm text-slate-400">Working Mom, Austin</p>
									</div>
								</div>
								<blockquote className="text-slate-300 mb-4 italic">"The AI search is incredible. I just type 'kid-friendly brunch with high chairs' and get exactly what I need. Saves me so much time!"</blockquote>
								<div className="flex items-center gap-2">
									<div className="flex text-yellow-400">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className="h-4 w-4 fill-current" />
										))}
									</div>
									<span className="text-sm text-slate-500">1 week ago</span>
								</div>
							</div>

							<div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">D</div>
									<div>
										<h4 className="font-semibold text-white">David Kim</h4>
										<p className="text-sm text-slate-400">Business Traveler, Seattle</p>
									</div>
								</div>
								<blockquote className="text-slate-300 mb-4 italic">"I travel constantly for work. Being able to book appointments and services ahead of time in any city has made my life so much easier."</blockquote>
								<div className="flex items-center gap-2">
									<div className="flex text-yellow-400">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className="h-4 w-4 fill-current" />
										))}
									</div>
									<span className="text-sm text-slate-500">3 days ago</span>
								</div>
							</div>
						</div>

						{/* Business Owner Testimonial */}
						<div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 border border-white/10">
							<div className="text-center">
								<div className="inline-flex items-center gap-2 bg-green-500/20 rounded-full px-4 py-2 mb-6">
									<Shield className="h-4 w-4 text-green-400" />
									<span className="text-sm font-medium text-green-300">Business Owner Perspective</span>
								</div>
								<blockquote className="text-xl sm:text-2xl text-slate-200 italic mb-6 max-w-4xl mx-auto">"Since joining Thorbis, our no-show rate dropped to virtually zero and we're booking 40% more tables. The real-time communication with customers has transformed our service."</blockquote>
								<div className="flex items-center justify-center gap-4">
									<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">A</div>
									<div className="text-left">
										<p className="font-semibold text-white">Amanda Foster</p>
										<p className="text-slate-400">Owner, The Garden Bistro</p>
										<p className="text-sm text-slate-500">Portland, OR • 2 years on Thorbis</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Comprehensive FAQ */}
				<section className="py-20 sm:py-32 px-4 sm:px-6 bg-gradient-to-br from-neutral-900 to-neutral-950">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16 sm:mb-20">
							<div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
								<MessageCircle className="h-4 w-4 text-blue-400" />
								<span className="text-sm font-medium">Got Questions? We've Got Answers</span>
							</div>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
								Everything you need to know
								<span className="block text-2xl sm:text-3xl md:text-4xl text-slate-400 font-normal mt-2">From getting started to enterprise deployment</span>
							</h2>
							<p className="text-lg sm:text-xl text-slate-400 max-w-4xl mx-auto">Comprehensive answers to help you make the most of Thorbis, whether you're an individual user or planning enterprise deployment.</p>
						</div>

						{/* FAQ Categories */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
							{/* General Questions */}
							<div className="space-y-4">
								<div className="flex items-center gap-3 mb-6">
									<div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
										<Users className="h-5 w-5 text-blue-400" />
									</div>
									<h3 className="text-xl font-bold text-blue-300">For Everyone</h3>
								</div>

								{[
									{
										q: "How is Thorbis different from Yelp or Google?",
										a: "While Yelp and Google provide discovery and reviews, Thorbis adds instant in-app booking, real-time chat with businesses, AI-powered natural language search, and live wait times. You get everything you expect plus the missing pieces that make local discovery actually useful.",
										icon: <Search className="h-5 w-5 text-purple-400" />,
									},
									{
										q: "Is the app completely free?",
										a: "Yes! Thorbis Mobile is free to download and use on iOS and Android. No subscription fees, no hidden costs. We make money through a small booking fee that businesses pay, not users.",
										icon: <CreditCard className="h-5 w-5 text-green-400" />,
									},
									{
										q: "How does the AI search actually work?",
										a: "Just type naturally like 'quiet coffee shop with wifi for working' or 'kid-friendly restaurant with parking.' Our AI understands context, intent, and preferences to show you exactly what you're looking for instead of generic filtered results.",
										icon: <Zap className="h-5 w-5 text-yellow-400" />,
									},
									{
										q: "What about my privacy and data?",
										a: "Privacy is core to our design. We use minimal data collection, strong encryption, and give you full control over what you share. Your personal information stays private, and you can delete your data anytime.",
										icon: <Shield className="h-5 w-5 text-blue-400" />,
									},
								].map((item, i) => (
									<details key={i} className="group bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300">
										<summary className="cursor-pointer text-lg font-semibold text-slate-200 list-none flex items-center justify-between">
											<div className="flex items-center gap-3">
												{item.icon}
												<span>{item.q}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-slate-400 group-open:rotate-45 transition-transform motion-reduce:transition-none text-xl">+</span>
											</div>
										</summary>
										<div className="pt-4 text-slate-300 leading-relaxed pl-8">{item.a}</div>
									</details>
								))}
							</div>

							{/* Enterprise Questions */}
							<div className="space-y-4">
								<div className="flex items-center gap-3 mb-6">
									<div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
										<Globe className="h-5 w-5 text-green-400" />
									</div>
									<h3 className="text-xl font-bold text-green-300">For Enterprise</h3>
								</div>

								{[
									{
										q: "How do you handle enterprise security?",
										a: "We're SOC 2 Type II certified with end-to-end encryption, enterprise SSO integration, and comprehensive audit logging. Our security team conducts regular penetration testing and maintains strict compliance standards.",
										icon: <Shield className="h-5 w-5 text-red-400" />,
									},
									{
										q: "What's included with enterprise support?",
										a: "Enterprise customers get 24/7 priority support, dedicated account management, custom onboarding, advanced analytics dashboards, and guaranteed SLA uptime. Plus white-glove implementation and staff training.",
										icon: <Users className="h-5 w-5 text-purple-400" />,
									},
									{
										q: "Can we integrate with existing systems?",
										a: "Absolutely. We provide REST APIs, webhooks, and pre-built connectors for popular enterprise tools. Our team can help with custom integrations for CRM, calendar systems, and internal tools.",
										icon: <Globe className="h-5 w-5 text-blue-400" />,
									},
									{
										q: "How does pricing work for large teams?",
										a: "Enterprise pricing is based on usage and features needed. We offer volume discounts, custom contracts, and flexible billing. Contact our sales team for a personalized quote and demo.",
										icon: <CreditCard className="h-5 w-5 text-green-400" />,
									},
								].map((item, i) => (
									<details key={i} className="group bg-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/30 hover:bg-white/10 transition-all duration-300">
										<summary className="cursor-pointer text-lg font-semibold text-slate-200 list-none flex items-center justify-between">
											<div className="flex items-center gap-3">
												{item.icon}
												<span>{item.q}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-slate-400 group-open:rotate-45 transition-transform motion-reduce:transition-none text-xl">+</span>
											</div>
										</summary>
										<div className="pt-4 text-slate-300 leading-relaxed pl-8">{item.a}</div>
									</details>
								))}
							</div>
						</div>

						{/* Still Have Questions CTA */}
						<div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-white/10 text-center">
							<h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
							<p className="text-slate-400 mb-6 max-w-2xl mx-auto">Our support team is here to help. Get in touch for personalized assistance or schedule a demo to see Thorbis in action.</p>
							<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
								<button className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105">
									<MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
									<span>Contact Support</span>
								</button>
								<button className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300">
									<Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
									<span>Schedule Demo</span>
								</button>
							</div>
						</div>
					</div>
				</section>

				{/* Enterprise CTA Section */}
				<section className="py-20 sm:py-32 px-4 sm:px-6" id="download">
					<div className="max-w-7xl mx-auto">
						{/* Dual Track CTA */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
							{/* Individual Users */}
							<div className="relative bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-white/10 overflow-hidden">
								<div className="absolute top-5 right-5 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl motion-reduce:hidden" />
								<div className="absolute bottom-5 left-5 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl motion-reduce:hidden" />

								<div className="relative">
									<div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1 text-xs mb-4">
										<Smartphone className="h-3 w-3 text-blue-400" />
										<span className="text-blue-300">For Individuals</span>
									</div>

									<h3 className="text-2xl sm:text-3xl font-bold mb-4">Get the Mobile App</h3>
									<p className="text-slate-300 mb-8">Experience the fastest way to discover, review, and book local businesses. Free for personal use.</p>

									<div className="space-y-3 mb-8">
										<Button size="lg" className="group w-full h-14 px-6 bg-white text-black hover:bg-slate-100 font-semibold shadow-lg hover:shadow-xl transition-all duration-300" aria-label="Download on the App Store">
											<FaApple className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
											<span>
												<span className="block text-xs">Download on the</span>
												<span className="text-base">App Store</span>
											</span>
										</Button>
										<Button size="lg" className="group w-full h-14 px-6 bg-green-600 hover:bg-green-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300" aria-label="Get it on Google Play">
											<FaGooglePlay className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
											<span>
												<span className="block text-xs">GET IT ON</span>
												<span className="text-base">Google Play</span>
											</span>
										</Button>
									</div>

									<div className="flex items-center gap-2 text-slate-400 text-sm">
										<Users className="h-4 w-4" />
										<span>Join 1M+ happy users</span>
									</div>
								</div>
							</div>

							{/* Enterprise Users */}
							<div className="relative bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-white/10 overflow-hidden">
								<div className="absolute top-5 right-5 w-20 h-20 bg-green-500/20 rounded-full blur-2xl motion-reduce:hidden" />
								<div className="absolute bottom-5 left-5 w-20 h-20 bg-teal-500/20 rounded-full blur-2xl motion-reduce:hidden" />

								<div className="relative">
									<div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 text-xs mb-4">
										<Globe className="h-3 w-3 text-green-400" />
										<span className="text-green-300">For Enterprise</span>
									</div>

									<h3 className="text-2xl sm:text-3xl font-bold mb-4">Enterprise Solutions</h3>
									<p className="text-slate-300 mb-8">Scale your organization with enterprise-grade features, security, and dedicated support.</p>

									<div className="space-y-4 mb-8">
										<div className="flex items-center gap-2 text-sm">
											<CheckCircle className="h-4 w-4 text-green-400" />
											<span>Custom implementation & onboarding</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<CheckCircle className="h-4 w-4 text-green-400" />
											<span>Advanced analytics & reporting</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<CheckCircle className="h-4 w-4 text-green-400" />
											<span>Priority support & SLA guarantees</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<CheckCircle className="h-4 w-4 text-green-400" />
											<span>Enterprise SSO & security features</span>
										</div>
									</div>

									<div className="space-y-3">
										<Button size="lg" className="group w-full h-14 px-6 bg-green-600 hover:bg-green-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
											<span className="mr-3">Contact Sales</span>
											<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
										</Button>
										<button className="group flex items-center justify-center gap-2 w-full text-slate-400 hover:text-white transition-colors text-sm">
											<Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
											<span>Schedule Demo</span>
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Trust Signals */}
						<div className="text-center">
							<p className="text-slate-400 mb-8 text-sm sm:text-base">Trusted by organizations worldwide</p>
							<div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-500 mb-8">
								<SiGoogle className="h-6 w-20 hover:text-slate-300 transition-colors" />
								<SiMicrosoft className="h-6 w-20 hover:text-slate-300 transition-colors" />
								<SiAdobe className="h-6 w-20 hover:text-slate-300 transition-colors" />
								<SiAirbnb className="h-6 w-20 hover:text-slate-300 transition-colors" />
								<SiStripe className="h-6 w-20 hover:text-slate-300 transition-colors" />
								<SiReddit className="h-6 w-20 hover:text-slate-300 transition-colors" />
							</div>

							{/* Final Assurance */}
							<div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm">
								<CheckCircle className="h-4 w-4 text-green-400" />
								<span className="text-slate-300">Free to start • Enterprise ready • 24/7 support available</span>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
