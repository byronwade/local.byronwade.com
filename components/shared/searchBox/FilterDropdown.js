// components/FilterDropdown.js
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@components/ui/dropdown-menu";
import { ChevronRight, ChevronDown, X } from "react-feather";
import { Button } from "@components/ui/button";
import { FunnelIcon } from "@heroicons/react/24/solid";

const FilterDropdown = () => {
	return (
		<DropdownMenu>
			<div className="relative flex items-center">
				<DropdownMenuTrigger asChild>
					<Button className="relative flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3" type="button">
						<FunnelIcon className="w-4 h-4" />
						<span className="hidden sm:block">Filters</span>
						<ChevronDown className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<div className="absolute right-0 flex items-center justify-center h-full pr-1.5">
					<Button size="icon" className="w-5 h-5">
						<X className="w-4 h-4" />
					</Button>
				</div>
			</div>
			<DropdownMenuContent className="mt-2 bg-black rounded-md shadow-lg w-80">
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<DropdownMenuItem className="flex items-center justify-between w-full text-white bg-transparent border-none">
									Ratings
									<ChevronRight className="w-4 h-4" />
								</DropdownMenuItem>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="ml-6 bg-black rounded-md shadow-lg w-80">
								<DropdownMenuGroup>
									<DropdownMenuCheckboxItem>1 Star & Above</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem>2 Stars & Above</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem>3 Stars & Above</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem>4 Stars & Above</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem>5 Stars</DropdownMenuCheckboxItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<DropdownMenuItem className="flex items-center justify-between w-full text-white bg-transparent border-none">
									Hours Open
									<ChevronRight className="w-4 h-4" />
								</DropdownMenuItem>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="ml-6 bg-black rounded-md shadow-lg w-80">
								<DropdownMenuGroup>
									<DropdownMenuCheckboxItem>Open Now</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem>Open 24/7</DropdownMenuCheckboxItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<DropdownMenuItem className="flex items-center justify-between w-full text-white bg-transparent border-none">
									Price
									<ChevronRight className="w-4 h-4" />
								</DropdownMenuItem>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="ml-6 bg-black rounded-md shadow-lg w-80">
								<DropdownMenuGroup>
									<DropdownMenuCheckboxItem>$</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem>$$</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem>$$$</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem>$$$$</DropdownMenuCheckboxItem>
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
