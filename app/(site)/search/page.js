import React from "react";
import SearchContainer from "@/components/site/map/SearchContainer";
import "mapbox-gl/dist/mapbox-gl.css";
import Script from "next/script";

export const metadata = {
	metadataBase: new URL("https://www.thorbis.com/"),
	title: {
		default: "Thorbis - Discover and Connect with Local Businesses",
		template: "%s | Thorbis",
	},
	description: "Thorbis provides a powerful platform to discover and connect with top-rated local businesses. Explore and find businesses in your area with ease.",
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
		title: "Thorbis - Discover and Connect with Local Businesses",
		description: "Explore top-rated local businesses with Thorbis. Your comprehensive platform for finding and connecting with businesses in your area.",
		creator: "@thorbis",
		images: {
			url: "https://www.thorbis.com/_next/image?url=%2FThorbisLogo.webp&w=96&q=75",
			alt: "Thorbis Social Logo",
		},
	},
	openGraph: {
		title: "Thorbis - Discover and Connect with Local Businesses",
		description: "Explore top-rated local businesses with Thorbis. Your comprehensive platform for finding and connecting with businesses in your area.",
		url: "https://www.thorbis.com",
		siteName: "Thorbis",
		images: [
			{
				url: "https://www.thorbis.com/api/og?title=Thorbis%20-%20Discover%20and%20Connect%20with%20Local%20Businesses&description=Find%20and%20connect%20with%20top-rated%20local%20businesses",
				width: 800,
				height: 600,
			},
			{
				url: "https://www.thorbis.com/api/og?title=Thorbis%20-%20Discover%20and%20Connect%20with%20Local%20Businesses&description=Find%20and%20connect%20with%20top-rated%20local%20businesses",
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
	"@type": "SearchService",
	name: "Thorbis",
	description: "Thorbis provides a powerful platform to discover and connect with top-rated local businesses. Explore and find businesses in your area with ease.",
	url: "https://www.thorbis.com",
	logo: "https://www.thorbis.com/_next/image?url=%2FThorbisLogo.webp&w=96&q=75",
	image: "https://www.thorbis.com/api/og?title=Thorbis%20-%20Discover%20and%20Connect%20with%20Local%20Businesses&description=Find%20and%20connect%20with%20top-rated%20local%20businesses",
	sameAs: ["https://www.facebook.com/thorbis", "https://www.instagram.com/thorbis/?hl=en"],
	potentialAction: {
		"@type": "SearchAction",
		target: "https://www.thorbis.com/search?q={search_term_string}",
		"query-input": "required name=search_term_string",
	},
};

export default function Search() {
	return (
		<>
			<Script data-testid="ldjson" id="json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, "\t") }} />
			<div>
				<SearchContainer />
			</div>
		</>
	);
}
