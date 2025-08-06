/**
 * UI Component Groups - Barrel Export
 * Domain-specific component groupings for optimized imports
 * Enables both selective imports and bundle optimization
 */

// Domain-specific exports
export * as FormComponents from "./form-components";
export * as LayoutComponents from "./layout-components";
export * as InteractionComponents from "./interaction-components";
export * as FeedbackComponents from "./feedback-components";
export * as CustomComponents from "./custom-components";

// Convenience re-exports for common patterns
export {
	// Most commonly used form components
	Button,
	Input,
	Label,
	Textarea,
	Checkbox,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./form-components";

export {
	// Most commonly used layout components
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	Separator,
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "./layout-components";

export {
	// Most commonly used interaction components
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./interaction-components";

export {
	// Most commonly used feedback components
	Alert,
	AlertDescription,
	Badge,
	toast,
	useToast,
	Toaster,
	Progress,
	Skeleton,
} from "./feedback-components";

export {
	// Custom components
	DarkModeToggle,
	LanguageSelector,
} from "./custom-components";
