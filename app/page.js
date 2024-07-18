// app/page.tsx

import Header from "@/components/site/Header";

import SearchForm from "@/components/site/SearchForm";

export const metadata = {
	title: "Thorbis - Find businessfessional Services Easily",
	description: "Thorbis connects customers with businessfessional service businessviders effortlessly. Post your job and get connected with the right businessfessionals.",
	keywords: ["Thorbis", "businessfessional services", "find business", "contractors", "home imbusinessvement"],
	openGraph: {
		title: "Thorbis - Find businessfessional Services Easily",
		description: "Thorbis connects customers with businessfessional service businessviders effortlessly. Post your job and get connected with the right businessfessionals.",
		url: "https://thorbis",
		siteName: "Thorbis",
		images: [
			{
				url: "https://thorbis/og-image.jpg",
				width: 800,
				height: 600,
				alt: "Thorbis Logo",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Thorbis - Find businessfessional Services Easily",
		description: "Thorbis connects customers with businessfessional service businessviders effortlessly. Post your job and get connected with the right businessfessionals.",
		images: ["https://thorbis/twitter-image.jpg"],
	},
	alternates: {
		canonical: "https://thorbis",
		languages: {
			"en-US": "https://thorbis/en-US",
			"es-ES": "https://thorbis/es-ES",
		},
	},
};

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<SearchForm />
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
			</main>
		</>
	);
}

const jsonLdData = {
	"@context": "http://schema.org",
	"@type": "WebSite",
	url: "https://thorbis",
	name: "Thorbis",
	description: "Thorbis connects customers with businessfessional service businessviders effortlessly. Post your job and get connected with the right businessfessionals.",
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
