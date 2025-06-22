import { ShieldCheck, MessageCircleWarning, BookUser, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
	title: "Trust & Safety",
	description: "Learn how we work to keep our community safe and secure.",
};

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

export default function TrustSafetyPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: metadata.title,
		description: metadata.description,
		url: "https://local.byronwade.com/trust-safety",
		isPartOf: {
			"@type": "WebSite",
			name: "Inbox Zero",
			url: "https://local.byronwade.com",
		},
		mainEntity: {
			"@type": "ItemList",
			name: "Safety Pillars",
			itemListElement: safetyPillars.map((pillar, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Thing",
					name: pillar.title,
					description: pillar.description,
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
