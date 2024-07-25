"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocationDropdown from "@components/shared/searchBox/LocationDropdown";
import AiButton from "@components/shared/searchBox/AiButton";
import { ArrowRight, Search } from "react-feather";
import { Button } from "@components/ui/button";
import { TooltipProvider } from "@components/ui/tooltip";
import AutocompleteSuggestions from "@components/shared/searchBox/AutocompleteSuggestions";
import { Loader2 } from "lucide-react";

const SearchBarOnly = () => {
	const [suggestions, setSuggestions] = useState([
		{ text: "Find business information", icon: "Search", color: "rgb(226, 197, 65)" },
		{ text: "Create a business content calendar", icon: "Calendar", color: "rgb(203, 139, 208)" },
		{ text: "Organize business documents", icon: "Clipboard", color: "rgb(203, 139, 208)" },
		{ text: "Write a business proposal", icon: "Book", color: "rgb(226, 197, 65)" },
	]);

	useEffect(() => {}, []);

	const handleInputChange = (e) => {};

	const handleDropdownSearchChangeTouched = (e) => {
		setZipTouched(true);
	};

	const handleSuggestionSelect = () => {};

	const handleFormSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<TooltipProvider>
			<div className="z-10 flex flex-col w-full bg-gray-900 border rounded-md shadow-lg divide-zinc-600 shadow-black/40">
				<form className="relative z-10 w-full h-full min-w-0 p-3 bg-gray-900" onSubmit={handleFormSubmit}>
					<div className="relative flex items-center justify-between w-full align-center">
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
						<div className="relative flex items-center space-x-2">
							{showLocationButton && <LocationDropdown />}
							{showAiButton && <AiButton handleTextareaInput={handleTextareaInput} showBeta={false} />}
							<Button
								size="icon"
								className={`${
									searchQuery ? "bg-brand" : "bg-gray-800"
								} flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors rounded-md select-none ring-offset-background focus-visible:ring-offset-2 shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3`}
								type="submit"
								disabled={!isValidZipCode || !isValidSearchQuery || loading}
							>
								{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : searchQuery ? <ArrowRight className="w-4 h-4" /> : <Search className="w-4 h-4" />}
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

export default SearchBarOnly;
