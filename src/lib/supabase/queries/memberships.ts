import { supabase } from "../client";

export const MembershipBillingQueries = {
  async listSubscriptions(businessId: string) {
    const { data, error } = await supabase
      .from("membership_subscriptions")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async listInvoices(subscriptionId: string) {
    const { data, error } = await supabase
      .from("membership_invoices")
      .select("*")
      .eq("subscription_id", subscriptionId)
      .order("due_date", { ascending: false });
    if (error) throw error;
    return data;
  },

  async listDunningEvents(invoiceId: string) {
    const { data, error } = await supabase
      .from("membership_dunning_events")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("event_time", { ascending: false });
    if (error) throw error;
    return data;
  },
};


