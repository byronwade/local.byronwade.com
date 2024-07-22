import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("query");

	if (!query) {
		return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
	}

	try {
		const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
			params: {
				input: query,
				types: "(regions)",
				components: "country:us",
				key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
			},
		});

		const suggestions = response.data.predictions
			.filter((prediction) => prediction.terms.some((term) => term.value.match(/^\d{5}$/)))
			.slice(0, 10)
			.map((prediction) => {
				const zipTerm = prediction.terms.find((term) => /^\d{5}$/.test(term.value));
				const cityTerm = prediction.terms.find((term) => !/^\d{5}$/.test(term.value));
				return {
					name: cityTerm ? cityTerm.value : prediction.description,
					zip: zipTerm ? zipTerm.value : prediction.place_id,
				};
			});

		return NextResponse.json({ suggestions });
	} catch (error) {
		console.error("Error fetching location suggestions:", error);
		return NextResponse.json({ error: "Error fetching location suggestions" }, { status: 500 });
	}
}
