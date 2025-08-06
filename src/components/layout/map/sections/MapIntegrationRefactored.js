/**
 * MapIntegration Component - Refactored
 * Reduced from 485 lines to clean, modular implementation
 * Uses extracted sections: LocationServices, SearchSuggestions, MapBoundsManager, LocationControls
 * Enterprise-level component following performance-first patterns
 */

"use client";

import React from "react";
import { useLocationServices } from "./LocationServices";
import { useSearchSuggestions } from "./SearchSuggestions";
import { useMapBoundsManager } from "./MapBoundsManager";
import LocationControls from "./LocationControls";

const MapIntegration = ({ onLocationChange, onBoundsChange, onBusinessesUpdate, className = "", showControls = true, showAdvancedControls = true }) => {
	// Initialize location services
	const { userLocation, isGettingLocation, isSearching, locationError, getUserLocation, geocodeAddress, clearLocation, refreshLocation } = useLocationServices({ onLocationChange });

	// Initialize search suggestions
	const { searchLocation, searchSuggestions, showSuggestions, isLoadingSuggestions, handleSearchInputChange, handleSuggestionSelect, handleSearchSubmit, handleKeyDown, clearSearch, setShowSuggestions } = useSearchSuggestions({
		onLocationSelect: (suggestion) => {
			geocodeAddress(suggestion.description);
		},
		onSearchSubmit: (address) => {
			geocodeAddress(address);
		},
	});

	// Initialize map bounds manager
	const { mapBounds, zoomLevel, isUpdatingBounds, updateMapBounds, centerOnLocation, searchInCurrentArea, refreshBusinesses, getMapStats } = useMapBoundsManager({ onBoundsChange, onBusinessesUpdate });

	// Enhanced location change handler
	const handleLocationChange = (location) => {
		if (location && centerOnLocation) {
			centerOnLocation(location);
		}
		if (onLocationChange) {
			onLocationChange(location);
		}
	};

	// Render the location controls if enabled
	if (!showControls) {
		return null;
	}

	return (
		<div className={`map-integration ${className}`}>
			<LocationControls
				// Location state
				userLocation={userLocation}
				isGettingLocation={isGettingLocation}
				isSearching={isSearching || isUpdatingBounds}
				locationError={locationError}
				// Search state
				searchLocation={searchLocation}
				searchSuggestions={searchSuggestions}
				showSuggestions={showSuggestions}
				isLoadingSuggestions={isLoadingSuggestions}
				// Location actions
				onGetUserLocation={getUserLocation}
				onClearLocation={() => {
					clearLocation();
					clearSearch();
				}}
				onRefreshLocation={refreshLocation}
				// Search actions
				onSearchInputChange={handleSearchInputChange}
				onSuggestionSelect={handleSuggestionSelect}
				onSearchSubmit={handleSearchSubmit}
				onSearchKeyDown={handleKeyDown}
				onClearSearch={clearSearch}
				onSetShowSuggestions={setShowSuggestions}
				// Configuration
				showAdvancedControls={showAdvancedControls}
			/>
		</div>
	);
};

// Export individual hooks for advanced usage
export { useLocationServices, useSearchSuggestions, useMapBoundsManager };

export default MapIntegration;
