"use client";
import { useState, useEffect } from "react";
import { Search, Filter, Play, Clock, Star, TrendingUp, BookOpen, Lightbulb, Calendar, Users, Award, Video, DollarSign, Trophy, Flame, Crown, Zap, Target, CheckCircle, Lock, ChevronRight, Heart, Bookmark, Share2, ShoppingCart, CreditCard, Gift, Percent, Globe, Badge as BadgeIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

// Business courses data with pricing and gamification
const businessCourses = {
	featured: [
		{
			id: "1",
			title: "Complete Digital Marketing Mastery",
			subtitle: "From Zero to Marketing Hero in 8 Weeks",
			description: "Master Facebook Ads, Google Ads, SEO, Content Marketing, and Social Media Strategy. Build campaigns that actually convert.",
			thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
			instructor: {
				name: "Sarah Johnson",
				avatar: "https://images.unsplash.com/photo-1494790108755-2616c5e41e9f?w=80&h=80&fit=crop&crop=face",
				title: "Digital Marketing Director",
				company: "Springfield Marketing Agency",
				rating: 4.9,
				students: 2847,
				courses: 12,
			},
			price: 299,
			originalPrice: 499,
			currency: "$",
			discount: 40,
			level: "Beginner to Advanced",
			duration: "12 hours",
			lessons: 48,
			projects: 8,
			certificate: true,
			language: "English",
			category: "Marketing",
			subcategory: "Digital Marketing",
			rating: 4.8,
			reviews: 1247,
			students: 8942,
			lastUpdated: "December 2024",
			bestseller: true,
			featured: true,
			trending: false,
			skills: ["Facebook Ads", "Google Ads", "SEO", "Content Marketing", "Analytics"],
			learningPath: [
				{ title: "Marketing Fundamentals", lessons: 8, completed: 0, locked: false },
				{ title: "Social Media Strategy", lessons: 12, completed: 0, locked: true },
				{ title: "Paid Advertising", lessons: 16, completed: 0, locked: true },
				{ title: "Analytics & Optimization", lessons: 12, completed: 0, locked: true },
			],
			preview: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
			whatYouLearn: ["Create profitable Facebook and Instagram ad campaigns", "Master Google Ads and Google Analytics", "Build an SEO strategy that ranks on page 1", "Develop content that converts visitors to customers", "Set up automated email marketing funnels"],
			requirements: ["Basic computer skills", "Access to a computer with internet", "Willingness to learn and practice"],
		},
		{
			id: "2",
			title: "Restaurant Management Excellence",
			subtitle: "Run a Profitable Restaurant Like a Pro",
			description: "Learn inventory management, staff training, customer service, and profit optimization from a 20-year industry veteran.",
			thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
			instructor: {
				name: "Chef Marcus Rodriguez",
				avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
				title: "Restaurant Owner & Consultant",
				company: "Rodriguez Hospitality Group",
				rating: 4.9,
				students: 1523,
				courses: 6,
			},
			price: 199,
			originalPrice: 349,
			currency: "$",
			discount: 43,
			level: "Intermediate",
			duration: "8 hours",
			lessons: 32,
			projects: 5,
			certificate: true,
			language: "English",
			category: "Business",
			subcategory: "Restaurant Management",
			rating: 4.9,
			reviews: 892,
			students: 3456,
			lastUpdated: "November 2024",
			bestseller: false,
			featured: true,
			trending: true,
			skills: ["Inventory Management", "Staff Training", "Cost Control", "Customer Service", "Operations"],
			learningPath: [
				{ title: "Restaurant Basics", lessons: 6, completed: 0, locked: false },
				{ title: "Operations Management", lessons: 10, completed: 0, locked: true },
				{ title: "Financial Control", lessons: 8, completed: 0, locked: true },
				{ title: "Growth Strategies", lessons: 8, completed: 0, locked: true },
			],
			preview: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
			whatYouLearn: ["Optimize inventory and reduce food waste by 30%", "Train staff to deliver exceptional customer service", "Calculate food costs and pricing strategies", "Implement systems for consistent operations", "Scale your restaurant business profitably"],
			requirements: ["Experience in food service (helpful but not required)", "Basic math skills", "Commitment to implementing what you learn"],
		},
		{
			id: "3",
			title: "Home Services Business Blueprint",
			subtitle: "Build a 6-Figure Service Business",
			description: "From plumbing to landscaping - learn how to start, grow, and scale any home services business with proven systems.",
			thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
			instructor: {
				name: "Mike Thompson",
				avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
				title: "Business Coach",
				company: "ServicePro Consulting",
				rating: 4.8,
				students: 4521,
				courses: 15,
			},
			price: 249,
			originalPrice: 399,
			currency: "$",
			discount: 38,
			level: "Beginner",
			duration: "10 hours",
			lessons: 40,
			projects: 6,
			certificate: true,
			language: "English",
			category: "Business",
			subcategory: "Home Services",
			rating: 4.7,
			reviews: 1856,
			students: 6789,
			lastUpdated: "December 2024",
			bestseller: true,
			featured: true,
			trending: false,
			skills: ["Business Planning", "Customer Acquisition", "Pricing Strategy", "Operations", "Scaling"],
			learningPath: [
				{ title: "Business Foundation", lessons: 8, completed: 0, locked: false },
				{ title: "Marketing & Sales", lessons: 12, completed: 0, locked: true },
				{ title: "Operations & Systems", lessons: 10, completed: 0, locked: true },
				{ title: "Growth & Scaling", lessons: 10, completed: 0, locked: true },
			],
			preview: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_3mb.mp4",
			whatYouLearn: ["Start your home services business from scratch", "Generate leads and convert them to paying customers", "Price your services for maximum profitability", "Build systems that run without you", "Scale to multiple crews and locations"],
			requirements: ["Desire to start or grow a service business", "Basic business understanding", "Willingness to take action"],
		},
	],
	categories: [
		{
			name: "Marketing",
			icon: "📈",
			courses: 24,
			description: "Digital marketing, social media, advertising",
		},
		{
			name: "Business",
			icon: "💼",
			courses: 18,
			description: "Management, operations, strategy",
		},
		{
			name: "Technology",
			icon: "💻",
			courses: 15,
			description: "Web development, software, automation",
		},
		{
			name: "Finance",
			icon: "💰",
			courses: 12,
			description: "Accounting, investing, financial planning",
		},
		{
			name: "Health & Wellness",
			icon: "🏥",
			courses: 9,
			description: "Fitness, nutrition, mental health",
		},
		{
			name: "Real Estate",
			icon: "🏠",
			courses: 8,
			description: "Property management, investing, sales",
		},
	],
	trending: [
		{
			id: "4",
			title: "AI Tools for Small Business",
			price: 149,
			originalPrice: 249,
			rating: 4.6,
			students: 1234,
			instructor: "Dr. Alex Kim",
			thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
			category: "Technology",
			trending: true,
		},
		{
			id: "5",
			title: "Personal Fitness Coaching Certification",
			price: 199,
			originalPrice: 299,
			rating: 4.8,
			students: 2156,
			instructor: "Jessica Williams",
			thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
			category: "Health & Wellness",
			trending: true,
		},
	],
};

// Gamification elements
const achievements = [
	{ id: 1, name: "First Purchase", icon: "🎯", description: "Complete your first course purchase", unlocked: false },
	{ id: 2, name: "Quick Learner", icon: "⚡", description: "Complete 5 lessons in one day", unlocked: false },
	{ id: 3, name: "Course Completer", icon: "🏆", description: "Finish your first course", unlocked: false },
	{ id: 4, name: "Knowledge Seeker", icon: "📚", description: "Enroll in 3 different courses", unlocked: false },
	{ id: 5, name: "Master Student", icon: "👑", description: "Complete 5 courses", unlocked: false },
];

const learningStreak = {
	current: 7,
	longest: 15,
	goal: 30,
};

export default function LearnPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [priceFilter, setPriceFilter] = useState("all");
	const [levelFilter, setLevelFilter] = useState("all");
	const [sortBy, setSortBy] = useState("popularity");
	const [showFilters, setShowFilters] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [showCourseDetail, setShowCourseDetail] = useState(false);

	const CourseCard = ({ course, size = "normal" }) => (
		<Card
			className={`group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${size === "large" ? "lg:col-span-2" : ""}`}
			onClick={() => {
				setSelectedCourse(course);
				setShowCourseDetail(true);
			}}
		>
			{/* Course Image */}
			<div className="relative overflow-hidden">
				<Image src={course.thumbnail} alt={course.title} width={600} height={400} className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${size === "large" ? "h-64" : "h-48"}`} />
				<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

				{/* Badges */}
				<div className="absolute top-3 left-3 flex flex-wrap gap-2">
					{course.bestseller && (
						<Badge className="bg-orange-500 text-white font-bold">
							<Trophy className="w-3 h-3 mr-1" />
							Bestseller
						</Badge>
					)}
					{course.trending && (
						<Badge className="bg-red-500 text-white font-bold">
							<Flame className="w-3 h-3 mr-1" />
							Trending
						</Badge>
					)}
					{course.featured && (
						<Badge className="bg-purple-600 text-white font-bold">
							<Crown className="w-3 h-3 mr-1" />
							Featured
						</Badge>
					)}
				</div>

				{/* Discount Badge */}
				{course.discount && (
					<div className="absolute top-3 right-3">
						<Badge className="bg-green-600 text-white font-bold text-lg px-3 py-1">{course.discount}% OFF</Badge>
					</div>
				)}

				{/* Play Button Overlay */}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
						<Play className="w-8 h-8 text-gray-900 ml-1" />
					</div>
				</div>

				{/* Duration */}
				<div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">{course.duration}</div>
			</div>

			{/* Course Content */}
			<CardContent className="p-6">
				{/* Category */}
				<div className="flex items-center justify-between mb-3">
					<Badge variant="secondary" className="text-xs">
						{course.category}
					</Badge>
					<div className="flex items-center gap-1">
						<Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
						<Bookmark className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
					</div>
				</div>

				{/* Title */}
				<h3 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 ${size === "large" ? "text-xl" : "text-lg"}`}>{course.title}</h3>

				{/* Subtitle */}
				{course.subtitle && <p className="text-sm text-gray-600 mb-3 line-clamp-1">{course.subtitle}</p>}

				{/* Description */}
				<p className={`text-gray-600 mb-4 ${size === "large" ? "line-clamp-3" : "line-clamp-2"}`}>{course.description}</p>

				{/* Instructor */}
				<div className="flex items-center gap-3 mb-4">
					<Avatar className="w-8 h-8">
						<AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
						<AvatarFallback>
							{course.instructor.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="text-sm font-medium text-gray-900">{course.instructor.name}</div>
						<div className="text-xs text-gray-500">{course.instructor.title}</div>
					</div>
				</div>

				{/* Rating and Stats */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1">
							<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
							<span className="text-sm font-medium">{course.rating}</span>
						</div>
						<span className="text-sm text-gray-500">({course.reviews.toLocaleString()})</span>
					</div>
					<div className="text-sm text-gray-500">{course.students.toLocaleString()} students</div>
				</div>

				{/* Course Info */}
				<div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
					<div className="flex items-center gap-1">
						<BookOpen className="w-3 h-3" />
						{course.lessons} lessons
					</div>
					<div className="flex items-center gap-1">
						<Clock className="w-3 h-3" />
						{course.duration}
					</div>
					<div className="flex items-center gap-1">
						<Award className="w-3 h-3" />
						{course.level}
					</div>
				</div>

				{/* Price and CTA */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-2xl font-bold text-gray-900">
							{course.currency}
							{course.price}
						</span>
						{course.originalPrice && (
							<span className="text-lg text-gray-500 line-through">
								{course.currency}
								{course.originalPrice}
							</span>
						)}
					</div>
					<Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
						<ShoppingCart className="w-4 h-4 mr-2" />
						Enroll Now
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	const CourseDetailModal = ({ course, onClose }) => {
		if (!course) return null;

		return (
			<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
				<div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
					{/* Header */}
					<div className="relative">
						<Image src={course.thumbnail} alt={course.title} width={800} height={400} className="w-full h-64 object-cover" />
						<div className="absolute inset-0 bg-black/40" />
						<Button variant="ghost" size="sm" onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20">
							✕
						</Button>

						{/* Course Title Overlay */}
						<div className="absolute bottom-6 left-6 text-white">
							<h1 className="text-3xl font-bold mb-2">{course.title}</h1>
							<p className="text-xl opacity-90">{course.subtitle}</p>
						</div>
					</div>

					<div className="p-8">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Main Content */}
							<div className="lg:col-span-2 space-y-8">
								{/* Description */}
								<div>
									<h2 className="text-2xl font-bold mb-4">Course Description</h2>
									<p className="text-gray-700 text-lg leading-relaxed">{course.description}</p>
								</div>

								{/* What You'll Learn */}
								<div>
									<h2 className="text-2xl font-bold mb-4">What You&apos;ll Learn</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{course.whatYouLearn.map((item, index) => (
											<div key={index} className="flex items-start gap-3">
												<CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
												<span className="text-gray-700">{item}</span>
											</div>
										))}
									</div>
								</div>

								{/* Course Content */}
								<div>
									<h2 className="text-2xl font-bold mb-4">Course Content</h2>
									<div className="space-y-3">
										{course.learningPath.map((section, index) => (
											<div key={index} className="border rounded-lg p-4">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">{section.locked ? <Lock className="w-4 h-4 text-gray-400" /> : <span className="text-sm font-bold text-purple-600">{index + 1}</span>}</div>
														<div>
															<h3 className="font-semibold">{section.title}</h3>
															<p className="text-sm text-gray-500">{section.lessons} lessons</p>
														</div>
													</div>
													<ChevronRight className="w-5 h-5 text-gray-400" />
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Requirements */}
								<div>
									<h2 className="text-2xl font-bold mb-4">Requirements</h2>
									<ul className="space-y-2">
										{course.requirements.map((req, index) => (
											<li key={index} className="flex items-start gap-3">
												<div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
												<span className="text-gray-700">{req}</span>
											</li>
										))}
									</ul>
								</div>

								{/* Instructor */}
								<div>
									<h2 className="text-2xl font-bold mb-4">Your Instructor</h2>
									<div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
										<Avatar className="w-16 h-16">
											<AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
											<AvatarFallback>
												{course.instructor.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<h3 className="text-xl font-bold">{course.instructor.name}</h3>
											<p className="text-gray-600 mb-2">{course.instructor.title}</p>
											<p className="text-gray-600 mb-3">{course.instructor.company}</p>
											<div className="flex items-center gap-4 text-sm text-gray-500">
												<div className="flex items-center gap-1">
													<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
													<span>{course.instructor.rating} rating</span>
												</div>
												<span>{course.instructor.students.toLocaleString()} students</span>
												<span>{course.instructor.courses} courses</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Sidebar */}
							<div className="space-y-6">
								{/* Price Card */}
								<Card className="sticky top-4">
									<CardContent className="p-6">
										<div className="text-center mb-6">
											<div className="flex items-center justify-center gap-3 mb-2">
												<span className="text-3xl font-bold">
													{course.currency}
													{course.price}
												</span>
												{course.originalPrice && (
													<span className="text-xl text-gray-500 line-through">
														{course.currency}
														{course.originalPrice}
													</span>
												)}
											</div>
											{course.discount && <Badge className="bg-green-600 text-white">Save {course.discount}% today!</Badge>}
										</div>

										<div className="space-y-3 mb-6">
											<Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3">
												<CreditCard className="w-4 h-4 mr-2" />
												Buy Now
											</Button>
											<Button variant="outline" className="w-full">
												<ShoppingCart className="w-4 h-4 mr-2" />
												Add to Cart
											</Button>
											<Button variant="ghost" className="w-full">
												<Gift className="w-4 h-4 mr-2" />
												Gift This Course
											</Button>
										</div>

										{/* Course Features */}
										<div className="space-y-3 text-sm">
											<div className="flex items-center gap-3">
												<Clock className="w-4 h-4 text-gray-500" />
												<span>{course.duration} on-demand video</span>
											</div>
											<div className="flex items-center gap-3">
												<BookOpen className="w-4 h-4 text-gray-500" />
												<span>{course.lessons} lessons</span>
											</div>
											<div className="flex items-center gap-3">
												<Target className="w-4 h-4 text-gray-500" />
												<span>{course.projects} hands-on projects</span>
											</div>
											{course.certificate && (
												<div className="flex items-center gap-3">
													<Award className="w-4 h-4 text-gray-500" />
													<span>Certificate of completion</span>
												</div>
											)}
											<div className="flex items-center gap-3">
												<Globe className="w-4 h-4 text-gray-500" />
												<span>Lifetime access</span>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Skills */}
								<Card>
									<CardHeader>
										<CardTitle>Skills You&apos;ll Gain</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-2">
											{course.skills.map((skill, index) => (
												<Badge key={index} variant="secondary">
													{skill}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section - Duolingo/Brilliant inspired */}
			<div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
				<div className="container mx-auto px-4 py-16">
					<div className="max-w-6xl mx-auto">
						{/* Learning Streak - Duolingo style */}
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-4">
								<div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
									<Flame className="w-8 h-8 text-orange-400" />
								</div>
								<div>
									<div className="text-2xl font-bold">{learningStreak.current} Day Streak!</div>
									<div className="text-white/80">Keep learning to maintain your streak</div>
								</div>
							</div>
							<div className="hidden md:flex items-center gap-6">
								{achievements.slice(0, 3).map((achievement) => (
									<div key={achievement.id} className={`text-center ${achievement.unlocked ? "opacity-100" : "opacity-50"}`}>
										<div className="text-2xl mb-1">{achievement.icon}</div>
										<div className="text-xs">{achievement.name}</div>
									</div>
								))}
							</div>
						</div>

						<div className="text-center mb-12">
							<h1 className="text-5xl md:text-6xl font-bold mb-4">
								Learn by <span className="text-yellow-400">doing</span>
							</h1>
							<p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
								Master new skills with interactive courses from local business experts.
								<span className="font-semibold"> Build real projects, earn certificates, and advance your career.</span>
							</p>

							{/* Search Bar */}
							<div className="max-w-2xl mx-auto">
								<div className="relative">
									<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input type="text" placeholder="What do you want to learn today?" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg" />
									<Button className="absolute right-2 top-2 bg-purple-600 hover:bg-purple-700">Search</Button>
								</div>
							</div>
						</div>

						{/* Quick Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							{[
								{ value: "10,000+", label: "Active Students", icon: Users },
								{ value: "150+", label: "Expert Instructors", icon: Award },
								{ value: "50+", label: "Business Courses", icon: BookOpen },
								{ value: "95%", label: "Completion Rate", icon: Target },
							].map((stat, index) => (
								<div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
									<stat.icon className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
									<div className="text-2xl font-bold">{stat.value}</div>
									<div className="text-sm text-white/80">{stat.label}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Categories - Udemy style */}
			<div className="container mx-auto px-4 py-12">
				<h2 className="text-3xl font-bold text-center mb-8">Browse by Category</h2>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
					{businessCourses.categories.map((category, index) => (
						<Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
							<CardContent className="p-6 text-center">
								<div className="text-4xl mb-3">{category.icon}</div>
								<h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors">{category.name}</h3>
								<p className="text-sm text-gray-600 mb-2">{category.description}</p>
								<Badge variant="secondary">{category.courses} courses</Badge>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Featured Courses */}
				<div className="mb-16">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-3xl font-bold">Featured Courses</h2>
						<Button variant="outline">View All Courses</Button>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
						{businessCourses.featured.map((course, index) => (
							<CourseCard key={course.id} course={course} size={index === 0 ? "large" : "normal"} />
						))}
					</div>
				</div>

				{/* Trending Courses */}
				<div className="mb-16">
					<div className="flex items-center gap-3 mb-8">
						<Flame className="w-8 h-8 text-orange-500" />
						<h2 className="text-3xl font-bold">Trending This Week</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{businessCourses.trending.map((course) => (
							<Card key={course.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
								<div className="flex">
									<Image src={course.thumbnail} alt={course.title} width={200} height={150} className="w-48 h-36 object-cover" />
									<CardContent className="flex-1 p-6">
										<Badge className="bg-red-500 text-white mb-3">
											<Flame className="w-3 h-3 mr-1" />
											Trending
										</Badge>
										<h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">{course.title}</h3>
										<p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
												<span className="text-sm font-medium">{course.rating}</span>
												<span className="text-sm text-gray-500">({course.students})</span>
											</div>
											<div className="text-right">
												<div className="text-xl font-bold">${course.price}</div>
												{course.originalPrice && <div className="text-sm text-gray-500 line-through">${course.originalPrice}</div>}
											</div>
										</div>
									</CardContent>
								</div>
							</Card>
						))}
					</div>
				</div>

				{/* Call to Action */}
				<div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-12">
					<Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
					<h2 className="text-4xl font-bold mb-4">Become a Course Creator</h2>
					<p className="text-xl mb-8 max-w-2xl mx-auto">Share your expertise and earn money by creating courses for your clients and other businesses.</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
							<Video className="w-5 h-5 mr-2" />
							Start Teaching
						</Button>
						<Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
							<BookOpen className="w-5 h-5 mr-2" />
							Learn More
						</Button>
					</div>
				</div>
			</div>

			{/* Course Detail Modal */}
			{showCourseDetail && <CourseDetailModal course={selectedCourse} onClose={() => setShowCourseDetail(false)} />}
		</div>
	);
}
