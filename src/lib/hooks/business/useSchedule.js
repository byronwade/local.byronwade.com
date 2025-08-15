/**
 * useSchedule Hook
 * Custom hook for managing business schedule data with real-time updates
 * Optimized for performance with intelligent caching and error handling
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ScheduleQueries } from "@lib/database/supabase/queries/schedule";
import { useAuthStore } from "@store/use-auth-store";
import { toast } from "@components/ui/use-toast";
import { logger } from "@utils/logger";

/**
 * Custom hook for schedule management
 */
export const useSchedule = (options = {}) => {
	const {
		autoRefresh = true,
		refreshInterval = 60000, // 1 minute
		includeCompleted = false,
		upcomingDays = 7,
	} = options;

	const { user } = useAuthStore();
	const businessId = user?.business_id;

	// State management
	const [state, setState] = useState({
		todaysJobs: [],
		upcomingJobs: [],
		technicians: [],
		metrics: null,
		isLoading: true,
		isRefreshing: false,
		error: null,
		lastUpdated: null,
	});

	/**
	 * Fetch today's jobs with performance tracking
	 */
	const fetchTodaysJobs = useCallback(async () => {
		if (!businessId) return;

		try {
			const startTime = performance.now();
			const result = await ScheduleQueries.getTodaysJobs(businessId, {
				includeCompleted,
				includeTechnician: true,
			});

			setState((prev) => ({
				...prev,
				todaysJobs: result.jobs,
				error: null,
			}));

			const duration = performance.now() - startTime;
			logger.performance(`Today's jobs loaded in ${duration.toFixed(2)}ms (Cache: ${result.performance.cacheHit})`);
		} catch (error) {
			logger.error("Failed to fetch today's jobs:", error);
			setState((prev) => ({
				...prev,
				error: "Failed to load today's jobs",
			}));
		}
	}, [businessId, includeCompleted]);

	/**
	 * Fetch upcoming jobs
	 */
	const fetchUpcomingJobs = useCallback(async () => {
		if (!businessId) return;

		try {
			const jobs = await ScheduleQueries.getUpcomingJobs(businessId, upcomingDays);
			setState((prev) => ({
				...prev,
				upcomingJobs: jobs,
				error: null,
			}));
		} catch (error) {
			logger.error("Failed to fetch upcoming jobs:", error);
			setState((prev) => ({
				...prev,
				error: "Failed to load upcoming jobs",
			}));
		}
	}, [businessId, upcomingDays]);

	/**
	 * Fetch business technicians
	 */
	const fetchTechnicians = useCallback(async () => {
		if (!businessId) return;

		try {
			const technicians = await ScheduleQueries.getBusinessTechnicians(businessId, true);
			setState((prev) => ({
				...prev,
				technicians,
				error: null,
			}));
		} catch (error) {
			logger.error("Failed to fetch technicians:", error);
			setState((prev) => ({
				...prev,
				error: "Failed to load technicians",
			}));
		}
	}, [businessId]);

	/**
	 * Fetch schedule metrics
	 */
	const fetchMetrics = useCallback(
		async (timeframe = "today") => {
			if (!businessId) return;

			try {
				const metrics = await ScheduleQueries.getScheduleMetrics(businessId, timeframe);
				setState((prev) => ({
					...prev,
					metrics,
					error: null,
				}));
			} catch (error) {
				logger.error("Failed to fetch schedule metrics:", error);
				setState((prev) => ({
					...prev,
					error: "Failed to load metrics",
				}));
			}
		},
		[businessId]
	);

	/**
	 * Fetch all schedule data
	 */
	const fetchAllData = useCallback(
		async (isRefresh = false) => {
			if (!businessId) {
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: "No business ID available",
				}));
				return;
			}

			setState((prev) => ({
				...prev,
				isLoading: !isRefresh,
				isRefreshing: isRefresh,
				error: null,
			}));

			try {
				// Fetch all data in parallel for better performance
				await Promise.all([fetchTodaysJobs(), fetchUpcomingJobs(), fetchTechnicians(), fetchMetrics()]);

				setState((prev) => ({
					...prev,
					isLoading: false,
					isRefreshing: false,
					lastUpdated: new Date(),
					error: null,
				}));
			} catch (error) {
				logger.error("Failed to fetch schedule data:", error);
				setState((prev) => ({
					...prev,
					isLoading: false,
					isRefreshing: false,
					error: "Failed to load schedule data",
				}));

				toast({
					title: "Error Loading Schedule",
					description: "Unable to load schedule data. Please try again.",
					variant: "destructive",
				});
			}
		},
		[businessId, fetchTodaysJobs, fetchUpcomingJobs, fetchTechnicians, fetchMetrics]
	);

	/**
	 * Refresh all data
	 */
	const refresh = useCallback(() => {
		fetchAllData(true);
	}, [fetchAllData]);

	/**
	 * Update job status with optimistic updates
	 */
	const updateJobStatus = useCallback(
		async (jobId, newStatus) => {
			if (!businessId) return false;

			// Optimistic update
			setState((prev) => ({
				...prev,
				todaysJobs: prev.todaysJobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)),
				upcomingJobs: prev.upcomingJobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)),
			}));

			try {
				const result = await ScheduleQueries.updateJobStatus(jobId, newStatus, businessId);

				if (result.success) {
					toast({
						title: "Job Updated",
						description: `Job status changed to ${newStatus.replace("_", " ")}`,
					});

					// Refresh data to ensure consistency
					setTimeout(() => refresh(), 1000);
					return true;
				} else {
					throw new Error("Update failed");
				}
			} catch (error) {
				logger.error("Failed to update job status:", error);

				// Revert optimistic update
				await fetchTodaysJobs();
				await fetchUpcomingJobs();

				toast({
					title: "Update Failed",
					description: "Failed to update job status. Please try again.",
					variant: "destructive",
				});

				return false;
			}
		},
		[businessId, refresh, fetchTodaysJobs, fetchUpcomingJobs]
	);

	/**
	 * Create new job
	 */
	const createJob = useCallback(
		async (jobData) => {
			if (!businessId) return false;

			try {
				const result = await ScheduleQueries.createJob(jobData, businessId);

				if (result.success) {
					toast({
						title: "Job Created",
						description: "New job has been scheduled successfully",
					});

					// Refresh data
					refresh();
					return true;
				} else {
					throw new Error("Creation failed");
				}
			} catch (error) {
				logger.error("Failed to create job:", error);
				toast({
					title: "Creation Failed",
					description: "Failed to create job. Please try again.",
					variant: "destructive",
				});

				return false;
			}
		},
		[businessId, refresh]
	);

	/**
	 * Check for schedule conflicts
	 */
	const checkScheduleConflicts = useCallback(
		async (technicianId, startTime, endTime, excludeJobId) => {
			if (!businessId) return [];

			try {
				return await ScheduleQueries.getScheduleConflicts(businessId, technicianId, startTime, endTime, excludeJobId);
			} catch (error) {
				logger.error("Failed to check schedule conflicts:", error);
				return [];
			}
		},
		[businessId]
	);

	// Auto-refresh effect
	useEffect(() => {
		if (!autoRefresh || !businessId) return;

		const interval = setInterval(() => {
			if (!state.isLoading && !state.isRefreshing) {
				refresh();
			}
		}, refreshInterval);

		return () => clearInterval(interval);
	}, [autoRefresh, businessId, refreshInterval, refresh, state.isLoading, state.isRefreshing]);

	// Initial data load
	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	// Computed values
	const computedValues = useMemo(() => {
		const { todaysJobs, technicians, metrics } = state;

		return {
			// Today's job statistics
			todaysStats: {
				total: todaysJobs.length,
				completed: todaysJobs.filter((job) => job.status === "completed").length,
				inProgress: todaysJobs.filter((job) => job.status === "in_progress").length,
				scheduled: todaysJobs.filter((job) => job.status === "scheduled").length,
			},

			// Technician availability
			availableTechnicians: technicians.filter((tech) => tech.status === "available" || tech.status === "idle"),
			busyTechnicians: technicians.filter((tech) => tech.status === "on_job" || tech.status === "traveling"),

			// Quick metrics
			todaysRevenue: todaysJobs.filter((job) => job.status === "completed").reduce((sum, job) => sum + (job.actual_value || job.estimated_value || 0), 0),

			completionRate: todaysJobs.length > 0 ? (todaysJobs.filter((job) => job.status === "completed").length / todaysJobs.length) * 100 : 0,

			// Next job
			nextJob: todaysJobs.filter((job) => job.status === "scheduled").sort((a, b) => new Date(a.scheduled_start) - new Date(b.scheduled_start))[0] || null,
		};
	}, [state.todaysJobs, state.technicians, state.metrics]);

	return {
		// State
		...state,

		// Computed values
		...computedValues,

		// Actions
		refresh,
		updateJobStatus,
		createJob,
		checkScheduleConflicts,
		fetchMetrics,

		// Utilities
		isReady: !state.isLoading && !!businessId,
		hasData: state.todaysJobs.length > 0 || state.upcomingJobs.length > 0,
	};
};

export default useSchedule;
