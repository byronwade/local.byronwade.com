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

	try {
		const { hits } = await index.search(query, {
			aroundLatLngViaIP: false,
			insideBoundingBox: `${north},${west},${south},${east}`,
			hitsPerPage: 1000,
			facetFilters: [[`categories:${query}`, `name:${query}`, `display_phone:${query}`, `email:${query}`, `addresses:${query}`]],
		});
		console.log("Algolia results:", hits);
		return new Response(JSON.stringify({ businesses: hits }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error fetching data from Algolia:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
