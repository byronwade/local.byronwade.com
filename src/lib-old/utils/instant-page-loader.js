// lib/utils/instantPageLoader.js - Zero Loading State Page System
import { logger } from "./logger";
import { CacheManager } from "./cache-manager";
import instantPreloader from "./instant-preloader";
import streamingSearchEngine from "./streaming-search";

/**
 * Instant Page Loader - Eliminates loading screens with aggressive preloading
 * Based on Next.js 15 + Turbopack + Partial Prerendering concepts
 */
class InstantPageLoader {
	constructor() {
		this.pageCache = new Map(); // Pre-rendered page shells
		this.dataCache = new Map(); // Dynamic data cache
		this.routePatterns = new Map(); // Route pattern recognition
		this.navigationHistory = [];
		this.isInitialized = false;

		// Performance targets (from NextFaster project)
		this.performanceTargets = {
			LCP: 800, // ms - target under 0.8s
			FID: 50, // ms - target under 50ms
			CLS: 0.05, // target under 0.05
			TTI: 1200, // ms - target under 1.2s
		};

		// Preloading strategies
		this.preloadStrategies = {
			immediate: [], // Preload immediately on page load
			hover: [], // Preload on hover (65ms delay)
			viewport: [], // Preload when in viewport
			idle: [], // Preload during idle time
			predictive: [], // Preload based on user behavior
		};

		this.initializeStrategies();
		logger.info("🚀 Instant Page Loader initialized");
	}

	/**
	 * Initialize preloading strategies for different page types
	 */
	initializeStrategies() {
		// Business pages - immediate preload for current business + related
		this.preloadStrategies.immediate = [
			"/search", // Always preload search
			"/categories", // Always preload categories
			"/explore-business", // Always preload explore
		];

		// Search results - hover preload
		this.preloadStrategies.hover = [
			/^\/biz\/[^\/]+$/, // Business detail pages
			/^\/categories\/[^\/]+$/, // Category pages
			/^\/search\?/, // Search with filters
		];

		// Related content - viewport preload
		this.preloadStrategies.viewport = [
			/^\/biz\/[^\/]+\/photos$/, // Business photos
			/^\/biz\/[^\/]+\/reviews$/, // Business reviews
			/^\/biz\/[^\/]+\/menu$/, // Business menu
		];

		// Popular pages - idle preload
		this.preloadStrategies.idle = ["/about-us", "/help-center", "/business-support", "/advertise"];
	}

	/**
	 * Initialize the instant page loader system
	 */
	async init() {
		if (this.isInitialized) return;

		try {
			await this.setupInstantNavigation();
			await this.preloadCriticalResources();
			await this.initializeRoutePatterns();
			await this.setupOptimisticUI();

			this.isInitialized = true;
			logger.info("✅ Instant Page Loader fully initialized");
		} catch (error) {
			logger.error("❌ Failed to initialize Instant Page Loader:", error);
		}
	}

	/**
	 * Setup instant navigation with zero loading states
	 */
	async setupInstantNavigation() {
		if (typeof window === "undefined") return;

		// Override Next.js router for instant navigation
		this.originalPushState = history.pushState;
		this.originalReplaceState = history.replaceState;

		// Intercept all navigation
		history.pushState = (...args) => {
			this.handleInstantNavigation(args[2]); // URL is third argument
			this.originalPushState.apply(history, args);
		};

		history.replaceState = (...args) => {
			this.handleInstantNavigation(args[2]);
			this.originalReplaceState.apply(history, args);
		};

		// Setup link interception
		document.addEventListener("click", this.handleLinkClick.bind(this), {
			capture: true,
			passive: false,
		});

		// Setup instant form submissions
		document.addEventListener("submit", this.handleFormSubmit.bind(this), {
			capture: true,
			passive: false,
		});

		logger.debug("🔗 Instant navigation setup complete");
	}

	/**
	 * Handle instant navigation without loading screens
	 */
	async handleInstantNavigation(url) {
		const startTime = performance.now();

		try {
			// Check if page is already cached
			const cachedPage = this.pageCache.get(url);

			if (cachedPage) {
				// Instant navigation with cached content
				this.renderPageInstantly(cachedPage, url);
				logger.performance(`🚀 Instant navigation to ${url} in ${(performance.now() - startTime).toFixed(1)}ms`);
				return;
			}

			// Use optimistic UI while loading
			this.showOptimisticContent(url);

			// Load page with streaming
			const pageData = await this.loadPageWithStreaming(url);
			this.renderPageInstantly(pageData, url);

			const loadTime = performance.now() - startTime;
			logger.performance(`⚡ Page navigation to ${url} completed in ${loadTime.toFixed(1)}ms`);
		} catch (error) {
			logger.error(`❌ Navigation to ${url} failed:`, error);
			// Fallback to standard navigation
			window.location.href = url;
		}
	}

	/**
	 * Handle link clicks for instant navigation
	 */
	handleLinkClick(event) {
		const link = event.target.closest("a[href]");
		if (!link || !link.href) return;

		const url = new URL(link.href, window.location.origin);

		// Only handle same-origin links
		if (url.origin !== window.location.origin) return;

		// Skip if link has special attributes
		if (link.hasAttribute("data-no-instant") || link.target === "_blank" || event.metaKey || event.ctrlKey) return;

		event.preventDefault();

		// Instant navigation
		this.handleInstantNavigation(url.pathname + url.search);
	}

	/**
	 * Handle form submissions with optimistic UI
	 */
	handleFormSubmit(event) {
		const form = event.target;
		if (!form || form.hasAttribute("data-no-instant")) return;

		event.preventDefault();

		// Get form data
		const formData = new FormData(form);
		const action = form.action || window.location.pathname;
		const method = form.method || "GET";

		// Show optimistic UI immediately
		this.showOptimisticFormResult(form, formData);

		// Submit form with streaming response
		this.submitFormWithStreaming(action, method, formData);
	}

	/**
	 * Show optimistic content while page loads
	 */
	showOptimisticContent(url) {
		const pageType = this.getPageType(url);
		const optimisticContent = this.generateOptimisticContent(pageType, url);

		// Replace page content with optimistic version
		const mainContent = document.querySelector("main") || document.body;
		if (mainContent && optimisticContent) {
			// Smooth transition
			mainContent.style.transition = "opacity 150ms ease";
			mainContent.style.opacity = "0.8";

			setTimeout(() => {
				mainContent.innerHTML = optimisticContent;
				mainContent.style.opacity = "1";
			}, 50);
		}

		logger.debug(`🎯 Showing optimistic content for ${pageType}: ${url}`);
	}

	/**
	 * Generate optimistic content based on page type
	 */
	generateOptimisticContent(pageType, url) {
		switch (pageType) {
			case "business":
				return this.generateOptimisticBusinessPage(url);
			case "search":
				return this.generateOptimisticSearchResults(url);
			case "category":
				return this.generateOptimisticCategoryPage(url);
			default:
				return this.generateOptimisticGenericPage(url);
		}
	}

	/**
	 * Generate optimistic business page content
	 */
	generateOptimisticBusinessPage(url) {
		// Extract business ID from URL
		const businessId = url.split("/biz/")[1]?.split("/")[0];

		// Try to get cached business data
		const cachedBusiness = this.dataCache.get(`business:${businessId}`);

		if (cachedBusiness) {
			// Use real data for instant display
			return this.renderBusinessPageContent(cachedBusiness);
		}

		// Generate optimistic skeleton with intelligent predictions
		return `
			<div class="business-page-optimistic">
				<!-- Hero Section with Shimmer -->
				<div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
					<div class="flex items-center space-x-4">
						<div class="w-20 h-20 bg-gray-200 rounded-lg shimmer"></div>
						<div class="flex-1">
							<div class="h-8 bg-gray-200 rounded shimmer mb-2" style="width: 60%"></div>
							<div class="h-4 bg-gray-200 rounded shimmer mb-2" style="width: 40%"></div>
							<div class="flex space-x-2">
								<div class="h-4 bg-yellow-200 rounded shimmer" style="width: 80px"></div>
								<div class="h-4 bg-gray-200 rounded shimmer" style="width: 60px"></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Quick Info Cards -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div class="bg-white p-4 rounded-lg shadow-sm border">
						<div class="h-6 bg-gray-200 rounded shimmer mb-2" style="width: 50%"></div>
						<div class="h-4 bg-gray-200 rounded shimmer" style="width: 70%"></div>
					</div>
					<div class="bg-white p-4 rounded-lg shadow-sm border">
						<div class="h-6 bg-gray-200 rounded shimmer mb-2" style="width: 60%"></div>
						<div class="h-4 bg-gray-200 rounded shimmer" style="width: 80%"></div>
					</div>
					<div class="bg-white p-4 rounded-lg shadow-sm border">
						<div class="h-6 bg-gray-200 rounded shimmer mb-2" style="width: 55%"></div>
						<div class="h-4 bg-gray-200 rounded shimmer" style="width: 65%"></div>
					</div>
				</div>

				<!-- Content Placeholder -->
				<div class="bg-white p-6 rounded-lg shadow-sm">
					<div class="h-6 bg-gray-200 rounded shimmer mb-4" style="width: 30%"></div>
					<div class="space-y-2">
						<div class="h-4 bg-gray-200 rounded shimmer"></div>
						<div class="h-4 bg-gray-200 rounded shimmer" style="width: 90%"></div>
						<div class="h-4 bg-gray-200 rounded shimmer" style="width: 85%"></div>
					</div>
				</div>
			</div>

			<style>
				.shimmer {
					background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
					background-size: 200% 100%;
					animation: shimmer 1.5s infinite;
				}
				
				@keyframes shimmer {
					0% { background-position: -200% 0; }
					100% { background-position: 200% 0; }
				}
			</style>
		`;
	}

	/**
	 * Generate optimistic search results
	 */
	generateOptimisticSearchResults(url) {
		const searchParams = new URLSearchParams(url.split("?")[1] || "");
		const query = searchParams.get("q") || searchParams.get("query") || "";

		// Check for cached search results
		const cacheKey = streamingSearchEngine.getCacheKey(query, Object.fromEntries(searchParams));
		const cachedResults = CacheManager.memory.get(cacheKey);

		if (cachedResults && cachedResults.results?.length > 0) {
			// Show real cached results instantly
			return this.renderSearchResults(cachedResults.results, query);
		}

		// Generate optimistic search skeleton
		return `
			<div class="search-results-optimistic">
				<!-- Search Header -->
				<div class="mb-6">
					<h1 class="text-2xl font-bold text-gray-900 mb-2">
						${query ? `Search results for "${query}"` : "Search Results"}
					</h1>
					<div class="h-4 bg-gray-200 rounded shimmer" style="width: 200px"></div>
				</div>

				<!-- Filters Bar -->
				<div class="flex space-x-4 mb-6">
					${Array.from(
						{ length: 5 },
						(_, i) => `
						<div class="h-8 bg-gray-200 rounded-full shimmer" style="width: ${80 + i * 20}px"></div>
					`
					).join("")}
				</div>

				<!-- Search Results Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					${Array.from(
						{ length: 9 },
						(_, i) => `
						<div class="bg-white rounded-lg shadow-sm border p-4">
							<div class="w-full h-32 bg-gray-200 rounded shimmer mb-3"></div>
							<div class="h-5 bg-gray-200 rounded shimmer mb-2" style="width: ${70 + (i % 3) * 10}%"></div>
							<div class="h-4 bg-gray-200 rounded shimmer mb-2" style="width: ${50 + (i % 4) * 15}%"></div>
							<div class="flex items-center space-x-2">
								<div class="h-4 bg-yellow-200 rounded shimmer" style="width: 60px"></div>
								<div class="h-4 bg-gray-200 rounded shimmer" style="width: 40px"></div>
							</div>
						</div>
					`
					).join("")}
				</div>
			</div>
		`;
	}

	/**
	 * Load page with streaming for instant updates
	 */
	async loadPageWithStreaming(url) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

		try {
			const response = await fetch(url, {
				signal: controller.signal,
				headers: {
					Accept: "text/html,application/json",
					"X-Instant-Load": "true",
					"Cache-Control": "max-age=300",
				},
			});

			clearTimeout(timeout);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			// Check if response supports streaming
			if (response.headers.get("Content-Type")?.includes("application/json")) {
				const data = await response.json();
				this.cachePageData(url, data);
				return data;
			} else {
				const html = await response.text();
				const pageData = this.parsePageData(html);
				this.cachePageData(url, pageData);
				return pageData;
			}
		} catch (error) {
			clearTimeout(timeout);
			throw error;
		}
	}

	/**
	 * Render page instantly without loading states
	 */
	renderPageInstantly(pageData, url) {
		if (!pageData) return;

		const mainContent = document.querySelector("main") || document.body;

		// Smooth transition
		mainContent.style.transition = "opacity 200ms ease";
		mainContent.style.opacity = "0.95";

		// Update page content
		requestAnimationFrame(() => {
			if (pageData.html) {
				mainContent.innerHTML = pageData.html;
			} else if (pageData.component) {
				// For React component data
				this.renderReactComponent(pageData.component, mainContent);
			}

			// Update document title and meta
			if (pageData.title) {
				document.title = pageData.title;
			}

			// Update URL without page reload
			if (url !== window.location.pathname + window.location.search) {
				this.originalPushState.call(history, null, pageData.title || "", url);
			}

			// Restore opacity
			mainContent.style.opacity = "1";

			// Initialize new page interactions
			this.initializePageInteractions();

			logger.debug(`✨ Page rendered instantly: ${url}`);
		});
	}

	/**
	 * Preload critical resources for instant access
	 */
	async preloadCriticalResources() {
		// Temporarily reduced to prevent unused preload warnings
		// Only preload resources that are guaranteed to be used immediately
		const criticalResources = [
			// Only preload the most critical API that's used on every page load
			"/api/business/featured",
		];

		const preloadPromises = criticalResources.map(async (resource) => {
			try {
				if (resource.startsWith("/api/")) {
					// Preload API data
					const response = await fetch(resource, {
						headers: { "X-Preload": "true" },
					});
					if (response.ok) {
						const data = await response.json();
						this.dataCache.set(resource, data);
					}
				} else if (resource.startsWith("/_next/")) {
					// Preload static assets
					const link = document.createElement("link");
					link.rel = "preload";
					link.href = resource;
					link.as = resource.includes(".css") ? "style" : "script";
					document.head.appendChild(link);
				} else {
					// Preload pages
					await instantPreloader.preloadUrl(resource);
				}
			} catch (error) {
				logger.warn(`Failed to preload ${resource}:`, error);
			}
		});

		await Promise.allSettled(preloadPromises);
		logger.info(`🎯 Preloaded ${criticalResources.length} critical resources`);
	}

	/**
	 * Setup optimistic UI for all interactions
	 */
	async setupOptimisticUI() {
		// Setup optimistic search
		this.setupOptimisticSearch();

		// Setup optimistic business interactions
		this.setupOptimisticBusinessInteractions();

		// Setup optimistic form submissions
		this.setupOptimisticForms();

		logger.debug("🎨 Optimistic UI setup complete");
	}

	/**
	 * Setup optimistic search with instant results
	 */
	setupOptimisticSearch() {
		document.addEventListener("input", (event) => {
			const searchInput = event.target.closest('input[type="search"], input[name*="search"], input[placeholder*="search" i]');
			if (!searchInput) return;

			const query = searchInput.value.trim();
			if (query.length < 2) return;

			// Show instant results from cache or predictions
			this.showOptimisticSearchResults(query, searchInput);
		});
	}

	/**
	 * Show optimistic search results instantly
	 */
	showOptimisticSearchResults(query, inputElement) {
		// Check cache first
		const cachedResults = this.getCachedSearchResults(query);

		if (cachedResults) {
			this.displaySearchResults(cachedResults, true);
			return;
		}

		// Generate predictive results based on query
		const predictiveResults = this.generatePredictiveResults(query);
		this.displaySearchResults(predictiveResults, false);

		// Trigger real search in background
		streamingSearchEngine.debouncedSearch(
			query,
			{ useLocalIndex: true },
			(results) => this.displaySearchResults(results, true),
			(finalResults) => this.displaySearchResults(finalResults, true)
		);
	}

	/**
	 * Generate predictive search results
	 */
	generatePredictiveResults(query) {
		const queryLower = query.toLowerCase();
		const predictions = [];

		// Business type predictions
		const businessTypes = {
			restaurant: ["Italian Restaurant", "Chinese Restaurant", "Pizza Place"],
			coffee: ["Starbucks", "Local Coffee Shop", "Café"],
			grocery: ["Whole Foods", "Safeway", "Local Market"],
			gas: ["Shell", "Chevron", "76 Station"],
			bank: ["Bank of America", "Wells Fargo", "Credit Union"],
		};

		// Find matching business types
		for (const [type, examples] of Object.entries(businessTypes)) {
			if (queryLower.includes(type) || type.includes(queryLower)) {
				examples.forEach((name, index) => {
					predictions.push({
						id: `pred_${type}_${index}`,
						name: name,
						category: type,
						rating: 4.0 + Math.random() * 1,
						address: "Loading location...",
						isPrediction: true,
					});
				});
				break;
			}
		}

		return predictions.slice(0, 6); // Show max 6 predictions
	}

	/**
	 * Cache page data for instant access
	 */
	cachePageData(url, data) {
		this.pageCache.set(url, data);

		// Also cache by route pattern
		const pattern = this.getRoutePattern(url);
		if (pattern) {
			const patternCache = this.routePatterns.get(pattern) || new Map();
			patternCache.set(url, data);
			this.routePatterns.set(pattern, patternCache);
		}

		// Limit cache size
		if (this.pageCache.size > 100) {
			const oldestKey = this.pageCache.keys().next().value;
			this.pageCache.delete(oldestKey);
		}

		logger.debug(`💾 Cached page data: ${url}`);
	}

	/**
	 * Get page type from URL
	 */
	getPageType(url) {
		if (url.includes("/biz/")) return "business";
		if (url.includes("/search")) return "search";
		if (url.includes("/categories/")) return "category";
		return "generic";
	}

	/**
	 * Get route pattern for caching strategy
	 */
	getRoutePattern(url) {
		const path = url.split("?")[0];

		if (/^\/biz\/[^\/]+$/.test(path)) return "business-detail";
		if (/^\/categories\/[^\/]+$/.test(path)) return "category-page";
		if (path.startsWith("/search")) return "search-results";

		return null;
	}

	/**
	 * Initialize page interactions after instant load
	 */
	initializePageInteractions() {
		// Re-initialize instant preloader for new links
		instantPreloader.setupEventListeners();

		// Setup business card interactions
		this.setupBusinessCardInteractions();

		// Setup search interactions
		this.setupSearchInteractions();
	}

	/**
	 * Setup business card interactions for instant navigation
	 */
	setupBusinessCardInteractions() {
		document.querySelectorAll("[data-business-id]").forEach((card) => {
			const businessId = card.getAttribute("data-business-id");

			// Preload on hover
			card.addEventListener("mouseenter", () => {
				const businessUrl = `/biz/${businessId}`;
				instantPreloader.preloadUrl(businessUrl);
			});

			// Instant navigation on click
			card.addEventListener("click", (event) => {
				if (event.target.closest("a")) return; // Let links handle themselves

				event.preventDefault();
				const businessUrl = `/biz/${businessId}`;
				this.handleInstantNavigation(businessUrl);
			});
		});
	}

	/**
	 * Get performance metrics
	 */
	getPerformanceMetrics() {
		return {
			cacheSize: this.pageCache.size,
			dataCache: this.dataCache.size,
			routePatterns: this.routePatterns.size,
			navigationHistory: this.navigationHistory.length,
			targets: this.performanceTargets,
		};
	}

	/**
	 * Clear all caches
	 */
	clearCaches() {
		this.pageCache.clear();
		this.dataCache.clear();
		this.routePatterns.clear();
		this.navigationHistory = [];

		logger.info("🧹 All instant loader caches cleared");
	}
}

// Create and export singleton instance
const instantPageLoader = new InstantPageLoader();

export default instantPageLoader;
