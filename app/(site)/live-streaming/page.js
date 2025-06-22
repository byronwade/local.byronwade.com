import { jsonLdScriptProps } from "react-schemaorg";
import { WebPage } from "schema-dts";

export const metadata = {
	title: "Live Streaming - Under Construction",
	description: "Our live streaming feature is currently under construction. Check back soon to engage with live events, Q&As, and more.",
};

export default function LiveStreamingPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebPage",
						name: metadata.title,
						description: metadata.description,
						url: "https://local.byronwade.com/live-streaming",
						isPartOf: {
							"@type": "WebSite",
							name: "Inbox Zero",
							url: "https://local.byronwade.com",
						},
					}),
				}}
			/>
			<div className="bg-background text-foreground">
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Live Streaming</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">This page is under construction. Check back soon for our new live streaming feature.</p>
					</div>
				</div>
			</div>
		</>
	);
}
