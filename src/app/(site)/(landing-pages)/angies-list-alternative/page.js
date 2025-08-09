import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { CheckCircle, XCircle, Users, MessageSquare, Calendar, BarChart3, Wrench, Home, ArrowRight, Star } from "lucide-react";
import { isEnabled } from "@lib/flags/server";

export const metadata = {
	title: "Angie's List Alternative – Thorbis vs Angi | Thorbis",
	description: "See why Thorbis is a modern alternative to Angie's List (Angi): AI‑verified leads, multi‑platform sync, advanced reviews, and 24/7 priority support.",
	keywords: ["Angie's List alternative", "Angi vs Thorbis", "business reviews platform", "lead generation", "local directory alternative"],
	alternates: { canonical: "https://thorbis.com/angies-list-alternative" },
	openGraph: {
		title: "Angie's List Alternative – Thorbis vs Angi",
		description: "Modern alternative to Angi with AI‑verified leads, multi‑platform sync, advanced reviews, and 24/7 support.",
		type: "website",
		url: "https://thorbis.com/angies-list-alternative",
		siteName: "Thorbis",
		images: [{ url: "https://thorbis.com/og-angis-list-alt.jpg", width: 1200, height: 630, alt: "Thorbis vs Angi" }],
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Angie's List Alternative – Thorbis vs Angi",
		description: "Modern alternative to Angi with AI‑verified leads, multi‑platform sync, advanced reviews, and 24/7 support.",
		images: ["https://thorbis.com/og-angis-list-alt.jpg"],
		creator: "@thorbis",
		site: "@thorbis",
	},
};

function BreadcrumbsJsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: "https://thorbis.com/" },
			{ "@type": "ListItem", position: 2, name: "Angie's List Alternative", item: "https://thorbis.com/angies-list-alternative" },
		],
	};
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function SocialProof() {
	return (
		<section className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
			<div className="flex flex-col items-center gap-3 text-center">
				<div className="flex items-center gap-1 text-amber-500" aria-label="rating 4.9 out of 5">
					{Array.from({ length: 5 }).map((_, i) => (
						<Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
					))}
				</div>
				<p className="text-sm text-muted-foreground">Trusted by 1,200+ businesses • 4.9/5 average satisfaction</p>
			</div>
		</section>
	);
}

export default async function AngiesListAlternative() {
	const on = await isEnabled("landingPages");
	if (!on) {
		return (
			<main className="relative min-h-screen bg-background">
				<section className="container mx-auto px-4 py-16">
					<h1 className="text-2xl font-semibold">This landing page is not available</h1>
					<p className="text-muted-foreground mt-2">Please check back soon.</p>
				</section>
			</main>
		);
	}
	return (
		<main className="relative min-h-screen bg-background">
			<BreadcrumbsJsonLd />
			{/* HowTo JSON-LD: Switch in 3 steps */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "HowTo",
						name: "Switch from Angi to Thorbis in 3 steps",
						step: [
							{ "@type": "HowToStep", position: 1, name: "Connect your accounts", url: "https://thorbis.com/angies-list-alternative#switch" },
							{ "@type": "HowToStep", position: 2, name: "Import listings & reviews", url: "https://thorbis.com/angies-list-alternative#switch" },
							{ "@type": "HowToStep", position: 3, name: "Go live with unified management", url: "https://thorbis.com/angies-list-alternative#switch" },
						],
					}),
				}}
			/>
			{/* Hero Section */}
			<section className="relative overflow-hidden border-b">
				<div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-20">
					<div className="text-center">
						<Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
							Platform Comparison
						</Badge>
						<h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
							Angie&apos;s List vs <span className="text-primary">Thorbis</span>
						</h1>
						<p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground sm:text-xl">Discover why Thorbis is the superior alternative to Angie&apos;s List for service businesses. We&apos;re building the Amazon for businesses - comprehensive, transparent, and growth-focused.</p>
						<div className="flex flex-col gap-4 justify-center sm:flex-row">
							<Button size="lg" className="text-lg px-8 py-3 bg-primary hover:bg-primary/90">
								Start Your Free Trial
								<ArrowRight className="ml-2 w-5 h-5" />
							</Button>
							<Button variant="outline" size="lg" className="text-lg px-8 py-3 border-2">
								Schedule Demo
							</Button>
						</div>
					</div>
				</div>
			</section>

			<SocialProof />

			{/* Switch in 3 steps */}
			<section id="switch" className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-8 text-center">
					<h2 className="text-2xl font-bold text-foreground sm:text-3xl">Switch in 3 steps</h2>
					<p className="mt-2 text-muted-foreground">Fast migration without disruption</p>
				</div>
				<div className="grid gap-6 md:grid-cols-3">
					<Card className="p-6">
						<div className="text-sm font-semibold">1. Connect</div>
						<p className="mt-2 text-sm text-muted-foreground">Securely connect your existing accounts.</p>
					</Card>
					<Card className="p-6">
						<div className="text-sm font-semibold">2. Import</div>
						<p className="mt-2 text-sm text-muted-foreground">Bring listings, reviews, and business info in minutes.</p>
					</Card>
					<Card className="p-6">
						<div className="text-sm font-semibold">3. Go live</div>
						<p className="mt-2 text-sm text-muted-foreground">Manage every platform from one place.</p>
					</Card>
				</div>
			</section>

			{/* Quick Comparison Table */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Quick Comparison</h2>
					<p className="mt-4 text-lg text-muted-foreground">See how Thorbis stacks up against Angie&apos;s List</p>
				</div>
				<div className="overflow-hidden rounded-xl shadow-lg border border-border">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-primary text-primary-foreground">
								<tr>
									<th className="px-6 py-4 text-left font-semibold">Feature</th>
									<th className="px-6 py-4 text-center font-semibold">Angie&apos;s List</th>
									<th className="px-6 py-4 text-center font-semibold">Thorbis</th>
								</tr>
							</thead>
							<tbody className="bg-card divide-y divide-border">
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Monthly Cost</td>
									<td className="px-6 py-4 text-center text-destructive font-semibold">$300+</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">$29</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Lead Quality</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Variable</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">AI-Verified</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Review Management</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Basic</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Advanced AI</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Multi-Platform Sync</td>
									<td className="px-6 py-4 text-center">
										<XCircle className="inline w-5 h-5 text-destructive" />
									</td>
									<td className="px-6 py-4 text-center">
										<CheckCircle className="inline w-5 h-5 text-green-600 dark:text-green-400" />
									</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Customer Support</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Limited</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">24/7 Priority</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Business Growth Tools</td>
									<td className="px-6 py-4 text-center">
										<XCircle className="inline w-5 h-5 text-destructive" />
									</td>
									<td className="px-6 py-4 text-center">
										<CheckCircle className="inline w-5 h-5 text-green-600 dark:text-green-400" />
									</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Analytics & Insights</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Basic</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Advanced AI</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Service Categories</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Limited</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Comprehensive</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* Detailed Comparison */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Detailed Analysis</h2>
					<p className="mt-4 text-lg text-muted-foreground">Dive deeper into the differences</p>
				</div>
				<div className="grid gap-8 lg:grid-cols-2">
					{/* Angie's List Analysis */}
					<Card className="border-destructive/20 hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="flex items-center gap-3 text-destructive">
								<XCircle className="w-6 h-6" />
								Angie&apos;s List Limitations
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Expensive Pricing</h4>
								<p className="text-sm text-muted-foreground">High monthly costs starting at $300+ with limited ROI for service businesses.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Variable Lead Quality</h4>
								<p className="text-sm text-muted-foreground">Inconsistent lead quality with no verification or qualification system.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Limited Platform Reach</h4>
								<p className="text-sm text-muted-foreground">Only manages Angie&apos;s List presence, no integration with other platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Poor Customer Support</h4>
								<p className="text-sm text-muted-foreground">Difficult to reach support, long response times, and unhelpful solutions.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">No Growth Tools</h4>
								<p className="text-sm text-muted-foreground">No marketing automation, email campaigns, or business development features.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Limited Service Categories</h4>
								<p className="text-sm text-muted-foreground">Restricted to specific service categories with limited flexibility.</p>
							</div>
						</CardContent>
					</Card>

					{/* Thorbis Advantages */}
					<Card className="border-primary/20 bg-primary/5 hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="flex items-center gap-3 text-primary">
								<CheckCircle className="w-6 h-6" />
								Thorbis Advantages
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Affordable Pricing</h4>
								<p className="text-sm text-muted-foreground">Simple $29/month pricing with comprehensive features and no hidden fees.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">AI-Verified Leads</h4>
								<p className="text-sm text-muted-foreground">Advanced lead qualification system that ensures high-quality, ready-to-buy customers.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Multi-Platform Integration</h4>
								<p className="text-sm text-muted-foreground">Sync across Google, Facebook, Yelp, Angie&apos;s List, and other major platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">24/7 Priority Support</h4>
								<p className="text-sm text-muted-foreground">Dedicated support team with quick response times and personalized solutions.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Growth & Marketing Tools</h4>
								<p className="text-sm text-muted-foreground">Email campaigns, social media integration, and marketing automation.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Comprehensive Categories</h4>
								<p className="text-sm text-muted-foreground">Support for all service categories with flexible customization options.</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Service Business Features */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Service Business Features</h2>
					<p className="mt-4 text-lg text-muted-foreground">Specialized tools for service professionals</p>
				</div>
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Wrench className="w-6 h-6" />
							</div>
							<CardTitle>Service Management</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Manage service offerings, pricing, and availability across all platforms.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Calendar className="w-6 h-6" />
							</div>
							<CardTitle>Appointment Booking</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Integrated scheduling system with automated confirmations and reminders.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Users className="w-6 h-6" />
							</div>
							<CardTitle>Lead Qualification</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">AI-powered lead scoring and qualification to focus on high-value prospects.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<MessageSquare className="w-6 h-6" />
							</div>
							<CardTitle>Review Management</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Monitor and respond to reviews across all major platforms automatically.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Home className="w-6 h-6" />
							</div>
							<CardTitle>Service Areas</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Manage multiple service areas and territories with automated optimization.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<BarChart3 className="w-6 h-6" />
							</div>
							<CardTitle>Performance Analytics</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Track leads, conversions, and customer satisfaction across all platforms.</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Role outcomes mapping */}
			<section className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-6 text-center">
					<h2 className="text-2xl font-bold text-foreground sm:text-3xl">Outcomes by role</h2>
				</div>
				<div className="overflow-hidden rounded-xl border">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-muted">
								<tr>
									<th className="px-4 py-3 text-left text-sm font-semibold">Feature</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">Owner</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">Office Staff</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">Technician</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								<tr>
									<td className="px-4 py-3 text-sm">AI‑verified leads</td>
									<td className="px-4 py-3 text-sm">Higher ROI</td>
									<td className="px-4 py-3 text-sm">Less screening</td>
									<td className="px-4 py-3 text-sm">More booked jobs</td>
								</tr>
								<tr>
									<td className="px-4 py-3 text-sm">Multi‑platform sync</td>
									<td className="px-4 py-3 text-sm">Consolidated spend</td>
									<td className="px-4 py-3 text-sm">Single inbox</td>
									<td className="px-4 py-3 text-sm">Clear schedule</td>
								</tr>
								<tr>
									<td className="px-4 py-3 text-sm">24/7 support</td>
									<td className="px-4 py-3 text-sm">Less downtime</td>
									<td className="px-4 py-3 text-sm">Faster resolutions</td>
									<td className="px-4 py-3 text-sm">On‑site help</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* Pricing Comparison */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Pricing Comparison</h2>
					<p className="mt-4 text-lg text-muted-foreground">See the real cost difference</p>
				</div>
				<div className="grid gap-8 lg:grid-cols-2">
					<Card className="border-destructive/20 hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="text-destructive">Angie&apos;s List Business</CardTitle>
							<div className="text-3xl font-bold text-destructive">
								$300<span className="text-lg font-normal text-muted-foreground">/month</span>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3 text-sm">
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Basic listing management</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Variable lead quality</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Limited platform reach</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Poor customer support</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">No growth tools</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Limited service categories</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="border-primary/20 bg-primary/5 hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="text-primary">Thorbis Business</CardTitle>
							<div className="text-3xl font-bold text-primary">
								$29<span className="text-lg font-normal text-muted-foreground">/month</span>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3 text-sm">
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Multi-platform management</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">AI-verified leads</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Comprehensive platform reach</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">24/7 priority support</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Growth automation tools</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">All service categories</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Advanced analytics</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Appointment booking</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* CTA Section */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-center text-primary-foreground">
					<div className="relative">
						<h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Upgrade from Angie&apos;s List?</h2>
						<p className="mb-8 text-xl opacity-90">Join thousands of service businesses that have switched to Thorbis. Get better leads, more customers, and save money. Start your free trial today.</p>
						<div className="flex flex-col gap-4 justify-center sm:flex-row">
							<Button size="lg" variant="secondary" className="text-lg px-8 py-3 bg-white text-primary hover:bg-white/90">
								Start Free Trial
								<ArrowRight className="ml-2 w-5 h-5" />
							</Button>
							<Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white/20 text-white hover:bg-white/10">
								Schedule Demo
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-8 text-center">
					<h2 className="text-2xl font-bold text-foreground sm:text-3xl">Frequently asked questions</h2>
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					<div className="p-6 rounded-xl border bg-card">
						<div className="font-semibold">How is Thorbis different from Angie’s List?</div>
						<p className="mt-2 text-sm text-muted-foreground">Thorbis offers AI‑verified leads, multi‑platform sync, and built‑in growth tools at a simple $29/month.</p>
					</div>
					<div className="p-6 rounded-xl border bg-card">
						<div className="font-semibold">Can I bring over my reviews?</div>
						<p className="mt-2 text-sm text-muted-foreground">Yes. We support importing from major platforms and centralize responses.</p>
					</div>
					<div className="p-6 rounded-xl border bg-card">
						<div className="font-semibold">Do you integrate with Google and Yelp?</div>
						<p className="mt-2 text-sm text-muted-foreground">Yes. Sync business info, reviews, and messaging across platforms.</p>
					</div>
					<div className="p-6 rounded-xl border bg-card">
						<div className="font-semibold">Is there a contract?</div>
						<p className="mt-2 text-sm text-muted-foreground">No contracts. Cancel anytime.</p>
					</div>
				</div>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "FAQPage",
							mainEntity: [
								{ "@type": "Question", name: "How is Thorbis different from Angie’s List?", acceptedAnswer: { "@type": "Answer", text: "Thorbis offers AI‑verified leads, multi‑platform sync, and built‑in growth tools at a simple $29/month." } },
								{ "@type": "Question", name: "Can I bring over my reviews?", acceptedAnswer: { "@type": "Answer", text: "Yes. We support importing from major platforms and centralize responses." } },
								{ "@type": "Question", name: "Do you integrate with Google and Yelp?", acceptedAnswer: { "@type": "Answer", text: "Yes. Sync business info, reviews, and messaging across platforms." } },
								{ "@type": "Question", name: "Is there a contract?", acceptedAnswer: { "@type": "Answer", text: "No contracts. Cancel anytime." } },
							],
						}),
					}}
				/>
			</section>

			{/* Related Comparisons */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-8 text-center">
					<h2 className="text-2xl font-bold text-foreground sm:text-3xl">Explore Other Platform Comparisons</h2>
					<p className="mt-4 text-muted-foreground">See how we compare to other major platforms</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<Link href="/yelp-alternative">
						<Card className="transition-all hover:shadow-lg cursor-pointer hover:-translate-y-1 duration-300">
							<CardContent className="p-6">
								<h3 className="font-semibold text-foreground">Yelp vs Thorbis</h3>
								<p className="text-sm text-muted-foreground">See how we compare to Yelp&apos;s business platform</p>
							</CardContent>
						</Card>
					</Link>
					<Link href="/thumbtack-alternative">
						<Card className="transition-all hover:shadow-lg cursor-pointer hover:-translate-y-1 duration-300">
							<CardContent className="p-6">
								<h3 className="font-semibold text-foreground">Thumbtack vs Thorbis</h3>
								<p className="text-sm text-muted-foreground">Service business platform comparison</p>
							</CardContent>
						</Card>
					</Link>
					<Link href="/google-business-alternative">
						<Card className="transition-all hover:shadow-lg cursor-pointer hover:-translate-y-1 duration-300">
							<CardContent className="p-6">
								<h3 className="font-semibold text-foreground">Google Business vs Thorbis</h3>
								<p className="text-sm text-muted-foreground">See how we compare to Google&apos;s business platform</p>
							</CardContent>
						</Card>
					</Link>
				</div>
			</section>

			{/* Related comparisons JSON-LD */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "ItemList",
						itemListElement: [
							{ "@type": "ListItem", position: 1, url: "https://thorbis.com/yelp-alternative" },
							{ "@type": "ListItem", position: 2, url: "https://thorbis.com/thumbtack-alternative" },
							{ "@type": "ListItem", position: 3, url: "https://thorbis.com/google-business-alternative" },
						],
					}),
				}}
			/>
		</main>
	);
}
