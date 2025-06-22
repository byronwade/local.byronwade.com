export const metadata = {
	title: "Business Support - Help & Resources for Business Owners | Thorbis",
	description: "Get dedicated support for your business on Thorbis. Access help documentation, contact our support team, and find resources to grow your business successfully.",
	keywords: ["business support", "business help", "customer service", "business resources", "business assistance", "thorbis support"],
	openGraph: {
		title: "Business Support - Help & Resources for Business Owners | Thorbis",
		description: "Get dedicated support for your business on Thorbis. Access help documentation, contact our support team, and find resources to grow your business successfully.",
		url: "https://local.byronwade.com/business-support",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-business-support.jpg",
				width: 1200,
				height: 630,
				alt: "Business Support on Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Business Support - Thorbis",
		description: "Get dedicated support and resources to grow your business successfully.",
		images: ["https://local.byronwade.com/og-business-support.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/business-support",
	},
};

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, LifeBuoy, BookOpen, MessageCircle, Book, Phone, Mail, Clock, Users, Headphones, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const popularArticles = [
	{ title: "How to respond to reviews", link: "#" },
	{ title: "Updating your business information", link: "#" },
	{ title: "Understanding your analytics", link: "#" },
	{ title: "Getting started with advertising", link: "#" },
];

export default function BusinessSupportPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Business Support",
		description: "Comprehensive support and resources for business owners using Thorbis platform",
		url: "https://local.byronwade.com/business-support",
		mainEntity: {
			"@type": "CustomerService",
			name: "Thorbis Business Support",
			description: "Dedicated support services for business customers",
			serviceType: "Business Support",
			provider: {
				"@type": "Organization",
				name: "Thorbis",
			},
			availableChannel: [
				{
					"@type": "ContactPoint",
					contactType: "Customer Service",
					telephone: "+1-800-THORBIS",
					email: "business-support@thorbis.com",
					availableLanguage: "English",
				},
			],
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
						"@id": "https://local.byronwade.com/business-support",
						name: "Business Support",
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
					<div className="px-4 py-24 mx-auto max-w-5xl text-center lg:px-24">
						<Headphones className="w-16 h-16 mx-auto text-primary mb-4" />
						<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Business Support</h1>
						<p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">Get the help you need to succeed. Our dedicated business support team is here to assist you every step of the way.</p>
					</div>
				</div>

				{/* Support Options */}
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-6xl">
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
							{/* Live Chat */}
							<Card>
								<CardHeader className="text-center">
									<MessageCircle className="w-12 h-12 mx-auto text-primary mb-2" />
									<CardTitle>Live Chat Support</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground mb-4">Get instant help with our live chat feature. Available during business hours for immediate assistance.</p>
									<div className="flex items-center mb-4">
										<Clock className="w-4 h-4 mr-2 text-muted-foreground" />
										<span className="text-sm">Mon-Fri 9AM-6PM CT</span>
									</div>
									<Button className="w-full" asChild>
										<Link href="/contact-support">Start Live Chat</Link>
									</Button>
								</CardContent>
							</Card>

							{/* Email Support */}
							<Card>
								<CardHeader className="text-center">
									<Mail className="w-12 h-12 mx-auto text-primary mb-2" />
									<CardTitle>Email Support</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground mb-4">Send us detailed questions and we&apos;ll respond within 24 hours with comprehensive solutions.</p>
									<div className="flex items-center mb-4">
										<Clock className="w-4 h-4 mr-2 text-muted-foreground" />
										<span className="text-sm">Response within 24 hours</span>
									</div>
									<Button variant="outline" className="w-full" asChild>
										<Link href="mailto:business-support@thorbis.com">Send Email</Link>
									</Button>
								</CardContent>
							</Card>

							{/* Phone Support */}
							<Card>
								<CardHeader className="text-center">
									<Phone className="w-12 h-12 mx-auto text-primary mb-2" />
									<CardTitle>Phone Support</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground mb-4">Speak directly with our business support specialists for complex issues or urgent matters.</p>
									<div className="flex items-center mb-4">
										<Clock className="w-4 h-4 mr-2 text-muted-foreground" />
										<span className="text-sm">Mon-Fri 9AM-6PM CT</span>
									</div>
									<Button variant="outline" className="w-full" asChild>
										<Link href="tel:+1-800-THORBIS">Call Now</Link>
									</Button>
								</CardContent>
							</Card>
						</div>

						{/* Resources Section */}
						<div className="mt-16">
							<h2 className="text-3xl font-bold text-center mb-8">Business Resources</h2>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<Card>
									<CardHeader>
										<div className="flex items-center">
											<Book className="w-8 h-8 mr-3 text-primary" />
											<CardTitle>Help Documentation</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-4">Comprehensive guides and tutorials to help you make the most of your Thorbis business account.</p>
										<Button variant="outline" asChild>
											<Link href="/help-center">View Documentation</Link>
										</Button>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<div className="flex items-center">
											<Users className="w-8 h-8 mr-3 text-primary" />
											<CardTitle>Community Forum</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-4">Connect with other business owners, share experiences, and get advice from the community.</p>
										<Button variant="outline" disabled>
											Coming Soon
										</Button>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<div className="flex items-center">
											<FileText className="w-8 h-8 mr-3 text-primary" />
											<CardTitle>Best Practices</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-4">Learn proven strategies and best practices to optimize your business presence and attract more customers.</p>
										<Button variant="outline" asChild>
											<Link href="/business-success-stories">View Case Studies</Link>
										</Button>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<div className="flex items-center">
											<MessageCircle className="w-8 h-8 mr-3 text-primary" />
											<CardTitle>FAQ</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-4">Find quick answers to the most commonly asked questions about business accounts and features.</p>
										<Button variant="outline" asChild>
											<Link href="/faq">View FAQ</Link>
										</Button>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
