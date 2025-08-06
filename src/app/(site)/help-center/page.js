import { Input } from "@components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Search, User, Briefcase, Settings, Shield } from "lucide-react";
import Link from "next/link";

const categories = [
	{
		icon: <User className="w-8 h-8 text-primary" />,
		title: "Account & Profile",
		description: "Manage your account, settings, and public profile.",
		link: "/help-center/account",
	},
	{
		icon: <Briefcase className="w-8 h-8 text-primary" />,
		title: "Thorbis for Business",
		description: "Claim your business page, manage reviews, and advertise.",
		link: "/help-center/business",
	},
	{
		icon: <Settings className="w-8 h-8 text-primary" />,
		title: "Using Thorbis",
		description: "Learn how to write reviews, search for businesses, and more.",
		link: "/help-center/using-thorbis",
	},
	{
		icon: <Shield className="w-8 h-8 text-primary" />,
		title: "Trust & Safety",
		description: "Our policies, content guidelines, and reporting tools.",
		link: "/help-center/trust-safety",
	},
];

export const metadata = {
	title: "Help Center - Support & Resources | Thorbis",
	description: "Get help with Thorbis. Find guides for account management, business tools, platform usage, and trust & safety. Search our knowledge base for quick answers.",
	keywords: ["help center", "support", "thorbis help", "user guide", "business help", "customer support"],
	openGraph: {
		title: "Help Center - Support & Resources | Thorbis",
		description: "Get help with Thorbis. Find guides for account management, business tools, platform usage, and trust & safety. Search our knowledge base for quick answers.",
		url: "https://local.byronwade.com/help-center",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-help-center.jpg",
				width: 1200,
				height: 630,
				alt: "Thorbis Help Center",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Help Center - Thorbis Support",
		description: "Get help with Thorbis platform. Find guides and resources.",
		images: ["https://local.byronwade.com/og-help-center.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/help-center",
	},
};

export default function HelpCenterPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Help Center",
		description: "Support resources and guides for using Thorbis platform",
		url: "https://local.byronwade.com/help-center",
		mainEntity: {
			"@type": "ItemList",
			name: "Help Categories",
			itemListElement: categories.map((category, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Article",
					name: category.title,
					description: category.description,
					url: `https://local.byronwade.com${category.link}`,
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
						"@id": "https://local.byronwade.com/help-center",
						name: "Help Center",
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
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Help Center</h1>
						<p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">How can we help you?</p>
						<div className="relative mx-auto mt-8 max-w-2xl">
							<Input placeholder="Search for answers..." className="pl-12 h-14 text-lg" />
							<Search className="absolute left-4 top-1/2 w-6 h-6 -translate-y-1/2 text-muted-foreground" />
						</div>
					</div>
				</div>

				{/* Categories Section */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
							{categories.map((category) => (
								<Link href={category.link} key={category.title}>
									<Card className="flex items-center p-6 h-full transition-all hover:shadow-lg hover:border-primary/50">
										<div className="mr-6">{category.icon}</div>
										<div>
											<CardTitle>{category.title}</CardTitle>
											<p className="mt-1 text-muted-foreground">{category.description}</p>
										</div>
									</Card>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
