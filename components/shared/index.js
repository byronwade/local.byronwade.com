// Shared Components Barrel Export
// All shared/common components used across the application

// Core Shared Components
export { default as ErrorBoundary } from "./ErrorBoundary";
export { default as ErrorBoundaryWrapper } from "./ErrorBoundaryWrapper";
export { default as PerformanceOptimizer } from "./PerformanceOptimizer";

// AI Components
export { default as UnifiedAIChat } from "./ai/UnifiedAIChat";

// Chat Bot Components
export { default as Chat } from "./chatBot/Chat";
export { default as ChatContent } from "./chatBot/ChatContent";
export { default as ChatInput } from "./chatBot/ChatInput";
export { default as ChatSuggestions } from "./chatBot/ChatSuggestions";
export { default as ThorbisBubble } from "./chatBot/ThorbisBubble";
export { default as UserBubble } from "./chatBot/UserBubble";

// Filter Components
export { default as FilterSortPanel } from "./filters/FilterSortPanel";

// Layout Components
export { default as NavItem } from "./layout/NavItem";

// Search Box Components
export { default as AiButton } from "./searchBox/AiButton";
export { default as AutocompleteSuggestions } from "./searchBox/AutocompleteSuggestions";
export { default as BusinessCard } from "./searchBox/BusinessCard";
export { default as EnhancedSearchBox } from "./searchBox/EnhancedSearchBox";
export { default as FilterDropdown } from "./searchBox/FilterDropdown";
export { default as FullSearchBox } from "./searchBox/FullSearchBox";
export { default as LocationDropdown } from "./searchBox/LocationDropdown";
export { default as RealTimeSearch } from "./searchBox/RealTimeSearch";
export { default as SearchBarHeader } from "./searchBox/SearchBarHeader";
export { default as SearchBarOnly } from "./searchBox/SearchBarOnly";
export { default as SortDropdown } from "./searchBox/SortDropdown";
