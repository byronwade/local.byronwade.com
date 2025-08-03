import { Button } from "@/components/ui/button";
import { Terminal, Book, Key } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Developer Platform - APIs & Integrations | Thorbis",
	description: "Build with Thorbis APIs. Access comprehensive local business data, geolocation services, and real-time information. Get your API key and start integrating today.",
	keywords: ["developer api", "business data api", "geolocation api", "local business integration", "developer platform", "thorbis api"],
	openGraph: {
		title: "Developer Platform - APIs & Integrations | Thorbis",
		description: "Build with Thorbis APIs. Access comprehensive local business data, geolocation services, and real-time information. Get your API key and start integrating today.",
		url: "https://local.byronwade.com/developers",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-developers.jpg",
				width: 1200,
				height: 630,
				alt: "Thorbis Developer Platform",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Developer Platform - Thorbis APIs",
		description: "Build with Thorbis APIs. Access local business data and geolocation services.",
		images: ["https://local.byronwade.com/og-developers.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/developers",
	},
};

export default function DevelopersPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Thorbis Developer Platform",
		description: "API platform for accessing local business data, geolocation services, and real-time information",
		url: "https://local.byronwade.com/developers",
		applicationCategory: "DeveloperApplication",
		operatingSystem: "Any",
		provider: {
			"@type": "Organization",
			name: "Thorbis",
			logo: "https://local.byronwade.com/logos/ThorbisLogo.webp",
			url: "https://local.byronwade.com",
		},
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "API Services",
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Business Search API",
						description: "Access comprehensive database of local businesses with reviews and ratings",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Geolocation API",
						description: "Find businesses by location and search within specific radius",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Real-Time Data API",
						description: "Get up-to-date business information with reliable API",
					},
				},
			],
		},
		audience: {
			"@type": "Audience",
			audienceType: "Developers",
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="bg-muted">
					<div className="px-4 py-24 mx-auto max-w-5xl text-center lg:px-24">
						<Terminal className="mx-auto mb-4 w-16 h-16 text-primary" />
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Developer Platform</h1>
						<p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">Build with Thorbis. Integrate our rich local business data into your application.</p>
						<Button asChild size="lg" className="mt-8">
							<Link href="/developers/api-keys">Get Your API Key</Link>
						</Button>
					</div>
				</div>

				{/* Features Section */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
							<div>
								<h3 className="mb-2 text-xl font-semibold">Business Search</h3>
								<p className="text-muted-foreground">Access our comprehensive database of local businesses, including reviews, ratings, and contact information.</p>
							</div>
							<div>
								<h3 className="mb-2 text-xl font-semibold">Geolocation</h3>
								<p className="text-muted-foreground">Find businesses by location, search within a specific radius, and power location-aware features.</p>
							</div>
							<div>
								<h3 className="mb-2 text-xl font-semibold">Real-Time Data</h3>
								<p className="text-muted-foreground">Get up-to-date information with our robust and reliable API, trusted by thousands of developers.</p>
							</div>
						</div>
					</div>
				</div>

				{/* Documentation Section */}
				<div className="px-4 py-24 bg-muted lg:px-24">
					<div className="mx-auto max-w-5xl text-center">
						<Book className="mx-auto mb-4 w-12 h-12 text-primary" />
						<h2 className="text-3xl font-bold tracking-tight">Comprehensive Documentation</h2>
						<p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Our detailed documentation has everything you need to get started, from quickstart guides to in-depth API references.</p>
						<Button asChild variant="outline" size="lg" className="mt-8">
							<Link href="/developers/docs">Read the Docs</Link>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
