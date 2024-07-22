// components/SortDropdown.js
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "react-feather";
import { Button } from "@/components/ui/button";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import useSearchStore from "@/store/useSearchStore";

const SortDropdown = () => {
	const { sortOption, handleSortChange, handleResetFilters, isSortModified } = useSearchStore((state) => ({
		sortOption: state.sortOption,
		handleSortChange: state.handleSortChange,
		handleResetFilters: state.handleResetFilters,
		isSortModified: state.isSortModified,
	}));

	return (
		<DropdownMenu>
			<div className="relative flex items-center">
				<DropdownMenuTrigger asChild>
					<Button className="flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:w-24 sm:px-3" id="sort-toggle" type="button">
						<AdjustmentsHorizontalIcon className="w-4 h-4" />
						<div className="hidden sm:block">Sort</div>
						<ChevronDown className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				{isSortModified && (
					<div className="absolute right-0 flex items-center justify-center h-full pr-1.5">
						<Button size="icon" className="w-5 h-5" onClick={() => handleResetFilters("sort")}>
							<X className="w-4 h-4" />
						</Button>
					</div>
				)}
			</div>
			<DropdownMenuContent className="w-56 mt-2 bg-black rounded-md shadow-lg">
				<DropdownMenuLabel>Sort By</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup value={sortOption} onValueChange={handleSortChange}>
					<DropdownMenuRadioItem value="recommended">Recommended</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="ratingHighToLow">Rating: High to Low</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="ratingLowToHigh">Rating: Low to High</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="priceLowToHigh">Price: Low to High</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="priceHighToLow">Price: High to Low</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SortDropdown;
