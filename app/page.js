import Header from "@/components/site/Header";
import SearchBox from "@/components/shared/SearchBox";

export const metadata = {
	title: "Thorbis - Discover and Review Local Services",
	description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
	keywords: ["Thorbis", "professional services", "find professionals", "contractors", "home improvement", "local businesses", "reviews"],
	openGraph: {
		title: "Thorbis - Discover and Review Local Services",
		description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
		url: "https://www.thorbis.com",
		siteName: "Thorbis",
		images: [
			{
				url: "https://www.thorbis.com/og-image.jpg",
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
		images: ["https://www.thorbis.com/twitter-image.jpg"],
		creator: "@thorbis",
	},
	alternates: {
		canonical: "https://www.thorbis.com",
		languages: {
			"en-US": "https://www.thorbis.com/en-US",
			"es-ES": "https://www.thorbis.com/es-ES",
		},
	},
	robots: "index, follow",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "directory",
	bookmarks: ["https://www.thorbis.com/"],
	generator: "Next.js",
	applicationName: "Thorbis",
	authors: [{ name: "Byron Wade", url: "https://www.thorbis.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	ogLocale: "en_US",
};

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<div>
					<h1>Thorbis is the best of all</h1>
					<SearchBox />
				</div>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
			</main>
		</>
	);
}

const jsonLdData = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	url: "https://www.thorbis.com",
	name: "Thorbis",
	description: "Thorbis connects customers with local professional services effortlessly. Post your job and get connected with the right professionals. Read reviews and find the best local businesses.",
	publisher: {
		"@type": "Organization",
		name: "Thorbis",
		logo: {
			"@type": "ImageObject",
			url: "https://www.thorbis.com/logo.png",
		},
	},
	potentialAction: {
		"@type": "SearchAction",
		target: "https://www.thorbis.com/search?q={search_term_string}",
		"query-input": "required name=search_term_string",
	},
	sameAs: ["https://www.facebook.com/thorbis", "https://www.instagram.com/thorbis/?hl=en"],
	logo: "https://www.thorbis.com/logo.png",
	image: "https://www.thorbis.com/og-image.jpg",
};
