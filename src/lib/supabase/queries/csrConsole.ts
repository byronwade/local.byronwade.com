import { supabase } from "../client";

export const CSRConsoleQueries = {
  async listCalls(businessId: string) {
    const { data, error } = await supabase
      .from("csr_calls")
      .select("*")
      .eq("business_id", businessId)
      .order("started_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getCall(callId: string) {
    const { data, error } = await supabase
      .from("csr_calls")
      .select("*")
      .eq("id", callId)
      .single();
    if (error) throw error;
    return data;
  },

  async listBookingIntents(callId: string) {
    const { data, error } = await supabase
      .from("csr_booking_intents")
      .select("*")
      .eq("call_id", callId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
};


