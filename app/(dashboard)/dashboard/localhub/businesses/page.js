"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Send, CheckCircle, XCircle, Clock, DollarSign, MapPin, Phone, Globe, Star, Users, Mail, Link as LinkIcon, Copy, ExternalLink, AlertTriangle, Building2 } from "lucide-react";
import { toast } from "@components/ui/use-toast";

const subscriptionTiers = [
	{ value: "basic", label: "Basic - $49/month", color: "bg-blue-100 text-blue-800 border-blue-200" },
	{ value: "pro", label: "Pro - $79/month", color: "bg-purple-100 text-purple-800 border-purple-200" },
	{ value: "premium", label: "Premium - $129/month", color: "bg-gold-100 text-gold-800 border-gold-200" },
];

const businessCategories = ["Restaurants", "Healthcare", "Home Services", "Retail", "Professional Services", "Automotive", "Beauty & Wellness", "Education", "Entertainment", "Technology"];

const mockBusinesses = [
	{
		id: 1,
		name: "Wade's Plumbing & Septic",
		category: "Home Services",
		address: "123 Main St, Portland, OR 97201",
		phone: "(503) 555-0123",
		website: "www.wadesplumbing.com",
		email: "info@wadesplumbing.com",
		status: "active",
		subscription: "pro",
		monthlyFee: 79,
		joinDate: "2024-01-15",
		lastPayment: "2024-03-01",
		rating: 4.8,
		reviews: 124,
		verified: true,
	},
	{
		id: 2,
		name: "Downtown Coffee Roasters",
		category: "Restaurants",
		address: "456 Oak Ave, Portland, OR 97202",
		phone: "(503) 555-0456",
		website: "www.downtowncoffee.com",
		email: "hello@downtowncoffee.com",
		status: "active",
		subscription: "basic",
		monthlyFee: 49,
		joinDate: "2024-02-01",
		lastPayment: "2024-03-01",
		rating: 4.6,
		reviews: 89,
		verified: true,
	},
	{
		id: 3,
		name: "Elite Dental Care",
		category: "Healthcare",
		address: "789 Elm St, Portland, OR 97203",
		phone: "(503) 555-0789",
		website: null,
		email: "contact@elitedental.com",
		status: "pending",
		subscription: "basic",
		monthlyFee: 49,
		joinDate: "2024-03-10",
		lastPayment: null,
		rating: 0,
		reviews: 0,
		verified: false,
	},
	{
		id: 4,
		name: "Fresh Market Grocery",
		category: "Retail",
		address: "321 Pine St, Portland, OR 97204",
		phone: "(503) 555-0321",
		website: "www.freshmarket.com",
		email: "manager@freshmarket.com",
		status: "overdue",
		subscription: "pro",
		monthlyFee: 79,
		joinDate: "2024-01-01",
		lastPayment: "2024-02-01",
		rating: 4.2,
		reviews: 56,
		verified: true,
	},
];

export default function BusinessManagement() {
	const [businesses, setBusinesses] = useState(mockBusinesses);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [isAddingBusiness, setIsAddingBusiness] = useState(false);
	const [newBusiness, setNewBusiness] = useState({
		name: "",
		category: "",
		address: "",
		phone: "",
		website: "",
		email: "",
		subscription: "basic",
	});

	const filteredBusinesses = businesses.filter((business) => {
		const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) || business.category.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || business.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const totalRevenue = businesses.filter((b) => b.status === "active").reduce((sum, b) => sum + b.monthlyFee, 0);

	const getStatusBadge = (status) => {
		const statusConfig = {
			active: { color: "bg-green-100 text-green-800 border-green-200", label: "Active" },
			pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending Setup" },
			overdue: { color: "bg-red-100 text-red-800 border-red-200", label: "Payment Overdue" },
			suspended: { color: "bg-gray-100 text-gray-800 border-gray-200", label: "Suspended" },
		};

		const config = statusConfig[status] || statusConfig.pending;
		return <Badge className={`${config.color} text-xs font-medium`}>{config.label}</Badge>;
	};

	const getSubscriptionBadge = (subscription) => {
		const tier = subscriptionTiers.find((t) => t.value === subscription);
		return <Badge className={`${tier?.color} text-xs font-medium`}>{tier?.label.split(" - ")[0] || "Basic"}</Badge>;
	};

	const handleAddBusiness = () => {
		if (!newBusiness.name || !newBusiness.category || !newBusiness.email) {
			toast({
				title: "Missing Required Fields",
				description: "Please fill in business name, category, and email address.",
				variant: "destructive",
			});
			return;
		}

		const business = {
			id: businesses.length + 1,
			...newBusiness,
			status: "pending",
			monthlyFee: subscriptionTiers.find((t) => t.value === newBusiness.subscription)?.label.includes("$49") ? 49 : subscriptionTiers.find((t) => t.value === newBusiness.subscription)?.label.includes("$79") ? 79 : 129,
			joinDate: new Date().toISOString().split("T")[0],
			lastPayment: null,
			rating: 0,
			reviews: 0,
			verified: false,
		};

		setBusinesses([...businesses, business]);
		setNewBusiness({
			name: "",
			category: "",
			address: "",
			phone: "",
			website: "",
			email: "",
			subscription: "basic",
		});
		setIsAddingBusiness(false);

		toast({
			title: "Business Added Successfully",
			description: `${business.name} has been added to your directory. Setup invitation sent to ${business.email}.`,
		});
	};

	const sendInvitation = (business) => {
		toast({
			title: "Invitation Sent",
			description: `Setup invitation resent to ${business.name} at ${business.email}.`,
		});
	};

	const copyInviteLink = (businessId) => {
		const link = `${window.location.origin}/business-setup/${businessId}?hub=your-hub-slug`;
		navigator.clipboard.writeText(link);
		toast({
			title: "Link Copied",
			description: "Business setup link copied to clipboard.",
		});
	};

	return (
		<div className="w-full px-4 py-16 space-y-8 lg:px-24">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold">Business Management</h1>
					<p className="mt-2 text-muted-foreground">Add, edit, and manage all business listings in your directory.</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm">
						<Building2 className="w-4 h-4 mr-2" />
						Bulk Actions
					</Button>
					<Dialog open={isAddingBusiness} onOpenChange={setIsAddingBusiness}>
						<DialogTrigger asChild>
							<Button size="sm">
								<Plus className="w-4 h-4 mr-2" />
								Add Business
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle>Add New Business</DialogTitle>
								<DialogDescription>Add a new business to your directory and send them a setup invitation.</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="name">Business Name *</Label>
										<Input id="name" value={newBusiness.name} onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })} placeholder="Enter business name" />
									</div>
									<div>
										<Label htmlFor="category">Category *</Label>
										<Select value={newBusiness.category} onValueChange={(value) => setNewBusiness({ ...newBusiness, category: value })}>
											<SelectTrigger>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												{businessCategories.map((category) => (
													<SelectItem key={category} value={category}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div>
									<Label htmlFor="email">Email Address *</Label>
									<Input id="email" type="email" value={newBusiness.email} onChange={(e) => setNewBusiness({ ...newBusiness, email: e.target.value })} placeholder="business@example.com" />
								</div>
								<div>
									<Label htmlFor="address">Address</Label>
									<Input id="address" value={newBusiness.address} onChange={(e) => setNewBusiness({ ...newBusiness, address: e.target.value })} placeholder="123 Main St, City, State ZIP" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="phone">Phone</Label>
										<Input id="phone" value={newBusiness.phone} onChange={(e) => setNewBusiness({ ...newBusiness, phone: e.target.value })} placeholder="(555) 123-4567" />
									</div>
									<div>
										<Label htmlFor="website">Website</Label>
										<Input id="website" value={newBusiness.website} onChange={(e) => setNewBusiness({ ...newBusiness, website: e.target.value })} placeholder="www.business.com" />
									</div>
								</div>
								<div>
									<Label htmlFor="subscription">Subscription Tier</Label>
									<Select value={newBusiness.subscription} onValueChange={(value) => setNewBusiness({ ...newBusiness, subscription: value })}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{subscriptionTiers.map((tier) => (
												<SelectItem key={tier.value} value={tier.value}>
													{tier.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setIsAddingBusiness(false)}>
									Cancel
								</Button>
								<Button onClick={handleAddBusiness}>Add Business</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Revenue Summary Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
						<Building2 className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{businesses.length}</div>
						<p className="text-xs text-muted-foreground">{businesses.filter((b) => b.status === "active").length} active</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
						<DollarSign className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${totalRevenue}</div>
						<p className="text-xs text-green-600">From {businesses.filter((b) => b.status === "active").length} active subscriptions</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">Pending Setup</CardTitle>
						<Clock className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{businesses.filter((b) => b.status === "pending").length}</div>
						<p className="text-xs text-muted-foreground">Awaiting configuration</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
						<AlertTriangle className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">{businesses.filter((b) => b.status === "overdue").length}</div>
						<p className="text-xs text-muted-foreground">Require attention</p>
					</CardContent>
				</Card>
			</div>

			{/* Business Management */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Business Directory</CardTitle>
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
									<SelectItem value="suspended">Suspended</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{filteredBusinesses.map((business) => (
							<div key={business.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
								<div className="flex-1 space-y-1">
									<div className="flex items-center space-x-3">
										<h3 className="font-semibold">{business.name}</h3>
										{getStatusBadge(business.status)}
										{getSubscriptionBadge(business.subscription)}
										{business.verified && (
											<Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
												<CheckCircle className="w-3 h-3 mr-1" />
												Verified
											</Badge>
										)}
									</div>
									<div className="flex items-center space-x-4 text-sm text-muted-foreground">
										<span className="flex items-center">
											<Building2 className="w-3 h-3 mr-1" />
											{business.category}
										</span>
										{business.address && (
											<span className="flex items-center">
												<MapPin className="w-3 h-3 mr-1" />
												{business.address}
											</span>
										)}
										{business.phone && (
											<span className="flex items-center">
												<Phone className="w-3 h-3 mr-1" />
												{business.phone}
											</span>
										)}
										{business.rating > 0 && (
											<span className="flex items-center">
												<Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
												{business.rating} ({business.reviews} reviews)
											</span>
										)}
									</div>
									<div className="flex items-center space-x-4 text-xs text-muted-foreground">
										<span>Joined: {new Date(business.joinDate).toLocaleDateString()}</span>
										{business.lastPayment && <span>Last Payment: {new Date(business.lastPayment).toLocaleDateString()}</span>}
										<span className="font-medium text-green-600">${business.monthlyFee}/month</span>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									{business.status === "pending" && (
										<Button variant="outline" size="sm" onClick={() => sendInvitation(business)}>
											<Send className="w-4 h-4 mr-2" />
											Resend Invite
										</Button>
									)}
									<Button variant="outline" size="sm" onClick={() => copyInviteLink(business.id)}>
										<Copy className="w-4 h-4 mr-2" />
										Copy Link
									</Button>
									{business.website && (
										<Button variant="outline" size="sm" asChild>
											<a href={business.website.startsWith("http") ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer">
												<ExternalLink className="w-4 h-4 mr-2" />
												Visit
											</a>
										</Button>
									)}
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm">
												<MoreVertical className="w-4 h-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>
												<Edit className="w-4 h-4 mr-2" />
												Edit Business
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Mail className="w-4 h-4 mr-2" />
												Contact Business
											</DropdownMenuItem>
											{business.status === "overdue" && (
												<DropdownMenuItem>
													<AlertTriangle className="w-4 h-4 mr-2" />
													Send Payment Reminder
												</DropdownMenuItem>
											)}
											<DropdownMenuItem className="text-red-600">
												<Trash2 className="w-4 h-4 mr-2" />
												Remove Business
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
