import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Calendar, Star, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
	title: "Restaurant Owners - Tools for Success",
	description: "From reservations to reviews, our platform has everything you need to fill your tables and delight your guests.",
};

const restaurantFeatures = [
	{
		icon: <UtensilsCrossed className="w-8 h-8 text-primary" />,
		title: "Online Ordering & Delivery",
		description: "Integrate with popular delivery services or manage your own online orders.",
	},
	{
		icon: <Calendar className="w-8 h-8 text-primary" />,
		title: "Reservations & Waitlist",
		description: "Manage your tables, accept online reservations, and reduce no-shows.",
	},
	{
		icon: <Star className="w-8 h-8 text-primary" />,
		title: "Showcase Your Menu",
		description: "Keep your menu up-to-date with photos and descriptions to entice diners.",
	},
	{
		icon: <BookOpen className="w-8 h-8 text-primary" />,
		title: "Customer Reviews",
		description: "Engage with diners and build a strong reputation in your community.",
	},
];

export default function RestaurantOwnersPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: metadata.title,
		description: metadata.description,
		url: "https://local.byronwade.com/restaurant-owners",
		isPartOf: {
			"@type": "WebSite",
			name: "Inbox Zero",
			url: "https://local.byronwade.com",
		},
		mainEntity: {
			"@type": "ItemList",
			name: "Restaurant Features",
			itemListElement: restaurantFeatures.map((feature, index) => ({
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
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="relative isolate overflow-hidden">
					<Image src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop" alt="Restaurant" layout="fill" objectFit="cover" className="opacity-20" />
					<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
					<div className="relative py-24 px-4 lg:px-24 max-w-5xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Tools for Restaurant Success</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">From reservations to reviews, Thorbis has everything you need to fill your tables and delight your guests.</p>
						<Button asChild size="lg" className="mt-8">
							<Link href="/claim-a-business">Get Started</Link>
						</Button>
					</div>
				</div>

				{/* Features Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-16">Solutions for Every Restaurant</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
							{restaurantFeatures.map((feature) => (
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
			</div>
		</>
	);
}
