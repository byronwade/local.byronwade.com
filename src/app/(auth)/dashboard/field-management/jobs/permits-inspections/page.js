export const metadata = {
	title: "Permits & Inspections | Jobs",
	description: "Manage job permits, inspection scheduling, and status.",
};

export default function PermitsInspectionsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Permits & Inspections",
		description: "Manage job permits, inspection scheduling, and status.",
	};

	return (
		<>
			<h1 className="text-2xl font-bold tracking-tight">Permits & Inspections</h1>
			<p className="text-muted-foreground">Manage job permits, inspection scheduling, and status.</p>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
		</>
	);
}
