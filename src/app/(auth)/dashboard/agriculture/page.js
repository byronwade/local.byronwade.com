"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Droplets, Sprout, Sun } from "lucide-react";

export default function AgricultureDashboard() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">Farm Ops</h1>
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Droplets className="w-4 h-4" /> Irrigation
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">1.3 in</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Sun className="w-4 h-4" /> Heat Units
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">18</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							<Sprout className="w-4 h-4" /> Growth Index
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-semibold">0.82</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
