export const metadata = {
	title: "Business Story Videos - Share Your Journey | Thorbis",
	description: "Share your business story through compelling videos on Thorbis. Connect with customers by showcasing your journey, values, and behind-the-scenes moments.",
	keywords: ["business story videos", "business storytelling", "video marketing", "business videos", "brand stories", "customer engagement"],
	openGraph: {
		title: "Business Story Videos - Share Your Journey | Thorbis",
		description: "Share your business story through compelling videos on Thorbis. Connect with customers by showcasing your journey, values, and behind-the-scenes moments.",
		url: "https://local.byronwade.com/business-story-videos",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-business-videos.jpg",
				width: 1200,
				height: 630,
				alt: "Business Story Videos on Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Business Story Videos - Thorbis",
		description: "Share your business story through compelling videos and connect with customers.",
		images: ["https://local.byronwade.com/og-business-videos.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/business-story-videos",
	},
};

export default function BusinessStoryVideosPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Business Story Videos",
		description: "Platform for businesses to share their stories through video content",
		url: "https://local.byronwade.com/business-story-videos",
		mainEntity: {
			"@type": "VideoGallery",
			name: "Business Story Video Gallery",
			description: "Collection of business story videos showcasing company journeys and values",
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
						"@id": "https://local.byronwade.com/business-story-videos",
						name: "Business Story Videos",
					},
				},
			],
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-4xl text-center">
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Business Story Videos</h1>
						<p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">This page is under construction. Check back soon for our new business story videos feature.</p>
					</div>
				</div>
			</div>
		</>
	);
}
