"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocationDropdown from "@components/shared/searchBox/LocationDropdown";
import AiButton from "@components/shared/searchBox/AiButton";
import { ArrowRight, Search } from "react-feather";
import { Button } from "@components/ui/button";
import AutocompleteSuggestions from "@components/shared/searchBox/AutocompleteSuggestions";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import useSearchStore from "@store/useSearchStore";
import useBusinessStore from "@store/useBusinessStore";

const searchSchema = z.object({
	searchQuery: z.string().min(1, "Search query cannot be empty"),
});

const SearchBarOnly = () => {
	const { searchQuery, setSearchQuery, location, setLocation, errors, setErrors, touched, setTouched, suggestions } = useSearchStore();
	const [loading, setLoading] = useState(false);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		const validationErrors = {};
		let isValid = true;

		try {
			searchSchema.parse({ searchQuery });
		} catch (err) {
			validationErrors.searchQuery = err.errors[0].message;
			isValid = false;
		}

		setErrors(validationErrors);
		setIsFormValid(isValid);
	}, [searchQuery]);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setSearchQuery(value);
		setTouched((prevTouched) => ({ ...prevTouched, searchQuery: true }));
		setAutocompleteOpen(true);
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
		<>
			<div className="px-4 align-middle">
				<div className="text-xs">Search in</div>
				<div className="text-sm font-bold whitespace-nowrap">San Fransisco, CA</div>
			</div>
			<form className="relative z-10 flex flex-col w-full h-full min-w-0 p-2 bg-white border border-gray-300 rounded-md dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-primary focus:border-primary dark:focus:border-primary dark:focus-within:border-primary" onSubmit={handleFormSubmit}>
				<div className="relative flex items-center justify-between w-full align-center">
					<div className="flex items-center justify-center flex-1">
						<div className="relative w-full">
							<input
								className={`!bg-transparent w-full min-h-[1.5rem] resize-none border-0 text-sm leading-relaxed shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] disabled:bg-transparent disabled:opacity-80 pl-1 ${!errors.searchQuery ? "" : "text-red-500 placeholder:text-red-500"}`}
								id="search-input"
								placeholder="Search for a business"
								rows="1"
								spellCheck="false"
								style={{ colorScheme: "dark", height: "23px" }}
								value={searchQuery}
								onChange={handleInputChange}
								autoComplete="off"
								onFocus={() => setAutocompleteOpen(true)}
							/>
							{errors.searchQuery && touched.searchQuery && <p className="text-sm text-red-500">{errors.searchQuery}</p>}
						</div>
					</div>
					<div className="relative flex items-center space-x-2">
						<Button size="icon" variant="outline" className={`${isFormValid ? "bg-primary !border-primary-dark" : ""} flex items-center justify-center h-6 gap-2 px-2 py-2 text-sm font-medium transition-colors rounded-md select-none ring-offset-background focus-visible:ring-offset-2 shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:px-3`} type="submit" disabled={!isFormValid || loading}>
							{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isFormValid ? <ArrowRight className="w-4 h-4" /> : <Search className="w-4 h-4" />}
						</Button>
					</div>
				</div>
			</form>
		</>
	);
};

export default SearchBarOnly;
