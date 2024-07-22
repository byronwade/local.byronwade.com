import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { X, Search, ChevronDown } from "react-feather";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import useSearchStore from "@/store/useSearchStore";
import useBusinessStore from "@/store/useBusinessStore";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { z } from "zod";

const zipCodeSchema = z.string().regex(/^\d{5}$/, "Invalid zip code format");

const LocationDropdown = () => {
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

	const { fetchCoordinatesForZipCode, fetchBusinessesByBoundingBox } = useBusinessStore((state) => ({
		fetchCoordinatesForZipCode: state.fetchCoordinatesForZipCode,
		fetchBusinessesByBoundingBox: state.fetchBusinessesByBoundingBox,
	}));

	const searchParams = useSearchParams();
	const initialZipCode = searchParams.get("zip");

	useEffect(() => {
		const fetchInitialData = async () => {
			if (initialZipCode) {
				setZipCode(initialZipCode);
				setDropdownQuery(initialZipCode);
				const coordinates = await fetchCoordinatesForZipCode(initialZipCode);
				const mapRef = useBusinessStore.getState().mapRef;
				if (coordinates && mapRef) {
					const { latitude, longitude } = coordinates;
					mapRef.jumpTo({ center: [longitude, latitude], zoom: 10 });
					const bounds = mapRef.getBounds();
					const southWest = bounds.getSouthWest();
					const northEast = bounds.getNorthEast();
					await fetchBusinessesByBoundingBox(southWest.lat, southWest.lng, northEast.lat, northEast.lng);
				}
			} else {
				await getCurrentLocationAndFetchBusinesses();
			}
		};
		fetchInitialData();
	}, [initialZipCode, setZipCode, setDropdownQuery, getCurrentLocation]);

	useEffect(() => {
		if (!loading && dropdownOpen) {
			setDropdownOpen(true);
		}
	}, [loading, dropdownOpen, setDropdownOpen]);

	useEffect(() => {
		// Ensure dropdownQuery is synchronized with zipCode
		if (zipCode) {
			setDropdownQuery(zipCode);
		}
	}, [zipCode, setDropdownQuery]);

	const getCurrentLocationAndFetchBusinesses = async () => {
		setLoading(true);
		await getCurrentLocation();
		if (zipCode) {
			const coordinates = await fetchCoordinatesForZipCode(zipCode);
			const mapRef = useBusinessStore.getState().mapRef;
			if (coordinates && mapRef) {
				const { latitude, longitude } = coordinates;
				mapRef.flyTo({ center: [longitude, latitude], zoom: 10, essential: true });
				mapRef.once("moveend", async () => {
					const bounds = mapRef.getBounds();
					const southWest = bounds.getSouthWest();
					const northEast = bounds.getNorthEast();
					await fetchBusinessesByBoundingBox(southWest.lat, southWest.lng, northEast.lat, northEast.lng);
				});
			}
			setDropdownOpen(false);
		}
		setLoading(false);
	};

	const handleClearZipCode = async () => {
		setZipCode("");
		setDropdownQuery("");
		handleResetFilters("zip");
		await getCurrentLocationAndFetchBusinesses();
	};

	const handleLocationSelectWithFetch = async (zip) => {
		handleLocationSelect(zip);
		const coordinates = await fetchCoordinatesForZipCode(zip);
		const mapRef = useBusinessStore.getState().mapRef;
		if (coordinates && mapRef) {
			const { latitude, longitude } = coordinates;
			mapRef.flyTo({ center: [longitude, latitude], zoom: 10, essential: true });
			mapRef.once("moveend", async () => {
				const bounds = mapRef.getBounds();
				const southWest = bounds.getSouthWest();
				const northEast = bounds.getNorthEast();
				await fetchBusinessesByBoundingBox(southWest.lat, southWest.lng, northEast.lat, northEast.lng);
			});
		}
	};

	const fetchLocationSuggestions = async (query) => {
		try {
			const response = await axios.get(`/api/places`, {
				params: { query },
			});
			const suggestions = response.data.suggestions.filter((v, i, a) => a.findIndex((t) => t.zip === v.zip) === i);

			// Sort suggestions to put exact matches and most probable matches at the top
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

	const handleDropdownKeyDownEnhanced = async (e) => {
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
				{isZipModified && (
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
					<Input placeholder="Search by zip code..." value={dropdownQuery} onChange={handleDropdownSearchChangeEnhanced} onKeyDown={handleDropdownKeyDownEnhanced} className={`w-full h-6 p-0 text-white bg-transparent border-none placeholder:text-zinc-400 ${zipCodeError ? "text-red-500 placeholder:text-red-500" : "text-white"}`} />
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

export default LocationDropdown;
