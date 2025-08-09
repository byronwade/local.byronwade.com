/**
 * BillingSection Component
 * Displays billing information for enabled paid features
 * Extracted from large integrations page
 */

"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { CreditCard, DollarSign } from "lucide-react";
import { Separator } from "@components/ui/separator";

export const BillingSection = ({ billing }) => {
	if (!billing || billing.totalMonthly === 0) {
		return (
			<Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
				<CardContent className="p-6">
					<div className="flex items-center space-x-3">
						<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
							<DollarSign className="w-6 h-6 text-green-600" />
						</div>
						<div>
							<h3 className="font-semibold text-green-800">No Monthly Charges</h3>
							<p className="text-green-700 text-sm">You're currently using free features only. Enable paid features to unlock more capabilities.</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<CreditCard className="w-5 h-5 text-blue-600" />
					<span>Monthly Billing Summary</span>
				</CardTitle>
				<CardDescription>Your current monthly charges for enabled paid features</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Feature List */}
				<div className="space-y-2">
					{billing.paidFeatures.map((feature, index) => (
						<div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
							<div>
								<span className="font-medium">{feature.name}</span>
								{feature.transactionFee && <span className="text-xs text-gray-500 ml-2">+ {feature.transactionFee} per transaction</span>}
							</div>
							<Badge variant="outline" className="bg-blue-50 text-blue-700">
								${feature.price}/mo
							</Badge>
						</div>
					))}
				</div>

				<Separator />

				{/* Total */}
				<div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-blue-200">
					<span className="text-lg font-semibold">Monthly Total</span>
					<span className="text-2xl font-bold text-blue-600">${billing.totalMonthly}/mo</span>
				</div>

				{/* Payment Method */}
				<div className="flex items-center justify-between text-sm text-gray-600">
					<span>Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
					<Button variant="outline" size="sm">
						<CreditCard className="w-4 h-4 mr-1" />
						Update Payment
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
