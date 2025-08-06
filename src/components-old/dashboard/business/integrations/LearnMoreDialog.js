/**
 * LearnMoreDialog Component
 * Dialog for showing detailed feature information
 * Extracted from large integrations page
 */

"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { Info, ExternalLink, Zap, DollarSign, Star } from "lucide-react";

export const LearnMoreDialog = ({ open, onOpenChange, feature }) => {
	if (!feature) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-3">
						<span className="text-2xl">{feature.icon}</span>
						<div>
							<div className="flex items-center space-x-2">
								<span>{feature.title}</span>
								{feature.popular && <Badge className="bg-amber-100 text-amber-800">Popular</Badge>}
								{feature.isPaid && <Badge variant="outline">${feature.monthlyPrice}/mo</Badge>}
							</div>
						</div>
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Description */}
					<div>
						<h3 className="font-semibold mb-2">About This Feature</h3>
						<p className="text-gray-600">{feature.description}</p>
					</div>

					{/* Pricing Information */}
					{feature.isPaid && (
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<DollarSign className="w-5 h-5 text-green-600" />
										<span className="font-semibold">Pricing</span>
									</div>
									<div className="text-right">
										<div className="text-2xl font-bold text-green-600">${feature.monthlyPrice}/month</div>
										{feature.transactionFee && <div className="text-sm text-gray-500">+ {feature.transactionFee} per transaction</div>}
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Integration Information */}
					{feature.apiIntegration && (
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center space-x-2 mb-2">
									<Zap className="w-5 h-5 text-blue-600" />
									<span className="font-semibold">Integration</span>
								</div>
								<p className="text-gray-600">
									This feature integrates with <strong>{feature.apiIntegration}</strong> to provide seamless functionality and real-time data synchronization.
								</p>
							</CardContent>
						</Card>
					)}

					{/* Feature Settings */}
					{feature.settings && Object.keys(feature.settings).length > 0 && (
						<div>
							<h3 className="font-semibold mb-3">Customization Options</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{Object.entries(feature.settings).map(([key, value]) => (
									<div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</span>
										<span className="text-sm text-gray-600">{typeof value === "boolean" ? (value ? "Yes" : "No") : value}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Benefits */}
					<div>
						<h3 className="font-semibold mb-3">Key Benefits</h3>
						<div className="space-y-2">
							{getBenefits(feature).map((benefit, index) => (
								<div key={index} className="flex items-start space-x-2">
									<Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
									<span className="text-gray-600">{benefit}</span>
								</div>
							))}
						</div>
					</div>

					{/* Industry Specific */}
					{feature.industry && feature.industry !== "All Industries" && (
						<Card className="bg-blue-50 border-blue-200">
							<CardContent className="p-4">
								<div className="flex items-center space-x-2">
									<Info className="w-5 h-5 text-blue-600" />
									<span className="font-semibold text-blue-800">Industry Specific</span>
								</div>
								<p className="text-blue-700 mt-1">
									This feature is specifically designed for the <strong>{feature.industry}</strong> industry.
								</p>
							</CardContent>
						</Card>
					)}

					{/* Action Buttons */}
					<div className="flex justify-end space-x-2 pt-4">
						{feature.apiIntegration && (
							<Button variant="outline" className="flex items-center space-x-1">
								<ExternalLink className="w-4 h-4" />
								<span>Learn More About {feature.apiIntegration}</span>
							</Button>
						)}
						<Button onClick={() => onOpenChange(false)}>Close</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

// Helper function to generate benefits based on feature type
function getBenefits(feature) {
	const benefits = [];

	if (feature.category === "Tools") {
		benefits.push("Automate manual processes and save time");
		benefits.push("Improve workflow efficiency");
	}

	if (feature.category === "Marketing") {
		benefits.push("Increase customer engagement");
		benefits.push("Track marketing performance");
		benefits.push("Grow your customer base");
	}

	if (feature.category === "Analytics") {
		benefits.push("Make data-driven decisions");
		benefits.push("Track key performance metrics");
		benefits.push("Understand customer behavior");
	}

	if (feature.isPaid) {
		benefits.push("Priority customer support");
		benefits.push("Advanced features and customization");
	}

	if (feature.popular) {
		benefits.push("Trusted by thousands of businesses");
		benefits.push("Proven to increase conversions");
	}

	// Add category-specific benefits
	switch (feature.category) {
		case "Content":
			benefits.push("Showcase your work professionally");
			benefits.push("Keep content fresh and updated");
			break;
		case "Business":
			benefits.push("Provide essential business information");
			benefits.push("Build customer trust and credibility");
			break;
		case "Social":
			benefits.push("Build social proof");
			benefits.push("Encourage customer interaction");
			break;
	}

	return benefits.slice(0, 4); // Limit to 4 benefits
}
