/**
 * User Dashboard Page
 * Now using the new modular UserDashboardPage component
 * Reduced from 647 lines to clean implementation
 * Following Next.js best practices for component organization
 */

"use client";

import UserDashboardPage from "@components/dashboard/user/UserDashboardPage";

export default function Page() {
	return <UserDashboardPage />;
}
