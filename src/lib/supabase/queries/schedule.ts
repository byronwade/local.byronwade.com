/**
 * Schedule Queries for Supabase
 * Performance-optimized queries for business scheduling operations
 * Includes advanced filtering, caching, and real-time updates
 */

import { supabase, getPooledClient, Tables } from "../client";
import { CacheManager } from "@utils/cacheManager";
import { logger } from "@utils/logger";

type Job = Tables<"jobs">;
type Technician = Tables<"technicians">;
type ScheduleMetrics = {
	totalJobs: number;
	completedJobs: number;
	onGoingJobs: number;
	scheduledJobs: number;
	efficiency: number;
	revenue: number;
	avgJobDuration: number;
	customerSatisfaction: number;
};

/**
 * High-performance schedule queries with intelligent caching
 */
export class ScheduleQueries {
	private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
	private static readonly pooledClient = getPooledClient("schedule");

	/**
	 * Get today's jobs for a business with real-time data
	 */
	static async getTodaysJobs(
		businessId: string,
		options: {
			includeCompleted?: boolean;
			includeTechnician?: boolean;
		} = {}
	): Promise<{
		jobs: (Job & { technician?: Technician; customer?: any })[];
		performance: { queryTime: number; cacheHit: boolean };
	}> {
		const startTime = performance.now();
		const cacheKey = `todays_jobs_${businessId}_${JSON.stringify(options)}`;

		// Check cache first
		const cached = CacheManager.memory.get(cacheKey);
		if (cached) {
			logger.performance(`Today's jobs cache hit: ${cacheKey}`);
			return {
				...cached,
				performance: {
					queryTime: performance.now() - startTime,
					cacheHit: true,
				},
			};
		}

		try {
			const today = new Date().toISOString().split("T")[0];

			let query = this.pooledClient
				.from("jobs")
				.select(
					`
          *,
          ${
				options.includeTechnician
					? `
            technician:technicians(
              id,
              name,
              phone,
              email,
              status,
              vehicle_info
            ),
          `
					: ""
			}
          customer:customers(
            id,
            name,
            phone,
            email,
            address
          )
        `
				)
				.eq("business_id", businessId)
				.gte("scheduled_start", `${today}T00:00:00`)
				.lte("scheduled_start", `${today}T23:59:59`)
				.order("scheduled_start", { ascending: true });

			if (!options.includeCompleted) {
				query = query.neq("status", "completed");
			}

			const { data: jobs, error } = await query;

			if (error) {
				logger.error("Today's jobs query error:", error);
				throw error;
			}

			const result = { jobs: jobs || [] };

			// Cache successful results
			CacheManager.memory.set(cacheKey, result, this.CACHE_TTL);

			const queryTime = performance.now() - startTime;
			logger.performance(`Today's jobs query completed in ${queryTime.toFixed(2)}ms`);

			return {
				...result,
				performance: {
					queryTime,
					cacheHit: false,
				},
			};
		} catch (error) {
			logger.error("Today's jobs query error:", error);
			throw error;
		}
	}

	/**
	 * Get upcoming jobs for next 7 days
	 */
	static async getUpcomingJobs(businessId: string, days: number = 7): Promise<(Job & { customer?: any })[]> {
		const startTime = performance.now();
		const cacheKey = `upcoming_jobs_${businessId}_${days}`;

		// Check cache first
		const cached = CacheManager.memory.get(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			const today = new Date();
			const futureDate = new Date(today);
			futureDate.setDate(today.getDate() + days);

			const { data: jobs, error } = await this.pooledClient
				.from("jobs")
				.select(
					`
          *,
          customer:customers(
            id,
            name,
            phone,
            address
          )
        `
				)
				.eq("business_id", businessId)
				.gte("scheduled_start", today.toISOString())
				.lte("scheduled_start", futureDate.toISOString())
				.neq("status", "completed")
				.neq("status", "cancelled")
				.order("scheduled_start", { ascending: true });

			if (error) {
				logger.error("Upcoming jobs query error:", error);
				throw error;
			}

			// Cache the results
			CacheManager.memory.set(cacheKey, jobs, this.CACHE_TTL);

			const queryTime = performance.now() - startTime;
			logger.performance(`Upcoming jobs query completed in ${queryTime.toFixed(2)}ms`);

			return jobs || [];
		} catch (error) {
			logger.error("Upcoming jobs query error:", error);
			throw error;
		}
	}

	/**
	 * Get business technicians with their current status
	 */
	static async getBusinessTechnicians(businessId: string, includeCurrentJob: boolean = true): Promise<(Technician & { currentJob?: Job })[]> {
		const startTime = performance.now();
		const cacheKey = `business_technicians_${businessId}_${includeCurrentJob}`;

		// Check cache first
		const cached = CacheManager.memory.get(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			let selectFields = `
        *,
        skills,
        certifications
      `;

			if (includeCurrentJob) {
				selectFields += `,
          currentJob:jobs!jobs_assigned_technician_id_fkey(
            id,
            title,
            status,
            scheduled_start,
            scheduled_end,
            customer:customers(name, address)
          )
        `;
			}

			const { data: technicians, error } = await this.pooledClient.from("technicians").select(selectFields).eq("business_id", businessId).eq("active", true).order("name", { ascending: true });

			if (error) {
				logger.error("Business technicians query error:", error);
				throw error;
			}

			// Cache the results
			CacheManager.memory.set(cacheKey, technicians, this.CACHE_TTL);

			const queryTime = performance.now() - startTime;
			logger.performance(`Business technicians query completed in ${queryTime.toFixed(2)}ms`);

			return technicians || [];
		} catch (error) {
			logger.error("Business technicians query error:", error);
			throw error;
		}
	}

	/**
	 * Get comprehensive schedule metrics for business dashboard
	 */
	static async getScheduleMetrics(businessId: string, timeframe: "today" | "week" | "month" = "today"): Promise<ScheduleMetrics> {
		const startTime = performance.now();
		const cacheKey = `schedule_metrics_${businessId}_${timeframe}`;

		// Check cache first
		const cached = CacheManager.memory.get(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			const now = new Date();
			let startDate: Date;
			let endDate: Date = new Date(now);

			switch (timeframe) {
				case "today":
					startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
					endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
					break;
				case "week":
					startDate = new Date(now);
					startDate.setDate(now.getDate() - 7);
					break;
				case "month":
					startDate = new Date(now);
					startDate.setDate(now.getDate() - 30);
					break;
				default:
					startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			}

			// Get job statistics
			const { data: jobStats, error: jobError } = await this.pooledClient.rpc("get_job_statistics", {
				business_id: businessId,
				start_date: startDate.toISOString(),
				end_date: endDate.toISOString(),
			});

			if (jobError) {
				logger.error("Job statistics query error:", jobError);
				throw jobError;
			}

			// Get revenue data
			const { data: revenueData, error: revenueError } = await this.pooledClient.from("jobs").select("actual_value, estimated_value").eq("business_id", businessId).eq("status", "completed").gte("completed_at", startDate.toISOString()).lte("completed_at", endDate.toISOString());

			if (revenueError) {
				logger.error("Revenue query error:", revenueError);
				throw revenueError;
			}

			// Calculate metrics
			const totalRevenue = revenueData?.reduce((sum, job) => sum + (job.actual_value || job.estimated_value || 0), 0) || 0;

			const metrics: ScheduleMetrics = {
				totalJobs: jobStats?.total_jobs || 0,
				completedJobs: jobStats?.completed_jobs || 0,
				onGoingJobs: jobStats?.ongoing_jobs || 0,
				scheduledJobs: jobStats?.scheduled_jobs || 0,
				efficiency: jobStats?.efficiency || 0,
				revenue: totalRevenue,
				avgJobDuration: jobStats?.avg_duration || 0,
				customerSatisfaction: jobStats?.avg_rating || 0,
			};

			// Cache the results
			CacheManager.memory.set(cacheKey, metrics, this.CACHE_TTL);

			const queryTime = performance.now() - startTime;
			logger.performance(`Schedule metrics query completed in ${queryTime.toFixed(2)}ms`);

			return metrics;
		} catch (error) {
			logger.error("Schedule metrics query error:", error);
			throw error;
		}
	}

	/**
	 * Update job status with optimistic updates
	 */
	static async updateJobStatus(jobId: string, status: "scheduled" | "in_progress" | "completed" | "cancelled", businessId: string): Promise<{ success: boolean; job?: Job }> {
		const startTime = performance.now();

		try {
			const updates: any = {
				status,
				updated_at: new Date().toISOString(),
			};

			// Add timestamps for specific status changes
			if (status === "in_progress") {
				updates.actual_start = new Date().toISOString();
			} else if (status === "completed") {
				updates.actual_end = new Date().toISOString();
			}

			const { data: job, error } = await this.pooledClient.from("jobs").update(updates).eq("id", jobId).eq("business_id", businessId).select().single();

			if (error) {
				logger.error("Job status update error:", error);
				throw error;
			}

			// Invalidate related caches
			this.invalidateScheduleCache(businessId);

			const queryTime = performance.now() - startTime;
			logger.performance(`Job status update completed in ${queryTime.toFixed(2)}ms`);

			return { success: true, job };
		} catch (error) {
			logger.error("Job status update error:", error);
			return { success: false };
		}
	}

	/**
	 * Create a new job with scheduling
	 */
	static async createJob(jobData: Partial<Job>, businessId: string): Promise<{ success: boolean; job?: Job }> {
		const startTime = performance.now();

		try {
			const { data: job, error } = await this.pooledClient
				.from("jobs")
				.insert({
					...jobData,
					business_id: businessId,
					status: "scheduled",
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				})
				.select()
				.single();

			if (error) {
				logger.error("Job creation error:", error);
				throw error;
			}

			// Invalidate related caches
			this.invalidateScheduleCache(businessId);

			const queryTime = performance.now() - startTime;
			logger.performance(`Job creation completed in ${queryTime.toFixed(2)}ms`);

			return { success: true, job };
		} catch (error) {
			logger.error("Job creation error:", error);
			return { success: false };
		}
	}

	/**
	 * Invalidate schedule-related caches
	 */
	private static invalidateScheduleCache(businessId: string): void {
		const patterns = [`todays_jobs_${businessId}`, `upcoming_jobs_${businessId}`, `schedule_metrics_${businessId}`, `business_technicians_${businessId}`];

		patterns.forEach((pattern) => {
			CacheManager.memory.invalidatePattern(pattern);
		});

		logger.debug(`Invalidated schedule cache for business: ${businessId}`);
	}

	/**
	 * Get job conflicts for scheduling validation
	 */
	static async getScheduleConflicts(businessId: string, technicianId: string, startTime: string, endTime: string, excludeJobId?: string): Promise<Job[]> {
		try {
			let query = this.pooledClient.from("jobs").select("*").eq("business_id", businessId).eq("assigned_technician_id", technicianId).neq("status", "completed").neq("status", "cancelled").or(`and(scheduled_start.lte.${endTime},scheduled_end.gte.${startTime})`);

			if (excludeJobId) {
				query = query.neq("id", excludeJobId);
			}

			const { data: conflicts, error } = await query;

			if (error) {
				logger.error("Schedule conflicts query error:", error);
				throw error;
			}

			return conflicts || [];
		} catch (error) {
			logger.error("Schedule conflicts query error:", error);
			throw error;
		}
	}
}
