import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { generateBusinesses } from "@lib/businessDataGenerator";
import BusinessCard from "@components/site/home/BusinessCard";
import ScrollSection from "@components/site/home/ScrollSection";
import { Search, MapPin, Star, ChevronRight, Filter, TrendingUp, Users, Building, Grid3X3 } from "lucide-react";

// Generate sample businesses for the page
const allBusinesses = generateBusinesses(50);
const featuredBusinesses = allBusinesses.slice(0, 12).map((business) => ({
	...business,
	image: business.photos?.[0] || business.logo || `https://images.unsplash.com/photo-${1560472354 + business.id}?w=400&h=300&fit=crop`,
	category: business.categories?.[0] || business.type || "Business",
	location: business.address?.split(",").slice(-2).join(",").trim() || "Local Area",
	price: business.priceLevel || business.price || "$$",
}));

// Expanded categories with subcategories for scalability
const MAIN_CATEGORIES = [
	{
		slug: "restaurants",
		name: "Restaurants & Food",
		description: "Dining, takeout, and food delivery",
		emoji: "🍽️",
		count: "3,247",
		trending: true,
		subcategories: ["Fast Food", "Fine Dining", "Cafes", "Bars", "Pizza", "Asian", "Mexican", "Italian"],
	},
	{
		slug: "home-services",
		name: "Home Services",
		description: "Professional services for your home",
		emoji: "🏠",
		count: "2,156",
		trending: false,
		subcategories: ["Plumbing", "Electrical", "HVAC", "Cleaning", "Landscaping", "Handyman", "Roofing", "Painting"],
	},
	{
		slug: "health-medical",
		name: "Health & Medical",
		description: "Healthcare providers and services",
		emoji: "⚕️",
		count: "1,892",
		trending: false,
		subcategories: ["Dentist", "Doctor", "Pharmacy", "Urgent Care", "Veterinarian", "Physical Therapy", "Optometrist", "Chiropractor"],
	},
	{
		slug: "beauty-spas",
		name: "Beauty & Spas",
		description: "Personal care and wellness",
		emoji: "💅",
		count: "1,543",
		trending: true,
		subcategories: ["Hair Salon", "Nail Salon", "Spa", "Massage", "Barbershop", "Skincare", "Tattoo", "Beauty Supply"],
	},
	{
		slug: "automotive",
		name: "Automotive",
		description: "Car services and repairs",
		emoji: "🚗",
		count: "987",
		trending: false,
		subcategories: ["Auto Repair", "Oil Change", "Tire Shop", "Car Wash", "Body Shop", "Towing", "Car Rental", "Auto Parts"],
	},
	{
		slug: "shopping",
		name: "Shopping & Retail",
		description: "Stores and retail services",
		emoji: "🛍️",
		count: "2,834",
		trending: true,
		subcategories: ["Clothing", "Electronics", "Grocery", "Hardware", "Jewelry", "Books", "Furniture", "Sporting Goods"],
	},
	{
		slug: "professional-services",
		name: "Professional Services",
		description: "Business and legal services",
		emoji: "💼",
		count: "1,234",
		trending: false,
		subcategories: ["Lawyer", "Accountant", "Real Estate", "Insurance", "Marketing", "Consulting", "Photography", "Web Design"],
	},
	{
		slug: "entertainment",
		name: "Entertainment & Events",
		description: "Fun activities and venues",
		emoji: "🎭",
		count: "756",
		trending: false,
		subcategories: ["Movies", "Bowling", "Arcade", "Events", "Comedy", "Music", "Museums", "Recreation"],
	},
	{
		slug: "fitness-recreation",
		name: "Fitness & Recreation",
		description: "Health and fitness activities",
		emoji: "💪",
		count: "892",
		trending: true,
		subcategories: ["Gym", "Yoga", "Personal Training", "Swimming", "Tennis", "Golf", "Martial Arts", "Dance"],
	},
	{
		slug: "education",
		name: "Education & Learning",
		description: "Schools and educational services",
		emoji: "📚",
		count: "654",
		trending: false,
		subcategories: ["Tutoring", "Music Lessons", "Driving School", "Language School", "Art Classes", "Daycare", "Computer Training", "Test Prep"],
	},
];

// Popular locations with more data
const POPULAR_LOCATIONS = [
	{ slug: "san-francisco", name: "San Francisco", state: "CA", count: "2,847", growth: "+12%" },
	{ slug: "new-york", name: "New York", state: "NY", count: "5,231", growth: "+8%" },
	{ slug: "los-angeles", name: "Los Angeles", state: "CA", count: "4,156", growth: "+15%" },
	{ slug: "chicago", name: "Chicago", state: "IL", count: "3,247", growth: "+5%" },
	{ slug: "austin", name: "Austin", state: "TX", count: "1,832", growth: "+23%" },
	{ slug: "seattle", name: "Seattle", state: "WA", count: "2,194", growth: "+18%" },
	{ slug: "miami", name: "Miami", state: "FL", count: "1,567", growth: "+20%" },
	{ slug: "denver", name: "Denver", state: "CO", count: "1,234", growth: "+16%" },
];

export const metadata = {
	title: "Business Categories - Find Services Near You | Thorbis",
	description: "Browse local businesses by category. Find restaurants, home services, healthcare, automotive, shopping, and more with verified reviews.",
	keywords: ["business categories", "local services", "business directory", "find businesses", "service providers"],
	openGraph: {
		title: "Business Categories - Find Services Near You | Thorbis",
		description: "Browse local businesses by category. Find restaurants, home services, healthcare, automotive, shopping, and more with verified reviews.",
		url: "https://www.thorbis.com/categories",
		siteName: "Thorbis",
		images: [
			{
				url: "https://www.thorbis.com/og-categories.jpg",
				width: 800,
				height: 600,
				alt: "Thorbis Business Categories",
			},
		],
		locale: "en_US",
		type: "website",
	},
};

export default function Categories() {
	return (
		<main className="relative bg-background">
			{/* Hero Section - Matching website style */}
			<div className="relative">
				<div className="px-4 py-16 lg:px-24 bg-gradient-to-br from-primary/5 via-background to-background">
					<div className="max-w-6xl mx-auto">
						{/* Header */}
						<div className="mb-12 text-center">
							<h1 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">Browse All Categories</h1>
							<p className="max-w-3xl mx-auto mb-8 text-xl text-muted-foreground">Discover local businesses across every industry. From dining to home services, find trusted professionals in your area.</p>
						</div>

						{/* Search Bar */}
						<div className="max-w-2xl mx-auto mb-12">
							<div className="relative">
								<Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
								<Input placeholder="Search categories (e.g., restaurants, plumbers, dentists...)" className="pl-12 text-lg border-2 h-14 border-border/50 focus:border-primary bg-background/80 backdrop-blur-sm" />
								<Button className="absolute h-10 right-2 top-2">Search</Button>
							</div>
						</div>

						{/* Quick Stats */}
						<div className="flex flex-wrap justify-center gap-8 text-sm">
							<div className="flex items-center gap-2 px-4 py-2 border rounded-full bg-background/80 backdrop-blur-sm border-border/50">
								<Building className="w-4 h-4 text-primary" />
								<span className="font-medium">15,000+ Businesses</span>
							</div>
							<div className="flex items-center gap-2 px-4 py-2 border rounded-full bg-background/80 backdrop-blur-sm border-border/50">
								<Grid3X3 className="w-4 h-4 text-primary" />
								<span className="font-medium">50+ Categories</span>
							</div>
							<div className="flex items-center gap-2 px-4 py-2 border rounded-full bg-background/80 backdrop-blur-sm border-border/50">
								<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
								<span className="font-medium">Verified Reviews</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="px-4 py-16 lg:px-24">
				{/* Main Categories Grid */}
				<div className="mb-20">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="mb-2 text-3xl font-bold text-foreground">Popular Categories</h2>
							<p className="text-muted-foreground">Most searched business types</p>
						</div>
						<Button variant="outline" asChild className="hidden sm:flex">
							<Link href="/categories/all">
								<Filter className="w-4 h-4 mr-2" />
								All Categories
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
						{MAIN_CATEGORIES.map((category) => (
							<Link key={category.slug} href={`/categories/${category.slug}`}>
								<Card className="h-full transition-all duration-200 group hover:shadow-lg hover:border-primary/50 border-border/50">
									<CardContent className="p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="text-3xl">{category.emoji}</div>
											<div className="flex flex-col items-end gap-1">
												{category.trending && (
													<Badge variant="secondary" className="text-xs text-green-700 bg-green-100 border-green-200">
														<TrendingUp className="w-3 h-3 mr-1" />
														Trending
													</Badge>
												)}
												<span className="text-sm font-medium text-primary">{category.count}</span>
											</div>
										</div>

										<h3 className="mb-2 font-semibold transition-colors text-foreground group-hover:text-primary">{category.name}</h3>
										<p className="mb-4 text-sm text-muted-foreground">{category.description}</p>

										{/* Subcategories preview */}
										<div className="flex flex-wrap gap-1 mb-3">
											{category.subcategories.slice(0, 3).map((sub) => (
												<Badge key={sub} variant="outline" className="text-xs">
													{sub}
												</Badge>
											))}
											{category.subcategories.length > 3 && (
												<Badge variant="outline" className="text-xs">
													+{category.subcategories.length - 3} more
												</Badge>
											)}
										</div>

										<div className="flex items-center text-sm font-medium text-primary">
											Explore
											<ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</div>

				{/* Popular Locations */}
				<div className="mb-20">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="mb-2 text-3xl font-bold text-foreground">Popular Locations</h2>
							<p className="text-muted-foreground">Find businesses in trending cities</p>
						</div>
						<Button variant="outline" asChild className="hidden sm:flex">
							<Link href="/locations">
								<MapPin className="w-4 h-4 mr-2" />
								All Locations
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{POPULAR_LOCATIONS.map((location) => (
							<Link key={location.slug} href={`/categories/${location.slug}`}>
								<Card className="transition-all duration-200 group hover:shadow-lg border-border/50 hover:border-primary/50">
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<h3 className="font-semibold transition-colors text-foreground group-hover:text-primary">{location.name}</h3>
												<p className="text-sm text-muted-foreground">{location.state}</p>
											</div>
											<div className="text-right">
												<div className="flex items-center gap-1 text-sm font-medium text-primary">
													<Users className="w-3 h-3" />
													{location.count}
												</div>
												<div className="text-xs font-medium text-green-600">{location.growth}</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</div>

				{/* Featured Businesses */}
				<div className="space-y-16">
					<ScrollSection category="Featured" title="Top Rated This Month" subtitle="Businesses with the highest customer satisfaction" link="/search?sort=rating">
						{featuredBusinesses.slice(0, 6).map((business) => (
							<BusinessCard key={business.id} business={business} />
						))}
					</ScrollSection>

					<ScrollSection category="Trending" title="Most Popular Right Now" subtitle="Businesses getting the most attention from customers" link="/search?sort=popular">
						{featuredBusinesses.slice(6, 12).map((business) => (
							<BusinessCard key={business.id} business={business} />
						))}
					</ScrollSection>
				</div>
			</div>

			{/* CTA Section - Matching website style */}
			<div className="relative py-20">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
				<div className="relative px-4 lg:px-24">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">Looking for something specific?</h2>
						<p className="max-w-2xl mx-auto mb-8 text-lg text-muted-foreground">Can&apos;t find the category you need? Use our advanced search or browse businesses on our interactive map.</p>
						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<Button size="lg" asChild className="h-12 px-8">
								<Link href="/search">
									Advanced Search
									<ChevronRight className="w-4 h-4 ml-2" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild className="h-12 px-8">
								<Link href="/search">
									<MapPin className="w-4 h-4 mr-2" />
									Map View
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
