"use client";

import React from "react";
import { IntegrationVisibility } from "@components/dashboard/business/integrations/IntegrationVisibility";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Receipt, TrendingUp, Users, DollarSign } from "lucide-react";

// Simple POS module implementation until the full module is created
function HospitalityPOSModule() {
	const posStats = [
		{ label: "Today's Sales", value: "$2,847", icon: DollarSign },
		{ label: "Orders", value: "156", icon: Receipt },
		{ label: "Customers", value: "89", icon: Users },
		{ label: "Growth", value: "+12%", icon: TrendingUp },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">POS System</CardTitle>
				<CardDescription>Restaurant point-of-sale dashboard</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-3">
					{posStats.map((stat, index) => {
						const IconComponent = stat.icon;
						return (
							<div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
								<IconComponent className="w-4 h-4 text-muted-foreground" />
								<div>
									<p className="text-xs text-muted-foreground">{stat.label}</p>
									<p className="text-sm font-semibold">{stat.value}</p>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

export default function HospitalityPOSWidget() {
	return (
		<IntegrationVisibility featureKey="pos_system">
			<HospitalityPOSModule />
		</IntegrationVisibility>
	);
}
