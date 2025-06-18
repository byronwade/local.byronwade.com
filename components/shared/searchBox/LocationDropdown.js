"use client";
import React, { useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@components/ui/dropdown-menu";
import { X, ChevronDown, MapPin } from "react-feather";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Loader2 } from "lucide-react";
import useSearchStore from "@store/useSearchStore";
import useMapStore from "@store/useMapStore";
import useBusinessStore from "@store/useBusinessStore";
import { debounce } from "lodash";

const LocationDropdown = ({ className }) => {
	const router = useRouter();
	const inputRef = useRef(null);
	const { setActiveBusinessId } = useBusinessStore();
	const { location, setLocation, fetchCurrentLocation, fetchAutocompleteSuggestions, fetchPlaceDetails, fetchCoordinatesFromCityAndState, fetchCityAndStateFromCoordinates, activeDropdown, setActiveDropdown } = useSearchStore();
	const { centerOn } = useMapStore();

	useEffect(() => {
		const fetchCoordinatesAndSetLocation = async (locationValue) => {
			try {
				const { lat, lng } = await fetchCoordinatesFromCityAndState(locationValue);
				setLocation({ lat, lng, value: locationValue, city: locationValue, error: false });
				setActiveBusinessId(null);

				// Validate coordinates before centering
				if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
					centerOn(lat, lng);
				} else {
					console.error("Invalid coordinates from fetchCoordinatesFromCityAndState:", { lat, lng });
				}
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
		setLocation({ loading: true, error: false });

		try {
			// Check if geolocation is supported
			if (!navigator.geolocation) {
				throw new Error("Geolocation is not supported by this browser");
			}

			// Get current position with high accuracy
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, {
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 300000, // 5 minutes
				});
			});

			const lat = position.coords.latitude;
			const lng = position.coords.longitude;

			console.log("Got coordinates:", { lat, lng });

			// Validate coordinates
			if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
				// Reverse geocode to get address
				const { city, state } = await fetchCityAndStateFromCoordinates(lat, lng);
				const locationString = `${city}, ${state}`;

				console.log("Location string:", locationString);
				setLocation({
					lat,
					lng,
					value: locationString,
					city: locationString,
					error: false,
					loading: false,
				});
				setActiveBusinessId(null);
				updateURL({ location: locationString });
				centerOn(lat, lng);
			} else {
				throw new Error("Invalid coordinates received");
			}
		} catch (error) {
			console.error("Geolocation error:", error);
			let errorMessage = "Unable to get your location";

			if (error.code === 1) {
				errorMessage = "Location access denied. Please enable location services.";
			} else if (error.code === 2) {
				errorMessage = "Location unavailable. Please try again.";
			} else if (error.code === 3) {
				errorMessage = "Location request timed out. Please try again.";
			}

			setLocation({
				error: true,
				loading: false,
				errorMessage,
			});
		}
	};

	const debouncedFetchSuggestions = useCallback(() => {
		const debouncedFn = debounce(async (value) => {
			try {
				const suggestions = await fetchAutocompleteSuggestions(value);
				setLocation({ filteredSuggestions: suggestions, error: false });
			} catch (error) {
				setLocation({ filteredSuggestions: [], error: true });
			}
		}, 300);
		return debouncedFn;
	}, [fetchAutocompleteSuggestions, setLocation]);

	const handleInputChange = (event) => {
		const value = event.target.value || "";
		setLocation({ value });
		if (value) {
			debouncedFetchSuggestions()(value);
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

			// Validate coordinates before centering
			if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
				setLocation({ lat, lng, value: location.description, city: location.description, error: false });
				updateURL({ location: location.description });
				centerOn(lat, lng);
			} else {
				console.error("Invalid coordinates from place details:", { lat, lng });
				throw new Error("Invalid coordinates from place details");
			}
		} catch (error) {
			setLocation({ error: true });
		}
	};

	const clearLocation = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setLocation({ value: "", city: "", filteredSuggestions: [], lat: null, lng: null, error: true });
		updateURL({ location: "" });
	};

	// Get status color based on location state
	const getStatusColor = () => {
		if (location.error) return "border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground";
		if (location.city) return "border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary";
		return "border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary";
	};

	// Get status icon
	const getStatusIcon = () => {
		if (location.loading) return <Loader2 className="w-3 h-3 animate-spin text-primary" />;
		if (location.city) return <div className="w-2 h-2 rounded-full bg-primary" />;
		return null;
	};

	return (
		<div className="relative">
			<DropdownMenu
				open={activeDropdown === "location"}
				onOpenChange={(open) => {
					setActiveDropdown(open ? "location" : null);
				}}
			>
				{/* Main Button Container */}
				<div className={`flex items-center h-6 border rounded-md transition-all duration-200 ${getStatusColor()}`}>
					{/* Status Icon Section - only show when there's an icon */}
					{getStatusIcon() && <div className="flex items-center justify-center px-2">{getStatusIcon()}</div>}

					{/* Dropdown Trigger Section */}
					<DropdownMenuTrigger asChild>
						<button className={`flex items-center gap-1 py-1 text-xs font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-ring flex-1 transition-colors ${getStatusIcon() ? "px-1" : "px-2"}`} type="button" title={location.error ? location.errorMessage || "Click to set your location" : location.city ? `Current location: ${location.city}` : "📍 Click here to set your location"}>
							<span className="truncate max-w-20 sm:max-w-28">{location.city || "📍 Set Location"}</span>
							<ChevronDown className="w-3 h-3 flex-shrink-0" />
						</button>
					</DropdownMenuTrigger>

					{/* Clear Button Section */}
					{location.city && (
						<button onClick={clearLocation} className="flex items-center justify-center w-5 h-full border-l border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring" title="Clear location" type="button">
							<X className="w-3 h-3" />
						</button>
					)}
				</div>

				{/* Dropdown Content */}
				<DropdownMenuContent className="w-72 bg-background border border-border rounded-lg shadow-lg z-[100]" side="top" align="center" sideOffset={12} avoidCollisions={true} collisionPadding={20}>
					{/* Current Location Button */}
					<DropdownMenuItem asChild>
						<Button onClick={handleGetLocationClick} disabled={location.loading} variant="ghost" className="w-full justify-start gap-3 h-12 hover:bg-accent hover:text-accent-foreground">
							{location.loading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <MapPin className="w-5 h-5 text-primary" />}
							<div className="flex flex-col items-start">
								<span className="font-medium">{location.loading ? "Getting your location..." : "📍 Use My Current Location"}</span>
								<span className="text-xs text-muted-foreground">Help us find businesses near you!</span>
							</div>
						</Button>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					{/* Manual Input Section */}
					<div className="p-3">
						<div className="space-y-2">
							<label className="text-sm font-medium text-muted-foreground">Or enter a city name:</label>
							<Input ref={inputRef} placeholder="e.g., Atlanta, GA" value={location.value || ""} onChange={handleInputChange} onKeyDown={handleInputKeyDown} className="w-full" />
						</div>

						{/* Suggestions */}
						{location.filteredSuggestions && location.filteredSuggestions.length > 0 && (
							<div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
								<div className="text-xs font-medium text-muted-foreground mb-2">Suggestions:</div>
								{location.filteredSuggestions.slice(0, 4).map((loc) => (
									<button key={loc.place_id} onClick={() => handleSelectLocation(loc)} className="w-full text-left p-2 hover:bg-muted rounded text-sm transition-colors block">
										{loc.description}
									</button>
								))}
							</div>
						)}

						{/* Error Message */}
						{location.error && location.errorMessage && <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">{location.errorMessage}</div>}
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

const LocationDropdownWithSuspense = () => (
	<Suspense fallback={<Loader2 className="w-6 h-6 animate-spin" />}>
		<LocationDropdown />
	</Suspense>
);

export default LocationDropdownWithSuspense;

