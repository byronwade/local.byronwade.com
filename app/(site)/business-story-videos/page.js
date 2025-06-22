export const metadata = {
	title: "Business Story Videos - Under Construction",
	description: "Our business story videos feature is currently under construction. Check back soon to see inspiring stories from businesses like yours.",
};

export default function BusinessStoryVideosPage() {
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
						url: "https://local.byronwade.com/business-story-videos",
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
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Business Story Videos</h1>
						<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">This page is under construction. Check back soon for our new business story videos feature.</p>
					</div>
				</div>
			</div>
		</>
	);
}
