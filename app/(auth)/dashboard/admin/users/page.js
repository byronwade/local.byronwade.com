export const metadata = {
	title: "User Management - Admin Dashboard - Thorbis",
	description: "Manage all registered users, view user statistics and handle user account administration.",
};

import React from "react";

export default function Users() {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl">Users</h1>
					<p className="text-muted-foreground mt-2">Manage all registered users and their accounts.</p>
				</div>
			</div>
			<div>
				{/* User content will go here */}
				<p>User management content coming soon...</p>
			</div>
		</div>
	);
}
