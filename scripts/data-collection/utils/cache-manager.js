// Cache Manager Utility
// Intelligent caching system for business data collection with multiple storage strategies

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { logger } from "./error-handler.js";

/**
 * In-Memory Cache with LRU eviction and TTL support
 */
export class MemoryCache {
	constructor(config = {}) {
		this.config = {
			maxSize: config.maxSize || 1000,
			defaultTTL: config.defaultTTL || 3600000, // 1 hour
			cleanupInterval: config.cleanupInterval || 300000, // 5 minutes
			...config,
		};

		this.cache = new Map();
		this.accessOrder = new Map(); // For LRU tracking
		this.stats = {
			hits: 0,
			misses: 0,
			sets: 0,
			evictions: 0,
			cleanups: 0,
		};

		// Start cleanup interval
		this.cleanupInterval = setInterval(() => {
			this.cleanup();
		}, this.config.cleanupInterval);

		logger.debug("Memory cache initialized", this.config);
	}

	/**
	 * Generate cache key hash
	 */
	generateKey(key) {
		if (typeof key === "object") {
			key = JSON.stringify(key);
		}
		return crypto.createHash("md5").update(String(key)).digest("hex");
	}

	/**
	 * Get value from cache
	 */
	get(key) {
		const hashedKey = this.generateKey(key);
		const item = this.cache.get(hashedKey);

		if (!item) {
			this.stats.misses++;
			return null;
		}

		// Check TTL
		if (Date.now() > item.expiresAt) {
			this.cache.delete(hashedKey);
			this.accessOrder.delete(hashedKey);
			this.stats.misses++;
			return null;
		}

		// Update access order for LRU
		this.accessOrder.set(hashedKey, Date.now());
		this.stats.hits++;

		logger.trace(`Cache hit for key: ${hashedKey.substring(0, 8)}...`);
		return item.value;
	}

	/**
	 * Set value in cache
	 */
	set(key, value, ttl = null) {
		const hashedKey = this.generateKey(key);
		const expiresAt = Date.now() + (ttl || this.config.defaultTTL);

		// Check if we need to evict items
		if (this.cache.size >= this.config.maxSize && !this.cache.has(hashedKey)) {
			this.evictLRU();
		}

		this.cache.set(hashedKey, {
			value,
			expiresAt,
			createdAt: Date.now(),
			size: this.calculateSize(value),
		});

		this.accessOrder.set(hashedKey, Date.now());
		this.stats.sets++;

		logger.trace(`Cache set for key: ${hashedKey.substring(0, 8)}..., TTL: ${ttl || this.config.defaultTTL}ms`);
	}

	/**
	 * Delete value from cache
	 */
	delete(key) {
		const hashedKey = this.generateKey(key);
		const deleted = this.cache.delete(hashedKey);
		this.accessOrder.delete(hashedKey);
		return deleted;
	}

	/**
	 * Check if key exists in cache
	 */
	has(key) {
		const hashedKey = this.generateKey(key);
		const item = this.cache.get(hashedKey);

		if (!item) return false;

		// Check TTL
		if (Date.now() > item.expiresAt) {
			this.cache.delete(hashedKey);
			this.accessOrder.delete(hashedKey);
			return false;
		}

		return true;
	}

	/**
	 * Evict least recently used item
	 */
	evictLRU() {
		let oldestKey = null;
		let oldestTime = Date.now();

		for (const [key, accessTime] of this.accessOrder) {
			if (accessTime < oldestTime) {
				oldestTime = accessTime;
				oldestKey = key;
			}
		}

		if (oldestKey) {
			this.cache.delete(oldestKey);
			this.accessOrder.delete(oldestKey);
			this.stats.evictions++;
			logger.trace(`Evicted LRU item: ${oldestKey.substring(0, 8)}...`);
		}
	}

	/**
	 * Clean up expired items
	 */
	cleanup() {
		const now = Date.now();
		let cleanedCount = 0;

		for (const [key, item] of this.cache) {
			if (now > item.expiresAt) {
				this.cache.delete(key);
				this.accessOrder.delete(key);
				cleanedCount++;
			}
		}

		if (cleanedCount > 0) {
			this.stats.cleanups++;
			logger.debug(`Cleaned up ${cleanedCount} expired cache items`);
		}
	}

	/**
	 * Calculate approximate size of value
	 */
	calculateSize(value) {
		try {
			return JSON.stringify(value).length;
		} catch {
			return 100; // Default size estimate
		}
	}

	/**
	 * Clear all cache
	 */
	clear() {
		this.cache.clear();
		this.accessOrder.clear();
		logger.debug("Memory cache cleared");
	}

	/**
	 * Get cache statistics
	 */
	getStats() {
		const hitRate = this.stats.hits / Math.max(this.stats.hits + this.stats.misses, 1);
		const totalSize = Array.from(this.cache.values()).reduce((sum, item) => sum + item.size, 0);

		return {
			...this.stats,
			size: this.cache.size,
			maxSize: this.config.maxSize,
			hitRate,
			totalSizeBytes: totalSize,
			utilizationPercent: (this.cache.size / this.config.maxSize) * 100,
		};
	}

	/**
	 * Destroy cache and cleanup intervals
	 */
	destroy() {
		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
		}
		this.clear();
		logger.debug("Memory cache destroyed");
	}
}

/**
 * File-based Persistent Cache
 */
export class FileCache {
	constructor(config = {}) {
		this.config = {
			cacheDir: config.cacheDir || "cache/data-collection",
			defaultTTL: config.defaultTTL || 86400000, // 24 hours
			maxFileSize: config.maxFileSize || 10 * 1024 * 1024, // 10MB
			compressionEnabled: config.compressionEnabled !== false,
			...config,
		};

		this.stats = {
			hits: 0,
			misses: 0,
			sets: 0,
			errors: 0,
		};

		this.initializeCacheDir();
	}

	/**
	 * Initialize cache directory
	 */
	async initializeCacheDir() {
		try {
			await fs.mkdir(this.config.cacheDir, { recursive: true });
			logger.debug(`File cache directory initialized: ${this.config.cacheDir}`);
		} catch (error) {
			logger.error("Failed to initialize cache directory", { error: error.message });
		}
	}

	/**
	 * Generate file path for cache key
	 */
	getFilePath(key) {
		const hashedKey = crypto.createHash("sha256").update(String(key)).digest("hex");
		const subDir = hashedKey.substring(0, 2); // Use first 2 chars for subdirectory
		return path.join(this.config.cacheDir, subDir, `${hashedKey}.json`);
	}

	/**
	 * Get value from file cache
	 */
	async get(key) {
		try {
			const filePath = this.getFilePath(key);
			const data = await fs.readFile(filePath, "utf8");
			const item = JSON.parse(data);

			// Check TTL
			if (Date.now() > item.expiresAt) {
				await this.delete(key);
				this.stats.misses++;
				return null;
			}

			this.stats.hits++;
			logger.trace(`File cache hit: ${path.basename(filePath)}`);
			return item.value;
		} catch (error) {
			if (error.code !== "ENOENT") {
				this.stats.errors++;
				logger.debug("File cache read error", { error: error.message });
			}
			this.stats.misses++;
			return null;
		}
	}

	/**
	 * Set value in file cache
	 */
	async set(key, value, ttl = null) {
		try {
			const filePath = this.getFilePath(key);
			const item = {
				value,
				expiresAt: Date.now() + (ttl || this.config.defaultTTL),
				createdAt: Date.now(),
				key: crypto.createHash("md5").update(String(key)).digest("hex"),
			};

			// Ensure directory exists
			await fs.mkdir(path.dirname(filePath), { recursive: true });

			// Check file size limit
			const data = JSON.stringify(item);
			if (data.length > this.config.maxFileSize) {
				logger.warn(`Cache item too large for file storage: ${data.length} bytes`);
				return false;
			}

			await fs.writeFile(filePath, data, "utf8");
			this.stats.sets++;
			logger.trace(`File cache set: ${path.basename(filePath)}`);
			return true;
		} catch (error) {
			this.stats.errors++;
			logger.error("File cache write error", { error: error.message });
			return false;
		}
	}

	/**
	 * Delete value from file cache
	 */
	async delete(key) {
		try {
			const filePath = this.getFilePath(key);
			await fs.unlink(filePath);
			return true;
		} catch (error) {
			if (error.code !== "ENOENT") {
				logger.debug("File cache delete error", { error: error.message });
			}
			return false;
		}
	}

	/**
	 * Check if key exists in file cache
	 */
	async has(key) {
		try {
			const filePath = this.getFilePath(key);
			const stats = await fs.stat(filePath);
			return stats.isFile();
		} catch {
			return false;
		}
	}

	/**
	 * Clean up expired files
	 */
	async cleanup() {
		try {
			const cleanedCount = await this.cleanupDirectory(this.config.cacheDir);
			logger.debug(`File cache cleanup completed: ${cleanedCount} files removed`);
			return cleanedCount;
		} catch (error) {
			logger.error("File cache cleanup error", { error: error.message });
			return 0;
		}
	}

	/**
	 * Recursively clean up directory
	 */
	async cleanupDirectory(dir) {
		let cleanedCount = 0;

		try {
			const items = await fs.readdir(dir);

			for (const item of items) {
				const itemPath = path.join(dir, item);
				const stats = await fs.stat(itemPath);

				if (stats.isDirectory()) {
					cleanedCount += await this.cleanupDirectory(itemPath);
				} else if (stats.isFile() && item.endsWith(".json")) {
					try {
						const data = await fs.readFile(itemPath, "utf8");
						const cached = JSON.parse(data);

						if (Date.now() > cached.expiresAt) {
							await fs.unlink(itemPath);
							cleanedCount++;
						}
					} catch {
						// Invalid file, remove it
						await fs.unlink(itemPath);
						cleanedCount++;
					}
				}
			}
		} catch (error) {
			if (error.code !== "ENOENT") {
				logger.debug("Directory cleanup error", { error: error.message, dir });
			}
		}

		return cleanedCount;
	}

	/**
	 * Clear all file cache
	 */
	async clear() {
		try {
			await fs.rmdir(this.config.cacheDir, { recursive: true });
			await this.initializeCacheDir();
			logger.debug("File cache cleared");
		} catch (error) {
			logger.error("Failed to clear file cache", { error: error.message });
		}
	}

	/**
	 * Get cache statistics
	 */
	getStats() {
		const hitRate = this.stats.hits / Math.max(this.stats.hits + this.stats.misses, 1);

		return {
			...this.stats,
			hitRate,
			cacheDir: this.config.cacheDir,
		};
	}
}

/**
 * Multi-tier Cache Manager with intelligent cache strategies
 */
export class CacheManager {
	constructor(config = {}) {
		this.config = {
			enableMemoryCache: config.enableMemoryCache !== false,
			enableFileCache: config.enableFileCache !== false,
			memoryFirst: config.memoryFirst !== false,
			...config,
		};

		// Initialize cache layers
		this.memoryCache = this.config.enableMemoryCache ? new MemoryCache(config.memory) : null;

		this.fileCache = this.config.enableFileCache ? new FileCache(config.file) : null;

		this.stats = {
			requests: 0,
			memoryHits: 0,
			fileHits: 0,
			misses: 0,
		};

		logger.info("Cache manager initialized", {
			memoryEnabled: !!this.memoryCache,
			fileEnabled: !!this.fileCache,
			memoryFirst: this.config.memoryFirst,
		});
	}

	/**
	 * Get value with multi-tier lookup
	 */
	async get(key) {
		this.stats.requests++;

		// Try memory cache first
		if (this.memoryCache) {
			const memoryValue = this.memoryCache.get(key);
			if (memoryValue !== null) {
				this.stats.memoryHits++;
				return memoryValue;
			}
		}

		// Try file cache
		if (this.fileCache) {
			const fileValue = await this.fileCache.get(key);
			if (fileValue !== null) {
				this.stats.fileHits++;

				// Promote to memory cache if available
				if (this.memoryCache) {
					this.memoryCache.set(key, fileValue);
				}

				return fileValue;
			}
		}

		this.stats.misses++;
		return null;
	}

	/**
	 * Set value in appropriate cache tiers
	 */
	async set(key, value, options = {}) {
		const ttl = options.ttl || null;
		const tiers = options.tiers || ["memory", "file"];

		const results = {};

		// Set in memory cache
		if (tiers.includes("memory") && this.memoryCache) {
			this.memoryCache.set(key, value, ttl);
			results.memory = true;
		}

		// Set in file cache
		if (tiers.includes("file") && this.fileCache) {
			results.file = await this.fileCache.set(key, value, ttl);
		}

		return results;
	}

	/**
	 * Delete from all cache tiers
	 */
	async delete(key) {
		const results = {};

		if (this.memoryCache) {
			results.memory = this.memoryCache.delete(key);
		}

		if (this.fileCache) {
			results.file = await this.fileCache.delete(key);
		}

		return results;
	}

	/**
	 * Check if key exists in any cache tier
	 */
	async has(key) {
		if (this.memoryCache?.has(key)) {
			return true;
		}

		if (this.fileCache && (await this.fileCache.has(key))) {
			return true;
		}

		return false;
	}

	/**
	 * Cache with intelligent strategy selection
	 */
	async cacheStrategy(key, fetchFunction, options = {}) {
		const strategy = options.strategy || "memory-first";
		const ttl = options.ttl || null;

		// Try to get from cache first
		const cached = await this.get(key);
		if (cached !== null) {
			return cached;
		}

		// Fetch fresh data
		const data = await fetchFunction();

		// Cache based on strategy
		switch (strategy) {
			case "memory-only":
				await this.set(key, data, { ttl, tiers: ["memory"] });
				break;
			case "file-only":
				await this.set(key, data, { ttl, tiers: ["file"] });
				break;
			case "memory-first":
			default:
				await this.set(key, data, { ttl, tiers: ["memory", "file"] });
				break;
		}

		return data;
	}

	/**
	 * Clean up all cache tiers
	 */
	async cleanup() {
		const results = {};

		if (this.memoryCache) {
			this.memoryCache.cleanup();
			results.memory = true;
		}

		if (this.fileCache) {
			results.file = await this.fileCache.cleanup();
		}

		logger.debug("Cache cleanup completed", results);
		return results;
	}

	/**
	 * Clear all caches
	 */
	async clear() {
		if (this.memoryCache) {
			this.memoryCache.clear();
		}

		if (this.fileCache) {
			await this.fileCache.clear();
		}

		logger.info("All caches cleared");
	}

	/**
	 * Get comprehensive statistics
	 */
	getStats() {
		const memoryStats = this.memoryCache?.getStats() || {};
		const fileStats = this.fileCache?.getStats() || {};

		const totalHits = this.stats.memoryHits + this.stats.fileHits;
		const hitRate = totalHits / Math.max(this.stats.requests, 1);

		return {
			overall: {
				...this.stats,
				totalHits,
				hitRate,
				missRate: this.stats.misses / Math.max(this.stats.requests, 1),
			},
			memory: memoryStats,
			file: fileStats,
		};
	}

	/**
	 * Destroy cache manager and cleanup resources
	 */
	destroy() {
		if (this.memoryCache) {
			this.memoryCache.destroy();
		}

		logger.info("Cache manager destroyed");
	}
}

// Global cache manager instance
export const cacheManager = new CacheManager({
	memory: {
		maxSize: 2000,
		defaultTTL: 1800000, // 30 minutes
	},
	file: {
		cacheDir: "cache/business-data",
		defaultTTL: 86400000, // 24 hours
	},
});

// Cleanup interval
setInterval(async () => {
	await cacheManager.cleanup();
}, 600000); // Every 10 minutes
