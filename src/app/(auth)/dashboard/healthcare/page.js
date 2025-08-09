"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Activity, PieChart, DollarSign } from "lucide-react";

export default function HealthcareDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Private Practice Revenue Cycle</h1>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="w-4 h-4" /> No‑show Rate
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">6.4%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<DollarSign className="w-4 h-4" /> Days in A/R
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">31</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<PieChart className="w-4 h-4" /> Payer Mix
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-sm text-muted-foreground">Commercial 48%, Medicare 32%, Self‑pay 20%</div>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Denial Root Causes</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-sm text-muted-foreground">Pre‑auth, eligibility, coding. Suggests quick fixes and pre‑visit checks.</div>
				</CardContent>
			</Card>
		</div>
	);
}
