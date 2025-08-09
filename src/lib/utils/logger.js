/**
 * Performance-First Logger Utility
 * Enterprise-grade logging with performance tracking and structured output
 * Optimized for development and production environments
 */

"use client";

// Logger configuration
const LOG_LEVELS = {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	CRITICAL: 4,
};

const LOG_LEVEL_NAMES = {
	0: "DEBUG",
	1: "INFO",
	2: "WARN",
	3: "ERROR",
	4: "CRITICAL",
};

class Logger {
	constructor() {
		this.logLevel = process.env.NODE_ENV === "production" ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;
		this.enablePerformanceLogging = process.env.NODE_ENV !== "production";
		this.enableConsoleLogging = true;
		this.logs = []; // Store logs for debugging
		this.maxLogHistory = 1000;
	}

	/**
	 * Format log message with timestamp and context
	 */
	formatMessage(level, message, data = null) {
		const timestamp = new Date().toISOString();
		const levelName = LOG_LEVEL_NAMES[level];

		const logEntry = {
			timestamp,
			level: levelName,
			message,
			data,
			url: typeof window !== "undefined" ? window.location.href : null,
			userAgent: typeof window !== "undefined" ? navigator.userAgent : null,
		};

		// Add to log history
		this.logs.push(logEntry);
		if (this.logs.length > this.maxLogHistory) {
			this.logs.shift();
		}

		return logEntry;
	}

	/**
	 * Output log to console with appropriate styling
	 */
	outputToConsole(logEntry) {
		if (!this.enableConsoleLogging) return;

		const { level, message, data, timestamp } = logEntry;
		const timeStr = new Date(timestamp).toLocaleTimeString();

		switch (level) {
			case "DEBUG":
				console.debug(`🔍 ${timeStr} [DEBUG]`, message, data || "");
				break;
			case "INFO":
				console.info(`ℹ️ ${timeStr} [INFO]`, message, data || "");
				break;
			case "WARN":
				console.warn(`⚠️ ${timeStr} [WARN]`, message, data || "");
				break;
			case "ERROR":
				console.error(`❌ ${timeStr} [ERROR]`, message, data || "");
				break;
			case "CRITICAL":
				console.error(`🚨 ${timeStr} [CRITICAL]`, message, data || "");
				break;
			default:
				console.log(`📝 ${timeStr} [LOG]`, message, data || "");
		}
	}

	/**
	 * Send logs to external service (production)
	 */
	sendToExternalService(logEntry) {
		if (process.env.NODE_ENV !== "production") return;

		// In production, you might want to send to services like:
		// - Sentry
		// - LogRocket
		// - DataDog
		// - Custom logging endpoint

		try {
			// Example: Send to custom endpoint
			if (process.env.NEXT_PUBLIC_LOGGING_ENDPOINT) {
				fetch(process.env.NEXT_PUBLIC_LOGGING_ENDPOINT, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(logEntry),
				}).catch(() => {
					// Silently fail to avoid infinite loops
				});
			}
		} catch (error) {
			// Silently fail to avoid infinite loops
		}
	}

	/**
	 * Core logging method
	 */
	log(level, message, data = null) {
		if (level < this.logLevel) return;

		const logEntry = this.formatMessage(level, message, data);
		this.outputToConsole(logEntry);
		this.sendToExternalService(logEntry);

		return logEntry;
	}

	/**
	 * Debug logging
	 */
	debug(message, data = null) {
		return this.log(LOG_LEVELS.DEBUG, message, data);
	}

	/**
	 * Info logging
	 */
	info(message, data = null) {
		return this.log(LOG_LEVELS.INFO, message, data);
	}

	/**
	 * Warning logging
	 */
	warn(message, data = null) {
		return this.log(LOG_LEVELS.WARN, message, data);
	}

	/**
	 * Error logging
	 */
	error(message, data = null) {
		return this.log(LOG_LEVELS.ERROR, message, data);
	}

	/**
	 * Critical error logging
	 */
	critical(message, data = null) {
		return this.log(LOG_LEVELS.CRITICAL, message, data);
	}

	/**
	 * Performance logging
	 */
	performance(message, duration = null) {
		if (!this.enablePerformanceLogging) return;

		const perfData = {
			type: "performance",
			duration,
			memory:
				typeof window !== "undefined" && window.performance?.memory
					? {
							used: window.performance.memory.usedJSHeapSize,
							total: window.performance.memory.totalJSHeapSize,
							limit: window.performance.memory.jsHeapSizeLimit,
						}
					: null,
		};

		return this.log(LOG_LEVELS.INFO, `⚡ ${message}`, perfData);
	}

	/**
	 * Security event logging
	 */
	security(data) {
		return this.log(LOG_LEVELS.WARN, "🔒 Security Event", {
			type: "security",
			...data,
		});
	}

	/**
	 * Business metrics logging
	 */
	businessMetrics(data) {
		return this.log(LOG_LEVELS.INFO, "📊 Business Metrics", {
			type: "business_metrics",
			...data,
		});
	}

	/**
	 * User interaction logging
	 */
	interaction(data) {
		return this.log(LOG_LEVELS.DEBUG, "👤 User Interaction", {
			type: "user_interaction",
			...data,
		});
	}

	/**
	 * Feature impact logging
	 */
	featureImpact(data) {
		return this.log(LOG_LEVELS.INFO, "🚀 Feature Impact", {
			type: "feature_impact",
			...data,
		});
	}

	/**
	 * User engagement logging
	 */
	engagement(data) {
		return this.log(LOG_LEVELS.INFO, "💡 User Engagement", {
			type: "user_engagement",
			...data,
		});
	}

	/**
	 * API performance logging
	 */
	api(data) {
		const level = data.status === "error" ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;
		return this.log(level, `🌐 API ${data.method || "REQUEST"} ${data.endpoint || ""}`, {
			type: "api_call",
			...data,
		});
	}

	/**
	 * Get recent logs for debugging
	 */
	getRecentLogs(count = 100) {
		return this.logs.slice(-count);
	}

	/**
	 * Clear log history
	 */
	clearLogs() {
		this.logs = [];
	}

	/**
	 * Set log level
	 */
	setLogLevel(level) {
		if (typeof level === "string") {
			this.logLevel = LOG_LEVELS[level.toUpperCase()] || LOG_LEVELS.INFO;
		} else {
			this.logLevel = level;
		}
	}

	/**
	 * Enable/disable console logging
	 */
	setConsoleLogging(enabled) {
		this.enableConsoleLogging = enabled;
	}

	/**
	 * Enable/disable performance logging
	 */
	setPerformanceLogging(enabled) {
		this.enablePerformanceLogging = enabled;
	}

	/**
	 * Get logger statistics
	 */
	getStats() {
		const stats = {
			totalLogs: this.logs.length,
			byLevel: {},
			recentErrors: [],
		};

		this.logs.forEach((log) => {
			stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;

			if (log.level === "ERROR" || log.level === "CRITICAL") {
				stats.recentErrors.push(log);
			}
		});

		// Keep only last 10 errors
		stats.recentErrors = stats.recentErrors.slice(-10);

		return stats;
	}
}

// Create singleton logger instance
const logger = new Logger();

// Export logger instance and utilities
export { logger, LOG_LEVELS };
export default logger;

// Global error handler for unhandled errors
if (typeof window !== "undefined") {
	window.addEventListener("error", (event) => {
		logger.error("Unhandled JavaScript Error", {
			message: event.error?.message || event.message,
			filename: event.filename,
			lineno: event.lineno,
			colno: event.colno,
			stack: event.error?.stack,
		});
	});

	window.addEventListener("unhandledrejection", (event) => {
		logger.error("Unhandled Promise Rejection", {
			reason: event.reason,
			promise: event.promise.toString(),
		});
	});
}

// Performance observer for Core Web Vitals (if available)
if (typeof window !== "undefined" && "PerformanceObserver" in window) {
	try {
		const observer = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (entry.entryType === "navigation") {
					logger.performance("Page Navigation", {
						loadTime: entry.loadEventEnd - entry.loadEventStart,
						domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
						firstPaint: entry.responseEnd - entry.requestStart,
					});
				}

				if (entry.entryType === "largest-contentful-paint") {
					logger.performance("Largest Contentful Paint", {
						value: entry.startTime,
						element: entry.element?.tagName,
					});
				}

				if (entry.entryType === "first-input") {
					logger.performance("First Input Delay", {
						value: entry.processingStart - entry.startTime,
						target: entry.target?.tagName,
					});
				}
			}
		});

		observer.observe({ entryTypes: ["navigation", "largest-contentful-paint", "first-input"] });
	} catch (error) {
		// Performance observer not supported or failed
		logger.debug("Performance Observer not available");
	}
}
