"use client";
/**
 * Advanced Dynamic Imports Utility
 * NextFaster and grep.app level code splitting optimization
 *
 * Features:
 * - Smart component lazy loading
 * - Preloading strategies
 * - Error boundaries for dynamic components
 * - Performance monitoring
 * - Bundle size optimization
 */

import React, { lazy, Suspense, memo, useEffect, useState } from "react";
import { logger } from "@utils/logger";

// Cache for dynamic imports to prevent duplicate loading
const importCache = new Map();
const preloadCache = new Set();

/**
 * Enhanced dynamic import with caching and error handling
 */
export const createDynamicImport = (importFunction, options = {}) => {
	const { fallback = null, errorFallback = null, preload = false, retries = 3, retryDelay = 1000, chunkName } = options;

	const cacheKey = importFunction.toString();

	// Return cached import if available
	if (importCache.has(cacheKey)) {
		return importCache.get(cacheKey);
	}

	// Create retry function for failed imports
  const retryImport = async (attempt = 1) => {
    try {
      const startTime = performance.now();
      const importedModule = await importFunction();
      const loadTime = performance.now() - startTime;

      logger.debug(`Dynamic import loaded in ${loadTime.toFixed(2)}ms${chunkName ? ` (${chunkName})` : ""}`);

      if (loadTime > 2000) {
        logger.warn(`Slow dynamic import: ${chunkName || "unknown"} took ${loadTime.toFixed(2)}ms`);
      }

      // React.lazy requires a module object with a default export
      const resolved = importedModule && importedModule.default ? importedModule.default : importedModule;

      // Basic validation to surface clearer errors when a module doesn't export a component
      const isRenderable = typeof resolved === "function" || (resolved && typeof resolved === "object");
      if (!isRenderable) {
        throw new Error(
          `Dynamic import for ${chunkName || "component"} did not return a React component. Ensure a default export.`
        );
      }

      return { default: resolved };
    } catch (error) {
      logger.error(`Dynamic import failed (attempt ${attempt}):`, error);

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
        return retryImport(attempt + 1);
      }

      throw error;
    }
  };

	// Create lazy component with error handling
	const LazyComponent = lazy(retryImport);

	// Enhanced component with error boundary and suspense
	const DynamicComponent = memo((props) => {
		const [hasError, setHasError] = useState(false);

		useEffect(() => {
			// Reset error state when component remounts
			setHasError(false);
		}, []);

		if (hasError) {
			return (
				errorFallback || (
					<div className="p-4 text-center text-red-600">
						<p>Failed to load component</p>
						<button onClick={() => setHasError(false)} className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200">
							Retry
						</button>
					</div>
				)
			);
		}

		return (
			<Suspense fallback={fallback}>
				<ErrorBoundary onError={() => setHasError(true)}>
					<LazyComponent {...props} />
				</ErrorBoundary>
			</Suspense>
		);
	});

	DynamicComponent.displayName = `Dynamic(${chunkName || "Component"})`;

	// Add preload capability
	DynamicComponent.preload = () => {
		const cacheKey = importFunction.toString();
		if (!preloadCache.has(cacheKey)) {
			preloadCache.add(cacheKey);
			importFunction().catch((error) => {
				logger.error("Preload failed:", error);
				preloadCache.delete(cacheKey);
			});
		}
	};

	// Auto-preload if requested
	if (preload) {
		DynamicComponent.preload();
	}

	// Cache the component
	importCache.set(cacheKey, DynamicComponent);

	return DynamicComponent;
};

/**
 * Simple error boundary for dynamic components
 */
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		logger.error("Dynamic component error:", error, errorInfo);
		this.props.onError?.(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return null; // Let parent handle error display
		}

		return this.props.children;
	}
}

/**
 * Route-based code splitting utility
 */
export const createRouteComponent = (importFunction, routeName) => {
	return createDynamicImport(importFunction, {
		chunkName: `route-${routeName}`,
		fallback: <RouteLoader routeName={routeName} />,
		errorFallback: <RouteError routeName={routeName} />,
		preload: false, // Routes are loaded on demand
	});
};

/**
 * Modal/Dialog lazy loading
 */
export const createModalComponent = (importFunction, modalName) => {
	return createDynamicImport(importFunction, {
		chunkName: `modal-${modalName}`,
		fallback: <ModalLoader />,
		errorFallback: <ModalError />,
		preload: false,
	});
};

/**
 * Critical component with preloading
 */
export const createCriticalComponent = (importFunction, componentName) => {
	return createDynamicImport(importFunction, {
		chunkName: `critical-${componentName}`,
		fallback: <CriticalComponentLoader />,
		preload: true, // Preload critical components
		retries: 5, // More retries for critical components
	});
};

/**
 * Heavy component with progressive loading
 */
export const createHeavyComponent = (importFunction, componentName) => {
	return createDynamicImport(importFunction, {
		chunkName: `heavy-${componentName}`,
		fallback: <HeavyComponentLoader componentName={componentName} />,
		errorFallback: <HeavyComponentError componentName={componentName} />,
		preload: false,
	});
};

/**
 * Preload multiple components based on user interaction
 */
export const preloadComponents = (componentList, trigger = "hover") => {
	const preloadAll = () => {
		componentList.forEach((component) => {
			if (component.preload) {
				component.preload();
			}
		});
	};

	// Return cleanup function for event listeners
	return {
		preload: preloadAll,
		onHover: () => {
			if (trigger === "hover") {
				preloadAll();
			}
		},
		onFocus: () => {
			if (trigger === "focus") {
				preloadAll();
			}
		},
		onIntersect: () => {
			if (trigger === "intersect") {
				preloadAll();
			}
		},
	};
};

/**
 * Smart preloading based on user behavior
 */
export const useSmartPreloading = (components, options = {}) => {
	const { preloadOnHover = true, preloadOnIdle = true, preloadOnVisible = true, idleDelay = 2000 } = options;

	useEffect(() => {
		let idleTimer;

		const preloadComponents = () => {
			components.forEach((component) => {
				if (component.preload) {
					component.preload();
				}
			});
		};

		// Preload on idle
		if (preloadOnIdle) {
			const resetIdleTimer = () => {
				clearTimeout(idleTimer);
				idleTimer = setTimeout(preloadComponents, idleDelay);
			};

			const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
			events.forEach((event) => {
				document.addEventListener(event, resetIdleTimer, true);
			});

			resetIdleTimer();

			return () => {
				clearTimeout(idleTimer);
				events.forEach((event) => {
					document.removeEventListener(event, resetIdleTimer, true);
				});
			};
		}
	}, [components, preloadOnIdle, idleDelay]);
};

/**
 * Bundle analyzer helper (development only)
 */
export const analyzeBundleSize = async (componentName, importFunction) => {
	if (process.env.NODE_ENV !== "development") return;

	try {
		const startTime = performance.now();
		const module = await importFunction();
		const loadTime = performance.now() - startTime;

		// Estimate bundle size (rough approximation)
		const moduleStr = module.toString();
		const estimatedSize = new Blob([moduleStr]).size;

		logger.debug(`Bundle Analysis - ${componentName}:`, {
			loadTime: `${loadTime.toFixed(2)}ms`,
			estimatedSize: `${(estimatedSize / 1024).toFixed(2)}KB`,
			exports: Object.keys(module).length,
		});
	} catch (error) {
		logger.error(`Bundle analysis failed for ${componentName}:`, error);
	}
};

// Loading components
const RouteLoader = ({ routeName }) => (
	<div className="min-h-screen flex items-center justify-center">
		<div className="text-center">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
			<p className="text-gray-600">Loading {routeName}...</p>
		</div>
	</div>
);

const ModalLoader = () => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div className="bg-white rounded-lg p-6">
			<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
		</div>
	</div>
);

const CriticalComponentLoader = () => (
	<div className="flex items-center justify-center p-4">
		<div className="animate-pulse bg-gray-200 rounded h-8 w-32"></div>
	</div>
);

const HeavyComponentLoader = ({ componentName }) => (
	<div className="border border-gray-200 rounded-lg p-6">
		<div className="animate-pulse space-y-4">
			<div className="h-4 bg-gray-200 rounded w-3/4"></div>
			<div className="h-4 bg-gray-200 rounded w-1/2"></div>
			<div className="h-8 bg-gray-200 rounded"></div>
		</div>
		<p className="text-xs text-gray-500 mt-4">Loading {componentName}...</p>
	</div>
);

// Error components
const RouteError = ({ routeName }) => (
	<div className="min-h-screen flex items-center justify-center">
		<div className="text-center">
			<p className="text-red-600 mb-4">Failed to load {routeName}</p>
			<button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
				Refresh Page
			</button>
		</div>
	</div>
);

const ModalError = () => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div className="bg-white rounded-lg p-6 text-center">
			<p className="text-red-600 mb-4">Failed to load modal</p>
			<button onClick={() => window.history.back()} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
				Go Back
			</button>
		</div>
	</div>
);

const HeavyComponentError = ({ componentName }) => (
	<div className="border border-red-200 rounded-lg p-6 text-center">
		<p className="text-red-600">Failed to load {componentName}</p>
		<button onClick={() => window.location.reload()} className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
			Retry
		</button>
	</div>
);

export default {
	createDynamicImport,
	createRouteComponent,
	createModalComponent,
	createCriticalComponent,
	createHeavyComponent,
	preloadComponents,
	useSmartPreloading,
	analyzeBundleSize,
};
