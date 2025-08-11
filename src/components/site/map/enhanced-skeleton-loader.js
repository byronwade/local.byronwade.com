/**
 * EnhancedSkeletonLoader Component
 * Improved skeleton loading states with animations and better UX
 * Provides realistic loading placeholders for different content types
 */

"use client";

import React from "react";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";

// Enhanced skeleton business card with realistic proportions
export const SkeletonBusinessCard = ({ compact = false }) => (
	<Card className="group cursor-pointer transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
		<CardContent className={compact ? "p-3" : "p-4"}>
			{/* Top status row */}
			<div className="flex items-center justify-between mb-2">
				<div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
				<div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
			</div>

			{/* Main content */}
			<div className="flex gap-3">
				{/* Avatar */}
				<div className={`${compact ? "w-10 h-10" : "w-12 h-12"} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0`} />

				{/* Business info */}
				<div className="flex-1 min-w-0 space-y-1.5">
					{/* Business name */}
					<div className={`${compact ? "h-4" : "h-5"} bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4`} />

					{/* Category */}
					<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />

					{/* Rating */}
					<div className="flex items-center gap-1.5">
						<div className="flex gap-0.5">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="w-2.5 h-2.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							))}
						</div>
						<div className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
						<div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
					</div>

					{/* Location */}
					<div className="flex items-center gap-1.5">
						<div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
						<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1" />
						<div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
					</div>
				</div>
			</div>

			{/* Action footer */}
			<div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
				{/* Social proof badges */}
				<div className="flex items-center gap-2 mb-2">
					<div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
					<div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
				</div>

				{/* Action buttons */}
				<div className="flex gap-2">
					<div className={`${compact ? "h-7" : "h-8"} bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1`} />
					<div className={`${compact ? "h-7" : "h-8"} bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1`} />
					<div className={`${compact ? "h-7 w-7" : "h-8 w-8"} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`} />
				</div>
			</div>
		</CardContent>
	</Card>
);

// Enhanced skeleton for header component
export const SkeletonSearchHeader = ({ compact = false }) => (
	<div className={`bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 ${compact ? "px-3 py-2.5" : "px-4 py-3"}`}>
		{/* Mobile layout */}
		<div className="sm:hidden space-y-2">
			<div className="flex items-center justify-between">
				<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
				<div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
			</div>
			<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
			<div className="flex gap-1.5">
				<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1" />
				<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
				<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
			</div>
		</div>

		{/* Desktop layout */}
		<div className="hidden sm:block space-y-2.5">
			<div className="flex items-center justify-between">
				<div className="space-y-1.5">
					<div className="flex items-center gap-3">
						<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40" />
						<div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
					</div>
					<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-56" />
				</div>
			</div>
			<div className="flex items-center justify-between pt-1.5 border-t border-gray-100 dark:border-gray-800">
				<div className="flex items-center gap-2">
					<div className="h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
					<div className="h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
				</div>
				<div className="flex items-center gap-1.5">
					<div className="h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
					<div className="h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
				</div>
			</div>
		</div>
	</div>
);

// Enhanced skeleton for quick filter pills
export const SkeletonQuickFilters = () => (
	<div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-3 py-2">
		<div className="flex items-center justify-between mb-2">
			<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
			<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
		</div>
		<div className="flex gap-2 overflow-hidden">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="h-7 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0" style={{ width: Math.random() * 40 + 80 }} />
			))}
		</div>
		<div className="mt-2 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
	</div>
);

// Enhanced skeleton for search suggestions
export const SkeletonSearchSuggestions = () => (
	<Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border-gray-200 dark:border-gray-700">
		<CardContent className="p-3">
			<div className="space-y-3">
				{/* Businesses section */}
				<div>
					<div className="flex items-center gap-2 px-2 py-1 mb-2">
						<div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
						<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
					</div>
					<div className="space-y-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex items-center gap-3 p-2">
								<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
								<div className="flex-1">
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3 mb-1" />
									<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
								</div>
								<div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							</div>
						))}
					</div>
				</div>

				{/* Suggestions section */}
				<div>
					<div className="flex items-center gap-2 px-2 py-1 mb-2">
						<div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
						<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
					</div>
					<div className="space-y-2">
						{Array.from({ length: 2 }).map((_, i) => (
							<div key={i} className="flex items-center gap-3 p-2">
								<div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
								<div className="flex-1">
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
								</div>
								<div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
							</div>
						))}
					</div>
				</div>

				{/* Popular categories */}
				<div className="pt-2 border-t border-gray-200 dark:border-gray-700">
					<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mb-2" />
					<div className="flex flex-wrap gap-1.5">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: Math.random() * 30 + 60 }} />
						))}
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
);

// Progressive loading state for search results
export const SkeletonSearchResults = ({ count = 5, compact = false }) => (
	<div className={`space-y-${compact ? "3" : "4"} ${compact ? "p-3" : "p-4"}`}>
		{Array.from({ length: count }).map((_, i) => (
			<SkeletonBusinessCard key={i} compact={compact} />
		))}
	</div>
);

// Loading state for empty or error states
export const SkeletonEmptyState = () => (
	<div className="flex flex-col items-center justify-center p-8 text-center">
		<div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4" />
		<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-2" />
		<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64 mb-4" />
		<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
	</div>
);

// Floating skeleton for map interaction
export const SkeletonMapOverlay = () => (
	<div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
		<div className="flex items-center gap-3">
			<div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
			<div className="flex-1">
				<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3 mb-2" />
				<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
			</div>
			<div className="flex gap-2">
				<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
				<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
			</div>
		</div>
	</div>
);

export default {
	SkeletonBusinessCard,
	SkeletonSearchHeader,
	SkeletonQuickFilters,
	SkeletonSearchSuggestions,
	SkeletonSearchResults,
	SkeletonEmptyState,
	SkeletonMapOverlay,
};
