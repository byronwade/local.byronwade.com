/**
 * Subdomain Category Page
 * Shows businesses in a specific category for a subdomain
 */

import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Badge } from "@components/ui/badge";
import { Search, MapPin, Star, Phone, Globe, ExternalLink, Building2, Grid3X3, List, Filter } from "lucide-react";
import Link from "next/link";
import { generateSubdomainMetadata, generateCategoryStructuredData } from "@lib/utils/subdomainSeo";

// Force dynamic rendering to prevent build hanging
export const dynamic = "force-dynamic";

/**
 * Generate metadata for category page
 */
export async function generateMetadata({ params, searchParams }) {
	const { subdomain, category: categorySlug } = await params;
	const search = await searchParams;

	try {
		// Get base URL with fallback for build time
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
		const apiUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || apiUrl;

		// Fetch subdomain and category data
		const [subdomainResponse, categoryResponse] = await Promise.all([
			fetch(`${apiUrl}/api/v2/subdomains/${subdomain}`, {
				next: { revalidate: 300 },
			}),
			fetch(`${apiBaseUrl}/v2/categories/${categorySlug}`, {
				next: { revalidate: 3600 },
			}),
		]);

		if (!subdomainResponse.ok || !categoryResponse.ok) {
			return {
				title: "Category Not Found",
				description: "The requested category could not be found.",
			};
		}

		const [subdomainResult, categoryResult] = await Promise.all([subdomainResponse.json(), categoryResponse.json()]);

		if (!subdomainResult.success || !categoryResult.success) {
			return {
				title: "Category Not Found",
				description: "The requested category could not be found.",
			};
		}

		const localHub = subdomainResult.data.localHub;
		const category = categoryResult.data.category;

		// Generate metadata for category page
		return generateSubdomainMetadata(localHub, "category", { category });
	} catch (error) {
		console.error("Error generating category metadata:", error);
		return {
			title: "Local Business Category",
			description: "Discover local businesses by category.",
		};
	}
}

/**
 * Category Page Component
 */
export default async function CategoryPage({ params, searchParams }) {
	const { subdomain, category: categorySlug } = await params;
	const search = await searchParams;

	try {
		// Build API query with search parameters
		const queryParams = new URLSearchParams();
		queryParams.set("category", categorySlug);
		if (search?.q) queryParams.set("search", search.q);
		if (search?.sort) queryParams.set("sort", search.sort);
		if (search?.rating) queryParams.set("min_rating", search.rating);
		if (search?.price) queryParams.set("price_range", search.price);
		queryParams.set("limit", "24");
		queryParams.set("page", search?.page || "1");

		// Get base URL with fallback for build time
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
		const apiUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || apiUrl;

		// Fetch data
		const [subdomainResponse, categoryResponse, businessesResponse] = await Promise.all([
			fetch(`${apiUrl}/api/v2/subdomains/${subdomain}`, {
				next: { revalidate: 300 },
			}),
			fetch(`${apiBaseUrl}/v2/categories/${categorySlug}`, {
				next: { revalidate: 3600 },
			}),
			fetch(`${apiUrl}/api/v2/subdomains/${subdomain}/businesses?${queryParams.toString()}`, {
				next: { revalidate: 180 },
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

		// Get category data
		let category = null;
		if (categoryResponse.ok) {
			const categoryResult = await categoryResponse.json();
			if (categoryResult.success) {
				category = categoryResult.data.category;
			}
		}

		if (!category) {
			notFound();
		}

		// Get businesses data
		let businesses = [];
		let totalCount = 0;
		if (businessesResponse.ok) {
			const businessesResult = await businessesResponse.json();
			if (businessesResult.success) {
				businesses = businessesResult.data.businesses || [];
				totalCount = businessesResult.data.pagination?.total || 0;
			}
		}

		return (
			<div className="container mx-auto px-4 py-8 space-y-8">
				{/* Breadcrumb */}
				<nav className="text-sm text-muted-foreground">
					<Link href={`/${subdomain}`} className="hover:text-foreground">
						{localHub.name}
					</Link>
					{" > "}
					<Link href={`/${subdomain}/businesses`} className="hover:text-foreground">
						Businesses
					</Link>
					{" > "}
					<span className="text-foreground">{category.name}</span>
				</nav>

				{/* Header */}
				<div className="text-center space-y-4">
					<div className="flex items-center justify-center gap-3 mb-4">
						{category.icon && <div className="text-6xl">{category.icon}</div>}
						<div>
							<h1 className="text-4xl font-bold">
								{category.name} in {localHub.city}, {localHub.state}
							</h1>
							{category.description && <p className="text-xl text-muted-foreground mt-2">{category.description}</p>}
						</div>
					</div>
					<p className="text-lg text-muted-foreground">
						{totalCount} {category.name.toLowerCase()} businesses found
					</p>
				</div>

				{/* Search and Filters */}
				<Card>
					<CardContent className="p-6">
						<div className="grid gap-4 md:grid-cols-4">
							{/* Search */}
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input placeholder={`Search ${category.name.toLowerCase()}...`} defaultValue={search?.q || ""} className="pl-10" />
							</div>

							{/* Rating Filter */}
							<Select defaultValue={search?.rating || "all"}>
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
							<Select defaultValue={search?.price || "all"}>
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
						</div>
					</CardContent>
				</Card>

				{/* Business Results */}
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
												{business.distance_km && <span>• {business.distance_km.toFixed(1)}km away</span>}
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

										{/* Price Range */}
										{business.price_range && (
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-sm">
													{business.price_range}
												</Badge>
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
							<h3 className="text-xl font-semibold mb-2">No {category.name.toLowerCase()} found</h3>
							<p className="text-muted-foreground mb-4">
								There are currently no {category.name.toLowerCase()} businesses listed in {localHub.city}.
							</p>
							<Button asChild>
								<Link href={`/${subdomain}/businesses`}>Browse All Businesses</Link>
							</Button>
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

				{/* JSON-LD Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(generateCategoryStructuredData(localHub, category, businesses)),
					}}
				/>
			</div>
		);
	} catch (error) {
		console.error("Error loading category page:", error);
		notFound();
	}
}
