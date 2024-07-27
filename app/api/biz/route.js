import businessesData from "@lib/businesses.json";

export async function GET(req) {
    const url = new URL(req.url);
	const zoom = parseInt(url.searchParams.get("zoom"), 10);
	const north = parseFloat(url.searchParams.get("north"));
	const south = parseFloat(url.searchParams.get("south"));
	const east = parseFloat(url.searchParams.get("east"));
	const west = parseFloat(url.searchParams.get("west"));
	const query = url.searchParams.get("query")?.toLowerCase() || "";

	console.log("Fetching businesses with zoom:", zoom);
	console.log("Bounds:", { north, south, east, west });
	console.log("Query:", query);

	let businesses;

	if (zoom < 5) {
		businesses = businessesData.businesses.filter((business) => business.topRated);
		console.log("Top rated businesses count:", businesses.length);
	} else if (zoom < 8) {
		businesses = businessesData.businesses.filter((business) => business.popular);
		console.log("Popular businesses count:", businesses.length);
	} else {
		businesses = businessesData.businesses;
		console.log("All businesses count:", businesses.length);
	}

	businesses = businesses.filter((business) => {
		const { lat, lng } = business.coordinates;
		const inBounds = lat >= south && lat <= north && lng >= west && lng <= east;
		const matchesQuery = business.name.toLowerCase().includes(query);
		return inBounds && matchesQuery;
	});

	console.log("Filtered businesses count:", businesses.length);

	return new Response(JSON.stringify({ businesses }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
