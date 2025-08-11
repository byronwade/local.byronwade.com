"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Mic, MicOff, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchStore } from "@store/search";
import { isSpeechRecognitionSupported, createSpeechRecognition } from "@lib/utils/speechRecognition";

/**
 * Unified Search Bar Component - Hydration Safe
 * Combines all search functionality with proper SSR handling
 */
const SearchBarUnified = ({
	onSearch,
	placeholder = "Search for businesses, services, or locations...",
	className = "",
	showVoiceSearch = true,
	showAiMode = false,
	autoFocus = false,
	variant = "simple", // "simple" | "advanced"
}) => {
	// State management
	const [query, setQuery] = useState("");
	const [isListening, setIsListening] = useState(false);
	const [speechRecognition, setSpeechRecognition] = useState(null);
	const [voiceError, setVoiceError] = useState(null);
	const [isClient, setIsClient] = useState(false);
	const [aiMode, setAiMode] = useState(false);
	const inputRef = useRef(null);

	// Store integration for advanced variant
	const searchStore = useSearchStore();

	// Client-side hydration guard
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Speech recognition support check (client-side only)
	const supportFlag = isClient && isSpeechRecognitionSupported;

	// Initialize speech recognition
	useEffect(() => {
		if (!isClient || !supportFlag || !showVoiceSearch) return;

		try {
			const recognition = createSpeechRecognition({
				continuous: false,
				interimResults: false,
				lang: "en-US",
			});

			recognition.setCallbacks({
				onStart: () => {
					setIsListening(true);
					setVoiceError(null);
				},
				onResult: (result) => {
					if (result.isFinal && result.transcript) {
						const transcript = result.transcript.trim();

						if (variant === "advanced" && searchStore) {
							searchStore.setSearchQuery(transcript);
						} else {
							setQuery(transcript);
						}

						setIsListening(false);

						// Automatically trigger search with voice input
						if (onSearch && transcript) {
							onSearch(transcript);
						}
					}
				},
				onError: (error) => {
					console.error("Speech recognition error:", error);
					setIsListening(false);
					setVoiceError(error.message);
				},
				onEnd: () => {
					setIsListening(false);
				},
			});

			setSpeechRecognition(recognition);
		} catch (error) {
			console.error("Failed to initialize speech recognition:", error);
			setVoiceError("Failed to initialize voice search");
		}

		// Cleanup on unmount
		return () => {
			if (speechRecognition) {
				speechRecognition.destroy();
			}
		};
	}, [isClient, supportFlag, showVoiceSearch, onSearch, variant, searchStore]);

	// Get current query value based on variant
	const currentQuery = variant === "advanced" && searchStore ? searchStore.searchQuery : query;

	// Handle query changes
	const handleQueryChange = (value) => {
		if (variant === "advanced" && searchStore) {
			searchStore.setSearchQuery(value);
		} else {
			setQuery(value);
		}
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		const searchQuery = currentQuery.trim();

		if (!searchQuery) return;

		if (onSearch) {
			onSearch(searchQuery);
		} else if (variant === "advanced" && searchStore) {
			// Use store's navigation logic
			const queryString = new URLSearchParams({
				query: searchQuery,
				location: searchStore.location.value || "",
			}).toString();
			window.location.href = `/search?${queryString}`;
		}
	};

	// Handle voice search
	const handleVoiceSearch = async () => {
		if (!isClient || !supportFlag || !speechRecognition) {
			setVoiceError("Speech recognition is not supported in your browser. Please try using Chrome or Edge.");
			return;
		}

		if (isListening) {
			speechRecognition.stop();
		} else {
			try {
				setVoiceError(null);
				await speechRecognition.start();
			} catch (error) {
				console.error("Error starting speech recognition:", error);
				setVoiceError("Unable to start voice search. Please check your microphone permissions.");
			}
		}
	};

	// Handle clear search
	const clearSearch = () => {
		handleQueryChange("");
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	// Toggle AI mode
	const toggleAiMode = () => {
		setAiMode(!aiMode);
	};

	// Render simple variant
	if (variant === "simple") {
		return (
			<div className={`relative w-full max-w-2xl mx-auto ${className}`}>
				<form onSubmit={handleSubmit} className="relative">
					<div className="relative flex items-center">
						{/* Search Icon */}
						<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
							<Search className="h-5 w-5" />
						</div>

						{/* Search Input */}
						<input
							ref={inputRef}
							type="text"
							value={currentQuery}
							onChange={(e) => handleQueryChange(e.target.value)}
							placeholder={placeholder}
							autoFocus={autoFocus}
							className="w-full pl-10 pr-20 py-3 text-base border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                       bg-white shadow-sm transition-all duration-200
                       placeholder-gray-500 text-gray-900"
							aria-label="Search"
						/>

						{/* Action Buttons Container */}
						<div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
							{/* Clear Button */}
							{currentQuery && (
								<button type="button" onClick={clearSearch} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Clear search">
									<X className="h-4 w-4" />
								</button>
							)}

							{/* AI Mode Button */}
							{showAiMode && isClient && (
								<button type="button" onClick={toggleAiMode} className={`p-1.5 rounded transition-all duration-200 ${aiMode ? "text-purple-600 bg-purple-50 hover:bg-purple-100" : "text-gray-400 hover:text-purple-600 hover:bg-purple-50"}`} aria-label="Toggle AI mode">
									<Sparkles className="h-4 w-4" />
								</button>
							)}

							{/* Voice Search Button */}
							{showVoiceSearch && isClient && supportFlag && (
								<button type="button" onClick={handleVoiceSearch} disabled={!supportFlag} className={`p-1.5 rounded transition-all duration-200 ${isListening ? "text-red-600 bg-red-50 hover:bg-red-100" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"} disabled:opacity-50 disabled:cursor-not-allowed`} aria-label={isListening ? "Stop voice search" : "Start voice search"}>
									{isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
								</button>
							)}

							{/* Search Button */}
							<button
								type="submit"
								disabled={!currentQuery.trim()}
								className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200 text-sm font-medium"
								aria-label="Search"
							>
								Search
							</button>
						</div>
					</div>
				</form>

				{/* Voice Search Indicator */}
				{isClient && isListening && (
					<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
						<div className="flex items-center justify-center space-x-2">
							<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
							<span className="text-red-700 text-sm font-medium">Listening... Speak now</span>
						</div>
					</motion.div>
				)}

				{/* Error Messages */}
				{isClient && voiceError && (
					<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-800 text-sm">{voiceError}</p>
					</motion.div>
				)}

				{/* Browser Compatibility Notice */}
				{isClient && showVoiceSearch && !supportFlag && !voiceError && (
					<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
						<p className="text-yellow-800 text-sm">Voice search is not supported in your browser. For the best experience, please use Chrome or Edge.</p>
					</motion.div>
				)}
			</div>
		);
	}

	// Advanced variant would go here
	// For now, fallback to simple variant
	return <SearchBarUnified {...{ onSearch, placeholder, className, showVoiceSearch, showAiMode, autoFocus }} variant="simple" />;
};

export default SearchBarUnified;

// Export aliases for backwards compatibility
export { SearchBarUnified as SearchBarOnly };
export { SearchBarUnified as SearchBarHeader };
