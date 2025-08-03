/**
 * Map Sections - Barrel Export
 * Extracted from large map components for better maintainability
 * Enterprise-level modular architecture
 */

// Core location services
export { useLocationServices } from "./LocationServices";
export { default as LocationServices } from "./LocationServices";

// Search functionality
export { useSearchSuggestions, SearchSuggestionsUI } from "./SearchSuggestions";
export { default as SearchSuggestions } from "./SearchSuggestions";

// Map bounds and business management
export { useMapBoundsManager } from "./MapBoundsManager";
export { default as MapBoundsManager } from "./MapBoundsManager";

// UI controls
export { LocationControls } from "./LocationControls";
export { default as LocationControlsComponent } from "./LocationControls";

// Main refactored integration component
export { useLocationServices as useLocationServicesHook, useSearchSuggestions as useSearchSuggestionsHook, useMapBoundsManager as useMapBoundsManagerHook } from "./MapIntegrationRefactored";
export { default as MapIntegrationRefactored } from "./MapIntegrationRefactored";
