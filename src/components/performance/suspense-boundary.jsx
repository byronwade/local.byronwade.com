/**
 * SuspenseBoundary - Global Suspense boundary with performance monitoring
 * Prevents large document rendering issues across the application
 */

"use client";

import React, { Suspense, memo, useState, useEffect } from "react";
import { Skeleton } from "@components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@utils";

// Performance monitoring hook
const usePerformanceMonitoring = (componentName) => {
	useEffect(() => {
		const startTime = performance.now();

		return () => {
			const loadTime = performance.now() - startTime;
			
			// Log performance metrics
			if (typeof window !== 'undefined' && window.gtag) {
				window.gtag('event', 'component_load_time', {
					component_name: componentName,
					load_time: Math.round(loadTime),
				});
			}

			// Console warning for slow components
			if (loadTime > 2000) {
				console.warn(`Slow component detected: ${componentName} took ${loadTime.toFixed(2)}ms to load`);
			}
		};
	}, [componentName]);
};

// Generic loading skeleton
const GenericSkeleton = memo(({ 
	rows = 3, 
	showHeader = true, 
	showCards = true,
	className = "" 
}) => (
	<div className={cn("space-y-6 animate-pulse", className)}>
		{showHeader && (
			<div className="space-y-2">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>
		)}
		
		{showCards ? (
			<div className="grid gap-4">
				{Array.from({ length: rows }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-64" />
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<Skeleton className="h-32 w-full" />
								<div className="grid grid-cols-2 gap-3">
									<Skeleton className="h-8 w-full" />
									<Skeleton className="h-8 w-full" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		) : (
			<div className="space-y-4">
				{Array.from({ length: rows }).map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				))}
			</div>
		)}
	</div>
));

GenericSkeleton.displayName = "GenericSkeleton";

// Specialized skeletons for different content types
const ListSkeleton = memo(({ items = 5, showAvatar = false }) => (
	<div className="space-y-3">
		{Array.from({ length: items }).map((_, i) => (
			<div key={i} className="flex items-center space-x-3">
				{showAvatar && <Skeleton className="w-10 h-10 rounded-full" />}
				<div className="flex-1 space-y-2">
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
				</div>
			</div>
		))}
	</div>
));

const TableSkeleton = memo(({ rows = 5, columns = 4 }) => (
	<div className="space-y-3">
		{/* Header */}
		<div className="flex space-x-4">
			{Array.from({ length: columns }).map((_, i) => (
				<Skeleton key={i} className="h-6 w-24" />
			))}
		</div>
		{/* Rows */}
		{Array.from({ length: rows }).map((_, i) => (
			<div key={i} className="flex space-x-4">
				{Array.from({ length: columns }).map((_, j) => (
					<Skeleton key={j} className="h-8 w-24" />
				))}
			</div>
		))}
	</div>
));

// Error fallback component
const SuspenseErrorFallback = memo(({ 
	error, 
	onRetry, 
	componentName = "Component",
	showDetails = false 
}) => (
	<Card className="border-destructive/20 bg-destructive/5">
		<CardHeader className="text-center">
			<AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-2" />
			<CardTitle className="text-lg text-destructive">
				Failed to Load {componentName}
			</CardTitle>
		</CardHeader>
		<CardContent className="text-center space-y-4">
			<p className="text-muted-foreground text-sm">
				{error?.message || `There was an error loading ${componentName.toLowerCase()}. Please try again.`}
			</p>
			
			{showDetails && error?.stack && (
				<details className="text-left">
					<summary className="cursor-pointer text-sm font-medium">
						Error Details
					</summary>
					<pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
						{error.stack}
					</pre>
				</details>
			)}

			<div className="flex gap-2 justify-center">
				<Button 
					variant="outline" 
					onClick={() => window.location.reload()}
					size="sm"
				>
					<RefreshCw className="w-4 h-4 mr-2" />
					Refresh Page
				</Button>
				{onRetry && (
					<Button onClick={onRetry} size="sm">
						Try Again
					</Button>
				)}
			</div>
		</CardContent>
	</Card>
));

SuspenseErrorFallback.displayName = "SuspenseErrorFallback";

// Loading fallback with progress indication
const ProgressiveLoader = memo(({ 
	message = "Loading...", 
	showProgress = false,
	progress = 0 
}) => (
	<div className="flex flex-col items-center justify-center p-8 space-y-4">
		<Loader2 className="w-8 h-8 animate-spin text-primary" />
		<div className="text-center space-y-2">
			<p className="text-sm font-medium">{message}</p>
			{showProgress && (
				<div className="w-64 bg-muted rounded-full h-2">
					<div 
						className="bg-primary h-2 rounded-full transition-all duration-300"
						style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
					/>
				</div>
			)}
		</div>
	</div>
));

ProgressiveLoader.displayName = "ProgressiveLoader";

/**
 * SuspenseBoundary - Main Suspense wrapper with error handling
 */
const SuspenseBoundary = memo(({
	children,
	fallback,
	fallbackType = "generic", // "generic", "list", "table", "custom"
	fallbackProps = {},
	componentName = "Component",
	onError,
	showErrorDetails = false,
	className = "",
	enablePerformanceMonitoring = true,
	retryable = true,
}) => {
	const [error, setError] = useState(null);
	const [retryKey, setRetryKey] = useState(0);

	// Performance monitoring (always call hook, but conditionally enable)
	usePerformanceMonitoring(enablePerformanceMonitoring ? componentName : null);

	// Error handler
	const handleRetry = () => {
		setError(null);
		setRetryKey(prev => prev + 1);
	};

	// Get appropriate fallback component
	const getFallback = () => {
		if (fallback) return fallback;

		switch (fallbackType) {
			case "list":
				return <ListSkeleton {...fallbackProps} />;
			case "table":
				return <TableSkeleton {...fallbackProps} />;
			case "progress":
				return <ProgressiveLoader {...fallbackProps} />;
			default:
				return <GenericSkeleton {...fallbackProps} />;
		}
	};

	// Error boundary effect
	useEffect(() => {
		const handleError = (event) => {
			if (event.error && componentName) {
				setError(event.error);
				onError?.(event.error);
			}
		};

		window.addEventListener('error', handleError);
		window.addEventListener('unhandledrejection', handleError);
		
		return () => {
			window.removeEventListener('error', handleError);
			window.removeEventListener('unhandledrejection', handleError);
		};
	}, [componentName, onError]);

	if (error) {
		return (
			<div className={className}>
				<SuspenseErrorFallback
					error={error}
					onRetry={retryable ? handleRetry : undefined}
					componentName={componentName}
					showDetails={showErrorDetails}
				/>
			</div>
		);
	}

	return (
		<div key={retryKey} className={className}>
			<Suspense fallback={getFallback()}>
				{children}
			</Suspense>
		</div>
	);
});

SuspenseBoundary.displayName = "SuspenseBoundary";

// Convenience exports
export { 
	GenericSkeleton,
	ListSkeleton, 
	TableSkeleton,
	ProgressiveLoader,
	SuspenseErrorFallback 
};

export default SuspenseBoundary;
