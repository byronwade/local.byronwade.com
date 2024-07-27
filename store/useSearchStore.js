import { create } from "zustand";
import debounce from "lodash/debounce";
import { algoliaIndex } from "@lib/algoliaClient";

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
	suggestions: [],
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

	fetchAutocompleteSuggestions: debounce(async (query) => {
		try {
			const { hits } = await algoliaIndex.search(query, {
				attributesToRetrieve: ["categories"],
				hitsPerPage: 10,
			});

			const categories = [...new Set(hits.map((hit) => hit.categories).flat())];

			set((state) => ({
				...state,
				suggestions: categories,
			}));
		} catch (error) {
			console.error("Error fetching autocomplete suggestions:", error);
		}
	}, 300),
}));

export default useSearchStore;
