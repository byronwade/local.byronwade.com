/**
 * Map Utilities Data Layer
 * Centralized utilities for map functionality
 * Enterprise-level helper functions with performance optimization
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - First coordinate {lat, lng}
 * @param {Object} coord2 - Second coordinate {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (coord1, coord2) => {
	const R = 6371; // Earth's radius in kilometers
	const dLat = toRadians(coord2.lat - coord1.lat);
	const dLng = toRadians(coord2.lng - coord1.lng);

	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees to convert
 * @returns {number} Radians
 */
export const toRadians = (degrees) => {
	return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
	if (distance < 1) {
		return `${Math.round(distance * 1000)}m`;
	}
	return `${distance.toFixed(1)}km`;
};

/**
 * Check if coordinates are within bounds
 * @param {Object} coords - Coordinates {lat, lng}
 * @param {Object} bounds - Map bounds {north, south, east, west}
 * @returns {boolean} True if within bounds
 */
export const isWithinBounds = (coords, bounds) => {
	return coords.lat >= bounds.south && coords.lat <= bounds.north && coords.lng >= bounds.west && coords.lng <= bounds.east;
};

/**
 * Calculate map zoom level based on distance
 * @param {number} distance - Distance in kilometers
 * @returns {number} Appropriate zoom level
 */
export const calculateZoomFromDistance = (distance) => {
	if (distance <= 1) return 16;
	if (distance <= 5) return 14;
	if (distance <= 10) return 13;
	if (distance <= 25) return 12;
	if (distance <= 50) return 11;
	if (distance <= 100) return 10;
	if (distance <= 200) return 9;
	return 8;
};

/**
 * Get center point from array of coordinates
 * @param {Array} coordinates - Array of {lat, lng} objects
 * @returns {Object} Center coordinates {lat, lng}
 */
export const getCenterFromCoordinates = (coordinates) => {
	if (!coordinates || coordinates.length === 0) {
		return null;
	}

	if (coordinates.length === 1) {
		return coordinates[0];
	}

	const sum = coordinates.reduce(
		(acc, coord) => ({
			lat: acc.lat + coord.lat,
			lng: acc.lng + coord.lng,
		}),
		{ lat: 0, lng: 0 }
	);

	return {
		lat: sum.lat / coordinates.length,
		lng: sum.lng / coordinates.length,
	};
};

/**
 * Create bounds from coordinates with padding
 * @param {Array} coordinates - Array of {lat, lng} objects
 * @param {number} padding - Padding factor (default: 0.1)
 * @returns {Object} Bounds {north, south, east, west}
 */
export const createBoundsFromCoordinates = (coordinates, padding = 0.1) => {
	if (!coordinates || coordinates.length === 0) {
		return null;
	}

	const lats = coordinates.map((coord) => coord.lat);
	const lngs = coordinates.map((coord) => coord.lng);

	const minLat = Math.min(...lats);
	const maxLat = Math.max(...lats);
	const minLng = Math.min(...lngs);
	const maxLng = Math.max(...lngs);

	const latPadding = (maxLat - minLat) * padding;
	const lngPadding = (maxLng - minLng) * padding;

	return {
		north: maxLat + latPadding,
		south: minLat - latPadding,
		east: maxLng + lngPadding,
		west: minLng - lngPadding,
	};
};

/**
 * Validate coordinates
 * @param {Object} coords - Coordinates {lat, lng}
 * @returns {boolean} True if valid coordinates
 */
export const validateCoordinates = (coords) => {
	return coords && typeof coords.lat === "number" && typeof coords.lng === "number" && coords.lat >= -90 && coords.lat <= 90 && coords.lng >= -180 && coords.lng <= 180;
};

/**
 * Map style configurations
 */
export const mapStyles = {
	streets: "mapbox://styles/mapbox/streets-v12",
	satellite: "mapbox://styles/mapbox/satellite-v9",
	outdoors: "mapbox://styles/mapbox/outdoors-v12",
	light: "mapbox://styles/mapbox/light-v11",
	dark: "mapbox://styles/mapbox/dark-v11",
};

/**
 * Default map settings for different use cases
 */
export const mapSettings = {
	default: {
		zoom: 12,
		style: mapStyles.streets,
		showControls: true,
		interactive: true,
	},
	embedded: {
		zoom: 14,
		style: mapStyles.light,
		showControls: false,
		interactive: false,
	},
	fullscreen: {
		zoom: 10,
		style: mapStyles.streets,
		showControls: true,
		interactive: true,
	},
};

/**
 * Business density calculations
 */
export const calculateBusinessDensity = (businesses, bounds) => {
	if (!businesses || !bounds) return 0;

	// Calculate area of bounds (rough approximation)
	const latDiff = bounds.north - bounds.south;
	const lngDiff = bounds.east - bounds.west;
	const area = latDiff * lngDiff * 111 * 111; // Rough km² conversion

	return businesses.length / area;
};

/**
 * Clustering helpers
 */
export const shouldClusterMarkers = (zoom, businessCount) => {
	// Cluster when zoom is low and there are many businesses
	return zoom < 12 && businessCount > 50;
};

/**
 * Performance optimization helpers
 */
export const throttle = (func, delay) => {
	let timeoutId;
	let lastExecTime = 0;

	return function (...args) {
		const currentTime = Date.now();

		if (currentTime - lastExecTime > delay) {
			func.apply(this, args);
			lastExecTime = currentTime;
		} else {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(
				() => {
					func.apply(this, args);
					lastExecTime = Date.now();
				},
				delay - (currentTime - lastExecTime)
			);
		}
	};
};

/**
 * Debounce function for search inputs
 */
export const debounce = (func, delay) => {
	let timeoutId;

	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func.apply(this, args), delay);
	};
};
