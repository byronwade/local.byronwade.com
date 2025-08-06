export const metadata = {
	title: "Business Success Stories - Inspiring Journeys & Case Studies | Thorbis",
	description: "Read inspiring business success stories and case studies from Thorbis partners. Learn how businesses grew their customer base, improved operations, and achieved success.",
	keywords: ["business success stories", "case studies", "business growth", "success testimonials", "business inspiration", "customer stories"],
	openGraph: {
		title: "Business Success Stories - Inspiring Journeys & Case Studies | Thorbis",
		description: "Read inspiring business success stories and case studies from Thorbis partners. Learn how businesses grew their customer base, improved operations, and achieved success.",
		url: "https://local.byronwade.com/business-success-stories",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-success-stories.jpg",
				width: 1200,
				height: 630,
				alt: "Business Success Stories on Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Business Success Stories - Thorbis",
		description: "Read inspiring business success stories and learn from proven growth strategies.",
		images: ["https://local.byronwade.com/og-success-stories.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/business-success-stories",
	},
};

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { ArrowUpRight, Star, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const successStories = [
	{
		businessName: "Wade's Plumbing & Septic",
		category: "Home Services",
		location: "Springfield, IL",
		image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
		results: {
			customerIncrease: "300%",
			revenueGrowth: "250%",
			reviewScore: "4.9",
		},
		story: "Transformed from a small local plumbing service to the region's most trusted plumbing company through strategic online presence and exceptional customer service.",
		link: "/case-studies/wades-plumbing-and-septic",
	},
	// Add more success stories as needed
];

export default function BusinessSuccessStoriesPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Business Success Stories",
		description: "Inspiring business success stories and case studies from Thorbis partners",
		url: "https://local.byronwade.com/business-success-stories",
		mainEntity: {
			"@type": "ItemList",
			name: "Business Success Stories",
			itemListElement: successStories.map((story, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Article",
					headline: `${story.businessName} Success Story`,
					description: story.story,
					author: {
						"@type": "Organization",
						name: "Thorbis",
					},
					about: {
						"@type": "LocalBusiness",
						name: story.businessName,
						address: story.location,
					},
				},
			})),
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: {
						"@id": "https://local.byronwade.com",
						name: "Thorbis",
					},
				},
				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@id": "https://local.byronwade.com/business-success-stories",
						name: "Success Stories",
					},
				},
			],
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="bg-muted">
					<div className="px-4 py-24 mx-auto max-w-5xl text-center lg:px-24">
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Business Success Stories</h1>
						<p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">Discover how businesses like yours achieved remarkable growth and success with Thorbis.</p>
					</div>
				</div>

				{/* Success Stories Grid */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-6xl">
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{successStories.map((story, index) => (
								<Card key={index} className="transition-shadow hover:shadow-lg">
									<div className="relative overflow-hidden">
										<Image src={story.image} alt={story.businessName} width={400} height={300} className="w-full h-48 object-cover" />
									</div>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="text-lg">{story.businessName}</CardTitle>
												<Badge variant="secondary" className="mt-1">
													{story.category}
												</Badge>
											</div>
											<div className="flex items-center">
												<Star className="w-4 h-4 text-yellow-500 fill-current" />
												<span className="ml-1 text-sm">{story.results.reviewScore}</span>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-2 gap-4 mb-4">
											<div className="text-center">
												<div className="text-lg font-bold text-primary">{story.results.customerIncrease}</div>
												<div className="text-xs text-muted-foreground">Customer Increase</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-bold text-primary">{story.results.revenueGrowth}</div>
												<div className="text-xs text-muted-foreground">Revenue Growth</div>
											</div>
										</div>
										<p className="text-sm text-muted-foreground mb-4">{story.story}</p>
										<Link href={story.link} className="inline-flex items-center text-sm font-medium text-primary hover:underline">
											Read Full Case Study
											<ArrowUpRight className="ml-1 w-4 h-4" />
										</Link>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
