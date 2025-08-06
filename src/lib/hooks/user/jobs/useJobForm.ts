/**
 * useJobForm Hook - TypeScript Implementation
 * Custom hook for managing job posting form state and operations with full type safety
 * Extracted from large jobs create page for better organization
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@components/ui/use-toast";
import { validateCategorySelection } from "@lib/data/jobs/categories";
import type { JobFormData, JobFieldError, JobValidationResult, UseJobFormOptions, UseJobFormReturn, JobRequirement, JobPhoto, BudgetRange, ContactPreferences, BoostOptions, UrgencyLevel, BudgetType } from "@/types/jobs";

// Default form data structure with type safety
const defaultFormData: JobFormData = {
	title: "",
	category: "",
	subCategory: "",
	description: "",
	location: "",
	urgency: "medium",
	budgetType: "estimate",
	budgetAmount: "",
	hourlyRate: "",
	budgetRange: { min: "", max: "" },
	timeline: "",
	requirements: [],
	skills: [],
	photos: [],
	contactPreferences: {
		email: true,
		phone: false,
		inApp: true,
	},
	boostOptions: {
		enabled: false,
		duration: 7,
		targetRadius: 25,
	},
	paymentMethod: null,
};

// Inline step configuration to completely eliminate any TDZ possibility
const getFormSteps = () =>
	[
		{
			id: 1,
			title: "Job Details",
			description: "Basic information about your job",
			fields: ["title", "category", "subCategory", "description"] as (keyof JobFormData)[],
			isRequired: true,
		},
		{
			id: 2,
			title: "Location",
			description: "Where the work needs to be done",
			fields: ["location"] as (keyof JobFormData)[],
			isRequired: true,
		},
		{
			id: 3,
			title: "Budget & Timeline",
			description: "Budget and time requirements",
			fields: ["budgetType", "budgetAmount", "hourlyRate", "budgetRange", "timeline", "urgency"] as (keyof JobFormData)[],
			isRequired: true,
		},
		{
			id: 4,
			title: "Requirements",
			description: "Skills and specific requirements",
			fields: ["requirements", "skills"] as (keyof JobFormData)[],
			isRequired: false,
		},
		{
			id: 5,
			title: "Photos",
			description: "Visual examples or references",
			fields: ["photos"] as (keyof JobFormData)[],
			isRequired: false,
		},
	] as const;

/**
 * Custom hook for job form management with comprehensive type safety
 *
 * @param options - Hook configuration options
 * @returns Hook interface with form state and actions
 */
export const useJobForm = (options: UseJobFormOptions = {}): UseJobFormReturn => {
	const { initialData = {}, onSubmitSuccess, onSubmitError, autoSave = false } = options;
	const router = useRouter();

	const [formData, setFormData] = useState<JobFormData>({
		...defaultFormData,
		...initialData,
	});

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [errors, setErrors] = useState<JobFieldError[]>([]);
	const [currentStep, setCurrentStep] = useState<number>(1);

	// REMOVED: Hook initialization tracking was causing infinite re-renders
	// All console.log statements at the top level of hooks cause re-render loops

	/**
	 * Helper function to check step completion (moved before useMemo to avoid temporal dead zone)
	 * Enhanced with comprehensive safety checks to prevent any initialization errors
	 *
	 * @param stepId - Step ID to check
	 * @param currentFormData - Current form data
	 * @param steps - Form steps configuration
	 * @returns True if step is complete
	 */
	const checkStepCompletion = (stepId: number, currentFormData: JobFormData, steps: ReturnType<typeof getFormSteps>): boolean => {
		// Safety checks to prevent any temporal dead zone or undefined access issues
		if (!currentFormData || !steps || !Array.isArray(steps) || typeof stepId !== "number") {
			return false;
		}

		const step = steps.find((s) => s && s.id === stepId);
		if (!step || !step.fields || !Array.isArray(step.fields)) {
			return false;
		}

		// Check if all required fields in this step are filled
		return step.fields.every((field) => {
			if (!field || typeof field !== "string") return false;

			const value = currentFormData[field];
			if (Array.isArray(value)) {
				return !step.isRequired || value.length > 0;
			}
			if (typeof value === "object" && value !== null) {
				return true; // Objects with default values are considered complete
			}
			return !step.isRequired || (value && value !== "");
		});
	};

	/**
	 * Check if a step is complete
	 * Standalone function for external use
	 *
	 * @param stepId - Step ID to check
	 * @returns True if step is complete
	 */
	const isStepComplete = useCallback(
		(stepId: number): boolean => {
			return checkStepCompletion(stepId, formData, getFormSteps());
		},
		[formData] // FORM_STEPS is now a constant, removed from dependencies
	);

	/**
	 * Calculate completion percentage
	 *
	 * @returns Completion percentage (0-100)
	 */
	const completionPercentage = useMemo((): number => {
		const totalFields = Object.keys(defaultFormData).length;
		let filledFields = 0;

		Object.entries(formData).forEach(([key, value]) => {
			if (key === "requirements" && Array.isArray(value)) {
				filledFields += value.length > 0 ? 1 : 0;
			} else if (key === "skills" && Array.isArray(value)) {
				filledFields += value.length > 0 ? 1 : 0;
			} else if (key === "photos" && Array.isArray(value)) {
				filledFields += value.length > 0 ? 1 : 0;
			} else if (key === "contactPreferences" && typeof value === "object") {
				filledFields += 1; // Default values count as filled
			} else if (key === "boostOptions" && typeof value === "object") {
				filledFields += 1; // Default values count as filled
			} else if (value && value !== "") {
				filledFields += 1;
			}
		});

		return Math.round((filledFields / totalFields) * 100);
	}, [formData]);

	/**
	 * Get completed steps - TEMPORAL DEAD ZONE FIX
	 * Uses inline pure function to completely avoid any variable access issues
	 * This approach ensures zero dependencies on other hook variables
	 *
	 * @returns Array of completed step IDs
	 */
	const completedSteps = useMemo((): number[] => {
		// REMOVED: Debug logging was causing infinite re-renders

		// Safety check: ensure formData and steps are available
		const steps = getFormSteps();
		if (!formData || !steps || !Array.isArray(steps)) {
			return [];
		}

		try {
			// INLINE STEP COMPLETION CHECK - no external function dependencies
			const result = steps
				.filter((step) => {
					// Safety checks to prevent any temporal dead zone or undefined access issues
					if (!formData || !steps || !Array.isArray(steps) || typeof step?.id !== "number") {
						return false;
					}

					const currentStep = steps.find((s) => s && s.id === step.id);
					if (!currentStep || !currentStep.fields || !Array.isArray(currentStep.fields)) {
						return false;
					}

					// Check if all required fields in this step are filled
					return currentStep.fields.every((field) => {
						if (!field || typeof field !== "string") return false;

						const value = formData[field];
						if (Array.isArray(value)) {
							return !currentStep.isRequired || value.length > 0;
						}
						if (typeof value === "object" && value !== null) {
							return true; // Objects with default values are considered complete
						}
						return !currentStep.isRequired || (value && value !== "");
					});
				})
				.map((step) => step.id);

			return result;
		} catch (error) {
			return [];
		}
	}, [formData]); // FORM_STEPS is now a constant, removed from dependencies

	/**
	 * Handle input changes with type safety
	 *
	 * @param field - Field to update
	 * @param value - New value
	 */
	const handleInputChange = useCallback((field: keyof JobFormData, value: any): void => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Clear field-specific errors
		setErrors((prev) => prev.filter((error) => error.field !== field));
	}, []);

	/**
	 * Add a new requirement
	 *
	 * @param requirement - Requirement to add (without ID)
	 */
	const addRequirement = useCallback((requirement: Omit<JobRequirement, "id">): void => {
		const newRequirement: JobRequirement = {
			...requirement,
			id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		};

		setFormData((prev) => ({
			...prev,
			requirements: [...prev.requirements, newRequirement],
		}));
	}, []);

	/**
	 * Remove a requirement
	 *
	 * @param requirementId - ID of requirement to remove
	 */
	const removeRequirement = useCallback((requirementId: string): void => {
		setFormData((prev) => ({
			...prev,
			requirements: prev.requirements.filter((req) => req.id !== requirementId),
		}));
	}, []);

	/**
	 * Update an existing requirement
	 *
	 * @param requirementId - ID of requirement to update
	 * @param updates - Partial updates to apply
	 */
	const updateRequirement = useCallback((requirementId: string, updates: Partial<JobRequirement>): void => {
		setFormData((prev) => ({
			...prev,
			requirements: prev.requirements.map((req) => (req.id === requirementId ? { ...req, ...updates } : req)),
		}));
	}, []);

	/**
	 * Handle photo upload
	 *
	 * @param files - Files to upload
	 */
	const handlePhotoUpload = useCallback(
		async (files: FileList): Promise<void> => {
			const maxPhotos = 10;
			const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
			const maxFileSize = 5 * 1024 * 1024; // 5MB

			const currentPhotoCount = formData.photos.length;
			const newPhotosCount = Math.min(files.length, maxPhotos - currentPhotoCount);

			if (currentPhotoCount >= maxPhotos) {
				toast({
					title: "Photo limit reached",
					description: `You can only upload up to ${maxPhotos} photos.`,
					variant: "destructive",
				});
				return;
			}

			const newPhotos: JobPhoto[] = [];

			for (let i = 0; i < newPhotosCount; i++) {
				const file = files[i];

				// Validate file type
				if (!allowedFormats.includes(file.type)) {
					toast({
						title: "Invalid file format",
						description: `${file.name} is not a supported image format.`,
						variant: "destructive",
					});
					continue;
				}

				// Validate file size
				if (file.size > maxFileSize) {
					toast({
						title: "File too large",
						description: `${file.name} is larger than 5MB.`,
						variant: "destructive",
					});
					continue;
				}

				// Create object URL for preview
				const url = URL.createObjectURL(file);
				const photo: JobPhoto = {
					id: `photo_${Date.now()}_${i}`,
					url,
					alt: file.name,
					caption: "",
					order: currentPhotoCount + i,
				};

				newPhotos.push(photo);
			}

			if (newPhotos.length > 0) {
				setFormData((prev) => ({
					...prev,
					photos: [...prev.photos, ...newPhotos],
				}));

				toast({
					title: "Photos uploaded",
					description: `${newPhotos.length} photo(s) added successfully.`,
				});
			}
		},
		[formData.photos]
	);

	/**
	 * Remove a photo
	 *
	 * @param photoId - ID of photo to remove
	 */
	const removePhoto = useCallback((photoId: string): void => {
		setFormData((prev) => {
			const photoToRemove = prev.photos.find((photo) => photo.id === photoId);
			if (photoToRemove) {
				// Revoke object URL to prevent memory leaks
				URL.revokeObjectURL(photoToRemove.url);
			}

			return {
				...prev,
				photos: prev.photos.filter((photo) => photo.id !== photoId),
			};
		});
	}, []);

	/**
	 * Reorder photos
	 *
	 * @param newOrder - New photo order
	 */
	const reorderPhotos = useCallback((newOrder: JobPhoto[]): void => {
		const reorderedPhotos = newOrder.map((photo, index) => ({
			...photo,
			order: index,
		}));

		setFormData((prev) => ({
			...prev,
			photos: reorderedPhotos,
		}));
	}, []);

	/**
	 * Validate the entire form
	 *
	 * @returns Validation result
	 */
	const validateForm = useCallback((): JobValidationResult => {
		const fieldErrors: JobFieldError[] = [];
		const warnings: string[] = [];

		// Required field validations
		if (!formData.title.trim()) {
			fieldErrors.push({ field: "title", message: "Job title is required" });
		} else if (formData.title.length < 10) {
			fieldErrors.push({ field: "title", message: "Job title must be at least 10 characters" });
		} else if (formData.title.length > 100) {
			fieldErrors.push({ field: "title", message: "Job title must be less than 100 characters" });
		}

		if (!formData.category) {
			fieldErrors.push({ field: "category", message: "Category is required" });
		}

		if (!formData.description.trim()) {
			fieldErrors.push({ field: "description", message: "Job description is required" });
		} else if (formData.description.length < 50) {
			fieldErrors.push({ field: "description", message: "Description must be at least 50 characters" });
		}

		if (!formData.location.trim()) {
			fieldErrors.push({ field: "location", message: "Location is required" });
		}

		// Budget validations
		if (formData.budgetType === "estimate" && !formData.budgetAmount) {
			fieldErrors.push({ field: "budgetAmount", message: "Budget amount is required" });
		} else if (formData.budgetType === "hourly" && !formData.hourlyRate) {
			fieldErrors.push({ field: "hourlyRate", message: "Hourly rate is required" });
		} else if (formData.budgetType === "range") {
			if (!formData.budgetRange.min || !formData.budgetRange.max) {
				fieldErrors.push({ field: "budgetRange", message: "Budget range is required" });
			} else if (parseFloat(formData.budgetRange.min) >= parseFloat(formData.budgetRange.max)) {
				fieldErrors.push({ field: "budgetRange", message: "Maximum must be greater than minimum" });
			}
		}

		if (!formData.timeline.trim()) {
			fieldErrors.push({ field: "timeline", message: "Timeline is required" });
		}

		// Warnings for better job posting quality
		if (formData.requirements.length === 0) {
			warnings.push("Adding specific requirements helps attract better candidates");
		}

		if (formData.skills.length === 0) {
			warnings.push("Adding required skills helps candidates understand what's needed");
		}

		if (formData.photos.length === 0) {
			warnings.push("Adding photos helps candidates better understand the job");
		}

		setErrors(fieldErrors);

		return {
			isValid: fieldErrors.length === 0,
			errors: fieldErrors,
			warnings,
		};
	}, [formData]);

	/**
	 * Validate a specific step
	 *
	 * @param stepId - Step ID to validate
	 * @returns True if step is valid
	 */
	const validateStep = useCallback(
		(stepId: number): boolean => {
			const step = getFormSteps().find((s) => s.id === stepId);
			if (!step) return false;

			const validation = validateForm();
			const stepErrors = validation.errors.filter((error) => step.fields.includes(error.field));

			return stepErrors.length === 0;
		},
		[validateForm] // FORM_STEPS is now a constant, removed from dependencies
	);

	/**
	 * Submit the job posting
	 *
	 * @returns Promise that resolves when submission is complete
	 */
	const submitJob = useCallback(async (): Promise<void> => {
		setIsSubmitting(true);

		try {
			const validation = validateForm();
			if (!validation.isValid) {
				toast({
					title: "Validation Error",
					description: "Please fix all errors before submitting",
					variant: "destructive",
				});
				return;
			}

			// Simulate API call (replace with actual API)
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const jobId = `job_${Date.now()}`;

			toast({
				title: "Job Posted Successfully!",
				description: "Your job has been posted and is now live.",
			});

			if (onSubmitSuccess) {
				onSubmitSuccess(jobId);
			}

			// Reset form or navigate away
			router.push(`/dashboard/user/jobs/${jobId}`);
		} catch (error) {
			console.error("Job submission error:", error);
			toast({
				title: "Submission Failed",
				description: "Failed to post job. Please try again.",
				variant: "destructive",
			});

			if (onSubmitError) {
				onSubmitError(error as Error);
			}
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, validateForm, onSubmitSuccess, onSubmitError, router]);

	/**
	 * Save as draft
	 *
	 * @returns Promise that resolves when draft is saved
	 */
	const saveDraft = useCallback(async (): Promise<void> => {
		try {
			// Simulate API call to save draft
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast({
				title: "Draft Saved",
				description: "Your job draft has been saved.",
			});
		} catch (error) {
			console.error("Draft save error:", error);
			toast({
				title: "Save Failed",
				description: "Failed to save draft. Please try again.",
				variant: "destructive",
			});
		}
	}, [formData]);

	/**
	 * Navigate to a specific step
	 *
	 * @param stepId - Step ID to navigate to
	 */
	const goToStep = useCallback(
		(stepId: number): void => {
			if (stepId >= 1 && stepId <= getFormSteps().length) {
				setCurrentStep(stepId);
			}
		},
		[] // FORM_STEPS is now a constant, no dependencies needed
	);

	/**
	 * Navigate to next step
	 */
	const nextStep = useCallback((): void => {
		if (currentStep < getFormSteps().length) {
			setCurrentStep(currentStep + 1);
		}
	}, [currentStep]); // FORM_STEPS.length is constant, removed from dependencies

	/**
	 * Navigate to previous step
	 */
	const prevStep = useCallback((): void => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	}, [currentStep]);

	/**
	 * Get error for specific field
	 *
	 * @param field - Field to get error for
	 * @returns Error message or null
	 */
	const getFieldError = useCallback(
		(field: keyof JobFormData): string | null => {
			const error = errors.find((e) => e.field === field);
			return error ? error.message : null;
		},
		[errors]
	);

	/**
	 * Check if field is valid
	 *
	 * @param field - Field to check
	 * @returns True if field is valid
	 */
	const isFieldValid = useCallback(
		(field: keyof JobFormData): boolean => {
			return !errors.some((error) => error.field === field);
		},
		[errors]
	);

	/**
	 * Calculate estimated views based on job details
	 *
	 * @returns Estimated view count
	 */
	const getEstimatedViews = useCallback((): number => {
		let baseViews = 100;

		// Adjust based on category popularity
		if (formData.category) {
			baseViews *= 1.5;
		}

		// Adjust based on urgency
		const urgencyMultiplier =
			{
				low: 0.8,
				medium: 1.0,
				high: 1.3,
				urgent: 1.5,
			}[formData.urgency] || 1.0;

		baseViews *= urgencyMultiplier;

		// Adjust based on budget
		if (formData.budgetType === "estimate" && formData.budgetAmount) {
			const budget = parseFloat(formData.budgetAmount);
			if (budget > 1000) baseViews *= 1.4;
			else if (budget > 500) baseViews *= 1.2;
		}

		// Add photos bonus
		if (formData.photos.length > 0) {
			baseViews *= 1.2;
		}

		return Math.round(baseViews);
	}, [formData]);

	/**
	 * Calculate estimated responses based on job quality
	 *
	 * @returns Estimated response count
	 */
	const getEstimatedResponses = useCallback((): number => {
		const views = getEstimatedViews();
		let responseRate = 0.15; // Base 15% response rate

		// Calculate job completeness inline to avoid circular dependency
		const totalFields = Object.keys(defaultFormData).length;
		let filledFields = 0;
		Object.entries(formData).forEach(([key, value]) => {
			if (key === "requirements" && Array.isArray(value)) {
				filledFields += value.length > 0 ? 1 : 0;
			} else if (key === "skills" && Array.isArray(value)) {
				filledFields += value.length > 0 ? 1 : 0;
			} else if (key === "photos" && Array.isArray(value)) {
				filledFields += value.length > 0 ? 1 : 0;
			} else if (key === "contactPreferences" && typeof value === "object") {
				filledFields += 1;
			} else if (key === "boostOptions" && typeof value === "object") {
				filledFields += 1;
			} else if (value && value !== "") {
				filledFields += 1;
			}
		});
		const completeness = filledFields / totalFields;
		responseRate *= 0.5 + 0.5 * completeness;

		// Adjust based on requirements clarity
		if (formData.requirements.length > 0) {
			responseRate *= 1.1;
		}

		// Adjust based on budget attractiveness
		if (formData.budgetType !== "negotiable") {
			responseRate *= 1.1;
		}

		return Math.round(views * responseRate);
	}, [formData, getEstimatedViews]);

	return useMemo(
		() => ({
			// Form state
			formData,
			errors,
			currentStep,
			completedSteps,
			isSubmitting,
			completionPercentage,

			// Form actions
			handleInputChange,
			addRequirement,
			removeRequirement,
			updateRequirement,
			handlePhotoUpload,
			removePhoto,
			reorderPhotos,
			validateForm,
			validateStep,
			isStepComplete,
			submitJob,
			saveDraft,

			// Navigation
			goToStep,
			nextStep,
			prevStep,

			// Utilities
			getFieldError,
			isFieldValid,
			getEstimatedViews,
			getEstimatedResponses,
		}),
		[formData, errors, currentStep, completedSteps, isSubmitting, completionPercentage, handleInputChange, addRequirement, removeRequirement, updateRequirement, handlePhotoUpload, removePhoto, reorderPhotos, validateForm, validateStep, isStepComplete, submitJob, saveDraft, goToStep, nextStep, prevStep, getFieldError, isFieldValid, getEstimatedViews, getEstimatedResponses]
	);
};
