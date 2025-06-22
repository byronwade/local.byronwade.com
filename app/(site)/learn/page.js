"use client";
import { useState, useEffect } from "react";
import { Search, Filter, Play, Clock, Star, TrendingUp, BookOpen, Lightbulb, Calendar, Users, Award, Video } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

// Educational content data
const educationalContent = {
	howToVideos: [
		{
			id: "1",
			title: "How to Unclog Your Kitchen Sink - DIY Guide",
			description: "Learn the professional way to unclog your kitchen sink without calling a plumber",
			thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
			duration: "5:23",
			views: "12.4K",
			author: "Wade's Plumbing & Septic",
			authorAvatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=50&h=50&fit=crop",
			category: "Home Maintenance",
			rating: 4.8,
			uploadDate: "2 days ago",
			videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
			tags: ["plumbing", "diy", "home maintenance", "kitchen"],
		},
		{
			id: "2",
			title: "Basic Car Maintenance: Oil Change at Home",
			description: "Step-by-step guide to changing your car's oil safely and efficiently",
			thumbnail: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
			duration: "8:45",
			views: "8.7K",
			author: "Springfield Auto Care",
			authorAvatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=50&h=50&fit=crop",
			category: "Automotive",
			rating: 4.9,
			uploadDate: "1 week ago",
			videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
			tags: ["automotive", "maintenance", "oil change", "diy"],
		},
		{
			id: "3",
			title: "Professional Hair Styling Techniques",
			description: "Master the basics of professional hair styling for any occasion",
			thumbnail: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
			duration: "12:18",
			views: "15.2K",
			author: "Beauty & Style Salon",
			authorAvatar: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=50&h=50&fit=crop",
			category: "Beauty",
			rating: 4.7,
			uploadDate: "3 days ago",
			videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
			tags: ["beauty", "hair styling", "professional", "tutorial"],
		},
	],
	diyTips: [
		{
			id: "4",
			title: "10 Essential Home Repair Tools Every Homeowner Needs",
			description: "Build your essential toolkit for common home repairs and maintenance",
			thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
			duration: "6:32",
			views: "9.1K",
			author: "HomeFix Pro",
			authorAvatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=50&h=50&fit=crop",
			category: "Home Improvement",
			rating: 4.6,
			uploadDate: "5 days ago",
			videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
			tags: ["tools", "home improvement", "diy", "maintenance"],
		},
		{
			id: "5",
			title: "Quick Fix: Repairing Drywall Holes",
			description: "Learn to repair small holes in drywall like a professional",
			thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
			duration: "4:15",
			views: "6.8K",
			author: "Springfield Handyman",
			authorAvatar: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=50&h=50&fit=crop",
			category: "Home Improvement",
			rating: 4.5,
			uploadDate: "1 week ago",
			videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
			tags: ["drywall", "repair", "home improvement", "quick fix"],
		},
	],
	industryInsights: [
		{
			id: "6",
			title: "2024 Restaurant Industry Trends",
			description: "What's new in the restaurant industry and how to stay competitive",
			thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
			duration: "15:42",
			views: "3.2K",
			author: "Restaurant Business Insights",
			authorAvatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&h=50&fit=crop",
			category: "Restaurant",
			rating: 4.8,
			uploadDate: "1 day ago",
			videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
			tags: ["restaurant", "trends", "industry", "business"],
		},
		{
			id: "7",
			title: "Real Estate Market Analysis: Springfield Area",
			description: "Current market trends and investment opportunities in Springfield",
			thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
			duration: "18:25",
			views: "2.1K",
			author: "Springfield Real Estate Group",
			authorAvatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=50&h=50&fit=crop",
			category: "Real Estate",
			rating: 4.9,
			uploadDate: "4 days ago",
			videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
			tags: ["real estate", "market analysis", "investment", "springfield"],
		},
	],
	seasonalTips: [
		{
			id: "8",
			title: "Spring HVAC Maintenance Checklist",
			description: "Prepare your HVAC system for the warmer months ahead",
			thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
			duration: "7:18",
			views: "4.5K",
			author: "Cool Breeze HVAC",
			authorAvatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=50&h=50&fit=crop",
			category: "HVAC",
			rating: 4.7,
			uploadDate: "1 week ago",
			videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
			tags: ["hvac", "spring", "maintenance", "seasonal"],
		},
		{
			id: "9",
			title: "Holiday Business Marketing Strategies",
			description: "Boost your business during the holiday season with proven strategies",
			thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
			duration: "11:33",
			views: "5.8K",
			author: "Business Growth Experts",
			authorAvatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&h=50&fit=crop",
			category: "Marketing",
			rating: 4.6,
			uploadDate: "2 weeks ago",
			videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
			tags: ["marketing", "holiday", "business", "strategy"],
		},
	],
};

const categories = ["All", "Home Maintenance", "Automotive", "Beauty", "Home Improvement", "Restaurant", "Real Estate", "HVAC", "Marketing"];

export default function LearnPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [activeTab, setActiveTab] = useState("howTo");

	const filteredContent = (content) => {
		return content.filter((item) => {
			const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase()) || item.author.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	};

	const VideoCard = ({ video }) => (
		<Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
			<div className="relative overflow-hidden rounded-t-lg">
				<Image src={video.thumbnail} alt={video.title} width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
				<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
				<div className="absolute top-3 left-3 flex items-center space-x-2">
					<Badge variant="secondary" className="bg-background/90 text-foreground">
						{video.category}
					</Badge>
				</div>
				<div className="absolute bottom-3 right-3 flex items-center space-x-2 text-white">
					<Clock className="w-4 h-4" />
					<span className="text-sm font-medium">{video.duration}</span>
				</div>
				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<div className="bg-white/90 rounded-full p-3">
						<Play className="w-6 h-6 text-foreground ml-1" />
					</div>
				</div>
			</div>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">{video.title}</CardTitle>
				<CardDescription className="line-clamp-2">{video.description}</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Image src={video.authorAvatar} alt={video.author} width={24} height={24} className="w-6 h-6 rounded-full" />
						<span className="text-sm font-medium text-muted-foreground">{video.author}</span>
					</div>
					<div className="flex items-center space-x-2">
						<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
						<span className="text-sm text-muted-foreground">{video.rating}</span>
					</div>
				</div>
				<div className="flex items-center justify-between mt-2">
					<div className="flex items-center space-x-4 text-sm text-muted-foreground">
						<span>{video.views} views</span>
						<span>{video.uploadDate}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
				<div className="container mx-auto px-4 py-16">
					<div className="max-w-4xl mx-auto text-center">
						<div className="flex items-center justify-center mb-4">
							<BookOpen className="w-8 h-8 mr-3" />
							<h1 className="text-4xl font-bold">Educational Content Hub</h1>
						</div>
						<p className="text-xl text-primary-foreground/90 mb-8">Learn from local business experts. Discover DIY tips, industry insights, and professional tutorials.</p>

						{/* Search and Filter */}
						<div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input type="text" placeholder="Search educational content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-background/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50" />
							</div>
							<select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-3 bg-background/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50">
								{categories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Content Tabs */}
			<div className="container mx-auto px-4 py-8">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-4 mb-8">
						<TabsTrigger value="howTo" className="flex items-center space-x-2">
							<Video className="w-4 h-4" />
							<span>How-To Videos</span>
						</TabsTrigger>
						<TabsTrigger value="diy" className="flex items-center space-x-2">
							<Lightbulb className="w-4 h-4" />
							<span>DIY Tips</span>
						</TabsTrigger>
						<TabsTrigger value="insights" className="flex items-center space-x-2">
							<TrendingUp className="w-4 h-4" />
							<span>Industry Insights</span>
						</TabsTrigger>
						<TabsTrigger value="seasonal" className="flex items-center space-x-2">
							<Calendar className="w-4 h-4" />
							<span>Seasonal Tips</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="howTo">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredContent(educationalContent.howToVideos).map((video) => (
								<VideoCard key={video.id} video={video} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="diy">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredContent(educationalContent.diyTips).map((video) => (
								<VideoCard key={video.id} video={video} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="insights">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredContent(educationalContent.industryInsights).map((video) => (
								<VideoCard key={video.id} video={video} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="seasonal">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredContent(educationalContent.seasonalTips).map((video) => (
								<VideoCard key={video.id} video={video} />
							))}
						</div>
					</TabsContent>
				</Tabs>

				{/* Call to Action */}
				<div className="mt-16 text-center">
					<Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
						<CardContent className="p-8">
							<h3 className="text-2xl font-bold mb-4">Share Your Expertise</h3>
							<p className="text-muted-foreground mb-6">Are you a local business expert? Share your knowledge and help others learn from your experience.</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button className="bg-primary hover:bg-primary/90">
									<Video className="w-4 h-4 mr-2" />
									Upload Educational Video
								</Button>
								<Button variant="outline">
									<Users className="w-4 h-4 mr-2" />
									Become a Content Creator
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
