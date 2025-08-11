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
				url: "https://thorbis.com/logos/ThorbisLogo.webp",
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
		images: ["https://thorbis.com/logos/ThorbisLogo.webp"],
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
	"@context": "https://schema.org",
	"@type": "WebPage",
	url: "https://thorbis.com/login",
	name: "Login - Thorbis",
	inLanguage: "en-US",
	description: "Log in to your Thorbis account to post jobs and connect with professional service providers easily.",
	publisher: {
		"@type": "Organization",
		name: "Thorbis",
		logo: {
			"@type": "ImageObject",
			url: "https://thorbis.com/logos/ThorbisLogo.webp",
		},
	},
	primaryImageOfPage: {
		"@type": "ImageObject",
		url: "https://thorbis.com/logos/ThorbisLogo.webp",
	},
	potentialAction: {
		"@type": "LoginAction",
		target: "https://thorbis.com/login",
		name: "Login to Thorbis",
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
