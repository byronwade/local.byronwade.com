import { supabase } from "../client";

export const CapacityPlanningQueries = {
	async listPlans(businessId: string) {
		const { data, error } = await supabase.from("capacity_plans").select("*").eq("business_id", businessId).order("start_date", { ascending: false });
		if (error) throw error;
		return data;
	},

	async getPlan(id: string) {
		const { data, error } = await supabase.from("capacity_plans").select("*, capacity_shifts(*)").eq("id", id).single();
		if (error) throw error;
		return data;
	},

	async listShifts(planId: string) {
		const { data, error } = await supabase.from("capacity_shifts").select("*").eq("plan_id", planId).order("shift_date", { ascending: true });
		if (error) throw error;
		return data;
	},

	async listTimeOff(businessId: string, userId?: string) {
		let query = supabase.from("time_off_requests").select("*").eq("business_id", businessId).order("start_date", { ascending: false });
		if (userId) query = query.eq("user_id", userId);
		const { data, error } = await query;
		if (error) throw error;
		return data;
	},
};
