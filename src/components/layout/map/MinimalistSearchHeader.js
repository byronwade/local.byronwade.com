"use client";

import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Map, List, Filter, ChevronDown, Bot, MapPin } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { withErrorHandling } from "@utils/errorHandler";

const MinimalistSearchHeader = ({ resultsCount = 0, openCount = 0, searchQuery = "", searchLocation = "", showMap = true, sortBy = "relevance", onMapToggle, onFilterClick, onSortChange, onAIClick, loading = false, className = "" }) => {
	const [showSort, setShowSort] = useState(false);

	const sortOptions = [
		{ value: "relevance", label: "Best Match" },
		{ value: "rating", label: "Highest Rated" },
		{ value: "distance", label: "Nearest" },
		{ value: "reviews", label: "Most Reviews" },
		{ value: "name", label: "Alphabetical" },
	];

	const handleSortSelect = withErrorHandling((value) => {
		setShowSort(false);
		if (onSortChange) {
			onSortChange(value);
		}
	}, "MinimalistSearchHeader");

	const formatResultsText = () => {
		if (loading) return "Searching...";
		if (resultsCount === 0) return "0 results";
		return `${resultsCount.toLocaleString()} result${resultsCount !== 1 ? "s" : ""}`;
	};

	const formatSearchText = () => {
		if (!searchQuery && !searchLocation) return null;

		const parts = [];
		if (searchQuery) parts.push(`"${searchQuery}"`);
		if (searchLocation) parts.push(`near ${searchLocation}`);

		return parts.join(" ");
	};

	return (
		<div className={`bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 ${className}`}>
			<div className="px-4 py-3">
				{/* Top Row - Results Count and Search Info */}
				<div className="flex items-center justify-between mb-3">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-3">
							{/* Results Count */}
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white">{formatResultsText()}</h2>

							{/* Open Count Badge */}
							{!loading && resultsCount > 0 && (
								<Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/30">
									<div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5" />
									{openCount} open
								</Badge>
							)}
						</div>

						{/* Search Query */}
						{formatSearchText() && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{formatSearchText()}</p>}
					</div>
				</div>

				{/* Bottom Row - Controls */}
				<div className="flex items-center justify-between">
					{/* Left Side - View Toggle */}
					<div className="flex items-center gap-2">
						{onMapToggle && (
							<Button variant={showMap ? "default" : "outline"} size="sm" onClick={onMapToggle} className="h-9 px-3 text-sm">
								{showMap ? (
									<>
										<Map className="w-4 h-4 mr-2" />
										Map View
									</>
								) : (
									<>
										<List className="w-4 h-4 mr-2" />
										List View
									</>
								)}
							</Button>
						)}

						{onAIClick && (
							<Button variant="outline" size="sm" onClick={onAIClick} className="h-9 px-3 text-sm bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50">
								<Bot className="w-4 h-4 mr-2" />
								AI Assistant
							</Button>
						)}
					</div>

					{/* Right Side - Filter and Sort */}
					<div className="flex items-center gap-2">
						{/* Filter Button */}
						{onFilterClick && (
							<Button variant="outline" size="sm" onClick={onFilterClick} className="h-9 px-3 text-sm">
								<Filter className="w-4 h-4 mr-2" />
								Filters
							</Button>
						)}

						{/* Sort Dropdown */}
						{onSortChange && (
							<DropdownMenu open={showSort} onOpenChange={setShowSort}>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="h-9 px-3 text-sm min-w-[120px] justify-between">
										<span className="truncate">{sortOptions.find((option) => option.value === sortBy)?.label || "Sort"}</span>
										<ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									{sortOptions.map((option) => (
										<DropdownMenuItem key={option.value} onClick={() => handleSortSelect(option.value)} className="cursor-pointer">
											{option.label}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MinimalistSearchHeader;
