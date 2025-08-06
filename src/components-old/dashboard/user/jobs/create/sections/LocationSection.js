/**
 * LocationSection Component
 * Job posting location form section
 * Extracted from large jobs create page for better organization
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { MapPin } from "lucide-react";

export const LocationSection = ({ formData, onInputChange, errors = {} }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<MapPin className="w-5 h-5" />
					<span>Location</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* City, State */}
				<div>
					<Label htmlFor="location">City, State *</Label>
					<Input id="location" placeholder="e.g., Sacramento, CA" value={formData.location} onChange={(e) => onInputChange("location", e.target.value)} className={errors.location ? "border-destructive" : ""} required />
					{errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
				</div>

				{/* Specific Address */}
				<div>
					<Label htmlFor="address">Specific Address (Optional)</Label>
					<Input id="address" placeholder="Street address for on-site services" value={formData.address || ""} onChange={(e) => onInputChange("address", e.target.value)} />
					<p className="mt-1 text-xs text-muted-foreground">Only shared with selected professionals. Required for on-site services.</p>
				</div>

				{/* Service Location Type */}
				<div>
					<Label>Service Location</Label>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
						<div className={`p-3 rounded-lg border cursor-pointer transition-colors ${formData.locationType === "onsite" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`} onClick={() => onInputChange("locationType", "onsite")}>
							<div className="text-sm font-medium">On-site</div>
							<div className="text-xs text-muted-foreground">At my location</div>
						</div>

						<div className={`p-3 rounded-lg border cursor-pointer transition-colors ${formData.locationType === "remote" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`} onClick={() => onInputChange("locationType", "remote")}>
							<div className="text-sm font-medium">Remote</div>
							<div className="text-xs text-muted-foreground">Online/virtual</div>
						</div>

						<div className={`p-3 rounded-lg border cursor-pointer transition-colors ${formData.locationType === "flexible" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`} onClick={() => onInputChange("locationType", "flexible")}>
							<div className="text-sm font-medium">Flexible</div>
							<div className="text-xs text-muted-foreground">Either works</div>
						</div>
					</div>
				</div>

				{/* Travel Radius (for on-site services) */}
				{(formData.locationType === "onsite" || formData.locationType === "flexible") && (
					<div>
						<Label htmlFor="travelRadius">Maximum Travel Distance (Optional)</Label>
						<select id="travelRadius" value={formData.travelRadius || "25"} onChange={(e) => onInputChange("travelRadius", e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
							<option value="5">Within 5 miles</option>
							<option value="10">Within 10 miles</option>
							<option value="25">Within 25 miles</option>
							<option value="50">Within 50 miles</option>
							<option value="100">Within 100 miles</option>
							<option value="unlimited">No limit</option>
						</select>
						<p className="mt-1 text-xs text-muted-foreground">How far are you willing for professionals to travel to your location?</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
