/**
 * User Dashboard Recent Activity Section
 * Extracted from monolithic user dashboard page
 * Displays recent user activity and actions
 */

"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Briefcase, Star, Gift, Eye, TrendingUp, ChevronRight } from "lucide-react";

const RecentActivitySection = ({ activities }) => {
	// Recent Activity Data - use API data if available, fallback to mock data
	const mockActivity = [
		{
			id: 1,
			type: "job",
			title: "Applied to Plumber position at Wade's Plumbing",
			description: "Your application has been submitted and is under review",
			time: "2 hours ago",
			icon: Briefcase,
			iconColor: "text-blue-500",
			action: "View Application",
			actionLink: "/dashboard/user/jobs",
		},
		{
			id: 2,
			type: "review",
			title: "Wrote a 5-star review for Local Coffee Shop",
			description: "Your review has been published and is visible to others",
			time: "1 day ago",
			icon: Star,
			iconColor: "text-yellow-500",
			action: "View Review",
			actionLink: "/dashboard/user/reviews",
		},
		{
			id: 3,
			type: "referral",
			title: "Earned $12 from referral bonus",
			description: "Your friend signed up using your referral link",
			time: "2 days ago",
			icon: Gift,
			iconColor: "text-green-500",
			action: "View Earnings",
			actionLink: "/dashboard/user/referral",
		},
		{
			id: 4,
			type: "profile",
			title: "Profile viewed by Downtown Dentistry",
			description: "A business viewed your profile and contact information",
			time: "3 days ago",
			icon: Eye,
			iconColor: "text-purple-500",
			action: "View Profile",
			actionLink: "/dashboard/user/settings",
		},
		{
			id: 5,
			type: "boost",
			title: "Job application boosted",
			description: "Your application was boosted and is now more visible",
			time: "4 days ago",
			icon: TrendingUp,
			iconColor: "text-orange-500",
			action: "Manage Boosts",
			actionLink: "/dashboard/user/boosts",
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
				<CardDescription>Your latest actions and interactions on the platform</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{recentActivity.map((activity) => {
					const IconComponent = activity.icon;

					return (
						<div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
							<div className={`p-2 rounded-full bg-background border ${activity.iconColor}`}>
								<IconComponent className="h-4 w-4" />
							</div>

							<div className="flex-1 space-y-1">
								<div className="flex items-center justify-between">
									<h4 className="text-sm font-medium leading-none">{activity.title}</h4>
									<time className="text-xs text-muted-foreground">{activity.time}</time>
								</div>
								<p className="text-sm text-muted-foreground">{activity.description}</p>
								<Link href={activity.actionLink}>
									<Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
										{activity.action}
										<ChevronRight className="ml-1 h-3 w-3" />
									</Button>
								</Link>
							</div>
						</div>
					);
				})}

				<div className="pt-4 border-t">
					<Link href="/dashboard/user/activity">
						<Button variant="outline" className="w-full">
							View All Activity
							<ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
};

export default RecentActivitySection;
