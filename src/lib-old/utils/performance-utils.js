/**
 * Performance Utilities
 * Common performance optimization utilities for the application
 */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on leading edge
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			timeout = null;
			if (!immediate) func(...args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func(...args);
	};
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
	let inThrottle;
	return function executedFunction(...args) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
};

/**
 * Memoize function results
 * @param {Function} func - Function to memoize
 * @param {Function} keyGenerator - Function to generate cache keys
 * @returns {Function} Memoized function
 */
export const memoize = (func, keyGenerator = (...args) => JSON.stringify(args)) => {
	const cache = new Map();
	return function memoizedFunction(...args) {
		const key = keyGenerator(...args);
		if (cache.has(key)) {
			return cache.get(key);
		}
		const result = func.apply(this, args);
		cache.set(key, result);
		return result;
	};
};

/**
 * Measure function execution time
 * @param {Function} func - Function to measure
 * @param {string} label - Label for the measurement
 * @returns {Function} Function that logs execution time
 */
export const measureTime = (func, label = "Function") => {
	return function timedFunction(...args) {
		const start = performance.now();
		const result = func.apply(this, args);
		const end = performance.now();
		console.log(`${label} execution time: ${(end - start).toFixed(2)}ms`);
		return result;
	};
};

/**
 * Create a function that only executes once
 * @param {Function} func - Function to execute once
 * @returns {Function} Function that only executes once
 */
export const once = (func) => {
	let called = false;
	let result;
	return function onceFunction(...args) {
		if (!called) {
			called = true;
			result = func.apply(this, args);
		}
		return result;
	};
};

/**
 * Batch function calls and execute them together
 * @param {Function} func - Function to batch
 * @param {number} delay - Delay before batch execution
 * @returns {Function} Batched function
 */
export const batch = (func, delay = 0) => {
	let calls = [];
	let timeoutId;

	return function batchedFunction(...args) {
		calls.push(args);

		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			const allCalls = [...calls];
			calls = [];
			func(allCalls);
		}, delay);
	};
};

/**
 * Rate limit function calls
 * @param {Function} func - Function to rate limit
 * @param {number} maxCalls - Maximum calls allowed
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {Function} Rate limited function
 */
export const rateLimit = (func, maxCalls, timeWindow) => {
	const calls = [];

	return function rateLimitedFunction(...args) {
		const now = Date.now();
		const windowStart = now - timeWindow;

		// Remove old calls outside the time window
		while (calls.length && calls[0] < windowStart) {
			calls.shift();
		}

		if (calls.length < maxCalls) {
			calls.push(now);
			return func.apply(this, args);
		} else {
			console.warn("Rate limit exceeded");
			return null;
		}
	};
};
