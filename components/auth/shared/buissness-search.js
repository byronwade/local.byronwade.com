import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { ArrowRight } from "react-feather";
import SearchBarOnly from "@components/shared/searchBox/SearchBarOnly";

export default function BuissnessSearch() {
	return (
		<div className="mt-10">
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 dark:text-gray-200">Search for Buissness</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">Find the buissness your looking for</p>
			<div className="mt-4">
				<SearchBarOnly />
			</div>
			<div className="mt-8">
				<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-400">If you cant find your buissness add one here.</p>

				<div className="flex flex-row justify-between w-full mt-4">
					<Link href="/add-a-business" passHref legacyBehavior>
						<Button variant="brand" type="submit">
							Add a business here <ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
