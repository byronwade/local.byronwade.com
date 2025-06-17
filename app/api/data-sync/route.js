import { NextResponse } from "next/server";
import algoliasearch from "algoliasearch";
import businessesData from "@lib/businesses.json";

const algoliaClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "mock-app-id", process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY || "mock-admin-key");
const index = algoliaClient.initIndex("businesses");

// Function to sync businesses from local JSON data to Algolia
const syncLocalBusinessesToAlgolia = async () => {
	try {
		// Skip Algolia sync if no credentials provided (development mode)
		if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY) {
			console.log("Skipping Algolia sync - no credentials provided (development mode)");
			return;
		}

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

// Mock function to simulate API businesses sync (since we're not using real GraphQL)
const syncApiBusinessesToAlgolia = async () => {
	try {
		console.log("Mock API businesses sync - skipping in development mode");
		// In development mode, we don't sync from API since we're using mock data
		return;
	} catch (error) {
		console.error("Error in mock API businesses sync:", error);
	}
};

// Sync all businesses to Algolia
export async function GET() {
	try {
		await syncLocalBusinessesToAlgolia();
		await syncApiBusinessesToAlgolia();

		return NextResponse.json({ message: "Data synced successfully (mock mode)" }, { status: 200 });
	} catch (error) {
		console.error("Error syncing data:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
