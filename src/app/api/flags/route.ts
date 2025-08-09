import { evaluateAllFlags } from "@lib/flags/server";

export async function GET() {
	const allFlags = await evaluateAllFlags();
	return new Response(JSON.stringify(allFlags), {
		headers: {
			"content-type": "application/json",
			"cache-control": "no-store",
		},
	});
}
