// app/api/autocomplete/route.js

import { NextResponse } from "next/server";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const input = searchParams.get("input");

	if (!input) {
		return NextResponse.json({ error: "Missing input parameter" }, { status: 400 });
	}

	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
	const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Error fetching autocomplete suggestions:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
