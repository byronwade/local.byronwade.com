import { AppHeader } from "@components/network";
import { isEnabled } from "@lib/flags/server";

export default async function LinkedInCloneLayout({ children }) {
	const on = await isEnabled("linkedinClone");
	if (!on) {
		// Keep SEO-safe page; simple unavailable notice
		return (
			<div className="container mx-auto px-4 py-16">
				<h1 className="text-2xl font-semibold">Coming soon</h1>
				<p className="text-muted-foreground mt-2">This area is under active development.</p>
			</div>
		);
	}
	return (
		<div className="flex flex-col w-full min-h-screen">
			<AppHeader />
			<main className="flex-1 w-full bg-muted/30">
				<div className="w-full h-[calc(100vh-73px)] overflow-auto">
					<div className="mx-auto px-4 lg:px-24 py-6">{children}</div>
				</div>
			</main>
		</div>
	);
}
