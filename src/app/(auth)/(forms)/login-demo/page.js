// Demo page to showcase all intelligent login contexts

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
// Temporarily commented out problematic imports for build
// import { IntelligentLoginButton } from "@components/features/auth";
// import { LOGIN_CONTEXTS } from "@lib/auth/login-context";

// Simple placeholder button for now
function IntelligentLoginButton({ children, context, contextParams, ...props }) {
	return (
		<Button {...props}>
			{children || `Login for ${context}`}
		</Button>
	);
}

// Mock contexts for demo
const LOGIN_CONTEXTS = {
	"add-business": { title: "Add Business", subtitle: "Join our platform", icon: "🏢", message: "Add your business", benefits: ["Benefit 1"], actionText: "Add Business", priority: "high" },
	"write-review": { title: "Write Review", subtitle: "Share your experience", icon: "⭐", message: "Write a review", benefits: ["Benefit 1"], actionText: "Write Review", priority: "medium" }
};
import { Building2, Star, Calendar, Users, Shield, Sparkles, MessageCircle, User, ExternalLink, Code2, Lightbulb } from "lucide-react";

export default function LoginDemoPage() {
	const [selectedContext, setSelectedContext] = useState("add-business");

	const contextCategories = {
		business: ["add-business", "claim-business", "business-dashboard"],
		social: ["write-review", "save-business", "join-community"],
		booking: ["book-service"],
		account: ["view-profile", "admin-access"],
		premium: ["premium-features"],
		support: ["get-support"],
	};

	const categoryIcons = {
		business: Building2,
		social: Users,
		booking: Calendar,
		account: User,
		premium: Sparkles,
		support: MessageCircle,
	};

	const categoryColors = {
		business: "bg-blue-100 text-blue-800 border-blue-200",
		social: "bg-green-100 text-green-800 border-green-200",
		booking: "bg-purple-100 text-purple-800 border-purple-200",
		account: "bg-indigo-100 text-indigo-800 border-indigo-200",
		premium: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200",
		support: "bg-cyan-100 text-cyan-800 border-cyan-200",
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="flex items-center justify-center mb-4">
						<Lightbulb className="h-8 w-8 text-yellow-500 mr-3" />
						<h1 className="text-4xl font-bold text-gray-900 dark:text-white">Intelligent Login System</h1>
					</div>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Experience how our smart authentication system provides contextual messaging and intelligent redirects based on user intent</p>
					<Badge variant="secondary" className="mt-4">
						Interactive Demo
					</Badge>
				</div>

				<Tabs defaultValue="components" className="space-y-8">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="components">Interactive Components</TabsTrigger>
						<TabsTrigger value="contexts">All Contexts</TabsTrigger>
						<TabsTrigger value="urls">URL Examples</TabsTrigger>
					</TabsList>

					{/* Interactive Components Tab */}
					<TabsContent value="components" className="space-y-8">
						<div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
							{/* Business Actions */}
							<Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
								<CardHeader>
									<div className="flex items-center space-x-2">
										<Building2 className="h-5 w-5 text-blue-600" />
										<CardTitle className="text-blue-900 dark:text-blue-100">Business Actions</CardTitle>
									</div>
									<CardDescription>Smart login buttons for business-related activities</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<IntelligentLoginButton context="add-business" variant="intelligent" className="w-full" showIcon={true}>
										Add Your Business
									</IntelligentLoginButton>
									<IntelligentLoginButton context="claim-business" contextParams={{ businessId: "demo-123" }} variant="intelligent" className="w-full" showIcon={true}>
										Claim This Business
									</IntelligentLoginButton>
									<IntelligentLoginButton context="business-dashboard" variant="intelligent" className="w-full" showIcon={true}>
										Business Dashboard
									</IntelligentLoginButton>
								</CardContent>
							</Card>

							{/* Social Actions */}
							<Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
								<CardHeader>
									<div className="flex items-center space-x-2">
										<Star className="h-5 w-5 text-green-600" />
										<CardTitle className="text-green-900 dark:text-green-100">Social Actions</CardTitle>
									</div>
									<CardDescription>Interactive buttons for reviews and community features</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<IntelligentLoginButton context="write-review" contextParams={{ businessId: "demo-123" }} variant="intelligent" className="w-full" showIcon={true}>
										Write a Review
									</IntelligentLoginButton>
									<IntelligentLoginButton context="save-business" contextParams={{ businessId: "demo-123" }} variant="intelligent" className="w-full" showIcon={true}>
										Save Business
									</IntelligentLoginButton>
									<IntelligentLoginButton context="join-community" variant="intelligent" className="w-full" showIcon={true} showBadge={true} badgeText="Free">
										Join Community
									</IntelligentLoginButton>
								</CardContent>
							</Card>

							{/* Booking & Services */}
							<Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800">
								<CardHeader>
									<div className="flex items-center space-x-2">
										<Calendar className="h-5 w-5 text-purple-600" />
										<CardTitle className="text-purple-900 dark:text-purple-100">Booking & Services</CardTitle>
									</div>
									<CardDescription>Service booking and appointment scheduling</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<IntelligentLoginButton context="book-service" contextParams={{ businessId: "demo-123" }} variant="intelligent" className="w-full" showIcon={true}>
										Book Service
									</IntelligentLoginButton>
									<IntelligentLoginButton context="premium-features" variant="intelligent" className="w-full" showIcon={true} showBadge={true} badgeText="Pro">
										Premium Features
									</IntelligentLoginButton>
									<IntelligentLoginButton context="get-support" variant="intelligent" className="w-full" showIcon={true}>
										Get Support
									</IntelligentLoginButton>
								</CardContent>
							</Card>

							{/* Account Access */}
							<Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-800">
								<CardHeader>
									<div className="flex items-center space-x-2">
										<User className="h-5 w-5 text-indigo-600" />
										<CardTitle className="text-indigo-900 dark:text-indigo-100">Account Access</CardTitle>
									</div>
									<CardDescription>Dashboard and profile management access</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<IntelligentLoginButton context="user-dashboard" variant="intelligent" className="w-full" showIcon={true}>
										User Dashboard
									</IntelligentLoginButton>
									<IntelligentLoginButton context="admin-access" variant="intelligent" className="w-full" showIcon={true} showBadge={true} badgeText="Admin">
										Admin Dashboard
									</IntelligentLoginButton>
									<IntelligentLoginButton context="view-profile" variant="intelligent" className="w-full" showIcon={true}>
										View Profile
									</IntelligentLoginButton>
								</CardContent>
							</Card>

							{/* Custom Examples */}
							<Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800">
								<CardHeader>
									<div className="flex items-center space-x-2">
										<Code2 className="h-5 w-5 text-orange-600" />
										<CardTitle className="text-orange-900 dark:text-orange-100">Custom Examples</CardTitle>
									</div>
									<CardDescription>Custom contexts with additional parameters</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<IntelligentLoginButton context="premium-features" contextParams={{ feature: "analytics", source: "demo" }} variant="intelligent" className="w-full" showIcon={true} showBadge={true} badgeText="Pro">
										Advanced Analytics
									</IntelligentLoginButton>

									<IntelligentLoginButton context="add-business" contextParams={{ category: "restaurant", location: "nyc" }} variant="intelligent" className="w-full" showIcon={true} showBadge={true} badgeText="Featured">
										Add Restaurant
									</IntelligentLoginButton>

									<IntelligentLoginButton context="book-service" contextParams={{ service: "consultation", business: "demo-456" }} variant="intelligent" className="w-full" showIcon={true}>
										Book Consultation
									</IntelligentLoginButton>
								</CardContent>
							</Card>

							{/* Live Preview */}
							<Card className="border-gray-200 bg-gray-50/50 dark:bg-gray-950/20 dark:border-gray-800">
								<CardHeader>
									<div className="flex items-center space-x-2">
										<ExternalLink className="h-5 w-5 text-gray-600" />
										<CardTitle className="text-gray-900 dark:text-gray-100">Live Preview</CardTitle>
									</div>
									<CardDescription>Test the actual login page with context</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<Button variant="outline" className="w-full" onClick={() => window.open("/login?context=add-business", "_blank")}>
										Preview: Add Business
									</Button>
									<Button variant="outline" className="w-full" onClick={() => window.open("/login?context=write-review&business=demo-123", "_blank")}>
										Preview: Write Review
									</Button>
									<Button variant="outline" className="w-full" onClick={() => window.open("/login?context=premium-features", "_blank")}>
										Preview: Premium Features
									</Button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* All Contexts Tab */}
					<TabsContent value="contexts" className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{Object.entries(LOGIN_CONTEXTS).map(([key, context]) => {
								if (key === "default") return null;

								const category = Object.entries(contextCategories).find(([cat, contexts]) => contexts.includes(key))?.[0] || "general";

								const IconComponent = categoryIcons[category] || Shield;

								return (
									<Card key={key} className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedContext === key ? "ring-2 ring-blue-500" : ""}`} onClick={() => setSelectedContext(key)}>
										<CardHeader className="pb-3">
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-2">
													<IconComponent className="h-5 w-5" />
													<CardTitle className="text-sm">{context.title}</CardTitle>
												</div>
												<Badge variant="outline" className={categoryColors[category]}>
													{category}
												</Badge>
											</div>
											<CardDescription className="text-xs">{context.subtitle}</CardDescription>
										</CardHeader>
										<CardContent className="pt-0">
											<div className="space-y-2">
												<p className="text-xs text-gray-600 dark:text-gray-400">{context.message}</p>
												<div className="flex items-center justify-between">
													<Badge variant={context.priority === "high" ? "destructive" : "secondary"} className="text-xs">
														{context.priority} priority
													</Badge>
													<span className="text-lg">{context.icon}</span>
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>

						{/* Selected Context Details */}
						{selectedContext !== "default" && LOGIN_CONTEXTS[selectedContext] && (
							<Card className="mt-6">
								<CardHeader>
									<CardTitle className="flex items-center space-x-2">
										<span>{LOGIN_CONTEXTS[selectedContext].icon}</span>
										<span>{LOGIN_CONTEXTS[selectedContext].title}</span>
									</CardTitle>
									<CardDescription>{LOGIN_CONTEXTS[selectedContext].subtitle}</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<h4 className="font-medium mb-2">Message</h4>
										<p className="text-sm text-gray-600 dark:text-gray-400">{LOGIN_CONTEXTS[selectedContext].message}</p>
									</div>

									<div>
										<h4 className="font-medium mb-2">Benefits</h4>
										<ul className="space-y-1">
											{LOGIN_CONTEXTS[selectedContext].benefits.map((benefit, index) => (
												<li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
													<span className="text-green-500">✓</span>
													<span>{benefit}</span>
												</li>
											))}
										</ul>
									</div>

									<div className="flex items-center justify-between pt-4 border-t">
										<div className="space-y-1">
											<p className="text-sm font-medium">Action Text</p>
											<p className="text-xs text-gray-600 dark:text-gray-400">{LOGIN_CONTEXTS[selectedContext].actionText}</p>
										</div>
										<Button variant="outline" size="sm" onClick={() => window.open(`/login?context=${selectedContext}`, "_blank")}>
											<ExternalLink className="h-4 w-4 mr-2" />
											Test Context
										</Button>
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>

					{/* URL Examples Tab */}
					<TabsContent value="urls" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>URL Parameter Examples</CardTitle>
								<CardDescription>Test these URLs to see how context detection works</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{[
									{
										title: "Add Business Context",
										url: "/login?context=add-business",
										description: "Explicit context for adding a business",
									},
									{
										title: "Business Review with ID",
										url: "/login?context=write-review&business=demo-123",
										description: "Review context with specific business ID",
									},
									{
										title: "Action-based Detection",
										url: "/login?action=save&business=demo-456",
										description: "Context detected from action parameter",
									},
									{
										title: "Claim Business",
										url: "/login?context=claim-business&business=demo-789",
										description: "Business claiming with verification",
									},
									{
										title: "Premium Features",
										url: "/login?context=premium-features&feature=analytics",
										description: "Premium context with specific feature",
									},
									{
										title: "Admin Access",
										url: "/login?context=admin-access&redirect=/dashboard/admin",
										description: "Admin access with dashboard redirect",
									},
									{
										title: "Service Booking",
										url: "/login?context=book-service&business=demo-101&service=consultation",
										description: "Booking context with service details",
									},
									{
										title: "Community Join",
										url: "/login?context=join-community&referrer=homepage",
										description: "Community access with referrer tracking",
									},
								].map((example, index) => (
									<div key={index} className="p-4 border rounded-lg space-y-2">
										<div className="flex items-center justify-between">
											<h4 className="font-medium">{example.title}</h4>
											<Button variant="outline" size="sm" onClick={() => window.open(example.url, "_blank")}>
												<ExternalLink className="h-4 w-4 mr-2" />
												Test URL
											</Button>
										</div>
										<code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block">{example.url}</code>
										<p className="text-sm text-gray-600 dark:text-gray-400">{example.description}</p>
									</div>
								))}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Footer */}
				<div className="mt-12 text-center">
					<p className="text-gray-600 dark:text-gray-400">This intelligent login system transforms authentication from a barrier into a helpful, contextual experience.</p>
				</div>
			</div>
		</div>
	);
}
