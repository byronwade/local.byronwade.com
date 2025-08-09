export const metadata = {
	title: "LocalHub Marketplace Platform – Directories, Reviews, Leads | Thorbis",
	description: "Launch branded local directories with business profiles, reviews, SEO pages, and direct leads to your CRM.",
	keywords: ["local directory platform", "review platform", "SEO pages", "lead generation", "white label directory", "organizer marketplace"],
	alternates: { canonical: "https://thorbis.com/localhub-marketplace-platform" },
	openGraph: {
		title: "LocalHub Marketplace Platform – Launch Your Directory",
		description: "Business profiles, reviews, SEO pages, and direct leads.",
		type: "website",
		url: "https://thorbis.com/localhub-marketplace-platform",
		siteName: "Thorbis",
		images: [{ url: "https://thorbis.com/og-localhub-marketplace.jpg", width: 1200, height: 630, alt: "Thorbis LocalHub Marketplace Platform" }],
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "LocalHub Marketplace Platform – Launch Your Directory",
		description: "Business profiles, reviews, SEO pages, and direct leads.",
		images: ["https://thorbis.com/og-localhub-marketplace.jpg"],
		creator: "@thorbis",
		site: "@thorbis",
	},
};

function JsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: "LocalHub Marketplace Platform",
		description: "Branded local directories with SEO pages and direct lead routing.",
		brand: { "@type": "Brand", name: "Thorbis" },
		offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
	};
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function BreadcrumbsJsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: "https://thorbis.com" },
			{ "@type": "ListItem", position: 2, name: "LocalHub Marketplace Platform", item: "https://thorbis.com/localhub-marketplace-platform" },
		],
	};
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function LocalHubMarketplacePlatform() {
	const features = [
		{ title: "SEO Directories", points: ["Industry pages", "Local landing pages"] },
		{ title: "Profiles & Reviews", points: ["Media & services", "Moderation tools"] },
		{ title: "Lead Routing", points: ["Instant CRM handoff", "Attribution & analytics"] },
	];

	return (
		<main className="min-h-screen w-full bg-white dark:bg-neutral-900 px-4 sm:px-6 lg:px-8 py-10">
			<JsonLd />
			<BreadcrumbsJsonLd />
			<section className="max-w-6xl mx-auto text-center space-y-4">
				<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">LocalHub Marketplace Platform</h1>
				<p className="text-muted-foreground max-w-3xl mx-auto">Launch a branded directory that drives qualified leads directly to your pipeline.</p>
				<div className="flex items-center justify-center gap-3">
					<a href="/signup" className="inline-flex items-center rounded-md bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700">
						Start free
					</a>
					<a href="/contact" className="inline-flex items-center rounded-md border px-5 py-3 font-semibold hover:bg-accent">
						Schedule demo
					</a>
				</div>
			</section>

			<section className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
				{features.map((f) => (
					<div key={f.title} className="rounded-xl border p-6 bg-card">
						<h3 className="font-bold text-lg mb-2">{f.title}</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
							{f.points.map((p) => (
								<li key={p}>{p}</li>
							))}
						</ul>
					</div>
				))}
			</section>
		</main>
	);
}
