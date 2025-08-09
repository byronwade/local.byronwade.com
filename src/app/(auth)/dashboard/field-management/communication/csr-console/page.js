export const metadata = {
	title: "CSR Booking Console | Communication",
	description: "Handle calls and convert them to booked jobs with IVR and whisper.",
};

export default function CSRConsolePage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "CSR Booking Console",
		description: "Handle calls and convert them to booked jobs with IVR and whisper.",
	};

	return (
		<>
			<h1 className="text-2xl font-bold tracking-tight">CSR Booking Console</h1>
			<p className="text-muted-foreground">Handle calls and convert them to booked jobs with IVR and whisper.</p>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
		</>
	);
}
