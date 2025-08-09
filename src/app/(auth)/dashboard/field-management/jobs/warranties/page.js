export const metadata = {
	title: "Warranties | Jobs",
	description: "Track job warranties and coverage details.",
};

export default function WarrantiesPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Warranties",
		description: "Track job warranties and coverage details.",
	};

	return (
		<>
			<h1 className="text-2xl font-bold tracking-tight">Warranties</h1>
			<p className="text-muted-foreground">Track job warranties and coverage details.</p>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
		</>
	);
}
