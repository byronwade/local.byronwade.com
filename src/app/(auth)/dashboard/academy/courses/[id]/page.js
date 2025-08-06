"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Separator } from "@components/ui/separator";
import { BookOpen, Clock, Users, Star, Play, CheckCircle, ArrowLeft, Award, Target, FileText, Video, Download } from "lucide-react";

// Import courses data from shared location
import { courses } from "@data/academy/courses";

const userProgress = {
	"plumbing-beginner": 30,
	"hvac-ce": 10,
	"electrical-master": 0,
};

export default function CourseDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [course, setCourse] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (params.id) {
			const foundCourse = courses.find((c) => c.id === params.id);
			if (foundCourse) {
				setCourse(foundCourse);
			} else {
				router.push("/dashboard/academy/courses");
			}
			setLoading(false);
		}
	}, [params.id, router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!course) {
		return (
			<div className="text-center py-12">
				<h2 className="text-2xl font-semibold mb-4">Course not found</h2>
				<Button asChild>
					<Link href="/dashboard/academy/courses">Back to Courses</Link>
				</Button>
			</div>
		);
	}

	const progress = userProgress[course.id] ?? 0;
	const isStarted = progress > 0;
	const isCompleted = progress === 100;

	const completedChapters = Math.floor((progress / 100) * course.chapters.length);

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/dashboard/academy/courses">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Courses
					</Link>
				</Button>
			</div>

			{/* Course Header */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<Card>
						<CardContent className="p-8">
							<div className="flex items-start justify-between mb-6">
								<div className="flex-1">
									<h1 className="text-3xl font-bold mb-3">{course.title}</h1>
									<p className="text-muted-foreground text-lg mb-4">{course.description}</p>
									<div className="flex items-center gap-4 mb-4">
										<Badge variant={isCompleted ? "default" : isStarted ? "secondary" : "outline"}>{isCompleted ? "Completed" : isStarted ? "In Progress" : "Not Started"}</Badge>
										<div className="flex items-center gap-1 text-sm text-muted-foreground">
											<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
											<span>4.8 (234 reviews)</span>
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-3xl font-bold text-green-600 mb-2">${course.price}</div>
									<Button size="lg" className="w-full">
										<Play className="w-4 h-4 mr-2" />
										{isStarted ? "Continue Learning" : "Start Course"}
									</Button>
								</div>
							</div>

							{/* Progress */}
							<div className="mb-6">
								<div className="flex justify-between items-center mb-2">
									<span className="font-medium">Course Progress</span>
									<span className="text-sm text-muted-foreground">{progress}% complete</span>
								</div>
								<Progress value={progress} className="h-3" />
								<p className="text-sm text-muted-foreground mt-2">
									{completedChapters} of {course.chapters.length} chapters completed
								</p>
							</div>

							{/* Course Stats */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="text-center p-4 bg-muted rounded-lg">
									<BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
									<div className="font-semibold">{course.chapters.length}</div>
									<div className="text-sm text-muted-foreground">Chapters</div>
								</div>
								<div className="text-center p-4 bg-muted rounded-lg">
									<Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
									<div className="font-semibold">{course.duration || "Self-paced"}</div>
									<div className="text-sm text-muted-foreground">Duration</div>
								</div>
								<div className="text-center p-4 bg-muted rounded-lg">
									<Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
									<div className="font-semibold">{course.level}</div>
									<div className="text-sm text-muted-foreground">Level</div>
								</div>
								<div className="text-center p-4 bg-muted rounded-lg">
									<Award className="w-6 h-6 mx-auto mb-2 text-orange-600" />
									<div className="font-semibold">Certificate</div>
									<div className="text-sm text-muted-foreground">Included</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Target className="w-5 h-5" />
								Learning Objectives
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								{course.learningObjectives?.map((objective, index) => (
									<li key={index} className="flex items-start gap-2 text-sm">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<span>{objective}</span>
									</li>
								)) || (
									<>
										<li className="flex items-start gap-2 text-sm">
											<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
											<span>Master fundamental concepts and techniques</span>
										</li>
										<li className="flex items-start gap-2 text-sm">
											<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
											<span>Apply knowledge in real-world scenarios</span>
										</li>
										<li className="flex items-start gap-2 text-sm">
											<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
											<span>Prepare for certification exams</span>
										</li>
									</>
								)}
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Download className="w-5 h-5" />
								Course Materials
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center gap-3 p-3 border rounded-lg">
									<FileText className="w-5 h-5 text-blue-600" />
									<div className="flex-1">
										<div className="font-medium text-sm">Course Handbook</div>
										<div className="text-xs text-muted-foreground">PDF - 2.5 MB</div>
									</div>
									<Button size="sm" variant="outline">
										Download
									</Button>
								</div>
								<div className="flex items-center gap-3 p-3 border rounded-lg">
									<Video className="w-5 h-5 text-red-600" />
									<div className="flex-1">
										<div className="font-medium text-sm">Video Lectures</div>
										<div className="text-xs text-muted-foreground">12 hours of content</div>
									</div>
									<Button size="sm" variant="outline">
										Access
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Course Content Tabs */}
			<Tabs defaultValue="curriculum" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="curriculum">Curriculum</TabsTrigger>
					<TabsTrigger value="instructor">Instructor</TabsTrigger>
					<TabsTrigger value="reviews">Reviews</TabsTrigger>
				</TabsList>

				<TabsContent value="curriculum" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Course Curriculum</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{course.chapters.map((chapter, index) => {
									const isChapterCompleted = index < completedChapters;
									const isCurrentChapter = index === completedChapters && !isCompleted;

									return (
										<div key={index} className={`p-4 border rounded-lg ${isCurrentChapter ? "border-primary bg-primary/5" : ""}`}>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													{isChapterCompleted ? <CheckCircle className="w-5 h-5 text-green-600" /> : isCurrentChapter ? <Play className="w-5 h-5 text-primary" /> : <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />}
													<div>
														<h4 className="font-medium">
															Chapter {index + 1}: {chapter.title}
														</h4>
														<p className="text-sm text-muted-foreground">{chapter.description}</p>
													</div>
												</div>
												<div className="text-sm text-muted-foreground">{chapter.duration || "30 min"}</div>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="instructor" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Meet Your Instructor</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-start gap-4">
								<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
									<Users className="w-8 h-8 text-muted-foreground" />
								</div>
								<div className="flex-1">
									<h4 className="font-semibold text-lg">John Smith</h4>
									<p className="text-muted-foreground mb-3">Master Plumber & Industry Expert</p>
									<p className="text-sm leading-relaxed">With over 20 years of experience in the plumbing industry, John has worked on everything from residential repairs to large commercial installations. He holds multiple certifications and has trained hundreds of apprentices throughout his career.</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="reviews" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Student Reviews</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{[1, 2, 3].map((review) => (
									<div key={review} className="border-b last:border-b-0 pb-4 last:pb-0">
										<div className="flex items-center gap-2 mb-2">
											<div className="flex items-center gap-1">
												{[1, 2, 3, 4, 5].map((star) => (
													<Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
												))}
											</div>
											<span className="font-medium">Sarah Johnson</span>
											<span className="text-sm text-muted-foreground">2 weeks ago</span>
										</div>
										<p className="text-sm">"Excellent course! The instructor explains everything clearly and the hands-on examples really helped me understand the concepts."</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
