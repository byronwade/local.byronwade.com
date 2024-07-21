"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilterDropdown from "@/components/shared/searchBox/FilterDropdown";
import SortDropdown from "@/components/shared/searchBox/SortDropdown";
import LocationDropdown from "@/components/shared/searchBox/LocationDropdown";
import AiButton from "@/components/shared/searchBox/AiButton";
import { useSearchBox } from "@/components/shared/searchBox/useSearchBox";
import { ArrowRight, Search } from "react-feather";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import AutocompleteSuggestions from "@/components/shared/searchBox/AutocompleteSuggestions";

const SearchBox = ({ showFilterButton, showSortButton, showLocationButton, showAiButton, initialSearchQuery, initialZipCode, onFilterChange }) => {
	const {
		zipCode,
		locationError,
		searchQuery,
		setSearchQuery,
		dropdownQuery,
		filteredLocations,
		isValidZipCode,
		isValidSearchQuery,
		dropdownOpen,
		setDropdownOpen,
		handleSearchChange,
		handleSubmit,
		handleDropdownSearchChange,
		handleDropdownKeyDown,
		getCurrentLocation,
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
	} = useSearchBox(initialSearchQuery, initialZipCode, onFilterChange);

	const [suggestions, setSuggestions] = useState([
		{ text: "Find business information", icon: "Search", color: "rgb(226, 197, 65)" },
		{ text: "Create a business content calendar", icon: "Calendar", color: "rgb(203, 139, 208)" },
		{ text: "Organize business documents", icon: "Clipboard", color: "rgb(203, 139, 208)" },
		{ text: "Write a business proposal", icon: "Book", color: "rgb(226, 197, 65)" },
	]);
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);

	useEffect(() => {
		if (initialSearchQuery) {
			setSearchQuery(initialSearchQuery);
		}
	}, [initialSearchQuery, setSearchQuery]);

	useEffect(() => {
		if (initialZipCode) {
			handleDropdownSearchChange({ target: { value: initialZipCode } });
		}
	}, [initialZipCode, handleDropdownSearchChange]);

	const handleInputChange = (e) => {
		handleSearchChange(e);
		const value = e.target.value.toLowerCase();
		const filtered = suggestions.filter((suggestion) => suggestion.text.toLowerCase().includes(value));
		setFilteredSuggestions(filtered);
		setAutocompleteOpen(value.length > 0);
	};

	const handleSuggestionSelect = (text) => {
		handleSearchChange({ target: { value: text } });
		setAutocompleteOpen(false);
	};

	return (
		<TooltipProvider>
			<div className="z-10 flex flex-col w-full bg-gray-900 border rounded-md shadow-lg divide-zinc-600 shadow-black/40">
				<form className="relative z-10 w-full h-full min-w-0 p-3 bg-gray-900" onSubmit={handleSubmit}>
					<div className="absolute right-3.5 top-2.5 z-10 p-1 opacity-50 transition-opacity hover:opacity-80" data-state="closed">
						<Search className="w-4 h-4" />
					</div>
					<div className="relative flex flex-col items-center flex-1 w-full transition-all duration-300">
						<div className="relative flex self-start justify-between flex-1 w-full min-w-0 pb-2 mb-4 border-b">
							<div className="pointer-events-none invisible ml-[-100%] min-w-[50%] flex-[1_0_50%] overflow-x-visible opacity-0">
								<div className="[&_textarea]:px-0 pl-1 pr-10 pointer-events-none invisible opacity-0">Search for businesses</div>
							</div>
							<input
								className={`min-h-[1.5rem] w-full flex-[1_0_50%] resize-none border-0 bg-transparent text-sm leading-relaxed shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black disabled:bg-transparent disabled:opacity-80 mr-2 [&_textarea]:px-0 pl-1 pr-10 ${isValidSearchQuery ? "text-white placeholder:text-zinc-400" : "text-red-500 placeholder:text-red-500"}`}
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
						<AnimatePresence>
							{autocompleteOpen && filteredSuggestions.length > 0 && (
								<motion.div initial={{ maxHeight: 0, opacity: 0 }} animate={{ maxHeight: "24rem", opacity: 1 }} exit={{ maxHeight: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full pb-4 mb-4 overflow-hidden border-b">
									<AutocompleteSuggestions suggestions={filteredSuggestions} onSelect={handleSuggestionSelect} />
								</motion.div>
							)}
						</AnimatePresence>
						<div className="flex justify-between w-full">
							<div className="flex flex-1 gap-1 sm:gap-2">
								{showFilterButton && <FilterDropdown filterCount={filterCount} isRatingModified={isRatingModified} isOpenModified={isOpenModified} isPriceModified={isPriceModified} ratingFilters={ratingFilters} openFilters={openFilters} priceFilters={priceFilters} handleFilterChange={handleFilterChange} handleResetFilters={handleResetFilters} />}
								{showSortButton && <SortDropdown sortOption={sortOption} handleSortChange={handleSortChange} handleResetFilters={handleResetFilters} isSortModified={isSortModified} />}
								{showLocationButton && (
									<LocationDropdown dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} zipCode={zipCode} dropdownQuery={dropdownQuery} isValidZipCode={isValidZipCode} filteredLocations={filteredLocations} handleDropdownSearchChange={handleDropdownSearchChange} handleDropdownKeyDown={handleDropdownKeyDown} handleLocationSelect={handleLocationSelect} handleResetFilters={handleResetFilters} getCurrentLocation={getCurrentLocation} isZipModified={isZipModified} />
								)}
								{showAiButton && <AiButton handleTextareaInput={handleTextareaInput} showBeta={true} />}
							</div>
							<div className="flex flex-row space-x-2">
								<Button variant="brand" className="flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:px-3" type="submit">
									<ArrowRight className="w-4 h-4" />
								</Button>
							</div>
						</div>
						{locationError && <p className="text-sm text-red-500">{locationError}</p>}
					</div>
				</form>
			</div>
		</TooltipProvider>
	);
};

export const FullSearchBox = ({ initialSearchQuery, initialZipCode, onFilterChange }) => <SearchBox showFilterButton={true} showSortButton={true} showLocationButton={true} showAiButton={true} initialSearchQuery={initialSearchQuery} initialZipCode={initialZipCode} onFilterChange={onFilterChange} />;

export const SearchBarOnly = ({ showFilterButton, showSortButton, showLocationButton, showAiButton }) => {
	const { zipCode, locationError, dropdownQuery, filteredLocations, isValidZipCode, isValidSearchQuery, dropdownOpen, setDropdownOpen, handleDropdownSearchChange, handleDropdownKeyDown, getCurrentLocation, handleLocationSelect, handleResetFilters, handleFilterChange, handleSortChange, isSortModified, sortOption, isZipModified, isOpenModified, isRatingModified, isPriceModified, filterCount, handleTextareaInput, ratingFilters, openFilters, priceFilters } = useSearchBox();

	const [searchQuery, setSearchQuery] = useState("");

	const [suggestions, setSuggestions] = useState([
		{ text: "Find business information", icon: "Search", color: "rgb(226, 197, 65)" },
		{ text: "Create a business content calendar", icon: "Calendar", color: "rgb(203, 139, 208)" },
		{ text: "Organize business documents", icon: "Clipboard", color: "rgb(203, 139, 208)" },
		{ text: "Write a business proposal", icon: "Book", color: "rgb(226, 197, 65)" },
	]);
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);

	const handleInputChange = (e) => {
		setSearchQuery(e.target.value);
		const value = e.target.value.toLowerCase();
		const filtered = suggestions.filter((suggestion) => suggestion.text.toLowerCase().includes(value));
		setFilteredSuggestions(filtered);
		setAutocompleteOpen(value.length > 0);
	};

	const handleSuggestionSelect = (text) => {
		setSearchQuery(text);
		setAutocompleteOpen(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleSearchChange({ target: { value: searchQuery } });
	};

	const formatSearchQuery = (query) => {
		// Replace spaces with dashes, remove non-alphanumeric characters, and handle extra dashes
		const formattedQuery = query
			.trim() // Remove leading and trailing spaces
			.replace(/\s+/g, "-") // Replace spaces with dashes
			.replace(/[^a-zA-Z0-9-]/g, "") // Remove non-alphanumeric characters except dashes
			.replace(/-+/g, "-") // Replace multiple dashes with a single dash
			.replace(/^-+|-+$/g, ""); // Remove leading and trailing dashes

		return encodeURIComponent(formattedQuery);
	};

	return (
		<TooltipProvider>
			<div className="z-10 flex flex-col w-full bg-gray-900 border rounded-md shadow-lg divide-zinc-600 shadow-black/40">
				<form className="relative z-10 w-full h-full min-w-0 p-3 bg-gray-900" onSubmit={handleSubmit}>
					<div className="relative flex items-center justify-between w-full align-center">
						<div className="flex items-center justify-center flex-1">
							<div className="relative w-full">
								<input
									className={`w-full min-h-[1.5rem] resize-none border-0 bg-transparent text-sm leading-relaxed shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black disabled:bg-transparent disabled:opacity-80 pl-1 ${isValidSearchQuery ? "text-white placeholder:text-zinc-400" : "text-red-500 placeholder:text-red-500"}`}
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
						<div className="relative flex items-center space-x-1">
							{showLocationButton && (
								<LocationDropdown dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} zipCode={zipCode} dropdownQuery={dropdownQuery} isValidZipCode={isValidZipCode} filteredLocations={filteredLocations} handleDropdownSearchChange={handleDropdownSearchChange} handleDropdownKeyDown={handleDropdownKeyDown} handleLocationSelect={handleLocationSelect} handleResetFilters={handleResetFilters} getCurrentLocation={getCurrentLocation} isZipModified={isZipModified} />
							)}
							{showAiButton && <AiButton handleTextareaInput={handleTextareaInput} showBeta={false} />}
							<Button
								size="icon"
								className={`${
									searchQuery ? "bg-brand" : "bg-gray-800"
								} flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors rounded-md select-none ring-offset-background focus-visible:ring-offset-2 shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3`}
								type="submit"
							>
								{searchQuery ? <ArrowRight className="w-4 h-4" /> : <Search className="w-4 h-4" />}
							</Button>
						</div>
					</div>
					<AnimatePresence>
						{autocompleteOpen && filteredSuggestions.length > 0 && (
							<motion.div initial={{ maxHeight: 0, opacity: 0 }} animate={{ maxHeight: "24rem", opacity: 1 }} exit={{ maxHeight: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full py-4 mt-4 overflow-hidden border-t">
								<AutocompleteSuggestions suggestions={filteredSuggestions} onSelect={handleSuggestionSelect} />
							</motion.div>
						)}
					</AnimatePresence>
					{locationError && <p className="text-sm text-red-500">{locationError}</p>}
				</form>
			</div>
		</TooltipProvider>
	);
};

export default SearchBox;
