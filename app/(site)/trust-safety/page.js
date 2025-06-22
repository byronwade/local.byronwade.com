import { ShieldCheck, MessageCircleWarning, BookUser, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const safetyPillars = [
	{
		icon: <ShieldCheck className="w-8 h-8 text-primary" />,
		title: "Data Privacy & Security",
		description: "We employ industry-leading security measures to protect your data and privacy at every step.",
	},
	{
		icon: <BookUser className="w-8 h-8 text-primary" />,
		title: "Content Guidelines",
		description: "Our team actively monitors content to ensure it meets our community standards for authenticity and appropriateness.",
	},
	{
		icon: <MessageCircleWarning className="w-8 h-8 text-primary" />,
		title: "Reporting Tools",
		description: "Easy-to-use tools to report suspicious content or behavior, which our team reviews 24/7.",
	},
];

export const metadata = {
	title: "Trust & Safety - Platform Security & Community Protection | Thorbis",
	description: "Learn about Thorbis's trust and safety measures. We protect user data, maintain content guidelines, and provide reporting tools to keep our community safe.",
	keywords: ["trust and safety", "platform security", "community protection", "content moderation", "user safety", "data protection"],
	openGraph: {
		title: "Trust & Safety - Platform Security & Community Protection | Thorbis",
		description: "Learn about Thorbis's trust and safety measures. We protect user data, maintain content guidelines, and provide reporting tools to keep our community safe.",
		url: "https://local.byronwade.com/trust-safety",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-trust-safety.jpg",
				width: 1200,
				height: 630,
				alt: "Thorbis Trust & Safety",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Trust & Safety - Thorbis",
		description: "Learn about our trust and safety measures to protect our community.",
		images: ["https://local.byronwade.com/og-trust-safety.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/trust-safety",
	},
};

export default function TrustSafetyPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Trust & Safety",
		description: "Trust and safety measures to protect the Thorbis community",
		url: "https://local.byronwade.com/trust-safety",
		mainEntity: {
			"@type": "Article",
			headline: "Trust & Safety",
			description: "Platform security and community protection measures",
			author: {
				"@type": "Organization",
				name: "Thorbis",
			},
			publisher: {
				"@type": "Organization",
				name: "Thorbis",
				logo: {
					"@type": "ImageObject",
					url: "https://local.byronwade.com/ThorbisLogo.webp",
				},
			},
			about: safetyPillars.map((pillar) => pillar.title),
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
						"@id": "https://local.byronwade.com/trust-safety",
						name: "Trust & Safety",
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
					<div className="py-24 px-4 lg:px-24 max-w-5xl mx-auto text-center">
						<ShieldCheck className="w-16 h-16 mx-auto text-primary mb-4" />
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Trust & Safety</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Your trust is our top priority. Learn how we work to keep our community safe and secure.</p>
					</div>
				</div>

				{/* Pillars Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our Commitment to You</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{safetyPillars.map((pillar) => (
								<div key={pillar.title} className="text-center">
									<div className="flex justify-center mb-4">{pillar.icon}</div>
									<h3 className="font-semibold text-lg">{pillar.title}</h3>
									<p className="text-muted-foreground mt-2">{pillar.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Resources Section */}
				<div className="bg-card border-t border-border">
					<div className="py-24 px-4 lg:px-24 max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-12">Resources</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<Card className="hover:shadow-lg transition-shadow">
								<CardHeader>
									<CardTitle>Content Guidelines</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground mb-4">Understand the rules of our community to ensure a positive experience for everyone.</p>
									<Button asChild variant="outline">
										<Link href="/content-guidelines">Read Guidelines</Link>
									</Button>
								</CardContent>
							</Card>
							<Card className="hover:shadow-lg transition-shadow">
								<CardHeader>
									<CardTitle>Report an Issue</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground mb-4">If you see something that violates our policies, please let us know.</p>
									<Button asChild variant="outline">
										<Link href="/report">Submit a Report</Link>
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
