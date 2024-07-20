"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Search } from "react-feather";
import { AdjustmentsHorizontalIcon, FunnelIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Bird, Book, Bot, Code2, CornerDownLeft, LifeBuoy, Mic, Paperclip, Rabbit, Settings, Settings2, Share, SquareTerminal, SquareUser, Triangle, Turtle } from "lucide-react";

const initialLocations = [
	{ name: "New York, NY", zip: "10001" },
	{ name: "Los Angeles, CA", zip: "90001" },
	{ name: "Chicago, IL", zip: "60601" },
	{ name: "Houston, TX", zip: "77001" },
	{ name: "Phoenix, AZ", zip: "85001" },
	{ name: "Philadelphia, PA", zip: "19101" },
	{ name: "San Antonio, TX", zip: "78201" },
	{ name: "San Diego, CA", zip: "92101" },
	{ name: "Dallas, TX", zip: "75201" },
	{ name: "San Jose, CA", zip: "95101" },
];

const zipCodeSchema = z.string().regex(/^\d{5}$/, "Invalid zip code format");
const searchQuerySchema = z.string().min(1, "Search query cannot be empty");

export default function SearchBox() {
	const [zipCode, setZipCode] = useState("95033");
	const [locationError, setLocationError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [dropdownQuery, setDropdownQuery] = useState("");
	const [filteredLocations, setFilteredLocations] = useState(initialLocations);
	const [isValidZipCode, setIsValidZipCode] = useState(true);
	const [isValidSearchQuery, setIsValidSearchQuery] = useState(true);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [filterCount, setFilterCount] = useState(0);
	const [ratingFilters, setRatingFilters] = useState({
		oneStar: false,
		twoStars: false,
		threeStars: false,
		fourStars: false,
		fiveStars: false,
	});
	const [openFilters, setOpenFilters] = useState({
		openNow: false,
		open24Hours: false,
	});
	const [priceFilters, setPriceFilters] = useState({
		oneDollar: false,
		twoDollars: false,
		threeDollars: false,
		fourDollars: false,
	});
	const [sortOption, setSortOption] = useState("rating");

	useEffect(() => {
		getCurrentLocation();
	}, []);

	useEffect(() => {
		const countFilters = () => {
			const ratingCount = Object.values(ratingFilters).filter(Boolean).length;
			const openCount = Object.values(openFilters).filter(Boolean).length;
			const priceCount = Object.values(priceFilters).filter(Boolean).length;
			setFilterCount(ratingCount + openCount + priceCount);
		};
		countFilters();
	}, [ratingFilters, openFilters, priceFilters]);

	const getCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					try {
						const zip = await getZipCodeFromCoordinates(latitude, longitude);
						setZipCode(zip);
						setDropdownOpen(false); // Close the dropdown on successful location retrieval
					} catch (error) {
						setLocationError("Unable to retrieve zip code.");
						console.error("Error retrieving zip code:", error);
					}
				},
				(error) => {
					setLocationError("Unable to retrieve location.");
					console.error("Error retrieving location:", error);
				}
			);
		} else {
			setLocationError("Geolocation is not supported by this browser.");
		}
	};

	const getZipCodeFromCoordinates = async (latitude, longitude) => {
		const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
		const data = await response.json();
		const zipFeature = data.features.find((feature) => feature.place_type.includes("postcode"));
		return zipFeature ? zipFeature.text : "Unknown";
	};

	const fetchLocations = async (query) => {
		const response = await fetch(`https://api.zippopotam.us/us/${query}`);
		if (!response.ok) {
			setFilteredLocations([]);
			return;
		}
		const data = await response.json();
		const locations = data.places.map((place) => ({
			name: `${place["place name"]}, ${place["state abbreviation"]}`,
			zip: data["post code"],
		}));
		setFilteredLocations(locations);
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	const handleDropdownSearchChange = (e) => {
		const query = e.target.value;
		setDropdownQuery(query);
		if (query.length >= 3) {
			fetchLocations(query);
		} else {
			setFilteredLocations([]);
		}
	};

	const handleLocationSelect = (zip) => {
		setZipCode(zip);
		setDropdownQuery(zip);
		setDropdownOpen(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let isFormValid = true;

		try {
			searchQuerySchema.parse(searchQuery);
			setIsValidSearchQuery(true);
		} catch (error) {
			setIsValidSearchQuery(false);
			isFormValid = false;
		}

		try {
			zipCodeSchema.parse(zipCode);
			setIsValidZipCode(true);
		} catch (error) {
			setIsValidZipCode(false);
			isFormValid = false;
		}

		if (isFormValid) {
			const searchParams = {
				searchQuery,
				zipCode,
				ratingFilters,
				openFilters,
				priceFilters,
				sortOption,
			};
			console.log("Search Params:", searchParams);
			setDropdownOpen(false); // Close the dropdown on successful validation
		}
	};

	const handleDropdownKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSubmit(e);
		}
	};

	const handleFilterChange = (category, filter, value) => {
		if (category === "rating") {
			setRatingFilters((prev) => ({ ...prev, [filter]: value }));
		} else if (category === "open") {
			setOpenFilters((prev) => ({ ...prev, [filter]: value }));
		} else if (category === "price") {
			setPriceFilters((prev) => ({ ...prev, [filter]: value }));
		}
	};

	const handleSortChange = (value) => {
		setSortOption(value);
	};

	const getFilterCount = (filters) => {
		return Object.values(filters).filter(Boolean).length;
	};

	const handleTextareaInput = (event) => {
		const textarea = event.target;
		textarea.style.height = "auto"; // Reset the height
		textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`; // Set height based on scrollHeight
	};

	return (
		<TooltipProvider>
			<div className="z-10 flex flex-col w-full overflow-hidden bg-gray-900 border rounded-md shadow-lg divide-zinc-600 shadow-black/40">
				<form className="relative z-10 w-full h-full min-w-0 p-3 bg-gray-900" onSubmit={handleSubmit}>
					<div className="absolute right-3.5 top-2.5 z-10 p-1 opacity-50 transition-opacity hover:opacity-80" data-state="closed">
						<Search className="w-4 h-4" />
					</div>
					<div className="relative flex flex-col items-center flex-1 w-full gap-4 transition-all duration-300">
						<div className="relative flex self-start justify-between flex-1 w-full min-w-0 pb-2 border-b">
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
								onChange={handleSearchChange}
							/>
						</div>
						<div className="flex justify-between w-full gap-2">
							<div className="flex flex-1 gap-1 sm:gap-2">
								{/* Filter Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button className="flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3" type="button">
											<FunnelIcon className="w-4 h-4" />
											<span className="hidden sm:block">Filters {filterCount > 0 && `(${filterCount})`}</span>
											<ChevronDown className="w-4 h-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="mt-2 bg-black rounded-md shadow-lg w-80">
										<DropdownMenuGroup>
											{/* Ratings Filter */}
											<DropdownMenuItem asChild>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<DropdownMenuItem className="flex items-center justify-between w-full text-white bg-transparent border-none">
															Ratings {getFilterCount(ratingFilters) > 0 && `(${getFilterCount(ratingFilters)})`}
															<ChevronRight className="w-4 h-4" />
														</DropdownMenuItem>
													</DropdownMenuTrigger>
													<DropdownMenuContent className="ml-6 bg-black rounded-md shadow-lg w-80">
														<DropdownMenuGroup>
															<DropdownMenuCheckboxItem checked={ratingFilters.oneStar} onCheckedChange={(value) => handleFilterChange("rating", "oneStar", value)}>
																1 Star & Above
															</DropdownMenuCheckboxItem>
															<DropdownMenuCheckboxItem checked={ratingFilters.twoStars} onCheckedChange={(value) => handleFilterChange("rating", "twoStars", value)}>
																2 Stars & Above
															</DropdownMenuCheckboxItem>
															<DropdownMenuCheckboxItem checked={ratingFilters.threeStars} onCheckedChange={(value) => handleFilterChange("rating", "threeStars", value)}>
																3 Stars & Above
															</DropdownMenuCheckboxItem>
															<DropdownMenuCheckboxItem checked={ratingFilters.fourStars} onCheckedChange={(value) => handleFilterChange("rating", "fourStars", value)}>
																4 Stars & Above
															</DropdownMenuCheckboxItem>
															<DropdownMenuCheckboxItem checked={ratingFilters.fiveStars} onCheckedChange={(value) => handleFilterChange("rating", "fiveStars", value)}>
																5 Stars
															</DropdownMenuCheckboxItem>
														</DropdownMenuGroup>
													</DropdownMenuContent>
												</DropdownMenu>
											</DropdownMenuItem>
											{/* Hours Open Filter */}
											<DropdownMenuItem asChild>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<DropdownMenuItem className="flex items-center justify-between w-full text-white bg-transparent border-none">
															Hours Open {getFilterCount(openFilters) > 0 && `(${getFilterCount(openFilters)})`}
															<ChevronRight className="w-4 h-4" />
														</DropdownMenuItem>
													</DropdownMenuTrigger>
													<DropdownMenuContent className="ml-6 bg-black rounded-md shadow-lg w-80">
														<DropdownMenuGroup>
															<DropdownMenuCheckboxItem checked={openFilters.openNow} onCheckedChange={(value) => handleFilterChange("open", "openNow", value)}>
																Open Now
															</DropdownMenuCheckboxItem>
															<DropdownMenuCheckboxItem checked={openFilters.open24Hours} onCheckedChange={(value) => handleFilterChange("open", "open24Hours", value)}>
																Open 24/7
															</DropdownMenuCheckboxItem>
														</DropdownMenuGroup>
													</DropdownMenuContent>
												</DropdownMenu>
											</DropdownMenuItem>
											{/* Price Filter */}
											<DropdownMenuItem asChild>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<DropdownMenuItem className="flex items-center justify-between w-full text-white bg-transparent border-none">
															Price {getFilterCount(priceFilters) > 0 && `(${getFilterCount(priceFilters)})`}
															<ChevronRight className="w-4 h-4" />
														</DropdownMenuItem>
													</DropdownMenuTrigger>
													<DropdownMenuContent className="ml-6 bg-black rounded-md shadow-lg w-80">
														<DropdownMenuGroup>
															<DropdownMenuCheckboxItem checked={priceFilters.oneDollar} onCheckedChange={(value) => handleFilterChange("price", "oneDollar", value)}>
																$
															</DropdownMenuCheckboxItem>
															<DropdownMenuCheckboxItem checked={priceFilters.twoDollars} onCheckedChange={(value) => handleFilterChange("price", "twoDollars", value)}>
																$$
															</DropdownMenuCheckboxItem>
															<DropdownMenuCheckboxItem checked={priceFilters.threeDollars} onCheckedChange={(value) => handleFilterChange("price", "threeDollars", value)}>
																$$$
															</DropdownMenuCheckboxItem>
															<DropdownMenuCheckboxItem checked={priceFilters.fourDollars} onCheckedChange={(value) => handleFilterChange("price", "fourDollars", value)}>
																$$$$
															</DropdownMenuCheckboxItem>
														</DropdownMenuGroup>
													</DropdownMenuContent>
												</DropdownMenu>
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
								{/* Sort Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button className="flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:w-24 sm:px-3" id="sort-toggle" type="button">
											<AdjustmentsHorizontalIcon className="w-4 h-4" />
											<div className="hidden sm:block">Sort</div>
											<ChevronDown className="w-4 h-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-56 mt-2 bg-black rounded-md shadow-lg">
										<DropdownMenuLabel>Sort By</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuRadioGroup value={sortOption} onValueChange={handleSortChange}>
											<DropdownMenuRadioItem value="rating">Rating</DropdownMenuRadioItem>
											<DropdownMenuRadioItem value="priceLowToHigh">Price: Low to High</DropdownMenuRadioItem>
											<DropdownMenuRadioItem value="priceHighToLow">Price: High to Low</DropdownMenuRadioItem>
											<DropdownMenuRadioItem value="openNow">Open Now</DropdownMenuRadioItem>
										</DropdownMenuRadioGroup>
									</DropdownMenuContent>
								</DropdownMenu>
								{/* Location Dropdown */}
								<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
									<DropdownMenuTrigger asChild>
										<Button className="flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3" type="button">
											<Crosshair2Icon className="w-4 h-4" />
											<span className="hidden sm:block">{zipCode}</span>
											<ChevronDown className="w-4 h-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="mt-2 bg-black rounded-md w-80">
										<div className="flex items-center px-2 py-1">
											<Search className="w-4 h-4 mr-2 text-gray-400" />
											<Input placeholder="Search by zip code..." value={dropdownQuery} onChange={handleDropdownSearchChange} onKeyDown={handleDropdownKeyDown} className={`w-full h-6 p-0 text-white bg-transparent border-none placeholder:text-zinc-400 ${isValidZipCode ? "text-white" : "text-red-500 placeholder:text-red-500"}`} />

											<Button
												size="icon"
												className="flex items-center justify-center h-8 gap-2 px-2 py-2 ml-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3"
												type="button"
												onClick={getCurrentLocation}
											>
												<Crosshair2Icon className="w-4 h-4" />
											</Button>
										</div>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											{filteredLocations.length > 0 ? (
												filteredLocations.map((location) => (
													<DropdownMenuItem key={location.zip} onClick={() => handleLocationSelect(location.zip)}>
														<span>{location.name}</span>
														<span className="ml-auto text-gray-400">{location.zip}</span>
													</DropdownMenuItem>
												))
											) : (
												<DropdownMenuItem disabled>
													<span>No data found</span>
												</DropdownMenuItem>
											)}
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
								{/* Sparkles Button */}
								<Sheet>
									<SheetTrigger asChild>
										<Button className="relative flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3" type="button">
											<Badge variant="outline" className="absolute z-50 bg-purple-700 -top-2 -right-4 p-0 px-[4px] text-[9px]">
												Beta
											</Badge>
											<SparklesIcon className="w-4 h-4" />
										</Button>
									</SheetTrigger>
									<SheetContent side="left" className="w-1/4 min-w-96 bg-black !max-w-full h-full flex flex-col">
										<SheetHeader>
											<SheetTitle>Utalize AI</SheetTitle>
											<SheetDescription>Use AI to help you find a business...</SheetDescription>
										</SheetHeader>
										<div className="relative flex flex-col flex-1 w-full p-4 rounded-xl bg-muted/50 lg:col-span-2">
											<Badge variant="outline" className="absolute right-3 top-3">
												Output
											</Badge>
											<div className="flex-1" />
											<form className="relative overflow-hidden border rounded-lg bg-background focus-within:ring-1 focus-within:ring-ring" x-chunk="dashboard-03-chunk-1">
												<Label htmlFor="message" className="sr-only">
													Message
												</Label>
												<Textarea id="message" placeholder="Type your message here..." className="p-3 border-0 shadow-none resize-none min-h-12 max-h-48 focus-visible:ring-0" onInput={handleTextareaInput} />
												<div className="flex items-center p-3 pt-0">
													<Tooltip>
														<TooltipTrigger asChild>
															<Button variant="ghost" size="icon">
																<Paperclip className="size-4" />
																<span className="sr-only">Attach file</span>
															</Button>
														</TooltipTrigger>
														<TooltipContent side="top">Attach File</TooltipContent>
													</Tooltip>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button variant="ghost" size="icon">
																<Mic className="size-4" />
																<span className="sr-only">Use Microphone</span>
															</Button>
														</TooltipTrigger>
														<TooltipContent side="top">Use Microphone</TooltipContent>
													</Tooltip>
													<Button type="submit" size="sm" className="ml-auto gap-1.5">
														Send Message
														<CornerDownLeft className="size-3.5" />
													</Button>
												</div>
											</form>
										</div>
									</SheetContent>
								</Sheet>
							</div>
							{/* Search Button */}
							<div>
								<Button variant="brand" className="flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:px-3" type="submit">
									<span className="hidden sm:block">Search</span>
								</Button>
							</div>
						</div>
						{/* Location Error */}
						{locationError && <p className="text-sm text-red-500">{locationError}</p>}
					</div>
				</form>
			</div>
		</TooltipProvider>
	);
}
