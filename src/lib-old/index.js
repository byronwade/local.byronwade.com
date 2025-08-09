// Core Library Barrel Export
// Central export point for all library modules

// API Clients
export * from "./api";

// Authentication
export * from "./auth";

// Email Services
export * from "./email";

// Internationalization
export * from "./i18n";

// Supabase Integration
export * from "./supabase";

// Utility Functions
export * from "./utils";

// Legacy Exports (to be migrated)
export { default as algoliaClient } from "./algolia-client";
export { default as OpenAIClient } from "./open-ai-client";
export { default as businessDataGenerator } from "./business-data-generator";
