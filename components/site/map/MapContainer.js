import React, { useRef, useEffect, useCallback, useMemo, Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { Compass, Minus, Plus, MapPin, Navigation, Layers, Filter, Search, Target, Maximize, RotateCcw, Zap, Move, Shield, Eye, Users, Star } from "lucide-react";
import BusinessInfoPanel from "@components/site/map/BusinessInfoPanel";
import FullScreenMapSkeleton from "@components/site/map/FullScreenMapSkeleton";
import useMapStore from "@store/useMapStore";
import useSearchStore from "@store/useSearchStore";
import useBusinessStore from "@store/useBusinessStore";
import { Map, NavigationControl, GeolocateControl, ScaleControl, FullscreenControl } from "react-map-gl";

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
	const [mapStyle, setMapStyle] = useState("mapbox://styles/byronwade/clywtphyo006d01r7ep5s0h8a");
	const [isSearching, setIsSearching] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [viewState, setViewState] = useState({
		latitude: 37.7749,
		longitude: -122.4194,
		zoom: 10,
		bearing: 0,
		pitch: 0,
	});

	const { setMapRef, getMapBounds, getMapZoom } = useMapStore();
	const { searchQuery } = useSearchStore();
	const { fetchInitialBusinesses, fetchFilteredBusinesses, initializeWithMockData, initialLoad, activeBusinessId, setActiveBusinessId, filteredBusinesses, loading } = useBusinessStore();
	const initialFetchDone = useRef(false);

	// Check if business details panel is open
	const isBusinessDetailsOpen = Boolean(activeBusinessId);

	const mapStyles = [
		{ name: "Default", value: "mapbox://styles/byronwade/clywtphyo006d01r7ep5s0h8a" },
		{ name: "Satellite", value: "mapbox://styles/mapbox/satellite-v9" },
		{ name: "Streets", value: "mapbox://styles/mapbox/streets-v12" },
		{ name: "Dark", value: "mapbox://styles/mapbox/dark-v11" },
		{ name: "Light", value: "mapbox://styles/mapbox/light-v11" },
		{ name: "Outdoors", value: "mapbox://styles/mapbox/outdoors-v12" },
	];

	// Optimized map settings for better performance
	const mapSettings = useMemo(
		() => ({
			doubleClickZoom: true,
			scrollZoom: true,
			boxZoom: true,
			dragRotate: true,
			dragPan: true,
			keyboard: true,
			touchZoom: true,
			touchRotate: true,
			// Performance optimizations
			antialias: true,
			preserveDrawingBuffer: false,
			refreshExpiredTiles: true,
			maxTileCacheSize: 50,
			transformRequest: (url, resourceType) => {
				// Optimize tile loading
				if (resourceType === "Tile" && url.startsWith("http")) {
					return {
						url: url,
						headers: { "Cache-Control": "max-age=3600" },
					};
				}
			},
		}),
		[]
	);

	useEffect(() => {
		// Initialize with mock data immediately
		initializeWithMockData();
	}, [initializeWithMockData]);

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
		const currentContainer = containerRef.current;

		if (currentContainer) {
			resizeObserver.observe(currentContainer);
		}

		window.addEventListener("resize", handleResize);

		return () => {
			if (currentContainer) {
				resizeObserver.unobserve(currentContainer);
			}
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Define event handlers before using them in useCallback dependencies
	const handleMoveStart = useCallback(() => {
		try {
			if (activeBusinessId !== null && mapRef.current) {
				const map = mapRef.current.getMap();
				if (!map || !map.isStyleLoaded()) return;

				const bounds = mapRef.current.getBounds();
				const business = useBusinessStore.getState().filteredBusinesses.find((b) => b.id === activeBusinessId);
				if (business?.coordinates) {
					const { lat, lng } = business.coordinates;
					if (lat >= bounds.getSouth() && lat <= bounds.getNorth() && lng >= bounds.getWest() && lng <= bounds.getEast()) {
						console.log("Active business is within bounds");
					} else {
						setActiveBusinessId(null);
						console.log("Active business set to null on move start");
					}
				}
			}
		} catch (error) {
			console.warn("Move start handler error:", error);
		}
	}, [activeBusinessId, setActiveBusinessId]);

	// Debounced map move handler for better performance
	const handleMapMoveEnd = useCallback(async () => {
		try {
			if (mapRef.current && !loading) {
				const map = mapRef.current.getMap();
				if (!map || !map.isStyleLoaded()) return;

				setIsSearching(true);
				const bounds = await getMapBounds();
				const zoom = await getMapZoom();
				console.log("Map move ended with bounds:", bounds, "and zoom:", zoom);
				if (bounds && !activeBusinessId) {
					console.log("Fetching filtered businesses with bounds:", bounds, "and zoom:", zoom, "and query:", searchQuery);
					await fetchFilteredBusinesses(bounds, zoom, searchQuery);
				}
				setIsSearching(false);
			}
		} catch (error) {
			console.warn("Move end handler error:", error);
			setIsSearching(false);
		}
	}, [getMapBounds, fetchFilteredBusinesses, activeBusinessId, searchQuery, getMapZoom, loading]);

	const handleZoomEnd = useCallback(() => {
		// Trigger search when zoom changes significantly
		handleMapMoveEnd();
	}, [handleMapMoveEnd]);

	const handleMapLoad = useCallback(async () => {
		if (mapRef.current) {
			const map = mapRef.current.getMap();
			setMapRef(map);

			// Wait for map to be fully loaded before adding event listeners
			map.once("idle", () => {
				// Optimize map performance
				map.on("sourcedata", (e) => {
					if (e.isSourceLoaded) {
						// Source has finished loading
						map.getCanvas().style.cursor = "";
					}
				});

				// Add custom controls and interactions with safety checks
				map.on("click", (e) => {
					try {
						// Clear active business when clicking empty area
						if (!e.originalEvent.target.closest(".mapboxgl-marker")) {
							setActiveBusinessId(null);
						}
					} catch (error) {
						console.warn("Map click handler error:", error);
					}
				});

				map.on("movestart", handleMoveStart);
				map.on("moveend", handleMapMoveEnd);
				map.on("zoomend", handleZoomEnd);
			});

			return () => {
				try {
					map.off("movestart", handleMoveStart);
					map.off("moveend", handleMapMoveEnd);
					map.off("zoomend", handleZoomEnd);
				} catch (error) {
					console.warn("Error removing map event listeners:", error);
				}
			};
		}
	}, [setMapRef, setActiveBusinessId, handleMoveStart, handleMapMoveEnd, handleZoomEnd]);

	const handleSearchInArea = useCallback(async () => {
		setIsSearching(true);
		await handleMapMoveEnd();
	}, [handleMapMoveEnd]);

	const handleResetView = useCallback(() => {
		setViewState({
			latitude: 37.7749,
			longitude: -122.4194,
			zoom: 10,
			bearing: 0,
			pitch: 0,
		});
	}, []);

	const handleMyLocation = useCallback(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setViewState((prev) => ({
						...prev,
						latitude,
						longitude,
						zoom: 14,
					}));
				},
				(error) => {
					console.error("Error getting location:", error);
				}
			);
		}
	}, []);

	const handleToggle3D = useCallback(() => {
		setViewState((prev) => ({
			...prev,
			pitch: prev.pitch === 0 ? 45 : 0,
		}));
	}, []);

	// Optimized view state change handler
	const handleViewStateChange = useCallback((evt) => {
		setViewState(evt.viewState);
	}, []);

	return (
		<div className="map-container relative w-full h-full overflow-hidden" ref={containerRef}>
			<Suspense fallback={<FullScreenMapSkeleton />}>
				<Map
					ref={mapRef}
					{...viewState}
					onMove={handleViewStateChange}
					mapStyle={mapStyle}
					mapboxAccessToken={MAPBOX_TOKEN}
					attributionControl={false}
					onLoad={handleMapLoad}
					interactiveLayerIds={[]}
					cursor="default"
					style={{
						width: "100%",
						height: "100%",
						marginLeft: isBusinessDetailsOpen ? "384px" : "0",
						transition: "margin-left 300ms ease-in-out",
					}}
					{...mapSettings}
					// Performance optimizations
					reuseMaps={true}
					maxZoom={20}
					minZoom={1}
					maxBounds={[
						[-180, -85],
						[180, 85],
					]}
					// Additional safety options
					cooperativeGestures={false}
					preventStyleDiffing={true}
					onError={(error) => {
						console.warn("Map error:", error);
					}}
				>
					{/* Built-in Controls */}
					<ScaleControl position="bottom-left" />

					<ServiceArea />
					<BusinessMarkers />
				</Map>
			</Suspense>

			<BusinessInfoPanel />

			{/* Simple Search Button */}
			<div className="absolute top-4 right-4 z-20">
				<Button onClick={handleSearchInArea} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-4 py-2 text-sm rounded-lg">
					<Search className="w-4 h-4 mr-2" />
					{isSearching ? "Searching..." : "Search this area"}
				</Button>
			</div>

			{/* Simple Map Controls */}
			<div className="absolute bottom-6 right-6 z-10">
				<div className="flex flex-col gap-2">
					{/* Basic Zoom and Location Controls */}
					<div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-2">
						<div className="flex gap-1">
							<Button variant="ghost" size="sm" onClick={() => mapRef.current?.zoomIn()} className="h-8 w-8 p-0">
								<Plus className="w-4 h-4" />
							</Button>
							<Button variant="ghost" size="sm" onClick={() => mapRef.current?.zoomOut()} className="h-8 w-8 p-0">
								<Minus className="w-4 h-4" />
							</Button>
							<Button variant="ghost" size="sm" onClick={handleMyLocation} className="h-8 w-8 p-0">
								<Target className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

MapContainer.displayName = "MapContainer";

export default MapContainer;
