"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Slider } from "@components/ui/slider";
import { Checkbox } from "@components/ui/checkbox";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Separator } from "@components/ui/separator";
import { ScrollArea } from "@components/ui/scroll-area";
import { Filter, X, Star, MapPin, DollarSign, Clock, CheckCircle, RefreshCw, Settings } from "lucide-react";
import { withErrorHandling } from "@utils/errorHandler";

const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange, onClearFilters, totalResults = 0, loading = false }) => {
	const [localFilters, setLocalFilters] = useState(filters);
	const [isApplying, setIsApplying] = useState(false);

	// Update local filters when props change
	useEffect(() => {
		setLocalFilters(filters);
	}, [filters]);

	// Apply filters with debouncing
	const applyFilters = useCallback(
		withErrorHandling(async (newFilters) => {
			setIsApplying(true);
			try {
				await onFiltersChange(newFilters);
			} finally {
				setIsApplying(false);
			}
		}, "FilterPanel"),
		[onFiltersChange, setIsApplying]
	);

	// Handle filter changes
	const handleFilterChange = useCallback(
		(key, value) => {
			const newFilters = { ...localFilters, [key]: value };
			setLocalFilters(newFilters);

			// Debounce the apply function
			const timeoutId = setTimeout(() => {
				applyFilters(newFilters);
			}, 300);

			return () => clearTimeout(timeoutId);
		},
		[localFilters, applyFilters]
	);

	// Handle range filter changes
	const handleRangeChange = useCallback(
		(key, value) => {
			const newFilters = { ...localFilters, [key]: value };
			setLocalFilters(newFilters);
		},
		[localFilters]
	);

	// Handle checkbox filter changes
	const handleCheckboxChange = useCallback(
		(key, value, checked) => {
			const currentValues = localFilters[key] || [];
			const newValues = checked ? [...currentValues, value] : currentValues.filter((v) => v !== value);

			handleFilterChange(key, newValues);
		},
		[localFilters, handleFilterChange]
	);

	// Clear all filters
	const handleClearAll = useCallback(() => {
		const clearedFilters = {
			rating: [0, 5],
			distance: [0, 50],
			priceRange: [0, 4],
			categories: [],
			openNow: false,
			verified: false,
			sponsored: false,
			keywords: "",
			sortBy: "relevance",
		};

		setLocalFilters(clearedFilters);
		onClearFilters();
	}, [onClearFilters]);

	// Reset to default filters
	const handleReset = useCallback(() => {
		const defaultFilters = {
			rating: [0, 5],
			distance: [0, 25],
			priceRange: [0, 4],
			categories: [],
			openNow: false,
			verified: false,
			sponsored: false,
			keywords: "",
			sortBy: "relevance",
		};

		setLocalFilters(defaultFilters);
		applyFilters(defaultFilters);
	}, [applyFilters]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
			<Card className="w-full max-w-md max-h-[90vh] overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<CardTitle className="flex items-center gap-2">
						<Filter className="w-5 h-5" />
						Filters
						{totalResults > 0 && (
							<Badge variant="secondary" className="ml-2">
								{totalResults} results
							</Badge>
						)}
					</CardTitle>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" onClick={handleReset} disabled={loading || isApplying}>
							<RefreshCw className="w-4 h-4" />
						</Button>
						<Button variant="ghost" size="sm" onClick={onClose}>
							<X className="w-4 h-4" />
						</Button>
					</div>
				</CardHeader>

				<ScrollArea className="max-h-[calc(90vh-120px)]">
					<CardContent className="space-y-6">
						{/* Keywords Search */}
						<div className="space-y-2">
							<Label htmlFor="keywords" className="flex items-center gap-2">
								<Settings className="w-4 h-4" />
								Keywords
							</Label>
							<Input id="keywords" placeholder="Search keywords..." value={localFilters.keywords || ""} onChange={(e) => handleFilterChange("keywords", e.target.value)} />
						</div>

						<Separator />

						{/* Rating Filter */}
						<div className="space-y-3">
							<Label className="flex items-center gap-2">
								<Star className="w-4 h-4" />
								Rating ({localFilters.rating?.[0] || 0} - {localFilters.rating?.[1] || 5} stars)
							</Label>
							<Slider value={localFilters.rating || [0, 5]} onValueChange={(value) => handleRangeChange("rating", value)} onValueCommit={(value) => handleFilterChange("rating", value)} max={5} min={0} step={0.5} className="w-full" />
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>0 stars</span>
								<span>5 stars</span>
							</div>
						</div>

						<Separator />

						{/* Distance Filter */}
						<div className="space-y-3">
							<Label className="flex items-center gap-2">
								<MapPin className="w-4 h-4" />
								Distance ({localFilters.distance?.[0] || 0} - {localFilters.distance?.[1] || 50} miles)
							</Label>
							<Slider value={localFilters.distance || [0, 50]} onValueChange={(value) => handleRangeChange("distance", value)} onValueCommit={(value) => handleFilterChange("distance", value)} max={50} min={0} step={1} className="w-full" />
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>0 miles</span>
								<span>50 miles</span>
							</div>
						</div>

						<Separator />

						{/* Price Range Filter */}
						<div className="space-y-3">
							<Label className="flex items-center gap-2">
								<DollarSign className="w-4 h-4" />
								Price Range
							</Label>
							<Slider value={localFilters.priceRange || [0, 4]} onValueChange={(value) => handleRangeChange("priceRange", value)} onValueCommit={(value) => handleFilterChange("priceRange", value)} max={4} min={0} step={1} className="w-full" />
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>$</span>
								<span>$$$$</span>
							</div>
						</div>

						<Separator />

						{/* Categories Filter */}
						<div className="space-y-3">
							<Label>Categories</Label>
							<div className="grid grid-cols-2 gap-2">
								{["Restaurants", "Plumbing", "Electrical", "HVAC", "Landscaping", "Cleaning", "Moving", "Real Estate"].map((category) => (
									<div key={category} className="flex items-center space-x-2">
										<Checkbox id={category} checked={localFilters.categories?.includes(category) || false} onCheckedChange={(checked) => handleCheckboxChange("categories", category, checked)} />
										<Label htmlFor={category} className="text-sm">
											{category}
										</Label>
									</div>
								))}
							</div>
						</div>

						<Separator />

						{/* Boolean Filters */}
						<div className="space-y-3">
							<Label>Additional Filters</Label>

							<div className="flex items-center space-x-2">
								<Checkbox id="openNow" checked={localFilters.openNow || false} onCheckedChange={(checked) => handleFilterChange("openNow", checked)} />
								<Label htmlFor="openNow" className="flex items-center gap-2">
									<Clock className="w-4 h-4" />
									Open Now
								</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox id="verified" checked={localFilters.verified || false} onCheckedChange={(checked) => handleFilterChange("verified", checked)} />
								<Label htmlFor="verified" className="flex items-center gap-2">
									<CheckCircle className="w-4 h-4" />
									Verified Businesses
								</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox id="sponsored" checked={localFilters.sponsored || false} onCheckedChange={(checked) => handleFilterChange("sponsored", checked)} />
								<Label htmlFor="sponsored" className="flex items-center gap-2">
									<Star className="w-4 h-4" />
									Sponsored Results
								</Label>
							</div>
						</div>

						<Separator />

						{/* Sort Options */}
						<div className="space-y-3">
							<Label>Sort By</Label>
							<div className="space-y-2">
								{[
									{ value: "relevance", label: "Relevance" },
									{ value: "rating", label: "Highest Rated" },
									{ value: "distance", label: "Nearest" },
									{ value: "reviews", label: "Most Reviews" },
									{ value: "name", label: "Name A-Z" },
								].map((option) => (
									<div key={option.value} className="flex items-center space-x-2">
										<input type="radio" id={option.value} name="sortBy" value={option.value} checked={localFilters.sortBy === option.value} onChange={(e) => handleFilterChange("sortBy", e.target.value)} className="w-4 h-4" />
										<Label htmlFor={option.value} className="text-sm">
											{option.label}
										</Label>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</ScrollArea>

				{/* Action Buttons */}
				<div className="p-4 border-t bg-muted/50">
					<div className="flex gap-2">
						<Button variant="outline" onClick={handleClearAll} disabled={loading || isApplying} className="flex-1">
							Clear All
						</Button>
						<Button onClick={onClose} disabled={loading || isApplying} className="flex-1">
							{isApplying ? "Applying..." : "Apply Filters"}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default FilterPanel;
