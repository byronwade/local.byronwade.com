import { create } from "zustand";
import axios from "axios";
import * as turf from "@turf/turf";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const useBusinessStore = create((set, get) => ({
	businesses: [],
	filteredBusinesses: [],
	coordinates: {},
	activeMarker: null,
	selectedServiceArea: null,
	mapRef: null,
	activeBusiness: null,
	loading: false,
	searchQuery: "",
	zipCode: "",
	isPrefetching: false,

	setBusinesses: (businesses) => set({ businesses, filteredBusinesses: businesses }),
	setLoading: (loading) => set({ loading }),
	setActiveMarker: (id) => set({ activeMarker: id }),
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
		}),
	setSearchQuery: (query) => set({ searchQuery: query }),
	setZipCode: (zipCode) => set({ zipCode }),

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

			const coordinates = {};
			data.businesses.forEach((business) => {
				if (business.coordinates) {
					coordinates[business.id] = business.coordinates;
				}
			});

			set({
				businesses: data.businesses,
				coordinates: coordinates,
				loading: false,
			});

			get().filterAndSortBusinesses(get().searchQuery);
		} catch (error) {
			console.error("Error fetching businesses:", error);
			set({ loading: false });
		}
	},

	handleSearchInArea: () => {
		const { mapRef, fetchBusinessesByBoundingBox } = get();
		if (mapRef) {
			const bounds = mapRef.getBounds();
			const southWest = bounds.getSouthWest();
			const northEast = bounds.getNorthEast();
			fetchBusinessesByBoundingBox(southWest.lat, southWest.lng, northEast.lat, northEast.lng);
		}
	},

	filterAndSortBusinesses: (searchQuery) => {
		const { businesses } = get();
		console.log("filterAndSortBusinesses called with:", { searchQuery, businesses });

		let filteredBusinesses = [...businesses];

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filteredBusinesses = filteredBusinesses.filter((business) => business.name.toLowerCase().includes(query));
		}
		console.log("Filtered by search query:", filteredBusinesses);

		set({ filteredBusinesses });
	},

	handleMarkerClick: (business) => {
		const { coordinates, setActiveMarker, setActiveBusiness } = get();
		const coords = coordinates[business.id];
		if (!coords) {
			console.error(`No coordinates found for ${business.name}`);
			return;
		}
		setActiveMarker(business.id);
		setActiveBusiness(business);
		// Ensure flyToLocationWithoutFetch is not being called
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

	prefetchBusinessesAndFly: async (lat, lng, serviceAreaRadius) => {
		const { mapRef, fetchBusinessesByBoundingBox, setPrefetching } = get();
		if (mapRef && typeof mapRef.flyTo === "function") {
			console.log("prefetchBusinessesAndFly called with:", { lat, lng, mapRef });

			// Set prefetching flag
			set({ isPrefetching: true });

			// Get the current bounds to determine the size of the bounding box
			const currentBounds = mapRef.getBounds();
			const currentSouthWest = currentBounds.getSouthWest();
			const currentNorthEast = currentBounds.getNorthEast();

			// Calculate the size of the current bounding box
			const currentBoxWidth = currentNorthEast.lng - currentSouthWest.lng;
			const currentBoxHeight = currentNorthEast.lat - currentSouthWest.lat;

			// Create a virtual bounding box centered on the new coordinates
			const southWestLat = lat - currentBoxHeight / 2;
			const southWestLng = lng - currentBoxWidth / 2;
			const northEastLat = lat + currentBoxHeight / 2;
			const northEastLng = lng + currentBoxWidth / 2;

			console.log("Virtual bounds for prefetching:", { southWestLat, southWestLng, northEastLat, northEastLng });

			// Fetch businesses within the virtual bounding box
			await fetchBusinessesByBoundingBox(southWestLat, southWestLng, northEastLat, northEastLng);

			// Fly the camera to the new location
			console.log("Flying to location:", { lat, lng });
			mapRef.flyTo({
				center: [lng, lat],
				zoom: serviceAreaRadius ? Math.max(8, 14 - Math.log2(serviceAreaRadius)) : 14,
				essential: true,
			});

			mapRef.once("moveend", async () => {
				// Reset prefetching flag after the fly operation
				set({ isPrefetching: false });

				// Ensure the filtered businesses only show within the final camera view
				const finalBounds = mapRef.getBounds();
				const finalSouthWest = finalBounds.getSouthWest();
				const finalNorthEast = finalBounds.getNorthEast();
				console.log("Filtering businesses in final bounds:", { finalSouthWest, finalNorthEast });
				const { businesses } = get();
				const finalFilteredBusinesses = businesses.filter((business) => {
					const coords = business.coordinates;
					return coords.lat >= finalSouthWest.lat && coords.lat <= finalNorthEast.lat && coords.lng >= finalSouthWest.lng && coords.lng <= finalNorthEast.lng;
				});
				set({ filteredBusinesses: finalFilteredBusinesses });
			});
		} else {
			console.error("prefetchBusinessesAndFly: mapRef is not set correctly or flyTo is not a function");
		}
	},

	flyToLocation: (lat, lng, serviceAreaRadius, shouldPrefetch = true) => {
		const { mapRef } = get();
		if (mapRef && typeof mapRef.flyTo === "function") {
			console.log("flyToLocation called with:", { lat, lng, mapRef });

			if (shouldPrefetch) {
				get().prefetchBusinessesAndFly(lat, lng, serviceAreaRadius);
			} else {
				mapRef.flyTo({
					center: [lng, lat],
					zoom: serviceAreaRadius ? Math.max(8, 14 - Math.log2(serviceAreaRadius)) : 14,
					essential: true,
				});
			}
		} else {
			console.error("flyToLocation: mapRef is not set correctly or flyTo is not a function");
		}
	},

	flyToLocationWithoutFetch: (lat, lng, serviceAreaRadius) => {
		const { mapRef } = get();
		if (mapRef && typeof mapRef.flyTo === "function") {
			console.log("flyToLocationWithoutFetch called with:", { lat, lng, mapRef });

			mapRef.flyTo({
				center: [lng, lat],
				zoom: serviceAreaRadius ? Math.max(8, 14 - Math.log2(serviceAreaRadius)) : 14,
				essential: true,
			});
		} else {
			console.error("flyToLocationWithoutFetch: mapRef is not set correctly or flyTo is not a function");
		}
	},

	convertServiceAreaToGeoJSON: (lat, lng, radius) => {
		const center = [lng, lat];
		const options = { steps: 64, units: "miles" };
		return turf.circle(center, radius, options);
	},
}));

export default useBusinessStore;
