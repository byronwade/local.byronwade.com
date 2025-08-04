import { nanoid } from "nanoid";

// In-memory store for URLs (replace with a database in production)
const urlStore = {};

export async function POST(request) {
	const { fullUrl } = await request.json();

	// Generate a short code for the URL
	const shortCode = nanoid(6);

	// Store the full URL with the generated short code
	urlStore[shortCode] = fullUrl;

	// Construct the short URL
	const shortUrl = `${request.nextUrl.origin}/search/${shortCode}`;

	return new Response(JSON.stringify({ shortUrl }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

export async function GET(request) {
	const shortCode = request.nextUrl.pathname.split("/").pop();

	// Retrieve the full URL associated with the short code
	const fullUrl = urlStore[shortCode];

	if (fullUrl) {
		return Response.redirect(`${request.nextUrl.origin}/?${fullUrl}`, 302);
	} else {
		return new Response("URL not found", { status: 404 });
	}
}
