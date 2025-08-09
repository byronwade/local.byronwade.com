"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Truck, Clock, Activity } from "lucide-react";

export default function LogisticsDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Logistics Ops</h1>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Truck className="w-4 h-4" /> On‑time Delivery
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">96.2%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Clock className="w-4 h-4" /> Avg Dwell
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">42m</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Activity className="w-4 h-4" /> Capacity Utilization
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">81%</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
