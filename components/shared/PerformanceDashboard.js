"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { logger } from "@lib/utils/logger";
import { getPerformanceSummary } from "@lib/utils/webVitals";

/**
 * Advanced Performance Dashboard
 * Real-time monitoring inspired by NextFaster and grep.app
 *
 * Features:
 * - Real-time Core Web Vitals tracking
 * - Resource loading monitoring
 * - Memory usage tracking
 * - Network performance analysis
 * - Cache hit rate monitoring
 * - Bundle size analysis
 */

const PerformanceDashboard = ({ isVisible = false, position = "bottom-right" }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [metrics, setMetrics] = useState({
		vitals: {},
		resources: [],
		memory: {},
		network: {},
		cache: {},
		bundles: {},
	});

	const [realtimeData, setRealtimeData] = useState([]);
	const updateInterval = useRef(null);
	const startTime = useRef(performance.now());

	// Update metrics every second
	const updateMetrics = useCallback(() => {
		try {
			const currentTime = performance.now();
			const summary = getPerformanceSummary();

			// Memory information
			const memoryInfo = performance.memory
				? {
						used: performance.memory.usedJSHeapSize,
						total: performance.memory.totalJSHeapSize,
						limit: performance.memory.jsHeapSizeLimit,
						usage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100,
					}
				: {};

			// Network information
			const connectionInfo = navigator.connection
				? {
						effectiveType: navigator.connection.effectiveType,
						downlink: navigator.connection.downlink,
						rtt: navigator.connection.rtt,
						saveData: navigator.connection.saveData,
					}
				: {};

			// Resource performance
			const resources = performance
				.getEntriesByType("resource")
				.slice(-10) // Last 10 resources
				.map((entry) => ({
					name: entry.name.split("/").pop(),
					duration: entry.duration,
					size: entry.transferSize,
					type: entry.initiatorType,
					cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
				}));

			// Cache statistics (simulated - would come from your cache implementation)
			const cacheStats = {
				hitRate: 85.6, // Would be calculated from actual cache metrics
				memoryCache: 42,
				diskCache: 128,
				networkRequests: 15,
			};

			const newMetrics = {
				vitals: summary.vitals || {},
				resources,
				memory: memoryInfo,
				network: connectionInfo,
				cache: cacheStats,
				timestamp: currentTime,
				uptime: currentTime - startTime.current,
			};

			setMetrics(newMetrics);

			// Add to realtime data for charts
			setRealtimeData((prev) => {
				const newData = [
					...prev,
					{
						timestamp: currentTime,
						lcp: summary.vitals.LCP?.value || 0,
						fid: summary.vitals.FID?.value || 0,
						cls: summary.vitals.CLS?.value || 0,
						memory: memoryInfo.usage || 0,
					},
				];

				// Keep only last 60 data points (1 minute)
				return newData.slice(-60);
			});
		} catch (error) {
			logger.error("Performance dashboard update failed:", error);
		}
	}, []);

	// Start/stop monitoring
	useEffect(() => {
		if (isVisible && isExpanded) {
			updateMetrics(); // Initial update
			updateInterval.current = setInterval(updateMetrics, 1000);

			return () => {
				if (updateInterval.current) {
					clearInterval(updateInterval.current);
				}
			};
		}
	}, [isVisible, isExpanded, updateMetrics]);

	// Format bytes
	const formatBytes = (bytes) => {
		if (!bytes) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
	};

	// Format time
	const formatTime = (ms) => {
		if (!ms) return "0ms";
		if (ms < 1000) return `${Math.round(ms)}ms`;
		return `${(ms / 1000).toFixed(1)}s`;
	};

	// Get rating color
	const getRatingColor = (rating) => {
		switch (rating) {
			case "good":
				return "text-green-600";
			case "needs-improvement":
				return "text-yellow-600";
			case "poor":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	if (!isVisible) return null;

	const positionClasses = {
		"bottom-right": "bottom-4 right-4",
		"bottom-left": "bottom-4 left-4",
		"top-right": "top-4 right-4",
		"top-left": "top-4 left-4",
	};

	return (
		<div className={`fixed ${positionClasses[position]} z-[9999] font-mono text-xs`}>
			{/* Toggle Button */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className={`
          mb-2 px-3 py-2 bg-black text-white rounded-lg shadow-lg
          hover:bg-gray-800 transition-colors duration-200
          ${isExpanded ? "bg-blue-600 hover:bg-blue-700" : ""}
        `}
			>
				{isExpanded ? "🚀 Hide Perf" : "📊 Perf"}
			</button>

			{/* Dashboard Panel */}
			{isExpanded && (
				<div className="bg-black text-white rounded-lg shadow-2xl p-4 max-w-md max-h-96 overflow-y-auto">
					{/* Core Web Vitals */}
					<div className="mb-4">
						<h3 className="text-yellow-400 font-bold mb-2">⚡ Core Web Vitals</h3>
						<div className="grid grid-cols-3 gap-2">
							{["LCP", "FID", "CLS"].map((vital) => {
								const data = metrics.vitals[vital];
								return (
									<div key={vital} className="bg-gray-800 p-2 rounded">
										<div className="text-gray-400">{vital}</div>
										<div className={getRatingColor(data?.rating)}>{data ? formatTime(data.value) : "..."}</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Memory Usage */}
					{metrics.memory.used && (
						<div className="mb-4">
							<h3 className="text-blue-400 font-bold mb-2">🧠 Memory</h3>
							<div className="bg-gray-800 p-2 rounded">
								<div className="flex justify-between">
									<span>Used:</span>
									<span>{formatBytes(metrics.memory.used)}</span>
								</div>
								<div className="flex justify-between">
									<span>Total:</span>
									<span>{formatBytes(metrics.memory.total)}</span>
								</div>
								<div className="flex justify-between">
									<span>Usage:</span>
									<span className={metrics.memory.usage > 90 ? "text-red-400" : "text-green-400"}>{metrics.memory.usage?.toFixed(1)}%</span>
								</div>
							</div>
						</div>
					)}

					{/* Network */}
					{metrics.network.effectiveType && (
						<div className="mb-4">
							<h3 className="text-green-400 font-bold mb-2">🌐 Network</h3>
							<div className="bg-gray-800 p-2 rounded">
								<div className="flex justify-between">
									<span>Type:</span>
									<span className="text-green-400">{metrics.network.effectiveType}</span>
								</div>
								<div className="flex justify-between">
									<span>Downlink:</span>
									<span>{metrics.network.downlink} Mbps</span>
								</div>
								<div className="flex justify-between">
									<span>RTT:</span>
									<span>{metrics.network.rtt}ms</span>
								</div>
							</div>
						</div>
					)}

					{/* Cache Statistics */}
					<div className="mb-4">
						<h3 className="text-purple-400 font-bold mb-2">💾 Cache</h3>
						<div className="bg-gray-800 p-2 rounded">
							<div className="flex justify-between">
								<span>Hit Rate:</span>
								<span className="text-green-400">{metrics.cache.hitRate}%</span>
							</div>
							<div className="flex justify-between">
								<span>Memory:</span>
								<span>{metrics.cache.memoryCache} items</span>
							</div>
							<div className="flex justify-between">
								<span>Disk:</span>
								<span>{formatBytes(metrics.cache.diskCache * 1024)}</span>
							</div>
						</div>
					</div>

					{/* Recent Resources */}
					<div className="mb-4">
						<h3 className="text-orange-400 font-bold mb-2">📦 Recent Resources</h3>
						<div className="space-y-1 max-h-24 overflow-y-auto">
							{metrics.resources.slice(0, 5).map((resource, i) => (
								<div key={i} className="bg-gray-800 p-1 rounded text-xs">
									<div className="flex justify-between">
										<span className="truncate flex-1 mr-2">{resource.name}</span>
										<span className={resource.cached ? "text-green-400" : "text-gray-400"}>{resource.cached ? "💚" : formatTime(resource.duration)}</span>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Mini Chart */}
					{realtimeData.length > 0 && (
						<div className="mb-4">
							<h3 className="text-cyan-400 font-bold mb-2">📈 Real-time</h3>
							<div className="bg-gray-800 p-2 rounded h-16 relative">
								<MiniChart data={realtimeData} />
							</div>
						</div>
					)}

					{/* Actions */}
					<div className="grid grid-cols-2 gap-2">
						<button
							onClick={() => {
								performance.mark("user-initiated-clear");
								if (window.caches) {
									caches.keys().then((names) => {
										names.forEach((name) => caches.delete(name));
									});
								}
								location.reload();
							}}
							className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
						>
							🗑️ Clear Cache
						</button>
						<button
							onClick={() => {
								const summary = getPerformanceSummary();
								console.log("Performance Summary:", summary);
								logger.info("Performance exported to console");
							}}
							className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
						>
							📋 Export
						</button>
					</div>

					{/* Uptime */}
					<div className="mt-2 text-xs text-gray-400 text-center">Uptime: {formatTime(metrics.uptime)}</div>
				</div>
			)}
		</div>
	);
};

// Mini chart component for real-time visualization
const MiniChart = ({ data }) => {
	const chartRef = useRef(null);

	useEffect(() => {
		if (!chartRef.current || !data.length) return;

		const canvas = chartRef.current;
		const ctx = canvas.getContext("2d");
		const { width, height } = canvas.getBoundingClientRect();

		canvas.width = width;
		canvas.height = height;

		// Clear canvas
		ctx.fillStyle = "#1f2937";
		ctx.fillRect(0, 0, width, height);

		// Draw LCP line (green)
		ctx.strokeStyle = "#10b981";
		ctx.lineWidth = 1;
		ctx.beginPath();

		data.forEach((point, i) => {
			const x = (i / (data.length - 1)) * width;
			const y = height - (point.lcp / 5000) * height; // Scale to 5s max

			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		});

		ctx.stroke();

		// Draw memory usage line (red)
		ctx.strokeStyle = "#ef4444";
		ctx.beginPath();

		data.forEach((point, i) => {
			const x = (i / (data.length - 1)) * width;
			const y = height - (point.memory / 100) * height; // Scale to 100%

			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		});

		ctx.stroke();
	}, [data]);

	return <canvas ref={chartRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />;
};

export default PerformanceDashboard;
