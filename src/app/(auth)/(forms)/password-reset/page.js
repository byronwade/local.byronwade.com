import { PasswordReset } from "@features/auth";

export const metadata = {
	title: "Reset Password - Thorbis",
	description: "Reset your Thorbis account password securely. Enter your email to receive password reset instructions.",
	keywords: ["password reset", "forgot password", "account recovery", "security"],
	openGraph: {
		title: "Reset Password - Thorbis",
		description: "Reset your Thorbis account password securely. Enter your email to receive password reset instructions.",
		url: "https://thorbis.com/password-reset",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis.com/og-password-reset.jpg",
				width: 800,
				height: 600,
				alt: "Reset Password",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Reset Password - Thorbis",
		description: "Reset your Thorbis account password securely. Enter your email to receive password reset instructions.",
		images: ["https://thorbis.com/twitter-password-reset.jpg"],
	},
	alternates: {
		canonical: "https://thorbis.com/password-reset",
	},
};

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebPage",
	url: "https://thorbis.com/password-reset",
	name: "Reset Password",
	description: "Reset your Thorbis account password securely. Enter your email to receive password reset instructions.",
	mainEntity: {
		"@type": "WebApplication",
		name: "Thorbis Password Reset",
		applicationCategory: "SecurityApplication",
	},
};

const PasswordResetComponent = () => {
	return (
		<>
			<PasswordReset />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
		</>
	);
};

export default PasswordResetComponent;
