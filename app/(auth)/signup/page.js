import SignupPage from "@components/auth/SignupPage";
import UserSignupForm from "@components/auth/UserSignupForm";

export const metadata = {
	title: "Sign Up - Thorbis",
	description: "Create an account on Thorbis to post jobs and find businessfessional services easily.",
	keywords: ["Thorbis", "sign up", "create account", "find business", "contractors", "home imbusinessvement"],
	openGraph: {
		title: "Sign Up - Thorbis",
		description: "Create an account on Thorbis to post jobs and find businessfessional services easily.",
		url: "https://thorbis/signup",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis/og-signup.jpg",
				width: 800,
				height: 600,
				alt: "Sign Up at Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Sign Up - Thorbis",
		description: "Create an account on Thorbis to post jobs and find businessfessional services easily.",
		images: ["https://thorbis/twitter-signup.jpg"],
	},
	alternates: {
		canonical: "https://thorbis/signup",
		languages: {
			"en-US": "https://thorbis/en-US/signup",
			"es-ES": "https://thorbis/es-ES/signup",
		},
	},
};

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebSite",
	url: "https://thorbis/signup",
	name: "Thorbis",
	description: "Create an account on Thorbis to post jobs and find businessfessional services easily.",
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

export default function Signup() {
	return (
		<>
			<main>
				<SignupPage />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
			</main>
		</>
	);
}
