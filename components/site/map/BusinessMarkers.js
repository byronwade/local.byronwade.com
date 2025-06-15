import React, { memo, useEffect, useMemo, useState, useCallback } from "react";
import { Marker, Popup } from "react-map-gl";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Star, MapPin, Phone, Clock, ExternalLink, DollarSign } from "lucide-react";
import useBusinessStore from "@store/useBusinessStore";
import useMapStore from "@store/useMapStore";

const BusinessMarkers = () => {
	const { filteredBusinesses, activeBusinessId, setActiveBusinessId } = useBusinessStore();
	const { centerOn, mapRef } = useMapStore();
	const [hoveredBusiness, setHoveredBusiness] = useState(null);
	const [showPopup, setShowPopup] = useState(null);
	const [currentZoom, setCurrentZoom] = useState(10);
	const [mapBounds, setMapBounds] = useState(null);

	// Track zoom level and bounds for optimization
	useEffect(() => {
		if (mapRef) {
			const updateMapState = () => {
				const zoom = mapRef.getZoom();
				const bounds = mapRef.getBounds();
				setCurrentZoom(zoom);
				setMapBounds(bounds);
			};

			mapRef.on("zoom", updateMapState);
			mapRef.on("move", updateMapState);

			// Initial state
			updateMapState();

			return () => {
				mapRef.off("zoom", updateMapState);
				mapRef.off("move", updateMapState);
			};
		}
	}, [mapRef]);

	// Memoized handlers for better performance
	const handleMarkerClick = useCallback(
		(business) => {
			setActiveBusinessId(business.id);
			const { coordinates, serviceArea } = business;
			const radius = serviceArea && serviceArea.type === "radius" ? serviceArea.value : null;
			if (coordinates) {
				centerOn(coordinates.lat, coordinates.lng, radius);
			}
			setShowPopup(null); // Close popup when selecting business
		},
		[setActiveBusinessId, centerOn]
	);

	const handleMarkerHover = useCallback((business) => {
		setHoveredBusiness(business.id);
		setShowPopup(business.id);
	}, []);

	const handleMarkerLeave = useCallback(() => {
		setHoveredBusiness(null);
		// Keep popup open for a moment to allow interaction
		setTimeout(() => {
			if (!hoveredBusiness) {
				setShowPopup(null);
			}
		}, 300);
	}, [hoveredBusiness]);

	// Viewport-based filtering - only show businesses within current map bounds
	const visibleBusinesses = useMemo(() => {
		if (!mapBounds || !filteredBusinesses.length) return [];

		return filteredBusinesses.filter((business) => {
			if (!business.coordinates) return false;

			const { lat, lng } = business.coordinates;
			return lat >= mapBounds.getSouth() && lat <= mapBounds.getNorth() && lng >= mapBounds.getWest() && lng <= mapBounds.getEast();
		});
	}, [filteredBusinesses, mapBounds]);

	// Clustering algorithm optimized for performance
	const createClusters = useCallback((businesses, zoom) => {
		const clusters = [];
		const processed = new Set();

		// Cluster distance based on zoom level (more aggressive clustering when zoomed out)
		const clusterDistance = Math.max(0.01, 0.1 / Math.pow(2, zoom - 5));

		businesses.forEach((business) => {
			if (processed.has(business.id) || !business.coordinates) return;

			const nearby = businesses.filter((other) => {
				if (processed.has(other.id) || !other.coordinates || other.id === business.id) return false;

				const distance = Math.sqrt(Math.pow(business.coordinates.lat - other.coordinates.lat, 2) + Math.pow(business.coordinates.lng - other.coordinates.lng, 2));

				return distance < clusterDistance;
			});

			if (nearby.length > 0) {
				// Create cluster
				const allBusinesses = [business, ...nearby];
				const centerLat = allBusinesses.reduce((sum, b) => sum + b.coordinates.lat, 0) / allBusinesses.length;
				const centerLng = allBusinesses.reduce((sum, b) => sum + b.coordinates.lng, 0) / allBusinesses.length;

				clusters.push({
					id: `cluster-${business.id}`,
					type: "cluster",
					coordinates: { lat: centerLat, lng: centerLng },
					businesses: allBusinesses,
					count: allBusinesses.length,
					renderType: "cluster",
				});

				allBusinesses.forEach((b) => processed.add(b.id));
			} else {
				// Single business
				clusters.push({
					...business,
					type: "single",
					renderType: zoom < 10 ? "simple" : "detailed",
				});
				processed.add(business.id);
			}
		});

		return clusters;
	}, []);

	// Zoom-based clustering and rendering optimization
	const optimizedBusinesses = useMemo(() => {
		if (!visibleBusinesses.length) return [];

		// Zoom level thresholds (similar to Airbnb's approach)
		const CLUSTER_ZOOM_THRESHOLD = 12; // Below this zoom, use clustering
		const SIMPLE_MARKER_ZOOM_THRESHOLD = 10; // Below this zoom, use simple markers
		const MAX_MARKERS_PER_ZOOM = {
			5: 50, // Very zoomed out - show only 50 markers
			8: 100, // Medium zoom - show 100 markers
			10: 200, // Higher zoom - show 200 markers
			12: 500, // Close zoom - show 500 markers
			15: 1000, // Very close - show all
		};

		// Determine max markers based on zoom level
		const getMaxMarkers = (zoom) => {
			const thresholds = Object.keys(MAX_MARKERS_PER_ZOOM)
				.map(Number)
				.sort((a, b) => b - a);
			for (const threshold of thresholds) {
				if (zoom >= threshold) {
					return MAX_MARKERS_PER_ZOOM[threshold];
				}
			}
			return MAX_MARKERS_PER_ZOOM[5]; // Default to most restrictive
		};

		const maxMarkers = getMaxMarkers(currentZoom);

		// If we have too many markers, prioritize by:
		// 1. Sponsored businesses
		// 2. Higher ratings
		// 3. More reviews
		let prioritizedBusinesses = [...visibleBusinesses];

		if (prioritizedBusinesses.length > maxMarkers) {
			prioritizedBusinesses = prioritizedBusinesses
				.sort((a, b) => {
					// Prioritize sponsored
					if (a.isSponsored && !b.isSponsored) return -1;
					if (!a.isSponsored && b.isSponsored) return 1;

					// Then by rating
					const ratingA = a.ratings?.overall || 0;
					const ratingB = b.ratings?.overall || 0;
					if (ratingA !== ratingB) return ratingB - ratingA;

					// Then by review count
					const reviewsA = a.reviewCount || 0;
					const reviewsB = b.reviewCount || 0;
					return reviewsB - reviewsA;
				})
				.slice(0, maxMarkers);
		}

		// Apply clustering if zoom is below threshold
		if (currentZoom < CLUSTER_ZOOM_THRESHOLD) {
			return createClusters(prioritizedBusinesses, currentZoom);
		}

		// Mark businesses for simple or detailed rendering
		return prioritizedBusinesses.map((business) => ({
			...business,
			renderType: currentZoom < SIMPLE_MARKER_ZOOM_THRESHOLD ? "simple" : "detailed",
		}));
	}, [visibleBusinesses, currentZoom, createClusters]);

	// Simple marker for zoomed out views (like Airbnb's dots)
	const SimpleMarker = memo(({ business, isActive }) => {
		const handleClick = useCallback(() => {
			handleMarkerClick(business);
		}, [business]);

		return (
			<div
				className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-100 ${isActive ? "bg-blue-600 scale-150 z-50" : business.isSponsored ? "bg-yellow-500 z-40" : "bg-gray-600 z-30"} hover:scale-125 border-2 border-white shadow-lg`}
				onClick={handleClick}
				style={{
					transformOrigin: "center",
				}}
			/>
		);
	});

	SimpleMarker.displayName = "SimpleMarker";

	// Enhanced marker component with crisp font rendering (for detailed view)
	const DetailedMarker = memo(({ business, isActive, isHovered }) => {
		const rating = business.ratings?.overall || 0;
		const price = business.price || "$";
		const isOpen = business.isOpenNow;

		const handleHover = useCallback(() => {
			handleMarkerHover(business);
		}, [business]);

		return (
			<div
				className={`relative cursor-pointer transition-all duration-150 ease-out ${isActive ? "z-50" : isHovered ? "z-40" : "z-30"}`}
				style={{
					transform: `scale(${isActive ? 1.1 : isHovered ? 1.05 : 1})`,
					transformOrigin: "center bottom",
				}}
				onMouseEnter={handleHover}
				onMouseLeave={handleMarkerLeave}
			>
				{/* Main marker bubble */}
				<div
					className={`
						relative bg-white rounded-lg shadow-lg border-2 px-3 py-2 min-w-[60px] text-center
						${isActive ? "border-blue-500 shadow-xl" : "border-gray-200 hover:border-gray-300"}
						${isOpen ? "" : "opacity-75"}
					`}
					style={{
						fontSmooth: "always",
						WebkitFontSmoothing: "antialiased",
						MozOsxFontSmoothing: "grayscale",
						textRendering: "optimizeLegibility",
					}}
				>
					{/* Price or Rating */}
					<div className="flex items-center justify-center gap-1">
						{price && (
							<span
								className="text-sm font-bold text-gray-900"
								style={{
									fontFeatureSettings: '"kern" 1, "liga" 1',
									letterSpacing: "-0.01em",
								}}
							>
								{price}
							</span>
						)}
						{rating > 0 && (
							<div className="flex items-center gap-0.5">
								<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
								<span
									className="text-xs font-medium text-gray-700"
									style={{
										fontFeatureSettings: '"kern" 1, "tnum" 1',
										letterSpacing: "-0.005em",
									}}
								>
									{rating.toFixed(1)}
								</span>
							</div>
						)}
					</div>

					{/* Business type indicator */}
					{business.categories && business.categories[0] && (
						<div
							className="text-xs text-gray-500 truncate max-w-[80px]"
							style={{
								fontFeatureSettings: '"kern" 1',
								letterSpacing: "0.01em",
							}}
						>
							{business.categories[0]}
						</div>
					)}

					{/* Status indicator */}
					<div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isOpen ? "bg-green-500" : "bg-red-500"}`} />

					{/* Premium/Sponsored indicator */}
					{business.isSponsored && (
						<div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
							<span
								className="text-xs text-white font-bold"
								style={{
									fontFeatureSettings: '"kern" 1',
									textShadow: "0 1px 2px rgba(0,0,0,0.3)",
								}}
							>
								★
							</span>
						</div>
					)}
				</div>

				{/* Pointer */}
				<div className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent ${isActive ? "border-t-blue-500" : "border-t-gray-200"}`} />
			</div>
		);
	});

	DetailedMarker.displayName = "DetailedMarker";

	// Optimized cluster marker component
	const ClusterMarker = memo(({ cluster }) => {
		const handleClusterClick = useCallback(() => {
			// Zoom in to show individual businesses
			const zoomLevel = Math.min(currentZoom + 3, 16);
			centerOn(cluster.coordinates.lat, cluster.coordinates.lng, null, zoomLevel);
		}, [cluster.coordinates]);

		return (
			<div
				className="relative cursor-pointer transition-transform duration-150 ease-out hover:scale-110"
				style={{
					transformOrigin: "center",
				}}
				onClick={handleClusterClick}
			>
				<div
					className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full border-4 border-white shadow-lg"
					style={{
						fontSmooth: "always",
						WebkitFontSmoothing: "antialiased",
						MozOsxFontSmoothing: "grayscale",
						textRendering: "optimizeLegibility",
					}}
				>
					<span
						className="font-bold text-sm"
						style={{
							fontFeatureSettings: '"kern" 1, "tnum" 1',
							letterSpacing: "-0.01em",
							textShadow: "0 1px 2px rgba(0,0,0,0.2)",
						}}
					>
						{cluster.count}
					</span>
				</div>
				<div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
					<span
						className="text-xs text-white font-bold"
						style={{
							fontFeatureSettings: '"kern" 1',
							textShadow: "0 1px 1px rgba(0,0,0,0.3)",
						}}
					>
						+
					</span>
				</div>
			</div>
		);
	});

	ClusterMarker.displayName = "ClusterMarker";

	// Memoized markers for better performance
	const markers = useMemo(() => {
		return optimizedBusinesses.map((item) => {
			const coords = item.coordinates;
			if (!coords) return null;

			if (item.type === "cluster") {
				return (
					<Marker key={item.id} latitude={coords.lat} longitude={coords.lng}>
						<ClusterMarker cluster={item} />
					</Marker>
				);
			}

			const isActive = activeBusinessId === item.id;
			const isHovered = hoveredBusiness === item.id;

			return (
				<Marker key={item.id} latitude={coords.lat} longitude={coords.lng} onClick={() => handleMarkerClick(item)}>
					{item.renderType === "simple" ? <SimpleMarker business={item} isActive={isActive} /> : <DetailedMarker business={item} isActive={isActive} isHovered={isHovered} />}
				</Marker>
			);
		});
	}, [optimizedBusinesses, activeBusinessId, hoveredBusiness, handleMarkerClick]);

	// Enhanced popup for hovered business (only show for detailed markers)
	const popupBusiness = useMemo(() => filteredBusinesses.find((b) => b.id === showPopup), [filteredBusinesses, showPopup]);

	// Only show popup for detailed markers (not simple dots)
	const shouldShowPopup = popupBusiness && showPopup && currentZoom >= 10;

	return (
		<>
			{markers}
			{shouldShowPopup && (
				<Popup latitude={popupBusiness.coordinates.lat} longitude={popupBusiness.coordinates.lng} onClose={() => setShowPopup(null)} closeButton={false} closeOnClick={false} offset={[0, -15]} className="business-popup">
					<div
						className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[300px] max-w-[350px]"
						style={{
							fontSmooth: "always",
							WebkitFontSmoothing: "antialiased",
							MozOsxFontSmoothing: "grayscale",
							textRendering: "optimizeLegibility",
						}}
						onMouseEnter={() => setHoveredBusiness(popupBusiness.id)}
						onMouseLeave={() => {
							setHoveredBusiness(null);
							setShowPopup(null);
						}}
					>
						<div className="space-y-3">
							{/* Header */}
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white">{popupBusiness.name}</h3>
									<div className="flex items-center gap-2 mt-1">
										{popupBusiness.ratings?.overall && (
											<div className="flex items-center gap-1">
												<div className="flex">
													{[...Array(5)].map((_, i) => (
														<Star key={i} className={`w-4 h-4 ${i < Math.floor(popupBusiness.ratings.overall) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
													))}
												</div>
												<span className="text-sm font-semibold text-gray-900 dark:text-white">{popupBusiness.ratings.overall.toFixed(1)}</span>
												<span className="text-xs text-gray-500">({popupBusiness.reviewCount || 0} reviews)</span>
											</div>
										)}
									</div>
								</div>
								<div className="flex flex-col items-end gap-1">
									<div className={`px-2 py-1 rounded-full text-xs font-medium ${popupBusiness.isOpenNow ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}>{popupBusiness.isOpenNow ? "Open" : "Closed"}</div>
									{popupBusiness.price && (
										<Badge variant="secondary" className="text-xs font-bold">
											{popupBusiness.price}
										</Badge>
									)}
								</div>
							</div>

							{/* Categories */}
							{popupBusiness.categories && (
								<div className="flex flex-wrap gap-1">
									{popupBusiness.categories.slice(0, 3).map((category, index) => (
										<Badge key={index} variant="outline" className="text-xs">
											{category}
										</Badge>
									))}
								</div>
							)}

							{/* Details */}
							<div className="space-y-2 text-sm">
								{popupBusiness.address && (
									<div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
										<MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
										<span className="text-sm">{popupBusiness.address}</span>
									</div>
								)}
								{popupBusiness.phone && (
									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
										<Phone className="w-4 h-4 flex-shrink-0" />
										<span className="text-sm">{popupBusiness.phone}</span>
									</div>
								)}
								{popupBusiness.statusMessage && (
									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
										<Clock className="w-4 h-4 flex-shrink-0" />
										<span className="text-sm">{popupBusiness.statusMessage}</span>
									</div>
								)}
							</div>

							{/* Action Button */}
							<div className="pt-2 border-t border-gray-100 dark:border-gray-700">
								<Button onClick={() => handleMarkerClick(popupBusiness)} className="w-full h-8 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
									View Details
									<ExternalLink className="w-3 h-3 ml-1" />
								</Button>
							</div>
						</div>
					</div>
				</Popup>
			)}
		</>
	);
};

export default memo(BusinessMarkers);
