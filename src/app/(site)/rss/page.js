import { Rss } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import RssCopyButton from "@components/site/rss/RssCopyButton";

export const metadata = {
	title: "RSS Feeds – Thorbis Updates & Content Subscriptions",
	description: "Subscribe to Thorbis RSS feeds for the latest business content, local news, and platform updates.",
	openGraph: {
		title: "RSS Feeds – Thorbis",
		description: "Subscribe to Thorbis RSS feeds for updates and content.",
		url: "https://thorbis.com/rss",
		type: "website",
	},
	alternates: { canonical: "https://thorbis.com/rss" },
};
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
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "RSS Feeds",
		description: "RSS feed subscriptions for Thorbis content and updates",
		url: "https://thorbis.com/rss",
		mainEntity: {
			"@type": "DataFeed",
			name: "Thorbis RSS Feeds",
			description: "RSS feeds for business content and local updates",
		},
	};

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
										<RssCopyButton url={feed.url} />
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
