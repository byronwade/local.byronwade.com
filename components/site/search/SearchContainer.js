"use client";
import React, { useState, useEffect, useRef } from "react";
import MapContainer from "@/components/site/search/MapContainer";
import BusinessCard from "@/components/site/search/BusinessCard";
import BusinessInfoPanel from "@/components/site/search/BusinessInfoPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as turf from "@turf/turf"; // Import Turf.js for GeoJSON manipulation
import Link from "next/link";
import { FullSearchBox } from "@/components/shared/searchBox/SearchBox";
import { ChevronLeft } from "react-feather";

const SearchContainer = () => {
	const [businesses, setBusinesses] = useState([
		{
			id: 1,
			name: "Practically Perfect Day Spa & Salon",
			categories: ["Day Spas", "Massage", "Hair Salons"],
			price: "$$",
			deal: "$50 for $65 Deal",
			description: "She truly has a love for what she does and a talent for skincare and helping to make the world and...",
			logo: "/placeholder.svg", // replace with actual logo URL
			isOpenNow: true,
			reviewsCount: 44,
			statusMessage: "Closed until 10:00 AM tomorrow",
			isSponsored: true,
			address: "123 Market St, San Francisco, CA",
			phone: "(123) 456-7890",
			rating: 4.5,
			image: "/placeholder.svg",
			images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
			serviceArea: {
				type: "radius",
				value: 10, // Radius in miles
			},
			reviews: [
				{
					reviewerName: "John Doe",
					date: "2023-01-01",
					text: "Amazing service, very friendly staff!",
					rating: 5,
				},
				{
					reviewerName: "Jane Smith",
					date: "2023-01-15",
					text: "Had a great experience, highly recommended.",
					rating: 4,
				},
			],
			hours: [
				{ day: "Monday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Tuesday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Wednesday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Thursday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Friday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Saturday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Sunday", open: "Closed", close: "Closed" },
			],
			plusCode: "73G4+M5 San Francisco, California",
		},
		{
			id: 2,
			name: "Business 2",
			categories: ["Day Spas", "Massage", "Hair Salons"],
			price: "$",
			deal: "10% off",
			description: "Another business description goes here, highlighting unique aspects and offers.",
			logo: "/placeholder.svg", // replace with actual logo URL
			isOpenNow: false,
			reviewsCount: 30,
			statusMessage: "Open until 6:00 PM",
			isSponsored: false,
			address: "2059 Fulton St, San Francisco, CA 94117",
			phone: "(987) 654-3210",
			rating: 4.0,
			image: "/placeholder.svg",
			images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
			serviceArea: {
				type: "radius",
				value: 15, // Radius in miles
			},
			reviews: [
				{
					reviewerName: "John Doe",
					date: "2023-01-01",
					text: "Amazing service, very friendly staff!",
					rating: 5,
				},
				{
					reviewerName: "Jane Smith",
					date: "2023-01-15",
					text: "Had a great experience, highly recommended.",
					rating: 4,
				},
			],
			hours: [
				{ day: "Monday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Tuesday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Wednesday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Thursday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Friday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Saturday", open: "10:00 AM", close: "6:00 PM" },
				{ day: "Sunday", open: "Closed", close: "Closed" },
			],
			plusCode: "73G4+M5 San Francisco, California",
		},
	]);

	const [coordinates, setCoordinates] = useState({});
	const [activeMarker, setActiveMarker] = useState(null);
	const [hoveredBusiness, setHoveredBusiness] = useState(null);
	const [selectedServiceArea, setSelectedServiceArea] = useState(null);
	const mapRef = useRef(null);
	const containerRef = useRef(null); // Add reference to the container

	useEffect(() => {
		// Fetch coordinates for all businesses
		const fetchCoordinates = async () => {
			const newCoordinates = {};
			for (const business of businesses) {
				try {
					const coords = await getCoordinatesFromAddress(business.address);
					newCoordinates[business.id] = coords;
					console.log(`Coordinates for ${business.address}: `, coords); // Log each coordinate pair
				} catch (error) {
					console.error(`Error fetching coordinates for ${business.name}:`, error);
				}
			}
			setCoordinates(newCoordinates);
			console.log("All fetched coordinates: ", newCoordinates); // Log all coordinates
		};

		fetchCoordinates();
	}, [businesses]);

	useEffect(() => {
		// Automatically select the first business when the component mounts
		if (businesses.length > 0) {
			handleMarkerClick(businesses[0]);
		}
	}, [coordinates]); // Ensure coordinates are fetched before selecting the first business

	const handleMarkerClick = (business) => {
		const coords = coordinates[business.id];
		if (!coords) {
			console.error(`No coordinates found for ${business.name}`);
			return;
		}
		setActiveMarker(business.id);
		setHoveredBusiness(business);
		document.getElementById(`business-${business.id}`).scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
		flyToLocation(coords.lat, coords.lng, business.serviceArea.value);
		const serviceArea = convertServiceAreaToGeoJSON(coords.lat, coords.lng, business.serviceArea.value);
		setSelectedServiceArea(serviceArea);
	};

	const handleKeyDown = (event) => {
		if (!hoveredBusiness) return;

		const currentIndex = businesses.findIndex((b) => b.id === hoveredBusiness.id);

		if (event.key === "ArrowDown" && currentIndex < businesses.length - 1) {
			handleMarkerClick(businesses[currentIndex + 1]);
		} else if (event.key === "ArrowUp" && currentIndex > 0) {
			handleMarkerClick(businesses[currentIndex - 1]);
		}
	};

	const handleNavigate = (index) => {
		if (index >= 0 && index < businesses.length) {
			handleMarkerClick(businesses[index]);
			containerRef.current.focus(); // Set focus back to the container
		}
	};

	const handleClosePanel = () => {
		setHoveredBusiness(null);
		setActiveMarker(null);
		setSelectedServiceArea(null);
	};

	const handleSearchInArea = () => {
		// Your logic to search in the current map area
		console.log("Search in this area");
	};

	const flyToLocation = (lat, lng, radius) => {
		if (mapRef.current) {
			const circle = turf.circle([lng, lat], radius, { units: "miles" });
			const bounds = turf.bbox(circle);
			mapRef.current.fitBounds(bounds, {
				padding: { top: 50, bottom: 50, left: 50, right: 50 },
				essential: true,
				speed: 2,
				curve: 1,
			});
		}
	};

	const convertServiceAreaToGeoJSON = (lat, lng, radius) => {
		const center = turf.point([lng, lat]);
		const options = { steps: 64, units: "miles" };
		return turf.circle(center, radius, options);
	};

	const getCoordinatesFromAddress = async (address) => {
		const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`);
		const data = await response.json();
		if (data.features && data.features.length > 0) {
			const { center } = data.features[0];
			return {
				lng: center[0],
				lat: center[1],
			};
		}
		throw new Error("No coordinates found for address");
	};

	return (
		<div className="flex flex-col h-screen outline-none" onKeyDown={handleKeyDown} tabIndex={0} ref={containerRef}>
			<div className="flex flex-1 overflow-hidden">
				<div className="flex flex-col w-1/4 space-y-4 overflow-y-auto min-w-96">
					<header className="flex flex-row items-center px-4 pt-4">
						<Link href="/">
							<ChevronLeft className="w-8 h-8 p-1 font-bold leading-none text-black bg-white rounded-full hover:bg-gray-300" />
						</Link>
						<Link href="/" className="flex items-end ml-4 space-x-2 lg:mr-6">
							<span className="text-3xl font-extrabold leading-none lg:inline-block">Thorbis</span>
							<span className="leading-none text-md text-primary-500 lg:inline-block mb-[2px]">Business Directory</span>
						</Link>
					</header>
					<div className="w-full px-4 pt-4">
						<FullSearchBox />
					</div>
					<div className="w-full">
						<div className="px-4 mb-4">
							<h1 className="text-xl font-bold">Top 10 Best Plumbing Companies</h1>
						</div>
						<ScrollArea className="flex-1 px-4">
							{businesses.map((business) => (
								<BusinessCard key={business.id} business={business} onClick={() => handleMarkerClick(business)} isActive={activeMarker === business.id} />
							))}
						</ScrollArea>
					</div>
				</div>
				<div className="relative w-3/4">
					<MapContainer businesses={businesses} coordinates={coordinates} activeMarker={activeMarker} handleMarkerClick={handleMarkerClick} selectedServiceArea={selectedServiceArea} handleSearchInArea={handleSearchInArea} setMapRef={(ref) => (mapRef.current = ref)} flyToLocation={flyToLocation} />
					{hoveredBusiness && <BusinessInfoPanel business={hoveredBusiness} businessIndex={businesses.findIndex((b) => b.id === hoveredBusiness.id)} businesses={businesses} onClose={handleClosePanel} onNavigate={handleNavigate} />}
				</div>
			</div>
		</div>
	);
};

export default SearchContainer;
