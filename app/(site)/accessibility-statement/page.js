import { Accessibility, DraftingCompass, View } from "lucide-react";

export const metadata = {
	title: "Accessibility Statement - Thorbis Commitment to Digital Accessibility",
	description: "Learn about Thorbis's commitment to digital accessibility and our efforts to ensure our platform is usable by everyone, including people with disabilities.",
	keywords: ["accessibility statement", "digital accessibility", "WCAG compliance", "web accessibility", "inclusive design"],
	openGraph: {
		title: "Accessibility Statement - Thorbis Commitment to Digital Accessibility",
		description: "Learn about Thorbis's commitment to digital accessibility and our efforts to ensure our platform is usable by everyone, including people with disabilities.",
		url: "https://local.byronwade.com/accessibility-statement",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-accessibility.jpg",
				width: 1200,
				height: 630,
				alt: "Thorbis Accessibility Commitment",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Accessibility Statement - Thorbis Digital Accessibility",
		description: "Learn about our commitment to digital accessibility and WCAG compliance.",
		images: ["https://local.byronwade.com/og-accessibility.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/accessibility-statement",
	},
};

export default function AccessibilityStatementPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Accessibility Statement",
		description: "Thorbis's commitment to digital accessibility and our efforts to ensure our platform is usable by everyone, including people with disabilities.",
		url: "https://local.byronwade.com/accessibility-statement",
		mainEntity: {
			"@type": "Article",
			headline: "Accessibility Statement",
			description: "Our commitment to digital accessibility and WCAG compliance",
			author: {
				"@type": "Organization",
				name: "Thorbis",
			},
			publisher: {
				"@type": "Organization",
				name: "Thorbis",
				logo: {
					"@type": "ImageObject",
					url: "https://local.byronwade.com/ThorbisLogo.webp",
				},
			},
			accessibilityAPI: "ARIA",
			accessibilityFeature: ["alternativeText", "highContrast", "keyboardNavigation", "screenReaderSupport"],
			accessibilityControl: ["fullKeyboardControl", "mouseControl"],
			accessibilityHazard: "none",
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="px-4 py-24 lg:px-24">
					<div className="mx-auto max-w-4xl">
						<div className="mb-16 text-center">
							<Accessibility className="mx-auto mb-4 w-16 h-16 text-primary" />
							<h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">Accessibility Statement</h1>
							<p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground">Thorbis is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
						</div>

						<div className="max-w-none prose prose-lg dark:prose-invert">
							<h2>Our Commitment</h2>
							<p>We believe that the web should be accessible to all, regardless of ability or technology. We are actively working to increase the accessibility and usability of our website and in doing so, adhere to many of the available standards and guidelines.</p>

							<hr />

							<h3>
								<DraftingCompass className="inline-block mr-2 w-6 h-6" />
								Conformance Status
							</h3>
							<p>
								The <a href="https://www.w3.org/WAI/standards-guidelines/wcag/">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
							</p>
							<p>Thorbis is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard. We are working towards full conformance.</p>

							<h3>
								<View className="inline-block mr-2 w-6 h-6" />
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
