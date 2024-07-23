import BusinessAddForm from "@components/auth/BusinessAddForm";

// SEO metadata for the page
export const metadata = {
	title: "Add Your Business - Thorbis",
	description: "Submit your business to Thorbis to connect with potential customers and enhance your visibility in our business directory.",
	keywords: ["Thorbis", "add business", "business directory", "submit business", "business listing", "business visibility"],
	openGraph: {
		title: "Add Your Business - Thorbis",
		description: "Submit your business to Thorbis to connect with potential customers and enhance your visibility in our business directory.",
		url: "https://thorbis.com/add-business",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis.com/og-add-business.jpg",
				width: 800,
				height: 600,
				alt: "Add Your Business at Thorbis",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Add Your Business - Thorbis",
		description: "Submit your business to Thorbis to connect with potential customers and enhance your visibility in our business directory.",
		images: ["https://thorbis.com/twitter-add-business.jpg"],
	},
	alternates: {
		canonical: "https://thorbis.com/add-business",
		languages: {
			"en-US": "https://thorbis.com/en-US/add-business",
			"es-ES": "https://thorbis.com/es-ES/add-business",
		},
	},
};

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebPage",
	url: "https://thorbis.com/add-business",
	name: "Thorbis Business Submission",
	description: "Submit your business to Thorbis to connect with potential customers and enhance your visibility in our business directory.",
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

export default function BusinessAdd() {
	return (
		<>
			<main>
				<BusinessAddForm />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
			</main>
		</>
	);
}
