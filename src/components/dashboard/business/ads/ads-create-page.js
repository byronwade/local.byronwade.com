/**
 * Ads Create Page - Refactored
 * Reduced from 678 lines to clean, modular implementation
 * Uses extracted sections and custom hooks for enterprise-level architecture
 * Following Next.js best practices for large-scale applications
 */

"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Progress } from "@components/ui/progress";
import { Badge } from "@components/ui/badge";
import { ArrowLeft, Zap } from "lucide-react";
import { toast } from "@components/ui/use-toast";

// Import custom hooks and sections
import { useAdsForm } from "@lib/hooks/business/ads/use-ads-form";
import { CampaignDetailsSection, AdContentSection, TargetingSection, BudgetScheduleSection, ReviewSubmitSection } from "./sections";

// Step configuration
const STEPS = [
	{
		id: 1,
		title: "Campaign Details",
		description: "Set up your campaign basics",
		icon: "Target",
	},
	{
		id: 2,
		title: "Ad Content",
		description: "Create your ad creative",
		icon: "Edit",
	},
	{
		id: 3,
		title: "Targeting",
		description: "Define your audience",
		icon: "Users",
	},
	{
		id: 4,
		title: "Budget & Schedule",
		description: "Set budget and timing",
		icon: "Calendar",
	},
	{
		id: 5,
		title: "Review & Submit",
		description: "Review and launch campaign",
		icon: "CheckCircle",
	},
];

// Step progress component
const StepProgress = ({ currentStep, totalSteps, steps, onStepClick }) => (
	<div className="w-full mb-8">
		<div className="flex items-center justify-between mb-4">
			<h2 className="text-lg font-semibold">Create New Campaign</h2>
			<Badge variant="outline">
				Step {currentStep} of {totalSteps}
			</Badge>
		</div>

		<Progress value={(currentStep / totalSteps) * 100} className="mb-4" />

		<div className="hidden md:flex justify-between">
			{steps.map((step, index) => (
				<button key={step.id} onClick={() => onStepClick(step.id)} className={`text-center cursor-pointer transition-colors ${step.id === currentStep ? "text-primary" : step.id < currentStep ? "text-green-600" : "text-muted-foreground"}`}>
					<div className={`w-8 h-8 rounded-full border-2 mx-auto mb-2 flex items-center justify-center text-sm font-medium ${step.id === currentStep ? "border-primary bg-primary text-primary-foreground" : step.id < currentStep ? "border-green-600 bg-green-600 text-white" : "border-muted"}`}>{step.id}</div>
					<div className="text-xs font-medium">{step.title}</div>
				</button>
			))}
		</div>
	</div>
);

export default function AdsCreatePage({ businessType = "plumbing" }) {
	// Initialize the ads form hook
	const { formData, errors, currentStep, isSubmitting, completionPercentage, updateField, updateFields, validateField, validateForm, goToStep, nextStep, previousStep, submitForm, saveDraft, estimatedMetrics, isValid } = useAdsForm({
		businessType,
		onSubmit: async (data) => {
			// Handle campaign submission
			console.log("Submitting campaign:", data);

			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			toast({
				title: "Campaign Created!",
				description: "Your campaign has been created and is pending approval.",
			});
		},
		onSaveDraft: async (data) => {
			// Handle draft saving
			console.log("Saving draft:", data);

			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 500));
		},
		autoSave: true,
	});

	// Handle field validation
	const handleFieldValidation = (field, value) => {
		const error = validateField(field, value);
		if (error) {
			console.warn(`Validation error for ${field}:`, error);
		}
	};

	// Render current step content
	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<CampaignDetailsSection
						campaignData={{
							name: formData.name,
							type: formData.type,
							location: formData.location,
							radius: formData.radius,
						}}
						errors={errors}
						onUpdateField={updateField}
						onValidation={handleFieldValidation}
						showLocationMap={true}
						showHelpText={true}
					/>
				);

			case 2:
				return (
					<AdContentSection
						contentData={{
							headline: formData.headline,
							description: formData.description,
							cta: formData.cta,
							type: formData.type,
						}}
						errors={errors}
						onUpdateField={updateField}
						onValidation={handleFieldValidation}
						showPreview={true}
						showSuggestions={true}
						businessName="Your Business"
					/>
				);

			case 3:
				return (
					<TargetingSection
						targetingData={{
							keywords: formData.keywords,
							demographics: formData.demographics,
							interests: formData.interests,
							excludedKeywords: formData.excludedKeywords,
							location: formData.location,
						}}
						errors={errors}
						businessType={businessType}
						onUpdateField={updateField}
						onValidation={handleFieldValidation}
						showAudienceEstimation={true}
						showKeywordSuggestions={true}
					/>
				);

			case 4:
				return (
					<BudgetScheduleSection
						budgetData={{
							budget: formData.budget,
							duration: formData.duration,
						}}
						scheduleData={formData.schedule}
						errors={errors}
						businessType={businessType}
						keywords={formData.keywords}
						location={formData.location}
						onUpdateBudget={(field, value) => updateField(field, value)}
						onUpdateSchedule={(field, value) => updateField(`schedule.${field}`, value)}
						onValidation={handleFieldValidation}
						showPerformanceEstimation={true}
						showBudgetRecommendations={true}
					/>
				);

			case 5:
				return <ReviewSubmitSection campaignData={formData} validationErrors={errors} isSubmitting={isSubmitting} onEditSection={goToStep} onSubmit={submitForm} onSaveDraft={saveDraft} isEditMode={false} showValidationChecklist={true} />;

			default:
				return null;
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<Link href="/dashboard/business/ads">
					<Button variant="outline" size="sm">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Ads
					</Button>
				</Link>

				<div className="flex-1">
					<h1 className="text-2xl font-bold">Create New Campaign</h1>
					<p className="text-muted-foreground">Set up your advertising campaign in {STEPS.length} easy steps</p>
				</div>

				{/* Quick actions */}
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={saveDraft} disabled={isSubmitting}>
						Save Draft
					</Button>

					{currentStep < STEPS.length && (
						<Button onClick={nextStep} disabled={!isValid && currentStep !== 5} size="sm">
							<Zap className="w-4 h-4 mr-2" />
							Continue
						</Button>
					)}
				</div>
			</div>

			{/* Step Progress */}
			<StepProgress currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} onStepClick={goToStep} />

			{/* Completion indicator */}
			<div className="mb-6 p-4 bg-muted/30 rounded-lg">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium">Campaign Completion</p>
						<p className="text-xs text-muted-foreground">Complete all sections to launch your campaign</p>
					</div>
					<div className="text-right">
						<p className="text-lg font-bold">{completionPercentage}%</p>
						<Progress value={completionPercentage} className="w-24" />
					</div>
				</div>
			</div>

			{/* Step Content */}
			<div className="mb-8">{renderStepContent()}</div>

			{/* Navigation */}
			<div className="flex justify-between items-center pt-6 border-t">
				<div>
					{currentStep > 1 && (
						<Button variant="outline" onClick={previousStep} disabled={isSubmitting}>
							Previous
						</Button>
					)}
				</div>

				<div className="flex gap-2">
					{/* Estimated performance preview */}
					{estimatedMetrics && currentStep >= 3 && currentStep < 5 && (
						<div className="text-right mr-4">
							<p className="text-xs text-muted-foreground">Estimated Performance</p>
							<p className="text-sm font-medium">
								{estimatedMetrics.clicks} clicks • ${estimatedMetrics.cpc} CPC
							</p>
						</div>
					)}

					{currentStep < STEPS.length && (
						<Button onClick={nextStep} disabled={isSubmitting}>
							{currentStep === STEPS.length - 1 ? "Review Campaign" : "Continue"}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
