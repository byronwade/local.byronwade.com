"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Users, Settings, LifeBuoy, BarChart2, Crown, FileText, ShoppingCart } from "lucide-react";

const adminItems = [
	{
		href: "/dashboard/admin/users",
		icon: <Users className="w-6 h-6" />,
		title: "Users",
		description: "Manage all registered users.",
	},
	{
		href: "/admin/customers",
		icon: <ShoppingCart className="w-6 h-6" />,
		title: "Customers",
		description: "View and manage customer information.",
	},
	{
		href: "/admin/pro-accounts",
		icon: <Crown className="w-6 h-6" />,
		title: "Pro Accounts",
		description: "Manage pro accounts and subscriptions.",
	},
	{
		href: "/admin/billing",
		icon: <FileText className="w-6 h-6" />,
		title: "Billing",
		description: "View and manage billing information.",
	},
	{
		href: "/admin/reports",
		icon: <BarChart2 className="w-6 h-6" />,
		title: "Reports",
		description: "Generate and view reports.",
	},
	{
		href: "/admin/support",
		icon: <LifeBuoy className="w-6 h-6" />,
		title: "Support",
		description: "Manage support tickets.",
	},
	{
		href: "/admin/settings",
		icon: <Settings className="w-6 h-6" />,
		title: "Settings",
		description: "Configure application settings.",
	},
];

export default function Admin() {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<h1 className="text-4xl">Admin Dashboard</h1>
			</div>
			<p className="text-muted-foreground">Welcome to the admin dashboard. Manage your application from here.</p>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{adminItems.map((item) => (
					<Link href={item.href} key={item.href}>
						<Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary">
							<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
								<CardTitle className="text-sm font-medium">{item.title}</CardTitle>
								{item.icon}
							</CardHeader>
							<CardContent>
								<p className="text-xs text-muted-foreground">{item.description}</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}

