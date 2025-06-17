// lib/apolloClient.js - Mock Apollo Client for development

// Mock Apollo Client that returns mock data instead of making real GraphQL requests
const createMockApolloClient = () => {
	return {
		query: async ({ query, variables }) => {
			console.log("Mock GraphQL query:", query.definitions[0]?.name?.value || "Unknown query", variables);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 300));

			// Return mock data based on query type
			if (query.definitions[0]?.name?.value === "GetBusinesses") {
				return {
					data: {
						businessesCollection: {
							edges: [],
						},
					},
				};
			}

			if (query.definitions[0]?.name?.value === "GetUserRoles") {
				return {
					data: {
						usersCollection: {
							edges: [
								{
									node: {
										user_rolesCollection: {
											edges: [
												{
													node: {
														roles: {
															name: "user",
														},
													},
												},
											],
										},
									},
								},
							],
						},
					},
				};
			}

			// Default mock response
			return {
				data: {},
				errors: null,
			};
		},
		mutate: async ({ mutation, variables }) => {
			console.log("Mock GraphQL mutation:", mutation.definitions[0]?.name?.value || "Unknown mutation", variables);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 300));

			return {
				data: {},
				errors: null,
			};
		},
	};
};

const client = createMockApolloClient();

export default client;
