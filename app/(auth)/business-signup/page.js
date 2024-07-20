import BusinessSignupForm from "@/components/auth/BusinessSignupForm";

// SEO metadata for the page
export const metadata = {
	title: "Business Professional Signup - Thorbis",
	description: "Join Thorbis as a contractor or service business provider to find job leads and connect with potential customers.",
	keywords: ["Thorbis", "business professional signup", "contractors", "service business providers", "job leads", "home improvement"],
	openGraph: {
		title: "Business Professional Signup - Thorbis",
		description: "Join Thorbis as a contractor or service business provider to find job leads and connect with potential customers.",
		url: "https://thorbis.com/business-signup",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis.com/og-business-signup.jpg",
				width: 800,
				height: 600,
				alt: "Business Professional Signup at Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Business Professional Signup - Thorbis",
		description: "Join Thorbis as a contractor or service business provider to find job leads and connect with potential customers.",
		images: ["https://thorbis.com/twitter-business-signup.jpg"],
	},
	alternates: {
		canonical: "https://thorbis.com/business-signup",
		languages: {
			"en-US": "https://thorbis.com/en-US/business-signup",
			"es-ES": "https://thorbis.com/es-ES/business-signup",
		},
	},
};

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebPage",
	url: "https://thorbis.com/business-signup",
	name: "Thorbis Business Professional Signup",
	description: "Join Thorbis as a contractor or service business provider to find job leads and connect with potential customers.",
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

export default function BusinessSignup() {
	return (
		<>
			<main>
				<BusinessSignupForm />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
			</main>
		</>
	);
}
