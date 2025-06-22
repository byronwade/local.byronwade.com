export const metadata = {
	title: "Terms of Service",
	description: "Read our Terms of Service to understand the rules for using our platform.",
};

export default function TermsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: "Terms of Service",
		description: "Read our Terms of Service to understand the rules for using our platform.",
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
		url: "https://local.byronwade.com/terms",
		datePublished: "2023-10-26",
		dateModified: "2023-10-26",
	};
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<div className="bg-background text-foreground">
				<div className="py-24 px-4 lg:px-24">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-16">
							<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Terms of Service</h1>
							<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Last Updated: October 26, 2023</p>
						</div>

						<div className="prose prose-lg dark:prose-invert max-w-none">
							<h2>1. Introduction</h2>
							<p>Welcome to Thorbis. These Terms of Service (&quot;Terms&quot;) govern your use of the Thorbis website, applications, and services (collectively, the &quot;Services&quot;). By using our Services, you agree to be bound by these Terms.</p>

							<h2>2. Using Our Services</h2>
							<p>You must follow any policies made available to you within the Services. Don&apos;t misuse our Services. For example, don&apos;t interfere with our Services or try to access them using a method other than the interface and the instructions that we provide.</p>

							<h2>3. Content in Our Services</h2>
							<p>Our Services display some content that is not Thorbis&apos;s. This content is the sole responsibility of the entity that makes it available. We may review content to determine whether it is illegal or violates our policies, and we may remove or refuse to display content that we reasonably believe violates our policies or the law.</p>

							<h2>4. Your Thorbis Account</h2>
							<p>You may need a Thorbis Account in order to use some of our Services. You may create your own Thorbis Account, or your Thorbis Account may be assigned to you by an administrator, such as your employer.</p>

							<h2>5. Privacy and Copyright Protection</h2>
							<p>Thorbis&apos;s privacy policies explain how we treat your personal data and protect your privacy when you use our Services. By using our Services, you agree that Thorbis can use such data in accordance with our privacy policies.</p>

							<h2>6. About These Terms</h2>
							<p>We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to the law or changes to our Services. You should look at the terms regularly. We&apos;ll post notice of modifications to these terms on this page.</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
