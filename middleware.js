import { NextResponse } from "next/server";
import logger from "@lib/utils/logger";

export async function updateSession(request) {
	// Mock middleware - just pass through requests for now
	const response = NextResponse.next({
		request,
	});

	// Mock user for development
	const mockUser = {
		id: "mock-user-id",
		email: "test@example.com",
		name: "Test User",
		user_metadata: {
			first_name: "John",
			last_name: "Doe",
			full_name: "John Doe",
		},
		app_metadata: {},
		aud: "authenticated",
		role: "authenticated",
	};

	logger.debug("Middleware mock user:", mockUser);

	return response;
}

export async function middleware(request) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
