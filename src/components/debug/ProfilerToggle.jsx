"use client";

import React, { Profiler, useEffect, useMemo, useState } from "react";

export default function ProfilerToggle({ children }) {
	if (process.env.NODE_ENV === "production") return <>{children}</>;

	const [on, setOn] = useState(() => {
		if (typeof window === "undefined") return false;
		const ls = window.localStorage?.getItem("profiler");
		return ls === "1";
	});
	const [rows, setRows] = useState([]);

	const onRender = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
		setRows((prev) => [{ id, phase, actual: Math.round(actualDuration), base: Math.round(baseDuration), start: Math.round(startTime), commit: Math.round(commitTime) }, ...prev].slice(0, 50));
		// eslint-disable-next-line no-console
		console.log(`[Profiler][${id}] ${phase} actual=${actualDuration.toFixed(1)}ms base=${baseDuration.toFixed(1)}ms`);
	};

	const content = useMemo(
		() =>
			on ? (
				<Profiler id="App" onRender={onRender}>
					{children}
				</Profiler>
			) : (
				children
			),
		[on, children]
	);

	useEffect(() => {
		const handler = (e) => {
			const next = !!e?.detail?.on;
			setOn(next);
			try {
				window.localStorage?.setItem("profiler", next ? "1" : "0");
			} catch {}
		};
		window.addEventListener("dev-profiler-toggle", handler);
		return () => window.removeEventListener("dev-profiler-toggle", handler);
	}, []);

	return content;
}
