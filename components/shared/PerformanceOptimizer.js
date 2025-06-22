"use client";

import { useEffect } from "react";

// Critical resource preloader
const preloadCriticalResources = () => {
	const criticalResources = [
		{ href: "/fonts/inter.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" },
		{ href: "/css/globals.css", as: "style" },
	];

	criticalResources.forEach((resource) => {
		const link = document.createElement("link");
		link.rel = "preload";
		link.href = resource.href;
		link.as = resource.as;
		if (resource.type) link.type = resource.type;
		if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
		document.head.appendChild(link);
	});
};

// Lazy loading for images and components
const setupLazyLoading = () => {
	if ("IntersectionObserver" in window) {
		const lazyImages = document.querySelectorAll("img[data-src]");
		const imageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
					img.classList.remove("lazy");
					imageObserver.unobserve(img);
				}
			});
		});

		lazyImages.forEach((img) => imageObserver.observe(img));
	}
};

// Performance monitoring
const setupPerformanceMonitoring = () => {
	if ("PerformanceObserver" in window) {
		// Monitor Largest Contentful Paint
		const lcpObserver = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			const lastEntry = entries[entries.length - 1];

			if (process.env.NODE_ENV === "development") {
				console.log("LCP:", lastEntry.startTime);
			}
		});

		// Monitor First Input Delay
		const fidObserver = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				if (process.env.NODE_ENV === "development") {
					console.log("FID:", entry.processingStart - entry.startTime);
				}
			});
		});

		// Monitor Cumulative Layout Shift
		const clsObserver = new PerformanceObserver((list) => {
			let clsValue = 0;
			list.getEntries().forEach((entry) => {
				if (!entry.hadRecentInput) {
					clsValue += entry.value;
				}
			});

			if (process.env.NODE_ENV === "development") {
				console.log("CLS:", clsValue);
			}
		});

		try {
			lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
			fidObserver.observe({ entryTypes: ["first-input"] });
			clsObserver.observe({ entryTypes: ["layout-shift"] });
		} catch (e) {
			// Ignore errors for unsupported metrics
		}
	}
};

// Service Worker registration for caching
const registerServiceWorker = () => {
	if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
		navigator.serviceWorker.register("/sw.js").catch(() => {
			// Ignore service worker registration errors
		});
	}
};

// Resource hints for better performance
const addResourceHints = () => {
	const hints = [
		{ rel: "dns-prefetch", href: "//fonts.googleapis.com" },
		{ rel: "dns-prefetch", href: "//images.unsplash.com" },
		{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
	];

	hints.forEach((hint) => {
		const link = document.createElement("link");
		link.rel = hint.rel;
		link.href = hint.href;
		if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
		document.head.appendChild(link);
	});
};

// Memory cleanup for better performance
const setupMemoryCleanup = () => {
	// Clean up event listeners on page unload
	const cleanup = () => {
		// Remove any global event listeners
		window.removeEventListener("beforeunload", cleanup);
		window.removeEventListener("unload", cleanup);
	};

	window.addEventListener("beforeunload", cleanup);
	window.addEventListener("unload", cleanup);
};

export default function PerformanceOptimizer() {
	useEffect(() => {
		// Run optimizations after component mount
		const runOptimizations = () => {
			preloadCriticalResources();
			setupLazyLoading();
			setupPerformanceMonitoring();
			registerServiceWorker();
			addResourceHints();
			setupMemoryCleanup();
		};

		// Use requestIdleCallback if available, otherwise use setTimeout
		if ("requestIdleCallback" in window) {
			requestIdleCallback(runOptimizations);
		} else {
			setTimeout(runOptimizations, 1);
		}

		// Cleanup function
		return () => {
			// Clean up observers if needed
			if (typeof window !== "undefined") {
				// Cleanup code here
			}
		};
	}, []);

	return null; // This component doesn't render anything
}
