import React from "react";
import { Source, Layer } from "react-map-gl";
import useBusinessStore from "@store/useBusinessStore";

const ServiceArea = () => {
	const { selectedServiceArea } = useBusinessStore((state) => ({
		selectedServiceArea: state.selectedServiceArea,
	}));

	if (!selectedServiceArea) return null;

	return (
		<Source id="selected-service-area" type="geojson" data={selectedServiceArea}>
			<Layer
				id="service-area-fill"
				type="fill"
				paint={{
					"fill-color": "#ff0000",
					"fill-opacity": 0.2,
				}}
			/>
			<Layer
				id="service-area-outline"
				type="line"
				paint={{
					"line-color": "#111",
					"line-width": 4,
				}}
			/>
		</Source>
	);
};

export default ServiceArea;
