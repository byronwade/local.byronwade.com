// lib/utils/initPerformanceSystem.js - Master Performance Initialization
import { logger } from "./logger";
import instantPreloader from "./instant-preloader";
import instantPageLoader from "./instant-page-loader";
import streamingSearchEngine from "./streaming-search";
import { CompressedSearchIndex } from "./compressed-search-index";
import advancedPrefetcher from "./advanced-prefetching";
import ultraAggressivePrefetcher from "./ultra-aggressive-prefetching";
import imageHoverPrefetcher from "./image-hover-prefetching";
import edgeStreamingManager from "./edge-streaming";
import partialPrerenderingManager from "./partial-prerendering";
import { performanceOrchestrator } from "./performance-orchestrator";

/**
 * Master Performance System - Coordinates all performance optimizations
 * This ensures everything loads in the right order and works together
 */
class PerformanceSystem {
	constructor() {
		this.isInitialized = false;
		this.initializationPromise = null;
		this.components = {
			instantPreloader: false,
			instantPageLoader: false,
			streamingSearch: false,
			compressedIndex: false,
			advancedPrefetcher: false,
			ultraAggressivePrefetcher: false,
			imageHoverPrefetcher: false,
			edgeStreaming: false,
			partialPrerendering: false,
			performanceOrchestrator: false,
			serviceWorker: false,
		};

		// Performance targets (based on NextFaster and Google recommendations)
		this.targets = {
			LCP: 800, // Largest Contentful Paint < 800ms
			FID: 50, // First Input Delay < 50ms
			CLS: 0.05, // Cumulative Layout Shift < 0.05
			TTI: 1200, // Time to Interactive < 1.2s
			FCP: 600, // First Contentful Paint < 600ms
		};

		logger.info("🚀 Performance System created");
	}

	/**
	 * Initialize all performance systems
	 */
	async initialize() {
		if (this.isInitialized) {
			return this.initializationPromise;
		}

		if (this.initializationPromise) {
			return this.initializationPromise;
		}

		this.initializationPromise = this._performInitialization();
		return this.initializationPromise;
	}

	/**
	 * Internal initialization logic
	 */
	async _performInitialization() {
		const startTime = performance.now();
		logger.info("🎯 Initializing Performance System...");

		try {
			// Phase 1: Core Performance Infrastructure (parallel)
			await this._initializePhase1();

			// Phase 2: Search and Navigation Systems (parallel)
			await this._initializePhase2();

			// Phase 3: Advanced Features (sequential)
			await this._initializePhase3();

			// Phase 4: Service Worker and Monitoring
			await this._initializePhase4();

			const initTime = performance.now() - startTime;
			this.isInitialized = true;

			logger.performance(`✅ Performance System initialized in ${initTime.toFixed(1)}ms`);
			this._logSystemStatus();

			return true;
		} catch (error) {
			logger.error("❌ Performance System initialization failed:", error);
			throw error;
		}
	}

	/**
	 * Phase 1: Core Performance Infrastructure
	 */
	async _initializePhase1() {
		logger.debug("📊 Phase 1: Core Performance Infrastructure");

		const phase1Promises = [
			// Performance monitoring (highest priority)
			this._initPerformanceOrchestrator(),

			// Basic preloading system
			this._initInstantPreloader(),

			// Web Vitals tracking
			this._initWebVitals(),
		];

		await Promise.allSettled(phase1Promises);
	}

	/**
	 * Phase 2: Search and Navigation Systems
	 */
	async _initializePhase2() {
		logger.debug("🔍 Phase 2: Search and Navigation Systems");

		const phase2Promises = [
			// Instant page navigation
			this._initInstantPageLoader(),

			// Streaming search engine
			this._initStreamingSearch(),

			// Compressed search index
			this._initCompressedIndex(),

			// Image hover prefetching
			this._initImageHoverPrefetcher(),
		];

		await Promise.allSettled(phase2Promises);
	}

	/**
	 * Phase 3: Advanced Features
	 */
	async _initializePhase3() {
		logger.debug("🧠 Phase 3: Advanced Features");

		// Advanced prefetching (depends on user behavior tracking)
		await this._initAdvancedPrefetcher();

		// Ultra-aggressive prefetching
		await this._initUltraAggressivePrefetcher();

		// Edge streaming
		await this._initEdgeStreaming();

		// Partial prerendering (PPR)
		await this._initPartialPrerendering();

		// Route-based optimizations
		await this._initRouteOptimizations();

		// Memory management
		await this._initMemoryManagement();
	}

	/**
	 * Phase 4: Service Worker and Monitoring
	 */
	async _initializePhase4() {
		logger.debug("🔧 Phase 4: Service Worker and Monitoring");

		const phase4Promises = [
			// Service worker for offline-first
			this._initServiceWorker(),

			// Performance monitoring and alerts
			this._initPerformanceMonitoring(),

			// Error tracking and recovery
			this._initErrorTracking(),
		];

		await Promise.allSettled(phase4Promises);
	}

	/**
	 * Initialize Performance Orchestrator
	 */
	async _initPerformanceOrchestrator() {
		try {
			await performanceOrchestrator.init();
			this.components.performanceOrchestrator = true;
			logger.debug("✅ Performance Orchestrator initialized");
		} catch (error) {
			logger.error("❌ Performance Orchestrator failed:", error);
		}
	}

	/**
	 * Initialize Instant Preloader
	 */
	async _initInstantPreloader() {
		try {
			await instantPreloader.init();
			this.components.instantPreloader = true;
			logger.debug("✅ Instant Preloader initialized");
		} catch (error) {
			logger.error("❌ Instant Preloader failed:", error);
		}
	}

	/**
	 * Initialize Instant Page Loader
	 */
	async _initInstantPageLoader() {
		try {
			await instantPageLoader.init();
			this.components.instantPageLoader = true;
			logger.debug("✅ Instant Page Loader initialized");
		} catch (error) {
			logger.error("❌ Instant Page Loader failed:", error);
		}
	}

	/**
	 * Initialize Streaming Search
	 */
	async _initStreamingSearch() {
		try {
			// Streaming search is ready to use immediately
			this.components.streamingSearch = true;
			logger.debug("✅ Streaming Search initialized");
		} catch (error) {
			logger.error("❌ Streaming Search failed:", error);
		}
	}

	/**
	 * Initialize Compressed Search Index
	 */
	async _initCompressedIndex() {
		try {
			const searchIndex = new CompressedSearchIndex();

			// Try to load existing index
			const loaded = searchIndex.load();
			if (!loaded) {
				// Build index if none exists (can be done in background)
				this._buildSearchIndexInBackground(searchIndex);
			}

			// Make index globally available
			window.compressedSearchIndex = searchIndex;
			this.components.compressedIndex = true;
			logger.debug("✅ Compressed Search Index initialized");
		} catch (error) {
			logger.error("❌ Compressed Search Index failed:", error);
		}
	}

	/**
	 * Initialize Advanced Prefetcher
	 */
	async _initAdvancedPrefetcher() {
		try {
			await advancedPrefetcher.init({
				enableHover: true,
				enableIdle: true,
				enableViewport: true,
				enablePrediction: true,
			});
			this.components.advancedPrefetcher = true;
			logger.debug("✅ Advanced Prefetcher initialized");
		} catch (error) {
			logger.error("❌ Advanced Prefetcher failed:", error);
		}
	}

	/**
	 * Initialize Ultra-Aggressive Prefetcher
	 */
	async _initUltraAggressivePrefetcher() {
		try {
			await ultraAggressivePrefetcher.init();
			this.components.ultraAggressivePrefetcher = true;
			logger.debug("✅ Ultra-Aggressive Prefetcher initialized");
		} catch (error) {
			logger.error("❌ Ultra-Aggressive Prefetcher failed:", error);
		}
	}

	/**
	 * Initialize Image Hover Prefetcher
	 */
	async _initImageHoverPrefetcher() {
		try {
			await imageHoverPrefetcher.init();
			this.components.imageHoverPrefetcher = true;
			logger.debug("✅ Image Hover Prefetcher initialized");
		} catch (error) {
			logger.error("❌ Image Hover Prefetcher failed:", error);
		}
	}

	/**
	 * Initialize Edge Streaming
	 */
	async _initEdgeStreaming() {
		try {
			await edgeStreamingManager.init();
			this.components.edgeStreaming = true;
			logger.debug("✅ Edge Streaming initialized");
		} catch (error) {
			logger.error("❌ Edge Streaming failed:", error);
		}
	}

	/**
	 * Initialize Partial Prerendering (PPR)
	 */
	async _initPartialPrerendering() {
		try {
			await partialPrerenderingManager.init();
			this.components.partialPrerendering = true;
			logger.debug("✅ Partial Prerendering initialized");
		} catch (error) {
			logger.error("❌ Partial Prerendering failed:", error);
		}
	}

	/**
	 * Initialize Service Worker
	 */
	async _initServiceWorker() {
		if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
			return;
		}

		try {
			const registration = await navigator.serviceWorker.register("/sw.js", {
				scope: "/",
				updateViaCache: "none",
			});

			// Listen for updates
			registration.addEventListener("updatefound", () => {
				logger.info("🔄 Service Worker update found");
			});

			// Handle controller change
			navigator.serviceWorker.addEventListener("controllerchange", () => {
				logger.info("🔄 Service Worker controller changed");
			});

			this.components.serviceWorker = true;
			logger.debug("✅ Service Worker initialized");
		} catch (error) {
			logger.error("❌ Service Worker failed:", error);
		}
	}

	/**
	 * Initialize Web Vitals tracking
	 */
	async _initWebVitals() {
		try {
			// Dynamic import to avoid blocking
			const { observeWebVitals } = await import("./webVitals");

			observeWebVitals((metric) => {
				// Track metric
				logger.performance(`Web Vital: ${metric.name} = ${metric.value.toFixed(2)}`);

				// Check against targets
				const target = this.targets[metric.name];
				if (target && metric.value > target) {
					logger.warn(`⚠️ ${metric.name} exceeded target: ${metric.value.toFixed(2)} > ${target}`);
				}

				// Send to analytics (in real app)
				this._sendMetricToAnalytics(metric);
			});

			logger.debug("✅ Web Vitals tracking initialized");
		} catch (error) {
			logger.error("❌ Web Vitals tracking failed:", error);
		}
	}

	/**
	 * Initialize route-based optimizations
	 */
	async _initRouteOptimizations() {
		try {
			if (typeof window === "undefined") return;

			const path = window.location.pathname;

			// Business page optimizations
			if (path.startsWith("/biz/")) {
				await this._optimizeBusinessPage();
			}

			// Search page optimizations
			else if (path.startsWith("/search")) {
				await this._optimizeSearchPage();
			}

			// Category page optimizations
			else if (path.startsWith("/categories/")) {
				await this._optimizeCategoryPage();
			}

			logger.debug("✅ Route optimizations initialized");
		} catch (error) {
			logger.error("❌ Route optimizations failed:", error);
		}
	}

	/**
	 * Initialize memory management
	 */
	async _initMemoryManagement() {
		try {
			if (typeof window === "undefined") return;

			// Monitor memory usage
			if ("memory" in performance) {
				setInterval(() => {
					const memory = performance.memory;
					const usedMB = memory.usedJSHeapSize / 1024 / 1024;

					// Alert if memory usage is high
					if (usedMB > 100) {
						// 100MB threshold
						logger.warn(`⚠️ High memory usage: ${usedMB.toFixed(1)}MB`);
						this._cleanupMemory();
					}
				}, 30000); // Check every 30 seconds
			}

			// Cleanup on visibility change
			document.addEventListener("visibilitychange", () => {
				if (document.visibilityState === "hidden") {
					this._cleanupMemory();
				}
			});

			logger.debug("✅ Memory management initialized");
		} catch (error) {
			logger.error("❌ Memory management failed:", error);
		}
	}

	/**
	 * Initialize performance monitoring
	 */
	async _initPerformanceMonitoring() {
		try {
			// Long task detection
			if ("PerformanceObserver" in window) {
				const observer = new PerformanceObserver((list) => {
					list.getEntries().forEach((entry) => {
						if (entry.entryType === "longtask") {
							logger.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
						}
					});
				});

				observer.observe({ entryTypes: ["longtask"] });
			}

			// Navigation timing
			window.addEventListener("load", () => {
				setTimeout(() => {
					const navigation = performance.getEntriesByType("navigation")[0];
					const loadTime = navigation.loadEventEnd - navigation.fetchStart;

					logger.performance(`📊 Page load time: ${loadTime.toFixed(2)}ms`);

					if (loadTime > this.targets.TTI) {
						logger.warn(`⚠️ Page load exceeded target: ${loadTime.toFixed(2)} > ${this.targets.TTI}`);
					}
				}, 0);
			});

			logger.debug("✅ Performance monitoring initialized");
		} catch (error) {
			logger.error("❌ Performance monitoring failed:", error);
		}
	}

	/**
	 * Initialize error tracking
	 */
	async _initErrorTracking() {
		try {
			// Global error handler
			window.addEventListener("error", (event) => {
				logger.error("Global error:", {
					message: event.message,
					filename: event.filename,
					lineno: event.lineno,
					colno: event.colno,
					error: event.error,
				});
			});

			// Unhandled promise rejections
			window.addEventListener("unhandledrejection", (event) => {
				logger.error("Unhandled promise rejection:", event.reason);
			});

			logger.debug("✅ Error tracking initialized");
		} catch (error) {
			logger.error("❌ Error tracking failed:", error);
		}
	}

	/**
	 * Build search index in background
	 */
	_buildSearchIndexInBackground(searchIndex) {
		// Use requestIdleCallback for non-blocking index building
		if ("requestIdleCallback" in window) {
			requestIdleCallback(
				() => {
					this._buildSearchIndex(searchIndex);
				},
				{ timeout: 5000 }
			);
		} else {
			setTimeout(() => {
				this._buildSearchIndex(searchIndex);
			}, 100);
		}
	}

	/**
	 * Build search index from available data
	 */
	async _buildSearchIndex(searchIndex) {
		try {
			logger.debug("🔨 Building search index...");

			// Get business data (would normally come from API)
			const businesses = await this._getBusinessData();

			// Add businesses to index
			businesses.forEach((business, index) => {
				const content = `${business.name} ${business.description || ""} ${business.categories?.map((c) => c.name).join(" ") || ""}`;
				searchIndex.addDocument(`business_${business.id}`, content);
			});

			// Save index
			searchIndex.save();

			logger.info(`✅ Search index built with ${businesses.length} businesses`);
		} catch (error) {
			logger.error("❌ Search index building failed:", error);
		}
	}

	/**
	 * Get business data for indexing
	 */
	async _getBusinessData() {
		try {
			// Try to get from cache first
			const cached = localStorage.getItem("businessData");
			if (cached) {
				return JSON.parse(cached);
			}

			// Fetch from API
			const response = await fetch("/api/business/featured");
			if (response.ok) {
				const data = await response.json();

				// Cache for future use
				localStorage.setItem("businessData", JSON.stringify(data.businesses || []));

				return data.businesses || [];
			}

			return [];
		} catch (error) {
			logger.warn("Failed to get business data for indexing:", error);
			return [];
		}
	}

	/**
	 * Optimize business page
	 */
	async _optimizeBusinessPage() {
		// Preload related businesses
		const businessId = window.location.pathname.split("/biz/")[1];
		if (businessId) {
			// Preload reviews, photos, menu
			const relatedUrls = [`/api/business/${businessId}/reviews`, `/api/business/${businessId}/photos`, `/api/business/${businessId}/menu`];

			relatedUrls.forEach((url) => {
				fetch(url, { headers: { "X-Preload": "true" } }).catch(() => {});
			});
		}
	}

	/**
	 * Optimize search page
	 */
	async _optimizeSearchPage() {
		// Preload popular searches
		const popularSearches = ["restaurants", "coffee", "gas", "grocery"];

		popularSearches.forEach((query) => {
			streamingSearchEngine.debouncedSearch(
				query,
				{ useLocalIndex: true, prefetch: true },
				() => {}, // results handler
				() => {} // complete handler
			);
		});
	}

	/**
	 * Optimize category page
	 */
	async _optimizeCategoryPage() {
		// Preload category data
		const category = window.location.pathname.split("/categories/")[1];
		if (category) {
			fetch(`/api/categories/${category}/businesses`, {
				headers: { "X-Preload": "true" },
			}).catch(() => {});
		}
	}

	/**
	 * Cleanup memory
	 */
	_cleanupMemory() {
		try {
			// Clear old caches
			if (instantPreloader.clearOldCache) {
				instantPreloader.clearOldCache();
			}

			if (advancedPrefetcher.cleanupCache) {
				advancedPrefetcher.cleanupCache();
			}

			// Force garbage collection if available
			if (window.gc) {
				window.gc();
			}

			logger.debug("🧹 Memory cleanup completed");
		} catch (error) {
			logger.error("❌ Memory cleanup failed:", error);
		}
	}

	/**
	 * Send metric to analytics
	 */
	_sendMetricToAnalytics(metric) {
		// In a real app, send to your analytics service
		// Example: Google Analytics, Mixpanel, DataDog, etc.
		if (typeof gtag !== "undefined") {
			gtag("event", "web_vital", {
				event_category: "Performance",
				event_label: metric.name,
				value: Math.round(metric.value),
				custom_map: {
					metric_id: metric.id,
					metric_delta: metric.delta,
				},
			});
		}
	}

	/**
	 * Log system status
	 */
	_logSystemStatus() {
		const enabledComponents = Object.entries(this.components)
			.filter(([_, enabled]) => enabled)
			.map(([name, _]) => name);

		logger.info("🎯 Performance System Status:", {
			components: this.components,
			enabled: enabledComponents,
			targets: this.targets,
			isInitialized: this.isInitialized,
		});
	}

	/**
	 * Get system performance report
	 */
	getPerformanceReport() {
		return {
			isInitialized: this.isInitialized,
			components: this.components,
			targets: this.targets,
			enabledCount: Object.values(this.components).filter(Boolean).length,
			totalComponents: Object.keys(this.components).length,
		};
	}

	/**
	 * Destroy all systems (cleanup)
	 */
	async destroy() {
		try {
			// Cleanup all systems
			if (this.components.performanceOrchestrator) {
				performanceOrchestrator.destroy();
			}

			if (this.components.instantPreloader) {
				instantPreloader.cleanup();
			}

			if (this.components.advancedPrefetcher) {
				advancedPrefetcher.destroy();
			}

			if (this.components.ultraAggressivePrefetcher) {
				ultraAggressivePrefetcher.destroy();
			}

			if (this.components.imageHoverPrefetcher) {
				imageHoverPrefetcher.destroy();
			}

			if (this.components.edgeStreaming) {
				edgeStreamingManager.destroy();
			}

			if (this.components.partialPrerendering) {
				partialPrerenderingManager.destroy();
			}

			// Reset state
			this.isInitialized = false;
			this.initializationPromise = null;
			Object.keys(this.components).forEach((key) => {
				this.components[key] = false;
			});

			logger.info("🧹 Performance System destroyed");
		} catch (error) {
			logger.error("❌ Performance System destruction failed:", error);
		}
	}
}

// Create and export singleton instance
const performanceSystem = new PerformanceSystem();

// Auto-initialize on page load (browser only)
if (typeof window !== "undefined") {
	// Initialize when DOM is ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			performanceSystem.initialize();
		});
	} else {
		// DOM is already ready
		performanceSystem.initialize();
	}
}

export default performanceSystem;
