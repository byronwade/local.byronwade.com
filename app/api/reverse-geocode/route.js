export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const lat = parseFloat(searchParams.get("lat"));
	const lng = parseFloat(searchParams.get("lng"));

	if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
		return new Response(JSON.stringify({ error: "Valid lat and lng parameters are required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		// For now, return mock addresses based on coordinates
		// In production, you would use a real reverse geocoding service
		const mockAddresses = {
			"34.4673,-84.4294": "Jasper, GA",
			"33.7490,-84.3880": "Atlanta, GA",
			"33.9526,-84.5499": "Marietta, GA",
			"34.0754,-84.2941": "Alpharetta, GA",
		};

		const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
		const address = mockAddresses[key] || "Unknown Location";

		return new Response(
			JSON.stringify({
				results: [
					{
						formatted_address: address,
						address_components: [
							{ long_name: address.split(", ")[0], short_name: address.split(", ")[0], types: ["locality"] },
							{ long_name: address.split(", ")[1] || "GA", short_name: address.split(", ")[1] || "GA", types: ["administrative_area_level_1"] },
						],
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
		console.error("Reverse geocoding error:", error);
		return new Response(JSON.stringify({ error: "Failed to reverse geocode coordinates" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
