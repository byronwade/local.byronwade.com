/**
 * QuickFilterPills Component
 * Compact filter pills for common search filters
 * Provides quick access to frequently used filters
 */

"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ScrollArea } from "@components/ui/scroll-area";
import { Star, Clock, MapPin, DollarSign, Verified, Zap, TrendingUp, Users } from "lucide-react";
import { withErrorHandling } from "@utils/error-handler";
import { logger } from "@utils/logger";

const QuickFilterPills = ({ onFilterChange, activeFilters = {}, className = "", totalResults = 0, loading = false }) => {
	const [processingFilter, setProcessingFilter] = useState(null);

	// Quick filter definitions with icons and descriptions
	const quickFilters = [
		{
			id: "open_now",
			label: "Open Now",
			icon: Clock,
			color: "emerald",
			description: "Currently open businesses",
			filterKey: "openNow",
			filterValue: true,
			shortcut: "o",
		},
		{
			id: "highly_rated",
			label: "4.5+ Stars",
			icon: Star,
			color: "yellow",
			description: "Highly rated businesses",
			filterKey: "rating",
			filterValue: 4.5,
			shortcut: "r",
		},
		{
			id: "nearby",
			label: "Nearby",
			icon: MapPin,
			color: "blue",
			description: "Within 5 miles",
			filterKey: "distance",
			filterValue: 5,
			shortcut: "n",
		},
		{
			id: "budget_friendly",
			label: "Budget",
			icon: DollarSign,
			color: "green",
			description: "Budget-friendly options",
			filterKey: "priceRange",
			filterValue: "$",
			shortcut: "b",
		},
		{
			id: "verified",
			label: "Verified",
			icon: Verified,
			color: "blue",
			description: "Verified businesses",
			filterKey: "verified",
			filterValue: true,
			shortcut: "v",
		},
		{
			id: "trending",
			label: "Trending",
			icon: TrendingUp,
			color: "purple",
			description: "Popular right now",
			filterKey: "trending",
			filterValue: true,
			shortcut: "t",
		},
		{
			id: "fast_response",
			label: "Quick Response",
			icon: Zap,
			color: "orange",
			description: "Responds within 1 hour",
			filterKey: "responseTime",
			filterValue: "1h",
			shortcut: "q",
		},
		{
			id: "highly_hired",
			label: "Most Hired",
			icon: Users,
			color: "indigo",
			description: "Frequently hired",
			filterKey: "hiredCount",
			filterValue: "high",
			shortcut: "h",
		},
	];

	const colorClasses = {
		emerald: {
			active: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
			inactive: "hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-200 dark:hover:border-emerald-800",
		},
		yellow: {
			active: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
			inactive: "hover:bg-yellow-50 dark:hover:bg-yellow-950/20 hover:border-yellow-200 dark:hover:border-yellow-800",
		},
		blue: {
			active: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
			inactive: "hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800",
		},
		green: {
			active: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
			inactive: "hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-200 dark:hover:border-green-800",
		},
		purple: {
			active: "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700",
			inactive: "hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-200 dark:hover:border-purple-800",
		},
		orange: {
			active: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700",
			inactive: "hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-200 dark:hover:border-orange-800",
		},
		indigo: {
			active: "bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700",
			inactive: "hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:border-indigo-200 dark:hover:border-indigo-800",
		},
	};

	// Handle filter pill click
	const handleFilterClick = useCallback(
		withErrorHandling(async (filter) => {
			if (loading || processingFilter === filter.id) return;

			setProcessingFilter(filter.id);

			try {
				const isActive = activeFilters[filter.filterKey] === filter.filterValue;
				const newFilters = { ...activeFilters };

				if (isActive) {
					// Remove filter
					delete newFilters[filter.filterKey];
				} else {
					// Add/update filter
					newFilters[filter.filterKey] = filter.filterValue;
				}

				logger.interaction({
					type: "quick_filter_toggle",
					filterId: filter.id,
					filterKey: filter.filterKey,
					filterValue: filter.filterValue,
					action: isActive ? "remove" : "add",
					totalResults,
					timestamp: Date.now(),
				});

				await onFilterChange(newFilters);
			} finally {
				setProcessingFilter(null);
			}
		}, "QuickFilterPills"),
		[activeFilters, onFilterChange, loading, processingFilter, totalResults]
	);

	// Get active filter count
	const activeFilterCount = Object.keys(activeFilters).length;

	// Handle keyboard shortcuts
	React.useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.ctrlKey || e.metaKey) {
				const filter = quickFilters.find((f) => f.shortcut === e.key.toLowerCase());
				if (filter) {
					e.preventDefault();
					handleFilterClick(filter);
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleFilterClick]);

	return (
		<div className={`bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 ${className}`}>
			<div className="px-3 py-2">
				{/* Header */}
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2">
						<h3 className="text-sm font-medium text-gray-900 dark:text-white">Quick Filters</h3>
						{activeFilterCount > 0 && (
							<Badge variant="secondary" className="h-5 px-1.5 text-xs">
								{activeFilterCount}
							</Badge>
						)}
					</div>
					{activeFilterCount > 0 && (
						<Button variant="ghost" size="sm" onClick={() => onFilterChange({})} className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
							Clear All
						</Button>
					)}
				</div>

				{/* Filter Pills */}
				<ScrollArea className="w-full">
					<div className="flex gap-2 pb-1">
						{quickFilters.map((filter) => {
							const Icon = filter.icon;
							const isActive = activeFilters[filter.filterKey] === filter.filterValue;
							const isProcessing = processingFilter === filter.id;
							const colorClass = colorClasses[filter.color];

							return (
								<Button
									key={filter.id}
									variant="outline"
									size="sm"
									onClick={() => handleFilterClick(filter)}
									disabled={loading || isProcessing}
									className={`
                    h-7 px-3 text-xs font-medium whitespace-nowrap flex-shrink-0
                    border border-gray-200 dark:border-gray-700
                    transition-all duration-200
                    ${isActive ? colorClass.active : `bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 ${colorClass.inactive}`}
                    ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
                    hover:scale-105 active:scale-95
                  `}
									title={`${filter.description} (Ctrl+${filter.shortcut})`}
								>
									<Icon className="w-3 h-3 mr-1.5" />
									{filter.label}
									{isProcessing && <div className="ml-1.5 w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />}
								</Button>
							);
						})}
					</div>
				</ScrollArea>

				{/* Results indicator */}
				{!loading && totalResults > 0 && <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{totalResults.toLocaleString()} businesses match your filters</div>}

				{/* Keyboard shortcuts hint */}
				<div className="mt-1 text-xs text-gray-400 dark:text-gray-500">💡 Tip: Use Ctrl+letter shortcuts for quick filtering</div>
			</div>
		</div>
	);
};

export default QuickFilterPills;
