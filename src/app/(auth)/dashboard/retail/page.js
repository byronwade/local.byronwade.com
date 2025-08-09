"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { Activity, Users, TrendingUp, Map, ShoppingBag } from "lucide-react";

export default function RetailDashboard() {
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Retail Command Center</h1>
				<div className="flex gap-2">
					<Link href="/dashboard/retail/pos">
						<Button>
							<ShoppingBag className="mr-2 w-4 h-4" /> POS
						</Button>
					</Link>
					<Button variant="outline">
						<Map className="mr-2 w-4 h-4" /> Heatmaps
					</Button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Users className="w-4 h-4" /> Footfall
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">1,284</div>
						<div className="text-xs text-muted-foreground">Today vs yesterday +12%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Activity className="w-4 h-4" /> Conversion
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">18.6%</div>
						<div className="text-xs text-muted-foreground">Goal 20%</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<TrendingUp className="w-4 h-4" /> Promo ROI
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">3.2x</div>
						<div className="text-xs text-muted-foreground">Active campaigns: 3</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Store Zones</CardTitle>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-64">
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span>Entrance</span>
								<span>Footfall +22%</span>
							</div>
							<div className="flex justify-between">
								<span>Apparel</span>
								<span>Conversion 16%</span>
							</div>
							<div className="flex justify-between">
								<span>Checkout</span>
								<span>Wait ~2.3m</span>
							</div>
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
}
