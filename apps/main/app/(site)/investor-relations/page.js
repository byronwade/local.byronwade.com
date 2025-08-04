import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Download, TrendingUp, DollarSign, FileText } from "lucide-react";

const financialHighlights = [
	{ metric: "YOY Revenue Growth", value: "45%", change: "increase" },
	{ metric: "Active Users (MAU)", value: "2.5 Million", change: "increase" },
	{ metric: "Enterprise Customers", value: "5,000+", change: "increase" },
];

const investorResources = [
	{ title: "Q3 2023 Earnings Report", date: "October 26, 2023", link: "#" },
	{ title: "2023 Annual Shareholder Letter", date: "August 15, 2023", link: "#" },
	{ title: "SEC Filings", date: "Ongoing", link: "#" },
];

export const metadata = {
	title: "Investor Relations - Financial Reports & Shareholder Information | Thorbis",
	description: "Access Thorbis investor relations information, financial reports, SEC filings, and shareholder resources. Learn about our growth, performance, and long-term value creation.",
	keywords: ["investor relations", "financial reports", "SEC filings", "shareholder information", "earnings", "annual reports", "thorbis stock"],
	openGraph: {
		title: "Investor Relations - Financial Reports & Shareholder Information | Thorbis",
		description: "Access Thorbis investor relations information, financial reports, SEC filings, and shareholder resources. Learn about our growth, performance, and long-term value creation.",
		url: "https://local.byronwade.com/investor-relations",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-investor-relations.jpg",
				width: 1200,
				height: 630,
				alt: "Thorbis Investor Relations",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Investor Relations - Thorbis",
		description: "Access financial reports, SEC filings, and shareholder information for Thorbis.",
		images: ["https://local.byronwade.com/og-investor-relations.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/investor-relations",
	},
};

export default function InvestorRelationsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Investor Relations",
		description: "Thorbis investor relations, financial reports, and shareholder information",
		url: "https://local.byronwade.com/investor-relations",
		mainEntity: {
			"@type": "Organization",
			name: "Thorbis",
			url: "https://local.byronwade.com",
			logo: "https://local.byronwade.com/logos/ThorbisLogo.webp",
			description: "Building the future of local commerce and creating long-term value for shareholders",
			hasOfferCatalog: {
				"@type": "OfferCatalog",
				name: "Investor Resources",
				itemListElement: [
					{
						"@type": "MediaObject",
						name: "Q3 2023 Earnings Report",
						datePublished: "2023-10-26",
						encodingFormat: "application/pdf",
					},
					{
						"@type": "MediaObject",
						name: "2023 Annual Shareholder Letter",
						datePublished: "2023-08-15",
						encodingFormat: "application/pdf",
					},
					{
						"@type": "MediaObject",
						name: "SEC Filings",
						description: "Ongoing regulatory filings and disclosures",
					},
				],
			},
			knowsAbout: ["Local Business Platform", "Revenue Growth", "Customer Acquisition", "Enterprise Solutions"],
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
						"@id": "https://local.byronwade.com/investor-relations",
						name: "Investor Relations",
					},
				},
			],
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="bg-muted">
					<div className="py-24 px-4 lg:px-24 max-w-5xl mx-auto">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Investor Relations</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl text-muted-foreground">Thorbis is committed to creating long-term value for our shareholders. We&apos;re building the future of local commerce, and we&apos;re excited to have you on this journey.</p>
					</div>
				</div>

				{/* Financial Highlights */}
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight mb-12">Financial Highlights</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{financialHighlights.map((highlight) => (
								<Card key={highlight.metric}>
									<CardHeader className="flex flex-row items-center justify-between pb-2">
										<CardTitle className="text-sm font-medium">{highlight.metric}</CardTitle>
										<TrendingUp className="w-4 h-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{highlight.value}</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>

				{/* Resources */}
				<div className="bg-muted py-24 px-4 lg:px-24">
					<div className="max-w-5xl mx-auto">
						<h2 className="text-3xl font-bold tracking-tight mb-12">Resources & Reports</h2>
						<Card>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Document</TableHead>
										<TableHead>Date</TableHead>
										<TableHead className="text-right">Download</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{investorResources.map((resource) => (
										<TableRow key={resource.title}>
											<TableCell className="font-medium">{resource.title}</TableCell>
											<TableCell>{resource.date}</TableCell>
											<TableCell className="text-right">
												<Button asChild variant="ghost" size="icon">
													<a href={resource.link}>
														<Download className="w-4 h-4" />
													</a>
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
