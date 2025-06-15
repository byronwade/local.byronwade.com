"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Search, MapPin, Star, TrendingUp } from "lucide-react";
import SearchBarHeader from "@components/shared/searchBox/SearchBarHeader";

export default function InitialSearch() {
	const popularSearches = ["Restaurants", "Plumbers", "Hair Salons", "Auto Repair", "Dentists", "Coffee Shops", "Gyms", "Pet Stores"];

	const featuredCategories = [
		{
			name: "Restaurants",
			count: "1,234",
			icon: "🍽️",
			href: "/categories/restaurants",
		},
		{
			name: "Home Services",
			count: "856",
			icon: "🏠",
			href: "/categories/home-services",
		},
		{
			name: "Health & Medical",
			count: "642",
			icon: "🏥",
			href: "/categories/health-medical",
		},
		{
			name: "Automotive",
			count: "423",
			icon: "🚗",
			href: "/categories/automotive",
		},
		{
			name: "Beauty & Spas",
			count: "389",
			icon: "💄",
			href: "/categories/beauty-spas",
		},
		{
			name: "Shopping",
			count: "567",
			icon: "🛍️",
			href: "/categories/shopping",
		},
	];

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Hero Section */}
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">Find Local Businesses</h1>
				<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Discover and connect with top-rated businesses in your area. Search by category, location, or business name.</p>

				{/* Search Bar */}
				<div className="max-w-2xl mx-auto mb-8">
					<SearchBarHeader />
				</div>
			</div>

			{/* Popular Searches */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
					<TrendingUp className="w-6 h-6" />
					Popular Searches
				</h2>
				<div className="flex flex-wrap gap-2">
					{popularSearches.map((search) => (
						<Link key={search} href={`/search?q=${encodeURIComponent(search)}`}>
							<Badge variant="secondary" className="text-sm py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
								{search}
							</Badge>
						</Link>
					))}
				</div>
			</div>

			{/* Featured Categories */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{featuredCategories.map((category) => (
						<Link key={category.name} href={category.href}>
							<Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 cursor-pointer">
								<CardHeader className="pb-3">
									<div className="flex items-center gap-3">
										<span className="text-2xl">{category.icon}</span>
										<div>
											<CardTitle className="text-lg">{category.name}</CardTitle>
											<p className="text-sm text-muted-foreground">{category.count} businesses</p>
										</div>
									</div>
								</CardHeader>
							</Card>
						</Link>
					))}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="text-center">
				<h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild size="lg">
						<Link href="/add-a-business">Add Your Business</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="/search/map">
							<MapPin className="w-4 h-4 mr-2" />
							View Map
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="/categories">Browse All Categories</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
