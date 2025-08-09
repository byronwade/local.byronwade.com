import { isEnabled } from "@lib/flags/server";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Download, TrendingUp, ExternalLink, PlayCircle, CalendarDays, Mail, Users, Shield, Star, LineChart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ClientAnalyticsSection from "@components/site/investor/AnalyticsSection";

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
		url: "https://thorbis.com/investor-relations",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis.com/og-investor-relations.jpg",
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
		images: ["https://thorbis.com/og-investor-relations.jpg"],
	},
	alternates: {
		canonical: "https://thorbis.com/investor-relations",
	},
};

export default async function InvestorRelationsPage() {
	const on = await isEnabled("investorRelations");
	if (!on) {
		return (
			<div className="container mx-auto px-4 py-16">
				<h1 className="text-2xl font-semibold">Investor Relations is not available</h1>
				<p className="text-muted-foreground mt-2">Please check back soon.</p>
			</div>
		);
	}
	const jsonLdWebPage = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Investor Relations",
		description: "Thorbis investor relations, financial reports, and investor landing content including product vision, market analysis, and demos.",
		url: "https://thorbis.com/investor-relations",
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: { "@id": "https://thorbis.com", name: "Thorbis" },
				},
				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@id": "https://thorbis.com/investor-relations",
						name: "Investor Relations",
					},
				},
			],
		},
	};

	const jsonLdOrganization = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Thorbis",
		url: "https://thorbis.com",
		logo: "https://thorbis.com/logos/ThorbisLogo.webp",
		description: "Unified local discovery and field service management platform enabling search, booking, job management, payments, and verified reviews.",
		contactPoint: [{ "@type": "ContactPoint", contactType: "Investor Relations", email: "investors@thorbis.com" }],
	};

	const jsonLdWebsite = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Thorbis",
		url: "https://thorbis.com",
		potentialAction: {
			"@type": "SearchAction",
			target: "https://thorbis.com/search?q={query}",
			"query-input": "required name=query",
		},
	};

	const jsonLdFAQ = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "What is Thorbis and how is it different?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Thorbis unifies consumer local discovery with business field service management, creating a closed-loop experience from search to booking, job management, payment, and verified reviews.",
				},
			},
			{
				"@type": "Question",
				name: "What is the market opportunity?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "U.S. home services spending is projected to reach ~$1.42T by 2030 with increasing online penetration. FSM software is projected to grow to ~$11.5B by 2030.",
				},
			},
			{
				"@type": "Question",
				name: "How does Thorbis make money?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Multiple streams: transaction fees on completed bookings, SaaS subscriptions for advanced FSM features, targeted sponsored placements, and premium verification services.",
				},
			},
			{
				"@type": "Question",
				name: "Why now?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Consumer expectations for on-demand booking, high mobile adoption among service pros, incumbent model shifts, and modern cloud/payment infrastructure enable a superior unified experience.",
				},
			},
		],
	};

	const jsonLdSoftware = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Thorbis Business OS",
		operatingSystem: "Web",
		applicationCategory: "BusinessApplication",
		description: "All-in-one operating system for local businesses: scheduling, dispatch, CRM, invoicing, payments, POS, analytics, and integrated marketplace.",
		audience: { "@type": "BusinessAudience", audienceType: "Owner, Office Staff, Technician" },
		offers: {
			"@type": "Offer",
			price: "0-299",
			priceCurrency: "USD",
		},
	};

	const jsonLdResources = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, item: { "@type": "CreativeWork", name: "Q3 2023 Earnings Report", datePublished: "2023-10-26", url: "#" } },
			{ "@type": "ListItem", position: 2, item: { "@type": "CreativeWork", name: "2023 Annual Shareholder Letter", datePublished: "2023-08-15", url: "#" } },
			{ "@type": "ListItem", position: 3, item: { "@type": "CreativeWork", name: "SEC Filings", url: "#" } },
		],
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdResources) }} />
			<div className="bg-background text-foreground">
				{/* Hero Section */}
				<div className="bg-muted">
					<div className="px-4 py-28 mx-auto max-w-5xl text-center lg:px-24">
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Investor Relations</h1>
						<p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-muted-foreground">Thorbis is committed to creating long-term value for our shareholders. We&apos;re building the future of local commerce, and we&apos;re excited to have you on this journey.</p>
						<div className="flex flex-wrap gap-3 justify-center mt-10">
							<Button asChild size="lg">
								<Link href="/business">Request a product walkthrough</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<a href="#demos" className="inline-flex gap-2 items-center">
									Explore live demos <PlayCircle className="w-4 h-4" />
								</a>
							</Button>
						</div>
						<div className="flex flex-wrap gap-6 justify-center mt-10 text-sm text-muted-foreground">
							<a href="#executive-summary" className="hover:underline">
								Executive summary
							</a>
							<a href="#leadership" className="hover:underline">
								Leadership
							</a>
							<a href="#market" className="hover:underline">
								Market analysis
							</a>
							<a href="#demos" className="hover:underline">
								Product demos
							</a>
							<a href="#case-studies" className="hover:underline">
								Case studies
							</a>
							<a href="#press" className="hover:underline">
								Press & awards
							</a>
							<a href="#events" className="hover:underline">
								Investor events
							</a>
							<a href="#subscribe" className="hover:underline">
								Subscribe
							</a>
							<a href="#contact" className="hover:underline">
								Contact IR
							</a>
						</div>
					</div>
				</div>

				{/* Metrics at a Glance */}
				<div className="px-4 py-16 lg:px-24 bg-background">
					<div className="grid grid-cols-2 gap-6 mx-auto max-w-5xl md:grid-cols-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm text-muted-foreground">Users</CardTitle>
							</CardHeader>
							<CardContent className="text-3xl font-bold tracking-tight">2.5M+</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm text-muted-foreground">Retention (90d)</CardTitle>
							</CardHeader>
							<CardContent className="text-3xl font-bold tracking-tight">89%</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm text-muted-foreground">NPS</CardTitle>
							</CardHeader>
							<CardContent className="text-3xl font-bold tracking-tight">61</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm text-muted-foreground">Booking Conversion</CardTitle>
							</CardHeader>
							<CardContent className="text-3xl font-bold tracking-tight">18%</CardContent>
						</Card>
					</div>
				</div>

				{/* Financial Highlights */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-12 text-3xl font-bold tracking-tight">Financial Highlights</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							{financialHighlights.map((highlight) => (
								<Card key={highlight.metric}>
									<CardHeader className="flex flex-row justify-between items-center pb-2">
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

				{/* Executive Summary (blog-style) */}
				<div id="executive-summary" className="px-4 py-28 border-t lg:px-24">
					<div className="mx-auto space-y-8 max-w-5xl">
						<h2 className="text-3xl font-bold tracking-tight">Thorbis: Bridging Local Discovery with Field Service Management</h2>
						<div className="max-w-none text-balance prose prose-neutral dark:prose-invert">
							<p>Thorbis unifies two powerful functions: consumer-facing discovery and business-facing field service management. This closed-loop model connects discovery with delivery—search → booking → job management → payment → verified review— creating network effects that are difficult for ad-only directories or pure FSM suites to replicate.</p>
							<p>Consumers gain instant, trusted booking and secure payments. Service businesses get operational tools and a direct pipeline of ready-to-book customers. Our economic alignment—fees on completed jobs and value-driven SaaS— builds durable, high-ROI relationships with both sides of the marketplace.</p>
						</div>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Consumer Experience</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 text-sm text-muted-foreground">
									<p>Search top-rated local pros with verified credentials and reviews linked to real transactions.</p>
									<p>Instant booking with real-time availability, transparent pricing, and secure payments.</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Business Experience</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 text-sm text-muted-foreground">
									<p>Lead-to-job pipeline that drops bookings straight into calendars with routing and dispatch.</p>
									<p>CRM, quotes, invoicing, and payments built-in; only pay on successful outcomes or for pro tools.</p>
								</CardContent>
							</Card>
						</div>

						{/* Vision Video / Presentation */}
						<div className="mt-12">
							<div className="overflow-hidden w-full rounded-xl border aspect-video bg-black/50">
								<video controls playsInline preload="metadata" className="w-full h-full">
									<source src="/assets/videos/welding.mp4" type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							</div>
						</div>
					</div>
				</div>

				{/* Feature Mosaic */}
				<div className="px-4 py-24 lg:px-24 bg-muted/50">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-10 text-3xl font-bold tracking-tight">Why Thorbis Wins</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle>Closed-Loop Engine</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Search → booking → job management → payment → verified review. The entire lifecycle happens on-platform.</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Trust-Centric Reviews</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">We don’t discard; we flag and hide by default. Users can still find all reviews for transparency.</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Business OS</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Scheduling, dispatch, CRM, quotes, invoicing, POS, analytics—beautiful on any device.</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Ad System</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Prominent placements (incl. competitor pages), budgets from $5/day, real-time analytics.</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>LocalHub Scale</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Organizer marketplaces feed supply into the main directory; revenue share accelerates growth.</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Thorbis Academy</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Coursera-style courses for trades—credentials that drive trust, hiring, and bookings.</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Split Visuals */}
				<div className="px-4 py-24 lg:px-24">
					<div className="grid grid-cols-1 gap-10 mx-auto max-w-5xl md:grid-cols-2">
						<div className="space-y-4">
							<h3 className="text-2xl font-bold tracking-tight">From Search to Service</h3>
							<p className="text-muted-foreground">Instant booking with real-time availability and verified pros. A frictionless experience that feels inevitable.</p>
							<Button asChild>
								<Link href="/how-it-works">See how it works</Link>
							</Button>
						</div>
						<div className="overflow-hidden rounded-xl border">
							<Image src="/assets/images/heroes/pexels-christian-heitz-285904-842711.jpg" alt="Thorbis search and booking" width={1200} height={800} className="object-cover w-full h-full" />
						</div>
					</div>
				</div>

				{/* Milestones Timeline */}
				<div className="px-4 py-24 lg:px-24 bg-muted/50">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-10 text-3xl font-bold tracking-tight">Milestones</h2>
						<ol className="relative pl-6 border-l">
							<li className="mb-8">
								<div className="absolute top-1 -left-2 w-4 h-4 rounded-full border bg-background" />
								<time className="text-xs text-muted-foreground">Q1 2025</time>
								<p className="font-medium">Closed-loop MVP (search → booking → payment → review)</p>
							</li>
							<li className="mb-8">
								<div className="absolute top-1 -left-2 w-4 h-4 rounded-full border bg-background" />
								<time className="text-xs text-muted-foreground">Q2 2025</time>
								<p className="font-medium">Business OS beta across 3 verticals with POS add-ons</p>
							</li>
							<li className="mb-8">
								<div className="absolute top-1 -left-2 w-4 h-4 rounded-full border bg-background" />
								<time className="text-xs text-muted-foreground">Q3 2025</time>
								<p className="font-medium">LocalHub organizer marketplaces + ad system pilot</p>
							</li>
							<li>
								<div className="absolute top-1 -left-2 w-4 h-4 rounded-full border bg-background" />
								<time className="text-xs text-muted-foreground">Q4 2025</time>
								<p className="font-medium">Thorbis Academy launch with certification tracks</p>
							</li>
						</ol>
					</div>
				</div>
				{/* Network Effects & Moat */}
				<div className="px-4 py-24 lg:px-24 bg-muted/50">
					<div className="mx-auto space-y-6 max-w-5xl">
						<h2 className="text-3xl font-bold tracking-tight">Network Effects and Competitive Moat</h2>
						<ul className="pl-6 space-y-2 list-disc text-muted-foreground">
							<li>
								<span className="font-medium text-foreground">Closed-loop lifecycle:</span> discovery → booking → job management → payment → verified review.
							</li>
							<li>
								<span className="font-medium text-foreground">Quality at scale:</span> reviews tied to real transactions; license/badge verification available.
							</li>
							<li>
								<span className="font-medium text-foreground">Two-sided growth:</span> more consumers attract more pros and vice versa; high switching costs.
							</li>
							<li>
								<span className="font-medium text-foreground">Hard to copy:</span> ad-driven directories lack fulfillment; FSM tools lack demand generation.
							</li>
						</ul>
					</div>
				</div>

				{/* Strategic Differentiation vs Google/Yelp */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto space-y-6 max-w-5xl">
						<h2 className="text-3xl font-bold tracking-tight">Competing Differently: Software-First + Trust-Centric Reviews</h2>
						<div className="max-w-none prose prose-neutral dark:prose-invert">
							<p>
								Unlike ad-only directories, Thorbis is a software company first. We build the operational backbone for local businesses
								<span className="whitespace-nowrap">—scheduling</span>, dispatch, CRM, quotes, invoicing, POS, analytics— and pair it with a specialized review platform that maximizes transparency and minimizes noise.
							</p>
						</div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Specialized Review Platform</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 text-sm text-muted-foreground">
									<p>
										No reviews are discarded. Low-quality or policy-violating reviews are <span className="font-medium text-foreground">flagged and hidden by default</span>
										but remain discoverable to users who want full context. This reduces manipulation while preserving transparency.
									</p>
									<div className="flex gap-3">
										<Button asChild variant="secondary">
											<Link href="/content-guidelines">Review policy</Link>
										</Button>
										<Button asChild variant="ghost">
											<Link href="/transparency">Transparency</Link>
										</Button>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>All-in-One Business Software</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 text-sm text-muted-foreground">
									<p>
										Beautiful, responsive tools that manage the entire company on any device. Businesses choose Thorbis because it runs their day—and then <span className="font-medium text-foreground">sends customers back</span> to the directory to create a growth flywheel.
									</p>
									<div className="flex gap-3">
										<Button asChild>
											<Link href="/admin-operations-console">Admin ops console</Link>
										</Button>
										<Button asChild variant="ghost">
											<Link href="/automotive-shop-software">Vertical (Automotive)</Link>
										</Button>
										<Button asChild variant="ghost">
											<Link href="/beauty-salon-software">Vertical (Salon)</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Thorbis “Michelin-Style” Recognition</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm text-muted-foreground">
								<p>A curated excellence signal that highlights craftsmanship, reliability, and service quality— built on verified work and credentialing. Recognition enhances consumer trust and drives premium demand.</p>
								<div className="flex gap-3">
									<Button asChild>
										<Link href="/certified">Certification overview</Link>
									</Button>
									<Button asChild variant="ghost">
										<Link href="/certified/biz">Meet certified pros</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Market Opportunity */}
				<div id="market" className="px-4 py-24 lg:px-24">
					<div className="mx-auto space-y-4 max-w-5xl">
						<h2 className="text-3xl font-bold tracking-tight">Market Opportunity and Timing</h2>
						<p className="text-muted-foreground">U.S. home services spends toward ~$1.42T by 2030 with increasing online booking. FSM software projected to ~$11.5B by 2030. Consumer behavior favors online discovery and reviews; pros adopt mobile-first tools. Incumbents are ad/lead-first and in flux.</p>
						<div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
							<Card>
								<CardHeader className="flex gap-2 items-center">
									<LineChart className="w-4 h-4 text-muted-foreground" />
									<CardTitle className="text-base">TAM</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Home services spend trending toward ~$1.42T by 2030.</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex gap-2 items-center">
									<Users className="w-4 h-4 text-muted-foreground" />
									<CardTitle className="text-base">Adoption</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">High mobile adoption among pros; consumers prefer instant online booking.</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex gap-2 items-center">
									<Shield className="w-4 h-4 text-muted-foreground" />
									<CardTitle className="text-base">Trust</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Verified reviews and credentials as core trust enablers.</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Revenue Model */}
				<div className="px-4 py-24 lg:px-24 bg-muted/50">
					<div className="grid grid-cols-1 gap-6 mx-auto max-w-5xl md:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle>Transaction Fees</CardTitle>
							</CardHeader>
							<CardContent className="text-sm text-muted-foreground">Fees on completed bookings align revenue with value delivered.</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>SaaS Subscriptions</CardTitle>
							</CardHeader>
							<CardContent className="text-sm text-muted-foreground">Tiered FSM features for solo pros to multi-team operations.</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Sponsored Placement</CardTitle>
							</CardHeader>
							<CardContent className="text-sm text-muted-foreground">High-intent ads that remain relevant and bookable.</CardContent>
						</Card>
					</div>
				</div>

				{/* Advertising System */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-6 text-3xl font-bold tracking-tight">Advertising System (Yelp-Class, Software-Native)</h2>
						<p className="mb-6 text-muted-foreground">Prime visibility with budgets as low as $5/day, performance analytics, and unique placements (including competitor pages). Software subscribers receive promotional credits.</p>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle>Prominent Placement</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Top-of-search and contextual competitor-page slots.</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Flexible Budgets</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Daily budgets starting at $5 with ROI-focused bidding.</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Real-Time Analytics</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Lead tracking and conversion reporting baked into the OS.</CardContent>
							</Card>
						</div>
						<div className="flex gap-3 mt-6">
							<Button asChild>
								<Link href="/advertise">Advertise on Thorbis</Link>
							</Button>
							<Button asChild variant="ghost">
								<Link href="/business">Get software + ad credits</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Platform Flywheel: LocalHub & Organizers */}
				<div className="px-4 py-24 lg:px-24 bg-muted/50">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-6 text-3xl font-bold tracking-tight">LocalHub & Organizer Marketplaces</h2>
						<p className="mb-6 text-muted-foreground">Organizers (cities, chambers, trade groups) run local directories on Thorbis. They set prices (or go free), we revenue-share, and participating businesses are automatically discoverable in the main marketplace—accelerating supply growth across cities.</p>
						<div className="flex gap-3">
							<Button asChild>
								<Link href="/localhub">Explore LocalHub</Link>
							</Button>
							<Button asChild variant="ghost">
								<Link href="/partners">Partner with Thorbis</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Education: Built-in Academy */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-6 text-3xl font-bold tracking-tight">Thorbis Academy: Upskill the Trades</h2>
						<p className="mb-6 text-muted-foreground">A Coursera-style learning platform for business owners and crews—plumbing code, profitability, sales, service excellence, and more. Content turns into credentials that boost trust and bookings.</p>
						<div className="flex gap-3">
							<Button asChild>
								<Link href="/academy-learning-platform">Academy overview</Link>
							</Button>
							<Button asChild variant="ghost">
								<Link href="/learn">Browse courses</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Investment & Hiring */}
				<div className="px-4 py-24 lg:px-24 bg-muted/50">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-6 text-3xl font-bold tracking-tight">Investment & Team</h2>
						<p className="mb-6 text-muted-foreground">We are actively hiring world-class developers and seeking strategic investment to accelerate product velocity: expand vertical toolkits (POS, tailored org setups), deepen review transparency, and scale LocalHub.</p>
						<div className="flex flex-wrap gap-3">
							<Button asChild>
								<Link href="/careers">See open roles</Link>
							</Button>
							<Button asChild variant="outline">
								<a href="mailto:investors@thorbis.com" className="inline-flex gap-2 items-center">
									Contact investors
									<Mail className="w-4 h-4" />
								</a>
							</Button>
						</div>
					</div>
				</div>

				{/* Live Demo Navigator */}
				<div id="demos" className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-6 text-3xl font-bold tracking-tight">Explore Product Demos</h2>
						<p className="mb-10 text-muted-foreground">Jump into live pages that showcase Thorbis experiences, features, and comparisons.</p>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Search & Discovery</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant="secondary" className="justify-between w-full">
										<Link href="/search" className="inline-flex items-center w-full">
											Try search
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/categories/all">
											Browse categories
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Verified Pros & Trust</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant="secondary" className="justify-between w-full">
										<Link href="/trust-safety">
											Trust & Safety
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/business-certification">
											Business certification
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>FSM Toolkit</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant="secondary" className="justify-between w-full">
										<Link href="/field-management-software">
											Field management software
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/business">
											Business hub
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/table-management">
											Team & scheduling
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Competitor Comparisons</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant="secondary" className="justify-between w-full">
										<Link href="/yelp-alternative">
											Yelp alternative
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/google-business-alternative">
											Google Business alternative
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/angies-list-alternative">
											Angi alternative
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/bark-alternative">
											Bark alternative
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/yellow-pages-alternative">
											Yellow Pages alternative
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Media & Content</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant="secondary" className="justify-between w-full">
										<Link href="/shorts">
											Shorts & video
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/live-streaming">
											Live streaming
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/blog">
											Blog
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Local Experiences</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant="secondary" className="justify-between w-full">
										<Link href="/localhub">
											LocalHub experience
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/explore-business">
											Explore businesses
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/how-it-works">
											How it works
											<ExternalLink className="ml-auto w-4 h-4" />
										</Link>
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Leadership Profiles */}
				<div id="leadership" className="px-4 py-24 lg:px-24 bg-muted/50">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-10 text-3xl font-bold tracking-tight">Leadership</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle>Founder & CEO</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Operator and product builder with experience across marketplaces and SMB SaaS.</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Head of Product</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Focused on user experience and operational efficiency for service pros and consumers.</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Head of GTM</CardTitle>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">Partnerships, channels, and category growth in local services and SMB ecosystems.</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Case Studies & Testimonials */}
				<div id="case-studies" className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-10 text-3xl font-bold tracking-tight">Case Studies & Testimonials</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Card>
								<CardHeader className="flex gap-2 items-center">
									<Star className="w-4 h-4 text-muted-foreground" />
									<CardTitle>Wade’s Plumbing & Septic</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3 text-sm text-muted-foreground">
									<p>Improved lead-to-job conversion with instant booking and on-platform messaging.</p>
									<Button asChild variant="ghost" className="justify-between w-full">
										<a href="/case-studies/wades-plumbing-and-septic">
											Read the case study <ExternalLink className="w-4 h-4" />
										</a>
									</Button>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex gap-2 items-center">
									<Star className="w-4 h-4 text-muted-foreground" />
									<CardTitle>Verified Pro Advantage</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3 text-sm text-muted-foreground">
									<p>Credential verification increases trust and booking rates across high-intent searches.</p>
									<Button asChild variant="ghost" className="justify-between w-full">
										<a href="/certified">
											Learn about certification <ExternalLink className="w-4 h-4" />
										</a>
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Press & Awards */}
				<div id="press" className="px-4 py-24 lg:px-24 bg-muted/50">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-10 text-3xl font-bold tracking-tight">Press & Awards</h2>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Press</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant className="justify-between w-full">
										<a href="/press">
											Press resources
											<ExternalLink className="ml-auto w-4 h-4" />
										</a>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<a href="/news">
											Company news
											<ExternalLink className="ml-auto w-4 h-4" />
										</a>
									</Button>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Awards & Certifications</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant="secondary" className="justify-between w-full">
										<a href="/certified/biz">
											Certified businesses
											<ExternalLink className="ml-auto w-4 h-4" />
										</a>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<a href="/transparency">
											Transparency & trust
											<ExternalLink className="ml-auto w-4 h-4" />
										</a>
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Vertical Toolkits & POS */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-10 text-3xl font-bold tracking-tight">Vertical Toolkits & POS</h2>
						<p className="mb-8 text-muted-foreground">Industry-tailored workflows and POS options designed for the nuances of each business type. Expand into new categories with prebuilt configurations.</p>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle>Automotive</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant="secondary" className="justify-between w-full">
										<Link href="/automotive-shop-software">Toolkit</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/admin-operations-console">POS & Ops Console</Link>
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Beauty & Salon</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant="secondary" className="justify-between w-full">
										<Link href="/beauty-salon-software">Toolkit</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/admin-operations-console">POS & Ops Console</Link>
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Agriculture</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button asChild variant="secondary" className="justify-between w-full">
										<Link href="/agriculture-management-software">Toolkit</Link>
									</Button>
									<Button asChild variant="ghost" className="justify-between w-full">
										<Link href="/admin-operations-console">POS & Ops Console</Link>
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Resources */}
				<div className="px-4 py-24 bg-muted lg:px-24">
					<div className="mx-auto max-w-5xl">
						<div className="flex gap-4 justify-between items-end mb-12">
							<h2 className="text-3xl font-bold tracking-tight">Resources & Reports</h2>
							<Button asChild variant="outline">
								<Link href="/changelog">View Changelog</Link>
							</Button>
						</div>
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

				{/* FAQ */}
				<div id="events" className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-6 text-3xl font-bold tracking-tight">Investor Events</h2>
						<p className="mb-6 text-muted-foreground">Join upcoming webinars, product deep dives, and Q&A sessions.</p>
						<div className="flex flex-wrap gap-3">
							<Button asChild>
								<a href="/events" className="inline-flex gap-2 items-center">
									View events <CalendarDays className="w-4 h-4" />
								</a>
							</Button>
							<Button asChild variant="outline">
								<a href="#contact" className="inline-flex gap-2 items-center">
									Request a private session <Users className="w-4 h-4" />
								</a>
							</Button>
						</div>
					</div>
				</div>

				{/* Subscribe & Contact */}
				<div id="subscribe" className="px-4 py-24 lg:px-24 bg-muted/50">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-6 text-3xl font-bold tracking-tight">Stay Informed</h2>
						<p className="mb-6 text-muted-foreground">Subscribe to investor updates and product announcements.</p>
						<div className="flex flex-wrap gap-3">
							<Button asChild>
								<a href="/rss">Subscribe via RSS</a>
							</Button>
							<Button asChild variant="outline">
								<a href="mailto:investors@thorbis.com" className="inline-flex gap-2 items-center">
									Join investor mailing list <Mail className="w-4 h-4" />
								</a>
							</Button>
						</div>
					</div>
				</div>

				<div id="contact" className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-6 text-3xl font-bold tracking-tight">Contact Investor Relations</h2>
						<div className="flex flex-wrap gap-3">
							<Button asChild>
								<a href="mailto:investors@thorbis.com" className="inline-flex gap-2 items-center">
									Email IR <Mail className="w-4 h-4" />
								</a>
							</Button>
							<Button asChild variant="outline">
								<a href="/contact-support">Contact support</a>
							</Button>
						</div>
					</div>
				</div>

				{/* FAQ */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="mb-8 text-3xl font-bold tracking-tight">Investor FAQs</h2>
						<div className="space-y-6 text-muted-foreground">
							<div>
								<h3 className="text-lg font-semibold text-foreground">What is Thorbis and how is it different?</h3>
								<p>Thorbis unifies local discovery and field service management into a single, closed-loop platform.</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-foreground">What is the market opportunity?</h3>
								<p>Home services represents a massive and growing spend with increasing online penetration; FSM software is growing double-digit CAGR.</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-foreground">How does Thorbis generate revenue?</h3>
								<p>Transaction fees on completed bookings, SaaS plans for pro tools, targeted sponsored placements, and premium verifications.</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-foreground">Why now?</h3>
								<p>Consumer on-demand expectations, pro mobile adoption, incumbent transitions, and modern infrastructure make a unified platform inevitable.</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Analytics */}
			<div className="px-4 py-24 lg:px-24">
				<div className="mx-auto max-w-5xl">
					<h2 className="mb-10 text-3xl font-bold tracking-tight">Platform Analytics</h2>
					<ClientAnalyticsSection />
				</div>
			</div>
		</>
	);
}
