// agent.js

import OpenAI from "openai";
import { algoliaIndex } from "./algoliaClient";

const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
});

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
${business.location.address1}, ${business.location.city}, ${business.location.state}, ${business.location.zip_code}

**Contact:**
Phone: ${business.phone}
Email: ${business.email}
Website: ${business.website}

**Details:**
Rating: ${business.rating}
Review Count: ${business.review_count}
Price: ${business.price}

**Categories:**
${business.categories.map((category) => category.title).join(", ")}

**Hours:**
${business.hours.map((hour) => `${hour.day}: ${hour.start} - ${hour.end}`).join("\n")}

**Attributes:**
${Object.entries(business.attributes)
	.map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`)
	.join("\n")}
`;
}

async function getBusinessInfo(businessName) {
	try {
		console.log("Fetching business info for:", businessName);

		const { hits } = await algoliaIndex.search(businessName, {
			hitsPerPage: 5, // Fetch up to 5 potential matches
		});

		console.log("Received data from Algolia:", hits);

		return hits.length > 0 ? hits : null;
	} catch (error) {
		console.error("Error fetching business information:", error);
		return null;
	}
}

async function agent(userInput) {
	messages.push({
		role: "user",
		content: userInput,
	});

	for (let i = 0; i < 5; i++) {
		try {
			console.log("Sending message to OpenAI:", messages);
			const response = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: messages,
				tools: tools,
			});

			const { finish_reason, message } = response.choices[0];
			const totalTokens = response.usage.total_tokens;
			const promptTokens = response.usage.prompt_tokens;
			const completionTokens = response.usage.completion_tokens;
			const cost = calculateCost(promptTokens, completionTokens);

			console.log(`Cost for this message: ${totalTokens} tokens (${cost.toFixed(5)} dollars)`);

			if (finish_reason === "tool_calls" && message.tool_calls) {
				const functionName = message.tool_calls[0].function.name;
				const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
				const functionResponse = await availableTools[functionName](functionArgs.businessName);

				if (functionResponse) {
					messages.push({
						role: "function",
						name: functionName,
						content: JSON.stringify(functionResponse),
					});

					if (functionResponse.length === 1) {
						// Only one business found
						const formattedResponse = formatBusinessInfo(functionResponse[0]);
						return `Here is the information for ${functionArgs.businessName}:\n${formattedResponse}`;
					} else {
						// Multiple businesses found
						const businessList = functionResponse.map((business, index) => `${index + 1}. ${business.name}`).join("\n");
						messages.push({
							role: "system",
							content: `I found multiple businesses matching the name "${functionArgs.businessName}". Please specify which one you are interested in by choosing the corresponding number:\n${businessList}`,
						});
						return `I found multiple businesses matching the name "${functionArgs.businessName}". Please specify which one you are interested in by choosing the corresponding number:\n${businessList}`;
					}
				} else {
					messages.push({
						role: "function",
						name: functionName,
						content: "Business not found",
					});
					return "Business not found. Please try again with a different input.";
				}
			} else if (finish_reason === "stop") {
				messages.push(message);
				return message.content;
			}
		} catch (error) {
			console.error("Error during OpenAI completion:", error);
			return "An error occurred while processing your request.";
		}
	}

	return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
}

export default agent;
