import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "Advertise on Thorbis | Reach Millions of Local Customers",
	description: "Get your business in front of high-intent customers on Thorbis. Learn about our targeted advertising solutions and drive measurable results for your business.",
	keywords: ["advertise", "local advertising", "thorbis ads", "sponsored listings", "business promotion", "customer targeting"],
	openGraph: {
		title: "Advertise on Thorbis | Reach Millions of Local Customers",
		description: "Promote your business to a ready-to-buy audience with Thorbis advertising. Target by location, track performance, and grow your brand.",
		url: "https://local.byronwade.com/advertise",
		type: "website",
		images: [
			{
				url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200",
				width: 1200,
				height: 630,
				alt: "Advertise on Thorbis",
			},
		],
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Service",
	serviceType: "Advertising Service",
	provider: {
		"@type": "Organization",
		name: "Thorbis",
	},
	name: "Thorbis Advertising",
	description: "Targeted advertising solutions to help local businesses reach high-intent customers. Options include sponsored listings, location-based targeting, and detailed performance analytics.",
	areaServed: {
		"@type": "Country",
		name: "US",
	},
	hasOfferCatalog: {
		"@type": "OfferCatalog",
		name: "Advertising Plans",
		itemListElement: [
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Sponsored Listings",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Local Targeting Ads",
				},
			},
		],
	},
};

const advertisingBenefits = [
	{
		icon: <Target className="w-8 h-8 text-primary" />,
		title: "Reach High-Intent Customers",
		description: "Connect with users who are actively searching for businesses like yours.",
	},
	{
		icon: <Users className="w-8 h-8 text-primary" />,
		title: "Target by Location",
		description: "Promote your business to customers in specific cities, neighborhoods, or zip codes.",
	},
	{
		icon: <TrendingUp className="w-8 h-8 text-primary" />,
		title: "Drive Measurable Results",
		description: "Track your ad performance with detailed analytics on clicks, calls, and leads.",
	},
];

export default function AdvertisePage() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="bg-muted">
					<div className="py-24 px-4 lg:px-24 max-w-5xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Advertise on Thorbis</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Get your business in front of millions of people ready to buy, visit, and hire.</p>
						<Button asChild size="lg" className="mt-8">
							<Link href="/contact-sales">Get Started</Link>
						</Button>
					</div>
				</div>

				{/* Benefits Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-16">Why Advertise with Us?</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
							{advertisingBenefits.map((benefit) => (
								<div key={benefit.title}>
									<div className="flex justify-center mb-4">{benefit.icon}</div>
									<h3 className="text-lg font-semibold">{benefit.title}</h3>
									<p className="text-muted-foreground mt-2">{benefit.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Ad Examples Section */}
				<div className="bg-muted py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-16">See Your Ads in Action</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
							<Image src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop" alt="Ad example on Thorbis" width={1200} height={900} className="rounded-lg shadow-lg" />
							<div>
								<h3 className="text-2xl font-bold mb-4">Sponsored Listings</h3>
								<p className="text-lg text-muted-foreground">Appear at the top of search results and stand out from the competition. Our sponsored listings are clearly marked and designed to drive clicks from interested customers.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
