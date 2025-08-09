"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { TrendingUp, Calendar, Percent, BedDouble, Utensils } from "lucide-react";

export default function HospitalityDashboard() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Hospitality Yield Center</h1>
				<div className="flex gap-2">
					<Link href="/dashboard/hospitality/pos">
						<Button>
							<Utensils className="w-4 h-4 mr-2" /> Restaurant POS
						</Button>
					</Link>
				</div>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BedDouble className="w-4 h-4" /> Occupancy
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">82%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="w-4 h-4" /> ADR
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">$156</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Percent className="w-4 h-4" /> RevPAR
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">$128</div>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="w-4 h-4" /> Rate Recommendations
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-sm text-muted-foreground">Dynamic rate suggestions for shoulder dates and high‑demand weekends.</div>
				</CardContent>
			</Card>
		</div>
	);
}
