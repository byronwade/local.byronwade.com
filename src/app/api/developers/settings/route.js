export async function GET() {
	return new Response(JSON.stringify({ webhooks: { enabled: false, url: "" }, ipAllowlist: [] }), { headers: { "content-type": "application/json" } });
}

export async function POST(request) {
	const body = await request.json().catch(() => ({}));
	return new Response(JSON.stringify({ ok: true, settings: body }), { headers: { "content-type": "application/json" } });
}


