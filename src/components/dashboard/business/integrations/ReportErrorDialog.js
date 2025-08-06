/**
 * ReportErrorDialog Component
 * Dialog for reporting issues with integrations
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
import { AlertCircle, Send } from "lucide-react";

export const ReportErrorDialog = ({ open, onOpenChange, feature }) => {
	const [reportForm, setReportForm] = useState({
		integrationName: "",
		issue: "",
		description: "",
		contactEmail: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	// Pre-fill integration name when feature is provided
	React.useEffect(() => {
		if (feature && open) {
			setReportForm((prev) => ({
				...prev,
				integrationName: feature.title,
			}));
		}
	}, [feature, open]);

	const handleInputChange = (field, value) => {
		setReportForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Here you would make an API call to submit the error report
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			toast({
				title: "Report Submitted",
				description: "Thank you for reporting this issue. Our team will investigate and get back to you soon.",
				duration: 5000,
			});

			// Reset form and close dialog
			setReportForm({
				integrationName: "",
				issue: "",
				description: "",
				contactEmail: "",
			});
			onOpenChange(false);
		} catch (error) {
			toast({
				title: "Submission Failed",
				description: "There was an error submitting your report. Please try again.",
				variant: "destructive",
				duration: 5000,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const isFormValid = reportForm.integrationName && reportForm.issue && reportForm.description && reportForm.contactEmail;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<AlertCircle className="w-5 h-5 text-orange-500" />
						<span>Report Issue</span>
					</DialogTitle>
					<DialogDescription>Having trouble with an integration? Let us know so we can help fix it.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Integration Name */}
					<div className="space-y-2">
						<Label htmlFor="integrationName">Integration Name *</Label>
						<Input id="integrationName" placeholder="Which integration is having issues?" value={reportForm.integrationName} onChange={(e) => handleInputChange("integrationName", e.target.value)} required />
					</div>

					{/* Issue Type */}
					<div className="space-y-2">
						<Label htmlFor="issue">Issue Type *</Label>
						<Select value={reportForm.issue} onValueChange={(value) => handleInputChange("issue", value)}>
							<SelectTrigger>
								<SelectValue placeholder="Select the type of issue" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="not-working">Feature not working</SelectItem>
								<SelectItem value="slow-performance">Slow performance</SelectItem>
								<SelectItem value="incorrect-data">Incorrect data</SelectItem>
								<SelectItem value="connection-error">Connection error</SelectItem>
								<SelectItem value="missing-feature">Missing feature/setting</SelectItem>
								<SelectItem value="billing-issue">Billing issue</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Description *</Label>
						<Textarea id="description" placeholder="Please describe the issue in detail. Include any error messages you see..." value={reportForm.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={4} required />
					</div>

					{/* Contact Email */}
					<div className="space-y-2">
						<Label htmlFor="contactEmail">Contact Email *</Label>
						<Input id="contactEmail" type="email" placeholder="your@email.com" value={reportForm.contactEmail} onChange={(e) => handleInputChange("contactEmail", e.target.value)} required />
						<p className="text-xs text-gray-500">We'll use this email to follow up on your report and provide updates.</p>
					</div>

					{/* Submit Button */}
					<div className="flex justify-end space-x-2 pt-4">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button type="submit" disabled={!isFormValid || isSubmitting} className="flex items-center space-x-1" variant="destructive">
							<Send className="w-4 h-4" />
							<span>{isSubmitting ? "Submitting..." : "Submit Report"}</span>
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
