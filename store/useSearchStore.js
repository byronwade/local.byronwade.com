import { create } from "zustand";

// Function to fetch city and state from coordinates
const fetchCityAndStateFromCoordinates = async (latitude, longitude) => {
	try {
		const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`);
		const data = await response.json();

		if (data.status === "OK" && data.results.length > 0) {
			const addressComponents = data.results[0].address_components;

			let city = "";
			let state = "";

			// Extract city and state from address components
			addressComponents.forEach((component) => {
				if (component.types.includes("locality")) {
					city = component.long_name;
				}
				if (component.types.includes("administrative_area_level_1")) {
					state = component.short_name;
				}
			});

			return { city, state };
		} else {
			throw new Error("No results found");
		}
	} catch (error) {
		console.error("Error fetching city and state:", error);
		throw error;
	}
};

// Function to get coordinates from a ZIP code (stub, needs real implementation)
const getCoordinatesFromZipCode = (zipCode) => {
	// This should be replaced with a real implementation or a lookup database
	// Example response for illustration
	return {
		lat: 37.7749,
		lng: -122.4194,
	};
};

// Function to fetch city and state based on input (coordinates or ZIP code)
const fetchCityAndState = async (input) => {
	let latitude, longitude;

	if (typeof input === "string") {
		// Assume input is a ZIP code
		const coordinates = getCoordinatesFromZipCode(input);
		if (coordinates) {
			latitude = coordinates.lat;
			longitude = coordinates.lng;
		} else {
			throw new Error("ZIP code not found in the database");
		}
	} else if (typeof input === "object" && input.lat && input.lng) {
		// Assume input is an object with latitude and longitude
		latitude = input.lat;
		longitude = input.lng;
	} else {
		throw new Error("Invalid input format");
	}

	return await fetchCityAndStateFromCoordinates(latitude, longitude);
};

const useSearchStore = create((set) => ({
	query: "",
	location: null,
	setQuery: (query) => set({ query }),
	setLocation: (location) => set({ location }),

	fetchCurrentLocation: (successCallback, errorCallback) => {
		if (navigator.geolocation) {
			// Use the browser's geolocation
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					const location = { lat: latitude, lng: longitude };
					set({ location });
					if (successCallback) {
						successCallback(location);
					}
				},
				(error) => {
					console.error("Browser geolocation error:", error);
					// Fallback to Google's Geolocation API
					useSearchStore.getState().fetchGoogleGeolocation(successCallback, errorCallback);
				},
				{
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0,
				}
			);
		} else {
			// Geolocation not supported
			useSearchStore.getState().fetchGoogleGeolocation(successCallback, errorCallback);
		}
	},

	fetchCityAndState: async (input) => {
		try {
			const { city, state } = await fetchCityAndState(input);
			return { city, state };
		} catch (error) {
			console.error("Error fetching city and state:", error);
			throw error;
		}
	},

	fetchAutocompleteSuggestions: async (input) => {
		try {
			const response = await fetch(`/api/autocomplete?input=${encodeURIComponent(input)}`);
			const data = await response.json();

			if (data.status === "OK" && data.predictions.length > 0) {
				return data.predictions;
			} else {
				throw new Error("No predictions found");
			}
		} catch (error) {
			console.error("Error fetching autocomplete suggestions:", error);
			throw error;
		}
	},

	fetchPlaceDetails: async (placeId) => {
		try {
			const response = await fetch(`/api/place-details?place_id=${encodeURIComponent(placeId)}`);
			const data = await response.json();

			if (data.status === "OK" && data.result) {
				return data.result;
			} else {
				throw new Error("No place details found");
			}
		} catch (error) {
			console.error("Error fetching place details:", error);
			throw error;
		}
	},

	fetchGoogleGeolocation: (successCallback, errorCallback) => {
		fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.location) {
					const { lat, lng } = data.location;
					const location = { lat, lng };
					set({ location });
					if (successCallback) {
						successCallback(location);
					}
				} else {
					throw new Error("Google Geolocation API error: No location data");
				}
			})
			.catch((error) => {
				console.error("Google Geolocation API error:", error);
				if (errorCallback) {
					errorCallback(error);
				}
			});
	},
}));

export default useSearchStore;
