import { create } from "zustand";
import algoliasearch from "algoliasearch";
import debounce from "lodash/debounce";

// Initialize Algolia client
const algoliaClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);
const index = algoliaClient.initIndex("businesses");

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
			const { hits } = await index.search(query, {
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
