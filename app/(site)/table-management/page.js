export const metadata = {
	title: "Restaurant Table Management System - Streamline Reservations | Thorbis",
	description: "Optimize your restaurant operations with Thorbis table management system. Handle reservations, waitlists, and table turnover efficiently to maximize revenue and customer satisfaction.",
	keywords: ["table management", "restaurant reservations", "table booking", "restaurant management", "dining reservations", "restaurant software"],
	openGraph: {
		title: "Restaurant Table Management System - Streamline Reservations | Thorbis",
		description: "Optimize your restaurant operations with Thorbis table management system. Handle reservations, waitlists, and table turnover efficiently to maximize revenue and customer satisfaction.",
		url: "https://local.byronwade.com/table-management",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-table-management.jpg",
				width: 1200,
				height: 630,
				alt: "Table Management System on Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Restaurant Table Management - Thorbis",
		description: "Streamline reservations and optimize table turnover with our management system.",
		images: ["https://local.byronwade.com/og-table-management.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/table-management",
	},
};

export default function TableManagementPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Restaurant Table Management System",
		description: "Comprehensive table management and reservation system for restaurants",
		url: "https://local.byronwade.com/table-management",
		mainEntity: {
			"@type": "SoftwareApplication",
			name: "Thorbis Table Management",
			description: "Restaurant table management and reservation system",
			applicationCategory: "RestaurantManagement",
			offers: {
				"@type": "Offer",
				description: "Professional table management solution for restaurants",
			},
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
						"@id": "https://local.byronwade.com/table-management",
						name: "Table Management",
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
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Restaurant Table Management</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">This page is under construction. Check back soon for our comprehensive table management and reservation system for restaurants.</p>
					</div>
				</div>
			</div>
		</>
	);
}
