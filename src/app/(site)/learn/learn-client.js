"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { businessCourses, achievements, learningStreak } from "./learn-data";
import { Search, Play, Star, Flame } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

// Memoized Course Card Component
const CourseCard = React.memo(({ course }) => {
	return (
		<Link href={`/learn/${course.id}`} passHref>
			<Card className="flex overflow-hidden flex-col h-full rounded-lg border transition-all duration-300 cursor-pointer group bg-card text-card-foreground hover:shadow-xl dark:hover:shadow-primary/20">
				<CardHeader className="relative p-0">
					<Image
						src={course.thumbnail}
						alt={course.title}
						width={600}
						height={400}
						className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
						priority={course.id <= 3} // Prioritize first 3 course images
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					<div className="flex absolute top-3 right-3 gap-2">
						{course.bestseller && (
							<Badge variant="destructive" className="text-white bg-red-500 border-none">
								Bestseller
							</Badge>
						)}
						{course.trending && (
							<Badge variant="secondary" className="text-white bg-blue-500 border-none">
								Trending
							</Badge>
						)}
					</div>
					<div className="flex absolute inset-0 justify-center items-center bg-gradient-to-t to-transparent opacity-0 transition-all duration-300 from-black/60 group-hover:from-black/80 group-hover:opacity-100">
						<Play className="w-12 h-12 drop-shadow-lg transition-transform transform text-white/90 group-hover:scale-110" />
					</div>
				</CardHeader>
				<CardContent className="flex-grow p-4">
					<h3 className="mb-1 text-lg font-semibold leading-tight">{course.title}</h3>
					<p className="text-sm text-muted-foreground">{course.subtitle}</p>
					<div className="flex items-center mt-3 text-sm text-muted-foreground">
						<Star className="mr-1 w-4 h-4 text-yellow-400" />
						<span className="mr-1 font-bold text-foreground">{course.rating}</span>({course.reviews} reviews)
					</div>
				</CardContent>
				<CardFooter className="flex justify-between items-center p-4 pt-0">
					<div className="flex items-center">
						<Avatar className="mr-2 w-8 h-8">
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
});

CourseCard.displayName = "CourseCard";

// Memoized Achievement Component
const Achievement = React.memo(({ achievement }) => (
	<div className="flex flex-col items-center p-2 text-center rounded-lg" title={achievement.description}>
		<div className={`text-5xl mb-2 transition-opacity ${achievement.unlocked ? "" : "opacity-30 grayscale"}`}>{achievement.icon}</div>
		<p className={`font-semibold text-sm leading-tight ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}>{achievement.name}</p>
	</div>
));

Achievement.displayName = "Achievement";

export default function LearnClient() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [sortBy, setSortBy] = useState("popularity");

	// Memoized filtered courses to prevent unnecessary recalculations
	const filteredCourses = useMemo(() => {
		return businessCourses.featured.filter((course) => {
			return course.title.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedCategory === "All" || course.category === selectedCategory);
		});
	}, [searchQuery, selectedCategory]);

	// Memoized handlers
	const handleCategoryChange = useCallback((category) => {
		setSelectedCategory(category);
	}, []);

	const handleSearchChange = useCallback((e) => {
		setSearchQuery(e.target.value);
	}, []);

	const handleSortChange = useCallback((sort) => {
		setSortBy(sort);
	}, []);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b bg-card/50">
				<div className="container px-4 mx-auto">
					<div className="py-16 text-center">
						<h1 className="mb-2 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r md:text-5xl from-primary to-secondary-foreground">Thorbis Business Academy</h1>
						<p className="mx-auto mb-6 max-w-3xl text-lg md:text-xl text-muted-foreground">Unlock your potential with expert-led courses designed for today&apos;s competitive business landscape.</p>
						<div className="relative mx-auto max-w-2xl">
							<Input type="search" placeholder="Search for courses..." className="p-6 pl-12 w-full rounded-full bg-background border-border" value={searchQuery} onChange={handleSearchChange} />
							<Search className="absolute left-4 top-1/2 w-6 h-6 -translate-y-1/2 text-muted-foreground" />
						</div>
					</div>
				</div>
			</header>

			<main className="container px-4 py-8 mx-auto">
				<div className="flex flex-col gap-8 lg:flex-row">
					<aside className="w-full lg:w-1/4">
						<div className="sticky top-24">
							<h3 className="mb-4 text-lg font-semibold">Categories</h3>
							<ul className="space-y-2">
								<li>
									<button onClick={() => handleCategoryChange("All")} className={`w-full text-left px-3 py-2 rounded-md transition-colors text-base ${selectedCategory === "All" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
										All Categories
									</button>
								</li>
								{businessCourses.categories.map((cat) => (
									<li key={cat.name}>
										<button onClick={() => handleCategoryChange(cat.name)} className={`w-full text-left px-3 py-2 rounded-md transition-colors text-base ${selectedCategory === cat.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
											<span className="mr-2">{cat.icon}</span>
											{cat.name}
										</button>
									</li>
								))}
							</ul>
						</div>
					</aside>

					<div className="flex-1">
						<div className="flex flex-wrap gap-4 justify-between items-center mb-6">
							<h2 className="text-2xl font-bold tracking-tight">{selectedCategory === "All" ? "All Courses" : selectedCategory}</h2>
							<Select value={sortBy} onValueChange={handleSortChange}>
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

						<div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 xl:grid-cols-3">{filteredCourses.length > 0 ? filteredCourses.map((course) => <CourseCard key={course.id} course={course} />) : <p className="py-16 text-center md:col-span-2 xl:col-span-3 text-muted-foreground">No courses found. Try a different search or category.</p>}</div>

						<section className="p-8 rounded-2xl border bg-card/50">
							<h2 className="mb-6 text-3xl font-bold text-center">Your Learning Journey</h2>
							<div className="grid gap-8 items-center md:grid-cols-2">
								<div className="text-center">
									<h3 className="mb-3 text-xl font-semibold">Learning Streak</h3>
									<div className="inline-block relative">
										<Flame className="w-28 h-28 text-orange-400" />
										<span className="flex absolute inset-0 justify-center items-center text-4xl font-bold drop-shadow-lg text-card-foreground">{learningStreak.current}</span>
									</div>
									<p className="mt-2 text-lg text-muted-foreground">{learningStreak.current} day streak!</p>
									<Progress value={(learningStreak.current / learningStreak.goal) * 100} className="mx-auto mt-4 max-w-xs" />
									<p className="mt-2 text-sm text-muted-foreground">Goal: {learningStreak.goal} days</p>
								</div>
								<div>
									<h3 className="mb-4 text-xl font-semibold">Achievements</h3>
									<div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
										{achievements.map((ach) => (
											<Achievement key={ach.id} achievement={ach} />
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
