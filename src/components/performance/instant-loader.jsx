/**
 * Instant Loader Component - Zero Loading States
 *
 * Eliminates loading states through:
 * - Optimistic UI patterns
 * - Predictive content loading
 * - Smooth content transitions
 * - Stale-while-revalidate patterns
 * - Progressive enhancement
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInstantContent, backgroundPreloader } from "@lib/performance/instant-loading";

/**
 * Instant Loading Wrapper - Replaces traditional loading states
 */
export default function InstantLoader({
	children,
	fallback = null,
	contentKey,
	loader,
	optimisticData = null,
	className = "",
	transition = true,
	preload = false,
	staleTime = 300000, // 5 minutes
	errorFallback = null,
	showProgress = false,
	priority = "normal",
}) {
	const [displayContent, setDisplayContent] = useState(optimisticData || fallback);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const contentRef = useRef(null);

	// Use instant content hook
	const { data, loading, error, isStale } = useInstantContent(contentKey, loader, {
		preload,
		staleTime,
		optimistic: true,
		fallbackData: optimisticData,
	});

	// Smooth content transitions
	useEffect(() => {
		if (data && data !== displayContent) {
			if (transition && contentRef.current) {
				setIsTransitioning(true);

				// Use View Transitions API if available
				if (document.startViewTransition) {
					document
						.startViewTransition(() => {
							setDisplayContent(data);
						})
						.finished.then(() => {
							setIsTransitioning(false);
						});
				} else {
					// Fallback transition
					contentRef.current.style.opacity = "0.5";

					setTimeout(() => {
						setDisplayContent(data);
						if (contentRef.current) {
							contentRef.current.style.opacity = "1";
						}
						setIsTransitioning(false);
					}, 150);
				}
			} else {
				setDisplayContent(data);
			}
		}
	}, [data, displayContent, transition]);

	// Preload related content
	useEffect(() => {
		if (priority === "high" && contentKey) {
			// Preload related content in the background
			const relatedKeys = generateRelatedKeys(contentKey);
			relatedKeys.forEach((key) => {
				backgroundPreloader.preload(key, () => loader(), "low");
			});
		}
	}, [contentKey, loader, priority]);

	// Error handling
	if (error && !displayContent) {
		return errorFallback || <ErrorState error={error} />;
	}

	// Progressive enhancement class
	const enhancedClassName = `
    ${className}
    ${transition ? "transition-all duration-300 ease-in-out" : ""}
    ${isTransitioning ? "opacity-90" : "opacity-100"}
    ${isStale ? "stale-content" : ""}
  `
		.trim()
		.replace(/\s+/g, " ");

	return (
		<div ref={contentRef} className={enhancedClassName}>
			{/* Progress indicator for slow connections */}
			{showProgress && loading && <ProgressIndicator />}

			{/* Main content */}
			{displayContent || children}

			{/* Stale indicator */}
			{isStale && <StaleIndicator />}
		</div>
	);
}

/**
 * Business Card with Instant Loading
 */
export function InstantBusinessCard({ businessId, fallbackData = null, className = "" }) {
	const optimisticData = fallbackData || {
		id: businessId,
		name: "Loading business...",
		category: "Business",
		rating: 0,
		image: "/images/placeholder-business.jpg",
		isLoading: true,
	};

	return (
		<InstantLoader contentKey={`business-${businessId}`} loader={() => fetch(`/api/businesses/${businessId}`).then((r) => r.json())} optimisticData={optimisticData} className={className} transition={true} priority="high">
			<BusinessCardContent />
		</InstantLoader>
	);
}

/**
 * Categories List with Instant Loading
 */
export function InstantCategoriesList({ className = "" }) {
	const optimisticData = [
		{ id: 1, name: "Restaurants", count: "150+" },
		{ id: 2, name: "Services", count: "200+" },
		{ id: 3, name: "Retail", count: "100+" },
		{ id: 4, name: "Healthcare", count: "75+" },
	];

	return (
		<InstantLoader contentKey="categories-list" loader={() => fetch("/api/categories").then((r) => r.json())} optimisticData={optimisticData} className={className} preload={true} priority="high">
			<CategoriesListContent />
		</InstantLoader>
	);
}

/**
 * User Dashboard with Instant Loading
 */
export function InstantUserDashboard({ userId, className = "" }) {
	const optimisticData = {
		user: {
			name: "User",
			avatar: "/images/default-avatar.jpg",
			memberSince: new Date().getFullYear(),
		},
		stats: {
			reviews: 0,
			bookmarks: 0,
			connections: 0,
		},
		recentActivity: [],
	};

	return (
		<InstantLoader contentKey={`user-dashboard-${userId}`} loader={() => fetch(`/api/dashboard/user/${userId}`).then((r) => r.json())} optimisticData={optimisticData} className={className} preload={true} priority="critical">
			<UserDashboardContent />
		</InstantLoader>
	);
}

/**
 * Search Results with Instant Loading
 */
export function InstantSearchResults({ query, filters = {}, className = "" }) {
	const optimisticData = {
		results: [],
		total: 0,
		query,
		suggestions: ["Popular searches", "Nearby businesses", "Trending categories"],
	};

	const searchKey = `search-${query}-${JSON.stringify(filters)}`;

	return (
		<InstantLoader contentKey={searchKey} loader={() => fetch(`/api/search?q=${encodeURIComponent(query)}&${new URLSearchParams(filters)}`).then((r) => r.json())} optimisticData={optimisticData} className={className} showProgress={true} priority="high">
			<SearchResultsContent />
		</InstantLoader>
	);
}

/**
 * Blog Posts List with Instant Loading
 */
export function InstantBlogList({ className = "" }) {
	const optimisticData = {
		posts: [
			{
				id: 1,
				title: "Latest Business Trends",
				excerpt: "Discover the latest trends in local business...",
				date: new Date().toISOString(),
				image: "/images/blog-placeholder.jpg",
			},
		],
		featured: null,
		categories: ["Business", "Technology", "Marketing"],
	};

	return (
		<InstantLoader contentKey="blog-posts" loader={() => fetch("/api/blog/posts").then((r) => r.json())} optimisticData={optimisticData} className={className} preload={true}>
			<BlogListContent />
		</InstantLoader>
	);
}

/**
 * Jobs List with Instant Loading
 */
export function InstantJobsList({ location = "", category = "", className = "" }) {
	const optimisticData = {
		jobs: [],
		total: 0,
		filters: {
			location,
			category,
			datePosted: "all",
			jobType: "all",
		},
	};

	const jobsKey = `jobs-${location}-${category}`;

	return (
		<InstantLoader contentKey={jobsKey} loader={() => fetch(`/api/jobs?location=${location}&category=${category}`).then((r) => r.json())} optimisticData={optimisticData} className={className} showProgress={true}>
			<JobsListContent />
		</InstantLoader>
	);
}

/**
 * Helper Components
 */

// Progress indicator for slow connections
function ProgressIndicator() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => Math.min(prev + Math.random() * 10, 90));
		}, 100);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed top-0 left-0 right-0 z-50">
			<div className="h-1 bg-blue-500 transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
		</div>
	);
}

// Stale content indicator
function StaleIndicator() {
	return (
		<div className="absolute top-2 right-2 opacity-50">
			<div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
		</div>
	);
}

// Error state component
function ErrorState({ error }) {
	return (
		<div className="flex items-center justify-center p-8 text-center">
			<div>
				<div className="text-red-500 mb-2">
					<svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
				</div>
				<p className="text-sm text-gray-600">Content temporarily unavailable</p>
			</div>
		</div>
	);
}

/**
 * Content Components (placeholders - replace with actual implementations)
 */

function BusinessCardContent() {
	return <div className="p-4 border rounded-lg">Business Card Content</div>;
}

function CategoriesListContent() {
	return <div className="grid grid-cols-2 gap-4">Categories Content</div>;
}

function UserDashboardContent() {
	return <div className="space-y-6">Dashboard Content</div>;
}

function SearchResultsContent() {
	return <div className="space-y-4">Search Results Content</div>;
}

function BlogListContent() {
	return <div className="space-y-6">Blog Posts Content</div>;
}

function JobsListContent() {
	return <div className="space-y-4">Jobs List Content</div>;
}

/**
 * Utility Functions
 */

// Generate related content keys for preloading
function generateRelatedKeys(key) {
	const related = [];

	if (key.startsWith("business-")) {
		const businessId = key.split("-")[1];
		related.push(`business-reviews-${businessId}`, `business-photos-${businessId}`, "categories-list");
	} else if (key === "categories-list") {
		related.push("featured-businesses", "popular-searches");
	} else if (key.startsWith("search-")) {
		related.push("categories-list", "featured-businesses");
	}

	return related;
}

/**
 * Higher-order component for instant loading
 */
export function withInstantLoading(Component, options = {}) {
	return function InstantComponent(props) {
		const { contentKey = `${Component.name}-${JSON.stringify(props)}`, loader, optimisticData, ...loaderOptions } = options;

		if (!loader) {
			// No loader provided, render component normally
			return <Component {...props} />;
		}

		return (
			<InstantLoader contentKey={contentKey} loader={loader} optimisticData={optimisticData} {...loaderOptions}>
				<Component {...props} />
			</InstantLoader>
		);
	};
}

/**
 * Batch loader for multiple instant components
 */
export function InstantBatchLoader({ requests = [], children, fallback = null, onComplete = null }) {
	const [completedRequests, setCompletedRequests] = useState(new Set());
	const [batchData, setBatchData] = useState({});

	useEffect(() => {
		const loadBatch = async () => {
			const promises = requests.map(async ({ key, loader }) => {
				try {
					const data = await loader();
					return { key, data, success: true };
				} catch (error) {
					return { key, error, success: false };
				}
			});

			const results = await Promise.allSettled(promises);
			const batchResults = {};
			const completed = new Set();

			results.forEach((result, index) => {
				const request = requests[index];
				if (result.status === "fulfilled") {
					batchResults[request.key] = result.value.data;
					completed.add(request.key);
				}
			});

			setBatchData(batchResults);
			setCompletedRequests(completed);

			if (onComplete) {
				onComplete(batchResults);
			}
		};

		if (requests.length > 0) {
			loadBatch();
		}
	}, [requests, onComplete]);

	// Provide batch data to children
	return <BatchDataProvider value={batchData}>{completedRequests.size === requests.length ? children : fallback}</BatchDataProvider>;
}

// Context for batch data
const BatchDataContext = React.createContext({});

function BatchDataProvider({ children, value }) {
	return <BatchDataContext.Provider value={value}>{children}</BatchDataContext.Provider>;
}

export function useBatchData(key) {
	const batchData = React.useContext(BatchDataContext);
	return batchData[key] || null;
}
