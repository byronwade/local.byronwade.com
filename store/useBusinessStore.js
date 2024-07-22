import { create } from "zustand";
import axios from "axios";
import * as turf from "@turf/turf";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const useBusinessStore = create((set, get) => ({
	businesses: [],
	filteredBusinesses: [],
	coordinates: {},
	activeMarker: null,
	hoveredBusiness: null,
	selectedServiceArea: null,
	initialFiltersApplied: false,
	mapRef: null,
	activeBusiness: null,
	businessPage: 1,
	loading: false,
	hasMoreBusinesses: true,

	setBusinesses: (businesses) => set({ businesses, filteredBusinesses: businesses }),
	setLoading: (loading) => set({ loading }),
	setActiveMarker: (id) => set({ activeMarker: id }),
	setHoveredBusiness: (business) => set({ hoveredBusiness: business }),
	setSelectedServiceArea: (area) => set({ selectedServiceArea: area }),
	setFilteredBusinesses: (filteredBusinesses) => set({ filteredBusinesses }),
	setMapRef: (mapInstance) => {
		console.log("setMapRef called with", mapInstance);
		set({ mapRef: mapInstance });
	},
	setActiveBusiness: (business) =>
		set({
			activeBusiness: business,
			activeMarker: business ? business.id : null,
			selectedServiceArea: business ? get().convertServiceAreaToGeoJSON(business.coordinates.lat, business.coordinates.lng, business.serviceArea.value) : null,
			hoveredBusiness: business || null,
		}),

	fetchBusinessesByBoundingBox: async (southWestLat, southWestLng, northEastLat, northEastLng) => {
		try {
			set({ loading: true });
			console.log("Fetching businesses in bounds:", { southWestLat, southWestLng, northEastLat, northEastLng });

			const response = await axios.get(`/api/biz`, {
				params: {
					southWestLat,
					southWestLng,
					northEastLat,
					northEastLng,
				},
			});

			const data = response.data;

			console.log("Fetched businesses:", data);

			if (!Array.isArray(data.businesses)) {
				console.error("Fetched data is not an array:", data.businesses);
				set({ loading: false });
				return;
			}

			set({
				businesses: data.businesses,
				filteredBusinesses: data.businesses,
				hasMoreBusinesses: data.businesses.length > get().businessesPerPage,
				loading: false,
			});
		} catch (error) {
			console.error("Error fetching businesses:", error);
			set({ loading: false });
		}
	},

	filterAndSortBusinesses: (searchQuery) => {
		const { businesses, sortOption } = get();
		console.log("filterAndSortBusinesses called with:", { searchQuery, businesses });

		let filteredBusinesses = [...businesses];

		// Apply search query filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filteredBusinesses = filteredBusinesses.filter((business) => business.name.toLowerCase().includes(query));
		}
		console.log("Filtered by search query:", filteredBusinesses);

		// Sort businesses based on the sortOption
		filteredBusinesses.sort((a, b) => {
			if (sortOption === "rating") {
				return b.rating - a.rating;
			} else if (sortOption === "name") {
				return a.name.localeCompare(b.name);
			}
			return 0;
		});
		console.log("Sorted businesses:", filteredBusinesses);

		set({ filteredBusinesses });
	},

	handleMarkerClick: (business) => {
		const { coordinates, setHoveredBusiness, setActiveMarker, setSelectedServiceArea, setActiveBusiness, flyToLocation } = get();
		const coords = coordinates[business.id];
		if (!coords) {
			console.error(`No coordinates found for ${business.name}`);
			return;
		}
		setActiveMarker(business.id);
		setHoveredBusiness(business);
		setActiveBusiness(business);
		const businessElement = document.getElementById(`business-${business.id}`);
		if (businessElement) {
			businessElement.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
		flyToLocation(coords.lat, coords.lng, business.serviceArea.value);
		const serviceArea = get().convertServiceAreaToGeoJSON(coords.lat, coords.lng, business.serviceArea.value);
		setSelectedServiceArea(serviceArea);
	},

	handleSearchInArea: () => {
		const { mapRef } = get();
		if (mapRef) {
			const bounds = mapRef.getBounds();
			const southWest = bounds.getSouthWest();
			const northEast = bounds.getNorthEast();
			get().fetchBusinessesByBoundingBox(southWest.lat, southWest.lng, northEast.lat, northEast.lng);
		}
	},

	fetchCoordinatesForZipCode: async (zipCode) => {
		try {
			const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json?access_token=${MAPBOX_TOKEN}`);
			if (response.data.features && response.data.features.length > 0) {
				const [longitude, latitude] = response.data.features[0].center;
				return { latitude, longitude };
			} else {
				throw new Error(`No coordinates found for zip code: ${zipCode}`);
			}
		} catch (error) {
			console.error("Error fetching coordinates for zip code:", error);
			return null;
		}
	},

	flyToLocation: (lat, lng, serviceAreaRadius) => {
		const { mapRef } = get();
		if (mapRef && typeof mapRef.flyTo === "function") {
			console.log("flyToLocation called with:", { lat, lng, mapRef });
			mapRef.flyTo({
				center: [lng, lat],
				zoom: serviceAreaRadius ? Math.max(8, 14 - Math.log2(serviceAreaRadius)) : 14,
				essential: true,
			});
		} else {
			console.error("flyToLocation: mapRef is not set correctly or flyTo is not a function");
		}
	},

	convertServiceAreaToGeoJSON: (lat, lng, radius) => {
		const center = [lng, lat];
		const options = { steps: 64, units: "miles" };
		return turf.circle(center, radius, options);
	},
}));

export default useBusinessStore;
