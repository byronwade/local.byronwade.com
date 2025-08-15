"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@components/ui/card";
import { Droplets, Sprout, Sun, Clock, TrendingUp, Wrench, ShoppingCart, CreditCard, Truck, Activity, ClipboardList, Timer, DollarSign, BedDouble, Star, Percent } from "lucide-react";
import { IntegrationVisibility } from "@components/dashboard/business/integrations/IntegrationVisibility";

export function AgricultureWidget() {
	return (
		<IntegrationVisibility featureKey="agriculture_ops">
			<Card>
				<CardHeader>
					<CardTitle>Farm Ops</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<Metric icon={Droplets} label="Irrigation" value="1.3 in" />
						<Metric icon={Sun} label="Heat Units" value="18" />
						<Metric icon={Sprout} label="Growth Index" value="0.82" />
					</div>
				</CardContent>
			</Card>
		</IntegrationVisibility>
	);
}

export function AutomotiveWidget() {
	return (
		<IntegrationVisibility featureKey="automotive_ops">
			<Card>
				<CardHeader>
					<CardTitle>Service Bay Throughput</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<Metric icon={Clock} label="Bay Utilization" value="74%" />
						<Metric icon={TrendingUp} label="Upsell Rate" value="22%" />
						<Metric icon={Wrench} label="Comeback Rate" value="3.1%" />
					</div>
				</CardContent>
			</Card>
		</IntegrationVisibility>
	);
}

export function EcommerceWidget() {
	return (
		<IntegrationVisibility featureKey="ecommerce_ops">
			<Card>
				<CardHeader>
					<CardTitle>Ecommerce Performance</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<Metric icon={ShoppingCart} label="Orders" value="482" />
						<Metric icon={CreditCard} label="AOV" value="$64.80" />
						<Metric icon={TrendingUp} label="Conversion" value="2.3%" />
					</div>
				</CardContent>
			</Card>
		</IntegrationVisibility>
	);
}

export function LogisticsWidget() {
	return (
		<IntegrationVisibility featureKey="logistics_ops">
			<Card>
				<CardHeader>
					<CardTitle>Logistics Ops</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<Metric icon={Truck} label="On-time Delivery" value="96.2%" />
						<Metric icon={Clock} label="Avg Dwell" value="42m" />
						<Metric icon={Activity} label="Capacity Utilization" value="81%" />
					</div>
				</CardContent>
			</Card>
		</IntegrationVisibility>
	);
}

export function PropertyManagementWidget() {
	return (
		<IntegrationVisibility featureKey="property_mgmt_ops">
			<Card>
				<CardHeader>
					<CardTitle>Maintenance & Turnover</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<Metric icon={ClipboardList} label="Work Orders Aging" value="17 open" />
						<Metric icon={Timer} label="Turn Cycle" value="6.8 days" />
						<Metric icon={DollarSign} label="Delinquency" value="2.4%" />
					</div>
				</CardContent>
			</Card>
		</IntegrationVisibility>
	);
}

export function HospitalityWidget() {
	return (
		<IntegrationVisibility featureKey="hospitality_ops">
			<Card>
				<CardHeader>
					<CardTitle>Hospitality Dashboard</CardTitle>
					<CardDescription>Manage your hotel, restaurant, and guest services</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-4">
						<Metric icon={BedDouble} label="Occupancy" value="82%" color="text-blue-600" />
						<Metric icon={DollarSign} label="ADR" value="$156" color="text-green-600" />
						<Metric icon={Percent} label="RevPAR" value="$128" color="text-purple-600" />
						<Metric icon={Star} label="Satisfaction" value="4.7/5" color="text-yellow-600" />
					</div>
				</CardContent>
			</Card>
		</IntegrationVisibility>
	);
}

function Metric({ icon: Icon, label, value, color }) {
	return (
		<Card className="border">
			<CardHeader>
				<CardTitle className="flex gap-2 items-center">
					<Icon className={`w-4 h-4 ${color || ""}`} /> {label}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-3xl font-semibold">{value}</div>
			</CardContent>
		</Card>
	);
}
