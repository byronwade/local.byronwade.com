import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { CheckCircle, XCircle, MessageSquare, Calendar, BarChart3, MapPin, Clock, Utensils, ArrowRight, Star } from "lucide-react";

export const metadata = {
	title: "TripAdvisor Alternative – Thorbis vs TripAdvisor | Thorbis",
	description: "See why Thorbis is a modern alternative to TripAdvisor: advanced review management, reservation integration, lead generation, and analytics.",
	keywords: ["TripAdvisor alternative", "TripAdvisor vs Thorbis", "restaurant reviews platform", "reservation system integration", "lead generation"],
	alternates: { canonical: "https://thorbis.com/tripadvisor-alternative" },
	openGraph: {
		title: "TripAdvisor Alternative – Thorbis vs TripAdvisor",
		description: "Modern alternative to TripAdvisor with advanced reviews, reservation integration, lead generation, and analytics.",
		type: "website",
		url: "https://thorbis.com/tripadvisor-alternative",
		siteName: "Thorbis",
		images: [{ url: "https://thorbis.com/og-tripadvisor-alt.jpg", width: 1200, height: 630, alt: "Thorbis vs TripAdvisor" }],
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "TripAdvisor Alternative – Thorbis vs TripAdvisor",
		description: "Modern alternative to TripAdvisor with advanced reviews, reservation integration, lead generation, and analytics.",
		images: ["https://thorbis.com/og-tripadvisor-alt.jpg"],
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
			{ "@type": "ListItem", position: 2, name: "TripAdvisor Alternative", item: "https://thorbis.com/tripadvisor-alternative" },
		],
	};
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function TripAdvisorAlternative() {
	return (
		<main className="relative min-h-screen bg-background">
			<BreadcrumbsJsonLd />
			{/* Hero Section */}
			<section className="relative overflow-hidden border-b">
				<div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-20">
					<div className="text-center">
						<Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
							Platform Comparison
						</Badge>
						<h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
							TripAdvisor vs <span className="text-primary">Thorbis</span>
						</h1>
						<p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground sm:text-xl">Discover why Thorbis is the superior alternative to TripAdvisor for restaurants and travel businesses. We&apos;re building the Amazon for businesses - comprehensive, transparent, and growth-focused.</p>
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

			{/* Social Proof */}
			<section className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="flex items-center gap-1 text-amber-500" aria-label="rating 4.9 out of 5">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
						))}
					</div>
					<p className="text-sm text-muted-foreground">Trusted by 1,200+ restaurants and travel brands • 4.9/5 satisfaction</p>
				</div>
			</section>

			{/* Quick Comparison Table */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Quick Comparison</h2>
					<p className="mt-4 text-lg text-muted-foreground">See how Thorbis stacks up against TripAdvisor</p>
				</div>
				<div className="overflow-hidden rounded-xl shadow-lg border border-border">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-primary text-primary-foreground">
								<tr>
									<th className="px-6 py-4 text-left font-semibold">Feature</th>
									<th className="px-6 py-4 text-center font-semibold">TripAdvisor</th>
									<th className="px-6 py-4 text-center font-semibold">Thorbis</th>
								</tr>
							</thead>
							<tbody className="bg-card divide-y divide-border">
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Monthly Cost</td>
									<td className="px-6 py-4 text-center text-destructive font-semibold">$200+</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">$29</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Review Management</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Basic</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Advanced AI</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Reservation System</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Limited</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Full Integration</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Lead Generation</td>
									<td className="px-6 py-4 text-center">
										<XCircle className="inline w-5 h-5 text-destructive" />
									</td>
									<td className="px-6 py-4 text-center">
										<CheckCircle className="inline w-5 h-5 text-green-600 dark:text-green-400" />
									</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Customer Support</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Basic</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">24/7 Priority</td>
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
									<td className="px-6 py-4 font-medium text-foreground">Business Growth Tools</td>
									<td className="px-6 py-4 text-center">
										<XCircle className="inline w-5 h-5 text-destructive" />
									</td>
									<td className="px-6 py-4 text-center">
										<CheckCircle className="inline w-5 h-5 text-green-600 dark:text-green-400" />
									</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Menu Management</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Basic</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Advanced</td>
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
					{/* TripAdvisor Analysis */}
					<Card className="border-destructive/20 hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="flex items-center gap-3 text-destructive">
								<XCircle className="w-6 h-6" />
								TripAdvisor&apos;s Limitations
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Expensive Pricing</h4>
								<p className="text-sm text-muted-foreground">High monthly costs starting at $200+ with limited value for the investment.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Limited Review Control</h4>
								<p className="text-sm text-muted-foreground">No tools to manage or respond to reviews effectively across platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Poor Reservation Integration</h4>
								<p className="text-sm text-muted-foreground">Basic booking system that doesn&apos;t integrate with existing POS systems.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">No Lead Generation</h4>
								<p className="text-sm text-muted-foreground">No tools to capture and convert profile visitors into customers.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Single Platform Focus</h4>
								<p className="text-sm text-muted-foreground">Only manages TripAdvisor presence, no integration with other platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Limited Analytics</h4>
								<p className="text-sm text-muted-foreground">Basic reporting with no actionable insights for business growth.</p>
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
								<h4 className="font-semibold text-green-600 dark:text-green-400">Advanced Review Management</h4>
								<p className="text-sm text-muted-foreground">AI-powered review monitoring and response system across all platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Integrated Reservation System</h4>
								<p className="text-sm text-muted-foreground">Seamless integration with major POS systems and calendar platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Lead Generation Tools</h4>
								<p className="text-sm text-muted-foreground">Automated lead capture and customer conversion system.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Multi-Platform Integration</h4>
								<p className="text-sm text-muted-foreground">Sync across Google, Facebook, Yelp, TripAdvisor, and other platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Advanced Analytics</h4>
								<p className="text-sm text-muted-foreground">Comprehensive insights with AI-powered recommendations for growth.</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Restaurant-Specific Features */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Restaurant & Travel Business Features</h2>
					<p className="mt-4 text-lg text-muted-foreground">Specialized tools for your industry</p>
				</div>
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Utensils className="w-6 h-6" />
							</div>
							<CardTitle>Menu Management</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Easy menu updates, pricing management, and special offers across all platforms.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Calendar className="w-6 h-6" />
							</div>
							<CardTitle>Reservation System</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Integrated booking system with automated confirmations and reminders.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Clock className="w-6 h-6" />
							</div>
							<CardTitle>Hours Management</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Automated hours updates, holiday schedules, and special event management.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<MapPin className="w-6 h-6" />
							</div>
							<CardTitle>Location Services</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Multi-location management, directions, and local SEO optimization.</p>
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
							<p className="text-sm text-muted-foreground">Monitor and respond to reviews across TripAdvisor, Google, Yelp, and more.</p>
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
							<p className="text-sm text-muted-foreground">Track reservations, reviews, and customer engagement across all platforms.</p>
						</CardContent>
					</Card>
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
							<CardTitle className="text-destructive">TripAdvisor Business</CardTitle>
							<div className="text-3xl font-bold text-destructive">
								$200<span className="text-lg font-normal text-muted-foreground">/month</span>
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
									<span className="text-muted-foreground">Limited review responses</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">No lead generation</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Single platform focus</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Basic analytics</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">No growth tools</span>
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
									<span className="text-muted-foreground">AI-powered review management</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Lead generation system</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Reservation integration</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Advanced analytics</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Menu management</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">24/7 priority support</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Growth automation tools</span>
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
						<h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Upgrade from TripAdvisor?</h2>
						<p className="mb-8 text-xl opacity-90">Join thousands of restaurants and travel businesses that have switched to Thorbis. Get better results, more customers, and save money. Start your free trial today.</p>
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
						<div className="font-semibold">Do you integrate with reservation systems?</div>
						<p className="mt-2 text-sm text-muted-foreground">Yes. Integrations with major POS and reservation platforms.</p>
					</div>
					<div className="p-6 rounded-xl border bg-card">
						<div className="font-semibold">Can I manage reviews across platforms?</div>
						<p className="mt-2 text-sm text-muted-foreground">Yes. Monitor and respond across TripAdvisor, Google, Yelp, and more.</p>
					</div>
				</div>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "FAQPage",
							mainEntity: [
								{ "@type": "Question", name: "Do you integrate with reservation systems?", acceptedAnswer: { "@type": "Answer", text: "Yes. Integrations with major POS and reservation platforms." } },
								{ "@type": "Question", name: "Can I manage reviews across platforms?", acceptedAnswer: { "@type": "Answer", text: "Yes. Monitor and respond across TripAdvisor, Google, Yelp, and more." } },
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
					<Link href="/google-business-alternative">
						<Card className="transition-all hover:shadow-lg cursor-pointer hover:-translate-y-1 duration-300">
							<CardContent className="p-6">
								<h3 className="font-semibold text-foreground">Google Business vs Thorbis</h3>
								<p className="text-sm text-muted-foreground">See how we compare to Google&apos;s business platform</p>
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
				</div>
			</section>
		</main>
	);
}
