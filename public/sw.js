/**
 * Advanced Service Worker for Performance Optimization
 * 
 * Implements cutting-edge caching strategies and background optimizations:
 * - Intelligent cache management
 * - Background prefetching
 * - Offline-first strategies
 * - Performance monitoring
 * - Critical resource preloading
 */

const CACHE_VERSION = "v1.0.0";
const CACHE_NAMES = {
	STATIC: `static-${CACHE_VERSION}`,
	DYNAMIC: `dynamic-${CACHE_VERSION}`,
	IMAGES: `images-${CACHE_VERSION}`,
	API: `api-${CACHE_VERSION}`,
	CRITICAL: `critical-${CACHE_VERSION}`,
};

// Critical resources that should always be cached
const CRITICAL_RESOURCES = [
  '/',
  '/dashboard/user',
  '/categories',
  '/search',
  '/jobs',
  '/manifest.json',
  '/logos/ThorbisLogo.webp'
];

// Static resources with long cache duration
const STATIC_RESOURCES = [
  '/logos/',
  '/images/',
  '/icons/',
  '/_next/static/',
  '/css/',
  '/js/'
];

// API endpoints with short cache duration
const API_PATTERNS = [
  /\/api\/categories/,
  /\/api\/businesses/,
  /\/api\/jobs/,
  /\/api\/dashboard/
];

// Network timeout for fetch requests
const NETWORK_TIMEOUT = 3000;

/**
 * Performance monitoring utilities
 */
class PerformanceMonitor {
	constructor() {
		this.metrics = {
			cacheHits: 0,
			cacheMisses: 0,
			networkRequests: 0,
			backgroundTasks: 0,
			errorCount: 0,
		};
	}

	recordCacheHit() {
		this.metrics.cacheHits++;
		this.logMetric("cache_hit");
	}

	recordCacheMiss() {
		this.metrics.cacheMisses++;
		this.logMetric("cache_miss");
	}

	recordNetworkRequest() {
		this.metrics.networkRequests++;
	}

	recordError(error) {
		this.metrics.errorCount++;
		console.warn("Service Worker Error:", error);
	}

	logMetric(type, data = {}) {
		// Send metrics to analytics if available
		try {
			self.clients.matchAll().then((clients) => {
				clients.forEach((client) => {
					client.postMessage({
						type: "SW_METRIC",
						metric: type,
						data: { ...data, timestamp: Date.now() },
					});
				});
			});
		} catch (error) {
			console.warn("Failed to log metric:", error);
		}
	}

	getMetrics() {
		const hitRate = this.metrics.cacheHits + this.metrics.cacheMisses > 0 ? (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100 : 0;

		return {
			...this.metrics,
			hitRate: Math.round(hitRate * 100) / 100,
		};
	}
}

const performanceMonitor = new PerformanceMonitor();

/**
 * Intelligent cache manager
 */
class CacheManager {
	constructor() {
		this.maxCacheSize = 50 * 1024 * 1024; // 50MB
		this.cleanupThreshold = 0.8; // Clean when 80% full
	}

	async put(cacheName, request, response) {
		try {
			const cache = await caches.open(cacheName);

			// Check cache size before adding
			await this.manageCacheSize(cacheName);

			// Clone response for caching
			const responseClone = response.clone();
			await cache.put(request, responseClone);

			return response;
		} catch (error) {
			performanceMonitor.recordError(error);
			return response;
		}
	}

	async get(cacheName, request) {
		try {
			const cache = await caches.open(cacheName);
			const response = await cache.match(request);

			if (response) {
				performanceMonitor.recordCacheHit();
				return response;
			} else {
				performanceMonitor.recordCacheMiss();
				return null;
			}
		} catch (error) {
			performanceMonitor.recordError(error);
			return null;
		}
	}

	async manageCacheSize(cacheName) {
		try {
			const cache = await caches.open(cacheName);
			const keys = await cache.keys();

			if (keys.length > 100) {
				// Arbitrary limit
				// Remove oldest entries
				const oldKeys = keys.slice(0, 20);
				await Promise.all(oldKeys.map((key) => cache.delete(key)));
			}
		} catch (error) {
			performanceMonitor.recordError(error);
		}
	}

	async cleanup() {
		try {
			const cacheNames = await caches.keys();

			// Remove old caches
			const deletePromises = cacheNames.filter((name) => !Object.values(CACHE_NAMES).includes(name)).map((name) => caches.delete(name));

			await Promise.all(deletePromises);
		} catch (error) {
			performanceMonitor.recordError(error);
		}
	}
}

const cacheManager = new CacheManager();

/**
 * Network utilities with timeout and retry
 */
class NetworkUtils {
	static async fetchWithTimeout(request, timeout = NETWORK_TIMEOUT) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(request, {
				signal: controller.signal,
			});
			clearTimeout(timeoutId);
			return response;
		} catch (error) {
			clearTimeout(timeoutId);
			throw error;
		}
	}

	static async fetchWithRetry(request, maxRetries = 2) {
		let lastError;

		for (let i = 0; i <= maxRetries; i++) {
			try {
				return await this.fetchWithTimeout(request);
			} catch (error) {
				lastError = error;
				if (i < maxRetries) {
					// Exponential backoff
					await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
				}
			}
		}

		throw lastError;
	}
}

/**
 * Background task manager
 */
class BackgroundTaskManager {
	constructor() {
		this.taskQueue = [];
		this.isProcessing = false;
	}

	addTask(task) {
		this.taskQueue.push(task);
		this.processQueue();
	}

	async processQueue() {
		if (this.isProcessing || this.taskQueue.length === 0) return;

		this.isProcessing = true;

		while (this.taskQueue.length > 0) {
			const task = this.taskQueue.shift();
			try {
				await task();
				performanceMonitor.metrics.backgroundTasks++;
			} catch (error) {
				performanceMonitor.recordError(error);
			}
		}

		this.isProcessing = false;
	}
}

const backgroundTasks = new BackgroundTaskManager();

/**
 * Caching strategies
 */
const CacheStrategies = {
	// Cache first, fallback to network
	cacheFirst: async (request) => {
		const cached = await cacheManager.get(CACHE_NAMES.STATIC, request);
		if (cached) return cached;

		try {
			const response = await NetworkUtils.fetchWithRetry(request);
			if (response.ok) {
				await cacheManager.put(CACHE_NAMES.STATIC, request, response.clone());
			}
			return response;
		} catch (error) {
			performanceMonitor.recordError(error);
			return new Response("Offline", { status: 503 });
		}
	},

	// Network first, fallback to cache
	networkFirst: async (request) => {
		try {
			const response = await NetworkUtils.fetchWithTimeout(request);
			performanceMonitor.recordNetworkRequest();

			if (response.ok) {
				await cacheManager.put(CACHE_NAMES.DYNAMIC, request, response.clone());
			}
			return response;
		} catch (error) {
			const cached = await cacheManager.get(CACHE_NAMES.DYNAMIC, request);
			if (cached) return cached;

			performanceMonitor.recordError(error);
			return new Response("Network Error", { status: 503 });
		}
	},

	// Stale while revalidate
	staleWhileRevalidate: async (request) => {
		const cached = await cacheManager.get(CACHE_NAMES.API, request);

		// Background update
		const networkUpdate = NetworkUtils.fetchWithRetry(request)
			.then((response) => {
				if (response.ok) {
					cacheManager.put(CACHE_NAMES.API, request, response.clone());
				}
				return response;
			})
			.catch((error) => {
				performanceMonitor.recordError(error);
			});

		// Return cached immediately if available
		if (cached) {
			// Don't await the network update
			networkUpdate.catch(() => {}); // Prevent unhandled rejection
			return cached;
		}

		// Wait for network if no cache
		try {
			return await networkUpdate;
		} catch (error) {
			return new Response("Service Unavailable", { status: 503 });
		}
	},
};

/**
 * Request router
 */
function getRequestStrategy(request) {
	const url = new URL(request.url);

	// Critical resources - cache first
	if (CRITICAL_RESOURCES.some((resource) => url.pathname.startsWith(resource))) {
		return CacheStrategies.cacheFirst;
	}

	// Static resources - cache first
	if (STATIC_RESOURCES.some((pattern) => url.pathname.startsWith(pattern))) {
		return CacheStrategies.cacheFirst;
	}

	// API requests - stale while revalidate
	if (API_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
		return CacheStrategies.staleWhileRevalidate;
	}

	// Images - cache first
	if (request.destination === "image") {
		return CacheStrategies.cacheFirst;
	}

	// Default - network first
	return CacheStrategies.networkFirst;
}

/**
 * Service Worker Event Handlers
 */

// Install event
self.addEventListener("install", (event) => {
	console.log("Service Worker installing...");

	event.waitUntil(
		(async () => {
			try {
				// Cache critical resources immediately
				const cache = await caches.open(CACHE_NAMES.CRITICAL);
				await cache.addAll(CRITICAL_RESOURCES);

				// Skip waiting to activate immediately
				await self.skipWaiting();

				console.log("Service Worker installed successfully");
			} catch (error) {
				console.error("Service Worker installation failed:", error);
				performanceMonitor.recordError(error);
			}
		})()
	);
});

// Activate event
self.addEventListener("activate", (event) => {
	console.log("Service Worker activating...");

	event.waitUntil(
		(async () => {
			try {
				// Clean up old caches
				await cacheManager.cleanup();

				// Claim all clients
				await self.clients.claim();

				// Start background prefetching
				backgroundTasks.addTask(async () => {
					await prefetchCriticalResources();
				});

				console.log("Service Worker activated successfully");
			} catch (error) {
				console.error("Service Worker activation failed:", error);
				performanceMonitor.recordError(error);
			}
		})()
	);
});

// Fetch event
self.addEventListener("fetch", (event) => {
	// Only handle GET requests
	if (event.request.method !== "GET") return;

	// Skip non-HTTP requests
	if (!event.request.url.startsWith("http")) return;

	const strategy = getRequestStrategy(event.request);

	event.respondWith(
		strategy(event.request).catch((error) => {
			performanceMonitor.recordError(error);
			return new Response("Service Worker Error", {
				status: 500,
				statusText: "Service Worker Error",
			});
		})
	);
});

// Message event for communication with main thread
self.addEventListener("message", (event) => {
	const { type, data } = event.data;

	switch (type) {
		case "PREFETCH_ROUTES":
			backgroundTasks.addTask(async () => {
				await prefetchRoutes(data.routes);
			});
			break;

		case "GET_METRICS":
			event.ports[0].postMessage(performanceMonitor.getMetrics());
			break;

		case "CLEAR_CACHE":
			backgroundTasks.addTask(async () => {
				await clearAllCaches();
			});
			break;

		case "FORCE_UPDATE":
			self.skipWaiting();
			break;
	}
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
	if (event.tag === "background-sync") {
		event.waitUntil(
			backgroundTasks.addTask(async () => {
				// Handle background sync tasks
				await syncOfflineActions();
			})
		);
	}
});

/**
 * Background prefetching functions
 */
async function prefetchCriticalResources() {
	try {
		const commonRoutes = ["/api/categories", "/api/businesses/featured", "/api/dashboard/user"];

		for (const route of commonRoutes) {
			try {
				const response = await fetch(route);
				if (response.ok) {
					await cacheManager.put(CACHE_NAMES.API, route, response);
				}
			} catch (error) {
				// Ignore individual failures
			}
		}
	} catch (error) {
		performanceMonitor.recordError(error);
	}
}

async function prefetchRoutes(routes) {
	for (const route of routes) {
		try {
			const response = await fetch(route);
			if (response.ok) {
				await cacheManager.put(CACHE_NAMES.DYNAMIC, route, response);
			}
		} catch (error) {
			// Ignore failures in background prefetch
		}
	}
}

async function clearAllCaches() {
	try {
		const cacheNames = await caches.keys();
		await Promise.all(cacheNames.map((name) => caches.delete(name)));
	} catch (error) {
		performanceMonitor.recordError(error);
	}
}

async function syncOfflineActions() {
	// Implementation for syncing offline actions when back online
	try {
		// Check if online
		if (!navigator.onLine) return;

		// Sync any queued offline actions
		// This would be specific to your application's needs
	} catch (error) {
		performanceMonitor.recordError(error);
	}
}

// Periodic cleanup
setInterval(() => {
  backgroundTasks.addTask(async () => {
    await cacheManager.cleanup();
  });
}, 60000); // Every minute

console.log("Service Worker script loaded");