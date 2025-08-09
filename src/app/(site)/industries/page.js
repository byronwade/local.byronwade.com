export const metadata = {
	title: "Industries – Software Solutions by Thorbis",
	description: "Explore industry solutions: field service, construction, retail, healthcare, hospitality, logistics, and more.",
	keywords: ["industry software", "field service software", "construction software", "retail software", "healthcare software", "hospitality software", "logistics software"],
	alternates: { canonical: "https://thorbis.com/industries" },
	openGraph: {
		title: "Industries – Solutions Catalog",
		description: "Browse industry solutions from Thorbis.",
		url: "https://thorbis.com/industries",
		siteName: "Thorbis",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Industries – Thorbis Solutions",
		description: "Explore Thorbis solutions by industry.",
	},
};

function CollectionJsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: "Industries",
		description: "Catalog of industry solutions offered by Thorbis.",
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Home", item: "https://thorbis.com/" },
				{ "@type": "ListItem", position: 2, name: "Industries", item: "https://thorbis.com/industries" },
			],
		},
	};
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

const items = [
	{ href: "/academy-learning-platform", label: "Academy Learning Platform" },
	{ href: "/admin-operations-console", label: "Admin Operations Console" },
	{ href: "/agriculture-management-software", label: "Agriculture Management Software" },
	{ href: "/automotive-shop-software", label: "Automotive Shop Software" },
	{ href: "/beauty-salon-software", label: "Beauty Salon Software" },
	{ href: "/business-management-platform", label: "Business Management Platform" },
	{ href: "/construction-management-software", label: "Construction Management Software" },
	{ href: "/ecommerce-operations-platform", label: "eCommerce Operations Platform" },
	{ href: "/energy-services-software", label: "Energy Services Software" },
	{ href: "/field-management-software", label: "Field Management Software" },
	{ href: "/field-service-management", label: "Field Service Management" },
	{ href: "/fitness-studio-software", label: "Fitness Studio Software" },
	{ href: "/healthcare-operations-platform", label: "Healthcare Operations Platform" },
	{ href: "/hospitality-operations-platform", label: "Hospitality Operations Platform" },
	{ href: "/localhub-marketplace-platform", label: "LocalHub Marketplace Platform" },
	{ href: "/logistics-operations-platform", label: "Logistics Operations Platform" },
	{ href: "/nonprofit-operations-platform", label: "Nonprofit Operations Platform" },
	{ href: "/professional-services-platform", label: "Professional Services Platform" },
	{ href: "/property-management-platform", label: "Property Management Platform" },
	{ href: "/real-estate-operations-platform", label: "Real Estate Operations Platform" },
	{ href: "/retail-operations-platform", label: "Retail Operations Platform" },
];

export default function IndustriesIndex() {
	return (
		<main className="min-h-screen w-full bg-white dark:bg-neutral-900 px-4 sm:px-6 lg:px-8 py-10">
			<CollectionJsonLd />
			<section className="max-w-6xl mx-auto text-center space-y-4">
				<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Industries</h1>
				<p className="text-muted-foreground max-w-3xl mx-auto">Software tailored to the workflows of your industry.</p>
			</section>

			<section className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{items.map((i) => (
					<a key={i.href} href={i.href} className="rounded-xl border p-5 bg-card hover:bg-accent transition-colors">
						<div className="text-lg font-semibold">{i.label}</div>
						<div className="text-sm text-muted-foreground mt-1 break-words">{i.href}</div>
					</a>
				))}
			</section>
		</main>
	);
}
