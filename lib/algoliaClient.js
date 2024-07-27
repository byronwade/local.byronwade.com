import algoliasearch from "algoliasearch";

const algoliaClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);
export const algoliaIndex = algoliaClient.initIndex("businesses");

// Define synonyms to handle variations in search queries
const synonyms = [
	{
		objectID: "and-vs-&",
		type: "synonym",
		synonyms: ["and", "&"],
	},
	{
		objectID: "plumbing",
		type: "synonym",
		synonyms: ["plumbing", "plumb"],
	},
	// Add more synonyms as needed
];

// Set synonyms to the index
algoliaIndex.saveSynonyms(synonyms).catch((err) => console.error("Error saving synonyms:", err));

// Configure typo tolerance
algoliaIndex
	.setSettings({
		typoTolerance: "min", // Adjust typo tolerance as needed
	})
	.catch((err) => console.error("Error setting typo tolerance:", err));

export default algoliaClient;