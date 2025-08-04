// API-specific type definitions

export interface ApiRequestConfig {
	url: string;
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	headers?: Record<string, string>;
	params?: Record<string, any>;
	data?: any;
	timeout?: number;
	retries?: number;
}

export interface ApiResponseMeta {
	page?: number;
	limit?: number;
	total?: number;
	pages?: number;
	has_next?: boolean;
	has_prev?: boolean;
}

export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, any>;
	field?: string;
	stack?: string;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	meta?: ApiResponseMeta;
	error?: ApiError;
	message?: string;
	timestamp: string;
}

// Business API Types
export interface BusinessSearchRequest {
	q?: string;
	location?: string;
	category?: string;
	lat?: number;
	lng?: number;
	radius?: number;
	price_level?: number[];
	rating?: number;
	verified_only?: boolean;
	open_now?: boolean;
	sort?: "relevance" | "rating" | "distance" | "name";
	limit?: number;
	offset?: number;
}

export interface BusinessCreateRequest {
	name: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	phone?: string;
	website?: string;
	email?: string;
	description?: string;
	categories: string[];
	hours?: BusinessHours;
}

export interface BusinessUpdateRequest extends Partial<BusinessCreateRequest> {
	id: string;
}

export interface BusinessClaimRequest {
	business_id: string;
	verification_method: "phone" | "email" | "document";
	verification_data: string;
	message?: string;
}

// User API Types
export interface UserCreateRequest {
	email: string;
	password: string;
	name: string;
	phone?: string;
}

export interface UserUpdateRequest {
	name?: string;
	phone?: string;
	avatar_url?: string;
	preferences?: Partial<UserPreferences>;
	profile?: Partial<UserProfile>;
}

export interface UserProfileRequest {
	first_name?: string;
	last_name?: string;
	bio?: string;
	location?: string;
	website?: string;
	social_links?: Partial<SocialLinks>;
	interests?: string[];
}

// Review API Types
export interface ReviewCreateRequest {
	business_id: string;
	rating: number;
	title?: string;
	text?: string;
	photos?: File[];
}

export interface ReviewUpdateRequest extends Partial<ReviewCreateRequest> {
	id: string;
}

export interface ReviewResponseRequest {
	review_id: string;
	text: string;
}

// Auth API Types
export interface LoginRequest {
	email: string;
	password: string;
	remember?: boolean;
}

export interface SignupRequest {
	email: string;
	password: string;
	name: string;
	phone?: string;
	terms_accepted: boolean;
}

export interface PasswordResetRequest {
	email: string;
}

export interface PasswordUpdateRequest {
	token: string;
	new_password: string;
}

export interface OTPVerificationRequest {
	email: string;
	code: string;
	type: "email_verification" | "password_reset" | "phone_verification";
}

// Geolocation API Types
export interface GeocodeRequest {
	address: string;
	bounds?: Bounds;
	region?: string;
}

export interface ReverseGeocodeRequest {
	lat: number;
	lng: number;
	types?: string[];
}

export interface PlaceDetailsRequest {
	place_id: string;
	fields?: string[];
}

export interface AutocompleteRequest {
	q: string;
	types?: ("business" | "location" | "address")[];
	location?: Coordinates;
	radius?: number;
	limit?: number;
}

// Upload API Types
export interface FileUploadRequest {
	file: File;
	type: "avatar" | "business_photo" | "review_photo" | "document";
	metadata?: Record<string, any>;
}

export interface FileUploadResponse {
	id: string;
	url: string;
	filename: string;
	size: number;
	mimetype: string;
	created_at: string;
}

// Analytics API Types
export interface AnalyticsEventRequest {
	name: string;
	properties?: Record<string, any>;
	user_id?: string;
	session_id?: string;
}

export interface PageViewRequest {
	path: string;
	title?: string;
	referrer?: string;
	user_agent?: string;
}

// Admin API Types
export interface AdminUserListRequest {
	page?: number;
	limit?: number;
	status?: "active" | "suspended" | "banned";
	role?: "user" | "business" | "admin";
	search?: string;
	sort?: "created_at" | "name" | "last_sign_in_at";
	order?: "asc" | "desc";
}

export interface AdminUserUpdateRequest {
	user_id: string;
	status?: "active" | "suspended" | "banned";
	role?: "user" | "business" | "admin";
	reason?: string;
}

export interface AdminBusinessListRequest {
	page?: number;
	limit?: number;
	status?: "pending" | "published" | "suspended" | "rejected";
	verified?: boolean;
	claimed?: boolean;
	category?: string;
	search?: string;
	sort?: "created_at" | "name" | "rating";
	order?: "asc" | "desc";
}

export interface AdminBusinessUpdateRequest {
	business_id: string;
	status?: "pending" | "published" | "suspended" | "rejected";
	verified?: boolean;
	featured?: boolean;
	reason?: string;
}

export interface AdminReviewListRequest {
	page?: number;
	limit?: number;
	status?: "pending" | "approved" | "rejected" | "flagged";
	business_id?: string;
	user_id?: string;
	sort?: "created_at" | "rating";
	order?: "asc" | "desc";
}

export interface AdminReviewUpdateRequest {
	review_id: string;
	status?: "pending" | "approved" | "rejected" | "flagged";
	reason?: string;
}

// Webhook Types
export interface WebhookEvent {
	id: string;
	type: string;
	data: Record<string, any>;
	created_at: string;
	delivery_attempts: number;
	delivered: boolean;
}

export interface WebhookSubscription {
	id: string;
	url: string;
	events: string[];
	active: boolean;
	secret?: string;
	created_at: string;
}

// Rate Limiting Types
export interface RateLimitInfo {
	limit: number;
	remaining: number;
	reset: number;
	retry_after?: number;
}

// Error Response Types
export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

export interface ApiErrorResponse {
	success: false;
	error: {
		code: string;
		message: string;
		details?: Record<string, any>;
		validation_errors?: ValidationError[];
	};
	timestamp: string;
}

// HTTP Status Codes
export enum HttpStatusCode {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	METHOD_NOT_ALLOWED = 405,
	CONFLICT = 409,
	UNPROCESSABLE_ENTITY = 422,
	TOO_MANY_REQUESTS = 429,
	INTERNAL_SERVER_ERROR = 500,
	BAD_GATEWAY = 502,
	SERVICE_UNAVAILABLE = 503,
}

// API Client Configuration
export interface ApiClientConfig {
	baseURL: string;
	timeout: number;
	retries: number;
	retryDelay: number;
	headers: Record<string, string>;
	auth?: {
		type: "bearer" | "api_key";
		token: string;
	};
	interceptors?: {
		request?: (config: ApiRequestConfig) => ApiRequestConfig;
		response?: (response: ApiResponse) => ApiResponse;
		error?: (error: ApiError) => Promise<ApiError>;
	};
}

export default {};
