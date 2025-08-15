"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Users, Search, Phone, Mail, Calendar, Star, TrendingUp, Plus, Filter, User, Settings, Clock } from "lucide-react";
import { cn } from "@lib/utils";

/**
 * Universal Employee Management Module
 * Core employee features available to all industries with customizations
 */
export default function EmployeesModule() {
	const [activeTab, setActiveTab] = useState("overview");
	const [searchTerm, setSearchTerm] = useState("");

	// Sample data - in real app, this would come from API
	const employeeData = {
		overview: {
			totalEmployees: 12,
			activeEmployees: 11,
			newThisMonth: 2,
			averageTenure: 2.3,
			satisfactionScore: 4.2,
			hourlyRate: 25.5,
		},
		employees: [
			{
				id: 1,
				name: "John Smith",
				email: "john.smith@company.com",
				phone: "(555) 123-4567",
				role: "Senior Technician",
				department: "Field Operations",
				hireDate: "2022-03-15",
				status: "active",
				rating: 4.8,
				hourlyRate: 32.0,
				skills: ["Plumbing", "HVAC", "Electrical"],
				certifications: ["Licensed Plumber", "HVAC Certified"],
			},
			{
				id: 2,
				name: "Sarah Johnson",
				email: "sarah.johnson@company.com",
				phone: "(555) 987-6543",
				role: "Project Manager",
				department: "Operations",
				hireDate: "2021-08-10",
				status: "active",
				rating: 4.9,
				hourlyRate: 35.0,
				skills: ["Project Management", "Customer Service", "Scheduling"],
				certifications: ["PMP", "Customer Service"],
			},
			{
				id: 3,
				name: "Mike Wilson",
				email: "mike.wilson@company.com",
				phone: "(555) 456-7890",
				role: "Junior Technician",
				department: "Field Operations",
				hireDate: "2023-11-01",
				status: "training",
				rating: 4.2,
				hourlyRate: 22.0,
				skills: ["Basic Repair", "Customer Service"],
				certifications: ["Safety Training"],
			},
			{
				id: 4,
				name: "Emily Davis",
				email: "emily.davis@company.com",
				phone: "(555) 321-0987",
				role: "Office Manager",
				department: "Administration",
				hireDate: "2020-01-15",
				status: "active",
				rating: 4.6,
				hourlyRate: 28.0,
				skills: ["Administration", "Bookkeeping", "Customer Service"],
				certifications: ["QuickBooks", "Office Management"],
			},
		],
		recentActivity: [
			{ id: 1, employee: "John Smith", action: "Completed safety training", date: "2024-01-15", type: "training" },
			{ id: 2, employee: "Sarah Johnson", action: "Performance review scheduled", date: "2024-01-14", type: "review" },
			{ id: 3, employee: "Mike Wilson", action: "Started apprenticeship program", date: "2024-01-13", type: "training" },
			{ id: 4, employee: "Emily Davis", action: "Promoted to senior role", date: "2024-01-12", type: "promotion" },
		],
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString();
	};

	const getTenure = (hireDate) => {
		const hire = new Date(hireDate);
		const now = new Date();
		const years = (now - hire) / (1000 * 60 * 60 * 24 * 365);
		return `${years.toFixed(1)} years`;
	};

	const filteredEmployees = employeeData.employees.filter((employee) => 
		employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
		employee.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
		employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
		employee.department.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="container mx-auto space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">Manage your team, track performance, and handle HR operations</p>
				</div>
				<div className="flex space-x-2">
					<Button variant="outline" size="sm">
						<Filter className="h-4 w-4 mr-2" />
						Filters
					</Button>
					<Button size="sm">
						<Plus className="h-4 w-4 mr-2" />
						Add Employee
					</Button>
				</div>
			</div>

			{/* Employee Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Employees</CardTitle>
						<Users className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{employeeData.overview.totalEmployees}</div>
						<p className="text-xs text-muted-foreground">{employeeData.overview.activeEmployees} active</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">New This Month</CardTitle>
						<TrendingUp className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">+{employeeData.overview.newThisMonth}</div>
						<p className="text-xs text-muted-foreground">Growth rate</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Avg Tenure</CardTitle>
						<Calendar className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">{employeeData.overview.averageTenure} yrs</div>
						<p className="text-xs text-muted-foreground">Team experience</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
						<Star className="h-4 w-4 text-yellow-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">{employeeData.overview.satisfactionScore}/5</div>
						<p className="text-xs text-muted-foreground">Employee rating</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="employees">All Employees</TabsTrigger>
					<TabsTrigger value="activity">Recent Activity</TabsTrigger>
					<TabsTrigger value="performance">Performance</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						{/* Top Performers */}
						<Card>
							<CardHeader>
								<CardTitle>Top Performers</CardTitle>
								<CardDescription>Employees by rating</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{employeeData.employees
										.sort((a, b) => b.rating - a.rating)
										.slice(0, 5)
										.map((employee) => (
											<div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
												<div className="flex items-center space-x-3">
													<div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
														<User className="h-4 w-4" />
													</div>
													<div>
														<p className="font-medium">{employee.name}</p>
														<p className="text-sm text-muted-foreground">{employee.role}</p>
													</div>
												</div>
												<div className="text-right">
													<div className="flex items-center">
														<Star className="h-4 w-4 text-yellow-500 mr-1" />
														<span className="font-medium">{employee.rating}</span>
													</div>
													<p className="text-sm text-muted-foreground">{formatCurrency(employee.hourlyRate)}/hr</p>
												</div>
											</div>
										))}
								</div>
							</CardContent>
						</Card>

						{/* Recent Activity */}
						<Card>
							<CardHeader>
								<CardTitle>Recent Activity</CardTitle>
								<CardDescription>Latest employee updates</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{employeeData.recentActivity.map((activity) => (
										<div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
											<div className={cn("h-8 w-8 rounded-full flex items-center justify-center", 
												activity.type === "training" && "bg-blue-100 text-blue-600",
												activity.type === "review" && "bg-yellow-100 text-yellow-600",
												activity.type === "promotion" && "bg-green-100 text-green-600"
											)}>
												{activity.type === "training" && <Settings className="h-4 w-4" />}
												{activity.type === "review" && <Clock className="h-4 w-4" />}
												{activity.type === "promotion" && <TrendingUp className="h-4 w-4" />}
											</div>
											<div className="flex-1">
												<p className="font-medium text-sm">{activity.employee}</p>
												<p className="text-xs text-muted-foreground">{activity.action}</p>
											</div>
											<span className="text-xs text-muted-foreground">{activity.date}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="employees" className="space-y-4">
					{/* Search and Filters */}
					<Card>
						<CardContent className="p-6">
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input 
										placeholder="Search employees by name, role, or department..." 
										value={searchTerm} 
										onChange={(e) => setSearchTerm(e.target.value)} 
										className="pl-10" 
									/>
								</div>
								<Button variant="outline">
									<Filter className="h-4 w-4 mr-2" />
									Filters
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Employee List */}
					<Card>
						<CardHeader>
							<CardTitle>All Employees</CardTitle>
							<CardDescription>Complete employee directory</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{filteredEmployees.map((employee) => (
									<div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
										<div className="flex items-center space-x-4">
											<div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
												<User className="h-6 w-6" />
											</div>
											<div>
												<div className="flex items-center space-x-2">
													<p className="font-medium text-lg">{employee.name}</p>
													<Badge variant={employee.status === "active" ? "default" : "secondary"}>{employee.status}</Badge>
												</div>
												<p className="text-sm text-muted-foreground">{employee.role} • {employee.department}</p>
												<div className="flex items-center space-x-4 text-sm text-muted-foreground">
													<span className="flex items-center">
														<Mail className="h-3 w-3 mr-1" />
														{employee.email}
													</span>
													<span className="flex items-center">
														<Phone className="h-3 w-3 mr-1" />
														{employee.phone}
													</span>
												</div>
												<div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
													<span>Hired: {formatDate(employee.hireDate)}</span>
													<span>Tenure: {getTenure(employee.hireDate)}</span>
												</div>
											</div>
										</div>
										<div className="text-right">
											<div className="flex items-center space-x-1 mb-1">
												<Star className="h-4 w-4 text-yellow-500" />
												<span className="font-medium">{employee.rating}</span>
											</div>
											<p className="text-lg font-semibold text-green-600">{formatCurrency(employee.hourlyRate)}/hr</p>
											<p className="text-sm text-muted-foreground">{employee.skills.length} skills</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="activity" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Employee Activity Timeline</CardTitle>
							<CardDescription>Detailed employee activity history</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{employeeData.recentActivity.map((activity) => (
									<div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
										<div className={cn("h-10 w-10 rounded-full flex items-center justify-center mt-1", 
											activity.type === "training" && "bg-blue-100 text-blue-600",
											activity.type === "review" && "bg-yellow-100 text-yellow-600",
											activity.type === "promotion" && "bg-green-100 text-green-600"
										)}>
											{activity.type === "training" && <Settings className="h-5 w-5" />}
											{activity.type === "review" && <Clock className="h-5 w-5" />}
											{activity.type === "promotion" && <TrendingUp className="h-5 w-5" />}
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<p className="font-medium">{activity.employee}</p>
												<span className="text-sm text-muted-foreground">{activity.date}</span>
											</div>
											<p className="text-sm text-muted-foreground mt-1">{activity.action}</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="performance" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Performance Metrics</CardTitle>
								<CardDescription>Employee performance overview</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{employeeData.employees.map((employee) => (
										<div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
											<div className="flex items-center space-x-3">
												<div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
													<User className="h-4 w-4" />
												</div>
												<div>
													<p className="font-medium">{employee.name}</p>
													<p className="text-sm text-muted-foreground">{employee.role}</p>
												</div>
											</div>
											<div className="text-right">
												<div className="flex items-center space-x-1">
													<Star className="h-4 w-4 text-yellow-500" />
													<span className="font-medium">{employee.rating}</span>
												</div>
												<p className="text-sm text-muted-foreground">{employee.certifications.length} certs</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Skills Distribution</CardTitle>
								<CardDescription>Team skills overview</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
									<div className="text-center">
										<TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
										<p className="text-gray-500">Skills chart coming soon</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
