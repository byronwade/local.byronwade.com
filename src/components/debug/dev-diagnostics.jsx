"use client";

import { useEffect } from "react";

export default function DevDiagnostics() {
	useEffect(() => {
		try {
			const ts = new Date().toISOString();
			console.groupCollapsed("[Diag] Boot %s", ts);
			console.log("location", window.location.href);
			console.log("userAgent", navigator.userAgent);
			console.log("webpack runtime available", typeof __webpack_require__ !== "undefined");
			if (typeof __webpack_require__ !== "undefined") {
				console.log("__webpack_require__ keys", Object.keys(__webpack_require__).slice(0, 10));
			}
			const scripts = Array.from(document.scripts).map((s) => s.src).filter(Boolean);
			console.log("scripts (initial)", scripts);
			const preloads = Array.from(document.querySelectorAll('link[rel="preload"][as="script"]')).map((l) => l.href);
			console.log("preloaded scripts", preloads);
			console.groupEnd();

			const onScriptError = (e) => {
				// Log chunk/script load errors with context
				const target = e.target;
				if (target && target.tagName === "SCRIPT") {
					console.error("[Diag] Script load error", {
						src: target.src,
						baseURI: target.baseURI,
						time: Date.now(),
					});
				}
			};
			window.addEventListener("error", onScriptError, true);

			const originalConsoleError = console.error;
			console.error = function (...args) {
				try {
					if (args && typeof args[0] === "string" && args[0].includes("Cannot read properties of undefined (reading 'call')")) {
						console.groupCollapsed("[Diag] Lazy factory undefined detected");
						console.log("time", new Date().toISOString());
						console.log("scripts (now)", Array.from(document.scripts).map((s) => s.src).filter(Boolean));
						console.log("preloads (now)", Array.from(document.querySelectorAll('link[rel="preload"][as="script"]')).map((l) => l.href));
						if (navigator.serviceWorker) {
							navigator.serviceWorker.getRegistrations().then((regs) => {
								console.log("service workers", regs.map((r) => ({ scope: r.scope })));
							});
						}
						console.groupEnd();
					}
				} catch {}
				return originalConsoleError.apply(console, args);
			};

			// 5s post-hydration diagnostics
			const t = setTimeout(() => {
				console.groupCollapsed("[Diag] 5s post-hydration");
				console.log("scripts", Array.from(document.scripts).map((s) => s.src).filter(Boolean));
				console.log("links[preload as=script]", Array.from(document.querySelectorAll('link[rel="preload"][as="script"]')).map((l) => l.href));
				console.groupEnd();
			}, 5000);

			return () => {
				clearTimeout(t);
				window.removeEventListener("error", onScriptError, true);
				// restore console.error
				// eslint-disable-next-line no-global-assign
				console.error = console.error;
			};
		} catch (e) {
			console.warn("[Diag] init error", e);
		}
	}, []);

	return null;
}


