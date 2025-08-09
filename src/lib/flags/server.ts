import { cache } from "react";
import { flags, FlagKey } from "./definitions";

/**
 * Cached single-flag check. Memoized per input using React cache.
 */
export const isEnabled = cache(async (key: FlagKey): Promise<boolean> => {
	return flags[key]();
});

/**
 * Evaluate all flags once. Use at the root layout or API boundary.
 */
export const evaluateAllFlags = cache(async (): Promise<Record<FlagKey, boolean>> => {
	const entries = await Promise.all((Object.keys(flags) as FlagKey[]).map(async (k) => [k, await flags[k]()] as const));
	return Object.fromEntries(entries) as Record<FlagKey, boolean>;
});
