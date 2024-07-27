"use client";
import React, { useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { X, Search, ChevronDown } from "react-feather";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import useSearchStore from "@store/useSearchStore";
import useMapStore from "@store/useMapStore";
import useBusinessStore from "@store/useBusinessStore";
import { debounce } from "lodash";

const LocationDropdownContent = () => {
    const router = useRouter();
	const inputRef = useRef(null);
	const { setActiveBusinessId } = useBusinessStore();
	const { location, setLocation, fetchCurrentLocation, fetchAutocompleteSuggestions, fetchPlaceDetails, fetchCoordinatesFromCityAndState, fetchCityAndStateFromCoordinates } = useSearchStore();
	const { centerOn } = useMapStore();

	useEffect(() => {
		const fetchCoordinatesAndSetLocation = async (locationValue) => {
			try {
				const { lat, lng } = await fetchCoordinatesFromCityAndState(locationValue);
				setLocation({ lat, lng, value: locationValue, city: locationValue, error: false });
				setActiveBusinessId(null);
				centerOn(lat, lng);
			} catch (error) {
				console.error("Error fetching coordinates:", error);
				setLocation({ error: true });
			}
		};

		const urlParams = new URLSearchParams(window.location.search);
		const locationParam = urlParams.get("location");
		if (locationParam) {
			fetchCoordinatesAndSetLocation(locationParam);
			console.log("Location param:", locationParam);
		} else {
			setLocation({ error: true });
		}
	}, [fetchCoordinatesFromCityAndState, setLocation, centerOn, setActiveBusinessId]);

	const updateURL = (newParams) => {
		const url = new URL(window.location.href);
		url.searchParams.set("location", newParams.location);
		router.replace(url.toString(), undefined, { shallow: true });
	};

	const handleGetLocationClick = async () => {
		setLocation({ loading: true });
		try {
			const location = await new Promise((resolve, reject) => {
				fetchCurrentLocation(resolve, reject);
			});
			console.log("Location:", location);
			if (location && location.lat && location.lng) {
				const { lat, lng } = location;
				const { city, state } = await fetchCityAndStateFromCoordinates(lat, lng);
				const locationString = `${city}, ${state}`;
				console.log("Location string:", locationString);
				setLocation({ lat, lng, value: locationString, city: locationString, error: false });
				setActiveBusinessId(null);
				updateURL({ location: locationString });
				centerOn(lat, lng);
			} else {
				throw new Error("Location is undefined");
			}
		} catch (error) {
			setLocation({ error: true });
		} finally {
			setLocation({ loading: false });
		}
	};

	const debouncedFetchSuggestions = useCallback(
		debounce(async (value) => {
			try {
				const suggestions = await fetchAutocompleteSuggestions(value);
				setLocation({ filteredSuggestions: suggestions, error: false });
			} catch (error) {
				setLocation({ filteredSuggestions: [], error: true });
			}
		}, 300), // Adjust the debounce delay as needed
		[fetchAutocompleteSuggestions, setLocation]
	);

	const handleInputChange = (event) => {
		const value = event.target.value || ""; // Ensure value is always defined
		setLocation({ value });
		if (value) {
			debouncedFetchSuggestions(value);
		} else {
			setLocation({ filteredSuggestions: [] });
		}
	};

	const handleInputKeyDown = async (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			await fetchCoordinatesAndSetLocation(location.value);
		}
	};

	const handleSelectLocation = async (location) => {
		try {
			const details = await fetchPlaceDetails(location.place_id);
			const { lat, lng } = details.geometry.location;
			setLocation({ lat, lng, value: location.description, city: location.description, error: false });
			updateURL({ location: location.description });
			centerOn(lat, lng);
		} catch (error) {
			setLocation({ error: true });
		}
	};

	const clearLocation = () => {
		setLocation({ value: "", city: "", filteredSuggestions: [], lat: null, lng: null, error: true });
		updateURL({ location: "" });
	};

	return (
		<DropdownMenu>
			<div className="relative flex items-center">
				<DropdownMenuTrigger asChild>
					<Button
						className={`flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors ${
							location.error ? "bg-red-500 hover:!bg-red-500 focus-visible:!bg-red-500 focus-within:!bg-red-500" : "bg-gray-800"
						} rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3`}
						type="button"
					>
						{location.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair2Icon className="w-4 h-4" />}
						<span className="block truncate max-w-10 sm:max-w-24 text-ellipsis">{location.city || "Enter a location"}</span>
						<ChevronDown className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				{location.city && (
					<div className="absolute right-0 flex items-center justify-center h-full pr-1.5">
						<Button size="icon" className="w-5 h-5" onClick={clearLocation}>
							<X className="w-4 h-4" />
						</Button>
					</div>
				)}
			</div>

			<DropdownMenuContent className="mt-2 bg-black rounded-md w-80">
				<div className="flex items-center px-2 py-1">
					<Search className="w-4 h-4 mr-2 text-gray-400" />
					<Input ref={inputRef} placeholder="Search by city..." className={`w-full h-6 p-0 text-white bg-transparent border-none placeholder:text-zinc-400 ${location.error ? "text-red-500 placeholder:text-red-500" : "text-white"}`} value={location.value || ""} onChange={(e) => handleInputChange(e)} onKeyDown={handleInputKeyDown} />
					<Button
						size="icon"
						className="flex items-center justify-center h-8 gap-2 px-2 py-2 ml-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3"
						type="button"
						disabled={location.loading}
						onClick={handleGetLocationClick}
					>
						{location.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair2Icon className="w-4 h-4" />}
					</Button>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{location.filteredSuggestions && location.filteredSuggestions.length > 0 ? (
						location.filteredSuggestions.map((loc) => (
							<DropdownMenuItem key={loc.place_id} onClick={() => handleSelectLocation(loc)}>
								<span>{loc.description}</span>
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
