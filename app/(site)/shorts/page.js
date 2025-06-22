"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { ChevronUp, ChevronDown, Search, Filter, TrendingUp, Clock, Star, Plus, MapPin, ArrowLeft, Home, TrendingUp as TrendingIcon, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import VideoComponent from "./VideoComponent";

// Business-focused video data with 10 videos
const businessVideos = [
	{
		id: "1",
		title: "Behind the Scenes: Wade's Plumbing Emergency Call",
		thumbnailUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=600&fit=crop",
		duration: "0:45",
		uploadTime: "2 hours ago",
		views: "2.4K",
		likes: "156",
		comments: "23",
		shares: "8",
		author: "Wade's Plumbing & Septic",
		authorAvatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop",
		videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		description: "Late night emergency call - this is what real plumbing work looks like! 💪 #plumbing #emergency #localbusiness",
		businessCategory: "Plumbing",
		location: "Springfield, IL",
		rating: 4.8,
		isVerified: true,
		isLive: false,
		tags: ["plumbing", "emergency", "localbusiness", "behindthescenes"],
	},
	{
		id: "2",
		title: "Quick Tip: How to Unclog Your Kitchen Sink",
		thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
		duration: "1:12",
		uploadTime: "1 day ago",
		views: "8.7K",
		likes: "432",
		comments: "67",
		shares: "45",
		author: "Pro Plumbers Inc",
		authorAvatar: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
		videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
		description: "Save money with this simple DIY trick! But remember, for serious clogs, call the professionals. #diy #plumbing #tips",
		businessCategory: "Plumbing",
		location: "Chicago, IL",
		rating: 4.9,
		isVerified: true,
		isLive: false,
		tags: ["diy", "plumbing", "tips", "kitchen"],
	},
	{
		id: "3",
		title: "New Restaurant Opening - Grand Opening Special!",
		thumbnailUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=600&fit=crop",
		duration: "0:58",
		uploadTime: "3 hours ago",
		views: "1.2K",
		likes: "89",
		comments: "34",
		shares: "12",
		author: "Mama's Italian Kitchen",
		authorAvatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop",
		videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		description: "Grand opening this weekend! 50% off all pasta dishes. Come taste the authentic Italian flavors! 🍝 #restaurant #grandopening #italian",
		businessCategory: "Restaurant",
		location: "Springfield, IL",
		rating: 4.7,
		isVerified: false,
		isLive: true,
		tags: ["restaurant", "italian", "grandopening", "food"],
	},
	{
		id: "4",
		title: "Auto Repair: Changing Your Oil at Home",
		thumbnailUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=600&fit=crop",
		duration: "2:15",
		uploadTime: "5 days ago",
		views: "15.3K",
		likes: "892",
		comments: "234",
		shares: "156",
		author: "Springfield Auto Care",
		authorAvatar: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop",
		videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		description: "Step-by-step guide to changing your oil. Save money and learn a valuable skill! #autorepair #diy #oilchange",
		businessCategory: "Automotive",
		location: "Springfield, IL",
		rating: 4.6,
		isVerified: true,
		isLive: false,
		tags: ["autorepair", "diy", "oilchange", "automotive"],
	},
	{
		id: "5",
		title: "Hair Styling Tips for the Perfect Look",
		thumbnailUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=600&fit=crop",
		duration: "1:45",
		uploadTime: "1 week ago",
		views: "23.1K",
		likes: "1.2K",
		comments: "189",
		shares: "234",
		author: "Beauty & Style Salon",
		authorAvatar: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=100&fit=crop",
		videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		description: "Transform your look with these professional styling tips! Book your appointment today. #hairstyling #beauty #salon",
		businessCategory: "Beauty",
		location: "Chicago, IL",
		rating: 4.8,
		isVerified: true,
		isLive: false,
		tags: ["hairstyling", "beauty", "salon", "tips"],
	},
	{
		id: "6",
		title: "Real Estate Market Update - Springfield Area",
		thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=600&fit=crop",
		duration: "1:32",
		uploadTime: "2 days ago",
		views: "4.8K",
		likes: "267",
		comments: "89",
		shares: "45",
		author: "Springfield Real Estate Group",
		authorAvatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop",
		videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
		description: "Latest market insights for Springfield area. Great opportunities for buyers and sellers! #realestate #springfield #marketupdate",
		businessCategory: "Real Estate",
		location: "Springfield, IL",
		rating: 4.9,
		isVerified: true,
		isLive: false,
		tags: ["realestate", "springfield", "marketupdate", "property"],
	},
	{
		id: "7",
		title: "Landscaping Before & After Transformation",
		thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
		duration: "1:08",
		uploadTime: "4 days ago",
		views: "12.7K",
		likes: "654",
		comments: "98",
		shares: "87",
		author: "Green Thumb Landscaping",
		authorAvatar: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
		videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		description: "Amazing transformation! From overgrown mess to beautiful garden. Contact us for your landscaping needs! #landscaping #transformation #beforeafter",
		businessCategory: "Landscaping",
		location: "Springfield, IL",
		rating: 4.7,
		isVerified: true,
		isLive: false,
		tags: ["landscaping", "transformation", "beforeafter", "garden"],
	},
	{
		id: "8",
		title: "Electrical Safety Tips for Homeowners",
		thumbnailUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=600&fit=crop",
		duration: "1:55",
		uploadTime: "1 week ago",
		views: "18.9K",
		likes: "1.1K",
		comments: "203",
		shares: "145",
		author: "Safe Electric Co",
		authorAvatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop",
		videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		description: "Important electrical safety tips every homeowner should know! Stay safe and call professionals for complex work. #electrical #safety #homeowner",
		businessCategory: "Electrical",
		location: "Chicago, IL",
		rating: 4.8,
		isVerified: true,
		isLive: false,
		tags: ["electrical", "safety", "homeowner", "tips"],
	},
	{
		id: "9",
		title: "Carpet Cleaning Deep Clean Process",
		thumbnailUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=600&fit=crop",
		duration: "1:23",
		uploadTime: "3 days ago",
		views: "6.2K",
		likes: "298",
		comments: "67",
		shares: "34",
		author: "Fresh Clean Carpets",
		authorAvatar: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=100&fit=crop",
		videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
		description: "See our professional deep cleaning process in action! Your carpets will look brand new. #carpetcleaning #deepclean #professional",
		businessCategory: "Cleaning",
		location: "Springfield, IL",
		rating: 4.6,
		isVerified: false,
		isLive: false,
		tags: ["carpetcleaning", "deepclean", "professional", "cleaning"],
	},
	{
		id: "10",
		title: "HVAC Maintenance Tips for Summer",
		thumbnailUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=600&fit=crop",
		duration: "1:41",
		uploadTime: "5 days ago",
		views: "9.8K",
		likes: "445",
		comments: "123",
		shares: "78",
		author: "Cool Breeze HVAC",
		authorAvatar: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop",
		videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
		description: "Keep your AC running efficiently this summer with these maintenance tips! #hvac #maintenance #summer #ac",
		businessCategory: "HVAC",
		location: "Chicago, IL",
		rating: 4.9,
		isVerified: true,
		isLive: false,
		tags: ["hvac", "maintenance", "summer", "ac"],
	},
];

// Custom Header Component for Shorts
const ShortsHeader = ({ searchQuery, setSearchQuery, filter, setFilter, categories }) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<div className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50">
			<div className="flex items-center justify-between w-full gap-6 py-3 mx-auto px-4 lg:px-24">
				{/* Left side - Logo and Navigation */}
				<div className="flex items-center space-x-4">
					<Link href="/" className="flex items-center space-x-3 text-xl font-bold group">
						<div className="relative">
							<Image src="/ThorbisLogo.webp" alt="Thorbis" width={50} height={50} className="w-10 h-10 transition-transform duration-200 group-hover:scale-105" />
							<div className="absolute inset-0 bg-gradient-to-r rounded-full opacity-0 transition-opacity duration-200 from-blue-500/20 to-green-500/20 group-hover:opacity-100" />
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-bold leading-none text-foreground">Thorbis</h1>
							<p className="text-xs text-muted-foreground">Business Shorts</p>
						</div>
					</Link>

					{/* Navigation Divider */}
					<div className="hidden sm:block w-px h-6 bg-border/50"></div>

					{/* Back and Home buttons */}
					<div className="flex items-center space-x-2">
						<Link href="/" passHref>
							<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary">
								<ArrowLeft className="w-4 h-4 mr-1" />
								<span className="hidden sm:inline">Back</span>
							</Button>
						</Link>
						<Link href="/" passHref>
							<Button variant="ghost" size="sm" className="text-sm font-medium transition-colors hover:text-primary">
								<Home className="w-4 h-4 mr-1" />
								<span className="hidden sm:inline">Home</span>
							</Button>
						</Link>
					</div>
				</div>

				{/* Center - Search and Filter */}
				<div className="flex-1 flex items-center justify-center space-x-4 max-w-md mx-4">
					{/* Search Input */}
					<div className="relative flex items-center w-full max-w-xs">
						<Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
						<input type="text" placeholder="Search businesses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" />
					</div>

					{/* Filter Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="text-sm font-medium transition-colors hover:text-primary">
								<Filter className="w-4 h-4 mr-2" />
								<span className="hidden sm:inline">{filter === "all" ? "All Categories" : filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-48 z-[80] bg-card/95 backdrop-blur-md border border-border/50">
							{categories.map((category) => (
								<DropdownMenuItem key={category} onClick={() => setFilter(category)} className={`text-sm ${filter === category ? "bg-accent" : ""}`}>
									{category.charAt(0).toUpperCase() + category.slice(1)}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Right side - Mobile Menu */}
				<div className="flex items-center space-x-2">
					{/* Mobile Menu Button */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="md:hidden p-2">
								<Menu className="w-5 h-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 z-[80] bg-card/95 backdrop-blur-md border border-border/50">
							<DropdownMenuItem asChild>
								<Link href="/" className="flex items-center">
									<ArrowLeft className="w-4 h-4 mr-2" />
									Back to Main Site
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/categories" className="flex items-center">
									Categories
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/search" className="flex items-center">
									<Search className="w-4 h-4 mr-2" />
									Search
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Trending Badge */}
					<div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full">
						<TrendingIcon className="w-3 h-3" />
						<span>Trending</span>
					</div>
				</div>
			</div>
		</div>
	);
};

// Sidebar for navigation and discovery
const ShortsSidebar = () => {
	const sidebarLinks = [
		{ name: "For You", icon: <Home className="w-6 h-6" />, href: "/shorts" },
		{ name: "Following", icon: <TrendingUp className="w-6 h-6" />, href: "#" },
		{ name: "Trending", icon: <TrendingIcon className="w-6 h-6" />, href: "#" },
		{ name: "Explore", icon: <Search className="w-6 h-6" />, href: "#" },
		{ name: "Go back home", icon: <ArrowLeft className="w-6 h-6" />, href: "/" },
	];

	return (
		<aside className="w-64 bg-card p-4 border-r border-border/50 hidden lg:flex flex-col justify-between">
			<div>
				<h2 className="text-lg font-semibold mb-4">Discover</h2>
				<ul className="space-y-2">
					{sidebarLinks.map((link) => (
						<li key={link.name}>
							<Link href={link.href} className="flex items-center space-x-3 text-lg p-2 rounded-md hover:bg-muted/50 transition-colors">
								{link.icon}
								<span>{link.name}</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
			<div>
				<Button className="w-full">Upload Video</Button>
			</div>
		</aside>
	);
};

const ShortsPage = () => {
	const [videos, setVideos] = useState(businessVideos);
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState("all");
	const containerRef = useRef(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => {
			window.removeEventListener("resize", checkMobile);
		};
	}, []);

	const scrollToVideo = (index) => {
		if (containerRef.current) {
			const videoElement = containerRef.current.children[index];
			if (videoElement) {
				videoElement.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	};

	const handleScroll = (direction) => {
		const nextIndex = direction === "up" ? Math.max(0, currentVideoIndex - 1) : Math.min(videos.length - 1, currentVideoIndex + 1);
		setCurrentVideoIndex(nextIndex);
		scrollToVideo(nextIndex);
	};

	useEffect(() => {
		const handleScroll = (e) => {
			const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
			const videoHeight = clientHeight;
			const currentIndex = Math.round(scrollTop / videoHeight);
			if (currentIndex !== currentVideoIndex) {
				setCurrentVideoIndex(currentIndex);
			}
		};

		const handleKeyPress = (e) => {
			if (e.key === "ArrowDown") {
				handleScroll("down");
			} else if (e.key === "ArrowUp") {
				handleScroll("up");
			}
		};

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("keydown", handleKeyPress);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [currentVideoIndex]);

	const handleUploadVideo = () => {
		alert("Feature coming soon!");
	};

	const categories = ["all", "plumbing", "restaurant", "automotive", "beauty", "real estate", "landscaping", "electrical", "cleaning", "hvac"];

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Thorbis Business Shorts",
		description: "Short-form videos from local businesses. See behind the scenes, get tips, and discover new services.",
		mainEntity: {
			"@type": "ItemList",
			name: "Business Shorts",
			itemListElement: videos.map((video, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "VideoObject",
					name: video.title,
					description: video.description,
					thumbnailUrl: video.thumbnailUrl,
					uploadDate: video.uploadTime,
					duration: video.duration,
					contentUrl: video.videoUrl,
					author: {
						"@type": "Organization",
						name: video.author,
					},
					interactionStatistic: {
						"@type": "InteractionCounter",
						interactionType: "https://schema.org/WatchAction",
						userInteractionCount: parseInt(video.views.replace("K", "000")),
					},
				},
			})),
		},
	};

	return (
		<div className="flex h-screen bg-black text-white">
			<Head>
				<title>Thorbis Business Shorts</title>
				<meta name="description" content="Short-form videos from local businesses. See behind the scenes, get tips, and discover new services." />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			</Head>
			<ShortsSidebar />
			<main className="flex-1 relative">
				<ShortsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} filter={filter} setFilter={setFilter} categories={categories} />
				<div className="absolute top-0 right-4 lg:right-10 z-50 flex flex-col gap-4 h-full justify-center">
					<Button variant="ghost" size="icon" onClick={() => handleScroll("up")} className="text-white bg-black/30 hover:bg-black/50">
						<ChevronUp className="w-6 h-6" />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => handleScroll("down")} className="text-white bg-black/30 hover:bg-black/50">
						<ChevronDown className="w-6 h-6" />
					</Button>
				</div>
				<div ref={containerRef} className="h-screen w-full snap-y snap-mandatory overflow-y-scroll overflow-x-hidden scrollbar-hide">
					{videos.map((video, index) => (
						<div key={video.id} className="h-screen w-full snap-start flex items-center justify-center">
							<VideoComponent video={video} isActive={index === currentVideoIndex} />
						</div>
					))}
				</div>
			</main>
		</div>
	);
};

export default ShortsPage;
