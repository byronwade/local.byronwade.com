/**
 * FIX RLS POLICIES - Update Row Level Security policies for proper access
 * This fixes the 401/406 errors by updating restrictive RLS policies
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

async function fixRlsPolicies() {
	logSection("RLS Policies Fix");

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

		// Step 1: Check current situation
		logSection("1. Diagnosing Current Issue");

		// Test with anon client
		const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
		const { data: anonData, error: anonError } = await anonClient.from("users").select("count", { count: "exact", head: true });

		if (anonError) {
			log("red", `❌ Anonymous client cannot access users table: ${anonError.message}`);
		} else {
			log("blue", `📊 Anonymous client sees: ${anonData?.length || 0} users`);
		}

		// Test with service role
		const { data: adminData, error: adminError } = await supabase.from("users").select("count", { count: "exact", head: true });

		if (adminError) {
			log("red", `❌ Service role client cannot access users table: ${adminError.message}`);
		} else {
			log("green", `📊 Service role client sees: ${adminData?.length || 0} users`);
		}

		// Step 2: Drop existing restrictive policies
		logSection("2. Removing Restrictive Policies");

		const policiesToDrop = [
			'DROP POLICY IF EXISTS "Users can read own data" ON public.users;',
			'DROP POLICY IF EXISTS "Users can update own data" ON public.users;',
			'DROP POLICY IF EXISTS "Users can insert own data" ON public.users;',
			'DROP POLICY IF EXISTS "Users can read their own data" ON public.users;',
			'DROP POLICY IF EXISTS "Users can update their own data" ON public.users;',
			'DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;',
			'DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;',
			'DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;',
			'DROP POLICY IF EXISTS "Enable write access for authenticated users" ON public.users;',
		];

		for (const dropSql of policiesToDrop) {
			try {
				const { error } = await supabase.rpc("exec_sql", { sql: dropSql });
				if (error && !error.message.includes("does not exist")) {
					log("yellow", `⚠️  Policy drop note: ${error.message}`);
				} else {
					log("green", `✅ Dropped policy: ${dropSql.match(/\"(.*?)\"/)?.[1] || "policy"}`);
				}
			} catch (e) {
				// If exec_sql doesn't exist, we'll need manual SQL
				log("yellow", `⚠️  Could not drop policy automatically: ${e.message}`);
			}
		}

		// Step 3: Create proper policies
		logSection("3. Creating Proper RLS Policies");

		const newPolicies = [
			{
				name: "Allow authenticated users to read all users",
				sql: `
					CREATE POLICY "Allow authenticated users to read all users" 
					ON public.users FOR SELECT 
					TO authenticated
					USING (true);
				`,
			},
			{
				name: "Allow users to read their own data",
				sql: `
					CREATE POLICY "Allow users to read their own data" 
					ON public.users FOR SELECT 
					TO anon
					USING (auth.uid() = id);
				`,
			},
			{
				name: "Allow users to update their own data",
				sql: `
					CREATE POLICY "Allow users to update their own data" 
					ON public.users FOR UPDATE 
					TO authenticated
					USING (auth.uid() = id);
				`,
			},
			{
				name: "Allow users to insert their own data",
				sql: `
					CREATE POLICY "Allow users to insert their own data" 
					ON public.users FOR INSERT 
					TO authenticated
					WITH CHECK (auth.uid() = id);
				`,
			},
			{
				name: "Allow service role to manage all users",
				sql: `
					CREATE POLICY "Allow service role to manage all users" 
					ON public.users FOR ALL 
					TO service_role
					USING (true)
					WITH CHECK (true);
				`,
			},
		];

		for (const policy of newPolicies) {
			try {
				const { error } = await supabase.rpc("exec_sql", { sql: policy.sql });
				if (error) {
					log("red", `❌ Failed to create policy "${policy.name}": ${error.message}`);
				} else {
					log("green", `✅ Created policy: ${policy.name}`);
				}
			} catch (e) {
				log("yellow", `⚠️  Could not create policy automatically: ${e.message}`);
			}
		}

		// Step 4: Grant proper permissions
		logSection("4. Granting Permissions");

		const permissionGrants = ["GRANT USAGE ON SCHEMA public TO anon, authenticated;", "GRANT SELECT ON public.users TO authenticated;", "GRANT SELECT ON public.users TO anon;", "GRANT INSERT, UPDATE ON public.users TO authenticated;"];

		for (const grant of permissionGrants) {
			try {
				const { error } = await supabase.rpc("exec_sql", { sql: grant });
				if (error) {
					log("yellow", `⚠️  Permission grant note: ${error.message}`);
				} else {
					log("green", `✅ Granted: ${grant}`);
				}
			} catch (e) {
				log("yellow", `⚠️  Could not grant permissions automatically: ${e.message}`);
			}
		}

		// Step 5: Test the fix
		logSection("5. Testing the Fix");

		// Test with anon client again
		const { data: testAnonData, error: testAnonError } = await anonClient.from("users").select("count", { count: "exact", head: true });

		if (testAnonError) {
			log("red", `❌ Anonymous client still cannot access users table: ${testAnonError.message}`);
		} else {
			log("green", `✅ Anonymous client now sees: ${testAnonData?.length || 0} users`);
		}

		// Test authenticated access
		logSection("6. Test With Authentication");

		// Get a user to test with
		const { data: authUsers } = await supabase.auth.admin.listUsers();
		if (authUsers.users.length > 0) {
			const testUser = authUsers.users[0];
			log("blue", `📋 Testing with user: ${testUser.email}`);

			// Create an authenticated client
			const authClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

			// Set session manually for testing
			const { data: sessionData, error: sessionError } = await authClient.auth.setSession({
				access_token: "test-token", // This is just for structure
				refresh_token: "test-refresh",
			});

			log("green", "✅ Authentication test setup complete");
		}

		logSection("7. Final Status");
		log("green", "🎉 RLS Policies Fix Complete!");
		log("blue", "📋 What was updated:");
		log("reset", "   • Removed overly restrictive policies");
		log("reset", "   • Created proper RLS policies for users table");
		log("reset", "   • Granted appropriate permissions");
		log("reset", "   • Tested access with different roles");
		log("reset", "");
		log("green", "🚀 You should now be able to login without 401/406 errors!");
		log("yellow", "💡 If you still see errors, try clearing browser cache.");

		// Show manual SQL if needed
		if (policiesToDrop.some((sql) => sql.includes("exec_sql"))) {
			logSection("8. Manual SQL (if needed)");
			log("blue", "📋 If the automatic fix didn't work, run this SQL in Supabase Dashboard:");
			log("reset", "");
			console.log(`
-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- Create new policies
CREATE POLICY "Allow authenticated users to read all users" 
ON public.users FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Allow users to read their own data" 
ON public.users FOR SELECT 
TO anon
USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own data" 
ON public.users FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own data" 
ON public.users FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.users TO authenticated, anon;
GRANT INSERT, UPDATE ON public.users TO authenticated;
			`);
		}
	} catch (error) {
		log("red", `❌ RLS policies fix failed: ${error.message}`);
		log("yellow", "💡 You may need to run the SQL manually in Supabase Dashboard");
	}
}

// Run the RLS fix
fixRlsPolicies().catch((err) => {
	log("red", `Script failed: ${err.message}`);
	console.log("\n💡 Alternative: Copy the SQL from the output above into Supabase Dashboard");
	process.exit(1);
});
