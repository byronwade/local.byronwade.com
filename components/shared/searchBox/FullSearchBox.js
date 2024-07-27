import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import hooks from Next.js
import { motion, AnimatePresence } from "framer-motion";
import FilterDropdown from "@components/shared/searchBox/FilterDropdown";
import SortDropdown from "@components/shared/searchBox/SortDropdown";
import LocationDropdown from "@components/shared/searchBox/LocationDropdown";
import AiButton from "@components/shared/searchBox/AiButton";
import { ArrowRight, Search } from "react-feather";
import { Button } from "@components/ui/button";
import { TooltipProvider } from "@components/ui/tooltip";
import AutocompleteSuggestions from "@components/shared/searchBox/AutocompleteSuggestions";
import { Loader2 } from "lucide-react";
import useSearchStore from "@store/useSearchStore";
import useBusinessStore from "@store/useBusinessStore";
import useMapStore from "@store/useMapStore";
import debounce from "lodash/debounce";

const FullSearchBox = () => {
	const { searchQuery, setSearchQuery, location, setLocation, errors, setErrors, touched, setTouched, suggestions, loading } = useSearchStore();
	const { fetchFilteredBusinesses } = useBusinessStore();
	const { getMapBounds, getMapZoom } = useMapStore();
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const queryParam = searchParams.get("query");
		if (queryParam) {
			setSearchQuery(queryParam);
			setTouched((prevTouched) => ({ ...prevTouched, searchQuery: true }));
		}
	}, [searchParams, setSearchQuery, setTouched]);

	useEffect(() => {
		const validationErrors = {};
		let isValid = true;

		if (!searchQuery) {
			validationErrors.searchQuery = "Search query cannot be empty";
			isValid = false;
		}

		if (!location.value) {
			validationErrors.location = "Location cannot be empty";
			isValid = false;
		}

		setErrors(validationErrors);
		setIsFormValid(isValid);
	}, [searchQuery, location, setErrors]);

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		if (searchQuery) {
			queryParams.set("query", searchQuery);
		} else {
			queryParams.delete("query");
		}
		if (location.value) {
			queryParams.set("location", location.value);
		} else {
			queryParams.delete("location");
		}
		router.replace(`?${queryParams.toString()}`, undefined, { shallow: true });
	}, [searchQuery, location, router]);

	const debouncedFetchFilteredBusinesses = useCallback(
		debounce(async () => {
			const bounds = await getMapBounds();
			console.log("Map bounds:", bounds);
			const zoom = await getMapZoom();
			if (bounds && zoom !== null) {
				await fetchFilteredBusinesses(bounds, zoom, searchQuery);
			}
		}, 300),
		[getMapBounds, getMapZoom, fetchFilteredBusinesses, searchQuery]
	);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setSearchQuery(value);
		setTouched((prevTouched) => ({ ...prevTouched, searchQuery: true }));
		setAutocompleteOpen(true);
		debouncedFetchFilteredBusinesses();
	};

	const handleLocationChange = (location) => {
		setLocation(location);
		setTouched((prevTouched) => ({ ...prevTouched, location: true }));
	};

	const updateLocationError = (error) => {
		setTouched((prevTouched) => ({ ...prevTouched, location: true }));
		setErrors((prevErrors) => ({
			...prevErrors,
			location: error ? "Location cannot be empty" : "",
		}));
	};

	const handleSuggestionSelect = (suggestion) => {
		setSearchQuery(suggestion.text);
		setAutocompleteOpen(false);
		setTouched((prevTouched) => ({ ...prevTouched, searchQuery: true }));
		debouncedFetchFilteredBusinesses();
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		if (!isFormValid) {
			return;
		}

		const queryString = new URLSearchParams({ query: searchQuery, location: location.value }).toString();
		window.location.href = `/search?${queryString}`;
	};

	return (
		<TooltipProvider>
			<div className="z-10 flex flex-col w-full bg-gray-900 border rounded-md shadow-lg divide-zinc-600 shadow-black/40">
				<div className="relative z-10 w-full h-full min-w-0 p-3 bg-gray-900">
					<div className="relative flex flex-col items-center flex-1 w-full transition-all duration-300">
						<div className="relative flex items-center justify-between w-full pb-2 mb-2 border-b align-center">
							<div className="flex items-center justify-center flex-1">
								<div className="relative w-full">
									<input
										className={`bg-transparent w-full min-h-[1.5rem] resize-none border-0 text-sm leading-relaxed shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black disabled:bg-transparent disabled:opacity-80 pl-1 ${!errors.searchQuery ? "text-white placeholder:text-zinc-400" : "text-red-500 placeholder:text-red-500"}`}
										id="search-input"
										placeholder="Search for a business"
										rows="1"
										spellCheck="false"
										style={{ colorScheme: "dark", height: "23px" }}
										value={searchQuery}
										onChange={handleInputChange}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleFormSubmit(e);
											}
										}}
										autoComplete="off"
									/>
									{errors.searchQuery && touched.searchQuery && <p className="text-sm text-red-500">{errors.searchQuery}</p>}
								</div>
							</div>
							<div className="relative flex items-center ml-2 space-x-1">
								<AiButton showBeta={true} />
								<Button
									size="icon"
									className={`${
										isFormValid ? "bg-brand" : "bg-gray-800"
									} flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors rounded-md select-none ring-offset-background focus-visible:ring-offset-2 shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3`}
									type="submit"
									disabled={!isFormValid}
									onClick={handleFormSubmit}
								>
									{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isFormValid ? <ArrowRight className="w-4 h-4" /> : <Search className="w-4 h-4" />}
								</Button>
							</div>
						</div>
						<AnimatePresence>
							{autocompleteOpen && suggestions.length > 0 && (
								<motion.div initial={{ maxHeight: 0, opacity: 0 }} animate={{ maxHeight: "24rem", opacity: 1 }} exit={{ maxHeight: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full pb-2 mb-2 overflow-hidden border-b">
									<AutocompleteSuggestions suggestions={suggestions} onSelect={handleSuggestionSelect} />
								</motion.div>
							)}
						</AnimatePresence>
						<div className="flex justify-between w-full md:items-end">
							<div className="flex flex-row flex-wrap flex-1 gap-1 sm:gap-2">
								<FilterDropdown />
								<SortDropdown />
								<LocationDropdown onLocationChange={handleLocationChange} value={location.value || ""} updateLocationError={updateLocationError} />
							</div>
						</div>
						{errors.location && touched.location && <p className="text-sm text-red-500">{errors.location}</p>}
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
};

export default FullSearchBox;
