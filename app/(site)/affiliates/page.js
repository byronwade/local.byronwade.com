import { Handshake, Target, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const affiliateBenefits = [
	{
		icon: <Zap className="w-8 h-8 mb-4 text-primary" />,
		title: "Competitive Commissions",
		description: "Earn generous commissions for every customer you refer to our platform. The more you refer, the more you earn.",
	},
	{
		icon: <Handshake className="w-8 h-8 mb-4 text-primary" />,
		title: "Marketing Support",
		description: "Gain access to a wealth of marketing materials, including banners, links, and content to help you succeed.",
	},
	{
		icon: <Target className="w-8 h-8 mb-4 text-primary" />,
		title: "Real-Time Tracking",
		description: "Our advanced dashboard provides real-time tracking of your referrals, earnings, and performance.",
	},
];

export const metadata = {
	title: "Affiliate Program - Partner with Thorbis & Earn Rewards",
	description: "Join Thorbis's affiliate program and earn competitive commissions by referring customers. Get marketing support, real-time tracking, and generous rewards.",
	keywords: ["affiliate program", "partner with thorbis", "earn commissions", "referral program", "marketing partnership", "affiliate marketing"],
	openGraph: {
		title: "Affiliate Program - Partner with Thorbis & Earn Rewards",
		description: "Join Thorbis's affiliate program and earn competitive commissions by referring customers. Get marketing support, real-time tracking, and generous rewards.",
		url: "https://local.byronwade.com/affiliates",
		siteName: "Thorbis",
		images: [
			{
				url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop",
				width: 1200,
				height: 630,
				alt: "Thorbis Affiliate Program",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Affiliate Program - Partner with Thorbis",
		description: "Join our affiliate program and earn competitive commissions by referring customers.",
		images: ["https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/affiliates",
	},
};

export default function AffiliatesPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Service",
		name: "Thorbis Affiliate Program",
		description: "A partnership program that allows individuals and businesses to earn commissions by referring customers to Thorbis platform.",
		provider: {
			"@type": "Organization",
			name: "Thorbis",
			logo: "https://local.byronwade.com/ThorbisLogo.webp",
			url: "https://local.byronwade.com",
		},
		serviceType: "Affiliate Marketing Program",
		areaServed: "United States",
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Affiliate Benefits",
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Competitive Commissions",
						description: "Earn generous commissions for every customer you refer to our platform",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Marketing Support",
						description: "Access to marketing materials, banners, links, and content",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Real-Time Tracking",
						description: "Advanced dashboard with real-time tracking of referrals and earnings",
					},
				},
			],
		},
		audience: {
			"@type": "Audience",
			audienceType: "Marketing Partners",
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="relative h-96">
					<Image src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop" alt="Affiliate Program" layout="fill" objectFit="cover" className="opacity-30" />
					<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
					<div className="relative h-full flex flex-col items-center justify-center text-center px-4">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Join Our Affiliate Program</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl text-muted-foreground">Partner with us and earn rewards for helping your audience discover our services.</p>
					</div>
				</div>

				{/* Affiliate Benefits Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-12">Why Become an Affiliate?</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{affiliateBenefits.map((benefit, index) => (
								<Card key={index} className="text-center">
									<CardHeader>
										<div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">{benefit.icon}</div>
									</CardHeader>
									<CardContent>
										<h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
										<p className="text-muted-foreground">{benefit.description}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>

				{/* How it Works Section */}
				<div className="bg-muted py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-12">Simple Steps to Get Started</h2>
						<div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
							<div className="text-center flex flex-col items-center">
								<div className="text-5xl font-bold text-primary mb-2">1</div>
								<h3 className="text-xl font-semibold">Sign Up</h3>
								<p className="text-muted-foreground max-w-xs">Create your affiliate account in just a few minutes.</p>
							</div>
							<div className="text-center flex flex-col items-center">
								<div className="text-5xl font-bold text-primary mb-2">2</div>
								<h3 className="text-xl font-semibold">Promote</h3>
								<p className="text-muted-foreground max-w-xs">Share your unique referral link with your audience.</p>
							</div>
							<div className="text-center flex flex-col items-center">
								<div className="text-5xl font-bold text-primary mb-2">3</div>
								<h3 className="text-xl font-semibold">Earn</h3>
								<p className="text-muted-foreground max-w-xs">Get paid for every successful referral.</p>
							</div>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Join?</h2>
						<p className="text-lg text-muted-foreground mb-8">Become an affiliate today and start earning. It&apos;s free to join and easy to get started.</p>
						<Button asChild size="lg">
							<Link href="/contact-support?subject=Affiliate Program">Sign Up Now</Link>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
