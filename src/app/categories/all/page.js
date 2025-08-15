import React from "react";
import AllCategoriesPage from "@components/site/categories/all-categories-page";

export const metadata = {
	title: "All Business Categories - Complete Directory | Thorbis",
	description: "Browse our complete directory of business categories. Search and filter through thousands of business types to find exactly what you need.",
	keywords: ["all business categories", "complete directory", "business types", "local services", "business search"],
	openGraph: {
		title: "All Business Categories - Complete Directory | Thorbis",
		description: "Browse our complete directory of business categories. Search and filter through thousands of business types to find exactly what you need.",
		url: "https://thorbis.com/categories/all",
		siteName: "Thorbis",
		images: [
			{
				url: `https://thorbis.com/opengraph-image?title=${encodeURIComponent("All Business Categories")}&description=${encodeURIComponent("Complete directory of business types to find exactly what you need.")}`,
				width: 1200,
				height: 630,
				alt: "Thorbis All Categories",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "All Business Categories - Thorbis",
		description: "Browse the complete category directory.",
		images: [`https://thorbis.com/twitter-image?title=${encodeURIComponent("All Business Categories")}`],
	},
	alternates: {
		canonical: "https://thorbis.com/categories/all",
	},
};

export default function AllCategories() {
	return <AllCategoriesPage />;
}
