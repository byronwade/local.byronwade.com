"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Check, X, Users, Building, Calendar, Rss, Handshake, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";

const networkManagementData = {
	currentUser: {
		id: "byron-wade",
	},
	users: [
		{ id: "sarah-johnson", name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop", headline: "Owner, Wade's Plumbing & Septic", followed: true },
		{ id: "mike-chen", name: "Mike Chen", avatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop", headline: "Owner, Springfield Auto Care", followed: false },
		{ id: "david-lee", name: "David Lee", avatar: "https://images.unsplash.com/photo-1558222218-47391912db93?w=100&h=100&fit=crop", headline: "Creating beautiful landscapes for over 10 years.", followed: true },
		{ id: "emily-carter", name: "Emily Carter", avatar: "https://images.unsplash.com/photo-1542826438-c32144d12533?w=100&h=100&fit=crop", headline: "Custom cakes for all occasions.", followed: false },
		{ id: "jessica-davis", name: "Jessica Davis", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", headline: "Freelance Graphic Designer", followed: true },
	],
	pages: [
		{ id: "wades-plumbing", name: "Wade's Plumbing & Septic", avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop", followers: 125, followed: true },
		{ id: "springfield-auto", name: "Springfield Auto Care", avatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop", followers: 89, followed: false },
	],
	events: [
		{ id: "1", title: "Springfield Business Mixer", date: "2024-08-15", attendees: 50 },
		{ id: "2", title: "Digital Marketing Workshop", date: "2024-08-20", attendees: 32 },
	],
	invitations: [
		{ id: "6", name: "Jessica Miller", headline: "Marketing Director at Creative Solutions", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286de2?w=100&h=100&fit=crop", mutual: 5 },
		{ id: "7", name: "Chris Brown", headline: "Lead Developer at Tech Innovators", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", mutual: 2 },
	],
};

const InvitationCard = ({ invitation }) => {
	const [isHandled, setIsHandled] = useState(false);
	if (isHandled) return null;

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-3">
				<Link href={`/profile/${invitation.id}`}>
					<Avatar className="w-16 h-16">
						<AvatarImage src={invitation.avatar} />
						<AvatarFallback>{invitation.name.charAt(0)}</AvatarFallback>
					</Avatar>
				</Link>
				<div>
					<Link href={`/profile/${invitation.id}`}>
						<p className="font-semibold hover:underline">{invitation.name}</p>
					</Link>
					<p className="text-sm text-muted-foreground">{invitation.headline}</p>
					<p className="text-xs text-muted-foreground">{invitation.mutual} mutual connections</p>
				</div>
			</div>
			<div className="flex gap-2">
				<Button variant="outline" size="icon" onClick={() => setIsHandled(true)}>
					<X className="w-4 h-4" />
				</Button>
				<Button size="icon" onClick={() => setIsHandled(true)}>
					<Check className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
};

const PeopleCard = ({ person }) => {
	const [isFollowing, setIsFollowing] = useState(false);

	return (
		<Card className="text-center">
			<CardContent className="p-4">
				<Link href={`/profile/${person.id}`}>
					<Avatar className="w-20 h-20 mx-auto">
						<AvatarImage src={person.avatar} />
						<AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<p className="font-semibold mt-2 hover:underline">{person.name}</p>
				</Link>
				<p className="text-sm text-muted-foreground h-10 line-clamp-2">{person.headline}</p>
				<Button variant={isFollowing ? "secondary" : "outline"} className="w-full mt-3" onClick={() => setIsFollowing(!isFollowing)}>
					<UserPlus className="w-4 h-4 mr-2" />
					{isFollowing ? "Following" : "Follow"}
				</Button>
			</CardContent>
		</Card>
	);
};

const UserCard = ({ user }) => {
	const [isFollowing, setIsFollowing] = useState(user.followed);

	return (
		<Card className="flex items-center justify-between p-4">
			<div className="flex items-center gap-4">
				<Link href={`/profile/${user.id}`}>
					<Avatar className="w-16 h-16 cursor-pointer">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
					</Avatar>
				</Link>
				<div>
					<Link href={`/profile/${user.id}`}>
						<p className="font-semibold hover:underline cursor-pointer">{user.name}</p>
					</Link>
					<p className="text-sm text-muted-foreground">{user.headline}</p>
				</div>
			</div>
			<Button variant={isFollowing ? "secondary" : "outline"} onClick={() => setIsFollowing(!isFollowing)} disabled={isFollowing}>
				{isFollowing ? <UserCheck className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
				{isFollowing ? "Following" : "Follow"}
			</Button>
		</Card>
	);
};

const PageCard = ({ page }) => {
	const [isFollowing, setIsFollowing] = useState(page.followed);

	return (
		<Card className="flex items-center justify-between p-4">
			<div className="flex items-center gap-4">
				<Link href={`/biz/${page.id}`}>
					<Avatar className="w-16 h-16 rounded-md cursor-pointer">
						<AvatarImage src={page.avatar} alt={page.name} />
						<AvatarFallback>{page.name.charAt(0)}</AvatarFallback>
					</Avatar>
				</Link>
				<div>
					<Link href={`/biz/${page.id}`}>
						<p className="font-semibold hover:underline cursor-pointer">{page.name}</p>
					</Link>
					<p className="text-sm text-muted-foreground">{page.followers} followers</p>
				</div>
			</div>
			<Button variant={isFollowing ? "secondary" : "outline"} onClick={() => setIsFollowing(!isFollowing)}>
				{isFollowing ? <UserCheck className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
				{isFollowing ? "Following" : "Follow"}
			</Button>
		</Card>
	);
};

const EventCard = ({ event }) => (
	<Card className="p-4">
		<p className="font-semibold">{event.title}</p>
		<p className="text-sm text-muted-foreground">
			{new Date(event.date).toLocaleDateString()} • {event.attendees} attendees
		</p>
		<Button variant="outline" size="sm" className="mt-2">
			View Event
		</Button>
	</Card>
);

export default function ManageNetworkPage() {
	const [followers] = useState(networkManagementData.users.filter((u) => u.followed));
	const [following] = useState(networkManagementData.users.filter((u) => u.id !== networkManagementData.currentUser.id));
	const [pages] = useState(networkManagementData.pages);
	const [events] = useState(networkManagementData.events);

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
			{/* Left Column - Management Panel */}
			<div className="md:col-span-1">
				<Card>
					<CardHeader>
						<CardTitle>Manage my network</CardTitle>
					</CardHeader>
					<CardContent className="space-y-1">
						<Button variant="ghost" className="w-full justify-start gap-3">
							<Users className="w-4 h-4" /> Followers <Badge variant="secondary">{followers.length}</Badge>
						</Button>
						<Button variant="ghost" className="w-full justify-start gap-3">
							<UserCheck className="w-4 h-4" /> Following <Badge variant="secondary">{following.length}</Badge>
						</Button>
						<Button variant="ghost" className="w-full justify-start gap-3">
							<Building className="w-4 h-4" /> Pages <Badge variant="secondary">{pages.length}</Badge>
						</Button>
						<Button variant="ghost" className="w-full justify-start gap-3">
							<Calendar className="w-4 h-4" /> Events <Badge variant="secondary">{events.length}</Badge>
						</Button>
						<Button variant="ghost" className="w-full justify-start gap-3">
							<Rss className="w-4 h-4" /> Newsletters
						</Button>
						<Button variant="ghost" className="w-full justify-start gap-3">
							<Handshake className="w-4 h-4" /> Contacts
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Right Column - Main Content */}
			<div className="md:col-span-3">
				<Tabs defaultValue="following">
					<div className="flex justify-between items-center mb-4">
						<TabsList>
							<TabsTrigger value="followers">Followers ({followers.length})</TabsTrigger>
							<TabsTrigger value="following">Following ({following.length})</TabsTrigger>
						</TabsList>
						<div className="relative w-64">
							<Input placeholder="Search..." className="pl-8" />
							<Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						</div>
					</div>
					<TabsContent value="followers">
						<div className="space-y-4">
							{followers.map((user) => (
								<UserCard key={user.id} user={user} />
							))}
						</div>
					</TabsContent>
					<TabsContent value="following">
						<div className="space-y-4">
							{following.map((user) => (
								<UserCard key={user.id} user={user} />
							))}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
