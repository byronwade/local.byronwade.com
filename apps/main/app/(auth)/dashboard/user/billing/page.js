export const metadata = {
	title: "User Billing - Dashboard - Thorbis",
	description: "Manage your billing and subscription details for your user account.",
};

import React from "react";

export default function Billing() {
	return (
		<div className="w-full px-4 lg:px-24 py-16 space-y-8 bg-white dark:bg-neutral-900">
			<h1 className="text-4xl">Billing</h1>
			<p className="text-muted-foreground">Manage your billing and subscription details.</p>
		</div>
	);
}
