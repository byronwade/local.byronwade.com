import React from "react";
import { Marker } from "react-map-gl";
import ThorbisIcon from "@components/site/map/ThorbisIcon";
import useBusinessStore from "@store/useBusinessStore";

const BusinessMarkers = () => {
	const { filteredBusinesses, handleMarkerClick, activeMarker } = useBusinessStore((state) => ({
		filteredBusinesses: state.filteredBusinesses,
		handleMarkerClick: state.handleMarkerClick,
		activeMarker: state.activeMarker,
	}));

	return (
		<>
			{filteredBusinesses.map((business, index) => {
				const coords = business.coordinates;
				if (!coords) return null;
				return (
					<Marker
						key={index}
						latitude={coords.lat}
						longitude={coords.lng}
						onClick={(e) => {
							e.originalEvent.stopPropagation(); // Prevent click propagation to the map
							handleMarkerClick(business);
						}}
					>
						<div className="z-50 text-2xl cursor-pointer">
							<ThorbisIcon number={index + 1} isActive={activeMarker === business.id} />
						</div>
					</Marker>
				);
			})}
		</>
	);
};

export default BusinessMarkers;
