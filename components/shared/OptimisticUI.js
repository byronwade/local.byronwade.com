// components/shared/OptimisticUI.js - Zero Loading State Components
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { logger } from "@lib/utils/logger";
import { CacheManager } from "@lib/utils/cacheManager";
import streamingSearchEngine from "@lib/utils/streamingSearch";

/**
 * Optimistic Search Results - Shows instant results with zero loading
 */
export const OptimisticSearchResults = ({ query, filters = {}, onResultClick, className = "", children }) => {
	const [results, setResults] = useState([]);
	const [isOptimistic, setIsOptimistic] = useState(true);
	const [searchId] = useState(() => `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

	// Generate instant optimistic results
	const optimisticResults = useMemo(() => {
		if (!query || query.length < 2) return [];

		// Try cache first
		const cacheKey = streamingSearchEngine.getCacheKey(query, filters);
		const cached = CacheManager.memory.get(cacheKey);
		if (cached?.results) {
			return cached.results;
		}

		// Generate predictive results
		return generatePredictiveBusinessResults(query, filters);
	}, [query, filters]);

	// Show optimistic results immediately
	useEffect(() => {
		if (optimisticResults.length > 0) {
			setResults(optimisticResults);
			setIsOptimistic(true);
		}
	}, [optimisticResults]);

	// Start real search in background
	useEffect(() => {
		if (!query || query.length < 2) {
			setResults([]);
			return;
		}

		// Real search with streaming
		streamingSearchEngine.streamingSearch(
			query,
			{
				filters,
				searchId,
				useLocalIndex: true,
				enableStreaming: true,
			},
			// onResults - stream in real results
			(newResults, source) => {
				setResults((prev) => {
					// Merge with existing, removing duplicates
					const existingIds = new Set(prev.map((r) => r.id));
					const uniqueNewResults = newResults.filter((r) => !existingIds.has(r.id));

					if (source === "local" || source === "api") {
						setIsOptimistic(false);
					}

					return [...prev, ...uniqueNewResults];
				});
			},
			// onComplete
			(finalResults) => {
				setResults(finalResults.results || []);
				setIsOptimistic(false);
				logger.debug(`Search completed: ${finalResults.results?.length || 0} results`);
			}
		);

		return () => {
			streamingSearchEngine.cancelSearch(searchId);
		};
	}, [query, filters, searchId]);

	const handleResultClick = useCallback(
		(business) => {
			// Optimistic navigation - don't wait for click to process
			if (onResultClick) {
				onResultClick(business);
			}
		},
		[onResultClick]
	);

	if (!query || query.length < 2) {
		return children || <div className="py-8 text-center text-gray-500">Start typing to search...</div>;
	}

	return (
		<div className={`optimistic-search-results ${className}`}>
			{/* Results Header */}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold text-gray-900">{isOptimistic ? `Searching for "${query}"...` : `Found ${results.length} results`}</h2>

				{isOptimistic && (
					<div className="flex items-center space-x-2 text-sm text-blue-600">
						<div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
						<span>Finding best matches</span>
					</div>
				)}
			</div>

			{/* Results Grid */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{results.map((business, index) => (
					<OptimisticBusinessCard
						key={business.id}
						business={business}
						onClick={handleResultClick}
						isOptimistic={isOptimistic && business.isPrediction}
						animationDelay={index * 50} // Stagger animation
					/>
				))}
			</div>

			{/* Empty State */}
			{results.length === 0 && !isOptimistic && (
				<div className="py-12 text-center">
					<div className="mb-4 text-6xl text-gray-400">🔍</div>
					<h3 className="mb-2 text-lg font-medium text-gray-900">No results found</h3>
					<p className="text-gray-500">Try adjusting your search terms or filters</p>
				</div>
			)}
		</div>
	);
};

/**
 * Optimistic Business Card - Shows immediate interaction feedback
 */
export const OptimisticBusinessCard = ({ business, onClick, isOptimistic = false, animationDelay = 0, className = "" }) => {
	const [isClicked, setIsClicked] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const handleClick = useCallback(
		(e) => {
			e.preventDefault();

			// Immediate visual feedback
			setIsClicked(true);

			// Optimistic navigation
			if (onClick) {
				onClick(business);
			}

			// Reset click state
			setTimeout(() => setIsClicked(false), 200);
		},
		[business, onClick]
	);

	const handleMouseEnter = useCallback(() => {
		setIsHovered(true);

		// Preload business page
		if (business.id && !business.isPrediction) {
			const businessUrl = `/biz/${business.id}`;
			// Preload in background
			fetch(businessUrl, { headers: { "X-Preload": "true" } }).catch(() => {});
		}
	}, [business.id, business.isPrediction]);

	const cardClasses = ["business-card", "bg-white rounded-lg shadow-sm border", "hover:shadow-md transition-all duration-200 cursor-pointer", "transform hover:scale-[1.02]", isClicked && "scale-[0.98] shadow-lg", isOptimistic && "opacity-80 border-dashed border-blue-200", className].filter(Boolean).join(" ");

	return (
		<div
			className={cardClasses}
			onClick={handleClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={() => setIsHovered(false)}
			data-business-id={business.id}
			style={{
				animationDelay: `${animationDelay}ms`,
				animation: "fadeInUp 0.4s ease-out forwards",
				opacity: 0,
			}}
		>
			{/* Business Image */}
			<div className="overflow-hidden relative w-full h-48 bg-gray-200 rounded-t-lg">
				{business.photos?.[0] ? (
					<div
						style={{
							backgroundImage: `url(${business.photos[0].url})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
						className={`w-full h-full transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
						role="img"
						aria-label={business.name}
					/>
				) : (
					<div className="flex justify-center items-center w-full h-full bg-gradient-to-br from-gray-200 to-gray-300">
						<div className="text-4xl text-gray-400">{getBusinessIcon(business.category)}</div>
					</div>
				)}

				{/* Optimistic Badge */}
				{isOptimistic && <div className="absolute top-2 right-2 px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded">Predicted</div>}
			</div>

			{/* Business Info */}
			<div className="p-4">
				<h3 className="mb-1 text-lg font-semibold text-gray-900 line-clamp-1">{business.name}</h3>

				{business.categories && business.categories.length > 0 && <p className="mb-2 text-sm text-gray-600 line-clamp-1">{business.categories.map((cat) => cat.name || cat).join(", ")}</p>}

				{/* Rating */}
				{business.rating && (
					<div className="flex items-center mb-2 space-x-1">
						<div className="flex text-yellow-400">
							{[...Array(5)].map((_, i) => (
								<span key={i} className={i < Math.floor(business.rating) ? "text-yellow-400" : "text-gray-300"}>
									★
								</span>
							))}
						</div>
						<span className="text-sm text-gray-600">
							{business.rating.toFixed(1)} ({business.reviewCount || 0})
						</span>
					</div>
				)}

				{/* Address */}
				{business.address && <p className="text-sm text-gray-500 line-clamp-1">{business.address}</p>}

				{/* Quick Actions */}
				<div className="flex mt-3 space-x-2">
					<button
						className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded transition-colors hover:bg-blue-700"
						onClick={(e) => {
							e.stopPropagation();
							handleClick(e);
						}}
					>
						View Details
					</button>

					{business.phone && (
						<button
							className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded transition-colors hover:bg-gray-200"
							onClick={(e) => {
								e.stopPropagation();
								window.open(`tel:${business.phone}`);
							}}
						>
							Call
						</button>
					)}
				</div>
			</div>

			{/* Loading overlay for optimistic state */}
			{isOptimistic && (
				<div className="flex absolute inset-0 justify-center items-center bg-white bg-opacity-50 rounded-lg">
					<div className="flex items-center space-x-2 text-blue-600">
						<div className="w-4 h-4 rounded-full border-2 border-blue-600 animate-spin border-t-transparent"></div>
						<span className="text-sm">Loading...</span>
					</div>
				</div>
			)}
		</div>
	);
};

/**
 * Optimistic Form - Shows immediate feedback on submission
 */
export const OptimisticForm = ({ children, onSubmit, successMessage = "Success!", className = "", ...props }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();

			// Immediate optimistic feedback
			setIsSubmitting(true);
			setShowSuccess(true);

			try {
				// Call actual submit handler
				if (onSubmit) {
					await onSubmit(e);
				}

				// Keep success state for a moment
				setTimeout(() => {
					setIsSubmitting(false);
					setShowSuccess(false);
				}, 1500);
			} catch (error) {
				setIsSubmitting(false);
				setShowSuccess(false);
				throw error;
			}
		},
		[onSubmit]
	);

	return (
		<form className={`relative optimistic-form ${className}`} onSubmit={handleSubmit} {...props}>
			{children}

			{/* Success Overlay */}
			{showSuccess && (
				<div className="flex absolute inset-0 justify-center items-center bg-green-50 bg-opacity-95 rounded-lg">
					<div className="flex items-center space-x-2 text-green-600">
						<div className="w-6 h-6 text-green-600">✓</div>
						<span className="font-medium">{successMessage}</span>
					</div>
				</div>
			)}
		</form>
	);
};

/**
 * Optimistic Button - Shows immediate press feedback
 */
export const OptimisticButton = ({ children, onClick, loading = false, loadingText = "Loading...", className = "", disabled = false, ...props }) => {
	const [isPressed, setIsPressed] = useState(false);

	const handleClick = useCallback(
		(e) => {
			if (disabled || loading) return;

			// Immediate visual feedback
			setIsPressed(true);

			// Call handler optimistically
			if (onClick) {
				onClick(e);
			}

			// Reset press state
			setTimeout(() => setIsPressed(false), 150);
		},
		[onClick, disabled, loading]
	);

	const buttonClasses = ["optimistic-button", "transition-all duration-150", "transform active:scale-95", isPressed && "scale-95", loading && "cursor-wait", disabled && "cursor-not-allowed opacity-50", className].filter(Boolean).join(" ");

	return (
		<button className={buttonClasses} onClick={handleClick} disabled={disabled} {...props}>
			{loading ? (
				<div className="flex items-center space-x-2">
					<div className="w-4 h-4 rounded-full border-2 border-current animate-spin border-t-transparent"></div>
					<span>{loadingText}</span>
				</div>
			) : (
				children
			)}
		</button>
	);
};

/**
 * Helper Functions
 */

// Generate predictive business results based on query
function generatePredictiveBusinessResults(query, filters = {}) {
	const queryLower = query.toLowerCase();
	const predictions = [];

	// Business type mapping
	const businessMappings = {
		restaurant: {
			icon: "🍽️",
			examples: ["Bella Vista Italian", "Golden Dragon Chinese", "Tony's Pizza", "The Burger Joint"],
		},
		coffee: {
			icon: "☕",
			examples: ["Downtown Coffee Co.", "The Bean Counter", "Espresso Express", "Morning Brew"],
		},
		grocery: {
			icon: "🛒",
			examples: ["Fresh Market", "Valley Grocers", "Organic Foods Plus", "Quick Stop Market"],
		},
		gas: {
			icon: "⛽",
			examples: ["Quick Fill Station", "Highway 76", "Express Gas", "Corner Fuel"],
		},
		pharmacy: {
			icon: "💊",
			examples: ["City Pharmacy", "Health Plus", "RX Express", "Care Pharmacy"],
		},
		bank: {
			icon: "🏦",
			examples: ["First National", "Community Bank", "Credit Union Plus", "Trust Bank"],
		},
	};

	// Find matching category
	let matchedCategory = null;
	for (const [category, data] of Object.entries(businessMappings)) {
		if (queryLower.includes(category) || category.includes(queryLower)) {
			matchedCategory = { category, ...data };
			break;
		}
	}

	// Generate predictions
	if (matchedCategory) {
		matchedCategory.examples.forEach((name, index) => {
			predictions.push({
				id: `pred_${matchedCategory.category}_${index}`,
				name: name,
				categories: [{ name: matchedCategory.category }],
				category: matchedCategory.category,
				rating: 3.5 + Math.random() * 1.5,
				reviewCount: Math.floor(Math.random() * 200) + 10,
				address: "Loading location...",
				phone: "(555) 123-4567",
				isPrediction: true,
				photos: [], // Will show icon instead
			});
		});
	}

	// Add some generic predictions if no specific category
	if (predictions.length === 0) {
		const genericNames = ["Local Business Co.", "Downtown Services", "Main Street Shop", "City Center Store"];

		genericNames.forEach((name, index) => {
			predictions.push({
				id: `pred_generic_${index}`,
				name: name,
				categories: [{ name: "Business" }],
				rating: 4.0 + Math.random() * 1,
				reviewCount: Math.floor(Math.random() * 100) + 5,
				address: "Loading location...",
				isPrediction: true,
				photos: [],
			});
		});
	}

	return predictions.slice(0, 6);
}

// Get business icon based on category
function getBusinessIcon(category) {
	const icons = {
		restaurant: "🍽️",
		coffee: "☕",
		grocery: "🛒",
		gas: "⛽",
		pharmacy: "💊",
		bank: "🏦",
		shopping: "🛍️",
		automotive: "🚗",
		health: "🏥",
		beauty: "💄",
		fitness: "💪",
		education: "📚",
	};

	if (typeof category === "string") {
		const categoryLower = category.toLowerCase();
		for (const [key, icon] of Object.entries(icons)) {
			if (categoryLower.includes(key)) {
				return icon;
			}
		}
	}

	return "🏢"; // Default business icon
}

// CSS Animations
const styles = `
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

.line-clamp-1 {
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
`;

// Inject styles
if (typeof document !== "undefined" && !document.getElementById("optimistic-ui-styles")) {
	const styleSheet = document.createElement("style");
	styleSheet.id = "optimistic-ui-styles";
	styleSheet.textContent = styles;
	document.head.appendChild(styleSheet);
}

const OptimisticUIComponents = {
	OptimisticSearchResults,
	OptimisticBusinessCard,
	OptimisticForm,
	OptimisticButton,
};

export default OptimisticUIComponents;
