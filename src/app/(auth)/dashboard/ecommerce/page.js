"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { ShoppingCart, CreditCard, TrendingUp } from "lucide-react";

export default function EcommerceDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Ecommerce Performance</h1>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<ShoppingCart className="w-4 h-4" /> Orders
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">482</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<CreditCard className="w-4 h-4" /> AOV
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">$64.80</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<TrendingUp className="w-4 h-4" /> Conversion
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">2.3%</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
