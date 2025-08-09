export const metadata = {
	title: "Privacy Policy - How We Protect Your Data | Thorbis",
	description: "Read Thorbis's privacy policy to understand how we collect, use, and protect your personal information. Learn about your privacy rights and data choices.",
	keywords: ["privacy policy", "data protection", "personal information", "user privacy", "data collection", "privacy rights"],
	openGraph: {
		title: "Privacy Policy - How We Protect Your Data | Thorbis",
		description: "Read Thorbis's privacy policy to understand how we collect, use, and protect your personal information. Learn about your privacy rights and data choices.",
		url: "https://thorbis.com/privacy",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis.com/og-privacy.jpg",
				width: 1200,
				height: 630,
				alt: "Thorbis Privacy Policy",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Privacy Policy - Thorbis",
		description: "Learn how we protect your data and respect your privacy on Thorbis.",
		images: ["https://thorbis.com/og-privacy.jpg"],
	},
	alternates: {
		canonical: "https://thorbis.com/privacy",
	},
};

export default function PrivacyPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Privacy Policy",
		description: "Thorbis privacy policy explaining how we collect, use, and protect your personal information",
		url: "https://thorbis.com/privacy",
		dateModified: "2023-10-26",
		mainEntity: {
			"@type": "Article",
			headline: "Privacy Policy",
			description: "How Thorbis collects, uses, and shares your personal information",
			datePublished: "2023-10-26",
			dateModified: "2023-10-26",
			author: {
				"@type": "Organization",
				name: "Thorbis",
			},
			publisher: {
				"@type": "Organization",
				name: "Thorbis",
				logo: {
					"@type": "ImageObject",
					url: "https://thorbis.com/logos/ThorbisLogo.webp",
				},
			},
			about: ["Data Privacy", "Personal Information Protection", "User Rights", "Data Collection Practices", "Information Security"],
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: {
						"@id": "https://thorbis.com",
						name: "Thorbis",
					},
				},
				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@id": "https://thorbis.com/privacy",
						name: "Privacy Policy",
					},
				},
			],
		},
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
