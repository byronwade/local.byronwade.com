import { SignupPage } from "@features/auth";

export const metadata = {
	title: "Sign Up - Thorbis",
	description: "Create your Thorbis account to connect with local businesses and service providers.",
	keywords: ["Thorbis", "signup", "sign up", "create account", "register", "find business", "contractors", "home improvement"],
	openGraph: {
		title: "Sign Up - Thorbis",
		description: "Create your Thorbis account to connect with local businesses and service providers.",
		url: "https://thorbis.com/signup",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis.com/og-signup.jpg",
				width: 800,
				height: 600,
				alt: "Sign up for Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Sign Up - Thorbis",
		description: "Create your Thorbis account to connect with local businesses and service providers.",
		images: ["https://thorbis.com/twitter-signup.jpg"],
	},
	alternates: {
		canonical: "https://thorbis.com/signup",
		languages: {
			"en-US": "https://thorbis.com/en-US/signup",
			"es-ES": "https://thorbis.com/es-ES/signup",
		},
	},
};

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebSite",
	url: "https://thorbis.com/signup",
	name: "Thorbis",
	description: "Create your Thorbis account to connect with local businesses and service providers.",
	publisher: {
		"@type": "Organization",
		name: "Thorbis",
		logo: {
			"@type": "ImageObject",
			url: "https://thorbis.com/logo.png",
		},
	},
	potentialAction: {
		"@type": "RegisterAction",
		target: "https://thorbis.com/signup",
		name: "Sign up for Thorbis",
	},
};

export default function Signup() {
	return (
		<>
			<SignupPage />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
		</>
	);
}
