"use client";

import React, { useEffect } from "react";

export default function WDYRClient() {
	useEffect(() => {
		const enabled = typeof window !== "undefined" && window.localStorage?.getItem("wdyr") === "1";
		if (!enabled) return;
		(async () => {
			try {
				const mod = await import("@welldone-software/why-did-you-render");
				const whyDidYouRender = mod.default || mod;
				// Patch React instance used in client components
				// Note: Enabling after initial mount may not catch all components
				whyDidYouRender(React, { trackAllPureComponents: true, collapseGroups: true });
				// Expose flag
				window.__WDYR_ENABLED__ = true;
				console.info("[WDYR] Why Did You Render enabled");
			} catch (e) {
				console.warn("[WDYR] Failed to load why-did-you-render:", e);
			}
		})();
	}, []);

	// Early return after all hooks are defined
	if (process.env.NODE_ENV === "production") return null;

	return null;
}
