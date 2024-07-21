import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Map, { NavigationControl, Source, Layer } from "react-map-gl"; // Import Source and Layer
import BusinessMarkers from "@/components/site/map/BusinessMarkers";
import ServiceArea from "@/components/site/map/ServiceArea";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import { Compass, Minus, Plus } from "react-feather";
import useBusinessStore from "@/store/useBusinessStore";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapContainer = ({ activeMarker, handleMarkerClick, selectedServiceArea, setMapRef, flyToLocation }) => {
	const { businesses, handleSearchInArea } = useBusinessStore((state) => ({
		businesses: state.filteredBusinesses,
		handleSearchInArea: state.handleSearchInArea,
	}));
	const mapRef = useRef(null);
	const mapContainerRef = useRef(null);

	useEffect(() => {
		if (mapRef.current) {
			setMapRef(mapRef.current);
		}
	}, [setMapRef]);

	const handleSearchInAreaClick = () => {
		if (mapRef.current) {
			handleSearchInArea(mapRef.current.getBounds());
		}
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
				<BusinessMarkers businesses={businesses} activeMarker={activeMarker} handleMarkerClick={handleMarkerClick} flyToLocation={flyToLocation} />
				{selectedServiceArea && (
					<Source id="serviceArea" type="geojson" data={selectedServiceArea}>
						<Layer
							id="serviceArea-fill"
							type="fill"
							paint={{
								"fill-color": "#888",
								"fill-opacity": 0.4,
							}}
						/>
						<Layer
							id="serviceArea-outline"
							type="line"
							paint={{
								"line-color": "#000",
								"line-width": 2,
							}}
						/>
					</Source>
				)}
				<NavigationControl position="top-left" />
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
			<div className="absolute bottom-4 right-4 inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow py-2 z-50 h-[calc(theme(spacing.7)_-_1px)] gap-1 rounded-[6px] bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black">
				<BuildingStorefrontIcon className="w-3 h-3 mr-2" />
				<span>Can&apos;t find the business?</span>
				<Link className="font-bold text-brand" href="/add-a-business">
					Add it here
				</Link>
			</div>
		</div>
	);
};

export default MapContainer;
