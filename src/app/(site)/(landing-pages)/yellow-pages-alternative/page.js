import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { CheckCircle, XCircle, Users, Shield, Zap, Globe, Search, Building, TrendingUp, CreditCard, Headphones } from "lucide-react";

export const metadata = {
	title: "Yellow Pages Alternative – Thorbis vs Yellow Pages | Thorbis",
	description: "Discover why Thorbis is the superior alternative to Yellow Pages for business discovery and local search. Free listings, modern digital tools, and comprehensive business solutions.",
	keywords: ["Yellow Pages alternative", "Thorbis vs Yellow Pages", "business directory alternative", "free business listing", "local search platform"],
	alternates: { canonical: "https://thorbis.com/yellow-pages-alternative" },
	openGraph: {
		title: "Yellow Pages Alternative – Thorbis vs Yellow Pages",
		description: "Business directory alternative with modern digital tools and free listings.",
		type: "website",
		url: "https://thorbis.com/yellow-pages-alternative",
		siteName: "Thorbis",
		images: [{ url: "https://thorbis.com/og-yellow-pages-alt.jpg", width: 1200, height: 630, alt: "Thorbis vs Yellow Pages" }],
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Yellow Pages Alternative – Thorbis vs Yellow Pages",
		description: "Business directory alternative with modern digital tools and free listings.",
		images: ["https://thorbis.com/og-yellow-pages-alt.jpg"],
		creator: "@thorbis",
		site: "@thorbis",
	},
};

export default function YellowPagesAlternative() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BreadcrumbList",
						itemListElement: [
							{ "@type": "ListItem", position: 1, name: "Home", item: "https://thorbis.com/" },
							{ "@type": "ListItem", position: 2, name: "Yellow Pages Alternative", item: "https://thorbis.com/yellow-pages-alternative" },
						],
					}),
				}}
			/>
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
					<div className="text-center">
						<Badge variant="secondary" className="mb-6 text-sm font-medium">
							Business Directory Comparison
						</Badge>
						<h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
							Thorbis vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Yellow Pages</span>
						</h1>
						<p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto">While Yellow Pages revolutionized business directories, Thorbis brings business discovery into the digital age with free listings, modern tools, and comprehensive solutions.</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
								<Link href="/search">Start Free Business Search</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="#comparison">View Comparison</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Quick Comparison Table */}
			<section id="comparison" className="py-16 bg-white dark:bg-slate-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Quick Comparison</h2>
						<p className="text-lg text-slate-600 dark:text-slate-300">See how Thorbis stacks up against Yellow Pages for business discovery</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						<Card className="border-2 border-blue-200 dark:border-blue-800">
							<CardHeader className="text-center">
								<CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">Thorbis</CardTitle>
								<CardDescription className="text-slate-600 dark:text-slate-300">Modern Digital Platform</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-3">
									<CheckCircle className="h-5 w-5 text-green-500" />
									<span className="text-slate-700 dark:text-slate-200">Free business listings</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="h-5 w-5 text-green-500" />
									<span className="text-slate-700 dark:text-slate-200">Modern digital tools</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="h-5 w-5 text-green-500" />
									<span className="text-slate-700 dark:text-slate-200">Advanced search & filters</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="h-5 w-5 text-green-500" />
									<span className="text-slate-700 dark:text-slate-200">Direct booking integration</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="h-5 w-5 text-green-500" />
									<span className="text-slate-700 dark:text-slate-200">Customer engagement tools</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="h-5 w-5 text-green-500" />
									<span className="text-slate-700 dark:text-slate-200">Analytics & insights</span>
								</div>
							</CardContent>
						</Card>

						<Card className="border-2 border-gray-200 dark:border-gray-700">
							<CardHeader className="text-center">
								<CardTitle className="text-2xl font-bold text-slate-600 dark:text-slate-300">Yellow Pages</CardTitle>
								<CardDescription className="text-slate-600 dark:text-slate-300">Traditional Directory</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-3">
									<XCircle className="h-5 w-5 text-red-500" />
									<span className="text-slate-700 dark:text-slate-200">Expensive listings ($500+)</span>
								</div>
								<div className="flex items-center gap-3">
									<XCircle className="h-5 w-5 text-red-500" />
									<span className="text-slate-700 dark:text-slate-200">Outdated print model</span>
								</div>
								<div className="flex items-center gap-3">
									<XCircle className="h-5 w-5 text-red-500" />
									<span className="text-slate-700 dark:text-slate-200">Limited digital presence</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="h-5 w-5 text-green-500" />
									<span className="text-slate-700 dark:text-slate-200">Established brand recognition</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="h-5 w-5 text-green-500" />
									<span className="text-slate-700 dark:text-slate-200">Wide business coverage</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="h-5 w-5 text-green-500" />
									<span className="text-slate-700 dark:text-slate-200">Local market presence</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Detailed Analysis */}
			<section className="py-16 bg-slate-50 dark:bg-slate-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Thorbis Over Yellow Pages?</h2>
						<p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">While Yellow Pages revolutionized business directories, Thorbis brings business discovery into the digital age with modern tools, lower costs, and superior customer engagement.</p>
					</div>

					<div className="grid lg:grid-cols-3 gap-8">
						<Card className="bg-white dark:bg-slate-900">
							<CardHeader>
								<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
									<Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								</div>
								<CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Modern Digital Platform</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-slate-600 dark:text-slate-300">Unlike Yellow Pages&apos; print-focused model, Thorbis is built for the digital age with AI-powered tools, mobile optimization, and real-time updates.</p>
							</CardContent>
						</Card>

						<Card className="bg-white dark:bg-slate-900">
							<CardHeader>
								<div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
									<CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
								</div>
								<CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Cost-Effective Solutions</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-slate-600 dark:text-slate-300">Free business listings vs Yellow Pages&apos; expensive $500+ monthly fees. Thorbis provides premium features at no cost, helping businesses grow without breaking the bank.</p>
							</CardContent>
						</Card>

						<Card className="bg-white dark:bg-slate-900">
							<CardHeader>
								<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
									<Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
								</div>
								<CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Enhanced Customer Engagement</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-slate-600 dark:text-slate-300">Direct messaging, review management, and customer insights that go beyond simple listings. Build lasting relationships with your customers.</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Feature Deep Dive */}
			<section className="py-16 bg-white dark:bg-slate-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Feature Comparison</h2>
						<p className="text-lg text-slate-600 dark:text-slate-300">Detailed breakdown of what each platform offers</p>
					</div>

					<div className="space-y-6">
						<Card className="bg-slate-50 dark:bg-slate-800">
							<CardHeader>
								<CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
									<Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
									Business Discovery & Search
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Thorbis</h4>
										<ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
											<li>• Advanced search with multiple filters</li>
											<li>• Map-based discovery</li>
											<li>• Industry-specific categories</li>
											<li>• Real-time availability</li>
											<li>• Personalized recommendations</li>
										</ul>
									</div>
									<div>
										<h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Yellow Pages</h4>
										<ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
											<li>• Basic alphabetical listings</li>
											<li>• Limited search capabilities</li>
											<li>• Print-focused organization</li>
											<li>• Static information</li>
											<li>• No personalization</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-slate-50 dark:bg-slate-800">
							<CardHeader>
								<CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
									<Building className="h-5 w-5 text-green-600 dark:text-green-400" />
									Business Tools & Management
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Thorbis</h4>
										<ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
											<li>• Comprehensive business profile</li>
											<li>• Direct booking integration</li>
											<li>• Customer messaging system</li>
											<li>• Review management</li>
											<li>• Analytics dashboard</li>
										</ul>
									</div>
									<div>
										<h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Yellow Pages</h4>
										<ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
											<li>• Basic business listing</li>
											<li>• No booking integration</li>
											<li>• No customer interaction</li>
											<li>• No review management</li>
											<li>• No analytics</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-slate-50 dark:bg-slate-800">
							<CardHeader>
								<CardTitle className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
									<TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
									Digital Presence & Marketing
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Thorbis</h4>
										<ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
											<li>• Multi-platform integration</li>
											<li>• SEO optimization</li>
											<li>• Social media management</li>
											<li>• Marketing automation</li>
											<li>• Performance tracking</li>
										</ul>
									</div>
									<div>
										<h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Yellow Pages</h4>
										<ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
											<li>• Print directory only</li>
											<li>• Basic online presence</li>
											<li>• No social media integration</li>
											<li>• No marketing tools</li>
											<li>• No performance data</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Value Proposition */}
			<section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">The Thorbis Advantage</h2>
					<p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">While Yellow Pages revolutionized business directories, Thorbis is revolutionizing business discovery and engagement in the digital age. Get the tools you need to succeed.</p>
					<div className="grid md:grid-cols-3 gap-8 mb-8">
						<div className="text-center">
							<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Zap className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-xl font-semibold text-white mb-2">Free & Accessible</h3>
							<p className="text-blue-100">No hidden fees or expensive listings. Free listings for all businesses.</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Shield className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-xl font-semibold text-white mb-2">Trusted & Secure</h3>
							<p className="text-blue-100">Verified businesses, secure transactions, and reliable service.</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Headphones className="h-8 w-8 text-white" />
							</div>
							<h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
							<p className="text-blue-100">Round-the-clock customer support for businesses and customers.</p>
						</div>
					</div>
					<Button asChild size="lg" variant="secondary" className="text-blue-600 hover:text-blue-700">
						<Link href="/search">Start Your Free Business Search</Link>
					</Button>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-16 bg-white dark:bg-slate-900">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to Discover Better?</h2>
					<p className="text-xl text-slate-600 dark:text-slate-300 mb-8">Join thousands of businesses and customers who have switched to Thorbis for better discovery, booking, and engagement across all industries.</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
							<Link href="/search">Search Businesses Now</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/business/register">List Your Business</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Related Comparisons */}
			<section className="py-16 bg-slate-50 dark:bg-slate-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Explore Other Alternatives</h2>
						<p className="text-lg text-slate-600 dark:text-slate-300">See how Thorbis compares to other popular business platforms</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						<Card className="hover:shadow-lg transition-shadow cursor-pointer">
							<CardContent className="p-6">
								<Link href="/yelp-alternative" className="block">
									<h3 className="font-semibold text-slate-900 dark:text-white mb-2">vs Yelp</h3>
									<p className="text-sm text-slate-600 dark:text-slate-300">Better business discovery and reviews</p>
								</Link>
							</CardContent>
						</Card>

						<Card className="hover:shadow-lg transition-shadow cursor-pointer">
							<CardContent className="p-6">
								<Link href="/google-business-alternative" className="block">
									<h3 className="font-semibold text-slate-900 dark:text-white mb-2">vs Google Business</h3>
									<p className="text-sm text-slate-600 dark:text-slate-300">Enhanced visibility and engagement</p>
								</Link>
							</CardContent>
						</Card>

						<Card className="hover:shadow-lg transition-shadow cursor-pointer">
							<CardContent className="p-6">
								<Link href="/tripadvisor-alternative" className="block">
									<h3 className="font-semibold text-slate-900 dark:text-white mb-2">vs TripAdvisor</h3>
									<p className="text-sm text-slate-600 dark:text-slate-300">Comprehensive business reviews</p>
								</Link>
							</CardContent>
						</Card>

						<Card className="hover:shadow-lg transition-shadow cursor-pointer">
							<CardContent className="p-6">
								<Link href="/thumbtack-alternative" className="block">
									<h3 className="font-semibold text-slate-900 dark:text-white mb-2">vs Thumbtack</h3>
									<p className="text-sm text-slate-600 dark:text-slate-300">Better service provider platform</p>
								</Link>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</div>
	);
}
