import { NextResponse } from "next/server";
import * as turf from "@turf/turf";
import fs from "fs";
import path from "path";

const businessesFilePath = path.join(process.cwd(), "businesses.json");
let businesses = [];

try {
	const rawData = fs.readFileSync(businessesFilePath, "utf-8");
	const parsedData = JSON.parse(rawData);
	businesses = parsedData.businesses || [];
} catch (error) {
	console.error("Error reading or parsing businesses.json:", error);
}

export async function GET(request) {
	const url = new URL(request.url);
	const southWestLat = parseFloat(url.searchParams.get("southWestLat"));
	const southWestLng = parseFloat(url.searchParams.get("southWestLng"));
	const northEastLat = parseFloat(url.searchParams.get("northEastLat"));
	const northEastLng = parseFloat(url.searchParams.get("northEastLng"));

	if (isNaN(southWestLat) || isNaN(southWestLng) || isNaN(northEastLat) || isNaN(northEastLng)) {
		return NextResponse.json({ error: "Invalid bounding box coordinates" }, { status: 400 });
	}

	// Create a turf bounding box from the coordinates
	const boundingBox = turf.bboxPolygon([southWestLng, southWestLat, northEastLng, northEastLat]);

	// console.log("Bounding box:", { southWestLat, southWestLng, northEastLat, northEastLng });
	// console.log("Bounding box polygon:", boundingBox);

	if (!Array.isArray(businesses)) {
		console.error("Businesses data is not an array:", businesses);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}

	// Filter businesses within the bounding box
	const filteredBusinesses = businesses.filter((business) => {
		const { lat, lng } = business.coordinates;
		const businessPoint = turf.point([lng, lat]);
		const isInBoundingBox = turf.booleanPointInPolygon(businessPoint, boundingBox);
		// console.log(`Business: ${business.name}, Coordinates: [${lat}, ${lng}], In bounding box: ${isInBoundingBox}`);
		return isInBoundingBox;
	});

	return NextResponse.json({
		businesses: filteredBusinesses,
		total: filteredBusinesses.length,
		hasMore: false,
	});
}
