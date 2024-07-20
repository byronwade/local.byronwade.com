"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { stateAbbreviations } from "@/lib/utils/stateAbbreviations";
import { Skeleton } from "@/components/ui/skeleton";

const searchSuggestions = [
	{
		category: "Plumber",
		businesses: ["Plumbing Pro", "Quick Fix Plumbing", "Water Works"],
	},
	{
		category: "Electrician",
		businesses: ["Spark Solutions", "Volt Masters", "Bright Future Electric"],
	},
	{
		category: "Roofer",
		businesses: ["Roof Top Services", "Sky High Roofing", "Top Roofers"],
	},
	{
		category: "Painter",
		businesses: ["Color My World", "Perfect Paint", "Masterpiece Painters"],
	},
	{
		category: "General Contractor",
		businesses: ["Build It Right", "Construction Experts", "Dream Builders"],
	},
];

export default function SearchBar() {
	const [location, setLocation] = useState("");
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [userLocation, setUserLocation] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Fetch user's location
		if (navigator.geolocation) {
			setLoading(true);
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					// Use Nominatim Geocoding API to get the city and state
					fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`)
						.then((response) => response.json())
						.then((data) => {
							if (data && data.address) {
								const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.county;
								const state = data.address.state;
								const stateAbbr = stateAbbreviations[state] || state;
								setUserLocation(`${city}, ${stateAbbr}`);
							}
							setLoading(false);
						})
						.catch((error) => {
							console.error("Error fetching location:", error);
							setLoading(false);
						});
				},
				() => {
					console.error("Location access denied.");
					setLoading(false);
				}
			);
		}
	}, []);

	useEffect(() => {
		// Set the location input to the user's location
		if (userLocation) {
			setLocation(userLocation);
		}
	}, [userLocation]);

	const handleQueryChange = (event) => {
		const value = event.target.value;
		setQuery(value);
		if (value) {
			const filteredSuggestions = searchSuggestions.flatMap((suggestion) => {
				const categoryMatch = suggestion.category.toLowerCase().includes(value.toLowerCase());
				const businessMatches = suggestion.businesses.filter((business) => business.toLowerCase().includes(value.toLowerCase()));
				return categoryMatch || businessMatches.length
					? [
							{
								category: suggestion.category,
								businesses: businessMatches,
							},
					  ]
					: [];
			});
			setSuggestions(filteredSuggestions);
		} else {
			setSuggestions([]);
		}
	};

	const handleSuggestionClick = (suggestion) => {
		setQuery(suggestion.category);
		setSuggestions([]);
	};

	if (loading) {
		return (
			<div className="flex items-center max-w-2xl mx-auto">
				<Skeleton className="flex-1 h-10 bg-gray-800 animate-pulse rounded-l-md" />
				<Skeleton className="flex-1 h-10 bg-gray-800 border-l animate-pulse" />
				<Skeleton className="w-20 h-10 bg-gray-800 animate-pulse rounded-r-md" />
			</div>
		);
	}

	return (
		<div className="flex items-center max-w-2xl p-4 mx-auto text-black bg-white rounded-md">
			<div className="relative flex-1">
				<Input
					type="text"
					value={query}
					onChange={handleQueryChange}
					placeholder="Search"
					className="pl-4 pr-16 text-black bg-white border-r-0 rounded-r-none rounded-l-md"
					onKeyDown={(e) => {
						if (e.key === "ArrowDown" && suggestions.length > 0) {
							document.getElementById("suggestion-0").focus();
						}
					}}
				/>
				{suggestions.length > 0 && (
					<div className="absolute z-10 w-full mt-2 text-black bg-white rounded-md shadow-lg">
						{suggestions.map((suggestion, index) => (
							<div key={index} className="group">
								<div
									id={`suggestion-${index}`}
									tabIndex={0}
									onClick={() => handleSuggestionClick(suggestion.category)}
									className="px-4 py-2 cursor-pointer hover:bg-gray-100"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleSuggestionClick(suggestion.category);
										} else if (e.key === "ArrowDown" && index < suggestions.length - 1) {
											document.getElementById(`suggestion-${index + 1}`).focus();
										} else if (e.key === "ArrowUp" && index > 0) {
											document.getElementById(`suggestion-${index - 1}`).focus();
										}
									}}
								>
									{suggestion.category}
								</div>
								{suggestion.businesses.slice(0, 3).map((business, businessIndex) => (
									<div key={businessIndex} className="px-4 py-2 pl-8 cursor-pointer hover:bg-gray-100">
										{business}
									</div>
								))}
							</div>
						))}
					</div>
				)}
			</div>
			<div className="relative flex-1 border-l">
				<Input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="text-black bg-white border-l-0 rounded-none" />
			</div>
			<Button type="submit" className="px-4 rounded-l-none bg-primary text-primary-foreground rounded-r-md">
				Go
			</Button>
		</div>
	);
}
