export const metadata = {
	title: "Payments Setup | Integrations",
	description: "Configure payment processor, surcharges, and settlement details.",
};

export default function PaymentsSetupPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Payments Setup",
		description: "Configure payment processor, surcharges, and settlement details.",
	};

	return (
		<>
			<h1 className="text-2xl font-bold tracking-tight">Payments Setup</h1>
			<p className="text-muted-foreground">Configure payment processor, surcharges, and settlement details.</p>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
		</>
	);
}
