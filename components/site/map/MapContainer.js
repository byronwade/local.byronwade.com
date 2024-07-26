import React, { useRef, useCallback, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@components/ui/button";
import { Compass, Minus, Plus } from "react-feather";
import BusinessInfoPanel from "@components/site/map/BusinessInfoPanel";
import FullScreenMapSkeleton from "@components/site/map/FullScreenMapSkeleton";
import useMapStore from "@store/useMapStore";
import useSearchStore from "@store/useSearchStore";
import useBusinessStore from "@store/useBusinessStore";
import debounce from "lodash/debounce";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = dynamic(() => import("react-map-gl"), {
	ssr: false,
	loading: () => <FullScreenMapSkeleton />,
});
const BusinessMarkers = dynamic(() => import("@components/site/map/BusinessMarkers"), {
	ssr: false,
});
const ServiceArea = dynamic(() => import("@components/site/map/ServiceArea"), {
	ssr: false,
});

const MapContainer = () => {
	const mapRef = useRef(null);
	const { setMapRef, getMapCenter, getMapBounds } = useMapStore();
	const { location } = useSearchStore();
	const { fetchInitialBusinesses, fetchFilteredBusinesses, initialLoad, activeBusinessId, setActiveBusinessId } = useBusinessStore();
	const initialFetchDone = useRef(false); // Track if initial fetch is done

	const initialCoordinates = location.lat && location.lng ? { lat: location.lat, lng: location.lng } : { lat: 37.7749, lng: -122.4194 };
	console.log("Inital Cords", location);

	useEffect(() => {
		if (mapRef.current) {
			setMapRef(mapRef.current.getMap());
			console.log("Map ref set on load:", mapRef.current.getMap());
		}
	}, [setMapRef]);

	const handleMapLoad = useCallback(async () => {
		if (mapRef.current) {
			const map = mapRef.current.getMap();
			setMapRef(map);
			const center = await getMapCenter();
			if (initialLoad && center && !activeBusinessId && !initialFetchDone.current) {
				const bounds = await getMapBounds();
				const zoom = map.getZoom();
				console.log("Map loaded with bounds:", bounds, "and zoom:", zoom);
				if (bounds) {
					console.log("Fetching initial businesses with bounds:", bounds, "and zoom:", zoom);
					await fetchInitialBusinesses(bounds, zoom);
					initialFetchDone.current = true; // Mark initial fetch as done
				}
			}

			map.on("movestart", handleMoveStart);
			map.on("moveend", handleMapMoveEnd);

			return () => {
				map.off("movestart", handleMoveStart);
				map.off("moveend", handleMapMoveEnd);
			};
		}
	}, [initialLoad, activeBusinessId, getMapBounds, getMapCenter, setMapRef, fetchInitialBusinesses]);

	const handleMapMoveEnd = useCallback(
		debounce(async () => {
			if (mapRef.current) {
				setMapRef(mapRef.current.getMap());
				const bounds = await getMapBounds();
				const zoom = mapRef.current.getZoom();
				console.log("Map move ended with bounds:", bounds, "and zoom:", zoom);
				if (bounds) {
					console.log("Fetching filtered businesses with bounds:", bounds, "and zoom:", zoom);
					await fetchFilteredBusinesses(bounds, zoom);
				}
			}
		}, 500), // Debounce time in milliseconds
		[getMapBounds, setMapRef, fetchFilteredBusinesses]
	);

	const handleMoveStart = useCallback(
		debounce(() => {
			const currentActiveBusinessId = activeBusinessId;
			if (currentActiveBusinessId !== null) {
				const bounds = mapRef.current.getBounds();
				const business = useBusinessStore.getState().cache.get(currentActiveBusinessId);
				if (business && business.coordinates) {
					const { lat, lng } = business.coordinates;
					if (lat >= bounds.getSouth() && lat <= bounds.getNorth() && lng >= bounds.getWest() && lng <= bounds.getEast()) {
						console.log("Active business is within bounds");
					} else {
						setActiveBusinessId(null);
						console.log("Active business set to null on move start");
					}
				}
			}
		}, 500), // Debounce time in milliseconds
		[activeBusinessId, setActiveBusinessId]
	);

	useEffect(() => {
		if (mapRef.current) {
			const map = mapRef.current.getMap();
			map.on("movestart", handleMoveStart);
			map.on("moveend", handleMapMoveEnd);
			return () => {
				map.off("movestart", handleMoveStart);
				map.off("moveend", handleMapMoveEnd);
			};
		}
	}, [handleMoveStart, handleMapMoveEnd]);

	return (
		<div className="relative w-full h-full">
			<Suspense fallback={<FullScreenMapSkeleton />}>
				<Map
					ref={mapRef}
					initialViewState={{
						latitude: initialCoordinates.lat,
						longitude: initialCoordinates.lng,
						zoom: 10,
					}}
					mapStyle="mapbox://styles/byronwade/clywtphyo006d01r7ep5s0h8a"
					mapboxAccessToken={MAPBOX_TOKEN}
					attributionControl={false}
					onLoad={handleMapLoad}
				>
					<ServiceArea />
					<BusinessMarkers />
				</Map>
			</Suspense>

			<BusinessInfoPanel />

			<div className="absolute flex flex-col items-end justify-end space-y-2 top-4 right-4">
				<Button variant="brand" onClick={handleMapMoveEnd}>
					Search in this area
				</Button>
				<Button variant="secondary" className="flex items-center" onClick={() => mapRef.current?.zoomIn()}>
					<Plus size={16} />
				</Button>
				<Button variant="secondary" className="flex items-center" onClick={() => mapRef.current?.zoomOut()}>
					<Minus size={16} />
				</Button>
				<Button variant="secondary" className="flex items-center" onClick={() => mapRef.current?.flyTo({ center: [0, 0] })}>
					<Compass size={16} />
				</Button>
			</div>
		</div>
	);
};

export default MapContainer;
