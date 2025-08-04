/**
 * Ads Form Management Hook - TypeScript Implementation
 * Extracted from ads create/edit pages (678/804 lines)
 * Comprehensive form state management with validation and persistence
 * Enterprise-level hook following React best practices with full type safety
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { withErrorHandling, showErrorToast, showSuccessToast } from "@lib/utils/errorHandler";
import { debounce } from "@lib/utils/performanceUtils";
import type { AdFormData, AdSchedule, ValidationRules, FieldError, ValidationResult, UseAdsFormOptions, UseAdsFormReturn, PerformanceEstimate } from "@/types/ads";

/**
 * Get initial form state with type safety
 *
 * @param isEditMode - Whether the form is in edit mode
 * @param existingData - Existing data to populate the form
 * @returns Initial form state
 */
const getInitialFormState = (existingData: Partial<AdFormData> = {}): AdFormData => ({
	// Campaign details
	name: existingData.name || "",
	type: existingData.type || "search",
	location: existingData.location || "",
	radius: existingData.radius || "10",

	// Ad content
	headline: existingData.headline || "",
	description: existingData.description || "",
	cta: existingData.cta || "Learn More",

	// Targeting
	keywords: existingData.keywords || "",
	demographics: existingData.demographics || [],
	interests: existingData.interests || [],
	excludedKeywords: existingData.excludedKeywords || "",

	// Budget and schedule
	budget: existingData.budget || 50,
	duration: existingData.duration || 30,
	schedule: {
		startDate: existingData.schedule?.startDate || new Date().toISOString().split("T")[0],
		endDate: existingData.schedule?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
		timeOfDay: existingData.schedule?.timeOfDay || "all",
		daysOfWeek: existingData.schedule?.daysOfWeek || ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
	},

	// Terms and conditions
	termsAccepted: existingData.termsAccepted || false,
	billingAccepted: existingData.billingAccepted || false,
});

// Validation rules with complete type safety
const validationRules: ValidationRules = {
	name: {
		required: true,
		minLength: 3,
		maxLength: 50,
		message: "Campaign name must be between 3 and 50 characters",
	},
	headline: {
		required: true,
		minLength: 10,
		maxLength: 100,
		message: "Headline must be between 10 and 100 characters",
	},
	description: {
		required: true,
		minLength: 20,
		maxLength: 300,
		message: "Description must be between 20 and 300 characters",
	},
	keywords: {
		required: true,
		minLength: 3,
		message: "At least one keyword is required",
	},
	budget: {
		required: true,
		min: 10,
		max: 10000,
		message: "Budget must be between $10 and $10,000",
	},
	duration: {
		required: true,
		min: 1,
		max: 365,
		message: "Duration must be between 1 and 365 days",
	},
	location: {
		required: true,
		minLength: 2,
		message: "Location is required",
	},
};

/**
 * Custom hook for ads form management with comprehensive type safety
 *
 * @param options - Hook configuration options
 * @returns Hook interface with form state and actions
 */
export const useAdsForm = (options: UseAdsFormOptions = {}): UseAdsFormReturn => {
	const { isEditMode = false, existingData = {}, onSubmitSuccess, onSubmitError } = options;

	// Form state
	const [formData, setFormData] = useState<AdFormData>(() => getInitialFormState(isEditMode, existingData));
	const [errors, setErrors] = useState<FieldError[]>([]);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isDirty, setIsDirty] = useState<boolean>(false);

	// Performance tracking
	const submitAttempts = useRef<number>(0);
	const lastValidation = useRef<number>(0);

	/**
	 * Validate a single field
	 *
	 * @param field - Field to validate
	 * @param value - Value to validate (optional, uses current form data if not provided)
	 * @returns Field error or null if valid
	 */
	const validateField = useCallback(
		(field: keyof AdFormData, value?: any): FieldError | null => {
			const fieldValue = value !== undefined ? value : formData[field];
			const rule = validationRules[field as keyof ValidationRules];

			if (!rule) return null;

			// Required validation
			if (rule.required && (!fieldValue || (typeof fieldValue === "string" && fieldValue.trim() === ""))) {
				return { field, message: rule.message };
			}

			// String validations
			if (typeof fieldValue === "string") {
				if (rule.minLength && fieldValue.length < rule.minLength) {
					return { field, message: rule.message };
				}
				if (rule.maxLength && fieldValue.length > rule.maxLength) {
					return { field, message: rule.message };
				}
				if (rule.pattern && !rule.pattern.test(fieldValue)) {
					return { field, message: rule.message };
				}
			}

			// Number validations
			if (typeof fieldValue === "number") {
				if (rule.min !== undefined && fieldValue < rule.min) {
					return { field, message: rule.message };
				}
				if (rule.max !== undefined && fieldValue > rule.max) {
					return { field, message: rule.message };
				}
			}

			return null;
		},
		[formData]
	);

	/**
	 * Validate entire form
	 *
	 * @returns Validation result with errors
	 */
	const validateForm = useCallback((): ValidationResult => {
		const fieldErrors: FieldError[] = [];

		// Validate all fields with rules
		Object.keys(validationRules).forEach((field) => {
			const error = validateField(field as keyof AdFormData);
			if (error) {
				fieldErrors.push(error);
			}
		});

		// Additional business logic validations
		if (formData.schedule.startDate && formData.schedule.endDate) {
			const startDate = new Date(formData.schedule.startDate);
			const endDate = new Date(formData.schedule.endDate);

			if (startDate >= endDate) {
				fieldErrors.push({
					field: "schedule",
					message: "End date must be after start date",
				});
			}
		}

		// Terms validation
		if (!formData.termsAccepted) {
			fieldErrors.push({
				field: "termsAccepted",
				message: "You must accept the terms and conditions",
			});
		}

		if (!formData.billingAccepted) {
			fieldErrors.push({
				field: "billingAccepted",
				message: "You must accept the billing terms",
			});
		}

		setErrors(fieldErrors);
		lastValidation.current = Date.now();

		return {
			isValid: fieldErrors.length === 0,
			errors: fieldErrors,
		};
	}, [formData, validateField]);

	/**
	 * Update a form field with type safety
	 *
	 * @param field - Field to update
	 * @param value - New value
	 */
	const updateField = useCallback((field: keyof AdFormData, value: any): void => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		setIsDirty(true);

		// Clear field-specific errors
		setErrors((prev) => prev.filter((error) => error.field !== field));
	}, []);

	/**
	 * Update schedule data
	 *
	 * @param scheduleData - Partial schedule data to update
	 */
	const updateSchedule = useCallback((scheduleData: Partial<AdSchedule>): void => {
		setFormData((prev) => ({
			...prev,
			schedule: {
				...prev.schedule,
				...scheduleData,
			},
		}));
		setIsDirty(true);
	}, []);

	/**
	 * Reset form to initial state
	 */
	const resetForm = useCallback((): void => {
		setFormData(getInitialFormState(isEditMode, existingData));
		setErrors([]);
		setIsDirty(false);
		setIsSubmitting(false);
	}, [isEditMode, existingData]);

	/**
	 * Submit form with error handling
	 *
	 * @returns Promise that resolves when submission is complete
	 */
	const submitForm = useCallback(async (): Promise<void> => {
		setIsSubmitting(true);
		submitAttempts.current += 1;

		try {
			const validation = validateForm();

			if (!validation.isValid) {
				showErrorToast("Please fix all errors before submitting");
				return;
			}

			await withErrorHandling(async () => {
				// Simulate API call (replace with actual API)
				await new Promise((resolve) => setTimeout(resolve, 2000));

				showSuccessToast("Ad campaign created successfully!");

				if (onSubmitSuccess) {
					onSubmitSuccess(formData);
				}

				// Reset form after successful submission
				if (!isEditMode) {
					resetForm();
				}
			}, "useAdsForm")();
		} catch (error) {
			console.error("Form submission error:", error);
			showErrorToast("Failed to submit ad campaign. Please try again.");

			if (onSubmitError) {
				onSubmitError(error as Error);
			}
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, validateForm, onSubmitSuccess, onSubmitError, isEditMode, resetForm]);

	/**
	 * Get error for specific field
	 *
	 * @param field - Field to get error for
	 * @returns Error message or null
	 */
	const getFieldError = useCallback(
		(field: keyof AdFormData): string | null => {
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
		(field: keyof AdFormData): boolean => {
			return !errors.some((error) => error.field === field);
		},
		[errors]
	);

	/**
	 * Calculate estimated reach based on targeting
	 *
	 * @returns Estimated reach number
	 */
	const getEstimatedReach = useCallback((): number => {
		const baseReach = 10000;
		let multiplier = 1;

		// Adjust based on location radius
		const radius = parseInt(formData.radius);
		if (radius <= 5) multiplier *= 0.3;
		else if (radius <= 15) multiplier *= 0.7;
		else if (radius <= 30) multiplier *= 1.2;
		else multiplier *= 2;

		// Adjust based on keywords specificity
		const keywordCount = formData.keywords.split(",").filter((k) => k.trim()).length;
		if (keywordCount > 10) multiplier *= 0.8;
		else if (keywordCount < 3) multiplier *= 1.5;

		// Adjust based on demographics
		if (formData.demographics.length > 3) multiplier *= 0.7;
		if (formData.interests.length > 5) multiplier *= 0.6;

		return Math.round(baseReach * multiplier);
	}, [formData.radius, formData.keywords, formData.demographics, formData.interests]);

	/**
	 * Calculate estimated cost
	 *
	 * @returns Estimated total cost
	 */
	const getEstimatedCost = useCallback((): number => {
		return formData.budget * formData.duration;
	}, [formData.budget, formData.duration]);

	/**
	 * Calculate comprehensive performance metrics
	 *
	 * @returns Performance estimates
	 */
	const calculatePerformanceMetrics = useCallback((): PerformanceEstimate => {
		const reach = getEstimatedReach();
		const totalCost = getEstimatedCost();

		// Base CTR varies by campaign type
		const baseCTR = {
			search: 0.035,
			display: 0.008,
			video: 0.012,
			shopping: 0.025,
		}[formData.type];

		const estimatedImpressions = reach;
		const estimatedClicks = Math.round(estimatedImpressions * baseCTR);
		const estimatedCostPerClick = estimatedClicks > 0 ? totalCost / estimatedClicks : 0;
		const estimatedConversions = Math.round(estimatedClicks * 0.02); // 2% conversion rate
		const estimatedConversionRate = estimatedClicks > 0 ? estimatedConversions / estimatedClicks : 0;

		// Determine competition level based on keywords
		const keywordCount = formData.keywords.split(",").filter((k) => k.trim()).length;
		const competitionLevel: "low" | "medium" | "high" = keywordCount > 10 ? "high" : keywordCount > 5 ? "medium" : "low";

		// Quality score based on ad completeness
		let qualityScore = 0;
		if (formData.headline.length >= 20) qualityScore += 2;
		if (formData.description.length >= 50) qualityScore += 2;
		if (formData.keywords.split(",").length >= 5) qualityScore += 2;
		if (formData.location) qualityScore += 2;
		if (formData.demographics.length > 0) qualityScore += 1;
		if (formData.interests.length > 0) qualityScore += 1;

		return {
			estimatedImpressions,
			estimatedClicks,
			estimatedClickThroughRate: baseCTR,
			estimatedCostPerClick,
			estimatedConversions,
			estimatedConversionRate,
			competitionLevel,
			qualityScore,
		};
	}, [formData, getEstimatedReach, getEstimatedCost]);

	// Debounced validation on form changes
	const debouncedValidation = useCallback(
		debounce(() => {
			if (isDirty) {
				validateForm();
			}
		}, 500),
		[isDirty, validateForm]
	);

	// Effect for auto-validation
	useEffect(() => {
		if (isDirty) {
			debouncedValidation();
		}
	}, [formData, isDirty, debouncedValidation]);

	// Computed properties
	const isValid = errors.length === 0;

	return {
		// Form state
		formData,
		errors,
		isSubmitting,
		isValid,
		isDirty,

		// Form actions
		updateField,
		updateSchedule,
		validateForm,
		validateField,
		resetForm,
		submitForm,

		// Utilities
		getFieldError,
		isFieldValid,
		getEstimatedReach,
		getEstimatedCost,
		calculatePerformanceMetrics,
	};
};
