"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";

export default function RestaurantPOS() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Restaurant POS</h1>
				<div className="flex gap-2">
					<Button variant="outline">Open Table</Button>
					<Button>New Order</Button>
				</div>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Dining Modes</CardTitle>
					</CardHeader>
					<CardContent className="flex gap-2 flex-wrap">
						<Button variant="secondary">Dine-In</Button>
						<Button variant="secondary">Takeout</Button>
						<Button variant="secondary">Delivery</Button>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Order Summary</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">No items yet.</CardContent>
				</Card>
			</div>
		</div>
	);
}
