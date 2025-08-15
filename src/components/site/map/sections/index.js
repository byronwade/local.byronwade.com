/**
 * Map Sections - Barrel Export
 * Extracted from large map components for better maintainability
 * Enterprise-level modular architecture
 */

// Core location services
export { useLocationServices } from "./location-services";
export { default as LocationServices } from "./location-services";

// Search functionality
export { useSearchSuggestions, SearchSuggestionsUI } from "./search-suggestions";
export { default as SearchSuggestions } from "./search-suggestions";

// Map bounds and business management
export { useMapBoundsManager } from "./map-bounds-manager";
export { default as MapBoundsManager } from "./map-bounds-manager";

// UI controls
export { LocationControls } from "./location-controls";
export { default as LocationControlsComponent } from "./location-controls";

// Main refactored integration component
export { useLocationServices as useLocationServicesHook, useSearchSuggestions as useSearchSuggestionsHook, useMapBoundsManager as useMapBoundsManagerHook } from "./map-integration-refactored";
export { default as MapIntegrationRefactored } from "./map-integration-refactored";
