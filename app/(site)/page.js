import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { ChevronRight, Search, MapPin, Star, Clock, Shield, TrendingUp, Award, DollarSign, Briefcase, Home as HomeIcon, Coffee, ShoppingBag, Heart, Truck, Scissors, Calendar, CheckCircle, Users, BookOpen, BarChart, Zap, Phone, MessageSquare, Globe, Navigation, Percent, Filter, AlertCircle, ArrowRight } from "react-feather";
import ScrollSection from "@components/site/home/ScrollSection";
import HeroSection from "@components/site/home/HeroSection";
import BusinessCard from "@components/site/home/BusinessCard";
import { generateBusinesses } from "@lib/businessDataGenerator";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@components/ui/separator";

// Generate businesses for the home page - much more data
const allBusinesses = generateBusinesses(200);

// Categorize businesses for different sections
const restaurantBusinesses = allBusinesses.slice(0, 20).map((business) => ({
	...business,
	image: business.photos?.[0] || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
	category: "Restaurant",
	price: business.priceLevel || "$$",
}));

const homeServiceBusinesses = allBusinesses.slice(20, 40).map((business) => ({
	...business,
	image: business.photos?.[0] || "https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
	category: "Home Services",
	price: business.priceLevel || "$$$",
}));

const healthBusinesses = allBusinesses.slice(40, 60).map((business) => ({
	...business,
	image: business.photos?.[0] || "https://images.pexels.com/photos/3992933/pexels-photo-3992933.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
	category: "Health & Medical",
	price: business.priceLevel || "$$",
}));

const shoppingBusinesses = allBusinesses.slice(60, 80).map((business) => ({
	...business,
	image: business.photos?.[0] || "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
	category: "Shopping",
	price: business.priceLevel || "$$",
}));

const beautyBusinesses = allBusinesses.slice(80, 100).map((business) => ({
	...business,
	image: business.photos?.[0] || "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
	category: "Beauty & Spa",
	price: business.priceLevel || "$$$",
}));

const automotiveBusinesses = allBusinesses.slice(100, 120).map((business) => ({
	...business,
	image: business.photos?.[0] || "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
	category: "Automotive",
	price: business.priceLevel || "$$",
}));

const entertainmentBusinesses = allBusinesses.slice(120, 140).map((business) => ({
	...business,
	image: business.photos?.[0] || "https://images.pexels.com/photos/274950/pexels-photo-274950.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
	category: "Entertainment",
	price: business.priceLevel || "$$",
}));

const fitnessBusinesses = allBusinesses.slice(140, 160).map((business) => ({
	...business,
	image: business.photos?.[0] || "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
	category: "Fitness & Sports",
	price: business.priceLevel || "$$",
}));

const petBusinesses = allBusinesses.slice(160, 180).map((business) => ({
	...business,
	image: business.photos?.[0] || "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
	category: "Pet Services",
	price: business.priceLevel || "$$",
}));

// Transform for general sections
const transformBusiness = (business) => ({
	...business,
	image: business.photos?.[0] || business.logo || "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
	category: business.categories?.[0] || business.type || "Business",
	location: business.address?.split(",").slice(-2).join(",").trim() || "Local Area",
	price: business.priceLevel || business.price || "$$",
});

// Popular searches by intent
const popularByIntent = {
	urgent: ["24/7 emergency plumber", "urgent care near me", "same day auto repair", "emergency dentist"],
	planning: ["wedding venues", "catering services", "event planners", "photography studios"],
	regular: ["hair salons", "grocery stores", "gyms near me", "dry cleaners"],
};

export const metadata = {
	title: "Thorbis - Find Local Businesses, Services & Reviews Near You",
	description: "Discover trusted local businesses with real reviews. Find restaurants, home services, doctors, shopping, and more in your neighborhood.",
	keywords: ["local business", "near me", "reviews", "restaurants", "services", "doctors", "shopping", "automotive"],
	openGraph: {
		title: "Thorbis - Discover and Review Local Services",
		description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
		url: "https://www.thorbis.com",
		siteName: "Thorbis",
		images: [
			{
				url: "https://www.thorbis.com/og-image.jpg",
				width: 800,
				height: 600,
				alt: "Thorbis Logo",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Thorbis - Discover and Review Local Services",
		description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
		images: ["https://www.thorbis.com/twitter-image.jpg"],
		creator: "@thorbis",
	},
	alternates: {
		canonical: "https://www.thorbis.com",
		languages: {
			"en-US": "https://www.thorbis.com/en-US",
			"es-ES": "https://www.thorbis.com/es-ES",
		},
	},
	robots: "index, follow",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "directory",
	bookmarks: ["https://www.thorbis.com/"],
	generator: "Next.js",
	applicationName: "Thorbis",
	authors: [{ name: "Byron Wade", url: "https://www.thorbis.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	ogLocale: "en_US",
};

export default function Home() {
	return (
		<main className="bg-white dark:bg-neutral-900">
			{/* Enhanced Hero Section */}
			<HeroSection />

			{/* Main Content */}
			<div className="bg-white dark:bg-neutral-900">
				<div className="px-4 py-12 space-y-20 lg:px-24">
					{/* What Do You Need? Section */}
					<section>
						<div className="mb-8 text-center">
							<h2 className="mb-3 text-3xl font-semibold">What do you need help with?</h2>
							<p className="text-muted-foreground">Find the right professional for any job</p>
						</div>

						<div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
							{/* Urgent Needs */}
							<Card className="bg-gradient-to-br to-transparent transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 from-red-50/50 dark:from-red-950/20 border-red-200/80 dark:border-red-900/60 hover:border-red-400 dark:hover:border-red-700">
								<CardHeader className="pb-3">
									<div className="flex gap-2 items-center">
										<AlertCircle className="w-5 h-5 text-red-600" />
										<CardTitle className="text-lg">Need it now?</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{popularByIntent.urgent.map((search, idx) => (
											<Link key={idx} href={`/search?q=${encodeURIComponent(search)}`}>
												<div className="text-sm transition-colors cursor-pointer hover:text-primary">{search}</div>
											</Link>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Planning Ahead */}
							<Card className="bg-gradient-to-br to-transparent transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 from-blue-50/50 dark:from-blue-950/20 border-blue-200/80 dark:border-blue-900/60 hover:border-blue-400 dark:hover:border-blue-700">
								<CardHeader className="pb-3">
									<div className="flex gap-2 items-center">
										<Calendar className="w-5 h-5 text-blue-600" />
										<CardTitle className="text-lg">Planning ahead?</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{popularByIntent.planning.map((search, idx) => (
											<Link key={idx} href={`/search?q=${encodeURIComponent(search)}`}>
												<div className="text-sm transition-colors cursor-pointer hover:text-primary">{search}</div>
											</Link>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Regular Services */}
							<Card className="bg-gradient-to-br to-transparent transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 from-green-50/50 dark:from-green-950/20 border-green-200/80 dark:border-green-900/60 hover:border-green-400 dark:hover:border-green-700">
								<CardHeader className="pb-3">
									<div className="flex gap-2 items-center">
										<CheckCircle className="w-5 h-5 text-green-600" />
										<CardTitle className="text-lg">Regular services?</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{popularByIntent.regular.map((search, idx) => (
											<Link key={idx} href={`/search?q=${encodeURIComponent(search)}`}>
												<div className="text-sm transition-colors cursor-pointer hover:text-primary">{search}</div>
											</Link>
										))}
									</div>
								</CardContent>
							</Card>
						</div>

						<div className="text-center">
							<Button variant="outline" asChild>
								<Link href="/search">
									Browse all categories <ArrowRight className="ml-2 w-4 h-4" />
								</Link>
							</Button>
						</div>
					</section>

					<Separator />

					{/* FOOD & DINING SECTION */}
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
							{restaurantBusinesses.slice(0, 10).map((business) => (
								<BusinessCard key={business.id} business={{ ...business, status: "Open" }} />
							))}
						</ScrollSection>

						{/* Top Rated Restaurants */}
						<ScrollSection title="Top Rated" subtitle="Highest rated dining experiences" link="/search?category=restaurants&rating=4.5">
							{restaurantBusinesses.slice(10, 20).map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>
					</div>

					<Separator />

					{/* HOME & SERVICES SECTION */}
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
							{homeServiceBusinesses.slice(0, 10).map((business) => (
								<BusinessCard key={business.id} business={{ ...business, badge: "24/7" }} />
							))}
						</ScrollSection>

						{/* Popular Home Services */}
						<ScrollSection title="Popular Services" subtitle="Most booked this month" link="/search?category=home-services&sort=popular">
							{homeServiceBusinesses.slice(10, 20).map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>
					</div>

					<Separator />

					{/* HEALTH & WELLNESS SECTION */}
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
						<ScrollSection title="Medical & Dental" subtitle="Healthcare providers near you" link="/search?category=health-medical">
							{healthBusinesses.map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>

						{/* Beauty & Spa */}
						<ScrollSection title="Beauty & Relaxation" subtitle="Salons, spas, and wellness centers" link="/search?category=beauty-spa">
							{beautyBusinesses.map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>

						{/* Fitness */}
						<ScrollSection title="Fitness & Sports" subtitle="Gyms, yoga, and training facilities" link="/search?category=fitness-sports">
							{fitnessBusinesses.map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>
					</div>

					<Separator />

					{/* SHOPPING & RETAIL SECTION */}
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
							{shoppingBusinesses.map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>
					</div>

					<Separator />

					{/* AUTOMOTIVE SECTION */}
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
							{automotiveBusinesses.map((business) => (
								<BusinessCard key={business.id} business={business} />
							))}
						</ScrollSection>
					</div>

					<Separator />

					{/* TRENDING & NEW SECTION */}
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
							{allBusinesses.slice(0, 20).map((business) => (
								<BusinessCard key={business.id} business={transformBusiness(business)} />
							))}
						</ScrollSection>

						{/* New on Thorbis */}
						<ScrollSection title="New Businesses" subtitle="Recently joined our platform" link="/search?sort=newest">
							{allBusinesses.slice(180, 200).map((business) => (
								<BusinessCard key={business.id} business={transformBusiness(business)} />
							))}
						</ScrollSection>
					</div>

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
