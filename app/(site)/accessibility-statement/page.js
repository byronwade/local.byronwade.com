import { Accessibility, DraftingCompass, View } from "lucide-react";

export const metadata = {
	title: "Accessibility Statement",
	description: "Our commitment to ensuring digital accessibility for people with disabilities.",
};

export default function AccessibilityStatementPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: metadata.title,
		description: metadata.description,
		author: {
			"@type": "Organization",
			name: "Inbox Zero",
		},
		publisher: {
			"@type": "Organization",
			name: "Inbox Zero",
			logo: {
				"@type": "ImageObject",
				url: "https://local.byronwade.com/logo-placeholder.png",
			},
		},
		url: "https://local.byronwade.com/accessibility-statement",
	};
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-16">
							<Accessibility className="w-16 h-16 mx-auto text-primary mb-4" />
							<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Accessibility Statement</h1>
							<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Thorbis is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
						</div>

						<div className="prose prose-lg dark:prose-invert max-w-none">
							<h2>Our Commitment</h2>
							<p>We believe that the web should be accessible to all, regardless of ability or technology. We are actively working to increase the accessibility and usability of our website and in doing so, adhere to many of the available standards and guidelines.</p>

							<hr />

							<h3>
								<DraftingCompass className="inline-block w-6 h-6 mr-2" />
								Conformance Status
							</h3>
							<p>
								The <a href="https://www.w3.org/WAI/standards-guidelines/wcag/">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
							</p>
							<p>Thorbis is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard. We are working towards full conformance.</p>

							<h3>
								<View className="inline-block w-6 h-6 mr-2" />
								Technical Specifications
							</h3>
							<p>Accessibility of Thorbis relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:</p>
							<ul>
								<li>HTML</li>
								<li>WAI-ARIA</li>
								<li>CSS</li>
								<li>JavaScript</li>
							</ul>
							<p>These technologies are relied upon for conformance with the accessibility standards used.</p>

							<hr />

							<h2>Feedback</h2>
							<p>We welcome your feedback on the accessibility of Thorbis. Please let us know if you encounter accessibility barriers on our platform:</p>
							<ul>
								<li>
									<strong>E-mail:</strong> <a href="mailto:accessibility@thorbis.com">accessibility@thorbis.com</a>
								</li>
								<li>
									<strong>Support Form:</strong> <a href="/support">Contact Support</a>
								</li>
							</ul>
							<p>We try to respond to feedback within 5 business days.</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
