"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Timer, ClipboardList, DollarSign } from "lucide-react";

export default function PropertyManagementDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Maintenance & Turnover</h1>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ClipboardList className="w-4 h-4" /> Work Orders Aging
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">17 open</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Timer className="w-4 h-4" /> Turn Cycle
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">6.8 days</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<DollarSign className="w-4 h-4" /> Delinquency
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">2.4%</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
