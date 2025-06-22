"use client";
import { Rss, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

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
	useEffect(() => {
		document.title = "RSS Feeds - Stay Updated with Thorbis Content";

		// Add meta description
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription) {
			metaDescription.setAttribute("content", "Subscribe to Thorbis RSS feeds for the latest business content, local news, and platform updates delivered directly to your feed reader.");
		} else {
			const meta = document.createElement("meta");
			meta.name = "description";
			meta.content = "Subscribe to Thorbis RSS feeds for the latest business content, local news, and platform updates delivered directly to your feed reader.";
			document.head.appendChild(meta);
		}

		// Add JSON-LD structured data
		const jsonLd = {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "RSS Feeds",
			description: "RSS feed subscriptions for Thorbis content and updates",
			url: "https://local.byronwade.com/rss",
			mainEntity: {
				"@type": "DataFeed",
				name: "Thorbis RSS Feeds",
				description: "RSS feeds for business content and local updates",
			},
		};

		const script = document.createElement("script");
		script.type = "application/ld+json";
		script.textContent = JSON.stringify(jsonLd);
		document.head.appendChild(script);

		return () => {
			// Cleanup
			const scripts = document.querySelectorAll('script[type="application/ld+json"]');
			scripts.forEach((script) => {
				if (script.textContent.includes("RSS Feeds")) {
					script.remove();
				}
			});
		};
	}, []);

	return (
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
	);
}
