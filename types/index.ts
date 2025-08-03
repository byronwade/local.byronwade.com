// Global Type Definitions
// Centralized type definitions for the entire application

// ============================================================================
// CORE ENTITY TYPES
// ============================================================================

export interface User {
	id: string;
	email: string;
	name?: string;
	avatar_url?: string;
	phone?: string;
	created_at: string;
	updated_at: string;
	last_sign_in_at?: string;
	email_verified?: boolean;
	phone_verified?: boolean;
	status: "active" | "suspended" | "banned";
	role: "user" | "business" | "admin";
	preferences: UserPreferences;
	profile: UserProfile;
}

export interface UserPreferences {
	notifications: boolean;
	newsletter: boolean;
	language: string;
	timezone: string;
	theme: "light" | "dark" | "system";
	email_frequency: "immediate" | "daily" | "weekly" | "never";
}

export interface UserProfile {
	first_name?: string;
	last_name?: string;
	bio?: string;
	location?: string;
	website?: string;
	social_links?: SocialLinks;
	interests?: string[];
}

export interface SocialLinks {
	facebook?: string;
	twitter?: string;
	instagram?: string;
	linkedin?: string;
	youtube?: string;
}

export interface Business {
	id: string;
	name: string;
	slug: string;
	description?: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	country: string;
	latitude?: number;
	longitude?: number;
	phone?: string;
	website?: string;
	email?: string;
	rating: number;
	review_count: number;
	price_level: 1 | 2 | 3 | 4;
	status: "pending" | "published" | "suspended" | "rejected";
	verified: boolean;
	featured: boolean;
	claimed: boolean;
	owner_id?: string;
	created_at: string;
	updated_at: string;
	categories: BusinessCategory[];
	hours: BusinessHours;
	photos: BusinessPhoto[];
	amenities: string[];
	payment_methods: string[];
	service_area?: ServiceArea;
}

export interface BusinessCategory {
	id: string;
	name: string;
	slug: string;
	description?: string;
	icon?: string;
	parent_id?: string;
	level: number;
	sort_order: number;
	business_count: number;
}

export interface BusinessHours {
	monday?: DayHours;
	tuesday?: DayHours;
	wednesday?: DayHours;
	thursday?: DayHours;
	friday?: DayHours;
	saturday?: DayHours;
	sunday?: DayHours;
	special_hours?: SpecialHours[];
}

export interface DayHours {
	open: string; // HH:mm format
	close: string; // HH:mm format
	is_closed: boolean;
}

export interface SpecialHours {
	date: string; // YYYY-MM-DD format
	open?: string;
	close?: string;
	is_closed: boolean;
	note?: string;
}

export interface BusinessPhoto {
	id: string;
	business_id: string;
	url: string;
	alt_text?: string;
	caption?: string;
	is_primary: boolean;
	sort_order: number;
	uploaded_by: string;
	created_at: string;
}

export interface ServiceArea {
	type: "radius" | "cities" | "states" | "custom";
	radius_km?: number;
	center_lat?: number;
	center_lng?: number;
	cities?: string[];
	states?: string[];
	custom_polygon?: Array<[number, number]>;
}

export interface Review {
	id: string;
	business_id: string;
	user_id: string;
	rating: number;
	title?: string;
	text?: string;
	photos?: ReviewPhoto[];
	helpful_count: number;
	status: "pending" | "approved" | "rejected" | "flagged";
	is_verified: boolean;
	created_at: string;
	updated_at: string;
	user: Pick<User, "id" | "name" | "avatar_url">;
	business: Pick<Business, "id" | "name">;
	response?: BusinessResponse;
}

export interface ReviewPhoto {
	id: string;
	review_id: string;
	url: string;
	alt_text?: string;
	sort_order: number;
	created_at: string;
}

export interface BusinessResponse {
	id: string;
	review_id: string;
	business_id: string;
	text: string;
	created_at: string;
	updated_at: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: ApiError;
	message?: string;
	timestamp: string;
}

export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, any>;
	stack?: string;
}

export interface PaginatedResponse<T = any> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	pages: number;
	has_next: boolean;
	has_prev: boolean;
}

export interface SearchParams {
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

export interface SearchResults {
	businesses: Business[];
	total: number;
	filters: SearchFilters;
	suggestions: SearchSuggestion[];
	has_more: boolean;
}

export interface SearchFilters {
	categories: Array<{
		id: string;
		name: string;
		count: number;
	}>;
	locations: Array<{
		name: string;
		count: number;
	}>;
	price_levels: Array<{
		level: number;
		count: number;
	}>;
	ratings: Array<{
		rating: number;
		count: number;
	}>;
}

export interface SearchSuggestion {
	type: "business" | "category" | "location";
	text: string;
	subtitle?: string;
	data?: Record<string, any>;
}

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export interface ComponentProps {
	className?: string;
	children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
	size?: "sm" | "default" | "lg" | "icon";
	disabled?: boolean;
	loading?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	type?: "button" | "submit" | "reset";
}

export interface InputProps extends ComponentProps {
	type?: string;
	placeholder?: string;
	value?: string;
	defaultValue?: string;
	disabled?: boolean;
	required?: boolean;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export interface ModalProps extends ComponentProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	size?: "sm" | "md" | "lg" | "xl" | "full";
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormState<T = any> {
	data: T;
	errors: Record<string, string>;
	touched: Record<string, boolean>;
	isSubmitting: boolean;
	isValid: boolean;
}

export interface ValidationRule {
	required?: boolean;
	min?: number;
	max?: number;
	pattern?: RegExp;
	custom?: (value: any) => string | null;
}

export interface FormField {
	name: string;
	label: string;
	type: string;
	placeholder?: string;
	required?: boolean;
	validation?: ValidationRule;
	options?: Array<{ value: string; label: string }>;
}

// ============================================================================
// GEOLOCATION TYPES
// ============================================================================

export interface Coordinates {
	latitude: number;
	longitude: number;
	accuracy?: number;
}

export interface Address {
	street?: string;
	city?: string;
	state?: string;
	zip?: string;
	country?: string;
	formatted?: string;
}

export interface Place {
	place_id?: string;
	name?: string;
	address: Address;
	coordinates?: Coordinates;
	types?: string[];
	rating?: number;
	price_level?: number;
	photos?: string[];
}

export interface Bounds {
	north: number;
	south: number;
	east: number;
	west: number;
}

// ============================================================================
// MAP TYPES
// ============================================================================

export interface MapMarker {
	id: string;
	position: Coordinates;
	title: string;
	type: "business" | "user" | "point";
	data?: any;
	icon?: string;
	popup?: React.ReactNode;
}

export interface MapViewport {
	latitude: number;
	longitude: number;
	zoom: number;
	bearing?: number;
	pitch?: number;
}

export interface MapStyle {
	name: string;
	url: string;
	preview?: string;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
	error: string | null;
}

export interface Session {
	access_token: string;
	refresh_token: string;
	expires_at: number;
	user: User;
}

export interface LoginCredentials {
	email: string;
	password: string;
	remember?: boolean;
}

export interface SignupData {
	email: string;
	password: string;
	name: string;
	phone?: string;
	terms_accepted: boolean;
}

export interface PasswordResetData {
	email: string;
	token?: string;
	new_password?: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
	id: string;
	type: "info" | "success" | "warning" | "error";
	title: string;
	message?: string;
	duration?: number;
	action?: NotificationAction;
	dismissible?: boolean;
	created_at: string;
}

export interface NotificationAction {
	label: string;
	onClick: () => void;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsEvent {
	name: string;
	properties?: Record<string, any>;
	user_id?: string;
	session_id?: string;
	timestamp?: string;
}

export interface PageView {
	path: string;
	title?: string;
	referrer?: string;
	user_id?: string;
	session_id?: string;
	timestamp?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ExtractArrayType<T> = T extends (infer U)[] ? U : never;

export type KeyOf<T> = keyof T;

export type ValueOf<T> = T[keyof T];

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseAsyncState<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
	execute: (...args: any[]) => Promise<T>;
	reset: () => void;
}

export interface UseLocalStorageReturn<T> {
	value: T | null;
	setValue: (value: T) => void;
	removeValue: () => void;
}

export interface UseDebounceOptions {
	delay: number;
	leading?: boolean;
	trailing?: boolean;
}

// ============================================================================
// STORE TYPES
// ============================================================================

export interface StoreState {
	auth: AuthState;
	business: BusinessState;
	search: SearchState;
	map: MapState;
	ui: UIState;
}

export interface BusinessState {
	currentBusiness: Business | null;
	businesses: Business[];
	loading: boolean;
	error: string | null;
	filters: SearchParams;
}

export interface SearchState {
	query: string;
	results: SearchResults | null;
	suggestions: SearchSuggestion[];
	loading: boolean;
	error: string | null;
	history: string[];
}

export interface MapState {
	viewport: MapViewport;
	markers: MapMarker[];
	selectedMarker: MapMarker | null;
	style: MapStyle;
	bounds: Bounds | null;
	loading: boolean;
}

export interface UIState {
	theme: "light" | "dark" | "system";
	sidebar: {
		open: boolean;
		collapsed: boolean;
	};
	notifications: Notification[];
	modals: {
		[key: string]: boolean;
	};
	loading: {
		[key: string]: boolean;
	};
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class AppError extends Error {
	code: string;
	statusCode?: number;
	details?: Record<string, any>;

	constructor(message: string, code: string, statusCode?: number, details?: Record<string, any>) {
		super(message);
		this.name = "AppError";
		this.code = code;
		this.statusCode = statusCode;
		this.details = details;
	}
}

export interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: React.ErrorInfo | null;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface AppConfig {
	api: {
		baseUrl: string;
		timeout: number;
		retryAttempts: number;
	};
	auth: {
		sessionTimeout: number;
		autoRefresh: boolean;
	};
	map: {
		apiKey: string;
		defaultCenter: Coordinates;
		defaultZoom: number;
		styles: MapStyle[];
	};
	features: {
		[key: string]: boolean;
	};
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export * from "./api";
export * from "./components";
export * from "./forms";
export * from "./hooks";

// Feature-specific types
export * from "./dashboard";
export * from "./ads";
export * from "./jobs";
