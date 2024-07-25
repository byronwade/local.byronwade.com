import businessesData from "@lib/businesses.json";

export async function GET(req) {
	const url = new URL(req.url);
	const zoom = parseInt(url.searchParams.get("zoom"), 10);
	const north = parseFloat(url.searchParams.get("north"));
	const south = parseFloat(url.searchParams.get("south"));
	const east = parseFloat(url.searchParams.get("east"));
	const west = parseFloat(url.searchParams.get("west"));

	console.log("Fetching businesses with zoom:", zoom);
	console.log("Bounds:", { north, south, east, west });

	let businesses;

	if (zoom < 5) {
		// Return a limited set of businesses for very low zoom levels
		businesses = businessesData.businesses.filter((business) => business.topRated);
		console.log("Top rated businesses count:", businesses.length);
	} else if (zoom < 8) {
		// Return more businesses for medium zoom levels
		businesses = businessesData.businesses.filter((business) => business.popular);
		console.log("Popular businesses count:", businesses.length);
	} else {
		// Return all businesses for high zoom levels
		businesses = businessesData.businesses;
		console.log("All businesses count:", businesses.length);
	}

	// Filter businesses based on map bounds
	businesses = businesses.filter((business) => {
		const { lat, lng } = business.coordinates;
		const inBounds = lat >= south && lat <= north && lng >= west && lng <= east;
		//console.log(`Business: ${business.name}, In Bounds: ${inBounds}`);
		return inBounds;
	});

	console.log("Filtered businesses count:", businesses.length);

	return new Response(JSON.stringify({ businesses }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
