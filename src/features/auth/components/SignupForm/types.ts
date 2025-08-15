/**
 * SignupForm Component Types
 * Type definitions following enterprise patterns
 */

export interface SignupFormProps {
	onSubmit?: (userData: SignupData) => void | Promise<void>;
	isLoading?: boolean;
	initialValues?: Partial<SignupData>;
	redirectTo?: string;
	showSocialAuth?: boolean;
	termsUrl?: string;
	privacyUrl?: string;
	className?: string;
}

export interface SignupData {
	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
	acceptTerms: boolean;
	marketingOptIn?: boolean;
}

export interface SignupFormState {
	isSubmitting: boolean;
	errors: Record<string, string>;
	touched: Record<string, boolean>;
	step: number;
}

export interface SignupFormValidation {
	email: (value: string) => string | undefined;
	password: (value: string) => string | undefined;
	confirmPassword: (value: string, password: string) => string | undefined;
	firstName: (value: string) => string | undefined;
	lastName: (value: string) => string | undefined;
}
