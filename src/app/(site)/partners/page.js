import { Handshake, Target, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

const partners = [
	{ name: "Partner One", logo: "/placeholder.svg" },
	{ name: "Partner Two", logo: "/placeholder.svg" },
	{ name: "Partner Three", logo: "/placeholder.svg" },
	{ name: "Partner Four", logo: "/placeholder.svg" },
	{ name: "Partner Five", logo: "/placeholder.svg" },
	{ name: "Partner Six", logo: "/placeholder.svg" },
];

const partnershipBenefits = [
	{
		icon: <Zap className="mb-4 w-8 h-8 text-primary" />,
		title: "Accelerate Growth",
		description: "Leverage our platform to reach a wider audience and grow your business faster than ever before.",
	},
	{
		icon: <Handshake className="mb-4 w-8 h-8 text-primary" />,
		title: "Build Connections",
		description: "Connect with other businesses and leaders in the local community to foster collaboration and innovation.",
	},
	{
		icon: <Target className="mb-4 w-8 h-8 text-primary" />,
		title: "Reach a Targeted Audience",
		description: "Our platform is designed to connect you with customers who are actively seeking your products and services.",
	},
];

export const metadata = {
	title: "Partners - Collaborate with Thorbis | Business Partnerships",
	description: "Join Thorbis's partner network. Collaborate with leading companies, accelerate growth, and reach targeted audiences. Learn about partnership opportunities.",
	keywords: ["business partnerships", "thorbis partners", "partner network", "business collaboration", "partnership opportunities"],
	openGraph: {
		title: "Partners - Collaborate with Thorbis | Business Partnerships",
		description: "Join Thorbis's partner network. Collaborate with leading companies, accelerate growth, and reach targeted audiences. Learn about partnership opportunities.",
		url: "https://local.byronwade.com/partners",
		siteName: "Thorbis",
		images: [
			{
				url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
				width: 1200,
				height: 630,
				alt: "Thorbis Partners",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Partners - Thorbis Partnerships",
		description: "Join our partner network and collaborate with leading companies.",
		images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/partners",
	},
};

export default function PartnersPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Partners",
		description: "Thorbis partnership opportunities and valued business collaborations",
		url: "https://local.byronwade.com/partners",
		mainEntity: {
			"@type": "Organization",
			name: "Thorbis Partner Network",
			description: "Network of business partners collaborating with Thorbis",
			hasOfferCatalog: {
				"@type": "OfferCatalog",
				name: "Partnership Benefits",
				itemListElement: partnershipBenefits.map((benefit, index) => ({
					"@type": "Offer",
					position: index + 1,
					itemOffered: {
						"@type": "Service",
						name: benefit.title,
						description: benefit.description,
					},
				})),
			},
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
						"@id": "https://local.byronwade.com/partners",
						name: "Partners",
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
				<div className="relative h-96">
					<Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Our Partners" layout="fill" objectFit="cover" className="opacity-30" />
					<div className="absolute inset-0 bg-gradient-to-t to-transparent from-background" />
					<div className="flex relative flex-col justify-center items-center px-4 h-full text-center">
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Our Valued Partners</h1>
						<p className="mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">We collaborate with leading companies to bring the best services to our community.</p>
					</div>
				</div>

				{/* Partnership Benefits Section */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-12 text-3xl font-bold tracking-tight text-center">Why Partner With Us?</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							{partnershipBenefits.map((benefit, index) => (
								<Card key={index} className="text-center">
									<CardHeader>
										<div className="p-3 mx-auto rounded-full bg-primary/10 w-fit">{benefit.icon}</div>
									</CardHeader>
									<CardContent>
										<h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
										<p className="text-muted-foreground">{benefit.description}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>

				{/* Logos Section */}
				<div className="px-4 py-24 bg-muted lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-12 text-3xl font-bold tracking-tight text-center">Proudly Partnered With</h2>
						<div className="grid grid-cols-2 gap-8 items-center md:grid-cols-3 lg:grid-cols-6">
							{partners.map((partner, index) => (
								<div key={index} className="flex justify-center">
									<Image src={partner.logo} alt={partner.name} width={120} height={60} className="grayscale transition-all hover:grayscale-0" />
								</div>
							))}
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-3xl text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight">Become a Partner</h2>
						<p className="mb-8 text-lg text-muted-foreground">Join our growing network of partners and help us build a stronger local community. We are always looking for new opportunities to collaborate.</p>
						<Button asChild size="lg">
							<Link href="/contact-support?subject=Partnership">Contact Us</Link>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
