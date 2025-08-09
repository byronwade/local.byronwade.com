/**
 * BusinessCardList Component (Refactored)
 * Clean, focused business card list using extracted components and hooks
 * Reduced from 925 lines to clean, modular implementation
 * Following Next.js best practices for large-scale applications
 */

"use client";

import React, { useEffect } from "react";
import { ScrollArea } from "@components/ui/scroll-area";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { SortAsc, ChevronDown, Map, List, ArrowUp } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";

// Import extracted components and hooks
import { useBusinessCardList } from "@lib/hooks/map/use-business-card-list";
import { BusinessCard, GoogleStyleBusinessCard } from "./business-cards";
import SkeletonBusinessCard from "./skeleton-business-card";
import FilterPanel from "./filter-panel";
import MinimalistSearchHeader from "./minimalist-search-header";
import MinimalistEmptyState from "./minimalist-empty-state";
import { SORT_LABELS } from "@utils/sorting";

const BusinessCardList = ({ businesses, activeBusinessId, activeCardRef, onAIClick, onBusinessSelect, loading, showMap, onMapToggle, listMode }) => {
	const {
		// Data
		visibleBusinesses,
		filteredBusinesses,

		// State
		hoveredBusinessId,
		sortBy,
		showFilters,
		showSort,
		currentFilters,
		isLoadingMore,
		itemsToShow,

		// Refs
		listRef,
		activeCardElementRef,
		sentinelRef,

		// Handlers
		handleCardClick,
		handleCardHover,
		handleCardLeave,
		handleFilterClick,
		handleSortSelect,
		handleFiltersChange,
		handleClearFilters,
		handleKeyDown,

		// Utilities
		getUrgencyIndicator,
		getTrustScore,
		formatDistance,

		// Setters
		setShowFilters,
		setShowSort,
	} = useBusinessCardList(businesses);

	// Add keyboard event listener
	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	// Handle business selection callback
	useEffect(() => {
		if (activeBusinessId && onBusinessSelect) {
			const business = visibleBusinesses.find((b) => b.id === activeBusinessId);
			if (business) {
				onBusinessSelect(business);
			}
		}
	}, [activeBusinessId, visibleBusinesses, onBusinessSelect]);

	// Show loading state
	if (loading) {
		return (
			<div className="h-full flex flex-col">
				<MinimalistSearchHeader resultsCount={0} showMap={showMap} onMapToggle={onMapToggle} onFilterClick={handleFilterClick} showFilters={showFilters} onAIClick={onAIClick} />
				<div className="flex-1 p-4 space-y-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<SkeletonBusinessCard key={i} />
					))}
				</div>
			</div>
		);
	}

	// Show empty state
	if (!visibleBusinesses.length && !loading) {
		return (
			<div className="h-full flex flex-col">
				<MinimalistSearchHeader resultsCount={0} showMap={showMap} onMapToggle={onMapToggle} onFilterClick={handleFilterClick} showFilters={showFilters} onAIClick={onAIClick} />
				<div className="flex-1 flex items-center justify-center">
					<MinimalistEmptyState onClearFilters={handleClearFilters} />
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col bg-white">
			{/* Minimalistic Search Header */}
			<MinimalistSearchHeader resultsCount={filteredBusinesses.length} showMap={showMap} onMapToggle={onMapToggle} onFilterClick={handleFilterClick} showFilters={showFilters} onAIClick={onAIClick} />

			{/* Filter Panel */}
			{showFilters && <FilterPanel filters={currentFilters} onFiltersChange={handleFiltersChange} onClose={() => setShowFilters(false)} />}

			{/* Sort Controls */}
			<div className="flex items-center justify-between p-4 border-b bg-gray-50">
				<div className="flex items-center space-x-3">
					{/* Sort Dropdown */}
					<DropdownMenu open={showSort} onOpenChange={setShowSort}>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="flex items-center space-x-1">
								<SortAsc className="w-4 h-4" />
								<span>Sort: {SORT_LABELS[sortBy] || "Relevance"}</span>
								<ChevronDown className="w-3 h-3" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48">
							{Object.entries(SORT_LABELS).map(([value, label]) => (
								<DropdownMenuItem key={value} onClick={() => handleSortSelect(value)} className={sortBy === value ? "bg-primary/10 font-medium" : ""}>
									{label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Results Count */}
					<span className="text-sm text-gray-600">
						Showing {itemsToShow} of {filteredBusinesses.length} results
					</span>
				</div>

				{/* View Toggle */}
				<div className="flex items-center space-x-1">
					<Button variant={listMode === "list" ? "default" : "outline"} size="sm" className="px-2">
						<List className="w-4 h-4" />
					</Button>
					<Button variant={listMode === "google" ? "default" : "outline"} size="sm" className="px-2">
						<Map className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Business List */}
			<ScrollArea className="flex-1" ref={listRef}>
				<div className="p-4 space-y-4">
					{visibleBusinesses.map((business, index) => {
						const isActive = business.id === activeBusinessId;
						const ref = isActive ? activeCardElementRef : null;

						// Render different card styles based on listMode
						if (listMode === "google") {
							return (
								<div key={business.id} ref={ref} onClick={() => handleCardClick(business)} onMouseEnter={() => handleCardHover(business)} onMouseLeave={() => handleCardLeave(business)}>
									<GoogleStyleBusinessCard business={business} isActive={isActive} />
								</div>
							);
						}

						return <BusinessCard key={business.id} ref={ref} business={business} isActive={isActive} handleClick={handleCardClick} isLoading={loading} onHover={handleCardHover} onLeave={handleCardLeave} />;
					})}

					{/* Loading More Indicator */}
					{isLoadingMore && (
						<div className="flex items-center justify-center py-4">
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
							<span className="text-sm text-gray-600">Loading more results...</span>
						</div>
					)}

					{/* Intersection Observer Sentinel */}
					<div ref={sentinelRef} className="h-4" />

					{/* Load More Button for manual loading */}
					{!isLoadingMore && itemsToShow < filteredBusinesses.length && (
						<div className="flex justify-center py-4">
							<Button variant="outline" onClick={() => setVisibleStartIndex((prev) => prev + 20)} className="flex items-center space-x-2">
								<ArrowUp className="w-4 h-4 rotate-180" />
								<span>Load More ({filteredBusinesses.length - itemsToShow} remaining)</span>
							</Button>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
};

export default BusinessCardList;
