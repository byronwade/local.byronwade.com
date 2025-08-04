// Rate Limiter Utility
// Intelligent rate limiting for multiple APIs with burst handling and performance optimization

import { logger } from "./error-handler.js";

/**
 * Advanced Rate Limiter with multiple strategies and intelligent backoff
 */
export class RateLimiter {
	constructor(config = {}) {
		this.config = {
			requestsPerSecond: config.requestsPerSecond || 10,
			requestsPerMinute: config.requestsPerMinute || 500,
			requestsPerDay: config.requestsPerDay || 10000,
			burstLimit: config.burstLimit || 50,
			backoffStrategy: config.backoffStrategy || "exponential",
			maxRetryDelay: config.maxRetryDelay || 30000,
			name: config.name || "default",
			...config,
		};

		// Request tracking
		this.requests = {
			second: [],
			minute: [],
			day: [],
			burst: [],
		};

		// Performance tracking
		this.stats = {
			totalRequests: 0,
			limitHits: 0,
			averageWaitTime: 0,
			burstUsage: 0,
			lastReset: Date.now(),
		};

		// Retry queue for failed requests
		this.retryQueue = [];
		this.processing = false;

		logger.info(`Rate limiter initialized for ${this.config.name}:`, this.config);
	}

	/**
	 * Check if request can be made according to rate limits
	 */
	canMakeRequest() {
		const now = Date.now();
		this.cleanupOldRequests(now);

		const checks = [this.requests.second.length < this.config.requestsPerSecond, this.requests.minute.length < this.config.requestsPerMinute, this.requests.day.length < this.config.requestsPerDay, this.requests.burst.length < this.config.burstLimit];

		return checks.every((check) => check);
	}

	/**
	 * Wait for next available slot with intelligent backoff
	 */
	async waitForSlot() {
		const startTime = Date.now();

		while (!this.canMakeRequest()) {
			const waitTime = this.calculateWaitTime();

			logger.debug(`Rate limit hit for ${this.config.name}, waiting ${waitTime}ms`);
			this.stats.limitHits++;

			await this.sleep(waitTime);
			this.cleanupOldRequests(Date.now());
		}

		const totalWaitTime = Date.now() - startTime;
		this.updateAverageWaitTime(totalWaitTime);

		return totalWaitTime;
	}

	/**
	 * Execute request with rate limiting
	 */
	async executeRequest(requestFn, ...args) {
		const startTime = Date.now();

		try {
			// Wait for available slot
			await this.waitForSlot();

			// Record request
			this.recordRequest();

			// Execute the actual request
			const result = await requestFn(...args);

			// Track success
			this.trackSuccess(Date.now() - startTime);

			return result;
		} catch (error) {
			// Handle rate limit errors specially
			if (this.isRateLimitError(error)) {
				return this.handleRateLimitError(error, requestFn, ...args);
			}

			throw error;
		}
	}

	/**
	 * Record a successful request
	 */
	recordRequest() {
		const now = Date.now();

		this.requests.second.push(now);
		this.requests.minute.push(now);
		this.requests.day.push(now);
		this.requests.burst.push(now);

		this.stats.totalRequests++;
	}

	/**
	 * Clean up old request records
	 */
	cleanupOldRequests(now) {
		// Remove requests older than their respective time windows
		this.requests.second = this.requests.second.filter((time) => now - time < 1000);
		this.requests.minute = this.requests.minute.filter((time) => now - time < 60000);
		this.requests.day = this.requests.day.filter((time) => now - time < 86400000);

		// Burst window cleanup (shorter window for burst protection)
		this.requests.burst = this.requests.burst.filter((time) => now - time < 10000);
	}

	/**
	 * Calculate intelligent wait time based on current conditions
	 */
	calculateWaitTime() {
		const now = Date.now();

		// Calculate time until oldest request in each window expires
		const timeUntilSecondReset = this.requests.second.length > 0 ? Math.max(0, 1000 - (now - this.requests.second[0])) : 0;

		const timeUntilMinuteReset = this.requests.minute.length > 0 ? Math.max(0, 60000 - (now - this.requests.minute[0])) : 0;

		const timeUntilBurstReset = this.requests.burst.length > 0 ? Math.max(0, 10000 - (now - this.requests.burst[0])) : 0;

		// Use the shortest wait time plus a small buffer
		const baseWaitTime = Math.min(timeUntilSecondReset || 1000, timeUntilMinuteReset || 1000, timeUntilBurstReset || 1000);

		// Apply backoff strategy
		return this.applyBackoffStrategy(baseWaitTime);
	}

	/**
	 * Apply backoff strategy for progressive delays
	 */
	applyBackoffStrategy(baseWaitTime) {
		const hitRatio = this.stats.limitHits / Math.max(this.stats.totalRequests, 1);

		switch (this.config.backoffStrategy) {
			case "exponential":
				return Math.min(baseWaitTime * Math.pow(2, hitRatio * 10), this.config.maxRetryDelay);

			case "linear":
				return Math.min(baseWaitTime + hitRatio * 5000, this.config.maxRetryDelay);

			case "fixed":
				return baseWaitTime;

			default:
				return baseWaitTime;
		}
	}

	/**
	 * Check if error is a rate limit error
	 */
	isRateLimitError(error) {
		const rateLimitIndicators = ["rate limit", "too many requests", "quota exceeded", "limit exceeded", "429", "throttled"];

		const errorMessage = (error.message || "").toLowerCase();
		const errorStatus = error.status || error.response?.status;

		return errorStatus === 429 || rateLimitIndicators.some((indicator) => errorMessage.includes(indicator));
	}

	/**
	 * Handle rate limit errors with intelligent retry
	 */
	async handleRateLimitError(error, requestFn, ...args) {
		logger.warn(`Rate limit error for ${this.config.name}:`, error.message);

		// Extract retry delay from error if available
		const retryAfter = this.extractRetryAfter(error);

		if (retryAfter) {
			logger.info(`Server requested ${retryAfter}ms delay, waiting...`);
			await this.sleep(retryAfter);
		} else {
			// Use our own backoff calculation
			const waitTime = this.calculateWaitTime() * 2; // Double the wait time for errors
			await this.sleep(waitTime);
		}

		// Retry the request
		return this.executeRequest(requestFn, ...args);
	}

	/**
	 * Extract retry delay from error response
	 */
	extractRetryAfter(error) {
		const retryAfterHeader = error.response?.headers?.["retry-after"] || error.response?.headers?.["x-ratelimit-reset"];

		if (retryAfterHeader) {
			const retryAfterMs = parseInt(retryAfterHeader) * 1000;
			return Math.min(retryAfterMs, this.config.maxRetryDelay);
		}

		return null;
	}

	/**
	 * Track successful request performance
	 */
	trackSuccess(duration) {
		// Update performance metrics
		this.stats.successfulRequests = (this.stats.successfulRequests || 0) + 1;
		this.stats.averageResponseTime = this.calculateMovingAverage(this.stats.averageResponseTime, duration, this.stats.successfulRequests);
	}

	/**
	 * Update average wait time with moving average
	 */
	updateAverageWaitTime(waitTime) {
		this.stats.averageWaitTime = this.calculateMovingAverage(this.stats.averageWaitTime, waitTime, this.stats.totalRequests);
	}

	/**
	 * Calculate moving average
	 */
	calculateMovingAverage(currentAverage, newValue, count) {
		if (count === 1) return newValue;
		return (currentAverage * (count - 1) + newValue) / count;
	}

	/**
	 * Get current rate limiter statistics
	 */
	getStats() {
		const now = Date.now();
		this.cleanupOldRequests(now);

		return {
			...this.stats,
			currentUsage: {
				second: this.requests.second.length,
				minute: this.requests.minute.length,
				day: this.requests.day.length,
				burst: this.requests.burst.length,
			},
			limits: {
				second: this.config.requestsPerSecond,
				minute: this.config.requestsPerMinute,
				day: this.config.requestsPerDay,
				burst: this.config.burstLimit,
			},
			utilization: {
				second: this.requests.second.length / this.config.requestsPerSecond,
				minute: this.requests.minute.length / this.config.requestsPerMinute,
				day: this.requests.day.length / this.config.requestsPerDay,
				burst: this.requests.burst.length / this.config.burstLimit,
			},
		};
	}

	/**
	 * Reset rate limiter statistics
	 */
	reset() {
		this.requests = {
			second: [],
			minute: [],
			day: [],
			burst: [],
		};

		this.stats = {
			totalRequests: 0,
			limitHits: 0,
			averageWaitTime: 0,
			burstUsage: 0,
			lastReset: Date.now(),
		};

		logger.info(`Rate limiter reset for ${this.config.name}`);
	}

	/**
	 * Sleep utility
	 */
	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

/**
 * Rate Limiter Manager - Manages multiple rate limiters for different APIs
 */
export class RateLimiterManager {
	constructor() {
		this.limiters = new Map();
		this.globalStats = {
			totalRequests: 0,
			totalWaitTime: 0,
			apiUtilization: new Map(),
		};
	}

	/**
	 * Create or get rate limiter for API
	 */
	getRateLimiter(apiName, config) {
		if (!this.limiters.has(apiName)) {
			this.limiters.set(apiName, new RateLimiter({ ...config, name: apiName }));
		}
		return this.limiters.get(apiName);
	}

	/**
	 * Execute request with appropriate rate limiter
	 */
	async executeRequest(apiName, requestFn, config = {}, ...args) {
		const limiter = this.getRateLimiter(apiName, config);

		const startTime = Date.now();
		const result = await limiter.executeRequest(requestFn, ...args);
		const duration = Date.now() - startTime;

		// Update global stats
		this.globalStats.totalRequests++;
		this.globalStats.totalWaitTime += duration;
		this.globalStats.apiUtilization.set(apiName, (this.globalStats.apiUtilization.get(apiName) || 0) + 1);

		return result;
	}

	/**
	 * Get statistics for all rate limiters
	 */
	getAllStats() {
		const stats = {};

		for (const [apiName, limiter] of this.limiters) {
			stats[apiName] = limiter.getStats();
		}

		return {
			individual: stats,
			global: this.globalStats,
			summary: this.calculateSummaryStats(stats),
		};
	}

	/**
	 * Calculate summary statistics across all APIs
	 */
	calculateSummaryStats(individualStats) {
		const apis = Object.keys(individualStats);

		if (apis.length === 0) return {};

		const totalRequests = apis.reduce((sum, api) => sum + individualStats[api].totalRequests, 0);

		const averageWaitTime = apis.reduce((sum, api) => sum + (individualStats[api].averageWaitTime || 0), 0) / apis.length;

		const totalLimitHits = apis.reduce((sum, api) => sum + individualStats[api].limitHits, 0);

		return {
			totalRequests,
			averageWaitTime,
			totalLimitHits,
			hitRate: totalLimitHits / Math.max(totalRequests, 1),
			activeApis: apis.length,
		};
	}

	/**
	 * Reset all rate limiters
	 */
	resetAll() {
		for (const limiter of this.limiters.values()) {
			limiter.reset();
		}

		this.globalStats = {
			totalRequests: 0,
			totalWaitTime: 0,
			apiUtilization: new Map(),
		};

		logger.info("All rate limiters reset");
	}
}

// Global rate limiter manager instance
export const rateLimiterManager = new RateLimiterManager();
