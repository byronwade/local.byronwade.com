/**
 * NextFaster Link Component
 *
 * Advanced Link component that eliminates loading states through intelligent prefetching
 * Replaces standard Next.js Link with zero-loading experience
 */

"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useNextFasterPrefetch } from "@lib/performance/nextfaster-prefetch";

/**
 * NextFaster Link Component with intelligent prefetching
 */
export default function NextFasterLink({ href, children, className = "", priority = "medium", prefetchStrategy = "hover", instantNavigation = true, preloadImages = true, analytics = true, ...props }) {
	const linkRef = useRef(null);
	const router = useRouter();
	const pathname = usePathname();
	const [isHovered, setIsHovered] = useState(false);
	const [isPrefetched, setIsPrefetched] = useState(false);
	const { prefetch, isSupported } = useNextFasterPrefetch();

	// Track click metrics for optimization
	const clickStartTime = useRef(null);

	/**
	 * Advanced hover prefetching with intelligent timing
	 */
	const handleMouseEnter = useCallback(async () => {
		if (!isSupported || isPrefetched) return;

		setIsHovered(true);

		// Prefetch based on strategy
		if (prefetchStrategy === "hover" || prefetchStrategy === "aggressive") {
			try {
				await prefetch(href, priority);
				setIsPrefetched(true);

				// Preload critical images if enabled
				if (preloadImages) {
					const response = await fetch(href, {
						method: "HEAD",
						headers: { "X-Prefetch": "true" },
					});

					if (response.ok) {
						// Extract critical images from response headers or make a lightweight fetch
						// This is a simplified approach - in production, you'd parse the HTML
						const criticalImages = await extractCriticalImages(href);
						criticalImages.forEach((imageSrc) => {
							const img = new Image();
							img.src = imageSrc;
						});
					}
				}

				if (analytics) {
					// Track successful prefetch
					if (typeof gtag !== "undefined") {
						gtag("event", "link_prefetch", {
							event_category: "performance",
							event_label: href,
							custom_map: { priority: priority },
						});
					}
				}
			} catch (error) {
				console.warn("Prefetch failed:", error);
			}
		}
	}, [href, priority, prefetchStrategy, preloadImages, isSupported, isPrefetched, analytics, prefetch]);

	/**
	 * Handle mouse leave with cleanup
	 */
	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
	}, []);

	/**
	 * Advanced click handling with instant navigation
	 */
	const handleClick = useCallback(
		async (e) => {
			clickStartTime.current = performance.now();

			if (instantNavigation && isPrefetched) {
				// Prevent default navigation
				e.preventDefault();

				try {
					// Use instant navigation if content is prefetched
					await router.push(href);

					if (analytics) {
						const navigationTime = performance.now() - clickStartTime.current;

						// Track instant navigation metrics
						if (typeof gtag !== "undefined") {
							gtag("event", "instant_navigation", {
								event_category: "performance",
								event_label: href,
								value: Math.round(navigationTime),
								custom_map: {
									was_prefetched: isPrefetched,
									navigation_time: navigationTime,
								},
							});
						}
					}
				} catch (error) {
					console.warn("Instant navigation failed, falling back to default:", error);
					// Let default navigation happen
				}
			}

			// Call original onClick if provided
			if (props.onClick) {
				props.onClick(e);
			}
		},
		[router, href, instantNavigation, isPrefetched, analytics, props.onClick]
	);

	/**
	 * Viewport-based prefetching with Intersection Observer
	 */
	useEffect(() => {
		if (!isSupported || prefetchStrategy !== "viewport") return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isPrefetched) {
						prefetch(href, priority).then(() => {
							setIsPrefetched(true);
						});
					}
				});
			},
			{
				rootMargin: "100px",
				threshold: 0.1,
			}
		);

		if (linkRef.current) {
			observer.observe(linkRef.current);
		}

		return () => {
			if (linkRef.current) {
				observer.unobserve(linkRef.current);
			}
		};
	}, [href, priority, prefetchStrategy, isSupported, isPrefetched, prefetch]);

	/**
	 * Aggressive prefetching on component mount
	 */
	useEffect(() => {
		if (prefetchStrategy === "aggressive" && isSupported && !isPrefetched) {
			// Use requestIdleCallback for non-blocking prefetch
			if ("requestIdleCallback" in window) {
				requestIdleCallback(() => {
					prefetch(href, priority).then(() => {
						setIsPrefetched(true);
					});
				});
			} else {
				// Fallback for browsers without requestIdleCallback
				setTimeout(() => {
					prefetch(href, priority).then(() => {
						setIsPrefetched(true);
					});
				}, 100);
			}
		}
	}, [href, priority, prefetchStrategy, isSupported, isPrefetched, prefetch]);

	// Enhanced className with prefetch status
	const enhancedClassName = `${className} ${isPrefetched ? "prefetched" : ""} ${isHovered ? "hovered" : ""}`.trim();

	return (
		<Link ref={linkRef} href={href} className={enhancedClassName} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} {...props}>
			{children}
		</Link>
	);
}

/**
 * Extract critical images from a page (simplified implementation)
 */
async function extractCriticalImages(href) {
	try {
		// In a real implementation, you'd parse the HTML or use a service
		// For now, return common image patterns
		const commonImages = ["/logos/ThorbisLogo.webp", "/images/hero-bg.webp"];

		return commonImages;
	} catch (error) {
		console.warn("Failed to extract critical images:", error);
		return [];
	}
}

/**
 * Hook for NextFaster Link analytics
 */
export function useNextFasterAnalytics() {
	const [metrics, setMetrics] = useState({
		totalClicks: 0,
		instantNavigations: 0,
		averageNavigationTime: 0,
		prefetchHitRate: 0,
	});

	useEffect(() => {
		// Track metrics if analytics is available
		if (typeof gtag !== "undefined") {
			const trackingInterval = setInterval(() => {
				// Get metrics from performance API
				const navigation = performance.getEntriesByType("navigation")[0];
				if (navigation) {
					setMetrics((prev) => ({
						...prev,
						averageNavigationTime: navigation.loadEventEnd - navigation.loadEventStart,
					}));
				}
			}, 5000);

			return () => clearInterval(trackingInterval);
		}
	}, []);

	return metrics;
}

/**
 * Specialized Link variants for different use cases
 */

// Critical Link for high-priority navigation (dashboard, auth)
export function CriticalLink({ children, ...props }) {
	return (
		<NextFasterLink priority="critical" prefetchStrategy="aggressive" instantNavigation={true} preloadImages={true} {...props}>
			{children}
		</NextFasterLink>
	);
}

// Category Link for business categories
export function CategoryLink({ children, ...props }) {
	return (
		<NextFasterLink priority="high" prefetchStrategy="hover" instantNavigation={true} preloadImages={true} {...props}>
			{children}
		</NextFasterLink>
	);
}

// Content Link for blog posts and general content
export function ContentLink({ children, ...props }) {
	return (
		<NextFasterLink priority="medium" prefetchStrategy="viewport" instantNavigation={false} preloadImages={false} {...props}>
			{children}
		</NextFasterLink>
	);
}

// Footer Link for legal and low-priority pages
export function FooterLink({ children, ...props }) {
	return (
		<NextFasterLink priority="low" prefetchStrategy="none" instantNavigation={false} preloadImages={false} analytics={false} {...props}>
			{children}
		</NextFasterLink>
	);
}

/**
 * Link Prefetcher component for background prefetching
 */
export function LinkPrefetcher({ routes = [], priority = "medium" }) {
	const { prefetch, isSupported } = useNextFasterPrefetch();

	useEffect(() => {
		if (!isSupported || routes.length === 0) return;

		// Prefetch routes in the background
		const prefetchRoutes = async () => {
			for (let i = 0; i < routes.length; i++) {
				await new Promise((resolve) => setTimeout(resolve, i * 200)); // Stagger requests
				await prefetch(routes[i], priority);
			}
		};

		// Use requestIdleCallback for non-blocking prefetch
		if ("requestIdleCallback" in window) {
			requestIdleCallback(prefetchRoutes);
		} else {
			setTimeout(prefetchRoutes, 1000);
		}
	}, [routes, priority, prefetch, isSupported]);

	return null; // This component doesn't render anything
}
