/**
 * Subdomain Businesses Page
 * Lists all businesses for a specific subdomain
 */

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Badge } from "@components/ui/badge";
import { Search, MapPin, Star, Phone, Globe, ExternalLink, Filter, Grid3X3, List, Building2 } from "lucide-react";
import Link from "next/link";
import { generateSubdomainMetadata } from "@lib/utils/subdomainSeo";

// Force dynamic rendering to prevent build hanging
export const dynamic = "force-dynamic";

/**
 * Generate metadata for businesses page
 */
export async function generateMetadata({ params, searchParams }) {
	const { subdomain } = await params;
	const search = await searchParams;

	try {
		// Get base URL with fallback for build time
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
		const apiUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

		const response = await fetch(`${apiUrl}/api/v2/subdomains/${subdomain}`, {
			next: { revalidate: 300 },
		});

		if (!response.ok) {
			return {
				title: "Businesses Not Found",
				description: "The requested business directory could not be found.",
			};
		}

		const result = await response.json();
		if (!result.success) {
			return {
				title: "Businesses Not Found",
				description: "The requested business directory could not be found.",
			};
		}

		const localHub = result.data.localHub;

		// Generate metadata with search context
		return generateSubdomainMetadata(localHub, "businesses", {
			searchQuery: search?.q,
			category: search?.category,
		});
	} catch (error) {
		console.error("Error generating businesses metadata:", error);
		return {
			title: "Local Businesses",
			description: "Discover local businesses in your area.",
		};
	}
}

/**
 * Businesses Page Component
 */
export default async function BusinessesPage({ params, searchParams }) {
	const { subdomain } = await params;
	const search = await searchParams;

	try {
		// Build API query with search parameters
		const queryParams = new URLSearchParams();
		if (search?.q) queryParams.set("search", search.q);
		if (search?.category) queryParams.set("category", search.category);
		if (search?.sort) queryParams.set("sort", search.sort);
		if (search?.rating) queryParams.set("min_rating", search.rating);
		queryParams.set("limit", "24");
		queryParams.set("page", search?.page || "1");

		// Get base URL with fallback for build time
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
		const apiUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

		// Fetch subdomain and businesses data
		const [subdomainResponse, businessesResponse, filtersResponse] = await Promise.all([
			fetch(`${apiUrl}/api/v2/subdomains/${subdomain}`, {
				next: { revalidate: 300 },
			}),
			fetch(`${apiUrl}/api/v2/subdomains/${subdomain}/businesses?${queryParams.toString()}`, {
				next: { revalidate: 180 }, // Cache for 3 minutes
			}),
			fetch(`${apiUrl}/api/v2/subdomains/${subdomain}/businesses/filters`, {
				next: { revalidate: 1800 }, // Cache filters for 30 minutes
			}),
		]);

		if (!subdomainResponse.ok) {
			notFound();
		}

		const subdomainResult = await subdomainResponse.json();
		if (!subdomainResult.success) {
			notFound();
		}

		const localHub = subdomainResult.data.localHub;

		// Get businesses and filters data
		let businesses = [];
		let totalCount = 0;
		let filters = { categories: [], priceRanges: [] };

		if (businessesResponse.ok) {
			const businessesResult = await businessesResponse.json();
			if (businessesResult.success) {
				businesses = businessesResult.data.businesses || [];
				totalCount = businessesResult.data.pagination?.total || 0;
			}
		}

		if (filtersResponse.ok) {
			const filtersResult = await filtersResponse.json();
			if (filtersResult.success) {
				filters = filtersResult.data.filters || filters;
			}
		}

		return (
			<div className="container mx-auto px-4 py-8 space-y-8">
				{/* Header */}
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold">
						Businesses in {localHub.city}, {localHub.state}
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover {totalCount} local businesses in our directory</p>
				</div>

				{/* Search and Filters */}
				<Card>
					<CardContent className="p-6">
						<div className="grid gap-4 md:grid-cols-4">
							{/* Search */}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input placeholder="Search businesses..." defaultValue={search?.q || ""} className="pl-10" />
							</div>

							{/* Category Filter */}
							<Select defaultValue={search?.category || "all"}>
								<SelectTrigger>
									<SelectValue placeholder="All Categories" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									{filters.categories.map((category) => (
										<SelectItem key={category.id} value={category.slug}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Sort */}
							<Select defaultValue={search?.sort || "rating"}>
								<SelectTrigger>
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="rating">Highest Rated</SelectItem>
									<SelectItem value="name">Name A-Z</SelectItem>
									<SelectItem value="distance">Distance</SelectItem>
									<SelectItem value="newest">Newest</SelectItem>
								</SelectContent>
							</Select>

							{/* View Toggle */}
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm">
									<Grid3X3 className="w-4 h-4" />
								</Button>
								<Button variant="ghost" size="sm">
									<List className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Results */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{businesses.length > 0 ? (
						businesses.map((business) => (
							<Card key={business.id} className="hover:shadow-md transition-shadow">
								<CardContent className="p-6">
									<div className="space-y-4">
										{/* Business Header */}
										<div>
											<h3 className="font-semibold text-lg">
												<Link href={`/${subdomain}/biz/${business.slug}`} className="hover:text-primary transition-colors">
													{business.name}
												</Link>
											</h3>
											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<MapPin className="w-4 h-4" />
												<span>{business.address}</span>
											</div>
										</div>

										{/* Rating */}
										{business.rating && (
											<div className="flex items-center gap-2">
												<div className="flex items-center">
													{[...Array(5)].map((_, i) => (
														<Star key={i} className={`w-4 h-4 ${i < Math.floor(business.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
													))}
												</div>
												<span className="font-medium">{business.rating}</span>
												<span className="text-muted-foreground text-sm">({business.review_count || 0} reviews)</span>
											</div>
										)}

										{/* Description */}
										{business.description && <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>}

										{/* Categories */}
										{business.categories && business.categories.length > 0 && (
											<div className="flex flex-wrap gap-1">
												{business.categories.slice(0, 2).map((category) => (
													<Badge key={category.id} variant="secondary" className="text-xs">
														{category.name}
													</Badge>
												))}
											</div>
										)}

										{/* Actions */}
										<div className="flex items-center justify-between pt-2">
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
											</div>
											<Button size="sm" asChild>
												<Link href={`/${subdomain}/biz/${business.slug}`}>View Details</Link>
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<div className="col-span-full text-center py-12">
							<Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">No businesses found</h3>
							<p className="text-muted-foreground">Try adjusting your search criteria or browse all categories.</p>
						</div>
					)}
				</div>

				{/* Pagination */}
				{totalCount > 24 && (
					<div className="flex justify-center">
						<div className="flex items-center gap-2">
							<Button variant="outline" disabled={!search?.page || search.page === "1"}>
								Previous
							</Button>
							<span className="text-sm text-muted-foreground px-4">
								Page {search?.page || 1} of {Math.ceil(totalCount / 24)}
							</span>
							<Button variant="outline" disabled={!search?.page || parseInt(search.page) >= Math.ceil(totalCount / 24)}>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>
		);
	} catch (error) {
		console.error("Error loading businesses page:", error);
		notFound();
	}
}
