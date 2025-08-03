/**
 * MarketplaceCard Component
 * Extracted from large integrations page following Next.js best practices
 * Reference: https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji
 */

"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Switch } from "@components/ui/switch";
import { ChevronDown, ChevronUp, Zap, Info, AlertCircle } from "lucide-react";
import { cn } from "@lib/utils";

export const MarketplaceCard = ({ feature, isEnabled, onToggle, onExpand, isExpanded, index, onLearnMore, onReportError }) => (
	<Card className={cn("transition-all duration-300 hover:shadow-lg", isEnabled && "ring-2 ring-primary ring-opacity-50", feature.popular && "border-amber-200 bg-amber-50/50")}>
		<CardHeader className="pb-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="text-2xl">{feature.icon}</div>
					<div>
						<CardTitle className="text-lg flex items-center gap-2">
							{feature.title}
							{feature.popular && (
								<Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
									Popular
								</Badge>
							)}
							{feature.isPaid && (
								<Badge variant="outline" className="text-xs">
									${feature.monthlyPrice}/mo
								</Badge>
							)}
						</CardTitle>
						<CardDescription className="text-sm text-gray-600 mt-1">{feature.description}</CardDescription>
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<Switch checked={isEnabled} onCheckedChange={() => onToggle(feature)} className="data-[state=checked]:bg-primary" />
				</div>
			</div>
		</CardHeader>

		{isExpanded && (
			<CardContent className="pt-0">
				<div className="space-y-4">
					{/* Feature Settings */}
					{feature.settings && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{Object.entries(feature.settings).map(([key, value]) => (
								<div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
									<span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</span>
									<span className="text-sm text-gray-600">{typeof value === "boolean" ? (value ? "Yes" : "No") : value}</span>
								</div>
							))}
						</div>
					)}

					{/* API Integration Info */}
					{feature.apiIntegration && (
						<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
							<div className="flex items-center space-x-2">
								<Zap className="w-4 h-4 text-blue-600" />
								<span className="text-sm font-medium">Integrates with {feature.apiIntegration}</span>
							</div>
						</div>
					)}

					{/* Pricing Info */}
					{feature.isPaid && (
						<div className="p-3 bg-green-50 rounded-lg">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Monthly Cost</span>
								<span className="text-lg font-bold text-green-600">
									${feature.monthlyPrice}
									{feature.transactionFee && <span className="text-xs font-normal text-gray-500 ml-1">+ {feature.transactionFee} per transaction</span>}
								</span>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex space-x-2 pt-2">
						<Button variant="outline" size="sm" onClick={() => onLearnMore(feature)} className="flex items-center space-x-1">
							<Info className="w-4 h-4" />
							<span>Learn More</span>
						</Button>
						<Button variant="ghost" size="sm" onClick={() => onReportError(feature)} className="flex items-center space-x-1 text-gray-500">
							<AlertCircle className="w-4 h-4" />
							<span>Report Issue</span>
						</Button>
					</div>
				</div>
			</CardContent>
		)}

		{/* Expand/Collapse Button */}
		<div className="px-6 pb-4">
			<Button variant="ghost" size="sm" onClick={() => onExpand(feature)} className="w-full flex items-center justify-center space-x-1 text-gray-500 hover:text-gray-700">
				{isExpanded ? (
					<>
						<ChevronUp className="w-4 h-4" />
						<span>Show Less</span>
					</>
				) : (
					<>
						<ChevronDown className="w-4 h-4" />
						<span>Show Details</span>
					</>
				)}
			</Button>
		</div>
	</Card>
);
