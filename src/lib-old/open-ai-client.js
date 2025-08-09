// agent.js - Mock OpenAI client for development

import { algoliaIndex } from "./algolia-client";

// Mock OpenAI client
const createMockOpenAI = () => {
	return {
		chat: {
			completions: {
				create: async ({ model, messages, tools }) => {
					console.log("Mock OpenAI chat completion:", { model, messages: messages.length, tools: tools?.length });

					// Simulate API delay
					await new Promise((resolve) => setTimeout(resolve, 500));

					// Mock response
					return {
						choices: [
							{
								finish_reason: "stop",
								message: {
									role: "assistant",
									content: "I'm a mock AI assistant. In development mode, I can help you search for businesses using the available data. Please provide a business name to search for.",
								},
							},
						],
						usage: {
							total_tokens: 150,
							prompt_tokens: 100,
							completion_tokens: 50,
						},
					};
				},
			},
		},
	};
};

const openai = createMockOpenAI();

const tools = [
	{
		type: "function",
		function: {
			name: "getBusinessInfo",
			description: "Fetch business information by name",
			parameters: {
				type: "object",
				properties: {
					businessName: {
						type: "string",
					},
				},
				required: ["businessName"],
			},
		},
	},
];

const messages = [
	{
		role: "system",
		content: "You are a helpful assistant. Use the provided function to fetch business information.",
	},
];

const availableTools = {
	getBusinessInfo,
};

const costPerInputToken = 0.0015 / 1000; // $0.0015 per 1000 input tokens
const costPerOutputToken = 0.002 / 1000; // $0.002 per 1000 output tokens

function calculateCost(inputTokens, outputTokens) {
	return inputTokens * costPerInputToken + outputTokens * costPerOutputToken;
}

function formatBusinessInfo(business) {
	return `
**${business.name}**

**Address:**
${business.location?.address1 || "N/A"}, ${business.location?.city || "N/A"}, ${business.location?.state || "N/A"}, ${business.location?.zip_code || "N/A"}

**Contact:**
Phone: ${business.phone || "N/A"}
Email: ${business.email || "N/A"}
Website: ${business.website || "N/A"}

**Details:**
Rating: ${business.rating || "N/A"}
Review Count: ${business.review_count || "N/A"}
Price: ${business.price || "N/A"}

**Categories:**
${business.categories?.map((category) => category.title).join(", ") || "N/A"}

**Hours:**
${business.hours?.map((hour) => `${hour.day}: ${hour.start} - ${hour.end}`).join("\n") || "N/A"}

**Attributes:**
${
	business.attributes
		? Object.entries(business.attributes)
				.map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`)
				.join("\n")
		: "N/A"
}
`;
}

async function getBusinessInfo(businessName) {
	try {
		console.log("Fetching business info for:", businessName);

		const { hits } = await algoliaIndex.search(businessName, {
			hitsPerPage: 5, // Fetch up to 5 potential matches
		});

		console.log("Received data from Supabase:", hits);

		return hits.length > 0 ? hits : null;
	} catch (error) {
		console.error("Error fetching business information:", error);
		return null;
	}
}

async function agent(userInput) {
	// Reset messages for new conversation
	const conversationMessages = [...messages];

	conversationMessages.push({
		role: "user",
		content: userInput,
	});

	try {
		console.log("Mock sending message to OpenAI:", conversationMessages);

		// Check if user is asking for business information
		const businessNameMatch = userInput.match(/(?:tell me about|find|search for|info about|information on)\s+(.+)/i);

		if (businessNameMatch) {
			const businessName = businessNameMatch[1].trim();
			const businessInfo = await getBusinessInfo(businessName);

			if (businessInfo && businessInfo.length > 0) {
				if (businessInfo.length === 1) {
					const formattedResponse = formatBusinessInfo(businessInfo[0]);
					return `Here is the information for ${businessName}:\n${formattedResponse}`;
				} else {
					const businessList = businessInfo.map((business, index) => `${index + 1}. ${business.name}`).join("\n");
					return `I found multiple businesses matching "${businessName}". Please specify which one you are interested in:\n${businessList}`;
				}
			} else {
				return `I couldn't find any businesses matching "${businessName}". Please try a different search term.`;
			}
		}

		// Default response for other queries
		return "I'm a mock AI assistant running in development mode. I can help you search for businesses. Try asking me to 'tell me about [business name]' or 'find [business name]'.";
	} catch (error) {
		console.error("Mock error during OpenAI completion:", error);
		return "An error occurred while processing your request in development mode.";
	}
}

export default agent;
