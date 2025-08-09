import React from "react";

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

export const metadata = {
	title: "Neighborhoods – Local Communities Directory | Thorbis",
	description: "Explore local neighborhoods with highlights, businesses, events, and community posts.",
	openGraph: {
		title: "Neighborhoods – Local Communities Directory",
		description: "Discover local neighborhoods and community highlights.",
		url: "https://thorbis.com/neighborhoods",
		type: "website",
	},
	alternates: { canonical: "https://thorbis.com/neighborhoods" },
};

export default function NeighborhoodsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Local Neighborhoods Directory",
		description: "Comprehensive directory of local neighborhoods and communities",
		url: "https://thorbis.com/neighborhoods",
		mainEntity: {
			"@type": "ItemList",
			name: "Neighborhood Directory",
			description: "Directory of local neighborhoods with businesses and community information",
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: {
						"@id": "https://thorbis.com",
						name: "Thorbis",
					},
				},
				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@id": "https://thorbis.com/neighborhoods",
						name: "Neighborhoods",
					},
				},
			],
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-4xl text-center">
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Local Neighborhoods</h1>
						<p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">This page is under construction. Check back soon to explore local neighborhoods and discover what makes each community unique.</p>
					</div>
				</div>
			</div>
		</>
	);
}
