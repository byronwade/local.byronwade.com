export const metadata = {
	title: "Business Challenges - Competitive Events & Contests | Thorbis",
	description: "Join exciting business challenges and contests on Thorbis. Compete with other businesses, showcase your skills, and win recognition in your industry.",
	keywords: ["business challenges", "business contests", "competitive events", "business competitions", "industry challenges", "business networking"],
	openGraph: {
		title: "Business Challenges - Competitive Events & Contests | Thorbis",
		description: "Join exciting business challenges and contests on Thorbis. Compete with other businesses, showcase your skills, and win recognition in your industry.",
		url: "https://thorbis.com/challenges",
		siteName: "Thorbis",
		images: [
			{
				url: `https://thorbis.com/opengraph-image?title=${encodeURIComponent("Business Challenges")}&description=${encodeURIComponent("Competitive events and contests for businesses.")}`,
				width: 1200,
				height: 630,
				alt: "Business Challenges on Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Business Challenges - Thorbis",
		description: "Join exciting business challenges and showcase your skills.",
		images: [`https://thorbis.com/twitter-image?title=${encodeURIComponent("Business Challenges")}`],
	},
	alternates: {
		canonical: "https://thorbis.com/challenges",
	},
};

export default function ChallengesPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Business Challenges",
		description: "Competitive events and contests for businesses to showcase their skills and win recognition",
		url: "https://thorbis.com/challenges",
		mainEntity: {
			"@type": "Event",
			name: "Business Challenge Events",
			description: "Various business challenges and competitive events",
			organizer: {
				"@type": "Organization",
				name: "Thorbis",
			},
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
						"@id": "https://thorbis.com/challenges",
						name: "Challenges",
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
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Business Challenges</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">This page is under construction. Check back soon for our new business challenges feature.</p>
					</div>
				</div>
			</div>
		</>
	);
}
