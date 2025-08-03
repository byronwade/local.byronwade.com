"use client";

import { useEffect, useCallback, useRef } from "react";
import { logger } from "@lib/utils/logger";
import { observeWebVitals } from "@lib/utils/webVitals";

// Advanced critical resource preloader with priority hints
const preloadCriticalResources = () => {
	// Only preload resources that are actually used immediately on page load
	// Per MDN guidelines: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload
	const criticalResources = [
		// Note: Removed most preloads to prevent unused resource warnings
		// Only preload resources that are guaranteed to be used within a few seconds

		// Only preload the main placeholder that's actually shown in hero
		{ href: "/placeholder-image.svg", as: "image", priority: "low" },
	];

	criticalResources.forEach((resource) => {
		// Skip if already preloaded
		const existing = document.querySelector(`link[href="${resource.href}"]`);
		if (existing) return;

		const link = document.createElement("link");
		link.rel = "preload";
		link.href = resource.href;
		link.as = resource.as;

		if (resource.type) link.type = resource.type;
		if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
		if (resource.priority && "fetchPriority" in HTMLLinkElement.prototype) {
			link.fetchPriority = resource.priority;
		}

		// Add error handling
		link.onerror = () => logger.warn(`Failed to preload resource: ${resource.href}`);
		link.onload = () => logger.debug(`Preloaded resource: ${resource.href}`);

		document.head.appendChild(link);
	});

	logger.debug(`Preloaded ${criticalResources.length} critical resources`);
};

// Advanced lazy loading with performance monitoring
const setupLazyLoading = () => {
	if ("IntersectionObserver" in window) {
		const lazyImages = document.querySelectorAll("img[data-src], [data-lazy]");
		const componentsToLazyLoad = document.querySelectorAll("[data-lazy-component]");

		// Image lazy loading with optimizations
		const imageObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const element = entry.target;
						const startTime = performance.now();

						if (element.tagName === "IMG") {
							const img = element;
							const src = img.dataset.src || img.dataset.lazy;

							if (src) {
								// Create new image to preload
								const newImg = new Image();
								newImg.onload = () => {
									img.src = src;
									img.classList.remove("lazy", "loading");
									img.classList.add("loaded");

									const loadTime = performance.now() - startTime;
									logger.debug(`Image loaded in ${loadTime.toFixed(2)}ms: ${src}`);
								};
								newImg.onerror = () => {
									img.src = "/placeholder-image.svg";
									img.classList.add("error");
									logger.warn(`Failed to load image: ${src}`);
								};
								newImg.src = src;
							}
						} else {
							// Handle other lazy-loaded elements
							const src = element.dataset.lazy || element.dataset.src;
							if (src) {
								element.setAttribute("src", src);
								element.removeAttribute("data-src");
								element.removeAttribute("data-lazy");
							}
						}

						imageObserver.unobserve(element);
					}
				});
			},
			{
				// More aggressive intersection options
				rootMargin: "50px 0px",
				threshold: 0.01,
			}
		);

		// Component lazy loading observer
		const componentObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const element = entry.target;
						const componentName = element.dataset.lazyComponent;

						// Trigger component loading
						element.dispatchEvent(
							new CustomEvent("lazyload", {
								detail: { componentName },
							})
						);

						componentObserver.unobserve(element);
					}
				});
			},
			{
				rootMargin: "100px 0px",
				threshold: 0.1,
			}
		);

		lazyImages.forEach((img) => imageObserver.observe(img));
		componentsToLazyLoad.forEach((component) => componentObserver.observe(component));

		logger.debug(`Setup lazy loading for ${lazyImages.length} images and ${componentsToLazyLoad.length} components`);
	}
};

// Advanced performance monitoring with real-time analytics
const setupPerformanceMonitoring = () => {
	// Setup comprehensive Web Vitals monitoring
	const vitalsCleanup = observeWebVitals((metric) => {
		// Send to analytics in production
		if (process.env.NODE_ENV === "production") {
			// Send to your analytics service
			sendToAnalytics("web_vitals", metric);
		}

		logger.debug(`Web Vital - ${metric.name}:`, metric);
	});

	// Monitor resource loading performance
	if ("PerformanceObserver" in window) {
		const resourceObserver = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				// Track slow-loading resources
				if (entry.duration > 1000) {
					logger.warn(`Slow resource detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
				}

				// Track failed resources
				if (entry.transferSize === 0 && entry.decodedBodySize === 0) {
					logger.error(`Resource failed to load: ${entry.name}`);
				}
			});
		});

		// Monitor navigation performance
		const navigationObserver = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				const metrics = {
					domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
					loadComplete: entry.loadEventEnd - entry.loadEventStart,
					totalLoad: entry.loadEventEnd - entry.fetchStart,
					timeToFirstByte: entry.responseStart - entry.requestStart,
				};

				logger.performance("Navigation metrics:", metrics);

				// Alert on poor performance
				if (metrics.totalLoad > 3000) {
					logger.warn(`Slow page load detected: ${metrics.totalLoad.toFixed(2)}ms`);
				}
			});
		});

		try {
			resourceObserver.observe({ entryTypes: ["resource"] });
			navigationObserver.observe({ entryTypes: ["navigation"] });
		} catch (error) {
			logger.error("Failed to setup performance observers:", error);
		}
	}

	return vitalsCleanup;
};

// Enhanced analytics function
const sendToAnalytics = (event, data) => {
	// Send to Google Analytics 4
	if (typeof gtag !== "undefined") {
		gtag("event", event, {
			custom_map: { metric_name: "name" },
			name: data.name,
			value: Math.round(data.value),
			rating: data.rating,
			timestamp: data.timestamp,
		});
	}

	// Send to custom analytics endpoint
	if (navigator.sendBeacon) {
		const payload = JSON.stringify({
			event,
			data,
			url: window.location.href,
			userAgent: navigator.userAgent,
			timestamp: Date.now(),
		});

		navigator.sendBeacon("/api/analytics", payload);
	}
};

// Enhanced service worker registration with update handling
const registerServiceWorker = () => {
	if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
		navigator.serviceWorker
			.register("/sw.js")
			.then((registration) => {
				logger.debug("Service Worker registered successfully:", registration);

				// Handle service worker updates
				registration.addEventListener("updatefound", () => {
					const newWorker = registration.installing;
					if (newWorker) {
						newWorker.addEventListener("statechange", () => {
							if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
								// New service worker is available
								logger.info("New service worker available");

								// Optionally show update notification to user
								if (window.confirm("A new version is available. Reload to update?")) {
									window.location.reload();
								}
							}
						});
					}
				});
			})
			.catch((error) => {
				logger.error("Service Worker registration failed:", error);
			});
	}
};

// Enhanced resource hints for better performance
const addResourceHints = () => {
	const hints = [
		// DNS prefetch for external domains
		{ rel: "dns-prefetch", href: "//fonts.googleapis.com" },
		{ rel: "dns-prefetch", href: "//fonts.gstatic.com" },
		{ rel: "dns-prefetch", href: "//images.unsplash.com" },
		{ rel: "dns-prefetch", href: "//api.thorbis.com" },

		// Preconnect for critical origins
		{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
		{ rel: "preconnect", href: process.env.NEXT_PUBLIC_SUPABASE_URL, crossorigin: "anonymous" },

		// Module preload for critical scripts
		{ rel: "modulepreload", href: "/_next/static/chunks/framework.js" },
		{ rel: "modulepreload", href: "/_next/static/chunks/main.js" },
	];

	hints.forEach((hint) => {
		// Skip if already exists
		const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
		if (existing) return;

		const link = document.createElement("link");
		link.rel = hint.rel;
		link.href = hint.href;
		if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
		document.head.appendChild(link);
	});

	logger.debug(`Added ${hints.length} resource hints`);
};

// Advanced memory and performance cleanup
const setupMemoryCleanup = () => {
	const cleanupTasks = [];

	// Memory pressure handling
	if ("memory" in performance) {
		const checkMemoryPressure = () => {
			const { totalJSHeapSize, usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
			const memoryUsage = usedJSHeapSize / jsHeapSizeLimit;

			if (memoryUsage > 0.9) {
				logger.warn("High memory usage detected:", {
					usage: `${(memoryUsage * 100).toFixed(2)}%`,
					used: `${(usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
					total: `${(totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
				});

				// Trigger garbage collection if possible
				if (window.gc && typeof window.gc === "function") {
					window.gc();
				}
			}
		};

		const memoryInterval = setInterval(checkMemoryPressure, 30000); // Check every 30s
		cleanupTasks.push(() => clearInterval(memoryInterval));
	}

	// Page visibility cleanup
	const handleVisibilityChange = () => {
		if (document.visibilityState === "hidden") {
			// Cleanup non-essential tasks when page is hidden
			// This helps free up resources for other tabs
			logger.debug("Page hidden, cleaning up resources");
		}
	};

	document.addEventListener("visibilitychange", handleVisibilityChange);
	cleanupTasks.push(() => document.removeEventListener("visibilitychange", handleVisibilityChange));

	// Page unload cleanup
	const cleanup = () => {
		cleanupTasks.forEach((task) => task());
		logger.debug("Performance cleanup completed");
	};

	window.addEventListener("beforeunload", cleanup);
	window.addEventListener("unload", cleanup);

	return cleanup;
};

// Connection type optimization
const optimizeForConnection = () => {
	if ("connection" in navigator) {
		const connection = navigator.connection;
		const { effectiveType, downlink, rtt } = connection;

		logger.debug("Connection info:", { effectiveType, downlink, rtt });

		// Adjust performance strategy based on connection
		if (effectiveType === "slow-2g" || effectiveType === "2g") {
			// Disable non-essential features for slow connections
			document.documentElement.classList.add("slow-connection");
		} else if (effectiveType === "4g" || downlink > 10) {
			// Enable enhanced features for fast connections
			document.documentElement.classList.add("fast-connection");
		}

		// Listen for connection changes
		const handleConnectionChange = () => {
			logger.debug("Connection changed:", navigator.connection.effectiveType);
			optimizeForConnection();
		};

		connection.addEventListener("change", handleConnectionChange);
		return () => connection.removeEventListener("change", handleConnectionChange);
	}
};

export default function PerformanceOptimizer() {
	const vitalsCleanupRef = useRef(null);
	const connectionCleanupRef = useRef(null);

	const runOptimizations = useCallback(() => {
		const startTime = performance.now();

		try {
			preloadCriticalResources();
			setupLazyLoading();
			vitalsCleanupRef.current = setupPerformanceMonitoring();
			registerServiceWorker();
			addResourceHints();
			const memoryCleanup = setupMemoryCleanup();
			connectionCleanupRef.current = optimizeForConnection();

			const initTime = performance.now() - startTime;
			logger.performance(`Performance optimizations initialized in ${initTime.toFixed(2)}ms`);

			return () => {
				memoryCleanup();
				vitalsCleanupRef.current?.();
				connectionCleanupRef.current?.();
			};
		} catch (error) {
			logger.error("Performance optimization failed:", error);
		}
	}, []);

	useEffect(() => {
		// Use requestIdleCallback for non-blocking initialization
		let cleanup;

		if ("requestIdleCallback" in window) {
			const idleId = requestIdleCallback(
				() => {
					cleanup = runOptimizations();
				},
				{ timeout: 2000 }
			);

			return () => {
				cancelIdleCallback(idleId);
				cleanup?.();
			};
		} else {
			// Fallback for browsers without requestIdleCallback
			const timeoutId = setTimeout(() => {
				cleanup = runOptimizations();
			}, 1);

			return () => {
				clearTimeout(timeoutId);
				cleanup?.();
			};
		}
	}, [runOptimizations]);

	// This component doesn't render anything
	return null;
}
