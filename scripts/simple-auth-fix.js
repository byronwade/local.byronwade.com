/**
 * SIMPLE AUTH FIX - Sync missing user profiles (Direct Operations)
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

async function simpleAuthFix() {
	logSection("Simple Authentication Fix");

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

		// Step 2: Check current public users
		logSection("2. Checking Public Users Table");

		const { data: existingUsers, error: checkError } = await supabase.from("users").select("id, email");

		if (checkError) {
			log("red", `❌ Cannot access users table: ${checkError.message}`);
			log("yellow", "💡 This means you need to create the table first");
			log("blue", "📋 Please run this SQL in Supabase Dashboard:");
			log("reset", "");
			console.log(`
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

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY IF NOT EXISTS "Users can read own data" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own data" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own data" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
			`);
			log("reset", "");
			log("green", "📖 Then run this script again!");
			return;
		}

		const existingIds = new Set(existingUsers.map((u) => u.id));
		log("green", `✅ Found ${existingUsers.length} existing user(s) in public.users`);

		// Step 3: Sync missing users
		logSection("3. Syncing Missing Users");

		let syncedCount = 0;
		for (const authUser of authUsers.users) {
			if (existingIds.has(authUser.id)) {
				log("blue", `📋 User ${authUser.email} already exists`);
				continue;
			}

			try {
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

					// If it's a permission error, show helpful message
					if (insertError.message.includes("permission") || insertError.message.includes("policy")) {
						log("yellow", "💡 This is likely a permissions issue. Make sure you've set up RLS policies correctly.");
					}
				} else {
					log("green", `✅ Created profile for ${authUser.email}`);
					syncedCount++;
				}
			} catch (userError) {
				log("red", `❌ Error processing ${authUser.email}: ${userError.message}`);
			}
		}

		// Step 4: Verify fix
		logSection("4. Verification");

		const { data: finalUsers, error: verifyError } = await supabase.from("users").select("id, email, name");

		if (verifyError) {
			log("red", `❌ Verification failed: ${verifyError.message}`);
		} else {
			log("green", `✅ SUCCESS! ${finalUsers.length} user(s) now in public.users table`);
			finalUsers.forEach((user, index) => {
				log("blue", `   ${index + 1}. ${user.email} (${user.name})`);
			});
		}

		logSection("5. Results");
		log("green", `🎉 Authentication fix complete!`);
		log("blue", `📊 Summary:`);
		log("reset", `   • Auth users found: ${authUsers.users.length}`);
		log("reset", `   • Public users before: ${existingUsers.length}`);
		log("reset", `   • Users synced: ${syncedCount}`);
		log("reset", `   • Total public users now: ${finalUsers?.length || "unknown"}`);
		log("reset", "");

		if (syncedCount > 0) {
			log("green", "🚀 You should now be able to login without 401/406 errors!");
			log("yellow", "💡 Clear browser cache and try logging in again.");
		} else {
			log("yellow", "⚠️  No users were synced. Check the error messages above.");
		}
	} catch (error) {
		log("red", `❌ Simple fix failed: ${error.message}`);
		log("yellow", "💡 You may need to run the SQL manually in Supabase Dashboard");
		log("blue", "📖 Check scripts/quick-fix-auth.sql for the SQL commands");
	}
}

// Run the simple fix
simpleAuthFix().catch((err) => {
	log("red", `Script failed: ${err.message}`);
	console.log("\n💡 Alternative: Copy the SQL from scripts/quick-fix-auth.sql into Supabase Dashboard");
	process.exit(1);
});
