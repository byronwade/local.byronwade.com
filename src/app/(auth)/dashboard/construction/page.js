"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { AlertTriangle, DollarSign, Clock } from "lucide-react";

export default function ConstructionDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Construction Profitability & Slippage</h1>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<DollarSign className="w-4 h-4" /> Margin at Completion
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">18.2%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="w-4 h-4" /> Schedule Variance
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">-6 days</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="w-4 h-4" /> Change Orders
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">$42k</div>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Early Slippage Predictor</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-sm text-muted-foreground">Combines timesheets, POs, weather to flag at‑risk tasks.</div>
				</CardContent>
			</Card>
		</div>
	);
}
