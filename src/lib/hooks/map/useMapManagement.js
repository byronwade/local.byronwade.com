/**
 * Map Management Custom Hook
 * Centralized map state management with performance optimization
 * Enterprise-level hook following React best practices
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { withErrorHandling, showErrorToast, showSuccessToast } from "@utils/errorHandler";
import { calculateDistance, formatDistance, validateCoordinates, throttle } from "@lib/data/map";
import { useMapStore } from "@store/map";
import { useBusinessStore } from "@store/business";

export const useMapManagement = (initialOptions = {}) => {
	const { autoFetchBusinesses = true, performanceMode = true, cacheResults = true, minZoomForBusinesses = 10 } = initialOptions;

	// Local state
	const [isLoading, setIsLoading] = useState(false);
	const [lastFetchBounds, setLastFetchBounds] = useState(null);
	const [mapStats, setMapStats] = useState({
		businessCount: 0,
		averageDistance: 0,
		boundingBox: null,
	});

	// Refs for performance optimization
	const lastFetchRef = useRef(null);
	const cacheRef = useRef(new Map());

	// Store hooks
	const { getMapBounds, getMapZoom, setMapCenter, setMapZoom, centerOn } = useMapStore();

	const { fetchBusinesses, allBusinesses, setFilteredBusinesses } = useBusinessStore();

	// Throttled bounds update for performance
	const throttledBoundsUpdate = useCallback(
		throttle(
			async (bounds, zoom) => {
				if (!autoFetchBusinesses || zoom < minZoomForBusinesses) {
					return;
				}

				// Check cache first
				const cacheKey = `${bounds.north}_${bounds.south}_${bounds.east}_${bounds.west}_${zoom}`;
				if (cacheResults && cacheRef.current.has(cacheKey)) {
					const cachedData = cacheRef.current.get(cacheKey);
					setMapStats(cachedData.stats);
					return cachedData.businesses;
				}

				setIsLoading(true);
				try {
					const businesses = await fetchBusinesses("", "", bounds, zoom);

					// Update statistics
					const stats = calculateMapStats(businesses, bounds);
					setMapStats(stats);
					setLastFetchBounds(bounds);

					// Cache results
					if (cacheResults) {
						cacheRef.current.set(cacheKey, { businesses, stats });

						// Limit cache size
						if (cacheRef.current.size > 50) {
							const firstKey = cacheRef.current.keys().next().value;
							cacheRef.current.delete(firstKey);
						}
					}

					return businesses;
				} catch (error) {
					showErrorToast("Failed to fetch businesses in this area");
					throw error;
				} finally {
					setIsLoading(false);
				}
			},
			performanceMode ? 500 : 100
		),
		[autoFetchBusinesses, minZoomForBusinesses, cacheResults, fetchBusinesses, performanceMode]
	);

	// Calculate map statistics
	const calculateMapStats = useCallback((businesses, bounds) => {
		if (!businesses || businesses.length === 0) {
			return {
				businessCount: 0,
				averageDistance: 0,
				boundingBox: bounds,
			};
		}

		const center = {
			lat: (bounds.north + bounds.south) / 2,
			lng: (bounds.east + bounds.west) / 2,
		};

		const distances = businesses.filter((business) => business.latitude && business.longitude).map((business) => calculateDistance(center, { lat: business.latitude, lng: business.longitude }));

		const averageDistance = distances.length > 0 ? distances.reduce((sum, dist) => sum + dist, 0) / distances.length : 0;

		return {
			businessCount: businesses.length,
			averageDistance,
			boundingBox: bounds,
		};
	}, []);

	// Update map bounds and fetch businesses
	const updateMapBounds = useCallback(
		withErrorHandling(async () => {
			try {
				const bounds = await getMapBounds();
				const zoom = await getMapZoom();

				if (bounds && zoom) {
					return await throttledBoundsUpdate(bounds, zoom);
				}
			} catch (error) {
				console.error("Failed to update map bounds:", error);
				showErrorToast("Failed to update map view");
			}
		}, "MapManagement"),
		[getMapBounds, getMapZoom, throttledBoundsUpdate]
	);

	// Center map on location with validation
	const centerOnLocation = useCallback(
		withErrorHandling(async (location, zoomLevel = 14) => {
			if (!validateCoordinates(location)) {
				throw new Error("Invalid coordinates provided");
			}

			await centerOn(location.lat, location.lng);

			if (zoomLevel) {
				await setMapZoom(zoomLevel);
			}

			// Update bounds after a delay for map rendering
			setTimeout(updateMapBounds, 500);

			showSuccessToast(`Centered on location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
		}, "MapManagement"),
		[centerOn, setMapZoom, updateMapBounds]
	);

	// Search businesses in current area
	const searchInCurrentArea = useCallback(
		withErrorHandling(async (query = "", category = "") => {
			const bounds = await getMapBounds();
			const zoom = await getMapZoom();

			if (!bounds) {
				throw new Error("Map bounds not available");
			}

			setIsLoading(true);
			try {
				const businesses = await fetchBusinesses(query, category, bounds, zoom);

				// Update filtered businesses in store
				setFilteredBusinesses(businesses);

				// Update statistics
				const stats = calculateMapStats(businesses, bounds);
				setMapStats(stats);

				showSuccessToast(`Found ${businesses.length} business${businesses.length !== 1 ? "es" : ""}`);

				return businesses;
			} finally {
				setIsLoading(false);
			}
		}, "MapManagement"),
		[getMapBounds, getMapZoom, fetchBusinesses, setFilteredBusinesses, calculateMapStats]
	);

	// Get nearby businesses for a specific location
	const getNearbyBusinesses = useCallback(
		withErrorHandling(async (location, radiusKm = 5) => {
			if (!validateCoordinates(location)) {
				throw new Error("Invalid coordinates provided");
			}

			const nearbyBusinesses = allBusinesses.filter((business) => {
				if (!business.latitude || !business.longitude) return false;

				const distance = calculateDistance(location, { lat: business.latitude, lng: business.longitude });

				return distance <= radiusKm;
			});

			return nearbyBusinesses.map((business) => ({
				...business,
				distance: calculateDistance(location, { lat: business.latitude, lng: business.longitude }),
				formattedDistance: formatDistance(calculateDistance(location, { lat: business.latitude, lng: business.longitude })),
			}));
		}, "MapManagement"),
		[allBusinesses]
	);

	// Clear cache
	const clearCache = useCallback(() => {
		cacheRef.current.clear();
		showSuccessToast("Map cache cleared");
	}, []);

	// Get performance metrics
	const getPerformanceMetrics = useCallback(() => {
		return {
			cacheSize: cacheRef.current.size,
			lastFetchTime: lastFetchRef.current,
			isPerformanceMode: performanceMode,
			cacheEnabled: cacheResults,
		};
	}, [performanceMode, cacheResults]);

	return {
		// State
		isLoading,
		mapStats,
		lastFetchBounds,

		// Actions
		updateMapBounds,
		centerOnLocation,
		searchInCurrentArea,
		getNearbyBusinesses,
		clearCache,

		// Utilities
		getPerformanceMetrics,
		calculateMapStats,
	};
};

export default useMapManagement;
