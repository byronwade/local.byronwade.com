import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Star, Users, DollarSign, Shield, Zap, Globe, MessageSquare, Calendar, Award, Search, BarChart3, Settings, ArrowRight } from "lucide-react";

export default function GoogleBusinessAlternative() {
	return (
		<main className="relative min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
				<div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-white/5" />
				<div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
					<div className="text-center">
						<Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
							Platform Comparison
						</Badge>
						<h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
							Google Business vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">Thorbis</span>
						</h1>
						<p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground sm:text-xl">Discover why Thorbis is the superior alternative to Google Business Profile for businesses. We&apos;re building the Amazon for businesses - comprehensive, transparent, and growth-focused.</p>
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

			{/* Quick Comparison Table */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Quick Comparison</h2>
					<p className="mt-4 text-lg text-muted-foreground">See how Thorbis stacks up against Google Business</p>
				</div>
				<div className="overflow-hidden rounded-xl shadow-lg border border-border">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-primary text-primary-foreground">
								<tr>
									<th className="px-6 py-4 text-left font-semibold">Feature</th>
									<th className="px-6 py-4 text-center font-semibold">Google Business</th>
									<th className="px-6 py-4 text-center font-semibold">Thorbis</th>
								</tr>
							</thead>
							<tbody className="bg-card divide-y divide-border">
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Monthly Cost</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400">Free</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">$29</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Analytics & Insights</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Basic</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Advanced AI</td>
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
									<td className="px-6 py-4 font-medium text-foreground">Review Management</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Basic</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Advanced</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Customer Support</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Limited</td>
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
									<td className="px-6 py-4 font-medium text-foreground">Appointment Booking</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Limited</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Full System</td>
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
					{/* Google Business Analysis */}
					<Card className="border-destructive/20 hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="flex items-center gap-3 text-destructive">
								<XCircle className="w-6 h-6" />
								Google Business Limitations
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Limited Analytics</h4>
								<p className="text-sm text-muted-foreground">Basic insights with no advanced reporting or actionable recommendations.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">No Lead Generation</h4>
								<p className="text-sm text-muted-foreground">No tools to capture and qualify leads from profile visitors.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Poor Customer Support</h4>
								<p className="text-sm text-muted-foreground">Difficult to reach support, automated responses, and long resolution times.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Single Platform Focus</h4>
								<p className="text-sm text-muted-foreground">Only manages Google presence, no integration with other platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Limited Customization</h4>
								<p className="text-sm text-muted-foreground">Restrictive templates and limited branding options.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">No Growth Tools</h4>
								<p className="text-sm text-muted-foreground">No marketing automation, email campaigns, or business development features.</p>
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
								<h4 className="font-semibold text-green-600 dark:text-green-400">Advanced AI Analytics</h4>
								<p className="text-sm text-muted-foreground">Comprehensive insights with AI-powered recommendations for business growth.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Lead Generation System</h4>
								<p className="text-sm text-muted-foreground">Automated lead capture, qualification, and follow-up system.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">24/7 Priority Support</h4>
								<p className="text-sm text-muted-foreground">Dedicated support team with quick response times and personalized solutions.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Multi-Platform Integration</h4>
								<p className="text-sm text-muted-foreground">Seamless sync across Google, Facebook, Apple Maps, and other major platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Full Customization</h4>
								<p className="text-sm text-muted-foreground">Complete control over branding, design, and business presentation.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Growth & Marketing Tools</h4>
								<p className="text-sm text-muted-foreground">Email campaigns, social media integration, and marketing automation.</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Feature Deep Dive */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Why Thorbis is the Amazon for Businesses</h2>
					<p className="mt-4 text-lg text-muted-foreground">Advanced features that drive real business growth</p>
				</div>
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<BarChart3 className="w-6 h-6" />
							</div>
							<CardTitle>Advanced Analytics</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">AI-powered insights that go beyond basic metrics to provide actionable business recommendations.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Users className="w-6 h-6" />
							</div>
							<CardTitle>Lead Generation</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Automated lead capture system that converts profile visitors into qualified customers.</p>
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
							<p className="text-sm text-muted-foreground">Smart review monitoring, automated responses, and reputation optimization tools.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Globe className="w-6 h-6" />
							</div>
							<CardTitle>Multi-Platform Sync</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Automatically sync your business information across all major platforms and directories.</p>
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
							<p className="text-sm text-muted-foreground">Integrated scheduling system with automated reminders and calendar sync.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Settings className="w-6 h-6" />
							</div>
							<CardTitle>Business Automation</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Automate routine tasks, follow-ups, and customer communications to save time.</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Value Proposition */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">The True Cost of &quot;Free&quot;</h2>
					<p className="mt-4 text-lg text-muted-foreground">Understand the hidden costs and missed opportunities</p>
				</div>
				<div className="p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-border">
					<div className="grid gap-8 md:grid-cols-2">
						<div className="text-left">
							<h3 className="mb-4 text-xl font-semibold text-destructive">Google Business Profile</h3>
							<ul className="space-y-3 text-sm">
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Limited customer insights</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">No lead generation tools</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Poor customer support</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Manual platform management</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">No growth automation</span>
								</li>
							</ul>
							<p className="mt-4 text-lg font-semibold text-destructive">Hidden Cost: Lost Opportunities</p>
						</div>
						<div className="text-left">
							<h3 className="mb-4 text-xl font-semibold text-green-600 dark:text-green-400">Thorbis Business</h3>
							<ul className="space-y-3 text-sm">
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">AI-powered insights</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Automated lead generation</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">24/7 priority support</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Multi-platform automation</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Growth automation tools</span>
								</li>
							</ul>
							<p className="mt-4 text-lg font-semibold text-green-600 dark:text-green-400">ROI: Increased Revenue & Growth</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-primary-foreground">
					<div className="absolute inset-0 bg-grid-white/10" />
					<div className="relative">
						<h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Upgrade from Google Business?</h2>
						<p className="mb-8 text-xl opacity-90">Join thousands of businesses that have upgraded to Thorbis for better results, more leads, and faster growth. Start your free trial today.</p>
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
					<Link href="/tripadvisor-alternative">
						<Card className="transition-all hover:shadow-lg cursor-pointer hover:-translate-y-1 duration-300">
							<CardContent className="p-6">
								<h3 className="font-semibold text-foreground">TripAdvisor vs Thorbis</h3>
								<p className="text-sm text-muted-foreground">Restaurant and travel business comparisons</p>
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
