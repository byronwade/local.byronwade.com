"use client";
import React, { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
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
import Header from "@components/site/Header";
import UnifiedAIChat from "@components/shared/ai/UnifiedAIChat";
import { useSearchParams } from "next/navigation";

const MapContainer = dynamic(() => import("@components/site/map/MapContainer"), {
	ssr: false,
	loading: () => <FullScreenMapSkeleton />,
});

const SearchContainer = () => {
	const searchParams = useSearchParams();
	const { filteredBusinesses, activeBusinessId, selectedBusiness, setSelectedBusiness, clearSelectedBusiness, initializeWithMockData, loading, searchBusinesses, setActiveBusinessId } = useBusinessStore();
	const { searchQuery, searchLocation } = useSearchStore();
	const [isLoading, setIsLoading] = useState(true);
	const [panelSize, setPanelSize] = useState(25);
	const [showActivityFeed, setShowActivityFeed] = useState(false);
	const activeCardRef = useRef(null);
	const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);

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
		const query = searchParams.get("q");
		const location = searchParams.get("location");

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

	return (
		<div className="h-screen w-full flex flex-col bg-background overflow-hidden">
			{/* Main Header from Homepage */}
			<div className="flex-shrink-0">
				<Header />
			</div>

			{/* Main Content Area */}
			<div className="flex-1 min-h-0 relative">
				<ResizablePanelGroup direction="horizontal" className="h-full" onLayout={handlePanelResize}>
					{/* Sidebar Panel - Dynamic sizing based on content */}
					<ResizablePanel defaultSize={activeBusinessId ? 30 : 22} minSize={activeBusinessId ? 25 : 18} maxSize={activeBusinessId ? 45 : 35}>
						<div className="h-full bg-card border-r border-border overflow-hidden relative">
							{/* Business List - Default View */}
							<div className={`absolute inset-0 transition-all duration-500 ease-in-out ${!isAISidebarOpen ? "transform translate-x-0 opacity-100 z-10" : "transform -translate-x-full opacity-0 z-0"}`}>
								<BusinessCardList businesses={filteredBusinesses} loading={loading} onBusinessSelect={handleBusinessSelect} activeBusinessId={activeBusinessId} activeCardRef={activeCardRef} onAIClick={handleAIClick} />
							</div>

							{/* AI Chat Sidebar */}
							<div className={`absolute inset-0 transition-all duration-500 ease-in-out ${isAISidebarOpen ? "transform translate-x-0 opacity-100 z-10" : "transform translate-x-full opacity-0 z-0"}`}>{isAISidebarOpen && <UnifiedAIChat isOpen={isAISidebarOpen} onClose={handleAIClose} mode="sidebar" />}</div>
						</div>
					</ResizablePanel>

					{/* Resizable Handle */}
					<ResizableHandle withHandle />

					{/* Map Panel */}
					<ResizablePanel defaultSize={activeBusinessId ? 70 : 78}>
						<div className="h-full w-full relative overflow-hidden">
							<MapContainer businesses={filteredBusinesses} selectedBusiness={selectedBusiness} onBusinessSelect={handleBusinessSelect} />
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>

			{/* Loading Overlay */}
			{loading && (
				<div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
					<div className="bg-card rounded-lg p-6 shadow-2xl flex items-center gap-3 border border-border">
						<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
						<span className="text-sm font-medium text-card-foreground">Loading businesses...</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchContainer;
