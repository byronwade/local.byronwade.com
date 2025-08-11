/**
 * EnhancedSearchSuggestions Component
 * Compact and feature-rich search suggestions with quick actions
 * Provides instant search results with smart categorization
 */

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { Search, MapPin, Clock, Star, TrendingUp, History, Zap, ExternalLink, Users, ChevronRight, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { withErrorHandling } from "@utils/error-handler";
import { logger } from "@utils/logger";

const EnhancedSearchSuggestions = ({ query = "", suggestions = [], recentSearches = [], popularCategories = [], onSuggestionClick, onBusinessClick, onCategoryClick, onClose, loading = false, className = "" }) => {
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [hoveredSuggestion, setHoveredSuggestion] = useState(null);

	// Categorize suggestions for better organization
	const categorizedSuggestions = useMemo(() => {
		const categories = {
			businesses: [],
			locations: [],
			services: [],
			recent: [],
		};

		suggestions.forEach((suggestion) => {
			if (suggestion.type === "business") {
				categories.businesses.push(suggestion);
			} else if (suggestion.type === "location") {
				categories.locations.push(suggestion);
			} else if (suggestion.type === "service") {
				categories.services.push(suggestion);
			}
		});

		categories.recent = recentSearches.slice(0, 3);

		return categories;
	}, [suggestions, recentSearches]);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e) => {
			const totalItems = suggestions.length + recentSearches.length;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) => (prev + 1) % totalItems);
					break;
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
					break;
				case "Enter":
					e.preventDefault();
					if (selectedIndex >= 0) {
						const allItems = [...suggestions, ...recentSearches];
						const selectedItem = allItems[selectedIndex];
						if (selectedItem) {
							handleItemClick(selectedItem);
						}
					}
					break;
				case "Escape":
					e.preventDefault();
					onClose?.();
					break;
			}
		},
		[selectedIndex, suggestions, recentSearches, onClose]
	);

	// Attach keyboard listeners
	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	// Handle item click
	const handleItemClick = useCallback(
		withErrorHandling((item) => {
			logger.interaction({
				type: "search_suggestion_click",
				suggestionType: item.type,
				query: query,
				selectedItem: item.name || item.query,
				timestamp: Date.now(),
			});

			if (item.type === "business") {
				onBusinessClick?.(item);
			} else if (item.type === "recent") {
				onSuggestionClick?.(item.query);
			} else {
				onSuggestionClick?.(item.name || item.query);
			}
		}, "EnhancedSearchSuggestions"),
		[query, onBusinessClick, onSuggestionClick]
	);

	// Handle category click
	const handleCategoryClick = useCallback(
		withErrorHandling((category) => {
			logger.interaction({
				type: "category_suggestion_click",
				category: category,
				query: query,
				timestamp: Date.now(),
			});

			onCategoryClick?.(category);
		}, "EnhancedSearchSuggestions"),
		[query, onCategoryClick]
	);

	// Render business suggestion
	const renderBusinessSuggestion = (business, index) => (
		<div
			key={`business-${business.id}`}
			className={`
        flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all duration-150
        ${selectedIndex === index ? "bg-blue-50 dark:bg-blue-950/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}
      `}
			onClick={() => handleItemClick(business)}
			onMouseEnter={() => setHoveredSuggestion(business.id)}
			onMouseLeave={() => setHoveredSuggestion(null)}
		>
			{/* Business Avatar */}
			<Avatar className="w-10 h-10 border border-gray-200 dark:border-gray-700">
				<AvatarImage src={business.logo || business.image} alt={business.name} />
				<AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium">{business.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
			</Avatar>

			{/* Business Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">{business.name}</h4>
					{business.isOpen && (
						<Badge variant="secondary" className="h-5 px-1.5 text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
							Open
						</Badge>
					)}
				</div>
				<div className="flex items-center gap-3 mt-1">
					{business.rating && (
						<div className="flex items-center gap-1">
							<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
							<span className="text-xs text-gray-600 dark:text-gray-400">{business.rating}</span>
						</div>
					)}
					{business.category && <span className="text-xs text-gray-500 dark:text-gray-500">{business.category}</span>}
					{business.distance && <span className="text-xs text-blue-600 dark:text-blue-400">{business.distance}</span>}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="flex items-center gap-1">
				{hoveredSuggestion === business.id && (
					<>
						<Button
							variant="ghost"
							size="sm"
							className="h-7 w-7 p-0"
							onClick={(e) => {
								e.stopPropagation();
								// Handle call action
							}}
						>
							<ExternalLink className="w-3 h-3" />
						</Button>
					</>
				)}
				<ChevronRight className="w-4 h-4 text-gray-400" />
			</div>
		</div>
	);

	// Render text suggestion
	const renderTextSuggestion = (suggestion, index) => (
		<div
			key={`suggestion-${index}`}
			className={`
        flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all duration-150
        ${selectedIndex === index ? "bg-blue-50 dark:bg-blue-950/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}
      `}
			onClick={() => handleItemClick(suggestion)}
		>
			<div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
				<Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
			</div>
			<div className="flex-1">
				<span className="text-sm text-gray-900 dark:text-white">{suggestion.name}</span>
				{suggestion.description && <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{suggestion.description}</p>}
			</div>
			<ArrowUpRight className="w-3 h-3 text-gray-400" />
		</div>
	);

	// Render recent search
	const renderRecentSearch = (recent, index) => (
		<div
			key={`recent-${index}`}
			className={`
        flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-all duration-150
        ${selectedIndex === index ? "bg-blue-50 dark:bg-blue-950/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}
      `}
			onClick={() => handleItemClick(recent)}
		>
			<div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
				<History className="w-4 h-4 text-gray-500 dark:text-gray-400" />
			</div>
			<div className="flex-1">
				<span className="text-sm text-gray-900 dark:text-white">{recent.query}</span>
				{recent.location && <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">near {recent.location}</p>}
			</div>
			<span className="text-xs text-gray-400">{new Date(recent.timestamp).toLocaleDateString()}</span>
		</div>
	);

	if (loading) {
		return (
			<Card className={`absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border-gray-200 dark:border-gray-700 ${className}`}>
				<CardContent className="p-3">
					<div className="space-y-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex items-center gap-3 animate-pulse">
								<div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
								<div className="flex-1">
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-1" />
									<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={`absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border-gray-200 dark:border-gray-700 max-h-96 ${className}`}>
			<CardContent className="p-0">
				<ScrollArea className="max-h-96">
					<div className="p-2">
						{/* Businesses */}
						{categorizedSuggestions.businesses.length > 0 && (
							<div className="mb-4">
								<div className="flex items-center gap-2 px-2 py-1 mb-2">
									<Users className="w-4 h-4 text-gray-500" />
									<h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Businesses</h3>
								</div>
								<div className="space-y-1">{categorizedSuggestions.businesses.slice(0, 3).map((business, index) => renderBusinessSuggestion(business, index))}</div>
							</div>
						)}

						{/* Services & Locations */}
						{(categorizedSuggestions.services.length > 0 || categorizedSuggestions.locations.length > 0) && (
							<div className="mb-4">
								<div className="flex items-center gap-2 px-2 py-1 mb-2">
									<Search className="w-4 h-4 text-gray-500" />
									<h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Suggestions</h3>
								</div>
								<div className="space-y-1">{[...categorizedSuggestions.services, ...categorizedSuggestions.locations].slice(0, 3).map((suggestion, index) => renderTextSuggestion(suggestion, index + categorizedSuggestions.businesses.length))}</div>
							</div>
						)}

						{/* Recent Searches */}
						{categorizedSuggestions.recent.length > 0 && (
							<div className="mb-2">
								<div className="flex items-center gap-2 px-2 py-1 mb-2">
									<History className="w-4 h-4 text-gray-500" />
									<h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Recent</h3>
								</div>
								<div className="space-y-1">{categorizedSuggestions.recent.map((recent, index) => renderRecentSearch(recent, index + suggestions.length))}</div>
							</div>
						)}

						{/* Popular Categories */}
						{popularCategories.length > 0 && query.length > 0 && (
							<>
								<Separator className="my-3" />
								<div className="px-2">
									<h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Popular</h3>
									<div className="flex flex-wrap gap-1.5">
										{popularCategories.slice(0, 6).map((category) => (
											<Button key={category} variant="outline" size="sm" onClick={() => handleCategoryClick(category)} className="h-6 px-2 text-xs border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
												{category}
											</Button>
										))}
									</div>
								</div>
							</>
						)}

						{/* No results */}
						{suggestions.length === 0 && recentSearches.length === 0 && query.length > 2 && (
							<div className="p-4 text-center">
								<Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
								<p className="text-sm text-gray-600 dark:text-gray-400">No suggestions found</p>
								<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Try different keywords</p>
							</div>
						)}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};

export default EnhancedSearchSuggestions;
