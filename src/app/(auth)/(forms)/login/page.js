import { LoginPage } from "@components/features/auth";
import { Metadata } from "next";

export const metadata = {
	title: "Login - Thorbis",
	description: "Log in to your Thorbis account to post jobs and connect with professional service providers easily.",
	keywords: ["Thorbis", "login", "log in", "account access", "find business", "contractors", "home improvement"],
	openGraph: {
		title: "Login - Thorbis",
		description: "Log in to your Thorbis account to post jobs and connect with professional service providers easily.",
		url: "https://thorbis/login",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis/og-login.jpg",
				width: 800,
				height: 600,
				alt: "Login to Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Login - Thorbis",
		description: "Log in to your Thorbis account to post jobs and connect with professional service providers easily.",
		images: ["https://thorbis/twitter-login.jpg"],
	},
	alternates: {
		canonical: "https://thorbis/login",
		languages: {
			"en-US": "https://thorbis/en-US/login",
			"es-ES": "https://thorbis/es-ES/login",
		},
	},
};

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebSite",
	url: "https://thorbis/login",
	name: "Thorbis",
	description: "Log in to your Thorbis account to post jobs and connect with professional service providers easily.",
	publisher: {
		"@type": "Organization",
		name: "Thorbis",
		logo: {
			"@type": "ImageObject",
			url: "https://thorbis/logo.png",
		},
	},
	potentialAction: {
		"@type": "SearchAction",
		target: "https://thorbis/search?q={search_term_string}",
		"query-input": "required name=search_term_string",
	},
};

export default function Login() {
	return (
		<>
			<LoginPage />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
		</>
	);
}
