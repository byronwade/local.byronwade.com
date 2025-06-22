import { Handshake, Target, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
	title: "Thorbis Partners | Collaborate with Us",
	description: "Explore partnership opportunities with Thorbis. We collaborate with leading companies to deliver exceptional value and services to our community.",
	keywords: ["partners", "partnerships", "thorbis partners", "business collaboration", "community partners"],
	openGraph: {
		title: "Thorbis Partners | Collaborate with Us",
		description: "Join our network of valued partners to accelerate growth, build connections, and support the local community.",
		url: "https://local.byronwade.com/partners",
		type: "website",
		images: [
			{
				url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200",
				width: 1200,
				height: 630,
				alt: "Thorbis Partners",
			},
		],
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	name: "Thorbis Partnership Program",
	url: "https://local.byronwade.com/partners",
	description: "Information about partnership opportunities with Thorbis to support local communities and businesses.",
	publisher: {
		"@type": "Organization",
		name: "Thorbis",
		logo: {
			"@type": "ImageObject",
			url: "https://local.byronwade.com/logo.png", // Placeholder
		},
	},
};

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
		icon: <Zap className="w-8 h-8 mb-4 text-primary" />,
		title: "Accelerate Growth",
		description: "Leverage our platform to reach a wider audience and grow your business faster than ever before.",
	},
	{
		icon: <Handshake className="w-8 h-8 mb-4 text-primary" />,
		title: "Build Connections",
		description: "Connect with other businesses and leaders in the local community to foster collaboration and innovation.",
	},
	{
		icon: <Target className="w-8 h-8 mb-4 text-primary" />,
		title: "Reach a Targeted Audience",
		description: "Our platform is designed to connect you with customers who are actively seeking your products and services.",
	},
];

export default function PartnersPage() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="relative h-96">
					<Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Our Partners" layout="fill" objectFit="cover" className="opacity-30" />
					<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
					<div className="relative h-full flex flex-col items-center justify-center text-center px-4">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Our Valued Partners</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl text-muted-foreground">We collaborate with leading companies to bring the best services to our community.</p>
					</div>
				</div>

				{/* Partnership Benefits Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-12">Why Partner With Us?</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{partnershipBenefits.map((benefit, index) => (
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

				{/* Logos Section */}
				<div className="bg-muted py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-12">Proudly Partnered With</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
							{partners.map((partner, index) => (
								<div key={index} className="flex justify-center">
									<Image src={partner.logo} alt={partner.name} width={120} height={60} className="grayscale hover:grayscale-0 transition-all" />
								</div>
							))}
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-3xl font-bold tracking-tight mb-4">Become a Partner</h2>
						<p className="text-lg text-muted-foreground mb-8">Join our growing network of partners and help us build a stronger local community. We are always looking for new opportunities to collaborate.</p>
						<Button asChild size="lg">
							<Link href="/contact-support?subject=Partnership">Contact Us</Link>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
