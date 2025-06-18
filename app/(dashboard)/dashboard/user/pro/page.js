import React from "react";
import { Button } from "@components/ui/button";

export default function Pro() {
	return (
		<div className="w-full px-4 lg:px-24 py-16 space-y-8">
			<div className="flex items-center justify-between space-x-6">
				<h1 className="text-4xl">Pro Members</h1>
			</div>
			<p className="text-muted-foreground">Upgrade to a Pro account for more features and benefits.</p>
			<div className="flex flex-row justify-between w-full py-16 rounded-md bg-primary">
				<div className="px-4">
					<h1 className="text-4xl font-bold">$5/month</h1>
				</div>
				<div className="px-4">
					<Button variant="secondary" size="xs">
						Signup
					</Button>
				</div>
			</div>
		</div>
	);
}
