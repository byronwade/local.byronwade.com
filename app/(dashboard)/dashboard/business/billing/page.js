"use client";
import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Switch } from "@components/ui/switch";
import { Separator } from "@components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Crown, Zap, Star, Shield, MessageSquare, BarChart3, CheckCircle, ArrowRight, Sparkles, Rocket, Globe, Settings, Bell, CreditCard, Calendar, MapPin, Phone, Mail, ExternalLink, Building2, Users, Target, TrendingUp, Eye, Clock, Star as StarIcon, CheckCircle2, XCircle, Palette, FileText, Info } from "lucide-react";
import { toast } from "@components/ui/use-toast";

// Individual upgrade items
const upgradeItems = [
	{
		id: "logo",
		name: "Business Logo",
		price: 1,
		description: "Display your business logo on your profile and job posts",
		icon: Building2,
		popular: false,
		features: ["Logo on profile", "Logo on job posts", "Brand recognition"],
		detailedDescription: "Make your business stand out with a professional logo display. Your logo will appear prominently on your business profile and all job posts, helping build brand recognition and trust with potential workers. Perfect for businesses looking to establish a professional presence.",
		benefits: ["Increased brand visibility", "Professional appearance", "Better trust with workers", "Consistent branding across platform"],
	},
	{
		id: "verified-badge",
		name: "Verified Badge",
		price: 5,
		description: "Show customers you're a verified, trusted business",
		icon: Shield,
		popular: true,
		features: ["Verified badge", "Trust indicators", "Higher conversion rates"],
		detailedDescription: "Build trust and credibility with a verified badge. This badge shows workers that your business has been verified by Thorbis, leading to higher application rates and better quality candidates. Essential for businesses serious about hiring.",
		benefits: ["Higher application rates", "Better quality candidates", "Reduced hiring time", "Increased trust"],
	},
	{
		id: "priority-support",
		name: "Priority Support",
		price: 10,
		description: "Get faster response times and dedicated support",
		icon: MessageSquare,
		popular: false,
		features: ["4-hour response time", "Dedicated support agent", "Priority ticket handling"],
		detailedDescription: "Get the help you need when you need it. Priority support ensures you never wait more than 4 hours for a response, with dedicated agents who understand your business needs. Perfect for businesses that can't afford delays.",
		benefits: ["Faster problem resolution", "Dedicated support team", "Reduced downtime", "Better business continuity"],
	},
	{
		id: "advanced-analytics",
		name: "Advanced Analytics",
		price: 12,
		description: "Deep insights into your job performance and audience",
		icon: BarChart3,
		popular: false,
		features: ["Detailed analytics", "Custom reports", "Export capabilities", "ROI tracking"],
		detailedDescription: "Make data-driven hiring decisions with comprehensive analytics. Track job performance, candidate quality, and ROI on your hiring efforts. Export reports for your team and optimize your hiring strategy based on real data.",
		benefits: ["Data-driven decisions", "Optimized hiring strategy", "Better ROI tracking", "Improved efficiency"],
	},
	{
		id: "boost-package",
		name: "Boost Package",
		price: 15,
		description: "Get 5 boost credits per month to promote your job posts",
		icon: Zap,
		popular: true,
		features: ["5 boost credits", "Priority placement", "Advanced targeting", "Performance analytics"],
		detailedDescription: "Get your job posts seen by the best candidates. Boost credits give your posts priority placement in search results and allow for advanced targeting to reach the right workers. Track performance and optimize your campaigns.",
		benefits: ["More qualified applicants", "Faster hiring", "Better targeting", "Measurable results"],
	},
	{
		id: "unlimited-jobs",
		name: "Unlimited Job Posts",
		price: 20,
		description: "Post as many jobs as you need without limits",
		icon: Target,
		popular: true,
		features: ["Unlimited job posts", "No monthly limits", "Post anytime"],
		detailedDescription: "Never worry about hitting job post limits again. Post as many jobs as you need, whenever you need them. Perfect for growing businesses, agencies, or companies with frequent hiring needs.",
		benefits: ["No posting restrictions", "Scalable hiring", "Flexible workforce management", "Cost-effective for high-volume hiring"],
	},
	{
		id: "background-check",
		name: "Background Check Credits",
		price: 8,
		description: "Verify candidate backgrounds and credentials",
		icon: Shield,
		popular: false,
		features: ["Criminal background checks", "Employment verification", "Education verification", "Professional license checks"],
		detailedDescription: "Hire with confidence by verifying candidate backgrounds. Comprehensive background checks include criminal history, employment verification, education credentials, and professional license verification. Protect your business and customers.",
		benefits: ["Reduced hiring risk", "Legal protection", "Customer safety", "Peace of mind"],
	},
	{
		id: "skill-testing",
		name: "Skill Assessment Tools",
		price: 12,
		description: "Test candidate skills before hiring",
		icon: Target,
		popular: false,
		features: ["Custom skill tests", "Industry-specific assessments", "Automated scoring", "Detailed reports"],
		detailedDescription: "Ensure candidates have the skills they claim. Create custom skill tests or use industry-specific assessments to evaluate technical abilities, soft skills, and job-specific competencies before making hiring decisions.",
		benefits: ["Better hiring decisions", "Reduced training time", "Higher quality workers", "Skill verification"],
	},
	{
		id: "contract-templates",
		name: "Legal Contract Templates",
		price: 15,
		description: "Professional contract templates for hiring",
		icon: FileText,
		popular: false,
		features: ["Employment contracts", "NDA templates", "Service agreements", "Legal compliance"],
		detailedDescription: "Protect your business with legally sound contracts. Professional templates for employment agreements, NDAs, service contracts, and more. All templates are legally compliant and can be customized for your specific needs.",
		benefits: ["Legal protection", "Time savings", "Professional contracts", "Compliance assurance"],
	},
	{
		id: "payroll-integration",
		name: "Payroll Integration",
		price: 18,
		description: "Seamless payroll processing for hired workers",
		icon: CreditCard,
		popular: false,
		features: ["Direct deposit setup", "Tax calculations", "Payroll reports", "1099 generation"],
		detailedDescription: "Streamline your payroll process with integrated payment solutions. Set up direct deposit, calculate taxes automatically, generate payroll reports, and handle 1099 forms for contractors. Save time and reduce errors.",
		benefits: ["Time savings", "Reduced errors", "Automated compliance", "Professional payroll"],
	},
	{
		id: "insurance-coverage",
		name: "Workers Insurance",
		price: 25,
		description: "Insurance coverage for hired workers",
		icon: Shield,
		popular: false,
		features: ["General liability", "Workers compensation", "Professional liability", "Quick claims processing"],
		detailedDescription: "Protect your business with comprehensive insurance coverage. Includes general liability, workers compensation, and professional liability insurance. Quick claims processing ensures you're covered when you need it most.",
		benefits: ["Risk protection", "Legal compliance", "Peace of mind", "Business continuity"],
	},
	{
		id: "scheduling-tools",
		name: "Advanced Scheduling",
		price: 10,
		description: "Professional scheduling and time tracking",
		icon: Calendar,
		popular: false,
		features: ["Shift scheduling", "Time tracking", "Overtime calculations", "Mobile app access"],
		detailedDescription: "Manage your workforce efficiently with professional scheduling tools. Create shifts, track time, calculate overtime, and manage schedules from anywhere with mobile access. Perfect for businesses with multiple workers.",
		benefits: ["Better workforce management", "Reduced scheduling conflicts", "Accurate time tracking", "Mobile flexibility"],
	},
	{
		id: "quality-guarantee",
		name: "Quality Guarantee",
		price: 20,
		description: "Money-back guarantee if worker doesn't meet standards",
		icon: CheckCircle,
		popular: true,
		features: ["30-day guarantee", "Free replacement", "Quality standards", "Risk-free hiring"],
		detailedDescription: "Hire with confidence knowing you're protected. If a worker doesn't meet our quality standards within 30 days, we'll provide a free replacement or refund. Quality standards are clearly defined and enforced.",
		benefits: ["Risk-free hiring", "Quality assurance", "Free replacements", "Confidence in hiring"],
	},
	{
		id: "emergency-replacement",
		name: "Emergency Replacement",
		price: 15,
		description: "Quick replacement if worker can't complete job",
		icon: Clock,
		popular: false,
		features: ["24-hour replacement", "Same-day coverage", "No additional fees", "Priority matching"],
		detailedDescription: "Never worry about project delays due to worker unavailability. Get a qualified replacement within 24 hours, often same-day, with no additional fees. Priority matching ensures you get the best available worker quickly.",
		benefits: ["Project continuity", "No delays", "No additional costs", "Quick solutions"],
	},
	{
		id: "team-management",
		name: "Team Management",
		price: 30,
		description: "Manage multiple workers and projects",
		icon: Users,
		popular: false,
		features: ["Team dashboard", "Project tracking", "Performance reviews", "Communication tools"],
		detailedDescription: "Scale your operations with comprehensive team management tools. Manage multiple workers, track project progress, conduct performance reviews, and maintain clear communication. Perfect for growing businesses.",
		benefits: ["Scalable operations", "Better project management", "Improved communication", "Performance tracking"],
	},
	{
		id: "early-access",
		name: "Early Access Features",
		price: 25,
		description: "Get access to new features before anyone else",
		icon: Sparkles,
		popular: false,
		features: ["Beta features", "Early access", "Feature requests", "Exclusive updates"],
		detailedDescription: "Stay ahead of the competition with early access to new features. Test beta features, provide feedback that shapes the platform, and get exclusive updates before general release. Perfect for businesses that want to innovate.",
		benefits: ["Competitive advantage", "Influence platform development", "Early adoption benefits", "Exclusive features"],
	},
	{
		id: "custom-branding",
		name: "Custom Branding",
		price: 30,
		description: "Customize your profile with your brand colors and styling",
		icon: Palette,
		popular: false,
		features: ["Custom colors", "Brand styling", "White-label options", "Custom domain"],
		detailedDescription: "Make Thorbis an extension of your brand. Customize colors, styling, and even use white-label options with your own domain. Perfect for businesses that want a seamless brand experience.",
		benefits: ["Brand consistency", "Professional appearance", "Custom experience", "Brand integration"],
	},
	{
		id: "api-access",
		name: "API Access",
		price: 50,
		description: "Integrate Thorbis with your existing systems",
		icon: Settings,
		popular: false,
		features: ["Full API access", "Webhook support", "Custom integrations", "Developer tools"],
		detailedDescription: "Integrate Thorbis seamlessly with your existing business systems. Full API access allows custom integrations, webhook support for real-time updates, and developer tools for building custom solutions.",
		benefits: ["System integration", "Automated workflows", "Custom solutions", "Developer flexibility"],
	},
	{
		id: "dedicated-manager",
		name: "Dedicated Account Manager",
		price: 100,
		description: "Personal account manager to help grow your business",
		icon: Users,
		popular: false,
		features: ["Personal manager", "Strategic guidance", "Account optimization", "Priority support"],
		detailedDescription: "Get personalized support from a dedicated account manager who understands your business. Receive strategic guidance, account optimization recommendations, and priority support to maximize your success on Thorbis.",
		benefits: ["Personalized support", "Strategic guidance", "Account optimization", "Priority assistance"],
	},
	{
		id: "thorbis-elite",
		name: "Thorbis Elite",
		price: null,
		description: "Exclusive application program for the most exceptional businesses",
		icon: Crown,
		popular: false,
		features: ["All features included", "Exclusive benefits", "VIP support", "Custom solutions", "Dedicated team", "0.00008% acceptance rate"],
		detailedDescription: "Thorbis Elite is our most exclusive program, reserved for the most exceptional businesses. Similar to Michelin star recognition, this is an invitation-only application program with a 0.00008% acceptance rate. If accepted, you'll receive all platform features plus exclusive benefits, VIP support, custom solutions, and a dedicated team. This is not a subscription - it's an exclusive partnership for businesses that represent the pinnacle of their industry.",
		benefits: ["Complete platform access", "Exclusive benefits", "VIP treatment", "Custom solutions", "Dedicated support team", "Industry recognition", "Exclusive networking", "Priority access to new features"],
		phoneOnly: true,
		acceptanceRate: "0.00008%",
	},
];

export default function Pro() {
	const [activeItems, setActiveItems] = useState([]);
	const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or yearly
	const [selectedItem, setSelectedItem] = useState(null);

	const handleToggleItem = (itemId) => {
		setActiveItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
	};

	const handleThorbisEliteCall = () => {
		window.location.href = "tel:831-430-6011";
	};

	const getActiveItems = () => upgradeItems.filter((item) => activeItems.includes(item.id));

	const calculateTotal = () => {
		const total = getActiveItems().reduce((sum, item) => sum + (item.price || 0), 0);

		if (billingCycle === "yearly") {
			return Math.round(total * 12 * 0.8); // 20% discount for yearly, rounded
		}
		return total;
	};

	const handleSaveChanges = () => {
		toast({
			title: "Changes saved!",
			description: `Your subscription has been updated. Total: $${calculateTotal()}/${billingCycle === "yearly" ? "year" : "month"}`,
		});
	};

	const getBillingText = (price) => {
		if (price === null) {
			return "Application Only";
		}
		if (billingCycle === "yearly") {
			const yearlyPrice = Math.round(price * 12 * 0.8); // 20% discount for yearly, rounded
			return `$${yearlyPrice}/year`;
		}
		return `$${price}/month`;
	};

	return (
		<div className="w-full px-4 py-16 space-y-8 lg:px-24">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10">
						<Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
					</div>
					<div>
						<h1 className="text-4xl font-bold tracking-tight">Account Upgrades</h1>
						<p className="text-lg text-muted-foreground mt-1">Customize your experience by activating the features you need</p>
					</div>
				</div>
			</div>

			{/* Billing Toggle */}
			<div className="flex items-center justify-center gap-4">
				<span className={`text-sm ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
				<Switch checked={billingCycle === "yearly"} onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")} />
				<span className={`text-sm ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
					Yearly
					<Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Save 20%</Badge>
				</span>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Main Content - Upgrade Items */}
				<div className="lg:col-span-2 space-y-6">
					{upgradeItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeItems.includes(item.id);

						return (
							<Card key={item.id} className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${isActive ? "ring-2 ring-primary border-primary bg-primary/5" : "hover:border-muted-foreground"} ${item.popular ? "border-primary/20" : ""}`}>
								{item.popular && (
									<div className="absolute top-4 right-4">
										<Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">Popular</Badge>
									</div>
								)}

								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div className="flex items-start gap-4 flex-1">
											<div className="p-3 rounded-lg bg-muted">
												<Icon className="w-6 h-6" />
											</div>
											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-3">
													<h3 className="text-xl font-semibold">{item.name}</h3>
													{item.id === "thorbis-elite" && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Elite</Badge>}
												</div>
												<p className="text-muted-foreground">{item.description}</p>
												{item.id === "thorbis-elite" && (
													<div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
														<Star className="w-4 h-4" />
														<span className="font-medium">0.00008% acceptance rate</span>
													</div>
												)}
												<div className="flex flex-wrap gap-2">
													{item.features.map((feature, index) => (
														<Badge key={index} variant="secondary" className="text-xs">
															{feature}
														</Badge>
													))}
												</div>
												{item.id !== "thorbis-elite" ? (
													<Dialog>
														<DialogTrigger asChild>
															<Button variant="link" className="p-0 h-auto text-sm text-primary hover:text-primary/80" onClick={() => setSelectedItem(item)}>
																<Info className="w-4 h-4 mr-1" />
																View Details
															</Button>
														</DialogTrigger>
													</Dialog>
												) : (
													<Button variant="link" className="p-0 h-auto text-sm text-primary hover:text-primary/80" onClick={handleThorbisEliteCall}>
														<Phone className="w-4 h-4 mr-1" />
														Apply
													</Button>
												)}
											</div>
										</div>
										<div className="flex items-center gap-4 ml-6">
											<div className="text-right">
												<p className="text-2xl font-bold">{getBillingText(item.price)}</p>
												{item.price !== null && <p className="text-sm text-muted-foreground">{billingCycle === "yearly" ? "billed yearly" : "billed monthly"}</p>}
												{item.id === "thorbis-elite" && <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">By invitation only</p>}
											</div>
											{item.id !== "thorbis-elite" ? (
												<Switch checked={isActive} onCheckedChange={() => handleToggleItem(item.id)} className="ml-4" />
											) : (
												<Button onClick={handleThorbisEliteCall} className="ml-4" variant="outline">
													<Phone className="w-4 h-4 mr-2" />
													Apply
												</Button>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Right Sidebar - Order Summary */}
				<div className="lg:col-span-1">
					<Card className="sticky top-6">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CreditCard className="w-5 h-5" />
								Monthly Total
							</CardTitle>
							<CardDescription>{billingCycle === "yearly" ? "Yearly billing with 20% savings" : "Monthly billing"}</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Active Items List */}
							<div className="space-y-3">
								{getActiveItems().length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-4">No active upgrades</p>
								) : (
									getActiveItems().map((item) => (
										<div key={item.id} className="flex items-center justify-between text-sm">
											<span className="truncate">{item.name}</span>
											<span className="font-medium">{getBillingText(item.price)}</span>
										</div>
									))
								)}
							</div>

							{getActiveItems().length > 0 && <Separator />}

							{/* Total */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-lg font-semibold">Total</span>
									<span className="text-2xl font-bold">${calculateTotal()}</span>
								</div>
								<p className="text-sm text-muted-foreground">{billingCycle === "yearly" ? "per year" : "per month"}</p>
							</div>

							{/* Save Button */}
							<Button onClick={handleSaveChanges} className="w-full" disabled={getActiveItems().length === 0}>
								Save Changes
								<CheckCircle2 className="w-4 h-4 ml-2" />
							</Button>

							{/* Quick Stats */}
							{getActiveItems().length > 0 && (
								<div className="pt-4 border-t space-y-3">
									<h4 className="font-medium text-sm">Active Features</h4>
									<div className="grid grid-cols-2 gap-2 text-xs">
										<div className="text-center p-2 bg-muted rounded">
											<p className="font-medium">{getActiveItems().length}</p>
											<p className="text-muted-foreground">Features</p>
										</div>
										<div className="text-center p-2 bg-muted rounded">
											<p className="font-medium">${getActiveItems().reduce((sum, item) => sum + (item.price || 0), 0)}</p>
											<p className="text-muted-foreground">Base Price</p>
										</div>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Help Section */}
					<Card className="mt-6">
						<CardContent className="p-6">
							<h4 className="font-semibold mb-3">Need Help?</h4>
							<div className="space-y-3">
								<Button variant="outline" size="sm" className="w-full justify-start" asChild>
									<a href="mailto:support@thorbis.com">
										<Mail className="w-4 h-4 mr-2" />
										Email Support
									</a>
								</Button>
								<Button variant="outline" size="sm" className="w-full justify-start" asChild>
									<a href="tel:+1-800-THORBIS">
										<Phone className="w-4 h-4 mr-2" />
										Call Us
									</a>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="space-y-6">
				<h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Can I change my upgrades anytime?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Yes! You can activate or deactivate any upgrade at any time. Changes take effect immediately.</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">How does billing work?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">You&apos;re only charged for the features you have active. Billing is monthly or yearly with a 20% discount.</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Do you offer refunds?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">We offer a 30-day money-back guarantee. If you&apos;re not satisfied, contact our support team.</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">What&apos;s included in Thorbis Elite?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">Thorbis Elite includes all features plus exclusive benefits, VIP support, and custom solutions.</p>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Contact Support */}
			<Card className="text-center">
				<CardContent className="p-8">
					<h3 className="text-xl font-semibold mb-2">Need Help Choosing?</h3>
					<p className="text-muted-foreground mb-4">Our team is here to help you find the perfect plan for your business needs.</p>
					<div className="flex items-center justify-center gap-4">
						<Button variant="outline" asChild>
							<a href="mailto:support@thorbis.com">
								<Mail className="w-4 h-4 mr-2" />
								Email Support
							</a>
						</Button>
						<Button variant="outline" asChild>
							<a href="tel:+1-800-THORBIS">
								<Phone className="w-4 h-4 mr-2" />
								Call Us
							</a>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Feature Details Dialog */}
			<Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
				<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
					{selectedItem && (
						<>
							<DialogHeader>
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-muted">{React.createElement(selectedItem.icon, { className: "w-6 h-6" })}</div>
									<div>
										<DialogTitle className="text-2xl">{selectedItem.name}</DialogTitle>
										<DialogDescription className="text-lg">{getBillingText(selectedItem.price)}</DialogDescription>
									</div>
								</div>
							</DialogHeader>

							<div className="space-y-6">
								<div>
									<h4 className="font-semibold text-lg mb-2">Description</h4>
									<p className="text-muted-foreground">{selectedItem.detailedDescription}</p>
								</div>

								<div>
									<h4 className="font-semibold text-lg mb-3">Features Included</h4>
									<div className="grid gap-2">
										{selectedItem.features.map((feature, index) => (
											<div key={index} className="flex items-center gap-2">
												<CheckCircle className="w-4 h-4 text-green-600" />
												<span className="text-sm">{feature}</span>
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className="font-semibold text-lg mb-3">Key Benefits</h4>
									<div className="grid gap-2">
										{selectedItem.benefits.map((benefit, index) => (
											<div key={index} className="flex items-center gap-2">
												<Star className="w-4 h-4 text-yellow-500" />
												<span className="text-sm">{benefit}</span>
											</div>
										))}
									</div>
								</div>

								<div className="flex gap-3 pt-4">
									<Button
										onClick={() => {
											handleToggleItem(selectedItem.id);
											setSelectedItem(null);
										}}
										className="flex-1"
									>
										{activeItems.includes(selectedItem.id) ? "Remove Feature" : "Add Feature"}
									</Button>
									<Button variant="outline" onClick={() => setSelectedItem(null)}>
										Close
									</Button>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
