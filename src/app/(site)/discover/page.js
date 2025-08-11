import { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Star, Award, Building2, Utensils, ShoppingBag, Wrench, Heart, Users, TrendingUp, Clock, Filter, Grid, List, ArrowRight, CheckCircle, Crown } from "lucide-react";

export const metadata = {
	title: "Discover Local Businesses - Explore Categories, Industries & Neighborhoods | Local Directory",
	description: "Discover amazing local businesses by category, industry, and neighborhood. Find certified businesses, trending spots, and hidden gems in your area.",
	keywords: "discover local businesses, business categories, industries, neighborhoods, certified businesses, local directory, business exploration",
	openGraph: {
		title: "Discover Local Businesses - Explore Categories, Industries & Neighborhoods",
		description: "Discover amazing local businesses by category, industry, and neighborhood. Find certified businesses and trending spots.",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Discover Local Businesses - Explore Categories & Neighborhoods",
		description: "Discover amazing local businesses by category, industry, and neighborhood.",
	},
	robots: {
		index: true,
		follow: true,
	},
	alternates: {
		canonical: "/discover",
	},
};

const featuredBusinesses = [
	{
		name: "Tony's Authentic Pizza",
		category: "Restaurant",
		rating: 4.9,
		reviews: 324,
		distance: "0.3 miles",
		certified: true,
		featured: true,
		description: "Family-owned pizzeria serving authentic Italian cuisine for over 30 years.",
		image: "/api/placeholder/300/200",
		tags: ["Pizza", "Italian", "Family-Friendly"],
	},
	{
		name: "Green Thumb Landscaping",
		category: "Home Services",
		rating: 4.8,
		reviews: 156,
		distance: "1.2 miles",
		certified: true,
		featured: false,
		description: "Professional landscaping and garden design services.",
		image: "/api/placeholder/300/200",
		tags: ["Landscaping", "Garden Design", "Eco-Friendly"],
	},
	{
		name: "Bella's Boutique",
		category: "Retail",
		rating: 4.7,
		reviews: 89,
		distance: "0.8 miles",
		certified: true,
		featured: false,
		description: "Curated fashion and accessories from local and sustainable brands.",
		image: "/api/placeholder/300/200",
		tags: ["Fashion", "Sustainable", "Local Brands"],
	},
];

const topCategories = [
	{
		icon: Utensils,
		name: "Restaurants",
		count: "12,000+",
		description: "From fine dining to casual eats",
		color: "bg-orange-100 text-orange-700",
		subcategories: ["Pizza", "Mexican", "Asian", "American", "Italian", "Fast Food"],
	},
	{
		icon: ShoppingBag,
		name: "Retail & Shopping",
		count: "8,500+",
		description: "Shops, boutiques, and stores",
		color: "bg-blue-100 text-blue-700",
		subcategories: ["Clothing", "Electronics", "Home & Garden", "Books", "Gifts", "Groceries"],
	},
	{
		icon: Wrench,
		name: "Home Services",
		count: "6,200+",
		description: "Professional services for your home",
		color: "bg-green-100 text-green-700",
		subcategories: ["Plumbing", "Electrical", "Cleaning", "Landscaping", "HVAC", "Repairs"],
	},
	{
		icon: Building2,
		name: "Professional Services",
		count: "4,800+",
		description: "Business and personal services",
		color: "bg-purple-100 text-purple-700",
		subcategories: ["Legal", "Accounting", "Real Estate", "Insurance", "Consulting", "Marketing"],
	},
	{
		icon: Heart,
		name: "Health & Wellness",
		count: "3,900+",
		description: "Healthcare and wellness services",
		color: "bg-red-100 text-red-700",
		subcategories: ["Medical", "Dental", "Fitness", "Spa", "Mental Health", "Nutrition"],
	},
	{
		icon: Users,
		name: "Entertainment",
		count: "2,700+",
		description: "Fun activities and entertainment",
		color: "bg-yellow-100 text-yellow-700",
		subcategories: ["Bars", "Music", "Events", "Recreation", "Arts", "Sports"],
	},
];

const trendingNeighborhoods = [
	{
		name: "Downtown Arts District",
		city: "Austin, TX",
		businesses: 234,
		highlights: ["Art Galleries", "Craft Breweries", "Live Music"],
		description: "Vibrant cultural hub with emerging artists and creative businesses",
		growth: "+23%",
	},
	{
		name: "Pearl District",
		city: "Portland, OR",
		businesses: 189,
		highlights: ["Boutique Shops", "Farm-to-Table", "Artisan Crafts"],
		description: "Historic neighborhood known for unique local businesses",
		growth: "+18%",
	},
	{
		name: "Wynwood",
		city: "Miami, FL",
		businesses: 156,
		highlights: ["Street Art", "Trendy Restaurants", "Nightlife"],
		description: "Hip area with cutting-edge dining and entertainment",
		growth: "+31%",
	},
	{
		name: "The Mission",
		city: "San Francisco, CA",
		businesses: 298,
		highlights: ["Tech Startups", "Coffee Culture", "Diverse Dining"],
		description: "Innovation meets tradition in this diverse neighborhood",
		growth: "+15%",
	},
];

const industries = [
	{
		name: "Food & Beverage",
		businesses: 15000,
		growth: "+12%",
		icon: Utensils,
		description: "Restaurants, cafes, bars, and food services",
		trending: ["Ghost Kitchens", "Plant-Based Options", "Craft Beverages"],
	},
	{
		name: "Retail Trade",
		businesses: 12000,
		growth: "+8%",
		icon: ShoppingBag,
		description: "Physical and online retail businesses",
		trending: ["E-commerce Integration", "Sustainable Products", "Local Artisans"],
	},
	{
		name: "Health & Wellness",
		businesses: 8500,
		growth: "+22%",
		icon: Heart,
		description: "Healthcare, fitness, and wellness services",
		trending: ["Telehealth", "Mental Wellness", "Preventive Care"],
	},
	{
		name: "Technology Services",
		businesses: 5200,
		growth: "+35%",
		icon: Building2,
		description: "IT, software, and digital services",
		trending: ["AI Solutions", "Cybersecurity", "App Development"],
	},
];

const certificationBadges = [
	{
		name: "Verified Business",
		icon: CheckCircle,
		description: "Identity and location verified",
		count: "45,000+",
		color: "text-green-600",
	},
	{
		name: "Customer Favorite",
		icon: Heart,
		description: "Consistently high ratings",
		count: "12,000+",
		color: "text-red-600",
	},
	{
		name: "Local Champion",
		icon: Award,
		description: "Strong community involvement",
		count: "8,500+",
		color: "text-blue-600",
	},
	{
		name: "Excellence Award",
		icon: Crown,
		description: "Outstanding service quality",
		count: "3,200+",
		color: "text-purple-600",
	},
];

function DiscoverHero() {
	return (
		<div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Local Businesses</h1>
					<p className="text-xl mb-8 max-w-3xl mx-auto">Explore businesses by category, discover trending neighborhoods, and find certified local gems in your area.</p>

					{/* Search Bar */}
					<div className="max-w-2xl mx-auto">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
								<Input placeholder="What are you looking for?" className="pl-10 py-3 text-gray-900" />
							</div>
							<div className="flex-1 relative">
								<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
								<Input placeholder="Where?" className="pl-10 py-3 text-gray-900" />
							</div>
							<Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
								Search
							</Button>
						</div>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
					<div>
						<div className="text-2xl md:text-3xl font-bold">50,000+</div>
						<div className="text-sm opacity-80">Verified Businesses</div>
					</div>
					<div>
						<div className="text-2xl md:text-3xl font-bold">500+</div>
						<div className="text-sm opacity-80">Cities Covered</div>
					</div>
					<div>
						<div className="text-2xl md:text-3xl font-bold">15,000+</div>
						<div className="text-sm opacity-80">Certified Businesses</div>
					</div>
					<div>
						<div className="text-2xl md:text-3xl font-bold">2.5M+</div>
						<div className="text-sm opacity-80">Monthly Searches</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function FeaturedBusinesses() {
	return (
		<section className="py-16">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between mb-12">
					<div>
						<h2 className="text-3xl font-bold mb-2">Featured Businesses</h2>
						<p className="text-gray-600">Handpicked local favorites and trending spots</p>
					</div>
					<Button variant="outline">
						View All <ArrowRight className="h-4 w-4 ml-2" />
					</Button>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{featuredBusinesses.map((business, index) => (
						<Card key={index} className={`hover:shadow-lg transition-shadow ${business.featured ? "ring-2 ring-blue-500" : ""}`}>
							<div className="aspect-[3/2] bg-gray-200 rounded-t-lg relative">
								{business.featured && <Badge className="absolute top-3 left-3 bg-blue-500">Featured</Badge>}
								{business.certified && (
									<Badge className="absolute top-3 right-3 bg-green-500">
										<CheckCircle className="h-3 w-3 mr-1" />
										Certified
									</Badge>
								)}
							</div>
							<CardHeader>
								<div className="flex items-center justify-between mb-2">
									<CardTitle className="text-lg">{business.name}</CardTitle>
									<Badge variant="secondary">{business.category}</Badge>
								</div>
								<div className="flex items-center space-x-4 mb-2">
									<div className="flex items-center space-x-1">
										<Star className="h-4 w-4 text-yellow-500 fill-current" />
										<span className="font-medium">{business.rating}</span>
										<span className="text-gray-500">({business.reviews})</span>
									</div>
									<div className="flex items-center space-x-1 text-gray-500">
										<MapPin className="h-4 w-4" />
										<span>{business.distance}</span>
									</div>
								</div>
								<CardDescription>{business.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2 mb-4">
									{business.tags.map((tag, tagIndex) => (
										<Badge key={tagIndex} variant="outline" className="text-xs">
											{tag}
										</Badge>
									))}
								</div>
								<Button className="w-full">
									View Details <ArrowRight className="h-4 w-4 ml-2" />
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

function DiscoverContent() {
	return (
		<section className="py-16 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="max-w-6xl mx-auto">
					<Tabs defaultValue="categories" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="categories">Categories</TabsTrigger>
							<TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
							<TabsTrigger value="industries">Industries</TabsTrigger>
							<TabsTrigger value="certified">Certified</TabsTrigger>
						</TabsList>

						<TabsContent value="categories" className="mt-8">
							<div className="space-y-8">
								<div className="text-center">
									<h3 className="text-2xl font-bold mb-4">Browse by Category</h3>
									<p className="text-gray-600 max-w-2xl mx-auto">Find exactly what you're looking for with our comprehensive business categories</p>
								</div>

								<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
									{topCategories.map((category, index) => (
										<Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
											<CardHeader>
												<div className="flex items-center space-x-4">
													<div className={`p-3 rounded-lg ${category.color}`}>
														<category.icon className="h-8 w-8" />
													</div>
													<div className="flex-1">
														<CardTitle className="text-lg">{category.name}</CardTitle>
														<CardDescription>{category.description}</CardDescription>
													</div>
												</div>
											</CardHeader>
											<CardContent>
												<div className="mb-4">
													<Badge variant="secondary">{category.count} businesses</Badge>
												</div>
												<div className="space-y-2">
													<h4 className="text-sm font-semibold text-gray-600">Popular:</h4>
													<div className="flex flex-wrap gap-1">
														{category.subcategories.slice(0, 4).map((sub, subIndex) => (
															<Badge key={subIndex} variant="outline" className="text-xs">
																{sub}
															</Badge>
														))}
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</TabsContent>

						<TabsContent value="neighborhoods" className="mt-8">
							<div className="space-y-8">
								<div className="text-center">
									<h3 className="text-2xl font-bold mb-4">Trending Neighborhoods</h3>
									<p className="text-gray-600 max-w-2xl mx-auto">Discover vibrant local business districts and emerging neighborhoods across the country</p>
								</div>

								<div className="grid lg:grid-cols-2 gap-6">
									{trendingNeighborhoods.map((neighborhood, index) => (
										<Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
											<CardContent className="p-6">
												<div className="flex items-start justify-between mb-4">
													<div>
														<h4 className="text-xl font-semibold mb-1">{neighborhood.name}</h4>
														<div className="flex items-center space-x-2 text-gray-600">
															<MapPin className="h-4 w-4" />
															<span>{neighborhood.city}</span>
														</div>
													</div>
													<div className="text-right">
														<Badge className="bg-green-500 mb-1">{neighborhood.growth}</Badge>
														<div className="text-sm text-gray-500">{neighborhood.businesses} businesses</div>
													</div>
												</div>

												<p className="text-gray-600 mb-4">{neighborhood.description}</p>

												<div className="space-y-2">
													<h5 className="text-sm font-semibold">Popular highlights:</h5>
													<div className="flex flex-wrap gap-2">
														{neighborhood.highlights.map((highlight, highlightIndex) => (
															<Badge key={highlightIndex} variant="outline" className="text-xs">
																{highlight}
															</Badge>
														))}
													</div>
												</div>

												<Button variant="outline" className="w-full mt-4">
													Explore {neighborhood.name} <ArrowRight className="h-4 w-4 ml-2" />
												</Button>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</TabsContent>

						<TabsContent value="industries" className="mt-8">
							<div className="space-y-8">
								<div className="text-center">
									<h3 className="text-2xl font-bold mb-4">Industries Overview</h3>
									<p className="text-gray-600 max-w-2xl mx-auto">Explore business opportunities and trends across different industries</p>
								</div>

								<div className="grid lg:grid-cols-2 gap-6">
									{industries.map((industry, index) => (
										<Card key={index} className="hover:shadow-lg transition-shadow">
											<CardContent className="p-6">
												<div className="flex items-start space-x-4 mb-4">
													<div className="p-3 bg-blue-100 rounded-lg">
														<industry.icon className="h-8 w-8 text-blue-600" />
													</div>
													<div className="flex-1">
														<div className="flex items-center justify-between mb-2">
															<h4 className="text-xl font-semibold">{industry.name}</h4>
															<Badge className="bg-green-500">
																<TrendingUp className="h-3 w-3 mr-1" />
																{industry.growth}
															</Badge>
														</div>
														<p className="text-gray-600 mb-2">{industry.description}</p>
														<div className="text-sm text-gray-500">{industry.businesses.toLocaleString()} businesses</div>
													</div>
												</div>

												<div className="space-y-2">
													<h5 className="text-sm font-semibold">Trending now:</h5>
													<div className="flex flex-wrap gap-2">
														{industry.trending.map((trend, trendIndex) => (
															<Badge key={trendIndex} variant="outline" className="text-xs">
																<TrendingUp className="h-3 w-3 mr-1" />
																{trend}
															</Badge>
														))}
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						</TabsContent>

						<TabsContent value="certified" className="mt-8">
							<div className="space-y-8">
								<div className="text-center">
									<h3 className="text-2xl font-bold mb-4">Certified Businesses</h3>
									<p className="text-gray-600 max-w-2xl mx-auto">Discover businesses that have earned our trust and quality certifications</p>
								</div>

								<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
									{certificationBadges.map((badge, index) => (
										<Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
											<CardContent className="p-6">
												<badge.icon className={`h-12 w-12 mx-auto mb-4 ${badge.color}`} />
												<h4 className="font-semibold mb-2">{badge.name}</h4>
												<p className="text-gray-600 text-sm mb-3">{badge.description}</p>
												<Badge variant="secondary">{badge.count} businesses</Badge>
											</CardContent>
										</Card>
									))}
								</div>

								<div className="bg-white p-8 rounded-lg">
									<h4 className="text-xl font-semibold mb-4 text-center">Why Choose Certified Businesses?</h4>
									<div className="grid md:grid-cols-3 gap-6">
										<div className="text-center">
											<CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-3" />
											<h5 className="font-semibold mb-2">Verified Quality</h5>
											<p className="text-gray-600 text-sm">All certified businesses undergo thorough verification and quality checks.</p>
										</div>
										<div className="text-center">
											<Shield className="h-10 w-10 text-blue-600 mx-auto mb-3" />
											<h5 className="font-semibold mb-2">Trust & Safety</h5>
											<p className="text-gray-600 text-sm">Enhanced security measures and customer protection guarantees.</p>
										</div>
										<div className="text-center">
											<Star className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
											<h5 className="font-semibold mb-2">Superior Service</h5>
											<p className="text-gray-600 text-sm">Consistently high ratings and exceptional customer experiences.</p>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</section>
	);
}

export default function DiscoverPage() {
	return (
		<div className="min-h-screen">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebPage",
						name: "Discover Local Businesses",
						description: "Discover amazing local businesses by category, industry, and neighborhood. Find certified businesses, trending spots, and hidden gems.",
						url: "/discover",
						mainEntity: {
							"@type": "ItemList",
							name: "Business Discovery",
							itemListElement: [
								{
									"@type": "ListItem",
									position: 1,
									item: {
										"@type": "Thing",
										name: "Business Categories",
										description: "Browse businesses by category and type",
									},
								},
								{
									"@type": "ListItem",
									position: 2,
									item: {
										"@type": "Thing",
										name: "Neighborhoods",
										description: "Explore trending business districts and neighborhoods",
									},
								},
								{
									"@type": "ListItem",
									position: 3,
									item: {
										"@type": "Thing",
										name: "Industries",
										description: "Discover businesses across different industries",
									},
								},
								{
									"@type": "ListItem",
									position: 4,
									item: {
										"@type": "Thing",
										name: "Certified Businesses",
										description: "Find verified and certified local businesses",
									},
								},
							],
						},
					}),
				}}
			/>

			<DiscoverHero />
			<FeaturedBusinesses />
			<DiscoverContent />
		</div>
	);
}
