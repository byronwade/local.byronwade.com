import { Login } from "@components/features/auth";

export const metadata = {
	title: "Login - Thorbis",
	description: "Log in to your Thorbis account to post jobs and connect with professional service providers easily.",
	keywords: ["Thorbis", "login", "log in", "account access", "find business", "contractors", "home improvement"],
	openGraph: {
		title: "Login - Thorbis",
		description: "Log in to your Thorbis account to post jobs and connect with professional service providers easily.",
		url: "https://thorbis.com/login",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis.com/og-login.jpg",
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
		images: ["https://thorbis.com/twitter-login.jpg"],
	},
	alternates: {
		canonical: "https://thorbis.com/login",
		languages: {
			"en-US": "https://thorbis.com/en-US/login",
			"es-ES": "https://thorbis.com/es-ES/login",
		},
	},
};

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebSite",
	url: "https://thorbis.com/login",
	name: "Thorbis",
	description: "Log in to your Thorbis account to post jobs and connect with professional service providers easily.",
	publisher: {
		"@type": "Organization",
		name: "Thorbis",
		logo: {
			"@type": "ImageObject",
			url: "https://thorbis.com/logo.png",
		},
	},
	potentialAction: {
		"@type": "SearchAction",
		target: "https://thorbis.com/search?q={search_term_string}",
		"query-input": "required name=search_term_string",
	},
};

export default function LoginPage() {
	return (
		<>
			<Login />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
		</>
	);
}
