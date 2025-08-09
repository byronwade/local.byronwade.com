import { JobsHeader } from "@components/jobs/jobs-header";
import { isEnabled } from "@lib/flags/server";

export default async function JobsAppLayout({ children }) {
	const on = await isEnabled("jobsApp");
	if (!on) {
		return (
			<div className="container mx-auto px-4 py-16">
				<h1 className="text-2xl font-semibold">Jobs feature is not available</h1>
				<p className="text-muted-foreground mt-2">Please check back soon.</p>
			</div>
		);
	}
	return (
		<div className="flex flex-col w-full min-h-screen bg-muted/30">
			<JobsHeader />
			<main className="container mx-auto py-8">{children}</main>
		</div>
	);
}
