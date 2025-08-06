/**
 * Virtual Scrolling Component for Large Result Sets
 * Efficiently renders thousands of items without performance degradation
 * Inspired by high-performance applications like Twitter and grep.app
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { logger } from "@lib/utils/logger";

// Virtual scrolling configuration
const VIRTUAL_CONFIG = {
	// Performance settings
	DEFAULT_ITEM_HEIGHT: 120, // Default business card height
	OVERSCAN_COUNT: 5, // Items to render outside viewport
	SCROLL_DEBOUNCE: 16, // 60fps
	RESIZE_DEBOUNCE: 100,

	// Memory management
	MAX_RENDERED_ITEMS: 200,
	ITEM_CACHE_SIZE: 1000,

	// Progressive loading
	LOAD_MORE_THRESHOLD: 0.8, // Load more when 80% scrolled
	LOAD_MORE_BATCH_SIZE: 20,
};

/**
 * Virtual Scrolling Hook
 */
export const useVirtualScrolling = (items, itemHeight = VIRTUAL_CONFIG.DEFAULT_ITEM_HEIGHT, containerHeight = 600) => {
	const [scrollTop, setScrollTop] = useState(0);
	const [containerRect, setContainerRect] = useState({ height: containerHeight });
	const scrollElementRef = useRef(null);

	// Calculate visible range
	const visibleRange = useMemo(() => {
		const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - VIRTUAL_CONFIG.OVERSCAN_COUNT);
		const endIndex = Math.min(items.length - 1, Math.ceil((scrollTop + containerRect.height) / itemHeight) + VIRTUAL_CONFIG.OVERSCAN_COUNT);

		return { startIndex, endIndex };
	}, [scrollTop, containerRect.height, itemHeight, items.length]);

	// Get visible items
	const visibleItems = useMemo(() => {
		const { startIndex, endIndex } = visibleRange;
		return items.slice(startIndex, endIndex + 1).map((item, index) => ({
			...item,
			index: startIndex + index,
			top: (startIndex + index) * itemHeight,
		}));
	}, [items, visibleRange, itemHeight]);

	// Handle scroll events
	const handleScroll = useCallback((event) => {
		const newScrollTop = event.currentTarget.scrollTop;
		setScrollTop(newScrollTop);
	}, []);

	// Handle resize
	const handleResize = useCallback(() => {
		if (scrollElementRef.current) {
			const rect = scrollElementRef.current.getBoundingClientRect();
			setContainerRect({ height: rect.height });
		}
	}, []);

	// Setup resize observer
	useEffect(() => {
		const resizeObserver = new ResizeObserver(handleResize);
		if (scrollElementRef.current) {
			resizeObserver.observe(scrollElementRef.current);
		}

		return () => resizeObserver.disconnect();
	}, [handleResize]);

	// Calculate total height
	const totalHeight = items.length * itemHeight;

	// Check if should load more
	const shouldLoadMore = useMemo(() => {
		if (items.length === 0) return false;
		const scrollPercentage = (scrollTop + containerRect.height) / totalHeight;
		return scrollPercentage >= VIRTUAL_CONFIG.LOAD_MORE_THRESHOLD;
	}, [scrollTop, containerRect.height, totalHeight, items.length]);

	return {
		scrollElementRef,
		visibleItems,
		totalHeight,
		handleScroll,
		shouldLoadMore,
		visibleRange,
		scrollTop,
	};
};

/**
 * Virtual Scrolling Container Component
 */
export const VirtualScrollContainer = ({ items = [], itemHeight = VIRTUAL_CONFIG.DEFAULT_ITEM_HEIGHT, containerHeight = 600, renderItem, onLoadMore, loading = false, hasMore = true, className = "", estimateItemHeight, onScroll, children }) => {
	const [itemHeights, setItemHeights] = useState(new Map());
	const itemElementsRef = useRef(new Map());
	const loadingTriggeredRef = useRef(false);

	// Dynamic height calculation
	const getDynamicItemHeight = useCallback(
		(index) => {
			if (estimateItemHeight) {
				return itemHeights.get(index) || itemHeight;
			}
			return itemHeight;
		},
		[estimateItemHeight, itemHeights, itemHeight]
	);

	// Calculate total height with dynamic heights
	const totalHeight = useMemo(() => {
		if (!estimateItemHeight) {
			return items.length * itemHeight;
		}

		let height = 0;
		for (let i = 0; i < items.length; i++) {
			height += getDynamicItemHeight(i);
		}
		return height;
	}, [items.length, estimateItemHeight, getDynamicItemHeight, itemHeight]);

	// Calculate visible range with dynamic heights
	const getVisibleRange = useCallback(
		(scrollTop, containerHeight) => {
			if (!estimateItemHeight) {
				const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - VIRTUAL_CONFIG.OVERSCAN_COUNT);
				const endIndex = Math.min(items.length - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + VIRTUAL_CONFIG.OVERSCAN_COUNT);
				return { startIndex, endIndex };
			}

			// Dynamic height calculation
			let startIndex = 0;
			let endIndex = 0;
			let currentHeight = 0;
			let foundStart = false;

			for (let i = 0; i < items.length; i++) {
				const itemHeightValue = getDynamicItemHeight(i);

				if (!foundStart && currentHeight + itemHeightValue >= scrollTop - VIRTUAL_CONFIG.OVERSCAN_COUNT * itemHeight) {
					startIndex = Math.max(0, i - VIRTUAL_CONFIG.OVERSCAN_COUNT);
					foundStart = true;
				}

				currentHeight += itemHeightValue;

				if (foundStart && currentHeight >= scrollTop + containerHeight + VIRTUAL_CONFIG.OVERSCAN_COUNT * itemHeight) {
					endIndex = Math.min(items.length - 1, i + VIRTUAL_CONFIG.OVERSCAN_COUNT);
					break;
				}
			}

			if (!foundStart) {
				startIndex = Math.max(0, items.length - VIRTUAL_CONFIG.OVERSCAN_COUNT);
				endIndex = items.length - 1;
			}

			return { startIndex, endIndex };
		},
		[estimateItemHeight, itemHeight, getDynamicItemHeight, items.length]
	);

	const { scrollElementRef, visibleItems, handleScroll: baseHandleScroll, shouldLoadMore, visibleRange, scrollTop } = useVirtualScrolling(items, itemHeight, containerHeight);

	// Enhanced scroll handler
	const handleScroll = useCallback(
		(event) => {
			baseHandleScroll(event);
			onScroll?.(event);

			// Trigger load more
			if (shouldLoadMore && hasMore && !loading && !loadingTriggeredRef.current) {
				loadingTriggeredRef.current = true;
				onLoadMore?.();
			}
		},
		[baseHandleScroll, onScroll, shouldLoadMore, hasMore, loading, onLoadMore]
	);

	// Reset loading trigger when loading completes
	useEffect(() => {
		if (!loading) {
			loadingTriggeredRef.current = false;
		}
	}, [loading]);

	// Measure item heights dynamically
	const measureItemHeight = useCallback(
		(index, element) => {
			if (!estimateItemHeight || !element) return;

			const rect = element.getBoundingClientRect();
			const currentHeight = itemHeights.get(index);

			if (currentHeight !== rect.height) {
				setItemHeights((prev) => new Map(prev.set(index, rect.height)));
			}
		},
		[estimateItemHeight, itemHeights]
	);

	// Calculate item positions with dynamic heights
	const getItemTop = useCallback(
		(index) => {
			if (!estimateItemHeight) {
				return index * itemHeight;
			}

			let top = 0;
			for (let i = 0; i < index; i++) {
				top += getDynamicItemHeight(i);
			}
			return top;
		},
		[estimateItemHeight, itemHeight, getDynamicItemHeight]
	);

	// Render visible items with positions
	const renderVisibleItems = () => {
		const { startIndex, endIndex } = getVisibleRange(scrollTop, containerHeight);

		const visibleItems = [];
		for (let i = startIndex; i <= endIndex; i++) {
			if (i < items.length) {
				const item = items[i];
				const top = getItemTop(i);
				const height = getDynamicItemHeight(i);

				visibleItems.push(
					<div
						key={item.id || i}
						style={{
							position: "absolute",
							top: `${top}px`,
							height: `${height}px`,
							width: "100%",
						}}
						ref={(el) => {
							if (el) {
								itemElementsRef.current.set(i, el);
								measureItemHeight(i, el);
							}
						}}
					>
						{renderItem(item, i)}
					</div>
				);
			}
		}

		return visibleItems;
	};

	// Performance monitoring
	useEffect(() => {
		const { startIndex, endIndex } = visibleRange;
		const renderedCount = endIndex - startIndex + 1;

		if (renderedCount > VIRTUAL_CONFIG.MAX_RENDERED_ITEMS) {
			logger.warn(`Virtual scrolling rendering ${renderedCount} items, which exceeds optimal limit of ${VIRTUAL_CONFIG.MAX_RENDERED_ITEMS}`);
		}
	}, [visibleRange]);

	return (
		<div
			ref={scrollElementRef}
			className={`virtual-scroll-container ${className}`}
			style={{
				height: containerHeight,
				overflow: "auto",
				position: "relative",
			}}
			onScroll={handleScroll}
		>
			{/* Virtual spacer */}
			<div
				style={{
					height: `${totalHeight}px`,
					position: "relative",
				}}
			>
				{/* Rendered items */}
				{renderVisibleItems()}

				{/* Loading indicator */}
				{loading && (
					<div
						style={{
							position: "absolute",
							top: `${getItemTop(items.length)}px`,
							width: "100%",
							padding: "20px",
							textAlign: "center",
						}}
					>
						<div className="flex items-center justify-center space-x-2">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
							<span className="text-gray-600">Loading more results...</span>
						</div>
					</div>
				)}

				{/* End of results indicator */}
				{!hasMore && items.length > 0 && (
					<div
						style={{
							position: "absolute",
							top: `${getItemTop(items.length)}px`,
							width: "100%",
							padding: "20px",
							textAlign: "center",
						}}
					>
						<span className="text-gray-500">No more results</span>
					</div>
				)}
			</div>

			{children}
		</div>
	);
};

/**
 * Business Card Virtual List Component
 */
export const VirtualBusinessList = ({ businesses = [], onLoadMore, loading = false, hasMore = true, containerHeight = 600, onBusinessClick, className = "" }) => {
	const renderBusinessCard = useCallback(
		(business, index) => {
			return (
				<div className="business-card p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => onBusinessClick?.(business)} data-business-id={business.slug} data-preload={`/biz/${business.slug}`}>
					<div className="flex space-x-4">
						{/* Business Image */}
						<div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
							{business.photos?.[0] ? (
								<img src={business.photos[0].url} alt={business.name} className="w-full h-full object-cover rounded-lg" loading="lazy" />
							) : (
								<div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
									<span className="text-gray-500 text-xs">No Image</span>
								</div>
							)}
						</div>

						{/* Business Info */}
						<div className="flex-1 min-w-0">
							<h3 className="text-lg font-semibold text-gray-900 truncate">{business.name}</h3>

							{business.categories && business.categories.length > 0 && <p className="text-sm text-gray-600 truncate">{business.categories.map((cat) => cat.name).join(", ")}</p>}

							{business.description && <p className="text-sm text-gray-700 mt-1 line-clamp-2">{business.description}</p>}

							<div className="flex items-center space-x-4 mt-2">
								{business.rating && (
									<div className="flex items-center">
										<span className="text-yellow-400">★</span>
										<span className="text-sm text-gray-700 ml-1">
											{business.rating} ({business.reviewCount || 0})
										</span>
									</div>
								)}

								{business.address && <span className="text-sm text-gray-500 truncate">{business.address}</span>}
							</div>
						</div>
					</div>
				</div>
			);
		},
		[onBusinessClick]
	);

	return (
		<VirtualScrollContainer
			items={businesses}
			itemHeight={VIRTUAL_CONFIG.DEFAULT_ITEM_HEIGHT}
			containerHeight={containerHeight}
			renderItem={renderBusinessCard}
			onLoadMore={onLoadMore}
			loading={loading}
			hasMore={hasMore}
			className={className}
			estimateItemHeight={true} // Enable dynamic height calculation
		/>
	);
};

/**
 * Virtual Grid Component for image-heavy results
 */
export const VirtualBusinessGrid = ({ businesses = [], onLoadMore, loading = false, hasMore = true, containerHeight = 600, onBusinessClick, className = "", columns = 3 }) => {
	const itemHeight = 200; // Grid item height
	const itemsPerRow = columns;

	// Group businesses into rows
	const rows = useMemo(() => {
		const businessRows = [];
		for (let i = 0; i < businesses.length; i += itemsPerRow) {
			businessRows.push(businesses.slice(i, i + itemsPerRow));
		}
		return businessRows;
	}, [businesses, itemsPerRow]);

	const renderBusinessRow = useCallback(
		(row, rowIndex) => {
			return (
				<div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
					{row.map((business, colIndex) => (
						<div key={business.slug} className="business-grid-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onBusinessClick?.(business)} data-business-id={business.slug} data-preload={`/biz/${business.slug}`}>
							{/* Business Image */}
							<div className="w-full h-32 bg-gray-200 rounded-t-lg">
								{business.photos?.[0] ? (
									<img src={business.photos[0].url} alt={business.name} className="w-full h-full object-cover rounded-t-lg" loading="lazy" />
								) : (
									<div className="w-full h-full bg-gray-300 rounded-t-lg flex items-center justify-center">
										<span className="text-gray-500 text-sm">No Image</span>
									</div>
								)}
							</div>

							{/* Business Info */}
							<div className="p-3">
								<h4 className="font-semibold text-gray-900 truncate text-sm">{business.name}</h4>

								{business.categories && business.categories.length > 0 && <p className="text-xs text-gray-600 truncate mt-1">{business.categories[0].name}</p>}

								{business.rating && (
									<div className="flex items-center mt-2">
										<span className="text-yellow-400 text-sm">★</span>
										<span className="text-xs text-gray-700 ml-1">{business.rating}</span>
									</div>
								)}
							</div>
						</div>
					))}

					{/* Fill empty slots in last row */}
					{row.length < itemsPerRow && Array.from({ length: itemsPerRow - row.length }).map((_, index) => <div key={`empty-${index}`} />)}
				</div>
			);
		},
		[columns, onBusinessClick]
	);

	return <VirtualScrollContainer items={rows} itemHeight={itemHeight} containerHeight={containerHeight} renderItem={renderBusinessRow} onLoadMore={onLoadMore} loading={loading} hasMore={hasMore} className={className} />;
};

export default {
	VirtualScrollContainer,
	VirtualBusinessList,
	VirtualBusinessGrid,
	useVirtualScrolling,
};
