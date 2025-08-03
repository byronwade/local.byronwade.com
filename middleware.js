// REQUIRED: Advanced Application Middleware
// Implements comprehensive security, performance, subdomain routing, and monitoring

import { NextResponse } from "next/server";
import { createProfessionalSubdomainMiddleware } from "./lib/middleware/professional-subdomain";

/**
 * Main application middleware with comprehensive security and subdomain support
 */
export async function middleware(request) {
	const startTime = performance.now();
	const { pathname } = request.nextUrl;

	try {
		// Skip middleware for static assets
		if (shouldSkipMiddleware(pathname)) {
			return NextResponse.next();
		}

		// Use professional subdomain middleware for all routing
		const response = await createProfessionalSubdomainMiddleware(request);

		// Add performance monitoring
		const duration = performance.now() - startTime;
		response.headers.set("X-Response-Time", `${duration.toFixed(2)}ms`);

		return response;
	} catch (error) {
		console.error(`Middleware failed for ${pathname}:`, error);

		// Return basic response on error
		const errorResponse = NextResponse.next();
		addSecurityHeaders(errorResponse);
		return errorResponse;
	}
}

/**
 * Determine if middleware should be skipped for this path
 */
function shouldSkipMiddleware(pathname) {
	const skipPatterns = [
		// Static assets
		"/_next/static",
		"/_next/image",
		"/favicon.ico",
		"/robots.txt",
		"/sitemap.xml",
		"/manifest.json",
		// File extensions
		/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/,
		// Health checks
		"/api/health",
	];

	return skipPatterns.some((pattern) => {
		if (typeof pattern === "string") {
			return pathname.startsWith(pattern);
		}
		if (pattern instanceof RegExp) {
			return pattern.test(pathname);
		}
		return false;
	});
}

/**
 * Add comprehensive security headers
 */
function addSecurityHeaders(response) {
	// Basic security headers
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

	// HTTPS enforcement in production
	if (process.env.NODE_ENV === "production") {
		response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
	}
}

/**
 * Add performance optimization headers
 */
function addPerformanceHeaders(response, pathname) {
	// Cache control based on path type
	if (pathname.startsWith("/_next/static/")) {
		// Static assets - long cache
		response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
	} else if (pathname.startsWith("/api/")) {
		// API routes - no cache by default
		response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
	} else {
		// Regular pages - short cache with revalidation
		response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
	}
}

/**
 * Middleware configuration
 */
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
