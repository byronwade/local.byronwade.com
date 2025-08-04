import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import Image from "next/image";
import Link from "next/link";

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

export const metadata = {
	title: "Press & News - Media Coverage & Press Releases | Thorbis",
	description: "Latest news, press releases, and media coverage about Thorbis. See our company announcements, funding news, and media highlights from major publications.",
	keywords: ["thorbis news", "press releases", "media coverage", "company news", "tech news", "funding announcements"],
	openGraph: {
		title: "Press & News - Media Coverage & Press Releases | Thorbis",
		description: "Latest news, press releases, and media coverage about Thorbis. See our company announcements, funding news, and media highlights from major publications.",
		url: "https://local.byronwade.com/press",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-press.jpg",
				width: 1200,
				height: 630,
				alt: "Thorbis Press & News",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Press & News - Thorbis",
		description: "Latest news and press releases about Thorbis platform and company updates.",
		images: ["https://local.byronwade.com/og-press.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/press",
	},
};

export default function PressPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Press & News",
		description: "Latest news, press releases, and media coverage about Thorbis",
		url: "https://local.byronwade.com/press",
		mainEntity: {
			"@type": "ItemList",
			name: "Press Releases",
			itemListElement: pressReleases.map((release, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "NewsArticle",
					headline: release.title,
					datePublished: release.date,
					publisher: {
						"@type": "Organization",
						name: release.source,
					},
					about: {
						"@type": "Organization",
						name: "Thorbis",
					},
				},
			})),
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: {
						"@id": "https://local.byronwade.com",
						name: "Thorbis",
					},
				},
				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@id": "https://local.byronwade.com/press",
						name: "Press",
					},
				},
			],
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="bg-muted">
					<div className="px-4 py-24 mx-auto max-w-5xl text-center lg:px-24">
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">In the News</h1>
						<p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">See the latest news, announcements, and media highlights from Thorbis.</p>
					</div>
				</div>

				{/* Press Releases */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-12 text-3xl font-bold tracking-tight">Press Releases</h2>
						<div className="space-y-8">
							{pressReleases.map((release) => (
								<Card key={release.title} className="transition-shadow hover:shadow-lg">
									<CardContent className="p-6">
										<p className="mb-2 text-sm text-muted-foreground">{release.date}</p>
										<h3 className="mb-2 text-xl font-semibold transition-colors hover:text-primary">
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
				<div className="px-4 py-24 bg-muted lg:px-24">
					<div className="mx-auto max-w-5xl text-center">
						<h2 className="text-3xl font-bold tracking-tight">Media Inquiries</h2>
						<p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">For all media-related questions, please contact our public relations team. We&apos;re happy to provide you with more information.</p>
						<Button asChild size="lg" className="mt-8">
							<a href="mailto:press@thorbis.com">Contact Us</a>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
