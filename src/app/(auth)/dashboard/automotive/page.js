"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Wrench, Clock, TrendingUp } from "lucide-react";

export default function AutomotiveDashboard() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Service Bay Throughput</h1>
				<Link href="/dashboard/automotive/pos">
					<Button>POS</Button>
				</Link>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="w-4 h-4" /> Bay Utilization
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">74%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="w-4 h-4" /> Upsell Rate
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">22%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Wrench className="w-4 h-4" /> Comeback Rate
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">3.1%</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
