#!/usr/bin/env node

/**
 * Debug Current Authentication Issues
 *
 * This script will:
 * 1. Check current table structure
 * 2. Test user creation
 * 3. Validate RLS policies
 * 4. Fix specific issues found in logs
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error("❌ Missing Supabase environment variables");
	console.error("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

async function debugAuthIssues() {
	console.log("🔍 Debugging Current Authentication Issues...\n");

	try {
		// 1. Check table structure
		console.log("1. Checking table structure...");
		const { data: columns, error: columnsError } = await supabase.from("INFORMATION_SCHEMA.COLUMNS").select("column_name, data_type, is_nullable").eq("table_name", "users").eq("table_schema", "public");

		if (columnsError) {
			console.error("❌ Error fetching table structure:", columnsError);
			return;
		}

		console.log("✅ Current public.users table structure:");
		columns?.forEach((col) => {
			console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
		});

		// Check if business_id column exists
		const hasBusinessId = columns?.some((col) => col.column_name === "business_id");
		console.log(`\n${hasBusinessId ? "✅" : "❌"} business_id column exists: ${hasBusinessId}`);

		// 2. Check RLS policies
		console.log("\n2. Checking RLS policies...");
		const { data: policies, error: policiesError } = await supabase.rpc("pg_policies").select("*").eq("tablename", "users");

		if (policiesError) {
			console.log("⚠️  Could not fetch policies (might not have pg_policies function)");
		} else {
			console.log("✅ Current RLS policies:");
			policies?.forEach((policy) => {
				console.log(`   - ${policy.policyname}: ${policy.cmd} (${policy.permissive})`);
			});
		}

		// 3. Test user query access
		console.log("\n3. Testing user table access...");

		// Test SELECT
		const { data: users, error: selectError } = await supabase.from("users").select("id, email, name, business_id").limit(1);

		if (selectError) {
			console.error("❌ SELECT error:", selectError);
		} else {
			console.log("✅ SELECT works, sample user:", users?.[0] || "No users found");
		}

		// 4. Test INSERT with minimal data
		console.log("\n4. Testing INSERT operation...");
		const testUserId = "test-" + Date.now();
		const { data: insertData, error: insertError } = await supabase
			.from("users")
			.insert({
				id: testUserId,
				email: `test-${Date.now()}@example.com`,
				name: "Test User",
				role: "user",
			})
			.select();

		if (insertError) {
			console.error("❌ INSERT error:", insertError);
			console.log('This explains the "new row violates row-level security policy" error');
		} else {
			console.log("✅ INSERT works:", insertData);

			// Clean up test user
			await supabase.from("users").delete().eq("id", testUserId);
			console.log("✅ Test user cleaned up");
		}

		// 5. Check auth.users sync
		console.log("\n5. Checking auth.users vs public.users sync...");
		const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
		const { data: publicUsers, error: publicError } = await supabase.from("users").select("id, email");

		if (authError) {
			console.error("❌ Error fetching auth users:", authError);
		} else if (publicError) {
			console.error("❌ Error fetching public users:", publicError);
		} else {
			const authUserIds = new Set(authUsers.users.map((u) => u.id));
			const publicUserIds = new Set(publicUsers.map((u) => u.id));

			const missingInPublic = authUsers.users.filter((u) => !publicUserIds.has(u.id));
			const missingInAuth = publicUsers.filter((u) => !authUserIds.has(u.id));

			console.log(`✅ Auth users: ${authUsers.users.length}`);
			console.log(`✅ Public users: ${publicUsers.length}`);
			console.log(`${missingInPublic.length > 0 ? "⚠️" : "✅"} Missing in public.users: ${missingInPublic.length}`);
			console.log(`${missingInAuth.length > 0 ? "⚠️" : "✅"} Missing in auth.users: ${missingInAuth.length}`);

			if (missingInPublic.length > 0) {
				console.log(
					"   Missing users:",
					missingInPublic.map((u) => u.email)
				);
			}
		}

		// 6. Provide fixes based on findings
		console.log("\n🔧 RECOMMENDED FIXES:");

		if (!hasBusinessId) {
			console.log("1. Add business_id column to public.users table");
		}

		if (insertError) {
			console.log("2. Fix RLS policies to allow INSERT operations");
		}

		console.log("3. Run the complete-auth-schema-fix.sql script in Supabase dashboard");
		console.log("4. Clear browser cache and try again");
	} catch (error) {
		console.error("❌ Debug failed:", error);
	}
}

// Run the debug
debugAuthIssues()
	.then(() => {
		console.log("\n✅ Debug complete!");
		process.exit(0);
	})
	.catch((error) => {
		console.error("❌ Debug script failed:", error);
		process.exit(1);
	});
