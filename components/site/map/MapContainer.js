import React, { useRef, useEffect, useCallback, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@components/ui/button";
import { Compass, Minus, Plus } from "react-feather";
import BusinessInfoPanel from "@components/site/map/BusinessInfoPanel";
import FullScreenMapSkeleton from "@components/site/map/FullScreenMapSkeleton";
import useMapStore from "@store/useMapStore";
import useSearchStore from "@store/useSearchStore";
import useBusinessStore from "@store/useBusinessStore";
import { Map } from "react-map-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const BusinessMarkers = dynamic(() => import("@components/site/map/BusinessMarkers"), {
	ssr: false,
});
const ServiceArea = dynamic(() => import("@components/site/map/ServiceArea"), {
	ssr: false,
});

const MapContainer = React.forwardRef((props, ref) => {
	const mapRef = useRef(null);
	const containerRef = useRef(null);
	const { setMapRef, getMapBounds, getMapZoom } = useMapStore();
	const { searchQuery } = useSearchStore();
	const { fetchInitialBusinesses, fetchFilteredBusinesses, initialLoad, activeBusinessId, setActiveBusinessId, clearFilteredBusinesses, loading } = useBusinessStore();
	const initialFetchDone = useRef(false);

	const initialCoordinates = useMemo(() => ({ lat: 37.7749, lng: -122.4194 }), []);

	useEffect(() => {
		if (mapRef.current) {
			setMapRef(mapRef.current.getMap());
			console.log("Map ref set on load:", mapRef.current.getMap());
		}
	}, [setMapRef]);

	useEffect(() => {
		const handleResize = () => {
			if (mapRef.current) {
				mapRef.current.resize();
			}
		};

		const resizeObserver = new ResizeObserver(handleResize);

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		window.addEventListener("resize", handleResize);

		return () => {
			if (containerRef.current) {
				resizeObserver.unobserve(containerRef.current);
			}
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleMapLoad = useCallback(async () => {
		if (mapRef.current) {
			const map = mapRef.current.getMap();
			setMapRef(map);
			const center = await getMapBounds();
			if (initialLoad && center && !activeBusinessId && !initialFetchDone.current) {
				const bounds = await getMapBounds();
				const zoom = await getMapZoom();
				console.log("Map loaded with bounds:", bounds, "and zoom:", zoom);
				if (bounds) {
					console.log("Fetching initial businesses with bounds:", bounds, "and zoom:", zoom);
					await fetchInitialBusinesses(bounds, zoom, searchQuery);
					initialFetchDone.current = true;
				}
			}

			map.on("movestart", handleMoveStart);
			map.on("moveend", handleMapMoveEnd);

			return () => {
				map.off("movestart", handleMoveStart);
				map.off("moveend", handleMapMoveEnd);
			};
		}
	}, [initialLoad, activeBusinessId, getMapBounds, getMapZoom, setMapRef, fetchInitialBusinesses, searchQuery]);

	const handleMapMoveEnd = useCallback(async () => {
		if (mapRef.current) {
			const bounds = await getMapBounds();
			const zoom = await getMapZoom();
			console.log("Map move ended with bounds:", bounds, "and zoom:", zoom);
			if (bounds && !activeBusinessId) {
				console.log("Fetching filtered businesses with bounds:", bounds, "and zoom:", zoom, "and query:", searchQuery);
				await fetchFilteredBusinesses(bounds, zoom, searchQuery);
			}
		}
	}, [getMapBounds, fetchFilteredBusinesses, activeBusinessId, searchQuery, getMapZoom]);

	const handleMoveStart = useCallback(() => {
		if (activeBusinessId !== null && mapRef.current) {
			const bounds = mapRef.current.getBounds();
			const business = useBusinessStore.getState().cache.get(activeBusinessId);
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
	}, [activeBusinessId, setActiveBusinessId]);

	useEffect(() => {
		if (mapRef.current) {
			const map = mapRef.current.getMap();
			map.on("movestart", handleMoveStart);
			map.on("moveend", handleMapMoveEnd);
			map.on("idle", () => {
				if (mapRef.current) {
					mapRef.current.resize();
				}
			});
			return () => {
				map.off("movestart", handleMoveStart);
				map.off("moveend", handleMapMoveEnd);
				map.off("idle", () => {
					if (mapRef.current) {
						mapRef.current.resize();
					}
				});
			};
		}
	}, [handleMoveStart, handleMapMoveEnd]);

	return (
		<div className="relative w-full h-full" ref={containerRef}>
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
});

MapContainer.displayName = "MapContainer";

export default MapContainer;
