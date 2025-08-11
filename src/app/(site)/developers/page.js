import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Terminal, Book, Code2, Database, MapPin, Zap, Shield, Clock, Users, Download, ExternalLink, CheckCircle, ArrowRight, GitBranch, Smartphone, Globe, Star, Bookmark, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Developer Platform - APIs & Integrations | Thorbis",
	description: "Build with Thorbis APIs. Access comprehensive local business data, geolocation services, and real-time information. Get your API key and start integrating today.",
	keywords: ["developer api", "business data api", "geolocation api", "local business integration", "developer platform", "thorbis api"],
	openGraph: {
		title: "Developer Platform - APIs & Integrations | Thorbis",
		description: "Build with Thorbis APIs. Access comprehensive local business data, geolocation services, and real-time information. Get your API key and start integrating today.",
		url: "https://thorbis.com/developers",
		siteName: "Thorbis",
		images: [
			{
				url: `https://thorbis.com/opengraph-image?title=${encodeURIComponent("Developer Platform")}&description=${encodeURIComponent("APIs for local business data, geolocation, real-time info.")}`,
				width: 1200,
				height: 630,
				alt: "Thorbis Developer Platform",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Developer Platform - Thorbis APIs",
		description: "Build with Thorbis APIs. Access local business data and geolocation services.",
		images: [`https://thorbis.com/twitter-image?title=${encodeURIComponent("Developer Platform")}`],
	},
	alternates: {
		canonical: "https://thorbis.com/developers",
	},
};

export default function DevelopersPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Thorbis Developer Platform",
		description: "API platform for accessing local business data, geolocation services, and real-time information",
		url: "https://thorbis.com/developers",
		applicationCategory: "DeveloperApplication",
		operatingSystem: "Any",
		provider: {
			"@type": "Organization",
			name: "Thorbis",
			logo: "https://thorbis.com/logos/ThorbisLogo.webp",
			url: "https://thorbis.com",
		},
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "API Services",
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Business Search API",
						description: "Access comprehensive database of local businesses with reviews and ratings",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Geolocation API",
						description: "Find businesses by location and search within specific radius",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Real-Time Data API",
						description: "Get up-to-date business information with reliable API",
					},
				},
			],
		},
		audience: {
			"@type": "Audience",
			audienceType: "Developers",
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BreadcrumbList",
						itemListElement: [
							{ "@type": "ListItem", position: 1, name: "Home", item: "https://thorbis.com/" },
							{ "@type": "ListItem", position: 2, name: "Developers", item: "https://thorbis.com/developers" },
						],
					}),
				}}
			/>
			<div className="bg-background text-foreground">
				{/* Enhanced Hero Section */}
				<div className="relative overflow-hidden bg-muted">
					<div className="absolute inset-0 bg-grid-small-black/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
					<div className="relative px-4 py-32 mx-auto max-w-7xl text-center lg:px-8">
						<div className="mx-auto max-w-4xl">
							<Badge variant="secondary" className="mb-6 px-4 py-2">
								<Terminal className="mr-2 w-4 h-4" />
								Developer Platform v2.0
							</Badge>
							<h1 className="text-5xl font-extrabold tracking-tight md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Build with Thorbis APIs</h1>
							<p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground leading-8">Access comprehensive local business data, real-time information, and geolocation services. Trusted by thousands of developers worldwide.</p>
							<div className="flex flex-col gap-4 justify-center items-center mt-10 sm:flex-row sm:gap-6">
								<Button asChild size="lg" className="px-8 py-3 text-lg">
									<Link href="/developers/api-keys">
										Get Started Free
										<ArrowRight className="ml-2 w-5 h-5" />
									</Link>
								</Button>
								<Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg">
									<Link href="/developers/docs">
										View Documentation
										<Book className="ml-2 w-5 h-5" />
									</Link>
								</Button>
							</div>
							<div className="flex flex-wrap gap-6 justify-center items-center mt-10 text-sm text-muted-foreground">
								<div className="flex items-center">
									<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
									Free tier available
								</div>
								<div className="flex items-center">
									<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
									99.9% uptime SLA
								</div>
								<div className="flex items-center">
									<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
									Rate limit: 10k req/hour
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<div className="px-4 py-16 bg-background lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
							<div>
								<div className="text-3xl font-bold text-primary">10M+</div>
								<div className="mt-1 text-sm text-muted-foreground">API Requests/Month</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-primary">5M+</div>
								<div className="mt-1 text-sm text-muted-foreground">Business Records</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-primary">99.9%</div>
								<div className="mt-1 text-sm text-muted-foreground">Uptime SLA</div>
							</div>
							<div>
								<div className="text-3xl font-bold text-primary">50ms</div>
								<div className="mt-1 text-sm text-muted-foreground">Avg Response Time</div>
							</div>
						</div>
					</div>
				</div>

				{/* API Features Section */}
				<div className="px-4 py-24 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold tracking-tight">Powerful APIs for Modern Apps</h2>
							<p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">Everything you need to build location-aware applications with rich business data</p>
						</div>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							<Card className="border-2 hover:border-primary/50 transition-colors">
								<CardHeader>
									<div className="flex items-center">
										<div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
											<Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
										</div>
									</div>
									<CardTitle>Business Search API</CardTitle>
									<CardDescription>Search through millions of businesses with advanced filters and real-time results</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											5M+ verified businesses
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Real-time availability
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Advanced filtering
										</div>
									</div>
									<div className="mt-4 p-3 bg-muted rounded-lg">
										<code className="text-xs">GET /api/businesses?query=restaurant&location=Seattle</code>
									</div>
								</CardContent>
							</Card>

							<Card className="border-2 hover:border-primary/50 transition-colors">
								<CardHeader>
									<div className="flex items-center">
										<div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
											<MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
										</div>
									</div>
									<CardTitle>Geolocation API</CardTitle>
									<CardDescription>Precise location services with radius search and geocoding capabilities</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											GPS-accurate positioning
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Radius-based search
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Geocoding & reverse geocoding
										</div>
									</div>
									<div className="mt-4 p-3 bg-muted rounded-lg">
										<code className="text-xs">GET /api/geocode?lat=47.6062&lng=-122.3321&radius=5km</code>
									</div>
								</CardContent>
							</Card>

							<Card className="border-2 hover:border-primary/50 transition-colors">
								<CardHeader>
									<div className="flex items-center">
										<div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
											<Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
										</div>
									</div>
									<CardTitle>Real-Time Data API</CardTitle>
									<CardDescription>Live business information including hours, availability, and updates</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Live business hours
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Real-time availability
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											WebSocket support
										</div>
									</div>
									<div className="mt-4 p-3 bg-muted rounded-lg">
										<code className="text-xs">GET /api/business/123/realtime</code>
									</div>
								</CardContent>
							</Card>

							<Card className="border-2 hover:border-primary/50 transition-colors">
								<CardHeader>
									<div className="flex items-center">
										<div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/20">
											<Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
										</div>
									</div>
									<CardTitle>Authentication API</CardTitle>
									<CardDescription>Secure API key management with role-based access control</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											JWT-based auth
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Rate limiting
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Usage analytics
										</div>
									</div>
									<div className="mt-4 p-3 bg-muted rounded-lg">
										<code className="text-xs">Authorization: Bearer your-api-key</code>
									</div>
								</CardContent>
							</Card>

							<Card className="border-2 hover:border-primary/50 transition-colors">
								<CardHeader>
									<div className="flex items-center">
										<div className="p-2 bg-indigo-100 rounded-lg dark:bg-indigo-900/20">
											<Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
										</div>
									</div>
									<CardTitle>Analytics API</CardTitle>
									<CardDescription>Track usage, monitor performance, and gain insights into API consumption</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Real-time metrics
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Usage breakdowns
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Performance insights
										</div>
									</div>
									<div className="mt-4 p-3 bg-muted rounded-lg">
										<code className="text-xs">GET /api/analytics/usage?period=30d</code>
									</div>
								</CardContent>
							</Card>

							<Card className="border-2 hover:border-primary/50 transition-colors">
								<CardHeader>
									<div className="flex items-center">
										<div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/20">
											<Users className="w-6 h-6 text-red-600 dark:text-red-400" />
										</div>
									</div>
									<CardTitle>Reviews & Ratings API</CardTitle>
									<CardDescription>Access user reviews, ratings, and sentiment analysis for businesses</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Verified reviews
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Sentiment analysis
										</div>
										<div className="flex items-center text-sm">
											<CheckCircle className="mr-2 w-4 h-4 text-green-500" />
											Rating aggregations
										</div>
									</div>
									<div className="mt-4 p-3 bg-muted rounded-lg">
										<code className="text-xs">GET /api/business/123/reviews?limit=10</code>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Quick Start Section */}
				<div className="px-4 py-24 bg-muted lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold tracking-tight">Get Started in Minutes</h2>
							<p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">Follow these simple steps to start integrating Thorbis APIs into your application</p>
						</div>
						<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
							<div className="space-y-8">
								<div className="flex">
									<div className="flex-shrink-0">
										<div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">1</div>
									</div>
									<div className="ml-6">
										<h3 className="text-lg font-semibold">Get Your API Key</h3>
										<p className="mt-2 text-muted-foreground">Sign up for a free account and generate your API key instantly. No credit card required.</p>
										<Button asChild variant="outline" size="sm" className="mt-4">
											<Link href="/developers/api-keys">Get API Key</Link>
										</Button>
									</div>
								</div>
								<div className="flex">
									<div className="flex-shrink-0">
										<div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">2</div>
									</div>
									<div className="ml-6">
										<h3 className="text-lg font-semibold">Make Your First Request</h3>
										<p className="mt-2 text-muted-foreground">Use our RESTful APIs with simple HTTP requests. No complex setup required.</p>
									</div>
								</div>
								<div className="flex">
									<div className="flex-shrink-0">
										<div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">3</div>
									</div>
									<div className="ml-6">
										<h3 className="text-lg font-semibold">Build & Deploy</h3>
										<p className="mt-2 text-muted-foreground">Integrate our APIs into your application and deploy with confidence using our reliable infrastructure.</p>
									</div>
								</div>
							</div>
							<div className="p-6 bg-background rounded-lg border">
								<div className="flex items-center justify-between mb-4">
									<h4 className="font-semibold">Example Request</h4>
									<Badge variant="secondary">cURL</Badge>
								</div>
								<pre className="overflow-x-auto p-4 text-sm bg-muted rounded-lg">
									{`curl -X GET "https://api.thorbis.com/v1/businesses/search" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "coffee shops",
    "location": "Seattle, WA",
    "radius": "5km",
    "limit": 20
  }'`}
								</pre>
								<div className="mt-4">
									<h5 className="text-sm font-medium text-muted-foreground">Response:</h5>
									<pre className="mt-2 overflow-x-auto p-4 text-xs bg-muted rounded-lg">
										{`{
  "businesses": [
    {
      "id": "12345",
      "name": "Pike Place Coffee",
      "address": "1912 Pike Pl, Seattle, WA",
      "rating": 4.5,
      "coordinates": {
        "lat": 47.6097,
        "lng": -122.3331
      }
    }
  ],
  "total": 150,
  "page": 1
}`}
									</pre>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* SDKs and Tools Section */}
				<div className="px-4 py-24 lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold tracking-tight">SDKs & Integration Tools</h2>
							<p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">Official SDKs and tools to accelerate your development process</p>
						</div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
							<Card className="text-center hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="mx-auto p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20 w-fit">
										<Code2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
									</div>
									<CardTitle className="text-lg">JavaScript SDK</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-4">Full-featured SDK for Node.js and browser environments</p>
									<Button asChild variant="outline" size="sm" className="w-full">
										<Link href="#" className="flex items-center">
											<Download className="mr-2 w-4 h-4" />
											Install SDK
										</Link>
									</Button>
								</CardContent>
							</Card>

							<Card className="text-center hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="mx-auto p-3 bg-green-100 rounded-lg dark:bg-green-900/20 w-fit">
										<Smartphone className="w-8 h-8 text-green-600 dark:text-green-400" />
									</div>
									<CardTitle className="text-lg">React Native</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-4">Native mobile SDK for iOS and Android applications</p>
									<Button asChild variant="outline" size="sm" className="w-full">
										<Link href="#" className="flex items-center">
											<Download className="mr-2 w-4 h-4" />
											Install SDK
										</Link>
									</Button>
								</CardContent>
							</Card>

							<Card className="text-center hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="mx-auto p-3 bg-purple-100 rounded-lg dark:bg-purple-900/20 w-fit">
										<Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
									</div>
									<CardTitle className="text-lg">Python SDK</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-4">Comprehensive Python library for backend integrations</p>
									<Button asChild variant="outline" size="sm" className="w-full">
										<Link href="#" className="flex items-center">
											<Download className="mr-2 w-4 h-4" />
											Install SDK
										</Link>
									</Button>
								</CardContent>
							</Card>

							<Card className="text-center hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="mx-auto p-3 bg-orange-100 rounded-lg dark:bg-orange-900/20 w-fit">
										<GitBranch className="w-8 h-8 text-orange-600 dark:text-orange-400" />
									</div>
									<CardTitle className="text-lg">CLI Tools</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-4">Command-line tools for testing and API management</p>
									<Button asChild variant="outline" size="sm" className="w-full">
										<Link href="#" className="flex items-center">
											<Download className="mr-2 w-4 h-4" />
											Install CLI
										</Link>
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Community and Support Section */}
				<div className="px-4 py-24 bg-muted lg:px-8">
					<div className="mx-auto max-w-7xl">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold tracking-tight">Developer Community & Support</h2>
							<p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">Join thousands of developers building amazing applications with Thorbis APIs</p>
						</div>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							<Card className="text-center">
								<CardHeader>
									<div className="mx-auto p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20 w-fit">
										<Book className="w-8 h-8 text-blue-600 dark:text-blue-400" />
									</div>
									<CardTitle>Documentation</CardTitle>
									<CardDescription>Comprehensive guides, API references, and tutorials</CardDescription>
								</CardHeader>
								<CardContent>
									<Button asChild variant="outline" className="w-full">
										<Link href="/developers/docs" className="flex items-center">
											Read Docs
											<ExternalLink className="ml-2 w-4 h-4" />
										</Link>
									</Button>
								</CardContent>
							</Card>

							<Card className="text-center">
								<CardHeader>
									<div className="mx-auto p-3 bg-green-100 rounded-lg dark:bg-green-900/20 w-fit">
										<MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
									</div>
									<CardTitle>Community Forum</CardTitle>
									<CardDescription>Connect with other developers and get help from the community</CardDescription>
								</CardHeader>
								<CardContent>
									<Button asChild variant="outline" className="w-full">
										<Link href="#" className="flex items-center">
											Join Forum
											<ExternalLink className="ml-2 w-4 h-4" />
										</Link>
									</Button>
								</CardContent>
							</Card>

							<Card className="text-center">
								<CardHeader>
									<div className="mx-auto p-3 bg-purple-100 rounded-lg dark:bg-purple-900/20 w-fit">
										<Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
									</div>
									<CardTitle>Premium Support</CardTitle>
									<CardDescription>Priority support with dedicated developer success team</CardDescription>
								</CardHeader>
								<CardContent>
									<Button asChild variant="outline" className="w-full">
										<Link href="#" className="flex items-center">
											Learn More
											<ExternalLink className="ml-2 w-4 h-4" />
										</Link>
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="px-4 py-24 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<h2 className="text-4xl font-bold tracking-tight">Ready to Start Building?</h2>
						<p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Join thousands of developers who trust Thorbis APIs for their location-based applications. Get started with your free API key today.</p>
						<div className="flex flex-col gap-4 justify-center items-center mt-10 sm:flex-row sm:gap-6">
							<Button asChild size="lg" className="px-8 py-3 text-lg">
								<Link href="/developers/api-keys">
									Get Your Free API Key
									<ArrowRight className="ml-2 w-5 h-5" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg" className="px-8 py-3 text-lg">
								<Link href="/developers/docs">
									Explore Documentation
									<Bookmark className="ml-2 w-5 h-5" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
