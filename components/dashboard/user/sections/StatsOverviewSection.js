/**
 * User Dashboard Stats Overview Section
 * Extracted from monolithic user dashboard page
 * Displays key metrics and statistics for user activity
 */

"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Star, Eye, Gift } from "lucide-react";

const StatsOverviewSection = ({ user, stats }) => {
	// Use stats from API if available, otherwise fall back to defaults
	const dashboardStats = stats
		? [
				{
					title: "Profile Views",
					value: stats.profileViews?.value || "0",
					change: stats.profileViews?.change || "0%",
					trend: stats.profileViews?.trend || "up",
					icon: Eye,
					description: stats.profileViews?.description || "Total views this month",
				},
				{
					title: "Job Applications",
					value: stats.jobApplications?.value || "0",
					change: stats.jobApplications?.change || "0",
					trend: stats.jobApplications?.trend || "up",
					icon: Briefcase,
					description: stats.jobApplications?.description || "Applications this month",
				},
				{
					title: "Reviews Written",
					value: stats.reviewsWritten?.value || "0",
					change: stats.reviewsWritten?.change || "0",
					trend: stats.reviewsWritten?.trend || "up",
					icon: Star,
					description: stats.reviewsWritten?.description || "Total reviews submitted",
				},
				{
					title: "Earnings",
					value: stats.earnings?.value || "$0.00",
					change: stats.earnings?.change || "$0.00",
					trend: stats.earnings?.trend || "up",
					icon: DollarSign,
					description: stats.earnings?.description || "Referral earnings",
				},
			]
		: [
				{
					title: "Profile Views",
					value: "0",
					change: "0%",
					trend: "up",
					icon: Eye,
					description: "Total views this month",
				},
				{
					title: "Job Applications",
					value: "0",
					change: "0",
					trend: "up",
					icon: Briefcase,
					description: "Applications this month",
				},
				{
					title: "Reviews Written",
					value: "0",
					change: "0",
					trend: "up",
					icon: Star,
					description: "Total reviews submitted",
				},
				{
					title: "Earnings",
					value: "$0.00",
					change: "$0.00",
					trend: "up",
					icon: DollarSign,
					description: "Referral earnings",
				},
			];

	const getIconColor = (trend) => {
		return trend === "up" ? "text-green-600" : "text-red-600";
	};

	const getTrendIcon = (trend) => {
		return trend === "up" ? TrendingUp : TrendingDown;
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Overview</h2>
				<p className="text-muted-foreground">Your activity and performance metrics</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{dashboardStats.map((stat, index) => {
					const IconComponent = stat.icon;
					const TrendIcon = getTrendIcon(stat.trend);

					return (
						<Card key={index}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
								<IconComponent className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
								<div className="flex items-center text-xs text-muted-foreground">
									<TrendIcon className={`mr-1 h-3 w-3 ${getIconColor(stat.trend)}`} />
									<span className={getIconColor(stat.trend)}>{stat.change}</span>
									<span className="ml-1">from last month</span>
								</div>
								<p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Profile Completion Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Gift className="h-5 w-5" />
						Complete Your Profile
					</CardTitle>
					<CardDescription>Complete your profile to get more visibility and better job matches</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between text-sm">
							<span>Profile completion</span>
							<span className="font-medium">75%</span>
						</div>
						<Progress value={75} className="h-2" />
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary">✓ Basic info</Badge>
							<Badge variant="secondary">✓ Contact details</Badge>
							<Badge variant="secondary">✓ Work experience</Badge>
							<Badge variant="outline">Add skills</Badge>
							<Badge variant="outline">Upload resume</Badge>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default StatsOverviewSection;
