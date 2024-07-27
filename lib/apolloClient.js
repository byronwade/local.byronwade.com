import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
	link: new HttpLink({
		uri: `${process.env.SUPABASE_URL}/graphql/v1`,
		headers: {
			apikey: process.env.SUPABASE_ANON_KEY,
			authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
		},
	}),
	cache: new InMemoryCache(),
});

export default client;
