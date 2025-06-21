import AccountOTP from "@components/auth/account/otp";
import { Metadata } from "next";

export const metadata = {
	title: "Two-Factor Authentication - Thorbis",
	description: "Enter your verification code to complete the two-factor authentication process and secure your account.",
	keywords: ["2FA", "two-factor authentication", "verification", "security", "OTP"],
	openGraph: {
		title: "Two-Factor Authentication - Thorbis",
		description: "Enter your verification code to complete the two-factor authentication process and secure your account.",
		url: "https://thorbis/otp",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis/og-otp.jpg",
				width: 800,
				height: 600,
				alt: "Two-Factor Authentication",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Two-Factor Authentication - Thorbis",
		description: "Enter your verification code to complete the two-factor authentication process and secure your account.",
		images: ["https://thorbis/twitter-otp.jpg"],
	},
	alternates: {
		canonical: "https://thorbis/otp",
	},
};

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebPage",
	url: "https://thorbis/otp",
	name: "Two-Factor Authentication",
	description: "Enter your verification code to complete the two-factor authentication process and secure your account.",
	mainEntity: {
		"@type": "WebApplication",
		name: "Thorbis Authentication",
		applicationCategory: "SecurityApplication",
	},
};

const OnboardingComponent = () => {
	return (
		<>
			<AccountOTP />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
		</>
	);
};

export default OnboardingComponent;
