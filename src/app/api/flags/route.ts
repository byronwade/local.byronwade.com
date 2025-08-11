/**
 * Feature Flags API for Vercel Toolbar
 * Provides current flag states for development/QA
 */

import { evaluateAllFlags } from "@/lib/flags/server";

export async function GET() {
	try {
		const flags = await evaluateAllFlags();

		return new Response(JSON.stringify(flags), {
			headers: {
				"content-type": "application/json",
				"cache-control": "no-store",
				"access-control-allow-origin": "*",
				"access-control-allow-methods": "GET",
				"access-control-allow-headers": "Content-Type",
			},
		});
	} catch (error) {
		console.error("Failed to evaluate flags:", error);

		return new Response(JSON.stringify({ error: "Failed to evaluate flags" }), {
			status: 500,
			headers: { "content-type": "application/json" },
		});
	}
}
