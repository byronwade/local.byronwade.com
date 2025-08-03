/**
 * ProjectRequirementsSection Component
 * Job posting requirements and professional qualifications form section
 * Extracted from large jobs create page for better organization
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { X, FileText } from "lucide-react";

export const ProjectRequirementsSection = ({ formData, onInputChange, addRequirement, removeRequirement, updateRequirement, errors = {} }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<FileText className="w-5 h-5" />
					<span>Project Requirements</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Project Size and Experience Level */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<Label>Project Size</Label>
						<Select value={formData.projectSize} onValueChange={(value) => onInputChange("projectSize", value)}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="small">Small (1-2 days)</SelectItem>
								<SelectItem value="medium">Medium (1-2 weeks)</SelectItem>
								<SelectItem value="large">Large (1+ months)</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Experience Level</Label>
						<Select value={formData.experienceLevel} onValueChange={(value) => onInputChange("experienceLevel", value)}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="any">Any Level</SelectItem>
								<SelectItem value="beginner">Entry Level</SelectItem>
								<SelectItem value="intermediate">Intermediate</SelectItem>
								<SelectItem value="expert">Expert Only</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Professional Requirements */}
				<div className="space-y-3">
					<Label>Professional Requirements</Label>
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<Checkbox id="licensed" checked={formData.licensedRequired} onCheckedChange={(checked) => onInputChange("licensedRequired", checked)} />
							<Label htmlFor="licensed" className="text-sm">
								Licensed professional required
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox id="insurance" checked={formData.insuranceRequired} onCheckedChange={(checked) => onInputChange("insuranceRequired", checked)} />
							<Label htmlFor="insurance" className="text-sm">
								Insurance required
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox id="background" checked={formData.backgroundCheckRequired} onCheckedChange={(checked) => onInputChange("backgroundCheckRequired", checked)} />
							<Label htmlFor="background" className="text-sm">
								Background check required
							</Label>
						</div>
					</div>
				</div>

				{/* Additional Requirements */}
				<div>
					<Label>Additional Requirements</Label>
					<div className="mt-2 space-y-2">
						{formData.requirements &&
							formData.requirements.map((req, index) => (
								<div key={index} className="flex items-center gap-2">
									<Input placeholder="Enter requirement..." value={req} onChange={(e) => updateRequirement(index, e.target.value)} className="flex-1" />
									<Button type="button" variant="outline" size="sm" onClick={() => removeRequirement(index)}>
										<X className="w-4 h-4" />
									</Button>
								</div>
							))}
						<Button type="button" variant="outline" onClick={addRequirement} className="w-full">
							Add Requirement
						</Button>
					</div>
					{errors.requirements && <p className="text-sm text-destructive mt-1">{errors.requirements}</p>}
				</div>
			</CardContent>
		</Card>
	);
};
