"use client";

import { useEffect } from "react";

export default function WebVitalsClient() {
	if (process.env.NODE_ENV === "production") return null;

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
				const onCLS = mod.onCLS || (await import("web-vitals/attribution")).onCLS;
				const onFID = mod.onFID || (await import("web-vitals/attribution")).onFID;
				const onLCP = mod.onLCP || (await import("web-vitals/attribution")).onLCP;
				const onINP = mod.onINP || (await import("web-vitals/attribution")).onINP;
				const onTTFB = mod.onTTFB || (await import("web-vitals/attribution")).onTTFB;

				onCLS(report);
				onFID(report);
				onLCP(report);
				onINP && onINP(report);
				onTTFB(report);
			} catch {
				// web-vitals is optional; ignore if missing
			}
		})();

		return () => {
			mounted = false;
		};
	}, []);

	return null;
}
