import React, { useRef, useEffect, useCallback, useState, Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "react-feather";
import MapContainer from "@components/site/map/MapContainer";
import BusinessCard from "@components/site/map/BusinessCard";
import BusinessInfoPanel from "@components/site/map/BusinessInfoPanel";
import FullSearchBox from "@components/shared/searchBox/FullSearchBox";
import { useSearchParams } from "next/navigation";
import useBusinessStore from "@store/useBusinessStore";
import useSearchStore from "@store/useSearchStore";
import SkeletonBusinessCard from "@components/site/map/SkeletonBusinessCard";
import axios from "axios";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const SearchContainer = () => {
	const { filteredBusinesses, activeMarker, hoveredBusiness, selectedServiceArea, fetchBusinessesByBoundingBox, handleMarkerClick, setMapRef, loading, setLoading, filterAndSortBusinesses, setBusinesses, flyToLocation } = useBusinessStore();
	const { zipCode, searchQuery, handleFilterChange, setZipCode, setSearchQuery } = useSearchStore();

	const containerRef = useRef(null);
	const searchParams = useSearchParams();
	const initialSearchQuery = searchParams.get("query") || "";
	const initialZipCode = searchParams.get("zip") || "";
	const [businessesLoaded, setBusinessesLoaded] = useState(false);

	const fetchCoordinatesForZipCode = async (zip) => {
		const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${zip}.json?access_token=${MAPBOX_TOKEN}`);
		const [longitude, latitude] = response.data.features[0].center;
		return { latitude, longitude };
	};

	const initialLoad = async (mapRef) => {
		setLoading(true);
		const coordinates = await fetchCoordinatesForZipCode(initialZipCode);
		if (coordinates) {
			const { latitude, longitude } = coordinates;
			if (mapRef) {
				mapRef.jumpTo({ center: [longitude, latitude], zoom: 10 });
				const bounds = mapRef.getBounds();
				const southWest = bounds.getSouthWest();
				const northEast = bounds.getNorthEast();
				await fetchBusinessesByBoundingBox(southWest.lat, southWest.lng, northEast.lat, northEast.lng);
				filterAndSortBusinesses(initialSearchQuery); // Apply the search query immediately after fetching
			}
		}
		setLoading(false);
		setBusinessesLoaded(true);
	};

	useEffect(() => {
		const mapRef = useBusinessStore.getState().mapRef;
		if (initialZipCode && mapRef) {
			setSearchQuery(initialSearchQuery);
			setZipCode(initialZipCode);
			initialLoad(mapRef);
		}
	}, [initialSearchQuery, initialZipCode, setSearchQuery, setZipCode]);

	const handleKeyDown = useCallback(
		(event) => {
			if (!Array.isArray(filteredBusinesses) || filteredBusinesses.length === 0) return;

			let currentIndex = filteredBusinesses.findIndex((b) => b.id === hoveredBusiness?.id);

			if (event.key === "ArrowDown") {
				if (currentIndex < filteredBusinesses.length - 1) {
					handleMarkerClick(filteredBusinesses[currentIndex + 1]);
				}
			} else if (event.key === "ArrowUp") {
				if (currentIndex > 0) {
					handleMarkerClick(filteredBusinesses[currentIndex - 1]);
				}
			}
		},
		[filteredBusinesses, hoveredBusiness, handleMarkerClick]
	);

	useEffect(() => {
		const handleKeyDownEvent = (event) => handleKeyDown(event);
		document.addEventListener("keydown", handleKeyDownEvent);
		return () => document.removeEventListener("keydown", handleKeyDownEvent);
	}, [handleKeyDown]);

	const handleZipCodeSearch = async (zip) => {
		setLoading(true);
		const coordinates = await fetchCoordinatesForZipCode(zip);
		const mapRef = useBusinessStore.getState().mapRef;
		if (coordinates && mapRef) {
			const { latitude, longitude } = coordinates;
			flyToLocation(latitude, longitude, 10, true); // Prefetch businesses and fly to the location
			setZipCode(zip);
			setSearchQuery(searchQuery);
		}
		setLoading(false);
	};

	return (
		<div className="flex flex-col h-screen outline-none" tabIndex={0} ref={containerRef}>
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
						<Suspense fallback={<div>Loading search box...</div>}>
							<FullSearchBox initialSearchQuery={initialSearchQuery} initialZipCode={initialZipCode} onFilterChange={handleFilterChange} onZipCodeSearch={handleZipCodeSearch} />
						</Suspense>
					</div>
					<div className="w-full">
						{loading ? (
							Array.from({ length: 4 }).map((_, index) => <SkeletonBusinessCard key={index} />)
						) : (
							<>
								{Array.isArray(filteredBusinesses) && filteredBusinesses.length > 0
									? filteredBusinesses.map((business) => (
											<Suspense key={business.id} fallback={<SkeletonBusinessCard />}>
												<BusinessCard key={business.id} businessId={business.id} isActive={activeMarker === business.id} />
											</Suspense>
									  ))
									: businessesLoaded && (
											<div className="flex flex-col self-center py-4 text-center text-muted-foreground">
												<p className="text-md">No businesses found</p>
												<p className="text-sm">
													If you can&apos;t find what you are looking for{" "}
													<Link className="font-bold text-brand" href="/add-a-business">
														add a business here
													</Link>
												</p>
											</div>
									  )}
							</>
						)}
					</div>
				</div>
				<div className="relative w-3/4">
					<Suspense fallback={<div>Loading map...</div>}>
						<MapContainer selectedServiceArea={selectedServiceArea} />
					</Suspense>
					{hoveredBusiness && <BusinessInfoPanel />}
				</div>
			</div>
		</div>
	);
};

export default SearchContainer;
