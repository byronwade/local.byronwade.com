// REQUIRED: Advanced Subdomain Middleware
// Handles subdomain detection, routing, and context setting for LocalHub subdomains

import { NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "../supabase/ssr";
import { logger } from "../utils/logger";

/**
 * Subdomain detection and routing middleware
 * Handles *.localhub.com subdomains and sets appropriate context
 */
export async function createSubdomainMiddleware(request) {
	const startTime = performance.now();
	const url = request.nextUrl.clone();
	const hostname = request.headers.get("host") || url.hostname;

	try {
		// Parse subdomain from hostname
		const subdomainInfo = parseSubdomain(hostname);

		if (!subdomainInfo.isSubdomain) {
			// Not a subdomain, continue with normal routing
			return NextResponse.next();
		}

		logger.debug(`Subdomain detected: ${subdomainInfo.subdomain} on ${hostname}`);

		// Create Supabase client for middleware
		const { client: supabase } = createSupabaseMiddlewareClient(request);

		// Validate and get subdomain data
		const localHub = await validateSubdomain(supabase, subdomainInfo.subdomain);

		if (!localHub) {
			// Subdomain doesn't exist, redirect to main site or show 404
			return handleInvalidSubdomain(url, subdomainInfo.subdomain);
		}

		// Check if subdomain is active
		if (localHub.status !== "active") {
			return handleInactiveSubdomain(url, localHub);
		}

		// Create response with subdomain context
		const response = NextResponse.next();

		// Set subdomain context headers for the application
		setSubdomainHeaders(response, localHub);

		// Handle subdomain-specific routing
		const routingResult = await handleSubdomainRouting(url, localHub, request);

		if (routingResult.redirect) {
			return NextResponse.redirect(routingResult.url);
		}

		if (routingResult.rewrite) {
			return NextResponse.rewrite(routingResult.url);
		}

		// Log subdomain access for analytics
		await logSubdomainAccess(supabase, localHub.id, request);

		const duration = performance.now() - startTime;
		response.headers.set("X-Subdomain-Processing-Time", `${duration.toFixed(2)}ms`);

		logger.performance(`Subdomain middleware executed in ${duration.toFixed(2)}ms`);

		return response;
	} catch (error) {
		logger.error("Subdomain middleware error:", error);

		// On error, continue with normal routing
		return NextResponse.next();
	}
}

/**
 * Parse subdomain from hostname
 */
function parseSubdomain(hostname) {
	// Remove port if present
	const cleanHostname = hostname.split(":")[0];

	// Check for localhub.com domain
	const localhubPattern = /^(.+)\.localhub\.com$/i;
	const match = cleanHostname.match(localhubPattern);

	if (match) {
		const subdomain = match[1].toLowerCase();

		// Skip 'www' subdomain
		if (subdomain === "www") {
			return { isSubdomain: false };
		}

		return {
			isSubdomain: true,
			subdomain,
			domain: "localhub.com",
			fullDomain: cleanHostname.toLowerCase(),
		};
	}

	// Check for custom domains (future enhancement)
	// This would involve checking a database of custom domains

	return { isSubdomain: false };
}

/**
 * Validate subdomain exists and is accessible
 */
async function validateSubdomain(supabase, subdomain) {
	try {
		const { data: localHub, error } = await supabase
			.from("local_hubs")
			.select(
				`
				id,
				subdomain,
				full_domain,
				name,
				description,
				tagline,
				city,
				state,
				country,
				latitude,
				longitude,
				radius_km,
				status,
				verified,
				owner_id,
				logo_url,
				banner_url,
				primary_color,
				secondary_color,
				meta_title,
				meta_description,
				meta_keywords,
				featured_categories,
				excluded_categories,
				auto_approve_businesses,
				total_businesses,
				total_reviews
			`
			)
			.eq("subdomain", subdomain)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				// No subdomain found
				return null;
			}
			throw error;
		}

		return localHub;
	} catch (error) {
		logger.error("Failed to validate subdomain:", error);
		return null;
	}
}

/**
 * Handle invalid subdomain
 */
function handleInvalidSubdomain(url, subdomain) {
	logger.warn(`Invalid subdomain accessed: ${subdomain}`);

	// Redirect to main site with subdomain in query for potential signup
	const mainSiteUrl = new URL(url);
	mainSiteUrl.hostname = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "thorbis.com";
	mainSiteUrl.pathname = "/create-local-hub";
	mainSiteUrl.searchParams.set("subdomain", subdomain);

	return NextResponse.redirect(mainSiteUrl);
}

/**
 * Handle inactive subdomain
 */
function handleInactiveSubdomain(url, localHub) {
	logger.warn(`Inactive subdomain accessed: ${localHub.subdomain} (status: ${localHub.status})`);

	// Create a maintenance page URL
	const maintenanceUrl = new URL(url);
	maintenanceUrl.pathname = "/subdomain-maintenance";
	maintenanceUrl.searchParams.set("status", localHub.status);
	maintenanceUrl.searchParams.set("hub", localHub.name);

	return NextResponse.redirect(maintenanceUrl);
}

/**
 * Set subdomain context headers
 */
function setSubdomainHeaders(response, localHub) {
	// Core subdomain context
	response.headers.set("X-Subdomain", localHub.subdomain);
	response.headers.set("X-Local-Hub-ID", localHub.id);
	response.headers.set("X-Local-Hub-Name", localHub.name);
	response.headers.set("X-Local-Hub-Status", localHub.status);

	// Geographic context
	if (localHub.city) {
		response.headers.set("X-Hub-City", localHub.city);
	}
	if (localHub.state) {
		response.headers.set("X-Hub-State", localHub.state);
	}
	if (localHub.latitude && localHub.longitude) {
		response.headers.set("X-Hub-Coordinates", `${localHub.latitude},${localHub.longitude}`);
		response.headers.set("X-Hub-Radius", localHub.radius_km.toString());
	}

	// Branding context
	if (localHub.primary_color) {
		response.headers.set("X-Hub-Primary-Color", localHub.primary_color);
	}
	if (localHub.secondary_color) {
		response.headers.set("X-Hub-Secondary-Color", localHub.secondary_color);
	}

	// Business filtering context
	if (localHub.featured_categories && localHub.featured_categories.length > 0) {
		response.headers.set("X-Hub-Featured-Categories", JSON.stringify(localHub.featured_categories));
	}
	if (localHub.excluded_categories && localHub.excluded_categories.length > 0) {
		response.headers.set("X-Hub-Excluded-Categories", JSON.stringify(localHub.excluded_categories));
	}
}

/**
 * Handle subdomain-specific routing
 */
async function handleSubdomainRouting(url, localHub, request) {
	const pathname = url.pathname;

	// Home page - show local hub landing
	if (pathname === "/" || pathname === "") {
		return {
			rewrite: true,
			url: new URL(`/${localHub.subdomain}`, request.url),
		};
	}

	// Business listings - rewrite to subdomain path
	if (pathname.startsWith("/biz/") || pathname.startsWith("/businesses/")) {
		return {
			rewrite: true,
			url: new URL(`/${localHub.subdomain}${pathname}`, request.url),
		};
	}

	// Categories - rewrite to subdomain path
	if (pathname.startsWith("/categories/")) {
		return {
			rewrite: true,
			url: new URL(`/${localHub.subdomain}${pathname}`, request.url),
		};
	}

	// Search - rewrite to subdomain path
	if (pathname.startsWith("/search/")) {
		return {
			rewrite: true,
			url: new URL(`/${localHub.subdomain}${pathname}`, request.url),
		};
	}

	// Admin/dashboard routes - only for hub managers
	if (pathname.startsWith("/dashboard/") || pathname.startsWith("/admin/")) {
		// Verify user has access to this hub
		const hasAccess = await verifyHubAccess(request, localHub.id);
		if (!hasAccess) {
			return {
				redirect: true,
				url: new URL("/unauthorized", request.url),
			};
		}
		return { continue: true };
	}

	// API routes - add hub context
	if (pathname.startsWith("/api/")) {
		return { continue: true };
	}

	// Static assets and other routes
	return { continue: true };
}

/**
 * Verify user has access to hub management
 */
async function verifyHubAccess(request, hubId) {
	try {
		const { client: supabase } = createSupabaseMiddlewareClient(request);

		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			return false;
		}

		// Check if user is owner or manager
		const { data: access } = await supabase.from("local_hub_managers").select("role").eq("local_hub_id", hubId).eq("user_id", session.user.id).single();

		return !!access;
	} catch (error) {
		logger.error("Failed to verify hub access:", error);
		return false;
	}
}

/**
 * Log subdomain access for analytics
 */
async function logSubdomainAccess(supabase, hubId, request) {
	try {
		const today = new Date().toISOString().split("T")[0];
		const userAgent = request.headers.get("user-agent") || "";
		const referer = request.headers.get("referer") || "";

		// Update or insert analytics record for today
		const { error } = await supabase.rpc("increment_hub_analytics", {
			hub_id: hubId,
			date: today,
			user_agent: userAgent,
			referer: referer,
		});

		if (error) {
			logger.error("Failed to log subdomain access:", error);
		}
	} catch (error) {
		logger.debug("Analytics logging failed:", error);
		// Don't throw - analytics failures shouldn't break the app
	}
}

/**
 * Get subdomain context from headers (for use in app)
 */
export function getSubdomainContext(headers) {
	const subdomain = headers.get("X-Subdomain");

	if (!subdomain) {
		return null;
	}

	return {
		subdomain,
		hubId: headers.get("X-Local-Hub-ID"),
		hubName: headers.get("X-Local-Hub-Name"),
		hubStatus: headers.get("X-Local-Hub-Status"),
		city: headers.get("X-Hub-City"),
		state: headers.get("X-Hub-State"),
		coordinates: headers.get("X-Hub-Coordinates")?.split(",").map(Number),
		radius: parseInt(headers.get("X-Hub-Radius")) || 50,
		primaryColor: headers.get("X-Hub-Primary-Color"),
		secondaryColor: headers.get("X-Hub-Secondary-Color"),
		featuredCategories: headers.get("X-Hub-Featured-Categories") ? JSON.parse(headers.get("X-Hub-Featured-Categories")) : [],
		excludedCategories: headers.get("X-Hub-Excluded-Categories") ? JSON.parse(headers.get("X-Hub-Excluded-Categories")) : [],
	};
}

/**
 * Check if current request is from a subdomain
 */
export function isSubdomainRequest(request) {
	const hostname = request.headers.get("host") || request.nextUrl.hostname;
	const subdomainInfo = parseSubdomain(hostname);
	return subdomainInfo.isSubdomain;
}

/**
 * Get subdomain name from request
 */
export function getSubdomainFromRequest(request) {
	const hostname = request.headers.get("host") || request.nextUrl.hostname;
	const subdomainInfo = parseSubdomain(hostname);
	return subdomainInfo.isSubdomain ? subdomainInfo.subdomain : null;
}
