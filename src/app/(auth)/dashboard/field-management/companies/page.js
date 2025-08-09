"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { Separator } from "@components/ui/separator";
import { Building2, Plus, Edit, Trash2, MoreHorizontal, Eye, Settings, CreditCard, MapPin, Star, DollarSign, Target, Briefcase, Globe, Phone, Mail, ExternalLink, Search, SortAsc, SortDesc, Coffee, Car, Wrench } from "lucide-react";

// Mock data for companies
const mockCompanies = [
	{
		id: "1",
		name: "Wade's Plumbing & Septic",
		industry: "Plumbing Services",
		status: "active",
		subscription: "Pro",
		location: "Raleigh, NC",
		address: "123 Main Street, Raleigh, NC 27601",
		phone: "(555) 123-4567",
		email: "info@wadesplumbing.com",
		website: "https://wadesplumbing.com",
		rating: 4.8,
		reviewCount: 127,
		employees: 12,
		yearEstablished: 2008,
		monthlyRevenue: 45000,
		activeJobs: 8,
		activeAds: 3,
		lastActivity: "2 hours ago",
		logo: "/placeholder.svg",
		description: "Family-owned plumbing and septic service company serving the local community for over 15 years.",
	},
	{
		id: "2",
		name: "Downtown Coffee Co.",
		industry: "Food & Beverage",
		status: "active",
		subscription: "Basic",
		location: "Raleigh, NC",
		address: "456 Oak Avenue, Raleigh, NC 27602",
		phone: "(555) 987-6543",
		email: "hello@downtowncoffee.com",
		website: "https://downtowncoffee.com",
		rating: 4.6,
		reviewCount: 89,
		employees: 8,
		yearEstablished: 2015,
		monthlyRevenue: 28000,
		activeJobs: 2,
		activeAds: 1,
		lastActivity: "1 day ago",
		logo: "/placeholder.svg",
		description: "Artisanal coffee shop serving locally roasted beans and fresh pastries.",
	},
	{
		id: "3",
		name: "Elite Auto Repair",
		industry: "Automotive",
		status: "active",
		subscription: "Pro",
		location: "Durham, NC",
		address: "789 Pine Street, Durham, NC 27701",
		phone: "(555) 456-7890",
		email: "service@eliteauto.com",
		website: "https://eliteauto.com",
		rating: 4.9,
		reviewCount: 203,
		employees: 15,
		yearEstablished: 2010,
		monthlyRevenue: 65000,
		activeJobs: 12,
		activeAds: 5,
		lastActivity: "30 minutes ago",
		logo: "/placeholder.svg",
		description: "Premium automotive repair and maintenance services with certified technicians.",
	},
];

export default function ManageCompanies() {
	const [companies, setCompanies] = useState(mockCompanies);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");

	React.useEffect(() => {
		document.title = "Manage Businesses - Business Dashboard - Thorbis";
	}, []);
	const [sortBy, setSortBy] = useState("name");
	const [sortOrder, setSortOrder] = useState("asc");

	// Filter and sort companies
	const filteredCompanies = companies
		.filter((company) => {
			const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.industry.toLowerCase().includes(searchTerm.toLowerCase()) || company.location.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus = filterStatus === "all" || company.status === filterStatus;
			return matchesSearch && matchesStatus;
		})
		.sort((a, b) => {
			let aValue = a[sortBy];
			let bValue = b[sortBy];

			if (sortBy === "name" || sortBy === "industry" || sortBy === "location") {
				aValue = aValue.toLowerCase();
				bValue = bValue.toLowerCase();
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

	const getStatusColor = (status) => {
		switch (status) {
			case "active":
				return "bg-green-500";
			case "inactive":
				return "bg-gray-500";
			case "suspended":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const getIndustryIcon = (industry) => {
		switch (industry.toLowerCase()) {
			case "plumbing services":
				return <Wrench className="w-4 h-4" />;
			case "food & beverage":
				return <Coffee className="w-4 h-4" />;
			case "automotive":
				return <Car className="w-4 h-4" />;
			default:
				return <Building2 className="w-4 h-4" />;
		}
	};

	return (
		<div className="w-full px-4 py-8 space-y-8 lg:px-24">
			{/* Header */}
			<div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Manage All Businesses</h1>
					<p className="text-muted-foreground">View and manage all your business locations and companies</p>
				</div>
				<div className="flex items-center space-x-2">
					<Button asChild variant="outline">
						<Link href="/add-a-business">
							<Plus className="w-4 h-4 mr-2" />
							Add New Business
						</Link>
					</Button>
					<Button asChild>
						<Link href="/claim-a-business">
							<Building2 className="w-4 h-4 mr-2" />
							Claim Business
						</Link>
					</Button>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Companies</CardTitle>
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{companies.length}</div>
						<p className="text-xs text-muted-foreground">{companies.filter((c) => c.status === "active").length} active</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${companies.reduce((sum, c) => sum + c.monthlyRevenue, 0).toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Monthly combined</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
						<Briefcase className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{companies.reduce((sum, c) => sum + c.activeJobs, 0)}</div>
						<p className="text-xs text-muted-foreground">Across all companies</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Ads</CardTitle>
						<Target className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{companies.reduce((sum, c) => sum + c.activeAds, 0)}</div>
						<p className="text-xs text-muted-foreground">Running campaigns</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card>
				<CardHeader>
					<CardTitle>Business Directory</CardTitle>
					<CardDescription>Search, filter, and manage your business locations</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input placeholder="Search companies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
						</div>
						<div className="flex items-center space-x-2">
							<select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-input rounded-md bg-background text-sm">
								<option value="all">All Status</option>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
								<option value="suspended">Suspended</option>
							</select>
							<select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-input rounded-md bg-background text-sm">
								<option value="name">Name</option>
								<option value="industry">Industry</option>
								<option value="location">Location</option>
								<option value="monthlyRevenue">Revenue</option>
								<option value="rating">Rating</option>
							</select>
							<Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
								{sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Companies Grid */}
			<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				{filteredCompanies.map((company) => (
					<Card key={company.id} className="relative group hover:shadow-lg transition-all duration-200">
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center space-x-3">
									<Avatar className="w-12 h-12">
										<AvatarImage src={company.logo} />
										<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">{getIndustryIcon(company.industry)}</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<div className="flex items-center space-x-2">
											<h3 className="font-semibold text-foreground truncate">{company.name}</h3>
											{company.subscription === "Pro" && (
												<Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">
													Pro
												</Badge>
											)}
										</div>
										<p className="text-sm text-muted-foreground">{company.industry}</p>
									</div>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
											<MoreHorizontal className="w-4 h-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem asChild>
											<Link href={`/dashboard/business/profile`}>
												<Eye className="w-4 h-4 mr-2" />
												View Profile
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href={`/dashboard/business/profile`}>
												<Edit className="w-4 h-4 mr-2" />
												Edit Business
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href={`/dashboard/business/billing`}>
												<CreditCard className="w-4 h-4 mr-2" />
												Billing & Plans
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href={`/dashboard/business/settings`}>
												<Settings className="w-4 h-4 mr-2" />
												Settings
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild className="text-red-600 focus:text-red-600">
											<Link href={`/dashboard/business/companies/delete/${company.id}`}>
												<Trash2 className="w-4 h-4 mr-2" />
												Delete Business
											</Link>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Status and Location */}
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<div className={`w-2 h-2 rounded-full ${getStatusColor(company.status)}`} />
									<span className="text-sm capitalize">{company.status}</span>
								</div>
								<div className="flex items-center space-x-1 text-sm text-muted-foreground">
									<MapPin className="w-3 h-3" />
									<span>{company.location}</span>
								</div>
							</div>

							{/* Contact Info */}
							<div className="space-y-2">
								<div className="flex items-center space-x-2 text-sm">
									<Phone className="w-3 h-3 text-muted-foreground" />
									<span>{company.phone}</span>
								</div>
								<div className="flex items-center space-x-2 text-sm">
									<Mail className="w-3 h-3 text-muted-foreground" />
									<span className="truncate">{company.email}</span>
								</div>
								{company.website && (
									<div className="flex items-center space-x-2 text-sm">
										<Globe className="w-3 h-3 text-muted-foreground" />
										<a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
											{company.website.replace(/^https?:\/\//, "")}
										</a>
									</div>
								)}
							</div>

							<Separator />

							{/* Stats */}
							<div className="grid grid-cols-3 gap-4 text-center">
								<div>
									<div className="text-lg font-semibold">{company.rating}</div>
									<div className="text-xs text-muted-foreground flex items-center justify-center">
										<Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
										{company.reviewCount} reviews
									</div>
								</div>
								<div>
									<div className="text-lg font-semibold">${company.monthlyRevenue.toLocaleString()}</div>
									<div className="text-xs text-muted-foreground">Monthly</div>
								</div>
								<div>
									<div className="text-lg font-semibold">{company.employees}</div>
									<div className="text-xs text-muted-foreground">Employees</div>
								</div>
							</div>

							{/* Quick Actions */}
							<div className="flex space-x-2">
								<Button asChild variant="outline" size="sm" className="flex-1">
									<Link href={`/dashboard/business/jobs`}>
										<Briefcase className="w-3 h-3 mr-1" />
										Jobs ({company.activeJobs})
									</Link>
								</Button>
								<Button asChild variant="outline" size="sm" className="flex-1">
									<Link href={`/dashboard/business/ads`}>
										<Target className="w-3 h-3 mr-1" />
										Ads ({company.activeAds})
									</Link>
								</Button>
							</div>

							{/* Last Activity */}
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>Last activity: {company.lastActivity}</span>
								<Button asChild variant="ghost" size="sm">
									<Link href={`/dashboard/business`}>
										<ExternalLink className="w-3 h-3" />
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Empty State */}
			{filteredCompanies.length === 0 && (
				<Card className="text-center py-12">
					<CardContent>
						<Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">No businesses found</h3>
						<p className="text-muted-foreground mb-4">{searchTerm || filterStatus !== "all" ? "Try adjusting your search or filters" : "Get started by adding your first business"}</p>
						<Button asChild>
							<Link href="/add-a-business">
								<Plus className="w-4 h-4 mr-2" />
								Add Your First Business
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
