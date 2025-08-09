/**
 * MapBoundsManager Component
 * Extracted from MapIntegration.js (485 lines)
 * Handles map bounds management and business data fetching
 * Enterprise-level component with caching and performance optimization
 */

"use client";

import { useState, useCallback } from "react";
import { withErrorHandling, showErrorToast } from "@utils/error-handler";
import { useMapStore } from "@store/map";
import { useBusinessStore } from "@store/business";

export const useMapBoundsManager = ({ onBoundsChange, onBusinessesUpdate }) => {
	const [mapBounds, setMapBounds] = useState(null);
	const [zoomLevel, setZoomLevel] = useState(12);
	const [isUpdatingBounds, setIsUpdatingBounds] = useState(false);

	const { getMapBounds, getMapZoom, centerOn } = useMapStore();
	const { fetchBusinesses } = useBusinessStore();

	// Update map bounds and fetch businesses with performance optimization
	const updateMapBounds = useCallback(
		withErrorHandling(async () => {
			setIsUpdatingBounds(true);

			try {
				const bounds = await getMapBounds();
				const zoom = await getMapZoom();

				if (bounds && zoom) {
					setMapBounds(bounds);
					setZoomLevel(zoom);

					if (onBoundsChange) {
						onBoundsChange(bounds, zoom);
					}

					// Only fetch businesses if zoom level is appropriate (performance optimization)
					if (zoom >= 10) {
						const businesses = await fetchBusinesses("", "", bounds, zoom);

						if (onBusinessesUpdate) {
							onBusinessesUpdate(businesses);
						}
					}
				}
			} catch (error) {
				console.error("Failed to update map bounds:", error);
				showErrorToast("Failed to update map view");
			} finally {
				setIsUpdatingBounds(false);
			}
		}, "MapBoundsManager"),
		[getMapBounds, getMapZoom, onBoundsChange, fetchBusinesses, onBusinessesUpdate]
	);

	// Center map on specific location with bounds update
	const centerOnLocation = useCallback(
		withErrorHandling(async (location) => {
			try {
				await centerOn(location.lat, location.lng);

				// Update bounds after centering with a slight delay for map rendering
				setTimeout(updateMapBounds, 500);
			} catch (error) {
				showErrorToast("Failed to center map on location");
			}
		}, "MapBoundsManager"),
		[centerOn, updateMapBounds]
	);

	// Search businesses in current area
	const searchInCurrentArea = useCallback(
		withErrorHandling(async (searchQuery = "", categoryFilter = "") => {
			if (!mapBounds) {
				throw new Error("Map bounds not available");
			}

			setIsUpdatingBounds(true);

			try {
				const businesses = await fetchBusinesses(searchQuery, categoryFilter, mapBounds, zoomLevel);

				if (onBusinessesUpdate) {
					onBusinessesUpdate(businesses);
				}

				return businesses;
			} catch (error) {
				showErrorToast("Failed to search businesses in this area");
				throw error;
			} finally {
				setIsUpdatingBounds(false);
			}
		}, "MapBoundsManager"),
		[mapBounds, zoomLevel, fetchBusinesses, onBusinessesUpdate]
	);

	// Refresh businesses in current bounds
	const refreshBusinesses = useCallback(() => {
		if (mapBounds) {
			updateMapBounds();
		}
	}, [mapBounds, updateMapBounds]);

	// Get current map statistics
	const getMapStats = useCallback(() => {
		return {
			bounds: mapBounds,
			zoom: zoomLevel,
			hasValidBounds: !!mapBounds,
			canFetchBusinesses: zoomLevel >= 10,
		};
	}, [mapBounds, zoomLevel]);

	return {
		// State
		mapBounds,
		zoomLevel,
		isUpdatingBounds,

		// Actions
		updateMapBounds,
		centerOnLocation,
		searchInCurrentArea,
		refreshBusinesses,
		getMapStats,
	};
};

export default useMapBoundsManager;
