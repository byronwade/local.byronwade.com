import { supabase } from "../client";

export const ProposalQueries = {
	async listProposals(businessId: string, estimateId?: string) {
		let query = supabase.from("estimate_proposals").select("*").eq("business_id", businessId).order("created_at", { ascending: false });
		if (estimateId) query = query.eq("estimate_id", estimateId);
		const { data, error } = await query;
		if (error) throw error;
		return data;
	},

	async getProposal(id: string) {
		const { data, error } = await supabase.from("estimate_proposals").select("*, estimate_proposal_options(*)").eq("id", id).single();
		if (error) throw error;
		return data;
	},

	async listOptions(proposalId: string) {
		const { data, error } = await supabase.from("estimate_proposal_options").select("*").eq("proposal_id", proposalId).order("created_at", { ascending: true });
		if (error) throw error;
		return data;
	},
};
