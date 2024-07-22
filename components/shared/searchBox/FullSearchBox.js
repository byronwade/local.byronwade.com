"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilterDropdown from "@/components/shared/searchBox/FilterDropdown";
import SortDropdown from "@/components/shared/searchBox/SortDropdown";
import LocationDropdown from "@/components/shared/searchBox/LocationDropdown";
import AiButton from "@/components/shared/searchBox/AiButton";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search } from "react-feather";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import AutocompleteSuggestions from "@/components/shared/searchBox/AutocompleteSuggestions";
import { Loader2 } from "lucide-react";
import useSearchStore from "@/store/useSearchStore";
import useBusinessStore from "@/store/useBusinessStore";

const FullSearchBox = ({ initialSearchQuery, initialZipCode, onFilterChange }) => {
    const router = useRouter();
	const {
		searchQuery,
		setSearchQuery,
		zipCode,
		filteredLocations,
		locationError,
		dropdownQuery,
		isValidSearchQuery,
		dropdownOpen,
		setDropdownOpen,
		handleSearchChange,
		handleDropdownSearchChange,
		handleDropdownKeyDown,
		handleLocationSelect,
		handleResetFilters,
		handleFilterChange,
		handleSortChange,
		isSortModified,
		sortOption,
		isZipModified,
		isOpenModified,
		isRatingModified,
		isPriceModified,
		filterCount,
		handleTextareaInput,
		ratingFilters,
		openFilters,
		priceFilters,
		loading,
		setZipCode,
		getCurrentLocation,
		setLoading,
		handleSubmit,
	} = useSearchStore((state) => ({
		...state,
	}));

	const { filterAndSortBusinesses, handleSearchInArea } = useBusinessStore((state) => ({
		...state,
	}));

	const [suggestions, setSuggestions] = useState([
		{ text: "Find business information", icon: "Search", color: "rgb(226, 197, 65)" },
		{ text: "Create a business content calendar", icon: "Calendar", color: "rgb(203, 139, 208)" },
		{ text: "Organize business documents", icon: "Clipboard", color: "rgb(203, 139, 208)" },
		{ text: "Write a business proposal", icon: "Book", color: "rgb(226, 197, 65)" },
	]);
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);
	const [searchTouched, setSearchTouched] = useState(false);
	const [zipTouched, setZipTouched] = useState(false);

	useEffect(() => {
		if (initialSearchQuery) {
			setSearchQuery(initialSearchQuery);
			filterAndSortBusinesses(initialSearchQuery); // Apply initial filter
		}
	}, [initialSearchQuery, setSearchQuery, filterAndSortBusinesses]);

	useEffect(() => {
		if (initialZipCode) {
			handleDropdownSearchChange({ target: { value: initialZipCode } });
		}
	}, [initialZipCode, handleDropdownSearchChange]);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setSearchTouched(true);
		handleSearchChange(e);
		filterAndSortBusinesses(value); // Ensure businesses are filtered and sorted after changing the search query
		const filtered = suggestions.filter((suggestion) => suggestion.text.toLowerCase().includes(value.toLowerCase()));
		setFilteredSuggestions(filtered);
		setAutocompleteOpen(value.length > 0);
	};

	const handleDropdownSearchChangeTouched = (e) => {
		setZipTouched(true);
		handleDropdownSearchChange(e);
		filterAndSortBusinesses(searchQuery); // Ensure businesses are filtered and sorted after changing the zip code
	};

	const handleSuggestionSelect = (text) => {
		handleSearchChange({ target: { value: text } });
		setAutocompleteOpen(false);
	};

	const handleSubmitForm = async (e) => {
		e.preventDefault();
		setSearchTouched(true);
		setZipTouched(true);
		const url = handleSubmit(e);
		if (url) {
			await handleSearchInArea(); // Fetch businesses in the new area
			filterAndSortBusinesses(searchQuery); // Ensure businesses are filtered and sorted after fetching
			router.push(url);
		}
	};

	const handleClearZipCode = () => {
		setZipCode("");
		const url = new URL(window.location);
		url.searchParams.delete("zip");
		window.history.pushState({}, "", url);
		filterAndSortBusinesses(searchQuery); // Ensure businesses are filtered and sorted after clearing the zip code
	};

	const handleCurrentLocation = async () => {
		setLoading(true); // Set loading to true when starting the location fetch
		await getCurrentLocation();
		setLoading(false); // Set loading to false when the location fetch is complete
		if (zipCode) {
			const url = new URL(window.location);
			url.searchParams.set("zip", zipCode);
			window.history.pushState({}, "", url);
			setDropdownOpen(false);
			filterAndSortBusinesses(searchQuery); // Ensure businesses are filtered and sorted after setting the zip code
		}
	};

	return (
		<TooltipProvider>
			<div className="z-10 flex flex-col w-full bg-gray-900 border rounded-md shadow-lg divide-zinc-600 shadow-black/40">
				<form className="relative z-10 w-full h-full min-w-0 p-3 bg-gray-900" onSubmit={handleSubmitForm}>
					<div className="relative flex flex-col items-center flex-1 w-full transition-all duration-300">
						<div className="relative flex items-center justify-between w-full pb-2 mb-2 border-b align-center">
							<div className="flex items-center justify-center flex-1">
								<div className="relative w-full">
									<input
										className={`bg-transparent w-full min-h-[1.5rem] resize-none border-0 text-sm leading-relaxed shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black disabled:bg-transparent disabled:opacity-80 pl-1 ${!searchTouched || isValidSearchQuery ? "text-white placeholder:text-zinc-400" : "text-red-500 placeholder:text-red-500"}`}
										id="search-input"
										placeholder="Search for a business"
										rows="1"
										spellCheck="false"
										style={{ colorScheme: "dark", height: "23px" }}
										value={searchQuery}
										onChange={handleInputChange}
										autoComplete="off"
									/>
								</div>
							</div>
							<div className="relative flex items-center ml-2 space-x-1">
								<Button
									size="icon"
									className={`${
										searchQuery ? "bg-brand" : "bg-gray-800"
									} flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors rounded-md select-none ring-offset-background focus-visible:ring-offset-2 shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3`}
									type="submit"
									disabled={!isValidSearchQuery || loading}
								>
									{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : searchQuery ? <ArrowRight className="w-4 h-4" /> : <Search className="w-4 h-4" />}
								</Button>
							</div>
						</div>
						<AnimatePresence>
							{autocompleteOpen && filteredSuggestions.length > 0 && (
								<motion.div initial={{ maxHeight: 0, opacity: 0 }} animate={{ maxHeight: "24rem", opacity: 1 }} exit={{ maxHeight: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full pb-2 mb-2 overflow-hidden border-b">
									<AutocompleteSuggestions suggestions={filteredSuggestions} onSelect={handleSuggestionSelect} />
								</motion.div>
							)}
						</AnimatePresence>
						<div className="flex justify-between w-full md:items-end">
							<div className="flex flex-row flex-wrap flex-1 gap-1 sm:gap-2">
								<FilterDropdown filterCount={filterCount} isRatingModified={isRatingModified} isOpenModified={isOpenModified} isPriceModified={isPriceModified} ratingFilters={ratingFilters} openFilters={openFilters} priceFilters={priceFilters} handleFilterChange={handleFilterChange} handleResetFilters={handleResetFilters} />
								<SortDropdown sortOption={sortOption} handleSortChange={handleSortChange} handleResetFilters={handleResetFilters} isSortModified={isSortModified} />
								<LocationDropdown
									dropdownOpen={dropdownOpen}
									setDropdownOpen={setDropdownOpen}
									zipCode={zipCode}
									dropdownQuery={dropdownQuery}
									isValidSearchQuery={isValidSearchQuery}
									filteredLocations={filteredLocations}
									handleDropdownSearchChange={handleDropdownSearchChangeTouched}
									handleDropdownKeyDown={handleDropdownKeyDown}
									handleLocationSelect={handleLocationSelect}
									handleResetFilters={handleResetFilters}
									getCurrentLocation={handleCurrentLocation}
									isZipModified={isZipModified}
									loading={loading}
									handleClearZipCode={handleClearZipCode}
								/>
								<AiButton handleTextareaInput={handleTextareaInput} showBeta={true} />
							</div>
						</div>
						{locationError && <p className="text-sm text-red-500">{locationError}</p>}
					</div>
				</form>
			</div>
		</TooltipProvider>
	);
};

export default FullSearchBox;
