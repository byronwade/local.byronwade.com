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
	const { pathname } = request.nextUrl;
	const response = NextResponse.next();

	// Performance headers for all routes
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-XSS-Protection", "1; mode=block");
	response.headers.set("Referrer-Policy", "origin-when-cross-origin");

	// Enable compression
	response.headers.set("Accept-Encoding", "gzip, deflate, br");

	// Static asset caching
	if (pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|otf|css|js)$/)) {
		response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
		response.headers.set("Vary", "Accept-Encoding");
	}

	// API route optimizations
	if (pathname.startsWith("/api/")) {
		response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
		response.headers.set("Pragma", "no-cache");
		response.headers.set("Expires", "0");
	}

	// Page caching for static content
	if (pathname.startsWith("/(site)/") || pathname === "/") {
		response.headers.set("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
		response.headers.set("Vary", "Accept-Encoding, Accept");
	}

	// Preload critical resources
	if (pathname === "/" || pathname.startsWith("/(site)/")) {
		response.headers.set("Link", ["</fonts/inter.woff2>; rel=preload; as=font; type=font/woff2; crossorigin", "</css/globals.css>; rel=preload; as=style"].join(", "));
	}

	// Security headers for sensitive routes
	if (pathname.startsWith("/dashboard") || pathname.startsWith("/(auth)/")) {
		response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
		response.headers.set("Content-Security-Policy", "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'");
	}

	// Performance monitoring
	response.headers.set("Server-Timing", `middleware;dur=${Date.now() - request.headers.get("x-request-start") || 0}`);

	return response;
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
