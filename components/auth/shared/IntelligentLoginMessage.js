// REQUIRED: Intelligent Login Message Component
// Displays contextual messaging based on user intent

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LoginContextDetector, ContextMessageGenerator } from "@lib/auth/loginContext";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent } from "@components/ui/card";
import { Building2, Star, Calendar, Heart, Users, Shield, Sparkles, MessageCircle, User, Settings, ChevronRight, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { cn } from "@lib/utils";
import { logger } from "@lib/utils/logger";
import { validateLogger } from "@lib/utils/loggerTest";

const CONTEXT_ICONS = {
	business: Building2,
	social: Users,
	booking: Calendar,
	account: User,
	admin: Settings,
	premium: Sparkles,
	support: MessageCircle,
	general: Shield,
};

export default function IntelligentLoginMessage({ onContextDetected }) {
	const searchParams = useSearchParams();
	const [context, setContext] = useState(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Validate logger functionality on component mount
		if (process.env.NODE_ENV === "development") {
			console.log("🔍 Running logger validation in IntelligentLoginMessage...");
			validateLogger();
		}

		// Detect context from URL parameters
		const detectedContext = LoginContextDetector.detectContext(window.location.href, searchParams);

		setContext(detectedContext);

		// Store context globally for access by other components
		window.loginContext = detectedContext;

		// Notify parent component
		if (onContextDetected) {
			onContextDetected(detectedContext);
		}

		// Log context detection for analytics with robust error handling
		try {
			// Enhanced logger validation with debugging
			if (!logger) {
				console.warn("Logger is null or undefined");
				return;
			}

			if (typeof logger !== "object") {
				console.warn("Logger is not an object, type:", typeof logger);
				return;
			}

			if (typeof logger.interaction !== "function") {
				console.warn("Logger.interaction is not a function, type:", typeof logger.interaction, "Available methods:", Object.keys(logger));
				// Fallback to analytics if available
				if (typeof logger.analytics === "function") {
					logger.analytics({
						type: "login_context_detected",
						context: detectedContext.key,
						detectionMethod: detectedContext.detected,
						originalPath: detectedContext.originalPath,
						timestamp: Date.now(),
					});
				}
				return;
			}

			// Safe to call logger.interaction
			logger.interaction({
				type: "login_context_detected",
				context: detectedContext.key,
				detectionMethod: detectedContext.detected,
				originalPath: detectedContext.originalPath,
				timestamp: Date.now(),
			});
		} catch (logError) {
			console.warn("Logger interaction failed:", logError);
			// Try fallback analytics method
			try {
				if (logger && typeof logger.analytics === "function") {
					logger.analytics({
						type: "login_context_detected",
						context: detectedContext.key,
						detectionMethod: detectedContext.detected,
						originalPath: detectedContext.originalPath,
						timestamp: Date.now(),
					});
				} else {
					// Direct console fallback
					console.log("👆 INTERACTION:", {
						type: "login_context_detected",
						context: detectedContext.key,
						detectionMethod: detectedContext.detected,
						originalPath: detectedContext.originalPath,
						timestamp: Date.now(),
					});
				}
			} catch (innerError) {
				console.error("Analytics fallback failed:", innerError);
				// Final console fallback
				console.log("👆 INTERACTION (final fallback):", {
					type: "login_context_detected",
					context: detectedContext.key,
					detectionMethod: detectedContext.detected,
					originalPath: detectedContext.originalPath,
					timestamp: Date.now(),
				});
			}
		}

		// Animate visibility
		setTimeout(() => setIsVisible(true), 100);
	}, [searchParams, onContextDetected]);

	if (!context || context.key === "default") {
		return null;
	}

	const IconComponent = CONTEXT_ICONS[context.category] || Shield;
	const urgency = ContextMessageGenerator.getUrgencyLevel(context);
	const socialProof = ContextMessageGenerator.getSocialProof(context);
	const timeSensitive = ContextMessageGenerator.getTimeSensitiveMessage(context);

	return (
		<div className={cn("transition-all duration-500 ease-out transform", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
			<Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 dark:border-blue-800 dark:from-blue-950/30 dark:to-indigo-950/30">
				<CardContent className="p-6">
					{/* Header with Icon and Badge */}
					<div className="flex justify-between items-start mb-4">
						<div className="flex items-center space-x-3">
							<div className={cn("p-3 rounded-full", urgency.color === "red" && "bg-red-100 dark:bg-red-900/30", urgency.color === "blue" && "bg-blue-100 dark:bg-blue-900/30", urgency.color === "gray" && "bg-gray-100 dark:bg-gray-900/30")}>
								<IconComponent className={cn("h-6 w-6", urgency.color === "red" && "text-red-600 dark:text-red-400", urgency.color === "blue" && "text-blue-600 dark:text-blue-400", urgency.color === "gray" && "text-gray-600 dark:text-gray-400", urgency.pulse && "animate-pulse")} />
							</div>

							<div>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">{context.title}</h3>
								<p className="text-sm text-gray-600 dark:text-gray-300">{context.subtitle}</p>
							</div>
						</div>

						{context.priority === "high" && (
							<Badge variant="destructive" className="animate-pulse">
								Priority
							</Badge>
						)}
					</div>

					{/* Main Message */}
					<div className="mb-4">
						<p className="leading-relaxed text-gray-700 dark:text-gray-300">{context.message}</p>
					</div>

					{/* Time Sensitive Alert */}
					{timeSensitive && (
						<div className="p-3 mb-4 bg-orange-50 rounded-lg border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800">
							<div className="flex items-center space-x-2">
								<Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
								<span className="text-sm font-medium text-orange-800 dark:text-orange-200">{timeSensitive}</span>
							</div>
						</div>
					)}

					{/* Benefits Grid */}
					<div className="grid grid-cols-1 gap-2 mb-4 md:grid-cols-2">
						{context.benefits.map((benefit, index) => (
							<div key={index} className="flex items-center space-x-2">
								<CheckCircle className="flex-shrink-0 w-4 h-4 text-green-600 dark:text-green-400" />
								<span className="text-sm text-gray-600 dark:text-gray-300">{benefit}</span>
							</div>
						))}
					</div>

					{/* Social Proof */}
					{socialProof && (
						<div className="p-3 mb-4 bg-green-50 rounded-lg border border-green-200 dark:bg-green-900/20 dark:border-green-800">
							<div className="flex items-center space-x-2">
								<TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
								<span className="text-sm font-medium text-green-800 dark:text-green-200">{socialProof}</span>
							</div>
						</div>
					)}

					{/* Context-Specific Action Preview */}
					{(context.key === "add-business" || context.key === "claim-business") && (
						<div className="pt-4 mt-4 border-t">
							<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">After signing in, you'll be able to:</p>
							<div className="flex justify-between items-center p-3 bg-white rounded-lg border dark:bg-gray-800">
								<div className="flex items-center space-x-3">
									<div className="p-2 bg-blue-100 rounded dark:bg-blue-900/30">
										<Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-900 dark:text-white">{context.key === "add-business" ? "Add Your Business" : "Claim Your Business"}</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">Complete your business profile</p>
									</div>
								</div>
								<ChevronRight className="w-4 h-4 text-gray-400" />
							</div>
						</div>
					)}

					{/* Quick Sign-in Encouragement */}
					<div className="pt-4 mt-4 border-t">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm font-medium text-gray-900 dark:text-white">Ready to get started?</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">Sign in takes less than 30 seconds</p>
							</div>
							<div className="text-right">
								<div className="text-lg font-bold text-blue-600 dark:text-blue-400">{context.icon}</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// Additional component for minimal context display
export function MinimalContextMessage({ context }) {
	if (!context || context.key === "default") {
		return null;
	}

	const IconComponent = CONTEXT_ICONS[context.category] || Shield;

	return (
		<div className="flex items-center p-4 space-x-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
			<IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
			<div>
				<p className="text-sm font-medium text-blue-900 dark:text-blue-100">{context.title}</p>
				<p className="text-xs text-blue-700 dark:text-blue-300">{context.message}</p>
			</div>
		</div>
	);
}
