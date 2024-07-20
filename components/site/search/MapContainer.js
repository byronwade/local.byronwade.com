import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Map, { NavigationControl } from "react-map-gl";
import BusinessMarkers from "@/components/site/search/BusinessMarkers";
import ServiceArea from "@/components/site/search/ServiceArea";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Compass, Minus, Plus } from "react-feather";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapContainer = ({ businesses, coordinates, activeMarker, handleMarkerClick, selectedServiceArea, handleSearchInArea, setMapRef, flyToLocation }) => {
	const mapRef = useRef(null);
	const mapContainerRef = useRef(null);

	useEffect(() => {
		if (mapRef.current) {
			setMapRef(mapRef.current);
		}
	}, [setMapRef]);

	const handleSearchInAreaClick = () => {
		handleSearchInArea();
	};

	const handleZoomIn = () => {
		if (mapRef.current) {
			const mapInstance = mapRef.current.getMap();
			mapInstance.zoomIn();
		}
	};

	const handleZoomOut = () => {
		if (mapRef.current) {
			const mapInstance = mapRef.current.getMap();
			mapInstance.zoomOut();
		}
	};

	const handleRotate = () => {
		if (mapRef.current) {
			const mapInstance = mapRef.current.getMap();
			mapInstance.rotateTo(mapInstance.getBearing() + 90, { duration: 1000 });
		}
	};

	return (
		<div ref={mapContainerRef} className="relative w-full h-full">
			<Map
				ref={mapRef}
				initialViewState={{
					latitude: 37.7749,
					longitude: -122.4194,
					zoom: 10,
				}}
				mapStyle="mapbox://styles/mapbox/streets-v11"
				mapboxAccessToken={MAPBOX_TOKEN}
				attributionControl={false}
			>
				<BusinessMarkers businesses={businesses} coordinates={coordinates} activeMarker={activeMarker} handleMarkerClick={handleMarkerClick} flyToLocation={flyToLocation} />
				<ServiceArea selectedServiceArea={selectedServiceArea} />
			</Map>

			<div className="absolute flex flex-col items-end justify-end space-y-2 top-4 right-4">
				<Button variant="brand" onClick={handleSearchInAreaClick}>
					Search in this area
				</Button>
				<Button variant="secondary" size="icon" onClick={handleZoomIn}>
					<Plus className="w-4 h-4" />
				</Button>
				<Button variant="secondary" size="icon" onClick={handleZoomOut}>
					<Minus className="w-4 h-4" />
				</Button>
				<Button variant="secondary" size="icon" onClick={handleRotate}>
					<Compass className="w-4 h-4" />
				</Button>
			</div>
			<Button className="absolute bottom-4 right-4 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black">
				<BuildingStorefrontIcon className="w-3 h-3 mr-2" />
				<span>Can&apos;t find the business?</span>
				<Link className="font-bold text-brand" href="/add-buiseness">
					Add it here
				</Link>
			</Button>
		</div>
	);
};

export default MapContainer;
