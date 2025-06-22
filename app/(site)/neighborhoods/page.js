"use client";
import { useState } from "react";
import { MapPin, Users, Newspaper, Building, Heart, Share2, Plus, Search, Filter, TrendingUp, Star, Camera, MessageCircle, Globe, Home, Store } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

// Neighborhood data
const neighborhoodsData = {
	neighborhoods: [
		{
			id: "1",
			name: "Downtown Springfield",
			description: "The heart of Springfield with historic buildings, local businesses, and vibrant community life.",
			image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
			businesses: 89,
			residents: 1247,
			posts: 156,
			events: 12,
			rating: 4.7,
			topBusinesses: ["Springfield Coffee Co", "Downtown Diner", "Historic Theater"],
			recentNews: ["New art gallery opening on Main Street", "Downtown farmers market starts this weekend", "Historic building renovation complete"],
			upcomingEvents: ["Downtown Art Walk - Feb 20", "Springfield Jazz Festival - Mar 15", "Local Business Showcase - Mar 25"],
		},
		{
			id: "2",
			name: "Westside Community",
			description: "Family-friendly neighborhood with parks, schools, and local shopping centers.",
			image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
			businesses: 67,
			residents: 892,
			posts: 98,
			events: 8,
			rating: 4.8,
			topBusinesses: ["Westside Family Market", "Community Pharmacy", "Local Hardware Store"],
			recentNews: ["New playground equipment installed at Westside Park", "Local bakery wins best pastry award", "Community garden expansion planned"],
			upcomingEvents: ["Family Fun Day - Feb 18", "Neighborhood Garage Sale - Mar 10", "Spring Cleanup Day - Apr 5"],
		},
		{
			id: "3",
			name: "Eastside Industrial District",
			description: "Growing industrial and commercial area with manufacturing businesses and new developments.",
			image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
			businesses: 45,
			residents: 234,
			posts: 67,
			events: 5,
			rating: 4.5,
			topBusinesses: ["Springfield Manufacturing", "Industrial Supply Co", "Tech Startup Hub"],
			recentNews: ["New manufacturing facility opening", "Tech incubator program launched", "Industrial park expansion approved"],
			upcomingEvents: ["Job Fair - Feb 22", "Manufacturing Expo - Mar 20", "Tech Meetup - Mar 28"],
		},
	],
	localNews: [
		{
			id: "1",
			title: "New Local Restaurant Opens in Downtown",
			summary: "Springfield's newest farm-to-table restaurant brings fresh, local ingredients to the downtown dining scene.",
			image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop",
			neighborhood: "Downtown Springfield",
			author: "Springfield News",
			date: "2024-02-15",
			views: 234,
			category: "Business",
		},
		{
			id: "2",
			title: "Community Garden Project Gets Green Light",
			summary: "Residents of Westside Community will soon have access to a new community garden and fresh produce.",
			image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=200&fit=crop",
			neighborhood: "Westside Community",
			author: "Community Reporter",
			date: "2024-02-14",
			views: 189,
			category: "Community",
		},
		{
			id: "3",
			title: "Tech Startup Hub Expands in Eastside",
			summary: "The Eastside Industrial District welcomes new tech companies as the startup ecosystem continues to grow.",
			image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=200&fit=crop",
			neighborhood: "Eastside Industrial District",
			author: "Business Journal",
			date: "2024-02-13",
			views: 156,
			category: "Technology",
		},
	],
	communityPosts: [
		{
			id: "1",
			title: "Lost Dog - Westside Community",
			content: "Our golden retriever Max went missing yesterday. Last seen near Westside Park. Please contact if you see him!",
			author: "Sarah Johnson",
			authorAvatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=50&h=50&fit=crop",
			neighborhood: "Westside Community",
			date: "2024-02-15",
			likes: 23,
			comments: 8,
			category: "Lost & Found",
		},
		{
			id: "2",
			title: "Great Service at Downtown Coffee Shop",
			content: "Just wanted to share how amazing the staff at Springfield Coffee Co is. They remembered my order and made my day!",
			author: "Mike Chen",
			authorAvatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=50&h=50&fit=crop",
			neighborhood: "Downtown Springfield",
			date: "2024-02-14",
			likes: 45,
			comments: 12,
			category: "Recommendation",
		},
		{
			id: "3",
			title: "Neighborhood Cleanup Success",
			content: "Thanks to everyone who participated in our neighborhood cleanup! We collected 15 bags of trash and made our area beautiful.",
			author: "Lisa Rodriguez",
			authorAvatar: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=50&h=50&fit=crop",
			neighborhood: "Eastside Industrial District",
			date: "2024-02-13",
			likes: 67,
			comments: 15,
			category: "Community",
		},
	],
};

const categories = ["All", "Business", "Community", "Technology", "Lost & Found", "Recommendation"];

export default function NeighborhoodsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [activeTab, setActiveTab] = useState("neighborhoods");

	const filteredData = (data) => {
		return data.filter((item) => {
			const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.content?.toLowerCase().includes(searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	};

	const NeighborhoodCard = ({ neighborhood }) => (
		<Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
			<div className="relative overflow-hidden rounded-t-lg">
				<Image src={neighborhood.image} alt={neighborhood.name} width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
				<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
				<div className="absolute top-3 left-3">
					<Badge variant="secondary" className="bg-background/90 text-foreground">
						{neighborhood.businesses} Businesses
					</Badge>
				</div>
				<div className="absolute bottom-3 right-3 flex items-center space-x-2 text-white">
					<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
					<span className="text-sm font-medium">{neighborhood.rating}</span>
				</div>
			</div>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg group-hover:text-primary transition-colors">{neighborhood.name}</CardTitle>
				<CardDescription className="line-clamp-2">{neighborhood.description}</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-4">
					{/* Stats */}
					<div className="grid grid-cols-3 gap-4 text-center">
						<div>
							<div className="text-lg font-bold text-primary">{neighborhood.businesses}</div>
							<div className="text-xs text-muted-foreground">Businesses</div>
						</div>
						<div>
							<div className="text-lg font-bold text-primary">{neighborhood.residents}</div>
							<div className="text-xs text-muted-foreground">Residents</div>
						</div>
						<div>
							<div className="text-lg font-bold text-primary">{neighborhood.events}</div>
							<div className="text-xs text-muted-foreground">Events</div>
						</div>
					</div>

					{/* Top Businesses */}
					<div>
						<h4 className="text-sm font-medium mb-2">Top Businesses</h4>
						<div className="space-y-1">
							{neighborhood.topBusinesses.map((business, index) => (
								<div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
									<Store className="w-3 h-3" />
									<span>{business}</span>
								</div>
							))}
						</div>
					</div>

					{/* Recent News */}
					<div>
						<h4 className="text-sm font-medium mb-2">Recent News</h4>
						<div className="space-y-1">
							{neighborhood.recentNews.slice(0, 2).map((news, index) => (
								<div key={index} className="text-xs text-muted-foreground line-clamp-1">
									• {news}
								</div>
							))}
						</div>
					</div>

					<Button className="w-full">
						<MapPin className="w-4 h-4 mr-2" />
						Explore Neighborhood
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	const NewsCard = ({ news }) => (
		<Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
			<div className="relative overflow-hidden rounded-t-lg">
				<Image src={news.image} alt={news.title} width={400} height={200} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
				<div className="absolute top-3 left-3">
					<Badge variant="secondary" className="bg-background/90 text-foreground">
						{news.category}
					</Badge>
				</div>
			</div>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">{news.title}</CardTitle>
				<CardDescription className="line-clamp-2">{news.summary}</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					<div className="flex items-center justify-between text-sm text-muted-foreground">
						<div className="flex items-center space-x-2">
							<MapPin className="w-4 h-4" />
							<span>{news.neighborhood}</span>
						</div>
						<div className="flex items-center space-x-1">
							<Eye className="w-4 h-4" />
							<span>{news.views}</span>
						</div>
					</div>

					<div className="flex items-center justify-between text-sm text-muted-foreground">
						<span>By {news.author}</span>
						<span>{new Date(news.date).toLocaleDateString()}</span>
					</div>

					<Button variant="outline" className="w-full">
						<Newspaper className="w-4 h-4 mr-2" />
						Read More
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	const CommunityPostCard = ({ post }) => (
		<Card className="group hover:shadow-lg transition-all duration-300">
			<CardHeader className="pb-3">
				<div className="flex items-start space-x-3">
					<Image src={post.authorAvatar} alt={post.author} width={40} height={40} className="w-10 h-10 rounded-full" />
					<div className="flex-1">
						<div className="flex items-center space-x-2 mb-1">
							<CardTitle className="text-base">{post.author}</CardTitle>
							<Badge variant="outline" className="text-xs">
								{post.category}
							</Badge>
						</div>
						<div className="flex items-center space-x-2 text-sm text-muted-foreground">
							<MapPin className="w-4 h-4" />
							<span>{post.neighborhood}</span>
							<span>•</span>
							<span>{new Date(post.date).toLocaleDateString()}</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					<h3 className="font-medium">{post.title}</h3>
					<p className="text-sm text-muted-foreground">{post.content}</p>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button variant="ghost" size="sm" className="flex items-center space-x-1">
								<Heart className="w-4 h-4" />
								<span className="text-sm">{post.likes}</span>
							</Button>
							<Button variant="ghost" size="sm" className="flex items-center space-x-1">
								<MessageCircle className="w-4 h-4" />
								<span className="text-sm">{post.comments}</span>
							</Button>
						</div>
						<Button variant="ghost" size="sm">
							<Share2 className="w-4 h-4" />
						</Button>
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
							<Home className="w-8 h-8 mr-3" />
							<h1 className="text-4xl font-bold">Neighborhood Hubs</h1>
						</div>
						<p className="text-xl text-primary-foreground/90 mb-8">Discover hyper-local content, neighborhood-specific business guides, and community news.</p>

						{/* Search and Filter */}
						<div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input type="text" placeholder="Search neighborhoods, news, or posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-background/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50" />
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
					<TabsList className="grid w-full grid-cols-3 mb-8">
						<TabsTrigger value="neighborhoods" className="flex items-center space-x-2">
							<MapPin className="w-4 h-4" />
							<span>Neighborhoods</span>
						</TabsTrigger>
						<TabsTrigger value="news" className="flex items-center space-x-2">
							<Newspaper className="w-4 h-4" />
							<span>Local News</span>
						</TabsTrigger>
						<TabsTrigger value="community" className="flex items-center space-x-2">
							<Users className="w-4 h-4" />
							<span>Community Posts</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="neighborhoods">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredData(neighborhoodsData.neighborhoods).map((neighborhood) => (
								<NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="news">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredData(neighborhoodsData.localNews).map((news) => (
								<NewsCard key={news.id} news={news} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="community">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredData(neighborhoodsData.communityPosts).map((post) => (
								<CommunityPostCard key={post.id} post={post} />
							))}
						</div>
					</TabsContent>
				</Tabs>

				{/* Call to Action */}
				<div className="mt-16 text-center">
					<Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
						<CardContent className="p-8">
							<h3 className="text-2xl font-bold mb-4">Join Your Neighborhood</h3>
							<p className="text-muted-foreground mb-6">Connect with your neighbors, share local news, and discover what's happening in your community.</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button className="bg-primary hover:bg-primary/90">
									<Plus className="w-4 h-4 mr-2" />
									Create Post
								</Button>
								<Button variant="outline">
									<Newspaper className="w-4 h-4 mr-2" />
									Submit News
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
