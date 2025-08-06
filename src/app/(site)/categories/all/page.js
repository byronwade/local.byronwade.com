import React from "react";
import AllCategoriesPage from "@components/site/categories/AllCategoriesPage";

export const metadata = {
	title: "All Business Categories - Complete Directory | Thorbis",
	description: "Browse our complete directory of business categories. Search and filter through thousands of business types to find exactly what you need.",
	keywords: ["all business categories", "complete directory", "business types", "local services", "business search"],
	openGraph: {
		title: "All Business Categories - Complete Directory | Thorbis",
		description: "Browse our complete directory of business categories. Search and filter through thousands of business types to find exactly what you need.",
		url: "https://www.thorbis.com/categories/all",
		siteName: "Thorbis",
		images: [
			{
				url: "https://www.thorbis.com/og-all-categories.jpg",
				width: 800,
				height: 600,
				alt: "Thorbis All Categories",
			},
		],
		locale: "en_US",
		type: "website",
	},
};

export default function AllCategories() {
	return <AllCategoriesPage />;
}
