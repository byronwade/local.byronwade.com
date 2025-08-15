#!/usr/bin/env node

/**
 * Create missing Supabase tables script
 * Run this to create user_security_metrics and user_activity tables
 * Usage: bun run scripts/run-missing-tables.js
 */

import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createMissingTables() {
	console.log("🚀 Creating missing Supabase tables...");

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !supabaseServiceKey) {
		console.error("❌ Missing required environment variables:");
		console.error("- NEXT_PUBLIC_SUPABASE_URL");
		console.error("- SUPABASE_SERVICE_ROLE_KEY");
		process.exit(1);
	}

	const supabase = createClient(supabaseUrl, supabaseServiceKey);

	try {
		// Read the SQL file
		const sqlPath = join(__dirname, "create-missing-tables.sql");
		const sql = await readFile(sqlPath, "utf8");

		console.log("📄 Executing SQL script...");

		// Execute the SQL
		const { data, error } = await supabase.rpc("exec_sql", { sql });

		if (error) {
			console.error("❌ Error executing SQL:", error);
			process.exit(1);
		}

		console.log("✅ Successfully created missing tables:");
		console.log("   - user_security_metrics");
		console.log("   - user_activity");
		console.log("   - Added RLS policies");
		console.log("   - Created indexes for performance");

		// Test the tables by running a simple query
		const { data: securityTest, error: securityError } = await supabase.from("user_security_metrics").select("count", { count: "exact", head: true });

		const { data: activityTest, error: activityError } = await supabase.from("user_activity").select("count", { count: "exact", head: true });

		if (!securityError && !activityError) {
			console.log("🔍 Tables verified successfully");
		} else {
			console.warn("⚠️  Table verification warnings:", {
				securityError: securityError?.message,
				activityError: activityError?.message,
			});
		}
	} catch (error) {
		console.error("❌ Script error:", error);
		process.exit(1);
	}
}

// Alternative method using direct SQL execution if the above doesn't work
async function createTablesDirectly() {
	console.log("🔄 Trying direct SQL execution...");

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	const supabase = createClient(supabaseUrl, supabaseServiceKey);

	try {
		// Create user_security_metrics table
		const { error: error1 } = await supabase.rpc("exec", {
			sql: `
        CREATE TABLE IF NOT EXISTS user_security_metrics (
          id BIGSERIAL PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          failed_login_attempts INTEGER DEFAULT 0,
          last_login TIMESTAMP WITH TIME ZONE,
          trusted_devices JSONB DEFAULT '[]',
          mfa_enabled BOOLEAN DEFAULT false,
          security_level TEXT DEFAULT 'standard',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT unique_user_security_metrics UNIQUE(user_id)
        );
      `,
		});

		if (error1) throw error1;

		// Create user_activity table
		const { error: error2 } = await supabase.rpc("exec", {
			sql: `
        CREATE TABLE IF NOT EXISTS user_activity (
          id BIGSERIAL PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          title TEXT,
          description TEXT,
          metadata JSONB DEFAULT '{}',
          last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          device_fingerprint TEXT,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
		});

		if (error2) throw error2;

		console.log("✅ Tables created successfully via direct SQL");
	} catch (error) {
		console.error("❌ Direct SQL error:", error);
		console.log("💡 You may need to run the SQL manually in your Supabase dashboard");
		console.log("📄 SQL file location: scripts/create-missing-tables.sql");
	}
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
	createMissingTables().catch(() => {
		console.log("🔄 Falling back to direct SQL execution...");
		createTablesDirectly();
	});
}

export { createMissingTables, createTablesDirectly };
