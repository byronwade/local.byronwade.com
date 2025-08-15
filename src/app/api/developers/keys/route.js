export async function GET() {
	// Placeholder in-memory shape
	return new Response(JSON.stringify({ keys: [] }), { headers: { "content-type": "application/json" } });
}

export async function POST(request) {
	const body = await request.json().catch(() => ({}));
	const now = Date.now();
	const newKey = {
		id: String(now),
		label: body.label || "API Key",
		value: "sk_live_" + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12),
		masked: "sk_live_••••••••" + String(now).slice(-4),
		isPrimary: true,
		createdAt: new Date(now).toISOString(),
	};
	return new Response(JSON.stringify({ key: newKey }), { headers: { "content-type": "application/json" } });
}


