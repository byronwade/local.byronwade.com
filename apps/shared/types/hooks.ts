// Hook-specific type definitions

import { DependencyList } from "react";

// ============================================================================
// ASYNC HOOKS
// ============================================================================

export interface UseAsyncState<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
	execute: (...args: any[]) => Promise<T>;
	reset: () => void;
}

export interface UseAsyncOptions {
	immediate?: boolean;
	onSuccess?: (data: any) => void;
	onError?: (error: Error) => void;
	retries?: number;
	retryDelay?: number;
}

export interface UseFetchState<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	mutate: (data: T | ((prev: T | null) => T)) => void;
}

export interface UseFetchOptions<T> {
	immediate?: boolean;
	deps?: DependencyList;
	onSuccess?: (data: T) => void;
	onError?: (error: Error) => void;
	transform?: (data: any) => T;
	cache?: boolean;
	cacheKey?: string;
	cacheTTL?: number;
}

// ============================================================================
// STORAGE HOOKS
// ============================================================================

export interface UseLocalStorageReturn<T> {
	value: T | null;
	setValue: (value: T | ((prev: T | null) => T)) => void;
	removeValue: () => void;
	clear: () => void;
}

export interface UseSessionStorageReturn<T> {
	value: T | null;
	setValue: (value: T | ((prev: T | null) => T)) => void;
	removeValue: () => void;
	clear: () => void;
}

export interface UseStorageOptions<T> {
	defaultValue?: T;
	serializer?: {
		read: (value: string) => T;
		write: (value: T) => string;
	};
}

// ============================================================================
// FORM HOOKS
// ============================================================================

export interface UseFormState<T> {
	values: T;
	errors: Partial<Record<keyof T, string>>;
	touched: Partial<Record<keyof T, boolean>>;
	isValid: boolean;
	isSubmitting: boolean;
	isDirty: boolean;
}

export interface UseFormActions<T> {
	setValue: (name: keyof T, value: any) => void;
	setValues: (values: Partial<T>) => void;
	setError: (name: keyof T, error: string) => void;
	setErrors: (errors: Partial<Record<keyof T, string>>) => void;
	clearError: (name: keyof T) => void;
	clearErrors: () => void;
	setTouched: (name: keyof T, touched?: boolean) => void;
	setTouchedFields: (touched: Partial<Record<keyof T, boolean>>) => void;
	reset: (values?: Partial<T>) => void;
	submit: () => Promise<void>;
}

export interface UseFormReturn<T> extends UseFormState<T>, UseFormActions<T> {
	register: (name: keyof T) => {
		name: string;
		value: any;
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
		onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
	};
	handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (event?: React.FormEvent) => Promise<void>;
}

export interface UseFormOptions<T> {
	initialValues?: Partial<T>;
	validate?: (values: T) => Partial<Record<keyof T, string>>;
	validateOnChange?: boolean;
	validateOnBlur?: boolean;
	onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFieldState {
	value: any;
	error?: string;
	touched: boolean;
	isDirty: boolean;
}

export interface UseFieldActions {
	setValue: (value: any) => void;
	setError: (error: string) => void;
	clearError: () => void;
	setTouched: (touched?: boolean) => void;
	reset: () => void;
}

export interface UseFieldReturn extends UseFieldState, UseFieldActions {
	register: {
		name: string;
		value: any;
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
		onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
	};
}

// ============================================================================
// UI HOOKS
// ============================================================================

export interface UseDisclosureReturn {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	onToggle: () => void;
}

export interface UseToggleReturn {
	value: boolean;
	toggle: () => void;
	setTrue: () => void;
	setFalse: () => void;
	setValue: (value: boolean) => void;
}

export interface UseCounterReturn {
	count: number;
	increment: (step?: number) => void;
	decrement: (step?: number) => void;
	reset: () => void;
	set: (value: number) => void;
}

export interface UseCounterOptions {
	min?: number;
	max?: number;
	step?: number;
	initialValue?: number;
}

export interface UseClipboardReturn {
	value: string;
	copy: (text: string) => Promise<void>;
	copied: boolean;
	isSupported: boolean;
}

export interface UseClipboardOptions {
	timeout?: number;
	onCopy?: () => void;
	onError?: (error: Error) => void;
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export interface UseDebounceOptions {
	delay: number;
	leading?: boolean;
	trailing?: boolean;
	maxWait?: number;
}

export interface UseThrottleOptions {
	delay: number;
	leading?: boolean;
	trailing?: boolean;
}

export interface UseIntervalOptions {
	immediate?: boolean;
}

export interface UseTimeoutReturn {
	start: () => void;
	stop: () => void;
	reset: () => void;
	isActive: boolean;
}

export interface UseGeolocationState {
	coordinates?: GeolocationCoordinates;
	error?: GeolocationPositionError;
	loading: boolean;
	timestamp?: number;
}

export interface UseGeolocationOptions {
	enableHighAccuracy?: boolean;
	timeout?: number;
	maximumAge?: number;
	watch?: boolean;
	onSuccess?: (position: GeolocationPosition) => void;
	onError?: (error: GeolocationPositionError) => void;
}

export interface UseMediaQueryReturn {
	matches: boolean;
	media: string;
}

export interface UseWindowSizeReturn {
	width: number;
	height: number;
}

export interface UseScrollReturn {
	x: number;
	y: number;
	scrollTo: (x: number, y: number) => void;
	scrollToTop: () => void;
}

export interface UseScrollOptions {
	behavior?: "auto" | "smooth";
	threshold?: number;
	onScroll?: (scroll: { x: number; y: number }) => void;
}

// ============================================================================
// EVENT HOOKS
// ============================================================================

export interface UseKeyPressOptions {
	target?: EventTarget | null;
	eventOptions?: AddEventListenerOptions;
}

export interface UseClickOutsideOptions {
	enabled?: boolean;
	events?: string[];
}

export interface UseHoverReturn {
	isHovered: boolean;
	hoverProps: {
		onMouseEnter: () => void;
		onMouseLeave: () => void;
	};
}

export interface UseFocusReturn {
	isFocused: boolean;
	focusProps: {
		onFocus: () => void;
		onBlur: () => void;
	};
}

// ============================================================================
// BUSINESS-SPECIFIC HOOKS
// ============================================================================

export interface UseBusinessSearchState {
	businesses: Business[];
	loading: boolean;
	error: Error | null;
	total: number;
	hasMore: boolean;
	filters: SearchParams;
}

export interface UseBusinessSearchActions {
	search: (params: SearchParams) => Promise<void>;
	loadMore: () => Promise<void>;
	reset: () => void;
	setFilters: (filters: Partial<SearchParams>) => void;
}

export interface UseBusinessSearchReturn extends UseBusinessSearchState, UseBusinessSearchActions {}

export interface UseBusinessReturn {
	business: Business | null;
	loading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	update: (data: Partial<Business>) => Promise<void>;
	claim: (data: BusinessClaimRequest) => Promise<void>;
}

export interface UseReviewsState {
	reviews: Review[];
	loading: boolean;
	error: Error | null;
	total: number;
	hasMore: boolean;
	stats: {
		averageRating: number;
		totalCount: number;
		distribution: Record<number, number>;
	};
}

export interface UseReviewsActions {
	loadReviews: (businessId: string, page?: number) => Promise<void>;
	loadMore: () => Promise<void>;
	addReview: (review: ReviewCreateRequest) => Promise<void>;
	updateReview: (reviewId: string, data: Partial<Review>) => Promise<void>;
	deleteReview: (reviewId: string) => Promise<void>;
	markHelpful: (reviewId: string) => Promise<void>;
	reportReview: (reviewId: string, reason: string) => Promise<void>;
}

export interface UseReviewsReturn extends UseReviewsState, UseReviewsActions {}

// ============================================================================
// AUTH HOOKS
// ============================================================================

export interface UseAuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
	error: Error | null;
	isAuthenticated: boolean;
}

export interface UseAuthActions {
	login: (credentials: LoginCredentials) => Promise<void>;
	signup: (data: SignupData) => Promise<void>;
	logout: () => Promise<void>;
	refreshSession: () => Promise<void>;
	updateProfile: (data: Partial<UserProfile>) => Promise<void>;
	changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	verifyEmail: (token: string) => Promise<void>;
	resendVerification: () => Promise<void>;
}

export interface UseAuthReturn extends UseAuthState, UseAuthActions {}

export interface UsePermissionsReturn {
	permissions: string[];
	hasPermission: (permission: string) => boolean;
	hasRole: (role: string) => boolean;
	canAccess: (resource: string, action: string) => boolean;
}

// ============================================================================
// MAP HOOKS
// ============================================================================

export interface UseMapState {
	map: any; // Map instance
	viewport: MapViewport;
	markers: MapMarker[];
	selectedMarker: MapMarker | null;
	bounds: Bounds | null;
	loading: boolean;
}

export interface UseMapActions {
	setViewport: (viewport: Partial<MapViewport>) => void;
	addMarker: (marker: MapMarker) => void;
	removeMarker: (markerId: string) => void;
	selectMarker: (markerId: string | null) => void;
	fitBounds: (bounds: Bounds) => void;
	getCurrentLocation: () => Promise<Coordinates>;
}

export interface UseMapReturn extends UseMapState, UseMapActions {}

// ============================================================================
// NOTIFICATION HOOKS
// ============================================================================

export interface UseNotificationsState {
	notifications: Notification[];
	unreadCount: number;
	loading: boolean;
}

export interface UseNotificationsActions {
	addNotification: (notification: Omit<Notification, "id" | "created_at">) => void;
	removeNotification: (id: string) => void;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	clearAll: () => void;
}

export interface UseNotificationsReturn extends UseNotificationsState, UseNotificationsActions {}

export interface UseToastReturn {
	toast: (options: Omit<ToastProps, "id">) => string;
	success: (message: string, options?: Partial<ToastProps>) => string;
	error: (message: string, options?: Partial<ToastProps>) => string;
	warning: (message: string, options?: Partial<ToastProps>) => string;
	info: (message: string, options?: Partial<ToastProps>) => string;
	dismiss: (id: string) => void;
	dismissAll: () => void;
}

// ============================================================================
// PERFORMANCE HOOKS
// ============================================================================

export interface UseVirtualListReturn<T> {
	items: T[];
	containerProps: React.HTMLProps<HTMLDivElement>;
	wrapperProps: React.HTMLProps<HTMLDivElement>;
	scrollToIndex: (index: number) => void;
	scrollToTop: () => void;
	scrollToBottom: () => void;
}

export interface UseVirtualListOptions {
	itemHeight: number | ((index: number) => number);
	overscan?: number;
	scrollingDelay?: number;
	onScroll?: (scrollTop: number) => void;
}

export interface UseInfiniteScrollReturn {
	hasMore: boolean;
	isLoading: boolean;
	loadMore: () => void;
	reset: () => void;
}

export interface UseInfiniteScrollOptions {
	threshold?: number;
	onLoadMore: () => Promise<void>;
	hasMore: boolean;
	disabled?: boolean;
}

export default {};
