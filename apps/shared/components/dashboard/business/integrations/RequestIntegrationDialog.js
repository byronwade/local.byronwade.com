/**
 * RequestIntegrationDialog Component
 * Dialog for requesting new integrations
 * Extracted from large integrations page
 */

"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { toast } from "@components/ui/use-toast";
import { Plus, Send } from "lucide-react";

export const RequestIntegrationDialog = ({ open, onOpenChange }) => {
	const [requestForm, setRequestForm] = useState({
		integrationName: "",
		description: "",
		category: "",
		useCase: "",
		contactEmail: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (field, value) => {
		setRequestForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Here you would make an API call to submit the request
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			toast({
				title: "Request Submitted",
				description: "Thank you for your integration request. We'll review it and get back to you soon.",
				duration: 5000,
			});

			// Reset form and close dialog
			setRequestForm({
				integrationName: "",
				description: "",
				category: "",
				useCase: "",
				contactEmail: "",
			});
			onOpenChange(false);
		} catch (error) {
			toast({
				title: "Submission Failed",
				description: "There was an error submitting your request. Please try again.",
				variant: "destructive",
				duration: 5000,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const isFormValid = requestForm.integrationName && requestForm.description && requestForm.contactEmail;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<Plus className="w-5 h-5" />
						<span>Request New Integration</span>
					</DialogTitle>
					<DialogDescription>Can't find the integration you need? Let us know and we'll consider adding it.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Integration Name */}
					<div className="space-y-2">
						<Label htmlFor="integrationName">Integration Name *</Label>
						<Input id="integrationName" placeholder="e.g., Slack, Zapier, QuickBooks" value={requestForm.integrationName} onChange={(e) => handleInputChange("integrationName", e.target.value)} required />
					</div>

					{/* Category */}
					<div className="space-y-2">
						<Label htmlFor="category">Category</Label>
						<Select value={requestForm.category} onValueChange={(value) => handleInputChange("category", value)}>
							<SelectTrigger>
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="communication">Communication</SelectItem>
								<SelectItem value="productivity">Productivity</SelectItem>
								<SelectItem value="marketing">Marketing</SelectItem>
								<SelectItem value="analytics">Analytics</SelectItem>
								<SelectItem value="finance">Finance</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Description *</Label>
						<Textarea id="description" placeholder="Describe what this integration would do and why it's useful..." value={requestForm.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={3} required />
					</div>

					{/* Use Case */}
					<div className="space-y-2">
						<Label htmlFor="useCase">Use Case</Label>
						<Textarea id="useCase" placeholder="How would you use this integration in your business?" value={requestForm.useCase} onChange={(e) => handleInputChange("useCase", e.target.value)} rows={2} />
					</div>

					{/* Contact Email */}
					<div className="space-y-2">
						<Label htmlFor="contactEmail">Contact Email *</Label>
						<Input id="contactEmail" type="email" placeholder="your@email.com" value={requestForm.contactEmail} onChange={(e) => handleInputChange("contactEmail", e.target.value)} required />
					</div>

					{/* Submit Button */}
					<div className="flex justify-end space-x-2 pt-4">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button type="submit" disabled={!isFormValid || isSubmitting} className="flex items-center space-x-1">
							<Send className="w-4 h-4" />
							<span>{isSubmitting ? "Submitting..." : "Submit Request"}</span>
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
