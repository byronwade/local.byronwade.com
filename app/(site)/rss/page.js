"use client";
import { Rss, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "next/head";

const feeds = [
	{
		title: "Latest Blog Posts",
		description: "Stay up-to-date with our latest articles and announcements.",
		url: "https://thorbis.com/blog/rss.xml",
	},
	{
		title: "Newest Businesses in Your Area",
		description: "Get notified about new businesses opening in a specific location (e.g., Springfield).",
		url: "https://thorbis.com/rss/businesses/springfield.xml",
	},
];

export default function RssPage() {
	const pageTitle = "RSS Feeds";
	const pageDescription = "Stay connected with our platform through our RSS feeds. Subscribe to get the latest content delivered directly to your feed reader.";
	const pageUrl = "https://local.byronwade.com/rss";
	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageDescription} />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "WebPage",
							name: pageTitle,
							description: pageDescription,
							url: pageUrl,
							mainEntity: {
								"@type": "ItemList",
								name: "RSS Feeds",
								itemListElement: feeds.map((feed, index) => ({
									"@type": "ListItem",
									position: index + 1,
									item: {
										"@type": "WebAPI",
										name: feed.title,
										description: feed.description,
										url: feed.url,
									},
								})),
							},
							isPartOf: {
								"@type": "WebSite",
								name: "Inbox Zero",
								url: "https://local.byronwade.com",
							},
						}),
					}}
				/>
			</Head>
			<div className="bg-background text-foreground">
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-16">
							<Rss className="w-16 h-16 mx-auto text-primary mb-4" />
							<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">RSS Feeds</h1>
							<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Stay connected with Thorbis through our RSS feeds. Subscribe to get the latest content delivered directly to your feed reader.</p>
						</div>

						<div className="space-y-8">
							{feeds.map((feed) => (
								<Card key={feed.title}>
									<CardHeader>
										<CardTitle>{feed.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-4">{feed.description}</p>
										<div className="flex items-center gap-4 bg-muted p-3 rounded-md">
											<span className="flex-grow text-sm font-mono">{feed.url}</span>
											<Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(feed.url)}>
												<Copy className="w-4 h-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
