import React from "react";
import Script from "next/script";
import SearchContainer from "@components/site/map/SearchContainer";
import "mapbox-gl/dist/mapbox-gl.css";

export const metadata = {
	metadataBase: new URL("https://www.thorbis.com/"),
	title: {
		default: "Search Local Businesses - Interactive Map | Thorbis",
		template: "%s | Thorbis",
	},
	description: "Search and discover local businesses on our interactive map. Find restaurants, services, and businesses near you with real-time results and verified reviews.",
	generator: "Next.js",
	applicationName: "Thorbis",
	keywords: ["Business Directory", "Local Business Search", "Interactive Map", "Find Businesses", "Business Reviews", "Business Listings", "Map Search"],
	authors: [{ name: "Byron Wade" }, { name: "Byron Wade", url: "https://www.thorbis.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	robots: "index, follow",
	alternates: {
		canonical: "https://www.thorbis.com/search",
		languages: {
			"en-US": "https://www.thorbis.com/en-US/search",
			"es-ES": "https://www.thorbis.com/es-ES/search",
		},
	},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "directory",
	bookmarks: ["https://www.thorbis.com/search"],
	twitter: {
		card: "summary_large_image",
		title: "Search Local Businesses - Interactive Map | Thorbis",
		description: "Search and discover local businesses on our interactive map. Find restaurants, services, and businesses near you with real-time results.",
		creator: "@thorbis",
		images: {
			url: "https://www.thorbis.com/_next/image?url=%2FThorbisLogo.webp&w=96&q=75",
			alt: "Thorbis Social Logo",
		},
	},
	openGraph: {
		title: "Search Local Businesses - Interactive Map | Thorbis",
		description: "Search and discover local businesses on our interactive map. Find restaurants, services, and businesses near you with real-time results and verified reviews.",
		url: "https://www.thorbis.com/search",
		siteName: "Thorbis",
		images: [
			{
				url: "https://www.thorbis.com/api/og?title=Search%20Local%20Businesses%20-%20Interactive%20Map&description=Find%20and%20discover%20businesses%20near%20you",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.thorbis.com/api/og?title=Search%20Local%20Businesses%20-%20Interactive%20Map&description=Find%20and%20discover%20businesses%20near%20you",
				width: 1800,
				height: 1600,
				alt: "Thorbis Interactive Map",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "SearchResultsPage",
	name: "Thorbis Business Search",
	description: "Search and discover local businesses on our interactive map. Find restaurants, services, and businesses near you with real-time results and verified reviews.",
	url: "https://www.thorbis.com/search",
	logo: "https://www.thorbis.com/_next/image?url=%2FThorbisLogo.webp&w=96&q=75",
	image: "https://www.thorbis.com/api/og?title=Search%20Local%20Businesses%20-%20Interactive%20Map&description=Find%20and%20discover%20businesses%20near%20you",
	sameAs: ["https://www.facebook.com/thorbis", "https://www.instagram.com/thorbis/?hl=en"],
	potentialAction: {
		"@type": "SearchAction",
		target: "https://www.thorbis.com/search?q={search_term_string}",
		"query-input": "required name=search_term_string",
	},
	mainEntity: {
		"@type": "Map",
		name: "Interactive Business Search Map",
		description: "Interactive map for searching and discovering local businesses",
	},
};

export default function Search({ searchParams }) {
	return (
		<>
			{/* Always show the map-based search interface */}
			<SearchContainer searchParams={searchParams} />
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
		</>
	);
}
