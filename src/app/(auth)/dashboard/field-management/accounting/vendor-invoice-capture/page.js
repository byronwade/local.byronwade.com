export const metadata = {
	title: "Vendor Invoice Capture | Accounting",
	description: "Upload vendor invoices and auto-extract data for AP.",
};

export default function VendorInvoiceCapturePage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Vendor Invoice Capture",
		description: "Upload vendor invoices and auto-extract data for AP.",
	};

	return (
		<>
			<h1 className="text-2xl font-bold tracking-tight">Vendor Invoice Capture</h1>
			<p className="text-muted-foreground">Upload vendor invoices and auto-extract data for AP.</p>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
		</>
	);
}
