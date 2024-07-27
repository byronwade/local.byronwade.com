import { create } from "zustand";
import debounce from "lodash/debounce";

const useSearchStore = create((set) => ({
	searchQuery: "",
	location: { value: "" },
	errors: {},
	touched: {},
	suggestions: [],
	loading: false,

	setSearchQuery: (query) => set({ searchQuery: query }),
	setLocation: (location) => set({ location }),
	setErrors: (errors) => set({ errors }),
	setTouched: (touched) => set({ touched }),
	setSuggestions: (suggestions) => set({ suggestions }),
	setLoading: (loading) => set({ loading }),
}));

export const setSearchQueryDebounced = debounce((query) => {
	useSearchStore.getState().setSearchQuery(query);
}, 300);

export default useSearchStore;
