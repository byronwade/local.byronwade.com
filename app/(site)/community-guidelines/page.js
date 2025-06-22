import { ThumbsUp, ThumbsDown, Megaphone, Scale } from "lucide-react";

export const metadata = {
	title: "Community Guidelines",
	description: "Our guidelines for ensuring a safe, relevant, and reliable community.",
};

export default function ContentGuidelinesPage() {
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
		url: "https://local.byronwade.com/community-guidelines",
	};
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-16">
							<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Community Guidelines</h1>
							<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">We&apos;ve established these guidelines to ensure Thorbis remains a helpful and trusted source for everyone.</p>
						</div>

						<div className="prose prose-lg dark:prose-invert max-w-none">
							<h2>Our Guiding Principles</h2>
							<p>Our guidelines are built on two core principles: keeping our community safe and ensuring the information on Thorbis is relevant and reliable. Every piece of content, from reviews to photos, is subject to these standards.</p>

							<hr />

							<h3>
								<ThumbsUp className="inline-block w-6 h-6 mr-2 text-green-500" />
								What We Encourage
							</h3>
							<ul>
								<li>
									<strong>Personal Experience:</strong> Write or share content based on your own genuine experiences with a business. First-hand knowledge is most valuable to the community.
								</li>
								<li>
									<strong>Accuracy:</strong> Ensure that the information you provide is truthful and accurate. Avoid exaggeration, misinformation, and misleading claims.
								</li>
								<li>
									<strong>Relevance:</strong> Keep your content relevant to the business and the consumer experience. For example, rants about a company&apos;s political affiliations are not appropriate.
								</li>
								<li>
									<strong>Respectful Tone:</strong> You can be critical without being disrespectful. We encourage constructive feedback that is helpful to both consumers and the business.
								</li>
							</ul>

							<h3>
								<ThumbsDown className="inline-block w-6 h-6 mr-2 text-red-500" />
								What We Prohibit
							</h3>
							<ul>
								<li>
									<strong>Hate Speech & Harassment:</strong> Content that attacks, threatens, or harasses individuals or groups based on race, religion, gender, sexual orientation, or any other protected status is strictly forbidden.
								</li>
								<li>
									<strong>Conflicts of Interest:</strong> Do not review your own business, your employer, or your competitors. All content should be unbiased and objective.
								</li>
								<li>
									<strong>Promotional Content:</strong> Reviews and other user contributions should not be used for commercial purposes. Don&apos;t include promotional links or calls to action.
								</li>
								<li>
									<strong>Privacy Violations:</strong> Do not post private information about others, including full names, phone numbers, or addresses.
								</li>
							</ul>

							<hr />

							<h2>
								<Scale className="inline-block w-7 h-7 mr-2" />
								Enforcement
							</h2>
							<p>Violations of these guidelines may result in content removal, and in severe or repeated cases, account suspension. We have a dedicated team that reviews flagged content, and we are constantly working to improve our automated systems to detect and remove inappropriate material.</p>
							<p>Thank you for helping us keep Thorbis a safe and trustworthy platform.</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
