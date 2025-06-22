import { Button } from "@/components/ui/button";
import { Terminal, Book, Key } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Developer Platform",
	description: "Build with our platform. Integrate our rich local business data into your application.",
};

const features = [
	{
		name: "Business Search",
		description: "Access our comprehensive database of local businesses, including reviews, ratings, and contact information.",
	},
	{
		name: "Geolocation",
		description: "Find businesses by location, search within a specific radius, and power location-aware features.",
	},
	{
		name: "Real-Time Data",
		description: "Get up-to-date information with our robust and reliable API, trusted by thousands of developers.",
	},
];

export default function DevelopersPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: metadata.title,
		description: metadata.description,
		url: "https://local.byronwade.com/developers",
		isPartOf: {
			"@type": "WebSite",
			name: "Inbox Zero",
			url: "https://local.byronwade.com",
		},
		mainEntity: {
			"@type": "ItemList",
			name: "API Features",
			itemListElement: features.map((feature, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Service",
					name: feature.name,
					description: feature.description,
				},
			})),
		},
	};
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="bg-muted">
					<div className="py-24 px-4 lg:px-24 max-w-5xl mx-auto text-center">
						<Terminal className="w-16 h-16 mx-auto text-primary mb-4" />
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Developer Platform</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Build with Thorbis. Integrate our rich local business data into your application.</p>
						<Button asChild size="lg" className="mt-8">
							<Link href="/developers/api-keys">Get Your API Key</Link>
						</Button>
					</div>
				</div>

				{/* Features Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
							<div>
								<h3 className="text-xl font-semibold mb-2">Business Search</h3>
								<p className="text-muted-foreground">Access our comprehensive database of local businesses, including reviews, ratings, and contact information.</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Geolocation</h3>
								<p className="text-muted-foreground">Find businesses by location, search within a specific radius, and power location-aware features.</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Real-Time Data</h3>
								<p className="text-muted-foreground">Get up-to-date information with our robust and reliable API, trusted by thousands of developers.</p>
							</div>
						</div>
					</div>
				</div>

				{/* Documentation Section */}
				<div className="bg-muted py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto text-center">
						<Book className="w-12 h-12 mx-auto text-primary mb-4" />
						<h2 className="text-3xl font-bold tracking-tight">Comprehensive Documentation</h2>
						<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Our detailed documentation has everything you need to get started, from quickstart guides to in-depth API references.</p>
						<Button asChild variant="outline" size="lg" className="mt-8">
							<Link href="/developers/docs">Read the Docs</Link>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
