"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Calendar, MapPin, Clock, Users, Search, Filter, Plus, Heart, Share2, Bookmark, MoreHorizontal, ChevronDown, Star, Tag, Globe, Lock, Music, Camera, Coffee, ShoppingBag, GraduationCap, Heart as HeartIcon, MessageCircle, ExternalLink } from "lucide-react";
import Image from "next/image";

// Mock data for Facebook-style events
const eventsData = {
	upcoming: [
		{
			id: 1,
			title: "Local Business Networking Mixer",
			description: "Join fellow business owners for an evening of networking, drinks, and collaboration opportunities. Perfect for expanding your professional network.",
			date: "2024-02-15",
			time: "18:00",
			location: "Downtown Business Center",
			address: "123 Main St, Downtown",
			category: "Networking",
			organizer: "Business Growth Network",
			organizerAvatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
			image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
			attendees: 47,
			interested: 89,
			price: "Free",
			isOnline: false,
			isVerified: true,
			tags: ["Networking", "Business", "Professional"],
			distance: "0.5 miles away",
		},
		{
			id: 2,
			title: "Food Truck Festival 2024",
			description: "A celebration of local cuisine featuring 20+ food trucks, live music, and family activities. Don't miss the best local food in one place!",
			date: "2024-02-18",
			time: "12:00",
			location: "Central Park",
			address: "456 Park Ave, Downtown",
			category: "Food & Drink",
			organizer: "Local Food Association",
			organizerAvatar: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop",
			image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
			attendees: 234,
			interested: 567,
			price: "$5",
			isOnline: false,
			isVerified: true,
			tags: ["Food", "Music", "Family"],
			distance: "1.2 miles away",
		},
		{
			id: 3,
			title: "Tech Startup Meetup",
			description: "Monthly meetup for tech entrepreneurs, developers, and investors. Share ideas, find collaborators, and learn from successful founders.",
			date: "2024-02-20",
			time: "19:00",
			location: "Innovation Hub",
			address: "789 Tech Blvd, Innovation District",
			category: "Technology",
			organizer: "Tech Community",
			organizerAvatar: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=100&h=100&fit=crop",
			image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
			attendees: 89,
			interested: 156,
			price: "Free",
			isOnline: false,
			isVerified: true,
			tags: ["Technology", "Startup", "Networking"],
			distance: "2.1 miles away",
		},
		{
			id: 4,
			title: "Yoga in the Park",
			description: "Join us for a relaxing morning yoga session in the beautiful park setting. All levels welcome, bring your own mat.",
			date: "2024-02-22",
			time: "08:00",
			location: "Riverside Park",
			address: "321 River Rd, Riverside",
			category: "Health & Wellness",
			organizer: "Wellness Collective",
			organizerAvatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
			image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
			attendees: 23,
			interested: 45,
			price: "$10",
			isOnline: false,
			isVerified: false,
			tags: ["Yoga", "Wellness", "Outdoor"],
			distance: "0.8 miles away",
		},
		{
			id: 5,
			title: "Art Gallery Opening",
			description: "Opening night for local artists showcasing contemporary works. Wine and cheese reception included.",
			date: "2024-02-25",
			time: "18:30",
			location: "Modern Art Gallery",
			address: "654 Art St, Arts District",
			category: "Arts & Culture",
			organizer: "Local Artists Guild",
			organizerAvatar: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop",
			image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
			attendees: 67,
			interested: 123,
			price: "$15",
			isOnline: false,
			isVerified: true,
			tags: ["Art", "Culture", "Wine"],
			distance: "1.5 miles away",
		},
	],
	today: [
		{
			id: 6,
			title: "Coffee & Conversations",
			description: "Weekly coffee meetup for entrepreneurs and professionals. Great networking opportunity in a relaxed setting.",
			date: "2024-02-10",
			time: "09:00",
			location: "Local Coffee Shop",
			address: "987 Coffee St, Downtown",
			category: "Networking",
			organizer: "Entrepreneur Network",
			organizerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
			image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
			attendees: 12,
			interested: 28,
			price: "Free",
			isOnline: false,
			isVerified: true,
			tags: ["Coffee", "Networking", "Morning"],
			distance: "0.3 miles away",
		},
	],
	thisWeek: [
		{
			id: 7,
			title: "Live Music Night",
			description: "Local bands performing live music. Great atmosphere, good drinks, and amazing talent.",
			date: "2024-02-12",
			time: "20:00",
			location: "The Music Venue",
			address: "555 Music Ave, Entertainment District",
			category: "Music",
			organizer: "Local Music Scene",
			organizerAvatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
			image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
			attendees: 156,
			interested: 289,
			price: "$20",
			isOnline: false,
			isVerified: true,
			tags: ["Music", "Live", "Entertainment"],
			distance: "1.8 miles away",
		},
	],
};

const categories = ["All Events", "Networking", "Food & Drink", "Music", "Technology", "Health & Wellness", "Arts & Culture", "Sports", "Education", "Family"];

const dateFilters = ["Today", "This Week", "This Weekend", "Next Week", "This Month"];

export default function EventsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All Events");
	const [selectedDateFilter, setSelectedDateFilter] = useState("This Week");

	const filteredEvents = eventsData.upcoming.filter((event) => {
		const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase()) || event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = selectedCategory === "All Events" || event.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const EventCard = ({ event }) => (
		<Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
			<div className="relative overflow-hidden rounded-t-lg">
				<Image src={event.image} alt={event.title} width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
				<div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
				<div className="absolute top-3 left-3 flex items-center space-x-2">
					<Badge variant="secondary" className="bg-background/90 text-foreground">
						{event.category}
					</Badge>
					{event.isVerified && (
						<Badge className="bg-blue-500 text-white">
							<Star className="w-3 h-3 mr-1" />
							Verified
						</Badge>
					)}
				</div>
				<div className="absolute top-3 right-3 flex items-center space-x-2">
					<Button size="sm" variant="ghost" className="bg-background/90 text-foreground hover:bg-background/80">
						<Bookmark className="w-4 h-4" />
					</Button>
					<Button size="sm" variant="ghost" className="bg-background/90 text-foreground hover:bg-background/80">
						<Share2 className="w-4 h-4" />
					</Button>
				</div>
				<div className="absolute bottom-3 right-3 flex items-center space-x-2 text-white">
					<Badge className="bg-green-500 text-white">{event.price}</Badge>
				</div>
			</div>

			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors mb-2">{event.title}</CardTitle>
						<div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
							<div className="flex items-center space-x-1">
								<Calendar className="w-4 h-4" />
								<span>
									{new Date(event.date).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										weekday: "short",
									})}
								</span>
							</div>
							<div className="flex items-center space-x-1">
								<Clock className="w-4 h-4" />
								<span>{event.time}</span>
							</div>
						</div>
						<div className="flex items-center space-x-1 text-sm text-muted-foreground mb-3">
							<MapPin className="w-4 h-4" />
							<span className="line-clamp-1">{event.location}</span>
						</div>
						<p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.description}</p>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-1 text-sm text-muted-foreground">
							<Users className="w-4 h-4" />
							<span>{event.attendees} going</span>
						</div>
						<div className="flex items-center space-x-1 text-sm text-muted-foreground">
							<Heart className="w-4 h-4" />
							<span>{event.interested} interested</span>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Button size="sm" variant="outline">
							<Heart className="w-4 h-4 mr-1" />
							Interested
						</Button>
						<Button size="sm">Going</Button>
					</div>
				</div>
			</CardHeader>
		</Card>
	);

	const SidebarFilter = () => (
		<div className="space-y-6">
			{/* Search */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
				<Input placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
			</div>

			{/* Date Filter */}
			<div>
				<h3 className="font-semibold mb-3">When</h3>
				<div className="space-y-2">
					{dateFilters.map((filter) => (
						<Button key={filter} variant={selectedDateFilter === filter ? "default" : "ghost"} size="sm" className="w-full justify-start" onClick={() => setSelectedDateFilter(filter)}>
							{filter}
						</Button>
					))}
				</div>
			</div>

			{/* Categories */}
			<div>
				<h3 className="font-semibold mb-3">Categories</h3>
				<div className="space-y-2">
					{categories.map((category) => (
						<Button key={category} variant={selectedCategory === category ? "default" : "ghost"} size="sm" className="w-full justify-start" onClick={() => setSelectedCategory(category)}>
							{category}
						</Button>
					))}
				</div>
			</div>

			{/* Price Filter */}
			<div>
				<h3 className="font-semibold mb-3">Price</h3>
				<div className="space-y-2">
					<Button variant="ghost" size="sm" className="w-full justify-start">
						Free
					</Button>
					<Button variant="ghost" size="sm" className="w-full justify-start">
						Paid
					</Button>
				</div>
			</div>

			{/* Location */}
			<div>
				<h3 className="font-semibold mb-3">Location</h3>
				<div className="space-y-2">
					<Button variant="ghost" size="sm" className="w-full justify-start">
						<Globe className="w-4 h-4 mr-2" />
						Online Events
					</Button>
					<Button variant="ghost" size="sm" className="w-full justify-start">
						<MapPin className="w-4 h-4 mr-2" />
						In Person
					</Button>
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
				<div className="container px-4 py-16 mx-auto">
					<div className="mx-auto max-w-4xl text-center">
						<div className="flex justify-center items-center mb-4">
							<Calendar className="mr-3 w-8 h-8" />
							<h1 className="text-4xl font-bold">Local Events</h1>
						</div>
						<p className="mb-8 text-xl text-primary-foreground/90">Discover amazing events happening in your area. From networking to entertainment, find your next adventure.</p>

						{/* Quick Actions */}
						<div className="flex flex-col gap-4 justify-center sm:flex-row">
							<Button className="bg-white text-primary hover:bg-white/90">
								<Plus className="mr-2 w-4 h-4" />
								Create Event
							</Button>
							<Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
								<Calendar className="mr-2 w-4 h-4" />
								My Events
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container px-4 py-8 mx-auto">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Sidebar */}
					<div className="lg:w-80 flex-shrink-0">
						<div className="sticky top-24">
							<SidebarFilter />
						</div>
					</div>

					{/* Main Content Area */}
					<div className="flex-1">
						{/* Event Categories */}
						<div className="flex flex-wrap gap-2 mb-8">
							{categories.slice(1).map((category) => (
								<Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)}>
									{category}
								</Button>
							))}
						</div>

						{/* Events Grid */}
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
							{filteredEvents.map((event) => (
								<EventCard key={event.id} event={event} />
							))}
						</div>

						{filteredEvents.length === 0 && (
							<div className="text-center py-12">
								<Calendar className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
								<h3 className="text-lg font-semibold mb-2">No events found</h3>
								<p className="text-muted-foreground mb-4">Try adjusting your search criteria or browse all events.</p>
								<Button
									onClick={() => {
										setSearchQuery("");
										setSelectedCategory("All Events");
									}}
								>
									Browse All Events
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Call to Action */}
			<div className="mt-16 text-center">
				<Card className="mx-auto max-w-2xl bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
					<CardContent className="p-8">
						<h3 className="mb-4 text-2xl font-bold">Host Your Own Event</h3>
						<p className="mb-6 text-muted-foreground">Ready to bring people together? Create an event and start building your community.</p>
						<div className="flex flex-col gap-4 justify-center sm:flex-row">
							<Button className="bg-primary hover:bg-primary/90">
								<Plus className="mr-2 w-4 h-4" />
								Create Event
							</Button>
							<Button variant="outline">
								<Calendar className="mr-2 w-4 h-4" />
								Learn More
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
