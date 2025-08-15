"use client";

import { useEffect } from "react";

export default function WebVitalsClient() {
	useEffect(() => {
		let mounted = true;

		const report = (metric) => {
			if (!mounted || !metric) return;
			try {
				const w = typeof window !== "undefined" ? window : undefined;
				if (!w) return;
				w.__webVitals = w.__webVitals || {};
				w.__webVitals[metric.name] = metric.value;
				const nameMap = { LCP: "LCP", CLS: "CLS", FID: "FID", INP: "INP", TTFB: "TTFB" };
				const key = nameMap[metric.name];
				if (key) w.__webVitals[key] = metric.value;
				w.dispatchEvent(new CustomEvent("web-vitals-update", { detail: { name: metric.name, value: metric.value } }));
			} catch {}
		};

		(async () => {
			try {
				const mod = await import("web-vitals");
				const onCLS = mod.onCLS;
				const onFID = mod.onFID;
				const onLCP = mod.onLCP;
				const onINP = mod.onINP;
				const onTTFB = mod.onTTFB;

				onCLS && onCLS(report);
				onFID && onFID(report);
				onLCP && onLCP(report);
				onINP && onINP(report);
				onTTFB && onTTFB(report);
			} catch {
				// web-vitals is optional; ignore if missing
			}
		})();

		return () => {
			mounted = false;
		};
	}, []);

	// Early return after all hooks are defined
	if (process.env.NODE_ENV === "production") return null;

	return null;
}
