/**
 * Performance Provider Component
 * Integrates all performance optimizations into React application
 * Provides centralized performance management and monitoring
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { initPerformanceOrchestrator, getPerformanceMetrics } from "@lib/utils/performanceOrchestrator";
import { useStreamingSearch } from "@lib/utils/streamingSearch";
import { trackNavigation, trackSearch, trackBusinessInteraction } from "@lib/utils/advancedPrefetching";
import { logger } from "@lib/utils/logger";

// Performance Context
const PerformanceContext = createContext({
	isInitialized: false,
	metrics: {},
	performanceScore: 100,
	alerts: [],
	optimizations: {
		instantPreloading: false,
		advancedPrefetching: false,
		streamingSearch: false,
		compressedIndex: false,
		serviceWorker: false,
	},
	actions: {
		refreshMetrics: () => {},
		clearCaches: () => {},
		triggerOptimization: () => {},
	},
});

/**
 * Performance Provider Component
 */
export const PerformanceProvider = ({ children }) => {
	const [isInitialized, setIsInitialized] = useState(false);
	const [metrics, setMetrics] = useState({});
	const [performanceScore, setPerformanceScore] = useState(100);
	const [alerts, setAlerts] = useState([]);
	const [optimizations, setOptimizations] = useState({
		instantPreloading: false,
		advancedPrefetching: false,
		streamingSearch: false,
		compressedIndex: false,
		serviceWorker: false,
	});

	const initializationRef = useRef(false);
	const metricsIntervalRef = useRef(null);

	/**
	 * Initialize performance orchestrator
	 */
	const initializePerformance = useCallback(async () => {
		if (initializationRef.current) return;
		initializationRef.current = true;

		try {
			logger.info("🚀 Initializing Performance Provider...");

			await initPerformanceOrchestrator();

			setIsInitialized(true);
			setOptimizations({
				instantPreloading: true,
				advancedPrefetching: true,
				streamingSearch: true,
				compressedIndex: true,
				serviceWorker: typeof navigator !== "undefined" && "serviceWorker" in navigator,
			});

			// Start metrics collection
			startMetricsCollection();

			logger.info("✅ Performance Provider initialized");
		} catch (error) {
			logger.error("❌ Failed to initialize Performance Provider:", error);
		}
	}, []);

	/**
	 * Start collecting performance metrics
	 */
	const startMetricsCollection = useCallback(() => {
		const collectMetrics = () => {
			try {
				const currentMetrics = getPerformanceMetrics();
				setMetrics(currentMetrics);
				setPerformanceScore(currentMetrics.performanceScore || 100);
				setAlerts(currentMetrics.alerts || []);
			} catch (error) {
				logger.error("Failed to collect metrics:", error);
			}
		};

		// Initial collection
		collectMetrics();

		// Set up interval
		metricsIntervalRef.current = setInterval(collectMetrics, 5000); // Every 5 seconds
	}, []);

	/**
	 * Refresh metrics manually
	 */
	const refreshMetrics = useCallback(() => {
		try {
			const currentMetrics = getPerformanceMetrics();
			setMetrics(currentMetrics);
			setPerformanceScore(currentMetrics.performanceScore || 100);
			setAlerts(currentMetrics.alerts || []);
			logger.debug("Metrics refreshed manually");
		} catch (error) {
			logger.error("Failed to refresh metrics:", error);
		}
	}, []);

	/**
	 * Clear all caches
	 */
	const clearCaches = useCallback(() => {
		try {
			// Clear different types of caches
			if ("caches" in window) {
				caches.keys().then((cacheNames) => {
					cacheNames.forEach((cacheName) => {
						caches.delete(cacheName);
					});
				});
			}

			// Clear localStorage performance data
			Object.keys(localStorage).forEach((key) => {
				if (key.startsWith("perf_") || key.startsWith("search_") || key.startsWith("prefetch_")) {
					localStorage.removeItem(key);
				}
			});

			logger.info("🧹 All caches cleared");
		} catch (error) {
			logger.error("Failed to clear caches:", error);
		}
	}, []);

	/**
	 * Trigger specific optimization
	 */
	const triggerOptimization = useCallback(
		(type, options = {}) => {
			try {
				switch (type) {
					case "prefetch":
						// Trigger prefetching for specific URLs
						if (options.urls) {
							logger.debug(`Triggering prefetch for: ${options.urls.join(", ")}`);
						}
						break;

					case "index-rebuild":
						// Rebuild search index
						logger.debug("Triggering search index rebuild");
						break;

					case "cache-cleanup":
						clearCaches();
						break;

					default:
						logger.warn(`Unknown optimization type: ${type}`);
				}
			} catch (error) {
				logger.error(`Failed to trigger optimization ${type}:`, error);
			}
		},
		[clearCaches]
	);

	// Initialize on mount
	useEffect(() => {
		initializePerformance();

		// Cleanup on unmount
		return () => {
			if (metricsIntervalRef.current) {
				clearInterval(metricsIntervalRef.current);
			}
		};
	}, [initializePerformance]);

	// Track page navigation
	useEffect(() => {
		if (!isInitialized) return;

		const handleRouteChange = () => {
			trackNavigation(window.location.href, {
				timestamp: Date.now(),
				referrer: document.referrer,
			});
		};

		// Track initial page load
		handleRouteChange();

		// Listen for navigation changes (for SPA routing)
		window.addEventListener("popstate", handleRouteChange);

		// Override history methods to track programmatic navigation
		const originalPushState = history.pushState;
		const originalReplaceState = history.replaceState;

		history.pushState = function (...args) {
			originalPushState.apply(history, args);
			setTimeout(handleRouteChange, 0);
		};

		history.replaceState = function (...args) {
			originalReplaceState.apply(history, args);
			setTimeout(handleRouteChange, 0);
		};

		return () => {
			window.removeEventListener("popstate", handleRouteChange);
			history.pushState = originalPushState;
			history.replaceState = originalReplaceState;
		};
	}, [isInitialized]);

	const contextValue = {
		isInitialized,
		metrics,
		performanceScore,
		alerts,
		optimizations,
		actions: {
			refreshMetrics,
			clearCaches,
			triggerOptimization,
		},
	};

	return <PerformanceContext.Provider value={contextValue}>{children}</PerformanceContext.Provider>;
};

/**
 * Hook to use performance context
 */
export const usePerformance = () => {
	const context = useContext(PerformanceContext);
	if (!context) {
		throw new Error("usePerformance must be used within a PerformanceProvider");
	}
	return context;
};

/**
 * Hook for tracking business interactions
 */
export const useBusinessTracking = () => {
	const { isInitialized } = usePerformance();

	const trackBusiness = useCallback(
		(businessId, businessData, interactionType = "view") => {
			if (!isInitialized) return;

			trackBusinessInteraction(businessId, businessData, interactionType);
		},
		[isInitialized]
	);

	const trackSearch = useCallback(
		(query, results, filters = {}) => {
			if (!isInitialized) return;

			trackSearch(query, results, filters);
		},
		[isInitialized]
	);

	return {
		trackBusiness,
		trackSearch,
	};
};

/**
 * Performance Status Component
 */
export const PerformanceStatus = ({ className = "" }) => {
	const { isInitialized, performanceScore, alerts, optimizations } = usePerformance();

	if (!isInitialized) {
		return (
			<div className={`performance-status loading ${className}`}>
				<div className="flex items-center space-x-2">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
					<span className="text-sm text-gray-600">Initializing performance optimizations...</span>
				</div>
			</div>
		);
	}

	const getScoreColor = (score) => {
		if (score >= 90) return "text-green-600";
		if (score >= 70) return "text-yellow-600";
		return "text-red-600";
	};

	const getScoreIcon = (score) => {
		if (score >= 90) return "🚀";
		if (score >= 70) return "⚡";
		return "🐌";
	};

	const criticalAlerts = alerts.filter((alert) => alert.severity === "critical");

	return (
		<div className={`performance-status ${className}`}>
			<div className="flex items-center space-x-4">
				{/* Performance Score */}
				<div className="flex items-center space-x-2">
					<span className="text-lg">{getScoreIcon(performanceScore)}</span>
					<span className={`font-semibold ${getScoreColor(performanceScore)}`}>{Math.round(performanceScore)}%</span>
				</div>

				{/* Active Optimizations */}
				<div className="flex items-center space-x-1">{Object.entries(optimizations).map(([key, enabled]) => enabled && <div key={key} className="w-2 h-2 bg-green-500 rounded-full" title={`${key} enabled`} />)}</div>

				{/* Critical Alerts */}
				{criticalAlerts.length > 0 && (
					<div className="flex items-center space-x-1 text-red-600">
						<span>⚠️</span>
						<span className="text-sm font-medium">{criticalAlerts.length}</span>
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * Performance Dashboard Component
 */
export const PerformanceDashboard = ({ className = "" }) => {
	const { isInitialized, metrics, performanceScore, alerts, actions } = usePerformance();
	const [isExpanded, setIsExpanded] = useState(false);

	if (!isInitialized) {
		return null;
	}

	return (
		<div className={`performance-dashboard ${className}`}>
			{/* Dashboard Toggle */}
			<button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
				<span className="text-sm font-medium">Performance</span>
				<span className={`font-bold ${performanceScore >= 90 ? "text-green-600" : performanceScore >= 70 ? "text-yellow-600" : "text-red-600"}`}>{Math.round(performanceScore)}%</span>
				<span className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
			</button>

			{/* Expanded Dashboard */}
			{isExpanded && (
				<div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
					{/* Web Vitals */}
					{metrics.webVitals && (
						<div className="mb-4">
							<h4 className="font-semibold text-gray-900 mb-2">Web Vitals</h4>
							<div className="space-y-2">
								{Object.entries(metrics.webVitals).map(([name, metric]) => (
									<div key={name} className="flex justify-between items-center">
										<span className="text-sm text-gray-600">{name}</span>
										<span className={`text-sm font-medium ${metric.rating === "good" ? "text-green-600" : metric.rating === "needs-improvement" ? "text-yellow-600" : "text-red-600"}`}>{typeof metric.value === "number" ? metric.value.toFixed(2) : metric.value}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* System Health */}
					{metrics.systemHealth && (
						<div className="mb-4">
							<h4 className="font-semibold text-gray-900 mb-2">System Health</h4>
							<div className="space-y-2">
								{metrics.systemHealth.memoryUsage && (
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600">Memory</span>
										<span className="text-sm font-medium">{(metrics.systemHealth.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB</span>
									</div>
								)}
								{metrics.systemHealth.connectionType && (
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600">Connection</span>
										<span className="text-sm font-medium">{metrics.systemHealth.connectionType}</span>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Recent Alerts */}
					{alerts.length > 0 && (
						<div className="mb-4">
							<h4 className="font-semibold text-gray-900 mb-2">Recent Alerts</h4>
							<div className="space-y-1 max-h-20 overflow-y-auto">
								{alerts.slice(-3).map((alert, index) => (
									<div key={index} className={`text-xs p-2 rounded ${alert.severity === "critical" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
										{alert.type.replace(/_/g, " ")}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Actions */}
					<div className="flex space-x-2">
						<button onClick={actions.refreshMetrics} className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
							Refresh
						</button>
						<button onClick={actions.clearCaches} className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
							Clear Cache
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default {
	PerformanceProvider,
	usePerformance,
	useBusinessTracking,
	PerformanceStatus,
	PerformanceDashboard,
};
