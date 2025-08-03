/**
 * Ads Component Types - TypeScript Definitions
 * Comprehensive type definitions for business ads creation and management
 */

import type { LucideIcon } from "lucide-react";

// =============================================================================
// ADS FORM TYPES
// =============================================================================

export type CampaignType = "search" | "display" | "video" | "shopping";
export type CallToActionType = "Learn More" | "Get Quote" | "Call Now" | "Visit Website" | "Download" | "Book Now";
export type TimeOfDay = "all" | "morning" | "afternoon" | "evening" | "night";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface AdSchedule {
	startDate: string;
	endDate: string;
	timeOfDay: TimeOfDay;
	daysOfWeek: DayOfWeek[];
}

export interface AdFormData {
	// Campaign details
	name: string;
	type: CampaignType;
	location: string;
	radius: string;

	// Ad content
	headline: string;
	description: string;
	cta: CallToActionType;

	// Targeting
	keywords: string;
	demographics: string[];
	interests: string[];
	excludedKeywords: string;

	// Budget and schedule
	budget: number;
	duration: number;
	schedule: AdSchedule;

	// Terms and conditions
	termsAccepted: boolean;
	billingAccepted: boolean;
}

export interface ValidationRule {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
	pattern?: RegExp;
	message: string;
}

export interface ValidationRules {
	name: ValidationRule;
	headline: ValidationRule;
	description: ValidationRule;
	keywords: ValidationRule;
	budget: ValidationRule;
	duration: ValidationRule;
	location: ValidationRule;
}

export interface FieldError {
	field: string;
	message: string;
}

export interface ValidationResult {
	isValid: boolean;
	errors: FieldError[];
}

// =============================================================================
// ADS FORM HOOK TYPES
// =============================================================================

export interface UseAdsFormOptions {
	isEditMode?: boolean;
	existingData?: Partial<AdFormData>;
	onSubmitSuccess?: (data: AdFormData) => void;
	onSubmitError?: (error: Error) => void;
}

export interface UseAdsFormReturn {
	// Form state
	formData: AdFormData;
	errors: FieldError[];
	isSubmitting: boolean;
	isValid: boolean;
	isDirty: boolean;

	// Form actions
	updateField: (field: keyof AdFormData, value: any) => void;
	updateSchedule: (scheduleData: Partial<AdSchedule>) => void;
	validateForm: () => ValidationResult;
	validateField: (field: keyof AdFormData) => FieldError | null;
	resetForm: () => void;
	submitForm: () => Promise<void>;

	// Utilities
	getFieldError: (field: keyof AdFormData) => string | null;
	isFieldValid: (field: keyof AdFormData) => boolean;
	getEstimatedReach: () => number;
	getEstimatedCost: () => number;
	calculatePerformanceMetrics: () => PerformanceEstimate;
}

// =============================================================================
// ADS COMPONENT TYPES
// =============================================================================

export interface StepConfig {
	id: number;
	title: string;
	description: string;
	icon: string;
}

export interface AdsCreatePageProps {
	initialData?: Partial<AdFormData>;
	onSuccess?: (data: AdFormData) => void;
	onCancel?: () => void;
}

export interface AdsEditPageProps {
	adId: string;
	initialData?: Partial<AdFormData>;
	onSuccess?: (data: AdFormData) => void;
	onCancel?: () => void;
}

// Section Component Props
export interface CampaignDetailsSectionProps {
	formData: AdFormData;
	errors: FieldError[];
	onUpdate: (field: keyof AdFormData, value: any) => void;
	onValidate: (field: keyof AdFormData) => void;
}

export interface AdContentSectionProps {
	formData: AdFormData;
	errors: FieldError[];
	onUpdate: (field: keyof AdFormData, value: any) => void;
	onValidate: (field: keyof AdFormData) => void;
	estimatedReach: number;
}

export interface TargetingSectionProps {
	formData: AdFormData;
	errors: FieldError[];
	onUpdate: (field: keyof AdFormData, value: any) => void;
	onValidate: (field: keyof AdFormData) => void;
	availableInterests: string[];
	availableDemographics: string[];
}

export interface BudgetScheduleSectionProps {
	formData: AdFormData;
	errors: FieldError[];
	onUpdate: (field: keyof AdFormData, value: any) => void;
	onUpdateSchedule: (scheduleData: Partial<AdSchedule>) => void;
	onValidate: (field: keyof AdFormData) => void;
	estimatedCost: number;
	performanceMetrics: PerformanceEstimate;
}

export interface ReviewSubmitSectionProps {
	formData: AdFormData;
	errors: FieldError[];
	isSubmitting: boolean;
	isValid: boolean;
	onSubmit: () => Promise<void>;
	estimatedReach: number;
	estimatedCost: number;
	performanceMetrics: PerformanceEstimate;
}

// =============================================================================
// PERFORMANCE AND ANALYTICS TYPES
// =============================================================================

export interface PerformanceEstimate {
	estimatedImpressions: number;
	estimatedClicks: number;
	estimatedClickThroughRate: number;
	estimatedCostPerClick: number;
	estimatedConversions: number;
	estimatedConversionRate: number;
	competitionLevel: "low" | "medium" | "high";
	qualityScore: number;
}

export interface TargetingData {
	interests: string[];
	demographics: string[];
	keywords: string[];
	excludedKeywords: string[];
	geoTargeting: {
		location: string;
		radius: number;
	};
}

export interface BudgetData {
	dailyBudget: number;
	totalBudget: number;
	duration: number;
	bidStrategy: "manual" | "automatic";
	maxCostPerClick?: number;
}

// =============================================================================
// API TYPES
// =============================================================================

export interface CreateAdRequest {
	formData: AdFormData;
	businessId: string;
	userId: string;
}

export interface UpdateAdRequest {
	adId: string;
	formData: Partial<AdFormData>;
	businessId: string;
	userId: string;
}

export interface AdSubmissionResponse {
	success: boolean;
	adId: string;
	message: string;
	estimatedApprovalTime: string;
	nextSteps: string[];
}

export interface AdValidationResponse {
	isValid: boolean;
	errors: FieldError[];
	warnings: string[];
	suggestions: string[];
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface AdPreview {
	headline: string;
	description: string;
	displayUrl: string;
	callToAction: CallToActionType;
	location: string;
}

export interface AdMetrics {
	impressions: number;
	clicks: number;
	conversions: number;
	spend: number;
	clickThroughRate: number;
	conversionRate: number;
	costPerClick: number;
	costPerConversion: number;
}

export type AdStatus = "draft" | "pending_review" | "approved" | "active" | "paused" | "rejected" | "completed";

export interface AdCampaign {
	id: string;
	name: string;
	type: CampaignType;
	status: AdStatus;
	formData: AdFormData;
	metrics: AdMetrics;
	createdAt: string;
	updatedAt: string;
	startDate: string;
	endDate: string;
}
