/**
 * Map UI Custom Hook
 * Manages map UI state and interactions
 * Enterprise-level hook for map interface management
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { mapStyles } from "@lib/data/map";

export const useMapUI = (initialConfig = {}) => {
	const { initialStyle = mapStyles.streets, showControls = true, interactive = true, enableFullscreen = true, enableLayerSwitching = true } = initialConfig;

	// UI State
	const [mapStyle, setMapStyle] = useState(initialStyle);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showBusinessLayer, setShowBusinessLayer] = useState(true);
	const [showServiceAreas, setShowServiceAreas] = useState(false);
	const [activePanel, setActivePanel] = useState(null); // 'filters', 'business-info', etc.
	const [mapSettings, setMapSettings] = useState({
		showControls,
		interactive,
		pitch: 0,
		bearing: 0,
	});

	// UI interaction state
	const [selectedBusiness, setSelectedBusiness] = useState(null);
	const [hoveredBusiness, setHoveredBusiness] = useState(null);
	const [isSearching, setIsSearching] = useState(false);
	const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

	// Performance tracking
	const [uiMetrics, setUIMetrics] = useState({
		panelSwitches: 0,
		styleChanges: 0,
		businessSelections: 0,
	});

	const metricsRef = useRef(uiMetrics);

	// Update metrics helper
	const updateMetrics = useCallback((metric) => {
		const newMetrics = {
			...metricsRef.current,
			[metric]: metricsRef.current[metric] + 1,
		};
		metricsRef.current = newMetrics;
		setUIMetrics(newMetrics);
	}, []);

	// Map style management
	const changeMapStyle = useCallback(
		(newStyle) => {
			if (mapStyles[newStyle] || typeof newStyle === "string") {
				setMapStyle(mapStyles[newStyle] || newStyle);
				updateMetrics("styleChanges");
			}
		},
		[updateMetrics]
	);

	// Toggle map layers
	const toggleBusinessLayer = useCallback(() => {
		setShowBusinessLayer((prev) => !prev);
	}, []);

	const toggleServiceAreas = useCallback(() => {
		setShowServiceAreas((prev) => !prev);
	}, []);

	// Panel management
	const openPanel = useCallback(
		(panelName) => {
			setActivePanel(panelName);
			updateMetrics("panelSwitches");
		},
		[updateMetrics]
	);

	const closePanel = useCallback(() => {
		setActivePanel(null);
	}, []);

	const togglePanel = useCallback(
		(panelName) => {
			setActivePanel((prev) => (prev === panelName ? null : panelName));
			updateMetrics("panelSwitches");
		},
		[updateMetrics]
	);

	// Business selection management
	const selectBusiness = useCallback(
		(business) => {
			setSelectedBusiness(business);
			if (business) {
				setActivePanel("business-info");
				updateMetrics("businessSelections");
			}
		},
		[updateMetrics]
	);

	const clearSelection = useCallback(() => {
		setSelectedBusiness(null);
		setHoveredBusiness(null);
		if (activePanel === "business-info") {
			setActivePanel(null);
		}
	}, [activePanel]);

	// Business hover management
	const hoverBusiness = useCallback((business) => {
		setHoveredBusiness(business);
	}, []);

	const clearHover = useCallback(() => {
		setHoveredBusiness(null);
	}, []);

	// Fullscreen management
	const toggleFullscreen = useCallback(() => {
		if (enableFullscreen) {
			setIsFullscreen((prev) => !prev);
		}
	}, [enableFullscreen]);

	const enterFullscreen = useCallback(() => {
		if (enableFullscreen) {
			setIsFullscreen(true);
		}
	}, [enableFullscreen]);

	const exitFullscreen = useCallback(() => {
		setIsFullscreen(false);
	}, []);

	// Map settings management
	const updateMapSettings = useCallback((newSettings) => {
		setMapSettings((prev) => ({ ...prev, ...newSettings }));
	}, []);

	const toggle3D = useCallback(() => {
		setMapSettings((prev) => ({
			...prev,
			pitch: prev.pitch === 0 ? 45 : 0,
		}));
	}, []);

	const resetView = useCallback(() => {
		setMapSettings((prev) => ({
			...prev,
			pitch: 0,
			bearing: 0,
		}));
	}, []);

	// Search UI management
	const startSearch = useCallback(() => {
		setIsSearching(true);
	}, []);

	const endSearch = useCallback(() => {
		setIsSearching(false);
		setShowSearchSuggestions(false);
	}, []);

	const showSuggestions = useCallback(() => {
		setShowSearchSuggestions(true);
	}, []);

	const hideSuggestions = useCallback(() => {
		setShowSearchSuggestions(false);
	}, []);

	// Get current UI state
	const getUIState = useCallback(() => {
		return {
			mapStyle,
			isFullscreen,
			showBusinessLayer,
			showServiceAreas,
			activePanel,
			selectedBusiness,
			hoveredBusiness,
			isSearching,
			showSearchSuggestions,
			mapSettings,
		};
	}, [mapStyle, isFullscreen, showBusinessLayer, showServiceAreas, activePanel, selectedBusiness, hoveredBusiness, isSearching, showSearchSuggestions, mapSettings]);

	// Reset all UI state
	const resetUI = useCallback(() => {
		setMapStyle(initialStyle);
		setIsFullscreen(false);
		setShowBusinessLayer(true);
		setShowServiceAreas(false);
		setActivePanel(null);
		setSelectedBusiness(null);
		setHoveredBusiness(null);
		setIsSearching(false);
		setShowSearchSuggestions(false);
		setMapSettings({
			showControls,
			interactive,
			pitch: 0,
			bearing: 0,
		});
	}, [initialStyle, showControls, interactive]);

	// Get available map styles
	const getAvailableStyles = useCallback(() => {
		return Object.entries(mapStyles).map(([key, value]) => ({
			key,
			value,
			name: key.charAt(0).toUpperCase() + key.slice(1),
		}));
	}, []);

	return {
		// State
		mapStyle,
		isFullscreen,
		showBusinessLayer,
		showServiceAreas,
		activePanel,
		selectedBusiness,
		hoveredBusiness,
		isSearching,
		showSearchSuggestions,
		mapSettings,
		uiMetrics,

		// Map style actions
		changeMapStyle,
		getAvailableStyles,

		// Layer actions
		toggleBusinessLayer,
		toggleServiceAreas,

		// Panel actions
		openPanel,
		closePanel,
		togglePanel,

		// Business actions
		selectBusiness,
		clearSelection,
		hoverBusiness,
		clearHover,

		// Fullscreen actions
		toggleFullscreen,
		enterFullscreen,
		exitFullscreen,

		// Map settings actions
		updateMapSettings,
		toggle3D,
		resetView,

		// Search actions
		startSearch,
		endSearch,
		showSuggestions,
		hideSuggestions,

		// Utilities
		getUIState,
		resetUI,
	};
};

export default useMapUI;
