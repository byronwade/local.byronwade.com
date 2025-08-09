import { Suspense } from "react";
import SupportClient from "./support-client";

export const metadata = {
	title: "Support Center - Get Help & Customer Service | Thorbis",
	description: "Get comprehensive support for your Thorbis account. Find help articles, contact customer service, and access resources to help you succeed on our platform.",
	keywords: ["thorbis support", "customer service", "help center", "user support", "technical support", "customer care"],
	openGraph: {
		title: "Support Center - Get Help & Customer Service | Thorbis",
		description: "Get comprehensive support for your Thorbis account. Find help articles, contact customer service, and access resources to help you succeed on our platform.",
		url: "https://thorbis.com/support",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis.com/og-support.jpg",
				width: 1200,
				height: 630,
				alt: "Thorbis Support Center",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Support Center - Get Help & Customer Service | Thorbis",
		description: "Get comprehensive support for your Thorbis account. Find help articles, contact customer service, and access resources to help you succeed on our platform.",
		images: ["https://thorbis.com/og-support.jpg"],
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
		canonical: "https://thorbis.com/support",
	},
};

// JSON-LD structured data
const jsonLd = {
	"@context": "https://schema.org",
	"@type": "CustomerService",
	name: "Thorbis Support Center",
	description: "Comprehensive customer support and help resources",
	url: "https://thorbis.com/support",
	serviceType: "Customer Support",
	areaServed: "Worldwide",
	availableLanguage: "English",
	contactPoint: {
		"@type": "ContactPoint",
		contactType: "Customer Service",
		availableLanguage: "English",
		areaServed: "Worldwide",
	},
	breadcrumb: {
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://thorbis.com",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Support",
				item: "https://thorbis.com/support",
			},
		],
	},
};

function SupportLoadingSkeleton() {
	return (
		<div className="min-h-screen bg-background">
			<div className="animate-pulse">
				<div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
				<div className="container mx-auto px-4 py-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function SupportPage() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<Suspense fallback={<SupportLoadingSkeleton />}>
				<SupportClient />
			</Suspense>
		</>
	);
}
