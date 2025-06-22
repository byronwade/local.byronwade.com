import { Suspense } from "react";
import EventsClient from "./EventsClient";

export const metadata = {
	title: "Local Events & Activities - Discover What's Happening | Thorbis",
	description: "Discover local events, activities, and community gatherings in your area. From networking mixers to food festivals, find and join exciting events happening near you.",
	keywords: ["local events", "community activities", "networking events", "food festivals", "tech meetups", "business events"],
	openGraph: {
		title: "Local Events & Activities - Discover What's Happening | Thorbis",
		description: "Discover local events, activities, and community gatherings in your area. From networking mixers to food festivals, find and join exciting events happening near you.",
		url: "https://local.byronwade.com/events",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-events.jpg",
				width: 1200,
				height: 630,
				alt: "Local Events and Activities",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Local Events & Activities - Discover What's Happening | Thorbis",
		description: "Discover local events, activities, and community gatherings in your area. From networking mixers to food festivals, find and join exciting events happening near you.",
		images: ["https://local.byronwade.com/og-events.jpg"],
		creator: "@thorbis",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://local.byronwade.com/events",
	},
};

// JSON-LD structured data
const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	name: "Local Events",
	description: "Discover and join local events and activities in your community",
	url: "https://local.byronwade.com/events",
	mainEntity: {
		"@type": "ItemList",
		name: "Local Events Listing",
		description: "Community events, networking, and activities",
		numberOfItems: 7,
		itemListElement: [
			{
				"@type": "Event",
				name: "Local Business Networking Mixer",
				description: "Join fellow business owners for an evening of networking, drinks, and collaboration opportunities.",
				startDate: "2024-02-15T18:00:00",
				location: {
					"@type": "Place",
					name: "Downtown Business Center",
					address: "123 Main St, Downtown",
				},
				organizer: {
					"@type": "Organization",
					name: "Business Growth Network",
				},
			},
		],
	},
	breadcrumb: {
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://local.byronwade.com",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Events",
				item: "https://local.byronwade.com/events",
			},
		],
	},
};

function EventsLoadingSkeleton() {
	return (
		<div className="min-h-screen bg-background">
			<div className="animate-pulse">
				<div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
				<div className="container mx-auto px-4 py-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function EventsPage() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<Suspense fallback={<EventsLoadingSkeleton />}>
				<EventsClient />
			</Suspense>
		</>
	);
}
