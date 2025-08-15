import { isEnabled } from "@lib/flags/server";

export default async function LandingPagesLayout({ children }) {
	const on = await isEnabled("landingPages");
	if (!on) {
		return (
			<main className="min-h-screen w-full bg-background">
				<section className="container mx-auto px-4 py-16">
					<h1 className="text-2xl font-semibold">Landing pages are not available</h1>
					<p className="text-muted-foreground mt-2">Please check back soon.</p>
				</section>
			</main>
		);
	}
	return children;
}
