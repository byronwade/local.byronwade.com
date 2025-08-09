/**
 * SearchSuggestions Component
 * Extracted from MapIntegration.js (485 lines)
 * Handles location search suggestions and autocomplete
 * Enterprise-level component with performance optimization
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { withErrorHandling } from "@utils/error-handler";

export const useSearchSuggestions = ({ onLocationSelect, onSearchSubmit }) => {
	const [searchLocation, setSearchLocation] = useState("");
	const [searchSuggestions, setSearchSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

	const searchTimeoutRef = useRef(null);

	// Search for location suggestions with debouncing
	const searchLocationSuggestions = useCallback(
		withErrorHandling(async (query) => {
			if (!query || query.length < 3) {
				setSearchSuggestions([]);
				setShowSuggestions(false);
				return;
			}

			// Clear previous timeout
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}

			// Debounce search requests
			searchTimeoutRef.current = setTimeout(async () => {
				setIsLoadingSuggestions(true);

				try {
					const response = await fetch(`/api/autocomplete?input=${encodeURIComponent(query)}`);

					if (!response.ok) {
						throw new Error("Failed to fetch suggestions");
					}

					const data = await response.json();

					if (data.predictions) {
						const suggestions = data.predictions.map((prediction) => ({
							id: prediction.place_id,
							description: prediction.description,
							main_text: prediction.structured_formatting?.main_text || prediction.description,
							secondary_text: prediction.structured_formatting?.secondary_text || "",
							types: prediction.types || [],
						}));

						setSearchSuggestions(suggestions);
						setShowSuggestions(true);
					}
				} catch (error) {
					console.error("Failed to fetch location suggestions:", error);
					setSearchSuggestions([]);
					setShowSuggestions(false);
				} finally {
					setIsLoadingSuggestions(false);
				}
			}, 300); // 300ms debounce delay
		}, "SearchSuggestions"),
		[]
	);

	// Handle suggestion selection
	const handleSuggestionSelect = useCallback(
		(suggestion) => {
			setSearchLocation(suggestion.description);
			setShowSuggestions(false);

			if (onLocationSelect) {
				onLocationSelect(suggestion);
			}
		},
		[onLocationSelect]
	);

	// Handle search input change
	const handleSearchInputChange = useCallback(
		(e) => {
			const value = e.target.value;
			setSearchLocation(value);
			searchLocationSuggestions(value);
		},
		[searchLocationSuggestions]
	);

	// Handle search submission
	const handleSearchSubmit = useCallback(
		(e) => {
			e.preventDefault();
			setShowSuggestions(false);

			if (onSearchSubmit && searchLocation.trim()) {
				onSearchSubmit(searchLocation.trim());
			}
		},
		[searchLocation, onSearchSubmit]
	);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleSearchSubmit(e);
			} else if (e.key === "Escape") {
				setShowSuggestions(false);
			}
		},
		[handleSearchSubmit]
	);

	// Clear search
	const clearSearch = useCallback(() => {
		setSearchLocation("");
		setSearchSuggestions([]);
		setShowSuggestions(false);
	}, []);

	return {
		// State
		searchLocation,
		searchSuggestions,
		showSuggestions,
		isLoadingSuggestions,

		// Actions
		handleSearchInputChange,
		handleSuggestionSelect,
		handleSearchSubmit,
		handleKeyDown,
		clearSearch,
		setShowSuggestions,
	};
};

export const SearchSuggestionsUI = ({ searchLocation, searchSuggestions, showSuggestions, isLoadingSuggestions, onInputChange, onSuggestionSelect, onSearchSubmit, onKeyDown, onClear, placeholder = "Search for a location...", className = "" }) => {
	return (
		<div className={`relative ${className}`}>
			<form onSubmit={onSearchSubmit} className="relative">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input type="text" placeholder={placeholder} value={searchLocation} onChange={onInputChange} onKeyDown={onKeyDown} className="pl-10 pr-10" autoComplete="off" />
					{searchLocation && (
						<Button type="button" variant="ghost" size="sm" onClick={onClear} className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted">
							<X className="h-3 w-3" />
						</Button>
					)}
				</div>
			</form>

			{/* Search Suggestions Dropdown */}
			{showSuggestions && (
				<Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto shadow-lg">
					<CardContent className="p-1">
						{isLoadingSuggestions ? (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								<span className="text-sm text-muted-foreground">Searching...</span>
							</div>
						) : searchSuggestions.length > 0 ? (
							<div className="space-y-1">
								{searchSuggestions.map((suggestion) => (
									<button key={suggestion.id} type="button" onClick={() => onSuggestionSelect(suggestion)} className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors focus:outline-none focus:bg-muted">
										<div className="flex items-start space-x-2">
											<MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
											<div className="flex-1 min-w-0">
												<div className="font-medium text-sm truncate">{suggestion.main_text}</div>
												{suggestion.secondary_text && <div className="text-xs text-muted-foreground truncate">{suggestion.secondary_text}</div>}
												{suggestion.types && suggestion.types.length > 0 && (
													<div className="flex flex-wrap gap-1 mt-1">
														{suggestion.types.slice(0, 2).map((type) => (
															<Badge key={type} variant="secondary" className="text-xs">
																{type.replace(/_/g, " ")}
															</Badge>
														))}
													</div>
												)}
											</div>
										</div>
									</button>
								))}
							</div>
						) : (
							<div className="text-center py-4 text-sm text-muted-foreground">No suggestions found</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default useSearchSuggestions;
