import { JobsHeader } from "@/components/jobs/JobsHeader";

export default function JobsAppLayout({ children }) {
	return (
		<div className="flex flex-col w-full min-h-screen bg-muted/30">
			<JobsHeader />
			<main className="container mx-auto py-8">{children}</main>
		</div>
	);
}
