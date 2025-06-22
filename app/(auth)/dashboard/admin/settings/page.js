export const metadata = {
	title: "System Settings - Admin Dashboard - Thorbis",
	description: "Configure application settings, system preferences and administrative controls.",
};

import React from "react";

export default function Settings() {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl">Settings</h1>
					<p className="text-muted-foreground mt-2">Configure application settings and preferences.</p>
				</div>
			</div>
			<div>
				{/* Settings content will go here */}
				<p>Settings content coming soon...</p>
			</div>
		</div>
	);
}
