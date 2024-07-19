// app/page.tsx

import Header from "@/components/site/Header";

export const metadata = {
	title: "Thorbis - Discover and Review Local Services",
	description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
	keywords: ["Thorbis", "professional services", "find professionals", "contractors", "home improvement", "local businesses", "reviews"],
	openGraph: {
		title: "Thorbis - Discover and Review Local Services",
		description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
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
		title: "Thorbis - Discover and Review Local Services",
		description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
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
				<div>home page</div>
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
	description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
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
