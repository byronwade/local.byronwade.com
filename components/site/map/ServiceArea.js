// src/components/site/search/ServiceArea.js
import React from "react";
import { Source, Layer } from "react-map-gl";

const ServiceArea = ({ selectedServiceArea }) => {
	if (!selectedServiceArea) return null;

	return (
		<Source id="selected-service-area" type="geojson" data={selectedServiceArea}>
			<Layer
				id="service-area-fill"
				type="fill"
				paint={{
					"fill-color": "#ff0000",
					"fill-opacity": 0.3,
				}}
			/>
			<Layer
				id="service-area-outline"
				type="line"
				paint={{
					"line-color": "#ff0000",
					"line-width": 2,
				}}
			/>
		</Source>
	);
};

export default ServiceArea;
