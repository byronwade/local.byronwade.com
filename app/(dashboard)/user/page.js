"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import useAuthStore from "@store/useAuthStore";

import { Activity, Briefcase, ChevronDown, DollarSign, Gift, Settings, Star, TrendingUp, HelpCircle } from "lucide-react";

const dashboardItems = [
	{
		href: "/user/activity",
		icon: <Activity className="w-6 h-6" />,
		title: "My Activity",
		description: "See your latest activity and interactions.",
	},
	{
		href: "/user/jobs",
		icon: <Briefcase className="w-6 h-6" />,
		title: "My Jobs",
		description: "Manage your job postings and applications.",
	},
	{
		href: "/user/billing",
		icon: <DollarSign className="w-6 h-6" />,
		title: "Billing",
		description: "View your billing history and manage payment methods.",
	},
	{
		href: "/user/boosts",
		icon: <TrendingUp className="w-6 h-6" />,
		title: "Boosts",
		description: "Manage your boosts and see their performance.",
	},
	{
		href: "/user/pro",
		icon: <Star className="w-6 h-6" />,
		title: "Pro Account",
		description: "Upgrade to a Pro account for more features.",
	},
	{
		href: "/user/referral",
		icon: <Gift className="w-6 h-6" />,
		title: "Referrals",
		description: "Refer friends and earn rewards.",
	},
	{
		href: "/user/settings",
		icon: <Settings className="w-6 h-6" />,
		title: "Settings",
		description: "Manage your account settings.",
	},
	{
		href: "/user/support",
		icon: <HelpCircle className="w-6 h-6" />,
		title: "Support",
		description: "Get help and support.",
	},
];

export default function Dashboard() {
	const { user } = useAuthStore();
	return (
		<div className="w-full mx-auto my-16 space-y-8">
			<div className="flex items-center justify-between">
				<h1 className="text-4xl">Hi {user?.user_metadata.first_name || "there"}!</h1>
				<div className="flex items-center gap-x-3">
					<Button asChild variant="outline" size="sm">
						<Link href="/claim-a-business">Claim a Business</Link>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								Add new... <ChevronDown className="w-4 h-4 ml-2" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Link href="/user/jobs/new">New Job</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link href="/add-a-business">New Business</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<p className="text-muted-foreground">Welcome to your dashboard. Here's a quick overview of your account.</p>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{dashboardItems.map((item) => (
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
