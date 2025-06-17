// lib/utils/algoliaClient.js - Mock Algolia client for development
import businessesData from "./businesses.json";

// Mock Algolia client
const createMockAlgoliaClient = () => {
	return {
		initIndex: (indexName) => ({
			search: async (query, options = {}) => {
				console.log(`Mock Algolia search for "${query}" in index "${indexName}"`);

				// Simulate search delay
				await new Promise((resolve) => setTimeout(resolve, 200));

				// Mock search through businesses.json
				const businesses = businessesData.businesses || [];
				const filteredBusinesses = businesses.filter((business) => business.name.toLowerCase().includes(query.toLowerCase()) || business.categories?.some((cat) => cat.title?.toLowerCase().includes(query.toLowerCase())));

				const hitsPerPage = options.hitsPerPage || 10;
				const hits = filteredBusinesses.slice(0, hitsPerPage);

				console.log(`Mock Algolia returned ${hits.length} results`);

				return {
					hits,
					nbHits: hits.length,
					page: 0,
					nbPages: Math.ceil(filteredBusinesses.length / hitsPerPage),
					hitsPerPage,
					processingTimeMS: 5,
					query,
				};
			},
			saveObjects: async (objects) => {
				console.log(`Mock Algolia saveObjects: ${objects.length} objects`);
				// Simulate save delay
				await new Promise((resolve) => setTimeout(resolve, 300));
				return { objectIDs: objects.map((obj, index) => obj.objectID || `mock-id-${index}`) };
			},
		}),
	};
};

const algoliaClient = createMockAlgoliaClient();
export const algoliaIndex = algoliaClient.initIndex("businesses");

export default algoliaClient;
