"use client";

import React from "react";
import { useStatsig, useStatsigEvent, useStatsigGate } from "@/context/StatsigContext";
import { BusinessAnalytics, EcommerceAnalytics, trackEvent } from "@/lib/utils/statsigAnalytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Statsig Integration Examples
 * Demonstrates how to use Statsig analytics, session replay, and feature gates
 */
const StatsigExamples = () => {
	const { isInitialized, performance, user, updateUser } = useStatsig();
	const logEvent = useStatsigEvent();
	const isNewFeatureEnabled = useStatsigGate("new_ui_design", false);
	const isExperimentActive = useStatsigGate("checkout_experiment", false);

	/**
	 * Basic event tracking examples
	 */
	const handleBasicEvents = () => {
		// Simple event
		logEvent("button_clicked", null, { component: "StatsigExamples" });

		// Event with value
		logEvent("add_to_cart", "SKU_12345", {
			price: "9.99",
			item_name: "diet_coke_48_pack",
			category: "beverages",
		});

		// Custom business event
		logEvent("feature_demo_viewed", null, {
			feature_name: "statsig_integration",
			user_type: user ? "authenticated" : "anonymous",
		});
	};

	/**
	 * Business analytics examples
	 */
	const handleBusinessAnalytics = () => {
		// Track business listing view
		BusinessAnalytics.trackBusinessView({
			id: "business-123",
			name: "Joe's Pizza",
			category: "restaurant",
			rating: 4.5,
			reviewCount: 125,
		});

		// Track business contact
		BusinessAnalytics.trackBusinessContact(
			{
				id: "business-123",
				name: "Joe's Pizza",
			},
			"call"
		);

		// Track review submission
		BusinessAnalytics.trackReviewSubmission(
			{
				id: "business-123",
				name: "Joe's Pizza",
			},
			5
		);
	};

	/**
	 * E-commerce analytics examples
	 */
	const handleEcommerceAnalytics = () => {
		// Track product view
		EcommerceAnalytics.trackProductView({
			id: "prod-456",
			name: "Premium Business Listing",
			category: "subscriptions",
			price: 29.99,
			currency: "USD",
		});

		// Track add to cart
		EcommerceAnalytics.trackAddToCart(
			{
				id: "prod-456",
				name: "Premium Business Listing",
				category: "subscriptions",
				price: 29.99,
				currency: "USD",
			},
			1
		);

		// Track purchase
		EcommerceAnalytics.trackPurchase({
			id: "txn-789",
			total: 29.99,
			currency: "USD",
			items: [
				{
					id: "prod-456",
					name: "Premium Business Listing",
					price: 29.99,
					quantity: 1,
				},
			],
		});
	};

	/**
	 * User identification example
	 */
	const handleUserIdentification = () => {
		const mockUser = {
			userID: `demo-user-${Date.now()}`,
			email: "demo@example.com",
			name: "Demo User",
			plan: "premium",
			created_at: new Date().toISOString(),
		};

		updateUser(mockUser);
		logEvent("user_identified", null, { source: "demo" });
	};

	/**
	 * Unified analytics example
	 */
	const handleUnifiedAnalytics = () => {
		// This will be tracked across all analytics providers
		trackEvent("unified_event_demo", {
			source: "example_component",
			feature: "statsig_integration",
			timestamp: Date.now(),
		});
	};

	return (
		<div className="space-y-6 p-6">
			<Card>
				<CardHeader>
					<CardTitle>Statsig Analytics Integration Examples</CardTitle>
					<CardDescription>Demonstrates Statsig analytics, session replay, and feature gates with performance monitoring</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Status Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="p-3 border rounded-lg">
							<p className="text-sm font-medium">Status</p>
							<p className={`text-lg ${isInitialized ? "text-green-500" : "text-red-500"}`}>{isInitialized ? "✅ Initialized" : "❌ Not Ready"}</p>
						</div>
						<div className="p-3 border rounded-lg">
							<p className="text-sm font-medium">Init Time</p>
							<p className="text-lg">{performance.initTime.toFixed(2)}ms</p>
						</div>
						<div className="p-3 border rounded-lg">
							<p className="text-sm font-medium">Events Logged</p>
							<p className="text-lg">{performance.eventCount}</p>
						</div>
						<div className="p-3 border rounded-lg">
							<p className="text-sm font-medium">Avg Event Time</p>
							<p className="text-lg">{performance.avgEventTime.toFixed(2)}ms</p>
						</div>
					</div>

					{/* Feature Gates */}
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Feature Gates</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-3 border rounded-lg">
								<p className="text-sm font-medium">New UI Design</p>
								<p className={`text-lg ${isNewFeatureEnabled ? "text-green-500" : "text-gray-500"}`}>{isNewFeatureEnabled ? "✅ Enabled" : "❌ Disabled"}</p>
							</div>
							<div className="p-3 border rounded-lg">
								<p className="text-sm font-medium">Checkout Experiment</p>
								<p className={`text-lg ${isExperimentActive ? "text-green-500" : "text-gray-500"}`}>{isExperimentActive ? "✅ Active" : "❌ Inactive"}</p>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Event Tracking Examples</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<Button onClick={handleBasicEvents} variant="outline" disabled={!isInitialized}>
								Track Basic Events
							</Button>
							<Button onClick={handleBusinessAnalytics} variant="outline" disabled={!isInitialized}>
								Business Analytics
							</Button>
							<Button onClick={handleEcommerceAnalytics} variant="outline" disabled={!isInitialized}>
								E-commerce Analytics
							</Button>
							<Button onClick={handleUserIdentification} variant="outline" disabled={!isInitialized}>
								Identify User
							</Button>
							<Button onClick={handleUnifiedAnalytics} variant="outline" disabled={!isInitialized}>
								Unified Analytics
							</Button>
						</div>
					</div>

					{/* User Information */}
					{user && (
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">Current User</h3>
							<div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
								<pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
							</div>
						</div>
					)}

					{/* Instructions */}
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Instructions</h3>
						<div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
							<ol className="list-decimal list-inside space-y-2 text-sm">
								<li>Click the buttons above to trigger different types of analytics events</li>
								<li>Check your browser's Network tab to see events being sent to Statsig</li>
								<li>Visit your Statsig dashboard to view the real-time event stream</li>
								<li>Feature gates will show different values based on your Statsig configuration</li>
								<li>Session replay will capture interactions when enabled</li>
							</ol>
						</div>
					</div>

					{/* Performance Notes */}
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Performance Features</h3>
						<div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
							<ul className="list-disc list-inside space-y-1 text-sm">
								<li>Event batching for optimal performance</li>
								<li>Automatic session replay sampling</li>
								<li>Performance budget monitoring</li>
								<li>Integration with existing analytics system</li>
								<li>Error tracking and recovery</li>
								<li>User privacy and consent management</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default StatsigExamples;
