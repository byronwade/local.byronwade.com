import { Suspense } from "react";
import LocalHubClient from "./LocalHubClient";

export const metadata = {
	title: "LocalHub - Build Your Own Local Business Directory | Thorbis",
	description: "Create and monetize your own local business directory with LocalHub. Set your own pricing, earn recurring revenue from local businesses in your community.",
	keywords: ["local directory", "business directory platform", "monetize directory", "white label directory", "local business platform"],
	openGraph: {
		title: "LocalHub - Build Your Own Local Business Directory | Thorbis",
		description: "Create and monetize your own local business directory with LocalHub. Set your own pricing, earn recurring revenue from local businesses in your community.",
		url: "https://local.byronwade.com/localhub",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-localhub.jpg",
				width: 1200,
				height: 630,
				alt: "LocalHub Business Directory Platform",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "LocalHub - Build Your Own Local Business Directory | Thorbis",
		description: "Create and monetize your own local business directory with LocalHub. Set your own pricing, earn recurring revenue from local businesses in your community.",
		images: ["https://local.byronwade.com/og-localhub.jpg"],
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
		canonical: "https://local.byronwade.com/localhub",
	},
};

// JSON-LD structured data
const jsonLd = {
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: "LocalHub",
	description: "Create and monetize your own local business directory platform",
	url: "https://local.byronwade.com/localhub",
	applicationCategory: "BusinessApplication",
	operatingSystem: "Web",
	offers: {
		"@type": "Offer",
		name: "LocalHub Platform",
		description: "White-label business directory solution",
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
				name: "LocalHub",
				item: "https://local.byronwade.com/localhub",
			},
		],
	},
};

function LocalHubLoadingSkeleton() {
	return (
		<div className="min-h-screen bg-background">
			<div className="animate-pulse">
				<div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
				<div className="container mx-auto px-4 py-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function LocalHubPage() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<Suspense fallback={<LocalHubLoadingSkeleton />}>
				<LocalHubClient />
			</Suspense>
		</>
	);
}
