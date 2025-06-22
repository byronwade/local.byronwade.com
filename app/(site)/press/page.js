import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "Press",
	description: "The latest news, announcements, and media highlights.",
};

const pressReleases = [
	{
		date: "October 26, 2023",
		title: "Thorbis Announces $15M Series A to Revolutionize Local Business Discovery",
		source: "TechCrunch",
		link: "#",
	},
	{
		date: "September 15, 2023",
		title: "The Future of Local Search: An Interview with Thorbis CEO",
		source: "Forbes",
		link: "#",
	},
	{
		date: "July 01, 2023",
		title: "Thorbis Launches New Platform to Connect Communities with Trusted Businesses",
		source: "Business Insider",
		link: "#",
	},
];

export default function PressPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: metadata.title,
		description: metadata.description,
		url: "https://local.byronwade.com/press",
		isPartOf: {
			"@type": "WebSite",
			name: "Inbox Zero",
			url: "https://local.byronwade.com",
		},
		mainEntity: {
			"@type": "ItemList",
			name: "Press Releases",
			itemListElement: pressReleases.map((release, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Article",
					headline: release.title,
					datePublished: release.date,
					publisher: {
						"@type": "Organization",
						name: release.source,
					},
					url: `https://local.byronwade.com${release.link}`,
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
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">In the News</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">See the latest news, announcements, and media highlights from Thorbis.</p>
					</div>
				</div>

				{/* Press Releases */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight mb-12">Press Releases</h2>
						<div className="space-y-8">
							{pressReleases.map((release) => (
								<Card key={release.title} className="hover:shadow-lg transition-shadow">
									<CardContent className="p-6">
										<p className="text-sm text-muted-foreground mb-2">{release.date}</p>
										<h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
											<Link href={release.link}>{release.title}</Link>
										</h3>
										<p className="font-medium">
											As featured in <span className="text-primary">{release.source}</span>
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>

				{/* Media Contact */}
				<div className="bg-muted py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto text-center">
						<h2 className="text-3xl font-bold tracking-tight">Media Inquiries</h2>
						<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">For all media-related questions, please contact our public relations team. We&apos;re happy to provide you with more information.</p>
						<Button asChild size="lg" className="mt-8">
							<a href="mailto:press@thorbis.com">Contact Us</a>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
