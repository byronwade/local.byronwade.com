import { Button } from "@/components/ui/button";
import { Megaphone, SlidersHorizontal, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Ad Choices",
	description: "Learn about our advertising practices and how to manage your ad preferences.",
};

export default function AdChoicesPage() {
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
		url: "https://local.byronwade.com/ad-choices",
	};
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-16">
							<Megaphone className="w-16 h-16 mx-auto text-primary mb-4" />
							<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Ad Choices</h1>
							<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">We&apos;re committed to providing you with transparency and control over the ads you see.</p>
						</div>

						<div className="prose prose-lg dark:prose-invert max-w-none">
							<h2>
								<SlidersHorizontal className="inline-block w-6 h-6 mr-2" />
								Interest-Based Advertising
							</h2>
							<p>To help you discover businesses, products, and services you might like, we may show you interest-based ads. These ads are based on information about your activities on our platform, such as the types of businesses you search for or the content you engage with.</p>
							<p>We use this information to make the ads you see more relevant to your interests. For example, if you frequently search for plumbers, we might show you an ad for a local plumbing service.</p>

							<hr />

							<h2>
								<ShieldCheck className="inline-block w-6 h-6 mr-2" />
								Your Privacy and Choices
							</h2>
							<p>We do not share your personally identifiable information with advertisers without your consent. Advertisers receive anonymous data about the performance of their ads.</p>
							<p>You have several options to control the ads you see:</p>
							<ul>
								<li>
									<strong>Your Thorbis Ad Preferences:</strong> You will be able to manage your ad settings directly in your Thorbis account dashboard (coming soon).
								</li>
								<li>
									<strong>Industry-Wide Opt-Outs:</strong> You can learn more about interest-based advertising and opt out of having your web browsing information used for behavioral advertising purposes by companies that participate in the Digital Advertising Alliance (DAA) by visiting{" "}
									<a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
										aboutads.info/choices
									</a>
									.
								</li>
							</ul>
							<p>Please note that opting out of interest-based ads does not mean you will no longer see ads from us. It simply means that the ads you see will not be personalized based on your interests.</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
