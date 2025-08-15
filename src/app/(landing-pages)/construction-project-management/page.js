export const metadata = {
	title: "Construction Project Management Software – Scheduling, Teams, Budget Tracking | Thorbis",
	description: "Comprehensive construction project management with team coordination, budget tracking, progress monitoring, and subcontractor management.",
	keywords: ["construction project management", "construction scheduling software", "project budget tracking", "construction team management", "subcontractor management"],
	alternates: { canonical: "https://thorbis.com/construction-project-management" },
	openGraph: {
		title: "Construction Project Management Software – Complete Project Control",
		description: "Team coordination, budget tracking, progress monitoring, and subcontractor management.",
		type: "website",
		url: "https://thorbis.com/construction-project-management",
		siteName: "Thorbis",
		images: [
			{
				url: `https://thorbis.com/opengraph-image?title=${encodeURIComponent("Construction Project Management")}&description=${encodeURIComponent("Team coordination, budget tracking, and progress monitoring.")}`,
				width: 1200,
				height: 630,
				alt: "Thorbis Construction Project Management Software",
			},
		],
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Construction Project Management Software – Complete Project Control",
		description: "Team coordination, budget tracking, progress monitoring, and subcontractor management.",
		images: [`https://thorbis.com/twitter-image?title=${encodeURIComponent("Construction Project Management")}`],
		creator: "@thorbis",
		site: "@thorbis",
	},
};

import { Star, Calendar, DollarSign, Users } from "lucide-react";

function JsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: "Construction Project Management Software",
		description: "Complete project control with scheduling, budget tracking, and team coordination.",
		brand: { "@type": "Brand", name: "Thorbis" },
		offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
	};
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function ConstructionProjectManagement() {
	const features = [
		{ 
			title: "Project Scheduling", 
			points: ["Gantt chart planning", "Critical path analysis", "Milestone tracking"],
			icon: Calendar
		},
		{ 
			title: "Budget Management", 
			points: ["Cost tracking", "Budget vs actual reporting", "Change order management"],
			icon: DollarSign
		},
		{ 
			title: "Team Coordination", 
			points: ["Subcontractor management", "Crew scheduling", "Communication tools"],
			icon: Users
		},
	];

	return (
		<main className="min-h-screen w-full bg-white dark:bg-neutral-900 px-4 sm:px-6 lg:px-8 py-10">
			<JsonLd />
			
			{/* Social Proof */}
			<section className="px-4 py-4 mx-auto max-w-6xl">
				<div className="flex flex-col items-center gap-2 text-center">
					<div className="flex items-center gap-1 text-amber-500">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
						))}
					</div>
					<p className="text-sm text-muted-foreground">Managing $2B+ in construction projects • 4.9/5 project manager rating</p>
				</div>
			</section>

			{/* Hero Section */}
			<section className="max-w-6xl mx-auto text-center space-y-6">
				<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
					Construction Project Management Software
				</h1>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					Take control of your construction projects with comprehensive scheduling, budget tracking, team coordination, and progress monitoring tools.
				</p>
				<div className="flex items-center justify-center gap-4 pt-4">
					<a href="/signup" className="inline-flex items-center rounded-md bg-orange-600 px-6 py-3 text-white font-semibold hover:bg-orange-700 transition-colors">
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
							<feature.icon className="w-8 h-8 text-orange-600" />
							<h3 className="font-bold text-lg">{feature.title}</h3>
						</div>
						<ul className="space-y-2 text-sm text-muted-foreground">
							{feature.points.map((point) => (
								<li key={point} className="flex items-start gap-2">
									<span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
									{point}
								</li>
							))}
						</ul>
					</div>
				))}
			</section>

			{/* CTA Section */}
			<section className="max-w-4xl mx-auto mt-16 text-center bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-white">
				<h2 className="text-3xl font-bold mb-4">Deliver Projects On Time & On Budget</h2>
				<p className="text-lg mb-6 opacity-90">Join construction leaders using Thorbis to improve project outcomes.</p>
				<div className="flex items-center justify-center gap-4">
					<a href="/signup" className="inline-flex items-center rounded-md bg-white text-orange-600 px-6 py-3 font-semibold hover:bg-gray-100 transition-colors">
						Start Free Trial
					</a>
				</div>
			</section>
		</main>
	);
}
