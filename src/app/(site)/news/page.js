export const metadata = {
	title: "Local Business News & Updates - Stay Informed | Thorbis",
	description: "Stay updated with the latest local business news, industry insights, and Thorbis platform updates. Get valuable information to help grow your business.",
	keywords: ["local business news", "business updates", "industry news", "business insights", "thorbis news", "business trends"],
	openGraph: {
		title: "Local Business News & Updates - Stay Informed | Thorbis",
		description: "Stay updated with the latest local business news, industry insights, and Thorbis platform updates. Get valuable information to help grow your business.",
		url: "https://thorbis.com/news",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis.com/og-news.jpg",
				width: 1200,
				height: 630,
				alt: "Business News on Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Local Business News - Thorbis",
		description: "Stay updated with the latest business news and insights.",
		images: ["https://thorbis.com/og-news.jpg"],
	},
	alternates: {
		canonical: "https://thorbis.com/news",
	},
};

export default function NewsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Local Business News",
		description: "Latest news and updates about local businesses and industry trends",
		url: "https://thorbis.com/news",
		mainEntity: {
			"@type": "Blog",
			name: "Thorbis Business News",
			description: "News and insights for local businesses",
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: {
						"@id": "https://thorbis.com",
						name: "Thorbis",
					},
				},
				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@id": "https://thorbis.com/news",
						name: "News",
					},
				},
			],
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Business News & Updates</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">This page is under construction. Check back soon for the latest business news, industry insights, and platform updates.</p>
					</div>
				</div>
			</div>
		</>
	);
}
