// Hooks Barrel Export
// All custom React hooks

// Authentication Hooks
export { default as useAuth } from "./use-auth";
export { default as useSupabaseAuth } from "./use-supabase-auth";

// User Profile Hook
export { default as useUserProfile } from "./use-user-profile";

// Chat Hook
export { default as useChat } from "./usechat";

// UI/Interaction Hooks
export { default as useDragDrop } from "./use-drag-drop";
export { useMobile } from "./use-mobile";
export { default as useMediaQuery } from "./use-media-query";

// Business Hooks
export * from "../lib/hooks/business";

// User Hooks
export * from "../lib/hooks/user";

// Map Hooks
export * from "../lib/hooks/map";
