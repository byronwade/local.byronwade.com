import React, { useRef, useEffect, useCallback, useMemo, Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { Compass, Minus, Plus, MapPin, Navigation, Layers, Filter, Search, Target, Maximize, RotateCcw, Zap } from "lucide-react";
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

			// Optimize map performance
			map.on("sourcedata", (e) => {
				if (e.isSourceLoaded) {
					// Source has finished loading
					map.getCanvas().style.cursor = "";
				}
			});

			// Add custom controls and interactions
			map.on("click", (e) => {
				// Clear active business when clicking empty area
				if (!e.originalEvent.target.closest(".mapboxgl-marker")) {
					setActiveBusinessId(null);
				}
			});

			map.on("movestart", handleMoveStart);
			map.on("moveend", handleMapMoveEnd);
			map.on("zoomend", handleZoomEnd);

			return () => {
				map.off("movestart", handleMoveStart);
				map.off("moveend", handleMapMoveEnd);
				map.off("zoomend", handleZoomEnd);
			};
		}
	}, [setMapRef, setActiveBusinessId]);

	// Debounced map move handler for better performance
	const handleMapMoveEnd = useCallback(async () => {
		if (mapRef.current && !loading) {
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
	}, [getMapBounds, fetchFilteredBusinesses, activeBusinessId, searchQuery, getMapZoom, loading]);

	const handleZoomEnd = useCallback(() => {
		// Trigger search when zoom changes significantly
		handleMapMoveEnd();
	}, [handleMapMoveEnd]);

	const handleMoveStart = useCallback(() => {
		if (activeBusinessId !== null && mapRef.current) {
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
	}, [activeBusinessId, setActiveBusinessId]);

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
		<div className="relative w-full h-full overflow-hidden" ref={containerRef}>
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
					style={{ width: "100%", height: "100%" }}
					{...mapSettings}
					// Performance optimizations
					reuseMaps={true}
					maxZoom={20}
					minZoom={1}
					maxBounds={[
						[-180, -85],
						[180, 85],
					]}
				>
					{/* Built-in Controls */}
					<ScaleControl position="bottom-left" />

					<ServiceArea />
					<BusinessMarkers />
				</Map>
			</Suspense>

			<BusinessInfoPanel />

			{/* Custom Controls */}
			<div className="absolute top-4 left-4 z-10">
				<div className="flex flex-col gap-2">
					{/* Search Status */}
					{isSearching && (
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
							<span className="text-sm font-medium">Searching...</span>
						</div>
					)}

					{/* Results Count */}
					{filteredBusinesses.length > 0 && (
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2">
							<span className="text-sm font-medium">
								{filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? "es" : ""} found
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Map Style Selector */}
			<div className="absolute top-4 right-20 z-10">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
					<div className="flex flex-wrap gap-1">
						{mapStyles.map((style) => (
							<Button key={style.value} size="sm" variant={mapStyle === style.value ? "default" : "ghost"} onClick={() => setMapStyle(style.value)} className="text-xs">
								{style.name}
							</Button>
						))}
					</div>
				</div>
			</div>

			{/* Advanced Controls */}
			<div className="absolute bottom-4 right-4 z-10">
				<TooltipProvider>
					<div className="flex flex-col gap-2">
						{/* Search in Area */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button onClick={handleSearchInArea} disabled={isSearching} className="shadow-lg">
									<Search className="w-4 h-4 mr-2" />
									Search this area
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Search for businesses in the current map area</p>
							</TooltipContent>
						</Tooltip>

						{/* Control Buttons */}
						<div className="flex flex-col gap-1">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="secondary" size="icon" onClick={() => mapRef.current?.zoomIn()}>
										<Plus className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Zoom in</p>
								</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="secondary" size="icon" onClick={() => mapRef.current?.zoomOut()}>
										<Minus className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Zoom out</p>
								</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="secondary" size="icon" onClick={handleMyLocation}>
										<Target className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Go to my location</p>
								</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="secondary" size="icon" onClick={handleToggle3D}>
										<Zap className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Toggle 3D view</p>
								</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="secondary" size="icon" onClick={handleResetView}>
										<RotateCcw className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Reset view</p>
								</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="secondary"
										size="icon"
										onClick={() => {
											const center = mapRef.current?.getCenter();
											if (center) {
												mapRef.current?.flyTo({
													center: [center.lng, center.lat],
													bearing: 0,
												});
											}
										}}
									>
										<Compass className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Reset compass</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>
				</TooltipProvider>
			</div>

			{/* Quick Stats */}
			<div className="absolute bottom-4 left-4 z-10">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
					<div className="flex items-center gap-4 text-sm">
						<div className="flex items-center gap-1">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<span>{filteredBusinesses.filter((b) => b.isOpenNow).length} Open</span>
						</div>
						<div className="flex items-center gap-1">
							<div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
							<span>{filteredBusinesses.filter((b) => b.isSponsored).length} Sponsored</span>
						</div>
						<div className="flex items-center gap-1">
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
							<span>{filteredBusinesses.filter((b) => b.ratings?.overall >= 4.5).length} Top Rated</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

MapContainer.displayName = "MapContainer";

export default MapContainer;
