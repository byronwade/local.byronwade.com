import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, LifeBuoy, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
	title: "Business Support - Get Help and Resources",
	description: "Access resources, popular articles, and contact support to make the most of your business page.",
};

const popularArticles = [
	{ title: "How to respond to reviews", link: "#" },
	{ title: "Updating your business information", link: "#" },
	{ title: "Understanding your analytics", link: "#" },
	{ title: "Getting started with advertising", link: "#" },
];

export default function BusinessSupportPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: metadata.title,
		description: metadata.description,
		url: "https://local.byronwade.com/business-support",
		isPartOf: {
			"@type": "WebSite",
			name: "Inbox Zero",
			url: "https://local.byronwade.com",
		},
		mainEntity: {
			"@type": "ItemList",
			name: "Popular Articles",
			itemListElement: popularArticles.map((article, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Article",
					name: article.title,
					url: `https://local.byronwade.com/business-support${article.link}`,
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
						<LifeBuoy className="w-16 h-16 mx-auto text-primary mb-4" />
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Business Support</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Resources to help you make the most of your Thorbis business page.</p>
						<div className="mt-8 max-w-2xl mx-auto relative">
							<Input placeholder="Search for help..." className="h-14 pl-12 text-lg" />
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
						</div>
					</div>
				</div>

				{/* Resources Section */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
						{/* Popular Articles */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BookOpen className="w-6 h-6" />
									Popular Articles
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-3">
									{popularArticles.map((article) => (
										<li key={article.title}>
											<Link href={article.link} className="text-primary hover:underline">
												{article.title}
											</Link>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						{/* Contact Support */}
						<Card>
							<CardHeader>
								<CardTitle>Contact Us</CardTitle>
								<CardDescription>Can&apos;t find what you&apos;re looking for?</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="mb-4">Our support team is happy to help.</p>
								<Button asChild>
									<Link href="/contact-support">Get in Touch</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
