"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Input } from "@components/ui/input";
import { DollarSign, TrendingUp, Users, AlertTriangle, CheckCircle, Clock, Search, Calendar, CreditCard, Download, Mail, ArrowUpRight, ArrowDownRight, MoreVertical } from "lucide-react";

const mockSubscriptions = [
	{
		id: 1,
		businessName: "Wade's Plumbing & Septic",
		tier: "Pro",
		monthlyFee: 79,
		status: "active",
		nextPayment: "2024-04-01",
		lastPayment: "2024-03-01",
		joinDate: "2024-01-15",
		totalPaid: 158,
		hubShare: 126.4,
		platformFee: 31.6,
	},
	{
		id: 2,
		businessName: "Downtown Coffee Roasters",
		tier: "Basic",
		monthlyFee: 49,
		status: "active",
		nextPayment: "2024-04-01",
		lastPayment: "2024-03-01",
		joinDate: "2024-02-01",
		totalPaid: 98,
		hubShare: 78.4,
		platformFee: 19.6,
	},
	{
		id: 3,
		businessName: "Elite Dental Care",
		tier: "Basic",
		monthlyFee: 49,
		status: "pending",
		nextPayment: "2024-03-15",
		lastPayment: null,
		joinDate: "2024-03-10",
		totalPaid: 0,
		hubShare: 0,
		platformFee: 0,
	},
	{
		id: 4,
		businessName: "Fresh Market Grocery",
		tier: "Pro",
		monthlyFee: 79,
		status: "overdue",
		nextPayment: "2024-03-01",
		lastPayment: "2024-02-01",
		joinDate: "2024-01-01",
		totalPaid: 79,
		hubShare: 63.2,
		platformFee: 15.8,
	},
];

const revenueHistory = [
	{ month: "March 2024", totalRevenue: 256, hubShare: 204.8, platformFee: 51.2, activeSubscriptions: 3 },
	{ month: "February 2024", totalRevenue: 177, hubShare: 141.6, platformFee: 35.4, activeSubscriptions: 2 },
	{ month: "January 2024", totalRevenue: 79, hubShare: 63.2, platformFee: 15.8, activeSubscriptions: 1 },
];

export default function SubscriptionsManagement() {
	const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [tierFilter, setTierFilter] = useState("all");

	const filteredSubscriptions = subscriptions.filter((sub) => {
		const matchesSearch = sub.businessName.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
		const matchesTier = tierFilter === "all" || sub.tier.toLowerCase() === tierFilter;
		return matchesSearch && matchesStatus && matchesTier;
	});

	const totalMonthlyRevenue = subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.monthlyFee, 0);

	const hubMonthlyShare = totalMonthlyRevenue * 0.8;
	const platformMonthlyFee = totalMonthlyRevenue * 0.2;

	const getStatusBadge = (status) => {
		const statusConfig = {
			active: { color: "bg-green-100 text-green-800 border-green-200", label: "Active" },
			pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
			overdue: { color: "bg-red-100 text-red-800 border-red-200", label: "Overdue" },
			suspended: { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Suspended" },
		};

		const config = statusConfig[status] || statusConfig.pending;
		return <Badge className={`${config.color} text-xs font-medium`}>{config.label}</Badge>;
	};

	const getTierBadge = (tier) => {
		const tierConfig = {
			Basic: { color: "bg-blue-100 text-blue-800 border-blue-200" },
			Pro: { color: "bg-purple-100 text-purple-800 border-purple-200" },
			Premium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
		};

		const config = tierConfig[tier] || tierConfig.Basic;
		return <Badge className={`${config.color} text-xs font-medium`}>{tier}</Badge>;
	};

	return (
		<div className="w-full px-4 py-16 space-y-8 lg:px-24">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold">Subscription Management</h1>
					<p className="mt-2 text-muted-foreground">Track business subscriptions, payments, and your revenue share.</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm">
						<Download className="w-4 h-4 mr-2" />
						Export Data
					</Button>
					<Button variant="outline" size="sm">
						<Mail className="w-4 h-4 mr-2" />
						Send Reminders
					</Button>
				</div>
			</div>

			{/* Revenue Overview */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
						<DollarSign className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${totalMonthlyRevenue.toLocaleString()}</div>
						<p className="text-xs text-green-600 flex items-center">
							<ArrowUpRight className="w-3 h-3 mr-1" />
							+18.2% from last month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">Your Share (80%)</CardTitle>
						<TrendingUp className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">${hubMonthlyShare.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Next payout: March 31st</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">Platform Fee (20%)</CardTitle>
						<CreditCard className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${platformMonthlyFee.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Covers hosting & support</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
						<AlertTriangle className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">{subscriptions.filter((s) => s.status === "overdue").length}</div>
						<p className="text-xs text-muted-foreground">Requires follow-up</p>
					</CardContent>
				</Card>
			</div>

			{/* Current Subscriptions */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Active Subscriptions</CardTitle>
						<div className="flex items-center space-x-2">
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input placeholder="Search businesses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 w-64" />
							</div>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="overdue">Overdue</SelectItem>
								</SelectContent>
							</Select>
							<Select value={tierFilter} onValueChange={setTierFilter}>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Tiers</SelectItem>
									<SelectItem value="basic">Basic</SelectItem>
									<SelectItem value="pro">Pro</SelectItem>
									<SelectItem value="premium">Premium</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{filteredSubscriptions.map((subscription) => (
							<div key={subscription.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
								<div className="flex-1 space-y-1">
									<div className="flex items-center space-x-3">
										<h3 className="font-semibold">{subscription.businessName}</h3>
										{getStatusBadge(subscription.status)}
										{getTierBadge(subscription.tier)}
									</div>
									<div className="flex items-center space-x-4 text-sm text-muted-foreground">
										<span className="flex items-center">
											<Calendar className="w-4 h-4 mr-1" />
											Next payment: {new Date(subscription.nextPayment).toLocaleDateString()}
										</span>
										<span className="flex items-center">
											<CreditCard className="w-4 h-4 mr-1" />
											Total paid: ${subscription.totalPaid}
										</span>
										<span>Member since: {new Date(subscription.joinDate).toLocaleDateString()}</span>
									</div>
								</div>

								<div className="flex items-center space-x-4">
									<div className="text-right">
										<div className="font-semibold">${subscription.monthlyFee}/mo</div>
										<div className="text-xs text-green-600">Your share: ${(subscription.monthlyFee * 0.8).toFixed(0)}</div>
									</div>
									<Button variant="ghost" size="sm">
										<MoreVertical className="w-4 h-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Revenue History */}
			<Card>
				<CardHeader>
					<CardTitle>Revenue History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{revenueHistory.map((month, index) => (
							<div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
								<div className="space-y-1">
									<h3 className="font-semibold">{month.month}</h3>
									<p className="text-sm text-muted-foreground">
										{month.activeSubscriptions} active subscription{month.activeSubscriptions !== 1 ? "s" : ""}
									</p>
								</div>
								<div className="grid grid-cols-3 gap-8 text-right">
									<div>
										<div className="text-sm text-muted-foreground">Total Revenue</div>
										<div className="font-semibold">${month.totalRevenue}</div>
									</div>
									<div>
										<div className="text-sm text-muted-foreground">Your Share</div>
										<div className="font-semibold text-green-600">${month.hubShare}</div>
									</div>
									<div>
										<div className="text-sm text-muted-foreground">Platform Fee</div>
										<div className="font-semibold">${month.platformFee}</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Subscription Analytics */}
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Subscription Metrics</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-sm">Average Revenue per Business</span>
							<span className="font-bold">$64/month</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm">Customer Lifetime Value</span>
							<span className="font-bold">$768</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm">Monthly Growth Rate</span>
							<span className="font-bold text-green-600">+25%</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm">Churn Rate</span>
							<span className="font-bold text-orange-600">2.1%</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm">Revenue Growth</span>
							<span className="font-bold text-green-600">+18.7%</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Payment Health</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-sm">On-Time Payment Rate</span>
							<span className="font-bold text-green-600">94%</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm">Late Payments</span>
							<span className="font-bold text-orange-600">3</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm">Failed Payments</span>
							<span className="font-bold text-red-600">1</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm">Payment Recovery Rate</span>
							<span className="font-bold">89%</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm">Average Days to Recovery</span>
							<span className="font-bold">7 days</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
