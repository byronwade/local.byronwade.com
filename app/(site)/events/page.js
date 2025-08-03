import { Suspense } from "react";
import EventsClient from "./EventsClient";
import { ContentDataFetchers } from "@lib/supabase/server";

// Get events data from Supabase
async function getEventsData() {
	try {
		const eventsResult = await ContentDataFetchers.getEvents({
			status: "upcoming",
			limit: 50,
		});

		return {
			events: eventsResult || [],
			total: eventsResult?.length || 0,
		};
	} catch (error) {
		console.error("Error fetching events data:", error);
		return {
			events: [],
			total: 0,
		};
	}
}

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

// Generate dynamic JSON-LD structured data
function generateEventsJsonLd(events) {
	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Local Events",
		description: "Discover and join local events and activities in your community",
		url: "https://local.byronwade.com/events",
		mainEntity: {
			"@type": "ItemList",
			name: "Local Events Listing",
			description: "Community events, networking, and activities",
			numberOfItems: events.length,
			itemListElement: events.slice(0, 10).map((event, index) => ({
				"@type": "Event",
				name: event.title,
				description: event.description,
				startDate: `${event.start_date}${event.start_date.includes("T") ? "" : "T00:00:00"}`,
				endDate: event.end_date ? `${event.end_date}${event.end_date.includes("T") ? "" : "T23:59:59"}` : undefined,
				location: {
					"@type": "Place",
					name: event.venue || event.location,
					address: event.location,
				},
				organizer: {
					"@type": event.organizer?.name ? "Person" : "Organization",
					name: event.organizer?.name || "Event Organizer",
				},
				image: event.featured_image,
				offers:
					event.price && event.price !== "0"
						? {
								"@type": "Offer",
								price: event.price,
								priceCurrency: event.currency || "USD",
						  }
						: undefined,
				eventStatus: "https://schema.org/EventScheduled",
				eventAttendanceMode: event.is_virtual ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
				url: `https://local.byronwade.com/events/${event.slug || event.id}`,
			})),
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
}

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

// Events content component
function EventsContent({ events }) {
	const jsonLd = generateEventsJsonLd(events);

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<EventsClient initialEvents={events} />
		</>
	);
}

// Main server component
export default async function EventsPage() {
	const { events } = await getEventsData();

	return (
		<Suspense fallback={<EventsLoadingSkeleton />}>
			<EventsContent events={events} />
		</Suspense>
	);
}
