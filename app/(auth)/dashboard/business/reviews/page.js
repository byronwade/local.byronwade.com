"use client";

import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Progress } from "@components/ui/progress";
import { Separator } from "@components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import {
	Star,
	Filter,
	Search,
	Plus,
	Edit,
	Trash2,
	Reply,
	Flag,
	ThumbsUp,
	ThumbsDown,
	MessageSquare,
	Calendar,
	User,
	CheckCircle,
	Clock,
	AlertCircle,
	MoreHorizontal,
	SortAsc,
	SortDesc,
	Download,
	Share2,
	Bookmark,
	Heart,
	Eye,
	EyeOff,
	Settings,
	BarChart3,
	TrendingUp,
	TrendingDown,
	Target,
	Award,
	Shield,
	Zap,
	Users,
	MapPin,
	Phone,
	Mail,
	Globe,
	Building,
	Clock as ClockIcon,
	Calendar as CalendarIcon,
	MessageCircle,
	ThumbsUp as ThumbsUpIcon,
	ThumbsDown as ThumbsDownIcon,
	Flag as FlagIcon,
	Reply as ReplyIcon,
	Edit as EditIcon,
	Trash2 as Trash2Icon,
	MoreHorizontal as MoreHorizontalIcon,
	Search as SearchIcon,
	Filter as FilterIcon,
	SortAsc as SortAscIcon,
	SortDesc as SortDescIcon,
	Download as DownloadIcon,
	Share2 as Share2Icon,
	Bookmark as BookmarkIcon,
	Heart as HeartIcon,
	Eye as EyeIcon,
	EyeOff as EyeOffIcon,
	Settings as SettingsIcon,
	BarChart3 as BarChart3Icon,
	TrendingUp as TrendingUpIcon,
	TrendingDown as TrendingDownIcon,
	Target as TargetIcon,
	Award as AwardIcon,
	Shield as ShieldIcon,
	Zap as ZapIcon,
	Users as UsersIcon,
	MapPin as MapPinIcon,
	Phone as PhoneIcon,
	Mail as MailIcon,
	Globe as GlobeIcon,
	Building as BuildingIcon,
	X,
} from "lucide-react";
import { toast } from "@components/ui/use-toast";

export default function BusinessReviews() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filterRating, setFilterRating] = useState("all");
	const [sortBy, setSortBy] = useState("newest");
	const [showReplies, setShowReplies] = useState({});

	// Mock reviews data
	const [reviews, setReviews] = useState([
		{
			id: 1,
			customerName: "Sarah Johnson",
			customerEmail: "sarah.j@email.com",
			customerPhone: "(555) 123-4567",
			rating: 5,
			title: "Excellent Emergency Service",
			content: "Wade's Plumbing came to our rescue at 2 AM when our basement was flooding. They were professional, quick, and fixed the issue completely. Highly recommend!",
			date: "2024-01-15",
			verified: true,
			helpful: 12,
			notHelpful: 1,
			replies: [
				{
					id: 1,
					author: "Wade's Plumbing & Septic",
					content: "Thank you Sarah! We're glad we could help in your emergency. Your satisfaction is our priority.",
					date: "2024-01-16",
					isBusiness: true,
				},
			],
			status: "published",
			category: "Emergency",
			service: "Emergency Plumbing",
		},
		{
			id: 2,
			customerName: "Mike Chen",
			customerEmail: "mike.chen@email.com",
			customerPhone: "(555) 234-5678",
			rating: 4,
			title: "Good Service, Fair Price",
			content: "Had them install a new water heater. The work was done well and the price was reasonable. Would use them again.",
			date: "2024-01-10",
			verified: true,
			helpful: 8,
			notHelpful: 2,
			replies: [],
			status: "published",
			category: "Installation",
			service: "Water Heater Installation",
		},
		{
			id: 3,
			customerName: "Lisa Rodriguez",
			customerEmail: "lisa.r@email.com",
			customerPhone: "(555) 345-6789",
			rating: 5,
			title: "Professional and Reliable",
			content: "They've been maintaining our septic system for years. Always professional, on time, and do great work. Highly recommend for any plumbing needs.",
			date: "2024-01-08",
			verified: true,
			helpful: 15,
			notHelpful: 0,
			replies: [
				{
					id: 2,
					author: "Wade's Plumbing & Septic",
					content: "Thank you Lisa! We appreciate your continued trust in our services.",
					date: "2024-01-09",
					isBusiness: true,
				},
			],
			status: "published",
			category: "Maintenance",
			service: "Septic Tank Pumping",
		},
		{
			id: 4,
			customerName: "David Thompson",
			customerEmail: "david.t@email.com",
			customerPhone: "(555) 456-7890",
			rating: 3,
			title: "Decent Service",
			content: "The work was done correctly, but they were a bit late to the appointment. Otherwise, everything was fine.",
			date: "2024-01-05",
			verified: false,
			helpful: 3,
			notHelpful: 5,
			replies: [
				{
					id: 3,
					author: "Wade's Plumbing & Septic",
					content: "We apologize for the delay, David. We're working on improving our scheduling to ensure better punctuality.",
					date: "2024-01-06",
					isBusiness: true,
				},
			],
			status: "published",
			category: "Repair",
			service: "Pipe Repair",
		},
		{
			id: 5,
			customerName: "Jennifer Adams",
			customerEmail: "jennifer.a@email.com",
			customerPhone: "(555) 567-8901",
			rating: 5,
			title: "Outstanding Customer Service",
			content: "From the initial call to completion, the service was exceptional. The team was knowledgeable, courteous, and went above and beyond.",
			date: "2024-01-03",
			verified: true,
			helpful: 20,
			notHelpful: 0,
			replies: [],
			status: "published",
			category: "General",
			service: "Drain Cleaning",
		},
	]);

	const [pendingReviews, setPendingReviews] = useState([
		{
			id: 6,
			customerName: "Robert Wilson",
			customerEmail: "robert.w@email.com",
			customerPhone: "(555) 678-9012",
			rating: 4,
			title: "Good Work on Kitchen Sink",
			content: "Fixed our kitchen sink clog quickly and efficiently. Fair pricing and good service.",
			date: "2024-01-20",
			verified: false,
			helpful: 0,
			notHelpful: 0,
			replies: [],
			status: "pending",
			category: "Repair",
			service: "Drain Cleaning",
		},
	]);

	// Calculate review statistics
	const totalReviews = reviews.length + pendingReviews.length;
	const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
	const ratingDistribution = {
		5: reviews.filter((r) => r.rating === 5).length,
		4: reviews.filter((r) => r.rating === 4).length,
		3: reviews.filter((r) => r.rating === 3).length,
		2: reviews.filter((r) => r.rating === 2).length,
		1: reviews.filter((r) => r.rating === 1).length,
	};

	const filteredReviews = reviews.filter((review) => {
		const matchesSearch = review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || review.title.toLowerCase().includes(searchQuery.toLowerCase()) || review.content.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesRating = filterRating === "all" || review.rating === parseInt(filterRating);

		return matchesSearch && matchesRating;
	});

	const sortedReviews = [...filteredReviews].sort((a, b) => {
		switch (sortBy) {
			case "newest":
				return new Date(b.date) - new Date(a.date);
			case "oldest":
				return new Date(a.date) - new Date(b.date);
			case "rating":
				return b.rating - a.rating;
			case "helpful":
				return b.helpful - a.helpful;
			default:
				return 0;
		}
	});

	const handleReply = (reviewId, replyContent) => {
		const newReply = {
			id: Date.now(),
			author: "Wade's Plumbing & Septic",
			content: replyContent,
			date: new Date().toISOString().split("T")[0],
			isBusiness: true,
		};

		setReviews((prev) => prev.map((review) => (review.id === reviewId ? { ...review, replies: [...review.replies, newReply] } : review)));

		toast({
			title: "Reply Posted",
			description: "Your reply has been posted successfully.",
		});
	};

	const handleApproveReview = (reviewId) => {
		const reviewToApprove = pendingReviews.find((r) => r.id === reviewId);
		if (reviewToApprove) {
			setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
			setReviews((prev) => [...prev, { ...reviewToApprove, status: "published" }]);

			toast({
				title: "Review Approved",
				description: "The review has been approved and is now visible.",
			});
		}
	};

	const handleRejectReview = (reviewId) => {
		setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));

		toast({
			title: "Review Rejected",
			description: "The review has been rejected and removed.",
		});
	};

	const handleHelpful = (reviewId, isHelpful) => {
		setReviews((prev) =>
			prev.map((review) =>
				review.id === reviewId
					? {
							...review,
							helpful: isHelpful ? review.helpful + 1 : review.helpful,
							notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful,
					  }
					: review
			)
		);
	};

	const renderStars = (rating) => {
		return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />);
	};

	return (
		<div className="px-4 py-16 space-y-8 w-full lg:px-24">
			<div className="grid gap-2 w-full">
				<div>
					<h1 className="text-4xl">Reviews Management</h1>
					<p className="text-muted-foreground">Monitor and respond to customer reviews for your business.</p>
				</div>
			</div>

			<div className="grid gap-6">
				{/* Review Statistics */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<Star className="w-5 h-5 text-yellow-500" />
								<div>
									<p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
									<p className="text-sm text-muted-foreground">Average Rating</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<MessageSquare className="w-5 h-5 text-blue-500" />
								<div>
									<p className="text-2xl font-bold">{totalReviews}</p>
									<p className="text-sm text-muted-foreground">Total Reviews</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<CheckCircle className="w-5 h-5 text-green-500" />
								<div>
									<p className="text-2xl font-bold">{reviews.length}</p>
									<p className="text-sm text-muted-foreground">Published</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-2">
								<Clock className="w-5 h-5 text-orange-500" />
								<div>
									<p className="text-2xl font-bold">{pendingReviews.length}</p>
									<p className="text-sm text-muted-foreground">Pending</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Rating Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Rating Distribution</CardTitle>
						<CardDescription>Breakdown of customer ratings</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{[5, 4, 3, 2, 1].map((rating) => (
							<div key={rating} className="flex items-center space-x-3">
								<div className="flex items-center space-x-1 w-8">
									<span className="text-sm font-medium">{rating}</span>
									<Star className="w-4 h-4 text-yellow-400" />
								</div>
								<Progress value={(ratingDistribution[rating] / reviews.length) * 100} className="flex-1 h-2" />
								<span className="text-sm text-muted-foreground w-12 text-right">{ratingDistribution[rating]}</span>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Pending Reviews */}
				{pendingReviews.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Clock className="w-5 h-5" />
								<span>Pending Reviews ({pendingReviews.length})</span>
							</CardTitle>
							<CardDescription>Reviews awaiting your approval</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{pendingReviews.map((review) => (
								<div key={review.id} className="p-4 border rounded-lg">
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center space-x-3">
											<Avatar className="w-10 h-10">
												<AvatarFallback>
													<User className="w-5 h-5" />
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="flex items-center space-x-2">
													<span className="font-medium">{review.customerName}</span>
													{review.verified && (
														<Badge variant="outline" className="text-xs">
															<CheckCircle className="w-3 h-3 mr-1" />
															Verified
														</Badge>
													)}
												</div>
												<div className="flex items-center space-x-1">
													{renderStars(review.rating)}
													<span className="text-sm text-muted-foreground ml-2">{review.date}</span>
												</div>
											</div>
										</div>
										<div className="flex space-x-2">
											<Button size="sm" onClick={() => handleApproveReview(review.id)}>
												<CheckCircle className="w-4 h-4 mr-1" />
												Approve
											</Button>
											<Button size="sm" variant="outline" onClick={() => handleRejectReview(review.id)}>
												<X className="w-4 h-4 mr-1" />
												Reject
											</Button>
										</div>
									</div>
									<h4 className="font-medium mb-2">{review.title}</h4>
									<p className="text-muted-foreground mb-3">{review.content}</p>
									<div className="flex items-center space-x-4 text-sm text-muted-foreground">
										<span>Service: {review.service}</span>
										<span>Category: {review.category}</span>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				)}

				{/* Reviews List */}
				<Card>
					<CardHeader>
						<CardTitle>All Reviews</CardTitle>
						<CardDescription>Manage and respond to customer reviews</CardDescription>
					</CardHeader>
					<CardContent>
						{/* Filters and Search */}
						<div className="flex flex-col space-y-4 mb-6 md:flex-row md:space-y-0 md:space-x-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input placeholder="Search reviews..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
								</div>
							</div>
							<Select value={filterRating} onValueChange={setFilterRating}>
								<SelectTrigger className="w-48">
									<SelectValue placeholder="Filter by rating" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Ratings</SelectItem>
									<SelectItem value="5">5 Stars</SelectItem>
									<SelectItem value="4">4 Stars</SelectItem>
									<SelectItem value="3">3 Stars</SelectItem>
									<SelectItem value="2">2 Stars</SelectItem>
									<SelectItem value="1">1 Star</SelectItem>
								</SelectContent>
							</Select>
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-48">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="newest">Newest First</SelectItem>
									<SelectItem value="oldest">Oldest First</SelectItem>
									<SelectItem value="rating">Highest Rating</SelectItem>
									<SelectItem value="helpful">Most Helpful</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Reviews */}
						<div className="space-y-4">
							{sortedReviews.map((review) => (
								<div key={review.id} className="p-4 border rounded-lg">
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center space-x-3">
											<Avatar className="w-10 h-10">
												<AvatarFallback>
													<User className="w-5 h-5" />
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="flex items-center space-x-2">
													<span className="font-medium">{review.customerName}</span>
													{review.verified && (
														<Badge variant="outline" className="text-xs">
															<CheckCircle className="w-3 h-3 mr-1" />
															Verified
														</Badge>
													)}
												</div>
												<div className="flex items-center space-x-1">
													{renderStars(review.rating)}
													<span className="text-sm text-muted-foreground ml-2">{review.date}</span>
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<Button size="sm" variant="outline" onClick={() => handleHelpful(review.id, true)}>
												<ThumbsUp className="w-4 h-4 mr-1" />
												{review.helpful}
											</Button>
											<Button size="sm" variant="outline" onClick={() => handleHelpful(review.id, false)}>
												<ThumbsDown className="w-4 h-4 mr-1" />
												{review.notHelpful}
											</Button>
										</div>
									</div>

									<h4 className="font-medium mb-2">{review.title}</h4>
									<p className="text-muted-foreground mb-3">{review.content}</p>

									<div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
										<span>Service: {review.service}</span>
										<span>Category: {review.category}</span>
									</div>

									{/* Replies */}
									{review.replies.length > 0 && (
										<div className="ml-8 space-y-2">
											{review.replies.map((reply) => (
												<div key={reply.id} className="p-3 bg-muted/30 rounded-lg">
													<div className="flex items-center space-x-2 mb-1">
														<span className="font-medium text-sm">{reply.author}</span>
														{reply.isBusiness && (
															<Badge variant="secondary" className="text-xs">
																Business
															</Badge>
														)}
														<span className="text-xs text-muted-foreground">{reply.date}</span>
													</div>
													<p className="text-sm">{reply.content}</p>
												</div>
											))}
										</div>
									)}

									{/* Reply Form */}
									<div className="mt-4">
										<Button size="sm" variant="outline" onClick={() => setShowReplies((prev) => ({ ...prev, [review.id]: !prev[review.id] }))}>
											<Reply className="w-4 h-4 mr-1" />
											{showReplies[review.id] ? "Cancel Reply" : "Reply"}
										</Button>

										{showReplies[review.id] && (
											<div className="mt-3 p-3 border rounded-lg">
												<Textarea placeholder="Write your reply..." className="mb-2" rows={3} />
												<Button size="sm">
													<Reply className="w-4 h-4 mr-1" />
													Post Reply
												</Button>
											</div>
										)}
									</div>
								</div>
							))}
						</div>

						{sortedReviews.length === 0 && (
							<div className="text-center py-8">
								<MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
								<p className="text-muted-foreground">No reviews found matching your criteria.</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
