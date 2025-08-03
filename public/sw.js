/**
 * Advanced Service Worker for Offline-First Business Directory
 * Implements intelligent caching, background prefetching, and performance optimization
 * Inspired by Netflix and Google's PWA strategies
 */

const CACHE_VERSION = "v1.2.0";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Cache configuration
const CACHE_CONFIG = {
	// Static assets (long-term caching)
	static: {
		name: STATIC_CACHE,
		ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
		maxEntries: 100,
	},

	// Dynamic pages (medium-term caching)
	dynamic: {
		name: DYNAMIC_CACHE,
		ttl: 24 * 60 * 60 * 1000, // 24 hours
		maxEntries: 50,
	},

	// API responses (short-term caching)
	api: {
		name: API_CACHE,
		ttl: 10 * 60 * 1000, // 10 minutes
		maxEntries: 200,
	},

	// Images (long-term caching)
	images: {
		name: IMAGE_CACHE,
		ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
		maxEntries: 300,
	},
};

// Network-first strategies for different route types
const CACHING_STRATEGIES = {
	// Business pages - cache with fallback
	business: "cache-first",

	// Search results - network first with cache fallback
	search: "network-first",

	// API calls - network first with cache fallback
	api: "network-first",

	// Static assets - cache first
	static: "cache-first",

	// Images - cache first
	images: "cache-first",
};

// Background sync tags
const SYNC_TAGS = {
	PREFETCH_BUSINESS: "prefetch-business",
	ANALYTICS: "analytics-sync",
	FAVORITES: "sync-favorites",
};

/**
 * Service Worker Installation
 */
self.addEventListener("install", (event) => {
	console.log("[SW] Installing service worker...");

	event.waitUntil(
		caches.open(STATIC_CACHE).then((cache) => {
			console.log("[SW] Caching static assets...");
			return cache.addAll([
				"/",
				"/offline",
				"/_next/static/css/app.css", // Adjust based on your build
				"/manifest.json",
				"/favicon.ico",
			]);
		})
	);

	// Skip waiting to activate immediately
	self.skipWaiting();
});

/**
 * Service Worker Activation
 */
self.addEventListener("activate", (event) => {
	console.log("[SW] Activating service worker...");

	event.waitUntil(
		Promise.all([
			// Clean up old caches
			cleanupOldCaches(),
			// Take control of all clients
			self.clients.claim(),
		])
	);
});

/**
 * Fetch Event Handler with Intelligent Caching
 */
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests and chrome-extension requests
	if (request.method !== "GET" || url.protocol === "chrome-extension:") {
		return;
	}

	// Determine caching strategy based on URL
	const strategy = getCachingStrategy(url, request);

	event.respondWith(
		executeStrategy(strategy, request, url).catch((error) => {
			console.error("[SW] Fetch failed:", error);
			return handleFetchError(request, url);
		})
	);
});

/**
 * Background Sync for Prefetching
 */
self.addEventListener("sync", (event) => {
	console.log("[SW] Background sync triggered:", event.tag);

	switch (event.tag) {
		case SYNC_TAGS.PREFETCH_BUSINESS:
			event.waitUntil(performBackgroundPrefetch());
			break;

		case SYNC_TAGS.ANALYTICS:
			event.waitUntil(syncAnalytics());
			break;

		case SYNC_TAGS.FAVORITES:
			event.waitUntil(syncFavorites());
			break;
	}
});

/**
 * Push Notifications for Instant Updates
 */
self.addEventListener("push", (event) => {
	if (!event.data) return;

	const data = event.data.json();
	const options = {
		body: data.body,
		icon: "/icon-192x192.png",
		badge: "/badge-72x72.png",
		data: data.data,
		tag: data.tag,
		actions: data.actions || [],
	};

	event.waitUntil(self.registration.showNotification(data.title, options));
});

/**
 * Message Handler for Communication with Main Thread
 */
self.addEventListener("message", (event) => {
	const { type, data } = event.data;

	switch (type) {
		case "PREFETCH_BUSINESS":
			handlePrefetchRequest(data);
			break;

		case "CLEAR_CACHE":
			clearSpecificCache(data.cacheType);
			break;

		case "GET_CACHE_STATS":
			getCacheStats().then((stats) => {
				event.ports[0].postMessage(stats);
			});
			break;

		case "UPDATE_CACHE_STRATEGY":
			updateCachingStrategy(data);
			break;
	}
});

/**
 * Determine caching strategy based on URL
 */
function getCachingStrategy(url, request) {
	// API requests
	if (url.pathname.startsWith("/api/")) {
		return {
			type: "network-first",
			cache: CACHE_CONFIG.api,
			fallback: "api",
		};
	}

	// Business pages
	if (url.pathname.startsWith("/biz/")) {
		return {
			type: "cache-first",
			cache: CACHE_CONFIG.dynamic,
			fallback: "business",
		};
	}

	// Search pages
	if (url.pathname.startsWith("/search")) {
		return {
			type: "network-first",
			cache: CACHE_CONFIG.dynamic,
			fallback: "search",
		};
	}

	// Images
	if (request.destination === "image") {
		return {
			type: "cache-first",
			cache: CACHE_CONFIG.images,
			fallback: "image",
		};
	}

	// Static assets
	if (url.pathname.startsWith("/_next/") || url.pathname.includes(".css") || url.pathname.includes(".js")) {
		return {
			type: "cache-first",
			cache: CACHE_CONFIG.static,
			fallback: "static",
		};
	}

	// Default strategy for other pages
	return {
		type: "network-first",
		cache: CACHE_CONFIG.dynamic,
		fallback: "page",
	};
}

/**
 * Execute caching strategy
 */
async function executeStrategy(strategy, request, url) {
	const { type, cache, fallback } = strategy;

	switch (type) {
		case "cache-first":
			return cacheFirstStrategy(request, cache, fallback);

		case "network-first":
			return networkFirstStrategy(request, cache, fallback);

		case "stale-while-revalidate":
			return staleWhileRevalidateStrategy(request, cache);

		default:
			return fetch(request);
	}
}

/**
 * Cache-first strategy
 */
async function cacheFirstStrategy(request, cacheConfig, fallback) {
	const cache = await caches.open(cacheConfig.name);
	const cachedResponse = await cache.match(request);

	if (cachedResponse) {
		// Check if cache entry is still valid
		const cacheTime = await getCacheTime(cachedResponse);
		if (Date.now() - cacheTime < cacheConfig.ttl) {
			return cachedResponse;
		}
	}

	// Fetch from network
	try {
		const networkResponse = await fetch(request);

		if (networkResponse.ok) {
			// Cache the response
			const responseToCache = networkResponse.clone();
			await setCacheWithTimestamp(cache, request, responseToCache);

			// Clean up cache if needed
			await cleanupCache(cacheConfig);
		}

		return networkResponse;
	} catch (error) {
		// Return cached version if available
		if (cachedResponse) {
			return cachedResponse;
		}

		// Return fallback
		return getFallbackResponse(fallback, request);
	}
}

/**
 * Network-first strategy
 */
async function networkFirstStrategy(request, cacheConfig, fallback) {
	try {
		const networkResponse = await fetch(request);

		if (networkResponse.ok) {
			// Cache the response
			const cache = await caches.open(cacheConfig.name);
			const responseToCache = networkResponse.clone();
			await setCacheWithTimestamp(cache, request, responseToCache);

			// Clean up cache if needed
			await cleanupCache(cacheConfig);
		}

		return networkResponse;
	} catch (error) {
		// Fall back to cache
		const cache = await caches.open(cacheConfig.name);
		const cachedResponse = await cache.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		// Return fallback
		return getFallbackResponse(fallback, request);
	}
}

/**
 * Stale-while-revalidate strategy
 */
async function staleWhileRevalidateStrategy(request, cacheConfig) {
	const cache = await caches.open(cacheConfig.name);
	const cachedResponse = await cache.match(request);

	// Always try to fetch from network in background
	const fetchPromise = fetch(request)
		.then((networkResponse) => {
			if (networkResponse.ok) {
				const responseToCache = networkResponse.clone();
				setCacheWithTimestamp(cache, request, responseToCache);
			}
			return networkResponse;
		})
		.catch(() => null);

	// Return cached response immediately if available
	if (cachedResponse) {
		return cachedResponse;
	}

	// Wait for network response if no cache
	return fetchPromise;
}

/**
 * Handle fetch errors
 */
async function handleFetchError(request, url) {
	// Try to find cached version in any cache
	const cacheNames = await caches.keys();

	for (const cacheName of cacheNames) {
		const cache = await caches.open(cacheName);
		const cachedResponse = await cache.match(request);
		if (cachedResponse) {
			return cachedResponse;
		}
	}

	// Return offline page for navigation requests
	if (request.mode === "navigate") {
		const cache = await caches.open(STATIC_CACHE);
		return cache.match("/offline") || new Response("Offline", { status: 503 });
	}

	// Return basic error response
	return new Response("Network Error", { status: 503 });
}

/**
 * Get fallback response based on request type
 */
async function getFallbackResponse(fallback, request) {
	const cache = await caches.open(STATIC_CACHE);

	switch (fallback) {
		case "business":
		case "search":
		case "page":
			return cache.match("/offline") || new Response("Offline", { status: 503 });

		case "api":
			return new Response(JSON.stringify({ error: "Offline", cached: true }), {
				headers: { "Content-Type": "application/json" },
				status: 503,
			});

		case "image":
			return cache.match("/placeholder-image.svg") || new Response("", { status: 503 });

		default:
			return new Response("Offline", { status: 503 });
	}
}

/**
 * Set cache entry with timestamp
 */
async function setCacheWithTimestamp(cache, request, response) {
	// Add timestamp header
	const responseWithTimestamp = new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: {
			...Object.fromEntries(response.headers.entries()),
			"sw-cache-time": Date.now().toString(),
		},
	});

	await cache.put(request, responseWithTimestamp);
}

/**
 * Get cache timestamp
 */
async function getCacheTime(response) {
	const cacheTime = response.headers.get("sw-cache-time");
	return cacheTime ? parseInt(cacheTime, 10) : 0;
}

/**
 * Clean up cache based on TTL and max entries
 */
async function cleanupCache(cacheConfig) {
	const cache = await caches.open(cacheConfig.name);
	const keys = await cache.keys();

	if (keys.length <= cacheConfig.maxEntries) return;

	// Sort by cache time and remove oldest entries
	const keyPromises = keys.map(async (key) => {
		const response = await cache.match(key);
		const cacheTime = await getCacheTime(response);
		return { key, cacheTime };
	});

	const keyData = await Promise.all(keyPromises);
	keyData.sort((a, b) => a.cacheTime - b.cacheTime);

	// Remove oldest entries
	const entriesToRemove = keyData.slice(0, keys.length - cacheConfig.maxEntries);
	await Promise.all(entriesToRemove.map(({ key }) => cache.delete(key)));

	console.log(`[SW] Cleaned up ${entriesToRemove.length} entries from ${cacheConfig.name}`);
}

/**
 * Clean up old cache versions
 */
async function cleanupOldCaches() {
	const cacheNames = await caches.keys();
	const currentCaches = Object.values(CACHE_CONFIG).map((config) => config.name);

	const oldCaches = cacheNames.filter((name) => !currentCaches.includes(name));

	await Promise.all(oldCaches.map((name) => caches.delete(name)));

	if (oldCaches.length > 0) {
		console.log(`[SW] Cleaned up ${oldCaches.length} old caches`);
	}
}

/**
 * Handle prefetch requests from main thread
 */
async function handlePrefetchRequest(data) {
	const { urls, priority = "low" } = data;

	for (const url of urls) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				// Determine appropriate cache
				const urlObj = new URL(url);
				const strategy = getCachingStrategy(urlObj, { destination: "document" });
				const cache = await caches.open(strategy.cache.name);
				await setCacheWithTimestamp(cache, new Request(url), response);

				console.log(`[SW] Prefetched: ${url}`);
			}
		} catch (error) {
			console.warn(`[SW] Prefetch failed for ${url}:`, error);
		}
	}
}

/**
 * Perform background prefetching based on user patterns
 */
async function performBackgroundPrefetch() {
	try {
		// Get popular business pages to prefetch
		const response = await fetch("/api/analytics/popular-pages");
		if (!response.ok) return;

		const { pages } = await response.json();

		// Prefetch top 10 popular pages
		const topPages = pages.slice(0, 10);
		await handlePrefetchRequest({ urls: topPages, priority: "background" });

		console.log(`[SW] Background prefetched ${topPages.length} popular pages`);
	} catch (error) {
		console.warn("[SW] Background prefetch failed:", error);
	}
}

/**
 * Sync analytics data when online
 */
async function syncAnalytics() {
	try {
		// Get pending analytics from IndexedDB
		const analytics = await getStoredAnalytics();

		if (analytics.length > 0) {
			const response = await fetch("/api/analytics/sync", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ events: analytics }),
			});

			if (response.ok) {
				await clearStoredAnalytics();
				console.log(`[SW] Synced ${analytics.length} analytics events`);
			}
		}
	} catch (error) {
		console.warn("[SW] Analytics sync failed:", error);
	}
}

/**
 * Sync favorites when online
 */
async function syncFavorites() {
	try {
		// Get pending favorite changes from IndexedDB
		const changes = await getStoredFavoriteChanges();

		if (changes.length > 0) {
			const response = await fetch("/api/user/favorites/sync", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ changes }),
			});

			if (response.ok) {
				await clearStoredFavoriteChanges();
				console.log(`[SW] Synced ${changes.length} favorite changes`);
			}
		}
	} catch (error) {
		console.warn("[SW] Favorites sync failed:", error);
	}
}

/**
 * Get cache statistics
 */
async function getCacheStats() {
	const stats = {};

	for (const [key, config] of Object.entries(CACHE_CONFIG)) {
		try {
			const cache = await caches.open(config.name);
			const keys = await cache.keys();

			let totalSize = 0;
			for (const request of keys) {
				const response = await cache.match(request);
				if (response && response.headers.get("content-length")) {
					totalSize += parseInt(response.headers.get("content-length"), 10);
				}
			}

			stats[key] = {
				entries: keys.length,
				maxEntries: config.maxEntries,
				estimatedSize: totalSize,
				ttl: config.ttl,
			};
		} catch (error) {
			stats[key] = { error: error.message };
		}
	}

	return stats;
}

/**
 * Clear specific cache type
 */
async function clearSpecificCache(cacheType) {
	const config = CACHE_CONFIG[cacheType];
	if (config) {
		await caches.delete(config.name);
		console.log(`[SW] Cleared ${cacheType} cache`);
	}
}

/**
 * Update caching strategy (for A/B testing)
 */
function updateCachingStrategy(data) {
	const { route, strategy } = data;
	CACHING_STRATEGIES[route] = strategy;
	console.log(`[SW] Updated caching strategy for ${route}: ${strategy}`);
}

// IndexedDB utilities for offline data storage
async function getStoredAnalytics() {
	// Implement IndexedDB logic for analytics storage
	return [];
}

async function clearStoredAnalytics() {
	// Implement IndexedDB logic for clearing analytics
}

async function getStoredFavoriteChanges() {
	// Implement IndexedDB logic for favorite changes
	return [];
}

async function clearStoredFavoriteChanges() {
	// Implement IndexedDB logic for clearing favorite changes
}

console.log("[SW] Advanced service worker loaded successfully");
