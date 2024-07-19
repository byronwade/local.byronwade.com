"use client";
// src/components/Search.js
import React, { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import BusinessCard from "@/components/site/search/BusinessCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const headerHeight = 64; // Example header height, replace with actual if dynamic

const Search = () => {
	const [businesses, setBusinesses] = useState([
		// Example data, replace with actual data
		{
			id: 1,
			name: "Business 1",
			lat: 37.7749,
			lng: -122.4194,
			address: "123 Market St, San Francisco, CA",
			phone: "(123) 456-7890",
			rating: 4.5,
			image: "/placeholder.svg",
		},
		{
			id: 2,
			name: "Business 2",
			lat: 34.0522,
			lng: -118.2437,
			address: "456 Sunset Blvd, Los Angeles, CA",
			phone: "(987) 654-3210",
			rating: 4.0,
			image: "/placeholder.svg",
		},
	]);

	const mapContainerRef = useRef(null);

	useEffect(() => {
		// Adjust map height dynamically on window resize
		const handleResize = () => {
			if (mapContainerRef.current) {
				mapContainerRef.current.style.height = `calc(100vh - ${headerHeight}px)`;
			}
		};

		handleResize(); // Initial call
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleMarkerClick = (id) => {
		document.getElementById(`business-${id}`).scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	};

	return (
		<div className="flex flex-col h-screen" style={{ height: `calc(100vh - ${headerHeight}px)` }}>
			<div className="flex flex-1 overflow-hidden">
				<div className="flex flex-row w-1/2 overflow-y-auto">
					<div className="p-4 border-r w-[300px]">
						<h2 className="text-xl font-semibold">Filters</h2>
						<ScrollArea className="w-full">
							<div className="p-4">
								<h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
								{["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"].map((tag) => (
									<div key={tag} className="text-sm">
										{tag}
									</div>
								))}
							</div>
						</ScrollArea>
					</div>
					<div className="w-full">
						<div className="p-4">
							<h1>Top 10 Best Plumbing Companies</h1>
						</div>
						<ScrollArea className="flex-1 p-4">
							{businesses.map((business) => (
								<BusinessCard key={business.id} business={business} onClick={() => handleMarkerClick(business.id)} />
							))}
						</ScrollArea>
					</div>
				</div>
				<div className="relative w-1/2">
					<div ref={mapContainerRef} className="absolute top-0 left-0 right-0 h-full">
						<Map
							initialViewState={{
								latitude: 37.7749,
								longitude: -122.4194,
								zoom: 10,
							}}
							style={{ width: "100%", height: "100%" }}
							mapStyle="mapbox://styles/mapbox/streets-v11"
							mapboxAccessToken={MAPBOX_TOKEN}
						>
							{businesses.map((business) => (
								<Marker key={business.id} latitude={business.lat} longitude={business.lng} onClick={() => handleMarkerClick(business.id)}>
									<div className="text-red-500 cursor-pointer">📍</div>
								</Marker>
							))}
						</Map>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Search;
