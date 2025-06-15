import { create } from "zustand";

const useMapStore = create((set, get) => ({
	mapRef: null,
	setMapRef: (mapRef) => set({ mapRef }),
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

	getMapZoom: () => {
		const map = get().mapRef;
		if (map) {
			return map.getZoom();
		}
		return null;
	},

	getMapBounds: () => {
		const mapRef = get().mapRef;
		if (mapRef) {
			const bounds = mapRef.getBounds();
			return {
				north: bounds.getNorth(),
				south: bounds.getSouth(),
				east: bounds.getEast(),
				west: bounds.getWest(),
			};
		}
		return null;
	},

	centerOn: (latitude, longitude, radius, zoomLevel) => {
		const mapRef = get().mapRef;
		if (mapRef) {
			const map = mapRef;
			const defaultZoom = 10;

			// Use provided zoom level, or calculate from radius, or use default
			let zoom;
			if (zoomLevel !== undefined) {
				zoom = zoomLevel;
			} else if (radius) {
				zoom = Math.max(8, 14 - Math.log2(radius) + 0.5);
			} else {
				zoom = defaultZoom;
			}

			const offsetX = 500;
			const offsetLng = offsetX / (256 * Math.pow(2, zoom));
			const newCenter = [longitude + offsetLng, latitude];

			map.flyTo({
				center: newCenter,
				zoom,
				duration: 100,
				essential: true,
			});
		} else {
			console.error("mapRef is not set");
		}
	},
}));

export default useMapStore;
