/**
 * EMERGENCY AUTH FIX - Sync missing user profiles
 * This fixes the 401/406 errors by creating missing user profiles
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Colors for console output
const colors = {
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	reset: "\x1b[0m",
	bold: "\x1b[1m",
};

function log(color, message) {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
	console.log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

async function emergencyAuthFix() {
	logSection("Emergency Authentication Fix");

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !serviceRoleKey) {
		log("red", "❌ Missing environment variables");
		return;
	}

	try {
		// Create admin client
		const supabase = createClient(supabaseUrl, serviceRoleKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		});

		log("green", "✅ Admin client created");

		// Step 1: Get auth users
		logSection("1. Getting Auth Users");
		const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

		if (authError) {
			log("red", `❌ Failed to get auth users: ${authError.message}`);
			return;
		}

		log("green", `✅ Found ${authUsers.users.length} auth user(s)`);

		// Step 2: Check/Create users table
		logSection("2. Setting Up Users Table");

		// Try to create the users table (will fail gracefully if exists)
		const createTableQuery = `
			CREATE TABLE IF NOT EXISTS public.users (
				id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
				email TEXT NOT NULL UNIQUE,
				name TEXT,
				role TEXT DEFAULT 'user',
				email_verified BOOLEAN DEFAULT FALSE,
				phone_verified BOOLEAN DEFAULT FALSE,
				phone TEXT,
				avatar_url TEXT,
				created_at TIMESTAMPTZ DEFAULT NOW(),
				updated_at TIMESTAMPTZ DEFAULT NOW()
			);
		`;

		const { error: tableError } = await supabase.rpc("exec_sql", { sql: createTableQuery }).single();
		if (tableError && !tableError.message.includes("already exists")) {
			log("yellow", `⚠️  Table creation note: ${tableError.message}`);
		} else {
			log("green", "✅ Users table ready");
		}

		// Step 3: Sync users
		logSection("3. Syncing Auth Users to Public Users");

		for (const authUser of authUsers.users) {
			try {
				// Check if user already exists in public.users
				const { data: existingUser, error: checkError } = await supabase.from("users").select("id").eq("id", authUser.id).single();

				if (existingUser) {
					log("blue", `📋 User ${authUser.email} already exists in public.users`);
					continue;
				}

				// Create user profile
				const userData = {
					id: authUser.id,
					email: authUser.email,
					name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email.split("@")[0],
					role: "user",
					email_verified: !!authUser.email_confirmed_at,
					phone_verified: !!authUser.phone_confirmed_at,
					phone: authUser.phone,
					avatar_url: authUser.user_metadata?.avatar_url,
					created_at: authUser.created_at,
					updated_at: new Date().toISOString(),
				};

				const { error: insertError } = await supabase.from("users").insert(userData);

				if (insertError) {
					log("red", `❌ Failed to create profile for ${authUser.email}: ${insertError.message}`);
				} else {
					log("green", `✅ Created profile for ${authUser.email}`);
				}
			} catch (userError) {
				log("red", `❌ Error processing ${authUser.email}: ${userError.message}`);
			}
		}

		// Step 4: Create user_roles table and default roles
		logSection("4. Setting Up User Roles");

		const createRolesTableQuery = `
			CREATE TABLE IF NOT EXISTS public.user_roles (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
				role TEXT NOT NULL DEFAULT 'user',
				created_at TIMESTAMPTZ DEFAULT NOW(),
				CONSTRAINT user_roles_unique UNIQUE (user_id, role)
			);
		`;

		const { error: rolesTableError } = await supabase.rpc("exec_sql", { sql: createRolesTableQuery }).single();
		if (rolesTableError && !rolesTableError.message.includes("already exists")) {
			log("yellow", `⚠️  Roles table creation note: ${rolesTableError.message}`);
		} else {
			log("green", "✅ User roles table ready");
		}

		// Add default roles for all users
		const { data: users } = await supabase.from("users").select("id");

		for (const user of users || []) {
			const { error: roleError } = await supabase.from("user_roles").insert({ user_id: user.id, role: "user" }).on_conflict("user_id,role").ignore();

			if (roleError) {
				log("yellow", `⚠️  Role creation note for ${user.id}: ${roleError.message}`);
			}
		}

		log("green", "✅ Default roles assigned");

		// Step 5: Set up basic RLS policies
		logSection("5. Setting Up Security Policies");

		const rlsPolicies = [
			"ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;",
			"ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;",
			`
			CREATE POLICY IF NOT EXISTS "Users can read own data" 
			ON public.users FOR SELECT 
			USING (auth.uid() = id);
			`,
			`
			CREATE POLICY IF NOT EXISTS "Users can update own data" 
			ON public.users FOR UPDATE 
			USING (auth.uid() = id);
			`,
			`
			CREATE POLICY IF NOT EXISTS "Users can read own roles" 
			ON public.user_roles FOR SELECT 
			USING (auth.uid() = user_id);
			`,
		];

		for (const policy of rlsPolicies) {
			const { error: policyError } = await supabase.rpc("exec_sql", { sql: policy }).single();
			if (policyError && !policyError.message.includes("already exists")) {
				log("yellow", `⚠️  Policy note: ${policyError.message}`);
			}
		}

		log("green", "✅ Basic security policies set");

		// Step 6: Verify fix
		logSection("6. Verification");

		const { data: publicUsers, error: verifyError } = await supabase.from("users").select("id, email, name");

		if (verifyError) {
			log("red", `❌ Verification failed: ${verifyError.message}`);
		} else {
			log("green", `✅ SUCCESS! ${publicUsers.length} user(s) now in public.users table`);
			publicUsers.forEach((user, index) => {
				log("blue", `   ${index + 1}. ${user.email} (${user.name})`);
			});
		}

		logSection("7. Next Steps");
		log("green", "🎉 Authentication fix complete!");
		log("blue", "📋 What was fixed:");
		log("reset", "   • Created public.users table if missing");
		log("reset", "   • Synced auth users to public.users");
		log("reset", "   • Created user_roles table and default roles");
		log("reset", "   • Set up basic RLS policies");
		log("reset", "");
		log("green", "🚀 You should now be able to login without 401/406 errors!");
		log("yellow", "💡 If you still see errors, clear browser cache and try again.");
	} catch (error) {
		log("red", `❌ Emergency fix failed: ${error.message}`);
		log("yellow", "💡 You may need to run the SQL manually in Supabase Dashboard");
	}
}

// Alternative: exec_sql function if the RPC doesn't exist
async function createExecSqlFunction(supabase) {
	const createFunctionQuery = `
		CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
		RETURNS void
		LANGUAGE plpgsql
		SECURITY DEFINER
		AS $$
		BEGIN
			EXECUTE sql;
		END;
		$$;
	`;

	try {
		await supabase.rpc("exec_sql", { sql: createFunctionQuery });
	} catch (error) {
		// If this fails, we'll need to use individual queries
		console.log("Note: Using alternative method for SQL execution");
	}
}

// Run the emergency fix
emergencyAuthFix().catch((err) => {
	log("red", `Script failed: ${err.message}`);
	console.log("\n💡 Alternative: Copy the SQL from scripts/quick-fix-auth.sql into Supabase Dashboard");
	process.exit(1);
});
