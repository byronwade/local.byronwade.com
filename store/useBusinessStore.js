import { create } from "zustand";
import useMapStore from "./useMapStore";
import debounce from "lodash/debounce";

const useBusinessStore = create((set, get) => ({
	allBusinesses: [],
	filteredBusinesses: [],
	activeBusinessId: null,
	initialLoad: true,
	loading: false, // Add loading state
	initialCoordinates: { lat: 37.7749, lng: -122.4194 },
	prevBounds: null,
	cache: new Map(),
	preventFetch: false,

	setInitialCoordinates: (lat, lng) => {
		set({ initialCoordinates: { lat, lng } });
		console.log("Initial coordinates set to:", { lat, lng });
	},

	fetchInitialBusinesses: async (bounds, zoom, query) => {
		const { activeBusinessId, preventFetch, cache } = get();

		if (!bounds || !zoom) {
			console.error("Bounds or zoom value is missing:", bounds, zoom);
			return;
		}

		if (activeBusinessId || preventFetch) {
			console.log("Skipping initial fetch as there is an active business or fetch is prevented:", activeBusinessId);
			return;
		}

		try {
			set({ loading: true }); // Set loading state
			const response = await fetch(`/api/biz?zoom=${zoom}&north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}&query=${encodeURIComponent(query)}`);
			const data = await response.json();
			const initialBusinesses = data.businesses;

			initialBusinesses.forEach((business) => {
				if (!business.coordinates || business.coordinates.lat === undefined || business.coordinates.lng === undefined) {
					console.error("Invalid business coordinates:", business.coordinates);
				}
			});

			cache.set(bounds, initialBusinesses);
			set({ allBusinesses: initialBusinesses, initialLoad: false, loading: false }); // Reset loading state
			get().filterBusinessesByBounds(bounds);
		} catch (error) {
			console.error("Failed to fetch businesses:", error);
			set({ loading: false }); // Reset loading state on error
		}
	},

	fetchFilteredBusinesses: debounce(async (bounds, zoom, query) => {
		const { activeBusinessId, preventFetch, cache } = get();

		if (!bounds || !zoom) {
			console.error("Bounds or zoom value is missing:", bounds, zoom);
			return;
		}

		if (activeBusinessId || preventFetch) {
			console.log("Skipping filtered fetch as there is an active business or fetch is prevented:", activeBusinessId);
			return;
		}

		console.log("Fetching filtered businesses with bounds:", bounds, "and zoom:", zoom, "and query:", query);

		try {
			set({ loading: true }); // Set loading state
			const response = await fetch(`/api/biz?zoom=${zoom}&north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}&query=${encodeURIComponent(query)}`);
			const data = await response.json();
			const newBusinesses = data.businesses;
			console.log("Filtered businesses fetched:", newBusinesses);

			newBusinesses.forEach((business) => {
				if (!business.coordinates || business.coordinates.lat === undefined || business.coordinates.lng === undefined) {
					console.error("Invalid business coordinates:", business.coordinates);
				}
			});

			cache.set(bounds, newBusinesses);

			set({ filteredBusinesses: newBusinesses, loading: false }); // Reset loading state
		} catch (error) {
			console.error("Failed to fetch businesses:", error);
			set({ loading: false }); // Reset loading state on error
		}
	}, 300),

	filterBusinessesByBounds: (bounds) => {
		const { allBusinesses, prevBounds, activeBusinessId } = get();

		if (prevBounds && JSON.stringify(prevBounds) === JSON.stringify(bounds)) {
			console.log("Bounds have not changed significantly, skipping filtering");
			return;
		}

		const filteredBusinesses = allBusinesses.filter((business) => {
			const coords = business.coordinates;
			if (!coords) return false;

			const { lat, lng } = coords;
			if (lat === undefined || lng === undefined) {
				console.error("Missing lat or lng in business coordinates:", coords);
				return false;
			}

			return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
		});

		if (activeBusinessId) {
			const activeBusiness = get().cache.get(activeBusinessId);
			if (activeBusiness) {
				const { lat, lng } = activeBusiness.coordinates;
				if (!(lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east)) {
					set({ activeBusinessId: null });
					console.log("Active business is out of bounds, setting it to null");
				} else {
					console.log("Active business is within bounds");
				}
			}
		}

		set({
			filteredBusinesses,
			prevBounds: bounds,
		});
		console.log("Filtered businesses set:", filteredBusinesses);
	},

	setActiveBusinessId: (id) => {
		const previousActiveBusinessId = get().activeBusinessId;

		if (id === previousActiveBusinessId) {
			console.log("Active business ID is already set to:", id);
			return;
		}

		set({ activeBusinessId: id });
		console.log("Active business ID set to:", id);

		if ((id === null || id === "") && previousActiveBusinessId !== null) {
			console.log("Resetting zoom without triggering fetch");
			const map = useMapStore.getState().fetchMapRef();
			console.log("Map ref:", map);
			if (map) {
				map.once("moveend", () => {
					console.log("Zoom reset to 10");
					set({ preventFetch: false });
				});
				set({ preventFetch: true });
				map.flyTo({ zoom: 10 });
			}
		}
	},

	setMapRef: (map) => {
		set({ mapRef: map });
	},

	clearFilteredBusinesses: () => set({ filteredBusinesses: [] }),
}));

export default useBusinessStore;
