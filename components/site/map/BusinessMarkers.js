import React from "react";
import { Marker } from "react-map-gl";
import ThorbisIcon from "@/components/site/map/ThorbisIcon"; // Ensure this is the correct path to your ThorbisIcon component
import useBusinessStore from "@/store/useBusinessStore";

const BusinessMarkers = ({ activeMarker, handleMarkerClick, flyToLocation }) => {
	const businesses = useBusinessStore((state) => state.filteredBusinesses);

	return (
		<>
			{businesses.map((business) => {
				const coords = business.coordinates;
				if (!coords) return null;
				return (
					<Marker
						key={business.id}
						latitude={coords.lat}
						longitude={coords.lng}
						onClick={() => {
							handleMarkerClick(business);
							flyToLocation(coords.lat, coords.lng, business.serviceArea.value);
						}}
					>
						<div className="z-50 text-2xl cursor-pointer">
							<ThorbisIcon number={business.id} isActive={activeMarker === business.id} />
						</div>
					</Marker>
				);
			})}
		</>
	);
};

export default BusinessMarkers;
