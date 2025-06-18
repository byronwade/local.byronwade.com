import { create } from "zustand";
import debounce from "lodash/debounce";
import { algoliaIndex } from "@lib/algoliaClient";
import useMapStore from "./useMapStore";
import { generateBusinesses, searchBusinessesByQuery } from "../lib/businessDataGenerator";

// Generate a large dataset of businesses using Faker.js
let generatedBusinesses = [];
let isGenerating = false;

// Initialize businesses asynchronously
const initializeBusinesses = async () => {
	if (isGenerating || generatedBusinesses.length > 0) return generatedBusinesses;

	isGenerating = true;
	console.log("Generating businesses with Faker.js...");

	try {
		// Generate 5000 businesses for fast performance while still having variety
		generatedBusinesses = generateBusinesses(5000);
		console.log(`Generated ${generatedBusinesses.length} businesses successfully!`);
	} catch (error) {
		console.error("Failed to generate businesses:", error);
		// Fallback to original mock data
		generatedBusinesses = mockBusinesses;
	} finally {
		isGenerating = false;
	}

	return generatedBusinesses;
};

// Original mock businesses as fallback
const mockBusinesses = [
	{
		id: "1",
		name: "Joe's Pizza Palace",
		slug: "joes-pizza-palace",
		description: "Authentic New York style pizza with fresh ingredients and traditional recipes passed down through generations.",
		categories: ["Restaurant", "Pizza", "Italian"],
		ratings: { overall: 4.5 },
		reviewCount: 127,
		address: "123 Main St, San Francisco, CA 94102",
		phone: "(415) 555-0123",
		website: "https://joespizza.com",
		hours: "Mon-Sun 11AM-10PM",
		coordinates: { lat: 37.7749, lng: -122.4194 },
		isOpenNow: true,
		price: "$$",
		statusMessage: "Closes at 10 PM",
		isSponsored: false,
		logo: null,
	},
	{
		id: "2",
		name: "Smith's Auto Repair",
		slug: "smiths-auto-repair",
		description: "Professional automotive repair services with over 20 years of experience. Specializing in brake repair, oil changes, and engine diagnostics.",
		categories: ["Automotive", "Auto Repair", "Service"],
		ratings: { overall: 4.8 },
		reviewCount: 89,
		address: "456 Oak Ave, San Francisco, CA 94103",
		phone: "(415) 555-0456",
		website: "https://smithsauto.com",
		hours: "Mon-Fri 8AM-6PM, Sat 9AM-4PM",
		coordinates: { lat: 37.7849, lng: -122.4094 },
		isOpenNow: true,
		price: "$$$",
		statusMessage: "Closes at 6 PM",
		isSponsored: true,
		logo: null,
	},
	{
		id: "3",
		name: "Bella's Hair Salon",
		slug: "bellas-hair-salon",
		description: "Full-service hair salon offering cuts, colors, styling, and treatments. Our experienced stylists stay current with the latest trends.",
		categories: ["Beauty & Spas", "Hair Salon", "Beauty"],
		ratings: { overall: 4.3 },
		reviewCount: 156,
		address: "789 Pine St, San Francisco, CA 94104",
		phone: "(415) 555-0789",
		website: "https://bellashair.com",
		hours: "Tue-Sat 9AM-7PM, Sun 10AM-5PM",
		coordinates: { lat: 37.7649, lng: -122.4294 },
		isOpenNow: false,
		price: "$$",
		statusMessage: "Closed - Opens at 9 AM",
		isSponsored: false,
		logo: null,
	},
	{
		id: "4",
		name: "Downtown Dental Care",
		slug: "downtown-dental-care",
		description: "Comprehensive dental services including cleanings, fillings, crowns, and cosmetic dentistry in a comfortable, modern environment.",
		categories: ["Health & Medical", "Dentist", "Healthcare"],
		ratings: { overall: 4.7 },
		reviewCount: 203,
		address: "321 Market St, San Francisco, CA 94105",
		phone: "(415) 555-0321",
		website: "https://downtowndental.com",
		hours: "Mon-Thu 8AM-6PM, Fri 8AM-4PM",
		coordinates: { lat: 37.7949, lng: -122.3994 },
		isOpenNow: true,
		price: "$$$",
		statusMessage: "Closes at 6 PM",
		isSponsored: false,
		logo: null,
	},
	{
		id: "5",
		name: "The Coffee Corner",
		slug: "the-coffee-corner",
		description: "Artisan coffee shop serving locally roasted beans, fresh pastries, and light lunch options. Perfect spot for work or relaxation.",
		categories: ["Coffee & Tea", "Cafe", "Breakfast"],
		ratings: { overall: 4.2 },
		reviewCount: 78,
		address: "654 Union St, San Francisco, CA 94106",
		phone: "(415) 555-0654",
		website: "https://coffeecorner.com",
		hours: "Mon-Fri 6AM-8PM, Sat-Sun 7AM-9PM",
		coordinates: { lat: 37.7549, lng: -122.4394 },
		isOpenNow: true,
		price: "$",
		statusMessage: "Closes at 8 PM",
		isSponsored: false,
		logo: null,
	},
	{
		id: "6",
		name: "Golden Gate Plumbing",
		slug: "golden-gate-plumbing",
		description: "Licensed plumbing contractors providing emergency repairs, installations, and maintenance services throughout the Bay Area.",
		categories: ["Home Services", "Plumbing", "Contractors"],
		ratings: { overall: 4.6 },
		reviewCount: 94,
		address: "987 Broadway, San Francisco, CA 94107",
		phone: "(415) 555-0987",
		website: "https://ggplumbing.com",
		hours: "24/7 Emergency Service",
		coordinates: { lat: 37.7449, lng: -122.4494 },
		isOpenNow: true,
		price: "$$$",
		statusMessage: "24/7 Service Available",
		isSponsored: true,
		logo: null,
	},
];

const useBusinessStore = create((set, get) => ({
	allBusinesses: [],
	filteredBusinesses: [],
	activeBusinessId: null,
	selectedBusiness: null,
	initialLoad: true,
	loading: false,
	initialCoordinates: { lat: 37.7749, lng: -122.4194 },
	prevBounds: null,
	cache: new Map(),
	preventFetch: false,

	setInitialCoordinates: (lat, lng) => {
		set({ initialCoordinates: { lat, lng } });
		console.log("Initial coordinates set to:", { lat, lng });
	},

	// Enhanced search method using mock data
	searchBusinesses: async (query = "", location = "") => {
		try {
			set({ loading: true });

			// Use mock businesses for now
			let results = [...mockBusinesses];

			// Simple search filtering
			if (query) {
				const searchTerm = query.toLowerCase();
				results = results.filter((business) => business.name.toLowerCase().includes(searchTerm) || business.description.toLowerCase().includes(searchTerm) || business.categories.some((cat) => cat.toLowerCase().includes(searchTerm)));
			}

			// For now, don't filter by location since we're using mock data
			// Just return all businesses that match the query (or all if no query)

			// Sort results by relevance (sponsored first, then by rating)
			const sortedResults = results.sort((a, b) => {
				if (a.isSponsored && !b.isSponsored) return -1;
				if (!a.isSponsored && b.isSponsored) return 1;
				return (b.ratings?.overall || 0) - (a.ratings?.overall || 0);
			});

			// Update both allBusinesses and filteredBusinesses for map view
			set({
				allBusinesses: sortedResults,
				filteredBusinesses: sortedResults,
				loading: false,
			});

			console.log(`Search completed: ${sortedResults.length} results for "${query}" in "${location}"`);
			return sortedResults;
		} catch (error) {
			console.error("Failed to search businesses:", error);
			set({ loading: false });
			return [];
		}
	},

	// New method for general business fetching (used by search page)
	fetchBusinesses: async (query = "", location = "") => {
		return get().searchBusinesses(query, location);
	},

	// Initialize with generated data for immediate display
	initializeWithMockData: async () => {
		try {
			set({ loading: true });

			// For now, use mock data immediately to avoid loading issues
			console.log("Using mock business data for immediate display");

			// Always show mock businesses regardless of search
			set({
				allBusinesses: mockBusinesses,
				filteredBusinesses: mockBusinesses,
				loading: false,
				initialLoad: false,
			});

			console.log("Initialized with mock business data");
		} catch (error) {
			console.error("Failed to initialize with mock data:", error);
			// Fallback to original mock data
			set({
				allBusinesses: mockBusinesses,
				filteredBusinesses: mockBusinesses,
				loading: false,
				initialLoad: false,
			});
		}
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
			set({ loading: true });

			// Use generated businesses instead of API call
			const businesses = await initializeBusinesses();

			// Filter businesses by bounds
			const boundsFiltered = businesses.filter((business) => {
				const coords = business.coordinates;
				if (!coords) return false;
				const { lat, lng } = coords;
				return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
			});

			console.log("Initial businesses fetched:", boundsFiltered.length);

			cache.set(bounds, boundsFiltered);
			set({ allBusinesses: boundsFiltered, initialLoad: false, loading: false });
			get().filterBusinessesByBounds(bounds);
		} catch (error) {
			console.error("Failed to fetch businesses:", error);
			set({ loading: false });
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
			set({ loading: true });

			// Use generated businesses with search
			const businesses = await initializeBusinesses();
			let filteredBusinesses = businesses;

			// Apply query filter if provided
			if (query) {
				filteredBusinesses = searchBusinessesByQuery(businesses, query);
			}

			// Apply bounds filter
			filteredBusinesses = filteredBusinesses.filter((business) => {
				const coords = business.coordinates;
				if (!coords) return false;
				const { lat, lng } = coords;
				return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
			});

			console.log("Filtered businesses fetched:", filteredBusinesses.length);

			cache.set(bounds, filteredBusinesses);
			set({ filteredBusinesses, loading: false });
		} catch (error) {
			console.error("Failed to fetch businesses:", error);
			set({ loading: false });
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

	// Business selection methods
	setSelectedBusiness: (business) => {
		set({ selectedBusiness: business });
		console.log("Selected business set to:", business?.name || null);
	},

	clearSelectedBusiness: () => {
		set({ selectedBusiness: null });
		console.log("Selected business cleared");
	},
}));

export default useBusinessStore;
