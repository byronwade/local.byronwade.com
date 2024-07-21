// components/shared/searchBox/SearchContainer.js
"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MapContainer from "@/components/site/map/MapContainer";
import BusinessCard from "@/components/site/map/BusinessCard";
import BusinessInfoPanel from "@/components/site/map/BusinessInfoPanel";
import FullSearchBox from "@/components/shared/searchBox/FullSearchBox";
import { ChevronLeft } from "react-feather";
import { useSearchParams } from "next/navigation";
import useBusinessStore from "@/store/useBusinessStore";
import useSearchStore from "@/store/useSearchStore";

const SearchContainer = () => {
	const { businesses, onKeyDown, handleKeyDown, filteredBusinesses, activeMarker, hoveredBusiness, selectedServiceArea, fetchBusinesses, handleMarkerClick, handleSearchInArea } = useBusinessStore();

	const { zipCode, searchQuery, handleFilterChange, getCurrentLocation } = useSearchStore();

	const mapRef = useRef(null);
	const containerRef = useRef(null);
	const searchParams = useSearchParams();
	const initialSearchQuery = searchParams.get("query") || "";
	const initialZipCode = searchParams.get("zip") || "";

	useEffect(() => {
		fetchBusinesses(initialZipCode, initialSearchQuery, 50);
	}, [initialSearchQuery, initialZipCode]);

	useEffect(() => {
		if (zipCode !== initialZipCode || searchQuery !== initialSearchQuery) {
			handleFilterChange({
				searchQuery,
				zipCode,
				ratingFilters: {
					oneStar: false,
					twoStars: false,
					threeStars: false,
					fourStars: false,
					fiveStars: false,
				},
				openFilters: {
					openNow: false,
					open24Hours: false,
				},
				priceFilters: {
					oneDollar: false,
					twoDollars: false,
					threeDollars: false,
					fourDollars: false,
				},
				sortOption: "",
			});
		}
	}, [zipCode, searchQuery]);

	return (
		<div className="flex flex-col h-screen outline-none" onKeyDown={handleKeyDown} tabIndex={0} ref={containerRef}>
			<div className="flex flex-1 overflow-hidden">
				<div className="flex flex-col w-1/4 space-y-4 overflow-y-auto min-w-96">
					<header className="flex flex-row items-center px-4 pt-4">
						<Link href="/" className="flex flex-row items-end space-x-2">
							<ChevronLeft className="w-8 h-8 p-1 font-bold leading-none text-black bg-white rounded-full hover:bg-gray-300" />
							<span className="text-3xl font-extrabold leading-none lg:inline-block">Thorbis</span>
							<span className="leading-none text-md text-primary-500 lg:inline-block mb-[2px]">Business Directory</span>
						</Link>
					</header>
					<div className="w-full px-4 pt-4">
						<FullSearchBox initialSearchQuery={initialSearchQuery} initialZipCode={initialZipCode} onFilterChange={handleFilterChange} />
					</div>
					<div className="w-full">
						<div className="px-4 mb-4">
							<h1 className="text-xl font-bold">Top 10 Best Plumbing Companies</h1>
						</div>
						{filteredBusinesses.map((business) => (
							<BusinessCard key={business.id} businessId={business.id} isActive={activeMarker === business.id} />
						))}
					</div>
				</div>
				<div className="relative w-3/4">
					<MapContainer selectedServiceArea={selectedServiceArea} handleSearchInArea={handleSearchInArea} setMapRef={(ref) => (mapRef.current = ref)} flyToLocation={useBusinessStore.getState().flyToLocation} />
					{hoveredBusiness && <BusinessInfoPanel />}
				</div>
			</div>
		</div>
	);
};

export default SearchContainer;
