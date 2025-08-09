"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";

export default function AutomotivePOS() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Automotive POS</h1>
				<div className="flex gap-2">
					<Button variant="outline">New Work Order</Button>
					<Button>Start Ticket</Button>
				</div>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Quick Services</CardTitle>
					</CardHeader>
					<CardContent className="flex gap-2 flex-wrap">
						<Button variant="secondary">Oil Change</Button>
						<Button variant="secondary">Brake Pads</Button>
						<Button variant="secondary">Rotate Tires</Button>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Estimate Builder</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">Add parts and labor to build estimate.</CardContent>
				</Card>
			</div>
		</div>
	);
}
