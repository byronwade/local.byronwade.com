import React from "react";
import { Marker } from "react-map-gl";
import ThorbisIcon from "@/components/site/search/ThorbisIcon"; // Ensure this is the correct path to your ThorbisIcon component

const BusinessMarkers = ({ businesses = [], coordinates = {}, activeMarker, handleMarkerClick, flyToLocation }) => {
	return (
		<>
			{businesses.map((business) => {
				const coords = coordinates[business.id];
				if (!coords) return null;
				console.log(`Coordinates for ${business.name}: `, coords);
				return (
					<Marker
						key={business.id}
						coordinates={[coords.lat, coords.lng]}
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
