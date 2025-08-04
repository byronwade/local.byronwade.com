"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion";
import { 
	Search, 
	MessageCircle, 
	Phone, 
	Mail, 
	FileText, 
	User, 
	Briefcase, 
	Settings, 
	Shield, 
	Book, 
	Star, 
	Clock, 
	AlertCircle,
	CheckCircle,
	HelpCircle,
	ExternalLink,
	Zap
} from "lucide-react";

const quickActions = [
	{
		icon: <MessageCircle className="w-6 h-6" />,
		title: "Contact Support",
		description: "Get help from our support team",
		link: "/contact-support",
		badge: "24/7",
		color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
	},
	{
		icon: <HelpCircle className="w-6 h-6" />,
		title: "FAQ",
		description: "Quick answers to common questions",
		link: "/faq",
		badge: "Popular",
		color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
	},
	{
		icon: <Book className="w-6 h-6" />,
		title: "Help Center",
		description: "Browse our knowledge base",
		link: "/help-center",
		badge: "Guides",
		color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
	},
	{
		icon: <Settings className="w-6 h-6" />,
		title: "Account Settings",
		description: "Manage your account",
		link: "/account/settings",
		badge: "Self-Service",
		color: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
	}
];

const helpCategories = [
	{
		icon: <User className="w-8 h-8 text-primary" />,
		title: "Account & Profile",
		description: "Account management, profile settings, and privacy",
		articles: 12,
		link: "/help-center/account",
	},
	{
		icon: <Briefcase className="w-8 h-8 text-primary" />,
		title: "Business Tools",
		description: "Claim your business, manage reviews, and advertise",
		articles: 8,
		link: "/help-center/business",
	},
	{
		icon: <Star className="w-8 h-8 text-primary" />,
		title: "Reviews & Ratings",
		description: "Writing reviews, rating guidelines, and policies",
		articles: 15,
		link: "/help-center/reviews",
	},
	{
		icon: <Shield className="w-8 h-8 text-primary" />,
		title: "Trust & Safety",
		description: "Content guidelines, reporting, and community standards",
		articles: 6,
		link: "/help-center/trust-safety",
	}
];

const popularFaqs = [
	{
		question: "How do I create an account?",
		answer: "You can create an account by clicking the 'Sign Up' button in the top right corner of any page. Fill out the required information and verify your email address."
	},
	{
		question: "How do I write a review?",
		answer: "Find the business you want to review, click 'Write a Review', and share your experience. You'll need to be logged in to write reviews."
	},
	{
		question: "Can I edit or delete my review?",
		answer: "Yes, you can edit or delete your reviews from your account dashboard. Go to 'My Reviews' section in your profile."
	},
	{
		question: "How do I claim my business?",
		answer: "Search for your business, click 'Claim This Business', and follow the verification process. You'll need to provide proof of ownership."
	},
	{
		question: "Is Thorbis free to use?",
		answer: "Yes, Thorbis is completely free for consumers. Business owners can use basic features for free, with optional premium features available."
	}
];

const popularArticles = [
	{
		title: "Getting Started with Thorbis",
		description: "Learn the basics of using our platform",
		readTime: "5 min read",
		category: "Getting Started",
		link: "/help-center/getting-started"
	},
	{
		title: "Writing Helpful Reviews",
		description: "Tips for writing reviews that help others",
		readTime: "3 min read",
		category: "Reviews",
		link: "/help-center/writing-reviews"
	},
	{
		title: "Business Owner's Guide",
		description: "Complete guide for business owners",
		readTime: "10 min read",
		category: "Business",
		link: "/help-center/business-guide"
	},
	{
		title: "Privacy and Security",
		description: "How we protect your data",
		readTime: "7 min read",
		category: "Privacy",
		link: "/help-center/privacy-security"
	}
];

const contactOptions = [
	{
		icon: <MessageCircle className="w-6 h-6" />,
		title: "Live Chat",
		description: "Chat with our support team",
		availability: "24/7",
		action: "Start Chat",
		primary: true
	},
	{
		icon: <Mail className="w-6 h-6" />,
		title: "Email Support",
		description: "Send us a detailed message",
		availability: "Response within 24 hours",
		action: "Send Email"
	},
	{
		icon: <Phone className="w-6 h-6" />,
		title: "Phone Support",
		description: "Call our support hotline",
		availability: "Mon-Fri, 9AM-6PM EST",
		action: "Call Now"
	}
];

export default function SupportClient() {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<div className="bg-gradient-to-br from-primary/5 to-primary/10 border-b">
				<div className="container px-4 py-16 mx-auto max-w-6xl">
					<div className="text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full">
							<Zap className="w-4 h-4" />
							Support Center
						</div>
						<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
							How can we help you?
						</h1>
						<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
							Find answers, get support, and learn how to make the most of Thorbis
						</p>
						
						{/* Search Bar */}
						<div className="relative max-w-2xl mx-auto mb-8">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
							<Input
								placeholder="Search for help articles, guides, and answers..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 pr-4 py-6 text-lg border-2 focus:border-primary/50"
							/>
						</div>
						
						{/* Quick Actions */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{quickActions.map((action, index) => (
								<Link key={index} href={action.link}>
									<Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full">
										<CardContent className="p-6 text-center">
											<div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${action.color}`}>
												{action.icon}
											</div>
											<h3 className="font-semibold mb-2">{action.title}</h3>
											<p className="text-sm text-muted-foreground mb-3">{action.description}</p>
											<Badge variant="secondary" className="text-xs">
												{action.badge}
											</Badge>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container px-4 py-16 mx-auto max-w-6xl">
				<Tabs defaultValue="browse" className="w-full">
					<TabsList className="grid w-full grid-cols-3 mb-8">
						<TabsTrigger value="browse">Browse Help</TabsTrigger>
						<TabsTrigger value="faq">Popular FAQs</TabsTrigger>
						<TabsTrigger value="contact">Contact Us</TabsTrigger>
					</TabsList>

					{/* Browse Help Tab */}
					<TabsContent value="browse" className="space-y-12">
						{/* Help Categories */}
						<section>
							<h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{helpCategories.map((category, index) => (
									<Link key={index} href={category.link}>
										<Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 h-full">
											<CardHeader>
												<div className="flex items-center gap-4">
													{category.icon}
													<div>
														<CardTitle className="text-xl">{category.title}</CardTitle>
														<CardDescription>{category.description}</CardDescription>
													</div>
												</div>
											</CardHeader>
											<CardContent>
												<div className="flex items-center justify-between">
													<span className="text-sm text-muted-foreground">
														{category.articles} articles
													</span>
													<ExternalLink className="w-4 h-4 text-muted-foreground" />
												</div>
											</CardContent>
										</Card>
									</Link>
								))}
							</div>
						</section>

						{/* Popular Articles */}
						<section>
							<h2 className="text-3xl font-bold mb-8">Popular Articles</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{popularArticles.map((article, index) => (
									<Link key={index} href={article.link}>
										<Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 h-full">
											<CardHeader>
												<div className="flex items-center justify-between mb-2">
													<Badge variant="outline">{article.category}</Badge>
													<span className="text-sm text-muted-foreground flex items-center gap-1">
														<Clock className="w-3 h-3" />
														{article.readTime}
													</span>
												</div>
												<CardTitle className="text-lg">{article.title}</CardTitle>
												<CardDescription>{article.description}</CardDescription>
											</CardHeader>
										</Card>
									</Link>
								))}
							</div>
						</section>
					</TabsContent>

					{/* FAQ Tab */}
					<TabsContent value="faq">
						<section>
							<h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
							<div className="max-w-4xl">
								<Accordion type="single" collapsible className="w-full">
									{popularFaqs.map((faq, index) => (
										<AccordionItem key={index} value={`faq-${index}`}>
											<AccordionTrigger className="text-left hover:no-underline">
												<span className="font-semibold">{faq.question}</span>
											</AccordionTrigger>
											<AccordionContent className="text-muted-foreground">
												{faq.answer}
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
								
								<div className="mt-8 text-center">
									<p className="text-muted-foreground mb-4">Need more answers?</p>
									<Link href="/faq">
										<Button variant="outline">
											View All FAQs
											<ExternalLink className="w-4 h-4 ml-2" />
										</Button>
									</Link>
								</div>
							</div>
						</section>
					</TabsContent>

					{/* Contact Tab */}
					<TabsContent value="contact">
						<section>
							<h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
								{contactOptions.map((option, index) => (
									<Card key={index} className={`hover:shadow-lg transition-all duration-300 ${option.primary ? 'border-primary' : ''}`}>
										<CardHeader className="text-center">
											<div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${option.primary ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
												{option.icon}
											</div>
											<CardTitle>{option.title}</CardTitle>
											<CardDescription>{option.description}</CardDescription>
										</CardHeader>
										<CardContent className="text-center">
											<p className="text-sm text-muted-foreground mb-4">{option.availability}</p>
											<Button 
												variant={option.primary ? "default" : "outline"} 
												className="w-full"
											>
												{option.action}
											</Button>
										</CardContent>
									</Card>
								))}
							</div>

							{/* Status Section */}
							<Card className="mb-8">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<CheckCircle className="w-5 h-5 text-green-500" />
										System Status
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<span>All systems operational</span>
										<Badge variant="success" className="bg-green-100 text-green-800">
											Operational
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground mt-2">
										Last updated: {new Date().toLocaleString()}
									</p>
								</CardContent>
							</Card>

							{/* Additional Resources */}
							<Card>
								<CardHeader>
									<CardTitle>Additional Resources</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Link href="/community-guidelines" className="flex items-center gap-2 text-sm hover:text-primary">
											<FileText className="w-4 h-4" />
											Community Guidelines
										</Link>
										<Link href="/terms" className="flex items-center gap-2 text-sm hover:text-primary">
											<FileText className="w-4 h-4" />
											Terms of Service
										</Link>
										<Link href="/privacy" className="flex items-center gap-2 text-sm hover:text-primary">
											<Shield className="w-4 h-4" />
											Privacy Policy
										</Link>
										<Link href="/accessibility-statement" className="flex items-center gap-2 text-sm hover:text-primary">
											<User className="w-4 h-4" />
											Accessibility Statement
										</Link>
									</div>
								</CardContent>
							</Card>
						</section>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
