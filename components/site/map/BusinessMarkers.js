import React, { memo, useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Marker, Popup } from "react-map-gl";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Star, MapPin, Phone, Clock, ExternalLink, DollarSign } from "lucide-react";
import useBusinessStore from "@store/useBusinessStore";
import useMapStore from "@store/useMapStore";

const BusinessMarkers = () => {
	const { filteredBusinesses, activeBusinessId, setActiveBusinessId, setSelectedBusiness } = useBusinessStore();
	const { centerOn, mapRef } = useMapStore();
	const [hoveredBusiness, setHoveredBusiness] = useState(null);
	const [showPopup, setShowPopup] = useState(null);
	const [currentZoom, setCurrentZoom] = useState(10);
	const [mapBounds, setMapBounds] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);

	// Debouncing refs
	const debounceTimeoutRef = useRef(null);
	const lastUpdateRef = useRef(0);

	// Track zoom level and bounds for optimization with debouncing
	useEffect(() => {
		if (mapRef) {
			const updateMapState = () => {
				const now = Date.now();

				// Debounce rapid updates (like during continuous zoom/pan)
				if (debounceTimeoutRef.current) {
					clearTimeout(debounceTimeoutRef.current);
				}

				setIsProcessing(true);

				debounceTimeoutRef.current = setTimeout(() => {
					const zoom = mapRef.getZoom();
					const bounds = mapRef.getBounds();
					setCurrentZoom(zoom);
					setMapBounds(bounds);
					setIsProcessing(false);
					lastUpdateRef.current = now;
				}, 150); // 150ms debounce
			};

			// Immediate update for initial load
			const initialUpdate = () => {
				const zoom = mapRef.getZoom();
				const bounds = mapRef.getBounds();
				setCurrentZoom(zoom);
				setMapBounds(bounds);
			};

			mapRef.on("zoom", updateMapState);
			mapRef.on("move", updateMapState);
			mapRef.on("zoomend", initialUpdate);
			mapRef.on("moveend", initialUpdate);

			// Initial state
			initialUpdate();

			return () => {
				if (debounceTimeoutRef.current) {
					clearTimeout(debounceTimeoutRef.current);
				}
				mapRef.off("zoom", updateMapState);
				mapRef.off("move", updateMapState);
				mapRef.off("zoomend", initialUpdate);
				mapRef.off("moveend", initialUpdate);
			};
		}
	}, [mapRef]);

	// Memoized handlers for better performance
	const handleMarkerClick = useCallback(
		(business) => {
			setActiveBusinessId(business.id);
			setSelectedBusiness(business); // Set selected business for details pane

			// Simplified coordinate validation
			const { coordinates, serviceArea } = business;
			if (coordinates && coordinates.lat && coordinates.lng) {
				const radius = serviceArea && serviceArea.type === "radius" ? serviceArea.value : null;
				centerOn(coordinates.lat, coordinates.lng, radius);
			} else {
				console.error("Invalid business coordinates:", business.name, coordinates);
			}

			setShowPopup(null); // Close popup when selecting business
		},
		[setActiveBusinessId, setSelectedBusiness, centerOn]
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

	// Enhanced viewport-based filtering with aggressive culling
	const visibleBusinesses = useMemo(() => {
		if (!mapBounds || !filteredBusinesses.length) return [];

		// Add buffer around viewport based on zoom level for smoother panning
		const getViewportBuffer = (zoom) => {
			if (zoom < 7) return 0.5; // Large buffer for zoomed out views
			if (zoom < 10) return 0.2; // Medium buffer
			if (zoom < 13) return 0.1; // Small buffer
			return 0.05; // Minimal buffer for close views
		};

		const buffer = getViewportBuffer(currentZoom);
		const south = mapBounds.getSouth() - buffer;
		const north = mapBounds.getNorth() + buffer;
		const west = mapBounds.getWest() - buffer;
		const east = mapBounds.getEast() + buffer;

		// Pre-filter businesses within expanded viewport
		const viewportBusinesses = filteredBusinesses.filter((business) => {
			if (!business.coordinates) return false;

			const { lat, lng } = business.coordinates;
			return lat >= south && lat <= north && lng >= west && lng <= east;
		});

		// For very zoomed out views, apply additional aggressive filtering
		if (currentZoom < 6) {
			// Only include businesses that are likely to be visible or important
			return viewportBusinesses.filter((business) => {
				// Always include sponsored businesses
				if (business.isSponsored) return true;

				// Include highly rated businesses with many reviews
				if (business.ratings?.overall >= 4.5 && business.reviewCount >= 50) return true;

				// Include businesses that are currently open and well-rated
				if (business.isOpenNow && business.ratings?.overall >= 4.0) return true;

				// For very sparse areas, include any business with some reviews
				return business.reviewCount >= 10;
			});
		}

		return viewportBusinesses;
	}, [filteredBusinesses, mapBounds, currentZoom]);

	// Clustering algorithm optimized for performance
	const createClusters = useCallback((businesses, zoom, customDistance = null) => {
		const clusters = [];
		const processed = new Set();

		// Use custom distance if provided, otherwise calculate based on zoom
		const clusterDistance = customDistance || Math.max(0.01, 0.1 / Math.pow(2, zoom - 5));

		// Performance optimization: for very large datasets, use spatial indexing
		if (businesses.length > 1000) {
			// Create a simple spatial grid for faster clustering
			const gridSize = clusterDistance;
			const grid = new Map();

			businesses.forEach((business) => {
				if (!business.coordinates) return;

				const gridX = Math.floor(business.coordinates.lat / gridSize);
				const gridY = Math.floor(business.coordinates.lng / gridSize);
				const gridKey = `${gridX},${gridY}`;

				if (!grid.has(gridKey)) {
					grid.set(gridKey, []);
				}
				grid.get(gridKey).push(business);
			});

			// Create clusters from grid cells
			grid.forEach((cellBusinesses) => {
				if (cellBusinesses.length === 1) {
					clusters.push({
						...cellBusinesses[0],
						type: "single",
						renderType: zoom < 10 ? "simple" : "detailed",
					});
				} else {
					// Multiple businesses in same cell - create cluster
					const centerLat = cellBusinesses.reduce((sum, b) => sum + b.coordinates.lat, 0) / cellBusinesses.length;
					const centerLng = cellBusinesses.reduce((sum, b) => sum + b.coordinates.lng, 0) / cellBusinesses.length;

					clusters.push({
						id: `cluster-${cellBusinesses[0].id}`,
						type: "cluster",
						coordinates: { lat: centerLat, lng: centerLng },
						businesses: cellBusinesses,
						count: cellBusinesses.length,
						renderType: "cluster",
					});
				}
			});

			return clusters;
		}

		// Original clustering algorithm for smaller datasets
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

		// Much more aggressive zoom level thresholds for performance
		const CLUSTER_ZOOM_THRESHOLD = 14; // Increased from 12 - more clustering
		const SIMPLE_MARKER_ZOOM_THRESHOLD = 12; // Increased from 10 - more simple markers

		// DRASTICALLY reduced marker limits for performance
		const MAX_MARKERS_PER_ZOOM = {
			1: 10, // World view - only show 10 major markers
			3: 15, // Country view - 15 markers
			5: 25, // State view - 25 markers
			7: 50, // Regional view - 50 markers
			9: 100, // City view - 100 markers
			11: 200, // District view - 200 markers
			13: 500, // Neighborhood view - 500 markers
			15: 1000, // Street view - 1000 markers
			17: 2000, // Very close - all markers
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
			return MAX_MARKERS_PER_ZOOM[1]; // Default to most restrictive (10 markers)
		};

		const maxMarkers = getMaxMarkers(currentZoom);

		// Early exit for very zoomed out views - show only top businesses
		if (currentZoom < 5) {
			// For very zoomed out views, only show the absolute best businesses
			const topBusinesses = visibleBusinesses
				.filter((business) => {
					// Only show sponsored OR highly rated businesses
					return business.isSponsored || (business.ratings?.overall >= 4.5 && business.reviewCount >= 100);
				})
				.sort((a, b) => {
					// Prioritize sponsored first, then by rating + review count
					if (a.isSponsored && !b.isSponsored) return -1;
					if (!a.isSponsored && b.isSponsored) return 1;

					const scoreA = (a.ratings?.overall || 0) * Math.log(a.reviewCount || 1);
					const scoreB = (b.ratings?.overall || 0) * Math.log(b.reviewCount || 1);
					return scoreB - scoreA;
				})
				.slice(0, maxMarkers)
				.map((business) => ({
					...business,
					renderType: "simple",
				}));

			return topBusinesses;
		}

		// Improved clustering distance based on zoom - more aggressive clustering at lower zooms
		const getClusterDistance = (zoom) => {
			if (zoom < 7) return 0.5; // Very aggressive clustering
			if (zoom < 9) return 0.2; // Aggressive clustering
			if (zoom < 11) return 0.1; // Moderate clustering
			if (zoom < 13) return 0.05; // Light clustering
			return 0.02; // Minimal clustering
		};

		// Performance optimization: sample businesses if there are too many
		let workingBusinesses = visibleBusinesses;
		if (workingBusinesses.length > maxMarkers * 3) {
			// If we have way too many businesses, sample them intelligently
			const sponsored = workingBusinesses.filter((b) => b.isSponsored);
			const highRated = workingBusinesses.filter((b) => !b.isSponsored && b.ratings?.overall >= 4.0);
			const regular = workingBusinesses.filter((b) => !b.isSponsored && b.ratings?.overall < 4.0);

			// Take all sponsored, sample from high rated, minimal from regular
			const sampleSize = maxMarkers * 2;
			workingBusinesses = [...sponsored, ...highRated.slice(0, Math.floor(sampleSize * 0.7)), ...regular.slice(0, Math.floor(sampleSize * 0.3))].slice(0, sampleSize);
		}

		// If we have too many markers, prioritize more aggressively
		if (workingBusinesses.length > maxMarkers) {
			workingBusinesses = workingBusinesses
				.sort((a, b) => {
					// Much more aggressive prioritization

					// Sponsored businesses get huge boost
					if (a.isSponsored && !b.isSponsored) return -1;
					if (!a.isSponsored && b.isSponsored) return 1;

					// Then by combined score (rating * log(reviews))
					const scoreA = (a.ratings?.overall || 0) * Math.log((a.reviewCount || 0) + 1);
					const scoreB = (b.ratings?.overall || 0) * Math.log((b.reviewCount || 0) + 1);

					if (Math.abs(scoreA - scoreB) > 0.1) {
						return scoreB - scoreA;
					}

					// If similar scores, prefer businesses that are currently open
					if (a.isOpenNow && !b.isOpenNow) return -1;
					if (!a.isOpenNow && b.isOpenNow) return 1;

					return 0;
				})
				.slice(0, maxMarkers);
		}

		// Apply clustering if zoom is below threshold
		if (currentZoom < CLUSTER_ZOOM_THRESHOLD) {
			return createClusters(workingBusinesses, currentZoom, getClusterDistance(currentZoom));
		}

		// Mark businesses for simple or detailed rendering
		return workingBusinesses.map((business) => ({
			...business,
			renderType: currentZoom < SIMPLE_MARKER_ZOOM_THRESHOLD ? "simple" : "detailed",
		}));
	}, [visibleBusinesses, currentZoom, createClusters]);

	// Virtual rendering: only render markers that are actually visible
	const virtualizedMarkers = useMemo(() => {
		if (!optimizedBusinesses.length) {
			console.log("No optimizedBusinesses:", optimizedBusinesses.length);
			return [];
		}

		// For debugging, let's temporarily be less aggressive with filtering
		console.log("Optimized businesses before filtering:", optimizedBusinesses.length);

		// Get first X businesses to ensure something shows up
		const maxInitialRender = currentZoom < 5 ? 50 : currentZoom < 8 ? 100 : currentZoom < 11 ? 200 : currentZoom < 13 ? 500 : 1000;

		console.log("Max render count for zoom level", currentZoom, ":", maxInitialRender);

		// Take first N businesses for now to ensure they show
		const visibleMarkers = optimizedBusinesses.slice(0, maxInitialRender);

		console.log("Returning", visibleMarkers.length, "visible markers");
		return visibleMarkers;
	}, [optimizedBusinesses, currentZoom]);

	// Enhanced marker component with modern design (for detailed view)
	const DetailedMarker = memo(({ business, isActive, isHovered }) => {
		const rating = business.ratings?.overall || 0;
		const price = business.price || "$";
		const isOpen = business.isOpenNow;

		const handleHover = useCallback(() => {
			handleMarkerHover(business);
		}, [business]);

		return (
			<div
				className={`relative cursor-pointer transition-all duration-200 ease-out ${isActive ? "z-50" : isHovered ? "z-40" : "z-30"}`}
				style={{
					transform: `scale(${isActive ? 1.15 : isHovered ? 1.08 : 1})`,
					transformOrigin: "center bottom",
				}}
				onMouseEnter={handleHover}
				onMouseLeave={handleMarkerLeave}
			>
				{/* Modern marker design */}
				<div
					className={`
						relative bg-white rounded-full shadow-lg border-3 px-4 py-2 min-w-[70px] text-center
						${isActive ? "border-blue-500 shadow-2xl bg-blue-50" : "border-white hover:border-gray-100"}
						${isOpen ? "" : "opacity-80"}
						${business.isSponsored ? "ring-2 ring-yellow-400 ring-opacity-50" : ""}
					`}
					style={{
						// Google Maps style font rendering
						fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
						fontSize: "14px",
						fontWeight: "500",
						color: "#202124",
						// Anti-aliasing and smoothing
						fontSmooth: "always",
						WebkitFontSmoothing: "antialiased",
						MozOsxFontSmoothing: "grayscale",
						textRendering: "optimizeLegibility",
						// GPU acceleration for crisp rendering
						transform: "translateZ(0)",
						backfaceVisibility: "hidden",
						WebkitBackfaceVisibility: "hidden",
						// Enhanced box shadow
						boxShadow: isActive ? "0 8px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)" : "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
					}}
				>
					{/* Price display */}
					<div className="flex items-center justify-center">
						<span
							className={`text-base font-bold ${isActive ? "text-blue-700" : "text-gray-900"}`}
							style={{
								fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
								fontSize: "14px",
								fontWeight: "600",
								letterSpacing: "-0.01em",
								lineHeight: "1.2",
								WebkitFontSmoothing: "antialiased",
								MozOsxFontSmoothing: "grayscale",
								textRendering: "optimizeLegibility",
							}}
						>
							{price}
						</span>
					</div>

					{/* Status indicator dot */}
					<div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${isOpen ? "bg-green-500" : "bg-red-500"}`} />

					{/* Premium/Sponsored star */}
					{business.isSponsored && (
						<div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
							<span
								className="text-sm text-white font-bold"
								style={{
									fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
									fontSize: "12px",
									fontWeight: "700",
									textShadow: "0 1px 2px rgba(0,0,0,0.3)",
									WebkitFontSmoothing: "antialiased",
									MozOsxFontSmoothing: "grayscale",
								}}
							>
								★
							</span>
						</div>
					)}
				</div>

				{/* Modern pointer/pin */}
				<div
					className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 ${isActive ? "border-l-[8px] border-r-[8px] border-t-[12px] border-t-blue-500" : "border-l-[6px] border-r-[6px] border-t-[10px] border-t-white"} border-transparent`}
					style={{
						filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
					}}
				/>
			</div>
		);
	});

	DetailedMarker.displayName = "DetailedMarker";

	// Simple marker component for performance (for simple view)
	const SimpleMarker = memo(({ business, isActive, isHovered }) => {
		const isOpen = business.isOpenNow;

		const handleHover = useCallback(() => {
			handleMarkerHover(business);
		}, [business]);

		return (
			<div
				className={`
					w-4 h-4 rounded-full border-2 border-white cursor-pointer transition-all duration-200 ease-out
					${isActive ? "scale-150 z-50" : isHovered ? "scale-125 z-40" : "scale-100 z-30"}
					${isOpen ? "bg-blue-500" : "bg-gray-400"}
					${business.isSponsored ? "ring-2 ring-yellow-400 ring-opacity-75" : ""}
				`}
				style={{
					transformOrigin: "center",
					boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.2)",
					// GPU acceleration
					transform: "translateZ(0)",
					backfaceVisibility: "hidden",
					WebkitBackfaceVisibility: "hidden",
				}}
				onMouseEnter={handleHover}
				onMouseLeave={handleMarkerLeave}
			/>
		);
	});

	SimpleMarker.displayName = "SimpleMarker";

	// Optimized cluster marker component with modern design
	const ClusterMarker = memo(({ cluster }) => {
		const handleClusterClick = useCallback(() => {
			// Simplified coordinate validation
			if (cluster.coordinates && cluster.coordinates.lat && cluster.coordinates.lng) {
				// Zoom in to show individual businesses
				const zoomLevel = Math.min(currentZoom + 3, 16);
				centerOn(cluster.coordinates.lat, cluster.coordinates.lng, null, zoomLevel);
			} else {
				console.error("Invalid cluster coordinates:", cluster);
			}
		}, [cluster.coordinates]);

		return (
			<div
				className="relative cursor-pointer transition-all duration-200 ease-out hover:scale-110"
				style={{
					transformOrigin: "center",
				}}
				onClick={handleClusterClick}
			>
				{/* Modern cluster design */}
				<div
					className="flex items-center justify-center w-14 h-14 bg-white text-gray-800 rounded-full border-4 border-blue-500 shadow-xl"
					style={{
						// Google Maps style font rendering for clusters
						fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
						fontSize: "16px",
						fontWeight: "600",
						color: "#202124",
						// Anti-aliasing and smoothing
						fontSmooth: "always",
						WebkitFontSmoothing: "antialiased",
						MozOsxFontSmoothing: "grayscale",
						textRendering: "optimizeLegibility",
						// Enhanced shadow
						boxShadow: "0 6px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)",
						// GPU acceleration for smooth rendering
						transform: "translateZ(0)",
						backfaceVisibility: "hidden",
						WebkitBackfaceVisibility: "hidden",
					}}
				>
					<span
						className="font-bold text-lg"
						style={{
							fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
							fontSize: "16px",
							fontWeight: "700",
							letterSpacing: "-0.01em",
							lineHeight: "1.1",
							// Enhanced text sharpening for cluster numbers
							WebkitFontSmoothing: "antialiased",
							MozOsxFontSmoothing: "grayscale",
							textRendering: "optimizeLegibility",
						}}
					>
						{cluster.count}
					</span>
				</div>

				{/* Cluster expansion indicator */}
				<div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
					<span
						className="text-xs text-white font-bold"
						style={{
							fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
							fontSize: "11px",
							fontWeight: "700",
							WebkitFontSmoothing: "antialiased",
							MozOsxFontSmoothing: "grayscale",
						}}
					>
						+
					</span>
				</div>
			</div>
		);
	});

	ClusterMarker.displayName = "ClusterMarker";

	// Memoized markers for better performance with virtual rendering
	const markers = useMemo(() => {
		console.log("Creating markers from virtualizedMarkers:", virtualizedMarkers.length);

		// Use requestIdleCallback or timeout to render markers in chunks for better performance
		const createdMarkers = virtualizedMarkers.map((item, index) => {
			const coords = item.coordinates;
			if (!coords) {
				console.log("No coordinates for item:", item.id, item.name);
				return null;
			}

			// Validate coordinates before creating marker
			if (typeof coords.lat !== "number" || typeof coords.lng !== "number" || isNaN(coords.lat) || isNaN(coords.lng)) {
				console.log("Invalid coordinates for item:", item.id, item.name, coords);
				return null;
			}

			if (index < 5) {
				// Log first 5 items for debugging
				console.log("Creating marker for:", {
					id: item.id,
					name: item.name,
					coords: coords,
					type: item.type,
				});
			}

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
					{item.renderType === "simple" ? <SimpleMarker business={item} isActive={isActive} isHovered={isHovered} /> : <DetailedMarker business={item} isActive={isActive} isHovered={isHovered} />}
				</Marker>
			);
		});

		const validMarkers = createdMarkers.filter((m) => m !== null);
		console.log("Valid markers created:", validMarkers.length, "out of", createdMarkers.length);
		return validMarkers;
	}, [virtualizedMarkers, activeBusinessId, hoveredBusiness, handleMarkerClick]);

	// Enhanced popup for hovered business (only show for detailed markers)
	const popupBusiness = useMemo(() => filteredBusinesses.find((b) => b.id === showPopup), [filteredBusinesses, showPopup]);

	// Only show popup for detailed markers (not simple dots)
	const shouldShowPopup = popupBusiness && showPopup && currentZoom >= 10;

	return (
		<>
			{markers}
			{shouldShowPopup && (
				<Popup
					latitude={popupBusiness.coordinates.lat}
					longitude={popupBusiness.coordinates.lng}
					onClose={() => setShowPopup(null)}
					closeButton={false}
					closeOnClick={false}
					offset={[0, -15]}
					className="!p-0 !bg-transparent !border-none !shadow-none"
					style={{
						background: "transparent",
						border: "none",
						boxShadow: "none",
						padding: 0,
						margin: 0,
					}}
				>
					<div
						className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[300px] max-w-[350px]"
						style={{
							// Enhanced font rendering for crisp text on maps
							fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
							fontSize: "14px",
							fontWeight: "400",
							lineHeight: "1.4",
							color: "#202124",
							// Anti-aliasing and smoothing
							fontSmooth: "always",
							WebkitFontSmoothing: "antialiased",
							MozOsxFontSmoothing: "grayscale",
							textRendering: "optimizeLegibility",
							fontOpticalSizing: "auto",
							// Prevent text compression/squishing
							textSizeAdjust: "100%",
							WebkitTextSizeAdjust: "100%",
							// GPU acceleration for crisp rendering
							transform: "translateZ(0)",
							backfaceVisibility: "hidden",
							WebkitBackfaceVisibility: "hidden",
							// Prevent subpixel issues
							WebkitTransform: "translate3d(0, 0, 0)",
							willChange: "auto",
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
									<h3
										className="font-bold text-lg leading-tight text-gray-900 dark:text-white"
										style={{
											fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
											fontSize: "16px",
											fontWeight: "500",
											lineHeight: "1.3",
											letterSpacing: "0",
											textRendering: "optimizeLegibility",
											WebkitFontSmoothing: "antialiased",
											MozOsxFontSmoothing: "grayscale",
										}}
									>
										{popupBusiness.name}
									</h3>
									<div className="flex items-center gap-2 mt-1">
										{popupBusiness.ratings?.overall && (
											<div className="flex items-center gap-1">
												<div className="flex">
													{[...Array(5)].map((_, i) => (
														<Star key={i} className={`w-4 h-4 ${i < Math.floor(popupBusiness.ratings.overall) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
													))}
												</div>
												<span
													className="text-sm font-semibold text-gray-900 dark:text-white"
													style={{
														fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
														fontSize: "13px",
														fontWeight: "500",
														WebkitFontSmoothing: "antialiased",
														MozOsxFontSmoothing: "grayscale",
													}}
												>
													{popupBusiness.ratings.overall.toFixed(1)}
												</span>
												<span
													className="text-xs text-gray-500"
													style={{
														fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
														fontSize: "12px",
														fontWeight: "400",
														WebkitFontSmoothing: "antialiased",
														MozOsxFontSmoothing: "grayscale",
													}}
												>
													({popupBusiness.reviewCount || 0} reviews)
												</span>
											</div>
										)}
									</div>
								</div>
								<div className="flex flex-col items-end gap-1">
									<div
										className={`px-2 py-1 rounded-full text-xs font-medium ${popupBusiness.isOpenNow ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}
										style={{
											fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
											fontSize: "11px",
											fontWeight: "500",
											WebkitFontSmoothing: "antialiased",
											MozOsxFontSmoothing: "grayscale",
										}}
									>
										{popupBusiness.isOpenNow ? "Open" : "Closed"}
									</div>
									{popupBusiness.price && (
										<Badge
											variant="secondary"
											className="text-xs font-bold"
											style={{
												fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
												fontSize: "11px",
												fontWeight: "500",
												WebkitFontSmoothing: "antialiased",
												MozOsxFontSmoothing: "grayscale",
											}}
										>
											{popupBusiness.price}
										</Badge>
									)}
								</div>
							</div>

							{/* Categories */}
							{popupBusiness.categories && (
								<div className="flex flex-wrap gap-1">
									{popupBusiness.categories.slice(0, 3).map((category, index) => (
										<Badge
											key={index}
											variant="outline"
											className="text-xs"
											style={{
												fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
												fontSize: "11px",
												fontWeight: "400",
												WebkitFontSmoothing: "antialiased",
												MozOsxFontSmoothing: "grayscale",
											}}
										>
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
										<span
											className="text-sm"
											style={{
												fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
												fontSize: "13px",
												fontWeight: "400",
												lineHeight: "1.4",
												WebkitFontSmoothing: "antialiased",
												MozOsxFontSmoothing: "grayscale",
											}}
										>
											{popupBusiness.address}
										</span>
									</div>
								)}
								{popupBusiness.phone && (
									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
										<Phone className="w-4 h-4 flex-shrink-0" />
										<span
											className="text-sm"
											style={{
												fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
												fontSize: "13px",
												fontWeight: "400",
												letterSpacing: "0.5px",
												WebkitFontSmoothing: "antialiased",
												MozOsxFontSmoothing: "grayscale",
											}}
										>
											{popupBusiness.phone}
										</span>
									</div>
								)}
								{popupBusiness.statusMessage && (
									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
										<Clock className="w-4 h-4 flex-shrink-0" />
										<span
											className="text-sm"
											style={{
												fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
												fontSize: "13px",
												fontWeight: "400",
												WebkitFontSmoothing: "antialiased",
												MozOsxFontSmoothing: "grayscale",
											}}
										>
											{popupBusiness.statusMessage}
										</span>
									</div>
								)}
							</div>

							{/* Action Buttons */}
							<div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-2">
								<Button
									onClick={() => {
										handleMarkerClick(popupBusiness);
										setShowPopup(null); // Close popup when opening details
									}}
									className="w-full h-8 text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
									style={{
										fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
										fontSize: "13px",
										fontWeight: "500",
										WebkitFontSmoothing: "antialiased",
										MozOsxFontSmoothing: "grayscale",
									}}
								>
									View Details
								</Button>
								<a
									href={`/biz/${
										popupBusiness.slug ||
										popupBusiness.name
											.toLowerCase()
											.replace(/[^a-z0-9\s-]/g, "")
											.replace(/\s+/g, "-")
											.replace(/-+/g, "-")
											.trim()
									}`}
									className="block"
								>
									<Button
										variant="outline"
										className="w-full h-8 text-sm"
										style={{
											fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
											fontSize: "13px",
											fontWeight: "500",
											WebkitFontSmoothing: "antialiased",
											MozOsxFontSmoothing: "grayscale",
										}}
									>
										View Profile
										<ExternalLink className="w-3 h-3 ml-1" />
									</Button>
								</a>
							</div>
						</div>
					</div>
				</Popup>
			)}
		</>
	);
};

export default memo(BusinessMarkers);
