import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { z } from "zod";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const searchQuerySchema = z.string().min(1, "Search query cannot be empty").nonempty();
const zipCodeSchema = z
	.string()
	.regex(/^\d{5}$/, "Invalid zip code format")
	.nonempty();

const useSearchStore = create(
	devtools((set, get) => ({
		searchQuery: "",
		zipCode: "",
		dropdownQuery: "",
		filteredLocations: [],
		locationError: null,
		isValidZipCode: false,
		isValidSearchQuery: false,
		dropdownOpen: false,
		filterCount: 0,
		ratingFilters: { oneStar: false, twoStars: false, threeStars: false, fourStars: false, fiveStars: false },
		openFilters: { openNow: false, open24Hours: false },
		priceFilters: { oneDollar: false, twoDollars: false, threeDollars: false, fourDollars: false },
		sortOption: "rating",
		isRatingModified: false,
		isOpenModified: false,
		isPriceModified: false,
		isSortModified: false,
		isZipModified: false,
		loading: false,

		setSearchQuery: (query) => {
			set({ searchQuery: query });
			get().validateSearchQuery(query);
		},
		setZipCode: (zip) => {
			set({ zipCode: zip });
			get().validateZipCode(zip);
		},
		setDropdownQuery: (query) => set({ dropdownQuery: query }),
		setDropdownOpen: (open) => set({ dropdownOpen: open }),
		setLoading: (loading) => set({ loading }),

		validateSearchQuery: (query) => {
			try {
				searchQuerySchema.parse(query);
				set({ isValidSearchQuery: true });
			} catch {
				set({ isValidSearchQuery: false });
			}
		},
		validateZipCode: (zip) => {
			try {
				zipCodeSchema.parse(zip);
				set({ isValidZipCode: true });
			} catch {
				set({ isValidZipCode: false });
			}
		},
		updateUrl: () => {
			const { searchQuery, zipCode } = get();
			const params = new URLSearchParams();
			params.set("query", searchQuery);
			if (zipCode) {
				params.set("zip", zipCode);
			} else {
				params.delete("zip");
			}
			return `/search?${params.toString()}`;
		},
		handleFilterChange: (onFilterChange) => {
			const { searchQuery, zipCode, ratingFilters, openFilters, priceFilters, sortOption } = get();
			if (typeof onFilterChange === "function") {
				onFilterChange({ searchQuery, zipCode, ratingFilters, openFilters, priceFilters, sortOption });
			}
		},
		getCurrentLocation: async () => {
			try {
				const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
				const { latitude, longitude } = position.coords;
				const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`);
				const zipCode = response.data.features.find((feature) => feature.place_type.includes("postcode"))?.text;
				set({ zipCode });
				return { zipCode, latitude, longitude };
			} catch (error) {
				console.error("Error getting current location:", error);
				return null;
			}
		},
		getZipCodeFromCoordinates: async (lat, lng) => {
			const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`);
			const addressComponents = response.data.results[0].address_components;
			const zipCodeComponent = addressComponents.find((component) => component.types.includes("postal_code"));
			return zipCodeComponent ? zipCodeComponent.long_name : null;
		},
		fetchLocations: async (query) => {
			set({ loading: true });
			try {
				const response = await fetch(`https://api.zippopotam.us/us/${query}`);
				if (!response.ok) {
					set({ filteredLocations: [] });
					return;
				}
				const data = await response.json();
				const locations = data.places.map((place) => ({
					name: `${place["place name"]}, ${place["state abbreviation"]}`,
					zip: data["post code"],
				}));
				set({ filteredLocations: locations });
			} finally {
				set({ loading: false });
			}
		},
		handleSearchChange: (e) => {
			const query = e.target.value;
			get().setSearchQuery(query);
		},
		handleDropdownSearchChange: (e) => {
			const query = e.target.value;
			set({ dropdownQuery: query });
			if (query.length >= 3) {
				get().fetchLocations(query);
			} else {
				set({ filteredLocations: [] });
			}
		},
		handleLocationSelect: (zip) => {
			get().setZipCode(zip);
			set({ dropdownQuery: zip, dropdownOpen: false, isZipModified: true });
			get().validateZipCode(zip);
		},
		setFilteredLocations: (locations) => set({ filteredLocations: locations }), // Define setFilteredLocations function
		handleSubmit: () => {
			let isFormValid = true;
			get().validateSearchQuery(get().searchQuery);
			get().validateZipCode(get().zipCode);
			if (get().isValidSearchQuery && get().isValidZipCode) {
				get().handleFilterChange();
				return get().updateUrl();
			}
			return null;
		},
		handleDropdownKeyDown: (e) => {
			if (e.key === "Enter") {
				get().handleSubmit();
			}
		},
		handleFilterChangeCallback: (category, filter, value) => {
			if (category === "rating") {
				set((state) => ({ ratingFilters: { ...state.ratingFilters, [filter]: value }, isRatingModified: true }));
			} else if (category === "open") {
				set((state) => ({ openFilters: { ...state.openFilters, [filter]: value }, isOpenModified: true }));
			} else if (category === "price") {
				set((state) => ({ priceFilters: { ...state.priceFilters, [filter]: value }, isPriceModified: true }));
			}
			get().handleFilterChange();
		},
		handleSortChange: (value) => {
			set({ sortOption: value, isSortModified: true });
			get().handleFilterChange();
		},
		handleResetFilters: (category) => {
			if (category === "rating") {
				set({ ratingFilters: { oneStar: false, twoStars: false, threeStars: false, fourStars: false, fiveStars: false }, isRatingModified: false });
			} else if (category === "open") {
				set({ openFilters: { openNow: false, open24Hours: false }, isOpenModified: false });
			} else if (category === "price") {
				set({ priceFilters: { oneDollar: false, twoDollars: false, threeDollars: false, fourDollars: false }, isPriceModified: false });
			} else if (category === "sort") {
				set({ sortOption: "rating", isSortModified: false });
			} else if (category === "zip") {
				set({ zipCode: "", isZipModified: false });
			} else if (category === "filters") {
				set({
					ratingFilters: { oneStar: false, twoStars: false, threeStars: false, fourStars: false, fiveStars: false },
					openFilters: { openNow: false, open24Hours: false },
					priceFilters: { oneDollar: false, twoDollars: false, threeDollars: false, fourDollars: false },
					isRatingModified: false,
					isOpenModified: false,
					isPriceModified: false,
				});
			} else if (category === "all") {
				set({
					ratingFilters: { oneStar: false, twoStars: false, threeStars: false, fourStars: false, fiveStars: false },
					openFilters: { openNow: false, open24Hours: false },
					priceFilters: { oneDollar: false, twoDollars: false, threeDollars: false, fourDollars: false },
					sortOption: "rating",
					zipCode: "",
					isRatingModified: false,
					isOpenModified: false,
					isPriceModified: false,
					isSortModified: false,
					isZipModified: false,
				});
			}
			get().handleFilterChange();
		},
		handleTextareaInput: (event) => {
			const textarea = event.target;
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
		},
	}))
);

export default useSearchStore;
