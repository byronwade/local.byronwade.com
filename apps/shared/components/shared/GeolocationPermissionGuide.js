/**
 * Enhanced UX component for geolocation permission guidance
 * Provides step-by-step instructions when permissions are denied
 */

"use client";

import React from "react";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { MapPin, Settings, Shield, RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@components/ui/use-toast";

const GeolocationPermissionGuide = ({ isVisible, onRetry, onDismiss, showFallbackOptions = true }) => {
	const { toast } = useToast();

	if (!isVisible) return null;

	const getBrowserInstructions = () => {
		const userAgent = navigator.userAgent;

		if (userAgent.includes("Chrome")) {
			return {
				browser: "Chrome",
				steps: ["Click the location icon in the address bar", 'Select "Always allow" for location access', "Refresh the page to apply changes"],
			};
		} else if (userAgent.includes("Firefox")) {
			return {
				browser: "Firefox",
				steps: ["Click the shield icon in the address bar", 'Click "Allow Location Access"', "Refresh the page to apply changes"],
			};
		} else if (userAgent.includes("Safari")) {
			return {
				browser: "Safari",
				steps: ["Go to Safari > Preferences > Websites", 'Select "Location" from the sidebar', 'Set this website to "Allow"'],
			};
		} else if (userAgent.includes("Edge")) {
			return {
				browser: "Edge",
				steps: ["Click the location icon in the address bar", 'Select "Allow" for location access', "Refresh the page to apply changes"],
			};
		}

		return {
			browser: "Your Browser",
			steps: ["Look for a location icon in your address bar", 'Click it and select "Allow"', "Refresh the page if needed"],
		};
	};

	const handleRetry = async () => {
		if (onRetry) {
			try {
				await onRetry();
				toast({
					title: "Location access granted!",
					description: "We can now show businesses near you.",
					duration: 3000,
				});
			} catch (error) {
				toast({
					title: "Still can't access location",
					description: "Please check your browser settings.",
					variant: "destructive",
					duration: 5000,
				});
			}
		}
	};

	const { browser, steps } = getBrowserInstructions();

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<Card className="max-w-md w-full mx-auto shadow-2xl">
				<CardHeader className="text-center">
					<div className="mx-auto mb-2 p-3 bg-orange-100 rounded-full w-fit">
						<MapPin className="h-6 w-6 text-orange-600" />
					</div>
					<CardTitle className="text-xl">Location Access Needed</CardTitle>
					<CardDescription>To find businesses near you, we need access to your location</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<Alert>
						<Shield className="h-4 w-4" />
						<AlertDescription>Your privacy is important. We only use your location to show nearby businesses and never store or share this information.</AlertDescription>
					</Alert>

					<div className="space-y-3">
						<h4 className="font-medium flex items-center gap-2">
							<Settings className="h-4 w-4" />
							Enable Location in {browser}
						</h4>
						<div className="space-y-2">
							{steps.map((step, index) => (
								<div key={index} className="flex items-start gap-3">
									<Badge variant="outline" className="mt-1 flex-shrink-0">
										{index + 1}
									</Badge>
									<span className="text-sm text-muted-foreground">{step}</span>
								</div>
							))}
						</div>
					</div>

					{showFallbackOptions && (
						<div className="border-t pt-4 space-y-3">
							<h4 className="font-medium text-sm">Alternative Options</h4>
							<div className="grid grid-cols-1 gap-2">
								<Button
									variant="outline"
									size="sm"
									className="justify-start"
									onClick={() => {
										// Trigger manual location search
										const searchInput = document.querySelector('[placeholder*="location"]');
										if (searchInput) {
											searchInput.focus();
											onDismiss?.();
										}
									}}
								>
									<MapPin className="h-4 w-4 mr-2" />
									Enter location manually
								</Button>

								<Button
									variant="outline"
									size="sm"
									className="justify-start"
									onClick={() => {
										// Browse all businesses without location filter
										window.location.href = "/search";
										onDismiss?.();
									}}
								>
									<ExternalLink className="h-4 w-4 mr-2" />
									Browse all businesses
								</Button>
							</div>
						</div>
					)}

					<div className="flex gap-2 pt-4">
						<Button onClick={handleRetry} className="flex-1" size="sm">
							<RefreshCw className="h-4 w-4 mr-2" />
							Try Again
						</Button>
						<Button variant="outline" onClick={onDismiss} size="sm">
							Skip
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default GeolocationPermissionGuide;
