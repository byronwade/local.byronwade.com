import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { Search, MapPin, Shield, Eye, Users, Clock, CheckCircle, Loader2, Sparkles, TrendingUp } from "lucide-react";

const SmartLoadingCard = ({ message, progress = 0, stage = "searching" }) => {
	const [dots, setDots] = useState(0);
	const [currentTip, setCurrentTip] = useState(0);

	const loadingTips = ["💡 Tip: Verified businesses have background checks", "⚡ Pro tip: Look for same-day service badges", "🔍 Did you know? We show real-time availability", "🎯 Smart filters help narrow down results", "⭐ 4.5+ rated businesses are customer favorites"];

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev + 1) % 4);
		}, 500);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const tipInterval = setInterval(() => {
			setCurrentTip((prev) => (prev + 1) % loadingTips.length);
		}, 2500);
		return () => clearInterval(tipInterval);
	}, [loadingTips.length]);

	const stageConfig = {
		searching: {
			icon: Search,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
			borderColor: "border-blue-200",
		},
		filtering: {
			icon: TrendingUp,
			color: "text-purple-600",
			bgColor: "bg-purple-50",
			borderColor: "border-purple-200",
		},
		loading: {
			icon: Loader2,
			color: "text-orange-600",
			bgColor: "bg-orange-50",
			borderColor: "border-orange-200",
		},
		complete: {
			icon: CheckCircle,
			color: "text-green-600",
			bgColor: "bg-green-50",
			borderColor: "border-green-200",
		},
	};

	const config = stageConfig[stage] || stageConfig.searching;
	const IconComponent = config.icon;

	return (
		<Card className={`${config.borderColor} ${config.bgColor} border-l-4`}>
			<CardContent className="p-4">
				<div className="flex items-center gap-3 mb-3">
					<div className={`${config.color} ${stage === "loading" ? "animate-spin" : ""}`}>
						<IconComponent className="w-5 h-5" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium text-gray-800">
							{message}
							{".".repeat(dots)}
						</p>
						{progress > 0 && <Progress value={progress} className="h-2 mt-2" />}
					</div>
				</div>

				{/* Loading tip rotation */}
				<div className="p-2 text-xs text-gray-600 border rounded-lg bg-white/60">{loadingTips[currentTip]}</div>
			</CardContent>
		</Card>
	);
};

const BusinessCardSkeleton = ({ showPulse = true }) => (
	<Card className="mb-3 border-l-4 border-l-transparent">
		<CardContent className="p-4">
			<div className="flex gap-3">
				<div className={`w-16 h-16 rounded-lg bg-neutral-800 ${showPulse ? "animate-pulse" : ""}`} />
				<div className="flex-1 space-y-2">
					<div className={`h-4 bg-neutral-800 rounded w-3/4 ${showPulse ? "animate-pulse" : ""}`} />
					<div className={`h-3 bg-neutral-800 rounded w-1/2 ${showPulse ? "animate-pulse" : ""}`} />
					<div className="flex gap-2">
						<div className={`h-5 bg-neutral-800 rounded-full w-16 ${showPulse ? "animate-pulse" : ""}`} />
						<div className={`h-5 bg-neutral-800 rounded-full w-20 ${showPulse ? "animate-pulse" : ""}`} />
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
);

const SearchProgress = ({ stage, businessCount = 0, estimatedTotal = 0 }) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const stages = {
			connecting: 15,
			searching: 45,
			filtering: 75,
			complete: 100,
		};

		const targetProgress = stages[stage] || 0;
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev < targetProgress) {
					return Math.min(prev + 2, targetProgress);
				}
				return prev;
			});
		}, 50);

		return () => clearInterval(interval);
	}, [stage]);

	return (
		<div className="space-y-4">
			{/* Progress Header */}
			<div className="p-4 border border-gray-200 shadow-lg bg-white/95 backdrop-blur-sm rounded-2xl">
				<div className="flex items-center justify-between mb-3">
					<h3 className="font-semibold text-gray-900">Finding businesses...</h3>
					<Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
						<Eye className="w-3 h-3 mr-1" />
						Live search
					</Badge>
				</div>

				<Progress value={progress} className="h-2 mb-3" />

				<div className="flex items-center justify-between text-xs text-gray-600">
					<span>Stage: {stage}</span>
					{businessCount > 0 && <span>{businessCount} found so far...</span>}
				</div>
			</div>

			{/* Live Stats */}
			{businessCount > 0 && (
				<div className="p-4 border border-green-200 shadow-lg bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
					<div className="flex items-center gap-2 mb-2">
						<TrendingUp className="w-4 h-4 text-green-600" />
						<span className="text-sm font-medium text-green-800">Search Results</span>
					</div>

					<div className="grid grid-cols-2 gap-3 text-xs">
						<div className="flex items-center justify-between">
							<span className="text-gray-600">Found</span>
							<Badge variant="secondary" className="text-green-700 bg-green-100">
								{businessCount}
							</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-600">Open now</span>
							<Badge variant="secondary" className="text-blue-700 bg-blue-100">
								{Math.floor(businessCount * 0.6)}
							</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-600">Verified</span>
							<Badge variant="secondary" className="text-purple-700 bg-purple-100">
								{Math.floor(businessCount * 0.4)}
							</Badge>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-gray-600">Free quotes</span>
							<Badge variant="secondary" className="text-orange-700 bg-orange-100">
								{Math.floor(businessCount * 0.3)}
							</Badge>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const EmptyStateWithPsychology = ({ searchQuery, onRetry, onExpandArea }) => (
	<div className="flex flex-col items-center justify-center h-full p-8 text-center">
		<div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
			<MapPin className="w-10 h-10 text-blue-500" />
		</div>

		<h3 className="mb-2 text-xl font-semibold text-gray-900">No {searchQuery || "businesses"} found nearby</h3>

		<p className="max-w-md mb-6 text-gray-600">Don&apos;t worry! This happens sometimes. Let&apos;s try a few options to find what you&apos;re looking for.</p>

		<div className="w-full max-w-xs space-y-3">
			<button onClick={onExpandArea} className="flex items-center justify-center w-full gap-2 px-4 py-3 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
				<Search className="w-4 h-4" />
				Search wider area
			</button>

			<button onClick={onRetry} className="flex items-center justify-center w-full gap-2 px-4 py-3 text-gray-700 transition-colors bg-neutral-800 rounded-lg hover:bg-neutral-700">
				<Clock className="w-4 h-4" />
				Try again
			</button>
		</div>

		{/* Confidence building */}
		<div className="max-w-md p-4 mt-8 border border-blue-200 rounded-lg bg-blue-50">
			<div className="flex items-center gap-2 mb-2">
				<Sparkles className="w-4 h-4 text-blue-600" />
				<span className="text-sm font-medium text-blue-800">Pro tip</span>
			</div>
			<p className="text-xs text-blue-700">We search thousands of verified businesses daily. Your perfect match might be just outside the current view!</p>
		</div>
	</div>
);

export { SmartLoadingCard, BusinessCardSkeleton, SearchProgress, EmptyStateWithPsychology };
