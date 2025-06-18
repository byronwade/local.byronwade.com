"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { MapPin, Users, DollarSign, Zap, CheckCircle, Star, TrendingUp, Shield, Globe, Smartphone, CreditCard, BarChart3, Settings, HeartHandshake, Building2, Sparkles, ArrowRight, Play } from "lucide-react";

export default function LocalHubPage() {
	const [activeTab, setActiveTab] = useState("features");

	const pricingPlans = [
		{
			name: "Starter Hub",
			price: "$29",
			period: "/month",
			description: "Perfect for small neighborhoods",
			features: ["Up to 50 business listings", "Basic directory website", "Mobile responsive design", "Contact forms", "Google Maps integration", "Email support"],
			highlighted: false,
		},
		{
			name: "Growth Hub",
			price: "$79",
			period: "/month",
			description: "Ideal for growing communities",
			features: ["Up to 200 business listings", "Custom branding & domain", "Advanced search & filters", "Review & rating system", "Payment processing", "Analytics dashboard", "Priority support", "Social media integration"],
			highlighted: true,
		},
		{
			name: "Enterprise Hub",
			price: "Custom",
			period: "pricing",
			description: "For large communities & cities",
			features: ["Unlimited business listings", "Multi-location support", "API access", "White-label solution", "Custom integrations", "Dedicated account manager", "24/7 phone support", "Advanced analytics"],
			highlighted: false,
		},
	];

	const features = [
		{
			icon: Building2,
			title: "Custom Business Directory",
			description: "Create a beautiful, branded directory website for your neighborhood or city",
		},
		{
			icon: DollarSign,
			title: "Flexible Subscription Model",
			description: "Set your own pricing and subscription tiers for businesses in your directory",
		},
		{
			icon: Smartphone,
			title: "Mobile-First Design",
			description: "Your directory looks perfect on all devices with responsive design",
		},
		{
			icon: BarChart3,
			title: "Revenue Analytics",
			description: "Track subscriptions, revenue, and directory performance with detailed analytics",
		},
		{
			icon: Shield,
			title: "Business Verification",
			description: "Built-in verification system to ensure legitimate businesses join your directory",
		},
		{
			icon: Globe,
			title: "SEO Optimized",
			description: "Your directory is optimized for search engines to attract local customers",
		},
	];

	const testimonials = [
		{
			name: "Sarah Johnson",
			role: "Downtown Seattle Directory Owner",
			content: "LocalHub helped me create a thriving business directory for my neighborhood. I'm earning $2,400/month from local subscriptions!",
			rating: 5,
			revenue: "$2,400/mo",
		},
		{
			name: "Mike Rodriguez",
			role: "Austin East Side Hub",
			content: "The platform is incredibly easy to use. My directory now has 85 businesses and growing every month.",
			rating: 5,
			revenue: "$1,800/mo",
		},
		{
			name: "Jennifer Lee",
			role: "Portland Neighborhoods",
			content: "I love being able to help local businesses while building a sustainable income. LocalHub made it all possible.",
			rating: 5,
			revenue: "$3,200/mo",
		},
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950/20 dark:via-background dark:to-green-950/20">
				<div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
				<div className="relative px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-32">
					<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
						<div className="space-y-8">
							<div className="space-y-4">
								<Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
									<Sparkles className="w-4 h-4 mr-2" />
									New Platform Launch
								</Badge>
								<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
									Build Your Own
									<span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Local Directory</span>
								</h1>
								<p className="text-xl text-muted-foreground lg:text-2xl">Create a profitable business directory for your neighborhood. Set your own pricing and earn recurring revenue from local businesses.</p>
							</div>

							<div className="flex flex-col gap-4 sm:flex-row">
								<Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg">
									Start Building Your Hub
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
								<Button variant="outline" size="lg" className="group">
									<Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
									Watch Demo
								</Button>
							</div>

							<div className="flex items-center gap-8 pt-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-foreground">500+</div>
									<div className="text-sm text-muted-foreground">Active Hubs</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-foreground">$1.2M+</div>
									<div className="text-sm text-muted-foreground">Monthly Revenue</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-foreground">15K+</div>
									<div className="text-sm text-muted-foreground">Listed Businesses</div>
								</div>
							</div>
						</div>

						<div className="relative">
							<div className="relative z-10 p-8 bg-white dark:bg-card rounded-2xl shadow-2xl border border-border">
								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-semibold">Revenue Calculator</h3>
										<Badge className="bg-green-500/10 text-green-600 border-green-500/20">Live</Badge>
									</div>

									<div className="space-y-4">
										<div>
											<label className="text-sm font-medium text-foreground">Businesses in your area</label>
											<div className="mt-1">
												<input
													type="range"
													min="10"
													max="200"
													defaultValue="50"
													className="w-full"
													onChange={(e) => {
														const businesses = e.target.value;
														const revenue = businesses * 49; // $49/mo per business
														document.getElementById("revenue-display").textContent = `$${revenue.toLocaleString()}`;
														document.getElementById("business-count").textContent = businesses;
													}}
												/>
											</div>
											<div className="flex justify-between text-xs text-muted-foreground">
												<span>10</span>
												<span>200</span>
											</div>
										</div>

										<div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
											<div className="text-center">
												<div className="text-sm text-muted-foreground">Monthly Revenue Potential</div>
												<div id="revenue-display" className="text-3xl font-bold text-green-600">
													$2,450
												</div>
												<div className="text-xs text-muted-foreground">
													<span id="business-count">50</span> businesses × $49/month
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Decorative elements */}
							<div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-xl" />
							<div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl" />
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-background">
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Everything You Need to Succeed</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">Build a professional directory platform with all the tools you need to attract businesses and generate revenue.</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{features.map((feature, index) => (
							<Card key={index} className="border-border hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="flex items-center space-x-4">
										<div className="p-2 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg">
											<feature.icon className="w-6 h-6 text-blue-600" />
										</div>
										<CardTitle className="text-lg">{feature.title}</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">{feature.description}</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20 bg-muted/30">
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Success Stories</h2>
						<p className="text-xl text-muted-foreground">See how LocalHub owners are building thriving community directories</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{testimonials.map((testimonial, index) => (
							<Card key={index} className="border-border">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-1">
											{[...Array(testimonial.rating)].map((_, i) => (
												<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
											))}
										</div>
										<Badge className="bg-green-500/10 text-green-600 border-green-500/20">{testimonial.revenue}</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-foreground italic">&ldquo;{testimonial.content}&rdquo;</p>
									<div>
										<div className="font-semibold text-foreground">{testimonial.name}</div>
										<div className="text-sm text-muted-foreground">{testimonial.role}</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className="py-20 bg-background">
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="text-center space-y-4 mb-16">
						<h2 className="text-3xl font-bold text-foreground sm:text-4xl">Simple, Transparent Pricing</h2>
						<p className="text-xl text-muted-foreground">Choose the plan that fits your community size</p>
					</div>

					<div className="grid gap-8 lg:grid-cols-3">
						{pricingPlans.map((plan, index) => (
							<Card key={index} className={`border-border relative ${plan.highlighted ? "ring-2 ring-blue-500 shadow-lg" : ""}`}>
								{plan.highlighted && (
									<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
										<Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">Most Popular</Badge>
									</div>
								)}
								<CardHeader className="text-center">
									<CardTitle className="text-2xl">{plan.name}</CardTitle>
									<div className="space-y-2">
										<div className="flex items-baseline justify-center">
											<span className="text-4xl font-bold text-foreground">{plan.price}</span>
											<span className="text-muted-foreground">{plan.period}</span>
										</div>
										<CardDescription>{plan.description}</CardDescription>
									</div>
								</CardHeader>
								<CardContent className="space-y-6">
									<ul className="space-y-3">
										{plan.features.map((feature, featureIndex) => (
											<li key={featureIndex} className="flex items-center space-x-3">
												<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
												<span className="text-sm text-foreground">{feature}</span>
											</li>
										))}
									</ul>
									<Button className={`w-full ${plan.highlighted ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white" : ""}`} variant={plan.highlighted ? "default" : "outline"}>
										Get Started
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
				<div className="px-4 mx-auto text-center max-w-4xl sm:px-6 lg:px-8">
					<div className="space-y-6">
						<h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Build Your Local Directory Empire?</h2>
						<p className="text-xl text-blue-100">Join hundreds of entrepreneurs earning recurring revenue from their community directories</p>
						<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
							<Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
								Start Your Free Trial
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
							<Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
								Schedule a Demo
							</Button>
						</div>
						<p className="text-sm text-blue-200">No credit card required • 14-day free trial • Setup assistance included</p>
					</div>
				</div>
			</section>
		</div>
	);
}
