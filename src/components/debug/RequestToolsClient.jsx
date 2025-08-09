"use client";

import React, { useEffect, useRef, useState } from "react";

export default function RequestToolsClient() {
	if (process.env.NODE_ENV === "production") return null;

	const [latencyMs, setLatencyMs] = useState(0);
	const [logging, setLogging] = useState(false);
	const originalFetchRef = useRef(null);
	const [rows, setRows] = useState([]);

	useEffect(() => {
		return () => {
			// restore fetch on unmount
			if (originalFetchRef.current) {
				window.fetch = originalFetchRef.current;
				originalFetchRef.current = null;
			}
		};
	}, []);

	const applyFetchWrapper = () => {
		if (originalFetchRef.current) return;
		originalFetchRef.current = window.fetch;
		window.fetch = async (...args) => {
			const start = performance.now();
			if (latencyMs > 0) await new Promise((r) => setTimeout(r, latencyMs));
			try {
				const res = await originalFetchRef.current(...args);
				const end = performance.now();
				if (logging) {
					const url = typeof args[0] === "string" ? args[0] : args[0]?.url;
					const method = (args[1]?.method || "GET").toUpperCase();
					const duration = Math.round(end - start);
					const size = Number(res.headers.get("content-length")) || 0;
					setRows((prev) => [{ time: new Date().toLocaleTimeString(), method, url, status: res.status, ms: duration, size }, ...prev].slice(0, 50));
					// eslint-disable-next-line no-console
					console.log(`[fetch][${method}] ${url} -> ${res.status} in ${duration}ms, size=${size}`);
				}
				return res;
			} catch (e) {
				const end = performance.now();
				if (logging) {
					const url = typeof args[0] === "string" ? args[0] : args[0]?.url;
					const method = (args[1]?.method || "GET").toUpperCase();
					const duration = Math.round(end - start);
					setRows((prev) => [{ time: new Date().toLocaleTimeString(), method, url, status: "ERR", ms: duration, size: 0 }, ...prev].slice(0, 50));
				}
				throw e;
			}
		};
	};

	const removeFetchWrapper = () => {
		if (originalFetchRef.current) {
			window.fetch = originalFetchRef.current;
			originalFetchRef.current = null;
		}
	};

	useEffect(() => {
		// live-update wrapper behavior
		if (originalFetchRef.current) {
			removeFetchWrapper();
			applyFetchWrapper();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [latencyMs, logging]);

	return (
		<div className="rounded border p-3">
			<div className="font-semibold mb-2">Network Tools</div>
			<div className="flex flex-wrap items-center gap-2">
				<label className="text-[11px]">Latency (ms)</label>
				<input type="number" className="w-20 rounded border bg-transparent px-1 py-0.5 text-[12px]" value={latencyMs} min={0} onChange={(e) => setLatencyMs(parseInt(e.target.value || "0", 10))} />
				<button type="button" className="rounded border px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={applyFetchWrapper}>
					Enable Wrapper
				</button>
				<button type="button" className="rounded border px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={removeFetchWrapper}>
					Disable Wrapper
				</button>
				<label className="ml-2 inline-flex items-center gap-1 text-[11px]">
					<input type="checkbox" checked={logging} onChange={(e) => setLogging(e.target.checked)} /> Log requests
				</label>
			</div>
			{rows.length > 0 && (
				<div className="mt-2 max-h-40 overflow-auto">
					<table className="w-full text-[11px]">
						<thead>
							<tr className="text-left text-zinc-500">
								<th className="pr-2">Time</th>
								<th className="pr-2">Method</th>
								<th className="pr-2">URL</th>
								<th className="pr-2">Status</th>
								<th className="pr-2">ms</th>
								<th className="pr-2">size</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((r, i) => (
								<tr key={i} className="border-t border-zinc-200/50 dark:border-zinc-800/50">
									<td className="pr-2">{r.time}</td>
									<td className="pr-2">{r.method}</td>
									<td className="pr-2 truncate max-w-[260px]" title={r.url}>
										{r.url}
									</td>
									<td className="pr-2">{r.status}</td>
									<td className="pr-2">{r.ms}</td>
									<td className="pr-2">{r.size}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
