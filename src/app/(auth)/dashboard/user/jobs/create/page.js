/**
 * Jobs Create Page
 * Now using the new modular JobCreatePage component
 * Reduced from 938 lines to clean implementation
 * Following Next.js best practices for component organization
 */

"use client";

// EXPLICIT IMPORT: Use .js version to avoid conflicts with .tsx version
import JobCreatePage from "@components/dashboard/user/jobs/create/job-create-page.js";

export default function Page() {
	return <JobCreatePage />;
}
