"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import MapContainer from "@/components/site/search/MapContainer";
import BusinessCard from "@/components/site/search/BusinessCard";
import BusinessInfoPanel from "@/components/site/search/BusinessInfoPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as turf from "@turf/turf";
import Link from "next/link";
import { FullSearchBox } from "@/components/shared/searchBox/SearchBox";
import { ChevronLeft } from "react-feather";
import { useRouter, usePathname } from "next/navigation";

const SearchContainer = ({ businesses }) => {
	const [coordinates, setCoordinates] = useState({});
	const [activeMarker, setActiveMarker] = useState(null);
	const [hoveredBusiness, setHoveredBusiness] = useState(null);
	const [selectedServiceArea, setSelectedServiceArea] = useState(null);
	const mapRef = useRef(null);
	const containerRef = useRef(null);
	const router = useRouter();
	const pathname = usePathname();
	const [filteredBusinesses, setFilteredBusinesses] = useState([]);
	const [initialFiltersApplied, setInitialFiltersApplied] = useState(false);

	useEffect(() => {
		const fetchCoordinates = async () => {
			const newCoordinates = {};
			for (const business of businesses) {
				try {
					const coords = await getCoordinatesFromAddress(business.address);
					newCoordinates[business.id] = coords;
					console.log(`Coordinates for ${business.name}:`, coords);
				} catch (error) {
					console.error(`Error fetching coordinates for ${business.name}:`, error);
				}
			}
			setCoordinates(newCoordinates);
		};

		fetchCoordinates();
	}, [businesses]);

	useEffect(() => {
		if (businesses.length > 0 && Object.keys(coordinates).length > 0) {
			handleMarkerClick(businesses[0]);
		}
	}, [coordinates, businesses]);

	const handleFilterChange = useCallback(
		async (filters) => {
			console.log("Filters changed:", filters);
			const { searchQuery, zipCode, ratingFilters, openFilters, priceFilters, sortOption } = filters;
			let filteredBusinesses = [...businesses];

			// Apply rating filters
			if (Object.values(ratingFilters).some(Boolean)) {
				filteredBusinesses = filteredBusinesses.filter((business) => {
					const rating = business.ratings.overall;
					return (ratingFilters.oneStar && rating >= 1) || (ratingFilters.twoStars && rating >= 2) || (ratingFilters.threeStars && rating >= 3) || (ratingFilters.fourStars && rating >= 4) || (ratingFilters.fiveStars && rating >= 5);
				});
			}

			console.log("Filtered businesses after rating filter:", filteredBusinesses);

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

			console.log("Filtered businesses after open now filter:", filteredBusinesses);

			// Apply price filters
			if (Object.values(priceFilters).some(Boolean)) {
				filteredBusinesses = filteredBusinesses.filter((business) => {
					const priceLevel = business.price.length;
					return (priceFilters.oneDollar && priceLevel === 1) || (priceFilters.twoDollars && priceLevel === 2) || (priceFilters.threeDollars && priceLevel === 3) || (priceFilters.fourDollars && priceLevel === 4);
				});
			}

			console.log("Filtered businesses after price filter:", filteredBusinesses);

			// Apply search query filter
			if (searchQuery) {
				const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, "");
				const searchQueryNormalized = normalizeString(searchQuery);
				console.log("Applying search query filter:", searchQueryNormalized);
				filteredBusinesses = filteredBusinesses.filter((business) => {
					const businessNameNormalized = normalizeString(business.name);
					const match = businessNameNormalized.includes(searchQueryNormalized);
					console.log(`Checking business: ${business.name}, match: ${match}`);
					return match;
				});
			}

			console.log("Filtered businesses after search query filter:", filteredBusinesses);

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

			console.log("Filtered businesses after sorting:", filteredBusinesses);

			// Apply zip code filter
			if (zipCode) {
				try {
					const { lat, lng } = await getCoordinatesFromZipCode(zipCode);
					console.log("ZIP code coordinates:", { lat, lng });
					filteredBusinesses = filteredBusinesses.filter((business) => {
						const businessCoords = coordinates[business.id];
						if (businessCoords) {
							const distance = getDistance(lat, lng, businessCoords.lat, businessCoords.lng);
							console.log(`Business: ${business.name}, Distance: ${distance} miles`);
							return distance <= 35;
						}
						return false;
					});
				} catch (error) {
					console.error(`Error fetching coordinates for ZIP code ${zipCode}:`, error);
					return;
				}
			}

			console.log("Filtered businesses after zip code filter:", filteredBusinesses);

			// Ensure only one sponsored business shows
			const sponsoredBusiness = businesses.find((business) => business.isSponsored);
			if (sponsoredBusiness) {
				filteredBusinesses = [sponsoredBusiness, ...filteredBusinesses.filter((business) => business.id !== sponsoredBusiness.id)];
			}

			console.log("Filtered businesses after all filters:", filteredBusinesses);
			setFilteredBusinesses(filteredBusinesses);
		},
		[businesses, coordinates]
	);

	const handleMarkerClick = useCallback(
		(business) => {
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
			const serviceArea = convertServiceAreaToGeoJSON(coords.lat, coords.lng, business.serviceArea.value);
			setSelectedServiceArea(serviceArea);
		},
		[coordinates]
	);

	const handleKeyDown = useCallback(
		(event) => {
			if (!hoveredBusiness) return;

			const currentIndex = businesses.findIndex((b) => b.id === hoveredBusiness.id);

			if (event.key === "ArrowDown" && currentIndex < businesses.length - 1) {
				handleMarkerClick(businesses[currentIndex + 1]);
			} else if (event.key === "ArrowUp" && currentIndex > 0) {
				handleMarkerClick(businesses[currentIndex - 1]);
			}
		},
		[businesses, hoveredBusiness, handleMarkerClick]
	);

	const handleNavigate = useCallback(
		(index) => {
			if (index >= 0 && index < businesses.length) {
				handleMarkerClick(businesses[index]);
				containerRef.current.focus();
			}
		},
		[businesses, handleMarkerClick]
	);

	const handleClosePanel = () => {
		setHoveredBusiness(null);
	};

	const handleSearchInArea = (bounds) => {
		const boundingBox = [bounds.getSouthWest().lng, bounds.getSouthWest().lat, bounds.getNorthEast().lng, bounds.getNorthEast().lat];
		const filteredBusinesses = businesses.filter((business) => {
			const coords = coordinates[business.id];
			return coords && coords.lng >= boundingBox[0] && coords.lat >= boundingBox[1] && coords.lng <= boundingBox[2] && coords.lat <= boundingBox[3];
		});
		setFilteredBusinesses(filteredBusinesses);
	};

	const convertServiceAreaToGeoJSON = (lat, lng, radius) => {
		const center = [lng, lat];
		const options = { steps: 64, units: "miles" };
		return turf.circle(center, radius, options);
	};

	const getCoordinatesFromAddress = async (address) => {
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
	};

	const reverseSearchQuery = (query) => {
		return decodeURIComponent(query).replace(/-/g, " ");
	};

	const pathParts = pathname.split("/");
	const initialZipCode = pathParts[2] || "";
	const initialSearchQuery = reverseSearchQuery(pathParts[3] || "");

	const getCoordinatesFromZipCode = async (zipCode) => {
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
	};

	const getDistance = (lat1, lng1, lat2, lng2) => {
		const from = turf.point([lng1, lat1]);
		const to = turf.point([lng2, lat2]);
		return turf.distance(from, to, { units: "miles" });
	};

	const flyToLocation = (lat, lng, serviceAreaRadius) => {
		if (mapRef.current) {
			mapRef.current.flyTo({
				center: [lng, lat],
				zoom: serviceAreaRadius ? Math.max(8, 14 - Math.log2(serviceAreaRadius)) : 14,
				essential: true,
			});
		}
	};

	useEffect(() => {
		if (!initialFiltersApplied) {
			const initialFilters = {
				searchQuery: initialSearchQuery,
				zipCode: initialZipCode,
				ratingFilters: {
					oneStar: false,
					twoStars: false,
					threeStars: false,
					fourStars: false,
					fiveStars: false,
				},
				openFilters: {
					openNow: false,
					open24Hours: false,
				},
				priceFilters: {
					oneDollar: false,
					twoDollars: false,
					threeDollars: false,
					fourDollars: false,
				},
				sortOption: "",
			};
			handleFilterChange(initialFilters);
			setInitialFiltersApplied(true);
		}
	}, [initialFiltersApplied, initialSearchQuery, initialZipCode, handleFilterChange]);

	return (
		<div className="flex flex-col h-screen outline-none" onKeyDown={handleKeyDown} tabIndex={0} ref={containerRef}>
			<div className="flex flex-1 overflow-hidden">
				<div className="flex flex-col w-1/4 space-y-4 overflow-y-auto min-w-96">
					<header className="flex flex-row items-center px-4 pt-4">
						<Link href="/">
							<ChevronLeft className="w-8 h-8 p-1 font-bold leading-none text-black bg-white rounded-full hover:bg-gray-300" />
						</Link>
						<Link href="/" className="flex items-end ml-4 space-x-2 lg:mr-6">
							<span className="text-3xl font-extrabold leading-none lg:inline-block">Thorbis</span>
							<span className="leading-none text-md text-primary-500 lg:inline-block mb-[2px]">Business Directory</span>
						</Link>
					</header>
					<div className="w-full px-4 pt-4">
						<FullSearchBox initialSearchQuery={initialSearchQuery} initialZipCode={initialZipCode} onFilterChange={handleFilterChange} />
					</div>
					<div className="w-full">
						<div className="px-4 mb-4">
							<h1 className="text-xl font-bold">Top 10 Best Plumbing Companies</h1>
						</div>
						<ScrollArea className="flex-1 px-4">
							{filteredBusinesses.map((business) => (
								<BusinessCard key={business.id} business={business} onClick={() => handleMarkerClick(business)} isActive={activeMarker === business.id} />
							))}
						</ScrollArea>
					</div>
				</div>
				<div className="relative w-3/4">
					<MapContainer businesses={filteredBusinesses} coordinates={coordinates} activeMarker={activeMarker} handleMarkerClick={handleMarkerClick} selectedServiceArea={selectedServiceArea} handleSearchInArea={handleSearchInArea} setMapRef={(ref) => (mapRef.current = ref)} flyToLocation={flyToLocation} />
					{hoveredBusiness && <BusinessInfoPanel business={hoveredBusiness} businessIndex={businesses.findIndex((b) => b.id === hoveredBusiness.id)} businesses={filteredBusinesses} onClose={handleClosePanel} onNavigate={handleNavigate} />}
				</div>
			</div>
		</div>
	);
};

export default SearchContainer;
