export const metadata = {
	title: "Payment Surcharges | Payments",
	description: "Configure payment surcharges and rules.",
};

export default function PaymentSurchargesPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Payment Surcharges",
		description: "Configure payment surcharges and rules.",
	};

	return (
		<>
			<h1 className="text-2xl font-bold tracking-tight">Payment Surcharges</h1>
			<p className="text-muted-foreground">Configure payment surcharges and rules.</p>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
		</>
	);
}
