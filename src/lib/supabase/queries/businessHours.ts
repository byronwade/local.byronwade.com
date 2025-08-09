/**
 * Business Hours Queries for Supabase
 * Performance-optimized queries for business operating hours management
 * Includes timezone handling, holiday schedules, and special hours
 */

import { supabase, getPooledClient, Tables } from "../client";
import { CacheManager } from "@lib/utils/cache-manager";
import { logger } from "@lib/utils/logger";

type BusinessHours = Tables<"business_hours">;
type SpecialHours = Tables<"special_hours">;

export interface WeeklyHours {
	monday: DayHours;
	tuesday: DayHours;
	wednesday: DayHours;
	thursday: DayHours;
	friday: DayHours;
	saturday: DayHours;
	sunday: DayHours;
}

export interface DayHours {
	isOpen: boolean;
	openTime: string; // HH:mm format
	closeTime: string; // HH:mm format
	breaks?: TimeSlot[];
}

export interface TimeSlot {
	start: string; // HH:mm format
	end: string; // HH:mm format
}

export interface SpecialHoursEvent {
	id?: string;
	date: string; // YYYY-MM-DD format
	name: string;
	isClosed: boolean;
	openTime?: string;
	closeTime?: string;
	description?: string;
}

/**
 * High-performance business hours queries with intelligent caching
 */
export class BusinessHoursQueries {
	private static readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
	private static readonly pooledClient = getPooledClient("business_hours");

	/**
	 * Get business hours for a specific business
	 */
	static async getBusinessHours(businessId: string): Promise<{
		weeklyHours: WeeklyHours;
		timezone: string;
		specialHours: SpecialHoursEvent[];
		performance: { queryTime: number; cacheHit: boolean };
	}> {
		const startTime = performance.now();
		const cacheKey = `business_hours_${businessId}`;

		// Check cache first
		const cached = CacheManager.memory.get(cacheKey);
		if (cached) {
			logger.performance(`Business hours cache hit: ${cacheKey}`);
			return {
				...cached,
				performance: {
					queryTime: performance.now() - startTime,
					cacheHit: true,
				},
			};
		}

		try {
			// Get regular business hours
			const { data: businessHours, error: hoursError } = await this.pooledClient.from("business_hours").select("*").eq("business_id", businessId).single();

			if (hoursError && hoursError.code !== "PGRST116") {
				logger.error("Business hours query error:", hoursError);
				throw hoursError;
			}

			// Get special hours (holidays, events, closures)
			const { data: specialHours, error: specialError } = await this.pooledClient
				.from("special_hours")
				.select("*")
				.eq("business_id", businessId)
				.gte("date", new Date().toISOString().split("T")[0]) // Only future/current dates
				.order("date", { ascending: true });

			if (specialError) {
				logger.error("Special hours query error:", specialError);
				throw specialError;
			}

			// Format the data
			const weeklyHours: WeeklyHours = businessHours
				? {
						monday: this.formatDayHours(businessHours.monday_hours),
						tuesday: this.formatDayHours(businessHours.tuesday_hours),
						wednesday: this.formatDayHours(businessHours.wednesday_hours),
						thursday: this.formatDayHours(businessHours.thursday_hours),
						friday: this.formatDayHours(businessHours.friday_hours),
						saturday: this.formatDayHours(businessHours.saturday_hours),
						sunday: this.formatDayHours(businessHours.sunday_hours),
					}
				: this.getDefaultHours();

			const result = {
				weeklyHours,
				timezone: businessHours?.timezone || "America/New_York",
				specialHours: specialHours?.map(this.formatSpecialHours) || [],
			};

			// Cache successful results
			CacheManager.memory.set(cacheKey, result, this.CACHE_TTL);

			const queryTime = performance.now() - startTime;
			logger.performance(`Business hours query completed in ${queryTime.toFixed(2)}ms`);

			return {
				...result,
				performance: {
					queryTime,
					cacheHit: false,
				},
			};
		} catch (error) {
			logger.error("Business hours query error:", error);
			throw error;
		}
	}

	/**
	 * Update business hours for a specific business
	 */
	static async updateBusinessHours(businessId: string, weeklyHours: WeeklyHours, timezone: string = "America/New_York"): Promise<{ success: boolean; businessHours?: BusinessHours }> {
		const startTime = performance.now();

		try {
			const hoursData = {
				business_id: businessId,
				timezone,
				monday_hours: this.formatHoursForDB(weeklyHours.monday),
				tuesday_hours: this.formatHoursForDB(weeklyHours.tuesday),
				wednesday_hours: this.formatHoursForDB(weeklyHours.wednesday),
				thursday_hours: this.formatHoursForDB(weeklyHours.thursday),
				friday_hours: this.formatHoursForDB(weeklyHours.friday),
				saturday_hours: this.formatHoursForDB(weeklyHours.saturday),
				sunday_hours: this.formatHoursForDB(weeklyHours.sunday),
				updated_at: new Date().toISOString(),
			};

			const { data: businessHours, error } = await this.pooledClient
				.from("business_hours")
				.upsert(hoursData, {
					onConflict: "business_id",
					returning: "representation",
				})
				.select()
				.single();

			if (error) {
				logger.error("Business hours update error:", error);
				throw error;
			}

			// Invalidate cache
			this.invalidateBusinessHoursCache(businessId);

			const queryTime = performance.now() - startTime;
			logger.performance(`Business hours update completed in ${queryTime.toFixed(2)}ms`);

			return { success: true, businessHours };
		} catch (error) {
			logger.error("Business hours update error:", error);
			return { success: false };
		}
	}

	/**
	 * Add or update special hours (holidays, events, temporary closures)
	 */
	static async updateSpecialHours(businessId: string, specialHoursEvent: SpecialHoursEvent): Promise<{ success: boolean; specialHours?: SpecialHours }> {
		const startTime = performance.now();

		try {
			const eventData = {
				business_id: businessId,
				date: specialHoursEvent.date,
				name: specialHoursEvent.name,
				is_closed: specialHoursEvent.isClosed,
				open_time: specialHoursEvent.openTime || null,
				close_time: specialHoursEvent.closeTime || null,
				description: specialHoursEvent.description || null,
				updated_at: new Date().toISOString(),
			};

			let query;
			if (specialHoursEvent.id) {
				// Update existing
				query = this.pooledClient.from("special_hours").update(eventData).eq("id", specialHoursEvent.id).eq("business_id", businessId);
			} else {
				// Create new
				query = this.pooledClient.from("special_hours").insert({
					...eventData,
					created_at: new Date().toISOString(),
				});
			}

			const { data: specialHours, error } = await query.select().single();

			if (error) {
				logger.error("Special hours update error:", error);
				throw error;
			}

			// Invalidate cache
			this.invalidateBusinessHoursCache(businessId);

			const queryTime = performance.now() - startTime;
			logger.performance(`Special hours update completed in ${queryTime.toFixed(2)}ms`);

			return { success: true, specialHours };
		} catch (error) {
			logger.error("Special hours update error:", error);
			return { success: false };
		}
	}

	/**
	 * Delete special hours event
	 */
	static async deleteSpecialHours(businessId: string, specialHoursId: string): Promise<{ success: boolean }> {
		const startTime = performance.now();

		try {
			const { error } = await this.pooledClient.from("special_hours").delete().eq("id", specialHoursId).eq("business_id", businessId);

			if (error) {
				logger.error("Special hours delete error:", error);
				throw error;
			}

			// Invalidate cache
			this.invalidateBusinessHoursCache(businessId);

			const queryTime = performance.now() - startTime;
			logger.performance(`Special hours delete completed in ${queryTime.toFixed(2)}ms`);

			return { success: true };
		} catch (error) {
			logger.error("Special hours delete error:", error);
			return { success: false };
		}
	}

	/**
	 * Check if business is currently open
	 */
	static async isBusinessOpen(
		businessId: string,
		checkTime?: Date
	): Promise<{
		isOpen: boolean;
		nextOpenTime?: string;
		nextCloseTime?: string;
		specialEvent?: SpecialHoursEvent;
	}> {
		try {
			const businessHours = await this.getBusinessHours(businessId);
			const checkDate = checkTime || new Date();

			// Convert to business timezone
			const timeInTimezone = new Intl.DateTimeFormat("en-US", {
				timeZone: businessHours.timezone,
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}).format(checkDate);

			const dayOfWeek = checkDate
				.toLocaleDateString("en-US", {
					weekday: "long",
					timeZone: businessHours.timezone,
				})
				.toLowerCase() as keyof WeeklyHours;

			const dateString = checkDate.toLocaleDateString("en-CA", {
				timeZone: businessHours.timezone,
			});

			// Check for special hours first
			const specialEvent = businessHours.specialHours.find((event) => event.date === dateString);
			if (specialEvent) {
				if (specialEvent.isClosed) {
					return { isOpen: false, specialEvent };
				}
				// Check special hours
				if (specialEvent.openTime && specialEvent.closeTime) {
					const isOpen = timeInTimezone >= specialEvent.openTime && timeInTimezone <= specialEvent.closeTime;
					return {
						isOpen,
						nextCloseTime: isOpen ? specialEvent.closeTime : undefined,
						specialEvent,
					};
				}
			}

			// Check regular hours
			const dayHours = businessHours.weeklyHours[dayOfWeek];
			if (!dayHours.isOpen) {
				return { isOpen: false };
			}

			const isOpen = timeInTimezone >= dayHours.openTime && timeInTimezone <= dayHours.closeTime;

			return {
				isOpen,
				nextCloseTime: isOpen ? dayHours.closeTime : undefined,
				nextOpenTime: !isOpen && timeInTimezone < dayHours.openTime ? dayHours.openTime : undefined,
			};
		} catch (error) {
			logger.error("Business open check error:", error);
			return { isOpen: false };
		}
	}

	/**
	 * Get business hours for multiple businesses (batch operation)
	 */
	static async getBatchBusinessHours(businessIds: string[]): Promise<Record<string, WeeklyHours & { timezone: string }>> {
		const startTime = performance.now();

		try {
			const { data: businessHours, error } = await this.pooledClient.from("business_hours").select("*").in("business_id", businessIds);

			if (error) {
				logger.error("Batch business hours query error:", error);
				throw error;
			}

			const result: Record<string, WeeklyHours & { timezone: string }> = {};

			businessHours?.forEach((hours) => {
				result[hours.business_id] = {
					timezone: hours.timezone || "America/New_York",
					monday: this.formatDayHours(hours.monday_hours),
					tuesday: this.formatDayHours(hours.tuesday_hours),
					wednesday: this.formatDayHours(hours.wednesday_hours),
					thursday: this.formatDayHours(hours.thursday_hours),
					friday: this.formatDayHours(hours.friday_hours),
					saturday: this.formatDayHours(hours.saturday_hours),
					sunday: this.formatDayHours(hours.sunday_hours),
				};
			});

			const queryTime = performance.now() - startTime;
			logger.performance(`Batch business hours query completed in ${queryTime.toFixed(2)}ms`);

			return result;
		} catch (error) {
			logger.error("Batch business hours query error:", error);
			throw error;
		}
	}

	/**
	 * Format day hours from database JSON to DayHours interface
	 */
	private static formatDayHours(hoursJson: any): DayHours {
		if (!hoursJson || typeof hoursJson !== "object") {
			return { isOpen: false, openTime: "09:00", closeTime: "17:00" };
		}

		return {
			isOpen: Boolean(hoursJson.isOpen),
			openTime: hoursJson.openTime || "09:00",
			closeTime: hoursJson.closeTime || "17:00",
			breaks: hoursJson.breaks || [],
		};
	}

	/**
	 * Format DayHours interface to database JSON
	 */
	private static formatHoursForDB(dayHours: DayHours): any {
		return {
			isOpen: dayHours.isOpen,
			openTime: dayHours.openTime,
			closeTime: dayHours.closeTime,
			breaks: dayHours.breaks || [],
		};
	}

	/**
	 * Format special hours from database to SpecialHoursEvent interface
	 */
	private static formatSpecialHours(specialHours: any): SpecialHoursEvent {
		return {
			id: specialHours.id,
			date: specialHours.date,
			name: specialHours.name,
			isClosed: specialHours.is_closed,
			openTime: specialHours.open_time,
			closeTime: specialHours.close_time,
			description: specialHours.description,
		};
	}

	/**
	 * Get default business hours (9 AM - 5 PM, Monday-Friday)
	 */
	private static getDefaultHours(): WeeklyHours {
		const defaultWeekdayHours: DayHours = {
			isOpen: true,
			openTime: "09:00",
			closeTime: "17:00",
		};

		const defaultWeekendHours: DayHours = {
			isOpen: false,
			openTime: "09:00",
			closeTime: "17:00",
		};

		return {
			monday: defaultWeekdayHours,
			tuesday: defaultWeekdayHours,
			wednesday: defaultWeekdayHours,
			thursday: defaultWeekdayHours,
			friday: defaultWeekdayHours,
			saturday: defaultWeekendHours,
			sunday: defaultWeekendHours,
		};
	}

	/**
	 * Invalidate business hours related caches
	 */
	private static invalidateBusinessHoursCache(businessId: string): void {
		const patterns = [`business_hours_${businessId}`, `business_open_${businessId}`];

		patterns.forEach((pattern) => {
			CacheManager.memory.invalidatePattern(pattern);
		});

		logger.debug(`Invalidated business hours cache for business: ${businessId}`);
	}
}
