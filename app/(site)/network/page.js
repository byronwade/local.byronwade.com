"use client";
import { useState } from "react";
import { Users, Calendar, MessageCircle, MapPin, Building, Star, Plus, Search, Filter, UserPlus, Handshake, GraduationCap, Briefcase, Globe, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

// Networking data
const networkingData = {
	businessOwners: [
		{
			id: "1",
			name: "Sarah Johnson",
			business: "Wade's Plumbing & Septic",
			avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop",
			industry: "Plumbing",
			location: "Springfield, IL",
			experience: "15 years",
			rating: 4.9,
			bio: "Family-owned plumbing business serving Springfield for over 15 years. Passionate about quality service and community involvement.",
			skills: ["Emergency Plumbing", "Commercial Services", "Customer Service"],
			interests: ["Business Growth", "Community Service", "Mentorship"],
			isVerified: true,
			isOnline: true,
			connections: 127,
		},
		{
			id: "2",
			name: "Mike Chen",
			business: "Springfield Auto Care",
			avatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop",
			industry: "Automotive",
			location: "Springfield, IL",
			experience: "8 years",
			rating: 4.8,
			bio: "Certified automotive technician with expertise in modern vehicle diagnostics and repair. Committed to honest, reliable service.",
			skills: ["Vehicle Diagnostics", "Engine Repair", "Customer Relations"],
			interests: ["Technology", "Training", "Networking"],
			isVerified: true,
			isOnline: false,
			connections: 89,
		},
		{
			id: "3",
			name: "Lisa Rodriguez",
			business: "Beauty & Style Salon",
			avatar: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=100&fit=crop",
			industry: "Beauty",
			location: "Springfield, IL",
			experience: "12 years",
			rating: 4.7,
			bio: "Licensed cosmetologist specializing in modern hair styling and beauty treatments. Building a community of confident clients.",
			skills: ["Hair Styling", "Color Techniques", "Business Management"],
			interests: ["Fashion Trends", "Business Development", "Women in Business"],
			isVerified: true,
			isOnline: true,
			connections: 156,
		},
	],
	industryGroups: [
		{
			id: "1",
			name: "Springfield Restaurant Association",
			description: "Connect with local restaurant owners, share best practices, and stay updated on industry trends.",
			avatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop",
			members: 45,
			industry: "Restaurant",
			location: "Springfield, IL",
			meetings: "Monthly",
			topics: ["Menu Development", "Staff Training", "Marketing Strategies"],
			isPrivate: false,
		},
		{
			id: "2",
			name: "Local Service Professionals",
			description: "Network with service-based businesses including plumbing, electrical, HVAC, and more.",
			avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop",
			members: 78,
			industry: "Services",
			location: "Springfield, IL",
			meetings: "Bi-weekly",
			topics: ["Service Quality", "Customer Retention", "Emergency Response"],
			isPrivate: false,
		},
		{
			id: "3",
			name: "Women Business Owners Network",
			description: "Supporting and empowering women entrepreneurs in the Springfield area.",
			avatar: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=100&fit=crop",
			members: 32,
			industry: "All Industries",
			location: "Springfield, IL",
			meetings: "Monthly",
			topics: ["Leadership", "Work-Life Balance", "Business Growth"],
			isPrivate: true,
		},
	],
	meetups: [
		{
			id: "1",
			title: "Springfield Business Mixer",
			description: "Monthly networking event for local business owners. Food, drinks, and great conversation!",
			date: "2024-02-15",
			time: "6:00 PM",
			location: "Springfield Chamber of Commerce",
			address: "123 Main St, Springfield, IL",
			attendees: 45,
			maxAttendees: 60,
			organizer: "Springfield Chamber",
			organizerAvatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&h=50&fit=crop",
			cost: "Free",
			topics: ["Networking", "Business Development", "Community"],
		},
		{
			id: "2",
			title: "Digital Marketing Workshop",
			description: "Learn the latest digital marketing strategies for local businesses.",
			date: "2024-02-20",
			time: "2:00 PM",
			location: "Springfield Public Library",
			address: "456 Oak Ave, Springfield, IL",
			attendees: 28,
			maxAttendees: 40,
			organizer: "Digital Marketing Experts",
			organizerAvatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=50&h=50&fit=crop",
			cost: "$25",
			topics: ["Digital Marketing", "Social Media", "SEO"],
		},
		{
			id: "3",
			title: "Restaurant Industry Roundtable",
			description: "Discussion on current challenges and opportunities in the restaurant industry.",
			date: "2024-02-25",
			time: "4:00 PM",
			location: "Local Restaurant Association",
			address: "789 Pine St, Springfield, IL",
			attendees: 15,
			maxAttendees: 25,
			organizer: "Restaurant Association",
			organizerAvatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=50&h=50&fit=crop",
			cost: "Free",
			topics: ["Restaurant Management", "Industry Trends", "Supply Chain"],
		},
	],
	mentorshipPrograms: [
		{
			id: "1",
			title: "Startup Mentorship Program",
			description: "Connect with experienced business owners who can guide you through the early stages of your business.",
			mentors: 12,
			mentees: 8,
			duration: "6 months",
			commitment: "2 hours/month",
			topics: ["Business Planning", "Financial Management", "Marketing"],
			requirements: ["Business Plan", "Commitment to Growth", "Active Participation"],
		},
		{
			id: "2",
			title: "Industry-Specific Mentoring",
			description: "Get mentored by experts in your specific industry for targeted guidance and advice.",
			mentors: 8,
			mentees: 15,
			duration: "3 months",
			commitment: "1 hour/month",
			topics: ["Industry Best Practices", "Technical Skills", "Business Operations"],
			requirements: ["Industry Experience", "Clear Goals", "Openness to Learning"],
		},
		{
			id: "3",
			title: "Women in Business Mentorship",
			description: "Supporting women entrepreneurs with mentorship from successful female business leaders.",
			mentors: 6,
			mentees: 10,
			duration: "12 months",
			commitment: "3 hours/month",
			topics: ["Leadership", "Work-Life Balance", "Business Growth"],
			requirements: ["Women-Owned Business", "Growth Mindset", "Community Involvement"],
		},
	],
};

const industries = ["All", "Plumbing", "Automotive", "Beauty", "Restaurant", "Services", "All Industries"];

export default function NetworkPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedIndustry, setSelectedIndustry] = useState("All");
	const [activeTab, setActiveTab] = useState("owners");

	const filteredData = (data) => {
		return data.filter((item) => {
			const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.business?.toLowerCase().includes(searchQuery.toLowerCase()) || item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesIndustry = selectedIndustry === "All" || item.industry === selectedIndustry;
			return matchesSearch && matchesIndustry;
		});
	};

	const BusinessOwnerCard = ({ owner }) => (
		<Card className="transition-all duration-300 group hover:shadow-lg">
			<CardHeader className="pb-4">
				<div className="flex items-start space-x-4">
					<div className="relative">
						<Image src={owner.avatar} alt={owner.name} width={80} height={80} className="object-cover w-20 h-20 rounded-full" />
						{owner.isOnline && <div className="absolute right-0 bottom-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />}
					</div>
					<div className="flex-1">
						<div className="flex items-center mb-1 space-x-2">
							<CardTitle className="text-lg">{owner.name}</CardTitle>
							{owner.isVerified && (
								<Badge variant="secondary" className="text-xs">
									Verified
								</Badge>
							)}
						</div>
						<CardDescription className="text-sm font-medium">{owner.business}</CardDescription>
						<div className="flex items-center space-x-2 text-sm text-muted-foreground">
							<MapPin className="w-4 h-4" />
							<span>{owner.location}</span>
							<span>•</span>
							<span>{owner.experience} experience</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<p className="mb-4 text-sm text-muted-foreground line-clamp-2">{owner.bio}</p>

				<div className="space-y-3">
					<div>
						<h4 className="mb-2 text-sm font-medium">Skills</h4>
						<div className="flex flex-wrap gap-1">
							{owner.skills.map((skill, index) => (
								<Badge key={index} variant="outline" className="text-xs">
									{skill}
								</Badge>
							))}
						</div>
					</div>

					<div>
						<h4 className="mb-2 text-sm font-medium">Interests</h4>
						<div className="flex flex-wrap gap-1">
							{owner.interests.map((interest, index) => (
								<Badge key={index} variant="secondary" className="text-xs">
									{interest}
								</Badge>
							))}
						</div>
					</div>

					<div className="flex justify-between items-center pt-2">
						<div className="flex items-center space-x-2 text-sm text-muted-foreground">
							<Users className="w-4 h-4" />
							<span>{owner.connections} connections</span>
						</div>
						<div className="flex items-center space-x-2">
							<Button size="sm" variant="outline">
								<MessageCircle className="mr-1 w-4 h-4" />
								Message
							</Button>
							<Button size="sm">
								<UserPlus className="mr-1 w-4 h-4" />
								Connect
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	const GroupCard = ({ group }) => (
		<Card className="transition-all duration-300 group hover:shadow-lg">
			<CardHeader className="pb-4">
				<div className="flex items-start space-x-4">
					<Image src={group.avatar} alt={group.name} width={60} height={60} className="object-cover rounded-lg w-15 h-15" />
					<div className="flex-1">
						<div className="flex items-center mb-1 space-x-2">
							<CardTitle className="text-lg">{group.name}</CardTitle>
							{group.isPrivate && (
								<Badge variant="secondary" className="text-xs">
									Private
								</Badge>
							)}
						</div>
						<CardDescription className="text-sm">{group.description}</CardDescription>
						<div className="flex items-center mt-2 space-x-2 text-sm text-muted-foreground">
							<Users className="w-4 h-4" />
							<span>{group.members} members</span>
							<span>•</span>
							<span>{group.meetings}</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					<div>
						<h4 className="mb-2 text-sm font-medium">Topics</h4>
						<div className="flex flex-wrap gap-1">
							{group.topics.map((topic, index) => (
								<Badge key={index} variant="outline" className="text-xs">
									{topic}
								</Badge>
							))}
						</div>
					</div>

					<Button className="w-full">
						<Users className="mr-2 w-4 h-4" />
						Join Group
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	const MeetupCard = ({ meetup }) => (
		<Card className="transition-all duration-300 group hover:shadow-lg">
			<CardHeader className="pb-4">
				<CardTitle className="text-lg">{meetup.title}</CardTitle>
				<CardDescription className="text-sm">{meetup.description}</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					<div className="flex items-center space-x-2 text-sm text-muted-foreground">
						<Calendar className="w-4 h-4" />
						<span>
							{new Date(meetup.date).toLocaleDateString()} at {meetup.time}
						</span>
					</div>

					<div className="flex items-center space-x-2 text-sm text-muted-foreground">
						<MapPin className="w-4 h-4" />
						<span>{meetup.location}</span>
					</div>

					<div className="flex items-center space-x-4 text-sm">
						<div className="flex items-center space-x-1">
							<Users className="w-4 h-4 text-muted-foreground" />
							<span className="text-muted-foreground">
								{meetup.attendees}/{meetup.maxAttendees}
							</span>
						</div>
						<div className="flex items-center space-x-1">
							<Badge variant={meetup.cost === "Free" ? "secondary" : "default"}>{meetup.cost}</Badge>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<Image src={meetup.organizerAvatar} alt={meetup.organizer} width={24} height={24} className="w-6 h-6 rounded-full" />
						<span className="text-sm text-muted-foreground">Organized by {meetup.organizer}</span>
					</div>

					<Button className="w-full">
						<Calendar className="mr-2 w-4 h-4" />
						RSVP
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	const MentorshipCard = ({ program }) => (
		<Card className="transition-all duration-300 group hover:shadow-lg">
			<CardHeader className="pb-4">
				<CardTitle className="text-lg">{program.title}</CardTitle>
				<CardDescription className="text-sm">{program.description}</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-muted-foreground">Mentors:</span>
							<span className="ml-2 font-medium">{program.mentors}</span>
						</div>
						<div>
							<span className="text-muted-foreground">Mentees:</span>
							<span className="ml-2 font-medium">{program.mentees}</span>
						</div>
						<div>
							<span className="text-muted-foreground">Duration:</span>
							<span className="ml-2 font-medium">{program.duration}</span>
						</div>
						<div>
							<span className="text-muted-foreground">Commitment:</span>
							<span className="ml-2 font-medium">{program.commitment}</span>
						</div>
					</div>

					<div>
						<h4 className="mb-2 text-sm font-medium">Topics Covered</h4>
						<div className="flex flex-wrap gap-1">
							{program.topics.map((topic, index) => (
								<Badge key={index} variant="outline" className="text-xs">
									{topic}
								</Badge>
							))}
						</div>
					</div>

					<Button className="w-full">
						<GraduationCap className="mr-2 w-4 h-4" />
						Apply for Mentorship
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
				<div className="container px-4 py-16 mx-auto">
					<div className="mx-auto max-w-4xl text-center">
						<div className="flex justify-center items-center mb-4">
							<Handshake className="mr-3 w-8 h-8" />
							<h1 className="text-4xl font-bold">Local Business Networking</h1>
						</div>
						<p className="mb-8 text-xl text-primary-foreground/90">Connect with fellow business owners, join industry groups, attend meetups, and find mentorship opportunities.</p>

						{/* Search and Filter */}
						<div className="flex flex-col gap-4 mx-auto max-w-2xl sm:flex-row">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 w-5 h-5 transform -translate-y-1/2 text-muted-foreground" />
								<input type="text" placeholder="Search business owners, groups, or events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="py-3 pr-4 pl-10 w-full rounded-lg border backdrop-blur-sm bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50" />
							</div>
							<select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)} className="px-4 py-3 rounded-lg border backdrop-blur-sm bg-background/10 border-primary-foreground/20 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50">
								{industries.map((industry) => (
									<option key={industry} value={industry}>
										{industry}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* Content Tabs */}
			<div className="container px-4 py-8 mx-auto">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid grid-cols-4 mb-8 w-full">
						<TabsTrigger value="owners" className="flex items-center space-x-2">
							<Users className="w-4 h-4" />
							<span>Business Owners</span>
						</TabsTrigger>
						<TabsTrigger value="groups" className="flex items-center space-x-2">
							<Building className="w-4 h-4" />
							<span>Industry Groups</span>
						</TabsTrigger>
						<TabsTrigger value="meetups" className="flex items-center space-x-2">
							<Calendar className="w-4 h-4" />
							<span>Meetups</span>
						</TabsTrigger>
						<TabsTrigger value="mentorship" className="flex items-center space-x-2">
							<GraduationCap className="w-4 h-4" />
							<span>Mentorship</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="owners">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filteredData(networkingData.businessOwners).map((owner) => (
								<BusinessOwnerCard key={owner.id} owner={owner} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="groups">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filteredData(networkingData.industryGroups).map((group) => (
								<GroupCard key={group.id} group={group} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="meetups">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filteredData(networkingData.meetups).map((meetup) => (
								<MeetupCard key={meetup.id} meetup={meetup} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="mentorship">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filteredData(networkingData.mentorshipPrograms).map((program) => (
								<MentorshipCard key={program.id} program={program} />
							))}
						</div>
					</TabsContent>
				</Tabs>

				{/* Call to Action */}
				<div className="mt-16 text-center">
					<Card className="mx-auto max-w-2xl bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
						<CardContent className="p-8">
							<h3 className="mb-4 text-2xl font-bold">Get Involved</h3>
							<p className="mb-6 text-muted-foreground">Ready to expand your network? Create your business profile, join groups, or organize your own meetup.</p>
							<div className="flex flex-col gap-4 justify-center sm:flex-row">
								<Button className="bg-primary hover:bg-primary/90">
									<UserPlus className="mr-2 w-4 h-4" />
									Create Profile
								</Button>
								<Button variant="outline">
									<Plus className="mr-2 w-4 h-4" />
									Organize Meetup
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
