/**
 * LoginForm Component Types
 * Type definitions following enterprise patterns
 */

export interface LoginFormProps {
	onSubmit?: (credentials: LoginCredentials) => void | Promise<void>;
	isLoading?: boolean;
	initialValues?: Partial<LoginCredentials>;
	redirectTo?: string;
	showSocialAuth?: boolean;
	className?: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
	rememberMe?: boolean;
}

export interface LoginFormState {
	isSubmitting: boolean;
	errors: Record<string, string>;
	touched: Record<string, boolean>;
}

export interface LoginFormValidation {
	email: (value: string) => string | undefined;
	password: (value: string) => string | undefined;
}
