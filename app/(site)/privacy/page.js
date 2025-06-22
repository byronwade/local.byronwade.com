export const metadata = {
	title: "Privacy Policy",
	description: "Learn how we collect, use, and share your personal information.",
};

export default function PrivacyPage() {
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
		url: "https://local.byronwade.com/privacy",
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
							<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">Privacy Policy</h1>
							<p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">Last Updated: October 26, 2023</p>
						</div>

						<div className="prose prose-lg dark:prose-invert max-w-none">
							<h2>1. Introduction</h2>
							<p>Your privacy is important to us. This Privacy Policy explains how Thorbis collects, uses, and shares your personal information when you use our Services.</p>

							<h2>2. Information We Collect</h2>
							<p>We collect information you provide directly to us, such as when you create an account, post a review, or contact us for support. We may also collect information automatically as you navigate the site, such as your IP address and browsing behavior.</p>

							<h3>2.1 Information You Provide</h3>
							<ul>
								<li>
									<strong>Account Information:</strong> When you create a Thorbis account, we collect your name, email address, and password.
								</li>
								<li>
									<strong>Public Content:</strong> Content you post to the Services, such as reviews, photos, and comments, is intended for public consumption.
								</li>
							</ul>

							<h3>2.2 Information Collected Automatically</h3>
							<ul>
								<li>
									<strong>Log Data:</strong> We log information when you access and use the Services, including your IP address, browser type, and operating system.
								</li>
								<li>
									<strong>Cookies:</strong> We use cookies to operate and administer our site and to improve your experience.
								</li>
							</ul>

							<h2>3. How We Use Your Information</h2>
							<p>We use the information we collect to provide, maintain, and improve our Services, including to personalize your experience, to communicate with you, and for security and fraud prevention.</p>

							<h2>4. How We Share Your Information</h2>
							<p>We do not sell your personal data. We may share your information with third-party vendors and service providers who perform services on our behalf, or as required by law.</p>

							<h2>5. Your Choices</h2>
							<p>You have choices about your information. You can access and update certain information through your account settings, and you can opt-out of certain marketing communications.</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
