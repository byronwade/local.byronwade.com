"use client";
import React, { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, Settings, Filter, SortAsc, Grid, List, Maximize2, Activity } from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@components/ui/resizable";
import EnhancedSearchBox from "@components/shared/searchBox/EnhancedSearchBox";
import BusinessCardList from "@components/site/map/BusinessCardList";
import BusinessInfoPanel from "@components/site/map/BusinessInfoPanel";
import useBusinessStore from "@store/useBusinessStore";
import useSearchStore from "@store/useSearchStore";
import FullScreenMapSkeleton from "@components/site/map/FullScreenMapSkeleton";
import LiveActivityFeed from "@components/site/map/LiveActivityFeed";
import UnifiedAIChat from "@components/shared/ai/UnifiedAIChat";
import { useSearchParams } from "next/navigation";

// Direct import instead of dynamic import
import MapContainer from "@components/site/map/MapContainer";

const SearchContainer = ({ searchParams: propSearchParams }) => {
	const urlSearchParams = useSearchParams();
	const searchParams = propSearchParams || urlSearchParams;
	const { filteredBusinesses, activeBusinessId, selectedBusiness, setSelectedBusiness, clearSelectedBusiness, initializeWithMockData, loading, searchBusinesses, setActiveBusinessId } = useBusinessStore();
	const { searchQuery, searchLocation } = useSearchStore();
	const [isLoading, setIsLoading] = useState(true);
	const [panelSize, setPanelSize] = useState(25);
	const [showActivityFeed, setShowActivityFeed] = useState(false);
	const activeCardRef = useRef(null);
	const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
	const [showMap, setShowMap] = useState(true);
	const [headerHeight, setHeaderHeight] = useState(0);

	useEffect(() => {
		// Calculate header height
		const calculateHeaderHeight = () => {
			const header = document.querySelector("#header");
			if (header) {
				const height = header.offsetHeight;
				setHeaderHeight(height);
				console.log("Header height calculated:", height);
			}
		};

		// Calculate on mount and resize
		calculateHeaderHeight();
		window.addEventListener("resize", calculateHeaderHeight);

		// Multiple checks to ensure accurate calculation
		const timeouts = [setTimeout(calculateHeaderHeight, 100), setTimeout(calculateHeaderHeight, 500), setTimeout(calculateHeaderHeight, 1000)];

		return () => {
			window.removeEventListener("resize", calculateHeaderHeight);
			timeouts.forEach((timeout) => clearTimeout(timeout));
		};
	}, []);

	useEffect(() => {
		// Initialize with mock data immediately
		initializeWithMockData();
		setIsLoading(false);
	}, [initializeWithMockData]);

	useEffect(() => {
		if (filteredBusinesses.length > 0) {
			setIsLoading(false);
		}
	}, [filteredBusinesses]);

	// Handle URL parameters
	useEffect(() => {
		// Handle both URLSearchParams (from useSearchParams) and plain object (from props)
		const query = typeof searchParams?.get === "function" ? searchParams.get("q") : searchParams?.q || "";
		const location = typeof searchParams?.get === "function" ? searchParams.get("location") : searchParams?.location || "";

		// For now, don't override with search results if we have businesses
		if ((query || location) && filteredBusinesses.length === 0) {
			searchBusinesses(query || "", location || "");
		}
	}, [searchParams, searchBusinesses, filteredBusinesses.length]);

	const handlePanelResize = (sizes) => {
		setPanelSize(sizes[0]);
	};

	const togglePanelSize = () => {
		setPanelSize(panelSize === 25 ? 40 : 25);
	};

	const getResultsCount = () => {
		const count = filteredBusinesses.length;
		const openCount = filteredBusinesses.filter((b) => b.isOpenNow).length;
		return { total: count, open: openCount };
	};

	const { total, open } = getResultsCount();

	const handleBusinessSelect = (business) => {
		console.log("SearchContainer - handleBusinessSelect called with:", business?.name, "ID:", business?.id);
		setSelectedBusiness(business);
		setActiveBusinessId(business.id);
		console.log("SearchContainer - activeBusinessId set to:", business?.id);
		console.log("SearchContainer - Current store state:", { activeBusinessId, selectedBusiness });
	};

	const handleBusinessClose = () => {
		clearSelectedBusiness();
		setActiveBusinessId(null);
	};

	const handleAIClick = () => {
		setIsAISidebarOpen(true);
	};

	const handleAIClose = () => {
		setIsAISidebarOpen(false);
		// Clear any highlighted businesses when closing AI chat
		const { setHighlightedBusinesses } = useBusinessStore.getState();
		if (setHighlightedBusinesses) {
			setHighlightedBusinesses([]);
		}
	};

	const handleMapToggle = () => {
		setShowMap(!showMap);
	};

	// Calculate the content height by subtracting header height from viewport height
	const contentHeight = `calc(100vh - ${headerHeight}px)`;

	return (
		<div className="w-full flex flex-col bg-white dark:bg-neutral-900 overflow-hidden" style={{ height: contentHeight }}>
			{/* Main Content Area */}
			<div className="flex-1 min-h-0 relative">
				{showMap ? (
					<ResizablePanelGroup direction="horizontal" className="h-full" onLayout={handlePanelResize}>
						{/* Sidebar Panel - Better minimum width for proper header layout */}
						<ResizablePanel defaultSize={activeBusinessId ? 35 : 28} minSize={22} maxSize={85} className="lg:max-w-[45%] md:max-w-[65%] sm:max-w-[80%] max-w-[95%]">
							<div className="h-full bg-white dark:bg-neutral-900 border-r border-neutral-800 dark:border-neutral-700 overflow-hidden relative">
								{/* Business List - Default View */}
								<div className={`absolute inset-0 transition-all duration-500 ease-in-out ${!isAISidebarOpen ? "transform translate-x-0 opacity-100 z-10" : "transform -translate-x-full opacity-0 z-0"}`}>
									<BusinessCardList businesses={filteredBusinesses} loading={loading} onBusinessSelect={handleBusinessSelect} activeBusinessId={activeBusinessId} activeCardRef={activeCardRef} onAIClick={handleAIClick} showMap={showMap} onMapToggle={handleMapToggle} />
								</div>

								{/* AI Chat Sidebar */}
								<div className={`absolute inset-0 transition-all duration-500 ease-in-out ${isAISidebarOpen ? "transform translate-x-0 opacity-100 z-10" : "transform translate-x-full opacity-0 z-0"}`}>{isAISidebarOpen && <UnifiedAIChat isOpen={isAISidebarOpen} onClose={handleAIClose} mode="sidebar" />}</div>
							</div>
						</ResizablePanel>

						{/* Resizable Handle */}
						<ResizableHandle withHandle />

						{/* Map Panel */}
						<ResizablePanel defaultSize={activeBusinessId ? 65 : 72}>
							<div className="h-full w-full relative overflow-hidden">
								<MapContainer businesses={filteredBusinesses} selectedBusiness={selectedBusiness} onBusinessSelect={handleBusinessSelect} />
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				) : (
					/* List-only view - Full width */
					<div className="h-full w-full transition-all duration-500 ease-in-out bg-white dark:bg-neutral-900">
						<div className="h-full overflow-hidden relative">
							{/* Business List - Full Width View */}
							<div className={`absolute inset-0 transition-all duration-500 ease-in-out ${!isAISidebarOpen ? "transform translate-x-0 opacity-100 z-10" : "transform -translate-x-full opacity-0 z-0"}`}>
								<BusinessCardList businesses={filteredBusinesses} loading={loading} onBusinessSelect={handleBusinessSelect} activeBusinessId={activeBusinessId} activeCardRef={activeCardRef} onAIClick={handleAIClick} showMap={showMap} onMapToggle={handleMapToggle} listMode="full" />
							</div>

							{/* AI Chat Sidebar */}
							<div className={`absolute inset-0 transition-all duration-500 ease-in-out ${isAISidebarOpen ? "transform translate-x-0 opacity-100 z-10" : "transform translate-x-full opacity-0 z-0"}`}>{isAISidebarOpen && <UnifiedAIChat isOpen={isAISidebarOpen} onClose={handleAIClose} mode="sidebar" />}</div>
						</div>
					</div>
				)}
			</div>
			{/* Loading Overlay */}
			{loading && (
				<div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
					<div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-2xl flex items-center gap-3 border border-neutral-800 dark:border-neutral-700">
						<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
						<span className="text-sm font-medium text-card-foreground">Loading businesses...</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchContainer;
