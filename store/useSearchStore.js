import { create } from "zustand";
import debounce from "lodash/debounce";

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

// Function to get coordinates from a city and state
const fetchCoordinatesFromCityAndState = async (cityAndState) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${cityAndState}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`);
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            throw new Error("No results found");
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        throw error;
    }
};

const useSearchStore = create((set) => ({
	searchQuery: "",
	location: {
		lat: null,
		lng: null,
		value: "",
		city: "",
		loading: false,
		error: null,
		filteredSuggestions: [],
	},
	suggestions: [
		{ text: "Find business information", icon: "Search", color: "rgb(226, 197, 65)" },
		{ text: "Create a business content calendar", icon: "Calendar", color: "rgb(203, 139, 208)" },
		{ text: "Organize business documents", icon: "Clipboard", color: "rgb(203, 139, 208)" },
		{ text: "Write a business proposal", icon: "Book", color: "rgb(226, 197, 65)" },
	],
	errors: {},
	touched: {
		searchQuery: false,
		location: false,
	},

	setSearchQuery: (searchQuery) =>
		set((state) => ({
			...state,
			searchQuery,
			errors: {
				...state.errors,
				searchQuery: "",
			},
		})),
	setLocation: (location) =>
		set((state) => ({
			...state,
			location: {
				...state.location,
				...location,
			},
		})),
	setErrors: (errors) =>
		set((state) => ({
			...state,
			errors,
		})),
	setTouched: (touched) =>
		set((state) => ({
			...state,
			touched,
		})),

	fetchCurrentLocation: (successCallback, errorCallback) => {
		if (navigator.geolocation) {
			// Use the browser's geolocation
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					const location = { lat: latitude, lng: longitude };
					set((state) => ({
						location: {
							...state.location,
							lat: latitude,
							lng: longitude,
							error: null,
						},
					}));
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

	fetchCityAndStateFromCoordinates,
	fetchCoordinatesFromCityAndState,

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
					set((state) => ({
						location: {
							...state.location,
							lat,
							lng,
							error: null,
						},
					}));
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
