"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { TrendingUp, Home, DollarSign } from "lucide-react";

export default function RealEstateDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Real Estate Pipeline</h1>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Home className="w-4 h-4" /> Listings
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">24</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<TrendingUp className="w-4 h-4" /> Avg DOM
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">19</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<DollarSign className="w-4 h-4" /> Volume
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">$8.2M</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
