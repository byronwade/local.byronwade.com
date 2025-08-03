"use client";

// REQUIRED: Production Supabase client integration for API routes
// This file now uses the real Supabase configuration with your API keys

// Import the optimized Supabase client from our integration
export { supabase } from "../supabase/client";

// Also export additional utilities for API usage
export { getPooledClient, cleanupConnections, createServiceRoleClient, getServiceRoleKey } from "../supabase";

// Removed problematic exports temporarily to fix build

// Re-export the main client as default for backward compatibility
import { supabase } from "../supabase/client";
export default supabase;
