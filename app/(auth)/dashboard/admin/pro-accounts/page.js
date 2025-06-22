export const metadata = {
	title: "Pro Accounts Management - Admin Dashboard - Thorbis",
	description: "Manage pro accounts, subscriptions and premium business account administration.",
};

import React from "react";

export default function ProAccounts() {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl">Pro Accounts</h1>
					<p className="text-muted-foreground mt-2">Manage pro accounts and subscription services.</p>
				</div>
			</div>
			<div>
				{/* Pro accounts content will go here */}
				<p>Pro account management content coming soon...</p>
			</div>
		</div>
	);
}
