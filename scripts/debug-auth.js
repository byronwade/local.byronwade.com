#!/usr/bin/env node

/**
 * Authentication Debug Script
 * Run this to diagnose Supabase authentication issues
 *
 * Usage: node scripts/debug-auth.js
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

async function debugAuthentication() {
	logSection("Supabase Authentication Debug");

	// Step 1: Check environment variables
	logSection("1. Environment Variables");

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl) {
		log("red", "❌ NEXT_PUBLIC_SUPABASE_URL is missing");
		return;
	} else {
		log("green", `✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);
	}

	if (!supabaseAnonKey) {
		log("red", "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
		return;
	} else {
		log("green", `✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 20)}...`);
	}

	if (!serviceRoleKey) {
		log("yellow", "⚠️  SUPABASE_SERVICE_ROLE_KEY is missing (optional for client-side auth)");
	} else {
		log("green", `✅ SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey.substring(0, 20)}...`);
	}

	// Step 2: Test Supabase connection
	logSection("2. Supabase Connection Test");

	try {
		const supabase = createClient(supabaseUrl, supabaseAnonKey);
		log("green", "✅ Supabase client created successfully");

		// Test basic connection
		const { data, error } = await supabase.from("users").select("count", { count: "exact", head: true });

		if (error) {
			if (error.code === "PGRST116") {
				log("red", "❌ Users table does not exist");
				log("yellow", "💡 Solution: Create users table in Supabase dashboard");
			} else {
				log("red", `❌ Database connection error: ${error.message}`);
			}
		} else {
			log("green", "✅ Database connection successful");
			log("blue", `📊 Users table exists with ${data?.length || 0} users`);
		}
	} catch (err) {
		log("red", `❌ Failed to create Supabase client: ${err.message}`);
		return;
	}

	// Step 3: Test authentication endpoint
	logSection("3. Authentication Endpoint Test");

	try {
		const supabase = createClient(supabaseUrl, supabaseAnonKey);

		// Test with invalid credentials to see if auth endpoint works
		const { data, error } = await supabase.auth.signInWithPassword({
			email: "nonexistent@example.com",
			password: "wrongpassword",
		});

		if (error) {
			if (error.message === "Invalid login credentials") {
				log("green", '✅ Authentication endpoint is working (expected "Invalid credentials" error)');
				log("yellow", "💡 This means you need to create a test user account");
			} else {
				log("red", `❌ Authentication error: ${error.message}`);
			}
		} else {
			log("yellow", "⚠️  Unexpected: Login succeeded with invalid credentials");
		}
	} catch (err) {
		log("red", `❌ Authentication test failed: ${err.message}`);
	}

	// Step 4: Check for existing users
	logSection("4. User Account Check");

	if (serviceRoleKey) {
		try {
			const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
				auth: {
					autoRefreshToken: false,
					persistSession: false,
				},
			});

			const { data: users, error } = await adminSupabase.auth.admin.listUsers();

			if (error) {
				log("red", `❌ Failed to list users: ${error.message}`);
			} else {
				log("green", `✅ Found ${users.users.length} user(s) in authentication`);

				if (users.users.length === 0) {
					log("yellow", "💡 No users found - you need to create a test user");
				} else {
					users.users.forEach((user, index) => {
						log("blue", `   User ${index + 1}: ${user.email} (${user.email_confirmed_at ? "confirmed" : "unconfirmed"})`);
					});
				}
			}
		} catch (err) {
			log("red", `❌ User listing failed: ${err.message}`);
		}
	} else {
		log("yellow", "⚠️  Cannot check users - service role key not available");
	}

	// Step 5: Recommendations
	logSection("5. Recommendations");

	log("blue", "🔧 To fix authentication issues:");
	log("reset", "");
	log("reset", "1. Create a test user in Supabase Dashboard:");
	log("reset", "   - Go to Authentication > Users");
	log("reset", '   - Click "Add User"');
	log("reset", "   - Email: test@example.com");
	log("reset", "   - Password: testpassword123");
	log("reset", '   - Check "Auto Confirm User"');
	log("reset", "");
	log("reset", "2. Test login with these credentials");
	log("reset", "");
	log("reset", "3. If still failing, check RLS policies on users table");
	log("reset", "");
	log("green", "📖 Full guide available in: AUTHENTICATION_FIX_GUIDE.md");
}

// Run the debug script
debugAuthentication().catch((err) => {
	log("red", `Script failed: ${err.message}`);
	process.exit(1);
});
