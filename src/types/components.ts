// Component-specific type definitions

import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from "react";

// ============================================================================
// BASE COMPONENT TYPES
// ============================================================================

export interface BaseComponentProps {
	className?: string;
	children?: ReactNode;
	id?: string;
	"data-testid"?: string;
}

export interface ComponentWithVariants<T extends string> extends BaseComponentProps {
	variant?: T;
	size?: "sm" | "md" | "lg" | "xl";
}

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
	size?: "sm" | "default" | "lg" | "icon";
	loading?: boolean;
	loadingText?: string;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	fullWidth?: boolean;
	asChild?: boolean;
}

export interface IconButtonProps extends Omit<ButtonProps, "children"> {
	icon: ReactNode;
	"aria-label": string;
}

export interface ButtonGroupProps extends BaseComponentProps {
	orientation?: "horizontal" | "vertical";
	attached?: boolean;
	spacing?: number;
}

// ============================================================================
// INPUT COMPONENTS
// ============================================================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseComponentProps {
	variant?: "default" | "filled" | "outline";
	size?: "sm" | "md" | "lg";
	error?: boolean;
	helperText?: string;
	leftElement?: ReactNode;
	rightElement?: ReactNode;
	label?: string;
	isRequired?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
}

export interface TextareaProps extends HTMLAttributes<HTMLTextAreaElement>, BaseComponentProps {
	variant?: "default" | "filled" | "outline";
	size?: "sm" | "md" | "lg";
	error?: boolean;
	helperText?: string;
	label?: string;
	isRequired?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
	rows?: number;
	cols?: number;
	resize?: "none" | "both" | "horizontal" | "vertical";
}

export interface SelectProps extends BaseComponentProps {
	value?: string | string[];
	defaultValue?: string | string[];
	placeholder?: string;
	isMultiple?: boolean;
	isDisabled?: boolean;
	isRequired?: boolean;
	isInvalid?: boolean;
	size?: "sm" | "md" | "lg";
	variant?: "default" | "filled" | "outline";
	label?: string;
	helperText?: string;
	options: SelectOption[];
	onChange?: (value: string | string[]) => void;
	onBlur?: () => void;
	onFocus?: () => void;
}

export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
	group?: string;
	icon?: ReactNode;
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

export interface FormProps extends HTMLAttributes<HTMLFormElement>, BaseComponentProps {
	onSubmit?: (data: Record<string, any>) => void;
	validation?: ValidationSchema;
	defaultValues?: Record<string, any>;
	mode?: "onChange" | "onBlur" | "onSubmit";
}

export interface FormFieldProps extends BaseComponentProps {
	name: string;
	label?: string;
	helperText?: string;
	isRequired?: boolean;
	isReadOnly?: boolean;
	isDisabled?: boolean;
	validation?: FieldValidation;
}

export interface FieldValidation {
	required?: boolean | string;
	min?: number | { value: number; message: string };
	max?: number | { value: number; message: string };
	minLength?: number | { value: number; message: string };
	maxLength?: number | { value: number; message: string };
	pattern?: RegExp | { value: RegExp; message: string };
	validate?: (value: any) => string | boolean;
}

export interface ValidationSchema {
	[fieldName: string]: FieldValidation;
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

export interface ContainerProps extends BaseComponentProps {
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
	centerContent?: boolean;
	fluid?: boolean;
}

export interface StackProps extends BaseComponentProps {
	direction?: "row" | "column";
	spacing?: number | string;
	align?: "start" | "center" | "end" | "stretch";
	justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
	wrap?: boolean;
	divider?: ReactNode;
}

export interface GridProps extends BaseComponentProps {
	columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
	spacing?: number | string;
	autoFit?: boolean;
	minChildWidth?: string;
}

export interface FlexProps extends BaseComponentProps {
	direction?: "row" | "row-reverse" | "column" | "column-reverse";
	wrap?: "nowrap" | "wrap" | "wrap-reverse";
	align?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
	justify?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
	gap?: number | string;
}

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

export interface NavigationProps extends BaseComponentProps {
	orientation?: "horizontal" | "vertical";
	variant?: "default" | "pills" | "underline";
	size?: "sm" | "md" | "lg";
}

export interface NavigationItemProps extends BaseComponentProps {
	href?: string;
	isActive?: boolean;
	isDisabled?: boolean;
	icon?: ReactNode;
	badge?: string | number;
	onClick?: () => void;
}

export interface BreadcrumbProps extends BaseComponentProps {
	separator?: ReactNode;
	items: BreadcrumbItem[];
}

export interface BreadcrumbItem {
	label: string;
	href?: string;
	isCurrentPage?: boolean;
	icon?: ReactNode;
}

export interface PaginationProps extends BaseComponentProps {
	current: number;
	total: number;
	pageSize?: number;
	showSizeChanger?: boolean;
	showQuickJumper?: boolean;
	showTotal?: boolean;
	onChange?: (page: number, pageSize?: number) => void;
	onShowSizeChange?: (current: number, size: number) => void;
}

// ============================================================================
// OVERLAY COMPONENTS
// ============================================================================

export interface ModalProps extends BaseComponentProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
	isCentered?: boolean;
	closeOnOverlayClick?: boolean;
	closeOnEsc?: boolean;
	preserveScrollBarGap?: boolean;
	returnFocusOnClose?: boolean;
	header?: ReactNode;
	footer?: ReactNode;
}

export interface DrawerProps extends BaseComponentProps {
	isOpen: boolean;
	onClose: () => void;
	placement?: "top" | "right" | "bottom" | "left";
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
	title?: string;
	closeOnOverlayClick?: boolean;
	closeOnEsc?: boolean;
	header?: ReactNode;
	footer?: ReactNode;
}

export interface PopoverProps extends BaseComponentProps {
	trigger: ReactNode;
	content: ReactNode;
	placement?: "top" | "right" | "bottom" | "left";
	offset?: number;
	closeOnBlur?: boolean;
	closeOnEsc?: boolean;
	isLazy?: boolean;
}

export interface TooltipProps extends BaseComponentProps {
	label: string;
	placement?: "top" | "right" | "bottom" | "left";
	offset?: number;
	delay?: number;
	closeDelay?: number;
	hasArrow?: boolean;
	isDisabled?: boolean;
}

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

export interface AlertProps extends BaseComponentProps {
	status?: "info" | "success" | "warning" | "error";
	variant?: "solid" | "subtle" | "left-accent" | "top-accent";
	title?: string;
	description?: string;
	icon?: ReactNode;
	isClosable?: boolean;
	onClose?: () => void;
}

export interface ToastProps extends BaseComponentProps {
	id?: string;
	title?: string;
	description?: string;
	status?: "info" | "success" | "warning" | "error";
	duration?: number;
	isClosable?: boolean;
	position?: "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";
	onClose?: () => void;
	action?: {
		label: string;
		onClick: () => void;
	};
}

export interface SkeletonProps extends BaseComponentProps {
	height?: string | number;
	width?: string | number;
	isLoaded?: boolean;
	fadeDuration?: number;
	speed?: number;
	startColor?: string;
	endColor?: string;
}

export interface SpinnerProps extends BaseComponentProps {
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	color?: string;
	thickness?: string;
	speed?: string;
	label?: string;
}

export interface ProgressProps extends BaseComponentProps {
	value?: number;
	max?: number;
	min?: number;
	size?: "xs" | "sm" | "md" | "lg";
	colorScheme?: string;
	hasStripe?: boolean;
	isAnimated?: boolean;
	isIndeterminate?: boolean;
}

// ============================================================================
// DATA DISPLAY COMPONENTS
// ============================================================================

export interface TableProps extends BaseComponentProps {
	variant?: "simple" | "striped" | "outline";
	size?: "sm" | "md" | "lg";
	colorScheme?: string;
	data: TableRow[];
	columns: TableColumn[];
	sortable?: boolean;
	selectable?: boolean;
	pagination?: boolean;
	loading?: boolean;
	emptyState?: ReactNode;
	onRowClick?: (row: TableRow) => void;
	onSort?: (column: string, direction: "asc" | "desc") => void;
	onSelect?: (selectedRows: TableRow[]) => void;
}

export interface TableColumn {
	key: string;
	label: string;
	sortable?: boolean;
	width?: string | number;
	render?: (value: any, row: TableRow) => ReactNode;
}

export interface TableRow {
	id: string | number;
	[key: string]: any;
}

export interface CardProps extends BaseComponentProps {
	variant?: "outline" | "filled" | "elevated";
	size?: "sm" | "md" | "lg";
	header?: ReactNode;
	footer?: ReactNode;
	isHoverable?: boolean;
	isClickable?: boolean;
	onClick?: () => void;
}

export interface BadgeProps extends BaseComponentProps {
	variant?: "solid" | "subtle" | "outline";
	colorScheme?: string;
	size?: "sm" | "md" | "lg";
	isRounded?: boolean;
}

export interface AvatarProps extends BaseComponentProps {
	src?: string;
	name?: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
	showBorder?: boolean;
	borderColor?: string;
	fallback?: ReactNode;
	loading?: "eager" | "lazy";
}

// ============================================================================
// BUSINESS-SPECIFIC COMPONENTS
// ============================================================================

export interface BusinessCardProps extends BaseComponentProps {
	business: Business;
	variant?: "default" | "compact" | "detailed";
	showRating?: boolean;
	showDistance?: boolean;
	showPhotos?: boolean;
	showCategories?: boolean;
	onClick?: (business: Business) => void;
}

export interface BusinessListProps extends BaseComponentProps {
	businesses: Business[];
	loading?: boolean;
	emptyState?: ReactNode;
	variant?: "list" | "grid";
	onBusinessClick?: (business: Business) => void;
	onLoadMore?: () => void;
	hasMore?: boolean;
}

export interface ReviewCardProps extends BaseComponentProps {
	review: Review;
	showBusiness?: boolean;
	showUser?: boolean;
	showPhotos?: boolean;
	onHelpful?: (review: Review) => void;
	onReport?: (review: Review) => void;
}

export interface RatingProps extends BaseComponentProps {
	value: number;
	max?: number;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	isReadOnly?: boolean;
	allowHalf?: boolean;
	icon?: ReactNode;
	onChange?: (value: number) => void;
}

export interface MapProps extends BaseComponentProps {
	center?: [number, number];
	zoom?: number;
	markers?: MapMarker[];
	style?: string;
	controls?: boolean;
	clustering?: boolean;
	onMapClick?: (coordinates: [number, number]) => void;
	onMarkerClick?: (marker: MapMarker) => void;
	onBoundsChange?: (bounds: Bounds) => void;
}

// ============================================================================
// SEARCH COMPONENTS
// ============================================================================

export interface SearchBoxProps extends BaseComponentProps {
	value?: string;
	placeholder?: string;
	suggestions?: SearchSuggestion[];
	loading?: boolean;
	showFilters?: boolean;
	showLocation?: boolean;
	onSearch?: (query: string) => void;
	onChange?: (value: string) => void;
	onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
	onLocationSelect?: (location: Coordinates) => void;
}

export interface FilterPanelProps extends BaseComponentProps {
	filters: SearchFilters;
	selectedFilters: Record<string, any>;
	onFilterChange?: (filters: Record<string, any>) => void;
	onReset?: () => void;
}

export interface SortDropdownProps extends BaseComponentProps {
	options: SortOption[];
	value?: string;
	onChange?: (value: string) => void;
}

export interface SortOption {
	value: string;
	label: string;
	disabled?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ComponentVariant = "default" | "primary" | "secondary" | "outline" | "ghost";
export type ComponentColorScheme = "primary" | "secondary" | "success" | "warning" | "error" | "gray";
export type ResponsiveValue<T> = T | { sm?: T; md?: T; lg?: T; xl?: T };

export default {};
