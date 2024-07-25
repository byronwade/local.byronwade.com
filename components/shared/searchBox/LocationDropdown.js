import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { X, Search, ChevronDown } from "react-feather";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import useSearchStore from "@store/useSearchStore";
import useMapStore from "@store/useMapStore"; // Import useMapStore
import debounce from "lodash.debounce";

const LocationDropdownContent = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [input, setInput] = useState("");
	const [city, setCity] = useState("");
	const [locationError, setLocationError] = useState(true);
	const [filteredLocations, setFilteredLocations] = useState([]);
	const { fetchCurrentLocation, fetchAutocompleteSuggestions, setLocation, fetchPlaceDetails } = useSearchStore();
	const { centerOn } = useMapStore(); // Use centerOn from useMapStore

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const locationParam = urlParams.get("location");
		if (locationParam) {
			setCity(locationParam);
			setInput(locationParam);
			setLocationError(false); // Turn off error if location param is present
		} else {
			setLocationError(true); // Ensure location error is on if no location param
		}
	}, []);

	const updateURL = (newParams) => {
		const url = new URL(window.location.href);
		url.searchParams.set("location", newParams.location);
		router.replace(url.toString(), undefined, { shallow: true });
		console.log(`updateURL - newParams: ${newParams.location}`);
	};

	const handleGetLocationClick = async () => {
		setLoading(true);
		try {
			const location = await new Promise((resolve, reject) => {
				fetchCurrentLocation(resolve, reject);
			});
			console.log("Fetched current location:", location);
			if (location && location.lat && location.lng) {
				const { lat, lng } = location;
				const { city, state } = await useSearchStore.getState().fetchCityAndState({ lat, lng });
				const locationString = `${city}, ${state}`;
				setCity(locationString);
				setInput(locationString);
				setLocation({ lat, lng });
				updateURL({ location: locationString });
				setLocationError(false); // Turn off error if location is fetched successfully
				centerOn(lat, lng); // Center the map on the new location
				console.log(`handleGetLocationClick - fetched city and state: ${locationString}`);
			} else {
				throw new Error("Location is undefined");
			}
		} catch (error) {
			console.error("Error fetching current location:", error);
			setLocationError(true);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = async (event) => {
		const value = event.target.value;
		setInput(value);
		console.log("handleInputChange - input value:", value);
		if (value) {
			try {
				const suggestions = await fetchAutocompleteSuggestions(value);
				setFilteredLocations(suggestions);
				console.log("Autocomplete suggestions:", suggestions);
			} catch (error) {
				console.error("Error fetching autocomplete suggestions:", error);
				setFilteredLocations([]);
				// Ensure locationError is true when no suggestions are found
				setLocationError(true);
			}
		} else {
			setFilteredLocations([]);
		}
	};

	const handleSelectLocation = async (location) => {
		try {
			const details = await fetchPlaceDetails(location.place_id);
			const { lat, lng } = details.geometry.location;
			setCity(location.description);
			setInput(location.description);
			setLocation({ lat, lng });
			updateURL({ location: location.description });
			setLocationError(false); // Turn off error if a location is selected
			centerOn(lat, lng); // Center the map on the new location
			console.log(`handleSelectLocation - selected location: ${location.description}`);
		} catch (error) {
			console.error("Error fetching place details:", error);
			setLocationError(true);
		}
	};

	const clearLocation = () => {
		console.log("clearLocation - before clearing:", { input, city });
		setInput("");
		setCity("");
		setFilteredLocations([]);
		setLocation(null);
		updateURL({ location: "" });
		setLocationError(true);
		console.log("clearLocation - after clearing:", { input, city });
	};

	return (
		<DropdownMenu>
			<div className="relative flex items-center">
				<DropdownMenuTrigger asChild>
					<Button
						className={`flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors ${
							locationError ? "bg-red-500 hover:!bg-red-500 focus-visible:!bg-red-500 focus-within:!bg-red-500" : "bg-gray-800"
						} rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3`}
						type="button"
					>
						{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair2Icon className="w-4 h-4" />}
						<span className="hidden truncate max-w-24 sm:block text-ellipsis">{city || "Enter a location"}</span>
						<ChevronDown className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				{city && (
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
					<Input placeholder="Search by city..." className={`w-full h-6 p-0 text-white bg-transparent border-none placeholder:text-zinc-400 ${locationError ? "text-red-500 placeholder:text-red-500" : "text-white"}`} value={input} onChange={(e) => handleInputChange(e)} />
					<Button
						size="icon"
						className="flex items-center justify-center h-8 gap-2 px-2 py-2 ml-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3"
						type="button"
						disabled={loading}
						onClick={handleGetLocationClick}
					>
						{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair2Icon className="w-4 h-4" />}
					</Button>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{filteredLocations.length > 0 ? (
						filteredLocations.map((location) => (
							<DropdownMenuItem key={location.place_id} onClick={() => handleSelectLocation(location)}>
								<span>{location.description}</span>
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
