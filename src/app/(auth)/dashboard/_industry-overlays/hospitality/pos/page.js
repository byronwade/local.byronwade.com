"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { ShoppingCart, CreditCard, Receipt, TrendingUp, Users, DollarSign, Clock, Star, Plus, Search, Filter, Coffee, Utensils, Wine, Cake } from "lucide-react";
import { cn } from "@lib/utils";

/**
 * Hospitality Point of Sale (POS) Module
 * Industry-specific POS system for restaurants and hospitality businesses
 */
export default function HospitalityPOSModule({ industryType, pathname, params }) {
	const [activeTab, setActiveTab] = useState("orders");
	const [searchTerm, setSearchTerm] = useState("");

	// Sample data - in real app, this would come from API
	const posData = {
		overview: {
			todaysSales: 8420,
			ordersToday: 156,
			averageOrderValue: 54,
			busyHours: "12:00 PM - 2:00 PM",
			topSellingItem: "Signature Burger",
			customerSatisfaction: 4.8,
		},
		orders: [
			{
				id: "ORD-001",
				table: "Table 12",
				customer: "John Smith",
				items: [
					{ name: "Signature Burger", price: 18.99, quantity: 2 },
					{ name: "Caesar Salad", price: 12.99, quantity: 1 },
					{ name: "Craft Beer", price: 6.99, quantity: 2 },
				],
				total: 64.95,
				status: "preparing",
				orderTime: "12:30 PM",
				server: "Sarah J.",
				paymentMethod: "Credit Card",
				specialRequests: "No onions on burger",
			},
			{
				id: "ORD-002",
				table: "Table 5",
				customer: "Emily Davis",
				items: [
					{ name: "Grilled Salmon", price: 24.99, quantity: 1 },
					{ name: "House Wine", price: 8.99, quantity: 1 },
					{ name: "Chocolate Cake", price: 7.99, quantity: 1 },
				],
				total: 41.97,
				status: "ready",
				orderTime: "12:45 PM",
				server: "Mike R.",
				paymentMethod: "Cash",
				specialRequests: "Extra lemon with salmon",
			},
			{
				id: "ORD-003",
				table: "Takeout",
				customer: "Alex Johnson",
				items: [
					{ name: "Pepperoni Pizza", price: 16.99, quantity: 1 },
					{ name: "Garlic Bread", price: 5.99, quantity: 1 },
					{ name: "Soda", price: 2.99, quantity: 2 },
				],
				total: 28.96,
				status: "completed",
				orderTime: "12:15 PM",
				server: "Lisa M.",
				paymentMethod: "Credit Card",
				specialRequests: "Extra cheese",
			},
		],
		menuItems: [
			{ id: 1, name: "Signature Burger", category: "Mains", price: 18.99, salesCount: 45, icon: Utensils },
			{ id: 2, name: "Grilled Salmon", category: "Mains", price: 24.99, salesCount: 32, icon: Utensils },
			{ id: 3, name: "Caesar Salad", category: "Salads", price: 12.99, salesCount: 28, icon: Utensils },
			{ id: 4, name: "Craft Beer", category: "Beverages", price: 6.99, salesCount: 67, icon: Wine },
			{ id: 5, name: "Espresso", category: "Beverages", price: 3.99, salesCount: 89, icon: Coffee },
			{ id: 6, name: "Chocolate Cake", category: "Desserts", price: 7.99, salesCount: 21, icon: Cake },
		],
		dailySales: [
			{ hour: "9 AM", sales: 320 },
			{ hour: "10 AM", sales: 450 },
			{ hour: "11 AM", sales: 620 },
			{ hour: "12 PM", sales: 1240 },
			{ hour: "1 PM", sales: 1580 },
			{ hour: "2 PM", sales: 1320 },
			{ hour: "3 PM", sales: 890 },
			{ hour: "4 PM", sales: 650 },
			{ hour: "5 PM", sales: 980 },
			{ hour: "6 PM", sales: 1360 },
		],
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "preparing":
				return "bg-yellow-100 text-yellow-800";
			case "ready":
				return "bg-green-100 text-green-800";
			case "completed":
				return "bg-blue-100 text-blue-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "preparing":
				return Clock;
			case "ready":
				return Receipt;
			case "completed":
				return CreditCard;
			default:
				return ShoppingCart;
		}
	};

	const filteredOrders = posData.orders.filter((order) => order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.table.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Point of Sale</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">Manage orders, track sales, and monitor restaurant performance</p>
				</div>
				<div className="flex space-x-2">
					<Button variant="outline" size="sm">
						<Receipt className="h-4 w-4 mr-2" />
						Print Reports
					</Button>
					<Button size="sm">
						<Plus className="h-4 w-4 mr-2" />
						New Order
					</Button>
				</div>
			</div>

			{/* POS Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
						<DollarSign className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">{formatCurrency(posData.overview.todaysSales)}</div>
						<p className="text-xs text-muted-foreground">+12% from yesterday</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Orders Today</CardTitle>
						<ShoppingCart className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{posData.overview.ordersToday}</div>
						<p className="text-xs text-muted-foreground">Avg: {formatCurrency(posData.overview.averageOrderValue)}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
						<Star className="h-4 w-4 text-yellow-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">{posData.overview.customerSatisfaction}/5</div>
						<p className="text-xs text-muted-foreground">Based on reviews</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
						<Clock className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-lg font-bold text-purple-600">{posData.overview.busyHours}</div>
						<p className="text-xs text-muted-foreground">Busiest time today</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Top Seller</CardTitle>
						<TrendingUp className="h-4 w-4 text-orange-600" />
					</CardHeader>
					<CardContent>
						<div className="text-sm font-bold text-orange-600">{posData.overview.topSellingItem}</div>
						<p className="text-xs text-muted-foreground">Most popular today</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="orders">Active Orders</TabsTrigger>
					<TabsTrigger value="menu">Menu Items</TabsTrigger>
					<TabsTrigger value="sales">Sales Analytics</TabsTrigger>
					<TabsTrigger value="reports">Daily Reports</TabsTrigger>
				</TabsList>

				<TabsContent value="orders" className="space-y-4">
					{/* Search and Filter */}
					<Card>
						<CardContent className="p-6">
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input placeholder="Search orders by ID, customer, or table..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
								</div>
								<Button variant="outline">
									<Filter className="h-4 w-4 mr-2" />
									Filter Orders
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Active Orders */}
					<div className="grid gap-4">
						{filteredOrders.map((order) => {
							const StatusIcon = getStatusIcon(order.status);
							return (
								<Card key={order.id} className="hover:shadow-md transition-shadow">
									<CardContent className="p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center space-x-3">
												<div className={cn("h-10 w-10 rounded-full flex items-center justify-center", getStatusColor(order.status))}>
													<StatusIcon className="h-5 w-5" />
												</div>
												<div>
													<h3 className="text-lg font-semibold">{order.id}</h3>
													<p className="text-sm text-muted-foreground">
														{order.table} • {order.customer} • {order.orderTime}
													</p>
												</div>
											</div>
											<div className="text-right">
												<Badge className={cn("mb-2", getStatusColor(order.status))}>{order.status}</Badge>
												<p className="text-xl font-semibold text-green-600">{formatCurrency(order.total)}</p>
											</div>
										</div>

										{/* Order Items */}
										<div className="space-y-2 mb-4">
											{order.items.map((item, index) => (
												<div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
													<div>
														<span className="font-medium">
															{item.quantity}x {item.name}
														</span>
													</div>
													<span className="text-green-600 font-medium">{formatCurrency(item.price * item.quantity)}</span>
												</div>
											))}
										</div>

										{/* Order Details */}
										<div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
											<span>Server: {order.server}</span>
											<span>Payment: {order.paymentMethod}</span>
											{order.specialRequests && <span>Note: {order.specialRequests}</span>}
										</div>

										{/* Action Buttons */}
										<div className="flex space-x-2">
											{order.status === "preparing" && <Button size="sm">Mark Ready</Button>}
											{order.status === "ready" && <Button size="sm">Mark Served</Button>}
											<Button size="sm" variant="outline">
												View Details
											</Button>
											<Button size="sm" variant="outline">
												Print Receipt
											</Button>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{filteredOrders.length === 0 && (
						<Card>
							<CardContent className="p-12 text-center">
								<ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
								<p className="text-gray-500 dark:text-gray-400">{searchTerm ? "Try adjusting your search terms." : "New orders will appear here."}</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="menu" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Menu Performance</CardTitle>
							<CardDescription>Track popular items and sales performance</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4">
								{posData.menuItems.map((item) => {
									const IconComponent = item.icon;
									return (
										<div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
											<div className="flex items-center space-x-4">
												<div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
													<IconComponent className="h-5 w-5" />
												</div>
												<div>
													<p className="font-medium">{item.name}</p>
													<p className="text-sm text-muted-foreground">{item.category}</p>
												</div>
											</div>
											<div className="text-right">
												<p className="font-medium">{formatCurrency(item.price)}</p>
												<p className="text-sm text-muted-foreground">{item.salesCount} sold today</p>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="sales" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Sales Throughout the Day</CardTitle>
							<CardDescription>Hourly sales breakdown</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
								<div className="text-center">
									<TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
									<p className="text-gray-500">Sales chart coming soon</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Category Performance</CardTitle>
								<CardDescription>Sales by menu category</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{["Mains", "Beverages", "Desserts", "Salads"].map((category, index) => (
										<div key={category} className="flex justify-between items-center">
											<span className="font-medium">{category}</span>
											<span className="text-green-600">{formatCurrency(1200 - index * 200)}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Payment Methods</CardTitle>
								<CardDescription>Payment method breakdown</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="font-medium">Credit Card</span>
										<span className="text-blue-600">65%</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium">Cash</span>
										<span className="text-green-600">25%</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium">Mobile Pay</span>
										<span className="text-purple-600">10%</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="reports" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card className="cursor-pointer hover:shadow-md transition-shadow">
							<CardHeader>
								<CardTitle className="flex items-center">
									<Receipt className="h-5 w-5 mr-2" />
									Daily Sales Report
								</CardTitle>
								<CardDescription>Complete day's sales summary</CardDescription>
							</CardHeader>
							<CardContent>
								<Button variant="outline" className="w-full">
									Generate Report
								</Button>
							</CardContent>
						</Card>

						<Card className="cursor-pointer hover:shadow-md transition-shadow">
							<CardHeader>
								<CardTitle className="flex items-center">
									<Users className="h-5 w-5 mr-2" />
									Staff Performance
								</CardTitle>
								<CardDescription>Server and staff metrics</CardDescription>
							</CardHeader>
							<CardContent>
								<Button variant="outline" className="w-full">
									View Performance
								</Button>
							</CardContent>
						</Card>

						<Card className="cursor-pointer hover:shadow-md transition-shadow">
							<CardHeader>
								<CardTitle className="flex items-center">
									<TrendingUp className="h-5 w-5 mr-2" />
									Menu Analytics
								</CardTitle>
								<CardDescription>Item popularity and profitability</CardDescription>
							</CardHeader>
							<CardContent>
								<Button variant="outline" className="w-full">
									Analyze Menu
								</Button>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
