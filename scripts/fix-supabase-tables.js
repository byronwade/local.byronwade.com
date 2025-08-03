#!/usr/bin/env node

/**
 * Fix Supabase tables script
 * Creates missing tables that are causing 406/404 errors
 * Usage: bun run scripts/fix-supabase-tables.js
 */

import { createClient } from "@supabase/supabase-js";

async function fixSupabaseTables() {
	console.log("🚀 Fixing Supabase tables...");

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !supabaseServiceKey) {
		console.error("❌ Missing required environment variables:");
		console.error("- NEXT_PUBLIC_SUPABASE_URL");
		console.error("- SUPABASE_SERVICE_ROLE_KEY");
		process.exit(1);
	}

	const supabase = createClient(supabaseUrl, supabaseServiceKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});

	try {
		console.log("1️⃣ Creating user_security_metrics table...");

		// Create user_security_metrics table
		const { error: securityTableError } = await supabase.rpc("sql", {
			query: `
				CREATE TABLE IF NOT EXISTS user_security_metrics (
					id BIGSERIAL PRIMARY KEY,
					user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
					failed_login_attempts INTEGER DEFAULT 0,
					last_login TIMESTAMP WITH TIME ZONE,
					trusted_devices JSONB DEFAULT '[]',
					mfa_enabled BOOLEAN DEFAULT false,
					security_level TEXT DEFAULT 'standard' CHECK (security_level IN ('basic', 'standard', 'high')),
					last_password_change TIMESTAMP WITH TIME ZONE,
					login_attempts_reset_at TIMESTAMP WITH TIME ZONE,
					account_locked_until TIMESTAMP WITH TIME ZONE,
					security_questions_set BOOLEAN DEFAULT false,
					backup_codes_generated BOOLEAN DEFAULT false,
					created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
					updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
					
					CONSTRAINT unique_user_security_metrics UNIQUE(user_id)
				);
			`,
		});

		if (securityTableError) {
			console.error("❌ Error creating user_security_metrics:", securityTableError);
		} else {
			console.log("✅ user_security_metrics table created");
		}

		console.log("2️⃣ Creating user_activity table...");

		// Create user_activity table
		const { error: activityTableError } = await supabase.rpc("sql", {
			query: `
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
					ip_address INET,
					session_id TEXT,
					page_url TEXT,
					referrer TEXT,
					created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
					
					CONSTRAINT valid_activity_type CHECK (
						type IN ('login', 'logout', 'page_view', 'search', 'business_view', 'review', 'booking', 'profile_update', 'security_change', 'error')
					)
				);
			`,
		});

		if (activityTableError) {
			console.error("❌ Error creating user_activity:", activityTableError);
		} else {
			console.log("✅ user_activity table created");
		}

		console.log("3️⃣ Creating user_profiles table...");

		// Create user_profiles table if it doesn't exist
		const { error: profilesTableError } = await supabase.rpc("sql", {
			query: `
				CREATE TABLE IF NOT EXISTS user_profiles (
					id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
					email TEXT NOT NULL,
					name TEXT,
					first_name TEXT,
					last_name TEXT,
					avatar_url TEXT,
					bio TEXT,
					location TEXT,
					website TEXT,
					phone TEXT,
					email_verified BOOLEAN DEFAULT false,
					phone_verified BOOLEAN DEFAULT false,
					role TEXT DEFAULT 'user' CHECK (role IN ('user', 'business_owner', 'admin', 'moderator')),
					permissions JSONB DEFAULT '[]',
					preferences JSONB DEFAULT '{}',
					privacy_settings JSONB DEFAULT '{}',
					last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
					created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
					updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
				);
			`,
		});

		if (profilesTableError) {
			console.error("❌ Error creating user_profiles:", profilesTableError);
		} else {
			console.log("✅ user_profiles table created");
		}

		console.log("4️⃣ Creating indexes...");

		// Create indexes for performance
		const indexes = ["CREATE INDEX IF NOT EXISTS idx_user_security_metrics_user_id ON user_security_metrics(user_id);", "CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);", "CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);", "CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);", "CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);"];

		for (const indexQuery of indexes) {
			const { error: indexError } = await supabase.rpc("sql", { query: indexQuery });
			if (indexError) {
				console.warn("⚠️ Index creation warning:", indexError.message);
			}
		}

		console.log("✅ Indexes created");

		console.log("5️⃣ Setting up RLS policies...");

		// Enable RLS
		const rlsQueries = [
			"ALTER TABLE user_security_metrics ENABLE ROW LEVEL SECURITY;",
			"ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;",
			"ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;",
			// Policies for user_security_metrics
			`CREATE POLICY "Users can view their own security metrics" ON user_security_metrics
				FOR SELECT USING (auth.uid() = user_id);`,
			`CREATE POLICY "Users can update their own security metrics" ON user_security_metrics
				FOR UPDATE USING (auth.uid() = user_id);`,
			// Policies for user_activity
			`CREATE POLICY "Users can view their own activity" ON user_activity
				FOR SELECT USING (auth.uid() = user_id);`,
			`CREATE POLICY "Users can insert their own activity" ON user_activity
				FOR INSERT WITH CHECK (auth.uid() = user_id);`,
			// Policies for user_profiles
			`CREATE POLICY "Users can view their own profile" ON user_profiles
				FOR SELECT USING (auth.uid() = id);`,
			`CREATE POLICY "Users can update their own profile" ON user_profiles
				FOR UPDATE USING (auth.uid() = id);`,
			`CREATE POLICY "Users can insert their own profile" ON user_profiles
				FOR INSERT WITH CHECK (auth.uid() = id);`,
		];

		for (const rlsQuery of rlsQueries) {
			const { error: rlsError } = await supabase.rpc("sql", { query: rlsQuery });
			if (rlsError && !rlsError.message.includes("already exists")) {
				console.warn("⚠️ RLS policy warning:", rlsError.message);
			}
		}

		console.log("✅ RLS policies set up");

		console.log("6️⃣ Testing tables...");

		// Test the tables
		const { data: securityTest, error: securityError } = await supabase.from("user_security_metrics").select("count", { count: "exact", head: true });

		const { data: activityTest, error: activityError } = await supabase.from("user_activity").select("count", { count: "exact", head: true });

		const { data: profilesTest, error: profilesError } = await supabase.from("user_profiles").select("count", { count: "exact", head: true });

		if (!securityError && !activityError && !profilesError) {
			console.log("🔍 All tables verified successfully!");
			console.log("🎉 Supabase tables fixed - 406/404 errors should be resolved");
		} else {
			console.error("❌ Table verification failed:");
			if (securityError) console.error("- user_security_metrics:", securityError.message);
			if (activityError) console.error("- user_activity:", activityError.message);
			if (profilesError) console.error("- user_profiles:", profilesError.message);
		}
	} catch (error) {
		console.error("❌ Script failed:", error);
		process.exit(1);
	}
}

fixSupabaseTables();
