import Link from "next/link";

export const metadata = {
	title: "Changelog | Thorbis",
	description: "Product updates and platform improvements across Thorbis Business OS, Directory, LocalHub, and Academy.",
	alternates: { canonical: "https://thorbis.com/changelog" },
	openGraph: {
		title: "Changelog | Thorbis",
		description: "Recent improvements, features, and fixes across the Thorbis platform.",
		url: "https://thorbis.com/changelog",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Thorbis Changelog",
		description: "Recent improvements, features, and fixes across the Thorbis platform.",
	},
};

const changes = [
	{
		date: "2025-08-09",
		title: "Investor landing updates",
		items: ["Added Apple-style hero, anchors, and expanded investor narrative", "Introduced Metrics at a glance, Ads System, LocalHub, Academy, and Investment sections", "Added SoftwareApplication JSON-LD", "Expanded demo links and vertical toolkit callouts"],
	},
	{
		date: "2025-08-08",
		title: "SEO and structured data refinements",
		items: ["Improved WebPage, Organization, WebSite(SearchAction), FAQ schemas", "Canonical and OpenGraph consistency checks"],
	},
];

export default function ChangelogPage() {
	return (
		<div className="bg-background text-foreground">
			<div className="px-4 py-24 mx-auto max-w-5xl lg:px-24">
				<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Changelog</h1>
				<p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">Product updates and platform improvements across Thorbis Business OS, Directory, LocalHub, and Academy.</p>
				<div className="mt-10">
					<Link href="/" className="text-sm hover:underline text-muted-foreground">
						← Back to Home
					</Link>
				</div>
			</div>

			<div className="px-4 pb-24 mx-auto max-w-5xl lg:px-24">
				<div className="space-y-10">
					{changes.map((release) => (
						<div key={release.date} className="border-b pb-8">
							<div className="flex items-baseline justify-between">
								<h2 className="text-2xl font-bold tracking-tight">{release.title}</h2>
								<time className="text-sm text-muted-foreground">{release.date}</time>
							</div>
							<ul className="mt-4 list-disc pl-5 text-muted-foreground">
								{release.items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
