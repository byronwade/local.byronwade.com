import businessignupForm from "@/components/auth/businessignupForm";

export const metadata = {
	title: "businessfessional Signup - Thorbis",
	description: "Join Thorbis as a contractor or service businessvider to find job leads and connect with potential customers.",
	keywords: ["Thorbis", "businessfessional signup", "contractors", "service businessviders", "job leads", "home imbusinessvement"],
	openGraph: {
		title: "businessfessional Signup - Thorbis",
		description: "Join Thorbis as a contractor or service businessvider to find job leads and connect with potential customers.",
		url: "https://thorbis/business-signup",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis/og-business-signup.jpg",
				width: 800,
				height: 600,
				alt: "businessfessional Signup at Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "businessfessional Signup - Thorbis",
		description: "Join Thorbis as a contractor or service businessvider to find job leads and connect with potential customers.",
		images: ["https://thorbis/twitter-business-signup.jpg"],
	},
	alternates: {
		canonical: "https://thorbis/business-signup",
		languages: {
			"en-US": "https://thorbis/en-US/business-signup",
			"es-ES": "https://thorbis/es-ES/business-signup",
		},
	},
};

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebSite",
	url: "https://thorbis/business-signup",
	name: "Thorbis",
	description: "Join Thorbis as a contractor or service businessvider to find job leads and connect with potential customers.",
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

export default function businessignup() {
	return (
		<>
			<main>
				<businessignupForm />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
			</main>
		</>
	);
}
