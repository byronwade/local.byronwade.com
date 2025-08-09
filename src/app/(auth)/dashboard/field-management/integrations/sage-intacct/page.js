export const metadata = {
	title: "Sage Intacct | Integrations",
	description: "Connect and configure Sage Intacct integration.",
};

export default function SageIntacctIntegrationPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Sage Intacct Integration",
		description: "Connect and configure Sage Intacct integration.",
	};

	return (
		<>
			<h1 className="text-2xl font-bold tracking-tight">Sage Intacct</h1>
			<p className="text-muted-foreground">Connect and configure Sage Intacct integration.</p>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
		</>
	);
}
