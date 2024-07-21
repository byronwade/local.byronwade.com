// components/FilterDropdown.js
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { ChevronRight, ChevronDown, X } from "react-feather";
import { Button } from "@/components/ui/button";
import { FunnelIcon } from "@heroicons/react/24/solid";
import useSearchStore from "@/store/useSearchStore";

const FilterDropdown = () => {
	const { filterCount, isRatingModified, isOpenModified, isPriceModified, ratingFilters, openFilters, priceFilters, handleFilterChange, handleResetFilters } = useSearchStore((state) => ({
		filterCount: state.filterCount,
		isRatingModified: state.isRatingModified,
		isOpenModified: state.isOpenModified,
		isPriceModified: state.isPriceModified,
		ratingFilters: state.ratingFilters,
		openFilters: state.openFilters,
		priceFilters: state.priceFilters,
		handleFilterChange: state.handleFilterChangeCallback,
		handleResetFilters: state.handleResetFilters,
	}));

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="relative flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3" type="button">
					<FunnelIcon className="w-4 h-4" />
					<span className="hidden sm:block">Filters {filterCount > 0 && `(${filterCount})`}</span>
					<ChevronDown className="w-4 h-4" />
				</Button>
			</DropdownMenuTrigger>
			{(isRatingModified || isOpenModified || isPriceModified) && (
				<Button size="icon" className="w-5 h-5 mt-1.5 -ml-8 mr-1 z-50">
					<X className="w-4 h-4" onClick={(e) => handleResetFilters("filters", e)} />
				</Button>
			)}
			<DropdownMenuContent className="mt-2 bg-black rounded-md shadow-lg w-80">
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<DropdownMenuItem className="flex items-center justify-between w-full text-white bg-transparent border-none">
									Ratings {Object.values(ratingFilters).filter(Boolean).length > 0 && `(${Object.values(ratingFilters).filter(Boolean).length})`}
									<ChevronRight className="w-4 h-4" />
								</DropdownMenuItem>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="ml-6 bg-black rounded-md shadow-lg w-80">
								<DropdownMenuGroup>
									<DropdownMenuCheckboxItem checked={ratingFilters.oneStar} onCheckedChange={(value) => handleFilterChange("rating", "oneStar", value)}>
										1 Star & Above
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem checked={ratingFilters.twoStars} onCheckedChange={(value) => handleFilterChange("rating", "twoStars", value)}>
										2 Stars & Above
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem checked={ratingFilters.threeStars} onCheckedChange={(value) => handleFilterChange("rating", "threeStars", value)}>
										3 Stars & Above
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem checked={ratingFilters.fourStars} onCheckedChange={(value) => handleFilterChange("rating", "fourStars", value)}>
										4 Stars & Above
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem checked={ratingFilters.fiveStars} onCheckedChange={(value) => handleFilterChange("rating", "fiveStars", value)}>
										5 Stars
									</DropdownMenuCheckboxItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<DropdownMenuItem className="flex items-center justify-between w-full text-white bg-transparent border-none">
									Hours Open {Object.values(openFilters).filter(Boolean).length > 0 && `(${Object.values(openFilters).filter(Boolean).length})`}
									<ChevronRight className="w-4 h-4" />
								</DropdownMenuItem>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="ml-6 bg-black rounded-md shadow-lg w-80">
								<DropdownMenuGroup>
									<DropdownMenuCheckboxItem checked={openFilters.openNow} onCheckedChange={(value) => handleFilterChange("open", "openNow", value)}>
										Open Now
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem checked={openFilters.open24Hours} onCheckedChange={(value) => handleFilterChange("open", "open24Hours", value)}>
										Open 24/7
									</DropdownMenuCheckboxItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<DropdownMenuItem className="flex items-center justify-between w-full text-white bg-transparent border-none">
									Price {Object.values(priceFilters).filter(Boolean).length > 0 && `(${Object.values(priceFilters).filter(Boolean).length})`}
									<ChevronRight className="w-4 h-4" />
								</DropdownMenuItem>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="ml-6 bg-black rounded-md shadow-lg w-80">
								<DropdownMenuGroup>
									<DropdownMenuCheckboxItem checked={priceFilters.oneDollar} onCheckedChange={(value) => handleFilterChange("price", "oneDollar", value)}>
										$
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem checked={priceFilters.twoDollars} onCheckedChange={(value) => handleFilterChange("price", "twoDollars", value)}>
										$$
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem checked={priceFilters.threeDollars} onCheckedChange={(value) => handleFilterChange("price", "threeDollars", value)}>
										$$$
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem checked={priceFilters.fourDollars} onCheckedChange={(value) => handleFilterChange("price", "fourDollars", value)}>
										$$$$
									</DropdownMenuCheckboxItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default FilterDropdown;
