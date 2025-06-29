"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, MapPin, Mic, X, Clock, TrendingUp, Star, Shield, CheckCircle, ArrowRight, ChevronDown, MicOff, Plus, Image, FileText, Camera, Upload, Send } from "react-feather";
import { Bot, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent } from "@components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@components/ui/dropdown-menu";
import LocationDropdown from "@components/shared/searchBox/LocationDropdown";
import BusinessCard from "@components/shared/searchBox/BusinessCard";
import UnifiedAIChat from "@components/shared/ai/UnifiedAIChat";
import useSearchStore from "@store/useSearchStore";
import { algoliaIndex } from "@lib/algoliaClient";
import { useDragDrop } from "@/hooks/useDragDrop";
import ImageGrid from "./ImageGrid";

export default function HeroSection() {
	const { searchQuery, setSearchQuery, location, setLocation, recentSearches, popularSearches, addRecentSearch, loadRecentSearches } = useSearchStore();

	const [autocompleteOpen, setAutocompleteOpen] = useState(false);
	const [businessSuggestions, setBusinessSuggestions] = useState([]);
	const [aiMode, setAiMode] = useState(false);
	const [isListening, setIsListening] = useState(false);
	const [recognition, setRecognition] = useState(null);
	const [loading, setLoading] = useState(false);
	const searchRef = useRef(null);
	const inputRef = useRef(null);
	const fileInputRef = useRef(null);
	const aiChatRef = useRef(null);

	// Popular categories for quick access
	const popularCategories = [
		{ name: "Restaurants", icon: "🍽️", count: "12,450", query: "restaurants" },
		{ name: "Home Services", icon: "🏠", count: "8,230", query: "home services" },
		{ name: "Auto Repair", icon: "🚗", count: "3,450", query: "auto repair" },
		{ name: "Beauty & Spa", icon: "💅", count: "5,890", query: "beauty spa" },
		{ name: "Healthcare", icon: "🏥", count: "4,320", query: "healthcare" },
		{ name: "Shopping", icon: "🛍️", count: "6,780", query: "shopping" },
	];

	// Trust indicators
	const trustStats = [
		{ value: "50K+", label: "Verified Businesses", icon: Shield },
		{ value: "2.3M+", label: "Customer Reviews", icon: Star },
		{ value: "99.8%", label: "Satisfaction Rate", icon: CheckCircle },
	];

	// Initialize
	useEffect(() => {
		loadRecentSearches();
	}, [loadRecentSearches]);

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
				setSearchQuery(transcript);
				setIsListening(false);
				if (!aiMode) {
					setAutocompleteOpen(true);
					fetchBusinessSuggestions(transcript);
				}
			};

			rec.onerror = () => setIsListening(false);
			rec.onend = () => setIsListening(false);

			setRecognition(rec);
		}
	}, [setSearchQuery, aiMode]);

	// Click outside handler
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setAutocompleteOpen(false);
				if (aiMode) setAiMode(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [aiMode]);

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

		if (value.trim() && !aiMode) {
			setAutocompleteOpen(true);
			fetchBusinessSuggestions(value);
		} else if (!value.trim()) {
			setAutocompleteOpen(false);
			setBusinessSuggestions([]);
		}
	};

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

	// Toggle AI mode
	const toggleAiMode = (e) => {
		e.preventDefault();
		setAiMode(!aiMode);
		setAutocompleteOpen(!aiMode);
		setSearchQuery("");
		// Focus input after toggling without scrolling
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus({ preventScroll: true });
			}
		}, 50);
	};

	// Handle search submission
	const handleSearch = (e) => {
		e.preventDefault();

		if (aiMode && searchQuery.trim() && typeof window !== "undefined" && window.handleAIInput) {
			window.handleAIInput(searchQuery);
			setSearchQuery("");
			return;
		}

		if (searchQuery.trim()) {
			setLoading(true);
			addRecentSearch(searchQuery);
			const queryString = new URLSearchParams({
				q: searchQuery,
				location: location.value || "",
			}).toString();
			window.location.href = `/search?${queryString}`;
		}
	};

	// Handle suggestion selection
	const handleSuggestionSelect = (suggestion) => {
		const searchText = suggestion.text || suggestion.query || suggestion.name || suggestion;
		setSearchQuery(searchText);
		setAutocompleteOpen(false);
		addRecentSearch(searchText);

		const queryString = new URLSearchParams({
			q: searchText,
			location: location.value || "",
		}).toString();
		window.location.href = `/search?${queryString}`;
	};

	const handleFileUpload = (files) => {
		// Handle file upload for AI mode
		if (aiMode && aiChatRef.current) {
			// Pass files directly to the AI chat component
			aiChatRef.current.handleFileUpload(files);
		}
	};

	// Initialize drag and drop functionality
	const { isDraggingOver, dragHandlers } = useDragDrop(
		(files) => {
			// Auto-activate AI mode when files are dragged over
			if (!aiMode) {
				setAiMode(true);
				setAutocompleteOpen(true);
			}
			handleFileUpload(files);
		},
		["image/", "text/", "application/"]
	);

	// Auto-activate AI mode when dragging over (even before drop)
	useEffect(() => {
		if (isDraggingOver && !aiMode) {
			setAiMode(true);
			setAutocompleteOpen(true);
		}
	}, [isDraggingOver, aiMode]);

	const triggerFileUpload = () => {
		fileInputRef.current?.click();
	};

	const handleFileSelect = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			handleFileUpload(e.target.files);
		}
	};

	return (
		<section className="relative w-full bg-neutral-950 dark:bg-neutral-950 overflow-hidden">
			<ImageGrid />

			<div className="relative px-4 lg:px-24 py-16 lg:py-24">
				<div className="max-w-7xl mx-auto">
					{/* Hero Content */}
					<div className="text-center mb-10">
						{/* Badge */}
						<div className="inline-flex mb-6">
							<Badge variant="secondary" className="px-4 py-1.5 text-sm">
								<Sparkles className="w-3.5 h-3.5 mr-2" />
								50,000+ Verified Local Businesses
							</Badge>
						</div>

						{/* Main Headline */}
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
							Find the Best Local Businesses
							<span className="block text-primary">Near You</span>
						</h1>

						{/* Subheading */}
						<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Read real reviews, compare prices, and book services instantly</p>
					</div>

					{/* Search Bar */}
					<div className="relative max-w-3xl mx-auto mb-16" ref={searchRef}>
						<form
							className={`relative flex items-center w-full p-3 bg-neutral-900 dark:bg-neutral-900 border-2 rounded-2xl shadow-lg transition-all duration-200 ${aiMode ? "border-blue-400 dark:border-blue-400 bg-blue-950/30 dark:bg-blue-950/30" : "border-neutral-800 dark:border-neutral-800"} ${
								isDraggingOver ? "border-dashed border-blue-500 dark:border-blue-500 bg-blue-900/20 dark:bg-blue-900/20 shadow-blue-500/20 shadow-xl scale-105" : "focus-within:border-blue-500 dark:focus-within:border-blue-400"
							}`}
							onSubmit={handleSearch}
							{...dragHandlers}
						>
							{/* Drag overlay indicator */}
							{isDraggingOver && (
								<div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-2xl pointer-events-none z-10 flex items-center justify-center">
									<div className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
										<Upload className="w-5 h-5 mr-2 inline" />
										Drop files here
									</div>
								</div>
							)}

							{/* AI Mode Toggle */}
							<Button type="button" onClick={toggleAiMode} variant={aiMode ? "default" : "ghost"} size="sm" className={`mr-3 h-10 w-12 px-2 py-0 transition-all duration-200 ${aiMode ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"}`} title={aiMode ? "Exit AI Chat Mode" : "Enter AI Chat Mode"} onDragOver={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()}>
								<div className="flex items-center gap-1">
									<Bot className="w-4 h-4" />
									<span className="text-xs font-medium">AI</span>
								</div>
							</Button>

							{/* Plus Icon Dropdown - Only in AI Mode */}
							{aiMode && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-10 w-10 mr-3 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200" onDragOver={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()}>
											<Plus className="w-5 h-5" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-56">
										<DropdownMenuLabel>Upload Files</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={triggerFileUpload} className="flex items-center gap-3 py-2.5">
											<div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
												<Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-medium">Upload Files</span>
												<span className="text-xs text-muted-foreground">Images, documents, etc.</span>
											</div>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={triggerFileUpload} className="flex items-center gap-3 py-2.5">
											<div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
												<Image className="w-4 h-4 text-green-600 dark:text-green-400" />
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-medium">Upload Image</span>
												<span className="text-xs text-muted-foreground">Photos and graphics</span>
											</div>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="flex items-center gap-3 py-2.5">
											<div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
												<Camera className="w-4 h-4 text-purple-600 dark:text-purple-400" />
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-medium">Take Photo</span>
												<span className="text-xs text-muted-foreground">Use camera</span>
											</div>
										</DropdownMenuItem>
										<DropdownMenuItem className="flex items-center gap-3 py-2.5">
											<div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
												<FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-medium">Scan Document</span>
												<span className="text-xs text-muted-foreground">OCR scanning</span>
											</div>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}

							{!aiMode && <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" onDragOver={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()} />}

							<input
								ref={inputRef}
								type="text"
								value={searchQuery}
								onChange={handleInputChange}
								onFocus={() => setAutocompleteOpen(true)}
								placeholder={isDraggingOver ? "Drop files here..." : isListening ? "🎤 Listening... Say something!" : aiMode ? "Ask me anything about local businesses..." : "Search for restaurants, plumbers, doctors..."}
								className={`flex-1 bg-transparent text-lg outline-none border-0 shadow-none ring-0 text-foreground placeholder:text-muted-foreground min-h-[40px] py-2 ${isListening ? "animate-pulse" : ""}`}
								disabled={loading}
								onDragOver={(e) => e.preventDefault()}
								onDrop={(e) => e.preventDefault()}
							/>

							{/* Hidden file input */}
							<input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />

							{/* Clear button */}
							{searchQuery && (
								<button
									type="button"
									onClick={() => {
										setSearchQuery("");
										if (!aiMode) {
											setAutocompleteOpen(false);
										}
									}}
									className="mr-3 p-2 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors"
									aria-label="Clear search"
									onDragOver={(e) => e.preventDefault()}
									onDrop={(e) => e.preventDefault()}
								>
									<X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
								</button>
							)}

							{/* Voice search button */}
							{recognition && (
								<button
									type="button"
									onClick={handleVoiceSearch}
									className={`mr-3 p-2 rounded-full transition-all duration-200 ${isListening ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50" : "hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 text-gray-500 dark:text-gray-400"}`}
									aria-label={isListening ? "Stop voice search" : "Start voice search"}
									title={isListening ? "🎤 Recording... Click to stop" : "🎤 Click to search by voice"}
									onDragOver={(e) => e.preventDefault()}
									onDrop={(e) => e.preventDefault()}
								>
									{isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
								</button>
							)}

							{/* Location dropdown */}
							{!aiMode && (
								<div onDragOver={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()}>
									<LocationDropdown size="large" location={location} onLocationChange={setLocation} placeholder="Near" className="text-lg min-w-[140px]" />
								</div>
							)}

							{/* Submit button */}
							<Button type="submit" size="lg" className={`ml-3 px-6 py-2 h-10 rounded-xl transition-all duration-200 ${aiMode ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600" : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"}`} disabled={loading} onDragOver={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()}>
								{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : aiMode ? <Send className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
							</Button>
						</form>

						{/* Dropdown Results */}
						{autocompleteOpen && (
							<div className="absolute z-50 w-full max-w-3xl mt-2 bg-card border border-neutral-800 dark:border-neutral-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
								{aiMode ? (
									<UnifiedAIChat
										ref={aiChatRef}
										isOpen={true}
										onClose={() => {
											setAiMode(false);
											setAutocompleteOpen(false);
										}}
										mode="dropdown"
										style={{ maxHeight: "450px" }}
									/>
								) : (
									<div className="p-4 space-y-4 max-h-[450px] overflow-y-auto">
										{/* Business Suggestions */}
										{businessSuggestions.length > 0 && (
											<div>
												<h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Businesses</h4>
												<div className="space-y-1">
													{businessSuggestions.map((business, idx) => (
														<BusinessCard key={idx} business={business} onClick={() => handleSuggestionSelect(business)} className="hover:bg-muted/50 rounded-md transition-colors" />
													))}
												</div>
											</div>
										)}

										{/* Quick Categories */}
										{!searchQuery && (
											<div>
												<h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Quick Search</h4>
												<div className="grid grid-cols-3 gap-2">
													{popularCategories.slice(0, 6).map((cat, idx) => (
														<button key={idx} onClick={() => handleSuggestionSelect(cat.query)} className="flex items-center gap-2 p-2 text-sm hover:bg-muted rounded-md transition-colors text-left">
															<span className="text-lg">{cat.icon}</span>
															<span className="font-medium">{cat.name}</span>
														</button>
													))}
												</div>
											</div>
										)}

										{/* Recent Searches */}
										{recentSearches.length > 0 && (
											<div>
												<h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider flex items-center">
													<Clock className="w-3.5 h-3.5 mr-1.5" />
													Recent
												</h4>
												<div className="space-y-1">
													{recentSearches.slice(0, 3).map((search, idx) => (
														<button key={idx} onClick={() => handleSuggestionSelect(search)} className="w-full text-left p-2 text-sm hover:bg-muted rounded-md transition-colors flex items-center gap-2">
															<Clock className="w-3.5 h-3.5 text-muted-foreground" />
															{search}
														</button>
													))}
												</div>
											</div>
										)}

										{/* Trending Searches */}
										{popularSearches.length > 0 && (
											<div>
												<h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Trending</h4>
												<div className="flex flex-wrap gap-1.5">
													{popularSearches.slice(0, 6).map((search, idx) => (
														<Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs" onClick={() => handleSuggestionSelect(search)}>
															{search}
														</Badge>
													))}
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>

					{/* Popular Categories */}
					<div className="mb-12">
						<h2 className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">Browse by Category</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
							{popularCategories.map((category, idx) => (
								<Link key={idx} href={`/search?q=${encodeURIComponent(category.query)}`}>
									<Card className="group hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer h-full">
										<CardContent className="p-4 text-center">
											<div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</div>
											<h3 className="font-medium text-sm">{category.name}</h3>
											<p className="text-xs text-muted-foreground mt-1">{category.count} listings</p>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>

					{/* Trust Indicators */}
					<div className="flex justify-center items-center gap-6 md:gap-12">
						{trustStats.map((stat, idx) => {
							const Icon = stat.icon;
							return (
								<div key={idx} className="text-center group">
									<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2 group-hover:bg-primary/20 transition-colors">
										<Icon className="w-6 h-6 text-primary" />
									</div>
									<div className="text-xl md:text-2xl font-bold">{stat.value}</div>
									<div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
