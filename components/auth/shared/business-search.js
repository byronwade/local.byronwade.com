import React from "react";
import { Button } from "@components/ui/button";
import SearchBarOnly from "@components/shared/searchBox/SearchBarOnly";

export default function BusinessSearch() {
	return (
		<div className="mt-10">
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left ">Search for Business</h2>
			<p className="text-sm leading-6 text-left text-muted-foreground">Find the business you&apos;re looking for</p>
			<div className="mt-4">
				<SearchBarOnly />
			</div>
			<div className="mt-8">
				<p className="text-sm leading-6 text-left text-muted-foreground">If you can&apos;t find your business add one here.</p>

				<div className="flex flex-row justify-between w-full mt-4">
					<Button variant="outline" className="w-full">
						Add Business
					</Button>
				</div>
			</div>
		</div>
	);
}
