// REQUIRED: Subdomain Home Page Component
// Location-specific home page for LocalHub subdomains with featured businesses and local content

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import { Search, MapPin, Phone, Globe, Star, Clock, ExternalLink, Directions, TrendingUp, Award, Users, Building2, MessageSquare, ArrowRight, Grid3X3 } from "lucide-react";

// Utils
import { generateSubdomainSeoMetadata } from "@/lib/utils/subdomainSeo";

export default function SubdomainHomePage({ localHub }) {
	const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
	const [categories, setCategories] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalBusinesses: 0,
		totalReviews: 0,
		averageRating: 0,
		newThisMonth: 0,
	});

	useEffect(() => {
		fetchHomePageData();
	}, [localHub.id]);

	const fetchHomePageData = async () => {
		try {
			const [businessesResponse, categoriesResponse] = await Promise.all([fetch(`/api/v2/subdomains/${localHub.subdomain}/businesses?featured=true&limit=6`), fetch(`/api/v2/categories?featured=true&limit=8`)]);

			const businessesResult = await businessesResponse.json();
			const categoriesResult = await categoriesResponse.json();

			if (businessesResult.success) {
				setFeaturedBusinesses(businessesResult.data.businesses || []);
				setStats({
					totalBusinesses: businessesResult.data.pagination?.total || 0,
					totalReviews: localHub.total_reviews || 0,
					averageRating: calculateAverageRating(businessesResult.data.businesses || []),
					newThisMonth: businessesResult.data.businesses?.filter((b) => new Date(b.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0,
				});
			}

			if (categoriesResult.success) {
				setCategories(categoriesResult.data.categories || []);
			}
		} catch (error) {
			console.error("Error fetching home page data:", error);
			toast.error("Failed to load some content");
		} finally {
			setLoading(false);
		}
	};

	const calculateAverageRating = (businesses) => {
		if (!businesses.length) return 0;
		const validRatings = businesses.filter((b) => b.rating).map((b) => b.rating);
		if (!validRatings.length) return 0;
		return (validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length).toFixed(1);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
		}
	};

	const formatDistance = (distance) => {
		if (!distance) return "";
		return `${distance.toFixed(1)} km away`;
	};

	const formatRating = (rating, reviewCount) => {
		if (!rating) return "No rating";
		return `${rating} (${reviewCount || 0} review${reviewCount !== 1 ? "s" : ""})`;
	};

	return (
		<div className="space-y-8">
			{/* Hero Section */}
			<section className="py-12 bg-gradient-to-br from-primary/10 to-secondary/10">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">Discover {localHub.city}</h1>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{localHub.tagline || `Find the best local businesses in ${localHub.city}, ${localHub.state}. From restaurants to services, discover what makes our community special.`}</p>

					{/* Search Bar */}
					<form onSubmit={handleSearch} className="max-w-2xl mx-auto">
						<div className="flex items-center space-x-2">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
								<Input type="search" placeholder={`Search businesses in ${localHub.city}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 text-lg" />
							</div>
							<Button type="submit" size="lg" className="h-12 px-8">
								Search
							</Button>
						</div>
					</form>
				</div>
			</section>

			<div className="container mx-auto px-4">
				{/* Stats Section */}
				<section className="grid gap-6 md:grid-cols-4 mb-12">
					<Card>
						<CardContent className="flex items-center p-6">
							<Building2 className="h-8 w-8 text-blue-600" />
							<div className="ml-4">
								<p className="text-2xl font-bold">{stats.totalBusinesses}</p>
								<p className="text-sm text-muted-foreground">Local Businesses</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center p-6">
							<MessageSquare className="h-8 w-8 text-green-600" />
							<div className="ml-4">
								<p className="text-2xl font-bold">{stats.totalReviews}</p>
								<p className="text-sm text-muted-foreground">Customer Reviews</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center p-6">
							<Star className="h-8 w-8 text-yellow-600" />
							<div className="ml-4">
								<p className="text-2xl font-bold">{stats.averageRating}</p>
								<p className="text-sm text-muted-foreground">Average Rating</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center p-6">
							<TrendingUp className="h-8 w-8 text-purple-600" />
							<div className="ml-4">
								<p className="text-2xl font-bold">{stats.newThisMonth}</p>
								<p className="text-sm text-muted-foreground">New This Month</p>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Featured Businesses */}
				<section className="mb-12">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-2xl font-bold">Featured Businesses</h2>
							<p className="text-muted-foreground">Top-rated local businesses in {localHub.city}</p>
						</div>
						<Button variant="outline" asChild>
							<Link href="/businesses">
								View All
								<ArrowRight className="w-4 h-4 ml-2" />
							</Link>
						</Button>
					</div>

					{loading ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{[...Array(6)].map((_, i) => (
								<Card key={i} className="animate-pulse">
									<CardContent className="p-6">
										<div className="h-4 bg-muted rounded mb-2" />
										<div className="h-3 bg-muted rounded mb-4 w-3/4" />
										<div className="h-3 bg-muted rounded mb-2" />
										<div className="h-3 bg-muted rounded w-1/2" />
									</CardContent>
								</Card>
							))}
						</div>
					) : featuredBusinesses.length > 0 ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{featuredBusinesses.map((business) => (
								<Card key={business.id} className="hover:shadow-lg transition-shadow group">
									<CardContent className="p-6">
										<div className="flex items-start justify-between mb-3">
											<div className="flex-1">
												<h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
													<Link href={`/biz/${business.slug}`}>{business.name}</Link>
												</h3>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<MapPin className="w-4 h-4" />
													<span>
														{business.city}, {business.state}
													</span>
													{business.distance_km && <span>• {formatDistance(business.distance_km)}</span>}
												</div>
											</div>
											{business.is_featured && (
												<Badge variant="secondary" className="ml-2">
													<Award className="w-3 h-3 mr-1" />
													Featured
												</Badge>
											)}
										</div>

										{business.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{business.description}</p>}

										<div className="space-y-2 mb-4">
											{business.rating && (
												<div className="flex items-center gap-1 text-sm">
													<div className="flex items-center">
														{[...Array(5)].map((_, i) => (
															<Star key={i} className={`w-4 h-4 ${i < Math.floor(business.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
														))}
													</div>
													<span className="font-medium">{business.rating}</span>
													<span className="text-muted-foreground">({business.review_count || 0} reviews)</span>
												</div>
											)}

											{business.business_categories?.length > 0 && (
												<div className="flex items-center gap-1 text-sm">
													<Grid3X3 className="w-4 h-4 text-muted-foreground" />
													<span className="text-muted-foreground">
														{business.business_categories[0].category.name}
														{business.business_categories.length > 1 && ` +${business.business_categories.length - 1} more`}
													</span>
												</div>
											)}

											{business.price_range && (
												<div className="flex items-center gap-1 text-sm">
													<span className="font-medium text-green-600">{business.price_range}</span>
													<span className="text-muted-foreground">Price range</span>
												</div>
											)}
										</div>

										<div className="flex items-center justify-between pt-3 border-t">
											<div className="flex items-center gap-2">
												{business.phone && (
													<Button variant="outline" size="sm" asChild>
														<a href={`tel:${business.phone}`}>
															<Phone className="w-4 h-4" />
														</a>
													</Button>
												)}
												{business.website && (
													<Button variant="outline" size="sm" asChild>
														<a href={business.website} target="_blank" rel="noopener noreferrer">
															<Globe className="w-4 h-4" />
														</a>
													</Button>
												)}
												<Button variant="outline" size="sm" asChild>
													<a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer">
														<Directions className="w-4 h-4" />
													</a>
												</Button>
											</div>
											<Button size="sm" asChild>
												<Link href={`/biz/${business.slug}`}>View Details</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<Building2 className="w-12 h-12 text-muted-foreground mb-4" />
								<h3 className="font-medium mb-2">No featured businesses yet</h3>
								<p className="text-muted-foreground text-center mb-4">Be the first to add your business to {localHub.name}</p>
								<Button asChild>
									<Link href="/add-business">Add Your Business</Link>
								</Button>
							</CardContent>
						</Card>
					)}
				</section>

				{/* Popular Categories */}
				{categories.length > 0 && (
					<section className="mb-12">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-2xl font-bold">Popular Categories</h2>
								<p className="text-muted-foreground">Browse businesses by category in {localHub.city}</p>
							</div>
							<Button variant="outline" asChild>
								<Link href="/categories">
									View All
									<ArrowRight className="w-4 h-4 ml-2" />
								</Link>
							</Button>
						</div>

						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							{categories.slice(0, 8).map((category) => (
								<Card key={category.id} className="hover:shadow-md transition-shadow group">
									<CardContent className="p-6 text-center">
										{category.icon && <div className="text-4xl mb-3">{category.icon}</div>}
										<h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
											<Link href={`/categories/${category.slug}`}>{category.name}</Link>
										</h3>
										{category.description && <p className="text-sm text-muted-foreground mb-3">{category.description}</p>}
										<Button variant="outline" size="sm" className="w-full" asChild>
											<Link href={`/categories/${category.slug}`}>Browse {category.name}</Link>
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</section>
				)}

				{/* Local Information */}
				<section className="mb-12">
					<Card>
						<CardHeader>
							<CardTitle>About {localHub.city}</CardTitle>
							<CardDescription>Your local business community</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{localHub.description && <p className="text-muted-foreground">{localHub.description}</p>}

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<h4 className="font-medium">Location</h4>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<MapPin className="w-4 h-4" />
										<span>
											{localHub.city}, {localHub.state}, {localHub.country}
										</span>
									</div>
									{localHub.latitude && localHub.longitude && <div className="text-sm text-muted-foreground">Coverage radius: {localHub.radius_km} km</div>}
								</div>

								<div className="space-y-2">
									<h4 className="font-medium">Community Stats</h4>
									<div className="text-sm text-muted-foreground space-y-1">
										<div>{stats.totalBusinesses} local businesses</div>
										<div>{stats.totalReviews} customer reviews</div>
										<div>{stats.newThisMonth} new businesses this month</div>
									</div>
								</div>
							</div>

							<div className="flex gap-2 pt-4">
								<Button variant="outline" asChild>
									<Link href="/businesses">Browse All Businesses</Link>
								</Button>
								<Button variant="outline" asChild>
									<Link href="/add-business">Add Your Business</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</section>
			</div>
		</div>
	);
}
