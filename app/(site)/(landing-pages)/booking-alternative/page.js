import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Star, Users, DollarSign, Shield, Zap, Globe, MessageSquare, Calendar, Award, Search, BarChart3, Settings, MapPin, Clock, Utensils, ArrowRight } from "lucide-react";

export default function BookingAlternative() {
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
							Booking.com vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">Thorbis</span>
						</h1>
						<p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground sm:text-xl">Discover why Thorbis is the superior alternative to Booking.com for travel and accommodation businesses. We&apos;re building the Amazon for businesses - comprehensive, transparent, and growth-focused.</p>
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
					<p className="mt-4 text-lg text-muted-foreground">See how Thorbis stacks up against Booking.com</p>
				</div>
				<div className="overflow-hidden rounded-xl shadow-lg border border-border">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-primary text-primary-foreground">
								<tr>
									<th className="px-6 py-4 text-left font-semibold">Feature</th>
									<th className="px-6 py-4 text-center font-semibold">Booking.com</th>
									<th className="px-6 py-4 text-center font-semibold">Thorbis</th>
								</tr>
							</thead>
							<tbody className="bg-card divide-y divide-border">
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Commission Rate</td>
									<td className="px-6 py-4 text-center text-destructive font-semibold">15-25%</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">$29/month</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Direct Bookings</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Limited</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Full Control</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Customer Data</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Restricted</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Full Access</td>
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
									<td className="px-6 py-4 font-medium text-foreground">Review Management</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Basic</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Advanced AI</td>
								</tr>
								<tr className="hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 font-medium text-foreground">Analytics & Insights</td>
									<td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">Basic</td>
									<td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-bold">Advanced AI</td>
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
					{/* Booking.com Analysis */}
					<Card className="border-destructive/20 hover:shadow-lg transition-shadow">
						<CardHeader>
							<CardTitle className="flex items-center gap-3 text-destructive">
								<XCircle className="w-6 h-6" />
								Booking.com&apos;s Limitations
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">High Commission Rates</h4>
								<p className="text-sm text-muted-foreground">Commission rates of 15-25% significantly reduce profit margins for businesses.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Limited Direct Bookings</h4>
								<p className="text-sm text-muted-foreground">Customers are encouraged to book through Booking.com, not directly with you.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Restricted Customer Data</h4>
								<p className="text-sm text-muted-foreground">Limited access to customer information and booking history.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Single Platform Focus</h4>
								<p className="text-sm text-muted-foreground">Only manages Booking.com presence, no integration with other platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-destructive">Poor Customer Support</h4>
								<p className="text-sm text-muted-foreground">Difficult to reach support, long response times, and unhelpful solutions.</p>
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
								<h4 className="font-semibold text-green-600 dark:text-green-400">Fixed Monthly Pricing</h4>
								<p className="text-sm text-muted-foreground">Simple $29/month pricing with no commission fees or hidden costs.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Direct Customer Relationships</h4>
								<p className="text-sm text-muted-foreground">Build direct relationships with customers and increase repeat bookings.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Full Customer Data Access</h4>
								<p className="text-sm text-muted-foreground">Complete access to customer information and booking history.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Multi-Platform Integration</h4>
								<p className="text-sm text-muted-foreground">Sync across Google, Facebook, TripAdvisor, Booking.com, and other platforms.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">24/7 Priority Support</h4>
								<p className="text-sm text-muted-foreground">Dedicated support team with quick response times and personalized solutions.</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-semibold text-green-600 dark:text-green-400">Growth & Marketing Tools</h4>
								<p className="text-sm text-muted-foreground">Email campaigns, social media integration, and marketing automation.</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Travel Business Features */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Travel & Accommodation Features</h2>
					<p className="mt-4 text-lg text-muted-foreground">Specialized tools for travel businesses</p>
				</div>
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Calendar className="w-6 h-6" />
							</div>
							<CardTitle>Booking Management</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Manage reservations, availability, and pricing across all platforms.</p>
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
								<Clock className="w-6 h-6" />
							</div>
							<CardTitle>Availability Management</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Automated availability updates, holiday schedules, and special event management.</p>
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
							<p className="text-sm text-muted-foreground">Monitor and respond to reviews across TripAdvisor, Google, Booking.com, and more.</p>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
						<CardHeader>
							<div className="flex items-center justify-center w-12 h-12 mb-4 text-primary-foreground bg-primary rounded-lg">
								<Users className="w-6 h-6" />
							</div>
							<CardTitle>Customer Management</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Build customer relationships, manage preferences, and increase repeat bookings.</p>
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
							<p className="text-sm text-muted-foreground">Track bookings, revenue, and customer satisfaction across all platforms.</p>
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
							<CardTitle className="text-destructive">Booking.com Business</CardTitle>
							<div className="text-3xl font-bold text-destructive">
								15-25%<span className="text-lg font-normal text-muted-foreground"> commission</span>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3 text-sm">
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">High commission fees</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Limited direct bookings</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Restricted customer data</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Single platform focus</span>
								</li>
								<li className="flex items-center gap-3">
									<XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
									<span className="text-muted-foreground">Poor customer support</span>
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
									<span className="text-muted-foreground">No commission fees</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Direct customer relationships</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Full customer data access</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Multi-platform integration</span>
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
									<span className="text-muted-foreground">Advanced analytics</span>
								</li>
								<li className="flex items-center gap-3">
									<CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
									<span className="text-muted-foreground">Booking management</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* CTA Section */}
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-primary-foreground">
					<div className="absolute inset-0 bg-grid-white/10" />
					<div className="relative">
						<h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Upgrade from Booking.com?</h2>
						<p className="mb-8 text-xl opacity-90">Join thousands of travel businesses that have switched to Thorbis. Keep more of your revenue, build direct relationships, and grow faster. Start your free trial today.</p>
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
					<Link href="/tripadvisor-alternative">
						<Card className="transition-all hover:shadow-lg cursor-pointer hover:-translate-y-1 duration-300">
							<CardContent className="p-6">
								<h3 className="font-semibold text-foreground">TripAdvisor vs Thorbis</h3>
								<p className="text-sm text-muted-foreground">Restaurant and travel business comparisons</p>
							</CardContent>
						</Card>
					</Link>
					<Link href="/expedia-alternative">
						<Card className="transition-all hover:shadow-lg cursor-pointer hover:-translate-y-1 duration-300">
							<CardContent className="p-6">
								<h3 className="font-semibold text-foreground">Expedia vs Thorbis</h3>
								<p className="text-sm text-muted-foreground">Travel booking platform comparison</p>
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
		</main>
	);
}
