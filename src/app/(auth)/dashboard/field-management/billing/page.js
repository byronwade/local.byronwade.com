"use client";
import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Switch } from "@components/ui/switch";
import { Separator } from "@components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { CreditCard, Download, Shield, Plus, Trash2, Mail, Phone, FileText, Zap, MessageSquare, BarChart3, History, Receipt } from "lucide-react";
import { toast } from "@components/ui/use-toast";

// Mock active integrations data
const activeIntegrations = [
	{
		id: "verified-badge",
		name: "Verified Badge",
		category: "Trust",
		price: 5,
		status: "active",
		addedDate: "2024-01-15",
		nextBilling: "2024-02-15",
		description: "Show customers you're a verified, trusted business",
		icon: Shield,
		usage: {
			impressions: 1250,
			clicks: 89,
			conversions: 12,
		},
	},
	{
		id: "boost-package",
		name: "Boost Package",
		category: "Marketing",
		price: 15,
		status: "active",
		addedDate: "2024-01-10",
		nextBilling: "2024-02-10",
		description: "Get 5 boost credits per month to promote your job posts",
		icon: Zap,
		usage: {
			creditsUsed: 3,
			totalCredits: 5,
			jobViews: 450,
			applications: 23,
		},
	},
	{
		id: "advanced-analytics",
		name: "Advanced Analytics",
		category: "Analytics",
		price: 12,
		status: "active",
		addedDate: "2024-01-05",
		nextBilling: "2024-02-05",
		description: "Deep insights into your job performance and audience",
		icon: BarChart3,
		usage: {
			reportsGenerated: 8,
			dataExports: 3,
			insightsViewed: 45,
		},
	},
	{
		id: "priority-support",
		name: "Priority Support",
		category: "Support",
		price: 10,
		status: "active",
		addedDate: "2024-01-20",
		nextBilling: "2024-02-20",
		description: "Get faster response times and dedicated support",
		icon: MessageSquare,
		usage: {
			ticketsCreated: 2,
			avgResponseTime: "2.5 hours",
			resolvedIssues: 2,
		},
	},
];

// Mock billing history
const billingHistory = [
	{
		id: "inv_001",
		date: "2024-01-15",
		amount: 42,
		status: "paid",
		description: "Monthly subscription - January 2024",
		items: [
			{ name: "Verified Badge", amount: 5 },
			{ name: "Boost Package", amount: 15 },
			{ name: "Advanced Analytics", amount: 12 },
			{ name: "Priority Support", amount: 10 },
		],
	},
	{
		id: "inv_002",
		date: "2023-12-15",
		amount: 42,
		status: "paid",
		description: "Monthly subscription - December 2023",
		items: [
			{ name: "Verified Badge", amount: 5 },
			{ name: "Boost Package", amount: 15 },
			{ name: "Advanced Analytics", amount: 12 },
			{ name: "Priority Support", amount: 10 },
		],
	},
	{
		id: "inv_003",
		date: "2023-11-15",
		amount: 32,
		status: "paid",
		description: "Monthly subscription - November 2023",
		items: [
			{ name: "Verified Badge", amount: 5 },
			{ name: "Boost Package", amount: 15 },
			{ name: "Advanced Analytics", amount: 12 },
		],
	},
];

// Mock payment methods
const paymentMethods = [
	{
		id: "pm_001",
		type: "card",
		last4: "4242",
		brand: "visa",
		expiry: "12/25",
		isDefault: true,
		cardholderName: "John Doe",
	},
	{
		id: "pm_002",
		type: "card",
		last4: "5555",
		brand: "mastercard",
		expiry: "08/26",
		isDefault: false,
		cardholderName: "John Doe",
	},
];

export default function BillingPage() {
	const [billingCycle, setBillingCycle] = useState("monthly");
	const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
	const [showBillingHistory, setShowBillingHistory] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState(null);

	React.useEffect(() => {
		document.title = "Billing & Subscriptions - Business Dashboard - Thorbis";
	}, []);
	const [newPaymentMethod, setNewPaymentMethod] = useState({
		cardNumber: "",
		expiry: "",
		cvc: "",
		cardholderName: "",
		zipCode: "",
	});

	const calculateTotal = () => {
		const total = activeIntegrations.reduce((sum, integration) => sum + integration.price, 0);
		if (billingCycle === "yearly") {
			return Math.round(total * 12 * 0.8); // 20% discount for yearly
		}
		return total;
	};

	const getNextBillingDate = () => {
		const today = new Date();
		const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
		return nextMonth.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleToggleIntegration = (integrationId) => {
		toast({
			title: "Integration updated",
			description: "Your integration status has been updated.",
		});
	};

	const handleAddPaymentMethod = () => {
		toast({
			title: "Payment method added",
			description: "Your new payment method has been added successfully.",
		});
		setShowAddPaymentMethod(false);
		setNewPaymentMethod({
			cardNumber: "",
			expiry: "",
			cvc: "",
			cardholderName: "",
			zipCode: "",
		});
	};

	const handleSetDefaultPaymentMethod = (paymentMethodId) => {
		toast({
			title: "Default payment method updated",
			description: "Your default payment method has been updated.",
		});
	};

	const handleRemovePaymentMethod = (paymentMethodId) => {
		toast({
			title: "Payment method removed",
			description: "Your payment method has been removed.",
		});
	};

	const getCardIcon = (brand) => {
		switch (brand) {
			case "visa":
				return "💳";
			case "mastercard":
				return "💳";
			case "amex":
				return "💳";
			default:
				return "💳";
		}
	};

	return (
		<div className="px-4 py-16 space-y-8 w-full lg:px-24">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex gap-3 items-center">
					<div className="p-2 bg-gradient-to-br rounded-lg from-blue-500/10 to-purple-500/10">
						<CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
					</div>
					<div>
						<h1 className="text-4xl font-bold tracking-tight">Billing & Subscriptions</h1>
						<p className="mt-1 text-lg text-muted-foreground">Manage your active integrations and billing preferences</p>
					</div>
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Main Content */}
				<div className="space-y-6 lg:col-span-2">
					{/* Billing Overview */}
					<Card>
						<CardHeader>
							<CardTitle className="flex gap-2 items-center">
								<Receipt className="w-5 h-5" />
								Billing Overview
							</CardTitle>
							<CardDescription>Your current subscription and upcoming charges</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								<div className="p-4 text-center rounded-lg bg-muted">
									<p className="text-2xl font-bold">${calculateTotal()}</p>
									<p className="text-sm text-muted-foreground">{billingCycle === "yearly" ? "per year" : "per month"}</p>
								</div>
								<div className="p-4 text-center rounded-lg bg-muted">
									<p className="text-2xl font-bold">{activeIntegrations.length}</p>
									<p className="text-sm text-muted-foreground">Active Integrations</p>
								</div>
								<div className="p-4 text-center rounded-lg bg-muted">
									<p className="text-2xl font-bold">{getNextBillingDate()}</p>
									<p className="text-sm text-muted-foreground">Next Billing Date</p>
								</div>
							</div>

							{/* Billing Cycle Toggle */}
							<div className="flex gap-4 justify-center items-center">
								<span className={`text-sm ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
								<Switch checked={billingCycle === "yearly"} onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")} />
								<span className={`text-sm ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
									Yearly
									<Badge className="ml-2 text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300">Save 20%</Badge>
								</span>
							</div>
						</CardContent>
					</Card>

					{/* Active Integrations */}
					<Card>
						<CardHeader>
							<CardTitle className="flex gap-2 items-center">
								<Zap className="w-5 h-5" />
								Active Integrations
							</CardTitle>
							<CardDescription>Manage your active integrations and view usage</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{activeIntegrations.map((integration) => {
								const Icon = integration.icon;
								return (
									<div key={integration.id} className="flex justify-between items-center p-4 rounded-lg border">
										<div className="flex gap-4 items-center">
											<div className="p-2 rounded-lg bg-muted">
												<Icon className="w-5 h-5" />
											</div>
											<div>
												<div className="flex gap-2 items-center">
													<h3 className="font-semibold">{integration.name}</h3>
													<Badge variant="secondary">{integration.category}</Badge>
													<Badge className="text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300">{integration.status}</Badge>
												</div>
												<p className="text-sm text-muted-foreground">{integration.description}</p>
												<div className="flex gap-4 items-center mt-2 text-xs text-muted-foreground">
													<span>Added: {new Date(integration.addedDate).toLocaleDateString()}</span>
													<span>Next billing: {new Date(integration.nextBilling).toLocaleDateString()}</span>
												</div>
											</div>
										</div>
										<div className="flex gap-4 items-center">
											<div className="text-right">
												<p className="font-semibold">${integration.price}</p>
												<p className="text-sm text-muted-foreground">per month</p>
											</div>
											<Switch checked={integration.status === "active"} onCheckedChange={() => handleToggleIntegration(integration.id)} />
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>

					{/* Payment Methods */}
					<Card>
						<CardHeader>
							<div className="flex justify-between items-center">
								<div>
									<CardTitle className="flex gap-2 items-center">
										<CreditCard className="w-5 h-5" />
										Payment Methods
									</CardTitle>
									<CardDescription>Manage your payment methods and billing preferences</CardDescription>
								</div>
								<Button onClick={() => setShowAddPaymentMethod(true)} size="sm">
									<Plus className="mr-2 w-4 h-4" />
									Add Payment Method
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{paymentMethods.map((method) => (
								<div key={method.id} className="flex justify-between items-center p-4 rounded-lg border">
									<div className="flex gap-4 items-center">
										<div className="text-2xl">{getCardIcon(method.brand)}</div>
										<div>
											<div className="flex gap-2 items-center">
												<span className="font-semibold">
													{method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
												</span>
												{method.isDefault && <Badge className="text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300">Default</Badge>}
											</div>
											<p className="text-sm text-muted-foreground">
												{method.cardholderName} • Expires {method.expiry}
											</p>
										</div>
									</div>
									<div className="flex gap-2 items-center">
										{!method.isDefault && (
											<Button variant="outline" size="sm" onClick={() => handleSetDefaultPaymentMethod(method.id)}>
												Set Default
											</Button>
										)}
										<Button variant="outline" size="sm" onClick={() => handleRemovePaymentMethod(method.id)}>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					{/* Billing History */}
					<Card>
						<CardHeader>
							<CardTitle className="flex gap-2 items-center">
								<History className="w-5 h-5" />
								Billing History
							</CardTitle>
							<CardDescription>View your past invoices and payment history</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{billingHistory.map((invoice) => (
								<div key={invoice.id} className="flex justify-between items-center p-4 rounded-lg border">
									<div>
										<h3 className="font-semibold">{invoice.description}</h3>
										<p className="text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
									</div>
									<div className="flex gap-4 items-center">
										<div className="text-right">
											<p className="font-semibold">${invoice.amount}</p>
											<Badge className={`mt-1 ${invoice.status === "paid" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"}`}>{invoice.status}</Badge>
										</div>
										<Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
											<FileText className="mr-2 w-4 h-4" />
											View
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Right Sidebar */}
				<div className="space-y-6 lg:col-span-1">
					{/* Current Bill Summary */}
					<Card className="sticky top-6">
						<CardHeader>
							<CardTitle className="flex gap-2 items-center">
								<Receipt className="w-5 h-5" />
								Current Bill
							</CardTitle>
							<CardDescription>Your next billing cycle</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{activeIntegrations.map((integration) => (
								<div key={integration.id} className="flex justify-between items-center text-sm">
									<span className="truncate">{integration.name}</span>
									<span className="font-medium">${integration.price}</span>
								</div>
							))}

							<Separator />

							<div className="flex justify-between items-center">
								<span className="text-lg font-semibold">Total</span>
								<span className="text-2xl font-bold">${calculateTotal()}</span>
							</div>

							<p className="text-sm text-muted-foreground">{billingCycle === "yearly" ? "per year" : "per month"}</p>

							<Button className="w-full">
								<Download className="mr-2 w-4 h-4" />
								Download Invoice
							</Button>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button variant="outline" className="justify-start w-full" asChild>
								<a href="/dashboard/business/integrations">
									<Plus className="mr-2 w-4 h-4" />
									Add Integration
								</a>
							</Button>
							<Button variant="outline" className="justify-start w-full" asChild>
								<a href="mailto:support@thorbis.com">
									<Mail className="mr-2 w-4 h-4" />
									Billing Support
								</a>
							</Button>
							<Button variant="outline" className="justify-start w-full" asChild>
								<a href="tel:+1-800-THORBIS">
									<Phone className="mr-2 w-4 h-4" />
									Call Support
								</a>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Add Payment Method Dialog */}
			<Dialog open={showAddPaymentMethod} onOpenChange={setShowAddPaymentMethod}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Add Payment Method</DialogTitle>
						<DialogDescription>Add a new credit or debit card to your account</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="cardNumber">Card Number</Label>
							<Input
								id="cardNumber"
								placeholder="1234 5678 9012 3456"
								value={newPaymentMethod.cardNumber}
								onChange={(e) =>
									setNewPaymentMethod({
										...newPaymentMethod,
										cardNumber: e.target.value,
									})
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="expiry">Expiry Date</Label>
								<Input
									id="expiry"
									placeholder="MM/YY"
									value={newPaymentMethod.expiry}
									onChange={(e) =>
										setNewPaymentMethod({
											...newPaymentMethod,
											expiry: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<Label htmlFor="cvc">CVC</Label>
								<Input
									id="cvc"
									placeholder="123"
									value={newPaymentMethod.cvc}
									onChange={(e) =>
										setNewPaymentMethod({
											...newPaymentMethod,
											cvc: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<div>
							<Label htmlFor="cardholderName">Cardholder Name</Label>
							<Input
								id="cardholderName"
								placeholder="John Doe"
								value={newPaymentMethod.cardholderName}
								onChange={(e) =>
									setNewPaymentMethod({
										...newPaymentMethod,
										cardholderName: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<Label htmlFor="zipCode">ZIP Code</Label>
							<Input
								id="zipCode"
								placeholder="12345"
								value={newPaymentMethod.zipCode}
								onChange={(e) =>
									setNewPaymentMethod({
										...newPaymentMethod,
										zipCode: e.target.value,
									})
								}
							/>
						</div>
						<div className="flex gap-3 pt-4">
							<Button onClick={handleAddPaymentMethod} className="flex-1">
								Add Payment Method
							</Button>
							<Button variant="outline" onClick={() => setShowAddPaymentMethod(false)}>
								Cancel
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Invoice Details Dialog */}
			<Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
				<DialogContent className="max-w-2xl">
					{selectedInvoice && (
						<>
							<DialogHeader>
								<DialogTitle>Invoice #{selectedInvoice.id}</DialogTitle>
								<DialogDescription>
									{selectedInvoice.description} - {new Date(selectedInvoice.date).toLocaleDateString()}
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="space-y-2">
									{selectedInvoice.items.map((item, index) => (
										<div key={index} className="flex justify-between items-center text-sm">
											<span>{item.name}</span>
											<span className="font-medium">${item.amount}</span>
										</div>
									))}
									<Separator />
									<div className="flex justify-between items-center font-semibold">
										<span>Total</span>
										<span>${selectedInvoice.amount}</span>
									</div>
								</div>
								<div className="flex gap-3 pt-4">
									<Button className="flex-1">
										<Download className="mr-2 w-4 h-4" />
										Download PDF
									</Button>
									<Button variant="outline" onClick={() => setSelectedInvoice(null)}>
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
