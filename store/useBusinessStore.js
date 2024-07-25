import { create } from "zustand";
import useMapStore from "./useMapStore";

const useBusinessStore = create((set, get) => ({
	allBusinesses: [],
	filteredBusinesses: [],
	activeBusinessId: null,
	initialLoad: true,
	initialCoordinates: { lat: 37.7749, lng: -122.4194 },
	prevBounds: null,
	cache: new Map(),
	preventFetch: false,

	setInitialCoordinates: (lat, lng) => {
		set({ initialCoordinates: { lat, lng } });
		console.log("Initial coordinates set to:", { lat, lng });
	},

	fetchInitialBusinesses: async (bounds, zoom) => {
		if (!bounds || !zoom) {
			console.error("Bounds or zoom value is missing:", bounds, zoom);
			return;
		}

		const activeBusinessId = get().activeBusinessId;
		if (activeBusinessId || get().preventFetch) {
			console.log("Skipping initial fetch as there is an active business or fetch is prevented:", activeBusinessId);
			return;
		}

		console.log("Fetching initial businesses with bounds:", bounds, "and zoom:", zoom);

		try {
			const response = await fetch(`/api/biz?zoom=${zoom}&north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}`);
			const data = await response.json();
			const initialBusinesses = data.businesses;
			console.log("Initial businesses fetched:", initialBusinesses);

			initialBusinesses.forEach((business) => {
				if (!business.coordinates || business.coordinates.lat === undefined || business.coordinates.lng === undefined) {
					console.error("Invalid business coordinates:", business.coordinates);
				}
			});

			const cache = get().cache;
			initialBusinesses.forEach((business) => {
				cache.set(business.id, business);
			});

			set({ allBusinesses: Array.from(cache.values()), initialLoad: false });
			get().filterBusinessesByBounds(bounds);
		} catch (error) {
			console.error("Failed to fetch businesses:", error);
		}
	},

	fetchFilteredBusinesses: async (bounds, zoom) => {
		if (!bounds || !zoom) {
			console.error("Bounds or zoom value is missing:", bounds, zoom);
			return;
		}

		const activeBusinessId = get().activeBusinessId;
		if (activeBusinessId || get().preventFetch) {
			console.log("Skipping filtered fetch as there is an active business or fetch is prevented:", activeBusinessId);
			return;
		}

		console.log("Fetching filtered businesses with bounds:", bounds, "and zoom:", zoom);

		try {
			const response = await fetch(`/api/biz?zoom=${zoom}&north=${bounds.north}&south=${bounds.south}&east=${bounds.east}&west=${bounds.west}`);
			const data = await response.json();
			const newBusinesses = data.businesses;
			console.log("Filtered businesses fetched:", newBusinesses);

			newBusinesses.forEach((business) => {
				if (!business.coordinates || business.coordinates.lat === undefined || business.coordinates.lng === undefined) {
					console.error("Invalid business coordinates:", business.coordinates);
				}
			});

			const cache = get().cache;
			newBusinesses.forEach((business) => {
				cache.set(business.id, business);
			});

			set({ allBusinesses: Array.from(cache.values()) });
			get().filterBusinessesByBounds(bounds);
		} catch (error) {
			console.error("Failed to fetch businesses:", error);
		}
	},

	filterBusinessesByBounds: (bounds) => {
		const { allBusinesses, prevBounds, cache, activeBusinessId } = get();
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
			const activeBusiness = cache.get(activeBusinessId);
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

		// Avoid unnecessary state changes
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
}));

export default useBusinessStore;
