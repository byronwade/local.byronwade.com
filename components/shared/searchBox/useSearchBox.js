import { useState, useEffect } from "react";
import { z } from "zod";

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

export const useSearchBox = (initialSearchQuery = "", onFilterChange = () => {}) => {
	const [zipCode, setZipCode] = useState("95033");
	const [locationError, setLocationError] = useState(null);
	const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
	const [dropdownQuery, setDropdownQuery] = useState("");
	const [filteredLocations, setFilteredLocations] = useState(initialLocations);
	const [isValidZipCode, setIsValidZipCode] = useState(true);
	const [isValidSearchQuery, setIsValidSearchQuery] = useState(true);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [filterCount, setFilterCount] = useState(0);
	const [ratingFilters, setRatingFilters] = useState({ oneStar: false, twoStars: false, threeStars: false, fourStars: false, fiveStars: false });
	const [openFilters, setOpenFilters] = useState({ openNow: false, open24Hours: false });
	const [priceFilters, setPriceFilters] = useState({ oneDollar: false, twoDollars: false, threeDollars: false, fourDollars: false });
	const [sortOption, setSortOption] = useState("rating");
	const [isRatingModified, setIsRatingModified] = useState(false);
	const [isOpenModified, setIsOpenModified] = useState(false);
	const [isPriceModified, setIsPriceModified] = useState(false);
	const [isSortModified, setIsSortModified] = useState(false);
	const [isZipModified, setIsZipModified] = useState(false);

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

	useEffect(() => {
		if (initialSearchQuery) {
			setSearchQuery(initialSearchQuery);
		}
	}, [initialSearchQuery]);

	useEffect(() => {
		console.log("onFilterChange:", typeof onFilterChange); // Log the type of onFilterChange
		if (typeof onFilterChange === "function") {
			onFilterChange({
				searchQuery,
				zipCode,
				ratingFilters,
				openFilters,
				priceFilters,
				sortOption,
			});
		} else {
			console.error("onFilterChange is not a function");
		}
	}, [searchQuery, zipCode, ratingFilters, openFilters, priceFilters, sortOption, onFilterChange]);

	const getCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					try {
						const zip = await getZipCodeFromCoordinates(latitude, longitude);
						setZipCode(zip);
						setDropdownOpen(false);
					} catch (error) {
						setLocationError("Unable to retrieve zip code.");
						console.error("Error retrieving zip code:", error);
					}
				},
				(error) => {
					handleLocationError(error);
				}
			);
		} else {
			setLocationError("Geolocation is not supported by this browser.");
		}
	};

	const handleLocationError = (error) => {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				setLocationError("User denied the request for Geolocation.");
				break;
			case error.POSITION_UNAVAILABLE:
				setLocationError("Location information is unavailable.");
				break;
			case error.TIMEOUT:
				setLocationError("The request to get user location timed out.");
				break;
			case error.UNKNOWN_ERROR:
				setLocationError("An unknown error occurred.");
				break;
			default:
				setLocationError("An unknown error occurred.");
				break;
		}
		console.error("Error retrieving location:", error);
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
		setIsZipModified(true);
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

		if (isFormValid && typeof onFilterChange === "function") {
			onFilterChange({
				searchQuery,
				zipCode,
				ratingFilters,
				openFilters,
				priceFilters,
				sortOption,
			});
		} else {
			console.error("onFilterChange is not a function");
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
			setIsRatingModified(true);
		} else if (category === "open") {
			setOpenFilters((prev) => ({ ...prev, [filter]: value }));
			setIsOpenModified(true);
		} else if (category === "price") {
			setPriceFilters((prev) => ({ ...prev, [filter]: value }));
			setIsPriceModified(true);
		}
	};

	const handleSortChange = (value) => {
		setSortOption(value);
		setIsSortModified(true);
	};

	const handleResetFilters = (category, e) => {
		e.stopPropagation();
		if (category === "rating") {
			const resetRatingFilters = {
				oneStar: false,
				twoStars: false,
				threeStars: false,
				fourStars: false,
				fiveStars: false,
			};
			setRatingFilters(resetRatingFilters);
			setIsRatingModified(false);
		} else if (category === "open") {
			const resetOpenFilters = {
				openNow: false,
				open24Hours: false,
			};
			setOpenFilters(resetOpenFilters);
			setIsOpenModified(false);
		} else if (category === "price") {
			const resetPriceFilters = {
				oneDollar: false,
				twoDollars: false,
				threeDollars: false,
				fourDollars: false,
			};
			setPriceFilters(resetPriceFilters);
			setIsPriceModified(false);
		} else if (category === "sort") {
			setSortOption("rating");
			setIsSortModified(false);
		} else if (category === "zip") {
			setZipCode("95033");
			setIsZipModified(false);
		} else if (category === "filters") {
			const resetRatingFilters = {
				oneStar: false,
				twoStars: false,
				threeStars: false,
				fourStars: false,
				fiveStars: false,
			};
			const resetOpenFilters = {
				openNow: false,
				open24Hours: false,
			};
			const resetPriceFilters = {
				oneDollar: false,
				twoDollars: false,
				threeDollars: false,
				fourDollars: false,
			};
			setRatingFilters(resetRatingFilters);
			setOpenFilters(resetOpenFilters);
			setPriceFilters(resetPriceFilters);
			setIsRatingModified(false);
			setIsOpenModified(false);
			setIsPriceModified(false);
		} else if (category === "all") {
			const resetRatingFilters = {
				oneStar: false,
				twoStars: false,
				threeStars: false,
				fourStars: false,
				fiveStars: false,
			};
			const resetOpenFilters = {
				openNow: false,
				open24Hours: false,
			};
			const resetPriceFilters = {
				oneDollar: false,
				twoDollars: false,
				threeDollars: false,
				fourDollars: false,
			};
			setRatingFilters(resetRatingFilters);
			setOpenFilters(resetOpenFilters);
			setPriceFilters(resetPriceFilters);
			setSortOption("rating");
			setZipCode("95033");
			setIsRatingModified(false);
			setIsOpenModified(false);
			setIsPriceModified(false);
			setIsSortModified(false);
			setIsZipModified(false);
		}
	};

	const handleTextareaInput = (event) => {
		const textarea = event.target;
		textarea.style.height = "auto";
		textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
	};

	return {
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
	};
};
