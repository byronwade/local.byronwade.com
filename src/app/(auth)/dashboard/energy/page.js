"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { BatteryCharging, Gauge, DollarSign } from "lucide-react";

export default function EnergyDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Energy Ops</h1>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<BatteryCharging className="w-4 h-4" /> Generation
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">4.2 MW</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Gauge className="w-4 h-4" /> Capacity Factor
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">37%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<DollarSign className="w-4 h-4" /> P&L (MTD)
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">+$184k</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
