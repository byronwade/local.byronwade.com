// lib/utils/cacheManager.js - Comprehensive caching strategies
import { logger } from "@lib/utils/logger";

// Cache configuration
const CACHE_CONFIG = {
	// TTL in milliseconds
	DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
	BUSINESS_SEARCH_TTL: 10 * 60 * 1000, // 10 minutes
	USER_DATA_TTL: 30 * 60 * 1000, // 30 minutes
	STATIC_DATA_TTL: 60 * 60 * 1000, // 1 hour

	// Size limits
	MAX_CACHE_SIZE: 100, // Maximum number of cached items
	MAX_MEMORY_USAGE: 50 * 1024 * 1024, // 50MB
};

// In-memory cache with LRU eviction
class LRUCache {
	constructor(maxSize = CACHE_CONFIG.MAX_CACHE_SIZE) {
		this.maxSize = maxSize;
		this.cache = new Map();
		this.accessOrder = new Map();
		this.accessCounter = 0;
	}

	get(key) {
		if (this.cache.has(key)) {
			const item = this.cache.get(key);

			// Check if expired
			if (item.expiry && Date.now() > item.expiry) {
				this.delete(key);
				return null;
			}

			// Update access order
			this.accessOrder.set(key, ++this.accessCounter);
			return item.value;
		}
		return null;
	}

	set(key, value, ttl = CACHE_CONFIG.DEFAULT_TTL) {
		// Remove oldest items if at capacity
		if (this.cache.size >= this.maxSize) {
			this.evictLRU();
		}

		const expiry = ttl ? Date.now() + ttl : null;
		this.cache.set(key, { value, expiry, size: this.estimateSize(value) });
		this.accessOrder.set(key, ++this.accessCounter);

		logger.debug(`Cache set: ${key}`);
	}

	delete(key) {
		this.cache.delete(key);
		this.accessOrder.delete(key);
	}

	clear() {
		this.cache.clear();
		this.accessOrder.clear();
		this.accessCounter = 0;
	}

	evictLRU() {
		let oldestKey = null;
		let oldestAccess = Infinity;

		for (const [key, accessTime] of this.accessOrder) {
			if (accessTime < oldestAccess) {
				oldestAccess = accessTime;
				oldestKey = key;
			}
		}

		if (oldestKey) {
			this.delete(oldestKey);
			logger.debug(`Evicted LRU cache entry: ${oldestKey}`);
		}
	}

	estimateSize(value) {
		try {
			return JSON.stringify(value).length * 2; // Rough estimate
		} catch {
			return 1000; // Fallback estimate
		}
	}

	getStats() {
		let totalSize = 0;
		let expiredCount = 0;
		const now = Date.now();

		for (const [key, item] of this.cache) {
			totalSize += item.size || 0;
			if (item.expiry && now > item.expiry) {
				expiredCount++;
			}
		}

		return {
			size: this.cache.size,
			totalSize,
			expiredCount,
			maxSize: this.maxSize,
		};
	}
}

// Global cache instances
const caches = {
	memory: new LRUCache(),
	sessionStorage: typeof window !== "undefined" ? window.sessionStorage : null,
	localStorage: typeof window !== "undefined" ? window.localStorage : null,
};

// Browser storage helpers
const BrowserStorage = {
	set(storage, key, value, ttl) {
		if (!storage) return false;

		try {
			const item = {
				value,
				expiry: ttl ? Date.now() + ttl : null,
				timestamp: Date.now(),
			};
			storage.setItem(key, JSON.stringify(item));
			return true;
		} catch (error) {
			logger.warn("Browser storage set failed:", error);
			return false;
		}
	},

	get(storage, key) {
		if (!storage) return null;

		try {
			const item = JSON.parse(storage.getItem(key));
			if (!item) return null;

			// Check expiry
			if (item.expiry && Date.now() > item.expiry) {
				storage.removeItem(key);
				return null;
			}

			return item.value;
		} catch (error) {
			logger.warn("Browser storage get failed:", error);
			return null;
		}
	},

	remove(storage, key) {
		if (!storage) return;
		try {
			storage.removeItem(key);
		} catch (error) {
			logger.warn("Browser storage remove failed:", error);
		}
	},

	clear(storage) {
		if (!storage) return;
		try {
			storage.clear();
		} catch (error) {
			logger.warn("Browser storage clear failed:", error);
		}
	},
};

// Main cache manager
export const CacheManager = {
	// Memory cache operations
	memory: {
		get: (key) => caches.memory.get(key),
		set: (key, value, ttl) => caches.memory.set(key, value, ttl),
		delete: (key) => caches.memory.delete(key),
		clear: () => caches.memory.clear(),
		stats: () => caches.memory.getStats(),
	},

	// Session storage (temporary data)
	session: {
		get: (key) => BrowserStorage.get(caches.sessionStorage, key),
		set: (key, value, ttl) => BrowserStorage.set(caches.sessionStorage, key, value, ttl),
		remove: (key) => BrowserStorage.remove(caches.sessionStorage, key),
		clear: () => BrowserStorage.clear(caches.sessionStorage),
	},

	// Local storage (persistent data)
	local: {
		get: (key) => BrowserStorage.get(caches.localStorage, key),
		set: (key, value, ttl) => BrowserStorage.set(caches.localStorage, key, value, ttl),
		remove: (key) => BrowserStorage.remove(caches.localStorage, key),
		clear: () => BrowserStorage.clear(caches.localStorage),
	},

	// Smart cache: tries memory first, then session, then local
	smart: {
		get(key) {
			// Try memory first (fastest)
			let value = CacheManager.memory.get(key);
			if (value !== null) return value;

			// Try session storage
			value = CacheManager.session.get(key);
			if (value !== null) {
				// Promote to memory cache
				CacheManager.memory.set(key, value);
				return value;
			}

			// Try local storage
			value = CacheManager.local.get(key);
			if (value !== null) {
				// Promote to memory cache
				CacheManager.memory.set(key, value);
				return value;
			}

			return null;
		},

		set(key, value, ttl, persistent = false) {
			// Always set in memory for fast access
			CacheManager.memory.set(key, value, ttl);

			// Set in appropriate storage based on persistence
			if (persistent) {
				CacheManager.local.set(key, value, ttl);
			} else {
				CacheManager.session.set(key, value, ttl);
			}
		},

		remove(key) {
			CacheManager.memory.delete(key);
			CacheManager.session.remove(key);
			CacheManager.local.remove(key);
		},
	},
};

// Cache strategies for specific data types
export const CacheStrategies = {
	// Business search results
	businessSearch: {
		get: (query, location) => {
			const key = `search:${query}:${location}`;
			return CacheManager.smart.get(key);
		},
		set: (query, location, results) => {
			const key = `search:${query}:${location}`;
			CacheManager.smart.set(key, results, CACHE_CONFIG.BUSINESS_SEARCH_TTL);
		},
	},

	// User data (persistent)
	userData: {
		get: (userId) => {
			const key = `user:${userId}`;
			return CacheManager.local.get(key);
		},
		set: (userId, data) => {
			const key = `user:${userId}`;
			CacheManager.smart.set(key, data, CACHE_CONFIG.USER_DATA_TTL, true);
		},
	},

	// Static/reference data (long-lived)
	staticData: {
		get: (type) => {
			const key = `static:${type}`;
			return CacheManager.smart.get(key);
		},
		set: (type, data) => {
			const key = `static:${type}`;
			CacheManager.smart.set(key, data, CACHE_CONFIG.STATIC_DATA_TTL, true);
		},
	},

	// API responses (with etag support)
	apiResponse: {
		get: (url, params = {}) => {
			const key = `api:${url}:${JSON.stringify(params)}`;
			return CacheManager.memory.get(key);
		},
		set: (url, params = {}, response, etag = null) => {
			const key = `api:${url}:${JSON.stringify(params)}`;
			const cachedData = { response, etag, timestamp: Date.now() };
			CacheManager.memory.set(key, cachedData, CACHE_CONFIG.DEFAULT_TTL);
		},
	},
};

// Cache cleanup utilities
export const CacheUtils = {
	// Clean expired entries
	cleanExpired() {
		// Memory cache auto-cleans on access

		// Clean browser storage
		[caches.sessionStorage, caches.localStorage].forEach((storage) => {
			if (!storage) return;

			const keysToRemove = [];
			for (let i = 0; i < storage.length; i++) {
				const key = storage.key(i);
				try {
					const item = JSON.parse(storage.getItem(key));
					if (item && item.expiry && Date.now() > item.expiry) {
						keysToRemove.push(key);
					}
				} catch {
					// Invalid JSON, remove it
					keysToRemove.push(key);
				}
			}

			keysToRemove.forEach((key) => storage.removeItem(key));

			if (keysToRemove.length > 0) {
				logger.debug(`Cleaned ${keysToRemove.length} expired cache entries`);
			}
		});
	},

	// Get cache statistics
	getStats() {
		const memoryStats = CacheManager.memory.stats();

		let sessionCount = 0;
		let localCount = 0;

		if (caches.sessionStorage) {
			sessionCount = caches.sessionStorage.length;
		}

		if (caches.localStorage) {
			// Count only our cache entries
			for (let i = 0; i < caches.localStorage.length; i++) {
				const key = caches.localStorage.key(i);
				if (key && (key.startsWith("search:") || key.startsWith("user:") || key.startsWith("static:"))) {
					localCount++;
				}
			}
		}

		return {
			memory: memoryStats,
			session: { count: sessionCount },
			local: { count: localCount },
		};
	},

	// Clear all caches
	clearAll() {
		CacheManager.memory.clear();
		CacheManager.session.clear();
		CacheManager.local.clear();
		logger.info("All caches cleared");
	},
};

// Auto cleanup on interval
if (typeof window !== "undefined") {
	// Clean expired entries every 5 minutes
	setInterval(() => {
		CacheUtils.cleanExpired();
	}, 5 * 60 * 1000);
}

export default CacheManager;
