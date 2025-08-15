export const metadata = {
	title: "Legal Case Management Software – Matter Tracking, Deadlines, Documents | Thorbis",
	description: "Advanced legal case management software with matter tracking, deadline management, document organization, and collaboration tools for attorneys.",
	keywords: ["legal case management software", "matter management", "legal deadline tracking", "attorney case tracking", "legal workflow software"],
	alternates: { canonical: "https://thorbis.com/legal-case-management" },
	openGraph: {
		title: "Legal Case Management Software – Advanced Matter Tracking",
		description: "Matter tracking, deadline management, and document organization for attorneys.",
		type: "website",
		url: "https://thorbis.com/legal-case-management",
		siteName: "Thorbis",
		images: [
			{
				url: `https://thorbis.com/opengraph-image?title=${encodeURIComponent("Legal Case Management")}&description=${encodeURIComponent("Matter tracking, deadline management, and document organization.")}`,
				width: 1200,
				height: 630,
				alt: "Thorbis Legal Case Management Software",
			},
		],
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Legal Case Management Software – Advanced Matter Tracking",
		description: "Matter tracking, deadline management, and document organization for attorneys.",
		images: [`https://thorbis.com/twitter-image?title=${encodeURIComponent("Legal Case Management")}`],
		creator: "@thorbis",
		site: "@thorbis",
	},
};

import { Star, Gavel, Calendar, Folder } from "lucide-react";

function JsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: "Legal Case Management Software",
		description: "Advanced case tracking with deadline management and document organization for legal professionals.",
		brand: { "@type": "Brand", name: "Thorbis" },
		offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
	};
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function BreadcrumbsJsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: "https://thorbis.com/" },
			{ "@type": "ListItem", position: 2, name: "Legal Case Management", item: "https://thorbis.com/legal-case-management" },
		],
	};
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function LegalCaseManagement() {
	const features = [
		{ 
			title: "Matter & Case Tracking", 
			points: ["Case progress monitoring", "Matter status updates", "Client matter history"],
			icon: Gavel
		},
		{ 
			title: "Deadline & Calendar Management", 
			points: ["Court date tracking", "Statute of limitations alerts", "Task deadline reminders"],
			icon: Calendar
		},
		{ 
			title: "Legal Document Organization", 
			points: ["Case file management", "Evidence organization", "Legal research integration"],
			icon: Folder
		},
	];

	return (
		<main className="min-h-screen w-full bg-white dark:bg-neutral-900 px-4 sm:px-6 lg:px-8 py-10">
			<JsonLd />
			<BreadcrumbsJsonLd />
			
			{/* Social Proof */}
			<section className="px-4 py-4 mx-auto max-w-6xl">
				<div className="flex flex-col items-center gap-2 text-center">
					<div className="flex items-center gap-1 text-amber-500">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
						))}
					</div>
					<p className="text-sm text-muted-foreground">Managing 50,000+ legal cases • 4.7/5 attorney rating</p>
				</div>
			</section>

			{/* Hero Section */}
			<section className="max-w-6xl mx-auto text-center space-y-6">
				<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
					Legal Case Management Software
				</h1>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					Advanced case tracking and matter management system with deadline alerts, document organization, and collaboration tools built specifically for legal professionals.
				</p>
				<div className="flex items-center justify-center gap-4 pt-4">
					<a href="/signup" className="inline-flex items-center rounded-md bg-slate-700 px-6 py-3 text-white font-semibold hover:bg-slate-800 transition-colors">
						Start Free Trial
					</a>
					<a href="/contact" className="inline-flex items-center rounded-md border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50 transition-colors">
						Request Demo
					</a>
				</div>
			</section>

			{/* Features Grid */}
			<section className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
				{features.map((feature) => (
					<div key={feature.title} className="rounded-xl border p-6 bg-card hover:shadow-lg transition-shadow">
						<div className="flex items-center gap-3 mb-4">
							<feature.icon className="w-8 h-8 text-slate-700" />
							<h3 className="font-bold text-lg">{feature.title}</h3>
						</div>
						<ul className="space-y-2 text-sm text-muted-foreground">
							{feature.points.map((point) => (
								<li key={point} className="flex items-start gap-2">
									<span className="w-1.5 h-1.5 bg-slate-700 rounded-full mt-2 flex-shrink-0"></span>
									{point}
								</li>
							))}
						</ul>
					</div>
				))}
			</section>

			{/* CTA Section */}
			<section className="max-w-4xl mx-auto mt-16 text-center bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-8 text-white">
				<h2 className="text-3xl font-bold mb-4">Never Miss a Deadline Again</h2>
				<p className="text-lg mb-6 opacity-90">Keep your cases organized and on track with our comprehensive case management platform.</p>
				<div className="flex items-center justify-center gap-4">
					<a href="/signup" className="inline-flex items-center rounded-md bg-white text-slate-700 px-6 py-3 font-semibold hover:bg-gray-100 transition-colors">
						Start Free Trial
					</a>
				</div>
			</section>
		</main>
	);
}
