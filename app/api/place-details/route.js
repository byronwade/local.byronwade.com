import { NextResponse } from "next/server";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const placeId = searchParams.get("place_id");

	if (!placeId) {
		return NextResponse.json({ error: "Place ID is required" }, { status: 400 });
	}

	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
	const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&key=${apiKey}`;

	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error("Failed to fetch place details");
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching place details:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
