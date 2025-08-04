// Error Handler & Logger Utility
// Comprehensive error handling and logging system for business data collection

import fs from "fs/promises";
import path from "path";

/**
 * Enhanced Logger with multiple output targets and structured logging
 */
export class Logger {
	constructor(config = {}) {
		this.config = {
			level: config.level || "info",
			enableConsole: config.enableConsole !== false,
			enableFile: config.enableFile !== false,
			logDir: config.logDir || "logs",
			maxFileSize: config.maxFileSize || 10 * 1024 * 1024, // 10MB
			maxFiles: config.maxFiles || 5,
			format: config.format || "json",
			...config,
		};

		this.levels = {
			error: 0,
			warn: 1,
			info: 2,
			debug: 3,
			trace: 4,
		};

		this.levelColors = {
			error: "\x1b[31m", // Red
			warn: "\x1b[33m", // Yellow
			info: "\x1b[36m", // Cyan
			debug: "\x1b[90m", // Gray
			trace: "\x1b[35m", // Magenta
		};

		this.reset = "\x1b[0m";

		// Performance tracking
		this.stats = {
			totalLogs: 0,
			errorCount: 0,
			warnCount: 0,
			lastError: null,
			startTime: Date.now(),
		};

		this.initializeLogDirectory();
	}

	/**
	 * Initialize log directory
	 */
	async initializeLogDirectory() {
		if (this.config.enableFile) {
			try {
				await fs.mkdir(this.config.logDir, { recursive: true });
			} catch (error) {
				console.error("Failed to create log directory:", error);
				this.config.enableFile = false;
			}
		}
	}

	/**
	 * Check if message should be logged based on level
	 */
	shouldLog(level) {
		return this.levels[level] <= this.levels[this.config.level];
	}

	/**
	 * Format log message
	 */
	formatMessage(level, message, meta = {}) {
		const timestamp = new Date().toISOString();
		const logEntry = {
			timestamp,
			level: level.toUpperCase(),
			message: typeof message === "string" ? message : JSON.stringify(message),
			...meta,
			pid: process.pid,
			memory: process.memoryUsage(),
			uptime: process.uptime(),
		};

		if (this.config.format === "json") {
			return JSON.stringify(logEntry);
		} else {
			return `[${timestamp}] ${level.toUpperCase()}: ${logEntry.message}`;
		}
	}

	/**
	 * Write to console with colors
	 */
	writeToConsole(level, formattedMessage) {
		if (!this.config.enableConsole) return;

		const color = this.levelColors[level] || "";
		const message = this.config.format === "json" ? formattedMessage : `${color}${formattedMessage}${this.reset}`;

		if (level === "error") {
			console.error(message);
		} else if (level === "warn") {
			console.warn(message);
		} else {
			console.log(message);
		}
	}

	/**
	 * Write to file with rotation
	 */
	async writeToFile(level, formattedMessage) {
		if (!this.config.enableFile) return;

		try {
			const filename = `data-collection-${level}.log`;
			const filepath = path.join(this.config.logDir, filename);

			// Check file size and rotate if necessary
			await this.rotateLogFile(filepath);

			await fs.appendFile(filepath, formattedMessage + "\n");
		} catch (error) {
			console.error("Failed to write to log file:", error);
		}
	}

	/**
	 * Rotate log file if it exceeds max size
	 */
	async rotateLogFile(filepath) {
		try {
			const stats = await fs.stat(filepath);

			if (stats.size > this.config.maxFileSize) {
				const dir = path.dirname(filepath);
				const ext = path.extname(filepath);
				const base = path.basename(filepath, ext);

				// Rotate existing files
				for (let i = this.config.maxFiles - 1; i >= 1; i--) {
					const oldFile = path.join(dir, `${base}.${i}${ext}`);
					const newFile = path.join(dir, `${base}.${i + 1}${ext}`);

					try {
						await fs.rename(oldFile, newFile);
					} catch {
						// File doesn't exist, continue
					}
				}

				// Move current file to .1
				await fs.rename(filepath, path.join(dir, `${base}.1${ext}`));
			}
		} catch {
			// File doesn't exist yet, no rotation needed
		}
	}

	/**
	 * Core logging method
	 */
	async log(level, message, meta = {}) {
		if (!this.shouldLog(level)) return;

		// Update statistics
		this.stats.totalLogs++;
		if (level === "error") {
			this.stats.errorCount++;
			this.stats.lastError = { message, timestamp: Date.now(), meta };
		} else if (level === "warn") {
			this.stats.warnCount++;
		}

		const formattedMessage = this.formatMessage(level, message, meta);

		// Write to outputs
		this.writeToConsole(level, formattedMessage);
		await this.writeToFile(level, formattedMessage);
	}

	// Convenience methods
	error(message, meta = {}) {
		return this.log("error", message, meta);
	}
	warn(message, meta = {}) {
		return this.log("warn", message, meta);
	}
	info(message, meta = {}) {
		return this.log("info", message, meta);
	}
	debug(message, meta = {}) {
		return this.log("debug", message, meta);
	}
	trace(message, meta = {}) {
		return this.log("trace", message, meta);
	}

	// Specialized logging methods for business data collection
	performance(message, meta = {}) {
		return this.log("info", message, { type: "performance", ...meta });
	}

	api(message, meta = {}) {
		return this.log("info", message, { type: "api", ...meta });
	}

	business(message, meta = {}) {
		return this.log("info", message, { type: "business", ...meta });
	}

	security(message, meta = {}) {
		return this.log("warn", message, { type: "security", ...meta });
	}

	critical(message, meta = {}) {
		return this.log("error", message, { type: "critical", ...meta });
	}

	/**
	 * Get logger statistics
	 */
	getStats() {
		return {
			...this.stats,
			uptimeSeconds: (Date.now() - this.stats.startTime) / 1000,
			errorRate: this.stats.errorCount / Math.max(this.stats.totalLogs, 1),
			logsPerMinute: this.stats.totalLogs / Math.max((Date.now() - this.stats.startTime) / 60000, 1),
		};
	}
}

/**
 * Error Handler with retry logic and intelligent error recovery
 */
export class ErrorHandler {
	constructor(logger) {
		this.logger = logger;
		this.errorCounts = new Map();
		this.circuitBreakers = new Map();

		this.config = {
			maxRetries: 3,
			retryDelay: 1000,
			circuitBreakerThreshold: 5,
			circuitBreakerTimeout: 30000,
		};
	}

	/**
	 * Handle error with context and recovery strategies
	 */
	async handleError(error, context = {}) {
		const errorKey = this.generateErrorKey(error, context);
		const errorCount = this.errorCounts.get(errorKey) || 0;

		// Increment error count
		this.errorCounts.set(errorKey, errorCount + 1);

		// Log error with full context
		await this.logger.error("Error occurred", {
			error: {
				message: error.message,
				stack: error.stack,
				code: error.code,
				status: error.status,
			},
			context,
			errorCount: errorCount + 1,
			timestamp: Date.now(),
		});

		// Check circuit breaker
		if (this.shouldTriggerCircuitBreaker(errorKey, errorCount + 1)) {
			this.triggerCircuitBreaker(errorKey);
			throw new Error(`Circuit breaker triggered for ${errorKey}`);
		}

		// Determine if error is retryable
		if (this.isRetryableError(error) && errorCount < this.config.maxRetries) {
			const delay = this.calculateRetryDelay(errorCount);
			await this.logger.warn(`Retrying after ${delay}ms (attempt ${errorCount + 1}/${this.config.maxRetries})`);

			await this.sleep(delay);
			return { shouldRetry: true, delay };
		}

		return { shouldRetry: false };
	}

	/**
	 * Generate unique error key for tracking
	 */
	generateErrorKey(error, context) {
		const errorType = error.constructor.name;
		const operation = context.operation || "unknown";
		const api = context.api || "unknown";

		return `${api}-${operation}-${errorType}`;
	}

	/**
	 * Check if error is retryable
	 */
	isRetryableError(error) {
		const retryableStatuses = [408, 429, 500, 502, 503, 504];
		const retryableTypes = ["ECONNRESET", "ENOTFOUND", "ETIMEDOUT", "ECONNREFUSED"];

		return retryableStatuses.includes(error.status) || retryableStatuses.includes(error.response?.status) || retryableTypes.includes(error.code) || error.message?.includes("timeout") || error.message?.includes("rate limit");
	}

	/**
	 * Calculate retry delay with exponential backoff
	 */
	calculateRetryDelay(attempt) {
		const baseDelay = this.config.retryDelay;
		const exponentialDelay = baseDelay * Math.pow(2, attempt);
		const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd

		return Math.min(exponentialDelay + jitter, 30000); // Max 30 seconds
	}

	/**
	 * Check if circuit breaker should be triggered
	 */
	shouldTriggerCircuitBreaker(errorKey, errorCount) {
		const breaker = this.circuitBreakers.get(errorKey);

		if (breaker && breaker.state === "open") {
			return Date.now() < breaker.openUntil;
		}

		return errorCount >= this.config.circuitBreakerThreshold;
	}

	/**
	 * Trigger circuit breaker for error key
	 */
	triggerCircuitBreaker(errorKey) {
		const openUntil = Date.now() + this.config.circuitBreakerTimeout;

		this.circuitBreakers.set(errorKey, {
			state: "open",
			openUntil,
			triggeredAt: Date.now(),
		});

		this.logger.critical(`Circuit breaker opened for ${errorKey}`, {
			openUntil: new Date(openUntil).toISOString(),
		});
	}

	/**
	 * Check if circuit breaker is open for operation
	 */
	isCircuitBreakerOpen(errorKey) {
		const breaker = this.circuitBreakers.get(errorKey);

		if (!breaker) return false;

		if (breaker.state === "open" && Date.now() > breaker.openUntil) {
			// Transition to half-open
			breaker.state = "half-open";
			this.logger.info(`Circuit breaker transitioning to half-open for ${errorKey}`);
		}

		return breaker.state === "open";
	}

	/**
	 * Reset circuit breaker on successful operation
	 */
	resetCircuitBreaker(errorKey) {
		if (this.circuitBreakers.has(errorKey)) {
			this.circuitBreakers.delete(errorKey);
			this.errorCounts.delete(errorKey);
			this.logger.info(`Circuit breaker reset for ${errorKey}`);
		}
	}

	/**
	 * Execute operation with error handling and retry logic
	 */
	async executeWithRetry(operation, context = {}) {
		const errorKey = this.generateErrorKey({ constructor: { name: "Operation" } }, context);

		// Check circuit breaker
		if (this.isCircuitBreakerOpen(errorKey)) {
			throw new Error(`Circuit breaker is open for ${errorKey}`);
		}

		let lastError;

		for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
			try {
				const result = await operation();

				// Reset error tracking on success
				this.resetCircuitBreaker(errorKey);

				return result;
			} catch (error) {
				lastError = error;

				const handleResult = await this.handleError(error, { ...context, attempt });

				if (!handleResult.shouldRetry || attempt === this.config.maxRetries) {
					break;
				}
			}
		}

		throw lastError;
	}

	/**
	 * Get error statistics
	 */
	getStats() {
		const errorStats = {};

		for (const [key, count] of this.errorCounts) {
			errorStats[key] = count;
		}

		const circuitBreakerStats = {};

		for (const [key, breaker] of this.circuitBreakers) {
			circuitBreakerStats[key] = breaker;
		}

		return {
			errorCounts: errorStats,
			circuitBreakers: circuitBreakerStats,
			totalUniqueErrors: this.errorCounts.size,
			activeCircuitBreakers: Array.from(this.circuitBreakers.values()).filter((b) => b.state === "open").length,
		};
	}

	/**
	 * Sleep utility
	 */
	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

// Global instances
export const logger = new Logger({
	level: process.env.LOG_LEVEL || "info",
	enableFile: true,
	logDir: "logs/data-collection",
});

export const errorHandler = new ErrorHandler(logger);

// Global error handlers
process.on("uncaughtException", async (error) => {
	await logger.critical("Uncaught Exception", { error: error.message, stack: error.stack });
	process.exit(1);
});

process.on("unhandledRejection", async (reason, promise) => {
	await logger.critical("Unhandled Rejection", {
		reason: reason?.message || reason,
		promise: promise.toString(),
	});
});

// Graceful shutdown
process.on("SIGINT", async () => {
	await logger.info("Received SIGINT, shutting down gracefully");
	process.exit(0);
});

process.on("SIGTERM", async () => {
	await logger.info("Received SIGTERM, shutting down gracefully");
	process.exit(0);
});
