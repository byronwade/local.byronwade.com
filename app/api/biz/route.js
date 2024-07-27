import algoliasearch from "algoliasearch";

const algoliaClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);
const index = algoliaClient.initIndex("businesses");

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

	// Fetch data from Algolia
	let algoliaResults = [];
	try {
		const { hits } = await index.search(query, {
			aroundLatLngViaIP: false,
			hitsPerPage: 1000,
			facetFilters: [`categories:${query}`, `name:${query}`, `display_phone:${query}`, `email:${query}`, `addresses:${query}`],
		});
		algoliaResults = hits;
		console.log("Algolia results:", algoliaResults);
	} catch (error) {
		console.error("Error fetching data from Algolia:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	// Convert Algolia results to a format similar to your JSON data
	const algoliaBusinesses = algoliaResults.map((hit) => ({
		id: hit.objectID,
		name: hit.name,
		coordinates: hit._geoloc || { lat: null, lng: null }, // Provide default values if coordinates are missing
		...hit, // Include other relevant fields from Algolia hits
	}));

	console.log("Algolia businesses count:", algoliaBusinesses.length);

	// Filter combined results based on bounding box and query
	const filteredBusinesses = algoliaBusinesses.filter((business) => {
		const { lat, lng } = business.coordinates;
		if (lat === null || lng === null) {
			return false;
		}
		const inBounds = lat >= south && lat <= north && lng >= west && lng <= east;
		return inBounds;
	});

	console.log("Filtered businesses count:", filteredBusinesses.length);

	return new Response(JSON.stringify({ businesses: filteredBusinesses }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
