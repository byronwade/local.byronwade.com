// components/SortDropdown.js
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel } from "@components/ui/dropdown-menu";
import { ChevronDown, X, Star, DollarSign, TrendingUp } from "react-feather";
import { Button } from "@components/ui/button";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";

const SortDropdown = () => {
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
				<div className="absolute right-0 flex items-center justify-center h-full pr-1.5">
					<Button size="icon" className="w-5 h-5">
						<X className="w-4 h-4" />
					</Button>
				</div>
			</div>
			<DropdownMenuContent className="w-64">
				<DropdownMenuLabel>Sort Options</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup>
					<DropdownMenuRadioItem value="recommended" className="flex items-center gap-3 py-2.5">
						<div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
							<TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-medium">Recommended</span>
							<span className="text-xs text-muted-foreground">Best matches for you</span>
						</div>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="ratingHighToLow" className="flex items-center gap-3 py-2.5">
						<div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
							<Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-medium">Rating: High to Low</span>
							<span className="text-xs text-muted-foreground">Best rated first</span>
						</div>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="ratingLowToHigh" className="flex items-center gap-3 py-2.5">
						<div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
							<Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-medium">Rating: Low to High</span>
							<span className="text-xs text-muted-foreground">Lowest rated first</span>
						</div>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="priceLowToHigh" className="flex items-center gap-3 py-2.5">
						<div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
							<DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-medium">Price: Low to High</span>
							<span className="text-xs text-muted-foreground">Cheapest first</span>
						</div>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="priceHighToLow" className="flex items-center gap-3 py-2.5">
						<div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
							<DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-medium">Price: High to Low</span>
							<span className="text-xs text-muted-foreground">Most expensive first</span>
						</div>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SortDropdown;
