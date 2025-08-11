/**
 * Server-side flag evaluation with caching
 * Optimized for SSR and performance
 */

import { cache } from "react";
import { flags } from "./definitions";

type FlagKey = keyof typeof flags;

export const isEnabled = cache(async (key: FlagKey) => {
	return flags[key]();
});

export const evaluateAllFlags = cache(async () => {
	const entries = await Promise.all((Object.keys(flags) as FlagKey[]).map(async (k) => [k, await flags[k]()] as const));
	return Object.fromEntries(entries) as Record<FlagKey, boolean>;
});

// Specific flag helpers for type safety
export const getSearchFlags = cache(async () => {
	const [smartSearch, aiRecommendations, visualSearch, voiceSearch, contextualFilters, realTimeUpdates] = await Promise.all([isEnabled("smartSearch"), isEnabled("aiRecommendations"), isEnabled("visualSearch"), isEnabled("voiceSearch"), isEnabled("contextualFilters"), isEnabled("realTimeUpdates")]);

	return {
		smartSearch,
		aiRecommendations,
		visualSearch,
		voiceSearch,
		contextualFilters,
		realTimeUpdates,
	};
});
