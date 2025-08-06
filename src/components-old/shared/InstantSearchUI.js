// components/shared/InstantSearchUI.js - Zero Loading State Search Interface
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { OptimisticSearchResults, OptimisticButton } from "./OptimisticUI";
import streamingSearchEngine from "@lib/utils/streamingSearch";
import instantPageLoader from "@lib/utils/instantPageLoader";
import { logger } from "@lib/utils/logger";
import { useRouter } from "next/navigation";

/**
 * Instant Search UI - Zero loading states, immediate results
 */
export const InstantSearchUI = ({ initialQuery = "", initialResults = [], placeholder = "Search businesses...", showFilters = true, className = "", onBusinessClick, autoFocus = false }) => {
	const router = useRouter();
	const [query, setQuery] = useState(initialQuery);
	const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
	const [filters, setFilters] = useState({});
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [suggestions, setSuggestions] = useState([]);
	const inputRef = useRef(null);
	const resultsRef = useRef(null);

	// Instant debouncing for ultra-fast response
	const INSTANT_DEBOUNCE = 50; // 50ms for instant feel

	// Auto-focus on mount if requested
	useEffect(() => {
		if (autoFocus && inputRef.current) {
			inputRef.current.focus();
		}
	}, [autoFocus]);

	// Ultra-fast debouncing for instant results
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, INSTANT_DEBOUNCE);

		return () => clearTimeout(timer);
	}, [query]);

	// Generate instant suggestions as user types
	useEffect(() => {
		if (query.length >= 1) {
			const instantSuggestions = streamingSearchEngine.generateSearchSuggestions(query);
			setSuggestions(instantSuggestions);
			setShowSuggestions(true);
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	}, [query]);

	// Handle business click with instant navigation
	const handleBusinessClick = useCallback(
		(business) => {
			const businessUrl = `/biz/${business.slug}`;

			// Instant optimistic navigation
			if (onBusinessClick) {
				onBusinessClick(business);
			} else {
				// Use instant page loader for zero-loading navigation
				instantPageLoader.handleInstantNavigation(businessUrl);
			}
		},
		[onBusinessClick]
	);

	// Handle search input with instant feedback
	const handleSearchChange = useCallback((e) => {
		const value = e.target.value;
		setQuery(value);

		// Instant suggestions
		if (value.length >= 1) {
			setSuggestions(streamingSearchEngine.generateSearchSuggestions(value));
			setShowSuggestions(true);
		} else {
			setShowSuggestions(false);
		}
	}, []);

	// Handle suggestion click
	const handleSuggestionClick = useCallback((suggestion) => {
		setQuery(suggestion.text);
		setDebouncedQuery(suggestion.text);
		setShowSuggestions(false);
		inputRef.current?.blur();
	}, []);

	// Handle filter changes
	const handleFilterChange = useCallback((filterKey, value) => {
		setFilters((prev) => ({
			...prev,
			[filterKey]: value,
		}));
	}, []);

	// Handle Enter key for instant search
	const handleKeyDown = useCallback(
		(e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				setDebouncedQuery(query);
				setShowSuggestions(false);
				inputRef.current?.blur();
			} else if (e.key === "Escape") {
				setShowSuggestions(false);
				inputRef.current?.blur();
			}
		},
		[query]
	);

	// Popular search categories for empty state
	const popularCategories = useMemo(
		() => [
			{ name: "Restaurants", icon: "🍽️", query: "restaurants" },
			{ name: "Coffee Shops", icon: "☕", query: "coffee" },
			{ name: "Gas Stations", icon: "⛽", query: "gas" },
			{ name: "Grocery Stores", icon: "🛒", query: "grocery" },
			{ name: "Pharmacies", icon: "💊", query: "pharmacy" },
			{ name: "Banks", icon: "🏦", query: "bank" },
		],
		[]
	);

	const handleCategoryClick = useCallback((category) => {
		setQuery(category.query);
		setDebouncedQuery(category.query);
		setShowSuggestions(false);
	}, []);

	return (
		<div className={`instant-search-ui ${className}`}>
			{/* Search Header */}
			<div className="search-header bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 py-4">
					{/* Main Search Bar */}
					<div className="relative">
						<div className="relative flex items-center">
							{/* Search Icon */}
							<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>

							{/* Search Input */}
							<input ref={inputRef} type="text" value={query} onChange={handleSearchChange} onKeyDown={handleKeyDown} onFocus={() => setShowSuggestions(suggestions.length > 0)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} placeholder={placeholder} className="w-full pl-10 pr-12 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />

							{/* Clear Button */}
							{query && (
								<button
									onClick={() => {
										setQuery("");
										setDebouncedQuery("");
										inputRef.current?.focus();
									}}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							)}
						</div>

						{/* Instant Suggestions Dropdown */}
						{showSuggestions && suggestions.length > 0 && (
							<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
								{suggestions.map((suggestion, index) => (
									<button key={index} onClick={() => handleSuggestionClick(suggestion)} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors">
										<div className="text-gray-400">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
											</svg>
										</div>
										<span className="text-gray-900">{suggestion.text}</span>
										{suggestion.category && <span className="text-sm text-gray-500">in {suggestion.category}</span>}
									</button>
								))}
							</div>
						)}
					</div>

					{/* Quick Filters */}
					{showFilters && (
						<div className="flex flex-wrap gap-2 mt-4">
							<QuickFilter label="Open Now" value={filters.openNow} onChange={(value) => handleFilterChange("openNow", value)} />
							<QuickFilter label="Highly Rated" value={filters.highlyRated} onChange={(value) => handleFilterChange("highlyRated", value)} />
							<QuickFilter label="Nearby" value={filters.nearby} onChange={(value) => handleFilterChange("nearby", value)} />
						</div>
					)}
				</div>
			</div>

			{/* Search Results or Empty State */}
			<div ref={resultsRef} className="max-w-7xl mx-auto px-4 py-6">
				{debouncedQuery ? (
					// Instant Search Results
					<OptimisticSearchResults query={debouncedQuery} filters={filters} onResultClick={handleBusinessClick} className="animate-fadeIn" />
				) : (
					// Popular Categories (Empty State)
					<div className="text-center">
						<div className="mb-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Find Local Businesses</h2>
							<p className="text-gray-600">Search for restaurants, shops, services and more</p>
						</div>

						{/* Popular Categories Grid */}
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
							{popularCategories.map((category, index) => (
								<OptimisticButton
									key={category.name}
									onClick={() => handleCategoryClick(category)}
									className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
									style={{
										animationDelay: `${index * 100}ms`,
										animation: "fadeInUp 0.5s ease-out forwards",
										opacity: 0,
									}}
								>
									<div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{category.icon}</div>
									<div className="text-sm font-medium text-gray-900">{category.name}</div>
								</OptimisticButton>
							))}
						</div>

						{/* Recent Searches */}
						<RecentSearches onSearchClick={handleCategoryClick} />
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * Quick Filter Component
 */
const QuickFilter = ({ label, value, onChange, className = "" }) => {
	return (
		<button
			onClick={() => onChange(!value)}
			className={`
				px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
				${value ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
				${className}
			`}
		>
			{label}
		</button>
	);
};

/**
 * Recent Searches Component
 */
const RecentSearches = ({ onSearchClick }) => {
	const [recentSearches, setRecentSearches] = useState([]);

	useEffect(() => {
		// Get recent searches from localStorage
		try {
			const stored = localStorage.getItem("recentSearches");
			if (stored) {
				const searches = JSON.parse(stored);
				setRecentSearches(searches.slice(0, 6)); // Show last 6 searches
			}
		} catch (error) {
			logger.warn("Failed to load recent searches:", error);
		}
	}, []);

	if (recentSearches.length === 0) return null;

	return (
		<div className="mt-12 max-w-2xl mx-auto">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
			<div className="flex flex-wrap gap-2">
				{recentSearches.map((search, index) => (
					<button key={index} onClick={() => onSearchClick({ query: search })} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
						{search}
					</button>
				))}
			</div>
		</div>
	);
};

/**
 * Instant Search Page Component
 * For dedicated search pages with URL sync
 */
export const InstantSearchPage = ({ searchParams }) => {
	const router = useRouter();
	const [query, setQuery] = useState(searchParams?.q || "");

	// Sync URL with search state
	useEffect(() => {
		const params = new URLSearchParams();
		if (query) {
			params.set("q", query);
		}

		const newUrl = params.toString() ? `/search?${params.toString()}` : "/search";
		router.replace(newUrl, { shallow: true });
	}, [query, router]);

	const handleBusinessClick = useCallback(
		(business) => {
			// Save search to recent searches
			if (query) {
				try {
					const stored = localStorage.getItem("recentSearches") || "[]";
					const searches = JSON.parse(stored);
					const updated = [query, ...searches.filter((s) => s !== query)].slice(0, 10);
					localStorage.setItem("recentSearches", JSON.stringify(updated));
				} catch (error) {
					logger.warn("Failed to save recent search:", error);
				}
			}

			// Navigate to business page instantly
			instantPageLoader.handleInstantNavigation(`/biz/${business.slug}`);
		},
		[query]
	);

	return (
		<div className="min-h-screen bg-gray-50">
			<InstantSearchUI initialQuery={query} placeholder="Search businesses..." showFilters={true} onBusinessClick={handleBusinessClick} autoFocus={!query} className="h-full" />
		</div>
	);
};

// CSS animations
const searchStyles = `
@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fadeIn {
	animation: fadeIn 0.3s ease-out;
}
`;

// Inject styles
if (typeof document !== "undefined" && !document.getElementById("instant-search-styles")) {
	const styleSheet = document.createElement("style");
	styleSheet.id = "instant-search-styles";
	styleSheet.textContent = searchStyles;
	document.head.appendChild(styleSheet);
}

export default InstantSearchUI;
