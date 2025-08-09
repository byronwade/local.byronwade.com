// app/api/autocomplete/route.js


// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const input = searchParams.get("input");

		if (!input) {
			return Response.json({ predictions: [] }, { status: 200 });
		}

		const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(cities)&key=${process.env.GOOGLE_PLACES_API_KEY}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Google Places API error: ${response.status}`);
		}

		const data = await response.json();

		return Response.json({
			predictions: data.predictions || [],
		});
	} catch (error) {
		console.error("Autocomplete API error:", error);
		return Response.json({ error: "Failed to fetch autocomplete suggestions", predictions: [] }, { status: 500 });
	}
}
