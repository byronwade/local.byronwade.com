"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { businessCourses, achievements, learningStreak } from "./learn-data";
import { Search, Filter, Play, Clock, Star, Users, CheckCircle, Lock, Trophy, Flame, Target, BookOpen, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function CourseCard({ course }) {
	return (
		<Link href={`/learn/${course.id}`} passHref>
			<Card className="group bg-card text-card-foreground hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col rounded-lg border h-full">
				<CardHeader className="p-0 relative">
					<Image src={course.thumbnail} alt={course.title} width={600} height={400} className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105" />
					<div className="absolute top-3 right-3 flex gap-2">
						{course.bestseller && (
							<Badge variant="destructive" className="bg-red-500 text-white border-none">
								Bestseller
							</Badge>
						)}
						{course.trending && (
							<Badge variant="secondary" className="bg-blue-500 text-white border-none">
								Trending
							</Badge>
						)}
					</div>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
						<Play className="w-12 h-12 text-white/90 drop-shadow-lg transform group-hover:scale-110 transition-transform" />
					</div>
				</CardHeader>
				<CardContent className="p-4 flex-grow">
					<h3 className="text-lg font-semibold mb-1 leading-tight">{course.title}</h3>
					<p className="text-sm text-muted-foreground">{course.subtitle}</p>
					<div className="flex items-center mt-3 text-sm text-muted-foreground">
						<Star className="w-4 h-4 text-yellow-400 mr-1" />
						<span className="font-bold text-foreground mr-1">{course.rating}</span>({course.reviews} reviews)
					</div>
				</CardContent>
				<CardFooter className="p-4 pt-0 flex justify-between items-center">
					<div className="flex items-center">
						<Avatar className="w-8 h-8 mr-2">
							<AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
							<AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium">{course.instructor.name}</span>
					</div>
					<div className="text-right">
						<p className="text-xl font-bold text-primary">
							{course.currency}
							{course.price}
						</p>
						{course.originalPrice && (
							<p className="text-sm line-through text-muted-foreground">
								{course.currency}
								{course.originalPrice}
							</p>
						)}
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
}

export default function LearnPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [sortBy, setSortBy] = useState("popularity");

	const filteredCourses = businessCourses.featured.filter((course) => {
		return course.title.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedCategory === "All" || course.category === selectedCategory);
	});

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Thorbis Business Academy",
		description: "Unlock your potential with expert-led courses designed for today's competitive business landscape.",
		mainEntity: {
			"@type": "ItemList",
			name: "Featured Courses",
			itemListElement: filteredCourses.map((course, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Course",
					name: course.title,
					description: course.subtitle,
					provider: {
						"@type": "Organization",
						name: "Thorbis Business Academy",
					},
					offers: {
						"@type": "Offer",
						price: course.price,
						priceCurrency: course.currency,
					},
					aggregateRating: {
						"@type": "AggregateRating",
						ratingValue: course.rating,
						reviewCount: course.reviews,
					},
				},
			})),
		},
	};

	return (
		<div className="bg-background text-foreground min-h-screen">
			<Head>
				<title>Thorbis Business Academy | Localbyronwade</title>
				<meta name="description" content="Unlock your potential with expert-led courses designed for today's competitive business landscape." />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</Head>
			<header className="bg-card/50 border-b">
				<div className="container mx-auto px-4">
					<div className="py-16 text-center">
						<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">Thorbis Business Academy</h1>
						<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">Unlock your potential with expert-led courses designed for today&apos;s competitive business landscape.</p>
						<div className="relative max-w-2xl mx-auto">
							<Input type="search" placeholder="Search for courses..." className="w-full p-6 pl-12 rounded-full bg-background border-border" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
						</div>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					<aside className="w-full lg:w-1/4">
						<div className="sticky top-24">
							<h3 className="text-lg font-semibold mb-4">Categories</h3>
							<ul className="space-y-2">
								<li>
									<button onClick={() => setSelectedCategory("All")} className={`w-full text-left px-3 py-2 rounded-md transition-colors text-base ${selectedCategory === "All" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
										All Categories
									</button>
								</li>
								{businessCourses.categories.map((cat) => (
									<li key={cat.name}>
										<button onClick={() => setSelectedCategory(cat.name)} className={`w-full text-left px-3 py-2 rounded-md transition-colors text-base ${selectedCategory === cat.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
											<span className="mr-2">{cat.icon}</span>
											{cat.name}
										</button>
									</li>
								))}
							</ul>
						</div>
					</aside>

					<div className="flex-1">
						<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
							<h2 className="text-2xl font-bold tracking-tight">{selectedCategory === "All" ? "All Courses" : selectedCategory}</h2>
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[180px] bg-card border-border">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="popularity">Popularity</SelectItem>
									<SelectItem value="rating">Rating</SelectItem>
									<SelectItem value="newest">Newest</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">{filteredCourses.length > 0 ? filteredCourses.map((course) => <CourseCard key={course.id} course={course} />) : <p className="md:col-span-2 xl:col-span-3 text-center text-muted-foreground py-16">No courses found. Try a different search or category.</p>}</div>

						<section className="bg-card/50 border p-8 rounded-2xl">
							<h2 className="text-3xl font-bold text-center mb-6">Your Learning Journey</h2>
							<div className="grid md:grid-cols-2 gap-8 items-center">
								<div className="text-center">
									<h3 className="text-xl font-semibold mb-3">Learning Streak</h3>
									<div className="relative inline-block">
										<Flame className="w-28 h-28 text-orange-400" />
										<span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-card-foreground drop-shadow-lg">{learningStreak.current}</span>
									</div>
									<p className="text-muted-foreground mt-2 text-lg">{learningStreak.current} day streak!</p>
									<Progress value={(learningStreak.current / learningStreak.goal) * 100} className="mt-4 max-w-xs mx-auto" />
									<p className="text-sm text-muted-foreground mt-2">Goal: {learningStreak.goal} days</p>
								</div>
								<div>
									<h3 className="text-xl font-semibold mb-4">Achievements</h3>
									<div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
										{achievements.map((ach) => (
											<div key={ach.id} className="flex flex-col items-center text-center p-2 rounded-lg" title={ach.description}>
												<div className={`text-5xl mb-2 transition-opacity ${ach.unlocked ? "" : "opacity-30 grayscale"}`}>{ach.icon}</div>
												<p className={`font-semibold text-sm leading-tight ${ach.unlocked ? "text-foreground" : "text-muted-foreground"}`}>{ach.name}</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}
