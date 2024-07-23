import React, { useEffect, useState, Suspense } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { X, Search, ChevronDown } from "react-feather";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import useSearchStore from "@store/useSearchStore";
import useBusinessStore from "@store/useBusinessStore";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { z } from "zod";

const zipCodeSchema = z.string().regex(/^\d{5}$/, "Invalid zip code format");

const LocationDropdownContent = () => {
	const [zipCodeError, setZipCodeError] = useState(false);

	const { dropdownOpen, setDropdownOpen, zipCode, setZipCode, dropdownQuery, setDropdownQuery, isValidZipCode, filteredLocations, handleDropdownSearchChange, handleDropdownKeyDown, handleLocationSelect, handleResetFilters, getCurrentLocation, isZipModified, loading, setLoading, setFilteredLocations } = useSearchStore((state) => ({
		dropdownOpen: state.dropdownOpen,
		setDropdownOpen: state.setDropdownOpen,
		zipCode: state.zipCode,
		setZipCode: state.setZipCode,
		dropdownQuery: state.dropdownQuery,
		setDropdownQuery: state.setDropdownQuery,
		isValidZipCode: state.isValidZipCode,
		filteredLocations: state.filteredLocations,
		handleDropdownSearchChange: state.handleDropdownSearchChange,
		handleDropdownKeyDown: state.handleDropdownKeyDown,
		handleLocationSelect: state.handleLocationSelect,
		handleResetFilters: state.handleResetFilters,
		getCurrentLocation: state.getCurrentLocation,
		isZipModified: state.isZipModified,
		loading: state.loading,
		setLoading: state.setLoading,
		setFilteredLocations: state.setFilteredLocations,
	}));

	const { fetchCoordinatesForZipCode, fetchBusinessesByBoundingBox, flyToLocation } = useBusinessStore((state) => ({
		fetchCoordinatesForZipCode: state.fetchCoordinatesForZipCode,
		fetchBusinessesByBoundingBox: state.fetchBusinessesByBoundingBox,
		flyToLocation: state.flyToLocation,
	}));

	const searchParams = useSearchParams();
	const initialZipCode = searchParams.get("zip");

	useEffect(() => {
		const fetchInitialData = async () => {
			const mapRef = useBusinessStore.getState().mapRef;
			console.log("Initial Zip Code from URL:", initialZipCode);
			if (initialZipCode && mapRef) {
				console.log("Using Initial Zip Code:", initialZipCode);
				setZipCode(initialZipCode);
				setDropdownQuery(initialZipCode);
				const coordinates = await fetchCoordinatesForZipCode(initialZipCode);
				console.log("Fetched Coordinates for Initial Zip Code:", coordinates);
				if (coordinates) {
					const { latitude, longitude } = coordinates;
					const virtualBounds = getVirtualBounds(latitude, longitude, mapRef);
					console.log("Virtual Bounds for Initial Zip Code:", virtualBounds);
					if (virtualBounds) {
						await fetchBusinessesByBoundingBox(virtualBounds.southWestLat, virtualBounds.southWestLng, virtualBounds.northEastLat, virtualBounds.northEastLng);
					}
					flyToLocation(latitude, longitude, 10);
				}
			} else {
				console.log("No Initial Zip Code, using Current Location");
				await getCurrentLocationAndFetchBusinesses();
			}
		};
		fetchInitialData();
	}, [initialZipCode, setZipCode, setDropdownQuery, getCurrentLocation]);

	const getVirtualBounds = (lat, lng, mapRef) => {
		if (!mapRef) return null;
		const currentBounds = mapRef.getBounds();
		const sw = currentBounds.getSouthWest();
		const ne = currentBounds.getNorthEast();
		const centerLat = (sw.lat + ne.lat) / 2;
		const centerLng = (sw.lng + ne.lng) / 2;
		const latOffset = lat - centerLat;
		const lngOffset = lng - centerLng;
		const virtualBounds = {
			southWestLat: sw.lat + latOffset,
			southWestLng: sw.lng + lngOffset,
			northEastLat: ne.lat + latOffset,
			northEastLng: ne.lng + lngOffset,
		};
		console.log("Generated Virtual Bounds:", virtualBounds);
		return virtualBounds;
	};

	useEffect(() => {
		if (!loading && dropdownOpen) {
			setDropdownOpen(true);
		}
	}, [loading, dropdownOpen, setDropdownOpen]);

	useEffect(() => {
		if (zipCode) {
			setDropdownQuery(zipCode);
		}
	}, [zipCode, setDropdownQuery]);

	const getCurrentLocationAndFetchBusinesses = async () => {
		setLoading(true);
		try {
			const currentLocation = await getCurrentLocation();
			console.log("Current Location:", currentLocation);
			if (!currentLocation || !currentLocation.zipCode) {
				throw new Error("Current location not available or zip code missing");
			}
			const { zipCode } = currentLocation;
			setZipCode(zipCode);
			const coordinates = await fetchCoordinatesForZipCode(zipCode);
			console.log("Fetched Coordinates for Current Location Zip Code:", coordinates);
			const mapRef = useBusinessStore.getState().mapRef;
			if (coordinates && mapRef) {
				const { latitude, longitude } = coordinates;
				const virtualBounds = getVirtualBounds(latitude, longitude, mapRef);
				if (virtualBounds) {
					await fetchBusinessesByBoundingBox(virtualBounds.southWestLat, virtualBounds.southWestLng, virtualBounds.northEastLat, virtualBounds.northEastLng);
				}
				flyToLocation(latitude, longitude, 10);
			}
			setDropdownOpen(false);
		} catch (error) {
			console.error("Error getting current location or fetching businesses:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleClearZipCode = async () => {
		console.log("Clear Button Clicked");
		const urlZipCode = searchParams.get("zip");
		if (urlZipCode) {
			console.log("Using URL Zip Code after Clear:", urlZipCode);
			setZipCode(urlZipCode);
			setDropdownQuery(urlZipCode);
			handleLocationSelectWithFetch(urlZipCode);
		} else {
			console.log("No URL Zip Code, using Current Location after Clear");
			setZipCode("");
			setDropdownQuery("");
			handleResetFilters("zip");
			await getCurrentLocationAndFetchBusinesses();
		}
		setDropdownOpen(false); // Close dropdown after clearing
	};

	const handleLocationSelectWithFetch = async (zip) => {
		console.log("Location Selected:", zip);
		handleLocationSelect(zip);
		const coordinates = await fetchCoordinatesForZipCode(zip);
		console.log("Fetched Coordinates for Selected Zip Code:", coordinates);
		const mapRef = useBusinessStore.getState().mapRef;
		if (coordinates && mapRef) {
			const { latitude, longitude } = coordinates;
			const virtualBounds = getVirtualBounds(latitude, longitude, mapRef);
			if (virtualBounds) {
				await fetchBusinessesByBoundingBox(virtualBounds.southWestLat, virtualBounds.southWestLng, virtualBounds.northEastLat, virtualBounds.northEastLng);
				flyToLocation(latitude, longitude, 10);
			}
		}
		setDropdownOpen(false); // Close dropdown after selection
	};

	const fetchLocationSuggestions = async (query) => {
		console.log("Fetching Location Suggestions for Query:", query);
		try {
			const response = await axios.get(`/api/places`, {
				params: { query },
			});
			const suggestions = response.data.suggestions.filter((v, i, a) => a.findIndex((t) => t.zip === v.zip) === i);
			console.log("Location Suggestions:", suggestions);

			const sortedSuggestions = suggestions.sort((a, b) => {
				if (a.zip === query) return -1;
				if (b.zip === query) return 1;
				if (a.name.includes(query) && !b.name.includes(query)) return -1;
				if (!a.name.includes(query) && b.name.includes(query)) return 1;
				return 0;
			});

			setFilteredLocations(
				sortedSuggestions.map((suggestion) => {
					const [city, ...rest] = suggestion.name.split(", ");
					const zip = suggestion.zip || rest.find((term) => /^\d{5}$/.test(term)) || suggestion.place_id;
					return {
						name: city,
						zip,
					};
				})
			);
		} catch (error) {
			console.error("Error fetching location suggestions:", error);
		}
	};

	const handleDropdownSearchChangeEnhanced = (e) => {
		const query = e.target.value;
		setDropdownQuery(query);
		setZipCodeError(false);
		if (query.length >= 3) {
			fetchLocationSuggestions(query);
		} else {
			setFilteredLocations([]);
		}
	};

	const handleLocationFetchOnEnter = async (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			try {
				zipCodeSchema.parse(dropdownQuery);
				await handleLocationSelectWithFetch(dropdownQuery);
				setDropdownOpen(false);
			} catch (error) {
				setZipCodeError(true);
			}
		}
	};

	return (
		<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<div className="relative flex items-center">
				<DropdownMenuTrigger asChild>
					<Button
						className={`flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors ${isValidZipCode ? "bg-gray-800" : "bg-red-500"} rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3`}
						type="button"
						onClick={() => setDropdownOpen(!dropdownOpen)}
					>
						{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair2Icon className="w-4 h-4" />}
						<span className="hidden sm:block">{zipCode || "Enter city or zip code"}</span>
						<ChevronDown className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				{zipCode && (
					<div className="absolute right-0 flex items-center justify-center h-full pr-1.5">
						<Button size="icon" className="w-5 h-5" onClick={handleClearZipCode}>
							<X className="w-4 h-4" />
						</Button>
					</div>
				)}
			</div>

			<DropdownMenuContent className="mt-2 bg-black rounded-md w-80">
				<div className="flex items-center px-2 py-1">
					<Search className="w-4 h-4 mr-2 text-gray-400" />
					<Input placeholder="Search by zip code..." value={dropdownQuery} onChange={handleDropdownSearchChangeEnhanced} onKeyDown={handleLocationFetchOnEnter} className={`w-full h-6 p-0 text-white bg-transparent border-none placeholder:text-zinc-400 ${zipCodeError ? "text-red-500 placeholder:text-red-500" : "text-white"}`} />
					<Button
						size="icon"
						className="flex items-center justify-center h-8 gap-2 px-2 py-2 ml-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3"
						type="button"
						onClick={getCurrentLocationAndFetchBusinesses}
						disabled={loading}
					>
						{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair2Icon className="w-4 h-4" />}
					</Button>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{filteredLocations.length > 0 ? (
						filteredLocations.map((location) => (
							<DropdownMenuItem key={location.zip} onClick={() => handleLocationSelectWithFetch(location.zip)}>
								<span>{location.name}</span>
								<span className="ml-auto text-gray-400">{location.zip}</span>
							</DropdownMenuItem>
						))
					) : (
						<DropdownMenuItem disabled>
							<span>No data found</span>
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const LocationDropdownWithSuspense = () => (
	<Suspense fallback={<Loader2 className="w-6 h-6 animate-spin" />}>
		<LocationDropdownContent />
	</Suspense>
);

export default LocationDropdownWithSuspense;
