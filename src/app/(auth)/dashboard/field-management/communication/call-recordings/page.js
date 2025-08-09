export const metadata = {
	title: "Call Recordings | Communication",
	description: "Search and review CSR call recordings.",
};

export default function CallRecordingsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Call Recordings",
		description: "Search and review CSR call recordings.",
	};

	return (
		<>
			<h1 className="text-2xl font-bold tracking-tight">Call Recordings</h1>
			<p className="text-muted-foreground">Search and review CSR call recordings.</p>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
		</>
	);
}
