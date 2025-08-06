/**
 * JobCreatePage Component - TypeScript Implementation
 * Clean, focused job creation page using extracted sections and hooks with full type safety
 * Reduced from 938 lines to clean, modular implementation
 * Following Next.js best practices for large-scale applications
 */

"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Progress } from "@components/ui/progress";
import { ArrowLeft, Save, Send } from "lucide-react";
import { ALL_CATEGORIES } from "@components/site/categories/AllCategoriesPage";

// Import custom hooks and sections with type safety
import { useJobForm } from "@lib/hooks/user/jobs/useJobForm";
import { JobDetailsSection, LocationSection, BudgetTimelineSection, ProjectRequirementsSection, PhotoGallerySection } from "./sections";
import type { JobCreatePageProps, JobCategory } from "@types/jobs";

/**
 * Job Create Page Component
 *
 * @description Main component for creating new job postings with step-by-step form
 * @param props - Component props
 * @returns React functional component for job creation
 */
const JobCreatePage: React.FC<JobCreatePageProps> = ({ initialData, onSuccess, onCancel }) => {
	const { formData, errors, currentStep, completedSteps, isSubmitting, completionPercentage, isStepComplete, handleInputChange, addRequirement, removeRequirement, updateRequirement, handlePhotoUpload, removePhoto, reorderPhotos, validateStep, submitJob, saveDraft, goToStep, nextStep, prevStep, getFieldError, isFieldValid, getEstimatedViews, getEstimatedResponses } = useJobForm({
		initialData,
		onSubmitSuccess: (jobId) => {
			if (onSuccess) {
				onSuccess(jobId);
			}
		},
		onSubmitError: (error) => {
			console.error("Job creation error:", error);
		},
		autoSave: true,
	});

	// Form steps configuration
	const formSteps = [
		{
			id: 1,
			title: "Job Details",
			description: "Basic information about your job",
			icon: "Briefcase",
		},
		{
			id: 2,
			title: "Location",
			description: "Where the work needs to be done",
			icon: "MapPin",
		},
		{
			id: 3,
			title: "Budget & Timeline",
			description: "Budget and time requirements",
			icon: "Clock",
		},
		{
			id: 4,
			title: "Requirements",
			description: "Skills and specific requirements",
			icon: "CheckSquare",
		},
		{
			id: 5,
			title: "Photos",
			description: "Visual examples or references",
			icon: "Camera",
		},
	];

	/**
	 * Handle form cancellation
	 */
	const handleCancel = (): void => {
		if (completionPercentage > 0) {
			const confirmCancel = window.confirm("You have unsaved changes. Are you sure you want to cancel?");
			if (!confirmCancel) return;
		}

		if (onCancel) {
			onCancel();
		}
	};

	/**
	 * Handle form submission
	 */
	const handleSubmit = async (): Promise<void> => {
		await submitJob();
	};

	/**
	 * Handle draft save
	 */
	const handleSaveDraft = async (): Promise<void> => {
		await saveDraft();
	};

	/**
	 * Navigate to next step with validation
	 */
	const handleNextStep = (): void => {
		if (validateStep(currentStep)) {
			nextStep();
		}
	};

	/**
	 * Navigate to previous step
	 */
	const handlePrevStep = (): void => {
		prevStep();
	};

	/**
	 * Navigate to specific step
	 *
	 * @param stepId - Step ID to navigate to
	 */
	const handleStepClick = (stepId: number): void => {
		// Defensive check to ensure isStepComplete is available
		if (!isStepComplete) return;

		// Only allow navigation to completed steps or next step
		if (isStepComplete(stepId) || stepId <= currentStep + 1) {
			goToStep(stepId);
		}
	};

	/**
	 * Render current step content
	 *
	 * @returns JSX for current step
	 */
	const renderStepContent = (): JSX.Element => {
		const commonProps = {
			formData,
			errors,
			onUpdate: handleInputChange,
			onValidate: () => validateStep(currentStep),
		};

		switch (currentStep) {
			case 1:
				return <JobDetailsSection {...commonProps} availableCategories={ALL_CATEGORIES as JobCategory[]} />;
			case 2:
				return <LocationSection {...commonProps} />;
			case 3:
				return <BudgetTimelineSection {...commonProps} estimatedViews={getEstimatedViews()} estimatedResponses={getEstimatedResponses()} />;
			case 4:
				return <ProjectRequirementsSection {...commonProps} onAddRequirement={addRequirement} onRemoveRequirement={removeRequirement} onUpdateRequirement={updateRequirement} />;
			case 5:
				return <PhotoGallerySection {...commonProps} onPhotoUpload={handlePhotoUpload} onRemovePhoto={removePhoto} onReorderPhotos={reorderPhotos} maxPhotos={10} allowedFormats={["image/jpeg", "image/jpg", "image/png", "image/webp"]} />;
			default:
				return <div>Step not found</div>;
		}
	};

	/**
	 * Check if next button should be disabled
	 *
	 * @returns True if next button should be disabled
	 */
	const isNextDisabled = (): boolean => {
		return !validateStep(currentStep) || isSubmitting;
	};

	/**
	 * Check if submit button should be disabled
	 *
	 * @returns True if submit button should be disabled
	 */
	const isSubmitDisabled = (): boolean => {
		// Defensive check to ensure isStepComplete is available
		if (!isStepComplete) return true;

		const requiredSteps = [1, 2, 3]; // First 3 steps are required
		return !requiredSteps.every((stepId) => isStepComplete(stepId)) || isSubmitting;
	};

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="sm" asChild>
						<Link href="/dashboard/user/jobs">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Jobs
						</Link>
					</Button>
					<div>
						<h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
							<Send className="h-8 w-8 text-primary" />
							Post a Job
						</h1>
						<p className="text-muted-foreground">Create a job posting to find skilled professionals in your area</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
						<Save className="h-4 w-4 mr-2" />
						Save Draft
					</Button>
					<Button variant="outline" onClick={handleCancel}>
						Cancel
					</Button>
				</div>
			</div>

			{/* Progress Section */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<span className="text-sm font-medium">
						Step {currentStep} of {formSteps.length}
					</span>
					<span className="text-sm text-muted-foreground">{completionPercentage}% Complete</span>
				</div>
				<Progress value={completionPercentage} className="mb-4" />

				{/* Step indicators */}
				<div className="flex items-center justify-between">
					{formSteps.map((step) => {
						// Defensive check to ensure isStepComplete is available
						const isCompleted = isStepComplete ? isStepComplete(step.id) : false;
						const isCurrent = currentStep === step.id;
						const isAccessible = isCompleted || step.id <= currentStep + 1;

						return (
							<div key={step.id} className="flex flex-col items-center text-center flex-1">
								<button onClick={() => handleStepClick(step.id)} disabled={!isAccessible} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-2 transition-colors ${isCurrent ? "bg-primary text-primary-foreground" : isCompleted ? "bg-green-500 text-white hover:bg-green-600" : isAccessible ? "bg-muted text-muted-foreground hover:bg-muted/80" : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"}`}>
									{step.id}
								</button>
								<div className="text-xs">
									<div className="font-medium">{step.title}</div>
									<div className="text-muted-foreground hidden sm:block">{step.description}</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Job Preview Info */}
			{completionPercentage > 0 && (
				<div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Job Preview</h3>
							<p className="text-sm text-blue-700 dark:text-blue-300">
								{formData.title || "Untitled Job"} • {formData.location || "Location not set"}
							</p>
						</div>
						<div className="text-right text-sm text-blue-700 dark:text-blue-300">
							<div>Estimated Views: {getEstimatedViews()}</div>
							<div>Estimated Responses: {getEstimatedResponses()}</div>
						</div>
					</div>
				</div>
			)}

			{/* Current Step Content */}
			<div className="min-h-[500px] mb-8">{renderStepContent()}</div>

			{/* Navigation Footer */}
			<div className="flex items-center justify-between pt-6 border-t">
				<div className="flex items-center gap-2">
					{errors.length > 0 && (
						<div className="text-sm text-red-600 dark:text-red-400">
							{errors.length} error{errors.length !== 1 ? "s" : ""} to fix
						</div>
					)}
				</div>

				<div className="flex items-center gap-4">
					{currentStep > 1 && (
						<Button variant="outline" onClick={handlePrevStep} disabled={isSubmitting}>
							Previous
						</Button>
					)}

					{currentStep < formSteps.length ? (
						<Button onClick={handleNextStep} disabled={isNextDisabled()}>
							Next
						</Button>
					) : (
						<Button onClick={handleSubmit} disabled={isSubmitDisabled()}>
							{isSubmitting ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
									Posting Job...
								</>
							) : (
								<>
									<Send className="h-4 w-4 mr-2" />
									Post Job
								</>
							)}
						</Button>
					)}
				</div>
			</div>

			{/* Help Text */}
			<div className="mt-6 text-center text-sm text-muted-foreground">
				<p>
					Need help? Check our{" "}
					<Link href="/help/posting-jobs" className="text-primary hover:underline">
						job posting guide
					</Link>{" "}
					or{" "}
					<Link href="/support" className="text-primary hover:underline">
						contact support
					</Link>
					.
				</p>
			</div>
		</div>
	);
};

export default JobCreatePage;
