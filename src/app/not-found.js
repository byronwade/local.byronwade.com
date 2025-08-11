export const metadata = {
	robots: { index: false, follow: true },
	alternates: { canonical: "https://thorbis.com/404" },
	title: "Page Not Found | Thorbis",
	description: "Sorry, we couldn't find that page. Explore top sections of Thorbis instead.",
};

export default function NotFound() {
	return (
		<main className="min-h-[60vh] flex items-center justify-center px-4">
			<div className="max-w-xl text-center space-y-6">
				<h1 className="text-3xl font-bold">We couldn’t find that page</h1>
				<p className="text-muted-foreground">It may have moved or no longer exists. Try one of these helpful links:</p>
				<div className="flex flex-wrap gap-3 justify-center">
					<a className="underline" href="/">
						Home
					</a>
					<a className="underline" href="/search">
						Search
					</a>
					<a className="underline" href="/categories/restaurants">
						Top Categories
					</a>
					<a className="underline" href="/localhub">
						LocalHub
					</a>
				</div>
			</div>
		</main>
	);
}
