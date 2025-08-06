import { geolocation } from "@vercel/functions";

export function GET(request) {
	const details = geolocation(request);
	return Response.json(details);
}
