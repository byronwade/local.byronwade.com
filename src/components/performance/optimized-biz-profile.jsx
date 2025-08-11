/**
 * OptimizedBizProfile - Performance wrapper for BizProfileClient
 * Implements proper Suspense boundaries and prevents large document rendering
 */

"use client";

import React, { Suspense, memo, useState, useEffect } from "react";
import { Skeleton } from "@components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import LazyTabContent, { TabContentContainer, LazySection } from "./LazyTabContent";
import dynamic from "next/dynamic";

// Dynamically import the large BizProfileClient component
const BizProfileClient = dynamic(
	() => import("@app/(site)/biz/[slug]/biz-profile-client"),
	{
		loading: () => <BizProfileSkeleton />,
		ssr: false, // Client-side only to prevent hydration issues
	}
);

// Performance-optimized skeleton for business profile
const BizProfileSkeleton = memo(() => (
	<div className="min-h-screen bg-background">
		{/* Header Skeleton */}
		<div className="relative">
			<Skeleton className="w-full h-64 md:h-80" />
			<div className="absolute bottom-4 left-4 right-4">
				<div className="flex items-end space-x-4">
					<Skeleton className="w-20 h-20 rounded-full" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-8 w-64" />
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			</div>
		</div>

		{/* Content Skeleton */}
		<div className="container mx-auto px-4 py-8">
			<div className="grid lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Tabs Skeleton */}
					<div className="flex space-x-1 border-b">
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton key={i} className="h-10 w-24" />
						))}
					</div>

					{/* Tab Content Skeleton */}
					<div className="space-y-6">
						{Array.from({ length: 3 }).map((_, i) => (
							<Card key={i}>
								<CardHeader>
									<Skeleton className="h-6 w-48" />
									<Skeleton className="h-4 w-64" />
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<Skeleton className="h-32 w-full" />
										<div className="grid grid-cols-2 gap-4">
											<Skeleton className="h-20 w-full" />
											<Skeleton className="h-20 w-full" />
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Sidebar Skeleton */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-10 w-full" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{Array.from({ length: 4 }).map((_, i) => (
									<Skeleton key={i} className="h-8 w-full" />
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	</div>
));

BizProfileSkeleton.displayName = "BizProfileSkeleton";

// Error fallback component
const BizProfileError = memo(({ error, onRetry }) => (
	<div className="min-h-screen bg-background flex items-center justify-center">
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
				<CardTitle className="text-lg">Unable to Load Business Profile</CardTitle>
			</CardHeader>
			<CardContent className="text-center space-y-4">
				<p className="text-muted-foreground text-sm">
					{error?.message || "There was an error loading the business profile. Please try again."}
				</p>
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
	</div>
));

BizProfileError.displayName = "BizProfileError";

/**
 * OptimizedBizProfile - Main wrapper component
 * Implements performance optimizations and error boundaries
 */
const OptimizedBizProfile = memo(({ businessId, initialBusiness, seoData, ...props }) => {
	const [error, setError] = useState(null);
	const [retryKey, setRetryKey] = useState(0);

	// Monitor component mount time for performance tracking
	useEffect(() => {
		const startTime = performance.now();
		
		return () => {
			const loadTime = performance.now() - startTime;
			if (loadTime > 3000) { // Alert on slow load times
				console.warn(`BizProfile loaded slowly: ${loadTime.toFixed(2)}ms`);
			}
		};
	}, [retryKey]);

	// Error handler
	const handleRetry = () => {
		setError(null);
		setRetryKey(prev => prev + 1);
	};

	// Error boundary effect
	useEffect(() => {
		const handleError = (event) => {
			if (event.error?.message?.includes('BizProfile')) {
				setError(event.error);
			}
		};

		window.addEventListener('error', handleError);
		return () => window.removeEventListener('error', handleError);
	}, []);

	if (error) {
		return <BizProfileError error={error} onRetry={handleRetry} />;
	}

	return (
		<div key={retryKey} className="biz-profile-container">
			<Suspense fallback={<BizProfileSkeleton />}>
				<LazySection
					threshold={0.1}
					rootMargin="100px"
					fallback={<BizProfileSkeleton />}
				>
					<BizProfileClient
						businessId={businessId}
						initialBusiness={initialBusiness}
						seoData={seoData}
						{...props}
					/>
				</LazySection>
			</Suspense>
		</div>
	);
});

OptimizedBizProfile.displayName = "OptimizedBizProfile";

export default OptimizedBizProfile;
