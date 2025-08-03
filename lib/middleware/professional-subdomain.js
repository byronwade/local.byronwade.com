/**
 * Professional Subdomain Middleware
 * Following patterns from Shopify, Slack, and other enterprise SaaS platforms
 *
 * Architecture:
 * - thorbis.com                    → Main platform (marketing, auth, billing)
 * - {tenant}.thorbis.com           → Tenant-specific hubs
 * - admin.thorbis.com              → Platform administration
 * - api.thorbis.com                → Unified API gateway
 */

import { NextResponse } from "next/server";
import { supabase } from "@lib/supabase/client";

// Reserved subdomains that cannot be used by tenants
const RESERVED_SUBDOMAINS = ["www", "api", "admin", "app", "mail", "blog", "support", "help", "docs", "status", "cdn", "assets", "static", "test", "dev", "staging", "demo", "security", "legal", "privacy", "terms", "billing", "payments", "login", "signup", "auth", "oauth", "sso", "dashboard", "account", "profile"];

/**
 * Determine the platform type based on hostname
 */
function getPlatformType(hostname) {
	// Remove port for local development
	const host = hostname.replace(/:\d+$/, "");

	// Development environment
	if (host === "localhost" || host.includes("localhost")) {
		return { type: "development", tenant: null };
	}

	// Production patterns
	if (host === "thorbis.com" || host === "www.thorbis.com") {
		return { type: "main", tenant: null };
	}

	if (host === "admin.thorbis.com") {
		return { type: "admin", tenant: null };
	}

	if (host === "api.thorbis.com") {
		return { type: "api", tenant: null };
	}

	// Check for tenant subdomain
	if (host.endsWith(".thorbis.com")) {
		const subdomain = host.replace(".thorbis.com", "");

		// Validate subdomain
		if (RESERVED_SUBDOMAINS.includes(subdomain)) {
			return { type: "reserved", tenant: null };
		}

		if (isValidSubdomain(subdomain)) {
			return { type: "tenant", tenant: subdomain };
		}
	}

	return { type: "unknown", tenant: null };
}

/**
 * Validate subdomain format
 */
function isValidSubdomain(subdomain) {
	// Check format: alphanumeric and hyphens, 3-63 characters
	const subdomainRegex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
	return subdomainRegex.test(subdomain);
}

/**
 * Handle main platform routing (thorbis.com)
 */
async function handleMainPlatform(request) {
	const { pathname } = request.nextUrl;

	// Set platform headers
	const response = NextResponse.next();
	response.headers.set("X-Platform-Type", "main");
	response.headers.set("X-Platform-Version", process.env.APP_VERSION || "1.0.0");

	// Add security headers
	addSecurityHeaders(response);

	return response;
}

/**
 * Handle admin platform routing (admin.thorbis.com)
 */
async function handleAdminPlatform(request) {
	const { pathname } = request.nextUrl;

	// Admin authentication check
	const isAuthenticated = await checkAdminAuth(request);

	if (!isAuthenticated && !pathname.startsWith("/login")) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirect", pathname);
		return NextResponse.redirect(url);
	}

	const response = NextResponse.next();
	response.headers.set("X-Platform-Type", "admin");
	addSecurityHeaders(response);

	return response;
}

/**
 * Handle tenant platform routing ({tenant}.thorbis.com)
 */
async function handleTenantPlatform(request, tenantSubdomain) {
	const { pathname } = request.nextUrl;

	try {
		// Verify tenant exists and is active
		const tenant = await validateTenant(tenantSubdomain);

		if (!tenant) {
			// Tenant not found - redirect to main platform
			const url = new URL("https://thorbis.com/not-found");
			url.searchParams.set("subdomain", tenantSubdomain);
			return NextResponse.redirect(url);
		}

		if (tenant.status !== "active") {
			// Tenant suspended or inactive
			const url = new URL("https://thorbis.com/suspended");
			url.searchParams.set("subdomain", tenantSubdomain);
			return NextResponse.redirect(url);
		}

		// Rewrite URLs to tenant-specific routes
		const rewriteUrl = rewriteTenantUrl(request.nextUrl, tenant);

		const response = NextResponse.rewrite(rewriteUrl);
		response.headers.set("X-Platform-Type", "tenant");
		response.headers.set("X-Tenant-ID", tenant.id);
		response.headers.set("X-Tenant-Subdomain", tenant.subdomain);
		response.headers.set("X-Tenant-Name", tenant.name);
		response.headers.set("X-Tenant-City", tenant.location_city);
		response.headers.set("X-Tenant-State", tenant.location_state);

		// Add tenant-specific security headers
		addTenantSecurityHeaders(response, tenant);

		return response;
	} catch (error) {
		console.error("Tenant routing error:", error);

		// Graceful fallback to main platform
		const url = new URL("https://thorbis.com/error");
		url.searchParams.set("subdomain", tenantSubdomain);
		return NextResponse.redirect(url);
	}
}

/**
 * Validate tenant exists and return tenant data
 */
async function validateTenant(subdomain) {
	try {
		const { data, error } = await supabase.from("local_hubs").select("*").eq("subdomain", subdomain).single();

		if (error || !data) {
			return null;
		}

		return data;
	} catch (error) {
		console.error("Tenant validation error:", error);
		return null;
	}
}

/**
 * Rewrite tenant URLs to internal Next.js routes
 */
function rewriteTenantUrl(originalUrl, tenant) {
	const url = originalUrl.clone();

	// Map tenant URLs to internal routes
	if (url.pathname === "/") {
		url.pathname = `/tenant/${tenant.subdomain}`;
	} else if (url.pathname.startsWith("/businesses")) {
		url.pathname = `/tenant/${tenant.subdomain}/businesses${url.pathname.replace("/businesses", "")}`;
	} else if (url.pathname.startsWith("/biz/")) {
		url.pathname = `/tenant/${tenant.subdomain}/biz${url.pathname.replace("/biz", "")}`;
	} else if (url.pathname.startsWith("/categories/")) {
		url.pathname = `/tenant/${tenant.subdomain}/categories${url.pathname.replace("/categories", "")}`;
	} else if (url.pathname.startsWith("/search")) {
		url.pathname = `/tenant/${tenant.subdomain}/search${url.pathname.replace("/search", "")}`;
	} else {
		// Default to tenant home for unknown paths
		url.pathname = `/tenant/${tenant.subdomain}`;
	}

	return url;
}

/**
 * Check admin authentication
 */
async function checkAdminAuth(request) {
	// Implementation depends on your auth strategy
	// This is a placeholder - integrate with your auth system
	const authCookie = request.cookies.get("admin-auth");
	return authCookie?.value === "authenticated"; // Simplified check
}

/**
 * Add security headers for all platforms
 */
function addSecurityHeaders(response) {
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("X-XSS-Protection", "1; mode=block");
	response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
}

/**
 * Add tenant-specific security headers
 */
function addTenantSecurityHeaders(response, tenant) {
	addSecurityHeaders(response);

	// Content Security Policy for tenant
	const csp = ["default-src 'self'", "script-src 'self' 'unsafe-inline' 'unsafe-eval'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data: https:", "font-src 'self' https:", "connect-src 'self' https://api.thorbis.com", `base-uri 'self'`, "form-action 'self'"].join("; ");

	response.headers.set("Content-Security-Policy", csp);
}

/**
 * Handle development environment routing
 */
function handleDevelopment(request) {
	const { pathname, searchParams } = request.nextUrl;

	// Check for tenant simulation via query parameter
	const simulateTenant = searchParams.get("tenant");

	if (simulateTenant && isValidSubdomain(simulateTenant)) {
		// Simulate tenant routing in development
		const response = NextResponse.next();
		response.headers.set("X-Platform-Type", "tenant");
		response.headers.set("X-Tenant-Subdomain", simulateTenant);
		response.headers.set("X-Development-Mode", "true");

		return response;
	}

	// Default to main platform in development
	const response = NextResponse.next();
	response.headers.set("X-Platform-Type", "main");
	response.headers.set("X-Development-Mode", "true");

	return response;
}

/**
 * Main middleware function
 */
export async function createProfessionalSubdomainMiddleware(request) {
	const hostname = request.headers.get("host") || "";
	const platform = getPlatformType(hostname);

	// Performance logging
	const startTime = performance.now();

	try {
		let response;

		switch (platform.type) {
			case "development":
				response = handleDevelopment(request);
				break;

			case "main":
				response = await handleMainPlatform(request);
				break;

			case "admin":
				response = await handleAdminPlatform(request);
				break;

			case "tenant":
				response = await handleTenantPlatform(request, platform.tenant);
				break;

			case "reserved":
				// Reserved subdomain - redirect to main platform
				const reservedUrl = new URL("https://thorbis.com/reserved");
				response = NextResponse.redirect(reservedUrl);
				break;

			default:
				// Unknown platform - redirect to main platform
				const unknownUrl = new URL("https://thorbis.com");
				response = NextResponse.redirect(unknownUrl);
		}

		// Add performance headers
		const duration = performance.now() - startTime;
		response.headers.set("X-Middleware-Duration", `${duration.toFixed(2)}ms`);
		response.headers.set("X-Platform-Detected", platform.type);

		return response;
	} catch (error) {
		console.error("Professional subdomain middleware error:", error);

		// Graceful fallback
		const fallbackUrl = new URL("https://thorbis.com/error");
		return NextResponse.redirect(fallbackUrl);
	}
}

// Export for use in middleware.js
export { createProfessionalSubdomainMiddleware as createSubdomainMiddleware };
export { RESERVED_SUBDOMAINS, isValidSubdomain, validateTenant };
