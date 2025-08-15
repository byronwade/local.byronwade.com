import { Button } from "@components/ui/button";
import { ChevronRight, TrendingUp, Home as HomeIcon, Coffee, ShoppingBag, Heart, Truck } from "lucide-react";
import ScrollSection from "@components/site/home/scroll-section";
import HeroSection from "@components/site/home/hero-section";
import BusinessCard from "@components/site/home/business-card";

import Link from "next/link";
import { Separator } from "@components/ui/separator";
import ModernUseSection from "@components/site/home/modern-use-section";
import { Suspense } from "react";

// Force dynamic rendering to prevent build hanging
export const dynamic = "force-dynamic";

// Loading component for sections - Enhanced Netflix-style
function SectionSkeleton() {
	return (
		<div className="space-y-16">
			{/* Section headers skeleton */}
			{Array.from({ length: 3 }).map((_, sectionIndex) => (
				<div key={sectionIndex} className="space-y-8">
					{/* Header skeleton */}
					<div className="flex justify-between items-start">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
								<div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-64 animate-pulse"></div>
							</div>
							<div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-96 animate-pulse"></div>
						</div>
						<div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-xl w-28 animate-pulse"></div>
					</div>

					{/* Subsection header skeleton */}
					<div className="space-y-4">
						<div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-48 animate-pulse"></div>
						<div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-72 animate-pulse"></div>
					</div>

					{/* Cards grid skeleton */}
					<div className="flex gap-6 overflow-hidden">
						{Array.from({ length: 6 }).map((_, cardIndex) => (
							<div key={cardIndex} className="flex-none w-[250px] animate-pulse">
								{/* Image skeleton */}
								<div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-700 rounded-2xl mb-4 relative overflow-hidden">
									{/* Shimmer effect */}
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-neutral-600/20 -translate-x-full animate-[shimmer_2s_infinite]"></div>
								</div>

								{/* Content skeleton */}
								<div className="space-y-3">
									{/* Title */}
									<div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>

									{/* Category */}
									<div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>

									{/* Location */}
									<div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>

									{/* Rating & Price */}
									<div className="flex justify-between">
										<div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
										<div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

// Transform business data to match existing component interface
function transformBusinessForCard(business) {
	return {
		id: business.id,
		name: business.name,
		description: business.description,
		image: business.photos?.[0] || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
		rating: business.rating || 0,
		reviewCount: business.review_count || 0,
		price: business.price_range || "$$",
		location: `${business.city}, ${business.state}`,
		category: business.business_categories?.[0]?.category?.name || "Business",
		slug: business.slug,
	};
}

// Categorize businesses by type for different sections
function categorizeBusinesses(businesses) {
	const categories = {
		restaurants: [],
		homeServices: [],
		health: [],
		shopping: [],
		beauty: [],
		automotive: [],
		entertainment: [],
		fitness: [],
		pet: [],
	};

	businesses.forEach((business) => {
		const categoryName = business.business_categories?.[0]?.category?.name?.toLowerCase() || "";
		const categorySlug = business.business_categories?.[0]?.category?.slug?.toLowerCase() || "";

		if (categoryName.includes("restaurant") || categoryName.includes("food") || categorySlug.includes("restaurant")) {
			categories.restaurants.push(business);
		} else if (categoryName.includes("home") || categoryName.includes("service") || categorySlug.includes("home")) {
			categories.homeServices.push(business);
		} else if (categoryName.includes("health") || categoryName.includes("medical") || categorySlug.includes("health")) {
			categories.health.push(business);
		} else if (categoryName.includes("shop") || categoryName.includes("retail") || categorySlug.includes("shopping")) {
			categories.shopping.push(business);
		} else if (categoryName.includes("beauty") || categoryName.includes("spa") || categorySlug.includes("beauty")) {
			categories.beauty.push(business);
		} else if (categoryName.includes("auto") || categoryName.includes("car") || categorySlug.includes("automotive")) {
			categories.automotive.push(business);
		} else if (categoryName.includes("entertainment") || categorySlug.includes("entertainment")) {
			categories.entertainment.push(business);
		} else if (categoryName.includes("fitness") || categoryName.includes("gym") || categorySlug.includes("fitness")) {
			categories.fitness.push(business);
		} else if (categoryName.includes("pet") || categorySlug.includes("pet")) {
			categories.pet.push(business);
		} else {
			// Distribute remaining businesses across categories
			const keys = Object.keys(categories);
			const randomKey = keys[Math.floor(Math.random() * keys.length)];
			categories[randomKey].push(business);
		}
	});

	return categories;
}

export const metadata = {
	title: "Thorbis Business Directory - Find Local Businesses • Field Services • Community Hub",
	description: "The premier business directory for local discovery. Find trusted businesses, read verified reviews, compare services, plus field service management and community building tools.",
	keywords: ["business directory", "local businesses", "find businesses", "business listings", "local directory", "field service management", "service booking", "professional services", "business reviews", "community hub"],
	openGraph: {
		title: "Thorbis Business Directory - Find Local Businesses Near You",
		description: "Premier business directory platform. Discover local businesses, read reviews, compare services. Plus field service management tools and community building features.",
		url: "https://thorbis.com",
		siteName: "Thorbis",
		images: [
			{
				url: `https://thorbis.com/opengraph-image?title=${encodeURIComponent("Thorbis Business Directory")}&description=${encodeURIComponent("Find Local Businesses • Field Services • Community Hub")}`,
				width: 1200,
				height: 630,
				alt: "Thorbis Business Directory Platform",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Thorbis Business Directory - Find Local Businesses Near You",
		description: "Premier business directory platform. Discover local businesses, read reviews, compare services. Plus field service management tools and community building features.",
		images: [`https://thorbis.com/twitter-image?title=${encodeURIComponent("Thorbis Business Directory – Find Local Businesses")}`],
		creator: "@thorbis",
	},
	alternates: {
		canonical: "https://thorbis.com",
	},
	robots: "index, follow",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "directory",
	bookmarks: ["https://thorbis.com/"],
	generator: "Next.js",
	applicationName: "Thorbis",
	authors: [{ name: "Byron Wade", url: "https://thorbis.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	ogLocale: "en_US",
};

// Server-side data fetching using API routes
async function getHomePageData() {
    try {
        // In development, try relative path first, then absolute URL as fallback
        let response;
        let apiUrl;
        
        if (process.env.NODE_ENV === 'development') {
            // For development, try relative path first (works for client-side)
            apiUrl = '/api/business/featured';
            console.log(`[DEBUG] Development mode - trying relative path: ${apiUrl}`);
            
            try {
                response = await fetch(apiUrl, {
                    next: { revalidate: 60 },
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
            } catch (relativeError) {
                // If relative fails (SSR), try absolute URL
                console.log(`[DEBUG] Relative fetch failed, trying absolute URL`);
                
                const baseUrl = 'http://localhost:3000';
                apiUrl = `${baseUrl}/api/business/featured`;
                
                response = await fetch(apiUrl, {
                    next: { revalidate: 60 },
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
            }
        } else {
            // For production, construct the full URL
            let baseUrl;
            
            if (process.env.NEXT_PUBLIC_APP_URL) {
                baseUrl = process.env.NEXT_PUBLIC_APP_URL;
            } else if (process.env.VERCEL_URL) {
                baseUrl = `https://${process.env.VERCEL_URL}`;
            } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
                baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
            } else {
                baseUrl = 'http://localhost:3000';
            }
            
            apiUrl = `${baseUrl}/api/business/featured`;
            console.log(`[DEBUG] Production mode - fetching from: ${apiUrl}`);
            
            response = await fetch(apiUrl, {
                next: { revalidate: 60 },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
        }

		if (!response.ok) {
			console.warn(`API request failed with status ${response.status}, using fallback data`);
			// Return empty data instead of throwing to prevent page from breaking
			return { 
				businesses: [], 
				categories: categorizeBusinesses([]),
				error: `API request failed: ${response.status}`
			};
		}

		const apiData = await response.json();
		const businesses = apiData.businesses || [];
		const categories = categorizeBusinesses(businesses);

		console.log(`[DEBUG] Successfully fetched ${businesses.length} businesses`);

		return {
			businesses,
			categories,
		};
	} catch (error) {
		console.error("Failed to fetch home page businesses:", error);
		// Gracefully handle errors by returning empty state
		return { 
			businesses: [], 
			categories: categorizeBusinesses([]),
			error: error.message 
		};
	}
}

// Home page sections with real data
async function BusinessSections({ categories }) {
	return (
		<>
			{/* FOOD & DINING SECTION - Enhanced Netflix-style */}
			{categories.restaurants.length > 0 && (
				<div className="space-y-8">
					<div className="flex justify-between items-start">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
									<Coffee className="w-6 h-6 text-orange-600 dark:text-orange-400" />
								</div>
								<h2 className="text-3xl font-bold text-foreground tracking-tight">Food & Dining</h2>
							</div>
							<p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">Discover exceptional restaurants, cozy cafes, vibrant bars, and convenient delivery options in your area</p>
						</div>
						<Button variant="outline" size="lg" className="border-2 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-300 group" asChild>
							<Link href="/categories/restaurants" className="flex gap-2 items-center text-base font-medium">
								Explore All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
						</Button>
					</div>

					{/* Open Now - Restaurants */}
					<ScrollSection title="Open Now" subtitle="Currently serving" link="/search?category=restaurants&open=true">
						{categories.restaurants.slice(0, 10).map((business) => (
							<BusinessCard
								key={business.id}
								business={{
									...transformBusinessForCard(business),
									status: "Open",
								}}
							/>
						))}
					</ScrollSection>

					{/* Top Rated Restaurants */}
					{categories.restaurants.length > 10 && (
						<ScrollSection title="Top Rated" subtitle="Highest rated dining experiences" link="/search?category=restaurants&rating=4.5">
							{categories.restaurants.slice(10, 20).map((business) => (
								<BusinessCard key={business.id} business={transformBusinessForCard(business)} />
							))}
						</ScrollSection>
					)}
				</div>
			)}

			<Separator />

			{/* HOME & SERVICES SECTION - Enhanced Netflix-style */}
			{categories.homeServices.length > 0 && (
				<div className="space-y-8">
					<div className="flex justify-between items-start">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
									<HomeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
								</div>
								<h2 className="text-3xl font-bold text-foreground tracking-tight">Home & Professional Services</h2>
							</div>
							<p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">Connect with trusted contractors, repair specialists, cleaning services, and professional experts for all your home needs</p>
						</div>
						<Button variant="outline" size="lg" className="border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300 group" asChild>
							<Link href="/categories/home-services" className="flex gap-2 items-center text-base font-medium">
								Explore All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
						</Button>
					</div>

					{/* Emergency Services */}
					<ScrollSection title="24/7 Emergency Services" subtitle="Available anytime you need them" link="/search?category=home-services&emergency=true">
						{categories.homeServices.slice(0, 10).map((business) => (
							<BusinessCard
								key={business.id}
								business={{
									...transformBusinessForCard(business),
									badge: "24/7",
								}}
							/>
						))}
					</ScrollSection>

					{/* Popular Home Services */}
					{categories.homeServices.length > 10 && (
						<ScrollSection title="Popular Services" subtitle="Most booked this month" link="/search?category=home-services&sort=popular">
							{categories.homeServices.slice(10, 20).map((business) => (
								<BusinessCard key={business.id} business={transformBusinessForCard(business)} />
							))}
						</ScrollSection>
					)}
				</div>
			)}

			<Separator />

			{/* HEALTH & WELLNESS SECTION - Enhanced Netflix-style */}
			{(categories.health.length > 0 || categories.beauty.length > 0 || categories.fitness.length > 0) && (
				<div className="space-y-8">
					<div className="flex justify-between items-start">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
									<Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
								</div>
								<h2 className="text-3xl font-bold text-foreground tracking-tight">Health & Wellness</h2>
							</div>
							<p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">Find quality healthcare providers, wellness centers, fitness facilities, and beauty services to support your well-being</p>
						</div>
						<Button variant="outline" size="lg" className="border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 group" asChild>
							<Link href="/categories/health-medical" className="flex gap-2 items-center text-base font-medium">
								Explore All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
						</Button>
					</div>

					{/* Medical Services */}
					{categories.health.length > 0 && (
						<ScrollSection title="Medical & Dental" subtitle="Healthcare providers near you" link="/search?category=health-medical">
							{categories.health.map((business) => (
								<BusinessCard key={business.id} business={transformBusinessForCard(business)} />
							))}
						</ScrollSection>
					)}

					{/* Beauty & Spa */}
					{categories.beauty.length > 0 && (
						<ScrollSection title="Beauty & Relaxation" subtitle="Salons, spas, and wellness centers" link="/search?category=beauty-spa">
							{categories.beauty.map((business) => (
								<BusinessCard key={business.id} business={transformBusinessForCard(business)} />
							))}
						</ScrollSection>
					)}

					{/* Fitness */}
					{categories.fitness.length > 0 && (
						<ScrollSection title="Fitness & Sports" subtitle="Gyms, yoga, and training facilities" link="/search?category=fitness-sports">
							{categories.fitness.map((business) => (
								<BusinessCard key={business.id} business={transformBusinessForCard(business)} />
							))}
						</ScrollSection>
					)}
				</div>
			)}

			<Separator />

			{/* SHOPPING & RETAIL SECTION - Enhanced Netflix-style */}
			{categories.shopping.length > 0 && (
				<div className="space-y-8">
					<div className="flex justify-between items-start">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
									<ShoppingBag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
								</div>
								<h2 className="text-3xl font-bold text-foreground tracking-tight">Shopping & Retail</h2>
							</div>
							<p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">Explore unique boutiques, specialty stores, local markets, and retail destinations for all your shopping needs</p>
						</div>
						<Button variant="outline" size="lg" className="border-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-300 group" asChild>
							<Link href="/categories/shopping" className="flex gap-2 items-center text-base font-medium">
								Explore All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
						</Button>
					</div>

					<ScrollSection title="Local Shops & Boutiques" subtitle="Unique finds in your neighborhood" link="/search?category=shopping">
						{categories.shopping.map((business) => (
							<BusinessCard key={business.id} business={transformBusinessForCard(business)} />
						))}
					</ScrollSection>
				</div>
			)}

			<Separator />

			{/* AUTOMOTIVE SECTION - Enhanced Netflix-style */}
			{categories.automotive.length > 0 && (
				<div className="space-y-8">
					<div className="flex justify-between items-start">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
									<Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
								</div>
								<h2 className="text-3xl font-bold text-foreground tracking-tight">Automotive Services</h2>
							</div>
							<p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">Professional auto repair, detailing, maintenance services, and automotive specialists for all your vehicle needs</p>
						</div>
						<Button variant="outline" size="lg" className="border-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-300 group" asChild>
							<Link href="/categories/automotive" className="flex gap-2 items-center text-base font-medium">
								Explore All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
						</Button>
					</div>

					<ScrollSection title="Auto Services" subtitle="Repair shops, oil changes, and detailing" link="/search?category=automotive">
						{categories.automotive.map((business) => (
							<BusinessCard key={business.id} business={transformBusinessForCard(business)} />
						))}
					</ScrollSection>
				</div>
			)}
		</>
	);
}

// Empty state component for when no businesses are loaded
function EmptyBusinessState({ error }) {
	return (
		<div className="space-y-8 py-16">
			<div className="text-center space-y-6">
				<div className="mx-auto w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
					<Coffee className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
				</div>
				
				<div className="space-y-3">
					<h3 className="text-2xl font-bold text-foreground">
						{error ? "Unable to Load Businesses" : "No Businesses Found"}
					</h3>
					<p className="text-lg text-muted-foreground max-w-md mx-auto">
						{error 
							? "We're having trouble loading businesses right now. Please try again later."
							: "We're working on adding businesses to your area. Check back soon!"
						}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
					<Button size="lg" variant="outline" className="border-2" asChild>
						<Link href="/search">
							Browse All Categories
						</Link>
					</Button>
					
					<Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
						<Link href="/business-submission">
							Add Your Business
						</Link>
					</Button>
				</div>

				{error && (
					<div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
						<p className="text-sm text-yellow-800 dark:text-yellow-200">
							<strong>Technical Details:</strong> {error}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default async function Home() {
	// Fetch data on the server using Supabase SSR
	const { businesses, categories, error } = await getHomePageData();

	// Check if we have any businesses to display
	const hasBusinesses = businesses && businesses.length > 0;
	const hasAnyCategories = Object.values(categories).some(category => category.length > 0);

	return (
		<main className="bg-white dark:bg-neutral-900">
			{/* Hero Section */}
			<HeroSection />

			{/* Modern Use Section */}
			<ModernUseSection />

			{/* Main Content - Enhanced Layout */}
			<div className="bg-white dark:bg-neutral-900">
				<div className="px-6 py-16 space-y-24 lg:px-24 xl:px-32 max-w-8xl mx-auto">
					{/* Show business sections if we have data, otherwise show empty state */}
					{hasAnyCategories ? (
						<>
							{/* Dynamic Business Sections with SSR Data */}
							<Suspense fallback={<SectionSkeleton />}>
								<BusinessSections categories={categories} />
							</Suspense>

							<Separator />

							{/* TRENDING & NEW SECTION - Enhanced Netflix-style */}
							{hasBusinesses && (
								<div className="space-y-8">
									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
												<TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
											</div>
											<h2 className="text-3xl font-bold text-foreground tracking-tight">Trending & New</h2>
										</div>
										<p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">Discover what&apos;s popular in your community and explore recently added businesses gaining attention</p>
									</div>

									{/* Trending This Week */}
									<ScrollSection title="Trending This Week" subtitle="Most visited businesses" link="/trending">
										{businesses.slice(0, 20).map((business) => (
											<BusinessCard key={business.id} business={transformBusinessForCard(business)} />
										))}
									</ScrollSection>

									{/* Recently Added */}
									{businesses.length > 20 && (
										<ScrollSection title="New Businesses" subtitle="Recently joined our platform" link="/search?sort=newest">
											{businesses.slice(-20).map((business) => (
												<BusinessCard key={business.id} business={transformBusinessForCard(business)} />
											))}
										</ScrollSection>
									)}
								</div>
							)}
						</>
					) : (
						<EmptyBusinessState error={error} />
					)}

					<Separator />

					{/* Business Owner CTA - Enhanced Netflix-style */}
					<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-blue-50/80 to-purple-50/80 dark:from-primary/5 dark:via-blue-950/50 dark:to-purple-950/50 border border-primary/20 dark:border-primary/10 p-12 lg:p-16">
						{/* Background decoration */}
						<div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
						<div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
						<div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

						<div className="relative mx-auto max-w-4xl text-center">
							<div className="mb-6 flex justify-center">
								<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 dark:bg-primary/10 border border-primary/30 dark:border-primary/20">
									<span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
									<span className="text-sm font-medium text-primary">Business Owners</span>
								</div>
							</div>

							<h2 className="mb-6 text-4xl font-bold text-foreground tracking-tight lg:text-5xl">
								Grow Your Business with <span className="text-primary">Thorbis</span>
							</h2>

							<p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground leading-relaxed">Join thousands of successful businesses connecting with customers in your area. Free to claim, easy to manage, and built to help you grow.</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
								<Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" asChild>
									<Link href="/claim-business" className="flex items-center gap-2">
										Claim Your Business
										<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
									</Link>
								</Button>

								<Button size="lg" variant="outline" className="border-2 border-primary/20 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300" asChild>
									<Link href="/business">Learn More</Link>
								</Button>
							</div>

							{/* Trust indicators */}
							<div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
										<div className="w-2 h-2 rounded-full bg-green-500"></div>
									</div>
									<span>Free Business Listing</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
										<div className="w-2 h-2 rounded-full bg-blue-500"></div>
									</div>
									<span>Customer Reviews</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
										<div className="w-2 h-2 rounded-full bg-purple-500"></div>
									</div>
									<span>Analytics Dashboard</span>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
