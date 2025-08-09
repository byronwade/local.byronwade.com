/**
 * User Dashboard Quick Actions Section
 * Extracted from monolithic user dashboard page
 * Displays quick action buttons for common user tasks
 */

"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Briefcase, Star, Building2, Gift, Plus, ArrowRight } from "lucide-react";

const QuickActionsSection = () => {
	// Quick Actions Data
	const quickActions = [
		{
			title: "Apply for Jobs",
			description: "Browse and apply for available positions",
			icon: Briefcase,
			link: "/dashboard/user/jobs",
			color: "bg-blue-500 hover:bg-blue-600",
		},
		{
			title: "Write a Review",
			description: "Share your experience with local businesses",
			icon: Star,
			link: "/dashboard/user/reviews",
			color: "bg-yellow-500 hover:bg-yellow-600",
		},
		{
			title: "Claim a Business",
			description: "Claim ownership of your business listing",
			icon: Building2,
			link: "/claim-a-business",
			color: "bg-green-500 hover:bg-green-600",
		},
		{
			title: "Refer Friends",
			description: "Invite friends and earn rewards",
			icon: Gift,
			link: "/dashboard/user/referral",
			color: "bg-purple-500 hover:bg-purple-600",
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Plus className="h-5 w-5" />
					Quick Actions
				</CardTitle>
				<CardDescription>Get things done quickly with these common actions</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 md:grid-cols-2">
					{quickActions.map((action, index) => {
						const IconComponent = action.icon;

						return (
							<Link key={index} href={action.link}>
								<div className="group relative overflow-hidden rounded-lg border p-6 hover:shadow-md transition-all duration-200">
									<div className="flex items-start gap-4">
										<div className={`p-3 rounded-lg text-white ${action.color}`}>
											<IconComponent className="h-6 w-6" />
										</div>
										<div className="flex-1">
											<h3 className="font-semibold group-hover:text-primary transition-colors">{action.title}</h3>
											<p className="text-sm text-muted-foreground mt-1">{action.description}</p>
										</div>
										<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
									</div>
								</div>
							</Link>
						);
					})}
				</div>

				<div className="mt-6 pt-6 border-t">
					<div className="text-center">
						<p className="text-sm text-muted-foreground mb-3">Need help getting started?</p>
						<Link href="/help">
							<Button variant="outline">
								View Help Center
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default QuickActionsSection;
