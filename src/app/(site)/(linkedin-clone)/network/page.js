"use client";
import { useState } from "react";
import { Users, Calendar, MessageCircle, MapPin, Building, Star, Plus, Search, Filter, UserPlus, Handshake, GraduationCap, Briefcase, Globe, Award, Rss, ThumbsUp, Share2, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";

// Mock Data (ideally this would come from an API)
const networkingData = {
	currentUser: {
		id: "byron-wade",
		name: "Byron Wade",
		title: "Founder & CEO at Thorbis",
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face",
		connections: 500,
		groups: 12,
		events: 3,
	},
	businessOwners: [
		{ id: "1", name: "Sarah Johnson", business: "Wade's Plumbing & Septic", avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop", industry: "Plumbing", location: "Springfield, IL", connections: 127, isVerified: true, isOnline: true, headline: "Expert plumbing services for residential and commercial properties." },
		{ id: "2", name: "Mike Chen", business: "Springfield Auto Care", avatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop", industry: "Automotive", location: "Springfield, IL", connections: 89, isVerified: true, headline: "Your trusted partner for all automotive repairs and maintenance." },
		{ id: "3", name: "Lisa Rodriguez", business: "Beauty & Style Salon", avatar: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=100&fit=crop", industry: "Beauty", location: "Springfield, IL", connections: 156, isVerified: true, isOnline: true, headline: "Bringing out the beauty in you with modern styling and treatments." },
	],
	industryGroups: [
		{ id: "1", name: "Springfield Restaurant Association", avatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop", members: 45, isPrivate: false, description: "Connect with local restaurant owners, share best practices, and stay updated on industry trends." },
		{ id: "2", name: "Local Service Professionals", avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop", members: 78, isPrivate: false, description: "Network with service-based businesses including plumbing, electrical, HVAC, and more." },
		{ id: "3", name: "Women Business Owners Network", avatar: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=100&fit=crop", members: 32, isPrivate: true, description: "Supporting and empowering women entrepreneurs in the Springfield area." },
	],
	meetups: [
		{ id: "1", title: "Springfield Business Mixer", date: "2024-08-15", location: "Springfield Chamber of Commerce", attendees: 45 },
		{ id: "2", title: "Digital Marketing Workshop", date: "2024-08-20", location: "Springfield Public Library", attendees: 28 },
	],
	mentorshipPrograms: [
		{ id: "1", title: "Startup Mentorship Program", description: "Connect with experienced business owners to guide you.", topics: ["Business Planning", "Financial Management", "Marketing"] },
		{ id: "2", title: "Industry-Specific Mentoring", description: "Get mentored by experts in your specific industry.", topics: ["Industry Best Practices", "Technical Skills", "Operations"] },
	],
	peopleYouMayKnow: [
		{ id: "david-lee", name: "David Lee", business: "Lee's Landscaping", avatar: "https://images.unsplash.com/photo-1558222218-47391912db93?w=100&h=100&fit=crop", headline: "Creating beautiful landscapes for over 10 years." },
		{ id: "emily-carter", name: "Emily Carter", business: "Carter's Cakes", avatar: "https://images.unsplash.com/photo-1542826438-c32144d12533?w=100&h=100&fit=crop", headline: "Custom cakes for all occasions." },
	],
	suggestedBusinesses: [
		{ id: "bizz1", name: "Innovate Solutions", logo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=100&h=100&fit=crop", headline: "Driving business growth through technology.", industry: "IT Consulting" },
		{ id: "bizz2", name: "Riverstone Logistics", logo: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=100&h=100&fit=crop", headline: "Efficient and reliable logistics services.", industry: "Logistics" },
		{ id: "bizz3", name: "Apex Construction", logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&h=100&fit=crop", headline: "Building the future of commercial real estate.", industry: "Construction" },
	],
	news: [
		{ id: "1", title: "The Future of Local SEO", source: "Search Engine Land", time: "2h ago", readers: "1,204" },
		{ id: "2", title: "5 Customer Service Tips for Small Businesses", source: "Forbes", time: "8h ago", readers: "987" },
	],
	feed: [
		{
			id: "post1",
			author: { id: "sarah-johnson", name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop", title: "Owner, Wade's Plumbing & Septic" },
			timestamp: "2h ago",
			content: "Just launched a new emergency plumbing service for the Springfield area! We're available 24/7 to handle any unexpected issues. We're committed to providing fast, reliable service to our community. #Plumbing #LocalBusiness #Springfield",
			likes: 15,
			comments: [
				{
					id: "comment1",
					author: { id: "mike-chen", name: "Mike Chen", avatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop", title: "Owner, Springfield Auto Care" },
					content: "This is great news! Congrats on the launch.",
					timestamp: "1h ago",
				},
			],
		},
		{
			id: "post2",
			author: { id: "mike-chen", name: "Mike Chen", avatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop", title: "Owner, Springfield Auto Care" },
			timestamp: "1d ago",
			content: "Looking for recommendations for a local marketing agency to help us with a new branding campaign. Any suggestions for agencies that specialize in working with automotive businesses?",
			likes: 8,
			comments: [],
		},
	],
	trendingGroups: [
		{ id: "1", name: "Springfield Restaurant Association", avatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop", members: 45 },
		{ id: "2", name: "Local Service Professionals", avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop", members: 78 },
	],
	upcomingMeetups: [
		{ id: "1", title: "Springfield Business Mixer", date: "2024-08-15", location: "Springfield Chamber of Commerce" },
		{ id: "2", title: "Digital Marketing Workshop", date: "2024-08-20", location: "Springfield Public Library" },
	],
};

const ProfileCard = ({ user }) => (
	<Card>
		<CardHeader className="p-0">
			<div className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg" />
			<Link href={`/profile/${user.id}`} className="cursor-pointer">
				<div className="flex justify-center -mt-8">
					<Avatar className="w-20 h-20 border-4 border-card">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
					</Avatar>
				</div>
			</Link>
		</CardHeader>
		<CardContent className="text-center pt-4 pb-4">
			<Link href={`/profile/${user.id}`} className="cursor-pointer">
				<h3 className="text-lg font-semibold hover:underline">{user.name}</h3>
			</Link>
			<p className="text-sm text-muted-foreground">{user.title}</p>
		</CardContent>
	</Card>
);

const MyNetworkCard = ({ user }) => (
	<Card>
		<CardContent className="p-2 space-y-1 text-sm">
			<Link href="#" className="flex justify-between items-center hover:bg-muted p-2 rounded-md">
				<span className="font-semibold text-muted-foreground">Connections</span>
				<span className="font-bold text-primary">{user.connections}</span>
			</Link>
			<Link href="#" className="flex justify-between items-center hover:bg-muted p-2 rounded-md">
				<span className="font-semibold text-muted-foreground">Groups</span>
				<span className="font-bold text-primary">{user.groups}</span>
			</Link>
			<Link href="#" className="flex justify-between items-center hover:bg-muted p-2 rounded-md">
				<span className="font-semibold text-muted-foreground">Events</span>
				<span className="font-bold text-primary">{user.events}</span>
			</Link>
		</CardContent>
	</Card>
);

const PersonCard = ({ person }) => {
	const [isFollowing, setIsFollowing] = useState(false);
	return (
		<div className="flex items-start gap-3">
			<Link href={`/profile/${person.id}`}>
				<Avatar className="w-12 h-12 cursor-pointer">
					<AvatarImage src={person.avatar} alt={person.name} />
					<AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
				</Avatar>
			</Link>
			<div className="flex-grow">
				<Link href={`/profile/${person.id}`}>
					<p className="font-semibold text-sm hover:underline cursor-pointer">{person.name}</p>
				</Link>
				<p className="text-xs text-muted-foreground line-clamp-2">{person.headline}</p>
				<Button variant={isFollowing ? "secondary" : "outline"} size="sm" className="mt-1 w-full" onClick={() => setIsFollowing(!isFollowing)} disabled={isFollowing}>
					{isFollowing ? <Check className="w-3 h-3 mr-1.5" /> : <UserPlus className="w-3 h-3 mr-1.5" />}
					{isFollowing ? "Following" : "Follow"}
				</Button>
			</div>
		</div>
	);
};

const PeopleYouMayKnow = ({ people }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-base">People You May Know</CardTitle>
		</CardHeader>
		<CardContent className="space-y-4">
			{people.map((person) => (
				<PersonCard key={person.id} person={person} />
			))}
		</CardContent>
	</Card>
);

const BusinessCard = ({ business }) => {
	const [isFollowing, setIsFollowing] = useState(false);
	return (
		<div className="flex items-start gap-3">
			<Link href={`/biz/${business.slug}`}>
				<Avatar className="w-12 h-12 cursor-pointer rounded-md">
					<AvatarImage src={business.logo} alt={business.name} />
					<AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
				</Avatar>
			</Link>
			<div className="flex-grow">
				<Link href={`/biz/${business.slug}`}>
					<p className="font-semibold text-sm hover:underline cursor-pointer">{business.name}</p>
				</Link>
				<p className="text-xs text-muted-foreground line-clamp-2">{business.headline}</p>
				<Button variant={isFollowing ? "secondary" : "outline"} size="sm" className="mt-1 w-full" onClick={() => setIsFollowing(!isFollowing)} disabled={isFollowing}>
					{isFollowing ? <Check className="w-3 h-3 mr-1.5" /> : <Plus className="w-3 h-3 mr-1.5" />}
					{isFollowing ? "Following" : "Follow"}
				</Button>
			</div>
		</div>
	);
};

const SuggestedBusinessesCard = ({ businesses }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-base">Businesses to Follow</CardTitle>
		</CardHeader>
		<CardContent className="space-y-4">
			{businesses.map((business) => (
				<BusinessCard key={business.slug} business={business} />
			))}
		</CardContent>
	</Card>
);

const NewsCard = ({ newsItems }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-base flex items-center gap-2">
				<Rss className="w-4 h-4" /> Industry News
			</CardTitle>
		</CardHeader>
		<CardContent className="space-y-4">
			{newsItems.map((item) => (
				<div key={item.id}>
					<p className="font-semibold text-sm leading-tight hover:underline cursor-pointer">{item.title}</p>
					<p className="text-xs text-muted-foreground mt-1">
						{item.source} • {item.time} • {item.readers} readers
					</p>
				</div>
			))}
		</CardContent>
	</Card>
);

const CreatePostCard = ({ user, onPost }) => {
	const [content, setContent] = useState("");

	const handlePost = () => {
		if (content.trim()) {
			onPost(content);
			setContent("");
		}
	};

	return (
		<Card>
			<CardContent className="p-3">
				<div className="flex gap-3">
					<Link href={`/profile/${user.id}`}>
						<Avatar className="cursor-pointer">
							<AvatarImage src={user.avatar} alt={user.name} />
						</Avatar>
					</Link>
					<div className="flex-grow">
						<Textarea placeholder="What's on your mind?" className="mb-2 bg-muted/80 border-none focus-visible:ring-1 focus-visible:ring-primary" rows={2} value={content} onChange={(e) => setContent(e.target.value)} />
						<div className="flex justify-end">
							<Button size="sm" onClick={handlePost} disabled={!content.trim()}>
								Post
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const Comment = ({ comment }) => (
	<div className="flex items-start gap-3 pt-4">
		<Link href={`/profile/${comment.author.id}`}>
			<Avatar className="w-8 h-8 cursor-pointer">
				<AvatarImage src={comment.author.avatar} alt={comment.author.name} />
				<AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
			</Avatar>
		</Link>
		<div className="flex-grow bg-muted/80 rounded-lg px-3 py-2">
			<div className="flex items-center justify-between">
				<Link href={`/profile/${comment.author.id}`}>
					<p className="font-semibold text-sm hover:underline cursor-pointer">{comment.author.name}</p>
				</Link>
				<p className="text-xs text-muted-foreground">{comment.timestamp}</p>
			</div>
			<p className="text-sm mt-1">{comment.content}</p>
		</div>
	</div>
);

const PostCard = ({ post }) => {
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(post.likes);
	const [commentsVisible, setCommentsVisible] = useState(false);
	const [comments, setComments] = useState(post.comments || []);
	const [newComment, setNewComment] = useState("");

	const handleLike = () => {
		setIsLiked(!isLiked);
		setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
	};

	const handleCommentSubmit = (e) => {
		e.preventDefault();
		if (newComment.trim()) {
			const newCommentObj = {
				id: `comment${Date.now()}`,
				author: networkingData.currentUser,
				content: newComment,
				timestamp: "Just now",
			};
			setComments([...comments, newCommentObj]);
			setNewComment("");
		}
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start gap-3">
					<Link href={`/profile/${post.author.id}`}>
						<Avatar className="cursor-pointer">
							<AvatarImage src={post.author.avatar} alt={post.author.name} />
							<AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
						</Avatar>
					</Link>
					<div>
						<Link href={`/profile/${post.author.id}`}>
							<p className="font-semibold hover:underline cursor-pointer">{post.author.name}</p>
						</Link>
						<p className="text-xs text-muted-foreground">
							{post.author.title} • {post.timestamp}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm whitespace-pre-wrap">{post.content}</p>
			</CardContent>
			<CardFooter className="pt-2 pb-3 flex justify-between items-center text-muted-foreground text-sm">
				<Button variant="ghost" size="sm" className={`flex items-center gap-1.5 ${isLiked ? "text-primary" : ""}`} onClick={handleLike}>
					<ThumbsUp className="w-4 h-4" /> {likeCount}
				</Button>
				<Button variant="ghost" size="sm" className="flex items-center gap-1.5" onClick={() => setCommentsVisible(!commentsVisible)}>
					<MessageCircle className="w-4 h-4" /> {comments.length} Comments
				</Button>
				<Button variant="ghost" size="sm" className="flex items-center gap-1.5">
					<Share2 className="w-4 h-4" /> Share
				</Button>
			</CardFooter>
			{commentsVisible && (
				<div className="p-4 pt-0 border-t border-border/50">
					<form onSubmit={handleCommentSubmit} className="flex items-start gap-3 pt-4">
						<Link href={`/profile/${networkingData.currentUser.id}`}>
							<Avatar className="w-8 h-8 cursor-pointer">
								<AvatarImage src={networkingData.currentUser.avatar} alt={networkingData.currentUser.name} />
							</Avatar>
						</Link>
						<div className="flex-grow">
							<Textarea placeholder="Add a comment..." className="mb-2 bg-muted/80 border-none focus-visible:ring-1 focus-visible:ring-primary" rows={1} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
							{newComment && (
								<div className="flex justify-end">
									<Button size="sm" type="submit" disabled={!newComment.trim()}>
										Post
									</Button>
								</div>
							)}
						</div>
					</form>
					<div className="space-y-2">
						{comments
							.slice()
							.reverse()
							.map((comment) => (
								<Comment key={comment.id} comment={comment} />
							))}
					</div>
				</div>
			)}
		</Card>
	);
};

const TrendingGroupsCard = ({ groups }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-base">Trending Groups</CardTitle>
		</CardHeader>
		<CardContent className="space-y-3">
			{groups.map((group) => (
				<div key={group.id} className="flex items-center gap-3">
					<Avatar className="rounded-md">
						<AvatarImage src={group.avatar} />
					</Avatar>
					<div>
						<p className="font-semibold text-sm">{group.name}</p>
						<p className="text-xs text-muted-foreground">{group.members} members</p>
					</div>
				</div>
			))}
		</CardContent>
	</Card>
);

const UpcomingMeetupsCard = ({ meetups }) => (
	<Card>
		<CardHeader>
			<CardTitle className="text-base">Upcoming Meetups</CardTitle>
		</CardHeader>
		<CardContent className="space-y-3">
			{meetups.map((meetup) => (
				<div key={meetup.id} className="flex items-center gap-3">
					<div className="p-2 bg-muted rounded-md flex flex-col items-center">
						<span className="text-xs font-bold text-primary">{new Date(meetup.date).toLocaleString("en-us", { month: "short" }).toUpperCase()}</span>
						<span className="text-lg font-bold">{new Date(meetup.date).getDate()}</span>
					</div>
					<div>
						<p className="font-semibold text-sm">{meetup.title}</p>
						<p className="text-xs text-muted-foreground">{meetup.location}</p>
					</div>
				</div>
			))}
		</CardContent>
	</Card>
);

export default function NetworkPage() {
	const [feed, setFeed] = useState(networkingData.feed);

	const handlePost = (content) => {
		const newPost = {
			id: `post${Date.now()}`,
			author: networkingData.currentUser,
			timestamp: "Just now",
			content,
			likes: 0,
			comments: [],
		};
		setFeed([newPost, ...feed]);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
			{/* Left Column */}
			<aside className="md:col-span-1 space-y-8 sticky top-[-8px]">
				<ProfileCard user={networkingData.currentUser} />
				<MyNetworkCard user={networkingData.currentUser} />
			</aside>

			{/* Center Column */}
			<div className="md:col-span-2 space-y-4">
				<CreatePostCard user={networkingData.currentUser} onPost={handlePost} />
				{feed.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>

			{/* Right Column */}
			<aside className="md:col-span-1 space-y-8 sticky top-[-8px]">
				<SuggestedBusinessesCard businesses={networkingData.suggestedBusinesses} />
				<TrendingGroupsCard groups={networkingData.trendingGroups} />
				<UpcomingMeetupsCard meetups={networkingData.upcomingMeetups} />
				<NewsCard newsItems={networkingData.news} />
			</aside>
		</div>
	);
}
