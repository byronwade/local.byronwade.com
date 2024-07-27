import algoliasearch from "algoliasearch";

const algoliaClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

export const algoliaIndex = algoliaClient.initIndex("businesses");

export default algoliaClient;
