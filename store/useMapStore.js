import { create } from "zustand";

const useMapStore = create((set, get) => ({
	mapRef: null,
	setMapRef: (ref) => set({ mapRef: ref }),
	loadingBusinessId: null,
	setLoadingBusinessId: (id) => set({ loadingBusinessId: id }),

	fetchMapRef: () => {
		return get().mapRef;
	},

	getMapCenter: () => {
		const map = get().mapRef;
		if (map) {
			const center = map.getCenter();
			return {
				lat: center.lat,
				lng: center.lng,
			};
		}
		return null;
	},

	getMapBounds: async () => {
		const mapRef = get().mapRef;
		if (mapRef) {
			const bounds = mapRef.getBounds();
			const data = {
				north: bounds.getNorth(),
				south: bounds.getSouth(),
				east: bounds.getEast(),
				west: bounds.getWest(),
			};
			set({ bounds: data });
			return data;
		}
		return null;
	},

	centerOn: (latitude, longitude, radius) => {
		const mapRef = get().mapRef;
		if (mapRef) {
			const map = mapRef;
			// Default zoom level is 10
			const defaultZoom = 10;
			// Calculate zoom level based on radius if provided, otherwise use default
			const zoom = radius ? Math.max(8, 14 - Math.log2(radius) + 0.5) : defaultZoom;
			const offsetX = 500; // Adjust the offset as needed
			const offsetLng = offsetX / (256 * Math.pow(2, zoom));
			const newCenter = [longitude + offsetLng, latitude];

			console.log("Centering on:", { latitude, longitude, newCenter, zoom });

			// Use flyTo for smooth transitions
			map.flyTo({
				center: newCenter,
				zoom,
				duration: 100, // Duration in milliseconds
				essential: true,
			});
		} else {
			console.error("mapRef is not set");
		}
	},
}));

export default useMapStore;
