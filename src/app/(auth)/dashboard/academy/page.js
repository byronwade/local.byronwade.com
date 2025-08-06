import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { BookOpen, GraduationCap, Clock, Trophy, Users, Play } from "lucide-react";

// Import courses data from shared location
import { courses } from "@data/academy/courses";

const userProgress = {
	"plumbing-beginner": 30,
	"hvac-ce": 10,
	"electrical-master": 0,
};

export const metadata = {
	title: "Academy Dashboard - Thorbis",
	description: "Manage your learning progress and access courses.",
};

export default function AcademyDashboardPage() {
	const completedCourses = Object.values(userProgress).filter((progress) => progress === 100).length;
	const inProgressCourses = Object.values(userProgress).filter((progress) => progress > 0 && progress < 100).length;
	const totalCourses = courses.length;
	const averageProgress = Object.values(userProgress).reduce((acc, curr) => acc + curr, 0) / totalCourses;

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold text-foreground">Academy Dashboard</h1>
					<p className="text-muted-foreground mt-2">Track your learning progress and access courses</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/academy/courses">
						<BookOpen className="w-4 h-4 mr-2" />
						Browse Courses
					</Link>
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
								<BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Total Courses</p>
								<p className="text-2xl font-bold">{totalCourses}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
								<GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Completed</p>
								<p className="text-2xl font-bold">{completedCourses}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
								<Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">In Progress</p>
								<p className="text-2xl font-bold">{inProgressCourses}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
								<Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Avg Progress</p>
								<p className="text-2xl font-bold">{Math.round(averageProgress)}%</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Continue Learning */}
			<div>
				<h2 className="text-2xl font-semibold mb-6">Continue Learning</h2>
				<div className="space-y-4">
					{courses.map((course) => {
						const progress = userProgress[course.id] ?? 0;
						const isStarted = progress > 0;
						const isCompleted = progress === 100;

						return (
							<Card key={course.id} className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-4">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h3 className="text-xl font-semibold">{course.title}</h3>
												<Badge variant={isCompleted ? "default" : isStarted ? "secondary" : "outline"}>{isCompleted ? "Completed" : isStarted ? "In Progress" : "Not Started"}</Badge>
											</div>
											<p className="text-muted-foreground mb-3">{course.description}</p>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<BookOpen className="w-4 h-4" />
													<span>{course.chapters.length} chapters</span>
												</div>
												<div className="flex items-center gap-1">
													<Clock className="w-4 h-4" />
													<span>{course.duration || "Self-paced"}</span>
												</div>
												<div className="flex items-center gap-1">
													<Users className="w-4 h-4" />
													<span>{course.level}</span>
												</div>
											</div>
										</div>
										<div className="min-w-[200px] ml-6">
											<div className="flex justify-between items-center mb-2">
												<span className="text-sm font-medium">Progress</span>
												<span className="text-sm text-muted-foreground">{progress}%</span>
											</div>
											<Progress value={progress} className="h-2 mb-3" />
											<Button asChild size="sm" className="w-full">
												<Link href={`/dashboard/academy/courses/${course.id}`}>
													<Play className="w-4 h-4 mr-2" />
													{isStarted ? "Continue" : "Start Course"}
												</Link>
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</div>
	);
}
