/**
 * BusinessMarkers Component (Refactored)
 * Clean, modular implementation using extracted components and hooks
 * Reduced from 936 lines to focused, maintainable architecture
 * Following enterprise-grade patterns for large-scale applications
 */

"use client";

import React from "react";
import { Marker } from "react-map-gl";
import { useMapMarkers } from "@lib/hooks/map/markers/useMapMarkers";
import { SimpleMarker, DetailedMarker, ClusterMarker, BusinessPopup } from "./markers";

const BusinessMarkers = () => {
	const {
		// Data
		optimizedBusinesses,

		// State
		hoveredBusiness,
		showPopup,
		activeBusinessId,

		// Handlers
		handleMarkerClick,
		handleMarkerHover,
		handleMarkerLeave,
		handleClusterClick,

		// Setters
		setShowPopup,
		setHoveredBusiness,
	} = useMapMarkers();

	// Early return if no businesses to render
	if (!optimizedBusinesses.length) {
		return null;
	}

	// Find popup business
	const popupBusiness = optimizedBusinesses.find((business) => business.id === showPopup && business.type === "single");

	return (
		<>
			{/* Render markers based on type and zoom level */}
			{optimizedBusinesses.map((item) => {
				if (!item.coordinates) return null;

				const { lat, lng } = item.coordinates;
				const isActive = item.id === activeBusinessId;

				return (
					<Marker
						key={item.id}
						longitude={lng}
						latitude={lat}
						anchor="bottom"
						style={{
							zIndex: isActive ? 1000 : item.type === "cluster" ? 800 : 500,
						}}
					>
						{item.type === "cluster" ? <ClusterMarker cluster={item} handleClusterClick={handleClusterClick} /> : item.renderType === "simple" ? <SimpleMarker business={item} isActive={isActive} handleMarkerHover={handleMarkerHover} handleMarkerLeave={handleMarkerLeave} /> : <DetailedMarker business={item} isActive={isActive} handleMarkerHover={handleMarkerHover} handleMarkerLeave={handleMarkerLeave} />}
					</Marker>
				);
			})}

			{/* Business popup */}
			{popupBusiness && (
				<BusinessPopup
					business={popupBusiness}
					showPopup={showPopup}
					onClose={() => setShowPopup(null)}
					onBusinessClick={handleMarkerClick}
					onHover={setHoveredBusiness}
					onLeave={() => {
						setHoveredBusiness(null);
						setShowPopup(null);
					}}
				/>
			)}
		</>
	);
};

export default BusinessMarkers;
