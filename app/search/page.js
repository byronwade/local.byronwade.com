import React from "react";
import Script from "next/script";
import SearchContainer from "@components/site/map/SearchContainer";
import InitialSearch from "@components/site/search/InitialSearch";
import "mapbox-gl/dist/mapbox-gl.css";

export const metadata = {
	metadataBase: new URL("https://www.thorbis.com/"),
	title: {
		default: "Search Results - Thorbis",
		template: "%s | Thorbis",
	},
	description: "Search results for local businesses on Thorbis. Find and connect with top-rated businesses in your area.",
	generator: "Next.js",
	applicationName: "Thorbis",
	keywords: ["Business Directory", "Local Business Search", "Find Businesses", "Business Reviews", "Business Listings"],
	authors: [{ name: "Byron Wade" }, { name: "Byron Wade", url: "https://www.thorbis.com/" }],
	creator: "Byron Wade",
	publisher: "Byron Wade",
	robots: "index, follow",
	alternates: {
		canonical: "https://www.thorbis.com",
		languages: {
			"en-US": "https://www.thorbis.com/en-US",
			"es-ES": "https://www.thorbis.com/es-ES",
		},
	},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	category: "directory",
	bookmarks: ["https://www.thorbis.com/"],
	twitter: {
		card: "summary_large_image",
		title: "Search Results - Thorbis",
		description: "Search results for local businesses on Thorbis. Find and connect with top-rated businesses in your area.",
		creator: "@thorbis",
		images: {
			url: "https://www.thorbis.com/_next/image?url=%2FThorbisLogo.webp&w=96&q=75",
			alt: "Thorbis Social Logo",
		},
	},
	openGraph: {
		title: "Search Results - Thorbis",
		description: "Search results for local businesses on Thorbis. Find and connect with top-rated businesses in your area.",
		url: "https://www.thorbis.com",
		siteName: "Thorbis",
		images: [
			{
				url: "https://www.thorbis.com/api/og?title=Search%20Results%20-%20Thorbis&description=Find%20and%20connect%20with%20top-rated%20local%20businesses",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.thorbis.com/api/og?title=Search%20Results%20-%20Thorbis&description=Find%20and%20connect%20with%20top-rated%20local%20businesses",
				width: 1800,
				height: 1600,
				alt: "Thorbis",
			},
		],
		locale: "en-US",
		type: "website",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "SearchResultsPage",
	name: "Thorbis Search Results",
	description: "Search results for local businesses on Thorbis. Find and connect with top-rated businesses in your area.",
	url: "https://www.thorbis.com",
	logo: "https://www.thorbis.com/_next/image?url=%2FThorbisLogo.webp&w=96&q=75",
	image: "https://www.thorbis.com/api/og?title=Search%20Results%20-%20Thorbis&description=Find%20and%20connect%20with%20top-rated%20local%20businesses",
	sameAs: ["https://www.facebook.com/thorbis", "https://www.instagram.com/thorbis/?hl=en"],
	potentialAction: {
		"@type": "SearchAction",
		target: "https://www.thorbis.com/search?q={search_term_string}",
		"query-input": "required name=search_term_string",
	},
};

// This component will handle the conditional rendering based on search params
function SearchPageContent({ searchParams }) {
	const query = searchParams?.query || searchParams?.q || "";

	// If there's a search query, show the full-screen map view, otherwise show initial search
	if (query) {
		return <SearchContainer />;
	}

	return <InitialSearch />;
}

export default function Search({ searchParams }) {
	return (
		<>
			<SearchPageContent searchParams={searchParams} />
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
		</>
	);
}
