// REQUIRED: Production Supabase client integration
// This file now uses the real Supabase configuration with your API keys

// Import the optimized Supabase client from our integration
export { supabase } from "./supabase/client";

// Also export additional utilities for convenience
export { getPooledClient, cleanupConnections, createServiceRoleClient, getServiceRoleKey } from "./supabase";

// Types are available in './supabase' for TypeScript users

// Re-export the main client as default for backward compatibility
import { supabase } from "./supabase/client";
export default supabase;
