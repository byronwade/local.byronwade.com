import { Button } from "@components/ui/button";
import { ChevronRight, TrendingUp, Home as HomeIcon, Coffee, ShoppingBag, Heart, Truck } from "lucide-react";
import ScrollSection from "@components/site/home/scroll-section";
import HeroSection from "@components/site/home/hero-section";
import BusinessCard from "@components/site/home/business-card";

import Link from "next/link";
import { Separator } from "@components/ui/separator";
import { Suspense } from "react";

// Force dynamic rendering to prevent build hanging
export const dynamic = "force-dynamic";

// Loading component for sections
function SectionSkeleton() {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-2"></div>
						<div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-1"></div>
						<div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
					</div>
				))}
			</div>
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
	title: "Thorbis - Unified Local Discovery & Field Service Platform",
	description: "The complete platform for local service discovery and business management. Find trusted professionals, book services instantly, and manage your field service operations - all in one place.",
	keywords: ["local business", "field service management", "service booking", "professional services", "business operations", "scheduling", "invoicing", "reviews"],
	openGraph: {
		title: "Thorbis - Complete Local Service Platform",
		description: "Unified platform combining local business discovery with field service management tools. For customers: find and book trusted services. For businesses: complete operational suite.",
		url: "https://thorbis.com",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis.com/og-image.jpg",
				width: 800,
				height: 600,
				alt: "Thorbis Platform",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Thorbis - Complete Local Service Platform",
		description: "Unified platform combining local business discovery with field service management tools. For customers: find and book trusted services. For businesses: complete operational suite.",
		images: ["https://thorbis.com/twitter-image.jpg"],
		creator: "@thorbis",
	},
	alternates: {
		canonical: "https://thorbis.com",
		languages: {
			"en-US": "https://thorbis.com/en-US",
			"es-ES": "https://thorbis.com/es-ES",
		},
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
		// Get base URL with proper fallbacks for build time
		// In development, always use localhost regardless of NEXT_PUBLIC_APP_URL
		const isDevelopment = process.env.NODE_ENV === "development";
		const baseUrl = isDevelopment ? "http://localhost:3000" : process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
		const apiUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

		console.log(`[DEBUG] Fetching from: ${apiUrl}/api/business/featured`);
		const response = await fetch(`${apiUrl}/api/business/featured`, {
			cache: "no-store", // Disable cache during development/testing
			next: { revalidate: 60 }, // Revalidate every minute for testing
		});

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`);
		}

		const apiData = await response.json();
		const businesses = apiData.businesses || [];
		const categories = categorizeBusinesses(businesses);

		return {
			businesses,
			categories,
		};
	} catch (error) {
		console.error("Failed to fetch home page businesses:", error);
		return { businesses: [], categories: categorizeBusinesses([]) };
	}
}

// Home page sections with real data
async function BusinessSections({ categories }) {
	return (
		<>
			{/* FOOD & DINING SECTION */}
			{categories.restaurants.length > 0 && (
				<div className="space-y-12">
					<div className="flex justify-between items-center">
						<div>
							<h2 className="flex gap-2 items-center text-2xl font-semibold">
								<Coffee className="w-6 h-6 text-orange-600" />
								Food & Dining
							</h2>
							<p className="mt-1 text-muted-foreground">Restaurants, cafes, bars, and delivery</p>
						</div>
						<Button variant="ghost" asChild>
							<Link href="/categories/restaurants" className="flex gap-2 items-center">
								View all <ChevronRight className="w-4 h-4" />
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

			{/* HOME & SERVICES SECTION */}
			{categories.homeServices.length > 0 && (
				<div className="space-y-12">
					<div className="flex justify-between items-center">
						<div>
							<h2 className="flex gap-2 items-center text-2xl font-semibold">
								<HomeIcon className="w-6 h-6 text-blue-600" />
								Home & Professional Services
							</h2>
							<p className="mt-1 text-muted-foreground">Contractors, repairs, cleaning, and more</p>
						</div>
						<Button variant="ghost" asChild>
							<Link href="/categories/home-services" className="flex gap-2 items-center">
								View all <ChevronRight className="w-4 h-4" />
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

			{/* HEALTH & WELLNESS SECTION */}
			{(categories.health.length > 0 || categories.beauty.length > 0 || categories.fitness.length > 0) && (
				<div className="space-y-12">
					<div className="flex justify-between items-center">
						<div>
							<h2 className="flex gap-2 items-center text-2xl font-semibold">
								<Heart className="w-6 h-6 text-red-600" />
								Health & Wellness
							</h2>
							<p className="mt-1 text-muted-foreground">Doctors, dentists, fitness, and spa services</p>
						</div>
						<Button variant="ghost" asChild>
							<Link href="/categories/health-medical" className="flex gap-2 items-center">
								View all <ChevronRight className="w-4 h-4" />
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

			{/* SHOPPING & RETAIL SECTION */}
			{categories.shopping.length > 0 && (
				<div className="space-y-12">
					<div className="flex justify-between items-center">
						<div>
							<h2 className="flex gap-2 items-center text-2xl font-semibold">
								<ShoppingBag className="w-6 h-6 text-purple-600" />
								Shopping & Retail
							</h2>
							<p className="mt-1 text-muted-foreground">Stores, boutiques, and specialty shops</p>
						</div>
						<Button variant="ghost" asChild>
							<Link href="/categories/shopping" className="flex gap-2 items-center">
								View all <ChevronRight className="w-4 h-4" />
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

			{/* AUTOMOTIVE SECTION */}
			{categories.automotive.length > 0 && (
				<div className="space-y-12">
					<div className="flex justify-between items-center">
						<div>
							<h2 className="flex gap-2 items-center text-2xl font-semibold">
								<Truck className="w-6 h-6 text-green-600" />
								Automotive
							</h2>
							<p className="mt-1 text-muted-foreground">Auto repair, detailing, and services</p>
						</div>
						<Button variant="ghost" asChild>
							<Link href="/categories/automotive" className="flex gap-2 items-center">
								View all <ChevronRight className="w-4 h-4" />
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

export default async function Home() {
	// Fetch data on the server using Supabase SSR
	const { businesses, categories } = await getHomePageData();

	return (
		<main className="bg-white dark:bg-neutral-900">
			{/* Hero Section */}
			<HeroSection />

			{/* Main Content */}
			<div className="bg-white dark:bg-neutral-900">
				<div className="px-4 py-12 space-y-20 lg:px-24">
					{/* Dynamic Business Sections with SSR Data */}
					<Suspense fallback={<SectionSkeleton />}>
						<BusinessSections categories={categories} />
					</Suspense>

					<Separator />

					{/* TRENDING & NEW SECTION */}
					{businesses.length > 0 && (
						<div className="space-y-12">
							<div>
								<h2 className="flex gap-2 items-center text-2xl font-semibold">
									<TrendingUp className="w-6 h-6 text-indigo-600" />
									Trending & New
								</h2>
								<p className="mt-1 text-muted-foreground">What&apos;s popular and recently added</p>
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

					{/* Business Owner CTA */}
					<section className="p-8 rounded-2xl bg-muted/50 lg:p-12">
						<div className="mx-auto max-w-4xl text-center">
							<h2 className="mb-3 text-2xl font-semibold">Are You a Business Owner?</h2>
							<p className="mx-auto mb-6 max-w-2xl text-muted-foreground">Join thousands of businesses connecting with customers in your area. Free to claim, easy to manage.</p>
							<div className="flex gap-4 justify-center">
								<Button size="lg" asChild>
									<Link href="/claim-business">Claim Your Business</Link>
								</Button>
								<Button size="lg" variant="outline" asChild>
									<Link href="/business">Learn More</Link>
								</Button>
							</div>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
