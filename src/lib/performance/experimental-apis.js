/**
 * Experimental Web APIs for Performance
 *
 * Cutting-edge browser APIs for maximum performance:
 * - View Transitions API
 * - Navigation API
 * - Scheduler API
 * - Paint Timing API
 * - User Timing API Level 3
 * - Web Locks API
 * - Background Sync API
 */

"use client";

/**
 * View Transitions API Integration
 * Provides smooth, performant page transitions
 */
export class ViewTransitionsManager {
	constructor() {
		this.isSupported = this.checkSupport();
		this.activeTransitions = new Set();
		this.transitionQueue = [];
		this.isProcessing = false;
	}

	checkSupport() {
		return typeof document !== "undefined" && "startViewTransition" in document;
	}

	/**
	 * Execute a view transition with fallback
	 */
	async transition(updateFunction, options = {}) {
		const { name = "default", timeout = 3000, fallback = null } = options;

		if (!this.isSupported) {
			// Fallback for browsers without View Transitions API
			if (fallback) {
				return await fallback();
			} else {
				return await updateFunction();
			}
		}

		try {
			const transition = document.startViewTransition(async () => {
				await updateFunction();
			});

			this.activeTransitions.add(transition);

			// Add timeout protection
			const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Transition timeout")), timeout));

			await Promise.race([transition.finished, timeoutPromise]);

			this.activeTransitions.delete(transition);
			return transition;
		} catch (error) {
			console.warn("View transition failed:", error);
			// Fallback to direct update
			return await updateFunction();
		}
	}

	/**
	 * Transition between pages
	 */
	async transitionToPage(href, updateDOM) {
		return this.transition(
			async () => {
				// Update document title and content
				await updateDOM();

				// Update URL
				if (typeof window !== "undefined") {
					window.history.pushState({}, "", href);
				}
			},
			{
				name: "page-transition",
				timeout: 2000,
			}
		);
	}

	/**
	 * Transition between states
	 */
	async transitionState(stateName, updateFunction) {
		return this.transition(updateFunction, {
			name: `state-${stateName}`,
			timeout: 1000,
		});
	}

	/**
	 * Skip all active transitions
	 */
	skipActiveTransitions() {
		this.activeTransitions.forEach((transition) => {
			if (transition.skipTransition) {
				transition.skipTransition();
			}
		});
	}
}

/**
 * Navigation API Integration
 * Enhanced navigation with performance monitoring
 */
export class EnhancedNavigationManager {
	constructor() {
		this.isSupported = this.checkSupport();
		this.navigationEntries = [];
		this.performanceMetrics = new Map();

		if (this.isSupported) {
			this.setupEventListeners();
		}
	}

	checkSupport() {
		return typeof window !== "undefined" && "navigation" in window;
	}

	setupEventListeners() {
		if (!this.isSupported) return;

		// Listen to navigation events
		navigation.addEventListener("navigate", (event) => {
			this.handleNavigate(event);
		});

		navigation.addEventListener("navigatesuccess", (event) => {
			this.handleNavigateSuccess(event);
		});

		navigation.addEventListener("navigateerror", (event) => {
			this.handleNavigateError(event);
		});
	}

	/**
	 * Safely derive destination URL from a navigation event
	 */
	getDestinationUrl(event) {
		const eventUrl = event?.destination?.url;
		if (typeof eventUrl === "string" && eventUrl.length > 0) return eventUrl;
		if (typeof window !== "undefined") return window.location?.href;
		return undefined;
	}

	handleNavigate(event) {
		const startTime = performance.now();
		const navigationId = Math.random().toString(36);

		const destinationUrl = this.getDestinationUrl(event);
		const navigationType = event?.navigationType || "push";

		this.performanceMetrics.set(navigationId, {
			startTime,
			url: destinationUrl,
			type: navigationType,
		});

		// Track navigation attempt
		if (typeof gtag !== "undefined") {
			gtag("event", "navigation_start", {
				event_category: "performance",
				event_label: destinationUrl || "unknown",
				custom_map: {
					navigation_type: navigationType,
					navigation_id: navigationId,
				},
			});
		}
	}

		handleNavigateSuccess(event) {
		const endTime = performance.now();

			const destUrl = this.getDestinationUrl(event);

			// Try to find matching metrics by URL first
			let matchedEntry = null;
			for (const [id, metrics] of this.performanceMetrics) {
				if (!metrics || typeof metrics !== 'object') {
					continue;
				}
				if (destUrl && metrics.url && metrics.url === destUrl) {
					matchedEntry = { id, metrics };
					break;
				}
			}

		// Fallback: pick the most recent entry if no URL match
			if (!matchedEntry && this.performanceMetrics.size > 0) {
			let latest = null;
				for (const [id, metrics] of this.performanceMetrics) {
					if (!metrics || typeof metrics.startTime !== 'number') {
						continue;
					}
					if (!latest || metrics.startTime > latest.metrics.startTime) {
						latest = { id, metrics };
					}
				}
			matchedEntry = latest;
		}

			if (matchedEntry && matchedEntry.metrics) {
			const { id, metrics } = matchedEntry;
				const duration = endTime - (metrics.startTime || endTime);

				try {
					if (typeof gtag !== "undefined") {
						gtag("event", "navigation_success", {
							event_category: "performance",
							event_label: destUrl || metrics.url || "unknown",
							value: Math.round(duration),
							custom_map: {
								navigation_type: metrics.type || "unknown",
								duration: duration,
							},
						});
					}
				} catch (_) {
					// swallow analytics errors
				}

			this.performanceMetrics.delete(id);
		}
	}

	handleNavigateError(event) {
		console.warn("Navigation error:", event.error);

		// Track navigation error
		if (typeof gtag !== "undefined") {
			gtag("event", "navigation_error", {
				event_category: "performance",
				event_label: event.destination?.url || "unknown",
				custom_map: {
					error_message: event.error?.message || "Unknown error",
				},
			});
		}
	}

	/**
	 * Navigate with performance tracking
	 */
	async navigate(url, options = {}) {
		if (!this.isSupported) {
			// Fallback to traditional navigation
			window.location.href = url;
			return;
		}

		try {
			const result = await navigation.navigate(url, options);
			return result;
		} catch (error) {
			console.warn("Enhanced navigation failed:", error);
			// Fallback
			window.location.href = url;
		}
	}

	/**
	 * Back navigation with performance tracking
	 */
	async back() {
		if (!this.isSupported) {
			window.history.back();
			return;
		}

		try {
			const result = await navigation.back();
			return result;
		} catch (error) {
			console.warn("Enhanced back navigation failed:", error);
			window.history.back();
		}
	}
}

/**
 * Scheduler API Integration
 * Intelligent task scheduling for performance
 */
export class PerformanceScheduler {
	constructor() {
		this.isSupported = this.checkSupport();
		this.taskQueue = [];
		this.highPriorityQueue = [];
		this.isProcessing = false;
	}

	checkSupport() {
		return typeof window !== "undefined" && "scheduler" in window && "postTask" in scheduler;
	}

	/**
	 * Schedule a task with priority
	 */
	async scheduleTask(callback, options = {}) {
		const { priority = "user-visible", delay = 0, signal = null } = options;

		if (!this.isSupported) {
			// Fallback to setTimeout/requestIdleCallback
			return this.fallbackSchedule(callback, options);
		}

		try {
			const taskOptions = { priority };
			if (delay > 0) {
				taskOptions.delay = delay;
			}
			if (signal) {
				taskOptions.signal = signal;
			}

			return await scheduler.postTask(callback, taskOptions);
		} catch (error) {
			console.warn("Scheduler API failed:", error);
			return this.fallbackSchedule(callback, options);
		}
	}

	fallbackSchedule(callback, options) {
		const { priority = "user-visible", delay = 0 } = options;

		if (priority === "user-blocking") {
			// High priority - use setTimeout
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(callback());
				}, delay);
			});
		} else if (priority === "background") {
			// Low priority - use requestIdleCallback if available
			return new Promise((resolve) => {
				if ("requestIdleCallback" in window) {
					requestIdleCallback(() => {
						resolve(callback());
					});
				} else {
					setTimeout(() => {
						resolve(callback());
					}, delay + 100);
				}
			});
		} else {
			// Normal priority
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(callback());
				}, delay);
			});
		}
	}

	/**
	 * Schedule critical performance tasks
	 */
	async scheduleCritical(callback) {
		return this.scheduleTask(callback, {
			priority: "user-blocking",
		});
	}

	/**
	 * Schedule background tasks
	 */
	async scheduleBackground(callback) {
		return this.scheduleTask(callback, {
			priority: "background",
		});
	}

	/**
	 * Schedule with idle callback
	 */
	async scheduleIdle(callback, timeout = 5000) {
		if ("requestIdleCallback" in window) {
			return new Promise((resolve) => {
				requestIdleCallback(
					() => {
						resolve(callback());
					},
					{ timeout }
				);
			});
		} else {
			return this.scheduleBackground(callback);
		}
	}
}

/**
 * Paint Timing API Integration
 * Advanced paint performance monitoring
 */
export class PaintTimingMonitor {
	constructor() {
		this.isSupported = this.checkSupport();
		this.paintMetrics = new Map();

		if (this.isSupported) {
			this.startMonitoring();
		}
	}

	checkSupport() {
		return typeof window !== "undefined" && "PerformanceObserver" in window;
	}

	startMonitoring() {
		try {
			// Monitor paint timing
			const paintObserver = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					this.recordPaintMetric(entry);
				}
			});

			paintObserver.observe({ entryTypes: ["paint"] });

			// Monitor element timing
			const elementObserver = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					this.recordElementMetric(entry);
				}
			});

			elementObserver.observe({ entryTypes: ["element"] });

			// Monitor long tasks
			const longTaskObserver = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					this.recordLongTask(entry);
				}
			});

			longTaskObserver.observe({ entryTypes: ["longtask"] });
		} catch (error) {
			console.warn("Paint timing monitoring failed:", error);
		}
	}

	recordPaintMetric(entry) {
		this.paintMetrics.set(entry.name, {
			startTime: entry.startTime,
			duration: entry.duration,
			timestamp: Date.now(),
		});

		// Track paint metrics
		if (typeof gtag !== "undefined") {
			gtag("event", "paint_timing", {
				event_category: "performance",
				event_label: entry.name,
				value: Math.round(entry.startTime),
				custom_map: {
					paint_type: entry.name,
					start_time: entry.startTime,
				},
			});
		}
	}

	recordElementMetric(entry) {
		// Track element timing
		if (typeof gtag !== "undefined") {
			gtag("event", "element_timing", {
				event_category: "performance",
				event_label: entry.identifier,
				value: Math.round(entry.startTime),
				custom_map: {
					element_id: entry.identifier,
					render_time: entry.renderTime,
					load_time: entry.loadTime,
				},
			});
		}
	}

	recordLongTask(entry) {
		// Only warn for very long tasks (>500ms) and throttle warnings
		const now = Date.now();
		const longTaskThreshold = 500; // ms
		const warningCooldown = 5000; // 5 seconds between warnings
		
		if (entry.duration > longTaskThreshold) {
			// Throttle console warnings to avoid spam
			if (!this.lastLongTaskWarning || (now - this.lastLongTaskWarning) > warningCooldown) {
				console.warn("Critical long task detected:", {
					duration: Math.round(entry.duration),
					startTime: Math.round(entry.startTime),
					attribution: entry.attribution?.length || 0,
				});
				this.lastLongTaskWarning = now;
			}

			// Track long tasks for performance issues (only critical ones)
			if (typeof gtag !== "undefined") {
				gtag("event", "long_task_critical", {
					event_category: "performance",
					event_label: "blocking_task",
					value: Math.round(entry.duration),
					custom_map: {
						task_duration: entry.duration,
						start_time: entry.startTime,
					},
				});
			}
		}
	}

	getPaintMetrics() {
		return Object.fromEntries(this.paintMetrics);
	}
}

/**
 * Web Locks API Integration
 * Coordinate resource access for performance
 */
export class ResourceLockManager {
	constructor() {
		this.isSupported = this.checkSupport();
		this.activeLocks = new Map();
	}

	checkSupport() {
		return typeof navigator !== "undefined" && "locks" in navigator;
	}

	/**
	 * Request exclusive access to a resource
	 */
	async withLock(name, callback, options = {}) {
		if (!this.isSupported) {
			// Fallback without locking
			return await callback();
		}

		try {
			return await navigator.locks.request(name, options, async (lock) => {
				this.activeLocks.set(name, lock);

				try {
					const result = await callback();
					return result;
				} finally {
					this.activeLocks.delete(name);
				}
			});
		} catch (error) {
			console.warn("Web Locks API failed:", error);
			return await callback();
		}
	}

	/**
	 * Query active locks
	 */
	async queryLocks() {
		if (!this.isSupported) {
			return { held: [], pending: [] };
		}

		try {
			return await navigator.locks.query();
		} catch (error) {
			console.warn("Lock query failed:", error);
			return { held: [], pending: [] };
		}
	}
}

/**
 * Global instances
 */
export const viewTransitions = new ViewTransitionsManager();
export const enhancedNavigation = new EnhancedNavigationManager();
export const performanceScheduler = new PerformanceScheduler();
export const paintTiming = new PaintTimingMonitor();
export const resourceLocks = new ResourceLockManager();

/**
 * Initialize all experimental APIs
 */
export function initializeExperimentalAPIs() {
	console.log("Initializing experimental web APIs...");

	// Log API support
	const support = {
		viewTransitions: viewTransitions.isSupported,
		navigation: enhancedNavigation.isSupported,
		scheduler: performanceScheduler.isSupported,
		paintTiming: paintTiming.isSupported,
		webLocks: resourceLocks.isSupported,
	};

	console.log("API Support:", support);

	// Track API support
	if (typeof gtag !== "undefined") {
		gtag("event", "api_support", {
			event_category: "performance",
			custom_map: support,
		});
	}

	return support;
}

/**
 * React hooks for experimental APIs
 */

// View Transitions hook
export function useViewTransitions() {
	return {
		transition: viewTransitions.transition.bind(viewTransitions),
		transitionToPage: viewTransitions.transitionToPage.bind(viewTransitions),
		transitionState: viewTransitions.transitionState.bind(viewTransitions),
		isSupported: viewTransitions.isSupported,
	};
}

// Enhanced Navigation hook
export function useEnhancedNavigation() {
	return {
		navigate: enhancedNavigation.navigate.bind(enhancedNavigation),
		back: enhancedNavigation.back.bind(enhancedNavigation),
		isSupported: enhancedNavigation.isSupported,
	};
}

// Performance Scheduler hook
export function usePerformanceScheduler() {
	return {
		scheduleTask: performanceScheduler.scheduleTask.bind(performanceScheduler),
		scheduleCritical: performanceScheduler.scheduleCritical.bind(performanceScheduler),
		scheduleBackground: performanceScheduler.scheduleBackground.bind(performanceScheduler),
		scheduleIdle: performanceScheduler.scheduleIdle.bind(performanceScheduler),
		isSupported: performanceScheduler.isSupported,
	};
}

// Resource Locks hook
export function useResourceLock() {
	return {
		withLock: resourceLocks.withLock.bind(resourceLocks),
		queryLocks: resourceLocks.queryLocks.bind(resourceLocks),
		isSupported: resourceLocks.isSupported,
	};
}

/**
 * Performance-optimized component wrapper
 */
export function withExperimentalAPIs(Component) {
	return function ExperimentalComponent(props) {
		const viewTransitionsAPI = useViewTransitions();
		const schedulerAPI = usePerformanceScheduler();

		return <Component {...props} viewTransitions={viewTransitionsAPI} scheduler={schedulerAPI} />;
	};
}
