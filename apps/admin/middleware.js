/**
 * Admin Platform Middleware - admin.thorbis.com
 * Handles platform administration and tenant management
 */

import { NextResponse } from "next/server";

/**
 * Admin platform middleware with authentication checks
 */
export function middleware(request) {
	const { pathname } = request.nextUrl;

	console.log(`Admin platform request: ${pathname}`);

	// Check admin authentication
	const isAuthenticated = checkAdminAuth(request);

	if (!isAuthenticated && !pathname.startsWith("/login")) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirect", pathname);
		return NextResponse.redirect(url);
	}

	// Add admin platform headers
	const response = NextResponse.next();
	response.headers.set("X-Platform-Type", "admin");
	response.headers.set("X-Admin-Access", "granted");

	// Enhanced security headers for admin
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("X-XSS-Protection", "1; mode=block");

	// Strict CSP for admin
	const csp = ["default-src 'self'", "script-src 'self'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data:", "font-src 'self'", "connect-src 'self'", "base-uri 'self'", "form-action 'self'"].join("; ");

	response.headers.set("Content-Security-Policy", csp);

	return response;
}

/**
 * Check admin authentication
 */
function checkAdminAuth(request) {
	// Implement your admin authentication logic here
	// This is a placeholder - integrate with your auth system
	const authCookie = request.cookies.get("admin-auth");
	return authCookie?.value === "authenticated"; // Simplified check
}

export const config = {
	matcher: ["/((?!_next|static|favicon.ico).*)"],
};
