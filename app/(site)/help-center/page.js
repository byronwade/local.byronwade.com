import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, Briefcase, Settings, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Help Center",
	description: "Find help with your account, business tools, and more.",
};

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

export default function HelpCenterPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: metadata.title,
		description: metadata.description,
		url: "https://local.byronwade.com/help-center",
		isPartOf: {
			"@type": "WebSite",
			name: "Inbox Zero",
			url: "https://local.byronwade.com",
		},
		mainEntity: {
			"@type": "ItemList",
			name: "Help Categories",
			itemListElement: categories.map((category, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "WebPage",
					name: category.title,
					description: category.description,
					url: `https://local.byronwade.com${category.link}`,
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
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Help Center</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">How can we help you?</p>
						<div className="mt-8 max-w-2xl mx-auto relative">
							<Input placeholder="Search for answers..." className="h-14 pl-12 text-lg" />
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
						</div>
					</div>
				</div>

				{/* Categories Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
							{categories.map((category) => (
								<Link href={category.link} key={category.title}>
									<Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all flex items-center p-6">
										<div className="mr-6">{category.icon}</div>
										<div>
											<CardTitle>{category.title}</CardTitle>
											<p className="text-muted-foreground mt-1">{category.description}</p>
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
