import { NextResponse } from "next/server";
import algoliasearch from "algoliasearch";
import client from "@lib/apolloClient"; // Adjust the path as necessary
import { GET_BUSINESSES } from "@queries/getBusinesses"; // Adjust the path as necessary
import businessesData from "@lib/businesses.json";

const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = algoliaClient.initIndex("businesses");

// Function to sync businesses from local JSON data to Algolia
const syncLocalBusinessesToAlgolia = async () => {
	try {
		const objects = businessesData.businesses.map((business) => ({
			objectID: business.id,
			...business,
		}));
		await index.saveObjects(objects);
		console.log("Local businesses synced to Algolia successfully.");
	} catch (error) {
		console.error("Error syncing local businesses to Algolia:", error);
	}
};

// Function to sync businesses from GraphQL API to Algolia
const syncApiBusinessesToAlgolia = async () => {
	try {
		const { data } = await client.query({
			query: GET_BUSINESSES,
			variables: { first: 100 },
		});

		const businesses = data.businessesCollection.edges.map(({ node }) => node);

		const objects = businesses.map((business) => ({
			objectID: business.id,
			name: business.name,
			alias: business.alias,
			url: business.url,
			phone: business.phone,
			display_phone: business.display_phone,
			email: business.email,
			website: business.website,
			rating: business.rating,
			review_count: business.review_count,
			price: business.price,
			transactions: business.transactions,
			is_claimed: business.is_claimed,
			is_closed: business.is_closed,
			company_type_id: business.company_type_id,
			created_at: business.created_at,
			updated_at: business.updated_at,
			categories: business.categoriesCollection.edges.map((edge) => edge.node),
			location: business.locations,
			attributes: business.attributes,
			social_media: business.social_media,
			hours: business.hoursCollection.edges.map((edge) => edge.node),
			media: business.mediaCollection.edges.map((edge) => edge.node),
		}));

		await index.saveObjects(objects);
		console.log("API businesses synced to Algolia successfully.");
	} catch (error) {
		console.error("Error syncing API businesses to Algolia:", error);
	}
};

// Sync all businesses to Algolia
export async function GET() {
	try {
		await syncLocalBusinessesToAlgolia();
		await syncApiBusinessesToAlgolia();

		return NextResponse.json({ message: "Data synced successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error syncing data:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
