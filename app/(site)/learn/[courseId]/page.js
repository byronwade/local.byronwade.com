import { businessCourses } from "../learn-data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, CheckCircle, BookOpen, Trophy, ShoppingCart, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
	const course = businessCourses.featured.find((c) => c.id === params.courseId);
	if (!course) {
		return {
			title: "Course Not Found",
		};
	}
	return {
		title: course.title,
		description: course.subtitle,
	};
}

export default function CourseDetailPage({ params }) {
	const course = businessCourses.featured.find((c) => c.id === params.courseId);

	if (!course) {
		notFound();
	}

	const jsonLd = {
		"@context": "https://schema.org",
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
		coursePrerequisites: course.requirements,
		teaches: course.whatYouLearn,
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="container mx-auto px-4 py-8 lg:px-24">
					<div className="mb-6">
						<Button asChild variant="outline">
							<Link href="/learn">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to All Courses
							</Link>
						</Button>
					</div>
					<div className="grid lg:grid-cols-3 gap-8">
						{/* Left Column (Main Content) */}
						<div className="lg:col-span-2">
							<div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
								<Image src={course.thumbnail} alt={course.title} layout="fill" className="object-cover" />
							</div>
							<Badge variant="secondary" className="mb-2">
								{course.category}
							</Badge>
							<h1 className="text-4xl font-extrabold tracking-tight mb-2">{course.title}</h1>
							<p className="text-xl text-muted-foreground mb-6">{course.subtitle}</p>

							<div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
								<div className="flex items-center gap-2">
									<Clock className="w-5 h-5" />
									<span>{course.duration}</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="w-5 h-5" />
									<span>{course.students.toLocaleString()} students</span>
								</div>
								<div className="flex items-center gap-2">
									<Star className="w-5 h-5 text-yellow-400" />
									<span className="font-bold text-foreground">{course.rating}</span>
									<span>({course.reviews.toLocaleString()} reviews)</span>
								</div>
							</div>

							<div className="prose prose-lg dark:prose-invert max-w-none">
								<h2 className="text-2xl font-bold mb-4">What you&apos;ll learn</h2>
								<ul className="space-y-3 mb-8">
									{course.whatYouLearn.map((item, index) => (
										<li key={index} className="flex items-start">
											<CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
											<span>{item}</span>
										</li>
									))}
								</ul>

								<h2 className="text-2xl font-bold mb-4">Requirements</h2>
								<ul className="list-disc pl-5 space-y-2">
									{course.requirements.map((item, index) => (
										<li key={index}>{item}</li>
									))}
								</ul>
							</div>
						</div>

						{/* Right Column (Sidebar) */}
						<div className="lg:col-span-1">
							<div className="sticky top-24 bg-card border rounded-lg p-6">
								<div className="text-3xl font-bold text-primary mb-2">
									{course.currency}
									{course.price}
									{course.originalPrice && (
										<span className="text-xl line-through text-muted-foreground ml-2">
											{course.currency}
											{course.originalPrice}
										</span>
									)}
								</div>

								<Button size="lg" className="w-full mt-4 mb-2">
									<ShoppingCart className="mr-2 h-5 w-5" /> Enroll Now
								</Button>
								<p className="text-xs text-muted-foreground text-center mb-6">30-Day Money-Back Guarantee</p>

								<div className="space-y-3 text-sm border-t pt-6">
									<h4 className="font-bold text-foreground mb-2 text-base">This course includes:</h4>
									<p className="flex items-center gap-3">
										<Clock className="w-4 h-4 text-muted-foreground" /> {course.duration} on-demand video
									</p>
									<p className="flex items-center gap-3">
										<BookOpen className="w-4 h-4 text-muted-foreground" /> {course.lessons} lessons
									</p>
									<p className="flex items-center gap-3">
										<Trophy className="w-4 h-4 text-muted-foreground" /> Certificate of completion
									</p>
								</div>

								<div className="border-t mt-6 pt-6">
									<h4 className="font-bold text-foreground mb-4 text-base">Instructor</h4>
									<div className="flex items-center gap-3">
										<Avatar className="w-12 h-12">
											<AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
											<AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-semibold text-foreground">{course.instructor.name}</p>
											<p className="text-sm text-muted-foreground">{course.instructor.title}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
