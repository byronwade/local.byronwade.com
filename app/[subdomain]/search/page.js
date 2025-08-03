/**
 * Subdomain Search Page
 * Location-aware search functionality for subdomain businesses
 */

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { Search, MapPin, Star, Phone, Globe, ExternalLink, Building2, X, Filter, Map, List, Grid3X3 } from "lucide-react";
import Link from "next/link";
import { generateSubdomainMetadata, generateSearchStructuredData } from "@lib/utils/subdomainSeo";

// Force dynamic rendering to prevent build hanging
export const dynamic = "force-dynamic";

/**
 * Generate metadata for search page
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
				title: "Search Not Available",
				description: "Search functionality is not available for this location.",
			};
		}

		const result = await response.json();
		if (!result.success) {
			return {
				title: "Search Not Available",
				description: "Search functionality is not available for this location.",
			};
		}

		const localHub = result.data.localHub;

		// Generate metadata for search page
		return generateSubdomainMetadata(localHub, "search", {
			searchQuery: search?.q,
			category: search?.category,
		});
	} catch (error) {
		console.error("Error generating search metadata:", error);
		return {
			title: "Local Business Search",
			description: "Search for local businesses in your area.",
		};
	}
}

/**
 * Search Page Component
 */
export default async function SearchPage({ params, searchParams }) {
	const { subdomain } = await params;
	const search = await searchParams;

	const query = search?.q || "";
	const category = search?.category || "";
	const sort = search?.sort || "relevance";
	const rating = search?.rating || "";
	const price = search?.price || "";
	const page = parseInt(search?.page || "1");

	try {
		// Get base URL with fallback for build time
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
		const apiUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

		// Fetch subdomain data
		const subdomainResponse = await fetch(`${apiUrl}/api/v2/subdomains/${subdomain}`, {
			next: { revalidate: 300 },
		});

		if (!subdomainResponse.ok) {
			notFound();
		}

		const subdomainResult = await subdomainResponse.json();
		if (!subdomainResult.success) {
			notFound();
		}

		const localHub = subdomainResult.data.localHub;

		// Build search query
		const searchParams = new URLSearchParams();
		if (query) searchParams.set("search", query);
		if (category) searchParams.set("category", category);
		if (sort) searchParams.set("sort", sort);
		if (rating) searchParams.set("min_rating", rating);
		if (price) searchParams.set("price_range", price);
		searchParams.set("limit", "24");
		searchParams.set("page", page.toString());

		// Fetch search results and filters
		const [searchResponse, filtersResponse] = await Promise.all([
			fetch(`${apiUrl}/api/v2/subdomains/${subdomain}/businesses?${searchParams.toString()}`, {
				next: { revalidate: 60 }, // Short cache for search results
			}),
			fetch(`${apiUrl}/api/v2/subdomains/${subdomain}/businesses/filters`, {
				next: { revalidate: 1800 },
			}),
		]);

		// Get search results
		let businesses = [];
		let totalCount = 0;
		let searchTime = 0;

		if (searchResponse.ok) {
			const searchResult = await searchResponse.json();
			if (searchResult.success) {
				businesses = searchResult.data.businesses || [];
				totalCount = searchResult.data.pagination?.total || 0;
				searchTime = searchResult.meta?.searchTime || 0;
			}
		}

		// Get filters
		let filters = { categories: [], priceRanges: [] };
		if (filtersResponse.ok) {
			const filtersResult = await filtersResponse.json();
			if (filtersResult.success) {
				filters = filtersResult.data.filters || filters;
			}
		}

		// Build active filters for display
		const activeFilters = [];
		if (query) activeFilters.push({ type: "query", value: query, label: `"${query}"` });
		if (category) {
			const categoryObj = filters.categories.find((c) => c.slug === category);
			if (categoryObj) activeFilters.push({ type: "category", value: category, label: categoryObj.name });
		}
		if (rating) activeFilters.push({ type: "rating", value: rating, label: `${rating}+ stars` });
		if (price) activeFilters.push({ type: "price", value: price, label: price });

		return (
			<div className="container mx-auto px-4 py-8 space-y-8">
				{/* Breadcrumb */}
				<nav className="text-sm text-muted-foreground">
					<Link href={`/${subdomain}`} className="hover:text-foreground">
						{localHub.name}
					</Link>
					{" > "}
					<span className="text-foreground">Search</span>
					{query && (
						<>
							{" > "}
							<span className="text-foreground">"{query}"</span>
						</>
					)}
				</nav>

				{/* Search Header */}
				<div className="space-y-4">
					<div className="text-center">
						<h1 className="text-4xl font-bold">{query ? `Search Results for "${query}"` : "Search Businesses"}</h1>
						<p className="text-xl text-muted-foreground mt-2">
							in {localHub.city}, {localHub.state}
						</p>
					</div>

					{/* Search Results Summary */}
					{query && (
						<div className="text-center">
							<p className="text-muted-foreground">
								{totalCount > 0 ? (
									<>
										Found <span className="font-semibold">{totalCount}</span> results
										{searchTime > 0 && (
											<>
												{" "}
												in <span className="font-semibold">{searchTime}ms</span>
											</>
										)}
									</>
								) : (
									"No results found"
								)}
							</p>
						</div>
					)}
				</div>

				{/* Search Form */}
				<Card>
					<CardContent className="p-6">
						<div className="space-y-4">
							{/* Main Search */}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
								<Input placeholder={`Search businesses in ${localHub.city}...`} defaultValue={query} className="pl-12 h-12 text-lg" />
							</div>

							{/* Filters */}
							<div className="grid gap-4 md:grid-cols-4">
								{/* Category Filter */}
								<Select defaultValue={category || "all"}>
									<SelectTrigger>
										<SelectValue placeholder="All Categories" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Categories</SelectItem>
										{filters.categories.map((cat) => (
											<SelectItem key={cat.id} value={cat.slug}>
												{cat.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								{/* Rating Filter */}
								<Select defaultValue={rating || "all"}>
									<SelectTrigger>
										<SelectValue placeholder="Any Rating" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Any Rating</SelectItem>
										<SelectItem value="4">4+ Stars</SelectItem>
										<SelectItem value="3">3+ Stars</SelectItem>
										<SelectItem value="2">2+ Stars</SelectItem>
									</SelectContent>
								</Select>

								{/* Price Filter */}
								<Select defaultValue={price || "all"}>
									<SelectTrigger>
										<SelectValue placeholder="Any Price" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Any Price</SelectItem>
										<SelectItem value="$">$ - Budget</SelectItem>
										<SelectItem value="$$">$$ - Moderate</SelectItem>
										<SelectItem value="$$$">$$$ - Expensive</SelectItem>
										<SelectItem value="$$$$">$$$$ - Very Expensive</SelectItem>
									</SelectContent>
								</Select>

								{/* Sort */}
								<Select defaultValue={sort}>
									<SelectTrigger>
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="relevance">Most Relevant</SelectItem>
										<SelectItem value="rating">Highest Rated</SelectItem>
										<SelectItem value="distance">Distance</SelectItem>
										<SelectItem value="name">Name A-Z</SelectItem>
										<SelectItem value="newest">Newest</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Active Filters */}
							{activeFilters.length > 0 && (
								<div className="flex flex-wrap gap-2">
									<span className="text-sm text-muted-foreground">Active filters:</span>
									{activeFilters.map((filter, index) => (
										<Badge key={index} variant="secondary" className="gap-1">
											{filter.label}
											<X className="w-3 h-3 cursor-pointer" />
										</Badge>
									))}
									<Button variant="ghost" size="sm" className="text-xs">
										Clear all
									</Button>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Results */}
				{businesses.length > 0 ? (
					<div className="space-y-6">
						{/* View Options */}
						<div className="flex items-center justify-between">
							<p className="text-sm text-muted-foreground">
								Showing {(page - 1) * 24 + 1} - {Math.min(page * 24, totalCount)} of {totalCount} results
							</p>
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm">
									<Grid3X3 className="w-4 h-4" />
								</Button>
								<Button variant="ghost" size="sm">
									<List className="w-4 h-4" />
								</Button>
								<Button variant="ghost" size="sm">
									<Map className="w-4 h-4" />
								</Button>
							</div>
						</div>

						{/* Business Cards */}
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{businesses.map((business) => (
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
													{business.distance_km && <span>• {business.distance_km.toFixed(1)}km</span>}
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
													<span className="text-muted-foreground text-sm">({business.review_count || 0})</span>
												</div>
											)}

											{/* Description */}
											{business.description && <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>}

											{/* Categories & Price */}
											<div className="flex items-center justify-between">
												<div className="flex flex-wrap gap-1">
													{business.categories?.slice(0, 2).map((cat) => (
														<Badge key={cat.id} variant="outline" className="text-xs">
															{cat.name}
														</Badge>
													))}
												</div>
												{business.price_range && (
													<Badge variant="secondary" className="text-xs">
														{business.price_range}
													</Badge>
												)}
											</div>

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
							))}
						</div>

						{/* Pagination */}
						{totalCount > 24 && (
							<div className="flex justify-center">
								<div className="flex items-center gap-2">
									<Button variant="outline" disabled={page <= 1}>
										Previous
									</Button>
									<span className="text-sm text-muted-foreground px-4">
										Page {page} of {Math.ceil(totalCount / 24)}
									</span>
									<Button variant="outline" disabled={page >= Math.ceil(totalCount / 24)}>
										Next
									</Button>
								</div>
							</div>
						)}
					</div>
				) : query ? (
					/* No Results */
					<div className="text-center py-12">
						<Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-xl font-semibold mb-2">No businesses found</h3>
						<p className="text-muted-foreground mb-6">
							We couldn't find any businesses matching "{query}" in {localHub.city}.
						</p>
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">Try:</p>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>• Checking your spelling</li>
								<li>• Using different keywords</li>
								<li>• Browsing our categories instead</li>
							</ul>
						</div>
						<div className="mt-6 space-x-4">
							<Button asChild>
								<Link href={`/${subdomain}/businesses`}>Browse All Businesses</Link>
							</Button>
							<Button variant="outline" asChild>
								<Link href={`/${subdomain}`}>Back to Home</Link>
							</Button>
						</div>
					</div>
				) : (
					/* Initial Search State */
					<div className="text-center py-12">
						<Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
						<p className="text-muted-foreground mb-6">Search for businesses, services, or anything you need in {localHub.city}.</p>
						<Button asChild>
							<Link href={`/${subdomain}/businesses`}>Browse All Businesses</Link>
						</Button>
					</div>
				)}

				{/* JSON-LD Structured Data */}
				{query && businesses.length > 0 && (
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(
								generateSearchStructuredData(localHub, {
									searchQuery: query,
									results: businesses,
									resultCount: totalCount,
								})
							),
						}}
					/>
				)}
			</div>
		);
	} catch (error) {
		console.error("Error loading search page:", error);
		notFound();
	}
}
