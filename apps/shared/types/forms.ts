// Form-specific type definitions

import { ReactNode } from "react";

// ============================================================================
// FORM VALIDATION TYPES
// ============================================================================

export interface ValidationRule {
	required?: boolean | string;
	min?: number | { value: number; message: string };
	max?: number | { value: number; message: string };
	minLength?: number | { value: number; message: string };
	maxLength?: number | { value: number; message: string };
	pattern?: RegExp | { value: RegExp; message: string };
	email?: boolean | string;
	url?: boolean | string;
	phone?: boolean | string;
	custom?: (value: any, formData?: any) => string | boolean | Promise<string | boolean>;
}

export type ValidationSchema<T = Record<string, any>> = {
	[K in keyof T]?: ValidationRule;
};

export interface ValidationError {
	field: string;
	message: string;
	type: string;
}

export interface FormValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
}

// ============================================================================
// FORM FIELD TYPES
// ============================================================================

export type FieldType = "text" | "email" | "password" | "number" | "tel" | "url" | "textarea" | "select" | "multiselect" | "checkbox" | "radio" | "date" | "time" | "datetime" | "file" | "image" | "range" | "color" | "search" | "autocomplete" | "rich-text" | "rating" | "location" | "business-hours" | "phone" | "address";

export interface BaseFieldConfig {
	name: string;
	label?: string;
	type: FieldType;
	placeholder?: string;
	helperText?: string;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	hidden?: boolean;
	validation?: ValidationRule;
	className?: string;
	"data-testid"?: string;
}

export interface TextFieldConfig extends BaseFieldConfig {
	type: "text" | "email" | "password" | "tel" | "url" | "search";
	mask?: string;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	autoComplete?: string;
	spellCheck?: boolean;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
	type: "textarea";
	rows?: number;
	cols?: number;
	resize?: "none" | "both" | "horizontal" | "vertical";
	maxLength?: number;
	showCharacterCount?: boolean;
}

export interface NumberFieldConfig extends BaseFieldConfig {
	type: "number" | "range";
	min?: number;
	max?: number;
	step?: number;
	format?: "integer" | "decimal" | "currency" | "percentage";
	currency?: string;
	precision?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
	type: "select" | "multiselect";
	options: SelectOption[];
	isSearchable?: boolean;
	isClearable?: boolean;
	isMulti?: boolean;
	loadOptions?: (inputValue: string) => Promise<SelectOption[]>;
	formatOptionLabel?: (option: SelectOption) => ReactNode;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
	type: "checkbox";
	options?: CheckboxOption[];
	inline?: boolean;
	indeterminate?: boolean;
}

export interface RadioFieldConfig extends BaseFieldConfig {
	type: "radio";
	options: RadioOption[];
	inline?: boolean;
}

export interface DateFieldConfig extends BaseFieldConfig {
	type: "date" | "time" | "datetime";
	format?: string;
	minDate?: Date | string;
	maxDate?: Date | string;
	showTimeSelect?: boolean;
	timeFormat?: string;
	dateFormat?: string;
	locale?: string;
}

export interface FileFieldConfig extends BaseFieldConfig {
	type: "file" | "image";
	accept?: string;
	multiple?: boolean;
	maxSize?: number;
	maxFiles?: number;
	allowedTypes?: string[];
	preview?: boolean;
	crop?: boolean;
	uploadUrl?: string;
}

export interface AutocompleteFieldConfig extends BaseFieldConfig {
	type: "autocomplete";
	options?: SelectOption[];
	loadOptions?: (inputValue: string) => Promise<SelectOption[]>;
	minInputLength?: number;
	debounceTimeout?: number;
	showSuggestions?: boolean;
}

export interface RatingFieldConfig extends BaseFieldConfig {
	type: "rating";
	max?: number;
	allowHalf?: boolean;
	size?: "sm" | "md" | "lg";
	icon?: ReactNode;
	emptyIcon?: ReactNode;
	readOnly?: boolean;
}

export interface LocationFieldConfig extends BaseFieldConfig {
	type: "location";
	showMap?: boolean;
	mapHeight?: number;
	addressFields?: ("street" | "city" | "state" | "zip" | "country")[];
	geocoding?: boolean;
	bounds?: Bounds;
}

export interface BusinessHoursFieldConfig extends BaseFieldConfig {
	type: "business-hours";
	format?: "12h" | "24h";
	minuteStep?: number;
	allowClosedDays?: boolean;
	days?: string[];
}

export interface PhoneFieldConfig extends BaseFieldConfig {
	type: "phone";
	country?: string;
	countries?: string[];
	format?: "national" | "international";
	validatePhoneNumber?: boolean;
}

export interface AddressFieldConfig extends BaseFieldConfig {
	type: "address";
	fields?: ("street" | "city" | "state" | "zip" | "country")[];
	geocoding?: boolean;
	countries?: string[];
	states?: string[];
}

export type FieldConfig = TextFieldConfig | TextareaFieldConfig | NumberFieldConfig | SelectFieldConfig | CheckboxFieldConfig | RadioFieldConfig | DateFieldConfig | FileFieldConfig | AutocompleteFieldConfig | RatingFieldConfig | LocationFieldConfig | BusinessHoursFieldConfig | PhoneFieldConfig | AddressFieldConfig;

// ============================================================================
// FORM OPTION TYPES
// ============================================================================

export interface SelectOption {
	value: string | number;
	label: string;
	disabled?: boolean;
	group?: string;
	icon?: ReactNode;
	description?: string;
	meta?: any;
}

export interface CheckboxOption {
	value: string | number;
	label: string;
	disabled?: boolean;
	description?: string;
}

export interface RadioOption {
	value: string | number;
	label: string;
	disabled?: boolean;
	description?: string;
}

// ============================================================================
// FORM SCHEMA TYPES
// ============================================================================

export interface FormSection {
	id: string;
	title?: string;
	description?: string;
	fields: FieldConfig[];
	collapsible?: boolean;
	defaultCollapsed?: boolean;
	conditional?: {
		field: string;
		value: any;
		operator?: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
	};
}

export interface FormSchema {
	id: string;
	title?: string;
	description?: string;
	sections?: FormSection[];
	fields?: FieldConfig[];
	validation?: ValidationSchema;
	submitButton?: {
		text?: string;
		variant?: "primary" | "secondary";
		disabled?: boolean;
		loading?: boolean;
	};
	resetButton?: {
		text?: string;
		variant?: "outline" | "ghost";
	};
	layout?: "vertical" | "horizontal" | "grid";
	columns?: number;
	spacing?: "sm" | "md" | "lg";
}

// ============================================================================
// FORM STATE TYPES
// ============================================================================

export interface FormState<T = any> {
	values: T;
	errors: Record<string, string>;
	touched: Record<string, boolean>;
	isValid: boolean;
	isSubmitting: boolean;
	isValidating: boolean;
	isDirty: boolean;
	submitCount: number;
}

export interface FormActions<T = any> {
	setValue: (name: keyof T, value: any) => void;
	setValues: (values: Partial<T>) => void;
	setError: (name: keyof T, error: string) => void;
	setErrors: (errors: Record<string, string>) => void;
	clearError: (name: keyof T) => void;
	clearErrors: () => void;
	setTouched: (name: keyof T, touched?: boolean) => void;
	setTouchedFields: (touched: Record<string, boolean>) => void;
	validate: (field?: keyof T) => Promise<boolean>;
	reset: (values?: Partial<T>) => void;
	submit: () => Promise<void>;
}

export interface FormMethods<T = any> extends FormState<T>, FormActions<T> {
	register: (name: keyof T) => FieldRegistration;
	watch: (name?: keyof T) => any;
	getValues: () => T;
	trigger: (name?: keyof T) => Promise<boolean>;
	handleSubmit: (onSubmit: (data: T) => void | Promise<void>) => (event?: React.FormEvent) => Promise<void>;
}

export interface FieldRegistration {
	name: string;
	value: any;
	onChange: (event: React.ChangeEvent<any>) => void;
	onBlur: (event: React.FocusEvent<any>) => void;
	ref: React.Ref<any>;
}

// ============================================================================
// FORM SUBMISSION TYPES
// ============================================================================

export interface FormSubmissionOptions {
	validateOnSubmit?: boolean;
	resetOnSubmit?: boolean;
	focusOnError?: boolean;
	scrollToError?: boolean;
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
	transform?: (data: any) => any;
}

export interface FormSubmissionResult<T = any> {
	success: boolean;
	data?: T;
	errors?: Record<string, string>;
	message?: string;
}

// ============================================================================
// BUSINESS-SPECIFIC FORM TYPES
// ============================================================================

export interface BusinessFormData {
	// Basic Information
	name: string;
	description?: string;
	website?: string;
	email?: string;
	phone?: string;

	// Address
	address: string;
	city: string;
	state: string;
	zip: string;
	country: string;

	// Categories
	categories: string[];

	// Business Hours
	hours: BusinessHours;

	// Photos
	photos: FileList | File[];
	logo?: File;

	// Additional Info
	priceLevel?: number;
	amenities?: string[];
	paymentMethods?: string[];
	serviceArea?: ServiceArea;

	// Social Media
	socialLinks?: SocialLinks;
}

export interface UserProfileFormData {
	// Personal Information
	firstName?: string;
	lastName?: string;
	email: string;
	phone?: string;

	// Profile
	bio?: string;
	avatar?: File;
	location?: string;
	website?: string;

	// Preferences
	notifications: boolean;
	newsletter: boolean;
	language: string;
	timezone: string;
	theme: "light" | "dark" | "system";

	// Social Links
	socialLinks?: SocialLinks;
	interests?: string[];
}

export interface ReviewFormData {
	businessId: string;
	rating: number;
	title?: string;
	text: string;
	photos?: FileList | File[];
	recommend: boolean;
}

export interface ContactFormData {
	name: string;
	email: string;
	phone?: string;
	subject: string;
	message: string;
	category: "general" | "support" | "business" | "partnership" | "press";
	businessId?: string;
}

export interface SearchFormData {
	query?: string;
	location?: string;
	category?: string;
	radius?: number;
	priceLevel?: number[];
	rating?: number;
	openNow?: boolean;
	verified?: boolean;
	features?: string[];
}

// ============================================================================
// FORM WIZARD TYPES
// ============================================================================

export interface WizardStep {
	id: string;
	title: string;
	description?: string;
	fields: FieldConfig[];
	validation?: ValidationSchema;
	optional?: boolean;
	completed?: boolean;
	component?: React.ComponentType<any>;
}

export interface FormWizardState {
	currentStep: number;
	steps: WizardStep[];
	data: Record<string, any>;
	isValid: boolean;
	canProceed: boolean;
	canGoBack: boolean;
}

export interface FormWizardActions {
	nextStep: () => void;
	prevStep: () => void;
	goToStep: (stepIndex: number) => void;
	updateStepData: (stepId: string, data: any) => void;
	validateStep: (stepId: string) => Promise<boolean>;
	submit: () => Promise<void>;
	reset: () => void;
}

export interface FormWizardMethods extends FormWizardState, FormWizardActions {}

// ============================================================================
// FORM BUILDER TYPES
// ============================================================================

export interface FormBuilderConfig {
	allowedFields: FieldType[];
	maxFields?: number;
	customFields?: CustomFieldDefinition[];
	validation?: boolean;
	preview?: boolean;
	export?: ("json" | "schema" | "react")[];
}

export interface CustomFieldDefinition {
	type: string;
	label: string;
	icon?: ReactNode;
	config: BaseFieldConfig;
	component: React.ComponentType<any>;
}

export interface FormTemplate {
	id: string;
	name: string;
	description?: string;
	category: string;
	schema: FormSchema;
	preview?: string;
	tags?: string[];
}

export default {};
