"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import LocationDropdown from "@components/shared/searchBox/LocationDropdown";
import { ArrowRight, ChevronDown, Search, X, Clock, Mic, MicOff, Send, User } from "react-feather";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import BusinessCard from "@components/shared/searchBox/BusinessCard";
import { Loader2, Bot, Sparkles } from "lucide-react";
import { z } from "zod";
import useSearchStore from "@store/useSearchStore";
import useBusinessStore from "@store/useBusinessStore";
import { algoliaIndex } from "@lib/algoliaClient";
import UnifiedAIChat from "@components/shared/ai/UnifiedAIChat";

const searchSchema = z.object({
	searchQuery: z.string().min(1, "Search query cannot be empty"),
});

const SearchBarOnly = () => {
	const { searchQuery, setSearchQuery, location, setLocation, errors, setErrors, touched, setTouched, suggestions, recentSearches, popularSearches, addRecentSearch, loadRecentSearches, fetchSearchSuggestions, activeDropdown, setActiveDropdown } = useSearchStore();
	const { initializeWithMockData } = useBusinessStore();
	const [loading, setLoading] = useState(false);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);
	const [isListening, setIsListening] = useState(false);
	const [recognition, setRecognition] = useState(null);
	const [businessSuggestions, setBusinessSuggestions] = useState([]);
	const [aiMode, setAiMode] = useState(false);

	const dropdownRef = useRef(null);

	// Initialize mock data and load recent searches on component mount
	useEffect(() => {
		initializeWithMockData();
		loadRecentSearches();
	}, [initializeWithMockData, loadRecentSearches]);

	// Initialize speech recognition
	useEffect(() => {
		if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			const rec = new SpeechRecognition();
			rec.continuous = false;
			rec.interimResults = false;
			rec.lang = "en-US";

			rec.onresult = (event) => {
				const transcript = event.results[0][0].transcript;
				console.log("Speech recognition result:", transcript);
				setSearchQuery(transcript);
				setIsListening(false);
				if (!aiMode) {
					setAutocompleteOpen(true);
					if (transcript.trim()) {
						fetchSearchSuggestions(transcript);
					}
				}
			};

			rec.onerror = () => {
				setIsListening(false);
			};

			rec.onend = () => {
				setIsListening(false);
			};

			setRecognition(rec);
		}
	}, [setSearchQuery, fetchSearchSuggestions, aiMode]);

	// Voice search handler
	const handleVoiceSearch = () => {
		if (!recognition) return;

		if (isListening) {
			recognition.stop();
			setIsListening(false);
		} else {
			recognition.start();
			setIsListening(true);
		}
	};

	// AI Mode Functions
	const toggleAiMode = useCallback(() => {
		setAiMode(!aiMode);
		setAutocompleteOpen(!aiMode); // Open when entering AI mode
		setActiveDropdown(!aiMode ? "ai" : null);
		setSearchQuery("");
	}, [aiMode, setActiveDropdown, setSearchQuery]);

	// Click outside handler
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setAutocompleteOpen(false);
				setActiveDropdown(null);
				if (aiMode) {
					setAiMode(false);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [activeDropdown, setActiveDropdown, aiMode]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleGlobalKeyDown = (e) => {
			// Cmd/Ctrl + Shift + A to toggle AI mode
			if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "A") {
				e.preventDefault();
				toggleAiMode();
			}
			// Escape to close dropdowns
			if (e.key === "Escape") {
				setAutocompleteOpen(false);
				setActiveDropdown(null);
				if (aiMode) {
					setAiMode(false);
				}
			}
		};

		document.addEventListener("keydown", handleGlobalKeyDown);
		return () => document.removeEventListener("keydown", handleGlobalKeyDown);
	}, [aiMode, setActiveDropdown, toggleAiMode]);

	// Fetch business suggestions from Algolia
	const fetchBusinessSuggestions = async (query) => {
		if (!query.trim()) return;
		try {
			const { hits } = await algoliaIndex.search(query, { hitsPerPage: 5 });
			setBusinessSuggestions(hits);
		} catch (error) {
			console.error("Error fetching business suggestions:", error);
		}
	};

	// Handle input changes
	const handleInputChange = (e) => {
		const value = e.target.value;
		setSearchQuery(value);
		setTouched({ ...touched, searchQuery: true });

		const isValid = value.trim().length > 0;
		console.log("Input changed", { value, isValid, aiMode });

		if (isValid) {
			setIsFormValid(true);
			setErrors({});
			if (!aiMode) {
				setAutocompleteOpen(true);
				fetchSearchSuggestions(value);
				fetchBusinessSuggestions(value);
			}
		} else {
			setIsFormValid(false);
			setAutocompleteOpen(false);
		}
	};

	// Handle location changes
	const handleLocationChange = (location) => {
		setLocation(location);
	};

	// Handle location errors
	const updateLocationError = (error) => {
		setErrors({ ...errors, location: error });
	};

	// Handle suggestion selection
	const handleSuggestionSelect = (suggestion) => {
		const searchText = suggestion.text || suggestion.query || suggestion;
		setSearchQuery(searchText);
		setAutocompleteOpen(false);
		setActiveDropdown(null);
		addRecentSearch(searchText);
		// Update form validity when suggestion is selected
		if (searchText.trim()) {
			setIsFormValid(true);
			setErrors({});
		}
	};

	// Handle form submission
	const handleFormSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted", { searchQuery, isFormValid, aiMode, loading });

		if (aiMode) {
			// Handle AI mode submission
			if (searchQuery.trim() && typeof window !== "undefined" && window.handleAIInput) {
				window.handleAIInput(searchQuery);
				setSearchQuery(""); // Clear the search bar after sending to AI
			}
			return;
		}

		// Check if form is valid before proceeding
		if (!searchQuery.trim()) {
			console.log("Search query is empty, not submitting");
			setErrors({ searchQuery: "Search query cannot be empty" });
			return;
		}

		try {
			const validatedData = searchSchema.parse({ searchQuery });
			setLoading(true);
			setErrors({});

			// Add to recent searches
			addRecentSearch(validatedData.searchQuery);

			// Navigate to search results
			const queryString = new URLSearchParams({
				q: validatedData.searchQuery,
				location: location.value || "",
			}).toString();

			console.log("Navigating to search page:", `/search?${queryString}`);

			// Navigate to search page
			window.location.href = `/search?${queryString}`;
		} catch (error) {
			console.error("Form submission error:", error);
			if (error instanceof z.ZodError) {
				const fieldErrors = {};
				error.errors.forEach((err) => {
					fieldErrors[err.path[0]] = err.message;
				});
				setErrors(fieldErrors);
			}
			setLoading(false);
		}
	};

	return (
		<div className="relative w-full" ref={dropdownRef}>
			<form className={`relative z-10 flex flex-col w-full h-full min-w-0 p-2 ml-6 border rounded-lg shadow-sm transition-all duration-200 ${aiMode ? "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950/20 dark:to-blue-950/20 dark:border-purple-700/50" : "bg-background border-border"} focus-within:border-primary`} onSubmit={handleFormSubmit}>
				<div className="relative flex items-center justify-between w-full">
					<div className="flex items-center justify-center flex-1">
						<div className="relative w-full flex items-center">
							{/* AI Mode Toggle Button */}
							<Button type="button" onClick={toggleAiMode} variant={aiMode ? "default" : "ghost"} size="sm" className={`mr-2 h-6 w-8 px-1 py-0 transition-all duration-200 ${aiMode ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg" : "hover:bg-accent hover:text-accent-foreground"}`} title={aiMode ? "Exit AI Chat Mode (Cmd+Shift+A)" : "Enter AI Chat Mode (Cmd+Shift+A)"}>
								<div className="flex items-center gap-0.5">
									<Bot className="w-3 h-3" />
									<span className="text-[8px] font-medium leading-none">AI</span>
								</div>
							</Button>

							{!aiMode && <Search className="w-4 h-4 text-muted-foreground mr-2" />}

							<input
								className={`!bg-transparent w-full min-h-[1.5rem] resize-none !border-0 text-sm leading-relaxed shadow-none !outline-none !ring-0 disabled:bg-transparent disabled:opacity-80 text-foreground placeholder:text-muted-foreground ${!errors.searchQuery ? "" : "text-destructive placeholder:text-destructive"} ${isListening ? "animate-pulse" : ""}`}
								id="search-input"
								placeholder={isListening ? "🎤 Listening... Say something!" : aiMode ? "Ask me anything about local businesses..." : "Find restaurants, services, and more..."}
								style={{ height: "20px" }}
								value={searchQuery}
								onChange={handleInputChange}
								autoComplete="off"
								onFocus={() => {
									setAutocompleteOpen(true);
									setActiveDropdown(aiMode ? "ai" : "search");
								}}
								disabled={loading}
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => {
										setSearchQuery("");
										if (!aiMode) {
											setAutocompleteOpen(false);
										}
									}}
									className="ml-1 p-1 rounded-full hover:bg-muted transition-colors"
									aria-label="Clear search"
								>
									<X className="w-3 h-3 text-muted-foreground" />
								</button>
							)}
							{recognition && (
								<button type="button" onClick={handleVoiceSearch} className={`ml-1 p-1.5 rounded-full transition-all duration-200 ${isListening ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50" : "hover:bg-blue-500/20 hover:text-blue-600 text-muted-foreground"}`} aria-label={isListening ? "Stop voice search" : "Start voice search"} title={isListening ? "🎤 Recording... Click to stop" : "🎤 Click to search by voice"}>
									{isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
								</button>
							)}
							{errors.searchQuery && touched.searchQuery && <p className="absolute top-full left-0 mt-1 text-xs text-destructive">{errors.searchQuery}</p>}
						</div>
					</div>
					<div className="relative flex items-center space-x-2 ml-2">
						<div className="h-4 w-px bg-border/50" />
						{!aiMode && <LocationDropdown location={location} onLocationChange={handleLocationChange} onError={updateLocationError} placeholder="Near" className="text-sm h-6" />}
						<Button
							size="icon"
							variant={aiMode ? "default" : isFormValid ? "default" : "ghost"}
							className={`${aiMode ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 border-purple-500" : isFormValid ? "bg-primary border-primary text-primary-foreground hover:bg-primary/90 shadow-sm" : "border-border text-muted-foreground hover:bg-muted"} h-6 w-6 transition-all duration-200 pointer-events-auto cursor-pointer`}
							type="submit"
							disabled={(!isFormValid && !aiMode) || loading}
							title={aiMode ? "Send message" : "Search"}
							onClick={(e) => {
								// Ensure the click event propagates properly
								if ((!isFormValid && !aiMode) || loading) {
									e.preventDefault();
									return;
								}
								console.log("Submit button clicked", { isFormValid, aiMode, searchQuery });
							}}
						>
							{loading ? <Loader2 className="w-3 h-3 animate-spin" /> : aiMode ? <Send className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
						</Button>
					</div>
				</div>

				{/* AI Chat Dropdown */}
				{aiMode && autocompleteOpen && (
					<div className="absolute top-full left-0 right-0 mt-2 z-50">
						<UnifiedAIChat
							isOpen={true}
							onClose={() => {
								setAiMode(false);
								setAutocompleteOpen(false);
								setActiveDropdown(null);
							}}
							mode="dropdown"
							style={{
								maxHeight: "500px",
							}}
						/>
					</div>
				)}

				{/* Regular Search Dropdown */}
				{!aiMode && autocompleteOpen && (
					<div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden max-h-96">
						<div className="p-4 space-y-4">
							{/* Search Suggestions */}
							{suggestions.length > 0 && (
								<div>
									<h4 className="text-sm font-medium text-foreground mb-2">Suggestions</h4>
									<div className="space-y-1">
										{suggestions.slice(0, 5).map((suggestion, index) => (
											<button key={index} type="button" onClick={() => handleSuggestionSelect(suggestion)} className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors flex items-center gap-2">
												<Search className="w-4 h-4 text-muted-foreground" />
												{suggestion.text || suggestion}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Business Suggestions */}
							{businessSuggestions.length > 0 && (
								<div>
									<h4 className="text-sm font-medium text-foreground mb-2">Businesses</h4>
									<div className="space-y-2">
										{businessSuggestions.map((business, index) => (
											<BusinessCard key={index} business={business} onClick={() => handleSuggestionSelect(business.name)} />
										))}
									</div>
								</div>
							)}

							{/* Recent Searches */}
							{recentSearches.length > 0 && (
								<div>
									<h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
										<Clock className="w-4 h-4" />
										Recent Searches
									</h4>
									<div className="space-y-1">
										{recentSearches.slice(0, 3).map((search, index) => (
											<button key={index} type="button" onClick={() => handleSuggestionSelect(search)} className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors flex items-center gap-2">
												<Clock className="w-4 h-4 text-muted-foreground" />
												{search}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Popular Searches */}
							{popularSearches.length > 0 && (
								<div>
									<h4 className="text-sm font-medium text-foreground mb-2">Popular Searches</h4>
									<div className="flex flex-wrap gap-2">
										{popularSearches.slice(0, 6).map((search, index) => (
											<Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleSuggestionSelect(search)}>
												{search}
											</Badge>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</form>
		</div>
	);
};

export default SearchBarOnly;
