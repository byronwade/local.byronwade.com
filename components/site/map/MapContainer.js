import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Map from "react-map-gl";
import BusinessMarkers from "@/components/site/map/BusinessMarkers";
import ServiceArea from "@/components/site/map/ServiceArea";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import { Compass, Minus, Plus } from "react-feather";
import useBusinessStore from "@/store/useBusinessStore";
import useSearchStore from "@/store/useSearchStore";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapContainer = () => {
	const { setMapRef, handleSearchInArea, setActiveBusiness, fetchCoordinatesForZipCode, fetchBusinessesByBoundingBox } = useBusinessStore((state) => ({
		setMapRef: state.setMapRef,
		handleSearchInArea: state.handleSearchInArea,
		setActiveBusiness: state.setActiveBusiness,
		fetchCoordinatesForZipCode: state.fetchCoordinatesForZipCode,
		fetchBusinessesByBoundingBox: state.fetchBusinessesByBoundingBox,
	}));

	const { zipCode } = useSearchStore((state) => ({
		zipCode: state.zipCode,
	}));

	const mapRef = useRef(null);
	const [isMapReady, setIsMapReady] = useState(false);
	const [initialCoordinates, setInitialCoordinates] = useState(null);

	useEffect(() => {
		const fetchInitialCoordinates = async () => {
			if (zipCode) {
				const coordinates = await fetchCoordinatesForZipCode(zipCode);
				//console.log("MapContainer: fetchCoordinatesForZipCode", coordinates);
				if (coordinates) {
					setInitialCoordinates({
						latitude: coordinates.latitude,
						longitude: coordinates.longitude,
						zoom: 10,
					});
				}
			}
		};
		fetchInitialCoordinates();
	}, [zipCode, fetchCoordinatesForZipCode]);

	const onMapLoad = async () => {
		if (mapRef.current) {
			const mapInstance = mapRef.current.getMap();
			// console.log("MapContainer onMapLoad: mapInstance", mapInstance);
			setMapRef(mapInstance);
			setIsMapReady(true);

			if (zipCode) {
				const coordinates = await fetchCoordinatesForZipCode(zipCode);
				if (coordinates) {
					const { latitude, longitude } = coordinates;
					mapInstance.flyTo({ center: [longitude, latitude], zoom: 10, essential: true });
					mapInstance.once("moveend", async () => {
						const bounds = mapInstance.getBounds();
						const southWest = bounds.getSouthWest();
						const northEast = bounds.getNorthEast();
						await fetchBusinessesByBoundingBox(southWest.lat, southWest.lng, northEast.lat, northEast.lng);
					});
				}
			}

			// Add dragend event listener
			mapInstance.on("dragend", () => {
				console.log("Map dragged");
				setActiveBusiness(null);
			});
		} else {
			console.log("onMapLoad: mapRef.current is null");
		}
	};

	const handleSearchInAreaClick = () => {
		if (isMapReady && mapRef.current) {
			handleSearchInArea();
			// console.log("handleSearchInAreaClick: handleSearchInArea called");
		} else {
			// console.log("handleSearchInAreaClick: mapRef.current or isMapReady is null");
		}
	};

	const handleZoomIn = () => {
		if (isMapReady && mapRef.current) {
			mapRef.current.getMap().zoomIn();
			// console.log("handleZoomIn: zoomIn called");
		} else {
			// console.log("handleZoomIn: mapRef.current or isMapReady is null");
		}
	};

	const handleZoomOut = () => {
		if (isMapReady && mapRef.current) {
			mapRef.current.getMap().zoomOut();
			// console.log("handleZoomOut: zoomOut called");
		} else {
			// console.log("handleZoomOut: mapRef.current or isMapReady is null");
		}
	};

	const handleRotate = () => {
		if (isMapReady && mapRef.current) {
			mapRef.current.getMap().rotateTo(mapRef.current.getMap().getBearing() + 90, { duration: 1000 });
			// console.log("handleRotate: rotateTo called");
		} else {
			// console.log("handleRotate: mapRef.current or isMapReady is null");
		}
	};

	if (!initialCoordinates) {
		return <div>Loading map...</div>;
	}

	// console.log("MapContainer: initialCoordinates", initialCoordinates);

	return (
		<div className="relative w-full h-full">
			<Map ref={mapRef} initialViewState={initialCoordinates} mapStyle="mapbox://styles/mapbox/streets-v11" mapboxAccessToken={MAPBOX_TOKEN} attributionControl={false} onLoad={onMapLoad}>
				<ServiceArea />
				<BusinessMarkers />
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
