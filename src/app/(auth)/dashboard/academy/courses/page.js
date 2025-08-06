"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { BookOpen, Clock, Users, Star, Search, Filter, Play, CheckCircle } from "lucide-react";

// Import courses data from shared location
import { courses } from "@data/academy/courses";

const userProgress = {
	"plumbing-beginner": 30,
	"hvac-ce": 10,
	"electrical-master": 0,
};

export default function AcademyCoursesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterLevel, setFilterLevel] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");

	// Filter courses based on search and filters
	const filteredCourses = courses.filter((course) => {
		const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.description.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesLevel = filterLevel === "all" || course.level === filterLevel;

		const progress = userProgress[course.id] ?? 0;
		const matchesStatus = filterStatus === "all" || (filterStatus === "not-started" && progress === 0) || (filterStatus === "in-progress" && progress > 0 && progress < 100) || (filterStatus === "completed" && progress === 100);

		return matchesSearch && matchesLevel && matchesStatus;
	});

	const getCourseStatusBadge = (courseId) => {
		const progress = userProgress[courseId] ?? 0;
		if (progress === 100) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
		if (progress > 0) return <Badge variant="secondary">In Progress</Badge>;
		return <Badge variant="outline">Not Started</Badge>;
	};

	const getCourseIcon = (progress) => {
		if (progress === 100) return <CheckCircle className="w-5 h-5 text-green-600" />;
		if (progress > 0) return <Play className="w-5 h-5 text-blue-600" />;
		return <BookOpen className="w-5 h-5 text-gray-600" />;
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold text-foreground">Academy Courses</h1>
					<p className="text-muted-foreground mt-2">Explore and enroll in professional development courses</p>
				</div>
			</div>

			{/* Search and Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="w-5 h-5" />
						Search & Filter
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
							</div>
						</div>
						<Select value={filterLevel} onValueChange={setFilterLevel}>
							<SelectTrigger className="w-full md:w-48">
								<SelectValue placeholder="Filter by level" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Levels</SelectItem>
								<SelectItem value="Beginner">Beginner</SelectItem>
								<SelectItem value="Intermediate">Intermediate</SelectItem>
								<SelectItem value="Advanced">Advanced</SelectItem>
							</SelectContent>
						</Select>
						<Select value={filterStatus} onValueChange={setFilterStatus}>
							<SelectTrigger className="w-full md:w-48">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Courses</SelectItem>
								<SelectItem value="not-started">Not Started</SelectItem>
								<SelectItem value="in-progress">In Progress</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Course Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredCourses.map((course) => {
					const progress = userProgress[course.id] ?? 0;
					const isStarted = progress > 0;

					return (
						<Card key={course.id} className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
							<CardContent className="p-6">
								<div className="flex items-start justify-between mb-4">
									<div className="flex items-center gap-2">
										{getCourseIcon(progress)}
										<h3 className="font-semibold text-lg">{course.title}</h3>
									</div>
									{getCourseStatusBadge(course.id)}
								</div>

								<p className="text-muted-foreground text-sm mb-4 line-clamp-3">{course.description}</p>

								<div className="space-y-3 mb-4">
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">Progress</span>
										<span className="font-medium">{progress}%</span>
									</div>
									<Progress value={progress} className="h-2" />
								</div>

								<div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
									<div className="flex items-center gap-1">
										<BookOpen className="w-4 h-4" />
										<span>{course.chapters.length} chapters</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="w-4 h-4" />
										<span>{course.duration || "Self-paced"}</span>
									</div>
								</div>

								<div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
									<div className="flex items-center gap-1">
										<Users className="w-4 h-4" />
										<span>{course.level}</span>
									</div>
									<div className="flex items-center gap-1">
										<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
										<span>4.8 (234 reviews)</span>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="text-lg font-semibold text-green-600">${course.price}</div>
									<Button asChild size="sm">
										<Link href={`/dashboard/academy/courses/${course.id}`}>{isStarted ? "Continue" : "Start Course"}</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{filteredCourses.length === 0 && (
				<Card>
					<CardContent className="p-12 text-center">
						<BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">No courses found</h3>
						<p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
