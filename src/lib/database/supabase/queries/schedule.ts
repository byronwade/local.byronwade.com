/**
 * Schedule Queries Module
 * Handles all schedule-related database operations
 * Optimized for field service businesses with real-time requirements
 */

import { supabase } from "../client";
import { logger } from "../../../utils/logger";

export class ScheduleQueries {
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get today's jobs for a business
   */
  static async getTodaysJobs(businessId: string, options = {}) {
    const { includeCompleted = false, includeTechnician = true } = options;
    const startTime = performance.now();

    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      let query = supabase
        .from("jobs")
        .select(`
          *,
          customer:customers(*),
          technician:technicians(*)
        `)
        .eq("business_id", businessId)
        .gte("scheduled_start", startOfDay)
        .lte("scheduled_start", endOfDay);

      if (!includeCompleted) {
        query = query.neq("status", "completed");
      }

      const { data: jobs, error } = await query.order("scheduled_start", { ascending: true });

      if (error) throw error;

      const duration = performance.now() - startTime;
      logger.performance(`Today's jobs query completed in ${duration.toFixed(2)}ms`);

      return {
        jobs: jobs || [],
        performance: {
          queryTime: duration,
          cacheHit: false
        }
      };
    } catch (error) {
      logger.error("Failed to fetch today's jobs:", error);
      throw error;
    }
  }

  /**
   * Get upcoming jobs within specified days
   */
  static async getUpcomingJobs(businessId: string, days = 7) {
    try {
      const today = new Date();
      const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));

      const { data: jobs, error } = await supabase
        .from("jobs")
        .select(`
          *,
          customer:customers(*),
          technician:technicians(*)
        `)
        .eq("business_id", businessId)
        .gt("scheduled_start", today.toISOString())
        .lte("scheduled_start", futureDate.toISOString())
        .order("scheduled_start", { ascending: true });

      if (error) throw error;

      return jobs || [];
    } catch (error) {
      logger.error("Failed to fetch upcoming jobs:", error);
      throw error;
    }
  }

  /**
   * Get business technicians
   */
  static async getBusinessTechnicians(businessId: string, includeActiveOnly = true) {
    try {
      let query = supabase
        .from("technicians")
        .select("*")
        .eq("business_id", businessId);

      if (includeActiveOnly) {
        query = query.eq("status", "active");
      }

      const { data: technicians, error } = await query.order("name", { ascending: true });

      if (error) throw error;

      return technicians || [];
    } catch (error) {
      logger.error("Failed to fetch technicians:", error);
      throw error;
    }
  }

  /**
   * Get schedule metrics
   */
  static async getScheduleMetrics(businessId: string, timeframe = "today") {
    try {
      // This would typically involve complex aggregation queries
      // For now, return placeholder data
      const metrics = {
        totalJobs: 0,
        completedJobs: 0,
        pendingJobs: 0,
        revenue: 0,
        efficiency: 0
      };

      return metrics;
    } catch (error) {
      logger.error("Failed to fetch schedule metrics:", error);
      throw error;
    }
  }

  /**
   * Update job status
   */
  static async updateJobStatus(jobId: string, newStatus: string, businessId: string) {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", jobId)
        .eq("business_id", businessId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      logger.error("Failed to update job status:", error);
      return { success: false, error };
    }
  }

  /**
   * Create new job
   */
  static async createJob(jobData: any, businessId: string) {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          ...jobData,
          business_id: businessId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      logger.error("Failed to create job:", error);
      return { success: false, error };
    }
  }

  /**
   * Check for schedule conflicts
   */
  static async getScheduleConflicts(
    businessId: string,
    technicianId: string,
    startTime: string,
    endTime: string,
    excludeJobId?: string
  ) {
    try {
      let query = supabase
        .from("jobs")
        .select("*")
        .eq("business_id", businessId)
        .eq("technician_id", technicianId)
        .or(`scheduled_start.lte.${endTime},scheduled_end.gte.${startTime}`);

      if (excludeJobId) {
        query = query.neq("id", excludeJobId);
      }

      const { data: conflicts, error } = await query;

      if (error) throw error;

      return conflicts || [];
    } catch (error) {
      logger.error("Failed to check schedule conflicts:", error);
      throw error;
    }
  }
}


