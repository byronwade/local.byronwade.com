"use client";

import React, { useState } from "react";
import { X, Filter, SortAsc, Star, Clock, MapPin, DollarSign } from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Slider } from "@components/ui/slider";
import { Checkbox } from "@components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Label } from "@components/ui/label";
import { Separator } from "@components/ui/separator";
import { ScrollArea } from "@components/ui/scroll-area";

const CATEGORIES = ["Restaurants", "Health & Medical", "Home Services", "Beauty & Spas", "Automotive", "Shopping", "Professional Services", "Entertainment", "Fitness & Recreation", "Education"];

const PRICE_RANGES = [
	{ value: "$", label: "$" },
	{ value: "$$", label: "$$" },
	{ value: "$$$", label: "$$$" },
	{ value: "$$$$", label: "$$$$" },
];

const SORT_OPTIONS = [
	{ value: "relevance", label: "Best Match", icon: Filter },
	{ value: "rating", label: "Highest Rated", icon: Star },
	{ value: "distance", label: "Distance", icon: MapPin },
	{ value: "name", label: "Name A-Z", icon: SortAsc },
];

export default function FilterSortPanel({ isOpen, onClose, onFiltersChange, onSortChange }) {
	const [filters, setFilters] = useState({
		categories: [],
		priceRange: [],
		rating: [0],
		distance: [25],
		openNow: false,
		sponsored: false,
	});
	const [sortBy, setSortBy] = useState("relevance");

	const handleCategoryChange = (category, checked) => {
		const newCategories = checked ? [...filters.categories, category] : filters.categories.filter((c) => c !== category);

		const newFilters = { ...filters, categories: newCategories };
		setFilters(newFilters);
		onFiltersChange?.(newFilters);
	};

	const handlePriceChange = (price, checked) => {
		const newPriceRange = checked ? [...filters.priceRange, price] : filters.priceRange.filter((p) => p !== price);

		const newFilters = { ...filters, priceRange: newPriceRange };
		setFilters(newFilters);
		onFiltersChange?.(newFilters);
	};

	const handleRatingChange = (value) => {
		const newFilters = { ...filters, rating: value };
		setFilters(newFilters);
		onFiltersChange?.(newFilters);
	};

	const handleDistanceChange = (value) => {
		const newFilters = { ...filters, distance: value };
		setFilters(newFilters);
		onFiltersChange?.(newFilters);
	};

	const handleOpenNowChange = (checked) => {
		const newFilters = { ...filters, openNow: checked };
		setFilters(newFilters);
		onFiltersChange?.(newFilters);
	};

	const handleSponsoredChange = (checked) => {
		const newFilters = { ...filters, sponsored: checked };
		setFilters(newFilters);
		onFiltersChange?.(newFilters);
	};

	const handleSortChange = (value) => {
		setSortBy(value);
		onSortChange?.(value);
	};

	const clearAllFilters = () => {
		const clearedFilters = {
			categories: [],
			priceRange: [],
			rating: [0],
			distance: [25],
			openNow: false,
			sponsored: false,
		};
		setFilters(clearedFilters);
		setSortBy("relevance");
		onFiltersChange?.(clearedFilters);
		onSortChange?.("relevance");
	};

	const getActiveFiltersCount = () => {
		return filters.categories.length + filters.priceRange.length + (filters.rating[0] > 0 ? 1 : 0) + (filters.distance[0] < 25 ? 1 : 0) + (filters.openNow ? 1 : 0) + (filters.sponsored ? 1 : 0);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center gap-2">
					<Filter className="w-5 h-5" />
					<h3 className="font-semibold text-gray-900 dark:text-white">Filters & Sort</h3>
					{getActiveFiltersCount() > 0 && (
						<Badge variant="secondary" className="text-xs">
							{getActiveFiltersCount()}
						</Badge>
					)}
				</div>
				<div className="flex items-center gap-2">
					{getActiveFiltersCount() > 0 && (
						<Button variant="ghost" size="sm" onClick={clearAllFilters}>
							Clear All
						</Button>
					)}
					<Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
						<X className="w-4 h-4" />
					</Button>
				</div>
			</div>

			<ScrollArea className="flex-1 p-4">
				<div className="space-y-6">
					{/* Sort Options */}
					<div>
						<h4 className="font-medium text-gray-900 dark:text-white mb-3">Sort By</h4>
						<RadioGroup value={sortBy} onValueChange={handleSortChange}>
							{SORT_OPTIONS.map((option) => {
								const Icon = option.icon;
								return (
									<div key={option.value} className="flex items-center space-x-2">
										<RadioGroupItem value={option.value} id={option.value} />
										<Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
											<Icon className="w-4 h-4" />
											{option.label}
										</Label>
									</div>
								);
							})}
						</RadioGroup>
					</div>

					<Separator />

					{/* Categories */}
					<div>
						<h4 className="font-medium text-gray-900 dark:text-white mb-3">Categories</h4>
						<div className="space-y-2">
							{CATEGORIES.map((category) => (
								<div key={category} className="flex items-center space-x-2">
									<Checkbox id={category} checked={filters.categories.includes(category)} onCheckedChange={(checked) => handleCategoryChange(category, checked)} />
									<Label htmlFor={category} className="text-sm cursor-pointer">
										{category}
									</Label>
								</div>
							))}
						</div>
					</div>

					<Separator />

					{/* Price Range */}
					<div>
						<h4 className="font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
						<div className="flex gap-2">
							{PRICE_RANGES.map((price) => (
								<Button key={price.value} variant={filters.priceRange.includes(price.value) ? "default" : "outline"} size="sm" onClick={() => handlePriceChange(price.value, !filters.priceRange.includes(price.value))} className="flex-1">
									{price.label}
								</Button>
							))}
						</div>
					</div>

					<Separator />

					{/* Rating */}
					<div>
						<h4 className="font-medium text-gray-900 dark:text-white mb-3">Minimum Rating: {filters.rating[0]} stars</h4>
						<Slider value={filters.rating} onValueChange={handleRatingChange} max={5} min={0} step={0.5} className="w-full" />
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>Any</span>
							<span>5 stars</span>
						</div>
					</div>

					<Separator />

					{/* Distance */}
					<div>
						<h4 className="font-medium text-gray-900 dark:text-white mb-3">Distance: {filters.distance[0]} miles</h4>
						<Slider value={filters.distance} onValueChange={handleDistanceChange} max={50} min={1} step={1} className="w-full" />
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>1 mile</span>
							<span>50+ miles</span>
						</div>
					</div>

					<Separator />

					{/* Quick Filters */}
					<div>
						<h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Filters</h4>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Checkbox id="openNow" checked={filters.openNow} onCheckedChange={handleOpenNowChange} />
								<Label htmlFor="openNow" className="text-sm cursor-pointer flex items-center gap-2">
									<Clock className="w-4 h-4" />
									Open Now
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox id="sponsored" checked={filters.sponsored} onCheckedChange={handleSponsoredChange} />
								<Label htmlFor="sponsored" className="text-sm cursor-pointer flex items-center gap-2">
									<Star className="w-4 h-4" />
									Sponsored Only
								</Label>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
