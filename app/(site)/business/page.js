import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BarChart, MessageSquare, Megaphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "Thorbis for Business | Grow Your Local Business",
	description: "Access a suite of free tools to manage your online presence, respond to reviews, and reach new customers on Thorbis. Claim your business page today.",
	keywords: ["business tools", "thorbis for business", "local business marketing", "customer engagement", "online presence", "claim business"],
	openGraph: {
		title: "Thorbis for Business | Grow Your Local Business",
		description: "Supercharge your growth with Thorbis. Connect with customers, manage your reputation, and track your success with our powerful business tools.",
		url: "https://local.byronwade.com/business",
		type: "website",
		images: [
			{
				url: "https://local.byronwade.com/og-business.png", // Placeholder
				width: 1200,
				height: 630,
				alt: "Tools for Business Growth on Thorbis",
			},
		],
	},
};

const features = [
	{
		icon: <CheckCircle className="w-8 h-8 text-primary" />,
		title: "Claim Your Business",
		description: "Secure your free business page to start managing your online presence.",
	},
	{
		icon: <MessageSquare className="w-8 h-8 text-primary" />,
		title: "Respond to Reviews",
		description: "Engage with your customers and show them you value their feedback.",
	},
	{
		icon: <BarChart className="w-8 h-8 text-primary" />,
		title: "Track Analytics",
		description: "Understand your customers with insights on page views, leads, and more.",
	},
	{
		icon: <Megaphone className="w-8 h-8 text-primary" />,
		title: "Advertise on Thorbis",
		description: "Reach more customers and grow your business with targeted ads.",
	},
];

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	name: "Thorbis for Business",
	url: "https://local.byronwade.com/business",
	description: "A comprehensive suite of tools for businesses to manage their online presence on Thorbis.",
	mainEntity: {
		"@type": "ItemList",
		name: "Business Features",
		itemListElement: features.map((feature, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Service",
				name: feature.title,
				description: feature.description,
			},
		})),
	},
};

export default function BusinessPage() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="relative isolate overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
					<div className="py-24 px-4 lg:px-24 max-w-5xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Grow Your Business with Thorbis</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Connect with millions of potential customers searching for businesses like yours.</p>
						<div className="mt-8 flex justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/claim-a-business">Get Started for Free</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Features Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-16">Everything You Need to Succeed</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
							{features.map((feature) => (
								<div key={feature.title} className="flex items-start gap-6">
									<div className="flex-shrink-0">{feature.icon}</div>
									<div>
										<h3 className="text-lg font-semibold">{feature.title}</h3>
										<p className="text-muted-foreground mt-1">{feature.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Testimonial Section */}
				<div className="bg-muted py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto text-center">
						<p className="text-2xl font-serif italic">&quot;Claiming our Thorbis page was a game-changer. We saw a 30% increase in customer calls within the first month.&quot;</p>
						<p className="mt-6 font-semibold">Jane Doe, Owner of Springfield Bakery</p>
					</div>
				</div>
			</div>
		</>
	);
}
