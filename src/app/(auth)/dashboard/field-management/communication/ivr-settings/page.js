export const metadata = {
	title: "IVR Settings | Communication",
	description: "Configure call flows, whisper, and routing.",
};

export default function IVRSettingsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "IVR Settings",
		description: "Configure call flows, whisper, and routing.",
	};

	return (
		<>
			<h1 className="text-2xl font-bold tracking-tight">IVR Settings</h1>
			<p className="text-muted-foreground">Configure call flows, whisper, and routing.</p>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
		</>
	);
}
