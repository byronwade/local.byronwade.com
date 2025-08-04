/**
 * Individual Business Page for Subdomains
 * Shows detailed business information within subdomain context
 */

import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { MapPin, Phone, Globe, Star, Clock, ExternalLink, Directions, Share2, Heart, Flag, Camera } from "lucide-react";
import Link from "next/link";
import { generateSubdomainMetadata, generateBusinessStructuredData } from "@lib/utils/subdomainSeo";
import { generateAdvancedServerSEO } from "@lib/utils/advancedServerSEO";
import AdvancedSEOWrapper from "@components/seo/AdvancedSEOWrapper";

// Force dynamic rendering to prevent build hanging
export const dynamic = "force-dynamic";

/**
 * Generate metadata for business page
 */
export async function generateMetadata({ params }) {
	const { subdomain, slug } = await params;

	try {
		// Fetch business data
		// Get base URL with fallback for build time
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
		const apiUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

		const response = await fetch(`${apiUrl}/api/v2/subdomains/${subdomain}/businesses?slug=${slug}`, {
			next: { revalidate: 300 },
		});

		if (!response.ok) {
			return {
				title: "Business Not Found",
				description: "The requested business could not be found.",
			};
		}

		const result = await response.json();
		if (!result.success || !result.data.businesses.length) {
			return {
				title: "Business Not Found",
				description: "The requested business could not be found.",
			};
		}

		const business = result.data.businesses[0];
		const localHub = result.data.localHub;

		// Use advanced SEO system for enhanced metadata generation
		const advancedMetadata = await generateAdvancedServerSEO(
			{
				type: "business",
				data: {
					...business,
					id: business.id,
					city: business.city,
					state: business.state,
					localHub: localHub,
				},
				path: `/${subdomain}/biz/${slug}`,
				breadcrumbs: [
					{ name: localHub?.name || "Home", url: `/${subdomain}` },
					{ name: "Businesses", url: `/${subdomain}/businesses` },
					{ name: business.name, url: `/${subdomain}/biz/${slug}` },
				],
			},
			{
				enableAdvancedOptimization: true,
				enableAIOptimization: true,
				enableCommunityStrategy: true,
				enableTopicalAuthority: true,
				enableGrowthStrategy: true,
			}
		);

		// Fallback to basic subdomain metadata if advanced fails
		return advancedMetadata || generateSubdomainMetadata(localHub, "business", { business });
	} catch (error) {
		console.error("Error generating business metadata:", error);
		return {
			title: "Local Business",
			description: "Discover local business information.",
		};
	}
}

/**
 * Business Page Component
 */
export default async function BusinessPage({ params }) {
	const { subdomain, slug } = await params;

	try {
		// Fetch business data
		// Get base URL with fallback for build time
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
		const apiUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

		const response = await fetch(`${apiUrl}/api/v2/subdomains/${subdomain}/businesses?slug=${slug}`, {
			next: { revalidate: 300 },
		});

		if (!response.ok) {
			notFound();
		}

		const result = await response.json();
		if (!result.success || !result.data.businesses.length) {
			notFound();
		}

		const business = result.data.businesses[0];
		const localHub = result.data.localHub;

		// Format hours for display
		const formatHours = (hours) => {
			if (!hours) return null;

			const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
			const dayNames = {
				monday: "Monday",
				tuesday: "Tuesday",
				wednesday: "Wednesday",
				thursday: "Thursday",
				friday: "Friday",
				saturday: "Saturday",
				sunday: "Sunday",
			};

			return daysOrder.map((day) => ({
				day: dayNames[day],
				hours: hours[day] || "Closed",
			}));
		};

		const businessHours = formatHours(business.hours);

		return (
			<AdvancedSEOWrapper
				type="business"
				data={{
					...business,
					id: business.id,
					city: business.city,
					state: business.state,
					localHub: localHub,
				}}
				enableAdvancedOptimization={true}
				enableAIOptimization={true}
				enableCommunityIntegration={true}
				enableTopicalAuthority={true}
			>
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
						<span className="text-foreground">{business.name}</span>
					</nav>

					{/* Business Header */}
					<div className="grid gap-8 lg:grid-cols-3">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							{/* Business Info */}
							<Card>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="space-y-2">
											<CardTitle className="text-3xl">{business.name}</CardTitle>
											<div className="flex items-center gap-2 text-muted-foreground">
												<MapPin className="w-4 h-4" />
												<span>
													{business.address}, {business.city}, {business.state}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Button variant="outline" size="sm">
												<Share2 className="w-4 h-4" />
											</Button>
											<Button variant="outline" size="sm">
												<Heart className="w-4 h-4" />
											</Button>
										</div>
									</div>

									{/* Rating */}
									{business.rating && (
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-2">
												<div className="flex items-center">
													{[...Array(5)].map((_, i) => (
														<Star key={i} className={`w-5 h-5 ${i < Math.floor(business.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
													))}
												</div>
												<span className="text-lg font-semibold">{business.rating}</span>
												<span className="text-muted-foreground">({business.review_count || 0} reviews)</span>
											</div>

											{business.price_range && (
												<Badge variant="outline" className="text-sm">
													{business.price_range}
												</Badge>
											)}
										</div>
									)}

									{/* Categories */}
									{business.categories && business.categories.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{business.categories.map((category) => (
												<Badge key={category.id} variant="secondary">
													<Link href={`/${subdomain}/categories/${category.slug}`}>{category.name}</Link>
												</Badge>
											))}
										</div>
									)}
								</CardHeader>

								{business.description && (
									<CardContent>
										<p className="text-muted-foreground leading-relaxed">{business.description}</p>
									</CardContent>
								)}
							</Card>

							{/* Photos */}
							{business.photos && business.photos.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Camera className="w-5 h-5" />
											Photos
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
											{business.photos.slice(0, 6).map((photo, index) => (
												<div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
													<Image src={photo} alt={`${business.name} photo ${index + 1}`} fill className="object-cover" />
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Amenities */}
							{business.amenities && business.amenities.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle>Amenities</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-2 md:grid-cols-2">
											{business.amenities.map((amenity, index) => (
												<div key={index} className="flex items-center gap-2">
													<div className="w-2 h-2 rounded-full bg-green-500" />
													<span className="text-sm">{amenity}</span>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							)}
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Contact Info */}
							<Card>
								<CardHeader>
									<CardTitle>Contact Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{business.phone && (
										<div className="flex items-center gap-3">
											<Phone className="w-4 h-4 text-muted-foreground" />
											<a href={`tel:${business.phone}`} className="hover:text-primary transition-colors">
												{business.phone}
											</a>
										</div>
									)}

									{business.website && (
										<div className="flex items-center gap-3">
											<Globe className="w-4 h-4 text-muted-foreground" />
											<a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
												Visit Website
												<ExternalLink className="w-3 h-3" />
											</a>
										</div>
									)}

									<div className="flex items-center gap-3">
										<MapPin className="w-4 h-4 text-muted-foreground" />
										<span className="text-sm">
											{business.address}, {business.city}, {business.state} {business.zip_code}
										</span>
									</div>

									{/* Action Buttons */}
									<div className="space-y-2 pt-4">
										<Button className="w-full" asChild>
											<a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer">
												<Directions className="w-4 h-4 mr-2" />
												Get Directions
											</a>
										</Button>

										{business.phone && (
											<Button variant="outline" className="w-full" asChild>
												<a href={`tel:${business.phone}`}>
													<Phone className="w-4 h-4 mr-2" />
													Call Now
												</a>
											</Button>
										)}
									</div>
								</CardContent>
							</Card>

							{/* Hours */}
							{businessHours && (
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Clock className="w-5 h-5" />
											Hours
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										{businessHours.map(({ day, hours }) => (
											<div key={day} className="flex justify-between text-sm">
												<span className="font-medium">{day}</span>
												<span className="text-muted-foreground">{hours}</span>
											</div>
										))}
									</CardContent>
								</Card>
							)}

							{/* Payment Methods */}
							{business.payment_methods && business.payment_methods.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle>Payment Methods</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-2">
											{business.payment_methods.map((method, index) => (
												<Badge key={index} variant="outline" className="text-xs">
													{method}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Report Issue */}
							<Card>
								<CardContent className="pt-6">
									<Button variant="ghost" size="sm" className="w-full text-muted-foreground">
										<Flag className="w-4 h-4 mr-2" />
										Report an Issue
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* JSON-LD Structured Data */}
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(generateBusinessStructuredData(localHub, business)),
						}}
					/>
				</div>
			</AdvancedSEOWrapper>
		);
	} catch (error) {
		console.error("Error loading business page:", error);
		notFound();
	}
}
