"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@components/ui/card";
import Header from "@components/business/header";

export default function BusinessDashboard({ businessId, user }) {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<div className="p-6">
				<div className="mx-auto space-y-6 max-w-7xl">
					<h1 className="text-3xl font-bold tracking-tight">Field Service Dashboard</h1>
					<Card>
						<CardContent className="p-6">
							<p>Dashboard content goes here</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
