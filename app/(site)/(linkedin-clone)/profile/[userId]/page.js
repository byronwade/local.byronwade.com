"use client";

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Check, MessageSquare, UserPlus, Users, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data - In a real app, you'd fetch this based on params.userId
const allUsers = {
	"byron-wade": {
		id: "byron-wade",
		name: "Byron Wade",
		title: "Founder & CEO at Thorbis",
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face",
		coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=400&fit=crop",
		followersCount: 1250,
		followingCount: 300,
		followers: ["sarah-johnson", "mike-chen", "emily-carter"],
		following: ["david-lee", "emily-carter"],
		location: "Springfield, USA",
		businessName: "Thorbis",
		businessWebsite: "thorbis.com",
		about: "Visionary leader and entrepreneur with a passion for building innovative solutions that empower local businesses. Experienced in product development, strategic planning, and team leadership. Committed to fostering a culture of collaboration and excellence.",
		posts: [{ id: "post3", content: "Excited to announce our new partnership with Springfield Chamber of Commerce! Together, we'll be providing more resources and support for local entrepreneurs. #LocalBusiness #Community #Growth", timestamp: "3d ago", likes: 45, comments: 12 }],
		skills: ["Leadership", "Product Management", "SaaS", "Entrepreneurship", "Strategic Planning"],
	},
	"sarah-johnson": {
		id: "sarah-johnson",
		name: "Sarah Johnson",
		title: "Owner, Wade's Plumbing & Septic",
		avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop",
		coverImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c9f?w=1600&h=400&fit=crop",
		followersCount: 450,
		followingCount: 150,
		followers: ["byron-wade", "mike-chen"],
		following: ["byron-wade"],
		location: "Springfield, USA",
		businessName: "Wade's Plumbing & Septic",
		businessWebsite: "wadesplumbing.com",
		about: "Dedicated and licensed plumber with over 15 years of experience serving the Springfield community. I specialize in residential and commercial plumbing solutions, from emergency repairs to full-scale installations. Customer satisfaction is my top priority.",
		posts: [{ id: "post1", content: "Just launched a new emergency plumbing service for the Springfield area! We're available 24/7 to handle any unexpected issues. We're committed to providing fast, reliable service to our community. #Plumbing #LocalBusiness #Springfield", timestamp: "2h ago", likes: 15, comments: 3 }],
		skills: ["Plumbing", "Customer Service", "Emergency Repairs", "Pipe Fitting", "Project Estimation"],
	},
	"mike-chen": {
		id: "mike-chen",
		name: "Mike Chen",
		title: "Owner, Springfield Auto Care",
		avatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop",
		coverImage: "https://images.unsplash.com/photo-1533106418989-88406e76827a?w=1600&h=400&fit=crop",
		followersCount: 320,
		followingCount: 95,
		followers: ["byron-wade"],
		following: ["byron-wade", "sarah-johnson"],
		location: "Springfield, USA",
		businessName: "Springfield Auto Care",
		businessWebsite: "springfieldautocare.com",
		about: "ASE-certified mechanic and auto shop owner with a focus on honest, high-quality vehicle maintenance and repair. Passionate about cars and helping people keep their vehicles running smoothly and safely.",
		posts: [{ id: "post2", content: "Looking for recommendations for a local marketing agency to help us with a new branding campaign. Any suggestions for agencies that specialize in working with automotive businesses?", timestamp: "1d ago", likes: 8, comments: 5 }],
		skills: ["Automotive Repair", "Vehicle Diagnostics", "ASE Certified", "Customer Relations", "Shop Management"],
	},
	"david-lee": {
		id: "david-lee",
		name: "David Lee",
		title: "Lee's Landscaping",
		avatar: "https://images.unsplash.com/photo-1558222218-47391912db93?w=100&h=100&fit=crop",
		coverImage: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1600&h=400&fit=crop",
		followersCount: 180,
		followingCount: 80,
		followers: ["byron-wade"],
		following: [],
		location: "Springfield, USA",
		businessName: "Lee's Landscaping",
		businessWebsite: "leeslandscaping.com",
		about: "Creating beautiful and sustainable outdoor spaces for over 10 years. From landscape design to regular maintenance, my team and I are dedicated to bringing your vision to life.",
		posts: [],
		skills: ["Landscape Design", "Horticulture", "Hardscaping", "Irrigation Systems", "Sustainable Landscaping"],
	},
	"emily-carter": {
		id: "emily-carter",
		name: "Emily Carter",
		title: "Carter's Cakes",
		avatar: "https://images.unsplash.com/photo-1542826438-c32144d12533?w=100&h=100&fit=crop",
		coverImage: "https://images.unsplash.com/photo-1562440102-385a855a0256?w=1600&h=400&fit=crop",
		followersCount: 800,
		followingCount: 210,
		followers: ["byron-wade"],
		following: ["byron-wade", "sarah-johnson", "mike-chen"],
		location: "Springfield, USA",
		businessName: "Carter's Cakes",
		businessWebsite: "carterscakes.com",
		about: "Self-taught baker and cake designer with a flair for creating delicious and artistic custom cakes for weddings, birthdays, and all special occasions. I love turning sweet dreams into reality!",
		posts: [],
		skills: ["Baking", "Cake Decorating", "Pastry Arts", "Custom Orders", "Event Catering"],
	},
};

export async function generateMetadata({ params }) {
	const user = allUsers[params.userId];
	if (!user) {
		return {
			title: "User Not Found",
		};
	}
	return {
		title: `${user.name} | ${user.title}`,
		description: user.about,
	};
}

const ProfileHeader = ({ user }) => {
	const [isFollowing, setIsFollowing] = useState(false);

	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				<div className="relative">
					<Image src={user.coverImage} alt="Cover image" width={1600} height={400} className="w-full h-48 object-cover" />
					<div className="absolute top-24 left-6">
						<Link href={`/profile/${user.id}`}>
							<Avatar className="w-32 h-32 border-4 border-card cursor-pointer">
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
							</Avatar>
						</Link>
					</div>
				</div>
				<div className="pt-20 pb-6 px-6">
					<div className="flex justify-between items-start">
						<div>
							<h2 className="text-2xl font-bold">{user.name}</h2>
							<p className="text-muted-foreground">{user.title}</p>
							<Link href={`/biz/${user.businessName.toLowerCase().replace(/\s/g, "-")}`} passHref>
								<p className="text-primary font-semibold hover:underline cursor-pointer">{user.businessName}</p>
							</Link>
							<div className="flex items-center text-sm text-muted-foreground mt-2 gap-4">
								<span className="flex items-center gap-1.5">
									<MapPin className="w-4 h-4" /> {user.location}
								</span>
								<Link href="#followers" className="text-primary hover:underline flex items-center gap-1.5">
									<Users className="w-4 h-4" /> {user.followersCount} followers
								</Link>
								<Link href="#following" className="text-primary hover:underline flex items-center gap-1.5">
									{user.followingCount} following
								</Link>
							</div>
						</div>
						<div className="flex gap-2">
							<Button variant="outline">
								<MessageSquare className="w-4 h-4 mr-2" /> Message
							</Button>
							<Button variant={isFollowing ? "secondary" : "default"} onClick={() => setIsFollowing(!isFollowing)}>
								{isFollowing ? <Check className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
								{isFollowing ? "Following" : "Follow"}
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const UserListItem = ({ userId }) => {
	const user = allUsers[userId];
	const [isFollowing, setIsFollowing] = useState(false); // This should ideally be based on the current user's following list
	if (!user) return null;
	return (
		<div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
			<div className="flex items-center gap-3">
				<Link href={`/profile/${user.id}`}>
					<Avatar className="w-12 h-12">
						<AvatarImage src={user.avatar} />
						<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
					</Avatar>
				</Link>
				<div>
					<Link href={`/profile/${user.id}`}>
						<p className="font-semibold hover:underline">{user.name}</p>
					</Link>
					<p className="text-sm text-muted-foreground">{user.title}</p>
				</div>
			</div>
			<Button variant={isFollowing ? "secondary" : "outline"} size="sm" onClick={() => setIsFollowing(!isFollowing)}>
				{isFollowing ? "Following" : "Follow"}
			</Button>
		</div>
	);
};

const UserListCard = ({ userIds, title }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				{userIds.map((id) => (
					<UserListItem key={id} userId={id} />
				))}
			</CardContent>
		</Card>
	);
};

const PostCard = ({ post }) => (
	<Card>
		<CardHeader>
			<p className="text-sm text-muted-foreground">{post.timestamp}</p>
		</CardHeader>
		<CardContent>
			<p className="whitespace-pre-wrap">{post.content}</p>
		</CardContent>
		<CardFooter className="flex gap-4 text-sm text-muted-foreground">
			<span>{post.likes} Likes</span>
			<span>{post.comments} Comments</span>
		</CardFooter>
	</Card>
);

const AboutCard = ({ user }) => (
	<Card>
		<CardHeader>
			<CardTitle>About</CardTitle>
		</CardHeader>
		<CardContent className="space-y-4">
			<p className="text-muted-foreground whitespace-pre-wrap">{user.about}</p>
			<div>
				<h3 className="font-semibold mb-2">Skills</h3>
				<div className="flex flex-wrap gap-2">
					{user.skills.map((skill) => (
						<Badge key={skill} variant="secondary">
							{skill}
						</Badge>
					))}
				</div>
			</div>
		</CardContent>
	</Card>
);

export default function ProfilePage({ params }) {
	const user = allUsers[params.userId];

	if (!user) {
		return <div className="text-center py-10">User not found.</div>;
	}

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		mainEntity: {
			"@type": "Person",
			name: user.name,
			alternateName: user.id,
			jobTitle: user.title,
			description: user.about,
			image: user.avatar,
			url: `https://local.byronwade.com/profile/${user.id}`,
			worksFor: {
				"@type": "Organization",
				name: user.businessName,
			},
			skill: user.skills,
			location: {
				"@type": "Place",
				address: user.location,
			},
			interactionStatistic: [
				{
					"@type": "InteractionCounter",
					interactionType: "https://schema.org/FollowAction",
					userInteractionCount: user.followersCount,
				},
				{
					"@type": "InteractionCounter",
					interactionType: "https://schema.org/FollowAction",
					userInteractionCount: user.followingCount,
				},
			],
		},
	};

	return (
		<div className="bg-muted/40">
			<Head>
				<title>{`${user.name} | ${user.title}`}</title>
				<meta name="description" content={user.about} />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</Head>
			<main className="container mx-auto px-4 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
					<div className="md:col-span-4">
						<ProfileHeader user={user} />
					</div>
					<div className="md:col-span-4 space-y-6">
						<AboutCard user={user} />
						<div>
							<h2 className="text-2xl font-bold mb-4">Posts</h2>
							{user.posts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
						<UserListCard userIds={user.followers} title="Followers" />
						<UserListCard userIds={user.following} title="Following" />
					</div>
				</div>
			</main>
		</div>
	);
}
