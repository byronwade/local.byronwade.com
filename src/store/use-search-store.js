import { create } from "zustand";
import debounce from "lodash/debounce";
import { algoliaIndex } from "@lib/algolia-client";

const useSearchStore = create((set, get) => ({
	searchQuery: "",
	location: {
		lat: null,
		lng: null,
		value: "",
		city: "",
		loading: false,
		error: null,
		errorMessage: "",
		filteredSuggestions: [],
	},
	suggestions: [],
	recentSearches: [],
	popularSearches: ["Restaurants", "Hair Salons", "Auto Repair", "Dentists", "Plumbers", "Coffee Shops", "Gas Stations", "Grocery Stores"],
	errors: {},
	touched: {
		searchQuery: false,
		location: false,
	},
	activeDropdown: null, // Track which dropdown is currently open: 'search' | 'location' | null

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

	setActiveDropdown: (dropdownType) =>
		set((state) => ({
			...state,
			activeDropdown: dropdownType,
		})),

	addRecentSearch: (query) => {
		if (typeof window !== "undefined") {
			try {
				const stored = localStorage.getItem("recent-searches") || "[]";
				const recentSearches = JSON.parse(stored);

				if (query && query.trim()) {
					const trimmedQuery = query.trim();
					const filtered = recentSearches.filter((search) => search !== trimmedQuery);
					const newRecent = [trimmedQuery, ...filtered].slice(0, 10);

					localStorage.setItem("recent-searches", JSON.stringify(newRecent));
					set((state) => ({ ...state, recentSearches: newRecent }));
				}
			} catch (error) {
				console.error("Error saving recent search:", error);
			}
		}
	},

	loadRecentSearches: () => {
		if (typeof window !== "undefined") {
			try {
				const stored = localStorage.getItem("recent-searches") || "[]";
				const recentSearches = JSON.parse(stored);
				set((state) => ({ ...state, recentSearches }));
			} catch (error) {
				console.error("Error loading recent searches:", error);
			}
		}
	},

	clearRecentSearches: () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("recent-searches");
		}
		set((state) => ({
			...state,
			recentSearches: [],
		}));
	},

	fetchSearchSuggestions: debounce(async (query) => {
		try {
			const { hits } = await algoliaIndex.search(query, {
				attributesToRetrieve: ["categories", "name", "description"],
				hitsPerPage: 8,
			});

			// Create smart suggestions from business data
			const businessSuggestions = hits.map((hit) => ({
				text: hit.name,
				type: "business",
			}));

			const categorySuggestions = [...new Set(hits.map((hit) => hit.categories).flat())].slice(0, 5).map((category) => ({
				text: category,
				type: "category",
			}));

			const combinedSuggestions = [...businessSuggestions.slice(0, 5), ...categorySuggestions];

			set((state) => ({
				...state,
				suggestions: combinedSuggestions,
			}));
		} catch (error) {
			console.error("Error fetching search suggestions:", error);
			set((state) => ({
				...state,
				suggestions: [],
			}));
		}
	}, 300),

	// Location services
	fetchCurrentLocation: (onSuccess, onError) => {
		if (!navigator.geolocation) {
			onError(new Error("Geolocation is not supported"));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				onSuccess({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			},
			onError,
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000, // 5 minutes
			}
		);
	},

	fetchAutocompleteSuggestions: async (query) => {
		try {
			const response = await fetch(`/api/autocomplete?input=${encodeURIComponent(query)}`);
			if (!response.ok) throw new Error("Failed to fetch suggestions");

			const data = await response.json();
			return data.predictions || [];
		} catch (error) {
			console.error("Error fetching location suggestions:", error);
			return [];
		}
	},

	fetchPlaceDetails: async (placeId) => {
		try {
			const response = await fetch(`/api/place-details?place_id=${placeId}`);
			if (!response.ok) throw new Error("Failed to fetch place details");

			return await response.json();
		} catch (error) {
			console.error("Error fetching place details:", error);
			throw error;
		}
	},

	fetchCoordinatesFromCityAndState: async (locationString) => {
		try {
			const response = await fetch(`/api/geocode?address=${encodeURIComponent(locationString)}`);
			if (!response.ok) throw new Error("Failed to geocode location");

			const data = await response.json();
			return {
				lat: data.lat,
				lng: data.lng,
			};
		} catch (error) {
			console.error("Error geocoding location:", error);
			throw error;
		}
	},

	fetchCityAndStateFromCoordinates: async (lat, lng) => {
		try {
			const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
			if (!response.ok) throw new Error("Failed to reverse geocode");

			const data = await response.json();
			return {
				city: data.city,
				state: data.state,
			};
		} catch (error) {
			console.error("Error reverse geocoding:", error);
			throw error;
		}
	},
}));

export default useSearchStore;
