// store/useBusinessStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import * as turf from "@turf/turf";

const useBusinessStore = create(
	devtools((set, get) => ({
		businesses: [],
		filteredBusinesses: [],
		coordinates: {},
		activeMarker: null,
		hoveredBusiness: null,
		selectedServiceArea: null,
		initialFiltersApplied: false,

		setBusinesses: (businesses) => set({ businesses }),

		setActiveMarker: (id) => set({ activeMarker: id }),
		setHoveredBusiness: (business) => set({ hoveredBusiness: business }),
		setSelectedServiceArea: (area) => set({ selectedServiceArea: area }),

		fetchBusinesses: async (zipCode, searchQuery, radius) => {
			try {
				const response = await axios.get(`/api/biz?zip=${zipCode}&query=${searchQuery}&radius=${radius}`);
				const businesses = response.data;
				set({ businesses });
				get().fetchCoordinates(businesses);
			} catch (error) {
				console.error("Error fetching businesses:", error);
			}
		},

		fetchCoordinates: async (businesses) => {
			const newCoordinates = {};
			for (const business of businesses) {
				try {
					const coords = await get().getCoordinatesFromAddress(business.address);
					newCoordinates[business.id] = coords;
				} catch (error) {
					console.error(`Error fetching coordinates for ${business.name}:`, error);
				}
			}
			set({ coordinates: newCoordinates });
			if (businesses.length > 0 && Object.keys(newCoordinates).length > 0) {
				get().handleMarkerClick(businesses[0]);
			}
		},

		handleFilterChange: async (filters) => {
			const { businesses, coordinates } = get();
			const { searchQuery, zipCode, ratingFilters, openFilters, priceFilters, sortOption } = filters;
			let filteredBusinesses = [...businesses];

			// Apply rating filters
			if (Object.values(ratingFilters).some(Boolean)) {
				filteredBusinesses = filteredBusinesses.filter((business) => {
					const rating = business.ratings.overall;
					return (ratingFilters.oneStar && rating >= 1) || (ratingFilters.twoStars && rating >= 2) || (ratingFilters.threeStars && rating >= 3) || (ratingFilters.fourStars && rating >= 4) || (ratingFilters.fiveStars && rating >= 5);
				});
			}

			// Apply open now filter
			if (openFilters.openNow) {
				const now = new Date();
				filteredBusinesses = filteredBusinesses.filter((business) => {
					const today = now.toLocaleString("en-us", { weekday: "long" });
					const hours = business.hours.find((h) => h.day === today);
					if (!hours) return false;
					const openTime = new Date(`1970-01-01T${hours.open}`);
					const closeTime = new Date(`1970-01-01T${hours.close}`);
					return now >= openTime && now <= closeTime;
				});
			}

			// Apply price filters
			if (Object.values(priceFilters).some(Boolean)) {
				filteredBusinesses = filteredBusinesses.filter((business) => {
					const priceLevel = business.price.length;
					return (priceFilters.oneDollar && priceLevel === 1) || (priceFilters.twoDollars && priceLevel === 2) || (priceFilters.threeDollars && priceLevel === 3) || (priceFilters.fourDollars && priceLevel === 4);
				});
			}

			// Apply search query filter
			if (searchQuery) {
				const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, "");
				const searchQueryNormalized = normalizeString(searchQuery);
				filteredBusinesses = filteredBusinesses.filter((business) => {
					const businessNameNormalized = normalizeString(business.name);
					return businessNameNormalized.includes(searchQueryNormalized);
				});
			}

			// Apply sorting option
			if (sortOption) {
				if (sortOption === "ratingHighToLow") {
					filteredBusinesses.sort((a, b) => b.ratings.overall - a.ratings.overall);
				} else if (sortOption === "ratingLowToHigh") {
					filteredBusinesses.sort((a, b) => a.ratings.overall - b.ratings.overall);
				} else if (sortOption === "recommended") {
					filteredBusinesses.sort((a, b) => b.ratings.overall - a.ratings.overall);
				} else if (sortOption === "priceLowToHigh") {
					filteredBusinesses.sort((a, b) => a.price.length - b.price.length);
				} else if (sortOption === "priceHighToLow") {
					filteredBusinesses.sort((a, b) => b.price.length - a.price.length);
				}
			}

			// Apply zip code filter
			if (zipCode) {
				try {
					const { lat, lng } = await get().getCoordinatesFromZipCode(zipCode);
					filteredBusinesses = filteredBusinesses.filter((business) => {
						const businessCoords = coordinates[business.id];
						if (businessCoords) {
							const distance = get().getDistance(lat, lng, businessCoords.lat, businessCoords.lng);
							return distance <= 50;
						}
						return false;
					});
				} catch (error) {
					console.error(`Error fetching coordinates for ZIP code ${zipCode}:`, error);
					return;
				}
			}

			// Ensure only one sponsored business shows
			const sponsoredBusiness = businesses.find((business) => business.isSponsored);
			if (sponsoredBusiness) {
				filteredBusinesses = [sponsoredBusiness, ...filteredBusinesses.filter((business) => business.id !== sponsoredBusiness.id)];
			}

			set({ filteredBusinesses });
		},

		handleMarkerClick: (business) => {
			const { coordinates, flyToLocation, setHoveredBusiness, setActiveMarker, setSelectedServiceArea } = get();
			const coords = coordinates[business.id];
			if (!coords) {
				console.error(`No coordinates found for ${business.name}`);
				return;
			}
			setActiveMarker(business.id);
			setHoveredBusiness(business);
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

		handleSearchInArea: (bounds) => {
			const { businesses, coordinates, setFilteredBusinesses } = get();
			const boundingBox = [bounds.getSouthWest().lng, bounds.getSouthWest().lat, bounds.getNorthEast().lng, bounds.getNorthEast().lat];
			const filteredBusinesses = businesses.filter((business) => {
				const coords = coordinates[business.id];
				return coords && coords.lng >= boundingBox[0] && coords.lat >= boundingBox[1] && coords.lng <= boundingBox[2] && coords.lat <= boundingBox[3];
			});
			setFilteredBusinesses(filteredBusinesses);
		},

		getCoordinatesFromAddress: async (address) => {
			const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
			const data = await response.json();
			if (data.features && data.features.length > 0) {
				const { center } = data.features[0];
				return {
					lat: center[1],
					lng: center[0],
				};
			}
			throw new Error("Coordinates not found for address");
		},

		getCoordinatesFromZipCode: async (zipCode) => {
			const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zipCode)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
			const data = await response.json();
			if (data.features && data.features.length > 0) {
				const { center } = data.features[0];
				return {
					lat: center[1],
					lng: center[0],
				};
			}
			throw new Error("Coordinates not found for ZIP code");
		},

		getDistance: (lat1, lng1, lat2, lng2) => {
			const from = turf.point([lng1, lat1]);
			const to = turf.point([lng2, lat2]);
			return turf.distance(from, to, { units: "miles" });
		},

		flyToLocation: (lat, lng, serviceAreaRadius) => {
			const { mapRef } = get();
			if (mapRef.current) {
				mapRef.current.flyTo({
					center: [lng, lat],
					zoom: serviceAreaRadius ? Math.max(8, 14 - Math.log2(serviceAreaRadius)) : 14,
					essential: true,
				});
			}
		},

		convertServiceAreaToGeoJSON: (lat, lng, radius) => {
			const center = [lng, lat];
			const options = { steps: 64, units: "miles" };
			return turf.circle(center, radius, options);
		},
	}))
);

export default useBusinessStore;
