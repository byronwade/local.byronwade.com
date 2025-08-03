"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Calendar, MapPin, Clock, Users, Search, Filter, Plus, Heart, Share2, Bookmark, MoreHorizontal, ChevronDown, Star, Tag, Globe, Lock, Music, Camera, Coffee, ShoppingBag, GraduationCap, Heart as HeartIcon, MessageCircle, ExternalLink } from "lucide-react";
import Image from "next/image";

// Transform Supabase event data to component format
function transformEventData(supabaseEvents) {
	return supabaseEvents.map((event) => {
		const startDate = new Date(event.start_date);
		const eventCategory = event.tags && event.tags.length > 0 ? event.tags[0] : "General";

		return {
			id: event.id,
			title: event.title,
			description: event.description,
			date: event.start_date.split("T")[0], // Get just the date part
			time: startDate.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}),
			location: event.venue || event.location,
			address: event.location,
			category: eventCategory,
			organizer: event.organizer?.name || "Event Organizer",
			organizerAvatar: event.organizer?.avatar_url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
			image: event.featured_image || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
			attendees: event.current_attendees || 0,
			interested: Math.floor((event.current_attendees || 0) * 1.5), // Estimate interested people
			price: event.price === "0" || !event.price ? "Free" : `$${event.price}`,
			isOnline: event.is_virtual,
			isVerified: true, // Assume all events in database are verified
			tags: event.tags || [eventCategory],
			distance: "Local area", // Default distance
			slug: event.slug,
			currency: event.currency,
			maxAttendees: event.max_attendees,
			virtualUrl: event.virtual_url,
			endDate: event.end_date,
		};
	});
}

const categories = ["All Events", "Networking", "Food & Drink", "Music", "Technology", "Health & Wellness", "Arts & Culture", "Sports", "Education", "Family"];
const dateFilters = ["Today", "This Week", "This Weekend", "Next Week", "This Month"];

// Memoized Event Card Component
const EventCard = React.memo(({ event }) => (
	<Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
		<div className="relative overflow-hidden rounded-t-lg">
			<Image
				src={event.image}
				alt={event.title}
				width={400}
				height={300}
				className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
				priority={event.id <= 2} // Prioritize first 2 images
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			/>
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
));

EventCard.displayName = "EventCard";

// Memoized Sidebar Filter Component
const SidebarFilter = React.memo(({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedDateFilter, setSelectedDateFilter }) => (
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
));

SidebarFilter.displayName = "SidebarFilter";

export default function EventsClient({ initialEvents = [] }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All Events");
	const [selectedDateFilter, setSelectedDateFilter] = useState("This Week");

	// Transform and memoize events data
	const transformedEvents = useMemo(() => {
		return transformEventData(initialEvents);
	}, [initialEvents]);

	// Memoized filtered events to prevent unnecessary recalculations
	const filteredEvents = useMemo(() => {
		return transformedEvents.filter((event) => {
			const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase()) || event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === "All Events" || event.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	}, [transformedEvents, searchQuery, selectedCategory]);

	// Memoized handlers
	const handleResetFilters = useCallback(() => {
		setSearchQuery("");
		setSelectedCategory("All Events");
	}, []);

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
							<SidebarFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedDateFilter={selectedDateFilter} setSelectedDateFilter={setSelectedDateFilter} />
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
								<Button onClick={handleResetFilters}>Browse All Events</Button>
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
