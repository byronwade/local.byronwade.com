import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { supabase } from "@lib/supabaseClient";

const authLink = setContext(async (_, { headers }) => {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return {
		headers: {
			...headers,
			authorization: session ? `Bearer ${session.access_token}` : "",
			apikey: process.env.SUPABASE_ANON_KEY,
		},
	};
});

const httpLink = new HttpLink({
	uri: `${process.env.SUPABASE_URL}/graphql/v1`,
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export default client;
