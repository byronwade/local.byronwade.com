/**
 * Ads Components - Barrel Export
 * Refactored from 678/804 line monolithic pages to modular architecture
 * Enterprise-level component organization for advertising functionality
 */

// Main page components
export { default as AdsCreatePage } from "./AdsCreatePage";
export { default as AdsEditPage } from "./AdsEditPage";

// Section components
export { CampaignDetailsSection, AdContentSection, TargetingSection, BudgetScheduleSection, ReviewSubmitSection } from "./sections";

// Re-export hook for external usage
export { useAdsForm } from "@lib/hooks/business/ads/useAdsForm";
