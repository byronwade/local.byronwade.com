"use client";

import { useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Building } from "lucide-react";

const mockReviews = [
	{
		id: "rev1",
		company: "Innovate Solutions",
		logo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=100&h=100&fit=crop",
		rating: 4.5,
		reviewCount: 120,
		title: "Great culture and growth opportunities",
		review: "Innovate Solutions has a fantastic work environment. Management is supportive, and there are plenty of opportunities to learn and grow. The work-life balance is also excellent.",
		author: "Current Employee - Senior Developer",
	},
	{
		id: "rev2",
		company: "Riverstone Logistics",
		logo: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=100&h=100&fit=crop",
		rating: 3.8,
		reviewCount: 85,
		title: "Fast-paced and challenging",
		review: "The work is demanding, but the team is great. It's a good place to build a career if you're willing to put in the effort. Compensation is competitive.",
		author: "Former Employee - Logistics Coordinator",
	},
];

const Rating = ({ rating }) => (
	<div className="flex items-center">
		{[...Array(5)].map((_, i) => (
			<Star key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
		))}
		<span className="ml-2 text-sm font-semibold">{rating.toFixed(1)}</span>
	</div>
);

export default function CompanyReviewsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Company Reviews",
		description: "Get the inside scoop on companies with employee reviews.",
		url: "https://local.byronwade.com/reviews",
		mainEntity: {
			"@type": "ItemList",
			name: "Featured Reviews",
			itemListElement: mockReviews.map((review, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Review",
					itemReviewed: {
						"@type": "Organization",
						name: review.company,
						image: review.logo,
					},
					reviewRating: {
						"@type": "Rating",
						ratingValue: review.rating,
						bestRating: "5",
					},
					name: review.title,
					reviewBody: review.review,
					author: {
						"@type": "Person",
						name: review.author,
					},
				},
			})),
		},
	};

	return (
		<div className="space-y-8">
			<Head>
				<title>Company Reviews</title>
				<meta name="description" content="Get the inside scoop on companies with employee reviews." />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</Head>
			<Card className="text-center p-8 bg-card/80">
				<CardHeader>
					<CardTitle className="text-3xl">Find great places to work</CardTitle>
					<CardDescription>Get the inside scoop on companies with employee reviews.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="max-w-xl mx-auto">
						<div className="relative">
							<Input placeholder="Company name or keyword" className="pl-10 h-12 text-base" />
							<Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						</div>
						<Button className="mt-4 w-full h-12 text-base">Find Companies</Button>
					</div>
				</CardContent>
			</Card>

			<div>
				<h2 className="text-2xl font-bold mb-4">Featured Reviews</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{mockReviews.map((review) => (
						<Card key={review.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<Avatar className="w-12 h-12 rounded-md">
											<AvatarImage src={review.logo} />
											<AvatarFallback>{review.company.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<CardTitle>{review.company}</CardTitle>
											<p className="text-sm text-muted-foreground">{review.reviewCount} reviews</p>
										</div>
									</div>
									<Rating rating={review.rating} />
								</div>
							</CardHeader>
							<CardContent>
								<h3 className="font-semibold mb-2">{review.title}</h3>
								<p className="text-muted-foreground line-clamp-3">&quot;{review.review}&quot;</p>
								<p className="text-sm text-right mt-4">- {review.author}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
