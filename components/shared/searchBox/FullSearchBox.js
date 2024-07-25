import React, { useState, useEffect } from "react";
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

const FullSearchBox = () => {
	const [suggestions, setSuggestions] = useState([
		{ text: "Find business information", icon: "Search", color: "rgb(226, 197, 65)" },
		{ text: "Create a business content calendar", icon: "Calendar", color: "rgb(203, 139, 208)" },
		{ text: "Organize business documents", icon: "Clipboard", color: "rgb(203, 139, 208)" },
		{ text: "Write a business proposal", icon: "Book", color: "rgb(226, 197, 65)" },
	]);
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);
	const loading = true;
	const locationError = false;
	const searchQuery = true;
	return (
		<TooltipProvider>
			<div className="z-10 flex flex-col w-full bg-gray-900 border rounded-md shadow-lg divide-zinc-600 shadow-black/40">
				<div className="relative z-10 w-full h-full min-w-0 p-3 bg-gray-900">
					<div className="relative flex flex-col items-center flex-1 w-full transition-all duration-300">
						<div className="relative flex items-center justify-between w-full pb-2 mb-2 border-b align-center">
							<div className="flex items-center justify-center flex-1">
								<div className="relative w-full">
									<input className={`bg-transparent w-full min-h-[1.5rem] resize-none border-0 text-sm leading-relaxed shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black disabled:bg-transparent disabled:opacity-80 pl-1 text-white placeholder:text-zinc-400`} id="search-input" placeholder="Search for a business" rows="1" spellCheck="false" style={{ colorScheme: "dark", height: "23px" }} autoComplete="off" />
								</div>
							</div>
							<div className="relative flex items-center ml-2 space-x-1">
								<Button
									size="icon"
									className={`${
										searchQuery ? "bg-brand" : "bg-gray-800"
									} flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors rounded-md select-none ring-offset-background focus-visible:ring-offset-2 shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3`}
									type="submit"
									disabled={loading}
								>
									{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : searchQuery ? <ArrowRight className="w-4 h-4" /> : <Search className="w-4 h-4" />}
								</Button>
							</div>
						</div>
						<AnimatePresence>
							{autocompleteOpen && suggestions.length > 0 && (
								<motion.div initial={{ maxHeight: 0, opacity: 0 }} animate={{ maxHeight: "24rem", opacity: 1 }} exit={{ maxHeight: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full pb-2 mb-2 overflow-hidden border-b">
									<AutocompleteSuggestions suggestions={suggestions} />
								</motion.div>
							)}
						</AnimatePresence>
						<div className="flex justify-between w-full md:items-end">
							<div className="flex flex-row flex-wrap flex-1 gap-1 sm:gap-2">
								<FilterDropdown />
								<SortDropdown />
								<LocationDropdown />
								<AiButton showBeta={true} />
							</div>
						</div>
						{locationError && <p className="text-sm text-red-500">{locationError}</p>}
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
};

export default FullSearchBox;
