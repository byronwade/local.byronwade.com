"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Target, X, Sparkles, Filter, SortAsc, ArrowLeft, Home } from "lucide-react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import useBusinessStore from "@store/useBusinessStore";
import useSearchStore from "@store/useSearchStore";
import Link from "next/link";

export default function CompactSearchBox({ onAIClick, onFilterClick, onSortClick, isAIActive = false }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const searchInputRef = useRef(null);
	const locationInputRef = useRef(null);

	const [query, setQuery] = useState(searchParams.get("q") || "");
	const [location, setLocation] = useState(searchParams.get("location") || "");
	const [isDetectingLocation, setIsDetectingLocation] = useState(false);

	const { setSearchQuery, setLocation: setStoreLocation } = useSearchStore();
	const { searchBusinesses, filteredBusinesses } = useBusinessStore();

	// Handle search
	const handleSearch = (searchQuery = query, searchLocation = location) => {
		if (!searchQuery.trim()) return;

		// Update stores
		setSearchQuery(searchQuery);
		setStoreLocation(searchLocation);
		searchBusinesses(searchQuery, searchLocation);

		// Update URL
		const params = new URLSearchParams();
		if (searchQuery) params.set("q", searchQuery);
		if (searchLocation) params.set("location", searchLocation);

		router.push(`/search?${params.toString()}`);
	};

	// Handle location detection
	const handleLocationDetect = async () => {
		setIsDetectingLocation(true);
		try {
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, {
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 300000,
				});
			});

			const { latitude, longitude } = position.coords;

			// Reverse geocode to get address
			try {
				const response = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);
				const data = await response.json();

				if (data.address) {
					setLocation(data.address);
				} else {
					setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
				}
			} catch (error) {
				setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
			}
		} catch (error) {
			console.error("Location detection failed:", error);
		} finally {
			setIsDetectingLocation(false);
		}
	};

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Enter" && (e.target === searchInputRef.current || e.target === locationInputRef.current)) {
				handleSearch();
			}
			if (e.key === "/" && !e.target.matches("input, textarea")) {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [query, location]);

	return (
		<div className="w-full bg-background border-b border-border shadow-sm flex-shrink-0 relative z-30">
			{/* Main Search Bar */}
			<div className="flex items-center gap-3 p-3">
				{/* Navigation & Logo */}
				<div className="flex items-center gap-3 mr-2">
					<Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
						<ArrowLeft className="w-4 h-4" />
						<span className="text-sm font-medium">Back</span>
					</Link>
					<div className="h-6 w-px bg-border" />
					<Link href="/" className="flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<Home className="w-4 h-4 text-white" />
						</div>
						<span className="text-lg font-bold text-foreground">Local Directory</span>
					</Link>
				</div>
				{/* Search Input */}
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input ref={searchInputRef} type="text" placeholder="Search businesses..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="pl-10 pr-8 h-10 text-sm border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg bg-background text-foreground placeholder:text-muted-foreground" />
					{query && (
						<Button variant="ghost" size="sm" onClick={() => setQuery("")} className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-accent text-muted-foreground hover:text-foreground">
							<X className="w-3 h-3" />
						</Button>
					)}
				</div>

				{/* Location Input */}
				<div className="relative flex-1 max-w-xs">
					<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input ref={locationInputRef} type="text" placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="pl-10 pr-8 h-10 text-sm border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg bg-background text-foreground placeholder:text-muted-foreground" />
					<Button variant="ghost" size="sm" onClick={handleLocationDetect} disabled={isDetectingLocation} className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-accent text-muted-foreground hover:text-foreground" title="Use current location">
						<Target className={`w-3 h-3 ${isDetectingLocation ? "animate-pulse" : ""}`} />
					</Button>
				</div>

				{/* Search Button */}
				<Button onClick={() => handleSearch()} size="sm" className="h-10 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200" disabled={!query.trim()}>
					<Search className="w-4 h-4 mr-2" />
					Search
				</Button>

				{/* Divider */}
				<div className="h-6 w-px bg-border" />

				{/* Action Buttons */}
				<div className="flex items-center gap-2">
					{/* AI Assistant Button */}
					<Button variant={isAIActive ? "default" : "outline"} size="sm" onClick={onAIClick} className={`h-10 px-3 rounded-lg transition-all duration-200 ${isAIActive ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600" : "border-border text-foreground hover:bg-accent hover:border-primary/50"}`}>
						<Sparkles className="w-4 h-4 mr-1" />
						AI
					</Button>

					{/* Filter Button */}
					<Button variant="outline" size="sm" onClick={onFilterClick} className="h-10 px-3 rounded-lg border-border text-foreground hover:bg-accent hover:border-primary/50">
						<Filter className="w-4 h-4 mr-1" />
						Filters
					</Button>

					{/* Sort Button */}
					<Button variant="outline" size="sm" onClick={onSortClick} className="h-10 px-3 rounded-lg border-border text-foreground hover:bg-accent hover:border-primary/50">
						<SortAsc className="w-4 h-4 mr-1" />
						Sort
					</Button>
				</div>
			</div>
		</div>
	);
}
