/**
 * Jobs Component Types - TypeScript Definitions
 * Comprehensive type definitions for job posting creation and management
 */

// =============================================================================
// JOB FORM TYPES
// =============================================================================

export type UrgencyLevel = "low" | "medium" | "high" | "urgent";
export type BudgetType = "estimate" | "hourly" | "range" | "negotiable";
export type JobStatus = "draft" | "active" | "paused" | "completed" | "cancelled";
export type ContactMethod = "email" | "phone" | "inApp";

export interface BudgetRange {
	min: string;
	max: string;
}

export interface ContactPreferences {
	email: boolean;
	phone: boolean;
	inApp: boolean;
}

export interface BoostOptions {
	enabled: boolean;
	duration: number;
	targetRadius: number;
}

export interface JobRequirement {
	id: string;
	title: string;
	description: string;
	priority: "required" | "preferred" | "optional";
}

export interface JobPhoto {
	id: string;
	url: string;
	alt: string;
	caption?: string;
	order: number;
}

export interface JobFormData {
	title: string;
	category: string;
	subCategory: string;
	description: string;
	location: string;
	urgency: UrgencyLevel;
	budgetType: BudgetType;
	budgetAmount: string;
	hourlyRate: string;
	budgetRange: BudgetRange;
	timeline: string;
	requirements: JobRequirement[];
	skills: string[];
	photos: JobPhoto[];
	contactPreferences: ContactPreferences;
	boostOptions: BoostOptions;
	paymentMethod: string | null;
}

// =============================================================================
// JOB FORM VALIDATION TYPES
// =============================================================================

export interface JobFieldError {
	field: keyof JobFormData;
	message: string;
}

export interface JobValidationResult {
	isValid: boolean;
	errors: JobFieldError[];
	warnings: string[];
}

export interface JobFormStep {
	id: number;
	title: string;
	description: string;
	fields: (keyof JobFormData)[];
	isRequired: boolean;
}

// =============================================================================
// JOB FORM HOOK TYPES
// =============================================================================

export interface UseJobFormOptions {
	initialData?: Partial<JobFormData>;
	onSubmitSuccess?: (jobId: string) => void;
	onSubmitError?: (error: Error) => void;
	autoSave?: boolean;
}

export interface UseJobFormReturn {
	// Form state
	formData: JobFormData;
	errors: JobFieldError[];
	currentStep: number;
	completedSteps: number[];
	isSubmitting: boolean;
	completionPercentage: number;

	// Form actions
	handleInputChange: (field: keyof JobFormData, value: any) => void;
	addRequirement: (requirement: Omit<JobRequirement, "id">) => void;
	removeRequirement: (requirementId: string) => void;
	updateRequirement: (requirementId: string, updates: Partial<JobRequirement>) => void;
	handlePhotoUpload: (files: FileList) => Promise<void>;
	removePhoto: (photoId: string) => void;
	reorderPhotos: (newOrder: JobPhoto[]) => void;
	validateForm: () => JobValidationResult;
	validateStep: (stepId: number) => boolean;
	isStepComplete: (stepId: number) => boolean;
	submitJob: () => Promise<void>;
	saveDraft: () => Promise<void>;

	// Navigation
	goToStep: (stepId: number) => void;
	nextStep: () => void;
	prevStep: () => void;

	// Utilities
	getFieldError: (field: keyof JobFormData) => string | null;
	isFieldValid: (field: keyof JobFormData) => boolean;
	getEstimatedViews: () => number;
	getEstimatedResponses: () => number;
}

// =============================================================================
// JOB COMPONENT TYPES
// =============================================================================

export interface JobCreatePageProps {
	initialData?: Partial<JobFormData>;
	onSuccess?: (jobId: string) => void;
	onCancel?: () => void;
}

// Section Component Props
export interface JobDetailsSectionProps {
	formData: JobFormData;
	errors: JobFieldError[];
	onUpdate: (field: keyof JobFormData, value: any) => void;
	onValidate: (field: keyof JobFormData) => void;
	availableCategories: JobCategory[];
}

export interface LocationSectionProps {
	formData: JobFormData;
	errors: JobFieldError[];
	onUpdate: (field: keyof JobFormData, value: any) => void;
	onValidate: (field: keyof JobFormData) => void;
}

export interface BudgetTimelineSectionProps {
	formData: JobFormData;
	errors: JobFieldError[];
	onUpdate: (field: keyof JobFormData, value: any) => void;
	onValidate: (field: keyof JobFormData) => void;
	estimatedViews: number;
	estimatedResponses: number;
}

export interface ProjectRequirementsSectionProps {
	formData: JobFormData;
	errors: JobFieldError[];
	onUpdate: (field: keyof JobFormData, value: any) => void;
	onAddRequirement: (requirement: Omit<JobRequirement, "id">) => void;
	onRemoveRequirement: (requirementId: string) => void;
	onUpdateRequirement: (requirementId: string, updates: Partial<JobRequirement>) => void;
}

export interface PhotoGallerySectionProps {
	formData: JobFormData;
	errors: JobFieldError[];
	onPhotoUpload: (files: FileList) => Promise<void>;
	onRemovePhoto: (photoId: string) => void;
	onReorderPhotos: (newOrder: JobPhoto[]) => void;
	maxPhotos?: number;
	allowedFormats?: string[];
}

// =============================================================================
// JOB CATEGORY TYPES
// =============================================================================

export interface JobSubCategory {
	id: string;
	name: string;
	description: string;
	popularSkills: string[];
	averageRate?: {
		min: number;
		max: number;
		currency: string;
	};
}

export interface JobCategory {
	id: string;
	name: string;
	description: string;
	icon: string;
	subCategories: JobSubCategory[];
	isPopular: boolean;
	averageJobsPerMonth: number;
}

// =============================================================================
// JOB SUBMISSION TYPES
// =============================================================================

export interface JobSubmissionRequest {
	formData: JobFormData;
	userId: string;
	isDraft: boolean;
}

export interface JobSubmissionResponse {
	success: boolean;
	jobId: string;
	message: string;
	estimatedLiveDate: string;
	moderationRequired: boolean;
	nextSteps: string[];
}

export interface JobValidationResponse {
	isValid: boolean;
	errors: JobFieldError[];
	warnings: string[];
	suggestions: string[];
	estimatedApprovalTime: string;
}

// =============================================================================
// JOB ANALYTICS TYPES
// =============================================================================

export interface JobEstimates {
	estimatedViews: number;
	estimatedResponses: number;
	estimatedHires: number;
	competitionLevel: "low" | "medium" | "high";
	marketDemand: "low" | "medium" | "high";
	averageResponseTime: string;
}

export interface JobMetrics {
	views: number;
	applications: number;
	responses: number;
	shortlisted: number;
	hired: number;
	budget: number;
	spent: number;
	averageRating: number;
	completionRate: number;
}

// =============================================================================
// JOB POSTING TYPES
// =============================================================================

export interface JobPosting {
	id: string;
	title: string;
	category: string;
	subCategory: string;
	description: string;
	location: string;
	urgency: UrgencyLevel;
	budget: {
		type: BudgetType;
		amount?: number;
		hourlyRate?: number;
		range?: BudgetRange;
	};
	timeline: string;
	requirements: JobRequirement[];
	skills: string[];
	photos: JobPhoto[];
	contactPreferences: ContactPreferences;
	boostOptions: BoostOptions;
	status: JobStatus;
	createdAt: string;
	updatedAt: string;
	expiresAt: string;
	userId: string;
	metrics: JobMetrics;
}
