export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const address = searchParams.get("address");

	if (!address) {
		return new Response(JSON.stringify({ error: "Address parameter is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		// For now, return mock coordinates for Jasper, GA
		// In production, you would use a real geocoding service like Google Maps API
		const mockCoordinates = {
			"Jasper, GA": { lat: 34.4673, lng: -84.4294 },
			"Atlanta, GA": { lat: 33.749, lng: -84.388 },
			"Marietta, GA": { lat: 33.9526, lng: -84.5499 },
			"Alpharetta, GA": { lat: 34.0754, lng: -84.2941 },
		};

		const coords = mockCoordinates[address] || { lat: 34.4673, lng: -84.4294 }; // Default to Jasper, GA

		return new Response(
			JSON.stringify({
				results: [
					{
						geometry: {
							location: coords,
						},
						formatted_address: address,
					},
				],
				status: "OK",
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("Geocoding error:", error);
		return new Response(JSON.stringify({ error: "Failed to geocode address" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
