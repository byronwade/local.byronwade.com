import React from "react";
import SearchBarOnly from "@components/shared/searchBox/SearchBarOnly";

export default function BuissnessSearch() {
	return (
		<div className="mt-10">
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Search for Buissness</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Find the buissness your looking for</p>
			<div className="mt-4">
				<SearchBarOnly />
			</div>
		</div>
	);
}
