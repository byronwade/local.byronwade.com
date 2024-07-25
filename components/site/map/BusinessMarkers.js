import React, { memo, useEffect, useMemo } from "react";
import { Marker } from "react-map-gl";
import useBusinessStore from "@store/useBusinessStore";
import useMapStore from "@store/useMapStore";
import ThorbisIcon from "@components/site/map/ThorbisIcon";

const BusinessMarkers = () => {
	const { filteredBusinesses, activeBusinessId, setActiveBusinessId } = useBusinessStore();
	const { centerOn } = useMapStore();

	const handleMarkerClick = (business) => {
		setActiveBusinessId(business.id);
		const { coordinates, serviceArea } = business;
		const radius = serviceArea && serviceArea.type === "radius" ? serviceArea.value : null;
		if (coordinates) {
			centerOn(coordinates.lat, coordinates.lng, radius);
		}
	};

	const markers = useMemo(() => {
		return filteredBusinesses.map((business) => {
			const coords = business.coordinates;
			if (!coords) return null;
			return (
				<Marker key={business.id} latitude={coords.lat} longitude={coords.lng} onClick={() => handleMarkerClick(business)}>
					<div className="z-50 text-2xl cursor-pointer">
						<ThorbisIcon number={business.id} isActive={activeBusinessId === business.id} />
					</div>
				</Marker>
			);
		});
	}, [filteredBusinesses, activeBusinessId]);

	return <>{markers}</>;
};

export default memo(BusinessMarkers);
