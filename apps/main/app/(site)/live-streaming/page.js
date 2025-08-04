export const metadata = {
	title: "Live Streaming for Businesses - Connect with Customers in Real-Time | Thorbis",
	description: "Stream live events, product launches, and behind-the-scenes content to engage your customers. Build stronger relationships through real-time interaction and live commerce.",
	keywords: ["live streaming", "business streaming", "live commerce", "real-time engagement", "live events", "business broadcasting"],
	openGraph: {
		title: "Live Streaming for Businesses - Connect with Customers in Real-Time | Thorbis",
		description: "Stream live events, product launches, and behind-the-scenes content to engage your customers. Build stronger relationships through real-time interaction and live commerce.",
		url: "https://local.byronwade.com/live-streaming",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-live-streaming.jpg",
				width: 1200,
				height: 630,
				alt: "Live Streaming for Businesses on Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Live Streaming for Businesses - Thorbis",
		description: "Connect with customers in real-time through live streaming and interactive content.",
		images: ["https://local.byronwade.com/og-live-streaming.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/live-streaming",
	},
};

export default function LiveStreamingPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Live Streaming for Businesses",
		description: "Live streaming platform for businesses to connect with customers in real-time",
		url: "https://local.byronwade.com/live-streaming",
		mainEntity: {
			"@type": "SoftwareApplication",
			name: "Thorbis Live Streaming",
			description: "Business live streaming solution for real-time customer engagement",
			applicationCategory: "StreamingApplication",
			operatingSystem: "Web Browser",
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
						"@id": "https://local.byronwade.com/live-streaming",
						name: "Live Streaming",
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
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Live Streaming for Businesses</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">This page is under construction. Check back soon for our new live streaming feature that will help you connect with customers in real-time.</p>
					</div>
				</div>
			</div>
		</>
	);
}
