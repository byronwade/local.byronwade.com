/**
 * Reverse Geocoding API Route
 * Converts coordinates (lat, lng) to human-readable addresses
 *
 * Current implementation uses mock data for development
 * TODO: Replace with real geocoding service (Google Maps, Mapbox, etc.) for production
 */
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const lat = parseFloat(searchParams.get("lat"));
	const lng = parseFloat(searchParams.get("lng"));

	// Validate input parameters
	if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
		return new Response(
			JSON.stringify({
				error: "Valid lat and lng parameters are required",
				details: "Both latitude and longitude must be valid numbers",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	// Validate coordinate ranges
	if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
		return new Response(
			JSON.stringify({
				error: "Invalid coordinate ranges",
				details: "Latitude must be between -90 and 90, longitude between -180 and 180",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}

	try {
		// Development mock data - covers various regions for testing
		const mockAddresses = {
			// Georgia locations
			"34.4673,-84.4294": { city: "Jasper", state: "GA", country: "US", full: "Jasper, GA, USA" },
			"33.7490,-84.3880": { city: "Atlanta", state: "GA", country: "US", full: "Atlanta, GA, USA" },
			"33.9526,-84.5499": { city: "Marietta", state: "GA", country: "US", full: "Marietta, GA, USA" },
			"34.0754,-84.2941": { city: "Alpharetta", state: "GA", country: "US", full: "Alpharetta, GA, USA" },

			// Major US cities for broader testing
			"40.7128,-74.0060": { city: "New York", state: "NY", country: "US", full: "New York, NY, USA" },
			"34.0522,-118.2437": { city: "Los Angeles", state: "CA", country: "US", full: "Los Angeles, CA, USA" },
			"41.8781,-87.6298": { city: "Chicago", state: "IL", country: "US", full: "Chicago, IL, USA" },
			"29.7604,-95.3698": { city: "Houston", state: "TX", country: "US", full: "Houston, TX, USA" },
		};

		// Try to find exact match first
		const exactKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
		let locationData = mockAddresses[exactKey];

		// If no exact match, find nearest location (simple distance calculation)
		if (!locationData) {
			let minDistance = Infinity;
			let nearestLocation = null;

			for (const [coordString, location] of Object.entries(mockAddresses)) {
				const [mockLat, mockLng] = coordString.split(",").map(parseFloat);
				const distance = Math.sqrt(Math.pow(lat - mockLat, 2) + Math.pow(lng - mockLng, 2));

				if (distance < minDistance) {
					minDistance = distance;
					nearestLocation = location;
				}
			}

			// Use nearest location if within reasonable distance, otherwise use generic location
			locationData =
				minDistance < 1
					? nearestLocation
					: {
							city: "Location",
							state: "Unknown",
							country: "US",
							full: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
						};
		}

		// Return structured response compatible with both our app and Google Maps API format
		const response = {
			city: locationData.city,
			state: locationData.state,
			country: locationData.country,
			formatted_address: locationData.full,
			results: [
				{
					formatted_address: locationData.full,
					geometry: {
						location: { lat, lng },
					},
					address_components: [
						{
							long_name: locationData.city,
							short_name: locationData.city,
							types: ["locality", "political"],
						},
						{
							long_name: locationData.state,
							short_name: locationData.state,
							types: ["administrative_area_level_1", "political"],
						},
						{
							long_name: locationData.country,
							short_name: locationData.country,
							types: ["country", "political"],
						},
					],
				},
			],
			status: "OK",
		};

		console.log(`Reverse geocoded ${lat},${lng} to ${locationData.full}`);

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=3600", // Cache for 1 hour
			},
		});
	} catch (error) {
		console.error("Reverse geocoding error:", error);

		return new Response(
			JSON.stringify({
				error: "Failed to reverse geocode coordinates",
				details: error.message,
				status: "ERROR",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

/* 
TODO: For production, replace the mock implementation above with a real geocoding service:

Example Google Maps implementation:
```javascript
const response = await fetch(
	`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
);
const data = await response.json();
return new Response(JSON.stringify(data));
```

Example Mapbox implementation:
```javascript
const response = await fetch(
	`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
);
const data = await response.json();
// Transform Mapbox format to our expected format
```
*/
