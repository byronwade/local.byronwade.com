"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { HeartHandshake, Users, DollarSign } from "lucide-react";

export default function NonprofitDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Nonprofit Impact</h1>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<HeartHandshake className="w-4 h-4" /> Programs
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">12</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Users className="w-4 h-4" /> Volunteers
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">284</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<DollarSign className="w-4 h-4" /> Donations
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">$92k</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
