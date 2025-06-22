"use client";
import { useState } from "react";
import { Trophy, Award, Users, Calendar, Star, TrendingUp, Camera, Heart, Share2, Eye, Clock, Target, Zap, Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";

// Challenges and contests data
const challenges = {
	active: [
		{
			id: "1",
			title: "Best Before & After Transformation",
			description: "Show off your most impressive business transformation. From renovations to rebrands, share your journey!",
			thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
			prize: "$5,000",
			participants: 127,
			daysLeft: 12,
			progress: 75,
			category: "Transformation",
			sponsor: "Thorbis",
			requirements: ["Before & after photos", "Story description", "Business verification"],
			deadline: "2024-02-15",
			status: "active",
		},
		{
			id: "2",
			title: "Customer Service Hero",
			description: "Share stories of exceptional customer service that went above and beyond expectations.",
			thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
			prize: "$3,000",
			participants: 89,
			daysLeft: 8,
			progress: 60,
			category: "Customer Service",
			sponsor: "Local Business Association",
			requirements: ["Customer testimonial video", "Service story", "Business verification"],
			deadline: "2024-02-11",
			status: "active",
		},
		{
			id: "3",
			title: "Most Creative Business Story",
			description: "Tell your unique business story in the most creative way possible. Video, photos, or written content accepted.",
			thumbnail: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
			prize: "$2,500",
			participants: 156,
			daysLeft: 15,
			progress: 45,
			category: "Storytelling",
			sponsor: "Creative Business Network",
			requirements: ["Creative content", "Business story", "Social media sharing"],
			deadline: "2024-02-18",
			status: "active",
		},
	],
	upcoming: [
		{
			id: "4",
			title: "Spring Business Showcase",
			description: "Highlight your spring products, services, or seasonal offerings with creative content.",
			thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
			prize: "$4,000",
			participants: 0,
			daysLeft: 25,
			progress: 0,
			category: "Seasonal",
			sponsor: "Springfield Chamber of Commerce",
			requirements: ["Spring-themed content", "Business showcase", "Local focus"],
			deadline: "2024-03-01",
			status: "upcoming",
		},
		{
			id: "5",
			title: "Innovation in Local Business",
			description: "Showcase innovative solutions, processes, or technologies that set your business apart.",
			thumbnail: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
			prize: "$6,000",
			participants: 0,
			daysLeft: 30,
			progress: 0,
			category: "Innovation",
			sponsor: "Tech Innovation Hub",
			requirements: ["Innovation demonstration", "Business impact", "Documentation"],
			deadline: "2024-03-06",
			status: "upcoming",
		},
	],
	featured: [
		{
			id: "6",
			title: "Weekly Featured Business",
			description: "Get featured on our homepage and social media for a week. Open to all verified businesses.",
			thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
			prize: "Featured placement",
			participants: 234,
			daysLeft: 3,
			progress: 90,
			category: "Featured",
			sponsor: "Thorbis",
			requirements: ["Business verification", "Quality photos", "Complete profile"],
			deadline: "2024-02-06",
			status: "featured",
		},
	],
};

const categories = ["All", "Transformation", "Customer Service", "Storytelling", "Seasonal", "Innovation", "Featured"];

export default function ChallengesPage() {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [activeTab, setActiveTab] = useState("active");

	const filteredChallenges = (challengeList) => {
		return challengeList.filter((challenge) => {
			return selectedCategory === "All" || challenge.category === selectedCategory;
		});
	};

	const ChallengeCard = ({ challenge }) => (
		<Card className="transition-all duration-300 cursor-pointer group hover:shadow-lg">
			<div className="overflow-hidden relative rounded-t-lg">
				<Image src={challenge.thumbnail} alt={challenge.title} width={400} height={300} className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105" />
				<div className="absolute inset-0 transition-colors duration-300 bg-black/20 group-hover:bg-black/10" />
				<div className="flex absolute top-3 left-3 items-center space-x-2">
					<Badge variant="secondary" className="bg-background/90 text-foreground">
						{challenge.category}
					</Badge>
					{challenge.status === "active" && <Badge className="text-white bg-green-500">Active</Badge>}
					{challenge.status === "upcoming" && <Badge className="text-white bg-blue-500">Upcoming</Badge>}
					{challenge.status === "featured" && <Badge className="text-white bg-purple-500">Featured</Badge>}
				</div>
				<div className="flex absolute right-3 bottom-3 items-center space-x-2 text-white">
					<Trophy className="w-4 h-4" />
					<span className="text-sm font-medium">{challenge.prize}</span>
				</div>
			</div>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg transition-colors line-clamp-2 group-hover:text-primary">{challenge.title}</CardTitle>
				<CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-4">
					{/* Progress and Stats */}
					<div className="space-y-2">
						<div className="flex justify-between items-center text-sm">
							<span className="text-muted-foreground">Progress</span>
							<span className="font-medium">{challenge.progress}%</span>
						</div>
						<Progress value={challenge.progress} className="h-2" />
					</div>

					{/* Stats */}
					<div className="flex justify-between items-center text-sm">
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-1">
								<Users className="w-4 h-4 text-muted-foreground" />
								<span className="text-muted-foreground">{challenge.participants}</span>
							</div>
							<div className="flex items-center space-x-1">
								<Clock className="w-4 h-4 text-muted-foreground" />
								<span className="text-muted-foreground">{challenge.daysLeft} days left</span>
							</div>
						</div>
						<div className="flex items-center space-x-1">
							<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
							<span className="text-muted-foreground">Sponsored by {challenge.sponsor}</span>
						</div>
					</div>

					{/* Requirements */}
					<div className="space-y-2">
						<h4 className="text-sm font-medium">Requirements:</h4>
						<ul className="space-y-1 text-xs text-muted-foreground">
							{challenge.requirements.map((req, index) => (
								<li key={index} className="flex items-center space-x-1">
									<Target className="w-3 h-3" />
									<span>{req}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Action Button */}
					<Button className="w-full" variant={challenge.status === "upcoming" ? "outline" : "default"}>
						{challenge.status === "upcoming" ? "Get Notified" : "Enter Challenge"}
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
							<Trophy className="mr-3 w-8 h-8" />
							<h1 className="text-4xl font-bold">Business Challenges & Contests</h1>
						</div>
						<p className="mb-8 text-xl text-primary-foreground/90">Compete with other local businesses, showcase your expertise, and win amazing prizes!</p>

						{/* Category Filter */}
						<div className="flex flex-wrap gap-2 justify-center">
							{categories.map((category) => (
								<Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className="backdrop-blur-sm bg-background/10 border-primary-foreground/20 text-primary-foreground hover:bg-background/20">
									{category}
								</Button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Content Tabs */}
			<div className="container px-4 py-8 mx-auto">
				<div className="flex flex-wrap gap-4 mb-8">
					<Button variant={activeTab === "active" ? "default" : "outline"} onClick={() => setActiveTab("active")} className="flex items-center space-x-2">
						<Zap className="w-4 h-4" />
						<span>Active Challenges</span>
					</Button>
					<Button variant={activeTab === "upcoming" ? "default" : "outline"} onClick={() => setActiveTab("upcoming")} className="flex items-center space-x-2">
						<Calendar className="w-4 h-4" />
						<span>Upcoming</span>
					</Button>
					<Button variant={activeTab === "featured" ? "default" : "outline"} onClick={() => setActiveTab("featured")} className="flex items-center space-x-2">
						<Crown className="w-4 h-4" />
						<span>Featured</span>
					</Button>
				</div>

				{/* Challenges Grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{activeTab === "active" && filteredChallenges(challenges.active).map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
					{activeTab === "upcoming" && filteredChallenges(challenges.upcoming).map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
					{activeTab === "featured" && filteredChallenges(challenges.featured).map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
				</div>

				{/* Call to Action */}
				<div className="mt-16 text-center">
					<Card className="mx-auto max-w-2xl bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
						<CardContent className="p-8">
							<h3 className="mb-4 text-2xl font-bold">Create Your Own Challenge</h3>
							<p className="mb-6 text-muted-foreground">Want to sponsor a challenge or contest? Partner with us to create engaging content campaigns for your business or organization.</p>
							<div className="flex flex-col gap-4 justify-center sm:flex-row">
								<Button className="bg-primary hover:bg-primary/90">
									<Trophy className="mr-2 w-4 h-4" />
									Sponsor a Challenge
								</Button>
								<Button variant="outline">
									<Users className="mr-2 w-4 h-4" />
									Partner with Us
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
