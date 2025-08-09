/**
 * LocationServices Component
 * Extracted from MapIntegration.js (485 lines)
 * Handles geolocation and geocoding functionality
 * Enterprise-level component following performance-first patterns
 */

"use client";

import { useState, useCallback } from "react";
import { withErrorHandling, showErrorToast, showSuccessToast } from "@utils/error-handler";
import { useMapStore } from "@store/map";

export const useLocationServices = ({ onLocationChange }) => {
	const [userLocation, setUserLocation] = useState(null);
	const [isGettingLocation, setIsGettingLocation] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [locationError, setLocationError] = useState(null);

	const { setMapCenter, setMapZoom } = useMapStore();

	// Get user's current location with enhanced error handling
	const getUserLocation = useCallback(async () => {
		return withErrorHandling(async () => {
			if (!navigator.geolocation) {
				throw new Error("Geolocation is not supported by this browser");
			}

			setIsGettingLocation(true);
			setLocationError(null);

			return new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude } = position.coords;
						const location = { lat: latitude, lng: longitude };

						setUserLocation(location);
						setMapCenter(location);
						setMapZoom(14);

						if (onLocationChange) {
							onLocationChange(location);
						}

						showSuccessToast("Location detected successfully");
						resolve(location);
					},
					(error) => {
						let errorMessage = "Failed to get your location";

						switch (error.code) {
							case error.PERMISSION_DENIED:
								errorMessage = "Location access denied. Please enable location services.";
								break;
							case error.POSITION_UNAVAILABLE:
								errorMessage = "Location information is unavailable.";
								break;
							case error.TIMEOUT:
								errorMessage = "Location request timed out.";
								break;
							default:
								errorMessage = "An unknown error occurred while getting location.";
						}

						setLocationError(errorMessage);
						showErrorToast(errorMessage);
						reject(new Error(errorMessage));
					},
					{
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 60000,
					}
				);
			});
		}, "LocationServices")();
	}, [setMapCenter, setMapZoom, onLocationChange]);

	// Geocode address to coordinates with performance optimization
	const geocodeAddress = useCallback(
		async (address) => {
			return withErrorHandling(async () => {
				if (!address.trim()) {
					throw new Error("Please enter a valid address");
				}

				setIsSearching(true);
				setLocationError(null);

				try {
					const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);

					if (!response.ok) {
						throw new Error(`Geocoding failed: ${response.status}`);
					}

					const data = await response.json();

					if (data.error) {
						throw new Error(data.error);
					}

					if (!data.results || data.results.length === 0) {
						throw new Error("No results found for this address");
					}

					const result = data.results[0];
					const location = {
						lat: result.geometry.location.lat,
						lng: result.geometry.location.lng,
					};

					setUserLocation(location);
					setMapCenter(location);
					setMapZoom(14);

					if (onLocationChange) {
						onLocationChange(location);
					}

					showSuccessToast(`Location found: ${result.formatted_address}`);
					return { location, address: result.formatted_address };
				} catch (error) {
					setLocationError(error.message);
					showErrorToast(error.message);
					throw error;
				} finally {
					setIsSearching(false);
				}
			}, "LocationServices")();
		},
		[setMapCenter, setMapZoom, onLocationChange]
	);

	// Clear location state
	const clearLocation = useCallback(() => {
		setUserLocation(null);
		setLocationError(null);

		if (onLocationChange) {
			onLocationChange(null);
		}
	}, [onLocationChange]);

	// Refresh current location
	const refreshLocation = useCallback(() => {
		if (userLocation) {
			getUserLocation();
		}
	}, [userLocation, getUserLocation]);

	return {
		// State
		userLocation,
		isGettingLocation,
		isSearching,
		locationError,

		// Actions
		getUserLocation,
		geocodeAddress,
		clearLocation,
		refreshLocation,
	};
};

export default useLocationServices;
